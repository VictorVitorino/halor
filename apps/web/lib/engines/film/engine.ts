/* ==========================================================================
   O FILME · 88 s: uma gravação de tela editada do Estúdio Halor, passo a passo.
   Porte fiel de prototype/src/js/20-film.js.
   Roteiro: o símbolo acende (Noite) → abra o Estúdio → escolha um modelo →
   edite o texto → troque a paleta → insira gráfico, ícone e cards → dê vida
   com efeitos → torne lúdico (votação e post-its) → Raio Halor → importe .pptx
   e .pdf → apresente ao vivo → baixe em HTML → abra em qualquer navegador →
   Faça cada olhar render.
   Relógio: cada cena tem o seu tempo local (lt, em segundos), gravado como --lt
   em cada elemento animado dela (a propriedade é registrada com @property em
   styles/30-film.css e não é herdada). As telas do app usam data-o="0", então o
   relógio delas é o tempo global. As animações CSS ficam pausadas e guiadas por
   animation-delay; cursor, câmera, paleta, contadores e digitação são calculados
   aqui a partir do mesmo tempo, então qualquer ponto da trilha mostra o quadro exato.
   Câmera: poucos movimentos, cada um com 1,2 a 2 s e pausas de verdade entre
   eles. O zoom anda em escala logarítmica e o ponto fixo da transformação fica
   parado na tela (zoom ancorado). Nas pausas, um avanço lento mantém o quadro vivo.
   Ciclo de vida: nada toca em window ou document no carregamento do módulo.
   bootFilm() liga tudo sobre a marcação já renderizada e devolve a limpeza, que
   solta ouvintes, observador, temporizadores, RAF e áudio e devolve o DOM ao pôster.
   ========================================================================== */
import { $, $$, el, REDUCED } from '@/lib/core';
import { drawHaloArc, makeStars, type Star } from '@/lib/engines/halo';
import { slideHTML } from '@/lib/slides';
import { makeFilmAudio } from './audio';
import { CAM_D, CAM_M, CHAPTERS, CUES, CUR, D, END, FS, PAL, STEPS } from './data';

export type FilmState = 'poster' | 'playing' | 'paused' | 'ended';

/** Alça tipada para testes quadro a quadro (o mesmo que arrastar a trilha). */
export interface FilmHandle {
  readonly duration: number;
  readonly state: FilmState;
  readonly time: number;
  seek(t: number): void;
  play(): void;
  pause(): void;
  /** transformação atual da câmera (string do style) */
  camera(): string;
}

type DomEl = HTMLElement | SVGElement;
type Ease = (v: number) => number;
type Seg = [a: number, b: number, at: number, du: number];
interface Rect { x: number; y: number; w: number; h: number }
interface Pt { x: number; y: number }
interface CamState { x: number; y: number; z: number }
interface CamFrame extends CamState { px: number; py: number }
interface CamKey extends CamFrame { t: number; du: number; s: CamState }

interface Count { e: DomEl; segs: Seg[]; dec: number; fn: Ease; ring: boolean; last: string | null }
interface Typing { e: DomEl; at: number; du: number; full: string; last: number }
interface OnRange { e: DomEl; r: number[][]; last: boolean | null }
interface Scene {
  n: HTMLElement; from: number; to: number; o: number; fi: number; fo: number; fw: number; rc: number; fz: number;
  vis: boolean; tf: string; lt: string;
  anims: DomEl[]; counts: Count[]; types: Typing[]; ons: OnRange[];
}
interface Hov { e: DomEl; on: boolean; r: [number, number, number, number] }
interface Drag { e: HTMLElement; a: number; b: number }

const TAU = Math.PI * 2;
const PAD = .018, FIT = .05;   // margem dos quadros em volta da janela e folga ao enquadrar uma união de caixas

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease: Ease = v => 1 - Math.pow(1 - clamp(v), 3);
const sine: Ease = v => .5 - .5 * Math.cos(Math.PI * clamp(v));                                   // fusões e avanço lento
const smoother: Ease = v => { v = clamp(v); return v * v * v * (v * (v * 6 - 15) + 10); };        // câmera: começa e para sem tranco
const lin: Ease = v => clamp(v);
const nums = (s: string) => s.trim().split(/\s+/).map(Number);
const fmt = (s: number) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const ranges = (s: string) => s.split('|').map(nums);
const isXY = (s: string) => /^-?[\d.]+,-?[\d.]+$/.test(s);

