/* ==========================================================================
   PRODUTO · carrossel de modelos prontos (cada miniatura com o efeito vivo,
   pausa dos efeitos e navegação por teclado com uma parada só de Tab),
   cartão do ganho principal e a gravação do Estúdio em três cenas (monte e
   edite na própria apresentação, baixe em HTML/PDF/PPT, importe um modelo).
   Porte de prototype/src/js/36-produto.js (pdBootModels e pdBootRec).
   A marcação dos modelos e das cenas já chega pré-renderizada (Produto.tsx);
   aqui só entra o comportamento.
   ========================================================================== */
import { $, $$, REDUCED, currentView } from '@/lib/core';
import { PD_MODELS, REC_SCENES } from './data';

export type Dispose = () => void;
const noop: Dispose = () => {};

/** Modelos: setas, arrasto, teclado e máscaras nas bordas. Cada efeito liga só com o carrossel na tela e o
    cartão perto da área visível do trilho (começa um pouco antes de aparecer, sem "piscar" do quadro final
    ao inicial). Cursor, toque ou as setas do teclado reiniciam a coreografia; "Pausar efeitos" deixa todos
    no quadro final. As setas desligam no começo e no fim, sem prender o foco num botão desligado. */
export function bootCarousel(root: ParentNode): Dispose {
  const track = $<HTMLDivElement>('#pd-models', root);
  const box = track?.closest<HTMLElement>('.pd-models');
  const car = track?.closest<HTMLElement>('.pd-carousel');
  const prev = box ? $<HTMLButtonElement>('.pd-prev', box) : null;
  const next = box ? $<HTMLButtonElement>('.pd-next', box) : null;
  if (!track || !box || !car || !prev || !next) return noop;
  const fxBtn = $<HTMLButtonElement>('.pd-fxpause', box);
  const live = $('#pd-live', box);
  const cards = $$<HTMLElement>('.pd-model', track);
  const ac = new AbortController(), on = { signal: ac.signal };
  const beh = (): ScrollBehavior => (REDUCED ? 'auto' : 'smooth');
  const step = () => (cards[0] ? cards[0].getBoundingClientRect().width + 16 : 300);
  const by = () => Math.max(step(), Math.floor(track.clientWidth / step()) * step());
  const go = (dx: number) => track.scrollBy({ left: dx, behavior: beh() });
  prev.addEventListener('click', () => go(-by()), on);
  next.addEventListener('click', () => go(by()), on);

  /* arrasto só com o mouse: no toque a rolagem nativa já faz o trabalho */
  let dx: number | null = null, sl = 0, pt = 'mouse';
  track.addEventListener('pointerdown', e => {
    pt = e.pointerType;
    if (e.pointerType !== 'mouse') return;
    dx = e.clientX; sl = track.scrollLeft; track.classList.add('drag');
  }, on);
  window.addEventListener('pointermove', e => { if (dx != null) track.scrollLeft = sl - (e.clientX - dx); }, on);
  window.addEventListener('pointerup', () => { dx = null; track.classList.remove('drag'); }, on);

  const edge = () => {
    const s = track.scrollLeft < 10, e = track.scrollLeft + track.clientWidth > track.scrollWidth - 10;
    const a = document.activeElement;
    car.classList.toggle('at-start', s); car.classList.toggle('at-end', e);
    prev.disabled = s; next.disabled = e;
    if ((a === prev && s) || (a === next && e)) (a === next && !s ? prev : a === prev && !e ? next : track).focus({ preventScroll: true });
  };
  track.addEventListener('scroll', edge, { passive: true, signal: ac.signal });
  edge();

  /* efeitos: ligados = carrossel à vista, cartão perto da área visível e sem pausa */
  let carOn = false, fxOff = false;
  const near = new Set<Element>();
  const smil = (c: Element, run: boolean) => $$<SVGSVGElement>('svg', c).forEach(s => {
    if (typeof s.pauseAnimations !== 'function') return;
    if (run && !REDUCED) s.unpauseAnimations(); else s.pauseAnimations();
  });
  const apply = (c: HTMLElement) => {
    const want = !REDUCED && carOn && near.has(c) && !fxOff;
    if (c.classList.contains('pd-on') === want) return;
    c.classList.toggle('pd-on', want); smil(c, want);
  };
  const all = () => cards.forEach(apply);
  const replay = (c: HTMLElement) => {
    if (REDUCED || fxOff || !c.classList.contains('pd-on')) return;
    c.classList.remove('pd-on'); void c.offsetWidth; c.classList.add('pd-on');
  };
  cards.forEach(c => {
    smil(c, false);
    c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') replay(c); }, on);
    c.addEventListener('click', () => { if (pt !== 'mouse') replay(c); }, on);
  });

  /* teclado: o trilho é uma parada só; as setas andam de modelo em modelo (destaque, rolagem e efeito de novo) */
  let cur = -1;
  const vis = (c: HTMLElement) => {
    const t = track.getBoundingClientRect(), r = c.getBoundingClientRect();
    return r.left >= t.left - 2 && r.right <= t.right + 2;
  };
  const first = () => Math.max(0, cards.findIndex(vis));
  const mark = (i: number) => {
    cur = i;
    cards.forEach((c, k) => c.classList.toggle('pd-cur', k === i));
    const m = PD_MODELS[i];
    if (live && m) live.textContent = `${m.n}, ${m.fx[0]}. Modelo ${i + 1} de ${cards.length}.`;
  };
  track.addEventListener('focus', () => { if (cur < 0 || !vis(cards[cur])) mark(first()); }, on);
  track.addEventListener('keydown', e => {
    if (!cards.length) return;
    if (cur < 0 || !vis(cards[cur])) cur = first();
    const keys: Record<string, number> = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: cards.length - 1 };
    const n = keys[e.key];
    if (n === undefined) return;
    e.preventDefault();
    const i = Math.max(0, Math.min(cards.length - 1, n));
    if (i === cur) return;
    const fwd = i > cur;
    mark(i);
    if (e.key === 'Home') track.scrollTo({ left: 0, behavior: beh() });
    else if (e.key === 'End') track.scrollTo({ left: track.scrollWidth, behavior: beh() });
    else if (!vis(cards[i])) go(fwd ? step() : -step());
    replay(cards[i]);
  }, on);

  const paintFx = () => {
    if (!fxBtn) return;
    $('use', fxBtn)?.setAttribute('href', fxOff ? '#i-play' : '#i-pause');
    const label = $('span', fxBtn);
    if (label) label.textContent = fxOff ? 'Retomar efeitos' : 'Pausar efeitos';
  };
  const ios: IntersectionObserver[] = [];
  if (REDUCED || typeof IntersectionObserver === 'undefined') {
    if (fxBtn) fxBtn.hidden = true;
  } else {
    fxBtn?.addEventListener('click', () => { fxOff = !fxOff; paintFx(); all(); }, on);
    const ioCar = new IntersectionObserver(es => { carOn = es[es.length - 1].isIntersecting; all(); }, { rootMargin: '160px 0px' });
    ioCar.observe(track);
    const ioCards = new IntersectionObserver(es => {
      es.forEach(e => (e.isIntersecting ? near.add(e.target) : near.delete(e.target)));
      all();
    }, { root: track, rootMargin: '0px 40%' });
    cards.forEach(c => ioCards.observe(c));
    ios.push(ioCar, ioCards);
  }

  return () => {
    ac.abort(); ios.forEach(io => io.disconnect()); track.classList.remove('drag');
    fxOff = false; paintFx(); if (fxBtn) fxBtn.hidden = false;
    if (live) live.textContent = '';
    cards.forEach(c => { c.classList.remove('pd-on', 'pd-cur'); smil(c, false); });
  };
}

