/* ==========================================================================
   VITRINE DE EFEITOS
   Filtro por intenção, palco com 12 demos ao vivo e catálogo dos 40 efeitos.
   Cada demo é uma fábrica que devolve { start, resume, pause, replay, still }.
   start: primeira entrada na tela · resume/pause: entra e sai da tela
   replay: botão Repetir · still: quadro final para quem pede menos movimento.
   Cada demo também monta o seu editor (vtEdit): o botão Editar abre, dentro do
   card, os parâmetros do efeito, e a própria demo responde a clique e arraste.
   ========================================================================== */
const VT_INTENT = {
  abertura: 'Abrir com impacto', ritmo: 'Dar ritmo', foco: 'Focar o olhar', detalhe: 'Mostrar detalhe', relacao: 'Relacionar',
  magnitude: 'Dar peso a números', tempo: 'Contar no tempo', comparacao: 'Comparar', processo: 'Explicar processo'
};

/* [número, nome, família, intenções, dose de movimento (1 a 3), resumo] */
const VT_FX = [
  [1, 'Motion Graphics', 'Movimento', 'abertura ritmo', 3, 'Abertura de capítulo coreografada: forma, linha, título e número entram no tempo certo.'],
  [2, 'Icon Motion', 'Movimento', 'ritmo foco', 1, 'Ícones de linha que se desenham na entrada e respondem ao cursor.'],
  [3, 'Hologram 3D Cards', '3D', 'detalhe abertura', 2, 'Cards com profundidade, reflexo e brilho que seguem o cursor.'],
  [4, '3D Tilt / Perspective', '3D', 'detalhe foco', 2, 'Camadas com profundidade real que inclinam conforme o cursor.'],
  [5, 'Hover Elevation', 'Interface', 'foco detalhe', 1, 'O card sobe de nível quando recebe o cursor, numa escala de 0 a 3.'],
  [6, 'Glow / Light Sweep', 'Movimento', 'foco abertura', 2, 'O número principal ganha anel de luz e varredura. O resto fica quieto.'],
  [7, 'Glassmorphism', 'Interface', 'foco abertura', 1, 'Painel de vidro que desfoca o fundo e flutua sobre o conteúdo.'],
  [8, 'Animated Gradient', 'Movimento', 'abertura ritmo', 2, 'Capa com gradiente violeta em movimento lento, como uma luz que respira.'],
  [9, 'Parallax', '3D', 'relacao abertura', 2, 'Camadas que se movem em velocidades diferentes e criam profundidade.'],
  [10, 'Reveal / Mask Reveal', 'Movimento', 'ritmo foco', 2, 'Blocos surgem de dentro de uma máscara, um após o outro.'],
  [11, 'Animated Typography', 'Movimento', 'abertura foco', 2, 'O título entra palavra a palavra e a palavra-chave ganha um sublinhado de luz.'],
  [12, 'Counter Animation', 'Dados', 'magnitude', 1, 'Números que contam do zero ao valor final e dão peso ao resultado.'],
  [13, 'Progress Motion', 'Dados', 'magnitude tempo', 1, 'Barras e anel avançam até a nota real, com a meta marcada.'],
  [14, 'Heatmap Animation', 'Dados', 'comparacao foco', 2, 'Matriz de calor que acende da célula mais fria à mais quente.'],
  [15, 'Data Highlight', 'Dados', 'foco', 1, 'Um clique esmaece o gráfico e acende só as barras que sustentam a mensagem.'],
  [16, 'Chart Build Animation', 'Dados', 'magnitude tempo', 2, 'O gráfico se monta em etapas: barras, linha, pontos e rótulos.'],
  [17, 'BPMN Flow Motion', 'Processos', 'processo', 2, 'Um ponto de luz percorre o processo na ordem real de execução.'],
  [18, 'Connector / Flow Line', 'Processos', 'processo relacao', 2, 'Linhas se desenham entre os nós e passam a fluir. Um toque mostra as ligações.'],
  [19, 'Pulse / Beacon', 'Interface', 'foco', 1, 'Anéis que se expandem marcam onde está a atenção pendente.'],
  [20, 'Ripple Interaction', 'Interatividade', 'ritmo foco', 1, 'Uma onda nasce no ponto do clique e confirma o toque.'],
  [21, 'Flip Card', 'Interatividade', 'comparacao detalhe', 2, 'O card gira e mostra o verso: antes na frente, depois atrás.'],
  [22, 'Expandable Card', 'Interatividade', 'detalhe', 1, 'Cards fechados que se abrem para revelar o detalhe, um por vez.'],
  [23, 'Modal Focus', 'Interface', 'foco detalhe', 1, 'Um card ganha o palco: o fundo escurece e o detalhe vem para a frente.'],
  [24, 'Spotlight / Focus', 'Narrativa', 'foco', 2, 'Um foco de luz escurece o resto e conduz o olhar passo a passo.'],
  [25, 'Magnetic Button', 'Interatividade', 'ritmo', 2, 'Um botão atraído pelo cursor que volta ao lugar com mola.'],
  [26, 'Microinteractions', 'Interface', 'ritmo foco', 1, 'Respostas curtas a cada clique: alternar, marcar, salvar.'],
  [27, 'Scroll Reveal', 'Movimento', 'ritmo tempo', 1, 'Blocos entram em cena no ritmo da rolagem.'],
  [28, 'Sticky Storytelling', 'Narrativa', 'tempo foco', 2, 'O visual fica fixo e muda de fase enquanto o texto avança.'],
  [29, 'Morphing Shapes', 'Movimento', 'ritmo comparacao', 2, 'Formas que se transformam: silos viram centro, o centro vira rede.'],
  [30, 'Particle System', '3D', 'abertura relacao', 3, 'Campo de partículas ligadas que reage ao cursor. Um fundo vivo de capa.'],
  [31, 'Shimmer / Holographic Sweep', 'Movimento', 'foco abertura', 1, 'Um brilho varre o espaço até o conteúdo chegar, com selo holográfico.'],
  [32, 'Floating Elements', 'Movimento', 'abertura relacao', 2, 'Cards que flutuam em órbita ao redor de um núcleo. O cursor pausa.'],
  [33, 'Card Stack', 'Interatividade', 'detalhe ritmo', 2, 'Uma pilha de cards: o do topo sai e vai para o fundo, um por vez.'],
  [34, 'Carousel / Horizontal Gallery', 'Interatividade', 'detalhe tempo', 1, 'Galeria horizontal em que cada card encaixa no centro.'],
  [35, 'Interactive Matrix', 'Interatividade', 'comparacao foco', 1, 'Matriz 2×2 com bolhas que você arrasta entre os quadrantes.'],
  [36, 'Tooltip / Contextual Info', 'Interface', 'detalhe', 1, 'Detalhes que aparecem no lugar certo, sem poluir o slide.'],
  [37, 'Before / After Slider', 'Interatividade', 'comparacao', 1, 'Um divisor arrastável compara o antes e o depois no mesmo lugar.'],
  [38, 'Timeline Motion', 'Narrativa', 'tempo', 2, 'Linha do tempo que se desenha marco a marco, no ritmo da fala.'],
  [39, 'Node Network Motion', 'Processos', 'relacao processo', 2, 'Rede viva: toque num nó e os vizinhos acendem.'],
  [40, 'Animated Shader / Hero', '3D', 'abertura', 3, 'Capa com fundo vivo gerado em tempo real e um fio de luz atrás do título.']
];

const VT_DEMO = {};
const vtClamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const vtEase = p => 1 - Math.pow(1 - p, 3);
/* reinicia as transições CSS de um card: estado inicial sem transição, depois o final com transição */
function vtRestart(card) {
  card.classList.add('vt-reset');
  card.classList.remove('is-on');
  void card.offsetWidth;
  card.classList.remove('vt-reset');
  card.classList.add('is-on');
}
/* interpolação curta com rAF; devolve a função que cancela */
function vtTween(dur, fn, done) {
  let raf = 0; const t0 = performance.now();
  const tick = t => { const p = vtClamp((t - t0) / dur); fn(p); if (p < 1) raf = requestAnimationFrame(tick); else if (done) done(); };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/* ==========================================================================
   EDITOR POR CARD · "Editar" abre, dentro do card, os parâmetros que importam
   para aquele efeito. Tudo vale na hora; "Restaurar padrão" volta ao começo.
   vtEdit(card, controles, aplicar, { S, reset }) devolve E:
   E.S estado · E.set(k, v, quieto) · E.touch() marca mudança feita direto na demo
   E.say(texto) anuncia para leitor de tela · E.opts[k](lista) troca opções de um select
   aplicar(k, v, S, fase): fase 'init' na montagem, 'reset' ao restaurar, vazia quando a pessoa mexe.
   ========================================================================== */
/* cores de destaque das demos: violeta Halor, neon, uma quente e uma fria (ink = texto sobre a cor) */
const VT_ACC = {
  violeta: { name: 'Violeta Halor', c: '139, 61, 255', hi: '201, 166, 255', ink: '#ffffff' },
  neon: { name: 'Neon', c: '169, 112, 255', hi: '228, 212, 255', ink: '#14072b' },
  ambar: { name: 'Âmbar', c: '255, 150, 64', hi: '255, 214, 168', ink: '#1f1000' },
  ciano: { name: 'Ciano', c: '40, 196, 232', hi: '178, 238, 252', ink: '#03181e' }
};
function vtAcc(card, k) {
  const a = VT_ACC[k] || VT_ACC.violeta;
  card.style.setProperty('--acc', a.c); card.style.setProperty('--acc-hi', a.hi); card.style.setProperty('--acc-ink', a.ink);
}
const vtPct = v => Math.round(v * 100) + '%';
const vtX = v => fmtNum(+v, 1) + '×';
const vtNb = s => s.replace(/ (\S+)$/, ' $1');
/* número digitado em pt-BR ("12,8", "1.240", "−12%", "45 d") */
function vtParse(s) {
  let t = String(s).replace(/−/g, '-').replace(/[^\d,.\-]/g, '');
  if (!/\d/.test(t)) return NaN;
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  return parseFloat(t);
}
const VT_ICON_EDIT = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h8.5M18.5 7H20M4 17h1.5M11.5 17H20"/><circle cx="15.5" cy="7" r="2.5"/><circle cx="8.5" cy="17" r="2.5"/></svg>';
let vtUid = 0;

/* grupo de opções com setas (padrão radiogroup): devolve a função que marca o valor */
function vtRadios(wrap, pick) {
  const bs = $$('[role="radio"]', wrap);
  bs.forEach((b, i) => {
    b.addEventListener('click', () => pick(b.dataset.v));
    b.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
      e.preventDefault();
      const n = bs[(i + d + bs.length) % bs.length]; n.focus(); pick(n.dataset.v);
    });
  });
  return v => bs.forEach(b => { const on = b.dataset.v === String(v); b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
}

function vtEdit(card, spec, apply, opt = {}) {
  const name = $('h3', card).textContent.trim();
  const S = opt.S || {}, D = {}, show = {}, track = {};
  const E = { S, D, act: {}, opts: {}, touched: false };
  /* leitura para leitor de tela: valores e consequências das mudanças */
  const live = el('p', 'sr-only vt-live'); live.setAttribute('aria-live', 'polite'); card.append(live);
  let sayT = 0;
  E.say = t => { clearTimeout(sayT); live.textContent = ''; sayT = setTimeout(() => { live.textContent = t; }, 60); };

  const btn = el('button', 'btn btn-ghost btn-xs vt-edit'); btn.type = 'button';
  btn.innerHTML = VT_ICON_EDIT + '<span>Editar</span>';
  btn.setAttribute('aria-label', 'Editar efeito ' + name); btn.title = 'Editar efeito';
  const row = $('.vt-meta-row', card), rep = $('.vt-replay', row), acts = el('div', 'vt-acts');
  acts.append(btn); if (rep) acts.append(rep); row.append(acts);

  const panel = el('div', 'vt-ed'); panel.id = card.id + '-ed'; panel.hidden = true;
  panel.setAttribute('role', 'group'); panel.setAttribute('aria-label', 'Controles do efeito ' + name);
  btn.setAttribute('aria-controls', panel.id); btn.setAttribute('aria-expanded', 'false');
  const grid = el('div', 'vt-ed-grid'); panel.append(grid);

  const mod = () => btn.classList.toggle('is-mod', E.touched || Object.keys(D).some(k => track[k] && S[k] !== D[k]));
  const commit = (k, v) => { S[k] = v; show[k]?.(v); apply(k, v, S); mod(); };

  const mk = c => {
    const uid = 'vtc' + (++vtUid);
    const w = el('div', 'vt-c vt-ct-' + c.t + (c.wide ? ' is-wide' : ''));
    if (c.t === 'acts') {
      if (c.items.length > 1) w.classList.add('is-wide');
      c.items.forEach(a => {
        const b = el('button', 'btn btn-ghost btn-xs vt-c-act', a.label); b.type = 'button';
        if (a.motion && REDUCED) b.hidden = true;
        b.addEventListener('click', () => a.fn(b));
        if (a.id) E.act[a.id] = b;
        w.append(b);
      });
      if (c.items.every(a => a.motion) && REDUCED) w.hidden = true;
      return w;
    }
    const grp = c.t === 'acc' || c.t === 'seg';
    if (c.t === 'seg' && c.opts.length > 2) w.classList.add('is-3');
    const h = el('div', 'vt-c-h'), lab = el(grp ? 'span' : 'label', 'vt-c-l', c.label);
    lab.id = uid + 'l'; h.append(lab); w.append(h);
    const out = el('span', 'vt-c-o'); out.setAttribute('aria-hidden', 'true');
    if (c.t === 'range') {
      const i = el('input', 'vt-range vt-c-slider'); i.type = 'range'; i.id = uid; lab.htmlFor = uid;
      i.min = c.min; i.max = c.max; i.step = c.step; h.append(out); w.append(i);
      show[c.k] = v => {
        i.value = v; const t = c.fmt ? c.fmt(+v) : String(v);
        out.textContent = t; i.setAttribute('aria-valuetext', t);
        i.style.setProperty('--v', (v - c.min) / (c.max - c.min) * 100 + '%');
      };
      i.addEventListener('input', () => commit(c.k, +i.value));
    } else if (grp) {
      const g = el('div', c.t === 'acc' ? 'vt-sw' : 'vt-seg');
      g.setAttribute('role', 'radiogroup'); g.setAttribute('aria-labelledby', lab.id);
      const opts = c.t === 'acc' ? Object.entries(VT_ACC).map(([v, a]) => [v, a.name]) : c.opts;
      opts.forEach(([v, t]) => {
        const b = el('button', c.t === 'acc' ? 'vt-sw-b' : '', c.t === 'acc' ? null : t);
        b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.v = v;
        if (c.t === 'acc') { b.style.setProperty('--sw', `rgb(${VT_ACC[v].c})`); b.setAttribute('aria-label', t); b.title = t; }
        g.append(b);
      });
      const sel = vtRadios(g, v => commit(c.k, v));
      show[c.k] = sel;
      w.append(g);
    } else if (c.t === 'tog') {
      const sw = el('span', 'switch'), i = el('input');
      i.type = 'checkbox'; i.id = uid; i.setAttribute('role', 'switch'); lab.htmlFor = uid;
      sw.append(i, el('span')); w.append(sw);
      show[c.k] = v => { i.checked = !!v; };
      i.addEventListener('change', () => commit(c.k, i.checked));
    } else if (c.t === 'text' || c.t === 'num') {
      const i = el('input', 'input vt-c-in'); i.type = 'text'; i.id = uid; lab.htmlFor = uid;
      i.maxLength = c.max || 40; i.autocomplete = 'off'; i.spellcheck = false;
      if (c.t === 'num') i.inputMode = 'decimal';
      if (c.ph) i.placeholder = c.ph;
      w.append(i);
      show[c.k] = v => { if (document.activeElement !== i) i.value = c.t === 'num' ? fmtNum(+v, Number.isInteger(+v) ? 0 : 1) : v; };
      if (c.t === 'text') i.addEventListener('input', () => commit(c.k, i.value));
      else {
        let t = 0, lastV = null;
        const fire = force => {
          clearTimeout(t);
          const n = vtParse(i.value);
          if (!isFinite(n)) { i.setAttribute('aria-invalid', 'true'); return; }
          i.removeAttribute('aria-invalid');
          const v = Math.round(vtClamp(n, c.min, c.max) * 10) / 10;
          if (v === lastV && !force) return;
          lastV = v; commit(c.k, v);
        };
        i.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => fire(false), 600); });
        i.addEventListener('change', () => fire(false));
        i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); fire(true); } });
        i.addEventListener('blur', () => { i.removeAttribute('aria-invalid'); show[c.k](S[c.k]); });
      }
    } else if (c.t === 'sel') {
      const s = el('select', 'select vt-c-sel'); s.id = uid; lab.htmlFor = uid; w.append(s);
      const fill = list => { s.textContent = ''; list.forEach(([v, t]) => { const o = el('option', '', t); o.value = v; s.append(o); }); };
      fill(c.opts);
      E.opts[c.k] = list => { fill(list); s.value = S[c.k]; };
      show[c.k] = v => { s.value = v; };
      s.addEventListener('change', () => commit(c.k, s.value));
    } else if (c.t === 'add') {
      w.classList.add('is-wide');
      const r = el('div', 'vt-c-add'), i = el('input', 'input vt-c-in');
      i.type = 'text'; i.id = uid; lab.htmlFor = uid; i.maxLength = c.max || 16; i.placeholder = c.ph || ''; i.autocomplete = 'off';
      const b = el('button', 'btn btn-ghost btn-xs vt-c-act', c.btn || 'Adicionar'); b.type = 'button';
      const go = () => { const v = i.value.trim(); if (!v) { i.focus(); return; } if (c.fn(v) !== false) i.value = ''; };
      b.addEventListener('click', go);
      i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
      r.append(i, b); w.append(r);
    }
    return w;
  };

  spec.forEach(c => { if (c.k && 'v' in c) { S[c.k] = D[c.k] = c.v; track[c.k] = c.track !== false; } });
  spec.forEach(c => grid.append(mk(c)));

  const foot = el('div', 'vt-ed-foot');
  const rst = el('button', 'btn btn-quiet btn-xs vt-ed-reset'); rst.type = 'button';
  rst.innerHTML = '<svg aria-hidden="true"><use href="#i-restore"/></svg>Restaurar padrão';
  const how = $('.vt-how', card);
  foot.append(rst, el('p', 'vt-ed-tip', how ? how.textContent.trim() : 'As mudanças valem na hora'));
  panel.append(foot);
  $('h3', card).after(panel);

  E.touch = () => { E.touched = true; mod(); };
  E.set = (k, v, quiet) => { S[k] = v; show[k]?.(v); if (!quiet) apply(k, v, S); mod(); };
  E.reset = () => {
    E.touched = false;
    Object.keys(D).forEach(k => { S[k] = D[k]; show[k]?.(D[k]); });
    opt.reset?.();
    Object.keys(D).forEach(k => apply(k, D[k], S, 'reset'));
    mod(); E.say('Efeito de volta ao padrão.');
  };
  const open = on => { panel.hidden = !on; btn.setAttribute('aria-expanded', String(on)); card.classList.toggle('is-edit', on); };
  btn.addEventListener('click', () => open(panel.hidden));
  /* Esc recolhe os controles (dentro da prévia, Esc fecha a própria prévia) */
  panel.addEventListener('keydown', e => { if (e.key === 'Escape' && !card.closest('.modal')) { e.preventDefault(); open(false); btn.focus(); } });
  E.open = open;
  rst.addEventListener('click', E.reset);

  Object.keys(D).forEach(k => { show[k]?.(D[k]); });
  Object.keys(D).forEach(k => apply(k, D[k], S, 'init'));
  return E;
}

