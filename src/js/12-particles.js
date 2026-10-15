/* ==========================================================================
   CAMPO HALOR · partículas que se ligam por proximidade e respiram.
   O cursor vira um olhar: onde ele passa, as partículas se reúnem num halo
   em volta dele. Botões marcados com [data-attract] também ganham halo.
   Clique solta uma onda. A entrada é a mesma do "Repetir" da vitrine: tudo
   nasce de um ponto de luz e se espalha, com o halo da marca abrindo a cena.
   Uso: <canvas class="halo-field halor-field" data-field="hero"></canvas>
   ========================================================================== */
const FIELD_PRESETS = {
  hero:  { theme: 'night', density: 1.15, entrance: 'load', calm: '.s-hero-copy .s-h1', attract: '[data-attract]', ring: 96 },
  final: { theme: 'night', density: .85, entrance: 'view', calm: '.s-final-in h2', attract: '[data-attract]', ring: 90 },
  auth:  { theme: 'night', density: .75, entrance: 'view', calm: '.auth-quote, .eye-wrap', ring: 80 },
  brand: { theme: 'night', density: .9, entrance: 'view', calm: '.b-hero-logo, .b-claim, .b-cover-in > .lede', ring: 90 },
  nf:    { theme: 'night', density: .9, entrance: 'view', calm: '.nf-n, .nf h1', ring: 90 },
  sum:   { theme: 'night', density: .45, interactive: false },
  paper: { theme: 'paper', density: .8, entrance: 'view', calm: '.hh-h, .hh-sub, .hh-week', ring: 70 },
  stage: { theme: 'night', density: .45, calm: '.stage-now, .stage-side', ring: 80 },
  demo:  { theme: 'night', density: 1.1, entrance: 'view', ring: 64 }
};
const FIELD_PAL = {
  night: { line: '169,112,255', link: '244,238,255', dot: 'rgba(201,166,255,.85)', hot: '#ffffff', glow: 'rgba(139,61,255,.22)', ring: '244,238,255', core: '201,166,255' },
  paper: { line: '139,61,255', link: '100,33,209', dot: 'rgba(139,61,255,.55)', hot: '#7a2ef0', glow: 'rgba(139,61,255,.12)', ring: '122,46,240', core: '139,61,255' }
};
const halorFields = [];
const fClamp = (v, a, b) => Math.max(a, Math.min(b, v));

