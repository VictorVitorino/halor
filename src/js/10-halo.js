/* ==========================================================================
   Campo de halos · arcos de luz neon em canvas (a assinatura visual da marca)
   Cada arco tem três passes: névoa larga, brilho médio e filamento branco.
   ========================================================================== */
const HALO_PRESETS = {
  hero:  { cx: .8,  cy: .34, k: .62, stars: 80, arcs: [
    { rx: .62, ry: .62, rot: -.6, s: 3.5, len: 2.7, w: 2.6, sp: .045, o: 1 },
    { rx: .9,  ry: .44, rot: -.32, s: 3.0, len: 2.1, w: 1.6, sp: -.025, o: .8 },
    { rx: .42, ry: .42, rot: .3,  s: 4.1, len: 2.0, w: 1.4, sp: .07, o: .7 },
    { rx: 1.15, ry: .55, rot: -.18, s: 2.7, len: 1.3, w: 1.1, sp: .018, o: .55 } ] },
  final: { cx: .5, cy: 1.15, k: .7, stars: 60, arcs: [
    { rx: .85, ry: .85, rot: 0, s: 3.6, len: 2.2, w: 2.4, sp: .03, o: 1 },
    { rx: 1.05, ry: .7, rot: .1, s: 3.9, len: 1.6, w: 1.4, sp: -.02, o: .7 },
    { rx: .6, ry: .6, rot: -.1, s: 4.2, len: 1.2, w: 1.2, sp: .05, o: .6 } ] },
  auth:  { cx: .5, cy: .46, k: .55, stars: 50, arcs: [
    { rx: .9, ry: .9, rot: -.4, s: 3.8, len: 2.0, w: 1.6, sp: .03, o: .55 },
    { rx: 1.2, ry: .6, rot: .5, s: 2.4, len: 1.6, w: 1.2, sp: -.02, o: .45 } ] },
  sum:   { cx: 1.05, cy: -.05, k: .9, stars: 0, arcs: [
    { rx: .55, ry: .55, rot: 0, s: 1.4, len: 2.2, w: 1.6, sp: .05, o: .8 },
    { rx: .8, ry: .8, rot: 0, s: 1.7, len: 1.6, w: 1, sp: -.03, o: .5 } ] },
  brand: { cx: .82, cy: .5, k: .7, stars: 70, arcs: [
    { rx: .58, ry: .58, rot: -.5, s: 3.3, len: 2.9, w: 2.4, sp: .04, o: 1 },
    { rx: .85, ry: .42, rot: -.25, s: 3.1, len: 2.0, w: 1.4, sp: -.02, o: .7 },
    { rx: .36, ry: .36, rot: .3, s: 4.0, len: 2.2, w: 1.3, sp: .06, o: .6 } ] },
  paper: { cx: .9, cy: .2, k: .72, stars: 0, paper: true, arcs: [
    { rx: .5, ry: .5, rot: -.5, s: 3.2, len: 3.1, w: 2.2, sp: .035, o: 1 },
    { rx: .74, ry: .38, rot: -.3, s: 3.0, len: 2.2, w: 1.2, sp: -.02, o: .7 },
    { rx: .3, ry: .3, rot: .4, s: 4.0, len: 2.4, w: 1, sp: .06, o: .6 } ] },
  nf:    { cx: .5, cy: .5, k: .6, stars: 90, arcs: [
    { rx: .7, ry: .7, rot: 0, s: 0, len: 1.4, w: 1.6, sp: .12, o: .7 },
    { rx: .95, ry: .5, rot: .4, s: 2, len: 1.2, w: 1.2, sp: -.06, o: .5 } ] }
};

function makeStars(n) { const a = []; for (let i = 0; i < n; i++) a.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + .2, p: Math.random() * 6.28, s: Math.random() * .8 + .2 }); return a; }

