#!/opt/node22/bin/node
/**
 * render.mjs · harness de renderização do Pitch Halor
 * ======================================================
 *
 * Transforma o pitch (HTML determinístico guiado por `--t`, ver specs/contract.md) em um
 * MP4 1080p30 quadro a quadro, sem depender de tempo real: para cada quadro o script chama
 * `window.HALOR_PITCH.seek(t)`, tira uma captura JPEG e empurra o quadro para o stdin do
 * ffmpeg (libx264). Opcionalmente faz o mux da narração e gera uma folha de contato.
 *
 * USO
 *
 *   /opt/node22/bin/node pitch/render/render.mjs --in pitch/index.html --out pitch/out/halor-pitch.mp4 \
 *       [--fps 30] [--w 1920] [--h 1080] [--from 0] [--to 127000] \
 *       [--audio pitch/audio/narration.mp3] [--workers 3] [--crf 19] [--jpeg 92] [--preset medium]
 *
 *   Folha de contato (em vez do vídeo; um quadro a cada --every ms, grade de 4 colunas × 480 px):
 *
 *   /opt/node22/bin/node pitch/render/render.mjs --in pitch/index.html --sheet pitch/out/sheet.png --every 2000
 *
 * OPÇÕES
 *
 *   --in <html>        página do pitch (obrigatório). Aberta como file://…?render=1&fps=<fps>&t=<início>
 *   --out <mp4>        vídeo de saída (obrigatório no modo vídeo)
 *   --fps <n>          quadros por segundo (padrão 30)
 *   --w, --h           tamanho da janela/vídeo em px (padrão 1920 × 1080; o palco escala para caber)
 *   --from, --to <ms>  intervalo do filme a renderizar (padrão 0 … HALOR_PITCH.duration)
 *   --audio <mp3|wav>  narração; é cortada/ajustada ao intervalo (--from) e muxada em AAC 192 kb/s
 *   --workers <n>      fatias contíguas renderizadas em paralelo, um navegador por fatia (padrão 1)
 *   --crf <n>          qualidade do x264 (padrão 19; menor = melhor/maior)
 *   --jpeg <n>         qualidade da captura JPEG 1–100 (padrão 92)
 *   --preset <p>       preset do x264 (padrão medium)
 *   --sheet <png>      gera a folha de contato em vez do vídeo
 *   --every <ms>       espaçamento entre quadros da folha (padrão 2000)
 *   --cols <n>         colunas da folha (padrão 4) · --cell <px> largura da célula (padrão 480)
 *   --keep             mantém a pasta temporária com os segmentos
 *   --strict           erro de página (pageerror / console.error) faz o render falhar (código 2)
 *   --timeout <ms>     tempo máximo para a página ficar pronta (padrão 60000)
 *   --quiet            sem barra de progresso
 *
 * DETERMINISMO
 *
 *   O motor pode avançar o campo de partículas com passo fixo a cada quadro. Por isso cada
 *   fatia abre a página já em `?t=<início da fatia>` (o motor avança o campo até ali ao carregar)
 *   e pede os quadros SEMPRE em ordem crescente, sem pular. Na folha de contato o script também
 *   percorre todos os quadros intermediários (só captura nos tempos amostrados), para que a
 *   folha mostre exatamente os mesmos quadros do vídeo.
 *
 * SAÍDA
 *
 *   Código 0 em sucesso; 1 em erro de uso/ffmpeg/navegador; 2 se --strict e a página reportou erro.
 *   Erros da página (pageerror e console.error) são sempre impressos, prefixados por [página N].
 *
 * Sem dependências além do Playwright já instalado em /opt/node-tools (Chromium em /opt/pw-browsers).
 */

import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
const require = createRequire(import.meta.url);

const FFMPEG = process.env.FFMPEG || '/usr/bin/ffmpeg';
const PW_PATH = process.env.PLAYWRIGHT_PATH || '/opt/node-tools/node_modules/playwright';

// ---------------------------------------------------------------------------------------------
// utilidades
// ---------------------------------------------------------------------------------------------

const log = (...a) => console.log(...a);
const warn = (...a) => console.error(...a);

