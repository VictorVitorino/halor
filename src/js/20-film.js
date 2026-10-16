/* ==========================================================================
   O FILME · 88 s: uma gravação de tela editada do Estúdio Halor, passo a passo
   Roteiro: o símbolo acende (Noite) → abra o Estúdio → escolha um modelo →
   edite o texto → troque a paleta → insira gráfico, ícone e cards → dê vida
   com efeitos → torne lúdico (votação e post-its) → Raio Halor → importe .pptx
   e .pdf → apresente ao vivo → baixe em HTML → abra em qualquer navegador →
   Faça cada olhar render.
   Relógio: cada cena tem o seu tempo local (lt, em segundos), gravado como --lt
   em cada elemento animado dela. As telas do app usam data-o="0",
   então o relógio delas é o tempo global. As animações CSS ficam pausadas e
   guiadas por animation-delay; cursor, câmera, paleta, contadores e digitação
   são calculados aqui a partir do mesmo tempo, então qualquer ponto da trilha
   mostra o quadro exato.
   Câmera: poucos movimentos, cada um com 1,2 a 2 s e pausas de verdade entre
   eles. O zoom anda em escala logarítmica e o ponto fixo da transformação fica
   parado na tela (zoom ancorado), então o quadro nunca escorrega de lado
   durante uma aproximação. Nas pausas, um avanço lento (quase imperceptível)
   mantém o quadro vivo. Nas trocas de tela e de slide, a antiga some antes de a nova
   entrar (passagem pelo fundo), sem dupla exposição.
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

  /* cursor: [tempo de chegada, alvo]. Alvo = seletor dentro da janela, "x,y" em % da janela ou "!" (clique).
     O cursor espera parado e só sai a tempo de chegar: um movimento curto, em leve arco, como uma mão de verdade. */
  const CUR = [
    [4.5, '64,94'], [6, '.fh-st1'], [7.2, '.fh-st4'], [8.35, '.fh-st2'], [8.7, '!'],
    [10.8, '.fm-c3'], [11.6, '.fm-c2'], [12.3, '.fm-c1'], [12.6, '!'], [14.1, '.fm-use'], [14.5, '!'],
    [17.1, '.fe-cv .sl-h'], [17.3, '!'], [17.5, '!'], [20.5, '58,34'], [21.55, '.fi-tab-design'], [21.9, '!'],
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
    [81.85, '.fwb-opt2'], [82.15, '!'], [83, '70,70']
  ];
  /* câmera: [início, duração, alvo, zoom máximo]. Uma lista para o palco largo e outra para o celular (4:5).
     Alvo = seletor, "a+b" (enquadra a união das caixas, com folga, até o zoom máximo), "alvo@fx,fy"
     (ponto relativo à caixa, com o zoom pedido) ou "x,y" (% do palco). Os quadros ficam dentro da janela.
     Regras: nada de afastar e voltar a aproximar em menos de 2,5 s; o cursor chega com a câmera quase parada. */
  const CAM_D = [
    [0, 0, '.fw', 1],
    [4.5, 2, '.fh-main@.5,.46', 1.13],
    [12.65, 1.7, '.fm-main@.56,.66', 1.3],
    [15.5, 1.7, '.fe-cvw@.5,.44', 1.45],
    [20.05, 1.6, '.fe-body@.6,.47', 1.2],
    [27.3, 1.8, '.fe@.43,.42', 1.14],
    [34.9, 1.8, '.fe-body@.6,.5', 1.17],
    [49.95, 1.8, '.fr-ray+.fe-cvw+.fi-score', 1.45],
    [53.45, 2, '.fw', 1],
    [59.95, 1.9, '.fpl-stage', 1.12],
    [62.9, 2, '.fpl-stage@.5,.6', 1.28],
    [67.65, 1.2, '.fsv@.5,.42', 1.3],
    [71.5, 1.75, '.fdl@.32,.5', 1.3],
    [74.15, 1.9, '.fw', 1.1],
    [80.45, 1.4, '.fwb-stage@.3,.6', 1.3],
    [83.4, 2, '.fw', 1]
  ];
  const CAM_M = [
    [0, 0, '.fw', 1],
    [4.5, 2, '.fh-starts@.38,.5', 1.7],
    [12.65, 1.7, '.fm-strip@.74,.5', 1.7],
    [15.5, 1.7, '.fe-sel1', 2.1],
    [20.05, 1.6, '.fe-body@.7,.42', 2.1],
    [27.25, 1.95, '.fe-rail+.fe-cvw', 1.6],
    [34.9, 1.9, '.fe-cvw+.flb@.6,.5', 1.3],
    [40.15, 1.55, '.fw@.5,.5', 1.06],
    [49.95, 1.9, '.fe-cvw+.fi-score@.5,.5', 1.45],
    [57.75, 2, '.fw@.5,.5', 1.06],
    [62.35, 1.7, '.fpl-stage@.27,.6', 1.9],
    [64.95, 1.75, '.fpl-stage@.76,.6', 1.9],
    [67.65, 1.2, '.fsv+.fe-save', 1.6],
    [71.5, 1.8, '.fdl@.3,.5', 1.4],
    [74.15, 1.9, '.fw@.5,.5', 1.06],
    [80.4, 1.6, '.fwb-poll', 1.9],
    [83.4, 2, '.fw@.5,.5', 1]
  ];
  /* paleta do slide: [tempo, matiz em graus, saturação] · Halor → Oceano → Coral → Halor */
  const PAL = [[0, 0, 1], [23.7, -82, 1.1], [25.3, 112, 1], [26.9, 0, 1]];
  // trilha: um sino por passo, subindo pela escala; acorde no fecho
  const CUES = [[.3, 0], [1.2, 7]].concat(STEPS.map((s, i) => [s.t, [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26][i]]), [[END + .55, 'chord']]);
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

  let film, cv, ctx, fillEl, timeEl, chapEl, track, camEl, winEl, appSc, capsEl, legSc, palEls = [];
  let scenes = [], state = 'poster', t = 0, last = 0, raf = 0, w = 0, h = 0, stars;
  let audio = null, soundOn = false, dragging = false, camLast = '', palLast = '', portrait = false, legLast = null, idleT = 0;
  const A = {}, CK = [], MK = { pts: [], hov: [], drags: [], clicks: [], ok: false };
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => 1 - Math.pow(1 - clamp(v), 3);
  const sine = v => .5 - .5 * Math.cos(Math.PI * clamp(v));                       // fusões e avanço lento
  const smoother = v => { v = clamp(v); return v * v * v * (v * (v * 6 - 15) + 10); };  // câmera: começa e para sem tranco
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
    // uma legenda sai por completo antes da próxima entrar (no mesmo lugar, nunca se sobrepõem)
    const caps = $('[data-caps]', film);
    STEPS.forEach((s, i) => {
      const sc = el('div', 'sc f-capsc');
      sc.dataset.from = s.t.toFixed(2); sc.dataset.to = ((STEPS[i + 1] ? STEPS[i + 1].t : END) - .34).toFixed(2);
      sc.dataset.fi = '.4'; sc.dataset.fo = '.34';
      sc.innerHTML = `<p class="f-cap fa fa-cap" style="--at:0;--du:.6"><b>${i + 1}</b><span>${s.n}</span></p>`;
      caps.appendChild(sc);
    });
  }

  function parseScene(n) {
    const own = e => e.closest('.sc') === n;   // cada elemento obedece só à cena mais próxima
    const s = { n, from: +n.dataset.from, to: +n.dataset.to, o: n.dataset.o != null ? +n.dataset.o : +n.dataset.from, fi: n.dataset.fi != null ? +n.dataset.fi : .3, fo: n.dataset.fo != null ? +n.dataset.fo : .3, fw: +(n.dataset.fw || 0), rc: +(n.dataset.rc || 0), fz: +(n.dataset.fz || 0), vis: false, tf: '', lt: '' };
    // o relógio (--lt) vai direto em cada elemento animado da cena: a propriedade não é herdada,
    // então mudar o tempo recalcula só esses elementos e não a árvore inteira da janela a cada quadro
    s.anims = $$('.fa, .fd, .f-lux', n).filter(own);
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
    capsEl = $('[data-caps]', film); legSc = scenes.find(s => s.n.classList.contains('f-legsc')); palEls = $$('.fw-pal', film);
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
    ['pointermove', 'pointerdown', 'keydown'].forEach(ev => film.addEventListener(ev, wake));
    measure();
    render();
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight; if (!w) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  /* · câmera: quadros-chave medidos no palco (sem transformação) · */
  // margem dos quadros em volta da janela e folga ao enquadrar uma união de caixas
  const PAD = .018, FIT = .05;
  function camKey(tg, zmax) {
    let x = w / 2, y = h / 2, z = zmax;
    if (/^-?[\d.]+,-?[\d.]+$/.test(tg)) { const [px, py] = tg.split(',').map(Number); x = px / 100 * w; y = py / 100 * h; }
    else {
      const [sels, rel] = tg.split('@');
      let u = null;
      for (const sel of sels.split('+')) {
        const e = $(sel, camEl); if (!e) continue;
        const b = box(e, camEl);
        u = u ? { x: Math.min(u.x, b.x), y: Math.min(u.y, b.y), r: Math.max(u.r, b.x + b.w), b: Math.max(u.b, b.y + b.h) } : { x: b.x, y: b.y, r: b.x + b.w, b: b.y + b.h };
      }
      if (u) {
        const bw = u.r - u.x, bh = u.b - u.y;
        if (rel) { const [fx, fy] = rel.split(',').map(Number); x = u.x + bw * fx; y = u.y + bh * fy; }
        else { x = u.x + bw / 2; y = u.y + bh / 2; z = Math.min(zmax, w / (bw * (1 + 2 * FIT)), h / (bh * (1 + 2 * FIT))); }
      }
    }
    return camFit({ px: x, py: y }, Math.max(1, z));
  }
  function camFit(k, z) { k.z = z; k.x = camAxis(k.px, w, A.win.x, A.win.w, z); k.y = camAxis(k.py, h, A.win.y, A.win.h, z); return k; }
  // mantém o quadro dentro da janela (com folga); com zoom baixo, desliza até o palco inteiro
  function camAxis(p, size, lo, len, z) {
    const v = size / z, pad = w * PAD, inner = len + 2 * pad;
    if (v <= inner) return Math.max(lo - pad + v / 2, Math.min(lo + len + pad - v / 2, p));
    const s = clamp((v - inner) / Math.max(1, size - inner));
    return (lo + len / 2) + (size / 2 - (lo + len / 2)) * s;
  }
  // movimento ancorado: zoom em escala logarítmica e o ponto fixo da transformação parado na tela.
  // Entre dois quadros válidos, as bordas do quadro andam sempre num só sentido, então nada sai da janela.
  function camMix(a, b, s) {
    const L = Math.log(b.z / a.z), z = a.z * Math.exp(L * s);
    const g = Math.abs(L) < 1e-6 ? s : (1 - Math.exp(-L * s)) / (1 - Math.exp(-L));
    return { x: a.x + (b.x - a.x) * g, y: a.y + (b.y - a.y) * g, z };
  }
  // estado no trecho i: movimento até o quadro i e, depois, a pausa com avanço lento até o próximo movimento
  function camSeg(i, tt) {
    const k = CK[i];
    if (tt < k.t + k.du) return camMix(k.s, k, smoother((tt - k.t) / k.du));
    const h0 = k.t + k.du, h1 = CK[i + 1] ? CK[i + 1].t : D, hold = Math.max(.01, h1 - h0);
    return { x: k.x, y: k.y, z: k.z * (1 + Math.min(.026, .0042 * hold) * sine((tt - h0) / hold)) };
  }
  function measure() {
    if (!film || !film.offsetWidth) return;
    w = film.offsetWidth; h = film.offsetHeight; portrait = h > w;
    $$('[data-anchor]', film).forEach(n => { const b = box(n, film); A[n.dataset.anchor] = { x: b.x + b.w / 2, y: b.y + b.h / 2, w: b.w, h: b.h }; });
    A.win = box(winEl, camEl);
    CK.length = 0;
    for (const [t0, du, tg, z] of (portrait ? CAM_M : CAM_D)) { const k = camKey(tg, z); k.t = t0; k.du = du; CK.push(k); }
    // cada movimento parte do quadro exato daquele instante (com o avanço lento da pausa anterior);
    // numa panorâmica com o mesmo zoom, o quadro guarda o avanço em vez de recuar e voltar
    CK.forEach((k, i) => {
      k.s = i ? camSeg(i - 1, k.t) : k;
      if (i && Math.abs(Math.log(k.z / CK[i - 1].z)) < .04 && k.s.z > k.z) camFit(k, k.s.z);
    });
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
    MK.hov = MK.hovEls.map(e => { const b = box(e, m); return { e, on: e.classList.contains('hov'), r: [b.x / W * 100, b.y / H * 100, (b.x + b.w) / W * 100, (b.y + b.h) / H * 100] }; });
    MK.ok = true;
  }

  // tocando e sem mexer o mouse por 2,5 s: a barra e o ponteiro somem e só o filme fica na tela
  function wake() {
    clearTimeout(idleT); film.classList.remove('idle');
    if (state === 'playing') idleT = setTimeout(() => { if (state === 'playing') film.classList.add('idle'); }, 2500);
  }
  function setState(s) {
    state = s; film.dataset.state = s; wake();
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
      // com movimento reduzido não há fusão: a cena sai em data-to (ou data-rc segundos depois, para emendar na próxima)
      const vis = t >= s.from && t < s.to + (REDUCED ? s.rc : s.fo);
      if (vis !== s.vis) { s.vis = vis; s.n.classList.toggle('on', vis); }
      if (!vis) continue;
      // fusões com curva suave; a cena que entra pode crescer de leve até o lugar (data-fz).
      // Nas trocas de tela dentro do app, a tela nova espera a antiga quase sumir (data-fw):
      // nunca dois textos sobrepostos pela metade
      let op = 1, inq = 1;
      if (!REDUCED) {
        if (s.fi > 0 && t < s.from + s.fw + s.fi) { inq = sine((t - s.from - s.fw) / s.fi); op = inq; }
        if (t > s.to && s.fo > 0) op = Math.min(op, 1 - sine((t - s.to) / s.fo));
      }
      s.n.style.opacity = op.toFixed(3);
      const tf = s.fz && inq < 1 ? 'scale(' + (1 - s.fz * (1 - inq)).toFixed(4) + ')' : '';
      if (tf !== s.tf) { s.n.style.transform = tf; s.tf = tf; }
      const lt = t - s.o, lts = lt.toFixed(3);
      if (lts !== s.lt) { for (const e of s.anims) e.style.setProperty('--lt', lts); s.lt = lts; }
      update(s, lt);
    }
    if (appSc.classList.contains('on')) { camFrame(); curFrame(); palFrame(); }
    // no celular a legenda final ocupa o lugar da legenda do passo: a do passo sai antes e volta depois
    let capOp = '';
    if (portrait && legSc) { const q = REDUCED ? (t >= legSc.from && t < legSc.to ? 1 : 0) : Math.min(sine((t - legSc.from + .4) / .4), 1 - sine((t - legSc.to - legSc.fo) / .4)); capOp = (1 - q).toFixed(3); }
    if (capOp !== legLast) { capsEl.style.opacity = capOp; legLast = capOp; }
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
  // câmera: movimentos ancorados e suaves; com movimento reduzido, cortes secos e nenhum avanço
  function camFrame() {
    if (!CK.length) return;
    let i = 0; while (i < CK.length - 1 && t >= CK[i + 1].t) i++;
    const c = REDUCED ? CK[i] : camSeg(i, t);
    const tx = w / 2 - c.x * c.z, ty = h / 2 - c.y * c.z;
    const str = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${c.z.toFixed(5)})`;
    if (str !== camLast) { camEl.style.transform = str; camLast = str; }
  }
  /* cursor: parado até a hora de sair; então um movimento curto (0,5 a 1 s, conforme a distância),
     que arranca rápido e pousa devagar, num arco leve */
  function curPos(i) {
    const wy = MK.way, P = MK.pts, a = P[i], b = P[i + 1];
    if (REDUCED || t <= wy[i].t) return a;
    const dx = b.x - a.x, dy = (b.y - a.y) * .573, dist = Math.hypot(dx, dy);   // em % da largura da janela
    if (dist < .01) return a;
    const du = Math.min(wy[i + 1].t - wy[i].t, Math.max(.5, Math.min(1, .4 + dist * .012)));
    const u = (t - (wy[i + 1].t - du)) / du;
    if (u <= 0) return a;
    const q = smoother(Math.pow(clamp(u), .8)), bow = Math.sin(Math.PI * q) * Math.min(3, dist * .08);
    let nx = -dy / dist, ny = dx / dist; if (ny > 0) { nx = -nx; ny = -ny; }   // o arco sempre puxa para cima
    return { x: a.x + dx * q + nx * bow, y: a.y + (dy * q + ny * bow) / .573 };
  }
  function curFrame() {
    if (!MK.ok) measureMock();
    const wy = MK.way, P = MK.pts; if (!P.length) return;
    let i = 0; while (i < wy.length - 1 && t >= wy[i + 1].t) i++;
    const p = t <= wy[0].t ? P[0] : i >= wy.length - 1 ? P[P.length - 1] : curPos(i);
    const op = REDUCED ? (t >= 4.4 && t < END - .6 ? 1 : 0) : Math.min(sine((t - 4.3) / .4), 1 - sine((t - (END - .9)) / .4));
    const shown = op > 0;
    MK.cur.style.left = p.x.toFixed(2) + '%'; MK.cur.style.top = p.y.toFixed(2) + '%';
    MK.cur.style.opacity = op.toFixed(3);
    MK.cur.classList.toggle('down', MK.clicks.some(c => t >= c - .06 && t < c + .1));
    let c = null; for (const ct of MK.clicks) if (t >= ct && t < ct + .5) c = ct;
    if (c == null || REDUCED) MK.rip.style.opacity = 0;
    else { const q = ease((t - c) / .5); MK.rip.style.left = p.x.toFixed(2) + '%'; MK.rip.style.top = p.y.toFixed(2) + '%'; MK.rip.style.opacity = (.85 * (1 - q)).toFixed(3); MK.rip.style.transform = 'scale(' + (.35 + .75 * q).toFixed(3) + ')'; }
    // sem ler o layout a cada quadro (nenhum alvo some com display: none); só escreve quando muda
    for (const o of MK.hov) {
      const on = shown && p.x >= o.r[0] && p.x <= o.r[2] && p.y >= o.r[1] && p.y <= o.r[3] && !o.e.closest('.sc:not(.on)');
      if (on !== o.on) { o.e.classList.toggle('hov', on); o.on = on; }
    }
    for (const d of MK.drags) {
      const on = t >= d.a && t < d.b; d.e.classList.toggle('act', on);
      if (on) { d.e.style.left = p.x.toFixed(2) + '%'; d.e.style.top = p.y.toFixed(2) + '%'; }
    }
  }
  // paleta: o matiz dos slides corre suave de uma paleta para a outra (só nas miniaturas e no slide do editor)
  function palFrame() {
    let hue = PAL[0][1], sat = PAL[0][2];
    for (let i = 1; i < PAL.length; i++) {
      const [pt, ph, ps] = PAL[i]; if (t < pt) break;
      const q = REDUCED ? 1 : sine((t - pt) / .6), h0 = hue, s0 = sat;
      hue = h0 + (ph - h0) * q; sat = s0 + (ps - s0) * q;
    }
    const str = hue.toFixed(1) + '|' + sat.toFixed(3);
    if (str !== palLast) { for (const e of palEls) { e.style.setProperty('--hue', hue.toFixed(1)); e.style.setProperty('--sat', sat.toFixed(3)); } palLast = str; }
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
    } else if (t < 4.7) {                                   // abertura: o símbolo acende e os arcos giram atrás dele
      const mk = A.mark || { x: cx, y: cy * .8, w: R * .5 }, k = ease((t - .2) / 1.6), q = sine((t - 2.95) / .7), out = 1 - q;
      starsAt(u, 1 - .5 * q);                               // o céu baixa até o tom da gravação, sem salto; os arcos somem junto com o símbolo, antes da janela entrar
      arcs(mk.x, mk.y, R * 1.25, u, k * out, t * .12);
      glow(mk.x, mk.y, mk.w * .7, .35 * k * out);
    } else if (t < END) {                                   // gravação: só um céu discreto atrás da janela
      starsAt(u, .5);
    } else {                                                // fecho: os arcos voltam e respiram
      const lt = t - END, mk = A.mark2 || { x: cx, y: cy * .7, w: R * .4 }, kk = ease((lt - .55) / 1.4);   // espera a janela quase sumir
      const br = REDUCED ? 1 : 1 + .03 * Math.sin(lt * TAU / 2.4);
      starsAt(u, .5 + .5 * sine(lt / .9));
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
  // seek fica exposto para testes quadro a quadro (o mesmo que arrastar a trilha)
  return { init, seek: nt => seek(nt) };
})();
