/* 33 · Card Stack · o card do topo sai (arrasto, clique ou teclado) e vai para o fundo. */
import { q, qa, type VtCtx, type VtDemo } from '../ctx';

export function stackDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const pile = q('.vt-st-pile', card), cards = qa('.vt-st-card', pile), live = q('.vt-st-live', card);
  let order = cards.map((_, i) => i), busy = false;
  const text = (c: HTMLElement, s: string) => c.querySelector(s)?.textContent ?? '';
  const label = (c: HTMLElement) => `Capítulo ${text(c, 'span').replace(' / ', ' de ')}: ${text(c, 'b')}. ${text(c, 'p')}`;
  const layout = () => order.forEach((ci, o) => {
    const c = cards[ci];
    c.style.setProperty('--o', String(o));
    c.classList.toggle('is-top', o === 0);
    c.tabIndex = o === 0 ? 0 : -1;
    c.setAttribute('aria-hidden', String(o !== 0));
  });
  const settle = (c: HTMLElement) => { c.classList.remove('is-drag'); c.style.removeProperty('--dx'); c.style.removeProperty('--dr'); };
  cards.forEach(c => { c.setAttribute('role', 'button'); c.setAttribute('aria-label', label(c) + ' Pressione Enter para o próximo.'); });

  const next = (dir = 1) => {
    if (busy) return; busy = true;
    const c = cards[order[0]], had = document.activeElement === c;
    c.classList.remove('is-drag');
    c.style.setProperty('--dx', dir * pile.offsetWidth * 1.15 + 'px');
    c.style.setProperty('--dr', dir * 16 + 'deg');
    ctx.later(() => {
      order.push(order.shift()!);
      c.style.removeProperty('--dx'); c.style.removeProperty('--dr');
      layout();
      live.textContent = label(cards[order[0]]);
      if (had) cards[order[0]].focus({ preventScroll: true });
      busy = false;
    }, ctx.reduced ? 0 : 260);
  };

  let sx = 0, dx = 0, drag: HTMLElement | null = null;
  ctx.on(pile, 'pointerdown', e => {
    const c = (e.target as Element).closest<HTMLElement>('.vt-st-card');
    if (!c || !c.classList.contains('is-top') || busy) return;
    drag = c; sx = e.clientX; dx = 0;
    c.setPointerCapture(e.pointerId);
  });
  ctx.on(pile, 'pointermove', e => {
    if (!drag) return;
    dx = e.clientX - sx;
    if (Math.abs(dx) > 4) drag.classList.add('is-drag');
    drag.style.setProperty('--dx', dx + 'px'); drag.style.setProperty('--dr', dx * .06 + 'deg');
  });
  const up = (e: PointerEvent) => {
    if (!drag) return;
    const c = drag; drag = null;
    if (e.type === 'pointercancel') { settle(c); return; }
    if (Math.abs(dx) > 70 || Math.abs(dx) < 5) next(dx < -70 ? -1 : 1);
    else settle(c);
  };
  ctx.on(pile, 'pointerup', up);
  ctx.on(pile, 'pointercancel', up);
  ctx.on(pile, 'keydown', e => {
    if (!(e.target as Element).classList.contains('is-top')) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); next(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); next(-1); }
  });
  layout();
  ctx.defer(() => {
    cards.forEach(c => {
      settle(c); c.classList.remove('is-top'); c.style.removeProperty('--o');
      ['role', 'aria-label', 'aria-hidden', 'tabindex'].forEach(a => c.removeAttribute(a));
    });
    live.textContent = '';
  });

  return {
    replay() { order = cards.map((_, i) => i); layout(); },
    still: layout
  };
}
