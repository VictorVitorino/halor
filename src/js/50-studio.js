/* ==========================================================================
   SLIDES + ESTÚDIO · um renderizador de slides usado no editor, miniaturas,
   acervo, palco, prévia do site e manual da marca
   ========================================================================== */
const DECK = [
  { type: 'cover', k: 'Kickoff · 2027', h: 'Plano 2027 em 12 semanas.', sub: 'Time de produto · 4 de novembro' },
  { type: 'text', k: 'O desafio', h: 'Muita informação, pouca atenção.', p: ['Hoje cada reunião começa com 40 slides.', 'Metade da sala desliga antes do quinto.'] },
  { type: 'kpi', k: 'Meta do trimestre', h: 'Queremos dobrar a leitura completa dos nossos materiais até março.', big: '2×', cap: 'leitura completa, de 34% para 68%', unit: '%', bars: [[34, 'Hoje'], [45, 'Mês 1'], [57, 'Mês 2'], [68, 'Mês 3']] },
  { type: 'steps', k: 'Como funciona', h: 'Três movimentos, uma cadeia.', s: [['01', 'Diagnóstico', 'Raio-x dos materiais atuais'], ['02', 'Redesenho', 'Modelos com o kit de marca'], ['03', 'Medição', 'Painel por time']] },
  { type: 'tl', k: 'Cronograma', h: 'Nove meses do primeiro olhar ao resultado.', ms: [['Mês 1', 'Diagnóstico', .1], ['Mês 3', 'Modelos no ar', .37], ['Mês 6', 'Time treinado', .63], ['Mês 9', 'Meta de ciclo', .9]] },
  { type: 'table', k: 'Recursos', h: 'Quem faz o quê.', rows: [['Estúdio Halor · 25 pessoas', '12 semanas', 'todo o time'], ['Treinamento de apresentação', '2 encontros', '4 h'], ['Dedicação total', '', '12 semanas']] },
  { type: 'next', k: 'Próximos passos', h: 'Combinamos o começo?', items: ['Validar o escopo com o time', 'Aprovar até 30 de outubro', 'Kickoff em 4 de novembro'], cta: 'Kickoff em 4 de novembro' },
  { type: 'end', h: 'Obrigado.', sub: 'marina@nortesistemas.com.br' }
];

function slideHTML(s, n, brand) {
  const foot = brand === 'halor'
    ? `<div class="sl-foot"><b><svg aria-hidden="true"><use href="${s.type === 'cover' ? '#hl-mark' : '#hl-mark-paper'}"/></svg>halor</b><span>${String(n).padStart(2, '0')}</span></div>`
    : `<div class="sl-foot"><span>Norte Sistemas · Kickoff 2027</span><span>${String(n).padStart(2, '0')}</span></div>`;
  switch (s.type) {
    case 'cover': return `<div class="slide sl-cover"><span class="sl-ring"></span><span class="sl-ring sl-ring2"></span><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><p class="sl-sub">${s.sub}</p>${foot}</div>`;
    case 'text': return `<div class="slide sl-text sl-light"><p class="sl-k">${s.k}</p><p class="sl-h" style="width:48%">${s.h}</p><div class="sl-body">${s.p.map(x => `<p class="sl-p">${x}</p>`).join('')}</div><span class="sl-img"></span>${foot}</div>`;
    case 'kpi': {
      const mx = Math.max(...s.bars.map(b => b[0]));
      return `<div class="slide sl-kpi"><p class="sl-k">${s.k}</p><p class="sl-h" data-title>${s.h}</p><div class="sl-big"><b>${s.big}</b><span>${s.cap}</span></div><div class="sl-chart">${s.bars.map((b, i) => `<i class="${i === s.bars.length - 1 ? 'hi' : ''}" style="--h:${(b[0] / mx * 92).toFixed(0)}%"><em>${b[0]}${s.unit || ' d'}</em></i>`).join('')}</div><div class="sl-axis">${s.bars.map(b => `<span>${b[1]}</span>`).join('')}</div>${foot}</div>`;
    }
    case 'steps': return `<div class="slide sl-steps sl-light"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><div class="sl-row">${s.s.map(x => `<div class="sl-step"><b>${x[0]}</b><strong>${x[1]}</strong><span class="sl-p">${x[2]}</span></div>`).join('')}</div>${foot}</div>`;
    case 'tl': return `<div class="slide sl-tl"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><span class="sl-line"></span>${s.ms.map(m => `<div class="sl-ms" style="left:${6 + m[2] * 88}%"><span>${m[1]}</span><i></i><small>${m[0]}</small></div>`).join('')}${foot}</div>`;
    case 'table': return `<div class="slide sl-table sl-light"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><table class="sl-tbl"><thead><tr><th>Item</th><th>Período</th><th>Valor</th></tr></thead><tbody>${s.rows.map((r, i) => `<tr class="${i === s.rows.length - 1 ? 'tot' : ''}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>${foot}</div>`;
    case 'next': return `<div class="slide sl-next"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><div class="sl-list">${s.items.map((x, i) => `<div><i>${i + 1}</i>${x}</div>`).join('')}</div><div class="sl-cta">${s.cta}</div>${foot}</div>`;
    case 'end': return `<div class="slide sl-end">${brand === 'halor' ? '<svg aria-hidden="true"><use href="#hl-mark"/></svg>' : ''}<p>${s.h}</p><small>${s.sub}</small></div>`;
  }
  return '';
}

