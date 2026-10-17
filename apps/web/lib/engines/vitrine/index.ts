/* ==========================================================================
   VITRINE DE EFEITOS · motor
   Porte de prototype/src/js/37-vitrine.js: filtro por intenção, palco com 12
   demos ao vivo e editáveis (painel Editar efeito) e catálogo dos 40 efeitos com
   prévias brincáveis (renderizado no servidor por components/vitrine/VitrineCatalog.tsx;
   aqui só ganha comportamento). Tudo o que se clica solta uma onda (Ripple).
   Uso: `useEngine('v-site', () => bootVitrine())`. Devolve a limpeza.
   ========================================================================== */
import { REDUCED } from '../../core';
import { createCtx, q, qa, reflow, vtRestart, type VtCtx, type VtDemo } from './ctx';
import { VT_INTENT, VT_SHOW, vtMoreLabel, vtMoreText, type VtIntent } from './data';
import { vtEditor } from './vt-editor';
import { vtCatalogLinks, vtMinis, vtRipples } from './vt-catalog';
import { baDemo } from './demos/ba';
import { chartDemo } from './demos/chart';
import { countDemo } from './demos/count';
import { flipDemo } from './demos/flip';
import { flowDemo } from './demos/flow';
import { matrixDemo } from './demos/matrix';
import { particleDemo } from './demos/particle';
import { spotDemo } from './demos/spot';
import { stackDemo } from './demos/stack';
import { tiltDemo } from './demos/tilt';
import { glowDemo } from './demos/vt-glow';
import { typeDemo } from './demos/vt-type';

type DemoFactory = (card: HTMLElement, ctx: VtCtx) => VtDemo;

/** Fábricas por `data-demo`. */
const VT_DEMO: Record<string, DemoFactory> = {
  particle: particleDemo, tilt: tiltDemo, type: typeDemo, count: countDemo, glow: glowDemo, spot: spotDemo,
  stack: stackDemo, chart: chartDemo, flip: flipDemo, ba: baDemo, matrix: matrixDemo, flow: flowDemo,
};

export function bootVitrine(root: ParentNode = document): () => void {
  const sec = root.querySelector<HTMLElement>('#vitrine');
  if (!sec || sec.dataset.vtBoot) return () => {};
  sec.dataset.vtBoot = '1';
  /* REDUCED do núcleo só é lido no primeiro initCore(), que pode rodar depois desta partida */
  const reduced = REDUCED || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const status = sec.querySelector<HTMLElement>('#vt-status');
  let sayT = 0;
  const { ctx, dispose } = createCtx(reduced, t => {
    if (!status) return;
    status.textContent = ''; ctx.cancel(sayT);
    sayT = ctx.later(() => { status.textContent = t; }, 30);
  });

  sec.classList.add('vt-ready');
  if (reduced) sec.classList.add('vt-reduced');
  ctx.defer(() => { sec.classList.remove('vt-ready', 'vt-reduced'); delete sec.dataset.vtBoot; });
  /* a marcação pré-renderizada volta intacta na limpeza (classes, estilos, rótulos, nós criados) */
  ['#vt-stage', '#vt-cat', '#vt-more', '#vt-chips', '#vt-count', '#vt-status', '#vt-empty'].forEach(s => ctx.snap(sec.querySelector(s)));

  const live: Record<number, HTMLElement> = {};
  qa('.vt-card', sec).forEach(c => (c.dataset.fx || '').split(' ').forEach(n => { live[+n] = c; }));

  vtCatalogLinks(sec, live, ctx);
  vtFilter(sec, ctx);
  vtDemos(sec, ctx);
  vtMinis(sec, ctx);
  vtRipples(sec, ctx);
  return dispose;
}

/* · Filtro por intenção (vale para o palco e para o catálogo) ·
   O catálogo abre com 8 itens; o botão + mostra os outros ali mesmo. */