function bootVitrine() {
  const sec = document.getElementById('vitrine');
  if (!sec || sec.dataset.vtBoot) return;
  sec.dataset.vtBoot = '1';
  /* a seção pertence ao site: se ficou fora da view, entra no main antes dos planos */
  if (!sec.closest('.view')) {
    const main = document.querySelector('#v-site main');
    if (main) main.insertBefore(sec, main.querySelector(':scope > #planos') || main.querySelector(':scope > .s-final'));
  }
  sec.classList.add('vt-ready');
  if (REDUCED) sec.classList.add('vt-reduced');
  const live = {};
  $$('.vt-card', sec).forEach(c => c.dataset.fx.split(' ').forEach(n => { live[n] = c; }));
  const preview = vtPreview();
  vtCatalog(sec, live, preview);
  vtFilter(sec);
  vtDemos(sec);
}

/* · Catálogo · */
function vtCatalog(sec, live, preview) {
  const ul = $('#vt-cat', sec);
  VT_FX.forEach(([n, name, fam, ints, dose, sum]) => {
    const li = el('li'); li.dataset.intents = ints;
    const card = live[n];
    const pv = !card && preview && VT_PREV[n];
    const it = el(card || pv ? 'button' : 'div', 'vt-item');
    const top = el('div', 'vt-item-top');
    top.append(el('span', 'vt-item-n', String(n).padStart(2, '0')), el('span', 'vt-item-c', fam));
    if (card) top.append(el('span', 'vt-live', 'Ao vivo'));
    else if (pv) top.append(el('span', 'vt-pvchip', 'Prévia'));
    const d = el('span', 'vt-dose');
    d.setAttribute('role', 'img'); d.setAttribute('aria-label', `Dose de movimento ${dose} de 3`);
    for (let i = 1; i <= 3; i++) d.append(el('i', i <= dose ? 'on' : ''));
    top.append(d);
    it.append(top, el('p', 'vt-item-t', name), el('p', 'vt-item-s', sum));
    if (card) {
      it.type = 'button';
      it.append(el('span', 'sr-only', 'Ir para a demonstração ao vivo.'));
      it.addEventListener('click', () => {
        card.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
        card.setAttribute('tabindex', '-1');
        card.focus({ preventScroll: true });
        card.classList.remove('is-ping'); void card.offsetWidth; card.classList.add('is-ping');
        clearTimeout(card._ping); card._ping = setTimeout(() => card.classList.remove('is-ping'), 1800);
      });
    }
    if (pv) {
      it.type = 'button';
      it.append(el('span', 'sr-only', 'Abrir prévia interativa.'));
      it.addEventListener('click', () => preview(n));
    }
    li.append(it); ul.append(li);
  });
  /* só 8 à mostra; a pílula + leva para a escolha do plano */
  const plus = el('a', 'vt-plus-pill'); plus.href = '#assinar';
  plus.innerHTML = '<span aria-hidden="true">+</span><b>32 efeitos</b>';
  ul.after(plus);
}

/* · Filtro por intenção (vale para o palco e para o catálogo) · */
function vtFilter(sec) {
  const chips = $$('.vt-chip', sec), wrap = $('#vt-chips', sec), stage = $('#vt-stage', sec);
  const cards = $$('.vt-card', sec), items = $$('#vt-cat li', sec);
  const empty = $('#vt-empty', sec), count = $('#vt-count', sec), status = $('#vt-status', sec);
  const more = $('#vt-more', sec);
  const SHOW = 8, plusP = $('.vt-plus-pill', sec), plusT = $('b', plusP);
  more.hidden = true;
  const moreSync = n => { plusP.hidden = n <= SHOW; plusT.textContent = `${n - SHOW} efeitos`; plusP.setAttribute('aria-label', `Mais ${n - SHOW} efeitos: escolha um plano para liberar todos`); };
  /* o pulo de entrada só vale quando a pessoa troca o filtro (a entrada ao rolar é do revelar do site) */
  let first = true;
  const pop = n => { if (REDUCED || first) return; n.classList.remove('is-in'); void n.offsetWidth; n.classList.add('is-in'); };
  const apply = k => {
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.intent === k)));
    const ok = n => k === 'todos' || n.dataset.intents.split(' ').includes(k);
    let nd = 0, ni = 0;
    cards.forEach(c => { const s = ok(c); c.hidden = !s; if (s) { nd++; pop(c); } });
    let shown = 0;
    items.forEach(li => { const s = ok(li); if (s) ni++; const v = s && shown < SHOW; li.hidden = !v; if (v) { shown++; pop(li); } });
    stage.classList.toggle('is-filtered', k !== 'todos');
    stage.hidden = nd === 0;
    empty.hidden = nd !== 0;
    if (!nd) empty.textContent = `Para ${VT_INTENT[k].toLowerCase()}, os efeitos estão no catálogo logo abaixo.`;
    count.textContent = `${Math.min(ni, SHOW)} de ${ni}`;
    moreSync(ni);
    status.textContent = k === 'todos' ? `Todos os efeitos: ${ni} no catálogo, ${nd} ao vivo.` : `${VT_INTENT[k]}: ${ni} efeitos no catálogo, ${nd} ao vivo.`;
  };
  chips.forEach(c => c.addEventListener('click', () => { if (c.getAttribute('aria-pressed') !== 'true') apply(c.dataset.intent); }));
  const edge = () => wrap.classList.toggle('at-end', wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
  wrap.addEventListener('scroll', edge, { passive: true });
  window.addEventListener('resize', edge, { passive: true });
  edge();
  apply('todos');
  first = false;
}

/* · Palco: liga cada demo à tela · */
function vtDemos(sec) {
  const ctl = new Map();
  $$('.vt-card', sec).forEach(card => {
    const make = VT_DEMO[card.dataset.demo];
    const d = (make && make(card)) || {};
    ctl.set(card, d);
    if (REDUCED) { card.classList.add('is-on', 'is-vis'); d.still?.(); return; }
    $('.vt-replay', card)?.addEventListener('click', () => {
      vtRestart(card);
      d.replay ? d.replay() : d.start?.();
    });
  });
  if (REDUCED) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    const card = e.target, d = ctl.get(card);
    card.classList.toggle('is-vis', e.isIntersecting);
    if (e.isIntersecting && e.intersectionRatio >= .3 && !card.classList.contains('is-on')) { card.classList.add('is-on'); d.start?.(); }
    if (e.isIntersecting) { if (card.classList.contains('is-on')) d.resume?.(); }
    else d.pause?.();
  }), { threshold: [0, .3] });
  ctl.forEach((d, card) => io.observe(card));
}