class UsageError extends Error {}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    let a = argv[i];
    if (!a.startsWith('--')) throw new UsageError(`argumento inesperado: ${a}`);
    a = a.slice(2);
    let v;
    const eq = a.indexOf('=');
    if (eq >= 0) { v = a.slice(eq + 1); a = a.slice(0, eq); }
    else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) v = argv[++i];
    else v = true;
    o[a] = v;
  }
  return o;
}

function num(o, k, def, { min = -Infinity, max = Infinity, int = false } = {}) {
  if (o[k] === undefined || o[k] === true) return def;
  const v = Number(o[k]);
  if (!Number.isFinite(v)) throw new UsageError(`--${k} precisa ser numérico (recebi "${o[k]}")`);
  if (int && !Number.isInteger(v)) throw new UsageError(`--${k} precisa ser inteiro`);
  if (v < min || v > max) throw new UsageError(`--${k} fora do intervalo [${min}, ${max}]`);
  return v;
}

const pad2 = n => String(n).padStart(2, '0');
/** 12345 → "00:12.3" */
export function fmtT(ms) {
  const s = Math.max(0, ms) / 1000;
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  const whole = Math.floor(r);
  const tenth = Math.floor((r - whole) * 10 + 1e-9);
  return `${pad2(m)}:${pad2(whole)}.${tenth}`;
}
const fmtClock = sec => {
  if (!Number.isFinite(sec)) return '--:--';
  sec = Math.max(0, Math.round(sec));
  return `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}`;
};

/** Número de quadros em [from, to) a `fps`: 4000 ms @ 30 → 120. */
export function frameCount(from, to, fps) {
  return Math.max(1, Math.ceil((to - from) * fps / 1000 - 1e-6));
}
export const frameTime = (from, i, fps) => from + i * 1000 / fps;

/** Divide N quadros em `n` fatias contíguas [i0, i1). */
export function slices(N, n) {
  n = Math.max(1, Math.min(n, N));
  const out = [];
  for (let k = 0; k < n; k++) {
    const i0 = Math.floor(N * k / n), i1 = Math.floor(N * (k + 1) / n);
    if (i1 > i0) out.push([i0, i1]);
  }
  return out;
}

/** Índices (relativos a `from`) dos quadros amostrados a cada `every` ms. */
export function sampleFrames(from, to, fps, every) {
  const N = frameCount(from, to, fps);
  const set = new Set();
  for (let k = 0; ; k++) {
    const i = Math.ceil(k * every * fps / 1000 - 1e-6);
    if (i >= N) break;
    set.add(i);
  }
  return set;
}

function run(cmd, args, { tail = 40, input } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: [input ? 'pipe' : 'ignore', 'ignore', 'pipe'] });
    const lines = [];
    p.stderr.setEncoding('utf8');
    p.stderr.on('data', d => { for (const l of d.split(/\r?\n/)) { if (l.trim()) { lines.push(l); if (lines.length > tail) lines.shift(); } } });
    p.on('error', reject);
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`${path.basename(cmd)} saiu com código ${code}\n${lines.join('\n')}`)));
    if (input) { p.stdin.end(input); }
  });
}

// ---------------------------------------------------------------------------------------------
// ffmpeg: codificador que recebe JPEGs pelo stdin
// ---------------------------------------------------------------------------------------------

