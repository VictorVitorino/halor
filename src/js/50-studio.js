/* ==========================================================================
   SLIDES + ESTÚDIO · um renderizador de slides usado no editor, miniaturas,
   acervo, palco, prévia do site e manual da marca
   ========================================================================== */
/* As quatro primeiras posições alimentam a prévia do produto no site: mexa com cuidado. */
const DECK = [
  { type: 'cover', k: 'Kickoff · 2027', h: 'Plano 2027 em 12 semanas.', sub: 'Time de produto · 4 de novembro', n: 'Entrar em silêncio e deixar a capa respirar três segundos antes de falar.' },
  { type: 'text', k: 'O desafio', h: 'Muita informação, pouca atenção.', p: ['Hoje cada reunião começa com 40 slides.', 'Metade da sala desliga antes do quinto.'], n: 'Perguntar quem leu o último material até o fim. Esperar as mãos subirem.' },
  { type: 'kpi', k: 'Meta do trimestre', h: 'Queremos dobrar a leitura completa dos nossos materiais até março.', big: '2×', cap: 'leitura completa, de 34% para 68%', unit: '%', bars: [[34, 'Hoje'], [45, 'Mês 1'], [57, 'Mês 2'], [68, 'Mês 3']], n: 'Abrir com a pergunta: o que faria você ler um material até o fim? Depois mostrar o 2× e pausar dois segundos.' },
  { type: 'steps', k: 'Como funciona', h: 'Três movimentos, uma cadeia.', s: [['01', 'Diagnóstico', 'Raio-x dos materiais atuais'], ['02', 'Redesenho', 'Modelos com o kit de marca'], ['03', 'Medição', 'Painel por time']], n: 'Um movimento por vez. Avançar só quando a sala olhar para o card.' },
  { type: 'poll', k: 'Votação ao vivo', h: 'Por onde a gente começa?', opts: [['Materiais do time', 17], ['Treinamento', 12], ['Medição', 8], ['Eventos', 5]], code: 'K27', n: 'Ler o código em voz alta e deixar a votação aberta. Comentar o resultado enquanto as barras andam.' },
  { type: 'tl', k: 'Cronograma', h: 'Nove meses do primeiro olhar ao resultado.', ms: [['Mês 1', 'Diagnóstico', .1], ['Mês 3', 'Modelos no ar', .37], ['Mês 6', 'Time treinado', .63], ['Mês 9', 'Meta de ciclo', .9]], n: 'Apontar o mês 3: é ali que o time vê o primeiro resultado.' },
  { type: 'table', k: 'Recursos', h: 'Quem faz o quê.', head: ['Frente', 'Duração', 'Quem'], rows: [['Estúdio Halor', '12 semanas', 'Todo o time'], ['Treinamento de apresentação', '2 encontros', '4 h cada'], ['Total', '12 semanas', '25 pessoas']], n: 'Lembrar que o treinamento cabe na agenda atual do time.' },
  { type: 'next', k: 'Próximos passos', h: 'Combinamos o começo?', items: ['Validar o escopo com o time', 'Aprovar até 30 de outubro', 'Kickoff em 4 de novembro'], cta: 'Kickoff em 4 de novembro', n: 'Fechar com a data do kickoff e abrir para perguntas.' },
  { type: 'end', h: 'Obrigado.', sub: 'marina@nortesistemas.com.br', n: 'Deixar o contato na tela enquanto respondem às perguntas.' }
];

/* tag: nome da apresentação no rodapé (opcional; sem ele vale o Kickoff de exemplo) */
function slideHTML(s, n, brand, tag) {
  const foot = brand === 'halor'
    ? `<div class="sl-foot"><b><svg aria-hidden="true"><use href="${s.type === 'cover' ? '#hl-mark' : '#hl-mark-paper'}"/></svg>halor</b><span>${String(n).padStart(2, '0')}</span></div>`
    : `<div class="sl-foot"><span>Norte Sistemas · ${tag || 'Kickoff 2027'}</span><span>${String(n).padStart(2, '0')}</span></div>`;
  switch (s.type) {
    case 'cover': return `<div class="slide sl-cover"><span class="sl-ring"></span><span class="sl-ring sl-ring2"></span><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><p class="sl-sub">${s.sub}</p>${foot}</div>`;
    case 'text': return `<div class="slide sl-text sl-light"><p class="sl-k">${s.k}</p><p class="sl-h" style="width:48%">${s.h}</p><div class="sl-body">${s.p.map(x => `<p class="sl-p">${x}</p>`).join('')}</div><span class="sl-img"></span>${foot}</div>`;
    case 'kpi': {
      const mx = Math.max(...s.bars.map(b => b[0]));
      return `<div class="slide sl-kpi"><p class="sl-k">${s.k}</p><p class="sl-h" data-title>${s.h}</p><div class="sl-big"><b>${s.big}</b><span>${s.cap}</span></div><div class="sl-chart">${s.bars.map((b, i) => `<i class="${i === s.bars.length - 1 ? 'hi' : ''}" style="--h:${(b[0] / mx * 92).toFixed(0)}%"><em>${b[0]}${s.unit || ' d'}</em></i>`).join('')}</div><div class="sl-axis">${s.bars.map(b => `<span>${b[1]}</span>`).join('')}</div>${foot}</div>`;
    }
    case 'steps': return `<div class="slide sl-steps sl-light"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><div class="sl-row">${s.s.map(x => `<div class="sl-step"><b>${x[0]}</b><strong>${x[1]}</strong><span class="sl-p">${x[2]}</span></div>`).join('')}</div>${foot}</div>`;
    case 'tl': return `<div class="slide sl-tl"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><span class="sl-line"></span>${s.ms.map(m => `<div class="sl-ms" style="left:${6 + m[2] * 88}%"><span>${m[1]}</span><i></i><small>${m[0]}</small></div>`).join('')}${foot}</div>`;
    case 'table': { const hd = s.head || ['Item', 'Período', 'Valor']; return `<div class="slide sl-table sl-light"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><table class="sl-tbl"><thead><tr>${hd.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${s.rows.map((r, i) => `<tr class="${i === s.rows.length - 1 ? 'tot' : ''}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>${foot}</div>`; }
    case 'next': return `<div class="slide sl-next"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><div class="sl-list">${s.items.map((x, i) => `<div><i>${i + 1}</i>${x}</div>`).join('')}</div><div class="sl-cta">${s.cta}</div>${foot}</div>`;
    case 'poll': {
      const raw = s.opts.reduce((a, o) => a + o[1], 0), tot = raw || 1, mx = Math.max(...s.opts.map(o => o[1]));
      return `<div class="slide sl-poll sl-light"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><div class="sl-opts">${s.opts.map(o => { const p = Math.round(o[1] / tot * 100); return `<div class="sl-opt${o[1] === mx ? ' hi' : ''}" style="--v:${p}%"><span>${o[0]}</span><b>${p}%</b></div>`; }).join('')}</div><div class="sl-vote"><small>Vote pelo celular</small><b>halor.link</b><span>código <strong>${s.code || 'K27'}</strong></span><em>${votesLabel(raw)}</em></div>${foot}</div>`;
    }
    case 'end': return `<div class="slide sl-end">${brand === 'halor' ? '<svg aria-hidden="true"><use href="#hl-mark"/></svg>' : ''}<p>${s.h}</p><small>${s.sub}</small></div>`;
  }
  return '';
}

/* ==========================================================================
   Utilitários do Estúdio
   ========================================================================== */
const votesLabel = n => (n === 0 ? 'esperando o primeiro voto' : n === 1 ? '1 voto' : n + ' votos');
const escHTML = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plainText = h => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent; };
const fold = t => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const slugify = t => fold(t).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'apresentacao';
const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const modKey = e => (IS_MAC ? e.metaKey : e.ctrlKey);
const TOUCH = () => matchMedia('(hover: none) and (pointer: coarse)').matches;
const typingIn = t => !!(t && t.closest && (t.closest('input, textarea, select') || t.isContentEditable));
const studioOpen = sub => currentView === 'v-studio' && !$(`[data-subview="${sub}"]`)?.hidden;
const modalOpen = () => $$('.modal').some(m => !m.hidden);
const hhmm = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

/* ==========================================================================
   Estado do editor
   ========================================================================== */
const STUDIO = { deck: DECK, title: 'Kickoff 2027 · Time de produto', cur: 2, stage: 2, sel: 'title', undo: [], redo: [], ray: false, acv: 'todas', sort: 'recentes', q: '', lid: 1 };

/* Moldes de slide para inserir */
const LAYOUTS = {
  text: { n: 'Texto e imagem', ic: '#i-image', s: () => ({ type: 'text', k: 'Seção', h: 'Uma ideia por slide.', p: ['Escreva aqui o ponto principal.', 'Uma frase curta segura mais o olhar.'] }) },
  kpi: { n: 'Número em destaque', ic: '#i-bars', s: () => ({ type: 'kpi', k: 'Resultado', h: 'Um número que muda tudo.', big: '17 s', cap: 'de olhar médio por slide, antes eram 9 s', unit: ' s', bars: [[9, 'Antes'], [12, 'Mês 1'], [15, 'Mês 2'], [17, 'Agora']] }) },
  steps: { n: 'Cards em etapas', ic: '#i-cards', s: () => ({ type: 'steps', k: 'Em três passos', h: 'Ver, sentir, lembrar.', s: [['01', 'Ver', 'O olhar para'], ['02', 'Sentir', 'O olhar fica'], ['03', 'Lembrar', 'A ideia volta']] }) },
  poll: { n: 'Votação ao vivo', ic: '#i-vote', s: () => ({ type: 'poll', k: 'Votação ao vivo', h: 'O que a sala quer ver primeiro?', opts: [['Os números', 0], ['A história', 0], ['As pessoas', 0], ['O plano', 0]], code: 'H' + Math.floor(10 + Math.random() * 89) }) },
  tl: { n: 'Linha do tempo', ic: '#i-clock', s: () => ({ type: 'tl', k: 'Linha do tempo', h: 'Do primeiro olhar ao resultado.', ms: [['S1', 'Começo', .1], ['S4', 'Teste', .37], ['S8', 'Ajuste', .63], ['S12', 'Entrega', .9]] }) },
  table: { n: 'Tabela', ic: '#i-table', s: () => ({ type: 'table', k: 'Quem faz o quê', h: 'Cada frente com um dono.', head: ['Frente', 'Prazo', 'Quem'], rows: [['Conteúdo', '2 semanas', 'Marina'], ['Design', '3 semanas', 'Rafael'], ['Total', '5 semanas', '2 pessoas']] }) },
  next: { n: 'Lista com destaque', ic: '#i-check', s: () => ({ type: 'next', k: 'Para levar', h: 'Três coisas para lembrar.', items: ['Um destaque por slide', 'Uma pergunta para a sala', 'Um próximo passo claro'], cta: 'Próximo encontro em 15 dias' }) },
  end: { n: 'Encerramento', ic: '#i-spark', s: () => ({ type: 'end', h: 'Obrigado.', sub: 'marina@nortesistemas.com.br' }) }
};
/* x e y: onde cada tipo nasce (em % do slide), longe do título e do rodapé */
const LAYER_KINDS = {
  text: { n: 'Texto', ic: '#i-text', w: 34, h: 11, x: 8, y: 76 },
  shape: { n: 'Forma', ic: '#i-shape', w: 13, h: 23.1, x: 80, y: 8, fem: true },
  arrow: { n: 'Seta', ic: '#i-arrowline', w: 18, h: 9, x: 46, y: 74, fem: true },
  image: { n: 'Imagem', ic: '#i-image', w: 26, h: 38, x: 68, y: 40, fem: true },
  icon: { n: 'Ícone', ic: '#i-spark', w: 7, h: 12.4, x: 70, y: 12 }
};
const PT_BASE = { cover: 56, end: 40 };
const CQ_BASE = { cover: 5.6, end: 4 };
const FONTS_K = { ui: 'var(--f-ui)', display: 'var(--f-display)', mono: 'var(--f-mono)' };
const SUGGEST = { 'Queremos dobrar a leitura completa dos nossos materiais até março.': 'Leitura completa em dobro.' };

const curSlide = () => STUDIO.deck[STUDIO.cur];
const selLayer = () => (STUDIO.sel && STUDIO.sel !== 'title') ? (curSlide().layers || []).find(l => l.id === STUDIO.sel) : null;

