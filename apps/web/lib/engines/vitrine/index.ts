/* ==========================================================================
   VITRINE DE EFEITOS · motor
   Porte de prototype/src/js/37-vitrine.js: filtro por intenção, palco com 12
   demos ao vivo e editáveis (painel Editar efeito) e catálogo dos 40 efeitos com
   prévias brincáveis e editáveis (renderizado no servidor por components/vitrine/VitrineCatalog.tsx;
   aqui só ganha comportamento; o editor das prévias fica em vt-cat-editor.ts). Tudo o que se clica solta uma onda (Ripple).
   Uso: `useEngine('v-site', () => bootVitrine())`. Devolve a limpeza.
   ========================================================================== */
import { REDUCED } from '../../core';
import { createCtx, q, qa, reflow, vtRestart, type VtCtx, type VtDemo } from './ctx';
import { VT_INTENT, VT_SHOW, vtMoreLabel, vtMoreText, type VtIntent } from './data';
import { vtEditor } from './vt-editor';
import { vtCatalogLinks, vtMinis, vtRipples } from './vt-catalog';
import { vtCatEditor } from './vt-cat-editor';
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
  vtCatEditor(sec, live, ctx);
  vtRipples(sec, ctx);
  return dispose;
}

/* · Filtro por intenção (vale para o palco e para o catálogo) ·
   O catálogo abre com 8 itens; o botão + mostra os outros ali mesmo. */
function vtFilter(sec: HTMLElement, ctx: VtCtx) {
  const chips = qa<HTMLButtonElement>('.vt-chip', sec), wrap = q('#vt-chips', sec), stage = q('#vt-stage', sec);
  const cards = qa('.vt-card', sec), items = qa<HTMLLIElement>('#vt-cat > li', sec), cat = q('#vt-cat', sec);
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
  /* com o Scroll Reveal ligado, quem acaba de aparecer já entra pelo reveal: o pulo fica para quem continua à mostra */
  const rv = () => !!sec.closest('.rv-on');
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
      li.hidden = !v; if (v) { shown++; if (was ? !quiet : !rv()) pop(li); }
    });
    stage.classList.toggle('is-filtered', k !== 'todos');
    stage.hidden = nd === 0;
    empty.hidden = nd !== 0;
    const label = VT_INTENT[k as VtIntent];
    if (!nd) empty.textContent = `Para ${(label || k).toLowerCase()}, os efeitos estão no catálogo logo abaixo.`;
    count.textContent = `${shown} de ${ni}`;
    moreSync(ni);
    if (!quiet) ctx.say(k === 'todos' ? `Todos os efeitos: ${ni} no catálogo, ${nd} ao vivo.` : `${label}: ${ni} efeitos no catálogo, ${nd} ao vivo.`);
  };
  chips.forEach(c => ctx.on(c, 'click', () => { if (c.getAttribute('aria-pressed') !== 'true') apply(c.dataset.intent || 'todos'); }));
  /* ao recolher, o catálogo encolhe acima do botão: a página compensa a diferença para o
     botão ficar no mesmo ponto da tela, logo abaixo dos itens que ficaram */
  ctx.on(more, 'click', () => {
    const before = cat.getBoundingClientRect().bottom;
    open = !open; apply(cur, true);
    ctx.say(open ? `Catálogo aberto: ${count.textContent} efeitos à mostra.` : `Catálogo recolhido: ${count.textContent} efeitos à mostra.`);
    if (open) return;
    const d = cat.getBoundingClientRect().bottom - before;
    if (d) window.scrollBy({ top: d, behavior: 'instant' });
    const r = more.getBoundingClientRect();
    if (r.top < 96 || r.bottom > innerHeight) more.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  const edge = () => wrap.classList.toggle('at-end', wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
  ctx.on(wrap, 'scroll', edge, { passive: true });
  window.addEventListener('resize', edge, { passive: true, signal: ctx.signal });
  edge();
  apply('todos', true);
}

/* · Palco: liga cada demo à tela e ao editor ·
   Os cards também entram no Scroll Reveal: nascem ao descer e somem ao subir, saindo e
   voltando pelo mesmo lado (data-vt-out). Um card em que ninguém mexeu volta ao quadro
   inicial quando sai por baixo e roda de novo quando reaparece. */
function vtDemos(sec: HTMLElement, ctx: VtCtx) {
  const ctl = new Map<HTMLElement, VtDemo>();
  const run = (card: HTMLElement, d: VtDemo) => {
    card.classList.add('is-on');
    if (card.dataset.vtRerun) { delete card.dataset.vtRerun; if (d.replay) d.replay(); else d.start?.(); } else d.start?.();
  };
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
    const touch = () => { card.dataset.vtTouched = '1'; };
    (['pointerdown', 'keydown', 'input'] as const).forEach(t => ctx.on(card, t, touch));
  });
  if (ctx.reduced) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    const card = e.target as HTMLElement, d = ctl.get(card);
    if (!d) return;
    card.classList.toggle('is-vis', e.isIntersecting);
    if (e.isIntersecting && e.intersectionRatio >= .3 && !card.classList.contains('is-on')) run(card, d);
    if (e.isIntersecting) { if (card.classList.contains('is-on')) d.resume?.(); return; }
    d.pause?.();
    /* saiu inteiro por baixo sem ter sido tocado: volta ao quadro inicial, sem transição */
    if (e.boundingClientRect.top > 0 && card.classList.contains('is-on') && !card.dataset.vtTouched && !card.classList.contains('is-edit')) {
      card.classList.add('vt-reset'); card.classList.remove('is-on');
      reflow(card); card.classList.remove('vt-reset');
      card.dataset.vtRerun = '1';
    }
  }), { threshold: [0, .3] });
  let wave = 0, waveT = 0;
  const rv = new IntersectionObserver(es => es.forEach(e => {
    const card = e.target as HTMLElement, d = ctl.get(card);
    if (!d) return;
    if (!e.isIntersecting) { card.dataset.vtOut = e.boundingClientRect.top < 0 ? 'up' : 'down'; return; }
    /* os que entram juntos chegam em cascata */
    card.style.setProperty('--vt-rd', (wave++ % 3) * 90 + 'ms');
    ctx.cancel(waveT); waveT = ctx.later(() => { wave = 0; }, 120);
    delete card.dataset.vtOut;
    if (card.dataset.vtRerun) run(card, d);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  ctl.forEach((_, card) => { io.observe(card); rv.observe(card); });
  ctx.defer(() => {
    io.disconnect(); rv.disconnect(); ctl.forEach(d => d.pause?.());
    ctl.forEach((_, card) => { delete card.dataset.vtOut; delete card.dataset.vtRerun; delete card.dataset.vtTouched; card.style.removeProperty('--vt-rd'); });
  });
}