/* ---------------------------------------------------------------- 30 · Particle System */
VT_DEMO.particle = card => {
  const box = $('.vt-pa', card), cv = $('canvas', box), ctx = cv.getContext('2d'), title = $('.vt-pa-t', box);
  const S = {};
  let W = 0, H = 0, P = [], pulses = [], running = false, raf = 0, last = 0, col = VT_ACC.violeta;
  const m = { x: 0, y: 0, on: false };
  const size = () => {
    const r = box.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sx = W ? r.width / W : 1, sy = H ? r.height / H : 1;
    P.forEach(p => { p.x *= sx; p.y *= sy; });
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  };
  const want = () => Math.round(vtClamp(W * H / 3600 * (S.dens || 1), 16, 260));
  const one = () => ({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, bx: (Math.random() - .5) * .34, by: (Math.random() - .5) * .34, r: .7 + Math.random() * 1.7 });
  const seed = burst => {
    P = Array.from({ length: want() }, () => {
      const p = one();
      if (burst) { const tx = p.x, ty = p.y; p.x = W / 2 + (Math.random() - .5) * 10; p.y = H / 2 + (Math.random() - .5) * 10; p.vx = (tx - p.x) * .05; p.vy = (ty - p.y) * .05; }
      return p;
    });
  };
  /* densidade nova: entram ou saem partículas sem reiniciar o campo */
  const fit = () => { if (!W) return; const n = want(); while (P.length < n) P.push(one()); P.length = n; };
  const pulse = (x, y) => { if (REDUCED) return; pulses.push({ x, y, t: 0 }); if (!running) draw(); };
  const step = dt => {
    const sp = S.speed || 1, k = dt / 16.67 * sp, fr = Math.pow(.95, k), R = 120, pull = S.mode === 'atrai';
    pulses.forEach(q => { q.t += dt * Math.sqrt(sp) / 1100; });
    pulses = pulses.filter(q => q.t < 1);
    const maxR = Math.hypot(W, H) * .6;
    for (const p of P) {
      if (m.on) {
        const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 1) {
          const d = Math.sqrt(d2), fall = 1 - d / R;
          if (pull) { const f = fall * .42 * k; p.vx -= dx / d * f; p.vy -= dy / d * f; p.vx += -dy / d * fall * .3 * k; p.vy += dx / d * fall * .3 * k; }
          else { const f = fall * .9 * k; p.vx += dx / d * f; p.vy += dy / d * f; }
        }
      }
      for (const q of pulses) {
        const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1, band = Math.abs(d - q.t * maxR);
        if (band < 36) { const f = (1 - band / 36) * 1.6 * (1 - q.t) * k; p.vx += dx / d * f; p.vy += dy / d * f; }
      }
      p.vx *= fr; p.vy *= fr;
      p.x += (p.vx + p.bx) * k; p.y += (p.vy + p.by) * k;
      if (p.x < -12) p.x = W + 12; else if (p.x > W + 12) p.x = -12;
      if (p.y < -12) p.y = H + 12; else if (p.y > H + 12) p.y = -12;
    }
  };
  const draw = () => {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    if (S.links !== false) {
      const L = vtClamp(W / 7, 80, 128), L2 = L * L, B = [[], [], [], []];
      for (let i = 0; i < P.length; i++) {
        const a = P[i];
        for (let j = i + 1; j < P.length; j++) {
          const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < L2) B[Math.min(3, Math.floor((1 - d2 / L2) * 4))].push(a.x, a.y, b.x, b.y);
        }
      }
      ctx.lineWidth = 1;
      B.forEach((s, bi) => {
        if (!s.length) return;
        ctx.strokeStyle = `rgba(${col.c}, ${.1 + bi * .14})`;
        ctx.beginPath();
        for (let i = 0; i < s.length; i += 4) { ctx.moveTo(s[i], s[i + 1]); ctx.lineTo(s[i + 2], s[i + 3]); }
        ctx.stroke();
      });
    }
    if (m.on) {
      ctx.beginPath();
      for (const p of P) { const d = Math.hypot(p.x - m.x, p.y - m.y); if (d < 170) { ctx.moveTo(m.x, m.y); ctx.lineTo(p.x, p.y); } }
      ctx.strokeStyle = 'rgba(244, 238, 255, .16)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(m.x, m.y, 118, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${col.hi}, .24)`; ctx.lineWidth = 1.5; ctx.stroke();
    }
    for (const p of P) {
      if (p.r > 2) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fillStyle = `rgba(${col.c}, .24)`; ctx.fill(); }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.r > 1.9 ? '#ffffff' : `rgba(${col.hi}, .88)`; ctx.fill();
    }
    for (const q of pulses) {
      ctx.beginPath(); ctx.arc(q.x, q.y, q.t * Math.hypot(W, H) * .6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${col.hi}, ${(1 - q.t) * .75})`; ctx.lineWidth = 2; ctx.stroke();
    }
  };
  const frame = t => {
    if (!running) return;
    const dt = Math.min(48, last ? t - last : 16.67); last = t;
    step(dt); draw();
    raf = requestAnimationFrame(frame);
  };
  const resume = () => { if (running || REDUCED || !W) return; running = true; last = 0; raf = requestAnimationFrame(frame); };
  const pause = () => { running = false; cancelAnimationFrame(raf); };
  const at = e => { const r = box.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
  box.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; at(e); m.on = true; });
  box.addEventListener('pointerleave', () => { m.on = false; });
  box.addEventListener('pointerdown', e => { at(e); pulse(m.x, m.y); });
  box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pulse(W / 2, H / 2); } });
  new ResizeObserver(() => { if (!P.length) return; if (size()) { if (!running) draw(); } }).observe(box);
  vtEdit(card, [
    { k: 'dens', t: 'range', label: 'Densidade', min: .4, max: 2, step: .1, v: 1, fmt: vtPct },
    { k: 'speed', t: 'range', label: 'Velocidade', min: .2, max: 2.5, step: .1, v: 1, fmt: vtX },
    { k: 'acc', t: 'acc', label: 'Cor', v: 'violeta' },
    { k: 'mode', t: 'seg', label: 'Cursor', opts: [['repele', 'Afasta'], ['atrai', 'Atrai']], v: 'repele' },
    { k: 'links', t: 'tog', label: 'Ligações', v: true },
    { t: 'acts', items: [{ label: 'Soltar pulso', motion: true, fn: () => pulse(W / 2, H / 2) }] },
    { k: 'title', t: 'text', label: 'Título da capa', v: 'A virada começa aqui.', max: 44, wide: true }
  ], (k, v) => {
    if (k === 'acc') { col = VT_ACC[v]; vtAcc(card, v); }
    if (k === 'dens') fit();
    if (k === 'title') title.textContent = vtNb(v.trim()) || ' ';
    if (!running && P.length) draw();
  }, { S });
  return {
    start() { if (!size()) return; seed(true); resume(); },
    resume, pause,
    replay() { pulses = []; seed(true); pulse(W / 2, H / 2); resume(); },
    still() { if (!size()) return; seed(false); draw(); }
  };
};

/* ---------------------------------------------------------------- 03 · 04 · Tilt / Hologram */
VT_DEMO.tilt = card => {
  const box = $('.vt-ti', card), c = $('.vt-ti-card', box), big = $('.vt-ti-l2 b', c);
  const S = {};
  let tx = 0, ty = 0, rx = 0, ry = 0, mx = 50, my = 50, tmx = 50, tmy = 50, manual = false, running = false, raf = 0, t0 = performance.now(), hold = 0, ft = 0;
  const MAX = () => S.max || 16;
  const apply = () => {
    c.style.setProperty('--rx', rx.toFixed(2) + 'deg'); c.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    c.style.setProperty('--mx', mx.toFixed(1) + '%'); c.style.setProperty('--my', my.toFixed(1) + '%');
  };
  const frame = t => {
    if (!running) return;
    if (!manual) {
      if (S.auto) {
        const s = (t - t0) / 1000, a = MAX() / 16;
        ty = Math.sin(s * .8) * 11 * a; tx = Math.cos(s * .6) * 6 * a;
      } else { tx = ty = 0; }
      tmx = 50 + ty * 3.2; tmy = 50 - tx * 3.2;
    }
    rx += (tx - rx) * .09; ry += (ty - ry) * .09; mx += (tmx - mx) * .09; my += (tmy - my) * .09;
    apply();
    raf = requestAnimationFrame(frame);
  };
  box.addEventListener('pointermove', e => {
    if (REDUCED) return;
    const r = c.getBoundingClientRect(), M = MAX();
    const px = vtClamp((e.clientX - r.left) / r.width, -.15, 1.15), py = vtClamp((e.clientY - r.top) / r.height, -.15, 1.15);
    manual = true; clearTimeout(hold);
    ty = vtClamp((px - .5) * 2 * M, -M, M); tx = vtClamp(-(py - .5) * 2 * M, -M, M);
    tmx = px * 100; tmy = py * 100;
  });
  box.addEventListener('pointerleave', () => { tx = ty = 0; tmx = tmy = 50; hold = setTimeout(() => { manual = false; t0 = performance.now(); }, 900); });
  /* clique ou Enter: um reflexo holográfico varre o cartão */
  const flash = () => {
    c.classList.remove('is-flash'); void c.offsetWidth; c.classList.add('is-flash');
    clearTimeout(ft); ft = setTimeout(() => c.classList.remove('is-flash'), 1000);
  };
  c.addEventListener('click', flash);
  c.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flash(); return; }
    const k = { ArrowLeft: [0, -5], ArrowRight: [0, 5], ArrowUp: [5, 0], ArrowDown: [-5, 0] }[e.key];
    if (!k || REDUCED) return;
    e.preventDefault(); manual = true; clearTimeout(hold);
    const M = MAX();
    tx = vtClamp(tx + k[0], -M, M); ty = vtClamp(ty + k[1], -M, M);
    tmx = 50 + ty * 3; tmy = 50 - tx * 3;
    hold = setTimeout(() => { manual = false; t0 = performance.now(); }, 2500);
  });
  const label = () => c.setAttribute('aria-label', `Cartão holográfico com a marca do cliente: ${S.val.trim() || '+38%'} de crescimento no ano. Ele inclina com o cursor; setas inclinam e Enter solta um reflexo.`);
  vtEdit(card, [
    { k: 'max', t: 'range', label: 'Inclinação', min: 4, max: 28, step: 1, v: 16, fmt: v => v + '°' },
    { k: 'sheen', t: 'range', label: 'Reflexo', min: 0, max: 1.6, step: .1, v: 1, fmt: vtPct },
    { k: 'depth', t: 'range', label: 'Profundidade', min: 0, max: 2, step: .1, v: 1, fmt: vtPct },
    { k: 'acc', t: 'acc', label: 'Cor', v: 'violeta' },
    { k: 'val', t: 'text', label: 'Número do cartão', v: '+38%', max: 7 },
    { k: 'auto', t: 'tog', label: 'Balanço sozinho', v: true }
  ], (k, v) => {
    if (k === 'sheen') c.style.setProperty('--sheen', v);
    if (k === 'depth') c.style.setProperty('--dz', v);
    if (k === 'acc') vtAcc(card, v);
    if (k === 'val') { big.textContent = v.trim() || ' '; label(); }
    if (k === 'max' && REDUCED) { rx = 6 * v / 16; ry = -12 * v / 16; apply(); }
  }, { S });
  const resume = () => { if (running || REDUCED) return; running = true; raf = requestAnimationFrame(frame); };
  const pause = () => { running = false; cancelAnimationFrame(raf); };
  return {
    start: resume, resume, pause,
    replay() { manual = false; t0 = performance.now(); ry = -38; rx = 10; resume(); },
    still() { rx = 6; ry = -12; mx = 30; my = 30; apply(); }
  };
};

/* ---------------------------------------------------------------- 11 · Animated Typography */
VT_DEMO.type = card => {
  const box = $('.vt-ty', card), h = $('.vt-ty-h', box), sr = $('.vt-ty-in .sr-only', box);
  const S = {};
  let rt = 0, E = null;
  const norm = w => w.toLowerCase().replace(/[^\p{L}\p{N}%]/gu, '');
  const words = () => (S.text || '').trim().split(/\s+/).filter(Boolean);
  const render = () => {
    const ws = words(), ki = S.key ? ws.findIndex(w => norm(w) === S.key) : -1;
    h.textContent = '';
    ws.forEach((w, i) => {
      const s = el('span', 'w', w);
      s.style.setProperty('--i', i); s.dataset.n = norm(w);
      if (/\d/.test(w)) s.classList.add('vt-ty-n');
      if (i === ki) s.classList.add('vt-ty-u');
      h.append(s, document.createTextNode(' '));
    });
    h.style.setProperty('--n', ws.length);
    h.style.setProperty('--fit', Math.min(1, Math.sqrt(46 / Math.max((S.text || '').length, 1))).toFixed(3));
    sr.textContent = (S.text || '').trim();
  };
  const keys = () => {
    const seen = new Set(), o = [['', 'Nenhuma']];
    words().forEach(w => { const n = norm(w); if (n && !seen.has(n)) { seen.add(n); o.push([n, w.replace(/[.,;:!?]+$/, '')]); } });
    return o;
  };
  /* a frase entra de novo para mostrar a mudança (no teclado, espera a pessoa parar de digitar) */
  const replay = delay => {
    if (REDUCED || !card.classList.contains('is-on')) return;
    clearTimeout(rt); rt = setTimeout(() => vtRestart(card), delay);
  };
  h.addEventListener('click', e => {
    const w = e.target.closest('.w'); if (!w || !E) return;
    const n = S.key === w.dataset.n ? '' : w.dataset.n;
    E.set('key', n);
    E.say(n ? `Palavra em destaque: ${w.textContent.replace(/[.,;:!?]+$/, '')}.` : 'Sem palavra em destaque.');
  });
  E = vtEdit(card, [
    { k: 'text', t: 'text', label: 'Frase', v: 'Receita recorrente cresceu 38% em doze meses.', max: 70, wide: true },
    { k: 'key', t: 'sel', label: 'Palavra em destaque', opts: [], v: 'cresceu' },
    { k: 'style', t: 'seg', label: 'Entrada', opts: [['sobe', 'Subir'], ['foco', 'Foco'], ['escala', 'Escala']], v: 'sobe' },
    { k: 'speed', t: 'range', label: 'Ritmo', min: .4, max: 2.5, step: .1, v: 1, fmt: vtX },
    { k: 'acc', t: 'acc', label: 'Cor', v: 'violeta' }
  ], (k, v, s, phase) => {
    if (k === 'text' || k === 'key') render();
    if (k === 'text' && E) {
      E.opts.key(keys());
      if (S.key && !words().some(w => norm(w) === S.key)) { E.set('key', '', true); render(); }
    }
    if (k === 'style') box.dataset.style = v;
    if (k === 'speed') box.style.setProperty('--sp', v);
    if (k === 'acc') vtAcc(card, v);
    if (!phase) replay(k === 'text' ? 700 : k === 'speed' ? 350 : 0);
  }, { S });
  E.opts.key(keys());
  return {};
};

/* ---------------------------------------------------------------- 12 · Counter Animation */
VT_DEMO.count = card => {
  const tiles = $$('.vt-co-tile', card), vals = tiles.map(t => $('.vt-co-v', t)), bars = tiles.map(t => $('.vt-co-bar', t));
  const MT = [
    { k: 'Receita no ano', v: 12.8, dec: 1, pre: 'R$ ', suf: ' mi', w: .86 },
    { k: 'Crescimento', v: 38, dec: 0, pre: '+', suf: '%', w: .64, sign: true },
    { k: 'Novos clientes', v: 1240, dec: 0, pre: '', suf: '', w: 1 }
  ];
  MT.forEach(m => { m.ref = m.v / m.w; });
  const S = {}, cur = [0, 0, 0], jobs = new Map();
  let raf = 0, E = null;
  const target = i => +S['v' + i];
  const text = (i, v) => {
    const m = MT[i], d = Number.isInteger(target(i)) ? m.dec : Math.max(m.dec, 1);
    const n = Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
    return (m.sign ? (v < 0 ? '−' : '+') : (v < 0 ? '−' : '') + m.pre) + n + m.suf;
  };
  const paint = i => { vals[i].textContent = text(i, cur[i]); bars[i].style.setProperty('--p', vtClamp(Math.abs(cur[i]) / MT[i].ref).toFixed(3)); };
  const label = i => tiles[i].setAttribute('aria-label', `${MT[i].k}: ${text(i, target(i))}. Clique para contar de novo.`);
  const EASE = {
    suave: p => 1 - Math.pow(2, -10 * p),
    linear: p => p,
    mola: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }
  };
  const tick = t => {
    let busy = false;
    jobs.forEach((j, i) => {
      const p = vtClamp((t - j.t0 - j.delay) / ((S.dur || 1.8) * 1000));
      cur[i] = j.a + (j.b - j.a) * (p >= 1 ? 1 : EASE[S.ease || 'suave'](p)); paint(i);
      if (p < 1) busy = true;
      else { jobs.delete(i); label(i); if (j.say && E) E.say(`${MT[i].k}: ${text(i, cur[i])}.`); }
    });
    raf = busy ? requestAnimationFrame(tick) : 0;
  };
  /* conta de onde está (ou do zero) até o alvo atual */
  const go = (i, from, delay = 0, say = false) => {
    if (REDUCED) { cur[i] = target(i); paint(i); label(i); if (say && E) E.say(`${MT[i].k}: ${text(i, cur[i])}.`); return; }
    jobs.set(i, { a: from == null ? cur[i] : from, b: target(i), t0: performance.now(), delay, say });
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const run = () => MT.forEach((_, i) => go(i, 0, 250 + i * 180));
  tiles.forEach((t, i) => t.addEventListener('click', () => go(i, 0, 0, true)));
  E = vtEdit(card, [
    { k: 'v0', t: 'num', label: 'Receita (R$ mi)', v: 12.8, min: 0, max: 9999 },
    { k: 'v1', t: 'num', label: 'Crescimento (%)', v: 38, min: -99, max: 9999 },
    { k: 'v2', t: 'num', label: 'Novos clientes', v: 1240, min: 0, max: 9999999 },
    { k: 'dur', t: 'range', label: 'Duração', min: .4, max: 4, step: .1, v: 1.8, fmt: v => fmtNum(v, 1) + ' s' },
    { k: 'ease', t: 'seg', label: 'Curva', opts: [['suave', 'Suave'], ['linear', 'Linear'], ['mola', 'Mola']], v: 'suave' },
    { k: 'acc', t: 'acc', label: 'Cor', v: 'violeta' }
  ], (k, v, s, phase) => {
    if (k === 'acc') vtAcc(card, v);
    if (/^v\d$/.test(k)) {
      const i = +k[1];
      if (phase === 'init') { cur[i] = REDUCED ? v : 0; paint(i); label(i); }
      else go(i, null, 0, true);
    }
  }, { S });
  return { start: run, replay: run, still: () => MT.forEach((_, i) => { cur[i] = target(i); paint(i); }) };
};

/* ---------------------------------------------------------------- 06 · Glow / Light Sweep */
VT_DEMO.glow = card => {
  const box = $('.vt-gl', card), main = $('.vt-gl-main', box), inner = $('.vt-gl-in', main);
  const mk = $('.vt-gl-k', main), mv = $('.vt-gl-v', main), md = $('.vt-gl-d', main), sides = $$('.vt-gl-s', box);
  const K0 = [
    { k: 'Margem bruta', v: '41%', d: '+6 p.p. no ano' },
    { k: 'Custo', v: '−12%', d: '12% menor que em 2025' },
    { k: 'Prazo', v: '18 dias', d: '9 dias mais rápido' }
  ];
  const S = {};
  let K = K0.map(o => ({ ...o })), order = [0, 1, 2], E = null;
  const paint = () => {
    const a = K[order[0]];
    mk.textContent = a.k; mv.textContent = a.v; md.textContent = a.d;
    main.setAttribute('aria-label', `Indicador em destaque: ${a.k}, ${a.v}. ${a.d}.`);
    sides.forEach((b, j) => {
      const o = K[order[j + 1]];
      $('span', b).textContent = o.k; $('b', b).textContent = o.v;
      b.setAttribute('aria-label', `${o.k}: ${o.v}. Trazer para o destaque.`);
    });
  };
  const pop = () => { if (REDUCED) return; inner.classList.remove('is-swap'); void inner.offsetWidth; inner.classList.add('is-swap'); };
  /* tocar um indicador secundário troca de lugar com o principal: a luz vai junto */
  sides.forEach((b, j) => b.addEventListener('click', () => {
    [order[0], order[j + 1]] = [order[j + 1], order[0]];
    paint(); pop();
    E.set('val', K[order[0]].v, true); E.touch();
    E.say(`${K[order[0]].k} em destaque: ${K[order[0]].v}.`);
  }));
  E = vtEdit(card, [
    { k: 'int', t: 'range', label: 'Intensidade', min: 0, max: 2.5, step: .1, v: 1, fmt: vtPct },
    { k: 'spin', t: 'range', label: 'Giro do anel', min: .2, max: 3, step: .1, v: 1, fmt: vtX },
    { k: 'acc', t: 'acc', label: 'Cor', v: 'violeta' },
    { k: 'sweep', t: 'tog', label: 'Varredura', v: true },
    { k: 'val', t: 'text', label: 'Valor em destaque', v: '41%', max: 9, wide: true }
  ], (k, v) => {
    if (k === 'int') main.style.setProperty('--int-b', v);
    if (k === 'spin') main.style.setProperty('--spin', v);
    if (k === 'sweep') box.classList.toggle('no-sweep', !v);
    if (k === 'acc') vtAcc(card, v);
    if (k === 'val') { K[order[0]].v = v.trim() || ' '; paint(); }
  }, { S, reset: () => { K = K0.map(o => ({ ...o })); order = [0, 1, 2]; paint(); } });
  paint();
  return {};
};

/* ---------------------------------------------------------------- 24 · Spotlight / Focus */
VT_DEMO.spot = card => {
  const box = $('.vt-sp', card), slide = $('.vt-sp-slide', box), cap = $('.vt-sp-cap', box), btns = $$('.vt-sp-ctl button', box);
  const CAPS = {
    1: 'Passo 1 · Tudo começa na compra: 100.',
    2: 'Passo 2 · O estoque leva 4 pontos.',
    3: 'Passo 3 · O frete leva 9. É aqui que a margem vaza.',
    4: 'Passo 4 · Sobram 87 na venda.',
    free: 'Livre · arraste o foco ou use as setas.'
  };
  const S = {};
  let step = 0, timer = 0, auto = false, baseR = 74, fx = 0, fy = 0, drag = false;
  const radius = () => box.style.setProperty('--vt-sr', baseR * (S.size || 1) + 'px');
  const place = (x, y, r, instant) => {
    if (instant) box.classList.add('is-jump');
    fx = x; fy = y;
    box.style.setProperty('--vt-sx', x + 'px'); box.style.setProperty('--vt-sy', y + 'px');
    if (r) { baseR = r; radius(); }
    if (instant) { void box.offsetWidth; box.classList.remove('is-jump'); }
  };
  const toNode = (k, instant) => {
    const n = $(`.vt-sp-node[data-step="${k}"]`, box); if (!n) return;
    const r = n.getBoundingClientRect(), b = box.getBoundingClientRect();
    place(r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top, Math.max(r.width, r.height) * 1.25, instant);
  };
  const go = (k, fromUser) => {
    if (fromUser) { auto = false; clearTimeout(timer); timer = 0; }
    const first = box.classList.contains('is-off');
    step = k;
    btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.go === String(k))));
    $$('.vt-sp-node', box).forEach(n => n.classList.toggle('is-lit', n.dataset.step === String(k)));
    box.classList.toggle('is-free', k === 'free');
    cap.textContent = CAPS[k];
    if (k === 'free') { const b = box.getBoundingClientRect(); if (first) place(b.width / 2, b.height * .4, 84, true); else { baseR = 84; radius(); } }
    else toNode(k, first);
    box.classList.remove('is-off');
  };
  const next = () => {
    if (!auto) return;
    const s = typeof step === 'number' ? step : 0;
    if (s >= 4) { auto = false; return; }
    timer = setTimeout(() => { go(s + 1); next(); }, s === 0 ? 350 : (S.pace || 2.3) * 1000);
  };
  const tour = () => { clearTimeout(timer); box.classList.add('is-off'); auto = true; step = 0; next(); };
  btns.forEach(b => b.addEventListener('click', () => go(b.dataset.go === 'free' ? 'free' : +b.dataset.go, true)));
  /* tocar uma etapa leva o foco até ela */
  slide.addEventListener('click', e => {
    if (step === 'free') return;
    const n = e.target.closest('.vt-sp-node'); if (n) go(+n.dataset.step, true);
  });
  const at = e => { const b = box.getBoundingClientRect(); place(vtClamp(e.clientX - b.left, 0, b.width), vtClamp(e.clientY - b.top, 0, b.height)); };
  box.addEventListener('pointerdown', e => {
    if (step !== 'free' || !slide.contains(e.target)) return;
    e.preventDefault(); drag = true; box.setPointerCapture(e.pointerId); at(e);
  });
  box.addEventListener('pointermove', e => { if (step === 'free' && (drag || e.pointerType === 'mouse')) at(e); });
  const end = () => { drag = false; };
  box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
  box.addEventListener('keydown', e => {
    if (step !== 'free') return;
    const s = e.shiftKey ? 42 : 14;
    const d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key]; if (!d) return;
    e.preventDefault();
    const b = box.getBoundingClientRect();
    place(vtClamp(fx + d[0], 0, b.width), vtClamp(fy + d[1], 0, b.height));
  });
  new ResizeObserver(() => { if (typeof step === 'number' && step > 0) toNode(step, true); }).observe(box);
  box.classList.add('is-off');
  vtEdit(card, [
    { k: 'size', t: 'range', label: 'Tamanho do foco', min: .6, max: 1.8, step: .05, v: 1, fmt: vtPct },
    { k: 'dark', t: 'range', label: 'Escurecer', min: .3, max: .96, step: .02, v: .84, fmt: vtPct },
    { k: 'pace', t: 'range', label: 'Ritmo do tour', min: 1, max: 5, step: .1, v: 2.3, fmt: v => fmtNum(v, 1) + ' s' },
    { k: 'acc', t: 'acc', label: 'Cor da borda', v: 'violeta' },
    { k: 'ring', t: 'tog', label: 'Borda de luz', v: true },
    { t: 'acts', items: [{ label: 'Tocar o tour', motion: true, fn: tour }] }
  ], (k, v) => {
    if (k === 'size') radius();
    if (k === 'dark') box.style.setProperty('--dark', v);
    if (k === 'ring') box.style.setProperty('--ring', v ? 1 : 0);
    if (k === 'acc') vtAcc(card, v);
  }, { S });
  return {
    start() { auto = true; step = 0; next(); },
    resume() { if (auto && !timer) next(); },
    pause() { clearTimeout(timer); timer = 0; },
    replay: tour,
    still() { go(3); }
  };
};

/* ---------------------------------------------------------------- 33 · Card Stack */
VT_DEMO.stack = card => {
  const box = $('.vt-st', card), pile = $('.vt-st-pile', card), cards = $$('.vt-st-card', pile), live = $('.vt-st-live', card);
  const T0 = cards.map(c => $('b', c).textContent);
  const S = {};
  let order = cards.map((_, i) => i), busy = false, E = null;
  const label = c => `Capítulo ${c.querySelector('span').textContent.replace(' / ', ' de ')}: ${c.querySelector('b').textContent}. ${c.querySelector('p').textContent}`;
  /* pontos de navegação: um por capítulo, pulam direto para ele */
  const dots = el('div', 'vt-st-dots'); dots.setAttribute('role', 'group'); dots.setAttribute('aria-label', 'Capítulos da pilha');
  const db = cards.map((c, i) => {
    const b = el('button', 'vt-st-dot'); b.type = 'button';
    b.addEventListener('click', () => jump(i));
    dots.append(b); return b;
  });
  box.append(dots);
  const layout = () => {
    order.forEach((ci, o) => {
      const c = cards[ci];
      c.style.setProperty('--o', o);
      c.classList.toggle('is-top', o === 0);
      c.tabIndex = o === 0 ? 0 : -1;
      c.setAttribute('aria-hidden', String(o !== 0));
      c.setAttribute('aria-label', label(c) + ' Pressione Enter para o próximo.');
    });
    db.forEach((b, i) => {
      const top = order[0] === i;
      b.setAttribute('aria-label', `Ir para o capítulo ${i + 1}: ${$('b', cards[i]).textContent}`);
      if (top) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    if (E) E.set('title', $('b', cards[order[0]]).textContent, true);
  };
  const announce = () => { live.textContent = label(cards[order[0]]); };
  const next = (dir = +(S.dir || 1)) => {
    if (busy) return; busy = true;
    const c = cards[order[0]], had = document.activeElement === c;
    c.classList.remove('is-drag');
    c.style.setProperty('--dx', dir * pile.offsetWidth * 1.15 + 'px');
    c.style.setProperty('--dr', dir * 16 + 'deg');
    setTimeout(() => {
      order.push(order.shift());
      c.style.removeProperty('--dx'); c.style.removeProperty('--dr');
      layout(); announce();
      if (had) cards[order[0]].focus({ preventScroll: true });
      busy = false;
    }, REDUCED ? 0 : 260);
  };
  const jump = i => {
    if (busy || order[0] === i) return;
    const at = order.indexOf(i);
    order = order.slice(at).concat(order.slice(0, at));
    layout(); announce();
  };
  const prev = () => { if (busy) return; order.unshift(order.pop()); layout(); announce(); };
  const shuffle = () => {
    if (busy) return; busy = true;
    if (!REDUCED) cards.forEach(c => { c.style.setProperty('--dx', (Math.random() - .5) * 120 + 'px'); c.style.setProperty('--dr', (Math.random() - .5) * 26 + 'deg'); });
    setTimeout(() => {
      const top = order[0];
      do { order.sort(() => Math.random() - .5); } while (order[0] === top);
      cards.forEach(c => { c.style.removeProperty('--dx'); c.style.removeProperty('--dr'); });
      layout(); announce(); busy = false;
    }, REDUCED ? 0 : 280);
  };
  let sx = 0, dx = 0, drag = null;
  pile.addEventListener('pointerdown', e => {
    const c = e.target.closest('.vt-st-card');
    if (!c || !c.classList.contains('is-top') || busy) return;
    drag = c; sx = e.clientX; dx = 0;
    c.setPointerCapture(e.pointerId);
  });
  pile.addEventListener('pointermove', e => {
    if (!drag) return;
    dx = e.clientX - sx;
    if (Math.abs(dx) > 4) drag.classList.add('is-drag');
    drag.style.setProperty('--dx', dx + 'px'); drag.style.setProperty('--dr', dx * .06 + 'deg');
  });
  const up = e => {
    if (!drag) return;
    const c = drag; drag = null;
    if (e.type === 'pointercancel') { c.classList.remove('is-drag'); c.style.removeProperty('--dx'); c.style.removeProperty('--dr'); return; }
    if (Math.abs(dx) < 5) next();
    else if (Math.abs(dx) > 70) next(dx < 0 ? -1 : 1);
    else { c.classList.remove('is-drag'); c.style.removeProperty('--dx'); c.style.removeProperty('--dr'); }
  };
  pile.addEventListener('pointerup', up);
  pile.addEventListener('pointercancel', up);
  pile.addEventListener('keydown', e => {
    if (!e.target.classList.contains('is-top')) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); next(-1); }
  });
  E = vtEdit(card, [
    { k: 'depth', t: 'range', label: 'Profundidade', min: 0, max: 2.2, step: .1, v: 1, fmt: vtPct },
    { k: 'fan', t: 'range', label: 'Leque', min: 0, max: 14, step: 1, v: 0, fmt: v => v + '°' },
    { k: 'dir', t: 'seg', label: 'Saída', opts: [['1', 'Direita'], ['-1', 'Esquerda']], v: '1' },
    { k: 'acc', t: 'acc', label: 'Cor', v: 'violeta' },
    { k: 'title', t: 'text', label: 'Título do card do topo', v: T0[0], max: 26, wide: true, track: false },
    { t: 'acts', items: [{ label: 'Embaralhar', fn: shuffle }, { label: 'Anterior', fn: prev }] }
  ], (k, v, s, phase) => {
    if (k === 'depth') pile.style.setProperty('--depth', v);
    if (k === 'fan') pile.style.setProperty('--fan', v);
    if (k === 'acc') vtAcc(card, v);
    if (k === 'title' && !phase) {
      const c = cards[order[0]]; $('b', c).textContent = v.trim() || ' ';
      c.setAttribute('aria-label', label(c) + ' Pressione Enter para o próximo.');
      E.touch();
    }
  }, { S, reset: () => { cards.forEach((c, i) => { $('b', c).textContent = T0[i]; }); order = cards.map((_, i) => i); layout(); } });
  layout();
  return {
    replay() { order = cards.map((_, i) => i); layout(); },
    still: layout
  };
};

/* ---------------------------------------------------------------- 16 · Chart Build */
VT_DEMO.chart = card => {
  const plot = $('.vt-ch-plot', card), svg = $('.vt-ch-svg', card), desc = $('title', svg), tip = $('.vt-ch-tip', card), range = $('.vt-ch-scrub .vt-range', card);
  const det = $('.vt-ch-det', card), detQ = $('.vt-ch-det-q', det), detV = $('.vt-ch-det-v b', det), detM = $('.vt-ch-det-m', det), detP = $('.vt-ch-det-p', det);
  const legR = $('.vt-ch-lb', card), legM = $('.vt-ch-ll', card), bMax = $('[data-act="max"]', card), bSort = $('[data-act="sort"]', card);
  const Q = ['1T25', '2T25', '3T25', '4T25', '1T26', '2T26', '3T26', '4T26'];
  const R = [42, 48, 51, 57, 63, 70, 76, 84], M0 = [45, 48, 52, 55, 58, 62, 66, 70];
  const MAXI = R.indexOf(Math.max(...R)), LAST = R.length - 1;
  const S = {};
  const ST0 = { sorted: false, max: false, pin: -1, showR: true, showM: true };
  let st = { ...ST0 }, M = M0.slice(), g = null, prog = REDUCED ? 1 : 0, stop = null, mv = null, pos = Q.map((_, i) => i), E = null;
  const f1 = v => fmtNum(v, Number.isInteger(v) ? 0 : 1);
  const signed = v => (v > 0 ? '+' : v < 0 ? '−' : '') + f1(Math.abs(v));
  const slots = () => {
    const idx = Q.map((_, i) => i);
    if (st.sorted) idx.sort((a, b) => R[b] - R[a] || a - b);
    const s = []; idx.forEach((bi, k) => { s[bi] = k; }); return s;
  };
  const ns = (t, a, parent) => { const n = svgEl(t, a); (parent || svg).append(n); return n; };
  const gap = d => Math.abs(d) < .05 ? 'na meta' : `${signed(d)} ${d > 0 ? 'acima' : 'abaixo'}`;
  const summary = i => {
    const d = R[i] - M[i];
    return `${Q[i]}: receita ${R[i]}, meta ${f1(M[i])}, ${Math.abs(d) < .05 ? 'na meta' : gap(d) + ' da meta'}.`;
  };
  const build = () => {
    const W = plot.clientWidth, H = plot.clientHeight; if (!W || !H) return;
    [...svg.querySelectorAll(':scope > :not(title)')].forEach(n => n.remove());
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const L = 30, Rt = W - 58, T = 20, B = H - 22, band = (Rt - L) / Q.length, bw = Math.min(46, band * .58);
    const y = v => B - (v / 100) * (B - T), xc = s => L + band * s + band / 2;
    const uid = card.id + '-c';
    const defs = ns('defs');
    const clip = ns('clipPath', { id: uid }, defs); ns('rect', { x: 0, y: 0, width: W, height: B }, clip);
    const mask = ns('mask', { id: uid + 'm' }, defs);
    const lineD = M.map((v, i) => `${i ? 'L' : 'M'}${xc(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    const mPath = ns('path', { d: lineD, fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }, mask);
    const gridG = ns('g');
    [0, 25, 50, 75, 100].forEach(v => ns('line', { x1: L, x2: Rt, y1: y(v), y2: y(v), class: v ? 'vt-ch-grid' : 'vt-ch-base' }, gridG));
    const yl = ns('g', { class: 'vt-ch-axis' });
    [0, 50, 100].forEach(v => { const t = ns('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'vt-ch-lbl' }, yl); t.textContent = v; });
    const xl = ns('g', { class: 'vt-ch-axis' });
    const xLabels = Q.map(q => { const t = ns('text', { y: H - 4, 'text-anchor': 'middle', class: 'vt-ch-lbl' }, xl); t.textContent = q; return t; });
    const barsG = ns('g', { 'clip-path': `url(#${uid})`, class: 'vt-ch-bars' });
    const bars = R.map((v, i) => ns('rect', { width: bw, rx: 4, y: B, height: 0, class: 'vt-ch-bar' + (i === LAST ? ' is-hi' : '') + (i === MAXI ? ' is-top' : '') }, barsG));
    const valsG = ns('g', { class: 'vt-ch-vals' });
    const vals = R.map(v => { const t = ns('text', { 'text-anchor': 'middle', class: 'vt-ch-val' }, valsG); t.textContent = v; return t; });
    const metaG = ns('g', { class: 'vt-ch-metaG' });
    const line = ns('path', { d: lineD, class: 'vt-ch-meta', mask: `url(#${uid}m)` }, metaG);
    const len = line.getTotalLength();
    mPath.setAttribute('stroke-dasharray', len);
    const dots = M.map((v, i) => ns('circle', { cy: y(v), r: 4.5, class: 'vt-ch-dot' }, metaG));
    const labs = ns('text', { x: xc(LAST) + bw / 2 + 8, y: y(M[LAST]) + 4, 'text-anchor': 'start', class: 'vt-ch-lbl vt-ch-mlbl' }, metaG);
    labs.textContent = 'Meta ' + f1(M[LAST]);
    const hitsG = ns('g');
    const hits = R.map((v, i) => {
      const hit = ns('rect', { y: T, width: band, height: B - T, class: 'vt-ch-hit', tabindex: 0, role: 'button', 'aria-pressed': 'false', 'aria-label': summary(i) + ' Enter fixa o detalhe.' }, hitsG);
      const show = () => {
        bars[i].classList.add('is-hov');
        if (st.pin === i) { tip.hidden = true; return; }
        tip.hidden = false;
        tip.textContent = `${Q[i]} · Receita ${v} · Meta ${f1(M[i])}`;
        tip.style.left = vtClamp(xc(pos[i]), 80, W - 80) + 'px'; tip.style.top = y(Math.max(v, M[i])) + 'px';
      };
      const hide = () => { bars[i].classList.remove('is-hov', 'is-foc'); tip.hidden = true; };
      hit.addEventListener('pointerenter', show); hit.addEventListener('pointerleave', hide);
      hit.addEventListener('focus', () => { show(); bars[i].classList.add('is-foc'); }); hit.addEventListener('blur', hide);
      hit.addEventListener('click', () => pin(i));
      hit.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pin(i); return; }
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
        e.preventDefault();
        const s = slots(), want = s[i] + d, j = s.indexOf(want);
        if (j >= 0) g.hits[j].focus();
      });
      return hit;
    });
    g = { bars, vals, valsG, hits, dots, xLabels, mPath, len, line, labs, xl, yl, y, B, T, xc, band, bw, W, H };
    place(); render(prog); paint();
  };
  const place = () => {
    if (!g) return;
    R.forEach((v, i) => {
      const x = g.xc(pos[i]);
      g.bars[i].setAttribute('x', x - g.bw / 2); g.hits[i].setAttribute('x', x - g.band / 2);
      g.vals[i].setAttribute('x', x); g.dots[i].setAttribute('cx', x); g.xLabels[i].setAttribute('x', x);
      g.xLabels[i].style.visibility = g.band < 44 && Math.round(pos[i]) % 2 === 0 ? 'hidden' : '';
    });
  };
  const render = p => {
    prog = p; if (!g) return;
    const pb = vtClamp(p / .45);
    g.bars.forEach((r, i) => {
      const e = vtEase(vtClamp((pb - i * .07) / .51)), h = (g.B - g.y(R[i])) * e;
      r.setAttribute('y', g.B - h); r.setAttribute('height', h + (h > 0 ? 4 : 0));
      g.vals[i].setAttribute('y', g.B - h - 8);
    });
    g.mPath.setAttribute('stroke-dashoffset', g.len * (1 - vtEase(vtClamp((p - .45) / .3))));
    const pd = vtClamp((p - .68) / .17);
    g.dots.forEach((d, i) => { const e = vtClamp(pd * g.dots.length - i); d.setAttribute('r', (4.5 * vtEase(e)).toFixed(2)); d.style.opacity = e > 0 ? '' : 0; });
    const pl = vtClamp((p - .84) / .16);
    [g.labs, g.xl, g.yl, g.valsG].forEach(n => { n.style.opacity = pl; });
    range.value = Math.round(p * 100);
    range.style.setProperty('--v', p * 100 + '%');
    range.setAttribute('aria-valuetext', p < .45 ? 'Barras crescendo' : p < .75 ? 'Meta se desenhando' : p < .9 ? 'Pontos surgindo' : 'Gráfico completo');
  };
  const detail = () => {
    const i = st.pin;
    if (i < 0) { det.hidden = true; return; }
    const d = R[i] - M[i], pv = i ? (R[i] / R[i - 1] - 1) * 100 : null;
    detQ.textContent = Q[i]; detV.textContent = R[i];
    detM.innerHTML = '';
    detM.append(`Meta ${f1(M[i])} · `, el('em', d >= 0 ? 'is-up' : 'is-down', gap(d)));
    detP.textContent = pv == null ? 'Primeiro trimestre da série' : `${pv >= 0 ? '+' : '−'}${fmtNum(Math.abs(pv), 1)}% sobre ${Q[i - 1]}`;
    det.classList.toggle('is-right', st.sorted);
    det.hidden = false;
  };
  const paint = () => {
    svg.classList.toggle('no-r', !st.showR); svg.classList.toggle('no-m', !st.showM);
    svg.classList.toggle('is-sorted', st.sorted); svg.classList.toggle('is-max', st.max);
    legR.setAttribute('aria-pressed', String(st.showR)); legM.setAttribute('aria-pressed', String(st.showM));
    bMax.setAttribute('aria-pressed', String(st.max)); bSort.setAttribute('aria-pressed', String(st.sorted));
    if (g) {
      g.bars.forEach((r, i) => r.classList.toggle('is-pin', i === st.pin));
      g.vals.forEach((t, i) => t.classList.toggle('is-on', !!S.all || i === LAST || i === st.pin || (st.max && i === MAXI)));
      g.hits.forEach((h, i) => h.setAttribute('aria-pressed', String(i === st.pin)));
    }
    detail();
  };
  /* clique numa barra fixa o detalhe; outro clique na mesma solta */
  const pin = i => {
    st.pin = st.pin === i ? -1 : i; tip.hidden = true; paint(); E.touch();
    E.say(st.pin < 0 ? 'Detalhe fechado.' : `${summary(i)} ${detP.textContent}.`);
  };
  $('.vt-ch-x', det).addEventListener('click', () => { const i = st.pin; st.pin = -1; paint(); if (g && i >= 0) g.hits[i].focus(); E.say('Detalhe fechado.'); });
  legR.addEventListener('click', () => { st.showR = !st.showR; paint(); E.touch(); E.say(st.showR ? 'Receita visível.' : 'Receita oculta.'); });
  legM.addEventListener('click', () => { st.showM = !st.showM; paint(); E.touch(); E.say(st.showM ? 'Meta visível.' : 'Meta oculta.'); });
  bMax.addEventListener('click', () => {
    st.max = !st.max; paint(); E.touch();
    E.say(st.max ? `Maior receita em destaque: ${R[MAXI]} no ${Q[MAXI]}.` : 'Destaque desligado.');
  });
  /* ordenar: as barras trocam de lugar deslizando, da maior para a menor */
  const reorder = () => {
    const from = pos.slice(), to = slots();
    mv?.();
    if (REDUCED) { pos = to; place(); return; }
    mv = vtTween(720, q => { const e = vtEase(q); pos = from.map((a, i) => a + (to[i] - a) * e); place(); }, () => { mv = null; });
  };
  bSort.addEventListener('click', () => {
    st.sorted = !st.sorted; reorder(); paint(); E.touch();
    E.say(st.sorted ? 'Barras ordenadas da maior para a menor.' : 'Barras de volta à ordem do tempo.');
  });
  const play = () => { stop?.(); render(0); stop = vtTween(2800 / (S.speed || 1), p => render(p), () => { stop = null; }); };
  range.addEventListener('input', () => { stop?.(); stop = null; render(range.value / 100); });
  new ResizeObserver(() => build()).observe(plot);
  const describe = () => {
    const n = R.filter((v, i) => v >= M[i]).length;
    desc.textContent = `Receita trimestral sobe de 42 para 84 milhões de reais entre o 1º trimestre de 2025 e o 4º de 2026, acima ou na meta em ${n} de 8 trimestres.`;
  };
  E = vtEdit(card, [
    { k: 'speed', t: 'range', label: 'Montagem', min: .4, max: 2.5, step: .1, v: 1, fmt: vtX },
    { k: 'meta', t: 'range', label: 'Ajuste da meta', min: -20, max: 20, step: 1, v: 0, fmt: v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '%' },
    { k: 'acc', t: 'acc', label: 'Cor das barras', v: 'violeta' },
    { k: 'all', t: 'tog', label: 'Valor em todas', v: false }
  ], (k, v, s, phase) => {
    if (k === 'acc') vtAcc(card, v);
    if (k === 'meta') { M = M0.map(x => Math.round(x * (1 + v / 100) * 10) / 10); describe(); if (phase !== 'init') build(); }
    if (k === 'all') paint();
  }, { S, reset: () => { st = { ...ST0 }; mv?.(); pos = Q.map((_, i) => i); } });
  return { start: play, replay: play, still: () => render(1) };
};

/* ---------------------------------------------------------------- 21 · Flip Card */
VT_DEMO.flip = card => {
  const box = $('.vt-fl', card), cs = $$('.vt-fl-card', card), all = $('.vt-fl-all', card);
  const D0 = cs.map(c => ({ k: c.dataset.k, a: $('.vt-fl-f b', c).textContent, b: $('.vt-fl-b b', c).textContent }));
  const S = {};
  let data = D0.map(o => ({ ...o })), timers = [], E = null;
  const pct = (a, b) => {
    const na = vtParse(a), nb = vtParse(b);
    if (!isFinite(na) || !isFinite(nb) || na === 0) return '';
    const p = Math.round((nb - na) / Math.abs(na) * 100);
    return p === 0 ? 'igual' : (p > 0 ? '+' : '−') + Math.abs(p) + '%';
  };
  const set = (c, on) => {
    const d = data[cs.indexOf(c)], p = pct(d.a, d.b);
    c.setAttribute('aria-pressed', String(on));
    c.setAttribute('aria-label', `${d.k}. ${on ? 'Depois' : 'Antes'}: ${on ? d.b : d.a}${on && p ? ', ' + p : ''}`);
  };
  const paint = i => {
    const c = cs[i], d = data[i];
    $('.vt-fl-f b', c).textContent = d.a || ' '; $('.vt-fl-b b', c).textContent = d.b || ' ';
    $('.vt-fl-b em span', c).textContent = pct(d.a, d.b);
    set(c, c.getAttribute('aria-pressed') === 'true');
  };
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  cs.forEach((c, i) => {
    set(c, false);
    c.addEventListener('click', () => {
      clear(); set(c, c.getAttribute('aria-pressed') !== 'true');
      if (card.classList.contains('is-edit') && S.card !== String(i)) E.set('card', String(i));
    });
  });
  all.addEventListener('click', () => { clear(); const on = cs.some(c => c.getAttribute('aria-pressed') !== 'true'); cs.forEach((c, i) => timers.push(setTimeout(() => set(c, on), i * 120))); });
  const intro = delay => { clear(); cs.forEach((c, i) => timers.push(setTimeout(() => set(c, true), delay + i * 260))); };
  E = vtEdit(card, [
    { k: 'axis', t: 'seg', label: 'Giro', opts: [['y', 'Lateral'], ['x', 'Vertical']], v: 'y' },
    { k: 'dur', t: 'range', label: 'Duração', min: .3, max: 1.6, step: .05, v: .75, fmt: v => fmtNum(v, 2) + ' s' },
    { k: 'acc', t: 'acc', label: 'Cor do verso', v: 'violeta' },
    { k: 'card', t: 'sel', label: 'Card para editar', opts: D0.map((d, i) => [String(i), d.k]), v: '0', track: false },
    { k: 'a', t: 'text', label: 'Antes', v: D0[0].a, max: 9, track: false },
    { k: 'b', t: 'text', label: 'Depois', v: D0[0].b, max: 9, track: false }
  ], (k, v, s, phase) => {
    if (k === 'axis') box.dataset.axis = v;
    if (k === 'dur') box.style.setProperty('--fl-dur', v + 's');
    if (k === 'acc') vtAcc(card, v);
    if (k === 'card' && E) { const d = data[+v]; E.set('a', d.a, true); E.set('b', d.b, true); }
    if ((k === 'a' || k === 'b') && !phase) {
      const i = +S.card; data[i][k] = v.trim(); paint(i);
      clear(); set(cs[i], k === 'b'); E.touch();
    }
  }, { S, reset: () => { data = D0.map(o => ({ ...o })); cs.forEach((c, i) => paint(i)); } });
  return {
    start: () => intro(600),
    replay() { clear(); cs.forEach(c => set(c, false)); intro(900); },
    still: () => cs.forEach(c => set(c, true))
  };
};

/* ---------------------------------------------------------------- 37 · Before / After */
VT_DEMO.ba = card => {
  const box = $('.vt-ba-box', card), knob = $('.vt-ba-knob', box), big = $('.vt-ba-big', box), tags = $$('.vt-ba-tag', box);
  const S = {};
  let p = 50, stop = null, drag = false, E = null;
  const set = v => {
    p = vtClamp(v, 0, 100);
    box.style.setProperty('--p', p.toFixed(2) + '%');
    const r = Math.round(p);
    knob.setAttribute('aria-valuenow', r);
    knob.setAttribute('aria-valuetext', r >= 100 ? 'Só o antes' : r <= 0 ? 'Só o depois' : `${r}% antes, ${100 - r}% depois`);
  };
  const fromPt = e => { const r = box.getBoundingClientRect(); return S.dir === 'v' ? (e.clientY - r.top) / r.height * 100 : (e.clientX - r.left) / r.width * 100; };
  const tweenTo = t => {
    stop?.(); stop = null;
    if (REDUCED) return set(t);
    const a = p; stop = vtTween(650, q => set(a + (t - a) * vtEase(q)), () => { stop = null; });
  };
  box.addEventListener('pointerdown', e => {
    if (e.target.closest('.vt-ba-tag')) return;
    if (e.pointerType === 'touch' && !e.target.closest('.vt-ba-knob')) return;
    stop?.(); stop = null; drag = true;
    box.setPointerCapture(e.pointerId); set(fromPt(e));
  });
  box.addEventListener('pointermove', e => { if (drag) set(fromPt(e)); });
  box.addEventListener('pointerup', () => { drag = false; });
  box.addEventListener('pointercancel', () => { drag = false; });
  knob.addEventListener('keydown', e => {
    const s = e.shiftKey ? 10 : 5;
    const v = { ArrowLeft: p - s, ArrowUp: p - s, ArrowRight: p + s, ArrowDown: p + s, Home: 0, End: 100 }[e.key];
    if (v == null) return;
    e.preventDefault(); stop?.(); stop = null; set(v);
  });
  /* as etiquetas são atalhos: Antes mostra só o antes, Depois mostra só o depois */
  tags.forEach(t => t.addEventListener('click', () => { tweenTo(+t.dataset.to); E.say(+t.dataset.to ? 'Só o antes.' : 'Só o depois.'); }));
  const sweep = () => {
    stop?.(); set(100);
    stop = vtTween(1200, q => set(100 - 72 * vtEase(q)), () => { stop = vtTween(700, q => set(28 + 22 * vtEase(q)), () => { stop = null; }); });
  };
  E = vtEdit(card, [
    { k: 'dir', t: 'seg', label: 'Divisão', opts: [['h', 'Lado a lado'], ['v', 'Empilhado']], v: 'h', wide: true },
    { k: 'acc', t: 'acc', label: 'Cor do divisor', v: 'violeta' },
    { k: 'tags', t: 'tog', label: 'Etiquetas', v: true },
    { k: 'big', t: 'text', label: 'Número do depois', v: '+38%', max: 7 },
    { t: 'acts', items: [{ label: 'Varrer de novo', motion: true, fn: sweep }] }
  ], (k, v) => {
    if (k === 'dir') { box.dataset.dir = v; knob.setAttribute('aria-orientation', v === 'v' ? 'vertical' : 'horizontal'); }
    if (k === 'acc') vtAcc(card, v);
    if (k === 'tags') box.classList.toggle('no-tags', !v);
    if (k === 'big') big.textContent = v.trim() || ' ';
  }, { S });
  set(REDUCED ? 50 : 100);
  return { start: sweep, replay: sweep, still: () => set(50) };
};

/* ---------------------------------------------------------------- 35 · Interactive Matrix */
VT_DEMO.matrix = card => {
  const plot = $('.vt-mx-plot', card), legW = $('.vt-mx-leg', card), qs = $$('.vt-mx-q', plot);
  const QN = ['Ganhos rápidos', 'Grandes apostas', 'Ajustes finos', 'Evitar'];
  const START = [['Painel', 22, 26], ['Capa nova', 36, 40], ['Treino', 72, 30], ['Migração', 78, 76], ['Relatório', 30, 74]];
  const S = {};
  let bs = [], drag = null, sel = null, fq = 0, moved = false, sx = 0, sy = 0, q0 = 0, E = null;
  const quad = (x, y) => (x >= 50 ? 1 : 0) + (y >= 50 ? 2 : 0);
  const qOf = b => quad(+b.dataset.x, +b.dataset.y);
  const score = b => ({ imp: Math.round((92 - b.dataset.y) / 84 * 100), eff: Math.round((b.dataset.x - 6) / 88 * 100) });
  const tipEl = el('span', 'vt-mx-tip'); tipEl.setAttribute('aria-hidden', 'true'); tipEl.hidden = true; plot.append(tipEl);
  /* legenda: quadrante e contagem; tocar foca o quadrante */
  const lb = QN.map((q, i) => {
    const b = el('button', 'vt-mx-lb'); b.type = 'button';
    b.append(el('span', '', q), el('b', '', '0'));
    b.addEventListener('click', () => focusQ(i));
    legW.append(b); return b;
  });
  const tip = () => {
    if (!sel) { tipEl.hidden = true; return; }
    const s = score(sel);
    tipEl.textContent = `Impacto ${s.imp} · Esforço ${s.eff}`;
    tipEl.style.left = sel.dataset.x + '%'; tipEl.style.top = sel.dataset.y + '%';
    tipEl.hidden = false;
  };
  const place = b => {
    const q = qOf(b), s = score(b);
    b.style.left = b.dataset.x + '%'; b.style.top = b.dataset.y + '%';
    b.classList.toggle('is-f', q === fq);
    b.setAttribute('aria-label', `${b.textContent}: ${QN[q]}, impacto ${s.imp}, esforço ${s.eff}. Setas movem, Delete remove.`);
    if (b === sel) tip();
  };
  const counts = () => { const n = [0, 0, 0, 0]; bs.forEach(b => n[qOf(b)]++); return n; };
  const tally = () => { const n = counts(); lb.forEach((b, i) => { $('b', b).textContent = n[i]; b.setAttribute('aria-pressed', String(i === fq)); }); };
  const sayMove = (b, before) => {
    const q = qOf(b); if (q === before) return;
    const n = counts();
    E.say(`${b.textContent} foi para ${QN[q]}. ${QN.map((x, i) => `${x} ${n[i]}`).join(', ')}.`);
  };
  const hot = q => qs.forEach((d, i) => d.classList.toggle('is-hot', i === q));
  const select = b => { if (sel) sel.classList.remove('is-sel'); sel = b; if (b) b.classList.add('is-sel'); tip(); };
  const focusQ = i => {
    fq = i; qs.forEach((d, j) => d.classList.toggle('is-f', j === i));
    bs.forEach(place); tally(); E.touch();
    E.say(`Foco em ${QN[i]}: ${counts()[i]} iniciativas.`);
  };
  /* ímã: cada bolha vai para o centro do seu quadrante, empilhada sem se sobrepor */
  const snap = () => {
    const h = plot.clientHeight || 200, need = 34 * (S.bs || S.size || 1) / h * 100;
    [0, 1, 2, 3].forEach(q => {
      const list = bs.filter(b => qOf(b) === q).sort((a, b) => a.dataset.y - b.dataset.y || a.dataset.x - b.dataset.x);
      const n = list.length, fit = Math.floor(38 / need) + 1, cols = n > fit ? 2 : 1, rows = Math.ceil(n / cols);
      const stp = Math.min(need, rows > 1 ? 38 / (rows - 1) : 0);
      list.forEach((b, k) => {
        const r = cols > 1 ? Math.floor(k / 2) : k, cx = q % 2 ? 72 : 28;
        b.dataset.x = cols > 1 ? cx + (k % 2 ? 11 : -11) : cx;
        b.dataset.y = vtClamp((q > 1 ? 71 : 29) + (r - (rows - 1) / 2) * stp, 8, 92);
        place(b);
      });
    });
  };
  const mkB = (name, x, y, i) => {
    const b = el('button', 'vt-mx-b', name);
    b.type = 'button'; b.dataset.x = x; b.dataset.y = y; b.style.setProperty('--d', i * 90 + 'ms');
    b.addEventListener('pointerdown', e => {
      drag = b; moved = false; sx = e.clientX; sy = e.clientY; q0 = qOf(b);
      b.setPointerCapture(e.pointerId); b.style.setProperty('--d', '0ms'); select(b);
    });
    b.addEventListener('pointermove', e => {
      if (drag !== b) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 4) return;
      moved = true; b.classList.add('is-drag');
      const r = plot.getBoundingClientRect();
      b.dataset.x = vtClamp((e.clientX - r.left) / r.width * 100, 6, 94).toFixed(1);
      b.dataset.y = vtClamp((e.clientY - r.top) / r.height * 100, 8, 92).toFixed(1);
      place(b); hot(qOf(b));
    });
    const end = () => {
      if (drag !== b) return;
      drag = null; b.classList.remove('is-drag'); hot(-1);
      if (moved) { if (S.snap) snap(); tally(); sayMove(b, q0); E.touch(); }
      else { const s = score(b); E.say(`${name}: impacto ${s.imp}, esforço ${s.eff}, em ${QN[qOf(b)]}.`); }
    };
    b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
    b.addEventListener('focus', () => select(b));
    b.addEventListener('keydown', e => {
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(b); return; }
      const s = e.shiftKey ? 15 : 5;
      const d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
      if (!d) return;
      e.preventDefault(); b.style.setProperty('--d', '0ms');
      const before = qOf(b);
      b.dataset.x = vtClamp(+b.dataset.x + d[0], 6, 94); b.dataset.y = vtClamp(+b.dataset.y + d[1], 8, 92);
      place(b); tally(); sayMove(b, before); E.touch();
    });
    plot.append(b); bs.push(b); place(b);
    return b;
  };
  const remove = b => {
    if (bs.length <= 1) { E.say('A matriz precisa de pelo menos uma iniciativa.'); return; }
    const i = bs.indexOf(b); bs.splice(i, 1); b.remove();
    if (sel === b) select(null);
    tally(); E.touch(); E.say(`${b.textContent} saiu da matriz.`);
    (bs[i] || bs[i - 1])?.focus();
  };
  plot.addEventListener('pointerdown', e => { if (!e.target.closest('.vt-mx-b')) select(null); });
  const build = () => { bs.forEach(b => b.remove()); bs = []; select(null); START.forEach(([n, x, y], i) => mkB(n, x, y, i)); fq = 0; qs.forEach((d, j) => d.classList.toggle('is-f', j === 0)); bs.forEach(place); tally(); };
  build();
  E = vtEdit(card, [
    { t: 'add', label: 'Nova iniciativa', ph: 'Ex.: Webinar', max: 14, fn: name => {
      if (bs.length >= 8) { E.say('A matriz aceita até 8 iniciativas.'); return false; }
      const b = mkB(name, 50 + (Math.random() - .5) * 18, 50 + (Math.random() - .5) * 18, 0);
      if (S.snap) snap();
      select(b); tally(); E.touch();
      E.say(`${name} entrou em ${QN[qOf(b)]}. Arraste ou use as setas para levar ao quadrante certo.`);
    } },
    { k: 'size', t: 'range', label: 'Tamanho', min: .8, max: 1.3, step: .05, v: 1, fmt: vtPct },
    { k: 'acc', t: 'acc', label: 'Cor do foco', v: 'violeta' },
    { k: 'snap', t: 'tog', label: 'Ímã nos quadrantes', v: false },
    { t: 'acts', items: [
      { label: 'Remover selecionada', fn: () => { if (sel) remove(sel); else E.say('Toque numa bolha para selecionar.'); } },
      { label: 'Embaralhar', fn: () => { bs.forEach(b => { b.style.setProperty('--d', '0ms'); b.dataset.x = (10 + Math.random() * 80).toFixed(1); b.dataset.y = (12 + Math.random() * 76).toFixed(1); place(b); }); if (S.snap) snap(); tally(); E.touch(); E.say('Bolhas embaralhadas. ' + QN.map((x, i) => `${x} ${counts()[i]}`).join(', ') + '.'); } }
    ] }
  ], (k, v, s, phase) => {
    if (k === 'size') plot.style.setProperty('--bs', v);
    if (k === 'acc') vtAcc(card, v);
    if (k === 'snap' && v && !phase) { snap(); tally(); }
  }, { S, reset: build });
  const replay = () => bs.forEach((b, i) => b.style.setProperty('--d', i * 90 + 'ms'));
  return { replay, still: () => {} };
};

