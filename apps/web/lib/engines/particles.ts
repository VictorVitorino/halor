/* ==========================================================================
   CAMPO HALOR · partículas que se ligam por proximidade e respiram.
   O cursor vira um olhar: onde ele passa, as partículas se reúnem num halo
   em volta dele. Botões marcados com [data-attract] também ganham halo.
   Clique solta uma onda. A entrada nasce de um ponto de luz e se espalha,
   com o halo da marca abrindo a cena.
   Uso: <canvas className="halo-field halor-field" data-field="hero" />
   e, na tela, `useEngine('v-…', () => bootFields(raiz))`.
   Porte de prototype/src/js/12-particles.js, com ciclo de vida por tela.
   ========================================================================== */
import { $$, REDUCED } from '../core';

type Theme = 'night' | 'paper';
interface Preset {
  theme: Theme; density: number; entrance?: false | 'load' | 'view'; interactive?: boolean;
  calm?: string; calmMerge?: boolean; attract?: string; ring: number;
}
interface Particle { x: number; y: number; hx: number; hy: number; vx: number; vy: number; bx: number; by: number; r: number; ph: number }
interface Rect { x: number; y: number; w: number; h: number }
interface Halo { x: number; y: number; r: number; s: number }
interface Pulse { x: number; y: number; t: number; brand: boolean }

export const FIELD_PRESETS: Record<string, Partial<Preset> & { theme: Theme; density: number }> = {
  hero:  { theme: 'night', density: 1.15, entrance: 'load', calm: '.s-hero-copy .s-h1, .s-hero-copy .s-sub, .s-hero-copy .s-lede, .s-hero-copy .s-cta', calmMerge: true, attract: '[data-attract]', ring: 96 },
  final: { theme: 'night', density: .85, entrance: 'view', calm: '.s-final-in h2', attract: '[data-attract]', ring: 90 },
  auth:  { theme: 'night', density: .75, entrance: 'view', calm: '.auth-quote, .eye-wrap', ring: 80 },
  brand: { theme: 'night', density: .9, entrance: 'view', calm: '.b-hero-logo, .b-claim, .b-cover-in > .lede', ring: 90 },
  nf:    { theme: 'night', density: .9, entrance: 'view', calm: '.nf-n, .nf h1', ring: 90 },
  sum:   { theme: 'night', density: .45, interactive: false },
  paper: { theme: 'paper', density: .8, entrance: 'view', calm: '.hh-h, .hh-sub, .hh-week', ring: 70 },
  stage: { theme: 'night', density: .45, calm: '.stage-now, .stage-side', ring: 80 },
  demo:  { theme: 'night', density: 1.1, entrance: 'view', ring: 64 },
};
const FIELD_PAL = {
  night: { line: '169,112,255', link: '244,238,255', dot: 'rgba(201,166,255,.85)', hot: '#ffffff', glow: 'rgba(139,61,255,.22)', ring: '244,238,255', core: '201,166,255' },
  paper: { line: '139,61,255', link: '100,33,209', dot: 'rgba(139,61,255,.55)', hot: '#7a2ef0', glow: 'rgba(139,61,255,.12)', ring: '122,46,240', core: '139,61,255' },
};
const fClamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export interface HalorField {
  cv: HTMLCanvasElement; host: HTMLElement; visible: boolean; W: number; P: Particle[];
  frame(now: number, dt: number): void; size(): void; replay(): void; dispose(): void;
}

const fields: HalorField[] = [];
let raf = 0, last = 0;
function loop(now: number) {
  const dt = Math.min(48, last ? now - last : 16.67); last = now;
  for (const F of fields) if (F.visible && F.W && F.P.length) F.frame(now, dt);
  raf = fields.length ? requestAnimationFrame(loop) : 0;
  if (!raf) last = 0;
}
function ensureLoop() { if (!raf && !REDUCED && fields.length) raf = requestAnimationFrame(loop); }

