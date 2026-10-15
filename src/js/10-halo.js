/* ==========================================================================
   Campo de halos · arcos de luz neon em canvas (a assinatura visual da marca)
   Cada arco tem três passes: névoa larga, brilho médio e filamento branco.
   Opções de um preset, além de cx, cy, k (centro e escala) e arcs (um arco
   pode sair do centro comum com dx e dy, em unidades do raio):
     anchor  seletor cujo pé define a altura de referência da geometria, para
             que o filme logo abaixo do hero não mude o desenho dos arcos
     guard   seletor dos textos que nenhum arco pode cruzar. O campo apaga a
             luz sobre eles com uma máscara de borda suave (pad e fade, em px)
     sway    amplitude em radianos. Sem ela os arcos giram sem parar; com ela,
             vão e voltam e continuam do lado do layout onde foram desenhados
     fit     lista [largura máxima, ajustes]: a primeira faixa em que a tela
             cabe troca cx, cy, k ou arcs (o hero usa 560 e 860 px, como o CSS)
   ========================================================================== */
const HALO_PRESETS = {
  // hero: o domo de arcos mora na coluna da direita e balança sem invadir o texto.
  // A geometria vem do pé do bloco de texto (anchor), não do filme logo abaixo.
  // Até 859 px o texto ocupa a largura toda: o halo sobe para a faixa acima do título.
  hero:  { cx: .934, cy: 1.211, k: .869, sway: .3, stars: 80, anchor: '.s-hero-in', guard: '.s-hero-in > *', arcs: [
    { rx: .757, ry: .757, rot: -.648, s: 3.134, len: 2.595, w: 2.6, sp: .045, o: 1 },
    { rx: .937, ry: .458, rot: -.456, s: 3.678, len: 1.646, w: 1.6, sp: -.025, o: .8 },
    { rx: .318, ry: .318, rot: -.098, s: 2.597, len: 2.946, w: 1.4, sp: .07, o: .7 },
    { rx: 1.184, ry: .566, rot: -.466, s: 3.544, len: 1.754, w: 1.1, sp: .018, o: .55 } ],
    fit: [
      [560, { cx: .435, cy: .313, k: .726, sway: .25, arcs: [
        { rx: .973, ry: .934, rot: -.018, s: 3.667, len: 2.807, w: 2.2, sp: .045, o: 1 },
        { rx: 1.01, ry: .659, rot: .032, s: 3.6, len: 1.546, w: 1.4, sp: -.025, o: .8 },
        { rx: .898, ry: .877, rot: .235, s: 4.039, len: 2.102, w: 1.2, sp: .07, o: .7 } ] }],
      [860, { cx: .845, cy: -.056, k: .513, sway: .3, arcs: [
        { rx: .892, ry: .428, rot: -.407, s: 1.455, len: 2.945, w: 2.4, sp: .045, o: 1 },
        { rx: .948, ry: .632, rot: -.601, s: .737, len: 2.223, w: 1.5, sp: -.025, o: .8 },
        { rx: .642, ry: .429, rot: -.054, s: .093, len: 2.742, w: 1.3, sp: .07, o: .7 },
        { rx: 1.016, ry: .979, rot: -.529, s: .736, len: 3, w: 1.1, sp: .018, o: .55 } ] }] ] },
  // final: um halo aberto em volta do convite; no celular, um arco acima e outro abaixo.
  final: { cx: .5, cy: .52, k: .734, sway: .25, stars: 60, guard: '.s-final-in > *', arcs: [
    { rx: 1.14, ry: .54, rot: -.05, s: 4, len: 2.4, w: 2.4, sp: .03, o: 1 },
    { rx: 1.17, ry: .56, rot: .05, s: .35, len: 2.5, w: 1.4, sp: -.02, o: .7 },
    { rx: 1.2, ry: .56, rot: .18, s: 1.9, len: 2.6, w: 1.2, sp: .05, o: .6 } ],
    fit: [[560, { cx: .5, cy: .5, k: .734, sway: .25, arcs: [
        { rx: 1.5, ry: .8, rot: -.03, s: 4, len: 2, w: 2.2, sp: .03, o: 1 },
        { rx: 1.55, ry: .84, rot: .03, s: .35, len: 1.6, w: 1.4, sp: -.02, o: .7 },
        { rx: 1.6, ry: .84, rot: .08, s: 3.6, len: 1.4, w: 1.2, sp: .05, o: .6 } ] }]] },
  auth:  { cx: .5, cy: .46, k: .55, stars: 50, arcs: [
    { rx: .9, ry: .9, rot: -.4, s: 3.8, len: 2.0, w: 1.6, sp: .03, o: .55 },
    { rx: 1.2, ry: .6, rot: .5, s: 2.4, len: 1.6, w: 1.2, sp: -.02, o: .45 } ] },
  sum:   { cx: 1.05, cy: -.05, k: .9, stars: 0, arcs: [
    { rx: .55, ry: .55, rot: 0, s: 1.4, len: 2.2, w: 1.6, sp: .05, o: .8 },
    { rx: .8, ry: .8, rot: 0, s: 1.7, len: 1.6, w: 1, sp: -.03, o: .5 } ] },
  // brand: capa do manual. Arcos à direita do logo, longe da versão no topo.
  brand: { cx: .99, cy: .639, k: .471, sway: .3, stars: 70, guard: '.b-cover-top > *, .b-hero-logo, .b-claim, .b-cover-in > .lede', arcs: [
    { rx: .709, ry: .532, rot: .384, s: .622, len: 3, w: 2.4, sp: .045, o: 1 },
    { rx: 1.181, ry: .62, rot: .429, s: 2.333, len: 1.795, w: 1.5, sp: -.025, o: .8 },
    { rx: .996, ry: .71, rot: -.53, s: 2.413, len: 3, w: 1.3, sp: .07, o: .7 },
    { rx: .505, ry: .317, rot: -.316, s: 2.348, len: 3, w: 1.1, sp: .018, o: .55 } ],
    fit: [[560, { cx: 1.154, cy: .368, k: .5, sway: .2, arcs: [
        { rx: .73, ry: .73, rot: 0, s: 3, len: 1.55, w: 2.2, sp: .04, o: 1 },
        { rx: 1.46, ry: .66, rot: 0, s: .4, len: 2.2, w: 1.4, sp: -.02, o: .7, dx: -.99, dy: -1.62 },
        { rx: .58, ry: .58, rot: 0, s: 3.05, len: 1.2, w: 1.2, sp: .06, o: .6 } ] }]] },
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

/* Retângulo da máscara: miolo cheio e borda que esmaece em fd px, com cantos
   redondos. Coordenadas em pixels do canvas, já inteiras, para não deixar fresta. */
function haloSoftRect(c, x0, y0, x1, y1, fd) {
  const fade = (g, x, y, w, h) => { g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x, y, w, h); };
  c.fillStyle = '#000'; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  fade(c.createLinearGradient(0, y0, 0, y0 - fd), x0, y0 - fd, x1 - x0, fd);
  fade(c.createLinearGradient(0, y1, 0, y1 + fd), x0, y1, x1 - x0, fd);
  fade(c.createLinearGradient(x0, 0, x0 - fd, 0), x0 - fd, y0, fd, y1 - y0);
  fade(c.createLinearGradient(x1, 0, x1 + fd, 0), x1, y0, fd, y1 - y0);
  for (const [x, y, sx, sy] of [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]])
    fade(c.createRadialGradient(x, y, 0, x, y, fd), sx < 0 ? x - fd : x, sy < 0 ? y - fd : y, fd, fd);
}

