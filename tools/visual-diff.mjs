// Compara uma rota do protótipo (prototype/index.html#rota) com a mesma rota no app Next.
// Uso: node tools/visual-diff.mjs --base http://127.0.0.1:4401 --routes site,entrar --widths 1440,390 --out /caminho [--full] [--scroll seletor]
// Gera <out>/<rota>-<largura>-{proto,next,diff}.png e imprime a diferença de pixels em %.
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const has = k => process.argv.includes('--' + k);
const base = arg('base', 'http://localhost:3000'), out = arg('out', '/tmp/visual-diff');
const routes = arg('routes', 'site').split(','), widths = arg('widths', '1440').split(',').map(Number);
const scrollSel = arg('scroll', null), full = has('full'), motion = has('motion');
const PROTO = 'file://' + path.resolve(path.dirname(new URL(import.meta.url).pathname), '../prototype/index.html');
fs.mkdirSync(out, { recursive: true });
const bp = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } }), bn = await chromium.launch();
const shot = async (browser, url, w, file) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, ignoreHTTPSErrors: true, reducedMotion: motion ? 'no-preference' : 'reduce' });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(url, { waitUntil: 'networkidle' });
  /* espera a hidratação (o app marca html[data-hydrated]) e os motores ligarem, antes de esconder
     a barra do protótipo e os canvas (sem mexer em nós do React) */
  if (!url.startsWith('file:')) await p.waitForSelector('html[data-hydrated]', { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(900);
  await p.addStyleTag({ content: '.proto{display:none!important}canvas{visibility:hidden!important}' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  if (scrollSel) await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'start' }), scrollSel);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: file, fullPage: full });
  const info = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, ovf: document.documentElement.scrollWidth - innerWidth }));
  await ctx.close();
  return { ...info, errs };
};
for (const r of routes) for (const w of widths) {
  const f = k => path.join(out, `${r}-${w}-${k}.png`);
  const a = await shot(bp, `${PROTO}#${r}`, w, f('proto'));
  const b = await shot(bn, `${base}/${r === 'site' ? '' : r + '/'}`, w, f('next'));
  const { execFileSync } = await import('child_process');
  let pct = '?';
  try { pct = execFileSync('python3', ['-c', `
import sys
from PIL import Image, ImageChops
a=Image.open(sys.argv[1]).convert('RGB'); b=Image.open(sys.argv[2]).convert('RGB')
W=max(a.width,b.width); H=max(a.height,b.height)
A=Image.new('RGB',(W,H),(255,0,255)); A.paste(a,(0,0)); B=Image.new('RGB',(W,H),(255,0,255)); B.paste(b,(0,0))
d=ImageChops.difference(A,B).convert('L').point(lambda v: 255 if v>24 else 0)
n=sum(1 for v in d.getdata() if v); print(round(100*n/(W*H),2))
m=Image.blend(A,B,.5); m.paste((255,0,80),(0,0),d); m.save(sys.argv[3])
`, f('proto'), f('next'), f('diff')]).toString().trim(); } catch (e) { pct = 'erro ' + e.message; }
  console.log(`${r} @${w}: diff ${pct}% | proto h=${a.h} next h=${b.h} | ovf next=${b.ovf} | erros next: ${b.errs.length ? JSON.stringify(b.errs.slice(0, 4)) : 'nenhum'}`);
}
await bp.close(); await bn.close();
