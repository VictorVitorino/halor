/* ==========================================================================
   PRODUTO · carrossel de modelos prontos (cada miniatura com o efeito vivo),
   cartão do ganho principal e a gravação do Estúdio em três cenas (monte e
   edite na própria apresentação, baixe em HTML/PDF/PPT, importe um modelo).
   Porte de prototype/src/js/36-produto.js (pdBootModels e pdBootRec).
   A marcação dos modelos e das cenas já chega pré-renderizada (Produto.tsx);
   aqui só entra o comportamento.
   ========================================================================== */
import { $, $$, REDUCED, currentView } from '@/lib/core';
import { REC_SCENES } from './data';

export type Dispose = () => void;
const noop: Dispose = () => {};

/** Modelos: setas, arrasto, teclado, máscaras nas bordas e cada efeito só com o cartão à vista.
    Passar o cursor (ou focar) um cartão reinicia a coreografia do efeito. */
export function bootCarousel(root: ParentNode): Dispose {
  const track = $<HTMLDivElement>('#pd-models', root);
  const car = track?.closest<HTMLElement>('.pd-carousel');
  if (!track || !car) return noop;
  const cards = $$<HTMLElement>('.pd-model', track);
  const ac = new AbortController(), on = { signal: ac.signal };
  const step = () => (cards[0] ? cards[0].getBoundingClientRect().width + 16 : 300);
  const by = () => Math.max(step(), Math.floor(track.clientWidth / step()) * step());
  const go = (dx: number) => track.scrollBy({ left: dx, behavior: REDUCED ? 'auto' : 'smooth' });
  $('.pd-prev', car)?.addEventListener('click', () => go(-by()), on);
  $('.pd-next', car)?.addEventListener('click', () => go(by()), on);
  track.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); go(e.key === 'ArrowRight' ? step() : -step());
  }, on);

  /* arrasto só com o mouse: no toque a rolagem nativa já faz o trabalho */
  let dx: number | null = null, sl = 0;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    dx = e.clientX; sl = track.scrollLeft; track.classList.add('drag');
  }, on);
  window.addEventListener('pointermove', e => { if (dx != null) track.scrollLeft = sl - (e.clientX - dx); }, on);
  window.addEventListener('pointerup', () => { dx = null; track.classList.remove('drag'); }, on);

  const edge = () => {
    car.classList.toggle('at-start', track.scrollLeft < 10);
    car.classList.toggle('at-end', track.scrollLeft + track.clientWidth > track.scrollWidth - 10);
  };
  track.addEventListener('scroll', edge, { passive: true, signal: ac.signal });
  edge();

  /* SMIL (pacotes do conector) só corre com o cartão à vista */
  const smil = (c: Element, run: boolean) => $$<SVGSVGElement>('svg', c).forEach(s => {
    if (typeof s.pauseAnimations !== 'function') return;
    if (run && !REDUCED) s.unpauseAnimations(); else s.pauseAnimations();
  });
  const replay = (c: HTMLElement) => {
    if (REDUCED || !c.classList.contains('pd-on')) return;
    c.classList.remove('pd-on'); void c.offsetWidth; c.classList.add('pd-on');
  };
  cards.forEach(c => {
    smil(c, false);
    c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') replay(c); }, on);
    c.addEventListener('focus', () => replay(c), on);
  });

  let io: IntersectionObserver | null = null;
  if (!REDUCED && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(es => es.forEach(e => {
      e.target.classList.toggle('pd-on', e.isIntersecting); smil(e.target, e.isIntersecting);
    }), { threshold: .35 });
    cards.forEach(c => io?.observe(c));
  }

  return () => {
    ac.abort(); io?.disconnect(); track.classList.remove('drag');
    cards.forEach(c => { c.classList.remove('pd-on'); smil(c, false); });
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
    cena, a etapa ativa mostra o progresso e o botão pausa e continua de onde parou. */
export function bootRec(root: ParentNode): Dispose {
  const stage = $('#rec-stage', root);
  const rec = stage?.closest<HTMLElement>('.pd-rec');
  if (!stage || !rec) return noop;
  const url = $('#rec-url', root);
  const btns = $$<HTMLButtonElement>('[data-rec]', root);
  const pause = $<HTMLButtonElement>('#rec-pause', root);
  const ac = new AbortController(), on = { signal: ac.signal };
  let st = 0, timer = 0, visible = false, paused = false, running = false, t0 = 0, left = 0;

  const can = () => !REDUCED && visible && !paused && currentView === 'v-site';
  /* para o relógio guardando o que falta da cena (para continuar de onde parou) */
  const stop = () => {
    if (!running) return;
    clearTimeout(timer); running = false;
    left = Math.max(0, left - (performance.now() - t0));
  };
  const go = () => {
    stop(); if (!can()) return;
    running = true; t0 = performance.now();
    timer = window.setTimeout(() => { running = false; set((st + 1) % REC_SCENES.length); go(); }, left);
  };
  const set = (n: number) => {
    clearTimeout(timer); running = false;
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

  btns.forEach(b => b.addEventListener('click', () => { set(Number(b.dataset.rec)); go(); }, on));
  if (pause) {
    if (REDUCED) pause.hidden = true;
    pause.addEventListener('click', () => {
      if (paused) { paused = false; paint(); go(); } else { stop(); paused = true; paint(); }
    }, on);
  }
  const io = new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible) { set(st); go(); } else stop();
  });
  io.observe(stage);
  document.addEventListener('halor:view', () => (can() ? go() : stop()), on);
  set(0);

  return () => {
    ac.abort(); io.disconnect(); clearTimeout(timer); running = false;
    paused = false; paint();
    stage.classList.remove('play'); rec.classList.remove('rec-run');
  };
}
