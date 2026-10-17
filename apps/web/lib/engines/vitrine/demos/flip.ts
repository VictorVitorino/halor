/* 21 · Flip Card · o card gira e mostra o verso: antes na frente, depois atrás.
   Editável: prazo antes e depois (a variação se recalcula), cor do verso e eixo do giro. */
import { q, qa, vtAccent, vtFmt, type VtCtx, type VtDemo } from '../ctx';

export function flipDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-fl', card), cs = qa<HTMLButtonElement>('.vt-fl-card', card), all = q<HTMLButtonElement>('.vt-fl-all', card);
  const c0 = cs[0], fB = q('.vt-fl-f b', c0), bB = q('.vt-fl-b b', c0), dS = q('.vt-fl-b em span', c0);
  let timers: number[] = [], A = 45, Bv = 12;
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
  const prazo = () => {
    const d = A ? Math.round((Bv - A) / A * 100) : 0;
    fB.textContent = `${vtFmt(A)} d`; bB.textContent = `${vtFmt(Bv)} d`;
    dS.textContent = `${d > 0 ? '+' : d < 0 ? '−' : ''}${Math.abs(d)}%`;
    c0.dataset.a = `${vtFmt(A)} dias`; c0.dataset.b = `${vtFmt(Bv)} dias`;
    set(c0, c0.getAttribute('aria-pressed') === 'true');
  };
  return {
    start: () => intro(600),
    replay() { clear(); cs.forEach(c => set(c, false)); intro(900); },
    still: () => cs.forEach(c => set(c, true)),
    fields: [
      { k: 'a', t: 'number', l: 'Prazo antes', v: 45, min: 1, max: 999, unit: 'dias' },
      { k: 'b', t: 'number', l: 'Prazo depois', v: 12, min: 0, max: 999, unit: 'dias' },
      { k: 'acc', t: 'color', l: 'Verso', v: '#8b3dff' },
      { k: 'axis', t: 'toggle', l: 'Giro vertical', v: false }
    ],
    set(k, v) {
      /* ao editar um lado, o primeiro card mostra esse lado */
      if (k === 'a') { A = Number(v); prazo(); clear(); set(c0, false); }
      else if (k === 'b') { Bv = Number(v); prazo(); clear(); set(c0, true); }
      else if (k === 'acc') vtAccent(card, String(v));
      else if (k === 'axis') box.classList.toggle('is-x', !!v);
    }
  };
}
