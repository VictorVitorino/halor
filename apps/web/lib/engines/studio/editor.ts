/* ==========================================================================
   Estúdio · Editor: histórico, trilho, tela, seleção, Raio Halor, inspetor,
   operações de slide e de elemento, menus e atalhos.
   Porte de prototype/src/js/50-studio.js; bootEditor() é o subHooks.editor
   do protótipo mais o bindEditor(), ligado e desligado com a rota /editor.
   ========================================================================== */
import { $, $$, el, fmtNum, openModal, toast } from '@/lib/core';
import { bootFields } from '@/lib/engines/particles';
import { escHTML, type Align, type FontKey, type FxKind, type Layer, type LayerKind, type Slide } from '@/lib/slides';
import { onStudioKey } from './keys';
import { exportHTML } from './export';
import { go, hasPending, takePending } from './nav';
import { closePop, menuFill, openPop, popOpen, rovingTabs, type MenuItem } from './pop';
import { mountSlide, titleNode } from './render';
import {
  KICKOFF, LAYER_KINDS, LAYOUTS, PT_BASE, STUDIO, SUGGEST, TPLS, curSlide, isLayerKind, isLayoutKey, selLayer,
  type AcvItem, type InspTab, type LayoutKey, type Template,
} from './store';
import { MOD, applyMod, clampN, clone, hhmm, makeScope, modKey, modalOpen, plainText, reduced, studioOpen, touch, typingIn } from './util';

/* ==========================================================================
   Histórico (desfazer / refazer) e salvamento
   ========================================================================== */
const snapState = () => JSON.stringify({ d: STUDIO.deck, c: STUDIO.cur, s: STUDIO.sel });
function pushUndo(pre?: string) { STUDIO.undo.push(pre || snapState()); if (STUDIO.undo.length > 60) STUDIO.undo.shift(); STUDIO.redo.length = 0; syncHistory(); }
function restore(json: string) {
  const o = JSON.parse(json) as { d: Slide[]; c: number; s: string | null };
  STUDIO.deck.splice(0, STUDIO.deck.length, ...o.d); STUDIO.cur = clampN(o.c, 0, STUDIO.deck.length - 1); STUDIO.sel = o.s; renderEditor(); saved();
}
function undo() { if (!STUDIO.undo.length) return toast('Nada para desfazer'); STUDIO.redo.push(snapState()); restore(STUDIO.undo.pop()!); syncHistory(); toast('Desfeito'); }
function redo() { if (!STUDIO.redo.length) return toast('Nada para refazer'); STUDIO.undo.push(snapState()); restore(STUDIO.redo.pop()!); syncHistory(); toast('Refeito'); }
function syncHistory() { $('#ed-undo')?.setAttribute('aria-disabled', String(!STUDIO.undo.length)); $('#ed-redo')?.setAttribute('aria-disabled', String(!STUDIO.redo.length)); }
let saveT: ReturnType<typeof setTimeout> | undefined;
function saved() {
  const p = $('#save-pill'); if (!p) return;
  const sp = $('span', p)!;
  p.classList.add('busy'); sp.textContent = 'Salvando…';
  clearTimeout(saveT); saveT = setTimeout(() => { p.classList.remove('busy'); sp.textContent = 'Salvo na nuvem às ' + hhmm(); }, 650);
}

/* ==========================================================================
   Editor: trilho, tela, seleção
   ========================================================================== */
function renderRail() {
  const rail = $('#rail-list'); if (!rail) return;
  rail.textContent = '';
  STUDIO.deck.forEach((s, i) => {
    const li = el('li'); if (i === STUDIO.cur) li.className = 'on';
    const b = el('button', 'rail-th'); b.type = 'button'; b.dataset.i = String(i);
    b.setAttribute('aria-label', 'Slide ' + (i + 1) + ': ' + plainText(s.h || s.k || ''));
    if (i === STUDIO.cur) b.setAttribute('aria-current', 'true'); else b.tabIndex = -1;
    mountSlide(b, s, i + 1);
    const act = el('span', 'rail-act');
    ([['dup', '#i-copy', 'Duplicar'], ['del', '#i-trash', 'Excluir']] as const).forEach(([k, ic, n]) => {
      const x = el('button', 'btn-icon'); x.type = 'button'; x.dataset.rail = k; x.dataset.i = String(i); x.tabIndex = -1;
      x.setAttribute('aria-label', n + ' slide ' + (i + 1)); x.title = n + ' slide';
      x.innerHTML = `<svg aria-hidden="true"><use href="${ic}"/></svg>`; act.appendChild(x);
    });
    li.append(b, act); rail.appendChild(li);
  });
  $('#rail-n')!.textContent = String(STUDIO.deck.length);
}

export function renderEditor() {
  if (!$('#rail-list')) return;
  STUDIO.cur = clampN(STUDIO.cur, 0, STUDIO.deck.length - 1);
  const s = curSlide();
  if (STUDIO.sel && STUDIO.sel !== 'title' && !selLayer()) STUDIO.sel = null;
  renderRail();
  mountSlide($('#ed-canvas')!, s, STUDIO.cur + 1);
  $('#ed-pos')!.textContent = 'Slide ' + (STUDIO.cur + 1) + ' de ' + STUDIO.deck.length;
  const t = $<HTMLInputElement>('#ed-title'); if (t && document.activeElement !== t) t.value = STUDIO.title;
  placeSel(); renderHalor(); syncDesign(); syncHistory();
  if (STUDIO.ray) placeRay();
}