export function makeHalorField(cv: HTMLCanvasElement): HalorField | null {
  const ctx = cv.getContext('2d'); const host = cv.parentElement;
  if (!ctx || !host) return null;
  const p: Preset = Object.assign({ density: 1, entrance: false, interactive: true, ring: 86 } as Preset, FIELD_PRESETS[cv.dataset.field || ''] || {});
  const pal = FIELD_PAL[p.theme];
  const ac = new AbortController(), on = { signal: ac.signal };
  let W = 0, H = 0, P: Particle[] = [], pulses: Pulse[] = [], calm: Rect[] = [], calmO: { x: number; y: number } | null = null;
  const m = { x: 0, y: 0, on: false, k: 0 };
  let att: Halo | null = null, halos: Halo[] = [], entered = false, t0 = performance.now(), flash = 0, origin: { x: number; y: number } | null = null;

  const inCalm = (x: number, y: number) => { for (const c of calm) if (x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h) return true; return false; };
  const measureCalm = () => {
    calm = [];
    if (!p.calm) return;
    const hr = cv.getBoundingClientRect();
    $$(p.calm, host).forEach(n => { const r = n.getBoundingClientRect(); if (r.width) calm.push({ x: r.left - hr.left - 24, y: r.top - hr.top - 18, w: r.width + 48, h: r.height + 36 }); });
    const c0 = calm[0]; calmO = c0 ? { x: c0.x + c0.w / 2, y: c0.y + c0.h / 2 } : null;
    /* zonas que se tocam viram uma só: entre duas vizinhas os pontos ficariam presos numa fresta sobre o texto */
    if (p.calmMerge) for (let i = 0; i < calm.length; i++) for (let j = i + 1; j < calm.length; j++) {
      const a = calm[i], b = calm[j];
      if (a.x <= b.x + b.w && b.x <= a.x + a.w && a.y <= b.y + b.h && b.y <= a.y + a.h) {
        const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
        calm[i] = { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
        calm.splice(j, 1); j = i;
      }
    }
  };
  const size = () => {
    const r = cv.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const sx = W ? r.width / W : 1, sy = H ? r.height / H : 1;
    P.forEach(q => { q.x *= sx; q.y *= sy; q.hx *= sx; q.hy *= sy; });
    W = r.width; H = r.height; F.W = W;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    measureCalm();
    return true;
  };
  const seed = (burst: boolean) => {
    const n = Math.round(fClamp(W * H / (5600 / p.density), 36, 200));
    const o = origin || { x: W / 2, y: H / 2 };
    P = Array.from({ length: n }, () => {
      let hx = Math.random() * W, hy = Math.random() * H;
      /* a casa já nasce longe do texto: sem movimento nada empurra os pontos para fora */
      for (let k = REDUCED ? 8 : p.calmMerge ? 6 : 0; k > 0 && inCalm(hx, hy); k--) { hx = Math.random() * W; hy = Math.random() * H; }
      const q: Particle = { x: hx, y: hy, hx, hy, vx: 0, vy: 0, bx: (Math.random() - .5) * .3, by: (Math.random() - .5) * .3, r: .7 + Math.random() * 1.8, ph: Math.random() * 6.283 };
      if (burst) { const a = Math.random() * 6.283, s = Math.random() * 8; q.x = o.x + Math.cos(a) * s; q.y = o.y + Math.sin(a) * s; q.vx = (hx - q.x) * .055; q.vy = (hy - q.y) * .055; }
      return q;
    });
    F.P = P;
  };
  const pulse = (x: number, y: number, brand: boolean) => { pulses.push({ x, y, t: 0, brand }); };
  const entrance = () => {
    if (!size()) return;
    origin = calmO || { x: W / 2, y: H / 2 };
    t0 = performance.now();
    seed(!REDUCED); pulses = [];
    if (!REDUCED) { pulse(origin.x, origin.y, true); flash = 1; }
    entered = true;
    host.classList.remove('field-in'); void host.offsetWidth; host.classList.add('field-in');
    if (REDUCED) draw(performance.now());
  };

  const step = (dt: number) => {
    const k = dt / 16.67, fr = Math.pow(.948, k);
    pulses.forEach(q => { q.t += dt / (q.brand ? 1500 : 1100); });
    pulses = pulses.filter(q => q.t < 1);
    flash = Math.max(0, flash - dt / 600);
    m.k += ((m.on ? 1 : 0) - m.k) * Math.min(1, dt / 220);
    const maxR = Math.hypot(W, H) * .62;
    halos = [];
    if (m.k > .02) halos.push({ x: m.x, y: m.y, r: p.ring, s: m.k });
    if (att) halos.push(att);
    for (const q of P) {
      for (const h of halos) {
        const dx = q.x - h.x, dy = q.y - h.y, d = Math.hypot(dx, dy) || 1, R = h.r * 2.1;
        if (d < R) {
          const fall = 1 - d / R, s = h.s * k;
          const pull = (h.r - d) * .018 * fall * s;
          q.vx += dx / d * pull; q.vy += dy / d * pull;
          q.vx += -dy / d * .28 * fall * s; q.vy += dx / d * .28 * fall * s;
        }
      }
      for (const c of calm) {
        if (q.x > c.x && q.x < c.x + c.w && q.y > c.y && q.y < c.y + c.h) {
          const cx = c.x + c.w / 2, cy = c.y + c.h / 2, dx = q.x - cx, dy = q.y - cy, d = Math.hypot(dx, dy) || 1;
          q.vx += dx / d * .018 * k; q.vy += dy / d * .018 * k;
        }
      }
      for (const w of pulses) {
        const dx = q.x - w.x, dy = q.y - w.y, d = Math.hypot(dx, dy) || 1, band = Math.abs(d - w.t * maxR);
        if (band < 40) { const f = (1 - band / 40) * 1.7 * (1 - w.t) * k; q.vx += dx / d * f; q.vy += dy / d * f; }
      }
      q.vx *= fr; q.vy *= fr;
      q.x += (q.vx + q.bx) * k; q.y += (q.vy + q.by) * k;
      if (q.x < -14) q.x = W + 14; else if (q.x > W + 14) q.x = -14;
      if (q.y < -14) q.y = H + 14; else if (q.y > H + 14) q.y = -14;
    }
  };

  const brandHalo = (x: number, y: number, r: number, a: number, lw: number) => {
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${pal.ring},${a})`; ctx.lineWidth = lw; ctx.shadowColor = `rgba(${pal.core},1)`; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(x, y, r, -25 * Math.PI / 180, 295 * Math.PI / 180); ctx.stroke();
    const sx = x + r * Math.cos(-Math.PI / 4), sy = y + r * Math.sin(-Math.PI / 4), sr = Math.max(4, lw * 2.6);
    ctx.fillStyle = `rgba(${pal.ring},${Math.min(1, a * 1.3)})`;
    ctx.beginPath(); ctx.moveTo(sx, sy - sr); ctx.quadraticCurveTo(sx, sy, sx + sr, sy); ctx.quadraticCurveTo(sx, sy, sx, sy + sr); ctx.quadraticCurveTo(sx, sy, sx - sr, sy); ctx.quadraticCurveTo(sx, sy, sx, sy - sr); ctx.fill();
    ctx.restore();
  };
  const draw = (now: number) => {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    const breathe = REDUCED ? 0 : Math.sin(t * .9);
    const L = fClamp(W / 8, 84, 132) * (1 + .07 * breathe), L2 = L * L, B: number[][] = [[], [], [], []];
    for (let i = 0; i < P.length; i++) {
      const a = P[i];
      for (let j = i + 1; j < P.length; j++) {
        const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < L2) {
          let bin = Math.min(3, Math.floor((1 - d2 / L2) * 4));
          if (calm.length && inCalm((a.x + b.x) / 2, (a.y + b.y) / 2)) bin = Math.max(0, bin - 2);
          B[bin].push(a.x, a.y, b.x, b.y);
        }
      }
    }
    ctx.lineWidth = 1;
    B.forEach((s, bi) => {
      if (!s.length) return;
      ctx.strokeStyle = `rgba(${pal.line},${.07 + bi * .13})`;
      ctx.beginPath();
      for (let i = 0; i < s.length; i += 4) { ctx.moveTo(s[i], s[i + 1]); ctx.lineTo(s[i + 2], s[i + 3]); }
      ctx.stroke();
    });
    for (const h of halos) {
      const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.r * 1.6);
      g.addColorStop(0, `rgba(${pal.core},${.16 * h.s})`); g.addColorStop(1, `rgba(${pal.core},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h.x, h.y, h.r * 1.6, 0, 6.283); ctx.fill();
      ctx.beginPath();
      for (const q of P) { const d = Math.hypot(q.x - h.x, q.y - h.y); if (d < h.r * 1.5) { ctx.moveTo(h.x, h.y); ctx.lineTo(q.x, q.y); } }
      ctx.strokeStyle = `rgba(${pal.link},${.13 * h.s})`; ctx.lineWidth = 1; ctx.stroke();
      brandHalo(h.x, h.y, h.r * (.96 + .04 * Math.sin(t * 3)), .22 * h.s, 1.4);
    }
    for (const q of P) {
      const r = q.r * (1 + (REDUCED ? 0 : .22 * Math.sin(t * 1.4 + q.ph)));
      if (q.r > 2) { ctx.beginPath(); ctx.arc(q.x, q.y, r * 3.2, 0, 6.283); ctx.fillStyle = pal.glow; ctx.fill(); }
      ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, 6.283);
      ctx.fillStyle = q.r > 1.95 ? pal.hot : pal.dot; ctx.fill();
    }
    for (const w of pulses) {
      const R = w.t * Math.hypot(W, H) * .62;
      if (w.brand) brandHalo(w.x, w.y, Math.max(6, R), (1 - w.t) * .85, 2.4);
      else { ctx.beginPath(); ctx.arc(w.x, w.y, R, 0, 6.283); ctx.strokeStyle = `rgba(${pal.ring},${(1 - w.t) * .6})`; ctx.lineWidth = 2; ctx.stroke(); }
    }
    if (flash > 0 && origin) {
      const g = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, 220);
      g.addColorStop(0, `rgba(255,255,255,${.55 * flash})`); g.addColorStop(.25, `rgba(${pal.core},${.3 * flash})`); g.addColorStop(1, `rgba(${pal.core},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(origin.x, origin.y, 220, 0, 6.283); ctx.fill();
    }
  };

  const ro = new ResizeObserver(() => F.size());
  const io = new IntersectionObserver(es => {
    F.visible = es[0].isIntersecting;
    if (F.visible && !entered && p.entrance) entrance();
    if (F.visible) ensureLoop();
  }, { threshold: .25 });

  const F: HalorField = {
    cv, host, visible: false, W: 0, P,
    frame: (now, dt) => { step(dt); draw(now); },
    size: () => { if (size()) { if (!P.length) seed(false); draw(performance.now()); } },
    replay: entrance,
    dispose: () => {
      ac.abort(); ro.disconnect(); io.disconnect();
      const i = fields.indexOf(F); if (i >= 0) fields.splice(i, 1);
    },
  };

  if (p.interactive) {
    const at = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    host.addEventListener('pointermove', e => { at(e); m.on = true; host.classList.add('field-touched'); if (REDUCED) draw(performance.now()); }, on);
    host.addEventListener('pointerleave', () => { m.on = false; }, on);
    host.addEventListener('pointerdown', e => {
      if ((e.target as Element).closest('a, button, input, select, textarea, label')) return;
      at(e); if (!REDUCED) pulse(m.x, m.y, false);
    }, on);
    if (p.attract) $$(p.attract, host).forEach(b => {
      const enter = () => { const r = b.getBoundingClientRect(), hr = cv.getBoundingClientRect(); att = { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, r: r.width / 2 + 18, s: 1 }; };
      const leave = () => { att = null; };
      b.addEventListener('pointerenter', enter, on); b.addEventListener('focus', enter, on);
      b.addEventListener('pointerleave', leave, on); b.addEventListener('blur', leave, on);
    });
  }
  ro.observe(cv); io.observe(cv);
  fields.push(F);
  F.size();
  if (p.entrance === 'load') requestAnimationFrame(() => entrance());
  return F;
}

/** Liga todos os campos dentro de `root` e devolve a função que os desliga. */
export function bootFields(root: ParentNode = document): () => void {
  const mine = $$<HTMLCanvasElement>('canvas.halor-field', root).map(makeHalorField).filter((f): f is HalorField => !!f);
  ensureLoop();
  const resize = () => setTimeout(() => mine.forEach(F => F.size()), 40);
  const replay = (e: MouseEvent) => {
    const b = (e.target as Element | null)?.closest<HTMLElement>('[data-field-replay]'); if (!b) return;
    mine.find(f => f.cv.dataset.field === b.dataset.fieldReplay)?.replay();
  };
  document.addEventListener('halor:view', resize);
  document.addEventListener('click', replay);
  return () => {
    document.removeEventListener('halor:view', resize);
    document.removeEventListener('click', replay);
    mine.forEach(F => F.dispose());
  };
}