/* · Estúdio · */
const STUDIO = { cur: 2, fixed: false, stage: 2 };

function renderEditor() {
  const rail = $('#rail-list'); if (!rail) return;
  rail.textContent = '';
  DECK.forEach((s, i) => {
    const li = el('li'); if (i === STUDIO.cur) li.className = 'on';
    const b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Slide ' + (i + 1) + ': ' + (s.h || s.k)); b.innerHTML = slideHTML(s, i + 1);
    b.addEventListener('click', () => { STUDIO.cur = i; renderEditor(); });
    li.appendChild(b); rail.appendChild(li);
  });
  $('#ed-canvas').innerHTML = slideHTML(DECK[STUDIO.cur], STUDIO.cur + 1);
  const isKpi = STUDIO.cur === 2;
  $('#sel-box').hidden = !isKpi; $('.float-bar').hidden = !isKpi;
  $('.ed-status .mono').textContent = 'Slide ' + (STUDIO.cur + 1) + ' de ' + DECK.length;
}

function bindEditor() {
  $('#ray-toggle')?.addEventListener('click', e => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', String(on));
    $('#ray-layer').hidden = !on;
    if (on) toast('Raio Halor: o olhar começa no título e termina no gráfico.');
  });
  $$('[data-insp]').forEach(t => t.addEventListener('click', () => {
    $$('[data-insp]').forEach(x => x.setAttribute('aria-selected', String(x === t)));
    $$('[data-insp-panel]').forEach(p => { p.hidden = p.dataset.inspPanel !== t.dataset.insp; });
  }));
  $('#fix-title')?.addEventListener('click', e => {
    DECK[2].h = 'Leitura completa em dobro.';
    renderEditor(); renderStage();
    const li = e.currentTarget.closest('li');
    li.className = 'ok'; li.querySelector('use').setAttribute('href', '#i-check');
    li.querySelector('b').textContent = 'Título com 4 palavras';
    li.querySelector('span').textContent = 'Curto o bastante para ser lido em um olhar.';
    e.currentTarget.remove();
    $('.rs-ring b').textContent = '91'; $('.rs-ring .val').style.strokeDasharray = '189 208';
    $('.rs-v').textContent = 'Muito forte. O olhar encontra a mensagem em 0,8 s.';
    toast('Sugestão aplicada. Índice do slide: 91');
  });
  $$('.kit-sw button, .fx-grid button, .seg-sm button').forEach(b => b.addEventListener('click', () => {
    $$('button', b.parentElement).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));
  $$('.exp button').forEach(b => b.addEventListener('click', () => $$('.exp button').forEach(x => x.setAttribute('aria-checked', String(x === b)))));
  $('#side-toggle')?.addEventListener('click', e => { const s = $('#side'); const o = !s.classList.contains('open'); s.classList.toggle('open', o); e.currentTarget.setAttribute('aria-expanded', String(o)); });
}