/* Altura de referência: o pé do bloco de texto (anchor), não o pé do canvas. */
function haloRef(f) {
  f.hr = f.h;
  const a = f.p.anchor && $(f.p.anchor, f.cv.parentElement); if (!a) return;
  const b = a.getBoundingClientRect().bottom - f.cv.getBoundingClientRect().top;
  if (b > 0) f.hr = Math.min(f.h, b);
}

/* Retângulos dos textos protegidos, em px do canvas. Usa as caixas de linha
   (Range), não a caixa do bloco: um H1 com max-width em ch é bem mais largo
   que as palavras dentro dele. */
function haloGuardRects(f) {
  if (!f.p.guard) return [];
  const cr = f.cv.getBoundingClientRect(), out = [], rg = document.createRange();
  for (const n of $$(f.p.guard, f.cv.parentElement)) {
    if (!n.getClientRects().length) continue;
    rg.selectNodeContents(n);
    for (const r of rg.getClientRects()) if (r.width > 1 && r.height > 1) out.push({ x0: r.left - cr.left, y0: r.top - cr.top, x1: r.right - cr.left, y1: r.bottom - cr.top });
  }
  return out;
}

/* Máscara de proteção: apaga a luz dos arcos sobre cada texto do guard. */
function haloMask(f) {
  f.mask = null;
  const rects = haloGuardRects(f); if (!rects.length) return;
  const d = f.dpr, m = f.maskCv || (f.maskCv = document.createElement('canvas'));
  m.width = f.cv.width; m.height = f.cv.height;
  const c = m.getContext('2d'), pad = (f.p.pad ?? 16) * d, fd = Math.round((f.p.fade ?? 48) * d);
  c.clearRect(0, 0, m.width, m.height);
  for (const r of rects) haloSoftRect(c, Math.floor(r.x0 * d - pad), Math.floor(r.y0 * d - pad), Math.ceil(r.x1 * d + pad), Math.ceil(r.y1 * d + pad), fd);
  f.mask = m;
}