class Encoder {
  constructor({ out, fps, crf, preset }) {
    this.out = out;
    this.tail = [];
    this.exit = new Promise((resolve, reject) => { this._resolve = resolve; this._reject = reject; });
    this.failed = null;
    this.proc = spawn(FFMPEG, [
      '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
      '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-preset', preset, '-crf', String(crf), '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', '-an', out,
    ], { stdio: ['pipe', 'ignore', 'pipe'] });
    this.proc.stderr.setEncoding('utf8');
    this.proc.stderr.on('data', d => { for (const l of d.split(/\r?\n/)) if (l.trim()) { this.tail.push(l); if (this.tail.length > 40) this.tail.shift(); } });
    this.proc.on('error', e => { this.failed = e; this._reject(e); });
    this.proc.on('close', code => {
      if (code === 0) this._resolve();
      else { this.failed = new Error(`ffmpeg (${path.basename(out)}) saiu com código ${code}\n${this.tail.join('\n')}`); this._reject(this.failed); }
    });
    // evita unhandled rejection se ninguém estiver esperando ainda
    this.exit.catch(() => {});
    this.proc.stdin.on('error', e => { if (!this.failed) this.failed = e; });
  }
  write(buf) {
    if (this.failed) return Promise.reject(this.failed);
    if (this.proc.stdin.write(buf)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const onDrain = () => { cleanup(); resolve(); };
      const onErr = e => { cleanup(); reject(e); };
      const cleanup = () => { this.proc.stdin.off('drain', onDrain); this.proc.stdin.off('error', onErr); this.proc.off('close', onClose); };
      const onClose = () => { cleanup(); reject(this.failed || new Error('ffmpeg encerrou antes de receber todos os quadros')); };
      this.proc.stdin.on('drain', onDrain);
      this.proc.stdin.on('error', onErr);
      this.proc.on('close', onClose);
    });
  }
  async finish() { try { this.proc.stdin.end(); } catch {} await this.exit; }
  kill() { try { this.proc.kill('SIGKILL'); } catch {} }
}

// ---------------------------------------------------------------------------------------------
// navegador
// ---------------------------------------------------------------------------------------------

function loadPlaywright() {
  for (const p of [PW_PATH, 'playwright']) {
    try { return require(p).chromium; } catch (e) { if (p === 'playwright') throw new Error(`Playwright não encontrado em ${PW_PATH} nem no NODE_PATH: ${e.message}`); }
  }
}

const BROWSER_ARGS = [
  '--disable-gpu-vsync',
  '--run-all-compositor-stages-before-draw',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  '--hide-scrollbars',
  '--mute-audio',
  '--autoplay-policy=no-user-gesture-required',
];

/** Abre uma página do pitch já posicionada em `t0` e espera o motor ficar pronto. */
async function openPitch(chromium, { inUrl, w, h, fps, t0, timeout, tag, onPageError }) {
  const browser = await chromium.launch({ headless: true, args: BROWSER_ARGS });
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'no-preference', colorScheme: 'dark' });
  const page = await context.newPage();
  page.on('pageerror', e => onPageError(`[página ${tag}] erro: ${e && e.stack || e}`));
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') onPageError(`[página ${tag}] console.error: ${msg.text()}`);
    else if (type === 'warning') warn(`[página ${tag}] aviso: ${msg.text()}`);
  });
  page.on('crash', () => onPageError(`[página ${tag}] a página travou (crash)`));
  const sep = inUrl.includes('?') ? '&' : '?';
  // t exato (com decimais): arredondar faria o primeiro seek da fatia andar para trás
  const url = `${inUrl}${sep}render=1&fps=${fps}&t=${String(t0)}`;
  await page.goto(url, { waitUntil: 'load', timeout });
  await page.waitForFunction(() => !!(window.HALOR_PITCH && window.HALOR_PITCH.ready), null, { timeout });
  await page.evaluate(() => window.HALOR_PITCH.ready);
  await page.evaluate(() => document.fonts.ready.then(() => true));
  const duration = await page.evaluate(() => Number(window.HALOR_PITCH.duration) || 0);
  return { browser, context, page, duration };
}

/**
 * Percorre os quadros [i0, i1) de uma fatia em ordem crescente, chamando `seek` para cada um e
 * `capture(i, t)` nos quadros escolhidos (todos, no vídeo; só os amostrados, na folha).
 */