function selNode(): HTMLElement | null {
  const c = $('#ed-canvas .slide'); if (!c || !STUDIO.sel) return null;
  return STUDIO.sel === 'title' ? titleNode(c) : c.querySelector<HTMLElement>(`[data-ly="${STUDIO.sel}"]`);
}
function select(id: string | null) {
  STUDIO.sel = id; placeSel(); syncDesign();
}
function placeSel() {
  const box = $('#sel-box'), fb = $('#float-bar'), lb = $('#ly-bar'), wrap = $('.ed-canvas-wrap'); if (!box || !wrap || !fb || !lb) return;
  const n = selNode();
  if (!n || !n.offsetWidth) { box.hidden = true; fb.hidden = true; lb.hidden = true; return; }
  const w = wrap.getBoundingClientRect(), r = n.getBoundingClientRect();
  const x = r.left - w.left, y = r.top - w.top;
  Object.assign(box.style, { left: (x - 3) + 'px', top: (y - 3) + 'px', width: (r.width + 6) + 'px', height: (r.height + 6) + 'px' });
  box.hidden = false;
  const s = curSlide(), L = selLayer(), isTitle = STUDIO.sel === 'title';
  const pt = isTitle ? ((s.st && s.st.z) || PT_BASE[s.type] || 44) : (L && L.k === 'text' ? (L.z || 24) : 0);
  $('.sel-tag', box)!.textContent = isTitle ? 'Título · ' + pt + ' pt' : LAYER_KINDS[L!.k].n + (pt ? ' · ' + pt + ' pt' : '');
  const bar = isTitle ? fb : lb; (isTitle ? lb : fb).hidden = true;
  bar.hidden = false;
  if (!isTitle) $('#ly-name')!.textContent = LAYER_KINDS[L!.k].n;
  const bw = bar.offsetWidth, top = y - 3 - bar.offsetHeight - (isTitle && n.parentElement && $('.sl-k', n.parentElement) ? 30 : 10);
  bar.style.left = clampN(x - 3, 0, Math.max(0, w.width - bw)) + 'px';
  bar.style.top = Math.max(top, -58) + 'px';
  if (isTitle) {
    const st = s.st || {};
    $('[data-fb="bold"]', fb)!.setAttribute('aria-pressed', String((st.w || 600) >= 700));
    $('[data-fb="italic"]', fb)!.setAttribute('aria-pressed', String(!!st.i));
    $('[data-fb="align"]', fb)!.setAttribute('aria-label', 'Alinhamento: ' + (({ center: 'centralizado', right: 'à direita' } as Record<string, string>)[st.a || ''] || 'à esquerda'));
    $$('[data-fb-c]', fb).forEach(b => b.setAttribute('aria-pressed', String((st.c || '') === b.dataset.fbC)));
  }
}

/* Raio Halor: mapa de atenção calculado sobre os elementos reais do slide */
const RAY_T: Record<string, [string, string][]> = {
  cover: [['.sl-h', 'Título'], ['.sl-k', 'Sobretítulo'], ['.sl-sub', 'Subtítulo'], ['.sl-foot', 'Rodapé']],
  text: [['.sl-h', 'Título'], ['.sl-img', 'Imagem'], ['.sl-body', 'Texto'], ['.sl-foot', 'Rodapé']],
  kpi: [['.sl-h', 'Título'], ['.sl-big b', 'Número de destaque'], ['.sl-chart', 'Gráfico'], ['.sl-foot', 'Fonte']],
  steps: [['.sl-h', 'Título'], ['.sl-step', 'Etapa 1'], ['.sl-step@1', 'Etapa 2'], ['.sl-step@2', 'Etapa 3']],
  poll: [['.sl-h', 'Pergunta'], ['.sl-opt.hi', 'Opção mais votada'], ['.sl-vote', 'Código para votar'], ['.sl-opts', 'Resultado']],
  tl: [['.sl-h', 'Título'], ['.sl-ms', 'Primeiro marco'], ['.sl-ms@3', 'Último marco'], ['.sl-foot', 'Rodapé']],
  table: [['.sl-h', 'Título'], ['.sl-tbl tr.tot', 'Linha de total'], ['.sl-tbl thead', 'Cabeçalho'], ['.sl-foot', 'Rodapé']],
  next: [['.sl-h', 'Título'], ['.sl-cta', 'Destaque'], ['.sl-list', 'Lista'], ['.sl-foot', 'Rodapé']],
  end: [['p', 'Mensagem'], ['small', 'Contato'], ['svg', 'Marca']],
};
const pick = (root: Element, q: string) => { const [sel, i] = q.split('@'); return $$<Element>(sel, root)[+(i || 0)] || null; };
function placeRay() {
  const lay = $('#ray-layer'), sl = $('#ed-canvas .slide'); if (!lay || !sl) return;
  const R = sl.getBoundingClientRect(), pts: { x: number; y: number; w: number; h: number }[] = [];
  (RAY_T[curSlide().type] || []).forEach(([q]) => {
    const n = pick(sl, q); if (!n) return; const r = n.getBoundingClientRect();
    if (r.width) pts.push({ x: (r.left + r.width / 2 - R.left) / R.width * 100, y: (r.top + r.height / 2 - R.top) / R.height * 100, w: r.width / R.width * 100, h: r.height / R.height * 100 });
  });
  $$('.ray-n', lay).forEach((n, i) => { const p = pts[i]; n.hidden = !p; if (p) { n.style.left = p.x + '%'; n.style.top = p.y + '%'; } });
  $$('.ray-heat', lay).forEach((n, i) => {
    const p = pts[i]; n.hidden = !p;
    if (p) { const w = clampN(p.w * 1.2, 22, 70), h = clampN(p.h * 1.6, 26, 60); Object.assign(n.style, { left: (p.x - w / 2) + '%', top: (p.y - h / 2) + '%', width: w + '%', height: h + '%' }); }
  });
}
/* rótulos femininos do caminho do olhar, para o artigo certo no aviso */
const RAY_FEM = /^(imagem|fonte|etapa|pergunta|opção|linha|lista|mensagem|marca)/;
function toggleRay(force?: boolean) {
  const b = $('#ray-toggle')!; const on = force != null ? force : b.getAttribute('aria-pressed') !== 'true';
  STUDIO.ray = on; b.setAttribute('aria-pressed', String(on)); $('#ray-layer')!.hidden = !on;
  if (on) {
    placeRay(); const g = (RAY_T[curSlide().type] || []).map(x => x[1].toLowerCase());
    const fem = (t: string) => RAY_FEM.test(t);
    if (g.length > 1) toast('Raio Halor: o olhar começa ' + (fem(g[0]) ? 'na ' : 'no ') + g[0] + ' e segue para ' + (fem(g[1]) ? 'a ' : 'o ') + g[1] + '.');
  }
}