/* Acervo, modelos, sinais */
const ACERVO = [
  { t: 'Kickoff 2027 · Time de produto', h: 'Plano 2027 em 12 semanas.', who: 'minhas', when: 'há 12 min', score: 86, views: 14, live: true },
  { t: 'Treinamento de líderes · Vale Verde', h: 'Liderar é dar ritmo.', who: 'minhas', when: 'ontem', score: 79, views: 9 },
  { t: 'Pitch para investidores · série A', h: 'A atenção é o novo funil.', who: 'time', when: 'há 2 dias', score: 91, views: 31 },
  { t: 'Status report executivo · Q3', h: 'Terceiro trimestre em uma página.', who: 'time', when: 'há 4 dias', score: 72, views: 6 },
  { t: 'Kickoff · Orion Varejo', h: 'Começamos segunda-feira.', who: 'minhas', when: 'semana passada', score: 84, views: 11 },
  { t: 'Aula aberta · Atlas Energia', h: 'Energia que se vê.', who: 'time', when: 'semana passada', score: 88, views: 22 },
  { t: 'Rascunho antigo de workshop', h: 'Versão descartada.', who: 'lixeira', when: 'há 3 semanas', score: 41, views: 0 }
];
const TPLS = [
  { n: 'Abertura de evento', d: '8 slides', s: { type: 'cover', k: 'Evento', h: 'Sua abertura, com luz própria.', sub: 'Auditório · data' } },
  { n: 'Pitch de investimento', d: '12 slides', s: { type: 'kpi', k: 'Tração', h: 'Crescemos 3× em um ano.', big: '3×', cap: 'receita recorrente em 12 meses', bars: [[30, 'T1'], [48, 'T2'], [70, 'T3'], [92, 'T4']] } },
  { n: 'Status report executivo', d: '6 slides', s: { type: 'steps', k: 'Status', h: 'Onde estamos em três frentes.', s: [['01', 'No prazo', 'Frente comercial'], ['02', 'Atenção', 'Frente técnica'], ['03', 'Concluído', 'Treinamento']] } },
  { n: 'Kickoff de projeto', d: '9 slides', s: { type: 'tl', k: 'Plano', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] } },
  { n: 'Aula e treinamento', d: '10 slides', s: { type: 'text', k: 'Aula 4', h: 'Aprenda fazendo, em três rodadas.', p: ['Pergunta, votação e post-its em cada bloco.'] } },
  { n: 'Em branco', d: 'com seu kit de marca', s: { type: 'end', h: 'Comece aqui.', sub: 'Kit de marca aplicado' } }
];
const SIGNALS = [
  { r: 0, h: '<b>Grupo Aurora</b> abriu “Kickoff 2027” 3 vezes', w: 'há 12 min · Atenção' },
  { r: 4, h: '<b>Grupo Aurora</b> encaminhou a apresentação para 2 pessoas', w: 'há 40 min · Confiança' },
  { r: 1, h: 'O slide 6, Investimento, segurou o olhar por 41 s', w: 'há 1 h · Interesse' },
  { r: 3, h: '<b>Vale Verde</b> comentou no slide 3: “Esse prazo inclui treinamento?”', w: 'há 2 h · Aproximação' },
  { r: 5, h: '<b>Orion Varejo</b> marcou reunião para terça, 10h', w: 'ontem · Parceria' },
  { r: 6, h: '<b>Atlas Energia</b> aprovou o projeto', w: 'ontem · Valor' }
];
const SIG_FILL = ['#c4a6ff', '#b08aff', '#9c6cff', '#8b4ffa', '#7a33eb', '#6420cc', '#4a11a0'];
const SIG_INK = ['#17112b', '#17112b', '#17112b', '#fff', '#fff', '#fff', '#fff'];

