/* 12 · Counter Animation · números que contam do zero ao valor final. */
import { qa, vtClamp, type VtCtx, type VtDemo } from '../ctx';

export function countDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const vals = qa('.vt-co-v', card), bars = qa('.vt-co-bar', card);
  /* texto renderizado no servidor: volta a ele na limpeza */
  const initial = vals.map(v => v.textContent);
  let raf = 0;
  const render = (v: HTMLElement, i: number, e: number) => {
    const d = +(v.dataset.dec || 0);
    v.textContent = (v.dataset.pre || '') + (+(v.dataset.to || 0) * e).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + (v.dataset.suf || '');
    bars[i].style.setProperty('--p', e.toFixed(3));
  };
  const run = () => {
    ctx.unframe(raf);
    const t0 = performance.now();
    const tick = (t: number) => {
      let done = true;
      vals.forEach((v, i) => {
        const p = vtClamp((t - t0 - 250 - i * 180) / 1800);
        if (p < 1) done = false;
        render(v, i, p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
      });
      if (!done) raf = ctx.frame(tick);
    };
    raf = ctx.frame(tick);
  };
  if (!ctx.reduced) vals.forEach((v, i) => render(v, i, 0));
  ctx.defer(() => { vals.forEach((v, i) => { v.textContent = initial[i]; }); bars.forEach(b => b.style.removeProperty('--p')); });
  return { start: run, replay: run, still: () => vals.forEach((v, i) => render(v, i, 1)) };
}
