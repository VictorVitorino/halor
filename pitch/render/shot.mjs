import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const [,, url, out, ...times] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto(url + (url.includes('?') ? '&' : '?') + 'render=1', { waitUntil: 'load' });
await p.evaluate(() => window.HALOR_PITCH.ready);
const shots = [];
for (const t of times) {
  const t1 = Date.now();
  await p.evaluate(t => window.HALOR_PITCH.seek(+t), t);
  const buf = await p.screenshot({ type: 'jpeg', quality: 85 });
  shots.push({ t, buf, ms: Date.now() - t1 });
}
const fs = await import('fs'); const path = await import('path');
fs.mkdirSync(out, { recursive: true });
shots.forEach(s => fs.writeFileSync(path.join(out, `t${String(s.t).padStart(6, '0')}.jpg`), s.buf));
console.log(shots.map(s => `${s.t}:${s.ms}ms`).join(' '));
await b.close();
