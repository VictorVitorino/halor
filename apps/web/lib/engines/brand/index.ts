/* ==========================================================================
   MARCA · índice com destaque da seção visível, demonstrações de movimento
   que recomeçam ao clicar e os Campos Halor da capa e da demonstração.
   Porte de prototype/src/js/70-brand.js (as amostras de cor e a escala da
   cadeia agora saem do servidor, em components/brand/BrandSwatches.tsx).
   ========================================================================== */
import { $, $$ } from '../../core';
import { bootFields } from '../particles';

/** Liga o manual dentro de `root` (#v-brand) e devolve a limpeza. */
export function bootBrand(root: HTMLElement): () => void {
  const ac = new AbortController();
  const disposeFields = bootFields(root);

  /* índice: destaca a seção visível */
  const links = $$<HTMLAnchorElement>('.b-toc a', root);
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); });
  }, { rootMargin: '-30% 0px -60% 0px' });
  $$('.b-sec', root).forEach(s => obs.observe(s));

  /* reinicia a animação ao clicar (o protótipo trocava o nó por um clone; aqui as animações voltam ao início sem mexer na árvore do React) */
  root.addEventListener('click', e => {
    const b = (e.target as Element | null)?.closest<HTMLElement>('[data-replay]'); if (!b) return;
    const s = $('.mv-stage > *', b); if (!s) return;
    s.getAnimations({ subtree: true }).forEach(a => { a.currentTime = 0; a.play(); });
  }, { signal: ac.signal });

  return () => {
    ac.abort();
    obs.disconnect();
    links.forEach(a => a.classList.remove('on'));
    disposeFields();
  };
}