/** Cartão "O ganho principal" acende uma vez quando entra na tela. */
export function bootGain(root: ParentNode): Dispose {
  const gain = $('.pd-gain', root);
  if (!gain) return noop;
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) gain.classList.add('on'); }, { threshold: .4 });
  io.observe(gain);
  return () => io.disconnect();
}

/** Gravação do Estúdio: três cenas em loop enquanto o palco está à vista. As etapas escolhem a
    cena (e tiram a pausa: escolher uma etapa é pedir para ver a cena), a etapa ativa mostra o progresso
    e o botão pausa e continua de onde parou. Relógio e animações andam juntos: fora da tela ou pausada,
    os dois congelam (.rec-hold); ao voltar, a cena recomeça se estava rodando ou fica no mesmo quadro,
    com o mesmo tempo restante, se estava pausada. */
export function bootRec(root: ParentNode): Dispose {
  const stage = $('#rec-stage', root);
  const rec = stage?.closest<HTMLElement>('.pd-rec');
  if (!stage || !rec) return noop;
  const frame = stage.closest<HTMLElement>('.pd-rec-frame') ?? stage;
  const url = $('#rec-url', root);
  const btns = $$<HTMLButtonElement>('[data-rec]', root);
  const pause = $<HTMLButtonElement>('#rec-pause', root);
  const ac = new AbortController(), on = { signal: ac.signal };
  let st = 0, timer = 0, visible = false, paused = false, running = false, t0 = 0, left = 0;

  const can = () => !REDUCED && visible && !paused && currentView === 'v-site';
  const run = (v: boolean) => { running = v; rec.classList.toggle('rec-hold', !v); };
  /* para o relógio guardando o que falta da cena (para continuar de onde parou) */
  const stop = () => {
    if (!running) return;
    clearTimeout(timer); run(false);
    left = Math.max(0, left - (performance.now() - t0));
  };
  const go = () => {
    stop(); if (!can()) return;
    run(true); t0 = performance.now();
    timer = window.setTimeout(() => { set((st + 1) % REC_SCENES.length); go(); }, left);
  };
  const set = (n: number) => {
    clearTimeout(timer); run(false);
    st = n; left = REC_SCENES[n].d; stage.dataset.state = String(n);
    /* reinicia as animações da cena e o progresso da etapa */
    stage.classList.remove('play'); rec.classList.remove('rec-run'); void stage.offsetWidth;
    stage.classList.add('play'); rec.classList.add('rec-run');
    rec.style.setProperty('--rec-d', REC_SCENES[n].d + 'ms');
    if (url) url.textContent = REC_SCENES[n].url;
    stage.setAttribute('aria-label', REC_SCENES[n].a);
    btns.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.rec) === n)));
  };
  const paint = () => {
    rec.classList.toggle('rec-paused', paused);
    if (!pause) return;
    $('use', pause)?.setAttribute('href', paused ? '#i-play' : '#i-pause');
    const label = $('span', pause);
    if (label) label.textContent = paused ? 'Continuar a gravação' : 'Pausar a gravação';
  };

  btns.forEach(b => b.addEventListener('click', () => {
    if (paused) { paused = false; paint(); }
    set(Number(b.dataset.rec)); go();
    /* em tela estreita as etapas ficam abaixo do palco: traz o palco para a vista */
    if (window.matchMedia('(max-width: 960px)').matches) {
      const r = frame.getBoundingClientRect();
      if (r.top < 72 || r.bottom > window.innerHeight) frame.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' });
    }
  }, on));
  if (pause) {
    if (REDUCED) pause.hidden = true;
    pause.addEventListener('click', () => {
      if (paused) { paused = false; paint(); go(); } else { stop(); paused = true; paint(); }
    }, on);
  }
  const io = new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible) { if (!paused) set(st); go(); } else stop();
  });
  io.observe(stage);
  document.addEventListener('halor:view', () => (can() ? go() : stop()), on);
  set(0);

  return () => {
    ac.abort(); io.disconnect(); clearTimeout(timer); running = false;
    paused = false; paint();
    stage.classList.remove('play'); rec.classList.remove('rec-run', 'rec-hold');
  };
}
