/* ==========================================================================
   BIA · tabelas de pose e rosto da mascote · rig v2 (valores numéricos, sem unidade)
   O motor interpola valor a valor (350 ms, --ease-halo) e escreve as variáveis no .bia; o CSS (20-bia.css) converte.
   Convenções em 20-bia.css. Lados = lados do ESPECTADOR (l = lupa / palmas, r = tablet / clicker / varinha).
   Skins: data-skin="cliente" no host (mesmas poses e rostos; corpo lilás, óculos, gravatinha, sem halo).
   ========================================================================== */
const BIA = {
  poseVars: ['--arm-l', '--arm-r', '--fore-l', '--fore-r', '--lean', '--hop', '--squash',
             '--wave', '--sway', '--point-l', '--point-r', '--stamp-press', '--ring-y',
             '--carry', '--face-x', '--face-y', '--squint', '--halo-y'],
  faceVars: ['--brow-l', '--brow-r', '--brow-ang', '--eye-x', '--eye-y', '--eye-open', '--eye-happy', '--wink', '--eye-glow',
             '--mouth-smile', '--mouth-open', '--mouth-flat', '--mouth-o', '--mouth-sad', '--cheek', '--glow', '--eye-scale'],
  propVars: ['--p-stamp', '--p-tablet', '--p-clicker', '--p-lens', '--p-wand', '--p-ring', '--p-bubble'],
  /* data-props="tablet clicker" → --p-tablet:1 --p-clicker:1 (os outros 0).
     "stamp"/"carimbo" e "clipboard"/"prancheta" continuam aceitos: o carimbo não existe mais (nada aparece) e a prancheta virou o tablet. */
  props: {
    stamp: '--p-stamp', carimbo: '--p-stamp',
    tablet: '--p-tablet', clipboard: '--p-tablet', prancheta: '--p-tablet',
    clicker: '--p-clicker', controle: '--p-clicker',
    lens: '--p-lens', lupa: '--p-lens',
    wand: '--p-wand', varinha: '--p-wand',
    ring: '--p-ring', anel: '--p-ring',
    bubble: '--p-bubble', balao: '--p-bubble', 'balão': '--p-bubble',
  },

  /*                 arm-l  arm-r  fore-l fore-r lean  hop  squash wave sway pt-l pt-r press ring-y carry face-x face-y squint halo-y */
  poses: {
    idle:        biaPose(  -18,   -10,    80,   100,    0,    0,    0,    0,   0,   0,   0,   0,   90,   0,    0,    0,    0,   42),
    wave:        biaPose(  -18,  -150,    80,   -20,   -3,    0,    0,    1,   0,   0,   0,   0,   90,   0,    0,    0,    0,   42),
    'point-left':biaPose(  -88,   -10,     2,   100,   -4,    0,    0,    0,   0,   1,   0,   0,   90,   0,   -2,    0,    0,   42),
    'point-right':biaPose( -18,   -88,    80,     2,    4,    0,    0,    0,   0,   0,   1,   0,   90,   0,    2,    0,    0,   42),
    present:     biaPose(  -66,   -66,   -24,   -24,    0,    0,    0,    0,   0,   0,   0,   0,   90,   0,    0,    0,    0,   42),
    /* stamp = ergue a mão (anticipação) · stamp-down = bate palmas na frente do corpo, com onda de luz (--stamp-press) */
    stamp:       biaPose( -160,   -10,    40,   100,    3,    0,    0,    0,   0,   0,   0,   0,   90,   0,    0,    0,    0,   42),
    'stamp-down':biaPose(   16,    16,    78,    78,    0,    0,  .18,    0,   0,   0,   0,   1,   90,   0,    0,    2,    0,   44),
    'hold-ring': biaPose( -165,  -165,   -15,   -15,    0,    0,    0,    0,   0,   0,   0,   0,   90,   0,    0,    0,    0,   42),
    cheer:       biaPose( -145,  -145,   -25,   -25,    0,  -26,    0,    0,   0,   0,   0,   0,   90,   0,    0,   -2,    0,   40),
    think:       biaPose(  -18,    40,    80,   115,    3,    0,    0,    0,   0,   0,   0,   0,   90,   0,    2,    0,    0,   42),
    peek:        biaPose(  -30,   -10,    64,    96,  -14,    0,    0,    0,   0,   0,   0,   0,   90,   0,   -3,    0,    0,   42),
    walk:        biaPose(  -18,   -18,    50,    50,    0,   -4,    0,    0,   1,   0,   0,   0,   90,   0,    0,    0,    0,   42),
    /* novas */
    carry:       biaPose(   10,    10,    75,    75,    0,    0,    0,    0,   0,   0,   0,   0,   90,   1,    0,    0,    0,   42),
    'look-up':   biaPose(  -30,   -30,    60,    60,    0,    0, -.08,    0,   0,   0,   0,   0,   90,   0,    0,   -8,    0,   34),
    jump:        biaPose( -120,  -120,   -40,   -40,    0,  -60, -.14,    0,   0,   0,   0,   0,   90,   0,    0,   -3,    0,   38),
    bow:         biaPose(  -40,   -40,    10,    10,    0,    0,  .22,    0,   0,   0,   0,   0,   90,   0,    0,   14,    0,   52),
    celebrate:   biaPose( -150,  -150,   -30,   -30,    0,  -40, -.08,    0,   0,   0,   0,   0,   90,   0,    0,   -6,    0,   36),
    'hands-hips':biaPose(  -55,   -55,   105,   105,    0,    0,    0,    0,   0,   0,   0,   0,   90,   0,    0,    0,    0,   42),
    'lens-look': biaPose( -126,   -10,   229,   100,    2,    0,    0,    0,   0,   0,   0,   0,   90,   0,    0,    0,    1,   42),
  },

  /*               brow-l brow-r ang   eye-x eye-y open happy wink glow-eye smile open flat  o   sad  cheek glow eye-scale */
  faces: {
    happy:     biaFace(   0,    0,    4,    0,    0,   1,   0,   0,  0,    1,   0,   0,   0,   0,  .6,  0,   1),
    wow:       biaFace(   1,    1,   -2,    0,  -.2,   1,   0,   0,  0,    0,   0,   0,   1,   0,  .4,  0,   1.06),
    proud:     biaFace(  .3,   .3,    2,    0,    0,   1,   1,   0,  0,    0,   1,   0,   0,   0,  .9,  0,   1),
    think:     biaFace(  .9, -.15,   -6,   .7,  -.7,   1,   0,   0,  0,    0,   0,  .8,   0,   0,  .2,  0,   1),
    oops:      biaFace( -.3,   .7,  -14,  -.6,   .2,   1,   0,   0,  0,    0,   0,   0,  .7,  .4,  .7,  0,   1),
    wink:      biaFace(   0,   .4,    4,   .2,    0,   1,   0,   1,  0,    1,   0,   0,   0,   0,  .8,  0,   1),
    focus:     biaFace(   0,    0,   16,    0,    0,  .9,   0,   0,  1,   .6,   0,  .3,   0,   0,  .3,  1,   1),
    sleepy:    biaFace( -.5,  -.5,   -6,   .1,   .3,  .4,   0,   0,  0,    0,   0,  .6,  .3,   0,  .3,  0,   1),
    /* novos */
    laugh:     biaFace(  .6,   .6,    2,    0,    0,   1,   1,   0,  0,    0,   1,   0,   0,   0,   1,  0,   1),
    surprised: biaFace(   1,    1,   -4,    0,  -.1,   1,   0,   0,  0,    0,   0,   0,  .6,   0,  .3,  0,   1.28),
  },

  /* · utilidades (o motor pode usar ou não) · */
  get vars() { return this.poseVars.concat(this.faceVars, this.propVars); },
  noProps() { const o = {}; this.propVars.forEach(v => { o[v] = 0; }); return o; },
  defaults() { return Object.assign({}, this.poses.idle, this.faces.happy, this.noProps()); },
  lerp(a, b, k) { const o = {}; for (const n in a) o[n] = n in b ? a[n] + (b[n] - a[n]) * k : a[n]; for (const n in b) if (!(n in o)) o[n] = b[n]; return o; },
  apply(el, vars) { for (const n in vars) el.style.setProperty(n, String(+vars[n].toFixed ? +vars[n].toFixed(4) : vars[n])); },
  propsOf(str) { const o = this.noProps(); (str || '').split(/\s+/).forEach(w => { const v = this.props[w.toLowerCase()]; if (v) o[v] = 1; }); return o; },
  /* clona o template dentro do host (idempotente) */
  mount(el) { if (!el.querySelector('.bia-svg')) { const t = document.getElementById('bia-tpl'); if (t) el.appendChild(t.content.firstElementChild.cloneNode(true)); } return el; },
};
function biaPose(al, ar, fl, fr, lean, hop, squash, wave, sway, ptl, ptr, press, ringy, carry, fx, fy, squint, haloy) {
  return { '--arm-l': al, '--arm-r': ar, '--fore-l': fl, '--fore-r': fr, '--lean': lean, '--hop': hop, '--squash': squash,
           '--wave': wave, '--sway': sway, '--point-l': ptl, '--point-r': ptr, '--stamp-press': press, '--ring-y': ringy,
           '--carry': carry, '--face-x': fx, '--face-y': fy, '--squint': squint, '--halo-y': haloy };
}
function biaFace(bl, br, ang, ex, ey, open, happy, wink, eglow, smile, mopen, flat, o, sad, cheek, glow, escale) {
  return { '--brow-l': bl, '--brow-r': br, '--brow-ang': ang, '--eye-x': ex, '--eye-y': ey, '--eye-open': open, '--eye-happy': happy, '--wink': wink, '--eye-glow': eglow,
           '--mouth-smile': smile, '--mouth-open': mopen, '--mouth-flat': flat, '--mouth-o': o, '--mouth-sad': sad, '--cheek': cheek, '--glow': glow, '--eye-scale': escale };
}
if (typeof window !== 'undefined') window.BIA = BIA;