function layerHTML(l) {
  const st = `left:${l.x}%;top:${l.y}%;width:${l.w}%;height:${l.h}%;${l.c ? '--lc:' + l.c + ';' : ''}`;
  let inner = '';
  if (l.k === 'text') inner = `<p style="font-size:${((l.z || 24) / 44 * 4.2).toFixed(2)}cqw;font-weight:${l.wt || 600}${l.f ? ';font-family:' + FONTS_K[l.f] : ''}">${l.t}</p>`;
  else if (l.k === 'arrow') inner = '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M3 20H92" vector-effect="non-scaling-stroke"/><path d="M78 5L95 20L78 35" vector-effect="non-scaling-stroke"/></svg>';
  else if (l.k === 'icon') inner = '<svg aria-hidden="true"><use href="#i-spark"/></svg>';
  else if (l.k === 'image') inner = '<span><svg aria-hidden="true"><use href="#i-image"/></svg>Solte uma imagem</span>';
  return `<div class="ly ly-${l.k}${l.fx ? ' has-fx' : ''}" data-ly="${l.id}" style="${st}">${inner}</div>`;
}
function titleNode(slide) { return slide.querySelector('.sl-h') || slide.querySelector('.sl-end p'); }
/* aplica camadas e estilo do título num slide já renderizado */
function paintSlide(slide, s) {
  if (!slide) return slide;
  if (s.layers && s.layers.length) slide.insertAdjacentHTML('beforeend', s.layers.map(layerHTML).join(''));
  const h = titleNode(slide), st = s.st;
  if (h && st) {
    if (st.c) h.style.color = st.c;
    if (st.f) h.style.fontFamily = FONTS_K[st.f];
    if (st.z) h.style.fontSize = ((CQ_BASE[s.type] || 4.2) * st.z / (PT_BASE[s.type] || 44)).toFixed(2) + 'cqw';
    if (st.w) h.style.fontWeight = st.w;
    if (st.i) h.style.fontStyle = 'italic';
    if (st.a) h.style.textAlign = st.a;
    if (st.x != null && s.type !== 'end') { h.style.left = st.x + '%'; h.style.top = st.y + '%'; }
  }
  return slide;
}
/* o rodapé dos slides acompanha a apresentação aberta */
const deckTag = t => escHTML(String(t || '').split('·')[0].trim() || 'Kickoff 2027');
function mountSlide(box, s, n) { box.innerHTML = slideHTML(s, n, undefined, deckTag(STUDIO.title)); return paintSlide(box.firstElementChild, s); }

/* ==========================================================================
   Histórico (desfazer / refazer) e salvamento
   ========================================================================== */
const snapState = () => JSON.stringify({ d: STUDIO.deck, c: STUDIO.cur, s: STUDIO.sel });
function pushUndo(pre) { STUDIO.undo.push(pre || snapState()); if (STUDIO.undo.length > 60) STUDIO.undo.shift(); STUDIO.redo.length = 0; syncHistory(); }
function restore(json) { const o = JSON.parse(json); STUDIO.deck.splice(0, STUDIO.deck.length, ...o.d); STUDIO.cur = clampN(o.c, 0, STUDIO.deck.length - 1); STUDIO.sel = o.s; renderEditor(); saved(); }
function undo() { if (!STUDIO.undo.length) return toast('Nada para desfazer'); STUDIO.redo.push(snapState()); restore(STUDIO.undo.pop()); syncHistory(); toast('Desfeito'); }
function redo() { if (!STUDIO.redo.length) return toast('Nada para refazer'); STUDIO.undo.push(snapState()); restore(STUDIO.redo.pop()); syncHistory(); toast('Refeito'); }
function syncHistory() { $('#ed-undo')?.setAttribute('aria-disabled', String(!STUDIO.undo.length)); $('#ed-redo')?.setAttribute('aria-disabled', String(!STUDIO.redo.length)); }
let saveT = 0;
function saved() {
  const p = $('#save-pill'); if (!p) return;
  p.classList.add('busy'); $('span', p).textContent = 'Salvando…';
  clearTimeout(saveT); saveT = setTimeout(() => { p.classList.remove('busy'); $('span', p).textContent = 'Salvo na nuvem às ' + hhmm(); }, 650);
}

/* ==========================================================================
   Editor: trilho, tela, seleção
   ========================================================================== */
function renderRail() {
  const rail = $('#rail-list'); if (!rail) return;
  rail.textContent = '';
  STUDIO.deck.forEach((s, i) => {
    const li = el('li'); if (i === STUDIO.cur) li.className = 'on';
    const b = el('button', 'rail-th'); b.type = 'button'; b.dataset.i = i;
    b.setAttribute('aria-label', 'Slide ' + (i + 1) + ': ' + plainText(s.h || s.k));
    if (i === STUDIO.cur) b.setAttribute('aria-current', 'true'); else b.tabIndex = -1;
    mountSlide(b, s, i + 1);
    const act = el('span', 'rail-act');
    [['dup', '#i-copy', 'Duplicar'], ['del', '#i-trash', 'Excluir']].forEach(([k, ic, n]) => {
      const x = el('button', 'btn-icon'); x.type = 'button'; x.dataset.rail = k; x.dataset.i = i; x.tabIndex = -1;
      x.setAttribute('aria-label', n + ' slide ' + (i + 1)); x.title = n + ' slide';
      x.innerHTML = `<svg aria-hidden="true"><use href="${ic}"/></svg>`; act.appendChild(x);
    });
    li.append(b, act); rail.appendChild(li);
  });
  $('#rail-n').textContent = STUDIO.deck.length;
}

function renderEditor() {
  if (!$('#rail-list')) return;
  STUDIO.cur = clampN(STUDIO.cur, 0, STUDIO.deck.length - 1);
  const s = curSlide();
  if (STUDIO.sel && STUDIO.sel !== 'title' && !selLayer()) STUDIO.sel = null;
  renderRail();
  mountSlide($('#ed-canvas'), s, STUDIO.cur + 1);
  $('#ed-pos').textContent = 'Slide ' + (STUDIO.cur + 1) + ' de ' + STUDIO.deck.length;
  const t = $('#ed-title'); if (t && document.activeElement !== t) t.value = STUDIO.title;
  placeSel(); renderHalor(); syncDesign(); syncHistory();
  if (STUDIO.ray) placeRay();
}

function selNode() {
  const c = $('#ed-canvas .slide'); if (!c || !STUDIO.sel) return null;
  return STUDIO.sel === 'title' ? titleNode(c) : c.querySelector(`[data-ly="${STUDIO.sel}"]`);
}
function select(id) {
  STUDIO.sel = id; placeSel(); syncDesign();
}
function placeSel() {
  const box = $('#sel-box'), fb = $('#float-bar'), lb = $('#ly-bar'), wrap = $('.ed-canvas-wrap'); if (!box || !wrap) return;
  const n = selNode();
  if (!n || !n.offsetWidth) { box.hidden = true; fb.hidden = true; lb.hidden = true; return; }
  const w = wrap.getBoundingClientRect(), r = n.getBoundingClientRect();
  const x = r.left - w.left, y = r.top - w.top;
  Object.assign(box.style, { left: (x - 3) + 'px', top: (y - 3) + 'px', width: (r.width + 6) + 'px', height: (r.height + 6) + 'px' });
  box.hidden = false;
  const s = curSlide(), L = selLayer(), isTitle = STUDIO.sel === 'title';
  const pt = isTitle ? ((s.st && s.st.z) || PT_BASE[s.type] || 44) : (L && L.k === 'text' ? (L.z || 24) : 0);
  $('.sel-tag', box).textContent = isTitle ? 'Título · ' + pt + ' pt' : LAYER_KINDS[L.k].n + (pt ? ' · ' + pt + ' pt' : '');
  const bar = isTitle ? fb : lb; (isTitle ? lb : fb).hidden = true;
  bar.hidden = false;
  if (!isTitle) $('#ly-name').textContent = LAYER_KINDS[L.k].n;
  const bw = bar.offsetWidth, top = y - 3 - bar.offsetHeight - (isTitle && $('.sl-k', n.parentElement) ? 30 : 10);
  bar.style.left = clampN(x - 3, 0, Math.max(0, w.width - bw)) + 'px';
  bar.style.top = Math.max(top, -58) + 'px';
  if (isTitle) {
    const st = s.st || {};
    $('[data-fb="bold"]', fb).setAttribute('aria-pressed', String((st.w || 600) >= 700));
    $('[data-fb="italic"]', fb).setAttribute('aria-pressed', String(!!st.i));
    $('[data-fb="align"]', fb).setAttribute('aria-label', 'Alinhamento: ' + ({ center: 'centralizado', right: 'à direita' }[st.a] || 'à esquerda'));
    $$('[data-fb-c]', fb).forEach(b => b.setAttribute('aria-pressed', String((st.c || '') === b.dataset.fbC)));
  }
}

/* Raio Halor: mapa de atenção calculado sobre os elementos reais do slide */
const RAY_T = {
  cover: [['.sl-h', 'Título'], ['.sl-k', 'Sobretítulo'], ['.sl-sub', 'Subtítulo'], ['.sl-foot', 'Rodapé']],
  text: [['.sl-h', 'Título'], ['.sl-img', 'Imagem'], ['.sl-body', 'Texto'], ['.sl-foot', 'Rodapé']],
  kpi: [['.sl-h', 'Título'], ['.sl-big b', 'Número de destaque'], ['.sl-chart', 'Gráfico'], ['.sl-foot', 'Fonte']],
  steps: [['.sl-h', 'Título'], ['.sl-step', 'Etapa 1'], ['.sl-step@1', 'Etapa 2'], ['.sl-step@2', 'Etapa 3']],
  poll: [['.sl-h', 'Pergunta'], ['.sl-opt.hi', 'Opção mais votada'], ['.sl-vote', 'Código para votar'], ['.sl-opts', 'Resultado']],
  tl: [['.sl-h', 'Título'], ['.sl-ms', 'Primeiro marco'], ['.sl-ms@3', 'Último marco'], ['.sl-foot', 'Rodapé']],
  table: [['.sl-h', 'Título'], ['.sl-tbl tr.tot', 'Linha de total'], ['.sl-tbl thead', 'Cabeçalho'], ['.sl-foot', 'Rodapé']],
  next: [['.sl-h', 'Título'], ['.sl-cta', 'Destaque'], ['.sl-list', 'Lista'], ['.sl-foot', 'Rodapé']],
  end: [['p', 'Mensagem'], ['small', 'Contato'], ['svg', 'Marca']]
};
const pick = (root, q) => { const [sel, i] = q.split('@'); return $$(sel, root)[+(i || 0)] || null; };
function placeRay() {
  const lay = $('#ray-layer'), sl = $('#ed-canvas .slide'); if (!lay || !sl) return;
  const R = sl.getBoundingClientRect(), pts = [];
  (RAY_T[curSlide().type] || []).forEach(([q]) => { const n = pick(sl, q); if (!n) return; const r = n.getBoundingClientRect(); if (r.width) pts.push({ x: (r.left + r.width / 2 - R.left) / R.width * 100, y: (r.top + r.height / 2 - R.top) / R.height * 100, w: r.width / R.width * 100, h: r.height / R.height * 100 }); });
  $$('.ray-n', lay).forEach((n, i) => { const p = pts[i]; n.hidden = !p; if (p) { n.style.left = p.x + '%'; n.style.top = p.y + '%'; } });
  $$('.ray-heat', lay).forEach((n, i) => { const p = pts[i]; n.hidden = !p; if (p) { const w = clampN(p.w * 1.2, 22, 70), h = clampN(p.h * 1.6, 26, 60); Object.assign(n.style, { left: (p.x - w / 2) + '%', top: (p.y - h / 2) + '%', width: w + '%', height: h + '%' }); } });
}
function toggleRay(force) {
  const b = $('#ray-toggle'); const on = force != null ? force : b.getAttribute('aria-pressed') !== 'true';
  STUDIO.ray = on; b.setAttribute('aria-pressed', String(on)); $('#ray-layer').hidden = !on;
  if (on) {
    placeRay(); const g = (RAY_T[curSlide().type] || []).map(x => x[1].toLowerCase());
    const fem = t => RAY_FEM.test(t);
    if (g.length > 1) toast('Raio Halor: o olhar começa ' + (fem(g[0]) ? 'na ' : 'no ') + g[0] + ' e segue para ' + (fem(g[1]) ? 'a ' : 'o ') + g[1] + '.');
  }
}
/* rótulos femininos do caminho do olhar, para o artigo certo no aviso */
const RAY_FEM = /^(imagem|fonte|etapa|pergunta|opção|linha|lista|mensagem|marca)/;