/* ==========================================================================
   Inspetor: Halor, Design, Animação
   ========================================================================== */
const LIGHT_INK = ['#c4a6ff', '#e9dfff'], DARK_INK = ['#17112b', '#07040f', '#4a4366'];
interface Check { w?: 1; b: string; p: string; fix?: string }
function analyze(s: Slide) {
  const words = plainText(s.h || '').split(/\s+/).filter(Boolean).length, extras = (s.layers || []).length;
  const dark = s.type === 'cover' || s.type === 'end', c = s.st && s.st.c;
  const lowContrast = !!c && (dark ? DARK_INK.includes(c) : LIGHT_INK.includes(c));
  let score = 94 - Math.max(0, words - 7) * 2 - Math.max(0, extras - 2) * 3 - (lowContrast ? 12 : 0);
  score = clampN(score, 38, 99);
  const read = .6 + words * .06 + Math.max(0, extras - 2) * .15;
  const checks: Check[] = [];
  checks.push(extras > 2
    ? { w: 1, b: 'Elementos disputando o olhar', p: extras + ' elementos extras no slide. Deixe só o que ajuda a mensagem.' }
    : { b: 'Um destaque por slide', p: s.type === 'kpi' ? 'O número ' + s.big + ' domina a leitura.' : s.type === 'poll' ? 'A opção mais votada salta aos olhos.' : 'O título conduz a leitura.' });
  checks.push(lowContrast
    ? { w: 1, b: 'Contraste baixo no título', p: dark ? 'Tinta escura sobre fundo escuro some no telão. Use Lúmen ou Lilás.' : 'Lilás sobre branco fica abaixo de 4,5:1. Use Tinta ou Violeta.' }
    : { b: 'Contraste do texto', p: '7,1:1, acima do mínimo de 4,5:1.' });
  if (s.type !== 'end') checks.push(words > 7
    ? { w: 1, b: 'Título com ' + words + ' palavras', p: 'Títulos de até 7 palavras seguram 30% mais o olhar.', fix: SUGGEST[plainText(s.h)] }
    : { b: 'Título com ' + words + (words === 1 ? ' palavra' : ' palavras'), p: 'Curto o bastante para ser lido em um olhar.' });
  const vis = ({ kpi: 'Ocupa 38% da área visível.', text: 'A imagem ocupa 30% do slide.', poll: 'As barras mostram o resultado em um olhar.', steps: 'Três blocos com o mesmo peso guiam a leitura.', tl: 'A linha leva o olhar da esquerda para a direita.', table: 'A linha de total aparece em destaque.' } as Record<string, string>)[s.type];
  if (vis) checks.push({ b: s.type === 'table' ? 'Linha que importa em destaque' : 'Imagem ou gráfico dominante', p: vis });
  return { score, read, checks, gaze: (RAY_T[s.type] || []).map(x => x[1]) };
}
function renderHalor() {
  const panel = $('[data-insp-panel="halor"]'); if (!panel) return;
  const s = curSlide(), a = analyze(s), C = 2 * Math.PI * 33;
  $('.rs-ring b', panel)!.textContent = String(a.score);
  $<SVGCircleElement>('.rs-ring .val', panel)!.style.strokeDasharray = (a.score / 100 * C).toFixed(1) + ' ' + C.toFixed(1);
  const verdict = a.score >= 90 ? 'Muito forte' : a.score >= 80 ? 'Forte' : a.score >= 65 ? 'Bom, com ajustes' : 'Fraco';
  $('.rs-v', panel)!.textContent = verdict + '. O olhar encontra a mensagem em ' + fmtNum(a.read, 1) + ' s.';
  const g = $('#gaze')!; g.textContent = '';
  a.gaze.forEach((n, i) => { const li = el('li'); li.append(el('i', null, String(i + 1)), document.createTextNode(n)); g.appendChild(li); });
  const ck = $('#checks')!; ck.textContent = '';
  a.checks.forEach(c => {
    const li = el('li', c.w ? 'warn' : 'ok');
    li.innerHTML = `<svg aria-hidden="true"><use href="${c.w ? '#i-alert' : '#i-check'}"/></svg>`;
    const d = el('div'); d.append(el('b', null, c.b), el('span', null, c.p));
    if (c.fix) {
      const fix = c.fix;
      const b = el('button', 'btn btn-ghost btn-xs', 'Aplicar sugestão'); b.type = 'button'; b.id = 'fix-title';
      b.addEventListener('click', () => { pushUndo(); s.h = fix; renderEditor(); saved(); toast('Sugestão aplicada. Índice do slide: ' + analyze(s).score); });
      d.appendChild(b);
    }
    li.appendChild(d); ck.appendChild(li);
  });
}
function syncDesign() {
  const s = curSlide(); if (!s || !$('#d-font')) return;
  const L = selLayer(), isTitle = STUDIO.sel === 'title';
  const txt = isTitle || (L && L.k === 'text');
  const info = $('#insp-sel')!;
  info.querySelector('use')!.setAttribute('href', isTitle ? '#i-text' : L ? LAYER_KINDS[L.k].ic : '#i-layers');
  $('span', info)!.textContent = isTitle ? 'Título do slide' : L ? LAYER_KINDS[L.k].n + ' no slide' : 'Nada selecionado. Clique num elemento do slide.';
  $('#d-text')!.hidden = !txt;
  const st: { c?: string; f?: FontKey; z?: number; w?: number } = isTitle ? (s.st || {}) : L ? { c: L.c, f: L.f, z: L.z || 24, w: L.wt || 600 } : {};
  $<HTMLSelectElement>('#d-font')!.value = st.f || (isTitle && (s.type === 'cover' || s.type === 'end') ? 'display' : 'ui');
  const z = String(st.z || PT_BASE[s.type] || 44), zs = $<HTMLSelectElement>('#d-size')!;
  if (!$$<HTMLOptionElement>('option', zs).some(o => o.value === z)) zs.appendChild(el('option', null, z));
  zs.value = z;
  $$('#d-weight button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.w! === (st.w || 600))));
  const colorOK = isTitle || (!!L && L.k !== 'image');
  $$<HTMLButtonElement>('#d-colors button').forEach(b => { b.setAttribute('aria-pressed', String(colorOK && (st.c || (isTitle ? '#17112b' : '')) === b.dataset.c)); b.disabled = !colorOK; });
  const sl = $('#ed-canvas .slide'), n = selNode(), xs = ['#d-x', '#d-y', '#d-w', '#d-h'];
  if (sl && n) {
    const R = sl.getBoundingClientRect(), r = n.getBoundingClientRect(), k = 1280 / R.width;
    [r.left - R.left, r.top - R.top, r.width, r.height].forEach((v, i) => { const inp = $<HTMLInputElement>(xs[i])!; inp.value = String(Math.round(v * k)); inp.disabled = false; inp.readOnly = isTitle && i > 1; });
  } else xs.forEach(q => { const inp = $<HTMLInputElement>(q)!; inp.value = ''; inp.disabled = true; });
  const fx = (isTitle ? s.fx : L && L.fx) || 'revelar', fxd = (isTitle ? s.fxd : L && L.fxd) || 900;
  $$('#d-fx button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fx === fx)));
  const dur = $<HTMLInputElement>('#d-dur')!;
  dur.value = String(fxd); dur.setAttribute('aria-valuetext', fxd + ' milissegundos');
  $('#d-dur-v')!.textContent = fxd + ' ms · curva halo-out';
}
interface StylePatch { c?: string; f?: FontKey; z?: number; w?: number; i?: boolean; a?: Align; x?: number; y?: number }
function applyStyle(patch: StylePatch) {
  const s = curSlide(), L = selLayer();
  if (!STUDIO.sel) return toast('Selecione um elemento do slide primeiro');
  pushUndo();
  if (STUDIO.sel === 'title') s.st = Object.assign({}, s.st, patch);
  else if (L) {
    const { w, ...rest } = patch;
    if ('w' in patch) L.wt = w;
    Object.assign(L, rest);
  }
  renderEditor(); saved();
}
function playFx(fx: FxKind) {
  const n = selNode(); if (!n) return toast('Selecione o título ou um elemento para ver a entrada');
  const s = curSlide(), L = selLayer(), d = (STUDIO.sel === 'title' ? s.fxd : L && L.fxd) || 900;
  n.classList.remove('fx-revelar', 'fx-brilho', 'fx-subir', 'fx-halo');
  void n.offsetWidth;
  n.style.setProperty('--fxd', d + 'ms'); n.classList.add('fx-' + fx);
  if (reduced()) toast('Com “reduzir movimento” ligado, a entrada vira um corte seco');
  n.addEventListener('animationend', () => n.classList.remove('fx-' + fx), { once: true });
}

/* ==========================================================================
   Operações de slide e de elemento
   ========================================================================== */
function goSlide(i: number, focusRail?: boolean) {
  STUDIO.cur = clampN(i, 0, STUDIO.deck.length - 1); STUDIO.sel = 'title'; renderEditor();
  if (focusRail) $(`#rail-list .rail-th[data-i="${STUDIO.cur}"]`)?.focus();
  const th = $('#rail-list li.on'); if (th) th.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function insertSlide(key: LayoutKey | null, data?: Slide) {
  pushUndo();
  const s = data ? clone(data) : LAYOUTS[key!].s();
  STUDIO.deck.splice(STUDIO.cur + 1, 0, s); goSlide(STUDIO.cur + 1); saved();
  toast((data ? 'Slide do modelo' : 'Slide de ' + LAYOUTS[key!].n.toLowerCase()) + ' inserido na posição ' + (STUDIO.cur + 1));
}
function dupSlide(i = STUDIO.cur) {
  pushUndo(); const c = clone(STUDIO.deck[i]);
  STUDIO.deck.splice(i + 1, 0, c); goSlide(i + 1, true); saved(); toast('Slide ' + (i + 1) + ' duplicado');
}
function delSlide(i = STUDIO.cur) {
  if (STUDIO.deck.length < 2) return toast('A apresentação precisa de pelo menos um slide');
  pushUndo(); STUDIO.deck.splice(i, 1);
  goSlide(Math.min(i, STUDIO.deck.length - 1), true); saved();
  toast('Slide ' + (i + 1) + ' excluído. ' + MOD() + 'Z desfaz');
}
function moveSlide(d: number) {
  const i = STUDIO.cur, j = i + d; if (j < 0 || j >= STUDIO.deck.length) return;
  pushUndo(); const [s] = STUDIO.deck.splice(i, 1); STUDIO.deck.splice(j, 0, s);
  goSlide(j, true); saved();
  toast('Slide movido para a posição ' + (j + 1));
}
function insertLayer(k: LayerKind) {
  const s = curSlide(), K = LAYER_KINDS[k]; s.layers = s.layers || [];
  pushUndo();
  const off = (s.layers.filter(x => x.k === k).length % 5) * 3;
  const l: Layer = { id: 'l' + (STUDIO.lid++), k, x: clampN(K.x + off, 2, 98 - K.w), y: clampN(K.y + off, 3, 96 - K.h), w: K.w, h: K.h };
  const tap = touch() ? 'Toque' : 'Clique';
  if (k === 'text') { l.t = tap + ' duas vezes para escrever'; l.z = 24; l.c = s.type === 'cover' || s.type === 'end' ? '#f4eeff' : '#17112b'; }
  if (k === 'shape' || k === 'arrow' || k === 'icon') l.c = '#8b3dff';
  s.layers.push(l); STUDIO.sel = l.id; renderEditor(); saved();
  toast(K.n + ' no slide. Arraste para posicionar' + (k === 'text' ? ', ' + tap.toLowerCase() + ' duas vezes para escrever' : ''));
}
function dupLayer() {
  const L = selLayer(); if (!L) return; pushUndo();
  const c: Layer = Object.assign({}, L, { id: 'l' + (STUDIO.lid++), x: clampN(L.x + 3, 0, 100 - L.w), y: clampN(L.y + 3, 0, 100 - L.h) });
  curSlide().layers!.push(c); STUDIO.sel = c.id; renderEditor(); saved(); toast(LAYER_KINDS[L.k].n + (LAYER_KINDS[L.k].fem ? ' duplicada' : ' duplicado'));
}
function delLayer() {
  const L = selLayer(); if (!L) return; pushUndo();
  const s = curSlide(); s.layers = (s.layers || []).filter(x => x !== L); STUDIO.sel = null; renderEditor(); saved();
  toast(LAYER_KINDS[L.k].n + (LAYER_KINDS[L.k].fem ? ' excluída. ' : ' excluído. ') + MOD() + 'Z desfaz');
}
function orderLayer(front: boolean) {
  const L = selLayer(); if (!L) return toast('Selecione um elemento do slide');
  pushUndo(); const s = curSlide(); s.layers = (s.layers || []).filter(x => x !== L);
  if (front) s.layers.push(L); else s.layers.unshift(L);
  renderEditor(); saved(); toast(front ? 'Elemento na frente' : 'Elemento atrás');
}
let nudgeAt = 0;
function nudge(dx: number, dy: number) {
  const s = curSlide(), L = selLayer();
  if (Date.now() - nudgeAt > 700) pushUndo(); nudgeAt = Date.now();
  if (L) { L.x = clampN(L.x + dx, -L.w + 4, 96); L.y = clampN(L.y + dy, -L.h + 4, 96); }
  else if (STUDIO.sel === 'title' && s.type !== 'end') {
    const sl = $('#ed-canvas .slide')!, h = titleNode(sl)!, R = sl.getBoundingClientRect(), r = h.getBoundingClientRect();
    const st = s.st || {}, x = st.x != null ? st.x : (r.left - R.left) / R.width * 100, y = st.y != null ? st.y : (r.top - R.top) / R.height * 100;
    s.st = Object.assign({}, st, { x: clampN(x + dx, -20, 96), y: clampN(y + dy, -10, 96) });
  } else return;
  renderEditor(); saved();
}
function startEdit(node: HTMLElement, onCommit: (html: string) => void) {
  if (node.isContentEditable) return;
  const before = node.textContent || '', pre = snapState();
  node.contentEditable = 'true'; node.spellcheck = true; node.classList.add('editing'); node.focus();
  const r = document.createRange(); r.selectNodeContents(node); const sel = getSelection(); sel?.removeAllRanges(); sel?.addRange(r);
  let cancel = false;
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); node.blur(); } if (e.key === 'Escape') { e.stopPropagation(); cancel = true; node.blur(); } };
  node.addEventListener('keydown', key);
  node.addEventListener('blur', () => {
    node.removeEventListener('keydown', key); node.contentEditable = 'false'; node.classList.remove('editing');
    const txt = (node.textContent || '').replace(/\s+/g, ' ').trim();
    if (cancel || !txt || txt === before.trim()) { node.textContent = before; placeSel(); return; }
    pushUndo(pre); onCommit(escHTML(txt)); renderEditor(); saved();
  }, { once: true });
}