function renderHome(filter) {
  const box = $('#acv'); if (!box) return;
  box.textContent = '';
  const list = ACERVO.filter(d => filter === 'todas' ? d.who !== 'lixeira' : d.who === filter);
  list.forEach(d => {
    const a = el('a', 'deck'); a.href = '#editor';
    const th = el('div', 'deck-th'); th.innerHTML = slideHTML({ type: 'cover', k: d.t.split('·')[0].trim(), h: d.h, sub: d.when }, 1);
    if (d.live) { const c = el('span', 'chip deck-live'); c.innerHTML = '<i class="dot dot-live"></i> sendo lida agora'; th.appendChild(c); }
    const b = el('div', 'deck-b'); b.appendChild(el('p', 'deck-t', d.t));
    const m = el('div', 'deck-m');
    const sc = el('span', 'hscore'); const C = 2 * Math.PI * 8;
    sc.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke-width="3" class="trk"/><circle cx="10" cy="10" r="8" fill="none" stroke-width="3" class="val" style="stroke-dasharray:${(d.score / 100 * C).toFixed(1)} ${C.toFixed(1)}"/></svg>`;
    sc.appendChild(document.createTextNode(String(d.score))); sc.title = 'Índice Halor';
    const vw = el('span', 'views'); vw.innerHTML = '<svg aria-hidden="true"><use href="#i-eye"/></svg>'; vw.appendChild(document.createTextNode(d.views + ' · ' + d.when));
    m.append(sc, vw); b.appendChild(m); a.append(th, b); box.appendChild(a);
  });
  if (!list.length) box.appendChild(el('p', 'muted', 'Nada por aqui.'));
}
function bindHome() {
  $$('[data-acv]').forEach(t => t.addEventListener('click', () => { $$('[data-acv]').forEach(x => x.setAttribute('aria-selected', String(x === t))); renderHome(t.dataset.acv); }));
  $$('[data-scroll]').forEach(b => b.addEventListener('click', () => $(b.dataset.scroll)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' })));
  const tp = $('#tpls');
  TPLS.forEach(t => { const b = el('button', 'tpl'); b.type = 'button'; b.innerHTML = slideHTML(t.s, 1, 'halor'); const lb = el('b', null, t.n); lb.appendChild(el('small', null, t.d)); b.appendChild(lb); b.addEventListener('click', () => { location.hash = '#editor'; toast('Modelo “' + t.n + '” aberto com o seu kit de marca'); }); tp.appendChild(b); });
  const sg = $('#sig-list');
  SIGNALS.forEach(s => { const li = el('li', 'sig'), r = el('span', 'sig-ring', String(s.r + 1)); r.style.setProperty('--sw', SIG_FILL[s.r]); r.style.color = SIG_INK[s.r]; r.title = CHAIN_STEPS[s.r].n; const tx = el('div'); const p = el('p'); p.innerHTML = s.h; tx.append(p, el('small', null, s.w)); li.append(r, tx); sg.appendChild(li); });
  renderHome('todas');
}

/* Admin */
const PEOPLE = [
  ['Marina Costa', 'marina@nortesistemas.com.br', 'Administradora', 'ativo', 'agora', 86, ''],
  ['Rafael Lima', 'rafael@nortesistemas.com.br', 'Membro', 'ativo', 'há 1 h', 81, 'av-2'],
  ['Júlia Prado', 'julia@nortesistemas.com.br', 'Membro', 'ativo', 'ontem', 77, 'av-3'],
  ['Caio Mendes', 'caio@nortesistemas.com.br', 'Membro', 'convite', 'nunca entrou', null, 'av-2'],
  ['Beatriz Nunes', 'beatriz@nortesistemas.com.br', 'Membro', 'ativo', 'há 3 dias', 69, 'av-3'],
  ['Otávio Reis', 'otavio@nortesistemas.com.br', 'Membro', 'suspenso', 'há 2 meses', 58, 'av-2']
];
function renderAdmin() {
  const tb = $('#adm-rows'); if (!tb || tb.children.length) return;
  PEOPLE.forEach(p => {
    const tr = el('tr');
    const who = el('td'); const w = el('div', 'who'); const av = el('span', 'avatar av-sm ' + p[6], p[0].split(' ').map(x => x[0]).join('')); const d = el('div'); d.append(el('b', null, p[0]), el('span', null, p[1])); w.append(av, d); who.appendChild(w);
    const st = el('td'); const chip = el('span', 'chip ' + (p[3] === 'ativo' ? 'chip-ok' : p[3] === 'convite' ? 'chip-line' : 'chip-warn'), p[3] === 'ativo' ? 'Ativo' : p[3] === 'convite' ? 'Convite pendente' : 'Suspenso'); st.appendChild(chip);
    const act = el('td', 'r'); const b = el('button', 'btn-icon'); b.type = 'button'; b.setAttribute('aria-label', 'Ações para ' + p[0]); b.innerHTML = '<svg aria-hidden="true"><use href="#i-dots"/></svg>'; b.addEventListener('click', () => toast('Promover a admin, suspender, reenviar convite ou revogar')); act.appendChild(b);
    tr.append(who, el('td', null, p[2]), st, el('td', null, p[4]), el('td', 'r', p[5] == null ? 'sem dados' : String(p[5])), act);
    tb.appendChild(tr);
  });
}

/* Palco */
let clockT = 0, pulseT = 0;
function renderStage() {
  const now = $('#stage-now'); if (!now) return;
  now.innerHTML = slideHTML(DECK[STUDIO.stage], STUDIO.stage + 1);
  const nx = DECK[STUDIO.stage + 1];
  $('#stage-next').innerHTML = nx ? slideHTML(nx, STUDIO.stage + 2) : '<p class="muted">Fim da apresentação</p>';
  $('.stage-next .sk').textContent = nx ? 'A seguir · slide ' + (STUDIO.stage + 2) : 'A seguir';
  const dots = $('#stage-dots'); dots.textContent = '';
  DECK.forEach((s, i) => { const b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Ir para o slide ' + (i + 1)); if (i === STUDIO.stage) b.setAttribute('aria-current', 'true'); b.addEventListener('click', () => { STUDIO.stage = i; renderStage(); }); dots.appendChild(b); });
}
function startStage() {
  renderStage();
  let sec = 12 * 60 + 41;
  clearInterval(clockT); clearInterval(pulseT);
  clockT = setInterval(() => { if (currentView !== 'v-studio' || $('[data-subview="apresentar"]').hidden) return; sec++; $('#stage-clock').textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }, 1000);
  const pts = Array.from({ length: 30 }, (_, i) => 70 + Math.sin(i / 3) * 8 + Math.random() * 6);
  const draw = () => { $('#pulse-path').setAttribute('d', 'M' + pts.map((v, i) => (i / 29 * 240).toFixed(1) + ' ' + (56 - (v - 50) / 50 * 52).toFixed(1)).join(' L')); $('#pulse-val').textContent = Math.round(pts[29]) + '%'; };
  draw();
  if (!REDUCED) pulseT = setInterval(() => { pts.shift(); const last = pts[pts.length - 1]; pts.push(Math.max(62, Math.min(97, last + (Math.random() - .45) * 7))); draw(); }, 900);
}
function bindStage() {
  $$('[data-stage]').forEach(b => b.addEventListener('click', () => { STUDIO.stage = Math.max(0, Math.min(DECK.length - 1, STUDIO.stage + +b.dataset.stage)); renderStage(); }));
  document.addEventListener('keydown', e => {
    if (currentView !== 'v-studio' || $('[data-subview="apresentar"]').hidden) return;
    if (e.target.closest('input, select, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { STUDIO.stage = Math.min(DECK.length - 1, STUDIO.stage + 1); renderStage(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { STUDIO.stage = Math.max(0, STUDIO.stage - 1); renderStage(); }
  });
  $('#stage-fs')?.addEventListener('click', () => { const s = $('[data-subview="apresentar"]'); try { if (document.fullscreenElement) document.exitFullscreen(); else s.requestFullscreen().catch(() => toast('Tela cheia indisponível aqui')); } catch (e) { toast('Tela cheia indisponível aqui'); } });
}

/* Prévia do produto no site e modelos no manual */
function renderPreviews() {
  const r = $('#pf-rail'); if (r) DECK.slice(0, 4).forEach((s, i) => { const d = el('div'); d.innerHTML = slideHTML(s, i + 1); if (i === 2) d.firstChild.classList.add('on'); r.appendChild(d.firstChild); });
  const c = $('#pf-canvas'); if (c) c.innerHTML = slideHTML(DECK[2], 3);
  const a = $('#apl-slides');
  if (a) [
    { type: 'cover', k: 'Modelo · capa', h: 'Faça cada olhar render.', sub: 'Halor · manual da marca' },
    { type: 'kpi', k: 'Modelo · número', h: 'Um destaque por slide.', big: '50ms', cap: 'para o cérebro julgar um visual', bars: [[41, 'Antes'], [52, 'M1'], [61, 'M2'], [68, 'M3']] },
    { type: 'steps', k: 'Modelo · processo', h: 'Atenção, interesse, valor.', s: [['01', 'Atenção', 'O olhar para'], ['02', 'Interesse', 'O olhar fica'], ['07', 'Valor', 'Quem assiste diz sim']] }
  ].forEach((s, i) => a.insertAdjacentHTML('beforeend', slideHTML(s, i + 1, 'halor')));
}
