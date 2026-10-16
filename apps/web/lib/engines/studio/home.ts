/* ==========================================================================
   Estúdio · Início: saudação, acervo (abas, ordem, busca, lixeira), modelos e sinais.
   Porte de prototype/src/js/50-studio.js; bootHome() é o subHooks.inicio do
   protótipo mais a parte de bindHome() que vive na capa.
   ========================================================================== */
import { $, $$, el, toast } from '@/lib/core';
import { CHAIN_STEPS } from '@/lib/data/chain';
import { bootFields } from '@/lib/engines/particles';
import { slideHTML } from '@/lib/slides';
import { openDeck } from './editor';
import { go, hasPending, setPending, takePending } from './nav';
import { closePop, rovingTabs } from './pop';
import { deckTag } from './render';
import { ACERVO, SIGNALS, SIG_FILL, SIG_INK, STUDIO, TPLS, type AcvFilter, type AcvSort } from './store';
import { fold, makeScope, reduced } from './util';

export function renderHome() {
  const box = $('#acv'); if (!box) return;
  box.textContent = '';
  const q = fold(STUDIO.q), f = STUDIO.acv;
  let list = ACERVO.filter(d => (f === 'todas' ? d.who !== 'lixeira' : d.who === f) && (!q || fold(d.t + ' ' + d.h).includes(q)));
  const by = ({
    indice: (a, b) => b.score - a.score,
    vistas: (a, b) => b.views - a.views,
    titulo: (a, b) => a.t.localeCompare(b.t, 'pt-BR'),
  } as Partial<Record<AcvSort, (a: typeof ACERVO[number], b: typeof ACERVO[number]) => number>>)[STUDIO.sort];
  if (by) list = list.slice().sort(by);
  const qb = $('#acv-q')!;
  if (STUDIO.q) { qb.hidden = false; $('#acv-q-t')!.textContent = (!list.length ? 'Nenhuma apresentação' : list.length === 1 ? '1 apresentação' : list.length + ' apresentações') + ' com “' + STUDIO.q + '”' + (f !== 'todas' ? ' nesta aba' : ''); } else qb.hidden = true;
  list.forEach(d => {
    const trash = d.who === 'lixeira';
    const a = trash ? el('div', 'deck deck-trash') : el('a', 'deck');
    if (a instanceof HTMLAnchorElement) { a.href = '/editor'; a.addEventListener('click', e => { e.preventDefault(); openDeck('acv', d); }); }
    const th = el('div', 'deck-th'); th.innerHTML = slideHTML({ type: 'cover', k: d.t.split('·')[0].trim(), h: d.h, sub: d.when }, 1, undefined, deckTag(d.t));
    if (d.live) { const c = el('span', 'chip deck-live'); c.innerHTML = '<i class="dot dot-live"></i> sendo vista agora'; th.appendChild(c); }
    const b = el('div', 'deck-b'); b.appendChild(el('p', 'deck-t', d.t));
    const m = el('div', 'deck-m');
    if (trash) {
      m.appendChild(el('span', null, 'Apaga sozinha em 27 dias'));
      const r = el('button', 'btn btn-ghost btn-xs'); r.type = 'button'; r.innerHTML = '<svg aria-hidden="true"><use href="#i-restore"/></svg>'; r.appendChild(document.createTextNode('Restaurar'));
      r.setAttribute('aria-label', 'Restaurar ' + d.t);
      r.addEventListener('click', () => { d.who = 'minhas'; d.when = 'agora'; renderHome(); toast('“' + d.t + '” voltou para Minhas'); ($('#acv .deck-trash button') || $('[data-acv][aria-selected="true"]'))?.focus(); });
      m.appendChild(r);
    } else {
      const sc = el('span', 'hscore'); const C = 2 * Math.PI * 8;
      sc.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke-width="3" class="trk"/><circle cx="10" cy="10" r="8" fill="none" stroke-width="3" class="val" style="stroke-dasharray:${(d.score / 100 * C).toFixed(1)} ${C.toFixed(1)}"/></svg>`;
      sc.appendChild(document.createTextNode(String(d.score))); sc.title = 'Índice Halor'; sc.setAttribute('aria-label', 'Índice Halor ' + d.score);
      const vw = el('span', 'views'); vw.innerHTML = '<svg aria-hidden="true"><use href="#i-eye"/></svg>'; vw.appendChild(document.createTextNode(d.views + ' · ' + d.when)); vw.setAttribute('aria-label', d.views + ' visualizações, ' + d.when);
      m.append(sc, vw);
    }
    b.appendChild(m); a.append(th, b); box.appendChild(a);
  });
  if (!list.length) {
    const e = el('div', 'acv-empty');
    const search = !!STUDIO.q;
    e.innerHTML = `<span class="ae-ic"><svg aria-hidden="true"><use href="${search ? '#i-search' : f === 'lixeira' ? '#i-trash' : '#i-layers'}"/></svg></span>`;
    e.append(el('b', null, search ? 'Nada com “' + STUDIO.q + '” por aqui' : f === 'lixeira' ? 'A lixeira está vazia' : 'Nenhuma apresentação ainda'),
      el('p', null, search ? 'Confira a grafia ou busque pelo nome do evento, da turma ou do time.' : f === 'lixeira' ? 'O que você apagar fica aqui por 30 dias antes de sumir.' : 'Comece com um modelo ou importe um arquivo.'));
    if (search) { const c = el('button', 'btn btn-ghost btn-sm', 'Limpar busca'); c.type = 'button'; c.addEventListener('click', clearSearch); e.appendChild(c); }
    box.appendChild(e);
  }
}

export function clearSearch() {
  const s = $<HTMLInputElement>('#st-search'); STUDIO.q = '';
  if (s) s.value = '';
  renderHome(); s?.focus();
}

/** Começo de uma busca com o acervo fora da tela (celular): o resultado sobe até o olhar. */
export function searchScroll() {
  const h = $('.home-main > .sec-h');
  if (h && h.getBoundingClientRect().top > innerHeight * .7) h.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
}

function homeGreeting() {
  const d = new Date(), h = d.getHours();
  const g = $('#hh-greet'), dt = $('#hh-date'); if (!g || !dt) return;
  g.textContent = (h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + ', Marina.';
  try { const t = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d); dt.textContent = t.charAt(0).toUpperCase() + t.slice(1); } catch { /* mantém o texto do HTML */ }
}

/** Liga a capa do Estúdio (ao montar /estudio) e devolve a limpeza. */
export function bootHome(): () => void {
  const sub = $('[data-subview="inicio"]'); if (!sub) return () => {};
  const S = makeScope(), o = S.o;
  homeGreeting();
  /* abas do acervo, com a aba que a pessoa deixou */
  const acvTabs = $$('[data-acv]', sub);
  const markAcv = (t: HTMLElement) => acvTabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
  const showAcv = (t: HTMLElement) => { markAcv(t); STUDIO.acv = t.dataset.acv as AcvFilter; renderHome(); };
  acvTabs.forEach(t => t.addEventListener('click', () => showAcv(t), o));
  rovingTabs(acvTabs[0].parentElement!, showAcv, S.signal);
  const cur = acvTabs.find(t => t.dataset.acv === STUDIO.acv); if (cur) markAcv(cur);
  const sort = $<HTMLSelectElement>('#acv-sort')!;
  sort.value = STUDIO.sort;
  sort.addEventListener('change', () => { STUDIO.sort = sort.value as AcvSort; renderHome(); }, o);
  $$('[data-scroll]', sub).forEach(b => b.addEventListener('click', () => {
    const t = $(b.dataset.scroll!); if (!t) return;
    t.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
  }, o));
  $$('[data-deck]', sub).forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); const k = a.dataset.deck === 'new' ? 'new' : 'kickoff';
    openDeck(k); if (k === 'new') toast('Nova apresentação com o seu kit de marca');
  }, o));
  $('[data-go="biblioteca"]', sub)?.addEventListener('click', () => { setPending('biblioteca'); go('/editor'); }, o);
  $('#acv-clear')!.addEventListener('click', clearSearch, o);
  /* modelos */
  const tp = $('#tpls')!; tp.textContent = '';
  TPLS.forEach(t => {
    const b = el('button', 'tpl'); b.type = 'button'; b.innerHTML = slideHTML(t.s, 1, 'halor');
    const lb = el('b', null, t.n); lb.appendChild(el('small', null, t.d)); b.appendChild(lb);
    b.addEventListener('click', () => { openDeck('tpl', t); toast('Modelo “' + t.n + '” aberto com o seu kit de marca'); });
    tp.appendChild(b);
  });
  /* sinais */
  const sg = $('#sig-list')!; sg.textContent = '';
  SIGNALS.forEach(s => {
    const li = el('li', 'sig'), r = el('span', 'sig-ring', String(s.r + 1));
    r.style.setProperty('--sw', SIG_FILL[s.r]); r.style.color = SIG_INK[s.r];
    r.title = 'Passo ' + (s.r + 1) + ' da Cadeia Halor: ' + CHAIN_STEPS[s.r].n; r.setAttribute('aria-label', 'Passo ' + (s.r + 1) + ', ' + CHAIN_STEPS[s.r].n);
    const tx = el('div'); const p = el('p'); p.innerHTML = s.h; tx.append(p, el('small', null, s.w)); li.append(r, tx); sg.appendChild(li);
  });
  const offFields = bootFields(document.getElementById('v-studio') ?? document);
  renderHome();
  /* busca começada em outra sub-tela: o resultado sobe até o olhar depois de chegar */
  if (hasPending('search-scroll')) S.later(() => { if (takePending('search-scroll')) searchScroll(); }, 80);
  return () => { S.dispose(); offFields(); closePop(false); };
}