function makeHalorField(cv) {
  const p = Object.assign({ density: 1, entrance: false, interactive: true, ring: 86 }, FIELD_PRESETS[cv.dataset.field] || {});
  const host = cv.parentElement, ctx = cv.getContext('2d'), pal = FIELD_PAL[p.theme];
  const F = { cv, host, p, W: 0, H: 0, P: [], pulses: [], calm: [], m: { x: 0, y: 0, on: false, k: 0 }, att: null, visible: false, entered: false, t0: performance.now(), flash: 0, origin: null };

  const size = () => {
    const r = cv.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const sx = F.W ? r.width / F.W : 1, sy = F.H ? r.height / F.H : 1;
    F.P.forEach(q => { q.x *= sx; q.y *= sy; q.hx *= sx; q.hy *= sy; });
    F.W = r.width; F.H = r.height;
    cv.width = Math.round(F.W * dpr); cv.height = Math.round(F.H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    measureCalm();
    return true;
  };
  const measureCalm = () => {
    F.calm = [];
    if (!p.calm) return;
    const hr = cv.getBoundingClientRect();
    $$(p.calm, host).forEach(n => { const r = n.getBoundingClientRect(); if (r.width) F.calm.push({ x: r.left - hr.left - 24, y: r.top - hr.top - 18, w: r.width + 48, h: r.height + 36 }); });
  };
  const seed = burst => {
    const n = Math.round(fClamp(F.W * F.H / (5600 / p.density), 36, 200));
    const o = F.origin || { x: F.W / 2, y: F.H / 2 };
    F.P = Array.from({ length: n }, () => {
      const hx = Math.random() * F.W, hy = Math.random() * F.H;
      const q = { x: hx, y: hy, hx, hy, vx: 0, vy: 0, bx: (Math.random() - .5) * .3, by: (Math.random() - .5) * .3, r: .7 + Math.random() * 1.8, ph: Math.random() * 6.283 };
      if (burst) { const a = Math.random() * 6.283, s = Math.random() * 8; q.x = o.x + Math.cos(a) * s; q.y = o.y + Math.sin(a) * s; q.vx = (hx - q.x) * .055; q.vy = (hy - q.y) * .055; }
      return q;
    });
  };
  const pulse = (x, y, brand) => { F.pulses.push({ x, y, t: 0, brand: !!brand }); };
  const entrance = () => {
    if (!size()) return;
    const c = F.calm[0];
    F.origin = c ? { x: c.x + c.w / 2, y: c.y + c.h / 2 } : { x: F.W / 2, y: F.H / 2 };
    F.t0 = performance.now();
    seed(!REDUCED); F.pulses = [];
    if (!REDUCED) { pulse(F.origin.x, F.origin.y, true); F.flash = 1; }
    F.entered = true;
    host.classList.remove('field-in'); void host.offsetWidth; host.classList.add('field-in');
    if (REDUCED) draw(performance.now());
  };
  F.replay = entrance;

  const step = (dt, t) => {
    const k = dt / 16.67, fr = Math.pow(.948, k);
    F.pulses.forEach(q => { q.t += dt / (q.brand ? 1500 : 1100); });
    F.pulses = F.pulses.filter(q => q.t < 1);
    F.flash = Math.max(0, F.flash - dt / 600);
    F.m.k += ((F.m.on ? 1 : 0) - F.m.k) * Math.min(1, dt / 220);
    const maxR = Math.hypot(F.W, F.H) * .62;
    const halos = [];
    if (F.m.k > .02) halos.push({ x: F.m.x, y: F.m.y, r: p.ring, s: F.m.k });
    if (F.att) halos.push(F.att);
    for (const q of F.P) {
      for (const h of halos) {
        const dx = q.x - h.x, dy = q.y - h.y, d = Math.hypot(dx, dy) || 1, R = h.r * 2.1;
        if (d < R) {
          const fall = 1 - d / R, s = h.s * k;
          const pull = (h.r - d) * .018 * fall * s;
          q.vx += dx / d * pull; q.vy += dy / d * pull;
          q.vx += -dy / d * .28 * fall * s; q.vy += dx / d * .28 * fall * s;
        }
      }
      for (const c of F.calm) {
        if (q.x > c.x && q.x < c.x + c.w && q.y > c.y && q.y < c.y + c.h) {
          const cx = c.x + c.w / 2, cy = c.y + c.h / 2, dx = q.x - cx, dy = q.y - cy, d = Math.hypot(dx, dy) || 1;
          q.vx += dx / d * .018 * k; q.vy += dy / d * .018 * k;
        }
      }
      for (const w of F.pulses) {
        const dx = q.x - w.x, dy = q.y - w.y, d = Math.hypot(dx, dy) || 1, band = Math.abs(d - w.t * maxR);
        if (band < 40) { const f = (1 - band / 40) * 1.7 * (1 - w.t) * k; q.vx += dx / d * f; q.vy += dy / d * f; }
      }
      q.vx *= fr; q.vy *= fr;
      q.x += (q.vx + q.bx) * k; q.y += (q.vy + q.by) * k;
      if (q.x < -14) q.x = F.W + 14; else if (q.x > F.W + 14) q.x = -14;
      if (q.y < -14) q.y = F.H + 14; else if (q.y > F.H + 14) q.y = -14;
    }
    F.halos = halos;
  };

  const inCalm = (x, y) => { for (const c of F.calm) if (x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h) return true; return false; };
  const brandHalo = (x, y, r, a, lw) => {
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${pal.ring},${a})`; ctx.lineWidth = lw; ctx.shadowColor = `rgba(${pal.core},1)`; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(x, y, r, -25 * Math.PI / 180, 295 * Math.PI / 180); ctx.stroke();
    const sx = x + r * Math.cos(-Math.PI / 4), sy = y + r * Math.sin(-Math.PI / 4), sr = Math.max(4, lw * 2.6);
    ctx.fillStyle = `rgba(${pal.ring},${Math.min(1, a * 1.3)})`;
    ctx.beginPath(); ctx.moveTo(sx, sy - sr); ctx.quadraticCurveTo(sx, sy, sx + sr, sy); ctx.quadraticCurveTo(sx, sy, sx, sy + sr); ctx.quadraticCurveTo(sx, sy, sx - sr, sy); ctx.quadraticCurveTo(sx, sy, sx, sy - sr); ctx.fill();
    ctx.restore();
  };
  const draw = now => {
    const t = (now - F.t0) / 1000, W = F.W, H = F.H;
    ctx.clearRect(0, 0, W, H);
    const breathe = REDUCED ? 0 : Math.sin(t * .9);
    const L = fClamp(W / 8, 84, 132) * (1 + .07 * breathe), L2 = L * L, B = [[], [], [], []];
    const P = F.P;
    for (let i = 0; i < P.length; i++) {
      const a = P[i];
      for (let j = i + 1; j < P.length; j++) {
        const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < L2) {
          let bin = Math.min(3, Math.floor((1 - d2 / L2) * 4));
          if (F.calm.length && inCalm((a.x + b.x) / 2, (a.y + b.y) / 2)) bin = Math.max(0, bin - 2);
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
    for (const h of F.halos || []) {
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
    for (const w of F.pulses) {
      const R = w.t * Math.hypot(W, H) * .62;
      if (w.brand) brandHalo(w.x, w.y, Math.max(6, R), (1 - w.t) * .85, 2.4);
      else { ctx.beginPath(); ctx.arc(w.x, w.y, R, 0, 6.283); ctx.strokeStyle = `rgba(${pal.ring},${(1 - w.t) * .6})`; ctx.lineWidth = 2; ctx.stroke(); }
    }
    if (F.flash > 0 && F.origin) {
      const g = ctx.createRadialGradient(F.origin.x, F.origin.y, 0, F.origin.x, F.origin.y, 220);
      g.addColorStop(0, `rgba(255,255,255,${.55 * F.flash})`); g.addColorStop(.25, `rgba(${pal.core},${.3 * F.flash})`); g.addColorStop(1, `rgba(${pal.core},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(F.origin.x, F.origin.y, 220, 0, 6.283); ctx.fill();
    }
  };
  F.frame = (now, dt) => { step(dt, now); draw(now); };
  F.size = () => { if (size()) { if (!F.P.length) seed(false); draw(performance.now()); } };

  // interação
  if (p.interactive) {
    const zone = host;
    const at = e => { const r = cv.getBoundingClientRect(); F.m.x = e.clientX - r.left; F.m.y = e.clientY - r.top; };
    zone.addEventListener('pointermove', e => { at(e); F.m.on = true; host.classList.add('field-touched'); if (REDUCED) draw(performance.now()); });
    zone.addEventListener('pointerleave', () => { F.m.on = false; });
    zone.addEventListener('pointerdown', e => {
      if (e.target.closest('a, button, input, select, textarea, label')) return;
      at(e); if (!REDUCED) pulse(F.m.x, F.m.y, false);
    });
    if (p.attract) $$(p.attract, host).forEach(b => {
      const on = () => { const r = b.getBoundingClientRect(), hr = cv.getBoundingClientRect(); F.att = { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, r: r.width / 2 + 18, s: 1 }; };
      b.addEventListener('pointerenter', on); b.addEventListener('focus', on);
      b.addEventListener('pointerleave', () => { F.att = null; }); b.addEventListener('blur', () => { F.att = null; });
    });
  }
  new ResizeObserver(() => F.size()).observe(cv);
  new IntersectionObserver(es => {
    F.visible = es[0].isIntersecting;
    if (F.visible && !F.entered && p.entrance) entrance();
  }, { threshold: .25 }).observe(cv);
  halorFields.push(F);
  F.size();
  if (p.entrance === 'load') requestAnimationFrame(() => entrance());
  return F;
}

let fieldLast = 0;
function fieldLoop(now) {
  const dt = Math.min(48, fieldLast ? now - fieldLast : 16.67); fieldLast = now;
  for (const F of halorFields) if (F.visible && F.W && F.P.length) F.frame(now, dt);
  requestAnimationFrame(fieldLoop);
}
function bootFields() {
  $$('canvas.halor-field').forEach(makeHalorField);
  if (!REDUCED) requestAnimationFrame(fieldLoop);
  document.addEventListener('halor:view', () => setTimeout(() => halorFields.forEach(F => F.size()), 40));
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-field-replay]'); if (!b) return;
    const F = halorFields.find(f => f.cv.dataset.field === b.dataset.fieldReplay); if (F) F.replay();
  });
}