/* ==========================================================================
   Inspetor: Halor, Design, Animação
   ========================================================================== */
const LIGHT_INK = ['#c4a6ff', '#e9dfff'], DARK_INK = ['#17112b', '#07040f', '#4a4366'];
function analyze(s) {
  const words = plainText(s.h || '').split(/\s+/).filter(Boolean).length, extras = (s.layers || []).length;
  const dark = s.type === 'cover' || s.type === 'end', c = s.st && s.st.c;
  const lowContrast = c && (dark ? DARK_INK.includes(c) : LIGHT_INK.includes(c));
  let score = 94 - Math.max(0, words - 7) * 2 - Math.max(0, extras - 2) * 3 - (lowContrast ? 12 : 0);
  score = clampN(score, 38, 99);
  const read = .6 + words * .06 + Math.max(0, extras - 2) * .15;
  const checks = [];
  checks.push(extras > 2
    ? { w: 1, b: 'Elementos disputando o olhar', p: extras + ' elementos extras no slide. Deixe só o que ajuda a mensagem.' }
    : { b: 'Um destaque por slide', p: s.type === 'kpi' ? 'O número ' + s.big + ' domina a leitura.' : s.type === 'poll' ? 'A opção mais votada salta aos olhos.' : 'O título conduz a leitura.' });
  checks.push(lowContrast
    ? { w: 1, b: 'Contraste baixo no título', p: dark ? 'Tinta escura sobre fundo escuro some no telão. Use Lúmen ou Lilás.' : 'Lilás sobre branco fica abaixo de 4,5:1. Use Tinta ou Violeta.' }
    : { b: 'Contraste do texto', p: '7,1:1, acima do mínimo de 4,5:1.' });
  if (s.type !== 'end') checks.push(words > 7
    ? { w: 1, b: 'Título com ' + words + ' palavras', p: 'Títulos de até 7 palavras seguram 30% mais o olhar.', fix: SUGGEST[plainText(s.h)] }
    : { b: 'Título com ' + words + (words === 1 ? ' palavra' : ' palavras'), p: 'Curto o bastante para ser lido em um olhar.' });
  const vis = { kpi: 'Ocupa 38% da área visível.', text: 'A imagem ocupa 30% do slide.', poll: 'As barras mostram o resultado em um olhar.', steps: 'Três blocos com o mesmo peso guiam a leitura.', tl: 'A linha leva o olhar da esquerda para a direita.', table: 'A linha de total aparece em destaque.' }[s.type];
  if (vis) checks.push({ b: s.type === 'table' ? 'Linha que importa em destaque' : 'Imagem ou gráfico dominante', p: vis });
  return { score, read, checks, gaze: (RAY_T[s.type] || []).map(x => x[1]) };
}
function renderHalor() {
  const panel = $('[data-insp-panel="halor"]'); if (!panel) return;
  const s = curSlide(), a = analyze(s), C = 2 * Math.PI * 33;
  $('.rs-ring b', panel).textContent = a.score;
  $('.rs-ring .val', panel).style.strokeDasharray = (a.score / 100 * C).toFixed(1) + ' ' + C.toFixed(1);
  const verdict = a.score >= 90 ? 'Muito forte' : a.score >= 80 ? 'Forte' : a.score >= 65 ? 'Bom, com ajustes' : 'Fraco';
  $('.rs-v', panel).textContent = verdict + '. O olhar encontra a mensagem em ' + fmtNum(a.read, 1) + ' s.';
  const g = $('#gaze'); g.textContent = '';
  a.gaze.forEach((n, i) => { const li = el('li'); li.append(el('i', null, String(i + 1)), document.createTextNode(n)); g.appendChild(li); });
  const ck = $('#checks'); ck.textContent = '';
  a.checks.forEach(c => {
    const li = el('li', c.w ? 'warn' : 'ok');
    li.innerHTML = `<svg aria-hidden="true"><use href="${c.w ? '#i-alert' : '#i-check'}"/></svg>`;
    const d = el('div'); d.append(el('b', null, c.b), el('span', null, c.p));
    if (c.fix) {
      const b = el('button', 'btn btn-ghost btn-xs', 'Aplicar sugestão'); b.type = 'button'; b.id = 'fix-title';
      b.addEventListener('click', () => { pushUndo(); s.h = c.fix; renderEditor(); saved(); toast('Sugestão aplicada. Índice do slide: ' + analyze(s).score); });
      d.appendChild(b);
    }
    li.appendChild(d); ck.appendChild(li);
  });
}
function syncDesign() {
  const s = curSlide(); if (!s || !$('#d-font')) return;
  const L = selLayer(), isTitle = STUDIO.sel === 'title';
  const txt = isTitle || (L && L.k === 'text');
  const info = $('#insp-sel');
  info.querySelector('use').setAttribute('href', isTitle ? '#i-text' : L ? LAYER_KINDS[L.k].ic : '#i-layers');
  $('span', info).textContent = isTitle ? 'Título do slide' : L ? LAYER_KINDS[L.k].n + ' no slide' : 'Nada selecionado. Clique num elemento do slide.';
  $('#d-text').hidden = !txt;
  const st = isTitle ? (s.st || {}) : L ? { c: L.c, f: L.f, z: L.z || 24, w: L.wt || 600 } : {};
  $('#d-font').value = st.f || (isTitle && (s.type === 'cover' || s.type === 'end') ? 'display' : 'ui');
  const z = String(st.z || PT_BASE[s.type] || 44), zs = $('#d-size');
  if (!$$('option', zs).some(o => o.value === z)) zs.appendChild(el('option', null, z));
  zs.value = z;
  $$('#d-weight button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.w === (st.w || 600))));
  const colorOK = isTitle || (L && L.k !== 'image');
  $$('#d-colors button').forEach(b => { b.setAttribute('aria-pressed', String(colorOK && (st.c || (isTitle ? '#17112b' : '')) === b.dataset.c)); b.disabled = !colorOK; });
  const sl = $('#ed-canvas .slide'), n = selNode(), xs = ['#d-x', '#d-y', '#d-w', '#d-h'];
  if (sl && n) {
    const R = sl.getBoundingClientRect(), r = n.getBoundingClientRect(), k = 1280 / R.width;
    [r.left - R.left, r.top - R.top, r.width, r.height].forEach((v, i) => { const inp = $(xs[i]); inp.value = Math.round(v * k); inp.disabled = false; inp.readOnly = isTitle && i > 1; });
  } else xs.forEach(q => { const inp = $(q); inp.value = ''; inp.disabled = true; });
  const fx = (isTitle ? s.fx : L && L.fx) || 'revelar', fxd = (isTitle ? s.fxd : L && L.fxd) || 900;
  $$('#d-fx button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.fx === fx)));
  $('#d-dur').value = fxd; $('#d-dur').setAttribute('aria-valuetext', fxd + ' milissegundos');
  $('#d-dur-v').textContent = fxd + ' ms · curva halo-out';
}
function applyStyle(patch) {
  const s = curSlide(), L = selLayer();
  if (!STUDIO.sel) return toast('Selecione um elemento do slide primeiro');
  pushUndo();
  if (STUDIO.sel === 'title') s.st = Object.assign({}, s.st, patch);
  else if (L) { if ('w' in patch) { L.wt = patch.w; delete patch.w; } Object.assign(L, patch); }
  renderEditor(); saved();
}
function playFx(fx) {
  const n = selNode(); if (!n) return toast('Selecione o título ou um elemento para ver a entrada');
  const s = curSlide(), L = selLayer(), d = (STUDIO.sel === 'title' ? s.fxd : L && L.fxd) || 900;
  n.classList.remove('fx-revelar', 'fx-brilho', 'fx-subir', 'fx-halo');
  void n.offsetWidth;
  n.style.setProperty('--fxd', d + 'ms'); n.classList.add('fx-' + fx);
  if (REDUCED) toast('Com “reduzir movimento” ligado, a entrada vira um corte seco');
  n.addEventListener('animationend', () => n.classList.remove('fx-' + fx), { once: true });
}

/* ==========================================================================
   Operações de slide e de elemento
   ========================================================================== */
function goSlide(i, focusRail) {
  STUDIO.cur = clampN(i, 0, STUDIO.deck.length - 1); STUDIO.sel = 'title'; renderEditor();
  if (focusRail) $(`#rail-list .rail-th[data-i="${STUDIO.cur}"]`)?.focus();
  const th = $(`#rail-list li.on`); if (th) th.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function insertSlide(key, data) {
  pushUndo();
  const s = data ? JSON.parse(JSON.stringify(data)) : LAYOUTS[key].s();
  STUDIO.deck.splice(STUDIO.cur + 1, 0, s); goSlide(STUDIO.cur + 1); saved();
  toast((data ? 'Slide do modelo' : 'Slide de ' + LAYOUTS[key].n.toLowerCase()) + ' inserido na posição ' + (STUDIO.cur + 1));
}
function dupSlide(i = STUDIO.cur) {
  pushUndo(); const c = JSON.parse(JSON.stringify(STUDIO.deck[i]));
  STUDIO.deck.splice(i + 1, 0, c); goSlide(i + 1, true); saved(); toast('Slide ' + (i + 1) + ' duplicado');
}
function delSlide(i = STUDIO.cur) {
  if (STUDIO.deck.length < 2) return toast('A apresentação precisa de pelo menos um slide');
  pushUndo(); STUDIO.deck.splice(i, 1);
  goSlide(Math.min(i, STUDIO.deck.length - 1), true); saved();
  toast('Slide ' + (i + 1) + ' excluído. ' + MOD() + 'Z desfaz');
}
function moveSlide(d) {
  const i = STUDIO.cur, j = i + d; if (j < 0 || j >= STUDIO.deck.length) return;
  pushUndo(); const [s] = STUDIO.deck.splice(i, 1); STUDIO.deck.splice(j, 0, s);
  goSlide(j, true); saved();
  toast('Slide movido para a posição ' + (j + 1));
}
function insertLayer(k) {
  const s = curSlide(), K = LAYER_KINDS[k]; s.layers = s.layers || [];
  pushUndo();
  const off = (s.layers.filter(x => x.k === k).length % 5) * 3;
  const l = { id: 'l' + (STUDIO.lid++), k, x: clampN(K.x + off, 2, 98 - K.w), y: clampN(K.y + off, 3, 96 - K.h), w: K.w, h: K.h };
  const tap = TOUCH() ? 'Toque' : 'Clique';
  if (k === 'text') { l.t = tap + ' duas vezes para escrever'; l.z = 24; l.c = s.type === 'cover' || s.type === 'end' ? '#f4eeff' : '#17112b'; }
  if (k === 'shape' || k === 'arrow' || k === 'icon') l.c = '#8b3dff';
  s.layers.push(l); STUDIO.sel = l.id; renderEditor(); saved();
  toast(K.n + ' no slide. Arraste para posicionar' + (k === 'text' ? ', ' + tap.toLowerCase() + ' duas vezes para escrever' : ''));
}
function dupLayer() {
  const L = selLayer(); if (!L) return; pushUndo();
  const c = Object.assign({}, L, { id: 'l' + (STUDIO.lid++), x: clampN(L.x + 3, 0, 100 - L.w), y: clampN(L.y + 3, 0, 100 - L.h) });
  curSlide().layers.push(c); STUDIO.sel = c.id; renderEditor(); saved(); toast(LAYER_KINDS[L.k].n + (LAYER_KINDS[L.k].fem ? ' duplicada' : ' duplicado'));
}
function delLayer() {
  const L = selLayer(); if (!L) return; pushUndo();
  const s = curSlide(); s.layers = s.layers.filter(x => x !== L); STUDIO.sel = null; renderEditor(); saved();
  toast(LAYER_KINDS[L.k].n + (LAYER_KINDS[L.k].fem ? ' excluída. ' : ' excluído. ') + MOD() + 'Z desfaz');
}
function orderLayer(front) {
  const L = selLayer(); if (!L) return toast('Selecione um elemento do slide');
  pushUndo(); const s = curSlide(); s.layers = s.layers.filter(x => x !== L); front ? s.layers.push(L) : s.layers.unshift(L);
  renderEditor(); saved(); toast(front ? 'Elemento na frente' : 'Elemento atrás');
}
let nudgeAt = 0;
function nudge(dx, dy) {
  const s = curSlide(), L = selLayer();
  if (Date.now() - nudgeAt > 700) pushUndo(); nudgeAt = Date.now();
  if (L) { L.x = clampN(L.x + dx, -L.w + 4, 96); L.y = clampN(L.y + dy, -L.h + 4, 96); }
  else if (STUDIO.sel === 'title' && s.type !== 'end') {
    const sl = $('#ed-canvas .slide'), h = titleNode(sl), R = sl.getBoundingClientRect(), r = h.getBoundingClientRect();
    const st = s.st || {}, x = st.x != null ? st.x : (r.left - R.left) / R.width * 100, y = st.y != null ? st.y : (r.top - R.top) / R.height * 100;
    s.st = Object.assign({}, st, { x: clampN(x + dx, -20, 96), y: clampN(y + dy, -10, 96) });
  } else return;
  renderEditor(); saved();
}
function startEdit(node, onCommit) {
  if (node.isContentEditable) return;
  const before = node.textContent, pre = snapState();
  node.contentEditable = 'true'; node.spellcheck = true; node.classList.add('editing'); node.focus();
  const r = document.createRange(); r.selectNodeContents(node); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
  let cancel = false;
  const key = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); node.blur(); } if (e.key === 'Escape') { e.stopPropagation(); cancel = true; node.blur(); } };
  node.addEventListener('keydown', key);
  node.addEventListener('blur', () => {
    node.removeEventListener('keydown', key); node.contentEditable = 'false'; node.classList.remove('editing');
    const txt = node.textContent.replace(/\s+/g, ' ').trim();
    if (cancel || !txt || txt === before.trim()) { node.textContent = before; placeSel(); return; }
    pushUndo(pre); onCommit(escHTML(txt)); renderEditor(); saved();
  }, { once: true });
}