/* ---------------------------------------------------------------- 18 · Connector / Flow Line */
VT_DEMO.flow = card => {
  const box = $('.vt-fw-box', card), svg = $('.vt-fw-svg', card), cap = $('.vt-fw-cap', card);
  const N = {
    dados: [58, 50, 'Dados', 'Os dados alimentam o Motor.'],
    crm: [58, 190, 'CRM', 'O CRM alimenta o Motor.'],
    motor: [200, 120, 'Motor', 'O Motor liga as fontes ao Painel e à Plateia.'],
    painel: [342, 50, 'Painel', 'O Painel recebe do Motor e mostra à Plateia.'],
    sala: [342, 190, 'Plateia', 'A Plateia recebe do Motor e do Painel.']
  };
  const ORDER = ['dados', 'crm', 'motor', 'painel', 'sala'];
  const EDGES = [['dados', 'motor'], ['crm', 'motor'], ['motor', 'painel'], ['motor', 'sala'], ['painel', 'sala']];
  const S = {}, on = {};
  ORDER.forEach(k => { on[k] = true; });
  let hov = null, timers = [], E = null;
  const pathD = (a, b) => {
    const [ax, ay] = N[a], [bx, by] = N[b];
    if (S.shape === 'reta') return `M${ax} ${ay} L${bx} ${by}`;
    return ax === bx ? `M${ax} ${ay} C${ax + 46} ${ay + 40}, ${bx + 46} ${by - 40}, ${bx} ${by}` : `M${ax} ${ay} C${(ax + bx) / 2} ${ay}, ${(ax + bx) / 2} ${by}, ${bx} ${by}`;
  };
  const links = EDGES.map(([a, b]) => {
    const base = svgEl('path', { class: 'vt-fw-base' }), flow = svgEl('path', { class: 'vt-fw-flow' });
    svg.append(base, flow);
    return { a, b, base, flow, len: 0 };
  });
  const setPaths = () => links.forEach(l => { const d = pathD(l.a, l.b); l.base.setAttribute('d', d); l.flow.setAttribute('d', d); l.len = 0; });
  setPaths();
  /* um nó desligado corta o sinal: quem depende só dele fica sem sinal */
  const power = () => {
    const p = {};
    ORDER.forEach(k => { if (!on[k]) { p[k] = false; return; } const ins = EDGES.filter(e => e[1] === k); p[k] = !ins.length || ins.some(e => p[e[0]]); });
    return p;
  };
  const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];
  const status = pw => {
    const off = ORDER.filter(k => !on[k]).map(k => N[k][2]), dark = ORDER.filter(k => on[k] && !pw[k]).map(k => N[k][2]);
    if (!off.length) return 'Tudo ligado. Toque num nó para desligar e ver o efeito.';
    return `${list(off)} ${off.length > 1 ? 'desligados' : 'desligado'}. ` + (dark.length ? `${list(dark)} ${dark.length > 1 ? 'ficaram' : 'ficou'} sem sinal.` : 'O resto segue fluindo.');
  };
  const btns = {};
  Object.entries(N).forEach(([k, [x, y, name]], i) => {
    const b = el('button', 'vt-fw-n' + (k === 'motor' ? ' is-core' : ''), name);
    b.type = 'button'; b.style.left = x / 4 + '%'; b.style.top = y / 2.4 + '%'; b.style.setProperty('--i', i);
    btns[k] = b; box.append(b);
  });
  const paint = () => {
    const pw = power();
    Object.entries(btns).forEach(([k, b]) => {
      b.setAttribute('aria-pressed', String(on[k]));
      b.classList.toggle('is-off', !on[k]); b.classList.toggle('is-dark', on[k] && !pw[k]);
    });
    links.forEach(l => { const f = pw[l.a] && on[l.b]; l.base.classList.toggle('is-off', !f); l.flow.classList.toggle('is-off', !f); });
    if (!hov) cap.textContent = status(pw);
    return pw;
  };
  const hi = k => {
    hov = k; const lit = !!k;
    svg.classList.toggle('is-dim', lit); box.classList.toggle('is-dim', lit);
    Object.entries(btns).forEach(([n, b]) => { b.classList.toggle('is-hi', n === k); b.classList.remove('is-nb'); });
    links.forEach(l => {
      const t = lit && (l.a === k || l.b === k);
      l.base.classList.toggle('is-hi', t); l.flow.classList.toggle('is-hi', t);
      if (t) btns[l.a === k ? l.b : l.a].classList.add('is-nb');
    });
    if (lit) cap.textContent = N[k][3] + (on[k] ? '' : ' Agora está desligado.');
    else paint();
  };
  Object.entries(btns).forEach(([k, b]) => {
    b.addEventListener('pointerenter', () => hi(k));
    b.addEventListener('pointerleave', () => hi(null));
    b.addEventListener('focus', () => hi(k));
    b.addEventListener('blur', () => hi(null));
    b.addEventListener('click', () => {
      on[k] = !on[k]; hov = null;
      cap.textContent = status(paint());
      E.touch();
    });
  });
  const draw = () => {
    timers.forEach(clearTimeout); timers = [];
    links.forEach(l => {
      l.len = l.len || l.base.getTotalLength();
      l.base.style.transition = 'none'; l.base.style.strokeDasharray = l.len; l.base.style.strokeDashoffset = l.len;
      l.flow.style.transition = 'none'; l.flow.style.opacity = '0';
    });
    void svg.getBoundingClientRect();
    links.forEach((l, i) => {
      l.base.style.transition = `stroke-dashoffset 900ms var(--ease-halo) ${300 + i * 170}ms`;
      l.base.style.strokeDashoffset = '0';
      l.flow.style.transition = `opacity 600ms var(--ease-halo) ${1100 + i * 170}ms`;
      l.flow.style.opacity = '';
    });
    timers.push(setTimeout(() => links.forEach(l => { l.base.style.transition = ''; l.base.style.strokeDasharray = ''; l.base.style.strokeDashoffset = ''; l.flow.style.transition = ''; }), 2400));
  };
  if (!REDUCED) links.forEach(l => { l.len = l.base.getTotalLength(); l.base.style.strokeDasharray = l.len; l.base.style.strokeDashoffset = l.len; l.flow.style.opacity = '0'; });
  E = vtEdit(card, [
    { k: 'speed', t: 'range', label: 'Velocidade do fluxo', min: .3, max: 3, step: .1, v: 1, fmt: vtX },
    { k: 'gap', t: 'range', label: 'Espaço entre pontos', min: 6, max: 30, step: 1, v: 14, fmt: v => v + ' px' },
    { k: 'dir', t: 'seg', label: 'Direção', opts: [['ida', 'Ida'], ['volta', 'Volta']], v: 'ida' },
    { k: 'shape', t: 'seg', label: 'Traço', opts: [['curva', 'Curva'], ['reta', 'Reta']], v: 'curva' },
    { k: 'acc', t: 'acc', label: 'Cor', v: 'violeta' },
    { t: 'acts', items: [{ label: 'Ligar todos', fn: () => { ORDER.forEach(k => { on[k] = true; }); hov = null; paint(); E.say('Todos os nós ligados.'); } }] }
  ], (k, v, s, phase) => {
    if (k === 'speed') svg.style.setProperty('--fsp', v);
    if (k === 'gap') svg.style.setProperty('--gap', v + 'px');
    if (k === 'dir') svg.classList.toggle('is-rev', v === 'volta');
    if (k === 'shape' && phase !== 'init') setPaths();
    if (k === 'acc') vtAcc(card, v);
  }, { S, reset: () => { ORDER.forEach(k => { on[k] = true; }); hov = null; paint(); } });
  paint();
  return { start: draw, replay() { hi(null); draw(); } };
};

