/* ==========================================================================
   BIA · tabelas de pose e rosto da mascote (valores numéricos, sem unidade)
   O motor interpola valor a valor (350 ms, --ease-halo) e escreve as variáveis no .bia; o CSS (20-bia.css) converte.
   Convenções em 20-bia.css. Lados = lados do ESPECTADOR (l = carimbo, r = prancheta).
   ========================================================================== */
const BIA = {
  poseVars: ['--arm-l', '--arm-r', '--fore-l', '--fore-r', '--lean', '--hop', '--squash',
             '--wave', '--sway', '--point-l', '--point-r', '--stamp-press', '--ring-y'],
  faceVars: ['--brow-l', '--brow-r', '--brow-ang', '--eye-x', '--eye-y', '--eye-open', '--eye-happy', '--wink', '--eye-glow',
             '--mouth-smile', '--mouth-open', '--mouth-flat', '--mouth-o', '--mouth-sad', '--cheek', '--glow'],
  propVars: ['--p-stamp', '--p-clip', '--p-ring', '--p-wand'],
  /* data-props="clipboard stamp" → --p-clip:1 --p-stamp:1 (os outros 0) */
  props: { stamp: '--p-stamp', carimbo: '--p-stamp', clipboard: '--p-clip', prancheta: '--p-clip', ring: '--p-ring', anel: '--p-ring', wand: '--p-wand', varinha: '--p-wand' },

  /*                 arm-l  arm-r  fore-l fore-r lean  hop  squash wave sway pt-l pt-r press ring-y */
  poses: {
    idle:        biaPose(  -18,   -10,    80,   100,    0,    0,   0,     0,   0,   0,   0,   0,   90),
    wave:        biaPose(  -18,  -150,    80,   -20,   -3,    0,   0,     1,   0,   0,   0,   0,   90),
    'point-left':biaPose(  -88,   -10,     2,   100,   -4,    0,   0,     0,   0,   1,   0,   0,   90),
    'point-right':biaPose( -18,   -88,    80,     2,    4,    0,   0,     0,   0,   0,   1,   0,   90),
    present:     biaPose(  -66,   -66,   -24,   -24,    0,    0,   0,     0,   0,   0,   0,   0,   90),
    stamp:       biaPose( -175,   -10,    60,   100,    3,    0,   0,     0,   0,   0,   0,   0,   90),
    'stamp-down':biaPose(  -30,   -10,    30,   100,   -4,    0,  .25,    0,   0,   0,   0,   1,   90),
    'hold-ring': biaPose( -165,  -165,   -15,   -15,    0,    0,   0,     0,   0,   0,   0,   0,   90),
    cheer:       biaPose( -145,  -145,   -25,   -25,    0,  -26,   0,     0,   0,   0,   0,   0,   90),
    think:       biaPose(  -18,    40,    80,   115,    3,    0,   0,     0,   0,   0,   0,   0,   90),
    peek:        biaPose(  -30,   -10,    64,    96,  -14,    0,   0,     0,   0,   0,   0,   0,   90),
    walk:        biaPose(  -18,   -18,    50,    50,    0,   -4,   0,     0,   1,   0,   0,   0,   90),
  },

  /*               brow-l brow-r ang   eye-x eye-y open happy wink glow-eye smile open flat  o   sad  cheek glow */
  faces: {
    happy:  biaFace(   0,    0,    4,    0,    0,   1,   0,   0,  0,    1,   0,   0,   0,   0,  .6,  0),
    wow:    biaFace(   1,    1,   -2,    0,  -.2,   1,   0,   0,  0,    0,   0,   0,   1,   0,  .4,  0),
    proud:  biaFace(  .3,   .3,    2,    0,    0,   1,   1,   0,  0,    0,   1,   0,   0,   0,  .9,  0),
    think:  biaFace(  .9, -.15,   -6,   .7,  -.7,   1,   0,   0,  0,    0,   0,  .8,   0,   0,  .2,  0),
    oops:   biaFace( -.3,   .7,  -14,  -.6,   .2,   1,   0,   0,  0,    0,   0,   0,  .7,  .4,  .7,  0),
    wink:   biaFace(   0,   .4,    4,   .2,    0,   1,   0,   1,  0,    1,   0,   0,   0,   0,  .8,  0),
    focus:  biaFace(   0,    0,   16,    0,    0,  .9,   0,   0,  1,   .6,   0,  .3,   0,   0,  .3,  1),
    sleepy: biaFace( -.5,  -.5,   -6,   .1,   .3,  .4,   0,   0,  0,    0,   0,  .6,  .3,   0,  .3,  0),
  },

  /* · utilidades (o motor pode usar ou não) · */
  get vars() { return this.poseVars.concat(this.faceVars, this.propVars); },
  defaults() { return Object.assign({}, this.poses.idle, this.faces.happy, { '--p-stamp': 0, '--p-clip': 0, '--p-ring': 0, '--p-wand': 0 }); },
  lerp(a, b, k) { const o = {}; for (const n in a) o[n] = n in b ? a[n] + (b[n] - a[n]) * k : a[n]; for (const n in b) if (!(n in o)) o[n] = b[n]; return o; },
  apply(el, vars) { for (const n in vars) el.style.setProperty(n, String(+vars[n].toFixed ? +vars[n].toFixed(4) : vars[n])); },
  propsOf(str) { const o = { '--p-stamp': 0, '--p-clip': 0, '--p-ring': 0, '--p-wand': 0 }; (str || '').split(/\s+/).forEach(w => { const v = this.props[w.toLowerCase()]; if (v) o[v] = 1; }); return o; },
  /* clona o template dentro do host (idempotente) */
  mount(el) { if (!el.querySelector('.bia-svg')) { const t = document.getElementById('bia-tpl'); if (t) el.appendChild(t.content.firstElementChild.cloneNode(true)); } return el; },
};
function biaPose(al, ar, fl, fr, lean, hop, squash, wave, sway, ptl, ptr, press, ringy) {
  return { '--arm-l': al, '--arm-r': ar, '--fore-l': fl, '--fore-r': fr, '--lean': lean, '--hop': hop, '--squash': squash,
           '--wave': wave, '--sway': sway, '--point-l': ptl, '--point-r': ptr, '--stamp-press': press, '--ring-y': ringy };
}
function biaFace(bl, br, ang, ex, ey, open, happy, wink, eglow, smile, mopen, flat, o, sad, cheek, glow) {
  return { '--brow-l': bl, '--brow-r': br, '--brow-ang': ang, '--eye-x': ex, '--eye-y': ey, '--eye-open': open, '--eye-happy': happy, '--wink': wink, '--eye-glow': eglow,
           '--mouth-smile': smile, '--mouth-open': mopen, '--mouth-flat': flat, '--mouth-o': o, '--mouth-sad': sad, '--cheek': cheek, '--glow': glow };
}
if (typeof window !== 'undefined') window.BIA = BIA;