/* ==========================================================================
   Menus flutuantes (menus do editor, novo slide, notificações, ações)
   ========================================================================== */
let POP = null;
function closePop(back = true) {
  if (!POP) return; const p = POP; POP = null;
  p.el.remove(); p.btn.setAttribute('aria-expanded', 'false'); p.btn.classList.remove('pop-on');
  if (back) p.btn.focus();
}
function openPop(btn, fill, opt = {}) {
  if (POP && POP.btn === btn) return closePop();
  closePop(false);
  const box = el('div', 'pop theme-paper' + (opt.cls ? ' ' + opt.cls : ''));
  box.setAttribute('role', opt.role || 'menu'); if (opt.label) box.setAttribute('aria-label', opt.label);
  fill(box); document.body.appendChild(box);
  POP = { el: box, btn, t: performance.now() }; btn.setAttribute('aria-expanded', 'true'); btn.classList.add('pop-on');
  const r = btn.getBoundingClientRect(), bw = box.offsetWidth, bh = box.offsetHeight, vw = document.documentElement.clientWidth, vh = window.innerHeight;
  let x = opt.align === 'right' ? r.right - bw : r.left, y = r.bottom + 6;
  if (y + bh > vh - 8 && r.top - bh - 6 > 8) y = r.top - bh - 6;
  box.style.left = clampN(x, 8, vw - bw - 8) + 'px'; box.style.top = clampN(y, 8, Math.max(8, vh - bh - 8)) + 'px';
  const first = $('[role="menuitem"]:not([aria-disabled="true"]), a, button', box); if (first) first.focus();
}
function menuFill(items) {
  return box => items.forEach(it => {
    if (it === '-') { box.appendChild(el('span', 'pop-sep')); return; }
    if (it.h) { box.appendChild(el('p', 'pop-h', it.h)); return; }
    const b = el('button', 'pop-i' + (it.danger ? ' danger' : '')); b.type = 'button'; b.setAttribute('role', 'menuitem');
    if (it.ic) b.insertAdjacentHTML('beforeend', `<svg aria-hidden="true"><use href="${it.ic}"/></svg>`);
    b.appendChild(el('span', null, it.t));
    if (it.k) b.appendChild(el('kbd', null, it.k));
    if (it.off) b.setAttribute('aria-disabled', 'true');
    b.addEventListener('click', () => { if (it.off) return; closePop(false); it.act(); });
    box.appendChild(b);
  });
}
document.addEventListener('pointerdown', e => { if (POP && !POP.el.contains(e.target) && !POP.btn.contains(e.target)) closePop(false); });
document.addEventListener('keydown', e => {
  if (!POP) return;
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePop(); return; }
  if (e.key === 'Tab') { closePop(false); return; }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
    const its = $$('[role="menuitem"]:not([aria-disabled="true"])', POP.el); if (!its.length) return;
    e.preventDefault(); const i = its.indexOf(document.activeElement);
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? its.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + its.length) % its.length;
    its[n].focus();
  }
}, true);
window.addEventListener('resize', () => { closePop(false); placeSel(); if (STUDIO.ray) placeRay(); });
/* rolar a página fecha o menu (menos o rolar que o próprio clique de abertura provoca) */
document.addEventListener('scroll', e => { if (POP && !POP.el.contains(e.target) && performance.now() - POP.t > 250) closePop(false); }, true);

const MOD = () => (IS_MAC ? '⌘' : 'Ctrl+');
function layoutItems() { return Object.keys(LAYOUTS).map(k => ({ t: LAYOUTS[k].n, ic: LAYOUTS[k].ic, act: () => insertSlide(k) })); }
function edMenu(name) {
  const L = selLayer();
  return {
    arquivo: [{ t: 'Nova apresentação', ic: '#i-plus', act: () => { openDeck('new'); } }, { t: 'Importar arquivo', ic: '#i-upload', act: () => openModal('m-import') }, '-', { t: 'Salvar como', ic: '#i-download', act: () => openModal('m-export') }, { t: 'Baixar HTML interativo', ic: '#i-file', act: exportHTML }, { t: 'Compartilhar', ic: '#i-share', act: () => openModal('m-share') }],
    editar: [{ t: 'Desfazer', ic: '#i-undo', k: MOD() + 'Z', off: !STUDIO.undo.length, act: undo }, { t: 'Refazer', ic: '#i-redo', k: 'Shift+' + MOD() + 'Z', off: !STUDIO.redo.length, act: redo }, '-', { t: 'Duplicar elemento', ic: '#i-copy', off: !L, act: dupLayer }, { t: 'Excluir elemento', ic: '#i-trash', k: 'Delete', off: !L, danger: true, act: delLayer }],
    inserir: [{ h: 'No slide' }, ...Object.keys(LAYER_KINDS).map(k => ({ t: LAYER_KINDS[k].n, ic: LAYER_KINDS[k].ic, act: () => insertLayer(k) })), '-', { h: 'Novo slide' }, ...['kpi', 'table', 'steps', 'poll'].map(k => ({ t: LAYOUTS[k].n, ic: LAYOUTS[k].ic, act: () => insertSlide(k) }))],
    slide: [{ t: 'Novo slide', ic: '#i-plus', k: MOD() + 'M', act: () => insertSlide('text') }, { t: 'Duplicar slide', ic: '#i-copy', k: MOD() + 'D', act: () => dupSlide() }, { t: 'Excluir slide', ic: '#i-trash', danger: true, off: STUDIO.deck.length < 2, act: () => delSlide() }, '-', { t: 'Slide anterior', ic: '#i-back', k: 'PgUp', off: STUDIO.cur === 0, act: () => goSlide(STUDIO.cur - 1) }, { t: 'Slide seguinte', ic: '#i-arrow', k: 'PgDn', off: STUDIO.cur === STUDIO.deck.length - 1, act: () => goSlide(STUDIO.cur + 1) }],
    organizar: [{ t: 'Mover slide para cima', ic: '#i-up', k: 'Alt+↑', off: STUDIO.cur === 0, act: () => moveSlide(-1) }, { t: 'Mover slide para baixo', ic: '#i-down', k: 'Alt+↓', off: STUDIO.cur === STUDIO.deck.length - 1, act: () => moveSlide(1) }, '-', { t: 'Trazer elemento para a frente', ic: '#i-layers', off: !L, act: () => orderLayer(true) }, { t: 'Enviar elemento para trás', ic: '#i-layers', off: !L, act: () => orderLayer(false) }],
    apresentar: [{ t: 'Do slide atual', ic: '#i-play', k: MOD() + 'Enter', act: present }, { t: 'Do começo', ic: '#i-replay', act: () => { STUDIO.cur = 0; present(); } }, '-', { t: STUDIO.ray ? 'Desligar o Raio Halor' : 'Ligar o Raio Halor', ic: '#i-target', k: 'R', act: () => toggleRay() }],
    ajuda: [{ t: 'Atalhos do teclado', ic: '#i-keyboard', k: '?', act: () => openModal('m-keys') }, { t: 'Guia da marca', ic: '#i-book', act: () => { location.hash = '#marca'; } }]
  }[name];
}
function present() { location.hash = '#apresentar'; }

/* ==========================================================================
   Exportar HTML interativo de verdade (um arquivo, abre offline)
   ========================================================================== */