/* ==========================================================================
   PRÉVIA DO CATÁLOGO · os efeitos sem demo no palco abrem numa prévia leve,
   jogável e já com os controles abertos (cor, ritmo e o que importa no efeito).
   VT_PREV[n] = { how, ctl?, make(stage, S, ctx) -> { start, replay, apply, reset, stop } }
   ctx.say(texto) anuncia para leitor de tela. O modal sai da seção e vai para o body.
   ========================================================================== */
const VT_PREV = {};
const vtRe = (n, c = 'is-play') => { n.classList.remove(c); void n.offsetWidth; n.classList.add(c); };
function vtPreview() {
  const m = document.getElementById('vt-prev'); if (!m) return null;
  document.body.append(m);
  const box = $('.vt-pv-box', m);
  let cur = null;
  const clear = () => { cur?.stop?.(); cur = null; box.textContent = ''; };
  new MutationObserver(() => { if (m.hidden) clear(); }).observe(m, { attributes: true, attributeFilter: ['hidden'] });
  return n => {
    const fx = VT_FX.find(f => f[0] === n), P = VT_PREV[n]; if (!fx || !P) return;
    clear();
    const [, name, fam, , , sum] = fx;
    const card = el('article', 'vt-card vt-pv-card is-on is-vis'); card.id = 'vt-pv-c';
    const top = el('div', 'vt-pv-top'), kick = el('p', 'vt-kick');
    kick.append(el('span', 'mono', String(n).padStart(2, '0')), fam, el('span', 'vt-pvchip', 'Prévia'));
    const x = el('button', 'btn-icon vt-pv-x'); x.type = 'button'; x.dataset.close = ''; x.setAttribute('aria-label', 'Fechar prévia');
    x.innerHTML = '<svg aria-hidden="true"><use href="#i-x"/></svg>';
    top.append(kick, x);
    const stage = el('div', 'vt-demo vt-pv-stage pv-' + n);
    const meta = el('div', 'vt-meta'), row = el('div', 'vt-meta-row');
    const rep = el('button', 'btn btn-ghost btn-xs vt-replay'); rep.type = 'button';
    rep.innerHTML = '<svg aria-hidden="true"><use href="#i-replay"/></svg>Repetir'; rep.setAttribute('aria-label', 'Repetir ' + name);
    row.append(el('p', 'vt-kick', 'Mexa e veja ao vivo'), rep);
    const h = el('h3', null, name); h.id = 'vt-pv-t';
    const how = el('p', 'vt-how'); how.innerHTML = '<svg aria-hidden="true"><use href="#i-spark"/></svg>'; how.append(P.how);
    meta.append(row, h, el('p', 'vt-what', sum), how);
    const foot = el('div', 'vt-pv-foot');
    const cta = el('a', 'btn btn-primary btn-sm', 'Liberar os 40 efeitos'); cta.href = '#assinar'; cta.dataset.close = '';
    foot.append(el('p', 'vt-pv-note', 'Na apresentação, o efeito já entra com as cores e a fonte da sua marca.'), cta);
    card.append(top, stage, meta, foot);
    box.append(card);
    const S = {}, ctx = { card, say: t => ctx.E && ctx.E.say(t) };
    const inst = P.make(stage, S, ctx) || {};
    cur = inst;
    ctx.E = vtEdit(card, [...(P.ctl || []),
      { k: 'sp', t: 'range', label: 'Ritmo', min: .4, max: 2.5, step: .1, v: 1, fmt: vtX },
      { k: 'acc', t: 'acc', label: 'Cor', v: 'violeta' }
    ], (k, v, s, phase) => {
      if (k === 'acc') vtAcc(card, v);
      if (k === 'sp') stage.style.setProperty('--sp', v);
      inst.apply?.(k, v, phase);
    }, { S, reset: () => inst.reset?.() });
    h.after($('.vt-what', meta));
    if (REDUCED) rep.hidden = true; else rep.addEventListener('click', () => inst.replay?.());
    ctx.E.open(true);
    openModal('vt-prev');
    /* o foco vai para o primeiro controle da cena (ou para Editar), dentro do diálogo */
    setTimeout(() => (stage.querySelector('button, [tabindex="0"]') || $('.vt-edit', card))?.focus({ preventScroll: true }), 60);
    requestAnimationFrame(() => inst.start?.());
  };
}

