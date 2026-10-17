/* 06 · Glow / Light Sweep · o número principal tem anel de luz e varredura (CSS). Clicar num
   indicador secundário o promove a principal: o anel acende e a luz varre de novo. O principal é
   um botão: o clique faz a luz passar outra vez.
   Editável: valor em destaque, cor, intensidade e varredura. */
import { q, qa, vtAccent, vtSync, type VtCtx, type VtDemo } from '../ctx';

interface Kpi { k: string; v: string; d: string }
const DEF: readonly Kpi[] = [
  { k: 'Margem bruta', v: '41%', d: '+6 p.p. no ano' },
  { k: 'Custo', v: '−12%', d: '−R$ 1,1 mi no ano' },
  { k: 'Prazo', v: '18 dias', d: '9 dias a menos que em 2025' }
];

export function glowDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const main = q('.vt-gl-main', card), k = q('.vt-gl-k', main), v = q('.vt-gl-v', main), dd = q('.vt-gl-d', main), side = qa<HTMLButtonElement>('.vt-gl-s', card);
  let K = DEF.map(x => ({ ...x })), order = [0, 1, 2], swapT = 0;

  const render = () => {
    const m = K[order[0]];
    k.textContent = m.k; v.textContent = m.v; dd.textContent = m.d;
    main.setAttribute('aria-label', `Indicador em destaque: ${m.k}, ${m.v}, ${m.d}. Clique para a luz passar de novo.`);
    side.forEach((b, i) => {
      const x = K[order[i + 1]], s = b.querySelector('span'), n = b.querySelector('b');
      if (s) s.textContent = x.k;
      if (n) n.textContent = x.v;
      b.setAttribute('aria-label', `${x.k}: ${x.v}. Pôr em destaque.`);
    });
  };
  const promote = (slot: number) => {
    [order[0], order[slot]] = [order[slot], order[0]];
    ctx.cancel(swapT);
    ctx.kick(side[slot - 1], 'is-pop', 600);
    if (ctx.reduced) { render(); vtSync(card, 'val', K[order[0]].v); return; }
    main.classList.add('is-swap');
    swapT = ctx.later(() => {
      render(); vtSync(card, 'val', K[order[0]].v);
      main.classList.remove('is-swap');
      ctx.kick(main, 'is-flare', 1300);
    }, 220);
  };
  side.forEach((b, i) => ctx.on(b, 'click', () => promote(i + 1)));
  /* o principal também responde: a varredura e o anel passam de novo */
  ctx.on(main, 'click', () => ctx.kick(main, 'is-flare', 1300));
  render();

  return {
    replay() { ctx.kick(main, 'is-flare', 1300); },
    fields: [
      { k: 'val', t: 'text', l: 'Valor', v: '41%', max: 9 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'int', t: 'range', l: 'Intensidade', v: 100, min: 20, max: 220, step: 10, fmt: x => x + '%' },
      { k: 'sweep', t: 'toggle', l: 'Varredura', v: true }
    ],
    set(key, val) {
      if (key === 'val') { K[order[0]].v = String(val) || ' '; render(); }
      else if (key === 'acc') vtAccent(card, String(val));
      else if (key === 'int') card.style.setProperty('--vt-gi', (Number(val) / 100).toFixed(2));
      else if (key === 'sweep') card.classList.toggle('no-sweep', !val);
    },
    reset() { K = DEF.map(x => ({ ...x })); order = [0, 1, 2]; render(); }
  };
}
