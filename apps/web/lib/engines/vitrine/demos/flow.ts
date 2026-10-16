/* 18 · Connector / Flow Line · linhas que se desenham entre os nós e passam a fluir; um toque mostra as ligações. */
import { el, svgEl } from '../../../core';
import { q, type VtCtx, type VtDemo } from '../ctx';

type NodeKey = 'dados' | 'crm' | 'motor' | 'painel' | 'sala';
const N: Record<NodeKey, readonly [x: number, y: number, name: string, caption: string]> = {
  dados: [58, 50, 'Dados', 'Os dados alimentam o Motor.'],
  crm: [58, 190, 'CRM', 'O CRM alimenta o Motor.'],
  motor: [200, 120, 'Motor', 'O Motor liga as fontes ao Painel e à Plateia.'],
  painel: [342, 50, 'Painel', 'O Painel recebe do Motor e mostra à Plateia.'],
  sala: [342, 190, 'Plateia', 'A Plateia recebe do Motor e do Painel.']
};
const E: readonly (readonly [NodeKey, NodeKey])[] = [['dados', 'motor'], ['crm', 'motor'], ['motor', 'painel'], ['motor', 'sala'], ['painel', 'sala']];
const DEF = 'Toque num nó para ver as ligações';
const KEYS = Object.keys(N) as NodeKey[];

interface Link { a: NodeKey; b: NodeKey; base: SVGPathElement; flow: SVGPathElement; len: number }

export function flowDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-fw-box', card), svg = q<SVGSVGElement>('.vt-fw-svg', card), cap = q('.vt-fw-cap', card);
  const links: Link[] = E.map(([a, b]) => {
    const [ax, ay] = N[a], [bx, by] = N[b];
    const d = ax === bx ? `M${ax} ${ay} C${ax + 46} ${ay + 40}, ${bx + 46} ${by - 40}, ${bx} ${by}` : `M${ax} ${ay} C${(ax + bx) / 2} ${ay}, ${(ax + bx) / 2} ${by}, ${bx} ${by}`;
    const base = ctx.own(svgEl('path', { d, class: 'vt-fw-base' })), flow = ctx.own(svgEl('path', { d, class: 'vt-fw-flow' }));
    svg.append(base, flow);
    return { a, b, base, flow, len: 0 };
  });
  let pinned: NodeKey | null = null, timers: number[] = [];
  const btns = {} as Record<NodeKey, HTMLButtonElement>;
  KEYS.forEach((k, i) => {
    const [x, y, name] = N[k];
    const b = ctx.own(el('button', 'vt-fw-n' + (k === 'motor' ? ' is-core' : ''), name));
    b.type = 'button'; b.style.left = x / 4 + '%'; b.style.top = y / 2.4 + '%'; b.style.setProperty('--i', String(i));
    b.setAttribute('aria-pressed', 'false');
    btns[k] = b; box.append(b);
  });
  const hi = (k: NodeKey | null) => {
    const on = !!k;
    svg.classList.toggle('is-dim', on); box.classList.toggle('is-dim', on);
    KEYS.forEach(n => { btns[n].classList.toggle('is-hi', n === k); btns[n].classList.remove('is-nb'); });
    links.forEach(l => {
      const t = on && (l.a === k || l.b === k);
      l.base.classList.toggle('is-hi', t); l.flow.classList.toggle('is-hi', t);
      if (t) btns[l.a === k ? l.b : l.a].classList.add('is-nb');
    });
    cap.textContent = k ? N[k][3] : DEF;
  };
  KEYS.forEach(k => {
    const b = btns[k];
    ctx.on(b, 'pointerenter', () => { if (!pinned) hi(k); });
    ctx.on(b, 'pointerleave', () => { if (!pinned) hi(null); });
    ctx.on(b, 'focus', () => { if (!pinned) hi(k); });
    ctx.on(b, 'blur', () => { if (!pinned) hi(null); });
    ctx.on(b, 'click', () => {
      pinned = pinned === k ? null : k;
      KEYS.forEach(n => btns[n].setAttribute('aria-pressed', String(n === pinned)));
      hi(pinned || k);
    });
  });
  const draw = () => {
    timers.forEach(ctx.cancel); timers = [];
    links.forEach(l => {
      l.len = l.len || l.base.getTotalLength();
      l.base.style.transition = 'none'; l.base.style.strokeDasharray = String(l.len); l.base.style.strokeDashoffset = String(l.len);
      l.flow.style.transition = 'none'; l.flow.style.opacity = '0';
    });
    void svg.getBoundingClientRect();
    links.forEach((l, i) => {
      l.base.style.transition = `stroke-dashoffset 900ms var(--ease-halo) ${300 + i * 170}ms`;
      l.base.style.strokeDashoffset = '0';
      l.flow.style.transition = `opacity 600ms var(--ease-halo) ${1100 + i * 170}ms`;
      l.flow.style.opacity = '';
    });
    timers.push(ctx.later(() => links.forEach(l => {
      l.base.style.transition = ''; l.base.style.strokeDasharray = ''; l.base.style.strokeDashoffset = ''; l.flow.style.transition = '';
    }), 2400));
  };
  if (!ctx.reduced) links.forEach(l => { l.len = l.base.getTotalLength(); l.base.style.strokeDasharray = String(l.len); l.base.style.strokeDashoffset = String(l.len); l.flow.style.opacity = '0'; });
  ctx.defer(() => { svg.classList.remove('is-dim'); box.classList.remove('is-dim'); cap.textContent = DEF; });

  return {
    start: draw,
    replay() { pinned = null; KEYS.forEach(n => btns[n].setAttribute('aria-pressed', 'false')); hi(null); draw(); }
  };
}