async function walkSlice(chromium, opts, i0, i1, { tag, shouldCapture, onFrame, onProgress, onPageError }) {
  const { inUrl, w, h, fps, from, jpeg, timeout } = opts;
  const t0 = frameTime(from, i0, fps);
  const { browser, page } = await openPitch(chromium, { inUrl, w, h, fps, t0, timeout, tag, onPageError });
  try {
    for (let i = i0; i < i1; i++) {
      const t = frameTime(from, i, fps);
      await page.evaluate(async t => { await window.HALOR_PITCH.seek(t); }, t);
      if (shouldCapture(i)) {
        const buf = await page.screenshot({ type: 'jpeg', quality: jpeg, animations: 'allow', caret: 'hide', timeout });
        await onFrame(i, t, buf);
      }
      onProgress(1);
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

// ---------------------------------------------------------------------------------------------
// progresso
// ---------------------------------------------------------------------------------------------

class Progress {
  constructor(total, label, quiet) {
    this.total = total; this.done = 0; this.label = label; this.quiet = quiet;
    this.start = Date.now(); this.lastLine = 0; this.tty = !!process.stdout.isTTY;
    if (!quiet) this.timer = setInterval(() => this.print(), this.tty ? 250 : 5000);
  }
  tick(n = 1) { this.done += n; }
  print(final = false) {
    if (this.quiet) return;
    const el = (Date.now() - this.start) / 1000;
    const rate = this.done / Math.max(el, 1e-3);
    const eta = rate > 0 ? (this.total - this.done) / rate : Infinity;
    const pct = (100 * this.done / Math.max(this.total, 1)).toFixed(1).padStart(5);
    const line = `${this.label} ${String(this.done).padStart(String(this.total).length)}/${this.total} (${pct}%) · ${rate.toFixed(1)} q/s · decorrido ${fmtClock(el)} · ETA ${fmtClock(eta)}`;
    if (this.tty) process.stdout.write(`\r\x1b[2K${line}${final ? '\n' : ''}`);
    else if (final || this.done === this.total || Date.now() - this.lastLine > 4000) { process.stdout.write(line + '\n'); this.lastLine = Date.now(); }
  }
  end() { if (this.timer) clearInterval(this.timer); this.print(true); }
}

// ---------------------------------------------------------------------------------------------
// folha de contato
// ---------------------------------------------------------------------------------------------

async function composeSheet(chromium, { frames, cols, cell, w, h, out, meta }) {
  const browser = await chromium.launch({ headless: true, args: BROWSER_ARGS });
  try {
    const ch = Math.round(cell * h / w);
    const gap = 10, padX = 20;
    const width = cols * cell + (cols - 1) * gap + padX * 2;
    const items = frames.map(f => `<figure><img src="data:image/jpeg;base64,${f.buf.toString('base64')}" width="${cell}" height="${ch}"><figcaption>${fmtT(f.t)}</figcaption></figure>`).join('');
    const html = `<!doctype html><meta charset="utf-8"><title>folha</title>
<style>
  html,body{margin:0;background:#07040f;color:#f4eeff;font:13px/1.3 "Instrument Sans","Inter","DejaVu Sans",system-ui,sans-serif}
  body{width:${width}px;padding:0 ${padX}px ${padX}px}
  header{display:flex;justify-content:space-between;align-items:baseline;padding:18px 2px 12px;border-bottom:1px solid #2a2140;margin-bottom:${gap}px}
  header b{font-size:16px;font-weight:600;letter-spacing:.01em}
  header span{font-family:"JetBrains Mono","DejaVu Sans Mono",ui-monospace,monospace;font-size:12px;color:#b9aee0;text-transform:uppercase;letter-spacing:.06em}
  main{display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:${gap}px}
  figure{position:relative;margin:0;width:${cell}px;height:${ch}px;background:#000;border-radius:6px;overflow:hidden;outline:1px solid #241c38}
  img{display:block;width:${cell}px;height:${ch}px;object-fit:fill}
  figcaption{position:absolute;left:8px;bottom:8px;padding:3px 8px;border-radius:999px;background:rgba(7,4,15,.78);color:#f4eeff;font-family:"JetBrains Mono","DejaVu Sans Mono",ui-monospace,monospace;font-size:12px;letter-spacing:.04em;backdrop-filter:blur(4px)}
</style>
<header><b>${meta.title}</b><span>${meta.info}</span></header>
<main>${items}</main>`;
    const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => Promise.all(Array.from(document.images, im => im.decode().catch(() => {}))));
    await page.screenshot({ path: out, type: 'png', fullPage: true, animations: 'allow' });
  } finally {
    await browser.close().catch(() => {});
  }
}

// ---------------------------------------------------------------------------------------------
// principal
// ---------------------------------------------------------------------------------------------

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.help || o.h === true) { log(fs.readFileSync(new URL(import.meta.url)).toString().split('*/')[0]); return 0; }
  if (!o.in || o.in === true) throw new UsageError('--in <index.html> é obrigatório');
  const inPath = path.resolve(String(o.in));
  if (!fs.existsSync(inPath)) throw new UsageError(`arquivo de entrada não existe: ${inPath}`);
  const sheet = o.sheet && o.sheet !== true ? path.resolve(String(o.sheet)) : null;
  const out = o.out && o.out !== true ? path.resolve(String(o.out)) : null;
  if (!sheet && !out) throw new UsageError('--out <vídeo.mp4> é obrigatório (ou --sheet <folha.png>)');
  const audio = o.audio && o.audio !== true ? path.resolve(String(o.audio)) : null;
  if (audio && !fs.existsSync(audio)) throw new UsageError(`áudio não encontrado: ${audio}`);

  const opts = {
    inUrl: pathToFileURL(inPath).href,
    fps: num(o, 'fps', 30, { min: 1, max: 240 }),
    w: num(o, 'w', 1920, { min: 16, max: 7680, int: true }),
    h: num(o, 'h', 1080, { min: 16, max: 4320, int: true }),
    from: num(o, 'from', 0, { min: 0 }),
    to: num(o, 'to', NaN, { min: 0 }),
    workers: num(o, 'workers', 1, { min: 1, max: 16, int: true }),
    crf: num(o, 'crf', 19, { min: 0, max: 51 }),
    jpeg: num(o, 'jpeg', 92, { min: 1, max: 100, int: true }),
    preset: o.preset && o.preset !== true ? String(o.preset) : 'medium',
    every: num(o, 'every', 2000, { min: 1 }),
    cols: num(o, 'cols', 4, { min: 1, max: 16, int: true }),
    cell: num(o, 'cell', 480, { min: 64, max: 1920, int: true }),
    timeout: num(o, 'timeout', 60000, { min: 1000 }),
    keep: !!o.keep, strict: !!o.strict, quiet: !!o.quiet,
  };
  if (opts.w % 2 || opts.h % 2) throw new UsageError('--w e --h precisam ser pares (yuv420p)');
  if (!fs.existsSync(FFMPEG)) throw new UsageError(`ffmpeg não encontrado em ${FFMPEG}`);

  const chromium = loadPlaywright();
  const pageErrors = [];
  const onPageError = m => { pageErrors.push(m); warn(`\n${m}`); };

  // duração: uma página de sondagem quando --to não foi dado
  if (!Number.isFinite(opts.to)) {
    const probe = await openPitch(chromium, { ...opts, t0: 0, tag: 'sonda', onPageError });
    opts.to = probe.duration;
    await probe.browser.close().catch(() => {});
    if (!(opts.to > 0)) throw new Error(`HALOR_PITCH.duration inválido (${opts.to}); use --to`);
  }
  if (opts.to <= opts.from) throw new UsageError(`--to (${opts.to}) precisa ser maior que --from (${opts.from})`);

  const N = frameCount(opts.from, opts.to, opts.fps);
  const parts = slices(N, opts.workers);
  log(`Pitch Halor · render\n  entrada   ${inPath}\n  modo      ${sheet ? 'folha de contato' : 'vídeo'} → ${sheet || out}\n  tamanho   ${opts.w}×${opts.h} @ ${opts.fps} fps\n  intervalo ${fmtT(opts.from)} → ${fmtT(opts.to)} (${opts.to - opts.from} ms, ${N} quadros)\n  fatias    ${parts.map(([a, b]) => `${a}–${b - 1}`).join(' | ')}`);

  const t0 = Date.now();
  if (sheet) {
    const samples = sampleFrames(opts.from, opts.to, opts.fps, opts.every);
    const prog = new Progress(N, 'quadros', opts.quiet);
    const captured = [];
    await Promise.all(parts.map(([i0, i1], k) => walkSlice(chromium, opts, i0, i1, {
      tag: k, shouldCapture: i => samples.has(i),
      onFrame: async (i, t, buf) => { captured.push({ i, t, buf }); },
      onProgress: n => prog.tick(n), onPageError,
    })));
    prog.end();
    captured.sort((a, b) => a.i - b.i);
    await fsp.mkdir(path.dirname(sheet), { recursive: true });
    await composeSheet(chromium, {
      frames: captured, cols: opts.cols, cell: opts.cell, w: opts.w, h: opts.h, out: sheet,
      meta: { title: `Pitch Halor · folha de contato · ${path.basename(inPath)}`, info: `${captured.length} quadros · a cada ${fmtT(opts.every)} · ${fmtT(opts.from)}→${fmtT(opts.to)} · ${opts.w}×${opts.h} @ ${opts.fps} fps` },
    });
    log(`folha gravada: ${sheet} (${captured.length} quadros) em ${fmtClock((Date.now() - t0) / 1000)}`);
  } else {
    await fsp.mkdir(path.dirname(out), { recursive: true });
    const tmp = path.join(path.dirname(out), `.${path.basename(out, path.extname(out))}.segs`);
    await fsp.rm(tmp, { recursive: true, force: true });
    await fsp.mkdir(tmp, { recursive: true });
    const encoders = [];
    const prog = new Progress(N, 'quadros', opts.quiet);
    try {
      const segs = await Promise.all(parts.map(async ([i0, i1], k) => {
        const seg = path.join(tmp, `seg-${pad2(k)}.mp4`);
        const enc = new Encoder({ out: seg, fps: opts.fps, crf: opts.crf, preset: opts.preset });
        encoders.push(enc);
        let frames = 0;
        await walkSlice(chromium, opts, i0, i1, {
          tag: k, shouldCapture: () => true,
          onFrame: async (i, t, buf) => { await enc.write(buf); frames++; },
          onProgress: n => prog.tick(n), onPageError,
        });
        await enc.finish();
        if (frames !== i1 - i0) throw new Error(`fatia ${k}: ${frames} quadros gravados, esperava ${i1 - i0}`);
        return seg;
      }));
      prog.end();

      // concatena as fatias (ou usa a única)
      let video = segs[0];
      if (segs.length > 1) {
        video = path.join(tmp, 'video.mp4');
        const list = path.join(tmp, 'concat.txt');
        await fsp.writeFile(list, segs.map(s => `file '${s.replace(/'/g, "'\\''")}'`).join('\n') + '\n');
        log('concatenando fatias…');
        await run(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', video]);
      }

      if (audio) {
        log(`muxando áudio ${path.basename(audio)}…`);
        // apad + -shortest: o vídeo dita a duração; a narração é deslocada por --from e cortada no fim.
        await run(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
          '-i', video, '-ss', (opts.from / 1000).toFixed(3), '-i', audio,
          '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad', '-shortest',
          '-movflags', '+faststart', out]);
      } else {
        await fsp.rm(out, { force: true });
        await fsp.rename(video, out);
      }
    } catch (e) {
      for (const enc of encoders) enc.kill();
      throw e;
    } finally {
      if (!opts.keep) await fsp.rm(tmp, { recursive: true, force: true }); else log(`segmentos mantidos em ${tmp}`);
    }
    const st = await fsp.stat(out);
    log(`vídeo gravado: ${out} (${(st.size / 1048576).toFixed(1)} MB, ${N} quadros, ${audio ? 'com' : 'sem'} áudio) em ${fmtClock((Date.now() - t0) / 1000)}`);
  }

  if (pageErrors.length) {
    warn(`\n${pageErrors.length} erro(s) de página durante o render${opts.strict ? ' (--strict: falhando)' : ''}.`);
    if (opts.strict) return 2;
  }
  return 0;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname;
if (isMain) {
  let exiting = false;
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { if (exiting) process.exit(130); exiting = true; warn(`\n${sig}: encerrando…`); process.exit(130); });
  main().then(code => process.exit(code), e => {
    if (e instanceof UsageError) { warn(`uso: ${e.message}\n(veja o cabeçalho de render.mjs para as opções)`); }
    else { warn(`\nfalha no render: ${e && e.stack || e}`); }
    process.exit(1);
  });
}