/* ==========================================================================
   Menus do editor
   ========================================================================== */
export function layoutItems(): MenuItem[] {
  return (Object.keys(LAYOUTS) as LayoutKey[]).map(k => ({ t: LAYOUTS[k].n, ic: LAYOUTS[k].ic, act: () => insertSlide(k) }));
}
type MenuName = 'arquivo' | 'editar' | 'inserir' | 'slide' | 'organizar' | 'apresentar' | 'ajuda';
function edMenu(name: MenuName): MenuItem[] {
  const L = selLayer();
  const menus: Record<MenuName, MenuItem[]> = {
    arquivo: [{ t: 'Nova apresentação', ic: '#i-plus', act: () => { openDeck('new'); } }, { t: 'Importar arquivo', ic: '#i-upload', act: () => openModal('m-import') }, '-', { t: 'Salvar como', ic: '#i-download', act: () => openModal('m-export') }, { t: 'Baixar HTML interativo', ic: '#i-file', act: exportHTML }, { t: 'Compartilhar', ic: '#i-share', act: () => openModal('m-share') }],
    editar: [{ t: 'Desfazer', ic: '#i-undo', k: MOD() + 'Z', off: !STUDIO.undo.length, act: undo }, { t: 'Refazer', ic: '#i-redo', k: 'Shift+' + MOD() + 'Z', off: !STUDIO.redo.length, act: redo }, '-', { t: 'Duplicar elemento', ic: '#i-copy', off: !L, act: dupLayer }, { t: 'Excluir elemento', ic: '#i-trash', k: 'Delete', off: !L, danger: true, act: delLayer }],
    inserir: [{ h: 'No slide' }, ...(Object.keys(LAYER_KINDS) as LayerKind[]).map(k => ({ t: LAYER_KINDS[k].n, ic: LAYER_KINDS[k].ic, act: () => insertLayer(k) })), '-', { h: 'Novo slide' }, ...(['kpi', 'table', 'steps', 'poll'] as const).map(k => ({ t: LAYOUTS[k].n, ic: LAYOUTS[k].ic, act: () => insertSlide(k) }))],
    slide: [{ t: 'Novo slide', ic: '#i-plus', k: MOD() + 'M', act: () => insertSlide('text') }, { t: 'Duplicar slide', ic: '#i-copy', k: MOD() + 'D', act: () => dupSlide() }, { t: 'Excluir slide', ic: '#i-trash', danger: true, off: STUDIO.deck.length < 2, act: () => delSlide() }, '-', { t: 'Slide anterior', ic: '#i-back', k: 'PgUp', off: STUDIO.cur === 0, act: () => goSlide(STUDIO.cur - 1) }, { t: 'Slide seguinte', ic: '#i-arrow', k: 'PgDn', off: STUDIO.cur === STUDIO.deck.length - 1, act: () => goSlide(STUDIO.cur + 1) }],
    organizar: [{ t: 'Mover slide para cima', ic: '#i-up', k: 'Alt+↑', off: STUDIO.cur === 0, act: () => moveSlide(-1) }, { t: 'Mover slide para baixo', ic: '#i-down', k: 'Alt+↓', off: STUDIO.cur === STUDIO.deck.length - 1, act: () => moveSlide(1) }, '-', { t: 'Trazer elemento para a frente', ic: '#i-layers', off: !L, act: () => orderLayer(true) }, { t: 'Enviar elemento para trás', ic: '#i-layers', off: !L, act: () => orderLayer(false) }],
    apresentar: [{ t: 'Do slide atual', ic: '#i-play', k: MOD() + 'Enter', act: present }, { t: 'Do começo', ic: '#i-replay', act: () => { STUDIO.cur = 0; present(); } }, '-', { t: STUDIO.ray ? 'Desligar o Raio Halor' : 'Ligar o Raio Halor', ic: '#i-target', k: 'R', act: () => toggleRay() }],
    ajuda: [{ t: 'Atalhos do teclado', ic: '#i-keyboard', k: '?', act: () => openModal('m-keys') }, { t: 'Guia da marca', ic: '#i-book', act: () => go('/marca') }],
  };
  return menus[name];
}
function present() { go('/apresentar'); }

