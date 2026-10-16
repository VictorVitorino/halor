/* ==========================================================================
   PRODUTO · carrossel de modelos prontos, cartão do ganho principal e a
   gravação do Estúdio em loop (montar, baixar HTML, importar arquivo).
   Porte de prototype/src/js/36-produto.js (bootProduto). A marcação dos
   modelos, do trilho e dos slides já chega pré-renderizada (Produto.tsx);
   aqui só entra o comportamento.
   ========================================================================== */
import { $, $$, REDUCED, currentView } from '@/lib/core';
import { REC_URLS } from './data';

export type Dispose = () => void;
const noop: Dispose = () => {};

/** Carrossel: setas, arrasto com o mouse, máscaras nas bordas e efeitos dos slides só com o carrossel à vista. */
export function bootCarousel(root: ParentNode): Dispose {
  const track = $<HTMLDivElement>('#pd-models', root);
  const car = track?.closest<HTMLElement>('.pd-carousel');
  if (!track || !car) return noop;
  const ac = new AbortController(), on = { signal: ac.signal };
  const by = () => Math.max(240, track.clientWidth * .8);
  const behavior = (): ScrollBehavior => (REDUCED ? 'auto' : 'smooth');
  $('.pd-prev', car)?.addEventListener('click', () => track.scrollBy({ left: -by(), behavior: behavior() }), on);
  $('.pd-next', car)?.addEventListener('click', () => track.scrollBy({ left: by(), behavior: behavior() }), on);

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

  const io = new IntersectionObserver(es => car.classList.toggle('run', es[0].isIntersecting));
  io.observe(car);

  return () => { ac.abort(); io.disconnect(); car.classList.remove('run'); track.classList.remove('drag'); };
}

/** Cartão "O ganho principal" acende uma vez quando entra na tela. */
export function bootGain(root: ParentNode): Dispose {
  const gain = $('.pd-gain', root);
  if (!gain) return noop;
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) gain.classList.add('on'); }, { threshold: .4 });
  io.observe(gain);
  return () => io.disconnect();
}

/** Gravação do Estúdio: três cenas em loop enquanto o palco está à vista; os botões escolhem a cena. */
export function bootRec(root: ParentNode): Dispose {
  const stage = $('#rec-stage', root);
  if (!stage) return noop;
  const url = $('#rec-url', root);
  const btns = $$<HTMLButtonElement>('[data-rec]', root);
  const ac = new AbortController(), on = { signal: ac.signal };
  let st = 0, timer = 0, visible = false;

  const set = (n: number) => {
    st = n; stage.dataset.state = String(n);
    /* reinicia as animações da cena */
    stage.classList.remove('play'); void stage.offsetWidth; stage.classList.add('play');
    if (url) url.textContent = REC_URLS[n];
    btns.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.rec) === n)));
  };
  const loop = () => {
    clearTimeout(timer);
    if (REDUCED || !visible || currentView !== 'v-site') return;
    timer = window.setTimeout(() => { set((st + 1) % REC_URLS.length); loop(); }, 4600);
  };

  btns.forEach(b => b.addEventListener('click', () => { set(Number(b.dataset.rec)); loop(); }, on));
  const io = new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible) { set(st); loop(); } else clearTimeout(timer);
  });
  io.observe(stage);
  document.addEventListener('halor:view', loop, on);
  set(0);

  return () => { ac.abort(); io.disconnect(); clearTimeout(timer); stage.classList.remove('play'); };
}
