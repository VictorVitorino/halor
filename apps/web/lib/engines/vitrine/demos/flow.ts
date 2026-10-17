/* 18 · Connector / Flow Line · linhas que se desenham entre os nós e passam a fluir; um clique mostra
   as ligações e solta pacotes de luz por elas. Editável: nome do nó central, cor, velocidade e curvas. */
import { el, svgEl } from '../../../core';
import { q, vtAccent, vtEase, type VtCtx, type VtDemo } from '../ctx';

type NodeKey = 'dados' | 'crm' | 'motor' | 'painel' | 'sala';
/* o nó central pode ser renomeado no painel: as legendas usam o nome atual (c) */
const CORE = 'Motor';
const N: Record<NodeKey, readonly [x: number, y: number, name: string, caption: (c: string) => string]> = {
  dados: [58, 50, 'Dados', c => `Os dados alimentam: ${c}.`],
  crm: [58, 190, 'CRM', c => `O CRM alimenta: ${c}.`],
  motor: [200, 120, CORE, c => `${c} liga as fontes ao Painel e à Plateia.`],
  painel: [342, 50, 'Painel', c => `O Painel recebe de ${c} e mostra à Plateia.`],
  sala: [342, 190, 'Plateia', c => `A Plateia recebe de ${c} e do Painel.`]
};
const E: readonly (readonly [NodeKey, NodeKey])[] = [['dados', 'motor'], ['crm', 'motor'], ['motor', 'painel'], ['motor', 'sala'], ['painel', 'sala']];
const DEF = 'Clique num nó para ver as ligações';
const KEYS = Object.keys(N) as NodeKey[];

interface Link { a: NodeKey; b: NodeKey; base: SVGPathElement; flow: SVGPathElement; len: number }

export function flowDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-fw-box', card), svg = q<SVGSVGElement>('.vt-fw-svg', card), cap = q('.vt-fw-cap', card);
  let curve = true, speed = 1, core = CORE;
  const path = (a: NodeKey, b: NodeKey) => {
    const [ax, ay] = N[a], [bx, by] = N[b];
    if (!curve) return `M${ax} ${ay} L${bx} ${by}`;
    return ax === bx ? `M${ax} ${ay} C${ax + 46} ${ay + 40}, ${bx + 46} ${by - 40}, ${bx} ${by}` : `M${ax} ${ay} C${(ax + bx) / 2} ${ay}, ${(ax + bx) / 2} ${by}, ${bx} ${by}`;
  };
  const links: Link[] = E.map(([a, b]) => {
    const d = path(a, b);
    const base = ctx.own(svgEl('path', { d, class: 'vt-fw-base' })), flow = ctx.own(svgEl('path', { d, class: 'vt-fw-flow' }));
    svg.append(base, flow);
    return { a, b, base, flow, len: 0 };
  });
  const pk = ctx.own(svgEl('g', { class: 'vt-fw-pk' })); svg.append(pk);
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
    cap.textContent = k ? N[k][3](core) : DEF;
  };
  /* pacotes de luz que saem do nó clicado e percorrem cada ligação */
  const send = (k: NodeKey) => {
    if (ctx.reduced) return;
    links.filter(l => l.a === k || l.b === k).forEach((l, i) => {
      const dot = svgEl('circle', { r: 4.5, class: 'vt-fw-dot' }); pk.append(dot);
      const len = l.base.getTotalLength(), rev = l.b === k, to = btns[rev ? l.a : l.b];
      ctx.later(() => ctx.tween(950 / speed, p => {
        const pt = l.base.getPointAtLength(len * (rev ? 1 - vtEase(p) : vtEase(p)));
        dot.setAttribute('cx', String(pt.x)); dot.setAttribute('cy', String(pt.y)); dot.style.opacity = String(p < .9 ? 1 : (1 - p) * 10);
      }, () => { dot.remove(); ctx.kick(to, 'is-ping', 700); }), i * 90);
    });
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
      if (pinned) send(k);
      ctx.say(pinned ? `${N[k][3](core)} Ligações em destaque.` : 'Todas as ligações à mostra.');
    });
  });
  const unpin = () => { pinned = null; KEYS.forEach(n => btns[n].setAttribute('aria-pressed', 'false')); hi(null); };
  const draw = () => {
    timers.forEach(ctx.cancel); timers = [];
    links.forEach(l => {
      l.len = l.base.getTotalLength();
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

  return {
    start: draw,
    replay() { unpin(); draw(); },
    fields: [
      { k: 'core', t: 'text', l: 'Nó central', v: CORE, max: 14 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#c9a6ff' },
      { k: 'speed', t: 'range', l: 'Velocidade', v: 100, min: 25, max: 300, step: 25, fmt: v => v + '%' },
      { k: 'curve', t: 'toggle', l: 'Curvas', v: true }
    ],
    set(k, v) {
      if (k === 'core') {
        core = String(v).trim() || CORE;
        btns.motor.textContent = core;
        if (pinned) cap.textContent = N[pinned][3](core);
      }
      else if (k === 'acc') vtAccent(card, String(v));
      else if (k === 'speed') { speed = Number(v) / 100; card.style.setProperty('--vt-fs', speed.toFixed(2)); }
      else if (k === 'flow') card.classList.toggle('no-flow', !v);
      else if (k === 'curve') {
        if (curve === !!v) return;
        curve = !!v;
        links.forEach(l => { const d = path(l.a, l.b); l.base.setAttribute('d', d); l.flow.setAttribute('d', d); l.len = l.base.getTotalLength(); });
      }
    },
    /* o padrão: nenhum nó fixado, palco sem escurecer */
    reset: unpin
  };
}