/* 01 · Motion Graphics */
VT_PREV[1] = {
  how: 'Clique na cena para ver a abertura de novo',
  ctl: [{ k: 't', t: 'text', label: 'Título do capítulo', v: 'O plano', max: 22, wide: true }],
  make(st) {
    st.innerHTML = '<div class="pv-mg" aria-hidden="true"><i class="pv-mg-ring"></i><span class="pv-mg-k">Capítulo</span><b class="pv-mg-n">02</b><i class="pv-mg-line"></i><span class="pv-mg-t"></span></div><p class="sr-only"></p>';
    const w = $('.pv-mg', st), t = $('.pv-mg-t', st), sr = $('.sr-only', st), play = () => vtRe(w);
    st.addEventListener('click', play);
    return { start: play, replay: play, apply(k, v) { if (k === 't') { t.textContent = v.trim() || ' '; sr.textContent = 'Capítulo 2: ' + v; } } };
  }
};

/* 02 · Icon Motion */
VT_PREV[2] = {
  how: 'Passe o cursor ou clique num ícone',
  make(st) {
    const IC = [['Gráfico', 'M4 20V11M10 20V5M16 20v-7M2 20h20'], ['Alvo', 'M12 3a9 9 0 1 0 .01 0M12 8a4 4 0 1 0 .01 0M12 12h.01'],
      ['Faísca', 'M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5M5.3 5.3l3.5 3.5M15.2 15.2l3.5 3.5M18.7 5.3l-3.5 3.5M8.8 15.2l-3.5 3.5'], ['Tendência', 'M3 17l6-6 4 4 8-8M15 7h6v6']];
    st.innerHTML = '<div class="pv-ic">' + IC.map(([n, d], i) => `<button type="button" class="pv-ic-b" style="--i:${i}" aria-label="Ícone ${n}: desenhar de novo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" pathLength="1"/></svg><span>${n}</span></button>`).join('') + '</div>';
    const w = $('.pv-ic', st), play = () => vtRe(w);
    $$('.pv-ic-b', st).forEach(b => { const hit = () => vtRe(b, 'is-hit'); b.addEventListener('pointerenter', hit); b.addEventListener('click', hit); });
    return { start: play, replay: play };
  }
};

/* 05 · Hover Elevation */
VT_PREV[5] = {
  how: 'Passe o cursor nos cards · clique muda o nível',
  make(st, S, ctx) {
    const K = [['Receita', 'R$ 12,8 mi'], ['Clientes', '1.240'], ['Margem', '41%']];
    st.innerHTML = '<div class="pv-he">' + K.map(([k, v], i) => `<button type="button" class="pv-he-c" data-l="${i}"><span>${k}</span><b>${v}</b><em>Nível <i>${i}</i> de 3</em></button>`).join('') + '</div>';
    const cs = $$('.pv-he-c', st);
    cs.forEach(b => b.addEventListener('click', () => { const l = (+b.dataset.l + 1) % 4; b.dataset.l = l; $('i', b).textContent = l; ctx.say(`${$('span', b).textContent}: nível ${l} de 3.`); }));
    return { reset: () => cs.forEach((b, i) => { b.dataset.l = i; $('i', b).textContent = i; }) };
  }
};

/* 07 · Glassmorphism */
VT_PREV[7] = {
  how: 'Mova o cursor: o vidro flutua sobre o fundo',
  ctl: [{ k: 'blur', t: 'range', label: 'Desfoque', min: 0, max: 30, step: 1, v: 14, fmt: v => v + ' px' }],
  make(st) {
    st.innerHTML = '<div class="pv-gm"><i></i><i></i><i></i><div class="pv-gm-p"><span>Plateia agora</span><b>312</b><em>+48 nos últimos 5 min</em></div></div>';
    const p = $('.pv-gm-p', st);
    st.addEventListener('pointermove', e => { const r = st.getBoundingClientRect(); p.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * 28 + 'px'); p.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * 20 + 'px'); });
    st.addEventListener('pointerleave', () => { p.style.setProperty('--px', '0px'); p.style.setProperty('--py', '0px'); });
    return { apply(k, v) { if (k === 'blur') st.style.setProperty('--blur', v + 'px'); } };
  }
};

/* 08 · Animated Gradient */
VT_PREV[8] = {
  how: 'Clique na capa para girar a luz',
  ctl: [{ k: 't', t: 'text', label: 'Título da capa', v: 'Relatório anual 2027', max: 30, wide: true }],
  make(st, S, ctx) {
    st.innerHTML = '<div class="pv-ag"><p class="pv-ag-k">Halor apresenta</p><p class="pv-ag-t"></p></div>';
    const w = $('.pv-ag', st), t = $('.pv-ag-t', st); let a = 0;
    st.addEventListener('click', () => { a = (a + 1) % 3; w.style.setProperty('--pv-ang', [120, 210, 300][a] + 'deg'); ctx.say('A luz mudou de direção.'); });
    return { apply(k, v) { if (k === 't') t.textContent = vtNb(v.trim()) || ' '; }, reset() { a = 0; w.style.removeProperty('--pv-ang'); } };
  }
};

