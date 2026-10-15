/* ==========================================================================
   O FILME · 88 s: uma gravação de tela editada do Estúdio Halor, passo a passo
   Roteiro: o símbolo acende (Noite) → abra o Estúdio → escolha um modelo →
   edite o texto → troque a paleta → insira gráfico, ícone e cards → dê vida
   com efeitos → torne lúdico (votação e post-its) → Raio Halor → importe .pptx
   e .pdf → apresente ao vivo → baixe em HTML → abra em qualquer navegador →
   Faça cada olhar render.
   Relógio: cada cena recebe --lt (segundos). As telas do app usam data-o="0",
   então o relógio delas é o tempo global. As animações CSS ficam pausadas e
   guiadas por animation-delay; cursor, câmera, paleta, contadores e digitação
   são calculados aqui a partir do mesmo tempo, então qualquer ponto da trilha
   mostra o quadro exato.
   ========================================================================== */
const Film = (() => {
  const D = 88, END = 84;
  const STEPS = [
    { t: 4, n: 'Abra o Estúdio' }, { t: 10, n: 'Escolha um modelo' }, { t: 16, n: 'Edite o texto' },
    { t: 22.5, n: 'Troque a paleta' }, { t: 28.5, n: 'Insira gráficos, ícones e cards' }, { t: 35.5, n: 'Dê vida com efeitos' },
    { t: 41.5, n: 'Torne lúdico: votação e post-its' }, { t: 47.5, n: 'Raio Halor: veja onde cai o olhar' }, { t: 53.5, n: 'Importe .pptx e .pdf' },
    { t: 59.5, n: 'Apresente ao vivo' }, { t: 67.5, n: 'Baixe em HTML' }, { t: 75, n: 'Abra em qualquer navegador' }
  ];
  const CHAPTERS = [{ t: 0, n: 'Abertura' }].concat(STEPS.map((s, i) => ({ t: s.t, n: (i + 1) + ' · ' + s.n })), [{ t: END, n: 'Comece' }]);

  /* cursor: [tempo global, alvo]. Alvo = seletor dentro da janela, "x,y" em % da janela ou "!" (clique) */
  const CUR = [
    [4.5, '64,94'], [6, '.fh-st1'], [7.2, '.fh-st4'], [8.35, '.fh-st2'], [8.7, '!'],
    [10.8, '.fm-c3'], [11.6, '.fm-c2'], [12.3, '.fm-c1'], [12.6, '!'], [14.1, '.fm-use'], [14.5, '!'],
    [16.8, '.fe-cv .sl-h'], [17.3, '!'], [17.5, '!'], [20.5, '58,34'], [21.55, '.fi-tab-design'], [21.9, '!'],
    [23.3, '.fp-p2'], [23.7, '!'], [24.9, '.fp-p3'], [25.3, '!'], [26.5, '.fp-p1'], [26.9, '!'],
    [28.85, '.fe-rl li:nth-child(3)'], [29.2, '!'], [29.95, '.fr-chart'], [30.3, '!'], [31, '.fdd-col'], [31.35, '!'],
    [32.55, '.fr-icon'], [32.9, '!'], [33.75, '.fr-cards'], [34.1, '!'], [34.95, '.fe-cv .fs3-chart'], [35.3, '!'],
    [35.95, '.fr-fx'], [36.3, '!'], [37.5, '.flb-c2'], [37.9, '!'], [39.7, '.flb-use'], [40.1, '!'],
    [41.75, '.flb-chip-comp'], [42.1, '!'], [42.65, '.fe-rl li:nth-child(5)'], [42.95, '!'],
    [43.5, '.flc-vote'], [43.8, '!'], [44.9, '.fe-cv .fs5-z1'], [44.95, '!'],
    [45.3, '.flc-notes'], [45.6, '!'], [46.6, '.fe-cv .fs5-z2'], [46.65, '!'],
    [47.7, '.flb-x'], [48, '!'], [48.55, '.fe-rl li:nth-child(1)'], [48.85, '!'], [49.6, '.fr-ray'], [49.9, '!'], [51.9, '.fi-score'],
    [53.9, '-6,74'], [54.25, '-5,72'], [55.4, '.fe-cvw'], [55.45, '!'], [57, '70,64'], [58.7, '.fe-rail'],
    [59.75, '.fe-play'], [60.05, '!'], [61.6, '.fpl-next'], [62.3, '!'], [64.4, '76,62'], [67.25, '.fpl-exit'], [67.6, '!'],
    [68.55, '.fe-save'], [68.9, '!'], [69.75, '.fsv-o2'], [70.3, '.fsv-o1'], [70.6, '!'], [71.15, '.fsv-dl'], [71.45, '!'],
    [73.7, '.fdl-item'], [74.1, '!'], [76.6, '82,64'], [77.6, '.fwb-next'], [78, '!'], [79.9, '.fwb-next'], [80.3, '!'],
    [81.2, '.fwb-opt2'], [81.5, '!'], [83, '70,70']
  ];
  /* câmera: [tempo, duração do movimento, alvo, zoom, zoom no celular, alvo no celular].
     Alvo = seletor (centro), "seletor@fx,fy" (ponto relativo à caixa) ou "x,y" (% do palco) */
  const CAM = [
    [0, 0, '.fw', 1, 1],
    [4.4, 1.4, '.fh-main@.5,.42', 1.06, 1.75, '.fh-starts@.3,.5'],
    [7.3, 1, '.fh-st2', 1.22, 2.2, '.fh-starts@.25,.5'],
    [10.1, .9, '.fm-grid', 1.1, 1.9, '.fm-grid@.22,.5'],
    [12.9, 1, '.fm-main@.5,.62', 1.1, 2, '.fm-strip@.82,.5'],
    [15.6, .8, '.fw', 1, 1.35, '.fe-cvw'],
    [16.4, 1.1, '.fe-cvw@.5,.42', 1.9, 2.7, '.fe-sel1'],
    [20.4, 1, '.fe-body@.56,.46', 1.385, 1.95, '.fe-body@.7,.4'],
    [28.3, .9, '.fe@.42,.42', 1.18, 2, '.fe@.25,.42'],
    [32.2, .8, '.fe@.45,.45', 1.18, 2, '.fe-cvw@.62,.45'],
    [35.6, .9, '.fe-body@.62,.5', 1.16, 1.6, '.fe-body@.68,.48'],
    [36.6, .7, '.fe-body@.62,.5', 1.16, 2.1, '.flb'],
    [37.95, .7, '.fe-body@.62,.5', 1.16, 2, '.fe-cvw@.3,.55'],
    [39.4, .6, '.fe-body@.62,.5', 1.16, 2.1, '.flb-use'],
    [41.3, .8, '.fe-body@.55,.5', 1.08, 1.5, '.fe-body@.55,.5'],
    [48.1, .9, '.fe-cvw@.5,.5', 1.9, 2.15, '.fe-cvw'],
    [51.2, .9, '.fe-body@.7,.42', 1.2, 2.1, '.fi-score'],
    [53.4, .9, '.fw', 1, 1.25, '.fe-cvw@.3,.5'],
    [55.5, .7, '.fim', 1.2, 2.1],
    [58, .8, '.fe-body@.25,.45', 1.2, 2.1, '.fe-rail'],
    [59.5, .5, '.fe-acts', 1.3, 2.2, '.fe-play'],
    [60.25, .8, '.fw', 1, 1.3, '.fpl-stage@.5,.5'],
    [62.5, 1, '.fpl-stage@.3,.62', 1.22, 1.95],
    [64.7, 1.2, '.fpl-stage@.72,.62', 1.22, 1.95],
    [67.3, .5, '.fw', 1, 1.3, '.fe-cvw'],
    [68.2, .7, '.fe-acts', 1.4, 2.3, '.fe-save'],
    [69, .7, '.fsv', 1.2, 2, '.fsv@.5,.45'],
    [71.5, .9, '.fdl@.3,.5', 1.45, 1.7, '.fdl-item'],
    [74.15, .6, '.fw-tabs@.3,.5', 1.6, 1.6, '.fw-tab2'],
    [75.3, 1, '.fw', 1, 1.3, '.fwb-stage'],
    [80.4, .8, '.fwb-stage@.3,.6', 1.18, 2, '.fwb-poll'],
    [82.6, 1, '.fw', 1, 1.25, '.fwb-stage']
  ];
  /* paleta do slide: [tempo, matiz em graus, saturação] · Halor → Oceano → Coral → Halor */
  const PAL = [[0, 0, 1], [23.7, -82, 1.1], [25.3, 112, 1], [26.9, 0, 1]];
  // legenda final (no celular ela sobe para o lugar da legenda do passo)
  const LEG = [76.3, 80.3];
  // trilha: um sino por passo, subindo pela escala; acorde no fecho
  const CUES = [[.3, 0], [1.2, 7]].concat(STEPS.map((s, i) => [s.t, [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26][i]]), [[END + .3, 'chord']]);
  const TAU = Math.PI * 2;

  /* slides das miniaturas (renderizados por slideHTML) */
  const FS = {
    a1: { type: 'cover', k: 'Aula 4', h: 'Aprenda fazendo, em três rodadas.', sub: 'Onboarding · turma de outubro' },
    a2: { type: 'steps', k: 'Workshop', h: 'Ideias em três rodadas.', s: [['01', 'Explorar', 'Post-its'], ['02', 'Votar', 'Votação'], ['03', 'Decidir', 'Plano']] },
    a3: { type: 'tl', k: 'Trimestre', h: 'O trimestre em quatro marcos.', ms: [['Jul', 'Planejar', .1], ['Ago', 'Testar', .37], ['Set', 'Ajustar', .63], ['Out', 'Medir', .9]] },
    a4: { type: 'text', k: 'Treinamento', h: 'O time pronto em uma semana.', p: ['Cinco encontros curtos.', 'Prática em cada um.'] },
    m1: { type: 'cover', k: 'Kickoff', h: 'Título do projeto', sub: 'Time · data' },
    m2: { type: 'text', k: 'Aula 1', h: 'Aprenda fazendo.', p: ['Pergunta, votação e post-its.'] },
    m3: { type: 'kpi', k: 'Relatório', h: 'O projeto em um número.', big: '84', cap: 'dias do começo ao fim', bars: [[28, 'S4'], [56, 'S8'], [70, 'S10'], [84, 'S12']] },
    m4: { type: 'steps', k: 'Quem somos', h: 'Três frentes, um time.', s: [['01', 'Produto', 'Plataforma'], ['02', 'Design', 'Experiência'], ['03', 'Operação', 'Suporte']] },
    m5: { type: 'tl', k: 'Workshop', h: 'Quatro rodadas de ideias.', ms: [['10h', 'Abertura', .1], ['10h30', 'Ideias', .37], ['11h', 'Votação', .63], ['11h30', 'Plano', .9]] },
    m6: { type: 'end', h: 'Comece aqui.', sub: 'Kit de marca aplicado' },
    d1: { type: 'cover', k: 'Kickoff · 2027', h: 'Título do projeto', sub: 'Time de produto · 4 de novembro' },
    d2: { type: 'text', k: 'Contexto', h: 'Por que agora.', p: ['Três frentes, um só plano.', 'Começamos em 4 de novembro.'] },
    d3: { type: 'kpi', k: 'Meta', h: 'Do kickoff à entrega.', big: '84', cap: 'dias do kickoff à entrega', bars: [[28, 'S4'], [56, 'S8'], [70, 'S10'], [84, 'S12']] },
    d4: { type: 'tl', k: 'Cronograma', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] },
    d5: { type: 'steps', k: 'Sua vez', h: 'Qual frente começa primeiro?', s: [['01', 'Produto', 'Votação'], ['02', 'Design', 'Post-its'], ['03', 'Operação', 'Ao vivo']] },
    d6: { type: 'end', h: 'Vamos começar.', sub: 'Kickoff · 4 de novembro' },
    i1: { type: 'text', k: 'Planejamento Q4', h: 'Prioridades do trimestre.', p: ['Três frentes, um só plano.'] },
    i2: { type: 'tl', k: 'Pesquisa do piloto', h: 'O que o piloto mostrou.', ms: [['S1', 'Escuta', .1], ['S2', 'Testes', .37], ['S3', 'Ajustes', .63], ['S4', 'Relatório', .9]] }
  };

  let film, cv, ctx, fillEl, timeEl, chapEl, track, camEl, winEl, appSc;
  let scenes = [], state = 'poster', t = 0, last = 0, raf = 0, w = 0, h = 0, stars;
  let audio = null, soundOn = false, dragging = false, camLast = '', palLast = '', portrait = false, legOn = false;
  const A = {}, CK = [], MK = { pts: [], hov: [], drags: [], clicks: [], ok: false };
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => 1 - Math.pow(1 - clamp(v), 3);
  const eio = v => { v = clamp(v); return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
  const lin = v => clamp(v);
  const nums = s => s.trim().split(/\s+/).map(Number);
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const ranges = s => s.split('|').map(nums);

  function valAt(segs, lt, fn) {
    let v = segs[0][0];
    for (const [a, b, at, du] of segs) if (lt >= at) v = a + (b - a) * (REDUCED ? 1 : (fn || ease)((lt - at) / du));
    return v;
  }
  // posição de um elemento relativa a uma raiz posicionada, sem transformações
  function box(n, root) {
    const r = { x: 0, y: 0, w: n.offsetWidth, h: n.offsetHeight };
    while (n && n !== root) { r.x += n.offsetLeft; r.y += n.offsetTop; n = n.offsetParent; }
    return r;
  }

  /* · montagem: miniaturas, cópias dos slides no trilho e legendas dos passos · */
  function build() {
    $$('[data-slide]', film).forEach(e => { const s = FS[e.dataset.slide]; if (s) e.innerHTML = slideHTML(s, +(e.dataset.nSlide || 1), 'halor'); });
    $$('[data-clone]', film).forEach(e => { const src = $('[data-cs="' + e.dataset.clone + '"] .slide', film); if (src) e.innerHTML = src.outerHTML; });
    const caps = $('[data-caps]', film);
    STEPS.forEach((s, i) => {
      const sc = el('div', 'sc f-capsc');
      sc.dataset.from = (s.t + .05).toFixed(2); sc.dataset.to = ((STEPS[i + 1] ? STEPS[i + 1].t : END) - .15).toFixed(2);
      sc.dataset.fi = '.25'; sc.dataset.fo = '.2';
      sc.innerHTML = `<p class="f-cap fa fa-up" style="--at:0;--du:.45"><b>${i + 1}</b><span>${s.n}</span></p>`;
      caps.appendChild(sc);
    });
  }

  function parseScene(n) {
    const own = e => e.closest('.sc') === n;   // cada elemento obedece só à cena mais próxima
    const s = { n, from: +n.dataset.from, to: +n.dataset.to, o: n.dataset.o != null ? +n.dataset.o : +n.dataset.from, fi: n.dataset.fi != null ? +n.dataset.fi : .18, fo: n.dataset.fo != null ? +n.dataset.fo : .18, vis: false };
    s.counts = $$('[data-n]', n).filter(own).map(e => ({ e, segs: [nums(e.dataset.n)], dec: +(e.dataset.dec || 0), fn: e.dataset.ez === 'lin' ? lin : ease, ring: e.hasAttribute('data-ring'), last: null }));
    s.types = $$('[data-type]', n).filter(own).map(e => { const [at, du] = nums(e.dataset.type); return { e, at, du, full: e.textContent, last: -1 }; });
    s.ons = $$('[data-on]', n).filter(own).map(e => ({ e, r: ranges(e.dataset.on), last: null }));
    return s;
  }

  function init() {
    film = $('#film'); if (!film) return;
    cv = $('.film-cv', film); ctx = cv.getContext('2d');
    fillEl = $('.film-fill', film); timeEl = $('.film-time', film); chapEl = $('.film-chap', film); track = $('.film-track', film);
    camEl = $('.fw-cam', film); winEl = $('[data-cur]', film); appSc = camEl.closest('.sc');
    build();
    scenes = $$('.sc', film).map(parseScene);
    MK.cur = $('.fw-cur', winEl); MK.rip = $('.fw-rip', winEl);
    MK.way = CUR.map(([t0, tg]) => ({ t: t0, tg }));
    MK.clicks = MK.way.filter(x => x.tg === '!').map(x => x.t);
    MK.drags = $$('[data-drag]', winEl).map(e => { const [a, b] = nums(e.dataset.drag); return { e, a, b }; });
    MK.hovEls = $$('[data-hov]', winEl);
    stars = makeStars(90);
    CHAPTERS.slice(1).forEach(c => { const k = el('span', 'film-tick'); k.style.left = (c.t / D * 100) + '%'; k.title = c.n; track.appendChild(k); });
    new ResizeObserver(() => { resize(); measure(); render(); }).observe(film);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); render(); });
    $$('[data-film-play]').forEach(b => b.addEventListener('click', () => {
      if (!film.contains(b)) film.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
      if (state === 'playing') return; play();
    }));
    $('[data-film-toggle]', film).addEventListener('click', () => state === 'playing' ? pause() : play());
    $('[data-film-replay]', film).addEventListener('click', () => { seek(0); play(); });
    $('[data-film-sound]', film).addEventListener('click', e => toggleSound(e.currentTarget));
    film.addEventListener('dblclick', e => { if (e.target.closest('.film-bar, a, button')) return; fullscreen(); });
    // trilha de progresso: clique, arraste e teclado
    const pos = e => { const r = track.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width) * D; };
    track.addEventListener('pointerdown', e => { dragging = true; track.setPointerCapture(e.pointerId); seek(pos(e)); });
    track.addEventListener('pointermove', e => { if (dragging) seek(pos(e)); });
    track.addEventListener('pointerup', () => { dragging = false; });
    track.addEventListener('pointercancel', () => { dragging = false; });
    track.addEventListener('keydown', e => {
      const k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowUp') seek(t + 5); else if (k === 'ArrowLeft' || k === 'ArrowDown') seek(t - 5);
      else if (k === 'PageUp') seek(t + 10); else if (k === 'PageDown') seek(t - 10);
      else if (k === 'Home') seek(0); else if (k === 'End') seek(D - .1);
      else if (k === ' ' || k === 'Enter') { state === 'playing' ? pause() : play(); } else return;
      e.preventDefault();
    });
    document.addEventListener('halor:view', e => { if (e.detail !== 'v-site' && state === 'playing') pause(); });
    measure();
    render();
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight; if (!w) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  // alvo da câmera em coordenadas do palco (sem transformação)
  function camPoint(tg) {
    if (/^-?[\d.]+,-?[\d.]+$/.test(tg)) { const [x, y] = tg.split(',').map(Number); return { x: x / 100 * w, y: y / 100 * h }; }
    const [sel, rel] = tg.split('@'), e = $(sel, camEl);
    if (!e) return { x: w / 2, y: h / 2 };
    const b = box(e, camEl), [fx, fy] = rel ? rel.split(',').map(Number) : [.5, .5];
    return { x: b.x + b.w * fx, y: b.y + b.h * fy };
  }
  function measure() {
    if (!film || !film.offsetWidth) return;
    w = film.offsetWidth; h = film.offsetHeight; portrait = h > w;
    $$('[data-anchor]', film).forEach(n => { const b = box(n, film); A[n.dataset.anchor] = { x: b.x + b.w / 2, y: b.y + b.h / 2, w: b.w, h: b.h }; });
    A.win = box(winEl, camEl);
    CK.length = 0;
    for (const [t0, du, tg, z, zm, tgm] of CAM) { const p = camPoint(portrait && tgm ? tgm : tg); CK.push({ t: t0, du, x: p.x, y: p.y, z: portrait ? zm : z }); }
    MK.ok = false; camLast = '';
  }
  function measureMock() {
    const m = winEl, W = m.offsetWidth, H = m.offsetHeight; if (!W) return;
    let prev = { x: 50, y: 50 };
    MK.pts = MK.way.map(wp => {
      let p = prev;
      if (/^-?[\d.]+,-?[\d.]+$/.test(wp.tg)) { const [x, y] = wp.tg.split(',').map(Number); p = { x, y }; }
      else if (wp.tg !== '!') { const e = $(wp.tg, m); if (e) { const b = box(e, m); p = { x: (b.x + b.w * .5) / W * 100, y: (b.y + b.h * .55) / H * 100 }; } }
      prev = p; return p;
    });
    MK.hov = MK.hovEls.map(e => { const b = box(e, m); return { e, r: [b.x / W * 100, b.y / H * 100, (b.x + b.w) / W * 100, (b.y + b.h) / H * 100] }; });
    MK.ok = true;
  }

  function setState(s) {
    state = s; film.dataset.state = s;
    const b = $('[data-film-toggle]', film);
    $('use', b).setAttribute('href', s === 'playing' ? '#i-pause' : s === 'ended' ? '#i-replay' : '#i-play');
    b.setAttribute('aria-label', s === 'playing' ? 'Pausar' : s === 'ended' ? 'Assistir de novo' : 'Reproduzir');
  }
  function play() {
    if (state === 'ended' || t >= D - .05) t = 0;
    setState('playing'); last = performance.now();
    if (soundOn) audioStart();
    cancelAnimationFrame(raf); render(); raf = requestAnimationFrame(tick);
  }
  function pause() { setState('paused'); cancelAnimationFrame(raf); audioStop(); render(); }
  function tick(now) {
    const dt = Math.min(.25, (now - last) / 1000), t0 = t; last = now; t += dt;
    if (t >= D) { t = D; cues(t0, t); render(); setState('ended'); audioStop(); render(); return; }
    cues(t0, t); render(); raf = requestAnimationFrame(tick);
  }
  function seek(nt) {
    t = Math.max(0, Math.min(D - .05, nt));
    if (state === 'poster' || state === 'ended') setState('paused');
    render();
  }

  /* · quadro: cenas, câmera, cursor, paleta, barra e canvas · */
  function render() {
    for (const s of scenes) {
      const vis = t >= s.from && t < s.to + (REDUCED ? 0 : s.fo);
      if (vis !== s.vis) { s.vis = vis; s.n.classList.toggle('on', vis); }
      if (!vis) continue;
      let op = 1;
      if (!REDUCED) { if (s.fi > 0) op = Math.min(op, (t - s.from) / s.fi); if (t > s.to && s.fo > 0) op = Math.min(op, 1 - (t - s.to) / s.fo); }
      s.n.style.opacity = clamp(op).toFixed(3);
      const lt = t - s.o;
      s.n.style.setProperty('--lt', lt.toFixed(3));
      update(s, lt);
    }
    if (appSc.classList.contains('on')) { camFrame(); curFrame(); palFrame(); }
    const leg = t >= LEG[0] && t < LEG[1] + .35;
    if (leg !== legOn) { film.classList.toggle('leg-on', leg); legOn = leg; }
    barFrame(); draw();
  }
  function update(s, lt) {
    for (const c of s.counts) {
      const v = valAt(c.segs, lt, c.fn);
      if (c.ring) { const C = 207.3, str = (v / 100 * C).toFixed(1) + ' ' + C; if (str !== c.last) { c.e.style.strokeDasharray = str; c.last = str; } }
      else { const txt = c.dec ? (v / 10).toFixed(1).replace('.', ',') : String(Math.round(v)); if (txt !== c.last) { c.e.textContent = txt; c.last = txt; } }
    }
    for (const y of s.types) {
      const k = REDUCED ? (lt >= y.at ? 1 : 0) : clamp((lt - y.at) / y.du), n = Math.round(y.full.length * k);
      if (n !== y.last) { y.e.textContent = y.full.slice(0, n); y.last = n; }
      y.e.classList.toggle('typing', !REDUCED && lt >= y.at && lt < y.at + y.du + .5);
    }
    for (const o of s.ons) {
      const on = o.r.some(([a, b]) => lt >= a && lt < b);
      if (on !== o.last) { o.e.classList.toggle('act', on); o.last = on; }
    }
  }
  // câmera: zoom e enquadramento suaves; com movimento reduzido, cortes secos
  function camFrame() {
    if (!CK.length) return;
    const k = (tt, st, du) => REDUCED || du <= 0 ? (tt >= st ? 1 : 0) : eio((tt - st) / du);
    const mix = (a, b, q) => ({ x: a.x + (b.x - a.x) * q, y: a.y + (b.y - a.y) * q, z: a.z + (b.z - a.z) * q });
    let from = CK[0], to = CK[0], st = 0, du = 0;
    for (let i = 1; i < CK.length; i++) {
      if (t < CK[i].t) break;
      from = mix(from, to, k(CK[i].t, st, du)); to = CK[i]; st = CK[i].t; du = CK[i].du;
    }
    const c = mix(from, to, k(t, st, du)), z = Math.max(1, c.z);
    // enquadra dentro da janela quando o zoom permite; senão desliza até o palco inteiro
    const Wb = A.win, pad = w * .034;
    const axis = (p, size, lo, len) => {
      const v = size / z, inner = len + 2 * pad;
      if (v <= inner) return Math.max(lo - pad + v / 2, Math.min(lo + len + pad - v / 2, p));
      const s = clamp((v - inner) / Math.max(1, size - inner));
      return (lo + len / 2) + (size / 2 - (lo + len / 2)) * s;
    };
    const cx = axis(c.x, w, Wb.x, Wb.w), cy = axis(c.y, h, Wb.y, Wb.h);
    const tx = w / 2 - cx * z, ty = h / 2 - cy * z;
    const str = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${z.toFixed(4)})`;
    if (str !== camLast) { camEl.style.transform = str; camLast = str; }
  }
  function curFrame() {
    if (!MK.ok) measureMock();
    const wy = MK.way, P = MK.pts; if (!P.length) return;
    let i = 0; while (i < wy.length - 1 && t >= wy[i + 1].t) i++;
    let p;
    if (t <= wy[0].t || i >= wy.length - 1) p = P[t <= wy[0].t ? 0 : P.length - 1];
    else if (REDUCED) p = P[i];
    else { const k = eio((t - wy[i].t) / (wy[i + 1].t - wy[i].t)); p = { x: P[i].x + (P[i + 1].x - P[i].x) * k, y: P[i].y + (P[i + 1].y - P[i].y) * k }; }
    const shown = t >= wy[0].t && t < END - .2;
    MK.cur.style.left = p.x.toFixed(2) + '%'; MK.cur.style.top = p.y.toFixed(2) + '%';
    MK.cur.style.opacity = shown ? 1 : 0;
    MK.cur.classList.toggle('down', MK.clicks.some(c => t >= c - .06 && t < c + .1));
    let c = null; for (const ct of MK.clicks) if (t >= ct && t < ct + .45) c = ct;
    if (c == null || REDUCED) MK.rip.style.opacity = 0;
    else { const q = (t - c) / .45; MK.rip.style.left = p.x.toFixed(2) + '%'; MK.rip.style.top = p.y.toFixed(2) + '%'; MK.rip.style.opacity = (1 - q).toFixed(3); MK.rip.style.transform = 'scale(' + (.3 + q).toFixed(3) + ')'; }
    for (const o of MK.hov) {
      const vis = o.e.offsetParent !== null && !o.e.closest('.sc:not(.on)');
      o.e.classList.toggle('hov', shown && vis && p.x >= o.r[0] && p.x <= o.r[2] && p.y >= o.r[1] && p.y <= o.r[3]);
    }
    for (const d of MK.drags) {
      const on = t >= d.a && t < d.b; d.e.classList.toggle('act', on);
      if (on) { d.e.style.left = p.x.toFixed(2) + '%'; d.e.style.top = p.y.toFixed(2) + '%'; }
    }
  }
  // paleta: o matiz dos slides corre suave de uma paleta para a outra
  function palFrame() {
    let hue = PAL[0][1], sat = PAL[0][2];
    for (let i = 1; i < PAL.length; i++) {
      const [pt, ph, ps] = PAL[i]; if (t < pt) break;
      const q = REDUCED ? 1 : eio((t - pt) / .5), h0 = hue, s0 = sat;
      hue = h0 + (ph - h0) * q; sat = s0 + (ps - s0) * q;
    }
    const str = hue.toFixed(1) + '|' + sat.toFixed(3);
    if (str !== palLast) { film.style.setProperty('--hue', hue.toFixed(1)); film.style.setProperty('--sat', sat.toFixed(3)); palLast = str; }
  }
  function barFrame() {
    fillEl.style.width = (t / D * 100) + '%';
    timeEl.textContent = fmt(t) + ' / ' + fmt(D);
    let ch = CHAPTERS[0]; for (const c of CHAPTERS) if (t >= c.t) ch = c;
    track.setAttribute('aria-valuenow', String(Math.round(t)));
    track.setAttribute('aria-valuetext', Math.round(t) + ' de ' + D + ' segundos · ' + ch.n);
    if (chapEl.textContent !== ch.n) chapEl.textContent = ch.n;
  }

  /* · canvas: estrelas e arcos neon no pôster, na abertura e no fecho · */
  function glow(x, y, r, a) {
    if (r <= 0 || a <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,' + Math.min(1, a) + ')'); g.addColorStop(.22, 'rgba(201,166,255,' + a * .7 + ')'); g.addColorStop(1, 'rgba(139,61,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  function starsAt(u, a) {
    ctx.fillStyle = '#e9deff';
    for (const s of stars) { ctx.globalAlpha = a * (REDUCED ? .3 : Math.max(0, .2 + .3 * Math.sin(t * s.s * 1.5 + s.p))); ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r * u * 1.4, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function arcs(x, y, R, u, k, sp) {
    drawHaloArc(ctx, x, y, R, { rx: .66, ry: .66, rot: -.5, s: 3.3 + sp, len: 2.6 * k + .1, w: 2.2 * u * 1.6, sp: 0, o: .85 * k }, 0);
    drawHaloArc(ctx, x, y, R, { rx: .94, ry: .56, rot: -.25, s: 2.8 - sp * .6, len: 1.7 * k, w: 1.3 * u * 1.6, sp: 0, o: .5 * k }, 0);
  }
  function draw() {
    if (!w) return;
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, w, h);
    const u = Math.min(w, h * 16 / 9) / 1000, cx = w / 2, cy = h / 2, R = Math.min(w, h) * .5;
    ctx.globalCompositeOperation = 'lighter';
    if (state === 'poster') {
      starsAt(u, 1);
      drawHaloArc(ctx, cx, cy * 1.08, R * 1.1, { rx: .7, ry: .7, rot: 0, s: 3.5, len: 2.6, w: 2.2 * u * 1.6, sp: 0, o: .75 }, 0);
      drawHaloArc(ctx, cx, cy * 1.08, R * 1.1, { rx: .95, ry: .62, rot: .1, s: 4, len: 1.6, w: 1.2 * u * 1.6, sp: 0, o: .4 }, 0);
    } else if (t < 4.3) {                                   // abertura: o símbolo acende e os arcos giram atrás dele
      const mk = A.mark || { x: cx, y: cy * .8, w: R * .5 }, k = ease((t - .2) / 1.6), out = 1 - clamp((t - 3.6) / .6);
      starsAt(u, out);
      arcs(mk.x, mk.y, R * 1.25, u, k * out, t * .12);
      glow(mk.x, mk.y, mk.w * .7, .35 * k * out);
    } else if (t < END) {                                   // gravação: só um céu discreto atrás da janela
      starsAt(u, .5);
    } else {                                                // fecho: os arcos voltam e respiram
      const lt = t - END, mk = A.mark2 || { x: cx, y: cy * .7, w: R * .4 }, kk = ease((lt - .1) / 1.4);
      const br = REDUCED ? 1 : 1 + .03 * Math.sin(lt * TAU / 2.4);
      starsAt(u, 1);
      arcs(cx, cy * 1.04, R * 1.1 * br, u, kk, lt * .06);
      glow(mk.x, mk.y, mk.w * .8 * br, .3 * kk);
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  /* · som: um pad grave, um sino por passo e cliques suaves do cursor (só depois do clique) · */
  function audioInit() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    const ac = new AC(), master = ac.createGain(), lp = ac.createBiquadFilter();
    master.gain.value = 0; lp.type = 'lowpass'; lp.frequency.value = 480; lp.connect(master); master.connect(ac.destination);
    [[55, 'sawtooth', .08], [82.41, 'sawtooth', .06], [110, 'sine', .2], [164.81, 'sine', .07]].forEach(([f, ty, gv], i) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = ty; o.frequency.value = f; o.detune.value = i * 5; g.gain.value = gv; o.connect(g); g.connect(lp); o.start();
    });
    const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = .08; lg.gain.value = 220; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    return { ac, master };
  }
  function audioStart() { if (!audio) audio = audioInit(); if (!audio) return; audio.ac.resume(); audio.master.gain.setTargetAtTime(.05, audio.ac.currentTime, .5); }
  function audioStop() { if (audio) audio.master.gain.setTargetAtTime(0, audio.ac.currentTime, .25); }
  function bell(semi, vol, len) {
    const ac = audio.ac, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = 523.25 * Math.pow(2, semi / 12);
    g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(vol, ac.currentTime + .02); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + len);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + len + .1);
  }
  function click() {
    const ac = audio.ac, o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(1900, ac.currentTime); o.frequency.exponentialRampToValueAtTime(700, ac.currentTime + .04);
    f.type = 'highpass'; f.frequency.value = 500;
    g.gain.setValueAtTime(.05, ac.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .06);
    o.connect(f); f.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + .08);
  }
  function cues(a, b) {
    if (!audio || !soundOn || state !== 'playing') return;
    for (const [ct, n] of CUES) if (ct > a && ct <= b) { if (n === 'chord') [-12, 0, 4, 7, 12].forEach(s => bell(s, .03, 3.4)); else bell(n, .04, 1.6); }
    for (const ct of MK.clicks) if (ct > a && ct <= b) click();
  }
  function toggleSound(b) {
    soundOn = !soundOn;
    b.setAttribute('aria-pressed', String(soundOn));
    b.setAttribute('aria-label', soundOn ? 'Desativar som' : 'Ativar som');
    $('use', b).setAttribute('href', soundOn ? '#i-sound' : '#i-mute');
    if (soundOn && state === 'playing') audioStart(); else audioStop();
  }
  function fullscreen() {
    try { if (document.fullscreenElement) document.exitFullscreen(); else film.requestFullscreen().catch(() => {}); } catch (e) {}
  }
  return { init };
})();