function vtFilter(sec: HTMLElement, ctx: VtCtx) {
  const chips = qa<HTMLButtonElement>('.vt-chip', sec), wrap = q('#vt-chips', sec), stage = q('#vt-stage', sec);
  const cards = qa('.vt-card', sec), items = qa<HTMLLIElement>('#vt-cat > li', sec);
  const empty = q('#vt-empty', sec), count = q('#vt-count', sec);
  const more = q<HTMLButtonElement>('#vt-more', sec), moreI = more.querySelector('span'), moreT = more.querySelector('b');
  let cur = 'todos', open = false;
  const moreSync = (n: number) => {
    more.hidden = n <= VT_SHOW;
    more.setAttribute('aria-expanded', String(open));
    if (moreI) moreI.textContent = open ? '−' : '+';
    if (moreT) moreT.textContent = vtMoreText(n, open);
    more.setAttribute('aria-label', vtMoreLabel(n, open));
  };
  const pop = (n: HTMLElement) => { if (ctx.reduced) return; n.classList.remove('is-in'); reflow(n); n.classList.add('is-in'); };
  const apply = (k: string, quiet?: boolean) => {
    cur = k;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.intent === k)));
    const ok = (n: HTMLElement) => k === 'todos' || (n.dataset.intents || '').split(' ').includes(k);
    let nd = 0, ni = 0;
    cards.forEach(c => { const s = ok(c), was = !c.hidden; c.hidden = !s; if (s) { nd++; if (!quiet || !was) pop(c); } });
    let shown = 0;
    items.forEach(li => {
      const s = ok(li); if (s) ni++;
      const v = s && (open || shown < VT_SHOW), was = !li.hidden;
      li.hidden = !v; if (v) { shown++; if (!quiet || !was) pop(li); }
    });
    stage.classList.toggle('is-filtered', k !== 'todos');
    stage.hidden = nd === 0;
    empty.hidden = nd !== 0;
    const label = VT_INTENT[k as VtIntent];
    if (!nd) empty.textContent = `Para ${(label || k).toLowerCase()}, os efeitos estão no catálogo logo abaixo.`;
    count.textContent = `${shown} de ${ni}`;
    moreSync(ni);
    ctx.say(k === 'todos' ? `Todos os efeitos: ${ni} no catálogo, ${nd} ao vivo.` : `${label}: ${ni} efeitos no catálogo, ${nd} ao vivo.`);
  };
  chips.forEach(c => ctx.on(c, 'click', () => { if (c.getAttribute('aria-pressed') !== 'true') apply(c.dataset.intent || 'todos'); }));
  ctx.on(more, 'click', () => {
    open = !open; apply(cur, true);
    ctx.say(open ? `Catálogo aberto: ${count.textContent} efeitos à mostra.` : 'Catálogo recolhido.');
    if (!open) more.scrollIntoView({ block: 'nearest', behavior: ctx.reduced ? 'auto' : 'smooth' });
  });
  const edge = () => wrap.classList.toggle('at-end', wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
  ctx.on(wrap, 'scroll', edge, { passive: true });
  window.addEventListener('resize', edge, { passive: true, signal: ctx.signal });
  edge();
  apply('todos', true);
}

/* · Palco: liga cada demo à tela e ao editor · */
function vtDemos(sec: HTMLElement, ctx: VtCtx) {
  const ctl = new Map<HTMLElement, VtDemo>();
  qa('.vt-card', sec).forEach(card => {
    const make = VT_DEMO[card.dataset.demo || ''];
    const d = (make && make(card, ctx)) || {};
    ctl.set(card, d);
    vtEditor(card, d, ctx);
    if (ctx.reduced) { card.classList.add('is-on', 'is-vis'); d.still?.(); return; }
    const rep = card.querySelector<HTMLButtonElement>('.vt-replay');
    if (rep) ctx.on(rep, 'click', () => {
      vtRestart(card);
      if (d.replay) d.replay(); else d.start?.();
    });
  });
  if (ctx.reduced) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    const card = e.target as HTMLElement, d = ctl.get(card);
    if (!d) return;
    card.classList.toggle('is-vis', e.isIntersecting);
    if (e.isIntersecting && e.intersectionRatio >= .3 && !card.classList.contains('is-on')) { card.classList.add('is-on'); d.start?.(); }
    if (e.isIntersecting) { if (card.classList.contains('is-on')) d.resume?.(); }
    else d.pause?.();
  }), { threshold: [0, .3] });
  ctl.forEach((_, card) => io.observe(card));
  ctx.defer(() => { io.disconnect(); ctl.forEach(d => d.pause?.()); });
}