/* ==========================================================================
   Abrir uma apresentação (do acervo, de um modelo, nova ou o Kickoff)
   ========================================================================== */
export function openDeck(key: 'kickoff' | 'new'): void;
export function openDeck(key: 'tpl', extra: Template): void;
export function openDeck(key: 'acv', extra: AcvItem): void;
export function openDeck(key: 'kickoff' | 'new' | 'tpl' | 'acv', extra?: Template | AcvItem): void {
  let deck: Slide[], title: string, cur = 0;
  if (key === 'kickoff') { deck = KICKOFF; title = 'Kickoff 2027 · Time de produto'; cur = STUDIO.deck === KICKOFF ? STUDIO.cur : 0; }
  else if (key === 'new') { deck = [{ type: 'cover', k: 'Nova apresentação', h: 'Escreva aqui o seu título.', sub: 'Com o kit de marca da Norte Sistemas' }, LAYOUTS.poll.s(), LAYOUTS.end.s()]; title = 'Apresentação sem título'; }
  else if (key === 'tpl') { const t = extra as Template; deck = [clone(t.s), LAYOUTS.text.s(), LAYOUTS.poll.s(), LAYOUTS.end.s()]; title = t.n; }
  else {
    const d = extra as AcvItem; if (d.key === 'kickoff') return openDeck('kickoff');
    d.deck = d.deck || [{ type: 'cover', k: d.t.split('·')[0].trim(), h: d.h, sub: d.t.split('·')[1] ? d.t.split('·')[1].trim() : 'Norte Sistemas' }, LAYOUTS.text.s(), LAYOUTS.poll.s(), LAYOUTS.end.s()];
    deck = d.deck; title = d.t;
  }
  STUDIO.deck = deck; STUDIO.title = title; STUDIO.cur = cur; STUDIO.stage = cur; STUDIO.sel = 'title'; STUDIO.undo = []; STUDIO.redo = [];
  const t = $<HTMLInputElement>('#ed-title'); if (t) t.value = title;
  const stt = $('.stage-title'); if (stt) stt.textContent = title;
  if (studioOpen('editor') && $('#rail-list')) renderEditor(); else go('/editor');
}

