/* ==========================================================================
   VITRINE DE EFEITOS · motor
   Porte de prototype/src/js/37-vitrine.js: filtro por intenção, palco com 12
   demos ao vivo e catálogo dos 40 efeitos (renderizado no servidor por
   components/vitrine/VitrineCatalog.tsx; aqui só ganha comportamento).
   Uso: `useEngine('v-site', () => bootVitrine())`. Devolve a limpeza.
   ========================================================================== */
import { REDUCED } from '../../core';
import { createCtx, q, qa, reflow, vtRestart, type VtCtx, type VtDemo } from './ctx';
import { VT_FX, VT_INTENT, VT_SHOW, vtPlusLabel, vtPlusText, type VtIntent } from './data';
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

type DemoFactory = (card: HTMLElement, ctx: VtCtx) => VtDemo;

/** Fábricas por `data-demo`. "type" (11) e "glow" (06) são só CSS: acendem com .is-on. */
const VT_DEMO: Record<string, DemoFactory> = {
  particle: particleDemo, tilt: tiltDemo, count: countDemo, spot: spotDemo, stack: stackDemo,
  chart: chartDemo, flip: flipDemo, ba: baDemo, matrix: matrixDemo, flow: flowDemo,
};

const CARD_STATE = ['is-on', 'is-vis', 'is-in', 'is-ping', 'vt-reset'];

export function bootVitrine(root: ParentNode = document): () => void {
  const sec = root.querySelector<HTMLElement>('#vitrine');
  if (!sec || sec.dataset.vtBoot) return () => {};
  sec.dataset.vtBoot = '1';
  /* REDUCED do núcleo só é lido no primeiro initCore(), que pode rodar depois desta partida */
  const reduced = REDUCED || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { ctx, dispose } = createCtx(reduced);

  sec.classList.add('vt-ready');
  if (reduced) sec.classList.add('vt-reduced');
  const live: Record<number, HTMLElement> = {};
  qa('.vt-card', sec).forEach(c => (c.dataset.fx || '').split(' ').forEach(n => { live[+n] = c; }));

  ctx.defer(() => {
    sec.classList.remove('vt-ready', 'vt-reduced');
    delete sec.dataset.vtBoot;
    qa('.vt-card', sec).forEach(c => { c.classList.remove(...CARD_STATE); c.hidden = false; });
  });

  vtCatalog(sec, live, ctx);
  vtFilter(sec, ctx);
  vtDemos(sec, ctx);
  return dispose;
}

/* · Catálogo · os itens com demo ao vivo levam até o card no palco · */
function vtCatalog(sec: HTMLElement, live: Record<number, HTMLElement>, ctx: VtCtx) {
  const items = qa<HTMLLIElement>('#vt-cat > li', sec);
  const pings = new Map<HTMLElement, number>();
  items.forEach((li, i) => {
    const fx = VT_FX[i], card = fx && live[fx[0]];
    const it = li.querySelector<HTMLButtonElement>('button.vt-item');
    if (!card || !it) return;
    ctx.on(it, 'click', () => {
      card.scrollIntoView({ behavior: ctx.reduced ? 'auto' : 'smooth', block: 'center' });
      card.setAttribute('tabindex', '-1');
      card.focus({ preventScroll: true });
      card.classList.remove('is-ping'); reflow(card); card.classList.add('is-ping');
      ctx.cancel(pings.get(card) || 0);
      pings.set(card, ctx.later(() => card.classList.remove('is-ping'), 1800));
    });
  });
  ctx.defer(() => Object.values(live).forEach(c => c.removeAttribute('tabindex')));
}

/* · Filtro por intenção (vale para o palco e para o catálogo) · */
function vtFilter(sec: HTMLElement, ctx: VtCtx) {
  const chips = qa<HTMLButtonElement>('.vt-chip', sec), wrap = q('#vt-chips', sec), stage = q('#vt-stage', sec);
  const cards = qa('.vt-card', sec), items = qa<HTMLLIElement>('#vt-cat > li', sec);
  const empty = q('#vt-empty', sec), count = q('#vt-count', sec), status = q('#vt-status', sec);
  const more = q<HTMLButtonElement>('#vt-more', sec);
  /* só 8 à mostra; a pílula + leva para a escolha do plano */
  const plusP = q<HTMLAnchorElement>('.vt-plus-pill', sec), plusT = q('b', plusP);
  more.hidden = true;
  const moreSync = (n: number) => { plusP.hidden = n <= VT_SHOW; plusT.textContent = vtPlusText(n); plusP.setAttribute('aria-label', vtPlusLabel(n)); };
  const pop = (n: HTMLElement) => { if (ctx.reduced) return; n.classList.remove('is-in'); reflow(n); n.classList.add('is-in'); };
  const apply = (k: string) => {
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.intent === k)));
    const ok = (n: HTMLElement) => k === 'todos' || (n.dataset.intents || '').split(' ').includes(k);
    let nd = 0, ni = 0;
    cards.forEach(c => { const s = ok(c); c.hidden = !s; if (s) { nd++; pop(c); } });
    let shown = 0;
    items.forEach(li => { const s = ok(li); if (s) ni++; const v = s && shown < VT_SHOW; li.hidden = !v; if (v) { shown++; pop(li); } });
    stage.classList.toggle('is-filtered', k !== 'todos');
    stage.hidden = nd === 0;
    empty.hidden = nd !== 0;
    const label = VT_INTENT[k as VtIntent];
    if (!nd) empty.textContent = `Para ${(label || k).toLowerCase()}, os efeitos estão no catálogo logo abaixo.`;
    count.textContent = `${Math.min(ni, VT_SHOW)} de ${ni}`;
    moreSync(ni);
    status.textContent = k === 'todos' ? `Todos os efeitos: ${ni} no catálogo, ${nd} ao vivo.` : `${label}: ${ni} efeitos no catálogo, ${nd} ao vivo.`;
  };
  chips.forEach(c => ctx.on(c, 'click', () => { if (c.getAttribute('aria-pressed') !== 'true') apply(c.dataset.intent || 'todos'); }));
  const edge = () => wrap.classList.toggle('at-end', wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
  ctx.on(wrap, 'scroll', edge, { passive: true });
  window.addEventListener('resize', edge, { passive: true, signal: ctx.signal });
  edge();
  apply('todos');
  ctx.defer(() => {
    items.forEach(li => li.classList.remove('is-in'));
    stage.classList.remove('is-filtered'); stage.hidden = false;
    empty.hidden = true; empty.textContent = '';
    status.textContent = '';
    wrap.classList.remove('at-end');
  });
}

/* · Palco: liga cada demo à tela · */
function vtDemos(sec: HTMLElement, ctx: VtCtx) {
  const ctl = new Map<HTMLElement, VtDemo>();
  qa('.vt-card', sec).forEach(card => {
    const make = VT_DEMO[card.dataset.demo || ''];
    const d = (make && make(card, ctx)) || {};
    ctl.set(card, d);
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
