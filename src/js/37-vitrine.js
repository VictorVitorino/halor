/* ==========================================================================
   VITRINE DE EFEITOS
   Filtro por intenção, palco com 12 demos ao vivo e catálogo dos 40 efeitos.
   Cada demo é uma fábrica que devolve { start, resume, pause, replay, still }.
   start: primeira entrada na tela · resume/pause: entra e sai da tela
   replay: botão Repetir · still: quadro final para quem pede menos movimento.
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
  vtCatalog(sec, live);
  vtFilter(sec);
  vtDemos(sec);
}

/* · Catálogo · */
function vtCatalog(sec, live) {
  const ul = $('#vt-cat', sec);
  VT_FX.forEach(([n, name, fam, ints, dose, sum]) => {
    const li = el('li'); li.dataset.intents = ints;
    const card = live[n];
    const it = el(card ? 'button' : 'div', 'vt-item');
    const top = el('div', 'vt-item-top');
    top.append(el('span', 'vt-item-n', String(n).padStart(2, '0')), el('span', 'vt-item-c', fam));
    if (card) top.append(el('span', 'vt-live', 'Ao vivo'));
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
    li.append(it); ul.append(li);
  });
  /* só 8 à mostra; o card + leva para a escolha do plano */
  const plus = el('li', 'vt-plus');
  const a = el('a', 'vt-item vt-plus-card'); a.href = '#assinar';
  a.append(el('span', 'vt-plus-ic', '+'), el('p', 'vt-item-t', 'Mais 32 efeitos'), el('p', 'vt-item-s', 'Escolha um plano e libere todos no Estúdio.'));
  plus.append(a); ul.append(plus);
}