function exportHTML() {
  const css = [];
  for (const sh of document.styleSheets) {
    let rules; try { rules = sh.cssRules; } catch (e) { continue; }
    for (const r of rules) {
      if (r.selectorText && /(^|[\s,>(])\.(slide(?![\w-])|sl-|ly(?![\w])|fx-(revelar|brilho|subir|halo))/.test(r.selectorText)) css.push(r.cssText);
      else if (r.type === 7 && /^fx(Revelar|Brilho|Subir|Halo)$/.test(r.name)) css.push(r.cssText);
    }
  }
  const sprite = document.getElementById('hl-mark')?.closest('svg')?.outerHTML || '';
  const fonts = $('link[href*="fonts.googleapis.com/css"]')?.href || '';
  const slides = STUDIO.deck.map((s, i) => { const b = el('div'); mountSlide(b, s, i + 1); return b.innerHTML; }).join('\n');
  const title = escHTML(STUDIO.title);
  const doc = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>${fonts ? `<link rel="stylesheet" href="${fonts}">` : ''}
<style>
:root{--f-display:'Sora','Helvetica Neue',Arial,sans-serif;--f-ui:'Instrument Sans','Helvetica Neue',Arial,sans-serif;--f-mono:'JetBrains Mono',ui-monospace,monospace;--ease-halo:cubic-bezier(.22,.61,.36,1)}
*{box-sizing:border-box}html,body{margin:0;height:100%;background:#07040f;color:#f4eeff;font-family:var(--f-ui)}
main{height:100%;display:grid;place-items:center;padding:2vh 2vw}
main>.slide{display:none;width:min(96vw,170vh);border-radius:10px;box-shadow:0 30px 90px -30px rgba(139,61,255,.6)}
main>.slide.on{display:block}
.hud{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);font:12px/1 var(--f-mono);letter-spacing:.06em;color:#a69cc4;background:rgba(14,8,32,.8);border:1px solid rgba(201,166,255,.2);padding:8px 12px;border-radius:99px}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
${css.join('\n')}
</style></head><body>${sprite}<main id="d">${slides}</main><p class="hud" id="hud"></p>
<script>
var S=[].slice.call(document.querySelectorAll('#d>.slide')),i=0,hud=document.getElementById('hud');
function go(n){i=Math.max(0,Math.min(S.length-1,n));S.forEach(function(s,k){s.classList.toggle('on',k===i)});var h=S[i].querySelector('.sl-h,.sl-end p');if(h){h.classList.remove('fx-subir');void h.offsetWidth;h.classList.add('fx-subir')}hud.textContent=(i+1)+' / '+S.length+'  ·  ← →  ·  F tela cheia';}
addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){e.preventDefault();go(i+1)}if(e.key==='ArrowLeft'||e.key==='PageUp')go(i-1);if(e.key==='Home')go(0);if(e.key==='End')go(S.length-1);if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()}});
document.getElementById('d').addEventListener('click',function(e){go(e.clientX>innerWidth/3?i+1:i-1)});go(0);
<\/script></body></html>`;
  saveFile(slugify(STUDIO.title) + '.html', doc, 'text/html');
}

/* Entrega um arquivo gerado. Dentro do visualizador de artifacts usa o download
   permitido pela plataforma (a pessoa confirma); fora dele, um link comum. */
async function saveFile(name, data, type) {
  const done = () => toast('HTML interativo baixado: ' + name);
  const cl = window.claude && typeof window.claude.use === 'function' ? window.claude : null;
  if (cl) {
    let dl = null;
    try { dl = await cl.use('downloads'); } catch (e) { dl = null; }
    if (dl) {
      try { await dl.save({ filename: name, data: new Blob([data], { type }) }); done(); return; }
      catch (e) {
        if (e && e.code === 'declined') return;
        if (e && e.code === 'rate_limited') { toast('Já existe um download esperando sua confirmação'); return; }
      }
    }
  }
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = el('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  done();
}

/* ==========================================================================
   Liga o editor
   ========================================================================== */
function bindEditor() {
  const canvas = $('#ed-canvas'); if (!canvas) return;
  /* modificador da plataforma nos atalhos */
  if (IS_MAC) { $$('[data-mod]').forEach(n => { n.textContent = '⌘'; }); $$('[title*="Ctrl+"]').forEach(n => { n.title = n.title.replace(/Ctrl\+/g, '⌘'); }); }
  /* tela de toque: a dica do rodapé fala em tocar, não em clicar */
  const tip = $('.ed-tip'); if (tip && TOUCH() && tip.firstChild && tip.firstChild.nodeType === 3) tip.firstChild.textContent = tip.firstChild.textContent.replace('Clique', 'Toque');
  $('#ray-toggle').addEventListener('click', () => toggleRay());
  /* abas do inspetor (com setas) */
  const inspTabs = $$('[data-insp]');
  const showInsp = t => { inspTabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; }); $$('[data-insp-panel]').forEach(p => { p.hidden = p.dataset.inspPanel !== t.dataset.insp; }); if (t.dataset.insp === 'design') syncDesign(); };
  inspTabs.forEach(t => t.addEventListener('click', () => showInsp(t)));
  rovingTabs(inspTabs[0].parentElement, showInsp);
  /* faixa de inserir */
  $$('[data-ins]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.ins;
    if (LAYER_KINDS[k]) insertLayer(k);
    else if (LAYOUTS[k]) insertSlide(k);
    else if (k === 'tpl') openPop(b, menuFill([{ h: 'Modelos com o seu kit' }, ...TPLS.map(t => ({ t: t.n, ic: '#i-grid', act: () => insertSlide(null, t.s) }))]), { label: 'Modelos' });
    else if (k === 'fx') { const t = $('[data-insp="anim"]'); showInsp(t); if (!STUDIO.sel) select('title'); $('#d-fx [aria-pressed="true"]')?.focus(); toast('Escolha a entrada do elemento selecionado'); }
  }));
  /* menus do topo */
  $$('[data-menu]').forEach(b => b.addEventListener('click', () => openPop(b, menuFill(edMenu(b.dataset.menu)), { label: b.textContent })));
  /* telas mais estreitas: os menus do topo cabem num botão só */
  $('#ed-more')?.addEventListener('click', e => openPop(e.currentTarget, menuFill(['arquivo', 'editar', 'slide', 'organizar', 'apresentar', 'ajuda'].flatMap((m, i) => [...(i ? ['-'] : []), { h: $(`[data-menu="${m}"]`).textContent }, ...edMenu(m).filter(x => x !== '-')])), { label: 'Menus do editor', align: 'right' }));
  $('#ed-undo').addEventListener('click', undo);
  $('#ed-redo').addEventListener('click', redo);
  $('#rail-new').addEventListener('click', e => openPop(e.currentTarget, menuFill([{ h: 'Escolha o layout' }, ...layoutItems()]), { label: 'Novo slide' }));
  /* título da apresentação */
  const ti = $('#ed-title');
  ti.addEventListener('change', () => { const v = ti.value.replace(/\s+/g, ' ').trim(); if (!v) { ti.value = STUDIO.title; return; } STUDIO.title = v; $('.stage-title').textContent = v; saved(); });
  ti.addEventListener('keydown', e => { if (e.key === 'Enter') ti.blur(); if (e.key === 'Escape') { ti.value = STUDIO.title; ti.blur(); } });
  /* trilho */
  const rail = $('#rail-list');
  rail.addEventListener('click', e => {
    const a = e.target.closest('[data-rail]'); if (a) { const i = +a.dataset.i; a.dataset.rail === 'dup' ? dupSlide(i) : delSlide(i); return; }
    const b = e.target.closest('.rail-th'); if (b) goSlide(+b.dataset.i, true);
  });
  rail.addEventListener('keydown', e => {
    if (!e.target.closest('.rail-th')) return;
    const fw = e.key === 'ArrowDown' || e.key === 'ArrowRight', bw = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if ((fw || bw) && e.altKey) { e.preventDefault(); moveSlide(fw ? 1 : -1); }
    else if (fw || bw) { e.preventDefault(); goSlide(STUDIO.cur + (fw ? 1 : -1), true); }
    else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); goSlide(e.key === 'Home' ? 0 : STUDIO.deck.length - 1, true); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); delSlide(); }
  });
  /* tela: selecionar, arrastar, editar */
  canvas.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const sl = $('.slide', canvas), ly = e.target.closest('.ly'), ti2 = e.target.closest('.sl-h, .sl-end p');
    const node = ly || ti2;
    if (node && node.isContentEditable) return;
    if (!node) { select(null); return; }
    const id = ly ? ly.dataset.ly : 'title'; select(id);
    const s = curSlide(); if (!ly && s.type === 'end') return;
    const R = sl.getBoundingClientRect(), r = node.getBoundingClientRect();
    const ox = (r.left - R.left) / R.width * 100, oy = (r.top - R.top) / R.height * 100, px = e.clientX, py = e.clientY;
    let moved = false, nx = ox, ny = oy; const pre = snapState();
    const mv = ev => {
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
      if (ly) { const L = selLayer(); L.x = +nx.toFixed(2); L.y = +ny.toFixed(2); } else s.st = Object.assign({}, s.st, { x: +nx.toFixed(2), y: +ny.toFixed(2) });
      renderRail(); syncDesign(); saved(); if (STUDIO.ray) placeRay();
    };
    try { node.setPointerCapture(e.pointerId); } catch (er) { /* sem captura */ }
    node.addEventListener('pointermove', mv); node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
  });
  canvas.addEventListener('dblclick', e => {
    /* a captura do ponteiro entrega o clique duplo à camada inteira: o texto é o <p> dentro dela */
    const lt = e.target.closest('.ly-text'), p = lt && $('p', lt), h = !p && e.target.closest('.sl-h, .sl-end p'); if (!p && !h) return;
    if (p) { const id = p.parentElement.dataset.ly; select(id); startEdit(p, t => { const L = curSlide().layers.find(x => x.id === id); if (L) L.t = t; }); }
    else { select('title'); startEdit(h, t => { curSlide().h = t; }); }
  });
  /* barras flutuantes */
  $('#float-bar').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const st = curSlide().st || {};
    if (b.dataset.fbC) applyStyle({ c: b.dataset.fbC });
    else if (b.dataset.fb === 'bold') applyStyle({ w: (st.w || 600) >= 700 ? 600 : 700 });
    else if (b.dataset.fb === 'italic') applyStyle({ i: !st.i });
    else if (b.dataset.fb === 'align') applyStyle({ a: { left: 'center', center: 'right', right: 'left' }[st.a || 'left'] });
  });
  $('#ly-bar').addEventListener('click', e => { const b = e.target.closest('[data-lyb]'); if (!b) return; ({ dup: dupLayer, del: delLayer, front: () => orderLayer(true), back: () => orderLayer(false) })[b.dataset.lyb](); });
  /* painel Design */
  $('#d-font').addEventListener('change', e => applyStyle({ f: e.target.value }));
  $('#d-size').addEventListener('change', e => applyStyle({ z: +e.target.value }));
  $$('#d-weight button').forEach(b => b.addEventListener('click', () => applyStyle({ w: +b.dataset.w })));
  $$('#d-colors button').forEach(b => b.addEventListener('click', () => applyStyle({ c: b.dataset.c })));
  ['#d-x', '#d-y', '#d-w', '#d-h'].forEach((q, i) => $(q).addEventListener('change', e => {
    const v = parseFloat(String(e.target.value).replace(',', '.')); if (isNaN(v)) return syncDesign();
    const pct = v / (i % 2 ? 720 : 1280) * 100, L = selLayer();
    if (L) { pushUndo(); L[['x', 'y', 'w', 'h'][i]] = +clampN(pct, i > 1 ? 2 : -50, i > 1 ? 120 : 98).toFixed(2); renderEditor(); saved(); }
    else if (STUDIO.sel === 'title' && i < 2) { const st = curSlide().st || {}; const sl = $('#ed-canvas .slide'), h = titleNode(sl), R = sl.getBoundingClientRect(), r = h.getBoundingClientRect(); applyStyle({ x: i === 0 ? pct : (st.x != null ? st.x : (r.left - R.left) / R.width * 100), y: i === 1 ? pct : (st.y != null ? st.y : (r.top - R.top) / R.height * 100) }); }
  }));
  /* painel Animação */
  $$('#d-fx button').forEach(b => b.addEventListener('click', () => {
    if (!STUDIO.sel) select('title');
    const s = curSlide(), L = selLayer(); pushUndo();
    if (L) L.fx = b.dataset.fx; else s.fx = b.dataset.fx;
    $$('#d-fx button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderRail(); saved(); playFx(b.dataset.fx);
  }));
  const dur = $('#d-dur');
  dur.addEventListener('input', () => { $('#d-dur-v').textContent = dur.value + ' ms · curva halo-out'; dur.setAttribute('aria-valuetext', dur.value + ' milissegundos'); });
  dur.addEventListener('change', () => { if (!STUDIO.sel) select('title'); const s = curSlide(), L = selLayer(); pushUndo(); if (L) L.fxd = +dur.value; else s.fxd = +dur.value; saved(); playFx((L ? L.fx : s.fx) || 'revelar'); });
  $('#d-fx-play').addEventListener('click', () => { const s = curSlide(), L = selLayer(); playFx((L ? L.fx : s.fx) || 'revelar'); });
  /* lado: menu móvel com véu */
  const side = $('#side'), scrim = $('#side-scrim'), tog = $('#side-toggle');
  const setSide = o => { side.classList.toggle('open', o); scrim.hidden = !o; tog.setAttribute('aria-expanded', String(o)); if (o) $('.side-nav a', side)?.focus(); };
  tog.addEventListener('click', () => setSide(!side.classList.contains('open')));
  scrim.addEventListener('click', () => { setSide(false); tog.focus(); });
  document.addEventListener('keydown', e => { if (!e.defaultPrevented && e.key === 'Escape' && side.classList.contains('open')) { e.preventDefault(); setSide(false); tog.focus(); } });
  document.addEventListener('halor:view', () => { scrim.hidden = true; });
  new MutationObserver(() => { if (!side.classList.contains('open')) scrim.hidden = true; }).observe(side, { attributes: true, attributeFilter: ['class'] });
  /* reposiciona a seleção quando a tela muda de tamanho ou as fontes chegam */
  if (window.ResizeObserver) new ResizeObserver(() => { placeSel(); if (STUDIO.ray) placeRay(); }).observe(canvas);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { placeSel(); syncDesign(); });
  /* atalhos do editor */
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || !studioOpen('editor') || modalOpen() || POP) return;
    const k = e.key.toLowerCase(), mod = modKey(e);
    if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); redo(); return; }
    if (typingIn(e.target)) return;
    if (mod && k === 'd') { e.preventDefault(); selLayer() ? dupLayer() : dupSlide(); return; }
    if (mod && k === 'm') { e.preventDefault(); insertSlide('text'); return; }
    if (mod && k === 'enter') { e.preventDefault(); present(); return; }
    if (mod || e.altKey) return;
    if (e.key === 'PageDown') { e.preventDefault(); goSlide(STUDIO.cur + 1); return; }
    if (e.key === 'PageUp') { e.preventDefault(); goSlide(STUDIO.cur - 1); return; }
    if (e.target.closest('#rail-list, .ribbon, .insp, .ed-top')) return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selLayer()) { e.preventDefault(); delLayer(); return; }
    if (e.key === 'Escape' && STUDIO.sel) { select(null); return; }
    const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (arrows && STUDIO.sel) { e.preventDefault(); const m = e.shiftKey ? 2.5 : .5; nudge(arrows[0] * m, arrows[1] * m); return; }
    if (k === 'r') toggleRay();
  });
  /* modais do editor */
  bindExport(); bindShare(); bindImport();
}

/* tablist com setas, Home e End (ativação automática) */
function rovingTabs(list, activate) {
  list.addEventListener('keydown', e => {
    const tabs = $$('[role="tab"]', list), i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const n = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key]; if (n == null) return;
    e.preventDefault(); const t = tabs[(n + tabs.length) % tabs.length]; t.focus(); activate(t);
  });
}

/* Salvar como */
function bindExport() {
  const opts = $$('.exp [role="radio"]'), go = $('#exp-go');
  const LABEL = { link: 'Gerar link', html: 'Baixar HTML', pptx: 'Gerar PowerPoint', 'pptx-img': 'Gerar PowerPoint', pdf: 'Gerar PDF' };
  const pickExp = b => { opts.forEach(x => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; }); go.textContent = LABEL[b.dataset.exp]; };
  opts.forEach(b => b.addEventListener('click', () => pickExp(b)));
  $('.exp').addEventListener('keydown', e => {
    const i = opts.indexOf(document.activeElement); if (i < 0) return;
    const n = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!n) return;
    e.preventDefault(); const b = opts[(i + n + opts.length) % opts.length]; b.focus(); pickExp(b);
  });
  go.addEventListener('click', () => {
    const k = $('.exp [aria-checked="true"]').dataset.exp, slug = slugify(STUDIO.title);
    closeModal($('#m-export'));
    if (k === 'html') return exportHTML();
    if (k === 'link') return copyText('https://halor.link/' + slug, null, 'Link medido criado e copiado: halor.link/' + slug);
    toast({ pptx: 'PowerPoint editável pronto: ', 'pptx-img': 'PowerPoint idêntico pronto: ', pdf: 'PDF vetorial pronto: ' }[k] + slug + (k === 'pdf' ? '.pdf' : '.pptx'));
  });
}
/* Compartilhar */
function bindShare() {
  const mail = $('#share-mail'), list = $('#share-people');
  const url = () => 'halor.link/' + slugify(STUDIO.title);
  document.addEventListener('click', e => { if (e.target.closest('[data-open="m-share"]')) $('#share-url').textContent = url(); });
  $('#share-copy').addEventListener('click', () => {
    if (!$('#share-on').checked) return toast('Ligue o link antes de copiar');
    copyText('https://' + url(), null, 'Link copiado: ' + url());
  });
  $('#share-on').addEventListener('change', e => toast(e.target.checked ? 'Link ligado. Quem tiver o endereço abre a apresentação.' : 'Link desligado. O endereço para de abrir na hora.'));
  const send = () => {
    const v = mail.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { mail.setAttribute('aria-invalid', 'true'); mail.focus(); return toast(v ? 'Confira o e-mail: falta alguma parte' : 'Digite o e-mail de quem vai receber'); }
    mail.removeAttribute('aria-invalid');
    const li = el('li'), nm = v.split('@')[0].replace(/[._-]+/g, ' ');
    const ini = nm.split(' ').filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join('') || '?';
    li.append(el('span', 'avatar av-sm av-3', ini));
    const d = el('div'); d.append(el('b', null, nm.replace(/\b\w/g, c => c.toUpperCase())), el('span', 'muted', v)); li.append(d, el('span', 'muted', $('#share-perm').value));
    li.classList.add('new'); list.appendChild(li); mail.value = '';
    toast('Convite enviado para ' + v);
  };
  $('#share-send').addEventListener('click', send);
  mail.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(); } });
  mail.addEventListener('input', () => mail.removeAttribute('aria-invalid'));
}
/* Importar */
function bindImport() {
  const q = $('#imp-queue'), drop = $('#imp-drop'), inp = $('#imp-file'); let added = 0;
  const add = files => {
    [...files].forEach(f => {
      const ok = /\.(pptx|pdf|json)$/i.test(f.name);
      const li = el('li'); li.innerHTML = '<svg aria-hidden="true"><use href="#i-file"/></svg>';
      const d = el('div'); d.appendChild(el('b', null, f.name)); const bar = el('span', 'qbar'), i = el('i', ok ? 'run' : ''); i.style.width = '0'; bar.appendChild(i); d.appendChild(bar);
      const chip = el('span', ok ? 'chip' : 'chip chip-danger', ok ? '0%' : 'Formato não aceito');
      li.append(d, chip); q.prepend(li);
      if (!ok) return;
      added++;
      const pages = 6 + Math.floor(Math.random() * 14);
      ACERVO.unshift({ t: f.name.replace(/\.[^.]+$/, ''), h: f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ') + '.', who: 'minhas', when: 'agora', score: 70 + Math.floor(Math.random() * 15), views: 0 });
      let p = 0; const step = () => { p = Math.min(100, p + (REDUCED ? 100 : 12 + Math.random() * 18)); i.style.width = p + '%'; chip.textContent = p < 100 ? Math.round(p) + '%' : 'Pronto · ' + pages + ' slides'; if (p >= 100) { i.classList.remove('run'); chip.className = 'chip chip-ok'; } else setTimeout(step, 260); };
      step();
    });
    renderHome();
  };
  inp.addEventListener('change', () => { add(inp.files); inp.value = ''; });
  ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => { if (e.dataTransfer && e.dataTransfer.files.length) add(e.dataTransfer.files); });
  $('#imp-done').addEventListener('click', () => { location.hash = '#estudio'; toast(added ? (added === 1 ? '1 arquivo novo no acervo' : added + ' arquivos novos no acervo') : '3 arquivos no acervo. O relatório da importação está pronto.'); added = 0; });
}

/* ==========================================================================
   Início: acervo, busca, modelos, sinais
   ========================================================================== */
const ACERVO = [
  { t: 'Kickoff 2027 · Time de produto', h: 'Plano 2027 em 12 semanas.', who: 'minhas', when: 'há 12 min', score: 86, views: 14, live: true, key: 'kickoff' },
  { t: 'Treinamento de líderes · Vale Verde', h: 'Liderar é dar ritmo.', who: 'minhas', when: 'ontem', score: 79, views: 9 },
  { t: 'Abertura do Summit · Atlas Energia', h: 'Energia que se vê.', who: 'time', when: 'há 2 dias', score: 91, views: 31 },
  { t: 'Status report executivo · Q3', h: 'Terceiro trimestre em uma página.', who: 'time', when: 'há 4 dias', score: 72, views: 6 },
  { t: 'Kickoff · Orion Varejo', h: 'Começamos segunda-feira.', who: 'minhas', when: 'semana passada', score: 84, views: 11 },
  { t: 'Aula aberta · Escola Aurora', h: 'Aprenda fazendo, em três rodadas.', who: 'time', when: 'semana passada', score: 88, views: 22 },
  { t: 'Rascunho antigo de workshop', h: 'Versão descartada.', who: 'lixeira', when: 'há 3 semanas', score: 41, views: 0 }
];
const TPLS = [
  { n: 'Abertura de evento', d: '8 slides', s: { type: 'cover', k: 'Evento', h: 'Sua abertura, com luz própria.', sub: 'Auditório · data' } },
  { n: 'Workshop com votação', d: '10 slides', s: { type: 'poll', k: 'Votação ao vivo', h: 'Qual frente começa primeiro?', opts: [['Design', 23], ['Dados', 14], ['Treinamento', 9], ['Eventos', 4]], code: 'W12' } },
  { n: 'Status report executivo', d: '6 slides', s: { type: 'steps', k: 'Status', h: 'Onde estamos em três frentes.', s: [['01', 'No prazo', 'Frente de conteúdo'], ['02', 'Atenção', 'Frente técnica'], ['03', 'Concluído', 'Treinamento']] } },
  { n: 'Kickoff de projeto', d: '9 slides', s: { type: 'tl', k: 'Plano', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] } },
  { n: 'Aula e treinamento', d: '10 slides', s: { type: 'text', k: 'Aula 4', h: 'Aprenda fazendo, em três rodadas.', p: ['Pergunta, votação e post-its em cada bloco.'] } },
  { n: 'Em branco', d: 'com seu kit de marca', s: { type: 'end', h: 'Comece aqui.', sub: 'Kit de marca aplicado' } }
];
const SIGNALS = [
  { r: 0, h: '<b>Grupo Aurora</b> abriu “Kickoff 2027” 3 vezes', w: 'há 12 min · Atenção' },
  { r: 1, h: 'O slide 3, Meta do trimestre, segurou o olhar por 41 s', w: 'há 40 min · Interesse' },
  { r: 2, h: '<b>Turma de líderes</b> votou 42 vezes na pergunta do slide 5', w: 'há 1 h · Curiosidade' },
  { r: 3, h: '<b>Vale Verde</b> comentou no slide 3: “Esse prazo inclui treinamento?”', w: 'há 2 h · Aproximação' },
  { r: 4, h: '<b>Grupo Aurora</b> compartilhou a apresentação com 2 pessoas', w: 'ontem · Confiança' },
  { r: 5, h: '<b>Atlas Energia</b> chamou você para apresentar de novo na terça', w: 'ontem · Parceria' }
];
const SIG_FILL = ['#c4a6ff', '#b08aff', '#9c6cff', '#8b4ffa', '#7a33eb', '#6420cc', '#4a11a0'];
const SIG_INK = ['#17112b', '#17112b', '#17112b', '#fff', '#fff', '#fff', '#fff'];

function openDeck(key, extra) {
  let deck, title, cur = 0;
  if (key === 'kickoff') { deck = DECK; title = 'Kickoff 2027 · Time de produto'; cur = STUDIO.deck === DECK ? STUDIO.cur : 0; }
  else if (key === 'new') { deck = [{ type: 'cover', k: 'Nova apresentação', h: 'Escreva aqui o seu título.', sub: 'Com o kit de marca da Norte Sistemas' }, LAYOUTS.poll.s(), LAYOUTS.end.s()]; title = 'Apresentação sem título'; }
  else if (key === 'tpl') { deck = [JSON.parse(JSON.stringify(extra.s)), LAYOUTS.text.s(), LAYOUTS.poll.s(), LAYOUTS.end.s()]; title = extra.n; }
  else if (key === 'acv') {
    const d = extra; if (d.key === 'kickoff') return openDeck('kickoff');
    d.deck = d.deck || [{ type: 'cover', k: d.t.split('·')[0].trim(), h: d.h, sub: d.t.split('·')[1] ? d.t.split('·')[1].trim() : 'Norte Sistemas' }, LAYOUTS.text.s(), LAYOUTS.poll.s(), LAYOUTS.end.s()];
    deck = d.deck; title = d.t;
  }
  STUDIO.deck = deck; STUDIO.title = title; STUDIO.cur = cur; STUDIO.stage = cur; STUDIO.sel = 'title'; STUDIO.undo = []; STUDIO.redo = [];
  const t = $('#ed-title'); if (t) t.value = title;
  $('.stage-title') && ($('.stage-title').textContent = title);
  if (location.hash === '#editor') renderEditor(); else location.hash = '#editor';
}

function renderHome() {
  const box = $('#acv'); if (!box) return;
  box.textContent = '';
  const q = fold(STUDIO.q), f = STUDIO.acv;
  let list = ACERVO.filter(d => (f === 'todas' ? d.who !== 'lixeira' : d.who === f) && (!q || fold(d.t + ' ' + d.h).includes(q)));
  const by = { indice: (a, b) => b.score - a.score, vistas: (a, b) => b.views - a.views, titulo: (a, b) => a.t.localeCompare(b.t, 'pt-BR') }[STUDIO.sort];
  if (by) list = list.slice().sort(by);
  const qb = $('#acv-q');
  if (STUDIO.q) { qb.hidden = false; $('#acv-q-t').textContent = (!list.length ? 'Nenhuma apresentação' : list.length === 1 ? '1 apresentação' : list.length + ' apresentações') + ' com “' + STUDIO.q + '”' + (f !== 'todas' ? ' nesta aba' : ''); } else qb.hidden = true;
  list.forEach(d => {
    const trash = d.who === 'lixeira';
    const a = el(trash ? 'div' : 'a', 'deck' + (trash ? ' deck-trash' : '')); if (!trash) { a.href = '#editor'; a.addEventListener('click', e => { e.preventDefault(); openDeck('acv', d); }); }
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
function clearSearch() { const s = $('#st-search'); s.value = ''; STUDIO.q = ''; renderHome(); s.focus(); }
function homeGreeting() {
  const d = new Date(), h = d.getHours();
  const g = $('#hh-greet'), dt = $('#hh-date'); if (!g) return;
  g.textContent = (h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + ', Marina.';
  try { const t = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d); dt.textContent = t.charAt(0).toUpperCase() + t.slice(1); } catch (e) { /* mantém o texto do HTML */ }
}
function bindHome() {
  homeGreeting();
  const acvTabs = $$('[data-acv]');
  const showAcv = t => { acvTabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; }); STUDIO.acv = t.dataset.acv; renderHome(); };
  acvTabs.forEach(t => t.addEventListener('click', () => showAcv(t)));
  rovingTabs(acvTabs[0].parentElement, showAcv);
  $('#acv-sort').addEventListener('change', e => { STUDIO.sort = e.target.value; renderHome(); });
  $$('[data-scroll]').forEach(b => b.addEventListener('click', () => { const t = $(b.dataset.scroll); if (!t) return; t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }); t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash'); }));
  $$('[data-deck]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openDeck(a.dataset.deck); if (a.dataset.deck === 'new') toast('Nova apresentação com o seu kit de marca'); }));
  $('[data-go="biblioteca"]')?.addEventListener('click', () => {
    location.hash = '#editor';
    setTimeout(() => { const rb = $('.ribbon'), b = $('[data-ins="kpi"]'); if (!b) return; rb.scrollLeft = Math.max(0, b.offsetLeft - 40); rb.classList.remove('rb-hint'); void rb.offsetWidth; rb.classList.add('rb-hint'); openPop(b, menuFill([{ h: 'Biblioteca: novo slide' }, ...layoutItems()]), { label: 'Biblioteca' }); }, 120);
  });
  /* busca */
  const sIn = $('#st-search');
  if (matchMedia('(max-width: 640px)').matches) sIn.placeholder = matchMedia('(max-width: 420px)').matches ? 'Buscar' : 'Buscar no acervo';
  sIn.addEventListener('input', () => {
    const was = STUDIO.q, go = sIn.value.trim() && !studioOpen('inicio');
    STUDIO.q = sIn.value.trim(); if (go) location.hash = '#estudio'; renderHome();
    /* começo de uma busca com o acervo fora da tela (celular): o resultado sobe até o olhar */
    if (STUDIO.q && !was) setTimeout(() => { const h = $('.home-main > .sec-h'); if (h && h.getBoundingClientRect().top > innerHeight * .7) h.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' }); }, go ? 80 : 0);
  });
  sIn.addEventListener('keydown', e => { if (e.key === 'Escape' && sIn.value) { e.stopPropagation(); clearSearch(); } else if (e.key === 'Enter') { const first = $('#acv a.deck'); if (first) first.focus(); } });
  $('#acv-clear').addEventListener('click', clearSearch);
  /* modelos */
  const tp = $('#tpls');
  TPLS.forEach(t => { const b = el('button', 'tpl'); b.type = 'button'; b.innerHTML = slideHTML(t.s, 1, 'halor'); const lb = el('b', null, t.n); lb.appendChild(el('small', null, t.d)); b.appendChild(lb); b.addEventListener('click', () => { openDeck('tpl', t); toast('Modelo “' + t.n + '” aberto com o seu kit de marca'); }); tp.appendChild(b); });
  /* sinais */
  const sg = $('#sig-list');
  SIGNALS.forEach(s => { const li = el('li', 'sig'), r = el('span', 'sig-ring', String(s.r + 1)); r.style.setProperty('--sw', SIG_FILL[s.r]); r.style.color = SIG_INK[s.r]; r.title = 'Passo ' + (s.r + 1) + ' da Cadeia Halor: ' + CHAIN_STEPS[s.r].n; r.setAttribute('aria-label', 'Passo ' + (s.r + 1) + ', ' + CHAIN_STEPS[s.r].n); const tx = el('div'); const p = el('p'); p.innerHTML = s.h; tx.append(p, el('small', null, s.w)); li.append(r, tx); sg.appendChild(li); });
  /* notificações */
  const bell = $('#bell');
  bell.addEventListener('click', () => openPop(bell, box => {
    box.appendChild(el('p', 'pop-h', 'Notificações'));
    SIGNALS.slice(0, 3).forEach(s => { const a = el('a', 'pop-n'); a.href = '#painel'; a.setAttribute('role', 'menuitem'); const r = el('span', 'sig-ring', String(s.r + 1)); r.style.setProperty('--sw', SIG_FILL[s.r]); r.style.color = SIG_INK[s.r]; const tx = el('span'); const p = el('span', 'pn-t'); p.innerHTML = s.h; tx.append(p, el('small', null, s.w)); a.append(r, tx); a.addEventListener('click', () => closePop(false)); box.appendChild(a); });
    const all = el('a', 'pop-all', 'Ver tudo no Painel Halor'); all.href = '#painel'; all.setAttribute('role', 'menuitem'); all.addEventListener('click', () => closePop(false)); box.appendChild(all);
    $('.badge-dot', bell)?.remove(); bell.setAttribute('aria-label', 'Notificações');
  }, { cls: 'pop-wide', align: 'right', label: 'Notificações' }));
  /* atalhos gerais do Estúdio */
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || currentView !== 'v-studio' || modalOpen()) return;
    const k = e.key.toLowerCase();
    if (modKey(e) && k === 'k') { e.preventDefault(); sIn.focus(); sIn.select(); return; }
    if (typingIn(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '?' || e.key === 'F1') { e.preventDefault(); openModal('m-keys'); return; }
    if (studioOpen('inicio') && /^[1-6]$/.test(e.key) && !POP) { const t = $(`.start[data-key="${e.key}"]`); if (t) { e.preventDefault(); t.classList.add('pressed'); setTimeout(() => t.classList.remove('pressed'), 180); t.click(); } }
  });
  renderHome();
}

/* ==========================================================================
   Administração
   ========================================================================== */
const PEOPLE = [
  { n: 'Marina Costa', m: 'marina@nortesistemas.com.br', role: 'Admin', st: 'ativo', last: 'agora', idx: 86, av: '' },
  { n: 'Rafael Lima', m: 'rafael@nortesistemas.com.br', role: 'Membro', st: 'ativo', last: 'há 1 h', idx: 81, av: 'av-2' },
  { n: 'Júlia Prado', m: 'julia@nortesistemas.com.br', role: 'Membro', st: 'ativo', last: 'ontem', idx: 77, av: 'av-3' },
  { n: 'Caio Mendes', m: 'caio@nortesistemas.com.br', role: 'Membro', st: 'convite', last: 'nunca entrou', idx: null, av: 'av-2' },
  { n: 'Beatriz Nunes', m: 'beatriz@nortesistemas.com.br', role: 'Membro', st: 'ativo', last: 'há 3 dias', idx: 69, av: 'av-3' },
  { n: 'Otávio Reis', m: 'otavio@nortesistemas.com.br', role: 'Membro', st: 'suspenso', last: 'há 2 meses', idx: 58, av: 'av-2' }
];
const AUDIT = [
  ['#i-palette', '<b>Marina Costa</b> travou o kit de marca do time', 'hoje, 09:40'],
  ['#i-download', '<b>Rafael Lima</b> baixou “Kickoff 2027” em HTML interativo', 'hoje, 08:15'],
  ['#i-present', '<b>Júlia Prado</b> apresentou “Aula aberta” para 38 pessoas', 'ontem, 19:30'],
  ['#i-lock', '<b>Otávio Reis</b> teve o acesso suspenso por Marina Costa', 'ontem, 18:02'],
  ['#i-mail', '<b>Caio Mendes</b> recebeu um convite para o time', 'ontem, 11:20'],
  ['#i-shield', 'Verificação em duas etapas ligada para todo o time', 'há 3 dias']
];
const CONFIG = [
  ['Kit de marca travado', 'Ninguém troca cores e fontes fora do kit do time.', true],
  ['Plateia vota sem cadastro', 'Quem assiste entra com o código e vota na hora.', true],
  ['Verificação em duas etapas', 'Pede um código no celular a cada novo acesso.', true],
  ['Login único da empresa', 'Entrar com a conta Google ou Microsoft do time.', false],
  ['Links medidos expiram em 90 dias', 'Depois disso o endereço para de abrir sozinho.', false]
];
const STATUS_CHIP = { ativo: ['chip-ok', 'Ativo'], convite: ['chip-line', 'Convite pendente'], suspenso: ['chip-warn', 'Suspenso'] };
function admCounts() {
  /* a tabela mostra uma amostra do time de 21 pessoas: os totais partem da base e acompanham as mudanças */
  $('#adm-n-active').textContent = 14 + PEOPLE.filter(p => p.st === 'ativo').length;
  $('#adm-n-pending').textContent = 2 + PEOPLE.filter(p => p.st === 'convite').length;
}
function admRows() {
  const tb = $('#adm-rows'); tb.textContent = '';
  const heads = ['Pessoa', 'Papel', 'Status', 'Último acesso', 'Índice médio', ''];
  PEOPLE.forEach(p => {
    const tr = el('tr');
    const who = el('td', 'td-who'); const w = el('div', 'who'); const av = el('span', 'avatar av-sm ' + p.av, p.n.split(' ').map(x => x[0]).join('')); av.setAttribute('aria-hidden', 'true'); const d = el('div'); d.append(el('b', null, p.n), el('span', null, p.m)); w.append(av, d); who.appendChild(w);
    const st = el('td'); const [cc, ct] = STATUS_CHIP[p.st]; st.appendChild(el('span', 'chip ' + cc, ct));
    const act = el('td', 'r td-act'); const b = el('button', 'btn-icon'); b.type = 'button'; b.setAttribute('aria-label', 'Ações para ' + p.n); b.setAttribute('aria-haspopup', 'menu'); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-dots"/></svg>';
    b.addEventListener('click', () => openPop(b, menuFill(admActions(p)), { align: 'right', label: 'Ações para ' + p.n })); act.appendChild(b);
    tr.append(who, el('td', null, p.role), st, el('td', null, p.last), el('td', 'r', p.idx == null ? 'sem dados' : String(p.idx)), act);
    [...tr.children].forEach((c, i) => { if (heads[i]) c.dataset.l = heads[i]; });
    tb.appendChild(tr);
  });
  admCounts(); admPending();
}
function admActions(p) {
  const me = p.n === 'Marina Costa', items = [];
  if (p.st === 'convite') items.push({ t: 'Reenviar convite', ic: '#i-mail', act: () => toast('Convite reenviado para ' + p.m) });
  if (p.st !== 'convite') items.push(p.role === 'Admin' ? { t: 'Tornar membro', ic: '#i-users', off: me, act: () => { p.role = 'Membro'; admRows(); toast(p.n + ' agora é membro'); } } : { t: 'Tornar admin do time', ic: '#i-shield', act: () => { p.role = 'Admin'; admRows(); toast(p.n + ' agora administra o time'); } });
  if (p.st === 'ativo') items.push({ t: 'Suspender acesso', ic: '#i-lock', off: me, act: () => { p.st = 'suspenso'; admRows(); toast('Acesso de ' + p.n + ' suspenso'); } });
  if (p.st === 'suspenso') items.push({ t: 'Reativar acesso', ic: '#i-check', act: () => { p.st = 'ativo'; p.last = 'agora'; admRows(); toast('Acesso de ' + p.n + ' reativado'); } });
  items.push('-', { t: p.st === 'convite' ? 'Cancelar convite' : 'Remover do time', ic: '#i-trash', danger: true, off: me, act: () => { PEOPLE.splice(PEOPLE.indexOf(p), 1); admRows(); toast(p.n + (p.st === 'convite' ? ': convite cancelado' : ' saiu do time')); } });
  if (me) items.push({ h: 'Você é a dona da conta' });
  return items;
}
function admPending() {
  const ul = $('#adm-pending'); if (!ul) return; ul.textContent = '';
  const pend = PEOPLE.filter(p => p.st === 'convite');
  if (!pend.length) { ul.appendChild(el('li', 'adm-empty', 'Nenhum convite esperando resposta.')); return; }
  pend.forEach(p => {
    const li = el('li'); const d = el('div'); d.append(el('b', null, p.m), el('span', 'muted', p.role + ' · enviado ' + (p.sent || 'ontem')));
    const b = el('button', 'btn btn-quiet btn-xs', 'Reenviar'); b.type = 'button'; b.addEventListener('click', () => toast('Convite reenviado para ' + p.m));
    li.append(d, b); ul.appendChild(li);
  });
}
let admBound = false;
function renderAdmin() {
  if (!$('#adm-rows')) return;
  if (admBound) return; admBound = true;
  admRows();
  const log = $('#adm-log'); AUDIT.forEach(([ic, t, w]) => { const li = el('li'); li.innerHTML = `<span class="al-ic"><svg aria-hidden="true"><use href="${ic}"/></svg></span>`; const d = el('div'); const p = el('p'); p.innerHTML = t; d.append(p, el('small', null, w)); li.appendChild(d); log.appendChild(li); });
  const cfg = $('#adm-cfg'); CONFIG.forEach(([n, d, on], i) => {
    const li = el('li'); const tx = el('div'); const lb = el('label', null, n); lb.htmlFor = 'cfg-' + i; tx.append(lb, el('span', 'muted', d));
    const sw = el('span', 'switch'); const inp = el('input'); inp.type = 'checkbox'; inp.id = 'cfg-' + i; inp.checked = on; inp.setAttribute('aria-describedby', 'cfg-d-' + i); tx.lastChild.id = 'cfg-d-' + i;
    inp.addEventListener('change', () => toast(n + ': ' + (inp.checked ? 'ligado' : 'desligado')));
    sw.append(inp, el('span')); li.append(tx, sw); cfg.appendChild(li);
  });
  const bars = $('#adm-bars'); [['Produto', 86, 64], ['Treinamento', 81, 92], ['Eventos', 77, 38], ['Pessoas', 72, 52]].forEach(([n, v, c]) => {
    const li = el('li'); li.append(el('span', 'ab-n', n)); const t = el('span', 'ab-t'); const i = el('i'); i.style.width = v + '%'; t.appendChild(i); li.append(t, el('b', 'num', String(v)), el('small', 'muted', c + ' apresentações')); bars.appendChild(li);
  });
  const tabs = $$('[data-adm]');
  const showAdm = t => { tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; }); $$('.adm-panel').forEach(p => { p.hidden = p.id !== 'adm-p-' + t.dataset.adm; }); };
  tabs.forEach(t => t.addEventListener('click', () => showAdm(t)));
  rovingTabs(tabs[0].parentElement, showAdm);
  $('#adm-invite-go').addEventListener('click', () => { showAdm($('[data-adm="invite"]')); $('#adm-mail').focus(); });
  const f = $('#adm-invite-f'), mail = $('#adm-mail');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const list = mail.value.split(/[,;\s]+/).map(x => x.trim()).filter(Boolean);
    const bad = list.filter(x => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x));
    if (!list.length || bad.length) { mail.setAttribute('aria-invalid', 'true'); mail.focus(); $('#adm-mail-h').textContent = list.length ? 'Confira: ' + bad.join(', ') : 'Digite pelo menos um e-mail.'; $('#adm-mail-h').classList.add('err'); return; }
    mail.removeAttribute('aria-invalid'); $('#adm-mail-h').classList.remove('err'); $('#adm-mail-h').textContent = 'Separe vários e-mails com vírgula. O convite vale por 7 dias.';
    list.forEach(m => { const n = m.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); PEOPLE.push({ n, m, role: $('#adm-role').value, st: 'convite', last: 'nunca entrou', idx: null, av: 'av-3', sent: 'agora' }); });
    mail.value = ''; admRows();
    toast(list.length === 1 ? 'Convite enviado para ' + list[0] : list.length + ' convites enviados');
  });
  mail.addEventListener('input', () => mail.removeAttribute('aria-invalid'));
}

/* ==========================================================================
   Palco
   ========================================================================== */
let clockT = 0, pulseT = 0, pollT = 0;
const ENTER_Q = ['.sl-sub', '.sl-body', '.sl-img', '.sl-big', '.sl-chart', '.sl-row', '.sl-opts', '.sl-vote', '.sl-line', '.sl-tbl', '.sl-list', '.sl-cta', '.ly'];
function entrance(sl, s) {
  if (REDUCED || !sl) return;
  const h = titleNode(sl);
  if (h) { h.style.setProperty('--fxd', (s.fxd || 900) + 'ms'); h.classList.add('fx-' + (s.fx || 'subir')); }
  let k = 0;
  ENTER_Q.forEach(q => $$(q, sl).forEach(n => {
    const L = n.classList.contains('ly') && (s.layers || []).find(x => x.id === n.dataset.ly);
    n.style.setProperty('--fxdl', (220 + k++ * 90) + 'ms'); n.style.setProperty('--fxd', ((L && L.fxd) || 700) + 'ms');
    n.classList.add(q === '.sl-line' ? 'fx-revelar' : 'fx-' + ((L && L.fx) || 'subir'));
  }));
}
function paintPoll(sl, s) {
  const raw = s.opts.reduce((a, o) => a + o[1], 0), tot = raw || 1, mx = Math.max(...s.opts.map(o => o[1]));
  $$('.sl-opt', sl).forEach((n, i) => { const p = Math.round(s.opts[i][1] / tot * 100); n.style.setProperty('--v', p + '%'); $('b', n).textContent = p + '%'; n.classList.toggle('hi', s.opts[i][1] === mx); });
  const em = $('.sl-vote em', sl); if (em) em.textContent = votesLabel(raw);
}
function renderStage() {
  const now = $('#stage-now'); if (!now) return;
  const D = STUDIO.deck; STUDIO.stage = clampN(STUDIO.stage, 0, D.length - 1);
  const i = STUDIO.stage, s = D[i];
  entrance(mountSlide(now, s, i + 1), s);
  const nx = D[i + 1];
  if (nx) mountSlide($('#stage-next'), nx, i + 2);
  else $('#stage-next').innerHTML = '<div class="stage-end"><svg aria-hidden="true"><use href="#hl-mark"/></svg><b>Fim da apresentação</b><span>Esc volta ao editor</span></div>';
  $('.stage-next .sk').textContent = nx ? 'A seguir · slide ' + (i + 2) : 'A seguir';
  $('#stage-notes').textContent = s.n || 'Sem notas para este slide.';
  $('.stage-title').textContent = STUDIO.title;
  const dots = $('#stage-dots'); dots.textContent = '';
  D.forEach((x, k) => { const b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Ir para o slide ' + (k + 1) + ': ' + plainText(x.h || x.k)); b.title = 'Slide ' + (k + 1); if (k === i) b.setAttribute('aria-current', 'true'); b.addEventListener('click', () => { STUDIO.stage = k; renderStage(); }); dots.appendChild(b); });
  $('[data-stage="-1"]').disabled = i === 0; $('[data-stage="1"]').disabled = i === D.length - 1;
  $('#stage-live').textContent = 'Slide ' + (i + 1) + ' de ' + D.length + ': ' + plainText(s.h || '');
  clearInterval(pollT);
  if (s.type === 'poll') {
    const sl = now.firstElementChild;
    if (!REDUCED) pollT = setInterval(() => {
      if (!studioOpen('apresentar')) return clearInterval(pollT);
      const w = s.opts.map((o, k) => 1 + (k === 0 ? 2.2 : 0) + o[1] / 20), sum = w.reduce((a, b) => a + b, 0);
      let r = Math.random() * sum, k = 0; while (r > w[k]) { r -= w[k]; k++; }
      s.opts[Math.min(k, s.opts.length - 1)][1]++; paintPoll(sl, s);
    }, 1100);
  }
}
function stageGo(n) { const before = STUDIO.stage; STUDIO.stage = clampN(n, 0, STUDIO.deck.length - 1); if (STUDIO.stage !== before) renderStage(); }
function startStage() {
  STUDIO.stage = STUDIO.cur;
  renderStage();
  let sec = 0;
  $('#stage-clock').textContent = '0:00';
  clearInterval(clockT); clearInterval(pulseT);
  clockT = setInterval(() => { if (!studioOpen('apresentar')) return; sec++; $('#stage-clock').textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }, 1000);
  const pts = Array.from({ length: 30 }, (_, i) => 70 + Math.sin(i / 3) * 8 + Math.random() * 6);
  const draw = () => { $('#pulse-path').setAttribute('d', 'M' + pts.map((v, i) => (i / 29 * 240).toFixed(1) + ' ' + (56 - (v - 50) / 50 * 52).toFixed(1)).join(' L')); $('#pulse-val').textContent = Math.round(pts[29]) + '%'; };
  draw();
  if (!REDUCED) pulseT = setInterval(() => { if (!studioOpen('apresentar')) return; pts.shift(); const last = pts[pts.length - 1]; pts.push(Math.max(62, Math.min(97, last + (Math.random() - .45) * 7))); draw(); }, 900);
}
function bindStage() {
  $$('[data-stage]').forEach(b => b.addEventListener('click', () => stageGo(STUDIO.stage + +b.dataset.stage)));
  const fs = () => { const s = $('[data-subview="apresentar"]'); try { if (document.fullscreenElement) document.exitFullscreen(); else s.requestFullscreen().catch(() => toast('Tela cheia indisponível aqui')); } catch (e) { toast('Tela cheia indisponível aqui'); } };
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || !studioOpen('apresentar') || modalOpen() || POP) return;
    if (typingIn(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    const onBtn = e.target.closest && e.target.closest('button, a');
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (!onBtn && (e.key === ' ' || e.key === 'Enter'))) { e.preventDefault(); stageGo(STUDIO.stage + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (!onBtn && e.key === 'Backspace')) { e.preventDefault(); stageGo(STUDIO.stage - 1); }
    else if (e.key === 'Home') { e.preventDefault(); stageGo(0); }
    else if (e.key === 'End') { e.preventDefault(); stageGo(STUDIO.deck.length - 1); }
    else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); fs(); }
    else if (e.key === 'Escape' && !document.fullscreenElement) { STUDIO.cur = STUDIO.stage; location.hash = '#editor'; }
  });
  $('#stage-fs')?.addEventListener('click', fs);
  /* clique ou toque no slide: terço da esquerda volta, o resto avança (como no HTML exportado) */
  $('.stage-now')?.addEventListener('click', e => { const r = e.currentTarget.getBoundingClientRect(); stageGo(STUDIO.stage + (e.clientX - r.left < r.width / 3 ? -1 : 1)); });
  document.addEventListener('fullscreenchange', () => { const on = !!document.fullscreenElement; const b = $('#stage-fs'); if (b) { b.setAttribute('aria-label', on ? 'Sair da tela cheia' : 'Tela cheia'); b.setAttribute('aria-pressed', String(on)); } });
  /* sair pelo botão volta ao editor no slide em que o palco parou */
  $('.stage-top a[href="#editor"]')?.addEventListener('click', () => { STUDIO.cur = STUDIO.stage; });
}

/* Prévia do produto no site e modelos no manual */
function renderPreviews() {
  const r = $('#pf-rail'); if (r) DECK.slice(0, 4).forEach((s, i) => { const d = el('div'); d.innerHTML = slideHTML(s, i + 1); if (i === 2) d.firstChild.classList.add('on'); r.appendChild(d.firstChild); });
  const c = $('#pf-canvas'); if (c) c.innerHTML = slideHTML(DECK[2], 3);
  const a = $('#apl-slides');
  if (a) [
    { type: 'cover', k: 'Modelo · capa', h: 'Faça cada olhar render.', sub: 'Halor · manual da marca' },
    { type: 'kpi', k: 'Modelo · número', h: 'Um destaque por slide.', big: '50ms', cap: 'para o cérebro julgar um visual', bars: [[41, 'Antes'], [52, 'M1'], [61, 'M2'], [68, 'M3']] },
    { type: 'poll', k: 'Modelo · votação', h: 'A plateia escolhe o rumo.', opts: [['Atenção', 21], ['Interação', 34], ['Memória', 12]], code: 'H24' }
  ].forEach((s, i) => a.insertAdjacentHTML('beforeend', slideHTML(s, i + 1, 'halor')));
}
