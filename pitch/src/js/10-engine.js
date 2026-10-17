/* ==========================================================================
   PITCH HALOR · motor
   Um relógio só (--t em ms). Ao vivo, o relógio anda com o rAF (ou com o áudio da narração,
   que vira o mestre quando está tocando). No render (?render=1), quem chama seek(T) manda.
   Tudo que aparece na tela é função de T: cenas, legenda, chip, mascote e o Campo Halor
   (partículas com semente e passo fixo), por isso cada quadro do vídeo é reproduzível.
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const easeHalo = k => 1 - Math.pow(1 - k, 2.4);            /* próximo de cubic-bezier(.22,.61,.36,1) */
const easeSpark = k => { const c = 1.70158; const x = k - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
const Q = new URLSearchParams(location.search);
const RENDER = Q.get('render') === '1';
const FPS = +Q.get('fps') || 30;
const STEP = 1000 / 60;                                     /* passo fixo da física do campo */

/* ------------------------------------------------------------------ PRNG */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ------------------------------------------------------------------ CAMPO HALOR */
function makeField(cv) {
  const W = 1920, H = 1080, ctx = cv.getContext('2d');
  const pal = { line: '169,112,255', link: '244,238,255', dot: 'rgba(201,166,255,.85)', hot: '#ffffff', glow: 'rgba(139,61,255,.22)', ring: '244,238,255', core: '201,166,255' };
  const F = { P: [], pulses: [], flash: 0, origin: { x: W / 2, y: H / 2 }, m: { x: 0, y: 0, on: false, k: 0 }, att: null, age: 0, calm: [], rnd: mulberry32(7), seed: 7 };
  const calmHit = (x, y) => { for (const c of F.calm) if (x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h) return true; return false; };
  const seed = burst => {
    const r = F.rnd, n = 150, o = F.origin;
    F.P = Array.from({ length: n }, () => {
      let hx = r() * W, hy = r() * H;
      for (let k = 6; k > 0 && calmHit(hx, hy); k--) { hx = r() * W; hy = r() * H; }
      const q = { x: hx, y: hy, hx, hy, vx: 0, vy: 0, bx: (r() - .5) * .3, by: (r() - .5) * .3, r: .7 + r() * 1.9, ph: r() * 6.283 };
      if (burst) { const a = r() * 6.283, s = r() * 8; q.x = o.x + Math.cos(a) * s; q.y = o.y + Math.sin(a) * s; q.vx = (hx - q.x) * .055; q.vy = (hy - q.y) * .055; }
      return q;
    });
  };
  F.reset = (s, calm) => { F.seed = s; F.rnd = mulberry32(s); F.calm = calm || []; F.pulses = []; F.flash = 0; F.age = 0; seed(false); };
  F.entrance = (origin, s, calm) => { F.origin = origin || { x: W / 2, y: H / 2 }; F.reset(s || 7, calm); seed(true); F.pulses = [{ x: F.origin.x, y: F.origin.y, t: 0, brand: true }]; F.flash = 1; };
  F.pulse = (x, y, brand) => { F.pulses.push({ x, y, t: 0, brand: !!brand }); };
  F.step = dt => {
    const k = dt / 16.67, fr = Math.pow(.948, k);
    F.age += dt;
    F.pulses.forEach(q => { q.t += dt / (q.brand ? 1500 : 1100); });
    F.pulses = F.pulses.filter(q => q.t < 1);
    F.flash = Math.max(0, F.flash - dt / 600);
    F.m.k += ((F.m.on ? 1 : 0) - F.m.k) * Math.min(1, dt / 220);
    const maxR = Math.hypot(W, H) * .62, halos = [];
    if (F.m.k > .02) halos.push({ x: F.m.x, y: F.m.y, r: 96, s: F.m.k });
    if (F.att) halos.push(F.att);
    for (const q of F.P) {
      for (const h of halos) {
        const dx = q.x - h.x, dy = q.y - h.y, d = Math.hypot(dx, dy) || 1, R = h.r * 2.1;
        if (d < R) { const fall = 1 - d / R, s = h.s * k, pull = (h.r - d) * .018 * fall * s; q.vx += dx / d * pull; q.vy += dy / d * pull; q.vx += -dy / d * .28 * fall * s; q.vy += dx / d * .28 * fall * s; }
      }
      for (const c of F.calm) if (q.x > c.x && q.x < c.x + c.w && q.y > c.y && q.y < c.y + c.h) {
        const cx = c.x + c.w / 2, cy = c.y + c.h / 2, dx = q.x - cx, dy = q.y - cy, d = Math.hypot(dx, dy) || 1;
        q.vx += dx / d * .018 * k; q.vy += dy / d * .018 * k;
      }
      for (const w of F.pulses) {
        const dx = q.x - w.x, dy = q.y - w.y, d = Math.hypot(dx, dy) || 1, band = Math.abs(d - w.t * maxR);
        if (band < 40) { const f = (1 - band / 40) * 1.7 * (1 - w.t) * k; q.vx += dx / d * f; q.vy += dy / d * f; }
      }
      q.vx *= fr; q.vy *= fr;
      q.x += (q.vx + q.bx) * k; q.y += (q.vy + q.by) * k;
      if (q.x < -14) q.x = W + 14; else if (q.x > W + 14) q.x = -14;
      if (q.y < -14) q.y = H + 14; else if (q.y > H + 14) q.y = -14;
    }
    F.halos = halos;
  };
  const brandHalo = (x, y, r, a, lw) => {
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${pal.ring},${a})`; ctx.lineWidth = lw; ctx.shadowColor = `rgba(${pal.core},1)`; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(x, y, r, -25 * Math.PI / 180, 295 * Math.PI / 180); ctx.stroke();
    const sx = x + r * Math.cos(-Math.PI / 4), sy = y + r * Math.sin(-Math.PI / 4), sr = Math.max(4, lw * 2.6);
    ctx.fillStyle = `rgba(${pal.ring},${Math.min(1, a * 1.3)})`;
    ctx.beginPath(); ctx.moveTo(sx, sy - sr); ctx.quadraticCurveTo(sx, sy, sx + sr, sy); ctx.quadraticCurveTo(sx, sy, sx, sy + sr); ctx.quadraticCurveTo(sx, sy, sx - sr, sy); ctx.quadraticCurveTo(sx, sy, sx, sy - sr); ctx.fill();
    ctx.restore();
  };
  F.draw = () => {
    const t = F.age / 1000;
    ctx.clearRect(0, 0, W, H);
    const breathe = Math.sin(t * .9), L = 118 * (1 + .07 * breathe), L2 = L * L, B = [[], [], [], []], P = F.P;
    for (let i = 0; i < P.length; i++) { const a = P[i]; for (let j = i + 1; j < P.length; j++) { const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy; if (d2 < L2) { let bin = Math.min(3, Math.floor((1 - d2 / L2) * 4)); if (F.calm.length && calmHit((a.x + b.x) / 2, (a.y + b.y) / 2)) bin = Math.max(0, bin - 2); B[bin].push(a.x, a.y, b.x, b.y); } } }
    ctx.lineWidth = 1;
    B.forEach((s, bi) => { if (!s.length) return; ctx.strokeStyle = `rgba(${pal.line},${.07 + bi * .13})`; ctx.beginPath(); for (let i = 0; i < s.length; i += 4) { ctx.moveTo(s[i], s[i + 1]); ctx.lineTo(s[i + 2], s[i + 3]); } ctx.stroke(); });
    for (const h of F.halos || []) {
      const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.r * 1.6); g.addColorStop(0, `rgba(${pal.core},${.16 * h.s})`); g.addColorStop(1, `rgba(${pal.core},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h.x, h.y, h.r * 1.6, 0, 6.283); ctx.fill();
      ctx.beginPath(); for (const q of P) { const d = Math.hypot(q.x - h.x, q.y - h.y); if (d < h.r * 1.5) { ctx.moveTo(h.x, h.y); ctx.lineTo(q.x, q.y); } }
      ctx.strokeStyle = `rgba(${pal.link},${.13 * h.s})`; ctx.lineWidth = 1; ctx.stroke();
      brandHalo(h.x, h.y, h.r * (.96 + .04 * Math.sin(t * 3)), .22 * h.s, 1.4);
    }
    for (const q of P) {
      const r = q.r * (1 + .22 * Math.sin(t * 1.4 + q.ph));
      if (q.r > 2) { ctx.beginPath(); ctx.arc(q.x, q.y, r * 3.2, 0, 6.283); ctx.fillStyle = pal.glow; ctx.fill(); }
      ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, 6.283); ctx.fillStyle = q.r > 1.95 ? pal.hot : pal.dot; ctx.fill();
    }
    for (const w of F.pulses) {
      const R = w.t * Math.hypot(W, H) * .62;
      if (w.brand) brandHalo(w.x, w.y, Math.max(6, R), (1 - w.t) * .85, 2.4);
      else { ctx.beginPath(); ctx.arc(w.x, w.y, R, 0, 6.283); ctx.strokeStyle = `rgba(${pal.ring},${(1 - w.t) * .6})`; ctx.lineWidth = 2; ctx.stroke(); }
    }
    if (F.flash > 0) {
      const g = ctx.createRadialGradient(F.origin.x, F.origin.y, 0, F.origin.x, F.origin.y, 260);
      g.addColorStop(0, `rgba(255,255,255,${.55 * F.flash})`); g.addColorStop(.25, `rgba(${pal.core},${.3 * F.flash})`); g.addColorStop(1, `rgba(${pal.core},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(F.origin.x, F.origin.y, 260, 0, 6.283); ctx.fill();
    }
  };
  F.reset(7);
  return F;
}

/* ------------------------------------------------------------------ MASCOTE */
const BIA_DEFAULT_POSE_VARS = ['arm-l', 'arm-r', 'fore-l', 'fore-r', 'lean', 'hop', 'squash', 'ring-y', 'stamp-press'];
const BIA_DEFAULT_FACE_VARS = ['brow-l', 'brow-r', 'brow-ang', 'eye-x', 'eye-y', 'eye-open', 'eye-happy', 'mouth-smile', 'mouth-open', 'mouth-flat', 'mouth-o', 'mouth-sad', 'cheek', 'glow'];
const BIA_PROPS = ['stamp', 'clip', 'ring', 'wand'];

function wordTime(tok, w) {
  /* "1200" | "@palavra" | "@palavra+200" | "@palavra-end-150" → ms relativo ao início da cena */
  tok = String(tok).trim();
  if (tok[0] !== '@') return +tok;
  const m = tok.match(/^@([a-z0-9-]+?)(?:([+-])(\d+))?$/i);
  if (!m) return 0;
  const base = w && w[m[1]] != null ? +w[m[1]] : 0;
  return base + (m[2] === '-' ? -1 : 1) * (+(m[3] || 0));
}
function parseKeys(s, w) {
  if (!s) return [];
  return s.split(';').map(x => x.trim()).filter(Boolean).map(seg => {
    const i = seg.indexOf(':'), at = seg.slice(0, i), rest = seg.slice(i + 1);
    const o = { at: wordTime(at, w), set: {} };
    (rest || '').split(',').forEach(kv => { const [k, v] = kv.split('='); if (k) o.set[k.trim()] = (v ?? '').trim(); });
    return o;
  }).sort((a, b) => a.at - b.at);
}

function makeBia(el, scene) {
  const B = window.BIA || { poses: {}, faces: {} };
  if (!window.BIA) console.error('BIA: tabelas da mascote não carregadas antes do motor (src/js/05-bia.js precisa vir antes de 10-engine.js)');
  const tpl = $('#bia-tpl');
  if (tpl && !el.querySelector('.bia-svg')) el.appendChild(tpl.content.cloneNode(true));
  /* as tabelas BIA usam nomes com prefixo (--arm-l…); propsOf vem de lá quando existe */
  const propsOf = s => B.propsOf ? B.propsOf(s) : (() => { const o = {}; BIA_PROPS.forEach(p => { o['--p-' + p] = 0; }); (s || '').split(/\s+/).filter(Boolean).forEach(p => { o['--p-' + p] = 1; }); return o; })();
  const stateOf = (pose, face, props, x, y, s, flip) => ({
    ...(B.poses[pose] || B.poses.idle || {}), ...(B.faces[face] || B.faces.happy || {}), ...propsOf(props), '--x': x, '--y': y, '--s': s, '--flip': flip,
  });
  const x0 = parseFloat(el.dataset.x || el.style.getPropertyValue('--x')) || 0, y0 = parseFloat(el.dataset.y || el.style.getPropertyValue('--y')) || 0;
  const s0 = parseFloat(el.dataset.s || el.style.getPropertyValue('--s')) || 1, flip0 = +(el.dataset.flip || 1);
  const base = stateOf(el.dataset.pose || 'idle', el.dataset.face || 'happy', el.dataset.props || '', x0, y0, s0, flip0);
  const keys = parseKeys(el.dataset.keys, scene && scene.w);
  /* estados absolutos por chave, encadeados */
  const states = [{ at: -1e9, dur: 1, ease: 'halo', st: base }];
  let cur = { pose: el.dataset.pose || 'idle', face: el.dataset.face || 'happy', props: el.dataset.props || '', x: x0, y: y0, s: s0, flip: flip0 };
  for (const k of keys) {
    cur = { ...cur };
    if (k.set.pose) cur.pose = k.set.pose; if (k.set.face) cur.face = k.set.face; if (k.set.props !== undefined) cur.props = k.set.props.replace(/\+/g, ' ');
    if (k.set.x !== undefined) cur.x = +k.set.x; if (k.set.y !== undefined) cur.y = +k.set.y; if (k.set.s !== undefined) cur.s = +k.set.s; if (k.set.flip !== undefined) cur.flip = +k.set.flip;
    states.push({ at: k.at, dur: +(k.set.dur || 350), ease: k.set.ease || 'halo', st: stateOf(cur.pose, cur.face, cur.props, cur.x, cur.y, cur.s, cur.flip) });
  }
  const allVars = new Set();
  states.forEach(s => Object.keys(s.st).forEach(v => allVars.add(v)));
  states.forEach(s => allVars.forEach(v => { if (s.st[v] === undefined || Number.isNaN(+s.st[v])) s.st[v] = v === '--s' || v === '--flip' ? 1 : 0; }));
  let lastSig = '';
  return {
    el,
    update(lt) {
      let j = 0; for (let i = 1; i < states.length; i++) if (states[i].at <= lt) j = i;
      const A = states[Math.max(0, j - 1)].st, Bst = states[j].st, k = j === 0 ? 1 : clamp((lt - states[j].at) / states[j].dur, 0, 1);
      const f = states[j].ease === 'spark' ? easeSpark(k) : states[j].ease === 'linear' ? k : easeHalo(k);
      const out = [];
      for (const v of allVars) { const val = lerp(A[v], Bst[v], f); out.push(v + ':' + val.toFixed(3)); }
      const sig = out.join('|'); if (sig === lastSig) return; lastSig = sig;
      for (const v of allVars) {
        const val = lerp(A[v], Bst[v], f);
        if (v === '--x' || v === '--y') el.style.setProperty(v, val.toFixed(2) + 'px');
        else el.style.setProperty(v, val.toFixed(3));
      }
    },
  };
}

/* ------------------------------------------------------------------ MOTOR */
const P = (() => {
  const pitch = $('#pitch'), stage = $('#stage'), scenesEl = $('#scenes');
  const capEl = $('#cap'), capT = $('#cap-t'), chip = $('#chip'), chipN = $('#chip-n'), chipK = $('#chip-k'), chipT = $('#chip-t');
  const barFill = $('#bar-fill'), narr = $('#narr');
  const field = makeField($('#field'));
  const scenes = [], captions = [];
  let T = 0, lastFieldT = null, playing = false, rafId = 0, wall0 = 0, t0 = 0, muted = false, ended = false;

  /* cenas: tempos do DOM (data-from/to) ou do roteiro */
  $$('.scene', scenesEl).forEach((sec, i) => {
    const r = (ROTEIRO.scenes || []).find(s => s.id === sec.id) || {};
    const from = +(sec.dataset.from ?? r.from ?? 0), to = +(sec.dataset.to ?? r.to ?? from + 8000);
    const world = sec.dataset.world || r.world || 'night';
    const s = { el: sec, i, id: sec.id, from, to, world, worldFrom: sec.dataset.worldFrom || world, worldAt: +(sec.dataset.worldAt || 0), field: sec.dataset.field === '1' || (sec.dataset.field === undefined && !!r.field), fieldUntil: +(sec.dataset.fieldUntil || 0), n: sec.dataset.n || r.n || i + 1, kicker: sec.dataset.kicker ?? r.kicker ?? '', chip: sec.dataset.chip ?? r.chip ?? '', entrance: sec.dataset.fieldEntrance === '1', fieldPulse: sec.dataset.fieldPulse === '1', bias: [], fi: +(sec.dataset.fi || 350), fo: +(sec.dataset.fo || 300) };
    s.w = r.w || {}; s.cx = +(sec.dataset.worldCx || 1690); s.cy = +(sec.dataset.worldCy || 520);
    Object.entries(s.w).forEach(([k, v]) => sec.style.setProperty('--w-' + k, v));
    sec.style.setProperty('--t0', from); sec.style.setProperty('--t1', to); sec.style.setProperty('--fi', s.fi); sec.style.setProperty('--fo', s.fo);
    s.bias = $$('.bia', sec).map(el => makeBia(el, s));
    scenes.push(s);
  });
  scenes.sort((a, b) => a.from - b.from);
  const duration = Math.max(...scenes.map(s => s.to), 1000);

  /* legendas: cada fala vai até a próxima (ou até o fim da cena + 300 ms) */
  (ROTEIRO.scenes || []).forEach(sc => (sc.lines || []).forEach(l => captions.push({ at: l.at, text: l.text, hl: l.hl || [], sceneTo: sc.to })));
  captions.sort((a, b) => a.at - b.at);
  captions.forEach((c, i) => { const nx = captions[i + 1]; c.end = nx ? Math.min(nx.at, Math.max(c.at + 1500, c.sceneTo)) : duration; if (c.end - c.at > 9000) c.end = c.at + 9000; });
  const esc = s => s.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
  const capHtml = c => { let h = esc(c.text); [...c.hl].sort((a, b) => b.length - a.length).forEach(w => { h = h.replace(esc(w), `<b>${esc(w)}</b>`); }); return h; };

  /* mundo e campo: rampas calculadas por T */
  /* eventos de mundo e de campo: (tempo, alvo). Uma cena pode começar num mundo (data-world-from)
     e trocar em data-world-at; o campo pode apagar dentro da cena em data-field-until. */
  const worldEv = [], fieldEv = [];
  scenes.forEach(s => {
    worldEv.push([s.from, s.worldFrom === 'paper' ? 1 : 0, s.cx, s.cy]);
    if (s.worldAt) worldEv.push([s.from + s.worldAt, s.world === 'paper' ? 1 : 0, s.cx, s.cy]);
    fieldEv.push([s.from, s.field ? 1 : 0]);
    if (s.fieldUntil) fieldEv.push([s.from + s.fieldUntil, 0]);
  });
  const ramp = (ev, t, lead, dur) => {
    let k = ev[0][1];
    for (let i = 1; i < ev.length; i++) {
      const [at, target] = ev[i]; if (target === ev[i - 1][1]) continue;
      const r = clamp((t - (at - lead)) / dur, 0, 1);
      if (t >= at - lead) k = lerp(k, target, easeHalo(r));
    }
    return k;
  };
  const worldK = t => ramp(worldEv, t, 0, 650);     /* 0 = noite, 1 = papel/lavanda */
  const worldC = t => { let c = [1690, 520]; for (let i = 1; i < worldEv.length; i++) { if (worldEv[i][1] !== worldEv[i - 1][1] && t >= worldEv[i][0]) c = [worldEv[i][2], worldEv[i][3]]; } return c; };
  const fieldK = t => ramp(fieldEv, t, 300, 700);
  const sceneAt = t => { let cur = scenes[0]; for (const s of scenes) if (t >= s.from) cur = s; return cur; };

  /* campo: sincroniza por passos fixos; entradas nas cenas marcadas */
  const entrances = scenes.filter(s => s.entrance).map(s => s.from);
  const pulses = scenes.filter(s => s.fieldPulse).map(s => s.from);
  const syncField = t => {
    if (lastFieldT === null || t < lastFieldT || t - lastFieldT > 1500) {
      let e0 = 0; for (const e of entrances) if (e <= t) e0 = e;
      field.entrance({ x: 960, y: 500 }, 7 + Math.round(e0 / 1000));
      lastFieldT = e0;
      pulses.forEach(p => { if (p > e0 && p <= t) { /* re-aplicado no laço abaixo */ } });
    }
    while (lastFieldT + STEP <= t) {
      const next = lastFieldT + STEP;
      for (const e of entrances) if (e > lastFieldT && e <= next && e !== 0) { field.entrance({ x: 960, y: 500 }, 7 + Math.round(e / 1000)); }
      for (const p of pulses) if (p > lastFieldT && p <= next) field.pulse(960, 500, true);
      field.step(STEP); lastFieldT = next;
    }
    field.draw();
  };

  let lastScene = null, lastCap = null;
  const seek = t => {
    T = clamp(t, 0, duration);
    pitch.style.setProperty('--t', T.toFixed(1));
    const cur = sceneAt(T);
    /* cenas visíveis: da entrada até o fim do fade de saída */
    for (const s of scenes) {
      const on = T >= s.from - 1 && T < s.to + 1;
      if (on !== s.el.classList.contains('on')) { s.el.classList.toggle('on', on); s.el.setAttribute('aria-hidden', on ? 'false' : 'true'); }
      if (on) for (const b of s.bias) b.update(T - s.from);
    }
    if (cur !== lastScene) {
      lastScene = cur;
      pitch.dataset.scene = cur.id;
      if (cur.chip) { chip.dataset.empty = '0'; chipN.textContent = cur.n; chipK.textContent = cur.kicker; chipT.textContent = cur.chip; } else chip.dataset.empty = '1';
      pitch.style.setProperty('--chip-t0', cur.from);
    }
    const wk = worldK(T);
    pitch.style.setProperty('--paper-k', wk.toFixed(3));
    /* a moldura (marca, chip) segue a luz de verdade, não o mundo final da cena: uma cena que abre a luz no meio
       fica com a marca da noite até a luz passar da metade */
    const wName = wk > .5 ? 'paper' : 'night';
    if (pitch.dataset.world !== wName) pitch.dataset.world = wName;
    const wc = worldC(T); pitch.style.setProperty('--paper-cx', wc[0]); pitch.style.setProperty('--paper-cy', wc[1]);
    pitch.style.setProperty('--field-k', fieldK(T).toFixed(3));
    /* legenda */
    let c = null; for (const x of captions) if (T >= x.at && T < x.end) { c = x; break; }
    if (c !== lastCap) { lastCap = c; if (c) capT.innerHTML = capHtml(c); }
    const ck = c ? Math.min(clamp((T - c.at) / 180, 0, 1), clamp((c.end - T) / 160, 0, 1)) : 0;
    pitch.style.setProperty('--cap-k', ck.toFixed(3));
    pitch.style.setProperty('--prog', (T / duration).toFixed(4));
    if (fieldK(T) > .001 || pitch.dataset.state === 'poster' || pitch.dataset.state === 'ended') syncField(T); else lastFieldT = null;
  };

  /* relógio ao vivo */
  const audioOk = () => narr && narr.src && !narr.error && narr.readyState >= 2;
  const tick = now => {
    if (!playing) return;
    let t;
    if (audioOk() && !narr.paused) t = narr.currentTime * 1000; else t = t0 + (now - wall0);
    if (t >= duration) { seek(duration); stop(true); return; }
    seek(t); rafId = requestAnimationFrame(tick);
  };
  const play = () => {
    if (playing) return;
    if (ended || T >= duration - 1) { T = 0; ended = false; lastFieldT = null; }
    playing = true; pitch.dataset.state = 'playing';
    wall0 = performance.now(); t0 = T;
    if (audioOk()) { narr.currentTime = T / 1000; narr.muted = muted; narr.play().catch(() => {}); }
    rafId = requestAnimationFrame(tick);
  };
  const stop = atEnd => {
    playing = false; cancelAnimationFrame(rafId);
    if (narr) narr.pause();
    ended = !!atEnd; pitch.dataset.state = atEnd ? 'ended' : 'paused';
    if (atEnd) { $('#play-label').textContent = 'Assistir de novo'; lastFieldT = null; }
  };
  const pause = () => { if (playing) stop(false); };
  const toggle = () => { playing ? pause() : play(); };
  const seekTo = t => { const was = playing; if (was) { cancelAnimationFrame(rafId); } seek(t); if (was) { wall0 = performance.now(); t0 = T; if (audioOk()) narr.currentTime = T / 1000; rafId = requestAnimationFrame(tick); } };
  const next = () => { const cur = sceneAt(T), i = scenes.indexOf(cur); if (i < scenes.length - 1) seekTo(scenes[i + 1].from); };
  const prev = () => { const cur = sceneAt(T), i = scenes.indexOf(cur); seekTo(T - cur.from > 1500 || i === 0 ? cur.from : scenes[i - 1].from); };
  const replay = () => { ended = false; seekTo(0); if (!playing) play(); };
  const setMuted = m => { muted = !!m; pitch.dataset.muted = muted ? '1' : '0'; if (narr) narr.muted = muted; };

  /* escala do palco */
  const fit = () => { const k = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.setProperty('--k', k.toFixed(4)); };
  fit(); addEventListener('resize', fit);

  /* interação */
  if (!RENDER) {
    $('#play').addEventListener('click', e => { e.stopPropagation(); ended ? replay() : play(); });
    $('#snd').addEventListener('click', e => { e.stopPropagation(); setMuted(!muted); });
    $('#bar').addEventListener('click', e => { e.stopPropagation(); const r = $('#bar').getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width * duration); if (!playing) pitch.dataset.state = 'paused'; });
    stage.addEventListener('click', e => { if (e.target.closest('button, a, .bar')) return; if (pitch.dataset.state === 'poster' || pitch.dataset.state === 'ended') { ended ? replay() : play(); return; } toggle(); });
    addEventListener('keydown', e => {
      if (e.target.matches('input, textarea')) return;
      if (e.code === 'Space' || e.key === 'k') { e.preventDefault(); if (pitch.dataset.state === 'poster' || ended) { ended ? replay() : play(); } else toggle(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'r' || e.key === 'R') replay();
      else if (e.key === 'm' || e.key === 'M') setMuted(!muted);
      else if (e.key === 'Home') seekTo(0);
      else if (e.key === 'f' || e.key === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
    });
    /* o cursor reúne as partículas na capa e no fecho */
    stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(), k = r.width / 1920; field.m.x = (e.clientX - r.left) / k; field.m.y = (e.clientY - r.top) / k; field.m.on = true; });
    stage.addEventListener('pointerleave', () => { field.m.on = false; });
    stage.addEventListener('pointerdown', e => { if (e.target.closest('button, a')) return; if (fieldK(T) > .5 || pitch.dataset.state !== 'playing') field.pulse(field.m.x, field.m.y, false); });
    /* capa: o campo respira enquanto espera */
    const idle = now => { if (pitch.dataset.state === 'poster' || pitch.dataset.state === 'ended') { field.step(16.67); field.draw(); } requestAnimationFrame(idle); };
    requestAnimationFrame(idle);
    field.entrance({ x: 960, y: 500 }, 3);
  }

  const dur = duration;
  const label = $('#play-label'); if (label) { const m = Math.floor(dur / 60000), s = Math.round(dur / 1000) % 60; label.textContent = `Assistir (${m} min ${String(s).padStart(2, '0')} s)`; }
  const ready = (async () => { try { await document.fonts.ready; } catch (e) {} if (RENDER) { pitch.dataset.render = '1'; pitch.dataset.state = 'playing'; } seek(Q.has('t') ? +Q.get('t') : 0); if (!RENDER && Q.get('autoplay') === '1') play(); return true; })();

  return { get t() { return T; }, duration, ready, seek, play, pause, toggle, replay, next, prev, setMuted, scenes, captions, field };
})();
window.HALOR_PITCH = P;
