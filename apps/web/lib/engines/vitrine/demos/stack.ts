/* 33 · Card Stack · o card do topo sai (arrasto, clique ou teclado) e vai para o fundo.
   Editável: título do card do topo, cor, profundidade e leque. */
import { q, qa, vtAccent, vtSync, type VtCtx, type VtDemo } from '../ctx';

export function stackDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const pile = q('.vt-st-pile', card), cards = qa('.vt-st-card', pile), live = q('.vt-st-live', card);
  const text = (c: HTMLElement, s: string) => c.querySelector(s)?.textContent ?? '';
  const TT = cards.map(c => text(c, 'b'));
  let order = cards.map((_, i) => i), busy = false;
  const label = (c: HTMLElement) => `Capítulo ${text(c, 'span').replace(' / ', ' de ')}: ${text(c, 'b')}. ${text(c, 'p')}`;
  const title = (c: HTMLElement, t: string) => { const b = c.querySelector('b'); if (b) b.textContent = t; };
  const layout = () => order.forEach((ci, o) => {
    const c = cards[ci];
    c.style.setProperty('--o', String(o));
    c.style.setProperty('--sg', o % 2 ? '-1' : '1');
    c.classList.toggle('is-top', o === 0);
    c.tabIndex = o === 0 ? 0 : -1;
    c.setAttribute('aria-hidden', String(o !== 0));
  });
  const name = () => cards.forEach(c => c.setAttribute('aria-label', label(c) + ' Pressione Enter para o próximo.'));
  const settle = (c: HTMLElement) => { c.classList.remove('is-drag'); c.style.removeProperty('--dx'); c.style.removeProperty('--dr'); };
  cards.forEach(c => c.setAttribute('role', 'button'));
  name();

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
      vtSync(card, 'top', text(cards[order[0]], 'b'));
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

  return {
    replay() { order = cards.map((_, i) => i); layout(); vtSync(card, 'top', text(cards[0], 'b')); },
    still: layout,
    fields: [
      { k: 'top', t: 'text', l: 'Card do topo', v: TT[0], max: 26 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#8b3dff' },
      { k: 'depth', t: 'range', l: 'Profundidade', v: 100, min: 0, max: 220, step: 10, fmt: v => v + '%' },
      { k: 'fan', t: 'toggle', l: 'Leque', v: false }
    ],
    set(k, v) {
      if (k === 'top') { title(cards[order[0]], String(v) || ' '); name(); }
      else if (k === 'acc') vtAccent(card, String(v));
      else if (k === 'depth') card.style.setProperty('--vt-dp', (Number(v) / 100).toFixed(2));
      else if (k === 'fan') card.classList.toggle('is-fan', !!v);
    },
    reset() { cards.forEach((c, i) => title(c, TT[i])); order = cards.map((_, i) => i); layout(); name(); }
  };
}
