/* 35 · Interactive Matrix · bolhas arrastáveis (ponteiro e setas) entre os quadrantes de impacto x esforço. */
import { el } from '../../../core';
import { q, qa, vtClamp, type VtCtx, type VtDemo } from '../ctx';

const QN = ['Ganhos rápidos', 'Grandes apostas', 'Ajustes finos', 'Evitar'];
const START: readonly (readonly [string, number, number])[] = [['Painel', 22, 26], ['Capa nova', 36, 40], ['Treino', 72, 30], ['Migração', 78, 76], ['Relatório', 30, 74]];
const quad = (x: number, y: number) => (x >= 50 ? 1 : 0) + (y >= 50 ? 2 : 0);
const KEYS = (s: number): Record<string, [number, number]> => ({ ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] });

export function matrixDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const plot = q('.vt-mx-plot', card), leg = q('.vt-mx-leg', card), qs = qa('.vt-mx-q', plot);
  const bs = START.map(([name, x, y], i) => {
    const b = ctx.own(el('button', 'vt-mx-b', name));
    b.type = 'button'; b.dataset.x = String(x); b.dataset.y = String(y); b.style.setProperty('--d', i * 90 + 'ms');
    plot.append(b); return b;
  });
  const place = (b: HTMLButtonElement) => {
    const x = +(b.dataset.x || 0), y = +(b.dataset.y || 0), k = quad(x, y);
    b.style.left = x + '%'; b.style.top = y + '%';
    b.classList.toggle('is-q0', k === 0);
    b.setAttribute('aria-label', `${b.textContent}: ${QN[k]}. Use as setas para mover.`);
  };
  const tally = () => {
    const n = [0, 0, 0, 0];
    bs.forEach(b => n[quad(+(b.dataset.x || 0), +(b.dataset.y || 0))]++);
    leg.replaceChildren();
    QN.forEach((name, i) => { const s = el('span', '', name + ' '); s.append(el('b', '', String(n[i]))); leg.append(s); });
  };
  const hot = (k: number) => qs.forEach((d, i) => d.classList.toggle('is-hot', i === k));
  let drag: HTMLButtonElement | null = null;
  bs.forEach(b => {
    ctx.on(b, 'pointerdown', e => { drag = b; b.setPointerCapture(e.pointerId); b.classList.add('is-drag'); b.style.setProperty('--d', '0ms'); });
    ctx.on(b, 'pointermove', e => {
      if (drag !== b) return;
      const r = plot.getBoundingClientRect();
      b.dataset.x = vtClamp((e.clientX - r.left) / r.width * 100, 6, 94).toFixed(1);
      b.dataset.y = vtClamp((e.clientY - r.top) / r.height * 100, 8, 92).toFixed(1);
      place(b); hot(quad(+b.dataset.x, +b.dataset.y));
    });
    const end = () => { if (drag !== b) return; drag = null; b.classList.remove('is-drag'); hot(-1); tally(); };
    ctx.on(b, 'pointerup', end); ctx.on(b, 'pointercancel', end);
    ctx.on(b, 'keydown', e => {
      const d = KEYS(e.shiftKey ? 15 : 5)[e.key];
      if (!d) return;
      e.preventDefault(); b.style.setProperty('--d', '0ms');
      b.dataset.x = String(vtClamp(+(b.dataset.x || 0) + d[0], 6, 94)); b.dataset.y = String(vtClamp(+(b.dataset.y || 0) + d[1], 8, 92));
      place(b); tally();
    });
  });
  const reset = () => {
    bs.forEach((b, i) => { b.dataset.x = String(START[i][1]); b.dataset.y = String(START[i][2]); b.style.setProperty('--d', i * 90 + 'ms'); place(b); });
    tally();
  };
  reset();
  ctx.defer(() => { leg.replaceChildren(); hot(-1); });
  return { replay: reset, still: reset };
}