/* 09 · Parallax */
VT_PREV[9] = {
  how: 'Mova o cursor: cada camada anda num ritmo',
  ctl: [{ k: 'depth', t: 'range', label: 'Profundidade', min: 0, max: 2, step: .1, v: 1, fmt: vtPct }],
  make(st, S) {
    st.innerHTML = '<div class="pv-px" aria-hidden="true"><div class="pv-px-l" data-z="1">' + '<i></i>'.repeat(9) + '</div><div class="pv-px-l" data-z="2"><b class="pv-px-orb"></b></div><div class="pv-px-l" data-z="4"><div class="pv-px-card"><span>Meta 2027</span><b>+38%</b></div></div></div>';
    const ls = $$('.pv-px-l', st);
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, on = false, t0 = performance.now();
    const paint = () => ls.forEach(l => { const z = +l.dataset.z * (S.depth ?? 1) * 9; l.style.transform = `translate3d(${(x * z).toFixed(2)}px, ${(y * z).toFixed(2)}px, 0)`; });
    const tick = t => {
      if (!on) { const s = (t - t0) / 1000 * (S.sp || 1); tx = Math.sin(s * .7) * .6; ty = Math.cos(s * .5) * .4; }
      x += (tx - x) * .08; y += (ty - y) * .08; paint();
      raf = requestAnimationFrame(tick);
    };
    st.addEventListener('pointermove', e => { const r = st.getBoundingClientRect(); on = true; tx = ((e.clientX - r.left) / r.width - .5) * 2; ty = ((e.clientY - r.top) / r.height - .5) * 2; if (REDUCED) { x = tx; y = ty; paint(); } });
    st.addEventListener('pointerleave', () => { on = false; t0 = performance.now(); });
    return { start() { if (!REDUCED) raf = requestAnimationFrame(tick); }, stop() { cancelAnimationFrame(raf); }, apply() { if (REDUCED) paint(); } };
  }
};

/* 10 · Reveal / Mask Reveal */
VT_PREV[10] = {
  how: 'Clique na cena para revelar de novo',
  ctl: [{ k: 'dir', t: 'seg', label: 'Revelar', opts: [['l', 'Da esquerda'], ['b', 'De baixo']], v: 'l', wide: true }],
  make(st) {
    st.innerHTML = '<div class="pv-rv"><p class="pv-rv-b pv-rv-k" style="--i:0">Resultado do trimestre</p><p class="pv-rv-b pv-rv-t" style="--i:1">A margem subiu para 41%</p><div class="pv-rv-b pv-rv-img" style="--i:2" aria-hidden="true"><i style="--h:.4"></i><i style="--h:.55"></i><i style="--h:.7"></i><i style="--h:1"></i></div><p class="pv-rv-b pv-rv-c" style="--i:3">Fonte: painel financeiro, março de 2027</p></div>';
    const w = $('.pv-rv', st), play = () => vtRe(w);
    st.addEventListener('click', play);
    return { start: play, replay: play, apply(k, v, ph) { if (k === 'dir') { w.dataset.dir = v; if (!ph) play(); } } };
  }
};

/* 13 · Progress Motion */
VT_PREV[13] = {
  how: 'Toque em Sortear para novas notas',
  make(st, S, ctx) {
    const K = ['Atenção', 'Retenção', 'Ação'], V0 = [82, 64, 71];
    st.innerHTML = '<div class="pv-pg"><div class="pv-pg-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" class="t"/><circle cx="60" cy="60" r="50" class="v" pathLength="100"/></svg><b>0</b><span>Índice</span></div><div class="pv-pg-r"><ul>' + K.map(k => `<li><span>${k}</span><i><s></s><u title="Meta 75"></u></i><b>0</b></li>`).join('') + '</ul><button type="button" class="btn btn-ghost btn-xs pv-pg-go">Sortear</button></div></div>';
    const li = $$('li', st), ring = $('.pv-pg-ring', st), rb = $('b', ring);
    let cur = [0, 0, 0, 0], stop = null;
    const set = vals => {
      const idx = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length), to = [...vals, idx], from = cur.slice();
      li.forEach((l, i) => l.style.setProperty('--p', vals[i] / 100));
      $('.v', ring).style.strokeDashoffset = 100 - idx;
      stop?.();
      const draw = q => { cur = from.map((a, i) => a + (to[i] - a) * vtEase(q)); li.forEach((l, i) => { $('b', l).textContent = Math.round(cur[i]); }); rb.textContent = Math.round(cur[3]); };
      if (REDUCED) draw(1); else stop = vtTween(1300 / (S.sp || 1), draw);
      ctx.say(`Índice ${idx}. ${K.map((k, i) => `${k} ${vals[i]}`).join(', ')}.`);
    };
    $('.pv-pg-go', st).addEventListener('click', () => set(K.map(() => 35 + Math.round(Math.random() * 62))));
    return { start: () => set(V0), replay() { cur = [0, 0, 0, 0]; li.forEach(l => l.style.setProperty('--p', 0)); $('.v', ring).style.strokeDashoffset = 100; requestAnimationFrame(() => requestAnimationFrame(() => set(V0))); }, reset: () => set(V0), stop: () => stop?.() };
  }
};

/* 14 · Heatmap Animation */
VT_PREV[14] = {
  how: 'Passe o cursor nas células para ler o valor',
  make(st) {
    const D = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'], H = ['9h', '11h', '13h', '15h', '17h', '19h'];
    const V = D.map((d, i) => H.map((h, j) => Math.round(18 + 76 * Math.abs(Math.sin(i * 1.3 + j * .9 + 1)) * (j > 2 ? 1 : .72))));
    const flat = V.flat(), sorted = flat.slice().sort((a, b) => a - b), max = Math.max(...flat), hot = flat.indexOf(max);
    st.innerHTML = `<div class="pv-hm"><div class="pv-hm-g" role="img" aria-label="Mapa de calor de interações por dia e horário. Pico: ${D[Math.floor(hot / 6)]} às ${H[hot % 6]}, ${max} interações."></div><p class="pv-hm-o mono" aria-hidden="true"></p></div>`;
    const g = $('.pv-hm-g', st), out = $('.pv-hm-o', st);
    const def = `Pico: ${D[Math.floor(hot / 6)]} ${H[hot % 6]} · ${max} interações`;
    g.append(el('span'), ...H.map(h => el('span', 'pv-hm-h', h)));
    V.forEach((row, i) => { g.append(el('span', 'pv-hm-d', D[i])); row.forEach((v, j) => { const c = el('i'); c.style.setProperty('--v', ((v - 18) / (max - 18)).toFixed(2)); c.style.setProperty('--o', sorted.indexOf(v)); c.dataset.t = `${D[i]} ${H[j]} · ${v} interações`; g.append(c); }); });
    out.textContent = def;
    g.addEventListener('pointerover', e => { const c = e.target.closest('i'); if (c) out.textContent = c.dataset.t; });
    g.addEventListener('pointerleave', () => { out.textContent = def; });
    const play = () => vtRe(g);
    return { start: play, replay: play };
  }
};

/* 15 · Data Highlight */
VT_PREV[15] = {
  how: 'Clique numa barra para destacar só ela',
  make(st, S, ctx) {
    const R = [['Norte', 18], ['Nordeste', 26], ['Centro-Oeste', 21], ['Sudeste', 64], ['Sul', 42]];
    st.innerHTML = '<div class="pv-dh"><p class="pv-dh-t">Novos clientes por região</p><div class="pv-dh-b">' + R.map(([k, v]) => `<button type="button" aria-pressed="false" style="--h:${v / 64}"><b>${v}</b><i></i><span>${k}</span></button>`).join('') + '</div><p class="pv-dh-c mono" aria-hidden="true">Clique numa região</p></div>';
    const w = $('.pv-dh', st), bs = $$('.pv-dh-b button', st), cap = $('.pv-dh-c', st);
    const pick = i => {
      const on = bs[i].getAttribute('aria-pressed') !== 'true';
      bs.forEach((b, j) => b.setAttribute('aria-pressed', String(on && j === i)));
      w.classList.toggle('is-hl', on);
      const t = on ? `${R[i][0]}: ${R[i][1]} novos clientes, ${Math.round(R[i][1] / 171 * 100)}% do total` : 'Clique numa região';
      cap.textContent = t; ctx.say(on ? t + '.' : 'Destaque desligado.');
    };
    bs.forEach((b, i) => b.addEventListener('click', () => pick(i)));
    return { reset() { bs.forEach(b => b.setAttribute('aria-pressed', 'false')); w.classList.remove('is-hl'); cap.textContent = 'Clique numa região'; } };
  }
};

/* 17 · BPMN Flow Motion */
VT_PREV[17] = {
  how: 'A luz percorre o processo · clique numa etapa',
  make(st, S, ctx) {
    const K = ['Pedido', 'Análise', 'Aprovação', 'Entrega'];
    st.innerHTML = '<div class="pv-bp"><div class="pv-bp-row"><i class="pv-bp-line"></i><i class="pv-bp-dot"></i>' + K.map((k, i) => `<button type="button" aria-pressed="false"><span class="mono">${String(i + 1).padStart(2, '0')}</span>${k}</button>`).join('') + '</div><p class="pv-bp-c" aria-hidden="true"></p></div>';
    const bs = $$('.pv-bp-row button', st), dot = $('.pv-bp-dot', st), cap = $('.pv-bp-c', st);
    const CAP = ['O pedido entra pelo site.', 'A equipe analisa em até 2 horas.', 'O gestor aprova com um clique.', 'A entrega sai no mesmo dia.'];
    let at = 0, timer = 0, hold = 0;
    const go = i => {
      at = i; bs.forEach((b, j) => { b.setAttribute('aria-pressed', String(j === i)); b.classList.toggle('is-done', j < i); });
      const b = bs[i]; dot.style.left = b.offsetLeft + b.offsetWidth / 2 + 'px'; cap.textContent = CAP[i];
    };
    const loop = () => { clearTimeout(timer); timer = setTimeout(() => { if (Date.now() > hold) go((at + 1) % K.length); loop(); }, 1500 / (S.sp || 1)); };
    bs.forEach((b, i) => b.addEventListener('click', () => { hold = Date.now() + 4000; go(i); ctx.say(`${K[i]}: ${CAP[i]}`); }));
    return { start() { go(0); if (!REDUCED) loop(); }, replay() { hold = 0; go(0); loop(); }, stop: () => clearTimeout(timer) };
  }
};

/* 19 · Pulse / Beacon */
VT_PREV[19] = {
  how: 'Clique num ponto pulsante para marcar como visto',
  make(st, S, ctx) {
    const P = [['Pergunta da plateia', 24, 34], ['Enquete aberta', 62, 58], ['Comentário novo', 80, 26]];
    st.innerHTML = '<div class="pv-pb"><div class="pv-pb-s" aria-hidden="true"><i></i><i></i><i></i></div>' + P.map(([k, x, y]) => `<button type="button" aria-pressed="false" style="left:${x}%;top:${y}%"><span>${k}</span></button>`).join('') + '<button type="button" class="btn btn-ghost btn-xs pv-pb-r">Reativar</button></div>';
    const bs = $$('.pv-pb > button:not(.btn)', st);
    bs.forEach((b, i) => { b.setAttribute('aria-label', P[i][0] + ': pendente'); b.addEventListener('click', () => { const v = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(v)); b.setAttribute('aria-label', `${P[i][0]}: ${v ? 'visto' : 'pendente'}`); ctx.say(`${P[i][0]} ${v ? 'marcado como visto' : 'pendente de novo'}.`); }); });
    const on = () => bs.forEach((b, i) => { b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', P[i][0] + ': pendente'); });
    $('.pv-pb-r', st).addEventListener('click', on);
    return { reset: on };
  }
};

/* 20 · Ripple Interaction */
VT_PREV[20] = {
  how: 'Clique em qualquer ponto da cena',
  make(st, S, ctx) {
    st.innerHTML = '<div class="pv-rp"><button type="button" class="pv-rp-b" aria-pressed="false">Confirmar presença</button></div>';
    const w = $('.pv-rp', st), b = $('.pv-rp-b', st);
    const wave = (x, y) => {
      if (REDUCED) return;
      const r = w.getBoundingClientRect(), s = el('span', 'pv-rp-w');
      s.style.left = x - r.left + 'px'; s.style.top = y - r.top + 'px'; w.append(s);
      s.addEventListener('animationend', () => s.remove());
    };
    w.addEventListener('pointerdown', e => wave(e.clientX, e.clientY));
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { const r = b.getBoundingClientRect(); wave(r.left + r.width / 2, r.top + r.height / 2); } });
    b.addEventListener('click', () => { const v = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(v)); b.textContent = v ? 'Presença confirmada' : 'Confirmar presença'; ctx.say(b.textContent + '.'); });
    return { reset() { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Confirmar presença'; } };
  }
};

/* 22 · Expandable Card */
VT_PREV[22] = {
  how: 'Clique num card para abrir o detalhe',
  make(st) {
    const K = [['Por que agora', 'O cliente decide em março. Quem chegar antes define o padrão.'], ['O que muda', 'Um painel único no lugar de três planilhas e dois e-mails.'], ['Quanto custa', 'R$ 18 mil no trimestre, pago com a economia de horas.']];
    st.innerHTML = '<div class="pv-ex">' + K.map(([h, b], i) => `<div class="pv-ex-i"><button type="button" aria-expanded="${i === 0}" aria-controls="pv-ex-${i}"><span class="mono">${String(i + 1).padStart(2, '0')}</span>${h}<svg aria-hidden="true"><use href="#i-chev"/></svg></button><div class="pv-ex-b" id="pv-ex-${i}"><p>${b}</p></div></div>`).join('') + '</div>';
    const bs = $$('.pv-ex button', st);
    bs.forEach(b => b.addEventListener('click', () => { const on = b.getAttribute('aria-expanded') !== 'true'; bs.forEach(x => x.setAttribute('aria-expanded', String(on && x === b))); }));
    return { reset: () => bs.forEach((x, i) => x.setAttribute('aria-expanded', String(i === 0))) };
  }
};

/* 23 · Modal Focus */
VT_PREV[23] = {
  how: 'Clique num card para trazê-lo ao palco',
  make(st, S, ctx) {
    const K = [['Receita', 'R$ 12,8 mi', 'Alta de 38% puxada pelo Sudeste.'], ['Clientes', '1.240', '312 vieram por indicação.'], ['Prazo', '18 dias', 'Nove dias mais rápido que em 2026.']];
    st.innerHTML = '<div class="pv-mf"><div class="pv-mf-row">' + K.map(([k, v, d]) => `<button type="button" aria-pressed="false"><span>${k}</span><b>${v}</b><em>${d}</em></button>`).join('') + '</div></div>';
    const w = $('.pv-mf', st), bs = $$('.pv-mf-row button', st);
    const close = () => { bs.forEach(b => { b.setAttribute('aria-pressed', 'false'); b.style.removeProperty('--tx'); b.style.removeProperty('--ty'); }); w.classList.remove('has-f'); };
    bs.forEach((b, i) => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') { close(); ctx.say('Card de volta ao lugar.'); return; }
      close();
      const r = b.getBoundingClientRect(), s = w.getBoundingClientRect();
      b.style.setProperty('--tx', s.left + s.width / 2 - (r.left + r.width / 2) + 'px'); b.style.setProperty('--ty', s.top + s.height / 2 - (r.top + r.height / 2) + 'px');
      b.setAttribute('aria-pressed', 'true'); w.classList.add('has-f'); ctx.say(`${K[i][0]} em foco: ${K[i][1]}. ${K[i][2]}`);
    }));
    w.addEventListener('click', e => { if (!e.target.closest('button')) close(); });
    return { reset: close };
  }
};

/* 25 · Magnetic Button */
VT_PREV[25] = {
  how: 'Aproxime o cursor do botão',
  ctl: [{ k: 'mag', t: 'range', label: 'Força do ímã', min: 0, max: .8, step: .05, v: .35, fmt: vtPct }],
  make(st, S, ctx) {
    st.innerHTML = '<div class="pv-mb"><button type="button" class="pv-mb-b"><span>Começar agora</span></button></div>';
    const b = $('.pv-mb-b', st), w = $('.pv-mb', st);
    w.addEventListener('pointermove', e => {
      if (REDUCED) return;
      const r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy), f = d < 170 ? (S.mag ?? .35) : 0;
      b.style.setProperty('--mx', dx * f + 'px'); b.style.setProperty('--my', dy * f + 'px'); b.classList.toggle('is-near', d < 170);
    });
    w.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); b.classList.remove('is-near'); });
    b.addEventListener('click', () => { vtRe(b, 'is-hit'); ctx.say('Clique confirmado.'); });
    return {};
  }
};