// posição de um elemento relativa a uma raiz posicionada, sem transformações
function box(node: Element, root: Element): Rect {
  let n = node as HTMLElement | null;
  const r = { x: 0, y: 0, w: (node as HTMLElement).offsetWidth, h: (node as HTMLElement).offsetHeight };
  while (n && n !== root) { r.x += n.offsetLeft; r.y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return r;
}

let current: { film: HTMLElement; dispose: () => void; handle: FilmHandle } | null = null;

/** Alça do filme ligado agora (ou null). */
export function getFilm(): FilmHandle | null { return current ? current.handle : null; }

type DebugWindow = Window & { __halorFilm?: FilmHandle; __HALOR_TEST__?: boolean };

/**
 * Liga o filme (#film) dentro de `root`. Idempotente: um segundo boot desliga o anterior.
 * Devolve a limpeza (ouvintes, observador, temporizadores, RAF, áudio e o DOM de volta ao pôster).
 */
export function bootFilm(root: ParentNode = document): () => void {
  const found = $<HTMLElement>('#film', root);
  if (!found) return () => {};
  const film: HTMLElement = found;
  if (current) current.dispose();

  const bootReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** movimento reduzido: o valor vivo do núcleo (ou a preferência lida no boot, antes de initCore) */
  const RM = () => REDUCED || bootReduced;

  const ac = new AbortController(), on = { signal: ac.signal };
  let disposed = false;

  /* · estado salvo para devolver o DOM ao pôster na limpeza · */
  const snap: [Element, string | null, string | null][] = [film, ...$$<Element>('*', film)].map(e => [e, e.getAttribute('class'), e.getAttribute('style')]);
  const filmState = film.dataset.state ?? 'poster';
  const added: Element[] = [];
  const filled: [Element, string][] = [];
  const texts: [Node, string | null][] = [];
  const attrs: [Element, string, string | null][] = [];
  const keepText = (n: Node | null) => { if (n) texts.push([n, n.textContent]); };
  const keepAttr = (e: Element | null, ...names: string[]) => { if (e) for (const a of names) attrs.push([e, a, e.getAttribute(a)]); };

  const cv = $<HTMLCanvasElement>('.film-cv', film)!;
  const ctx = cv.getContext('2d')!;
  const fillEl = $('.film-fill', film)!, timeEl = $('.film-time', film)!, chapEl = $('.film-chap', film)!, track = $('.film-track', film)!;
  const camEl = $('.fw-cam', film)!, winEl = $('[data-cur]', film)!, appSc = camEl.closest<HTMLElement>('.sc')!;
  const toggleBtn = $('[data-film-toggle]', film)!, soundBtn = $('[data-film-sound]', film)!, replayBtn = $('[data-film-replay]', film)!;
  keepText(timeEl); keepText(chapEl);
  keepAttr(cv, 'width', 'height');
  keepAttr(track, 'aria-valuenow', 'aria-valuetext');
  keepAttr(toggleBtn, 'aria-label'); keepAttr($('use', toggleBtn), 'href');
  keepAttr(soundBtn, 'aria-pressed', 'aria-label'); keepAttr($('use', soundBtn), 'href');

  let scenes: Scene[] = [], state: FilmState = 'poster', t = 0, last = 0, raf = 0, w = 0, h = 0;
  let soundOn = false, dragging = false, camLast = '', palLast = '', portrait = false, legLast: string | null = null;
  let idleT: ReturnType<typeof setTimeout> | undefined;
  let capsEl: HTMLElement, legSc: Scene | undefined, palEls: HTMLElement[] = [];
  const A: Record<string, Rect> = {};
  let winBox: Rect = { x: 0, y: 0, w: 0, h: 0 };
  const CK: CamKey[] = [];
  const audio = makeFilmAudio();
  const MK = {
    pts: [] as Pt[], hov: [] as Hov[], drags: [] as Drag[], clicks: [] as number[], ok: false,
    cur: $('.fw-cur', winEl)!, rip: $('.fw-rip', winEl)!,
    way: [] as { t: number; tg: string }[], hovEls: [] as DomEl[]
  };
  let stars: Star[] = [];

  function valAt(segs: Seg[], lt: number, fn?: Ease) {
    let v = segs[0][0];
    for (const [a, b, at, du] of segs) if (lt >= at) v = a + (b - a) * (RM() ? 1 : (fn || ease)((lt - at) / du));
    return v;
  }

  /* · montagem: miniaturas, cópias dos slides no trilho e legendas dos passos · */
  function build() {
    $$('[data-slide]', film).forEach(e => {
      const s = FS[e.dataset.slide!];
      if (s) { filled.push([e, e.innerHTML]); e.innerHTML = slideHTML(s, +(e.dataset.nSlide || 1), 'halor'); }
    });
    $$('[data-clone]', film).forEach(e => {
      const src = $('[data-cs="' + e.dataset.clone + '"] .slide', film);
      if (src) { filled.push([e, e.innerHTML]); e.innerHTML = src.outerHTML; }
    });
    // uma legenda sai por completo antes da próxima entrar (no mesmo lugar, nunca se sobrepõem)
    const caps = $('[data-caps]', film)!;
    STEPS.forEach((s, i) => {
      const sc = el('div', 'sc f-capsc');
      sc.dataset.from = s.t.toFixed(2); sc.dataset.to = ((STEPS[i + 1] ? STEPS[i + 1].t : END) - .34).toFixed(2);
      sc.dataset.fi = '.4'; sc.dataset.fo = '.34';
      sc.innerHTML = `<p class="f-cap fa fa-cap" style="--at:0;--du:.6"><b>${i + 1}</b><span>${s.n}</span></p>`;
      caps.appendChild(sc); added.push(sc);
    });
  }

  function parseScene(n: HTMLElement): Scene {
    const own = (e: Element) => e.closest('.sc') === n;   // cada elemento obedece só à cena mais próxima
    const d = n.dataset;
    const s: Scene = {
      n, from: +d.from!, to: +d.to!, o: d.o != null ? +d.o : +d.from!, fi: d.fi != null ? +d.fi : .3, fo: d.fo != null ? +d.fo : .3,
      fw: +(d.fw || 0), rc: +(d.rc || 0), fz: +(d.fz || 0), vis: false, tf: '', lt: '',
      anims: [], counts: [], types: [], ons: []
    };
    // o relógio (--lt) vai direto em cada elemento animado da cena: a propriedade não é herdada,
    // então mudar o tempo recalcula só esses elementos e não a árvore inteira da janela a cada quadro
    s.anims = $$<DomEl>('.fa, .fd, .f-lux', n).filter(own);
    s.counts = $$<DomEl>('[data-n]', n).filter(own).map(e => {
      keepText(e);
      return { e, segs: [nums(e.dataset.n!) as Seg], dec: +(e.dataset.dec || 0), fn: e.dataset.ez === 'lin' ? lin : ease, ring: e.hasAttribute('data-ring'), last: null };
    });
    s.types = $$<DomEl>('[data-type]', n).filter(own).map(e => {
      const [at, du] = nums(e.dataset.type!); keepText(e);
      return { e, at, du, full: e.textContent ?? '', last: -1 };
    });
    s.ons = $$<DomEl>('[data-on]', n).filter(own).map(e => ({ e, r: ranges(e.dataset.on!), last: null }));
    return s;
  }

  function init() {
    build();
    scenes = $$('.sc', film).map(parseScene);
    capsEl = $('[data-caps]', film)!; legSc = scenes.find(s => s.n.classList.contains('f-legsc')); palEls = $$('.fw-pal', film);
    MK.way = CUR.map(([t0, tg]) => ({ t: t0, tg }));
    MK.clicks = MK.way.filter(x => x.tg === '!').map(x => x.t);
    MK.drags = $$('[data-drag]', winEl).map(e => { const [a, b] = nums(e.dataset.drag!); return { e, a, b }; });
    MK.hovEls = $$<DomEl>('[data-hov]', winEl);
    stars = makeStars(90);
    CHAPTERS.slice(1).forEach(c => { const k = el('span', 'film-tick'); k.style.left = (c.t / D * 100) + '%'; k.title = c.n; track.appendChild(k); added.push(k); });
    const ro = new ResizeObserver(() => { resize(); measure(); render(); });
    ro.observe(film);
    ac.signal.addEventListener('abort', () => ro.disconnect());
    if (document.fonts && document.fonts.ready) void document.fonts.ready.then(() => { if (disposed) return; measure(); render(); });
    // botões [data-film-play] em qualquer lugar da página (o do hero rola até o filme e toca)
    document.addEventListener('click', e => {
      const b = (e.target as Element | null)?.closest?.('[data-film-play]');
      if (!b) return;
      if (!film.contains(b)) film.scrollIntoView({ behavior: RM() ? 'auto' : 'smooth', block: 'center' });
      if (state === 'playing') return; play();
    }, on);
    toggleBtn.addEventListener('click', () => state === 'playing' ? pause() : play(), on);
    replayBtn.addEventListener('click', () => { seek(0); play(); }, on);
    soundBtn.addEventListener('click', e => toggleSound(e.currentTarget as HTMLElement), on);
    film.addEventListener('dblclick', e => { if ((e.target as Element).closest('.film-bar, a, button')) return; fullscreen(); }, on);
    // trilha de progresso: clique, arraste e teclado
    const pos = (e: PointerEvent) => { const r = track.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width) * D; };
    track.addEventListener('pointerdown', e => { dragging = true; track.setPointerCapture(e.pointerId); seek(pos(e)); }, on);
    track.addEventListener('pointermove', e => { if (dragging) seek(pos(e)); }, on);
    track.addEventListener('pointerup', () => { dragging = false; }, on);
    track.addEventListener('pointercancel', () => { dragging = false; }, on);
    track.addEventListener('keydown', e => {
      const k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowUp') seek(t + 5); else if (k === 'ArrowLeft' || k === 'ArrowDown') seek(t - 5);
      else if (k === 'PageUp') seek(t + 10); else if (k === 'PageDown') seek(t - 10);
      else if (k === 'Home') seek(0); else if (k === 'End') seek(D - .1);
      else if (k === ' ' || k === 'Enter') { if (state === 'playing') pause(); else play(); } else return;
      e.preventDefault();
    }, on);
    document.addEventListener('halor:view', e => { if ((e as CustomEvent<string>).detail !== 'v-site' && state === 'playing') pause(); }, on);
    (['pointermove', 'pointerdown', 'keydown'] as const).forEach(ev => film.addEventListener(ev, wake, on));
    measure();
    render();
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight; if (!w) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* · câmera: quadros-chave medidos no palco (sem transformação) · */
  function camKey(tg: string, zmax: number): CamFrame {
    let x = w / 2, y = h / 2, z = zmax;
    if (isXY(tg)) { const [px, py] = tg.split(',').map(Number); x = px / 100 * w; y = py / 100 * h; }
    else {
      const [sels, rel] = tg.split('@');
      let u: { x: number; y: number; r: number; b: number } | null = null;
      for (const sel of sels.split('+')) {
        const e = $(sel, camEl); if (!e) continue;
        const b = box(e, camEl);
        u = u ? { x: Math.min(u.x, b.x), y: Math.min(u.y, b.y), r: Math.max(u.r, b.x + b.w), b: Math.max(u.b, b.y + b.h) } : { x: b.x, y: b.y, r: b.x + b.w, b: b.y + b.h };
      }
      if (u) {
        const bw = u.r - u.x, bh = u.b - u.y;
        if (rel) { const [fx, fy] = rel.split(',').map(Number); x = u.x + bw * fx; y = u.y + bh * fy; }
        else { x = u.x + bw / 2; y = u.y + bh / 2; z = Math.min(zmax, w / (bw * (1 + 2 * FIT)), h / (bh * (1 + 2 * FIT))); }
      }
    }
    return camFit({ px: x, py: y, x: 0, y: 0, z: 0 }, Math.max(1, z));
  }
  function camFit<K extends CamFrame>(k: K, z: number): K { k.z = z; k.x = camAxis(k.px, w, winBox.x, winBox.w, z); k.y = camAxis(k.py, h, winBox.y, winBox.h, z); return k; }
  // mantém o quadro dentro da janela (com folga); com zoom baixo, desliza até o palco inteiro
  function camAxis(p: number, size: number, lo: number, len: number, z: number) {
    const v = size / z, pad = w * PAD, inner = len + 2 * pad;
    if (v <= inner) return Math.max(lo - pad + v / 2, Math.min(lo + len + pad - v / 2, p));
    const s = clamp((v - inner) / Math.max(1, size - inner));
    return (lo + len / 2) + (size / 2 - (lo + len / 2)) * s;
  }
  // movimento ancorado: zoom em escala logarítmica e o ponto fixo da transformação parado na tela.
  // Entre dois quadros válidos, as bordas do quadro andam sempre num só sentido, então nada sai da janela.
  function camMix(a: CamState, b: CamState, s: number): CamState {
    const L = Math.log(b.z / a.z), z = a.z * Math.exp(L * s);
    const g = Math.abs(L) < 1e-6 ? s : (1 - Math.exp(-L * s)) / (1 - Math.exp(-L));
    return { x: a.x + (b.x - a.x) * g, y: a.y + (b.y - a.y) * g, z };
  }
  // estado no trecho i: movimento até o quadro i e, depois, a pausa com avanço lento até o próximo movimento
  function camSeg(i: number, tt: number): CamState {
    const k = CK[i];
    if (tt < k.t + k.du) return camMix(k.s, k, smoother((tt - k.t) / k.du));
    const h0 = k.t + k.du, h1 = CK[i + 1] ? CK[i + 1].t : D, hold = Math.max(.01, h1 - h0);
    return { x: k.x, y: k.y, z: k.z * (1 + Math.min(.026, .0042 * hold) * sine((tt - h0) / hold)) };
  }
  function measure() {
    if (!film.offsetWidth) return;
    w = film.offsetWidth; h = film.offsetHeight; portrait = h > w;
    $$('[data-anchor]', film).forEach(n => { const b = box(n, film); A[n.dataset.anchor!] = { x: b.x + b.w / 2, y: b.y + b.h / 2, w: b.w, h: b.h }; });
    winBox = box(winEl, camEl);
    CK.length = 0;
    for (const [t0, du, tg, z] of (portrait ? CAM_M : CAM_D)) { const f = camKey(tg, z); const k = f as CamKey; k.t = t0; k.du = du; CK.push(k); }
    // cada movimento parte do quadro exato daquele instante (com o avanço lento da pausa anterior);
    // numa panorâmica com o mesmo zoom, o quadro guarda o avanço em vez de recuar e voltar
    CK.forEach((k, i) => {
      k.s = i ? camSeg(i - 1, k.t) : k;
      if (i && Math.abs(Math.log(k.z / CK[i - 1].z)) < .04 && k.s.z > k.z) camFit(k, k.s.z);
    });
    MK.ok = false; camLast = '';
  }
  function measureMock() {
    const m = winEl, W = m.offsetWidth, H = m.offsetHeight; if (!W) return;
    let prev: Pt = { x: 50, y: 50 };
    MK.pts = MK.way.map(wp => {
      let p = prev;
      if (isXY(wp.tg)) { const [x, y] = wp.tg.split(',').map(Number); p = { x, y }; }
      else if (wp.tg !== '!') { const e = $(wp.tg, m); if (e) { const b = box(e, m); p = { x: (b.x + b.w * .5) / W * 100, y: (b.y + b.h * .55) / H * 100 }; } }
      prev = p; return p;
    });
    MK.hov = MK.hovEls.map(e => { const b = box(e, m); return { e, on: e.classList.contains('hov'), r: [b.x / W * 100, b.y / H * 100, (b.x + b.w) / W * 100, (b.y + b.h) / H * 100] }; });
    MK.ok = true;
  }

  // tocando e sem mexer o mouse por 2,5 s: a barra e o ponteiro somem e só o filme fica na tela
  function wake() {
    clearTimeout(idleT); film.classList.remove('idle');
    if (state === 'playing') idleT = setTimeout(() => { if (state === 'playing') film.classList.add('idle'); }, 2500);
  }
  function setState(s: FilmState) {
    state = s; film.dataset.state = s; wake();
    const b = toggleBtn;
    $('use', b)!.setAttribute('href', s === 'playing' ? '#i-pause' : s === 'ended' ? '#i-replay' : '#i-play');
    b.setAttribute('aria-label', s === 'playing' ? 'Pausar' : s === 'ended' ? 'Assistir de novo' : 'Reproduzir');
  }
  function play() {
    if (state === 'ended' || t >= D - .05) t = 0;
    setState('playing'); last = performance.now();
    if (soundOn) audio.start();
    cancelAnimationFrame(raf); render(); raf = requestAnimationFrame(tick);
  }
  function pause() { setState('paused'); cancelAnimationFrame(raf); audio.stop(); render(); }
  function tick(now: number) {
    const dt = Math.min(.25, (now - last) / 1000), t0 = t; last = now; t += dt;
    if (t >= D) { t = D; cues(t0, t); render(); setState('ended'); audio.stop(); render(); return; }
    cues(t0, t); render(); raf = requestAnimationFrame(tick);
  }
  function seek(nt: number) {
    t = Math.max(0, Math.min(D - .05, nt));
    if (state === 'poster' || state === 'ended') setState('paused');
    render();
  }

  /* · quadro: cenas, câmera, cursor, paleta, barra e canvas · */
  function render() {
    const R = RM();
    for (const s of scenes) {
      // com movimento reduzido não há fusão: a cena sai em data-to (ou data-rc segundos depois, para emendar na próxima)
      const vis = t >= s.from && t < s.to + (R ? s.rc : s.fo);
      if (vis !== s.vis) { s.vis = vis; s.n.classList.toggle('on', vis); }
      if (!vis) continue;
      // fusões com curva suave; a cena que entra pode crescer de leve até o lugar (data-fz).
      // Nas trocas de tela dentro do app, a tela nova espera a antiga quase sumir (data-fw):
      // nunca dois textos sobrepostos pela metade
      let op = 1, inq = 1;
      if (!R) {
        if (s.fi > 0 && t < s.from + s.fw + s.fi) { inq = sine((t - s.from - s.fw) / s.fi); op = inq; }
        if (t > s.to && s.fo > 0) op = Math.min(op, 1 - sine((t - s.to) / s.fo));
      }
      s.n.style.opacity = op.toFixed(3);
      const tf = s.fz && inq < 1 ? 'scale(' + (1 - s.fz * (1 - inq)).toFixed(4) + ')' : '';
      if (tf !== s.tf) { s.n.style.transform = tf; s.tf = tf; }
      const lt = t - s.o, lts = lt.toFixed(3);
      if (lts !== s.lt) { for (const e of s.anims) e.style.setProperty('--lt', lts); s.lt = lts; }
      update(s, lt);
    }
    if (appSc.classList.contains('on')) { camFrame(); curFrame(); palFrame(); }
    // no celular a legenda final ocupa o lugar da legenda do passo: a do passo sai antes e volta depois
    let capOp = '';
    if (portrait && legSc) { const q = R ? (t >= legSc.from && t < legSc.to ? 1 : 0) : Math.min(sine((t - legSc.from + .4) / .4), 1 - sine((t - legSc.to - legSc.fo) / .4)); capOp = (1 - q).toFixed(3); }
    if (capOp !== legLast) { capsEl.style.opacity = capOp; legLast = capOp; }
    barFrame(); draw();
  }
  function update(s: Scene, lt: number) {
    const R = RM();
    for (const c of s.counts) {
      const v = valAt(c.segs, lt, c.fn);
      if (c.ring) { const C = 207.3, str = (v / 100 * C).toFixed(1) + ' ' + C; if (str !== c.last) { c.e.style.strokeDasharray = str; c.last = str; } }
      else { const txt = c.dec ? (v / 10).toFixed(1).replace('.', ',') : String(Math.round(v)); if (txt !== c.last) { c.e.textContent = txt; c.last = txt; } }
    }
    for (const y of s.types) {
      const k = R ? (lt >= y.at ? 1 : 0) : clamp((lt - y.at) / y.du), n = Math.round(y.full.length * k);
      if (n !== y.last) { y.e.textContent = y.full.slice(0, n); y.last = n; }
      y.e.classList.toggle('typing', !R && lt >= y.at && lt < y.at + y.du + .5);
    }
    for (const o of s.ons) {
      const act = o.r.some(([a, b]) => lt >= a && lt < b);
      if (act !== o.last) { o.e.classList.toggle('act', act); o.last = act; }
    }
  }
  // câmera: movimentos ancorados e suaves; com movimento reduzido, cortes secos e nenhum avanço
  function camFrame() {
    if (!CK.length) return;
    let i = 0; while (i < CK.length - 1 && t >= CK[i + 1].t) i++;
    const c = RM() ? CK[i] : camSeg(i, t);
    const tx = w / 2 - c.x * c.z, ty = h / 2 - c.y * c.z;
    const str = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${c.z.toFixed(5)})`;
    if (str !== camLast) { camEl.style.transform = str; camLast = str; }
  }
  /* cursor: parado até a hora de sair; então um movimento curto (0,5 a 1 s, conforme a distância),
     que arranca rápido e pousa devagar, num arco leve */
  function curPos(i: number): Pt {
    const wy = MK.way, P = MK.pts, a = P[i], b = P[i + 1];
    if (RM() || t <= wy[i].t) return a;
    const dx = b.x - a.x, dy = (b.y - a.y) * .573, dist = Math.hypot(dx, dy);   // em % da largura da janela
    if (dist < .01) return a;
    const du = Math.min(wy[i + 1].t - wy[i].t, Math.max(.5, Math.min(1, .4 + dist * .012)));
    const u = (t - (wy[i + 1].t - du)) / du;
    if (u <= 0) return a;
    const q = smoother(Math.pow(clamp(u), .8)), bow = Math.sin(Math.PI * q) * Math.min(3, dist * .08);
    let nx = -dy / dist, ny = dx / dist; if (ny > 0) { nx = -nx; ny = -ny; }   // o arco sempre puxa para cima
    return { x: a.x + dx * q + nx * bow, y: a.y + (dy * q + ny * bow) / .573 };
  }
  function curFrame() {
    if (!MK.ok) measureMock();
    const wy = MK.way, P = MK.pts; if (!P.length) return;
    const R = RM();
    let i = 0; while (i < wy.length - 1 && t >= wy[i + 1].t) i++;
    const p = t <= wy[0].t ? P[0] : i >= wy.length - 1 ? P[P.length - 1] : curPos(i);
    const op = R ? (t >= 4.4 && t < END - .6 ? 1 : 0) : Math.min(sine((t - 4.3) / .4), 1 - sine((t - (END - .9)) / .4));
    const shown = op > 0;
    MK.cur.style.left = p.x.toFixed(2) + '%'; MK.cur.style.top = p.y.toFixed(2) + '%';
    MK.cur.style.opacity = op.toFixed(3);
    MK.cur.classList.toggle('down', MK.clicks.some(c => t >= c - .06 && t < c + .1));
    let c: number | null = null; for (const ct of MK.clicks) if (t >= ct && t < ct + .5) c = ct;
    if (c == null || R) MK.rip.style.opacity = '0';
    else { const q = ease((t - c) / .5); MK.rip.style.left = p.x.toFixed(2) + '%'; MK.rip.style.top = p.y.toFixed(2) + '%'; MK.rip.style.opacity = (.85 * (1 - q)).toFixed(3); MK.rip.style.transform = 'scale(' + (.35 + .75 * q).toFixed(3) + ')'; }
    // sem ler o layout a cada quadro (nenhum alvo some com display: none); só escreve quando muda
    for (const o of MK.hov) {
      const hv = shown && p.x >= o.r[0] && p.x <= o.r[2] && p.y >= o.r[1] && p.y <= o.r[3] && !o.e.closest('.sc:not(.on)');
      if (hv !== o.on) { o.e.classList.toggle('hov', hv); o.on = hv; }
    }
    for (const d of MK.drags) {
      const act = t >= d.a && t < d.b; d.e.classList.toggle('act', act);
      if (act) { d.e.style.left = p.x.toFixed(2) + '%'; d.e.style.top = p.y.toFixed(2) + '%'; }
    }
  }
  // paleta: o matiz dos slides corre suave de uma paleta para a outra (só nas miniaturas e no slide do editor)
  function palFrame() {
    let hue = PAL[0][1], sat = PAL[0][2];
    for (let i = 1; i < PAL.length; i++) {
      const [pt, ph, ps] = PAL[i]; if (t < pt) break;
      const q = RM() ? 1 : sine((t - pt) / .6), h0 = hue, s0 = sat;
      hue = h0 + (ph - h0) * q; sat = s0 + (ps - s0) * q;
    }
    const str = hue.toFixed(1) + '|' + sat.toFixed(3);
    if (str !== palLast) { for (const e of palEls) { e.style.setProperty('--hue', hue.toFixed(1)); e.style.setProperty('--sat', sat.toFixed(3)); } palLast = str; }
  }
  function barFrame() {
    fillEl.style.width = (t / D * 100) + '%';
    timeEl.textContent = fmt(t) + ' / ' + fmt(D);
    let ch = CHAPTERS[0]; for (const c of CHAPTERS) if (t >= c.t) ch = c;
    track.setAttribute('aria-valuenow', String(Math.round(t)));
    track.setAttribute('aria-valuetext', Math.round(t) + ' de ' + D + ' segundos · ' + ch.n);
    if (chapEl.textContent !== ch.n) chapEl.textContent = ch.n;
  }

  /* · canvas: estrelas e arcos neon no pôster, na abertura e no fecho · */
  function glow(x: number, y: number, r: number, a: number) {
    if (r <= 0 || a <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,' + Math.min(1, a) + ')'); g.addColorStop(.22, 'rgba(201,166,255,' + a * .7 + ')'); g.addColorStop(1, 'rgba(139,61,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  function starsAt(u: number, a: number) {
    const R = RM();
    ctx.fillStyle = '#e9deff';
    for (const s of stars) { ctx.globalAlpha = a * (R ? .3 : Math.max(0, .2 + .3 * Math.sin(t * s.s * 1.5 + s.p))); ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r * u * 1.4, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function arcs(x: number, y: number, R: number, u: number, k: number, sp: number) {
    drawHaloArc(ctx, x, y, R, { rx: .66, ry: .66, rot: -.5, s: 3.3 + sp, len: 2.6 * k + .1, w: 2.2 * u * 1.6, sp: 0, o: .85 * k }, 0);
    drawHaloArc(ctx, x, y, R, { rx: .94, ry: .56, rot: -.25, s: 2.8 - sp * .6, len: 1.7 * k, w: 1.3 * u * 1.6, sp: 0, o: .5 * k }, 0);
  }
  function draw() {
    if (!w) return;
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, w, h);
    const u = Math.min(w, h * 16 / 9) / 1000, cx = w / 2, cy = h / 2, R = Math.min(w, h) * .5;
    ctx.globalCompositeOperation = 'lighter';
    if (state === 'poster') {
      starsAt(u, 1);
      drawHaloArc(ctx, cx, cy * 1.08, R * 1.1, { rx: .7, ry: .7, rot: 0, s: 3.5, len: 2.6, w: 2.2 * u * 1.6, sp: 0, o: .75 }, 0);
      drawHaloArc(ctx, cx, cy * 1.08, R * 1.1, { rx: .95, ry: .62, rot: .1, s: 4, len: 1.6, w: 1.2 * u * 1.6, sp: 0, o: .4 }, 0);
    } else if (t < 4.7) {                                   // abertura: o símbolo acende e os arcos giram atrás dele
      const mk = A.mark || { x: cx, y: cy * .8, w: R * .5 }, k = ease((t - .2) / 1.6), q = sine((t - 2.95) / .7), out = 1 - q;
      starsAt(u, 1 - .5 * q);                               // o céu baixa até o tom da gravação, sem salto; os arcos somem junto com o símbolo
      arcs(mk.x, mk.y, R * 1.25, u, k * out, t * .12);
      glow(mk.x, mk.y, mk.w * .7, .35 * k * out);
    } else if (t < END) {                                   // gravação: só um céu discreto atrás da janela
      starsAt(u, .5);
    } else {                                                // fecho: os arcos voltam e respiram
      const lt = t - END, mk = A.mark2 || { x: cx, y: cy * .7, w: R * .4 }, kk = ease((lt - .55) / 1.4);   // espera a janela quase sumir
      const br = RM() ? 1 : 1 + .03 * Math.sin(lt * TAU / 2.4);
      starsAt(u, .5 + .5 * sine(lt / .9));
      arcs(cx, cy * 1.04, R * 1.1 * br, u, kk, lt * .06);
      glow(mk.x, mk.y, mk.w * .8 * br, .3 * kk);
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  /* · som: só depois do clique (o contexto nasce no gesto) · */
  function cues(a: number, b: number) {
    if (!audio.ready || !soundOn || state !== 'playing') return;
    for (const [ct, n] of CUES) if (ct > a && ct <= b) { if (n === 'chord') [-12, 0, 4, 7, 12].forEach(s => audio.bell(s, .03, 3.4)); else audio.bell(n, .04, 1.6); }
    for (const ct of MK.clicks) if (ct > a && ct <= b) audio.click();
  }
  function toggleSound(b: HTMLElement) {
    soundOn = !soundOn;
    b.setAttribute('aria-pressed', String(soundOn));
    b.setAttribute('aria-label', soundOn ? 'Desativar som' : 'Ativar som');
    $('use', b)!.setAttribute('href', soundOn ? '#i-sound' : '#i-mute');
    if (soundOn && state === 'playing') audio.start(); else audio.stop();
  }
  function fullscreen() {
    try { if (document.fullscreenElement) void document.exitFullscreen().catch(() => {}); else film.requestFullscreen().catch(() => {}); } catch { /* sem tela cheia aqui */ }
  }

  const handle: FilmHandle = {
    duration: D,
    get state() { return state; },
    get time() { return t; },
    seek: nt => seek(nt),
    play: () => play(),
    pause: () => pause(),
    camera: () => camEl.style.transform
  };

  function dispose() {
    if (disposed) return;
    disposed = true;
    ac.abort();
    cancelAnimationFrame(raf); raf = 0;
    clearTimeout(idleT);
    audio.close();
    try { if (document.fullscreenElement === film) void document.exitFullscreen().catch(() => {}); } catch { /* nada a sair */ }
    // devolve o DOM ao estado do pôster: um novo boot (modo estrito, recarga) parte do mesmo quadro
    for (const n of added) n.remove();
    for (const [e, html] of filled) e.innerHTML = html;
    for (const [n, txt] of texts) n.textContent = txt;
    for (const [e, a, v] of attrs) { if (v == null) e.removeAttribute(a); else e.setAttribute(a, v); }
    // lê o atributo antes de mexer: o Chrome sincroniza o estilo inline pendente na leitura
    // (sem isso, um removeAttribute logo após escrever via CSSOM pode voltar como style="")
    const put = (e: Element, a: string, v: string | null) => { const cur = e.getAttribute(a); if (cur !== v) { if (v == null) e.removeAttribute(a); else e.setAttribute(a, v); } };
    for (const [e, cls, st] of snap) { put(e, 'class', cls); put(e, 'style', st); }
    film.dataset.state = filmState;
    const dw = window as DebugWindow;
    if (dw.__halorFilm === handle) delete dw.__halorFilm;
    if (current && current.handle === handle) current = null;
  }

  init();
  current = { film, dispose, handle };
  // alça de teste: em dev, ou quando o teste pede antes do boot (window.__HALOR_TEST__ = true)
  const dw = window as DebugWindow;
  if (process.env.NODE_ENV !== 'production' || dw.__HALOR_TEST__) dw.__halorFilm = handle;
  return dispose;
}