function drawHaloArc(ctx, cx, cy, R, a, t, paper) {
  const s = a.s + t * a.sp, len = a.len, rx = a.rx * R, ry = a.ry * R;
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(a.rot);
  let stroke = 'rgba(169,112,255,.85)';
  if (paper && ctx.createConicGradient) {
    const g = ctx.createConicGradient(s, 0, 0), f = Math.min(len / (Math.PI * 2), .999);
    g.addColorStop(0, 'rgba(196,166,255,0)'); g.addColorStop(f * .3, 'rgba(139,61,255,.55)'); g.addColorStop(f * .72, 'rgba(122,46,240,.95)');
    g.addColorStop(f * .86, 'rgba(201,166,255,.7)'); g.addColorStop(f, 'rgba(196,166,255,0)'); g.addColorStop(1, 'rgba(196,166,255,0)');
    stroke = g;
  } else if (ctx.createConicGradient) {
    const g = ctx.createConicGradient(s, 0, 0), f = Math.min(len / (Math.PI * 2), .999);
    g.addColorStop(0, 'rgba(90,53,168,0)');
    g.addColorStop(f * .3, 'rgba(139,61,255,.85)');
    g.addColorStop(f * .72, 'rgba(255,255,255,1)');
    g.addColorStop(f * .86, 'rgba(201,166,255,.85)');
    g.addColorStop(f, 'rgba(139,61,255,0)');
    g.addColorStop(1, 'rgba(139,61,255,0)');
    stroke = g;
  }
  ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, s, s + len);
  ctx.lineCap = 'round'; ctx.strokeStyle = stroke;
  ctx.globalAlpha = (paper ? .1 : .12) * a.o; ctx.lineWidth = a.w * 16; ctx.stroke();
  ctx.globalAlpha = (paper ? .25 : .4) * a.o; ctx.lineWidth = a.w * 4.5; ctx.shadowColor = paper ? 'rgba(169,112,255,.6)' : 'rgba(139,61,255,1)'; ctx.shadowBlur = 26; ctx.stroke();
  ctx.globalAlpha = a.o; ctx.lineWidth = a.w; ctx.shadowColor = paper ? 'rgba(201,166,255,.8)' : 'rgba(244,238,255,.9)'; ctx.shadowBlur = 6; ctx.stroke();
  if (paper) { ctx.restore(); return; }
  // ponto quente (o "flare")
  const th = s + len * .72, hx = rx * Math.cos(th), hy = ry * Math.sin(th), hr = a.w * 22;
  const rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
  rg.addColorStop(0, 'rgba(255,255,255,.9)'); rg.addColorStop(.25, 'rgba(201,166,255,.45)'); rg.addColorStop(1, 'rgba(139,61,255,0)');
  ctx.shadowBlur = 0; ctx.globalAlpha = a.o; ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

const haloFields = [];
function initHaloField(cv) {
  const p = HALO_PRESETS[cv.dataset.halo] || HALO_PRESETS.hero;
  const f = { cv, ctx: cv.getContext('2d'), p, stars: makeStars(p.stars), w: 0, h: 0, visible: false, t0: performance.now() };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    f.w = cv.clientWidth; f.h = cv.clientHeight;
    if (!f.w || !f.h) return;
    cv.width = Math.round(f.w * dpr); cv.height = Math.round(f.h * dpr);
    f.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawHaloField(f, REDUCED ? 0 : (performance.now() - f.t0) / 1000);
  };
  f.resize = resize;
  new ResizeObserver(resize).observe(cv);
  new IntersectionObserver(es => { f.visible = es[0].isIntersecting; }).observe(cv);
  haloFields.push(f);
  resize();
}
function drawHaloField(f, t) {
  const { ctx, w, h, p } = f; if (!w || !h) return;
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = p.paper ? 'source-over' : 'lighter';
  for (const s of f.stars) {
    const a = .25 + .35 * Math.sin(t * s.s + s.p);
    ctx.globalAlpha = Math.max(0, a); ctx.fillStyle = '#e9deff';
    ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, 6.283); ctx.fill();
  }
  const R = Math.hypot(w, h) * .5 * p.k;
  for (const a of p.arcs) drawHaloArc(ctx, p.cx * w, p.cy * h, R, a, t, p.paper);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}
function haloLoop(now) {
  for (const f of haloFields) if (f.visible && f.w) drawHaloField(f, (now - f.t0) / 1000);
  requestAnimationFrame(haloLoop);
}
function bootHalos() {
  $$('canvas.halo-field').forEach(initHaloField);
  if (!REDUCED) requestAnimationFrame(haloLoop);
  document.addEventListener('halor:view', () => setTimeout(() => haloFields.forEach(f => f.resize()), 30));
}