/* 26 · Microinteractions */
VT_PREV[26] = {
  how: 'Toque em cada controle',
  make(st, S, ctx) {
    st.innerHTML = '<div class="pv-mi">' +
      '<button type="button" class="pv-mi-sw" role="switch" aria-checked="false"><i></i><span>Notificações</span></button>' +
      '<button type="button" class="pv-mi-lk" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg><span>Curtir</span><b>24</b></button>' +
      '<button type="button" class="pv-mi-ck" aria-pressed="false"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg></i><span>Revisar slide 3</span></button>' +
      '<button type="button" class="pv-mi-sv"><span>Salvar</span></button></div>';
    const sw = $('.pv-mi-sw', st), lk = $('.pv-mi-lk', st), ck = $('.pv-mi-ck', st), sv = $('.pv-mi-sv', st);
    let t = 0;
    sw.addEventListener('click', () => { const v = sw.getAttribute('aria-checked') !== 'true'; sw.setAttribute('aria-checked', String(v)); ctx.say(v ? 'Notificações ligadas.' : 'Notificações desligadas.'); });
    lk.addEventListener('click', () => { const v = lk.getAttribute('aria-pressed') !== 'true'; lk.setAttribute('aria-pressed', String(v)); $('b', lk).textContent = v ? 25 : 24; vtRe(lk, 'is-hit'); ctx.say(v ? 'Curtido.' : 'Curtida removida.'); });
    ck.addEventListener('click', () => { const v = ck.getAttribute('aria-pressed') !== 'true'; ck.setAttribute('aria-pressed', String(v)); ctx.say(v ? 'Tarefa concluída.' : 'Tarefa reaberta.'); });
    sv.addEventListener('click', () => {
      clearTimeout(t); sv.classList.remove('is-ok'); sv.classList.add('is-busy'); $('span', sv).textContent = 'Salvando';
      t = setTimeout(() => { sv.classList.remove('is-busy'); sv.classList.add('is-ok'); $('span', sv).textContent = 'Salvo'; ctx.say('Salvo.'); t = setTimeout(() => { sv.classList.remove('is-ok'); $('span', sv).textContent = 'Salvar'; }, 1800); }, REDUCED ? 0 : 900 / (S.sp || 1));
    });
    return { stop: () => clearTimeout(t) };
  }
};

/* 27 · Scroll Reveal */
VT_PREV[27] = {
  how: 'Role dentro da prévia: os blocos entram e saem',
  make(st) {
    const K = ['O problema', 'A virada', 'O número', 'O plano', 'O pedido', 'Obrigado'];
    st.innerHTML = '<div class="pv-sr" tabindex="0" aria-label="Área de rolagem da prévia"><p class="pv-sr-hint mono">Role para baixo</p>' + K.map((k, i) => `<div class="pv-sr-b"><span class="mono">${String(i + 1).padStart(2, '0')}</span><b>${k}</b></div>`).join('') + '</div>';
    const sc = $('.pv-sr', st);
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-in', e.isIntersecting)), { root: sc, threshold: .35 });
    $$('.pv-sr-b', st).forEach(b => io.observe(b));
    return { replay() { sc.scrollTo({ top: 0, behavior: 'smooth' }); }, stop: () => io.disconnect() };
  }
};

/* 28 · Sticky Storytelling */
VT_PREV[28] = {
  how: 'Role o texto: o visual fixo muda de fase',
  make(st) {
    const K = [['Antes', 'Três planilhas, dois e-mails e uma reunião para alinhar.'], ['Durante', 'Um painel junta tudo e a equipe decide junto.'], ['Depois', 'O relatório sai sozinho toda segunda-feira.']];
    st.innerHTML = '<div class="pv-ss" tabindex="0" aria-label="Área de rolagem da prévia"><div class="pv-ss-v" data-f="0" aria-hidden="true"><div class="pv-ss-o"><b>1</b><span>Antes</span></div></div><div class="pv-ss-t">' + K.map(([k, d], i) => `<div class="pv-ss-s" data-i="${i}"><span class="mono">Fase ${i + 1}</span><b>${k}</b><p>${d}</p></div>`).join('') + '</div></div>';
    const sc = $('.pv-ss', st), v = $('.pv-ss-v', st), o = $('.pv-ss-o', st);
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const i = +e.target.dataset.i; v.dataset.f = i; $('b', o).textContent = i + 1; $('span', o).textContent = K[i][0]; }), { root: sc, threshold: .6 });
    $$('.pv-ss-s', st).forEach(s => io.observe(s));
    return { replay() { sc.scrollTo({ top: 0, behavior: 'smooth' }); }, stop: () => io.disconnect() };
  }
};

/* 29 · Morphing Shapes */
VT_PREV[29] = {
  how: 'Troque a fase nos botões da cena',
  make(st, S, ctx) {
    const F = {
      silos: [[22, 50, 20, 14], [50, 50, 20, 14], [78, 50, 20, 14], [50, 50, 0, 50], [50, 50, 0, 50]],
      centro: [[50, 50, 36, 50], [50, 50, 36, 50], [50, 50, 36, 50], [50, 50, 0, 50], [50, 50, 0, 50]],
      rede: [[50, 48, 16, 50], [22, 26, 11, 50], [78, 26, 11, 50], [24, 72, 11, 50], [76, 72, 11, 50]]
    };
    const N = { silos: 'Silos', centro: 'Centro', rede: 'Rede' };
    st.innerHTML = '<div class="pv-mo"><div class="pv-mo-s" aria-hidden="true"><svg class="pv-mo-l" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 48L22 26M50 48L78 26M50 48L24 72M50 48L76 72"/></svg>' + '<i></i>'.repeat(5) + '</div><div class="pv-mo-c" role="group" aria-label="Fase da forma">' + Object.entries(N).map(([k, n]) => `<button type="button" data-f="${k}" aria-pressed="false">${n}</button>`).join('') + '</div></div>';
    const w = $('.pv-mo', st), is = $$('.pv-mo-s i', st), bs = $$('.pv-mo-c button', st);
    let timer = 0, auto = true;
    const go = f => { w.dataset.f = f; is.forEach((n, i) => { const [x, y, s, r] = F[f][i]; n.style.cssText = `left:${x}%;top:${y}%;width:${s}%;border-radius:${r}%;--d:${i * 60}ms`; }); bs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === f))); };
    const ORDER = ['silos', 'centro', 'rede'];
    const loop = () => { clearTimeout(timer); timer = setTimeout(() => { if (!auto) return; go(ORDER[(ORDER.indexOf(w.dataset.f) + 1) % 3]); loop(); }, 2200 / (S.sp || 1)); };
    bs.forEach(b => b.addEventListener('click', () => { auto = false; clearTimeout(timer); go(b.dataset.f); ctx.say('Fase: ' + N[b.dataset.f] + '.'); }));
    go('silos');
    return { start() { if (!REDUCED) loop(); }, replay() { auto = true; go('silos'); loop(); }, stop: () => clearTimeout(timer) };
  }
};

/* 31 · Shimmer / Holographic Sweep */
VT_PREV[31] = {
  how: 'Clique para carregar de novo',
  make(st) {
    st.innerHTML = '<div class="pv-sh"><div class="pv-sh-c"><div class="pv-sh-sk" aria-hidden="true"><i></i><i></i><i></i></div><div class="pv-sh-in"><span>Receita no ano</span><b>R$ 12,8 mi</b><em>+38% sobre 2026</em></div><i class="pv-sh-seal" aria-hidden="true">Verificado</i></div></div>';
    const c = $('.pv-sh-c', st);
    let t = 0;
    const play = () => { clearTimeout(t); c.classList.remove('is-done'); vtRe(c, 'is-load'); t = setTimeout(() => c.classList.add('is-done'), REDUCED ? 0 : 1700 / (parseFloat(getComputedStyle(st).getPropertyValue('--sp')) || 1)); };
    st.addEventListener('click', play);
    return { start: play, replay: play, stop: () => clearTimeout(t) };
  }
};

/* 32 · Floating Elements */
VT_PREV[32] = {
  how: 'Passe o cursor para pausar a órbita',
  ctl: [{ k: 'r', t: 'range', label: 'Raio da órbita', min: .6, max: 1.2, step: .05, v: 1, fmt: vtPct }],
  make(st) {
    const K = ['Dados', 'Plateia', 'Marca', 'Ritmo'];
    st.innerHTML = '<div class="pv-fe"><div class="pv-fe-core"><b>Halor</b></div><div class="pv-fe-orb">' + K.map((k, i) => `<span style="--a:${i * 90}deg"><i>${k}</i></span>`).join('') + '</div></div>';
    return { apply(k, v) { if (k === 'r') st.style.setProperty('--r', v); } };
  }
};

/* 34 · Carousel / Horizontal Gallery */
VT_PREV[34] = {
  how: 'Arraste para o lado ou use as setas',
  make(st, S, ctx) {
    const K = [['T1', 'Atenção', 'A capa que para a sala.'], ['T2', 'Ritmo', 'Um slide por ideia.'], ['T3', 'Prova', 'O número que convence.'], ['T4', 'Ação', 'O pedido no fim.'], ['T5', 'Memória', 'O que fica depois.']];
    st.innerHTML = '<div class="pv-ca"><div class="pv-ca-t" tabindex="0" aria-label="Galeria: use as setas">' + K.map(([n, k, d]) => `<div class="pv-ca-c"><span class="mono">${n}</span><b>${k}</b><p>${d}</p></div>`).join('') + '</div><div class="pv-ca-n"><button type="button" class="btn-icon" data-d="-1" aria-label="Anterior"><svg aria-hidden="true"><use href="#i-chev-r"/></svg></button><div class="pv-ca-dots" aria-hidden="true">' + '<i></i>'.repeat(K.length) + '</div><button type="button" class="btn-icon" data-d="1" aria-label="Próximo"><svg aria-hidden="true"><use href="#i-chev-r"/></svg></button></div></div>';
    const tr = $('.pv-ca-t', st), cs = $$('.pv-ca-c', st), ds = $$('.pv-ca-dots i', st);
    let at = 0;
    const near = () => { const c = tr.scrollLeft + tr.clientWidth / 2; let b = 0, bd = 1e9; cs.forEach((n, i) => { const d = Math.abs(n.offsetLeft + n.offsetWidth / 2 - c); if (d < bd) { bd = d; b = i; } }); return b; };
    const mark = () => { const i = near(); if (i !== at) { at = i; ctx.say(`${K[i][1]}, ${i + 1} de ${K.length}.`); } cs.forEach((n, j) => n.classList.toggle('is-on', j === i)); ds.forEach((d, j) => d.classList.toggle('is-on', j === i)); };
    const to = i => { i = vtClamp(i, 0, K.length - 1); const n = cs[i]; tr.scrollTo({ left: n.offsetLeft - (tr.clientWidth - n.offsetWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' }); };
    tr.addEventListener('scroll', () => requestAnimationFrame(mark), { passive: true });
    tr.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); to(near() + d); } });
    $$('.pv-ca-n button', st).forEach(b => b.addEventListener('click', () => to(near() + +b.dataset.d)));
    return { start: mark, replay: () => to(0), reset: () => to(0) };
  }
};

/* 36 · Tooltip / Contextual Info */
VT_PREV[36] = {
  how: 'Passe o cursor ou foque os pontos marcados',
  make(st) {
    const P = [[18, 70, 'Março: campanha nova no ar.'], [55, 43.3, 'Junho: entrada no Sul.'], [84, 16.7, 'Setembro: recorde de 84 mi.']];
    st.innerHTML = '<div class="pv-tt"><p class="pv-tt-t">Receita mensal <span class="mono">R$ mi</span></p><div class="pv-tt-a"><svg class="pv-tt-c" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 52 L12 48 L18 42 L30 40 L42 34 L55 26 L68 24 L76 16 L84 10 L100 8" /></svg>' + P.map(([x, y, t], i) => `<button type="button" class="pv-tt-p" style="left:${x}%;top:${y}%"><span class="sr-only">Detalhe ${i + 1}: </span><span class="pv-tt-tip">${t}</span></button>`).join('') + '</div></div>';
    return {};
  }
};

/* 38 · Timeline Motion */
VT_PREV[38] = {
  how: 'A linha se desenha · clique num marco',
  make(st, S, ctx) {
    const K = [['2023', 'Primeiro cliente'], ['2024', 'Time de 12 pessoas'], ['2025', 'Chegada ao Sul'], ['2026', 'R$ 84 mi no ano'], ['2027', 'Expansão para a América Latina']];
    st.innerHTML = '<div class="pv-tl"><div class="pv-tl-l"><i class="pv-tl-bar"></i>' + K.map(([y], i) => `<button type="button" style="--i:${i};left:${8 + i * 21}%" aria-pressed="${i === 4}"><span>${y}</span></button>`).join('') + '</div><p class="pv-tl-d" aria-live="off"></p></div>';
    const w = $('.pv-tl', st), bs = $$('.pv-tl-l button', st), d = $('.pv-tl-d', st);
    const pick = i => { bs.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i))); d.textContent = `${K[i][0]} · ${K[i][1]}`; };
    bs.forEach((b, i) => b.addEventListener('click', () => { pick(i); ctx.say(`${K[i][0]}: ${K[i][1]}.`); }));
    pick(4);
    const play = () => vtRe(w);
    return { start: play, replay: play, reset: () => pick(4) };
  }
};

/* 39 · Node Network Motion */
VT_PREV[39] = {
  how: 'Clique num nó: os vizinhos acendem',
  make(st, S, ctx) {
    const N = [['Halor', 50, 50], ['Marca', 20, 22], ['Dados', 80, 20], ['Plateia', 86, 62], ['Ritmo', 58, 86], ['Editor', 16, 70], ['Painel', 36, 82]];
    const E = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 5], [2, 3], [3, 4], [4, 6], [5, 6]];
    st.innerHTML = '<div class="pv-nn"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + E.map(([a, b]) => `<line x1="${N[a][1]}" y1="${N[a][2]}" x2="${N[b][1]}" y2="${N[b][2]}"/>`).join('') + '</svg>' + N.map(([k, x, y], i) => `<button type="button" class="${i ? '' : 'is-core'}" style="left:${x}%;top:${y}%;--i:${i}" aria-pressed="false">${k}</button>`).join('') + '<p class="pv-nn-c mono" aria-hidden="true">Toque num nó</p></div>';
    const w = $('.pv-nn', st), bs = $$('.pv-nn > button', st), ls = $$('.pv-nn line', st), cap = $('.pv-nn-c', st);
    const pick = i => {
      const on = bs[i].getAttribute('aria-pressed') !== 'true';
      const nb = new Set(); E.forEach(([a, b], j) => { const hit = on && (a === i || b === i); ls[j].classList.toggle('is-hi', hit); if (hit) nb.add(a === i ? b : a); });
      bs.forEach((b, j) => { b.setAttribute('aria-pressed', String(on && j === i)); b.classList.toggle('is-nb', nb.has(j)); });
      w.classList.toggle('is-dim', on);
      const t = on ? `${N[i][0]} se liga a ${[...nb].map(j => N[j][0]).join(', ')}` : 'Toque num nó';
      cap.textContent = t; ctx.say(on ? t + '.' : 'Rede sem destaque.');
    };
    bs.forEach((b, i) => b.addEventListener('click', () => pick(i)));
    return { reset() { if (bs.some(b => b.getAttribute('aria-pressed') === 'true')) pick(bs.findIndex(b => b.getAttribute('aria-pressed') === 'true')); } };
  }
};

/* 40 · Animated Shader / Hero */
VT_PREV[40] = {
  how: 'Mova o cursor: a luz acompanha',
  ctl: [{ k: 't', t: 'text', label: 'Título da capa', v: 'O ano em que a sala prestou atenção', max: 44, wide: true }],
  make(st, S, ctx) {
    st.innerHTML = '<canvas class="pv-sd-cv" aria-hidden="true"></canvas><div class="pv-sd"><p class="pv-sd-k">Abertura</p><p class="pv-sd-t"></p><i class="pv-sd-line"></i></div>';
    const cv = $('canvas', st), c2 = cv.getContext('2d'), t = $('.pv-sd-t', st);
    let W = 0, H = 0, raf = 0, mx = .5, my = .4, t0 = performance.now();
    const size = () => { const r = st.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; c2.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const col = () => { const s = getComputedStyle(ctx.card); return [s.getPropertyValue('--acc').trim(), s.getPropertyValue('--acc-hi').trim()]; };
    const draw = now => {
      const s = (now - t0) / 1000 * (S.sp || 1), [a, b] = col();
      c2.globalCompositeOperation = 'source-over'; c2.fillStyle = '#07040f'; c2.fillRect(0, 0, W, H);
      c2.globalCompositeOperation = 'lighter';
      const B = [[.3 + .18 * Math.sin(s * .5), .4 + .2 * Math.cos(s * .4), .6, a, .55], [.72 + .15 * Math.cos(s * .37), .55 + .2 * Math.sin(s * .45), .55, b, .3], [mx, my, .35, b, .35], [.5 + .3 * Math.sin(s * .23), .9, .7, a, .35]];
      B.forEach(([x, y, r, c, o]) => { const g = c2.createRadialGradient(x * W, y * H, 0, x * W, y * H, r * Math.max(W, H)); g.addColorStop(0, `rgba(${c}, ${o})`); g.addColorStop(1, `rgba(${c}, 0)`); c2.fillStyle = g; c2.fillRect(0, 0, W, H); });
      c2.globalCompositeOperation = 'source-over';
      c2.strokeStyle = `rgba(${b}, .12)`; c2.lineWidth = 1;
      for (let k = 0; k < 7; k++) { c2.beginPath(); for (let x = 0; x <= W; x += 12) { const y = H * (.2 + k * .1) + Math.sin(x / 70 + s * (.6 + k * .1) + k) * 14; x ? c2.lineTo(x, y) : c2.moveTo(x, y); } c2.stroke(); }
    };
    const loop = now => { draw(now); raf = requestAnimationFrame(loop); };
    st.addEventListener('pointermove', e => { const r = st.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; if (REDUCED) draw(performance.now()); });
    const ro = new ResizeObserver(() => { size(); draw(performance.now()); });
    return {
      start() { size(); ro.observe(st); if (REDUCED) draw(performance.now()); else raf = requestAnimationFrame(loop); },
      apply(k, v) { if (k === 't') t.textContent = vtNb(v.trim()) || ' '; if (k === 'acc' && REDUCED && W) requestAnimationFrame(() => draw(performance.now())); },
      stop() { cancelAnimationFrame(raf); ro.disconnect(); }
    };
  }
};