/* · Filtro por intenção (vale para o palco e para o catálogo) · */
function vtFilter(sec) {
  const chips = $$('.vt-chip', sec), wrap = $('#vt-chips', sec), stage = $('#vt-stage', sec);
  const cards = $$('.vt-card', sec), items = $$('#vt-cat li:not(.vt-plus)', sec);
  const empty = $('#vt-empty', sec), count = $('#vt-count', sec), status = $('#vt-status', sec);
  const cat = $('#vt-cat', sec), more = $('#vt-more', sec);
  /* no celular o catálogo abre com 8 itens e um botão para ver todos */
  const SHOW = 8, plusT = $('.vt-plus .vt-item-t', sec);
  more.hidden = true;
  const moreSync = n => { plusT.textContent = n > SHOW ? `Mais ${n - SHOW} efeitos` : 'Todos os efeitos'; };
  const pop = n => { if (REDUCED) return; n.classList.remove('is-in'); void n.offsetWidth; n.classList.add('is-in'); };
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
    count.textContent = `${Math.min(ni, SHOW)} de ${VT_FX.length}`;
    moreSync(ni);
    status.textContent = k === 'todos' ? `Todos os efeitos: ${ni} no catálogo, ${nd} ao vivo.` : `${VT_INTENT[k]}: ${ni} efeitos no catálogo, ${nd} ao vivo.`;
  };
  chips.forEach(c => c.addEventListener('click', () => { if (c.getAttribute('aria-pressed') !== 'true') apply(c.dataset.intent); }));
  const edge = () => wrap.classList.toggle('at-end', wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
  wrap.addEventListener('scroll', edge, { passive: true });
  window.addEventListener('resize', edge, { passive: true });
  edge();
  apply('todos');
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
  const box = $('.vt-pa', card), cv = $('canvas', box), ctx = cv.getContext('2d');
  let W = 0, H = 0, P = [], pulses = [], running = false, raf = 0, last = 0;
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
  const seed = burst => {
    const n = Math.round(vtClamp(W * H / 3600, 40, 120));
    P = Array.from({ length: n }, () => {
      const tx = Math.random() * W, ty = Math.random() * H;
      const p = { x: tx, y: ty, vx: 0, vy: 0, bx: (Math.random() - .5) * .34, by: (Math.random() - .5) * .34, r: .7 + Math.random() * 1.7 };
      if (burst) { p.x = W / 2 + (Math.random() - .5) * 10; p.y = H / 2 + (Math.random() - .5) * 10; p.vx = (tx - p.x) * .05; p.vy = (ty - p.y) * .05; }
      return p;
    });
  };
  const pulse = (x, y) => { pulses.push({ x, y, t: 0 }); if (!running) draw(); };
  const step = dt => {
    const k = dt / 16.67, fr = Math.pow(.95, k), R = 120;
    pulses.forEach(q => { q.t += dt / 1100; });
    pulses = pulses.filter(q => q.t < 1);
    const maxR = Math.hypot(W, H) * .6;
    for (const p of P) {
      if (m.on) {
        const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / R) * .9 * k; p.vx += dx / d * f; p.vy += dy / d * f; }
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
    ctx.clearRect(0, 0, W, H);
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
      ctx.strokeStyle = `rgba(169, 112, 255, ${.08 + bi * .13})`;
      ctx.beginPath();
      for (let i = 0; i < s.length; i += 4) { ctx.moveTo(s[i], s[i + 1]); ctx.lineTo(s[i + 2], s[i + 3]); }
      ctx.stroke();
    });
    if (m.on) {
      ctx.beginPath();
      for (const p of P) { const d = Math.hypot(p.x - m.x, p.y - m.y); if (d < 170) { ctx.moveTo(m.x, m.y); ctx.lineTo(p.x, p.y); } }
      ctx.strokeStyle = 'rgba(244, 238, 255, .16)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(m.x, m.y, 118, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201, 166, 255, .22)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    for (const p of P) {
      if (p.r > 2) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(139, 61, 255, .22)'; ctx.fill(); }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.r > 1.9 ? '#ffffff' : 'rgba(201, 166, 255, .85)'; ctx.fill();
    }
    for (const q of pulses) {
      ctx.beginPath(); ctx.arc(q.x, q.y, q.t * Math.hypot(W, H) * .6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(244, 238, 255, ${(1 - q.t) * .7})`; ctx.lineWidth = 2; ctx.stroke();
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
  box.addEventListener('pointerdown', e => { at(e); if (!REDUCED) pulse(m.x, m.y); });
  box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!REDUCED) pulse(W / 2, H / 2); } });
  new ResizeObserver(() => { if (!P.length) return; if (size()) { if (!running) draw(); } }).observe(box);
  return {
    start() { if (!size()) return; seed(true); resume(); },
    resume, pause,
    replay() { pulses = []; seed(true); pulse(W / 2, H / 2); resume(); },
    still() { if (!size()) return; seed(false); draw(); }
  };
};

/* ---------------------------------------------------------------- 03 · 04 · Tilt / Hologram */
VT_DEMO.tilt = card => {
  const box = $('.vt-ti', card), c = $('.vt-ti-card', box), MAX = 16;
  let tx = 0, ty = 0, rx = 0, ry = 0, mx = 50, my = 50, tmx = 50, tmy = 50, manual = false, running = false, raf = 0, t0 = performance.now(), hold = 0;
  const apply = () => {
    c.style.setProperty('--rx', rx.toFixed(2) + 'deg'); c.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    c.style.setProperty('--mx', mx.toFixed(1) + '%'); c.style.setProperty('--my', my.toFixed(1) + '%');
  };
  const frame = t => {
    if (!running) return;
    if (!manual) {
      const s = (t - t0) / 1000;
      ty = Math.sin(s * .8) * 11; tx = Math.cos(s * .6) * 6;
      tmx = 50 + ty * 3.2; tmy = 50 - tx * 3.2;
    }
    rx += (tx - rx) * .09; ry += (ty - ry) * .09; mx += (tmx - mx) * .09; my += (tmy - my) * .09;
    apply();
    raf = requestAnimationFrame(frame);
  };
  box.addEventListener('pointermove', e => {
    if (REDUCED) return;
    const r = c.getBoundingClientRect();
    const px = vtClamp((e.clientX - r.left) / r.width, -.15, 1.15), py = vtClamp((e.clientY - r.top) / r.height, -.15, 1.15);
    manual = true; clearTimeout(hold);
    ty = vtClamp((px - .5) * 2 * MAX, -MAX, MAX); tx = vtClamp(-(py - .5) * 2 * MAX, -MAX, MAX);
    tmx = px * 100; tmy = py * 100;
  });
  box.addEventListener('pointerleave', () => { tx = ty = 0; tmx = tmy = 50; hold = setTimeout(() => { manual = false; t0 = performance.now(); }, 900); });
  c.addEventListener('keydown', e => {
    const k = { ArrowLeft: [0, -5], ArrowRight: [0, 5], ArrowUp: [5, 0], ArrowDown: [-5, 0] }[e.key];
    if (!k || REDUCED) return;
    e.preventDefault(); manual = true; clearTimeout(hold);
    tx = vtClamp(tx + k[0], -MAX, MAX); ty = vtClamp(ty + k[1], -MAX, MAX);
    tmx = 50 + ty * 3; tmy = 50 - tx * 3;
    hold = setTimeout(() => { manual = false; t0 = performance.now(); }, 2500);
  });
  const resume = () => { if (running || REDUCED) return; running = true; raf = requestAnimationFrame(frame); };
  const pause = () => { running = false; cancelAnimationFrame(raf); };
  return {
    start: resume, resume, pause,
    replay() { manual = false; t0 = performance.now(); ry = -38; rx = 10; resume(); },
    still() { rx = 6; ry = -12; mx = 30; my = 30; apply(); }
  };
};

/* ---------------------------------------------------------------- 12 · Counter Animation */
VT_DEMO.count = card => {
  const vals = $$('.vt-co-v', card), bars = $$('.vt-co-bar', card);
  let raf = 0;
  const render = (v, i, e) => {
    const d = +(v.dataset.dec || 0);
    v.textContent = (v.dataset.pre || '') + (+v.dataset.to * e).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + (v.dataset.suf || '');
    bars[i].style.setProperty('--p', e.toFixed(3));
  };
  const run = () => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const tick = t => {
      let done = true;
      vals.forEach((v, i) => {
        const p = vtClamp((t - t0 - 250 - i * 180) / 1800);
        if (p < 1) done = false;
        render(v, i, p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
      });
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  if (!REDUCED) vals.forEach((v, i) => render(v, i, 0));
  return { start: run, replay: run, still: () => vals.forEach((v, i) => render(v, i, 1)) };
};

/* ---------------------------------------------------------------- 24 · Spotlight / Focus */
VT_DEMO.spot = card => {
  const box = $('.vt-sp', card), cap = $('.vt-sp-cap', box), btns = $$('.vt-sp-ctl button', box);
  const CAPS = {
    1: 'Passo 1 · Tudo começa na compra: 100.',
    2: 'Passo 2 · O estoque leva 4 pontos.',
    3: 'Passo 3 · O frete leva 9. É aqui que a margem vaza.',
    free: 'Livre · o foco segue o seu cursor.'
  };
  let step = 0, timer = 0, auto = false;
  const place = (x, y, r, instant) => {
    if (instant) box.classList.add('is-free');
    box.style.setProperty('--vt-sx', x + 'px'); box.style.setProperty('--vt-sy', y + 'px');
    if (r) box.style.setProperty('--vt-sr', r + 'px');
    if (instant && step !== 'free') { void box.offsetWidth; box.classList.remove('is-free'); }
  };
  const toNode = (k, instant) => {
    const n = $(`.vt-sp-node[data-step="${k}"]`, box); if (!n) return;
    const r = n.getBoundingClientRect(), b = box.getBoundingClientRect();
    place(r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top, Math.max(r.width, r.height) * 1.25, instant);
  };
  const go = (k, fromUser) => {
    if (fromUser) { auto = false; clearTimeout(timer); }
    const first = box.classList.contains('is-off');
    step = k;
    btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.go === String(k))));
    box.classList.toggle('is-free', k === 'free');
    cap.textContent = CAPS[k];
    if (k === 'free') { const b = box.getBoundingClientRect(); if (first) place(b.width / 2, b.height * .4, 84, true); else box.style.setProperty('--vt-sr', '84px'); }
    else toNode(k, first);
    box.classList.remove('is-off');
  };
  const next = () => {
    if (!auto) return;
    const s = typeof step === 'number' ? step : 0;
    if (s >= 3) { auto = false; return; }
    timer = setTimeout(() => { go(s + 1); next(); }, s === 0 ? 350 : 2300);
  };
  btns.forEach(b => b.addEventListener('click', () => go(b.dataset.go === 'free' ? 'free' : +b.dataset.go, true)));
  box.addEventListener('pointermove', e => {
    if (step !== 'free') return;
    const b = box.getBoundingClientRect();
    place(e.clientX - b.left, e.clientY - b.top);
  });
  new ResizeObserver(() => { if (typeof step === 'number' && step > 0) toNode(step, true); }).observe(box);
  box.classList.add('is-off');
  return {
    start() { auto = true; step = 0; next(); },
    resume() { if (auto && !timer) next(); },
    pause() { clearTimeout(timer); timer = 0; },
    replay() { clearTimeout(timer); box.classList.add('is-off'); auto = true; step = 0; next(); },
    still() { go(3); }
  };
};

/* ---------------------------------------------------------------- 33 · Card Stack */
VT_DEMO.stack = card => {
  const pile = $('.vt-st-pile', card), cards = $$('.vt-st-card', pile), live = $('.vt-st-live', card);
  let order = cards.map((_, i) => i), busy = false;
  const label = c => `Capítulo ${c.querySelector('span').textContent.replace(' / ', ' de ')}: ${c.querySelector('b').textContent}. ${c.querySelector('p').textContent}`;
  const layout = () => order.forEach((ci, o) => {
    const c = cards[ci];
    c.style.setProperty('--o', o);
    c.classList.toggle('is-top', o === 0);
    c.tabIndex = o === 0 ? 0 : -1;
    c.setAttribute('aria-hidden', String(o !== 0));
  });
  cards.forEach(c => { c.setAttribute('role', 'button'); c.setAttribute('aria-label', label(c) + ' Pressione Enter para o próximo.'); });
  const next = (dir = 1) => {
    if (busy) return; busy = true;
    const c = cards[order[0]], had = document.activeElement === c;
    c.classList.remove('is-drag');
    c.style.setProperty('--dx', dir * pile.offsetWidth * 1.15 + 'px');
    c.style.setProperty('--dr', dir * 16 + 'deg');
    setTimeout(() => {
      order.push(order.shift());
      c.style.removeProperty('--dx'); c.style.removeProperty('--dr');
      layout();
      live.textContent = label(cards[order[0]]);
      if (had) cards[order[0]].focus({ preventScroll: true });
      busy = false;
    }, REDUCED ? 0 : 260);
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
    if (Math.abs(dx) > 70 || Math.abs(dx) < 5) next(dx < -70 ? -1 : 1);
    else { c.classList.remove('is-drag'); c.style.removeProperty('--dx'); c.style.removeProperty('--dr'); }
  };
  pile.addEventListener('pointerup', up);
  pile.addEventListener('pointercancel', up);
  pile.addEventListener('keydown', e => {
    if (!e.target.classList.contains('is-top')) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); next(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); next(-1); }
  });
  layout();
  return {
    replay() { order = cards.map((_, i) => i); layout(); },
    still: layout
  };
};

/* ---------------------------------------------------------------- 16 · Chart Build */
VT_DEMO.chart = card => {
  const plot = $('.vt-ch-plot', card), svg = $('.vt-ch-svg', card), tip = $('.vt-ch-tip', card), range = $('.vt-range', card);
  const Q = ['1T25', '2T25', '3T25', '4T25', '1T26', '2T26', '3T26', '4T26'];
  const R = [42, 48, 51, 57, 63, 70, 76, 84], M = [45, 48, 52, 55, 58, 62, 66, 70];
  let g = null, prog = REDUCED ? 1 : 0, stop = null;
  const ns = (t, a, parent) => { const n = svgEl(t, a); (parent || svg).append(n); return n; };
  const build = () => {
    const W = plot.clientWidth, H = plot.clientHeight; if (!W || !H) return;
    [...svg.querySelectorAll(':scope > :not(title)')].forEach(n => n.remove());
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const L = 30, Rt = W - 58, T = 20, B = H - 22, band = (Rt - L) / Q.length, bw = Math.min(46, band * .58);
    const y = v => B - (v / 100) * (B - T), xc = i => L + band * i + band / 2;
    const uid = card.id + '-c';
    const defs = ns('defs');
    const clip = ns('clipPath', { id: uid }, defs); ns('rect', { x: 0, y: 0, width: W, height: B }, clip);
    const mask = ns('mask', { id: uid + 'm' }, defs);
    const lineD = M.map((v, i) => `${i ? 'L' : 'M'}${xc(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    const mPath = ns('path', { d: lineD, fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }, mask);
    const gridG = ns('g');
    [0, 25, 50, 75, 100].forEach(v => {
      ns('line', { x1: L, x2: Rt, y1: y(v), y2: y(v), class: v ? 'vt-ch-grid' : 'vt-ch-base' }, gridG);
    });
    const yl = ns('g', { class: 'vt-ch-axis' });
    [0, 50, 100].forEach(v => { const t = ns('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'vt-ch-lbl' }, yl); t.textContent = v; });
    const xl = ns('g', { class: 'vt-ch-axis' });
    Q.forEach((q, i) => { if (band < 44 && i % 2 === 0) return; const t = ns('text', { x: xc(i), y: H - 4, 'text-anchor': 'middle', class: 'vt-ch-lbl' }, xl); t.textContent = q; });
    const barsG = ns('g', { 'clip-path': `url(#${uid})` });
    const bars = R.map((v, i) => {
      const hit = ns('rect', { x: xc(i) - band / 2, y: T, width: band, height: B - T, class: 'vt-ch-hit', tabindex: 0, role: 'img', 'aria-label': `${Q[i]}: receita ${v}, meta ${M[i]}` });
      const r = ns('rect', { x: xc(i) - bw / 2, width: bw, rx: 4, y: B, height: 0, class: 'vt-ch-bar' + (i === R.length - 1 ? ' is-hi' : '') }, barsG);
      const show = () => {
        r.classList.add('is-hov');
        tip.hidden = false;
        tip.textContent = `${Q[i]} · Receita ${v} · Meta ${M[i]}`;
        tip.style.left = vtClamp(xc(i), 80, W - 80) + 'px'; tip.style.top = y(Math.max(v, M[i])) + 'px';
      };
      const hide = () => { r.classList.remove('is-hov'); tip.hidden = true; };
      hit.addEventListener('pointerenter', show); hit.addEventListener('pointerleave', hide);
      hit.addEventListener('focus', show); hit.addEventListener('blur', hide);
      return r;
    });
    const line = ns('path', { d: lineD, class: 'vt-ch-meta', mask: `url(#${uid}m)` });
    const len = line.getTotalLength();
    mPath.setAttribute('stroke-dasharray', len);
    const dots = M.map((v, i) => ns('circle', { cx: xc(i), cy: y(v), r: 4.5, class: 'vt-ch-dot' }));
    const labs = ns('g');
    const v0 = ns('text', { x: xc(R.length - 1), y: y(R[R.length - 1]) - 8, 'text-anchor': 'middle', class: 'vt-ch-val' }, labs); v0.textContent = R[R.length - 1];
    const v2 = ns('text', { x: xc(M.length - 1) + bw / 2 + 8, y: y(M[M.length - 1]) + 4, 'text-anchor': 'start', class: 'vt-ch-lbl' }, labs); v2.textContent = 'Meta ' + M[M.length - 1];
    g = { bars, mPath, len, dots, labs, xl, yl, y, B };
    render(prog);
  };
  const render = p => {
    prog = p; if (!g) return;
    const pb = vtClamp(p / .45);
    g.bars.forEach((r, i) => { const e = vtEase(vtClamp((pb - i * .07) / .51)); const h = (g.B - g.y(R[i])) * e; r.setAttribute('y', g.B - h); r.setAttribute('height', h + (h > 0 ? 4 : 0)); });
    g.mPath.setAttribute('stroke-dashoffset', g.len * (1 - vtEase(vtClamp((p - .45) / .3))));
    const pd = vtClamp((p - .68) / .17);
    g.dots.forEach((d, i) => { const e = vtClamp(pd * g.dots.length - i); d.setAttribute('r', (4.5 * vtEase(e)).toFixed(2)); d.style.opacity = e > 0 ? 1 : 0; });
    const pl = vtClamp((p - .84) / .16);
    [g.labs, g.xl, g.yl].forEach(n => { n.style.opacity = pl; });
    range.value = Math.round(p * 100);
    range.style.setProperty('--v', p * 100 + '%');
    range.setAttribute('aria-valuetext', p < .45 ? 'Barras crescendo' : p < .75 ? 'Meta se desenhando' : p < .9 ? 'Pontos surgindo' : 'Gráfico completo');
  };
  const play = () => { stop?.(); render(0); stop = vtTween(2800, p => render(p), () => { stop = null; }); };
  range.addEventListener('input', () => { stop?.(); stop = null; render(range.value / 100); });
  new ResizeObserver(() => build()).observe(plot);
  return { start: play, replay: play, still: () => render(1) };
};

/* ---------------------------------------------------------------- 21 · Flip Card */
VT_DEMO.flip = card => {
  const cs = $$('.vt-fl-card', card), all = $('.vt-fl-all', card);
  let timers = [];
  const set = (c, on) => {
    c.setAttribute('aria-pressed', String(on));
    c.setAttribute('aria-label', `${c.dataset.k}. ${on ? 'Depois' : 'Antes'}: ${on ? c.dataset.b : c.dataset.a}`);
  };
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  cs.forEach(c => { set(c, false); c.addEventListener('click', () => { clear(); set(c, c.getAttribute('aria-pressed') !== 'true'); }); });
  all.addEventListener('click', () => { clear(); const on = cs.some(c => c.getAttribute('aria-pressed') !== 'true'); cs.forEach((c, i) => timers.push(setTimeout(() => set(c, on), i * 120))); });
  const intro = delay => { clear(); cs.forEach((c, i) => timers.push(setTimeout(() => set(c, true), delay + i * 260))); };
  return {
    start: () => intro(600),
    replay() { clear(); cs.forEach(c => set(c, false)); intro(900); },
    still: () => cs.forEach(c => set(c, true))
  };
};

/* ---------------------------------------------------------------- 37 · Before / After */
VT_DEMO.ba = card => {
  const box = $('.vt-ba-box', card), knob = $('.vt-ba-knob', box);
  let p = 50, stop = null, drag = false;
  const set = v => {
    p = vtClamp(v, 0, 100);
    box.style.setProperty('--p', p.toFixed(2) + '%');
    const r = Math.round(p);
    knob.setAttribute('aria-valuenow', r);
    knob.setAttribute('aria-valuetext', r >= 100 ? 'Só o antes' : r <= 0 ? 'Só o depois' : `${r}% antes, ${100 - r}% depois`);
  };
  const fromX = x => { const r = box.getBoundingClientRect(); return (x - r.left) / r.width * 100; };
  box.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' && !e.target.closest('.vt-ba-knob')) return;
    stop?.(); stop = null; drag = true;
    box.setPointerCapture(e.pointerId); set(fromX(e.clientX));
  });
  box.addEventListener('pointermove', e => { if (drag) set(fromX(e.clientX)); });
  box.addEventListener('pointerup', () => { drag = false; });
  box.addEventListener('pointercancel', () => { drag = false; });
  knob.addEventListener('keydown', e => {
    const s = e.shiftKey ? 10 : 5;
    const v = { ArrowLeft: p - s, ArrowDown: p - s, ArrowRight: p + s, ArrowUp: p + s, Home: 0, End: 100 }[e.key];
    if (v == null) return;
    e.preventDefault(); stop?.(); stop = null; set(v);
  });
  const sweep = () => {
    stop?.(); set(100);
    stop = vtTween(1200, q => set(100 - 72 * vtEase(q)), () => { stop = vtTween(700, q => set(28 + 22 * vtEase(q)), () => { stop = null; }); });
  };
  set(REDUCED ? 50 : 100);
  return { start: sweep, replay: sweep, still: () => set(50) };
};

/* ---------------------------------------------------------------- 35 · Interactive Matrix */
VT_DEMO.matrix = card => {
  const plot = $('.vt-mx-plot', card), leg = $('.vt-mx-leg', card), qs = $$('.vt-mx-q', plot);
  const QN = ['Ganhos rápidos', 'Grandes apostas', 'Ajustes finos', 'Evitar'];
  const START = [['Painel', 22, 26], ['Capa nova', 36, 40], ['Treino', 72, 30], ['Migração', 78, 76], ['Relatório', 30, 74]];
  const quad = (x, y) => (x >= 50 ? 1 : 0) + (y >= 50 ? 2 : 0);
  const bs = START.map(([name, x, y], i) => {
    const b = el('button', 'vt-mx-b', name);
    b.type = 'button'; b.dataset.x = x; b.dataset.y = y; b.style.setProperty('--d', i * 90 + 'ms');
    plot.append(b); return b;
  });
  const place = b => {
    const x = +b.dataset.x, y = +b.dataset.y, q = quad(x, y);
    b.style.left = x + '%'; b.style.top = y + '%';
    b.classList.toggle('is-q0', q === 0);
    b.setAttribute('aria-label', `${b.textContent}: ${QN[q]}. Use as setas para mover.`);
  };
  const tally = () => {
    const n = [0, 0, 0, 0];
    bs.forEach(b => n[quad(+b.dataset.x, +b.dataset.y)]++);
    leg.innerHTML = '';
    QN.forEach((q, i) => { const s = el('span', '', q + ' '); s.append(el('b', '', String(n[i]))); leg.append(s); });
  };
  const hot = q => qs.forEach((d, i) => d.classList.toggle('is-hot', i === q));
  let drag = null;
  bs.forEach(b => {
    b.addEventListener('pointerdown', e => { drag = b; b.setPointerCapture(e.pointerId); b.classList.add('is-drag'); b.style.setProperty('--d', '0ms'); });
    b.addEventListener('pointermove', e => {
      if (drag !== b) return;
      const r = plot.getBoundingClientRect();
      b.dataset.x = vtClamp((e.clientX - r.left) / r.width * 100, 6, 94).toFixed(1);
      b.dataset.y = vtClamp((e.clientY - r.top) / r.height * 100, 8, 92).toFixed(1);
      place(b); hot(quad(+b.dataset.x, +b.dataset.y));
    });
    const end = () => { if (drag !== b) return; drag = null; b.classList.remove('is-drag'); hot(-1); tally(); };
    b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
    b.addEventListener('keydown', e => {
      const s = e.shiftKey ? 15 : 5;
      const d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
      if (!d) return;
      e.preventDefault(); b.style.setProperty('--d', '0ms');
      b.dataset.x = vtClamp(+b.dataset.x + d[0], 6, 94); b.dataset.y = vtClamp(+b.dataset.y + d[1], 8, 92);
      place(b); tally();
    });
  });
  const reset = () => { bs.forEach((b, i) => { b.dataset.x = START[i][1]; b.dataset.y = START[i][2]; b.style.setProperty('--d', i * 90 + 'ms'); place(b); }); tally(); };
  reset();
  return { replay: reset, still: reset };
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
  const E = [['dados', 'motor'], ['crm', 'motor'], ['motor', 'painel'], ['motor', 'sala'], ['painel', 'sala']];
  const DEF = 'Toque num nó para ver as ligações';
  const links = E.map(([a, b]) => {
    const [ax, ay] = N[a], [bx, by] = N[b];
    const d = ax === bx ? `M${ax} ${ay} C${ax + 46} ${ay + 40}, ${bx + 46} ${by - 40}, ${bx} ${by}` : `M${ax} ${ay} C${(ax + bx) / 2} ${ay}, ${(ax + bx) / 2} ${by}, ${bx} ${by}`;
    const base = svgEl('path', { d, class: 'vt-fw-base' }), flow = svgEl('path', { d, class: 'vt-fw-flow' });
    svg.append(base, flow);
    return { a, b, base, flow, len: 0 };
  });
  let pinned = null, timers = [];
  const btns = {};
  Object.entries(N).forEach(([k, [x, y, name]], i) => {
    const b = el('button', 'vt-fw-n' + (k === 'motor' ? ' is-core' : ''), name);
    b.type = 'button'; b.style.left = x / 4 + '%'; b.style.top = y / 2.4 + '%'; b.style.setProperty('--i', i);
    b.setAttribute('aria-pressed', 'false');
    btns[k] = b; box.append(b);
  });
  const hi = k => {
    const on = !!k;
    svg.classList.toggle('is-dim', on); box.classList.toggle('is-dim', on);
    Object.entries(btns).forEach(([n, b]) => { b.classList.toggle('is-hi', n === k); b.classList.remove('is-nb'); });
    links.forEach(l => {
      const t = on && (l.a === k || l.b === k);
      l.base.classList.toggle('is-hi', t); l.flow.classList.toggle('is-hi', t);
      if (t) btns[l.a === k ? l.b : l.a].classList.add('is-nb');
    });
    cap.textContent = on ? N[k][3] : DEF;
  };
  Object.entries(btns).forEach(([k, b]) => {
    b.addEventListener('pointerenter', () => { if (!pinned) hi(k); });
    b.addEventListener('pointerleave', () => { if (!pinned) hi(null); });
    b.addEventListener('focus', () => { if (!pinned) hi(k); });
    b.addEventListener('blur', () => { if (!pinned) hi(null); });
    b.addEventListener('click', () => {
      pinned = pinned === k ? null : k;
      Object.entries(btns).forEach(([n, x]) => x.setAttribute('aria-pressed', String(n === pinned)));
      hi(pinned || k);
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
  return { start: draw, replay() { pinned = null; Object.values(btns).forEach(x => x.setAttribute('aria-pressed', 'false')); hi(null); draw(); } };
};
