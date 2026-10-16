// Gera os derivados da marca Halor a partir das fontes em svg/ e tokens/:
//   tokens/tokens.json e tokens/index.ts (a partir de tokens/halor-tokens.css)
//   png/: favicons, ícones de app (192, 512, maskable), apple-touch-icon e a imagem social (og.png)
// e copia o que o site usa para apps/web/public/brand/.
// Uso: npm run brand:assets (na raiz). Precisa do Playwright com Chromium (npx playwright install chromium).
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '../..');
const PUBLIC = path.join(REPO, 'apps/web/public/brand');
const require = createRequire(import.meta.url);

/* ---------- tokens ---------- */
const css = fs.readFileSync(path.join(ROOT, 'tokens/halor-tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = {};
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const sel = m[1].trim(); const vars = {};
  for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1].slice(2)] = d[2].trim().replace(/\s+/g, ' ');
  if (Object.keys(vars).length) blocks[sel] = { ...(blocks[sel] || {}), ...vars };
}
const pick = s => Object.entries(blocks).find(([k]) => k.split(',').map(x => x.trim()).includes(s))?.[1] || {};
const core = pick(':root');
const themes = { night: pick('.theme-night'), paper: pick('.theme-paper'), lilac: pick('.theme-lilac') };
const json = { name: 'Halor', version: '1.0.0', core, themes };
fs.writeFileSync(path.join(ROOT, 'tokens/tokens.json'), JSON.stringify(json, null, 2) + '\n');
const colors = Object.fromEntries(Object.entries(core).filter(([k, v]) => k.startsWith('halor-') && /^#|^rgb/.test(v)));
fs.writeFileSync(path.join(ROOT, 'tokens/index.ts'), `/* Tokens da marca Halor. Gerado por scripts/build-assets.mjs a partir de tokens/halor-tokens.css: não edite à mão. */
export const core = ${JSON.stringify(core, null, 2)} as const;

export const themes = ${JSON.stringify(themes, null, 2)} as const;

/** Cores-núcleo da marca (variáveis --halor-*). */
export const colors = ${JSON.stringify(colors, null, 2)} as const;

export type Theme = keyof typeof themes;
export const fonts = { display: 'Sora', ui: 'Instrument Sans', mono: 'JetBrains Mono' } as const;
`);
console.log(`tokens: ${Object.keys(core).length} núcleo, temas ${Object.keys(themes).map(k => k + ' ' + Object.keys(themes[k]).length).join(', ')}`);

/* ---------- PNG ---------- */
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }
const browser = await chromium.launch();
const svg = f => fs.readFileSync(path.join(ROOT, 'svg', f), 'utf8');
/* fontes embutidas em base64: a página de render não tem origem para ler file:// */
const font = (f, fam, w) => `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${fs.readFileSync(path.join(REPO, 'apps/web/app/fonts', f)).toString('base64')}) format('woff2');font-weight:${w}}`;
const FONTS = font('sora-latin-wght-normal.woff2', 'Sora', '100 800') + font('instrument-sans-latin-400-normal.woff2', 'Instrument Sans', 400) + font('jetbrains-mono-latin-500-normal.woff2', 'JetBrains Mono', 500);

async function render(html, w, h, out, transparent = false) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(`<!doctype html><html><head><style>${FONTS}html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${transparent ? 'transparent' : '#07040f'}}</style></head><body>${html}</body></html>`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(ROOT, 'png', out), omitBackground: transparent });
  await p.close();
  console.log('png/' + out);
}
/* troca o tamanho do <svg> raiz (remove width/height originais antes de aplicar os novos) */
const sized = (s, w, h = w) => s.replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(width|height)="[^"]*"/g, '')} width="${w}" height="${h}" style="display:block">`);
const fill = (s, size) => sized(s, size);

const fav = svg('halor-favicon.svg'), app = svg('halor-app-icon.svg');
for (const s of [16, 32, 48]) await render(fill(fav, s), s, s, `favicon-${s}.png`, true);
await render(fill(app, 180), 180, 180, 'apple-touch-icon.png');
for (const s of [192, 512]) await render(fill(app, s), s, s, `icon-${s}.png`, true);
/* maskable: símbolo dentro da zona segura (80%) sobre o Vazio */
await render(`<div style="width:512px;height:512px;display:grid;place-items:center;background:radial-gradient(60% 60% at 50% 45%,rgba(139,61,255,.45),transparent 70%),#07040f">${sized(svg('halor-mark-night.svg'), 300)}</div>`, 512, 512, 'icon-maskable-512.png');

/* imagem social 1200x630: Campo Halor, logo e a promessa */
const rnd = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
const pts = Array.from({ length: 90 }, () => [rnd() * 1200, rnd() * 630, .8 + rnd() * 2]);
const lines = [];
for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (d < 120) lines.push(`<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="rgba(169,112,255,${(.5 * (1 - d / 120)).toFixed(2)})" stroke-width="1"/>`); }
const field = `<svg width="1200" height="630" style="position:absolute;inset:0">${lines.join('')}${pts.map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${r > 2.4 ? '#fff' : 'rgba(201,166,255,.85)'}"/>`).join('')}</svg>`;
await render(`<div style="position:relative;width:1200px;height:630px;background:radial-gradient(55% 60% at 50% 48%,rgba(139,61,255,.42),rgba(139,61,255,.08) 55%,transparent 78%),#07040f;font-family:Sora">
  ${field}
  <div style="position:absolute;inset:0;background:radial-gradient(40% 46% at 50% 50%,rgba(7,4,15,.92),rgba(7,4,15,.55) 60%,transparent 85%)"></div>
  <div style="position:absolute;inset:0;display:grid;place-content:center;justify-items:center;text-align:center;gap:22px">
    ${sized(svg('halor-logo-night.svg'), 230, 75)}
    <div style="font-weight:700;font-size:92px;line-height:1;letter-spacing:-.04em;color:#f4eeff">Faça cada olhar <span style="color:#fff;text-shadow:0 0 34px rgba(169,112,255,.9)">render.</span></div>
    <div style="font-family:'Instrument Sans';font-size:30px;color:#c9bde6">Apresentações vivas, que prendem o olhar do começo ao fim.</div>
  </div>
</div>`, 1200, 630, 'og.png');
await browser.close();

/* ---------- cópia para o site ---------- */
fs.mkdirSync(PUBLIC, { recursive: true });
fs.copyFileSync(path.join(ROOT, 'svg/halor-favicon.svg'), path.join(PUBLIC, 'favicon.svg'));
for (const f of ['favicon-16.png', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'og.png']) fs.copyFileSync(path.join(ROOT, 'png', f), path.join(PUBLIC, f));
for (const f of fs.readdirSync(path.join(ROOT, 'svg'))) fs.copyFileSync(path.join(ROOT, 'svg', f), path.join(PUBLIC, f));
console.log('copiado para apps/web/public/brand/');
