/* 30 · Particle System · campo de partículas ligadas que reage ao cursor e solta pulsos.
   Editável: título, cor, densidade e ligações. */
import { q, vtAccent, vtClamp, vtRgb, type VtCtx, type VtDemo } from '../ctx';

interface Pt { x: number; y: number; vx: number; vy: number; bx: number; by: number; r: number; a: number }
interface Pulse { x: number; y: number; t: number }

export function particleDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-pa', card), cv = q<HTMLCanvasElement>('canvas', box), g = cv.getContext('2d'), title = q('.vt-pa-t', card);
  if (!g) return {};
  let W = 0, H = 0, P: Pt[] = [], pulses: Pulse[] = [], running = false, raf = 0, last = 0;
  let dens = 1, links = true, rgb = vtRgb('#a970ff');
  const m = { x: 0, y: 0, on: false };

  const size = () => {
    const r = box.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sx = W ? r.width / W : 1, sy = H ? r.height / H : 1;
    P.forEach(p => { p.x *= sx; p.y *= sy; });
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  };
  const target = () => Math.round(vtClamp(W * H / 3600, 40, 120) * dens);
  const make = (burst: boolean, fade?: boolean): Pt => {
    const tx = Math.random() * W, ty = Math.random() * H;
    const p: Pt = { x: tx, y: ty, vx: 0, vy: 0, bx: (Math.random() - .5) * .34, by: (Math.random() - .5) * .34, r: .7 + Math.random() * 1.7, a: fade && !ctx.reduced ? 0 : 1 };
    if (burst) { p.x = W / 2 + (Math.random() - .5) * 10; p.y = H / 2 + (Math.random() - .5) * 10; p.vx = (tx - p.x) * .05; p.vy = (ty - p.y) * .05; }
    return p;
  };
  const seed = (burst: boolean) => { P = Array.from({ length: target() }, () => make(burst)); };
  const fit = () => {
    if (!W) return;
    const n = target();
    while (P.length < n) P.push(make(false, true));
    if (P.length > n) P.length = n;
  };
  const pulse = (x: number, y: number) => { pulses.push({ x, y, t: 0 }); if (!running) draw(); };
  const step = (dt: number) => {
    const k = dt / 16.67, fr = Math.pow(.95, k), R = 120;
    pulses.forEach(p => { p.t += dt / 1100; });
    pulses = pulses.filter(p => p.t < 1);
    const maxR = Math.hypot(W, H) * .6;
    for (const p of P) {
      if (p.a < 1) p.a = Math.min(1, p.a + dt / 700);
      if (m.on) {
        const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / R) * .9 * k; p.vx += dx / d * f; p.vy += dy / d * f; }
      }
      for (const u of pulses) {
        const dx = p.x - u.x, dy = p.y - u.y, d = Math.hypot(dx, dy) || 1, band = Math.abs(d - u.t * maxR);
        if (band < 36) { const f = (1 - band / 36) * 1.6 * (1 - u.t) * k; p.vx += dx / d * f; p.vy += dy / d * f; }
      }
      p.vx *= fr; p.vy *= fr;
      p.x += (p.vx + p.bx) * k; p.y += (p.vy + p.by) * k;
      if (p.x < -12) p.x = W + 12; else if (p.x > W + 12) p.x = -12;
      if (p.y < -12) p.y = H + 12; else if (p.y > H + 12) p.y = -12;
    }
  };
  const draw = () => {
    g.clearRect(0, 0, W, H);
    const [cr, cg, cb] = rgb, lt = rgb.map(c => Math.round(c + (255 - c) * .45)).join(', ');
    if (links) {
      const L = vtClamp(W / 7, 80, 128), L2 = L * L, B: number[][] = [[], [], [], []];
      for (let i = 0; i < P.length; i++) {
        const a = P[i];
        for (let j = i + 1; j < P.length; j++) {
          const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < L2) B[Math.min(3, Math.floor((1 - d2 / L2) * 4))].push(a.x, a.y, b.x, b.y);
        }
      }
      g.lineWidth = 1;
      B.forEach((s, bi) => {
        if (!s.length) return;
        g.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${.08 + bi * .13})`;
        g.beginPath();
        for (let i = 0; i < s.length; i += 4) { g.moveTo(s[i], s[i + 1]); g.lineTo(s[i + 2], s[i + 3]); }
        g.stroke();
      });
    }
    if (m.on) {
      g.beginPath();
      for (const p of P) { const d = Math.hypot(p.x - m.x, p.y - m.y); if (d < 170) { g.moveTo(m.x, m.y); g.lineTo(p.x, p.y); } }
      g.strokeStyle = 'rgba(244, 238, 255, .16)'; g.lineWidth = 1; g.stroke();
      g.beginPath(); g.arc(m.x, m.y, 118, 0, Math.PI * 2);
      g.strokeStyle = `rgba(${lt}, .24)`; g.lineWidth = 1.5; g.stroke();
    }
    for (const p of P) {
      g.globalAlpha = p.a;
      if (p.r > 2) { g.beginPath(); g.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); g.fillStyle = `rgba(${cr}, ${cg}, ${cb}, .24)`; g.fill(); }
      g.beginPath(); g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      g.fillStyle = p.r > 1.9 ? '#ffffff' : `rgba(${lt}, .85)`; g.fill();
    }
    g.globalAlpha = 1;
    for (const u of pulses) {
      g.beginPath(); g.arc(u.x, u.y, u.t * Math.hypot(W, H) * .6, 0, Math.PI * 2);
      g.strokeStyle = `rgba(244, 238, 255, ${(1 - u.t) * .7})`; g.lineWidth = 2; g.stroke();
    }
  };
  const frame = (t: number) => {
    if (!running) return;
    const dt = Math.min(48, last ? t - last : 16.67); last = t;
    step(dt); draw();
    raf = ctx.frame(frame);
  };
  const resume = () => { if (running || ctx.reduced || !W) return; running = true; last = 0; raf = ctx.frame(frame); };
  const pause = () => { running = false; ctx.unframe(raf); };
  const at = (e: PointerEvent) => { const r = box.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };

  ctx.on(box, 'pointermove', e => { if (e.pointerType === 'touch') return; at(e); m.on = true; });
  ctx.on(box, 'pointerleave', () => { m.on = false; });
  ctx.on(box, 'pointerdown', e => { at(e); if (!ctx.reduced) pulse(m.x, m.y); });
  ctx.on(box, 'keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!ctx.reduced) pulse(W / 2, H / 2); } });
  ctx.resize(box, () => { if (!P.length) return; if (size()) { if (!running) draw(); } });
  ctx.defer(() => { running = false; g.clearRect(0, 0, cv.width, cv.height); });

  const TITLE = title.textContent || '';
  return {
    start() { if (!size()) return; seed(true); resume(); },
    resume, pause,
    replay() { pulses = []; seed(true); pulse(W / 2, H / 2); resume(); },
    still() { if (!size()) return; seed(false); draw(); },
    fields: [
      { k: 'title', t: 'text', l: 'Título', v: TITLE, max: 40 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'dens', t: 'range', l: 'Densidade', v: 100, min: 30, max: 220, step: 10, fmt: v => v + '%' },
      { k: 'links', t: 'toggle', l: 'Ligações', v: true }
    ],
    set(k, v) {
      if (k === 'title') title.textContent = String(v) || ' ';
      else if (k === 'acc') { vtAccent(card, String(v)); rgb = vtRgb(String(v)); }
      else if (k === 'dens') { dens = Number(v) / 100; fit(); }
      else if (k === 'links') links = !!v;
      if (!running && W) draw();
    }
  };
}
