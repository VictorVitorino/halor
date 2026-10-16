/* 21 · Flip Card · o card gira e mostra o verso: antes na frente, depois atrás. */
import { q, qa, type VtCtx, type VtDemo } from '../ctx';

export function flipDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const cs = qa<HTMLButtonElement>('.vt-fl-card', card), all = q<HTMLButtonElement>('.vt-fl-all', card);
  let timers: number[] = [];
  const set = (c: HTMLElement, on: boolean) => {
    c.setAttribute('aria-pressed', String(on));
    c.setAttribute('aria-label', `${c.dataset.k}. ${on ? 'Depois' : 'Antes'}: ${on ? c.dataset.b : c.dataset.a}`);
  };
  const clear = () => { timers.forEach(ctx.cancel); timers = []; };
  cs.forEach(c => { set(c, false); ctx.on(c, 'click', () => { clear(); set(c, c.getAttribute('aria-pressed') !== 'true'); }); });
  ctx.on(all, 'click', () => {
    clear();
    const on = cs.some(c => c.getAttribute('aria-pressed') !== 'true');
    cs.forEach((c, i) => timers.push(ctx.later(() => set(c, on), i * 120)));
  });
  const intro = (delay: number) => { clear(); cs.forEach((c, i) => timers.push(ctx.later(() => set(c, true), delay + i * 260))); };
  ctx.defer(() => cs.forEach(c => { c.setAttribute('aria-pressed', 'false'); c.removeAttribute('aria-label'); }));
  return {
    start: () => intro(600),
    replay() { clear(); cs.forEach(c => set(c, false)); intro(900); },
    still: () => cs.forEach(c => set(c, true))
  };
}