/* ==========================================================================
   Liga o editor (ao montar /editor) e devolve a limpeza
   ========================================================================== */
export function bootEditor(): () => void {
  const canvas = $('#ed-canvas'), sub = $('[data-subview="editor"]'); if (!canvas || !sub) return () => {};
  const S = makeScope(), o = S.o;
  /* modificador da plataforma nos atalhos */
  applyMod(sub);
  /* tela de toque: a dica do rodapé fala em tocar, não em clicar */
  const tip = $('.ed-tip', sub); if (tip && touch() && tip.firstChild && tip.firstChild.nodeType === 3) tip.firstChild.textContent = (tip.firstChild.textContent || '').replace('Clique', 'Toque');
  $('#ray-toggle')!.addEventListener('click', () => toggleRay(), o);
  /* abas do inspetor (com setas) */
  const inspTabs = $$('[data-insp]', sub);
  const showInsp = (t: HTMLElement) => {
    inspTabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    $$('[data-insp-panel]', sub).forEach(p => { p.hidden = p.dataset.inspPanel !== t.dataset.insp; });
    STUDIO.insp = t.dataset.insp as InspTab;
    if (t.dataset.insp === 'design') syncDesign();
  };
  inspTabs.forEach(t => t.addEventListener('click', () => showInsp(t), o));
  rovingTabs(inspTabs[0].parentElement!, showInsp, S.signal);
  /* faixa de inserir */
  $$('[data-ins]', sub).forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.ins!;
    if (isLayerKind(k)) insertLayer(k);
    else if (isLayoutKey(k)) insertSlide(k);
    else if (k === 'tpl') openPop(b, menuFill([{ h: 'Modelos com o seu kit' }, ...TPLS.map(t => ({ t: t.n, ic: '#i-grid', act: () => insertSlide(null, t.s) }))]), { label: 'Modelos' });
    else if (k === 'fx') { const t = $('[data-insp="anim"]', sub)!; showInsp(t); if (!STUDIO.sel) select('title'); $('#d-fx [aria-pressed="true"]')?.focus(); toast('Escolha a entrada do elemento selecionado'); }
  }, o));
  /* menus do topo */
  $$('[data-menu]', sub).forEach(b => b.addEventListener('click', () => openPop(b, menuFill(edMenu(b.dataset.menu as MenuName)), { label: b.textContent }), o));
  /* telas mais estreitas: os menus do topo cabem num botão só */
  $('#ed-more')?.addEventListener('click', e => {
    const names: MenuName[] = ['arquivo', 'editar', 'slide', 'organizar', 'apresentar', 'ajuda'];
    openPop(e.currentTarget as HTMLElement, menuFill(names.flatMap((m, i): MenuItem[] => [...(i ? ['-' as const] : []), { h: $(`[data-menu="${m}"]`, sub)!.textContent || '' }, ...edMenu(m).filter(x => x !== '-')])), { label: 'Menus do editor', align: 'right' });
  }, o);
  $('#ed-undo')!.addEventListener('click', undo, o);
  $('#ed-redo')!.addEventListener('click', redo, o);
  $('#rail-new')!.addEventListener('click', e => openPop(e.currentTarget as HTMLElement, menuFill([{ h: 'Escolha o layout' }, ...layoutItems()]), { label: 'Novo slide' }), o);
  /* título da apresentação */
  const ti = $<HTMLInputElement>('#ed-title')!;
  ti.addEventListener('change', () => { const v = ti.value.replace(/\s+/g, ' ').trim(); if (!v) { ti.value = STUDIO.title; return; } STUDIO.title = v; const stt = $('.stage-title'); if (stt) stt.textContent = v; saved(); }, o);
  ti.addEventListener('keydown', e => { if (e.key === 'Enter') ti.blur(); if (e.key === 'Escape') { ti.value = STUDIO.title; ti.blur(); } }, o);
  /* trilho */
  const rail = $('#rail-list')!;
  rail.addEventListener('click', e => {
    const tg = e.target as Element;
    const a = tg.closest<HTMLElement>('[data-rail]'); if (a) { const i = +a.dataset.i!; if (a.dataset.rail === 'dup') dupSlide(i); else delSlide(i); return; }
    const b = tg.closest<HTMLElement>('.rail-th'); if (b) goSlide(+b.dataset.i!, true);
  }, o);
  rail.addEventListener('keydown', e => {
    if (!(e.target as Element).closest('.rail-th')) return;
    const fw = e.key === 'ArrowDown' || e.key === 'ArrowRight', bw = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if ((fw || bw) && e.altKey) { e.preventDefault(); moveSlide(fw ? 1 : -1); }
    else if (fw || bw) { e.preventDefault(); goSlide(STUDIO.cur + (fw ? 1 : -1), true); }
    else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); goSlide(e.key === 'Home' ? 0 : STUDIO.deck.length - 1, true); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); delSlide(); }
  }, o);
  /* tela: selecionar, arrastar, editar */
  canvas.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const tg = e.target as Element;
    const sl = $('.slide', canvas), ly = tg.closest<HTMLElement>('.ly'), ti2 = tg.closest<HTMLElement>('.sl-h, .sl-end p');
    const node = ly || ti2;
    if (node && node.isContentEditable) return;
    if (!node || !sl) { select(null); return; }
    const id = ly ? ly.dataset.ly! : 'title'; select(id);
    const s = curSlide(); if (!ly && s.type === 'end') return;
    const R = sl.getBoundingClientRect(), r = node.getBoundingClientRect();
    const ox = (r.left - R.left) / R.width * 100, oy = (r.top - R.top) / R.height * 100, px = e.clientX, py = e.clientY;
    let moved = false, nx = ox, ny = oy; const pre = snapState();
    const mv = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - px, ev.clientY - py) < 4) return;
      if (!moved) { moved = true; node.classList.add('dragging'); }
      nx = clampN(ox + (ev.clientX - px) / R.width * 100, -r.width / R.width * 100 + 4, 96);
      ny = clampN(oy + (ev.clientY - py) / R.height * 100, -r.height / R.height * 100 + 4, 96);
      node.style.left = nx + '%'; node.style.top = ny + '%'; placeSel();
    };
    const up = () => {
      node.removeEventListener('pointermove', mv); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', up);
      node.classList.remove('dragging');
      if (!moved) return;
      pushUndo(pre);
      if (ly) { const L = selLayer(); if (L) { L.x = +nx.toFixed(2); L.y = +ny.toFixed(2); } } else s.st = Object.assign({}, s.st, { x: +nx.toFixed(2), y: +ny.toFixed(2) });
      renderRail(); syncDesign(); saved(); if (STUDIO.ray) placeRay();
    };
    try { node.setPointerCapture(e.pointerId); } catch { /* sem captura */ }
    node.addEventListener('pointermove', mv); node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
  }, o);
  canvas.addEventListener('dblclick', e => {
    /* a captura do ponteiro entrega o clique duplo à camada inteira: o texto é o <p> dentro dela */
    const tg = e.target as Element;
    const lt = tg.closest('.ly-text'), p = lt && $('p', lt), h = !p ? tg.closest<HTMLElement>('.sl-h, .sl-end p') : null; if (!p && !h) return;
    if (p) { const id = p.parentElement!.dataset.ly!; select(id); startEdit(p, t => { const L = (curSlide().layers || []).find(x => x.id === id); if (L) L.t = t; }); }
    else if (h) { select('title'); startEdit(h, t => { curSlide().h = t; }); }
  }, o);
  /* barras flutuantes */
  $('#float-bar')!.addEventListener('click', e => {
    const b = (e.target as Element).closest<HTMLElement>('button'); if (!b) return; const st = curSlide().st || {};
    if (b.dataset.fbC) applyStyle({ c: b.dataset.fbC });
    else if (b.dataset.fb === 'bold') applyStyle({ w: (st.w || 600) >= 700 ? 600 : 700 });
    else if (b.dataset.fb === 'italic') applyStyle({ i: !st.i });
    else if (b.dataset.fb === 'align') applyStyle({ a: ({ left: 'center', center: 'right', right: 'left' } as const)[st.a || 'left'] });
  }, o);
  $('#ly-bar')!.addEventListener('click', e => {
    const b = (e.target as Element).closest<HTMLElement>('[data-lyb]'); if (!b) return;
    const acts: Record<string, () => void> = { dup: dupLayer, del: delLayer, front: () => orderLayer(true), back: () => orderLayer(false) };
    acts[b.dataset.lyb!]?.();
  }, o);
  /* painel Design */
  $<HTMLSelectElement>('#d-font')!.addEventListener('change', e => applyStyle({ f: (e.target as HTMLSelectElement).value as FontKey }), o);
  $<HTMLSelectElement>('#d-size')!.addEventListener('change', e => applyStyle({ z: +(e.target as HTMLSelectElement).value }), o);
  $$('#d-weight button', sub).forEach(b => b.addEventListener('click', () => applyStyle({ w: +b.dataset.w! }), o));
  $$('#d-colors button', sub).forEach(b => b.addEventListener('click', () => applyStyle({ c: b.dataset.c }), o));
  ['#d-x', '#d-y', '#d-w', '#d-h'].forEach((q, i) => $(q)!.addEventListener('change', e => {
    const v = parseFloat(String((e.target as HTMLInputElement).value).replace(',', '.')); if (isNaN(v)) return syncDesign();
    const pct = v / (i % 2 ? 720 : 1280) * 100, L = selLayer();
    if (L) { pushUndo(); L[(['x', 'y', 'w', 'h'] as const)[i]] = +clampN(pct, i > 1 ? 2 : -50, i > 1 ? 120 : 98).toFixed(2); renderEditor(); saved(); }
    else if (STUDIO.sel === 'title' && i < 2) {
      const st = curSlide().st || {}; const sl = $('#ed-canvas .slide')!, h = titleNode(sl)!, R = sl.getBoundingClientRect(), r = h.getBoundingClientRect();
      applyStyle({ x: i === 0 ? pct : (st.x != null ? st.x : (r.left - R.left) / R.width * 100), y: i === 1 ? pct : (st.y != null ? st.y : (r.top - R.top) / R.height * 100) });
    }
  }, o));
  /* painel Animação */
  $$('#d-fx button', sub).forEach(b => b.addEventListener('click', () => {
    if (!STUDIO.sel) select('title');
    const s = curSlide(), L = selLayer(), fx = b.dataset.fx as FxKind; pushUndo();
    if (L) L.fx = fx; else s.fx = fx;
    $$('#d-fx button', sub).forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderRail(); saved(); playFx(fx);
  }, o));
  const dur = $<HTMLInputElement>('#d-dur')!;
  dur.addEventListener('input', () => { $('#d-dur-v')!.textContent = dur.value + ' ms · curva halo-out'; dur.setAttribute('aria-valuetext', dur.value + ' milissegundos'); }, o);
  dur.addEventListener('change', () => { if (!STUDIO.sel) select('title'); const s = curSlide(), L = selLayer(); pushUndo(); if (L) L.fxd = +dur.value; else s.fxd = +dur.value; saved(); playFx((L ? L.fx : s.fx) || 'revelar'); }, o);
  $('#d-fx-play')!.addEventListener('click', () => { const s = curSlide(), L = selLayer(); playFx((L ? L.fx : s.fx) || 'revelar'); }, o);
  /* reposiciona a seleção quando a tela muda de tamanho ou as fontes chegam */
  window.addEventListener('resize', () => { placeSel(); if (STUDIO.ray) placeRay(); }, o);
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { placeSel(); if (STUDIO.ray) placeRay(); }) : null;
  ro?.observe(canvas);
  if (document.fonts && document.fonts.ready) void document.fonts.ready.then(() => { if (!S.signal.aborted) { placeSel(); syncDesign(); } });
  /* atalhos do editor (só com o editor à vista) */
  const offKey = onStudioKey('editor', e => {
    if (e.defaultPrevented || !studioOpen('editor') || modalOpen() || popOpen()) return;
    const k = e.key.toLowerCase(), mod = modKey(e);
    if (mod && k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); redo(); return; }
    if (typingIn(e.target)) return;
    if (mod && k === 'd') { e.preventDefault(); if (selLayer()) dupLayer(); else dupSlide(); return; }
    if (mod && k === 'm') { e.preventDefault(); insertSlide('text'); return; }
    if (mod && k === 'enter') { e.preventDefault(); present(); return; }
    if (mod || e.altKey) return;
    if (e.key === 'PageDown') { e.preventDefault(); goSlide(STUDIO.cur + 1); return; }
    if (e.key === 'PageUp') { e.preventDefault(); goSlide(STUDIO.cur - 1); return; }
    if (e.target instanceof Element && e.target.closest('#rail-list, .ribbon, .insp, .ed-top')) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selLayer()) { e.preventDefault(); delLayer(); return; }
    if (e.key === 'Escape' && STUDIO.sel) { select(null); return; }
    const arrows = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, [number, number]>)[e.key];
    if (arrows && STUDIO.sel) { e.preventDefault(); const m = e.shiftKey ? 2.5 : .5; nudge(arrows[0] * m, arrows[1] * m); return; }
    if (k === 'r') toggleRay();
  });
  /* Campo Halor da tela */
  const offFields = bootFields(document.getElementById('v-studio') ?? document);

  /* estado da sessão: aba do inspetor e Raio Halor como a pessoa deixou */
  const tab = inspTabs.find(t => t.dataset.insp === STUDIO.insp);
  if (tab && STUDIO.insp !== 'halor') showInsp(tab);
  if (STUDIO.ray) { $('#ray-toggle')!.setAttribute('aria-pressed', 'true'); $('#ray-layer')!.hidden = false; }
  renderEditor();
  /* "Biblioteca" na capa: abre o editor com a faixa de inserir em destaque e o menu de layouts */
  if (hasPending('biblioteca')) S.later(() => {
    if (!takePending('biblioteca')) return;
    const rb = $('.ribbon', sub), b = $('[data-ins="kpi"]', sub); if (!rb || !b) return;
    rb.scrollLeft = Math.max(0, b.offsetLeft - 40); rb.classList.remove('rb-hint'); void rb.offsetWidth; rb.classList.add('rb-hint');
    openPop(b, menuFill([{ h: 'Biblioteca: novo slide' }, ...layoutItems()]), { label: 'Biblioteca' });
  }, 120);

  return () => {
    S.dispose(); ro?.disconnect(); offKey(); offFields();
    clearTimeout(saveT);
    closePop(false);
  };
}