function initHaloField(cv) {
  const base = HALO_PRESETS[cv.dataset.halo] || HALO_PRESETS.hero;
  const f = { cv, ctx: cv.getContext('2d'), base, p: base, stars: makeStars(base.stars), w: 0, h: 0, hr: 0, dpr: 1, mask: null, visible: false, t0: performance.now() };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    f.w = cv.clientWidth; f.h = cv.clientHeight;
    if (!f.w || !f.h) return;
    f.dpr = dpr;
    const fit = base.fit && base.fit.find(([max]) => f.w < max);
    f.p = fit ? { ...base, ...fit[1] } : base;
    cv.width = Math.round(f.w * dpr); cv.height = Math.round(f.h * dpr);
    f.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    haloRef(f); haloMask(f);
    drawHaloField(f, REDUCED ? 0 : (performance.now() - f.t0) / 1000);
  };
  f.resize = resize;
  new ResizeObserver(resize).observe(cv);
  new IntersectionObserver(es => { f.visible = es[0].isIntersecting; }).observe(cv);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
  haloFields.push(f);
  resize();
}
function drawHaloField(f, t) {
  const { ctx, w, h, p } = f; if (!w || !h) return;
  const hr = f.hr || h, sw = p.sway, op = p.paper ? 'source-over' : 'lighter';
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = op;
  // com sway, o arco balança em volta da posição inicial em vez de dar a volta inteira
  const R = Math.hypot(w, hr) * .5 * p.k;
  for (const a of p.arcs) drawHaloArc(ctx, p.cx * w + (a.dx || 0) * R, p.cy * hr + (a.dy || 0) * R, R, sw ? { ...a, s: a.s + sw * Math.sin(t * a.sp / sw) } : a, sw ? 0 : t, p.paper);
  if (f.mask) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = 1; ctx.drawImage(f.mask, 0, 0);
    ctx.restore();
  }
  for (const s of f.stars) {
    const a = .25 + .35 * Math.sin(t * s.s + s.p);
    ctx.globalAlpha = Math.max(0, a); ctx.fillStyle = '#e9deff';
    ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, 6.283); ctx.fill();
  }
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
