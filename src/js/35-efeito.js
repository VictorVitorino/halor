/* ==========================================================================
   EFEITO HALOR · Distância Halor
   O corredor de luz: um corte da sala visto de lado. Quem assiste começa a
   7 m e se aproxima parada a parada até ficar lado a lado com você.
   Toda a cena sai de uma variável contínua s (0 = 7 m, 4 = lado a lado) e de
   um florescer a (0 a 1), que só existe em Além da sala.
   ========================================================================== */
const DIST_STEPS = [
  { id: 'publica', rotulo: '7 m', fala: '7 metros', faixa: '7 metros, distância pública', zona: 'Distância pública', curta: 'Pública', m: 7,
    verbo: 'Reparei.', desc: 'Do fundo da sala ou da caixa de entrada, a pessoa decide se vale chegar perto. Quem decide é a capa.',
    sinal: 'Antes do envio, o Raio Halor prevê onde cai o primeiro olhar. Depois, o Link Halor registra quem abriu e quanto tempo ficou na capa.',
    ex: 'Abriu em 4 min · 1,8 s na capa', elo: 'Atenção gera interesse.', x: 64 },
  { id: 'social', rotulo: '3,6 m', fala: '3,6 metros', faixa: '3,6 metros, distância social', zona: 'Distância social', curta: 'Social', m: 3.6,
    verbo: 'Parei para ver.', desc: 'Ela para de rolar a tela e segue a história. Cada slide claro encurta um passo.',
    sinal: 'Link Halor: tempo por slide, profundidade de leitura e o slide exato onde cada pessoa parou.',
    ex: 'Leu 11 de 14 slides · 6 min', elo: 'Interesse gera curiosidade.', x: 214 },
  { id: 'pessoal', rotulo: '1,2 m', fala: '1,2 metro', faixa: '1,2 metro, distância pessoal', zona: 'Distância pessoal', curta: 'Pessoal', m: 1.2,
    verbo: 'Quis participar.', desc: 'Ela sai do lugar de plateia: vota, cola um post-it, responde ao formulário. Quem participa já está perto. É aqui que o lúdico trabalha.',
    sinal: 'Componentes lúdicos: votos por pontos, post-its, respostas de formulário e tempo no cronômetro, por pessoa e por slide, ao vivo no palco ou no link.',
    ex: '3 votos · 5 post-its · 1 resposta', elo: 'Curiosidade gera aproximação.', x: 364 },
  { id: 'confianca', rotulo: '45 cm', fala: '45 centímetros', faixa: '45 centímetros, confiança', zona: 'Confiança', curta: 'Confiança', m: .45,
    verbo: 'Voltei e perguntei.', desc: 'Ela volta ao link sem você pedir e faz a pergunta que importa. Voltar e perguntar são as provas mais honestas de confiança.',
    sinal: 'Retornos ao mesmo link, comentários por slide e os slides revisitados, que mostram a dúvida antes de ela ser dita.',
    ex: 'Voltou 2 vezes · 1 pergunta no slide 5', elo: 'Aproximação gera confiança.', x: 514 },
  { id: 'lado', rotulo: '0', fala: 'lado a lado', faixa: '0, lado a lado', zona: 'Lado a lado', curta: 'Lado a lado', m: 0,
    verbo: 'Estou do seu lado.', desc: 'Ela para de avaliar você e começa a construir com você. Os dois olham para o mesmo ponto: o próximo passo.',
    sinal: 'Decisão registrada, próximo passo marcado e sinal enviado ao Painel Halor e ao CRM.',
    ex: 'Próximo passo marcado para terça, 10h', elo: 'Confiança gera parceria.', x: 760 },
  { id: 'alem', rotulo: 'Além da sala', curto: 'Além', resto: ' da sala', fala: 'além da sala', faixa: 'Além da sala, irradiar', zona: 'Irradiar', curta: 'Irradiar', m: 0,
    verbo: 'Levei adiante.', desc: 'Quem atravessou apresenta por você onde você não está. Encaminha o link, chama quem decide junto e repete o slide que ficou na memória.',
    sinal: 'Encaminhamentos, novos leitores que chegaram pelo link e o slide-memória: aquele a que as pessoas mais voltam e que repetem para os outros.',
    ex: '+3 pessoas pelo link · slide 6 é o slide-memória', elo: 'Parceria gera valor.', x: 940 }
];

/* Plateias. geral = ninguém escolheu: exemplos neutros e selo que alterna os seis sins. */
const DIST_AUD = {
  geral: { rotulo: 'Quem assiste', de: 'de quem assiste', tema: '', ex3: null, ex4: null, sim: null, adiante: null, leitores: 3, memoria: 6 },
  cliente: { rotulo: 'Cliente', de: 'do cliente', tema: 'proposta comercial', ex3: 'Votou em Prazo · colou 2 post-its', ex4: 'Voltou 2 vezes · perguntou do prazo no slide 5', sim: 'Proposta aceita', adiante: 'Indicou você para outra área · +3 leitores · slide 6 é o slide-memória', leitores: 3, memoria: 6 },
  parceiro: { rotulo: 'Parceiro', de: 'do parceiro', tema: 'plano conjunto', ex3: '4 post-its no quadro conjunto', ex4: 'Voltou 3 vezes · comentou o modelo de receita', sim: 'Parceria firmada', adiante: 'Apresentou você à rede dele · +4 leitores · slide 4 é o slide-memória', leitores: 4, memoria: 4 },
  investidor: { rotulo: 'Investidor', de: 'do investidor', tema: 'pitch e rodada', ex3: 'Votou em Tração · 1 pergunta no formulário', ex4: 'Abriu o financeiro 3 vezes', sim: 'Aporte confirmado', adiante: 'Chamou o sócio para a próxima conversa · +2 leitores · slide 8 é o slide-memória', leitores: 2, memoria: 8 },
  diretoria: { rotulo: 'Diretoria', de: 'da diretoria', tema: 'aprovação de projeto', ex3: '5 de 6 votaram na opção B', ex4: 'Voltou ao cronograma 2 vezes · 1 pergunta', sim: 'Projeto aprovado', adiante: 'Levou o número ao conselho · +5 leitores · slide 3 é o slide-memória', leitores: 5, memoria: 3 },
  time: { rotulo: 'Time', de: 'do time', tema: 'kickoff e alinhamento', ex3: '18 de 20 votaram · 27 post-its', ex4: 'Reabriu o plano na véspera · 4 comentários', sim: 'Plano adotado', adiante: 'Repetiu a meta na reunião da equipe · +8 leitores · slide 2 é o slide-memória', leitores: 8, memoria: 2 },
  turma: { rotulo: 'Turma', de: 'da turma', tema: 'aula e treinamento', ex3: 'Quiz 8 de 10 · 3 post-its', ex4: 'Reviu a aula 2 vezes antes da prova', sim: 'Conceito aprendido', adiante: 'Explicou para um colega · +6 leitores · slide 5 é o slide-memória', leitores: 6, memoria: 5 }
};
const DIST_AUD_KEYS = ['cliente', 'parceiro', 'investidor', 'diretoria', 'time', 'turma'];

/* Duas plantas da mesma sala: palco largo (1000 x 380) e faixa do celular (400 x 200).
   ticks: onde ficam os números da régua · lx: onde a luz para (no 0 ela passa da mesa, em 836).
   stars: [x, y, pai] · pai -1 = você, -2 = quem assiste, n = outra faísca. */
const DIST_LAYOUT = {
  wide: {
    W: 1000, H: 380, cy: 190, ry: 322, ticks: DIST_STEPS.map(st => st.x), lx: [64, 214, 364, 514, 836],
    me: 900, mark: 64, table: 760, tableTop: 44, seal: [868, 72], R: 22, wl: 70, ww: 18, amp: 60, spark: .8, float: 3,
    stars: [[948, 124, -1], [950, 256, -1], [986, 152, 0], [988, 222, 1], [976, 294, 1]]
  },
  narrow: {
    W: 400, H: 200, cy: 96, ry: 150, ticks: [26, 86, 146, 206, 300, 374], lx: [26, 86, 146, 206, 330],
    me: 364, mark: 36, table: 300, tableTop: 14, seal: [347, 34], R: 13, wl: 40, ww: 11, amp: 26, spark: .5, float: 1.5,
    stars: [[390, 62, -1], [390, 130, -1], [318, 62, -2], [318, 130, -2], [394, 96, -1]]
  }
};

function buildDistancia() {
  const root = $('#dh'); if (!root) return;
  const svg = $('#dh-scene'), stage = $('#dh-stage'), fig = $('#dh-fig'), ticksBox = $('#dh-ticks');
  const tEl = $('#dh-scene-t'), dEl = $('#dh-scene-d'), capA = $('.dh-cap-a', root);
  const range = $('#dh-range'), rangeV = $('#dh-range-v'), card = $('#dh-card'), mlist = $('#dh-mlist'), srList = $('#dh-sr');
  const O = {
    readK: $('.dh-read-k', root), readN: $('#dh-read-n'), readU: $('#dh-read-u'), chip: $('#dh-chip'),
    edgeL: $('.dh-edge-l', root), edgeR: $('.dh-edge-r', root), span: $('.dh-span', root), me: $('.dh-me', root),
    follow: $('#dh-follow'), voice: $('.dh-voice', root), who: $('.dh-who', root), bubble: $('#dh-bubble'),
    seal: $('#dh-seal'), sealT: $('#dh-seal span'), hint: $('.dh-hint', root)
  };
  const mq = window.matchMedia('(max-width: 639.98px)');
  const LAST = DIST_STEPS.length - 1;
  const KEY = 'halor.distancia.plateia';
  const METERS = DIST_STEPS.slice(0, 5).map(st => st.m);

  /* · utilidades locais · */
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const f = v => (Math.round(v * 100) / 100).toString();
  const lerpArr = (arr, t) => { const i = Math.min(arr.length - 2, Math.max(0, Math.floor(t))); return arr[i] + (arr[i + 1] - arr[i]) * (t - i); };
  const setText = (n, v) => { if (n && n.textContent !== v) n.textContent = v; };
  const semPonto = v => v.replace(/\.$/, '');
  function cubicBez(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = u => ((ax * u + bx) * u + cx) * u, Y = u => ((ay * u + by) * u + cy) * u, dX = u => (3 * ax * u + 2 * bx) * u + cx;
    return t => {
      if (t <= 0) return 0; if (t >= 1) return 1;
      let u = t;
      for (let i = 0; i < 8; i++) { const e = X(u) - t; if (Math.abs(e) < 1e-5) break; const d = dX(u); if (Math.abs(d) < 1e-6) break; u = clamp(u - e / d); }
      return Y(u);
    };
  }
  const easeHalo = cubicBez(.22, .61, .36, 1), easeSpark = cubicBez(.34, 1.56, .64, 1);
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const C_ASH = hex('#a69cc4'), C_NEON = hex('#a970ff'), C_LUMEN = hex('#f4eeff'), C_GLOW = hex('#c9a6ff');
  const mix = (c1, c2, t) => 'rgb(' + c1.map((v, i) => Math.round(v + (c2[i] - v) * t)).join(',') + ')';
  const warm = p => p < .5 ? mix(C_ASH, C_NEON, p / .5) : mix(C_NEON, C_LUMEN, (p - .5) / .5);
  const fmtDist = m => m <= .004 ? ['0', 'lado a lado'] : m < .995 ? [String(Math.round(m * 100)), 'cm'] : [fmtNum(m, Math.abs(m - Math.round(m)) < .05 ? 0 : 1), 'm'];
  /* ruído fixo: sorteado uma vez, com semente, para a cena ser sempre a mesma */
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const NOISE = Array.from({ length: 24 }, () => ({ ny: rnd() * 2 - 1, nx: rnd() - .5, jx: (rnd() * 2 - 1).toFixed(2), jy: (rnd() * 2 - 1).toFixed(2), d: (1.3 + rnd() * 1.5).toFixed(2), ph: rnd() }));

  /* · estado · */
  let aud = 'geral';
  try { const v = localStorage.getItem(KEY); if (v && DIST_AUD[v]) aud = v; } catch (e) { /* sem armazenamento: segue sem lembrar */ }
  let narrow = mq.matches, L = null, S = {}, ticks = [];
  let stop = 0, s = 0, a = 0, tw = null, aw = null, raf = 0, floatT0 = 0;
  let inView = false, onScreen = false, hoverStage = false, drag = null;
  let gestured = false, played = false, autoOn = false, autoT = 0;
  let sealI = 0, sealT = 0, lockUntil = 0, swapT = 0;

  /* · cena SVG · */
  function buildScene() {
    L = narrow ? DIST_LAYOUT.narrow : DIST_LAYOUT.wide;
    S = {};
    svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
    Array.from(svg.childNodes).forEach(n => { if (n !== tEl && n !== dEl) svg.removeChild(n); });
    const add = (parent, tag, attrs) => { const n = svgEl(tag, attrs); parent.appendChild(n); return n; };
    const t = L.ticks, cy = L.cy, ry = L.ry;
    const defs = add(svg, 'defs');
    defs.innerHTML =
      '<radialGradient id="dh-g-soft"><stop offset="0" stop-opacity=".62"/><stop offset=".45" stop-opacity=".22"/><stop offset="1" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="dh-g-sharp"><stop offset="0" stop-color="#ffffff"/><stop offset=".3"/><stop offset=".45" stop-opacity=".55"/><stop offset=".62" stop-opacity=".12"/><stop offset="1" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="dh-g-wa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-opacity=".8"/><stop offset="1" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="dh-g-wm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9a6ff" stop-opacity=".85"/><stop offset="1" stop-color="#8b3dff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="dh-g-me"><stop offset="0" stop-color="#8b3dff" stop-opacity=".5"/><stop offset=".5" stop-color="#8b3dff" stop-opacity=".16"/><stop offset="1" stop-color="#8b3dff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="dh-g-flare"><stop offset="0" stop-color="#f4eeff" stop-opacity=".5"/><stop offset=".35" stop-color="#c9a6ff" stop-opacity=".26"/><stop offset="1" stop-color="#8b3dff" stop-opacity="0"/></radialGradient>' +
      `<linearGradient id="dh-g-lit" gradientUnits="userSpaceOnUse" x1="${t[0]}" y1="0" x2="${t[5]}" y2="0">` +
      [1, 2, 3, 4, 5, 6].map((n, i) => `<stop offset="${(i / 5).toFixed(2)}" style="stop-color:var(--chain-n${n})"/>`).join('') + '</linearGradient>' +
      /* a faísca do logo (mesmo traço do filme), centrada na origem */
      '<path id="dh-spark" d="M0 -7.2Q0 0 7.2 0Q0 0 0 7.2Q0 0 -7.2 0Q0 0 0 -7.2Z"/>';
    S.softStops = Array.from(defs.querySelectorAll('#dh-g-soft stop'));
    S.sharpStops = Array.from(defs.querySelectorAll('#dh-g-sharp stop')).slice(1);
    S.waStops = Array.from(defs.querySelectorAll('#dh-g-wa stop'));

    /* régua */
    const ruler = add(svg, 'g', { class: 'dh-ruler' });
    add(ruler, 'line', { class: 'dh-rl', x1: narrow ? 8 : 18, y1: ry, x2: L.table, y2: ry });
    add(ruler, 'line', { class: 'dh-rl dh-rl-d', x1: L.table, y1: ry, x2: L.W - (narrow ? 6 : 14), y2: ry });
    S.lit = add(ruler, 'line', { class: 'dh-lit', x1: t[0], y1: ry, x2: t[0], y2: ry, stroke: 'url(#dh-g-lit)' });
    t.forEach(x => add(ruler, 'line', { class: 'dh-tk', x1: x, y1: ry - (narrow ? 4 : 6), x2: x, y2: ry + (narrow ? 4 : 6) }));
    S.glows = t.map(x => add(ruler, 'circle', { class: 'dh-dg', cx: x, cy: ry, r: narrow ? 6 : 11 }));
    S.dots = t.map(x => add(ruler, 'circle', { class: 'dh-dot', cx: x, cy: ry, r: narrow ? 3 : 4.5 }));
    S.ring = add(ruler, 'circle', { class: 'dh-ring', cx: t[0], cy: ry, r: narrow ? 5.5 : 9 });
    if (!narrow) {
      const by = ry - 28, mid = (t[2] + t[4]) / 2, gap = 70;
      add(svg, 'path', { class: 'dh-brk', d: `M${t[2]} ${by + 6}V${by}H${mid - gap}M${mid + gap} ${by}H${t[4]}V${by + 6}` });
    }
    /* a mesa */
    add(svg, 'line', { class: 'dh-table', x1: L.table, y1: L.tableTop, x2: L.table, y2: ry - 14 });
    /* clarão do lado a lado, embaixo do selo */
    S.flare = add(svg, 'ellipse', { cx: (L.lx[4] + L.me) / 2, cy, rx: L.R * 6.4, ry: L.R * 3.4, fill: 'url(#dh-g-flare)', opacity: 0 });
    /* partículas e ponte */
    const pw = add(svg, 'g', { class: 'dh-parts-w' });
    S.bridge = add(pw, 'line', { class: 'dh-bridge', x1: 0, y1: cy, x2: 0, y2: cy, opacity: 0 });
    S.partsG = add(pw, 'g', { class: 'dh-parts' });
    S.parts = NOISE.map(nz => {
      const g = add(S.partsG, 'g');
      const c = add(g, 'circle', { r: narrow ? 1.4 : 2 });
      c.style.setProperty('--jx', nz.jx); c.style.setProperty('--jy', nz.jy);
      c.style.animationDuration = nz.d + 's'; c.style.animationDelay = (-nz.d * nz.ph).toFixed(2) + 's';
      return g;
    });
    /* você */
    const wedge = `M0 0L${L.wl} ${-L.ww / 2}L${L.wl} ${L.ww / 2}Z`;
    S.meG = add(svg, 'g', { class: 'dh-me-g' });
    S.meGlow = add(S.meG, 'circle', { class: 'dh-me-glow', cx: L.me, cy, r: L.mark * 1.2, fill: 'url(#dh-g-me)' });
    S.wM = add(S.meG, 'path', { class: 'dh-wedge', d: wedge, fill: 'url(#dh-g-wm)' });
    add(S.meG, 'use', { href: '#hl-mark', class: 'dh-mark', x: L.me - L.mark / 2, y: cy - L.mark / 2, width: L.mark, height: L.mark });
    S.vmark = add(S.meG, 'circle', { class: 'dh-vmark', cx: L.me, cy, r: L.mark * .56, opacity: 0 });
    /* quem assiste */
    const audW = add(svg, 'g', { class: 'dh-aud-w' });
    S.wA = add(audW, 'path', { class: 'dh-wedge', d: wedge, fill: 'url(#dh-g-wa)' });
    S.aud = add(audW, 'g', { class: 'dh-aud' });
    S.soft = add(S.aud, 'circle', { r: L.R * 2.3, fill: 'url(#dh-g-soft)' });
    S.sharp = add(S.aud, 'circle', { r: L.R * 1.5, fill: 'url(#dh-g-sharp)' });
    S.aSpark = add(S.aud, 'use', { href: '#dh-spark', class: 'dh-aspark', transform: `translate(${L.R * .95} ${-L.R * .95}) scale(${narrow ? .55 : .75})`, opacity: 0 });
    S.hit = add(audW, 'circle', { class: 'dh-hit', r: 46, cx: L.lx[0], cy });
    /* voto */
    S.vote = add(svg, 'use', { href: '#dh-spark', class: 'dh-vote' });
    /* constelação */
    const cg = add(svg, 'g', { class: 'dh-const' });
    S.lines = L.stars.map(() => add(cg, 'line', { class: 'dh-cl', opacity: 0 }));
    S.stars = L.stars.map(() => {
      const g = add(cg, 'g', { class: 'dh-star', opacity: 0 });
      add(g, 'circle', { class: 'dh-star-g', r: narrow ? 5 : 9 });
      add(g, 'use', { href: '#dh-spark', transform: `scale(${L.spark})` });
      return g;
    });
    S.pos = L.stars.map(st => [st[0], st[1]]);
  }

  /* · camadas HTML, posicionadas em % · */
  function placeOverlays() {
    const px = x => (x / L.W * 100).toFixed(3) + '%', py = y => (y / L.H * 100).toFixed(3) + '%';
    O.edgeL.style.left = O.edgeR.style.left = px(L.table);
    O.edgeL.style.top = O.edgeR.style.top = py(L.tableTop - 20);
    O.me.style.left = px(L.me); O.me.style.top = py(L.cy + L.mark / 2 + (narrow ? 3 : 8));
    O.span.style.left = px((L.ticks[2] + L.ticks[4]) / 2); O.span.style.top = py(L.ry - 28);
    O.hint.style.left = px(L.lx[0] + L.R + 14); O.hint.style.top = py(L.cy + 20);
    O.seal.style.top = py(L.seal[1]);
    placeSeal();
    ticks.forEach((b, i) => { b.style.left = px(L.ticks[i]); b.style.top = py(L.ry); });
    stage.classList.toggle('is-narrow', narrow);
  }

  /* o selo muda de largura com o texto e a fonte: centro na mira do par, sem sair do palco */
  function placeSeal() {
    const sw = stage.clientWidth; if (!sw || !L) return;
    const half = O.seal.offsetWidth / 2, pad = narrow ? 8 : 14;
    const c = clamp(L.seal[0] / L.W * sw, half + pad, sw - half - pad);
    O.seal.style.left = c.toFixed(1) + 'px';
    S.sealX = c / sw * L.W;
  }

  /* · desenho de um quadro · */
  /* escreve no DOM só o que mudou: com a constelação flutuando, quase nada muda */
  const at = (n, k, v) => { const c = n._at || (n._at = {}); if (c[k] !== v) { c[k] = v; n.setAttribute(k, v); } };
  const sp = (n, k, v) => { const c = n._sp || (n._sp = {}); if (c[k] !== v) { c[k] = v; n.style.setProperty(k, v); } };

  function render(now) {
    const sc = Math.min(s, 4), p = sc / 4, k = .45 + .55 * p, x = lerpArr(L.lx, sc), r = L.R * k, cy = L.cy;
    const col = warm(p);
    at(S.aud, 'transform', `translate(${f(x)} ${cy}) scale(${f(k)})`);
    at(S.aud, 'opacity', f(.7 + .3 * p));
    at(S.hit, 'cx', f(x));
    at(S.soft, 'opacity', f(1 - p));
    at(S.sharp, 'opacity', f(p));
    S.softStops.forEach(n => at(n, 'stop-color', col));
    S.sharpStops.forEach(n => at(n, 'stop-color', col));
    S.waStops.forEach(n => at(n, 'stop-color', col));
    at(S.aSpark, 'opacity', f(clamp((p - .55) / .45)));

    /* olhares: frente a frente até 45 cm, depois os dois viram para o selo */
    const kk = clamp(s - 3), tx = S.sealX || L.seal[0], ty = L.seal[1];
    let angA = 0, angM = 180;
    if (kk > 0) {
      angA = Math.atan2(ty - cy, tx - x) * 180 / Math.PI * kk;
      let tm = Math.atan2(ty - cy, tx - L.me) * 180 / Math.PI; if (tm < 0) tm += 360;
      angM = 180 + (tm - 180) * kk;
    }
    at(S.wA, 'transform', `translate(${f(x)} ${cy}) rotate(${f(angA)}) translate(${f(r + 3)} 0)`);
    at(S.wA, 'opacity', f(.45 + .55 * p));
    at(S.wM, 'transform', `translate(${L.me} ${cy}) rotate(${f(angM)}) translate(${L.mark / 2 + 1} 0)`);

    /* o vão vira sinal */
    const kSeal = clamp((s - 3.55) / .45);
    const xa = x + r + (narrow ? 5 : 10), xb = L.me - L.mark / 2 - (narrow ? 5 : 10), span = Math.max(0, xb - xa);
    const A = L.amp * Math.pow(1 - p, 1.5), n = NOISE.length;
    sp(S.partsG, '--amp', f(A * .12));
    at(S.partsG, 'fill', p < .5 ? mix(C_ASH, C_GLOW, p / .5) : mix(C_GLOW, C_LUMEN, (p - .5) / .5));
    at(S.partsG, 'opacity', f((.32 + .6 * p) * (1 - .85 * kSeal)));
    S.parts.forEach((g, i) => {
      const nz = NOISE[i], px = xa + span * (i + .5) / n + nz.nx * (span / n) * 2 * (1 - p), py = cy + A * nz.ny;
      at(g, 'transform', `translate(${f(px)} ${f(py)})`);
    });
    at(S.bridge, 'x1', f(xa)); at(S.bridge, 'x2', f(Math.max(xa, xb)));
    at(S.bridge, 'opacity', f(clamp((p - .55) / .45) * (1 - kSeal) * .55));
    at(S.flare, 'opacity', f(kSeal));

    /* régua: trecho aceso, pontos alcançados, anel da parada */
    const litX = lerpArr(L.ticks, sc) + (L.ticks[5] - L.ticks[4]) * a;
    at(S.lit, 'x2', f(litX)); at(S.ring, 'cx', f(litX));
    S.dots.forEach((d, j) => {
      const on = j < 5 ? s >= j - .02 : a > .5;
      if (d._on === on) return;
      d._on = on; d.classList.toggle('is-on', on); S.glows[j].classList.toggle('is-on', on);
      d.style.fill = on ? `var(--chain-n${j + 1})` : ''; S.glows[j].style.fill = on ? `var(--chain-n${j + 1})` : '';
    });

    /* selo */
    sp(O.seal, '--o', f(kSeal));
    sp(O.seal, '--k', f(.82 + .18 * (REDUCED ? kSeal : easeSpark(kSeal))));

    /* leitura: distância, ou novos leitores em Além da sala */
    const AU = DIST_AUD[aud];
    if (stop === LAST && s >= 3.999) {
      setText(O.readK, 'Novos leitores'); setText(O.readN, '+' + Math.max(1, Math.round(1 + (AU.leitores - 1) * clamp(a / .85)))); setText(O.readU, '');
      setText(O.chip, `slide ${AU.memoria} é o slide-memória`); O.chip.classList.toggle('is-on', a > .55);
    } else {
      const [v, u] = fmtDist(lerpArr(METERS, sc));
      setText(O.readK, 'Distância'); setText(O.readN, v); setText(O.readU, u); O.readU.classList.toggle('is-word', u.length > 2); O.chip.classList.remove('is-on');
    }

    /* voz de quem assiste acompanha a luz */
    sp(O.follow, 'transform', `translate(${(x / L.W * 100).toFixed(3)}%, ${(cy / L.H * 100).toFixed(3)}%)`);
    sp(O.follow, '--rr', (r / L.W * 100).toFixed(3) + 'cqw');
    const end = x > L.W * .6;
    if (O.voice._end !== end) {
      if (O.voice._end !== undefined && !REDUCED) { O.voice.classList.add('is-swap'); clearTimeout(swapT); swapT = setTimeout(() => O.voice.classList.remove('is-swap'), 460); }
      O.voice._end = end; O.voice.classList.toggle('is-end', end);
    }

    /* Além da sala: faíscas que brotam do seu lado e flutuam */
    const nStars = clamp(AU.leitores, 3, 5), fk = floatOn() ? clamp((now - floatT0) / 1200) : 0;
    L.stars.forEach((st, j) => {
      const show = j < nStars;
      const ap = clamp((a - .1 - j * .13) / .32), lk = clamp((a - j * .13) / .3);
      const ox = Math.sin(now / 1700 + j * 1.9) * L.float * fk, oy = Math.cos(now / 2100 + j * 1.3) * L.float * .8 * fk;
      const X = st[0] + ox, Y = st[1] + oy; S.pos[j] = [X, Y];
      const scl = REDUCED ? ap : Math.max(0, easeSpark(ap));
      at(S.stars[j], 'transform', `translate(${f(X)} ${f(Y)}) scale(${f(scl)})`);
      at(S.stars[j], 'opacity', show ? f(Math.min(1, ap * 1.6)) : '0');
      const par = st[2], P = par >= 0 ? S.pos[par] : par === -1 ? [L.me, cy] : [L.lx[4], cy];
      const rad = par >= 0 ? 7 : par === -1 ? L.mark / 2 + 2 : L.R + 2;
      const dx = X - P[0], dy = Y - P[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
      const x1 = P[0] + ux * rad, y1 = P[1] + uy * rad, x2 = X - ux * 6, y2 = Y - uy * 6, ll = Math.max(1, Math.hypot(x2 - x1, y2 - y1));
      const ln = S.lines[j];
      at(ln, 'x1', f(x1)); at(ln, 'y1', f(y1)); at(ln, 'x2', f(x2)); at(ln, 'y2', f(y2));
      at(ln, 'stroke-dasharray', f(ll)); at(ln, 'stroke-dashoffset', f(ll * (1 - lk)));
      at(ln, 'opacity', show && lk > 0 ? '1' : '0');
    });
  }

  /* · laço de animação: só roda durante a transição e enquanto a constelação flutua · */
  const canAnimate = () => inView && !document.hidden && currentView === 'v-site';
  const floatOn = () => !REDUCED && stop === LAST && a >= 1 && !aw && !tw;
  function finishNow() {
    if (tw) { s = tw.to; tw = null; }
    if (aw) { a = aw.to; aw = null; } else if (stop === LAST) a = 1;
    render(performance.now());
  }
  function kick() {
    if (raf || (!tw && !aw && !floatOn())) return;
    if (!canAnimate()) { finishNow(); return; }
    raf = requestAnimationFrame(loop);
  }
  function loop(now) {
    raf = 0;
    if (!canAnimate()) { finishNow(); return; }
    if (tw) {
      const k = clamp((now - tw.t0) / tw.dur);
      s = tw.from + (tw.to - tw.from) * easeHalo(k);
      if (k >= 1) { s = tw.to; tw = null; if (stop === LAST && a < 1) aw = { from: a, to: 1, t0: now, dur: 1500 * (1 - a) }; }
    }
    if (aw) {
      const k = aw.dur > 16 ? clamp((now - aw.t0) / aw.dur) : 1;
      a = aw.from + (aw.to - aw.from) * k;
      if (k >= 1) { a = aw.to; aw = null; if (a >= 1) floatT0 = now; }
    }
    render(now);
    if (tw || aw || floatOn()) raf = requestAnimationFrame(loop);
  }

  /* · textos que mudam com a parada e a plateia · */
  function exFor(i) {
    const A = DIST_AUD[aud];
    if (aud === 'geral' || i < 2) return DIST_STEPS[i].ex;
    if (i === 2) return A.ex3;
    if (i === 3) return A.ex4;
    if (i === 4) return A.sim + ' · próximo passo marcado para terça, 10h';
    return A.adiante;
  }
  function titleFor(i) {
    const st = DIST_STEPS[i], who = DIST_AUD[aud].rotulo, v = semPonto(st.verbo);
    if (i === 0 && aud === 'geral') return 'Distância Halor: quem assiste começa a 7 metros e se aproxima até ficar do seu lado';
    if (i === 4) return `${who} lado a lado com você: ${v}`;
    if (i === LAST) return `${who} além da sala: ${v}`;
    return `${who} a ${st.fala}: ${v}`;
  }
  function descFor(i) {
    const A = DIST_AUD[aud], de = A.de;
    switch (i) {
      case 0: return `A luz ${de} está a 7 metros, na ponta esquerda da régua: pequena, fria e difusa. A sua luz, o símbolo Halor, brilha do outro lado da mesa. Os dois olhares estão frente a frente e o vão entre vocês é só ruído.`;
      case 1: return `A luz ${de} chegou a 3,6 metros. Ficou maior, mais nítida e mais violeta. O ruído entre vocês começa a baixar.`;
      case 2: return `A 1,2 metro, a luz ${de} já é nítida e quente. As partículas entre vocês começam a se alinhar.`;
      case 3: return `A 45 centímetros, a luz ${de} tem quase o seu tamanho e as partículas formam uma ponte reta de luz. Os olhares ainda estão frente a frente.`;
      case 4: return `A luz ${de} cruzou a mesa e parou ao seu lado. Os dois olhares viraram para o mesmo ponto, onde acende o selo ${A.sim ? A.sim : 'com o sim de cada plateia'}.`;
      default: return `Além da sala: do seu lado brotam ${clamp(A.leitores, 3, 5)} faíscas ligadas ao par, como uma constelação. ${A.leitores} novas pessoas chegaram pelo link e o slide ${A.memoria} é o slide-memória.`;
    }
  }
  const valueText = i => `${DIST_STEPS[i].faixa}: ${semPonto(DIST_STEPS[i].verbo)}`;

  /* · cartão do estágio · */
  function audBtn(key) {
    const A = DIST_AUD[key], b = el('button', 'dh-aud');
    b.type = 'button'; b.dataset.aud = key; b.setAttribute('aria-pressed', String(aud === key));
    b.append(el('b', null, A.rotulo), el('span', null, A.tema));
    b.insertAdjacentHTML('beforeend', '<svg aria-hidden="true"><use href="#i-check"/></svg>');
    return b;
  }
  function audGroup(id, labelledBy, label) {
    const g = el('div', 'dh-auds'); g.setAttribute('role', 'group');
    if (id) g.id = id;
    if (labelledBy) g.setAttribute('aria-labelledby', labelledBy); else g.setAttribute('aria-label', label);
    DIST_AUD_KEYS.forEach(key => g.appendChild(audBtn(key)));
    return g;
  }
  function cardInto(box, i, idp) {
    const st = DIST_STEPS[i], A = DIST_AUD[aud];
    box.textContent = '';
    box.style.setProperty('--dh-c', `var(--chain-n${i + 1})`);
    const main = el('div', 'dh-cmain'), side = el('div', 'dh-cside');
    const k = el('h3', 'dh-k'); k.id = idp + '-k';
    const sep = el('span', 'dh-k-s', '·'); sep.setAttribute('aria-hidden', 'true');
    k.append(el('i', 'dh-k-dot'), el('span', 'dh-k-r', st.rotulo), sep, el('span', 'dh-k-z', st.zona));
    main.append(k, el('p', 'dh-verb', '“' + st.verbo + '”'), el('p', 'dh-desc', st.desc));
    const meas = el('div', 'dh-meas');
    meas.append(el('p', 'dh-meas-k', 'O Halor mede'), el('p', 'dh-sig', st.sinal), el('p', 'dh-ex', exFor(i)));
    side.appendChild(meas);
    if (i === 1) {
      const ask = el('div', 'dh-ask'), q = el('p', 'dh-ask-q', 'Para quem é a sua próxima apresentação?');
      q.id = idp + '-q';
      ask.append(q, audGroup(null, q.id));
      side.appendChild(ask);
    } else if (i >= 2 && aud !== 'geral') {
      const as = el('div', 'dh-as'), line = el('p', 'dh-as-l');
      const sw = el('button', 'dh-swap', 'trocar');
      sw.type = 'button'; sw.setAttribute('aria-expanded', 'false'); sw.setAttribute('aria-controls', idp + '-sw'); sw.setAttribute('aria-label', 'Trocar a plateia');
      line.append(document.createTextNode('Assistindo como '), el('b', null, A.rotulo), document.createTextNode(' · '), sw);
      const g = audGroup(idp + '-sw', null, 'Escolha a plateia'); g.hidden = true;
      as.append(line, g);
      side.appendChild(as);
    }
    if (i === LAST) {
      const end = el('div', 'dh-end'), links = el('div', 'dh-links');
      const go = el('a', 'btn btn-primary'); go.href = '#resultados';
      go.innerHTML = 'Veja cada passo no Painel Halor <svg aria-hidden="true"><use href="#i-arrow"/></svg>';
      const redo = el('button', 'btn btn-ghost'); redo.type = 'button'; redo.dataset.dhRedo = '';
      redo.innerHTML = '<svg aria-hidden="true"><use href="#i-replay"/></svg> Refazer a travessia';
      links.append(go, redo);
      end.append(el('p', 'dh-end-t', 'Sua apresentação segue trabalhando depois do último slide.'), links);
      side.appendChild(end);
    }
    const elo = el('p', 'dh-elo');
    elo.innerHTML = '<svg aria-hidden="true"><use href="#i-spark"/></svg>';
    elo.append(el('span', 'dh-elo-k', 'Cadeia Halor'), el('span', null, st.elo));
    box.append(main, side, elo);
  }
  function renderCard() {
    cardInto(card, stop, 'dh-d');
    if (!REDUCED) { card.classList.remove('is-in'); void card.offsetWidth; card.classList.add('is-in'); }
  }
  /* celular: os seis cartões empilhados; o que cruza o meio da tela manda na luz */
  const mio = new IntersectionObserver(es => {
    if (!narrow || Date.now() < lockUntil) return;
    es.forEach(en => { if (en.isIntersecting) { const i = +en.target.dataset.i; if (i !== stop) setStop(i, { scroll: true }); } });
  }, { rootMargin: '-45% 0px -45% 0px' });
  function renderMobile() {
    const ae = document.activeElement, keep = ae && mlist.contains(ae) ? { i: ae.closest('.dh-mcard').dataset.i, aud: ae.dataset.aud, swap: ae.classList.contains('dh-swap') } : null;
    mio.disconnect(); mlist.textContent = '';
    if (!narrow) return;
    DIST_STEPS.forEach((st, i) => {
      const art = el('article', 'dh-mcard'); art.id = 'dh-m-' + i; art.dataset.i = i; art.setAttribute('aria-labelledby', 'dh-m' + i + '-k');
      const box = el('div', 'dh-card dh-box'); cardInto(box, i, 'dh-m' + i);
      art.appendChild(box); mlist.appendChild(art); mio.observe(art);
    });
    markMobile();
    if (keep) {
      const host = $('#dh-m-' + keep.i), n = host && (keep.swap ? $('.dh-swap', host) : keep.aud ? $(`[data-aud="${keep.aud}"]`, host) : null);
      if (n) n.focus({ preventScroll: true });
    }
  }
  const markMobile = () => $$('.dh-mcard', mlist).forEach(m => m.classList.toggle('is-active', +m.dataset.i === stop));
  function scrollToCard(i) {
    const art = $('#dh-m-' + i); if (!art) return;
    const top0 = parseFloat(getComputedStyle(fig).top) || 0;
    const y = art.getBoundingClientRect().top + window.scrollY - top0 - fig.offsetHeight - 12;
    lockUntil = Date.now() + (REDUCED ? 250 : 1100);
    window.scrollTo({ top: Math.max(0, y), behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* · régua clicável (role=tablist) · */
  function buildTicks() {
    ticksBox.textContent = '';
    ticks = DIST_STEPS.map((st, i) => {
      const b = el('button', 'dh-tick' + (i === LAST ? ' dh-tick-last' : ''));
      b.type = 'button'; b.id = 'dh-tab-' + i; b.dataset.i = i; b.tabIndex = -1;
      b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', 'false'); b.setAttribute('aria-label', st.rotulo + ', ' + st.zona);
      const tn = el('span', 'dh-tn', st.curto || st.rotulo);
      if (st.resto) tn.appendChild(el('span', 'dh-tn-x', st.resto));
      b.appendChild(tn);
      if (i < 4) b.appendChild(el('span', 'dh-tz', st.curta));
      ticksBox.appendChild(b);
      return b;
    });
  }
  const syncTickTargets = () => ticks.forEach((b, i) => b.setAttribute('aria-controls', narrow ? 'dh-m-' + i : 'dh-card'));
  ticksBox.addEventListener('keydown', e => {
    const b = e.target.closest('.dh-tick'); if (!b) return;
    const i = +b.dataset.i, n = { ArrowRight: (i + 1) % 6, ArrowLeft: (i + 5) % 6, Home: 0, End: LAST }[e.key];
    if (n == null) return;
    e.preventDefault();
    ticks.forEach((t, j) => { t.tabIndex = j === n ? 0 : -1; });
    ticks[n].focus();
  });
  ticksBox.addEventListener('focusout', e => { if (!ticksBox.contains(e.relatedTarget)) ticks.forEach((t, j) => { t.tabIndex = j === stop ? 0 : -1; }); });

  /* · troca de parada · */
  function setStop(i, o = {}) {
    i = clamp(i | 0, 0, LAST);
    const changed = i !== stop;
    stop = i;
    svg.dataset.stop = i; root.dataset.stop = i;
    if (+range.value !== i) range.value = i;
    range.setAttribute('aria-valuetext', valueText(i));
    range.style.setProperty('--fill', (i / LAST * 100) + '%');
    rangeV.textContent = DIST_STEPS[i].rotulo + ' · ' + DIST_STEPS[i].zona;
    ticks.forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); b.classList.toggle('is-reached', j < i); if (!ticksBox.contains(document.activeElement)) b.tabIndex = j === i ? 0 : -1; });
    if (!narrow && (changed || o.force)) {
      card.setAttribute('aria-live', autoOn || !o.user ? 'off' : 'polite');
      card.setAttribute('aria-labelledby', 'dh-tab-' + i);
      renderCard();
    }
    if (narrow) markMobile();
    tEl.textContent = titleFor(i); dEl.textContent = descFor(i);
    capA.classList.toggle('is-on', i >= 4);
    setText(O.bubble, DIST_STEPS[i].verbo);
    if (i !== 0) hideHint();
    sealTick();
    const target = Math.min(i, 4);
    if (REDUCED || o.instant) { tw = null; aw = null; s = target; a = i === LAST ? 1 : 0; render(performance.now()); return; }
    const now = performance.now(), d = Math.abs(s - target);
    tw = d > 1e-4 ? { from: s, to: target, t0: now, dur: Math.min(1100, 600 + 140 * Math.max(0, d - 1)) } : null;
    if (i === LAST) aw = tw || a >= 1 ? null : { from: a, to: 1, t0: now, dur: 1500 * (1 - a) };
    else aw = a > 0 ? { from: a, to: 0, t0: now, dur: 320 * a } : null;
    if (!tw && !aw) render(now);
    kick();
  }
  function choose(i) { setStop(i, { user: true }); if (narrow) scrollToCard(i); }

  /* · plateia · */
  function updateWho() {
    setText(O.who, DIST_AUD[aud].rotulo);
    O.who.classList.toggle('is-set', aud !== 'geral');
  }
  function refreshCopy() {
    updateWho();
    tEl.textContent = titleFor(stop); dEl.textContent = descFor(stop);
    sealTick(); render(performance.now());
  }
  function voteFly(done) {
    const x0 = lerpArr(L.lx, Math.min(s, 4)), x1 = L.me - L.mark / 2;
    if (REDUCED || !S.vote.animate) {
      S.vmark.setAttribute('opacity', '1'); setTimeout(() => S.vmark && S.vmark.setAttribute('opacity', '0'), 900);
      done(); return;
    }
    const an = S.vote.animate([
      { transform: `translate(${x0}px, ${L.cy}px) scale(.6)`, opacity: 1 },
      { transform: `translate(${x1}px, ${L.cy}px) scale(1.3)`, opacity: .35 }
    ], { duration: 400, easing: 'cubic-bezier(.22, .61, .36, 1)' });
    an.onfinish = () => {
      S.meG.classList.remove('is-ping'); S.meG.getBoundingClientRect(); S.meG.classList.add('is-ping');
      setTimeout(() => S.meG && S.meG.classList.remove('is-ping'), 700);
      done();
    };
  }
  function pick(key, btn) {
    const fromAsk = !!btn.closest('.dh-ask');
    const host = btn.closest('.dh-mcard'), at = host ? +host.dataset.i : stop;
    aud = key;
    try { localStorage.setItem(KEY, key); } catch (e) { /* sem armazenamento: a escolha vale só nesta visita */ }
    $$('[data-aud]', root).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.aud === key)));
    refreshCopy();
    if (fromAsk) {
      /* participar aproxima: o voto leva a luz uma parada inteira */
      voteFly(() => {
        if (narrow) { renderMobile(); setStop(2, { user: true }); scrollToCard(2); const sw = $('#dh-m-2 .dh-swap'); if (sw) sw.focus({ preventScroll: true }); }
        else { setStop(2, { user: true, force: true }); const sw = $('.dh-swap', card); if (sw) sw.focus({ preventScroll: true }); }
      });
      return;
    }
    if (narrow) { renderMobile(); const sw = $(`#dh-m-${at} .dh-swap`); if (sw) sw.focus({ preventScroll: true }); }
    else { card.setAttribute('aria-live', 'polite'); renderCard(); const sw = $('.dh-swap', card); if (sw) sw.focus({ preventScroll: true }); }
  }
  function toggleSwap(sw, open) {
    const g = document.getElementById(sw.getAttribute('aria-controls')); if (!g) return;
    if (open == null) open = sw.getAttribute('aria-expanded') !== 'true';
    sw.setAttribute('aria-expanded', String(open)); g.hidden = !open;
    if (open) { const b = $('[aria-pressed="true"]', g) || $('button', g); if (b) b.focus(); }
  }
  function redo() {
    setStop(0, { user: true });
    if (narrow) scrollToCard(0); else ticks[0].focus();
  }

  /* · selo: o sim da plateia, ou os seis sins em rodízio · */
  function sealTick() {
    clearTimeout(sealT);
    const A = DIST_AUD[aud];
    if (A.sim) { setText(O.sealT, A.sim); placeSeal(); return; }
    setText(O.sealT, DIST_AUD[DIST_AUD_KEYS[sealI % 6]].sim);
    placeSeal();
    if (REDUCED || stop < 4 || hoverStage || !canAnimate()) return;
    sealT = setTimeout(() => { sealI++; sealTick(); }, 1200);
  }

  /* · dica e autoexecução única · */
  function hideHint() { O.hint.classList.add('is-gone'); }
  function interrupt() {
    gestured = true; clearTimeout(autoT);
    if (autoOn) { autoOn = false; card.setAttribute('aria-live', 'polite'); }
  }
  function armAuto() {
    clearTimeout(autoT);
    if (played || gestured || REDUCED || narrow || !onScreen || document.hidden || currentView !== 'v-site') return;
    autoT = setTimeout(() => {
      if (played || gestured || !onScreen || narrow) return;
      played = true; autoOn = true; card.setAttribute('aria-live', 'off');
      autoStep();
    }, 3000);
  }
  function autoStep() {
    if (!autoOn) return;
    if (!onScreen || document.hidden || currentView !== 'v-site') { autoT = setTimeout(autoStep, 600); return; }
    const n = stop + 1;
    if (n > LAST) { autoOn = false; return; }
    setStop(n);
    if (n === 1) { const q = $('.dh-ask', card); if (q) q.classList.add('is-blink'); }
    if (n >= LAST) { autoOn = false; setTimeout(() => card.setAttribute('aria-live', 'polite'), 60); return; }
    autoT = setTimeout(autoStep, 2400);
  }

  /* · arrastar a luz · */
  const toX = cx => { const rc = svg.getBoundingClientRect(); return (cx - rc.left) / rc.width * L.W; };
  const xToS = x => { const lx = L.lx; if (x <= lx[0]) return 0; for (let i = 0; i < 4; i++) if (x <= lx[i + 1]) return i + (x - lx[i]) / (lx[i + 1] - lx[i]); return 4; };
  svg.addEventListener('pointerdown', e => {
    if (narrow || e.target !== S.hit || e.button > 0) return;
    e.preventDefault();
    drag = { id: e.pointerId, x0: e.clientX, moved: false, near: stop };
    try { S.hit.setPointerCapture(e.pointerId); } catch (err) { /* segue sem captura */ }
    tw = null;
    if (a > 0) { aw = { from: a, to: 0, t0: performance.now(), dur: 280 }; kick(); }
    stage.classList.add('is-drag'); hideHint();
  });
  svg.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (Math.abs(e.clientX - drag.x0) > 3) drag.moved = true;
    if (!drag.moved) return;
    const x = toX(e.clientX);
    s = xToS(x);
    drag.near = x > (L.lx[4] + L.ticks[5]) / 2 ? LAST : Math.round(s);
    setText(O.bubble, DIST_STEPS[drag.near].verbo);
    if (!raf) render(performance.now());
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const n = drag.moved ? drag.near : stop;
    drag = null; stage.classList.remove('is-drag');
    setStop(n, { user: true });
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  /* · eventos · */
  root.addEventListener('click', e => {
    const tk = e.target.closest('.dh-tick'); if (tk) { choose(+tk.dataset.i); return; }
    const ab = e.target.closest('[data-aud]'); if (ab) { pick(ab.dataset.aud, ab); return; }
    const sw = e.target.closest('.dh-swap'); if (sw) { toggleSwap(sw); return; }
    if (e.target.closest('[data-dh-redo]')) redo();
  });
  root.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const g = e.target.closest('.dh-auds[id]'); if (!g || g.hidden) return;
    const sw = $(`[aria-controls="${g.id}"]`, root); if (sw) { toggleSwap(sw, false); sw.focus(); }
  });
  range.addEventListener('input', () => { const i = +range.value; setStop(i, { user: true }); if (narrow) scrollToCard(i); });
  /* qualquer toque, foco ou passagem do mouse interrompe a autoexecução */
  root.addEventListener('pointerdown', e => { interrupt(); if (e.target.closest('.dh-stage, .dh-panel')) hideHint(); }, true);
  root.addEventListener('keydown', () => { interrupt(); hideHint(); }, true);
  root.addEventListener('focusin', interrupt);
  root.addEventListener('pointerover', e => { if (e.pointerType === 'mouse') interrupt(); });
  stage.addEventListener('pointerenter', () => { hoverStage = true; });
  stage.addEventListener('pointerleave', () => { hoverStage = false; sealTick(); });

  if (window.ResizeObserver) new ResizeObserver(() => { placeSeal(); if (!raf) render(performance.now()); }).observe(stage);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { placeSeal(); render(performance.now()); });
  card.addEventListener('animationend', () => card.classList.remove('is-in'));

  const io = new IntersectionObserver(es => {
    const en = es[es.length - 1];
    inView = en.isIntersecting; onScreen = en.intersectionRatio >= .5;
    if (en.intersectionRatio >= .2) stage.classList.add('is-on');
    stage.classList.toggle('is-vis', inView);
    if (onScreen) armAuto(); else if (!autoOn) clearTimeout(autoT);
    kick(); sealTick();
  }, { threshold: [0, .2, .5, .75] });
  io.observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(autoT); else { kick(); armAuto(); } sealTick(); });
  document.addEventListener('halor:view', e => { if (e.detail === 'v-site') { kick(); armAuto(); } else if (!autoOn) clearTimeout(autoT); sealTick(); });

  /* a faixa do celular fica logo abaixo do menu quando o menu também fica preso no topo */
  function navOffset() {
    const nav = $('#s-nav'), pos = nav ? getComputedStyle(nav).position : '';
    root.style.setProperty('--dh-top', (pos === 'sticky' || pos === 'fixed' ? nav.offsetHeight : 0) + 'px');
  }
  function applyMode() {
    narrow = mq.matches;
    navOffset();
    if (narrow && autoOn) { autoOn = false; clearTimeout(autoT); }
    buildScene(); placeOverlays(); syncTickTargets();
    O.voice._end = undefined;
    renderMobile();
    setStop(stop, { instant: true, force: true });
  }
  if (mq.addEventListener) mq.addEventListener('change', applyMode); else if (mq.addListener) mq.addListener(applyMode);

  /* · partida · */
  buildTicks();
  DIST_STEPS.forEach(st => srList.appendChild(el('li', null, `${st.rotulo}, ${st.zona.toLowerCase()}. Quem assiste diz: ${st.verbo} ${st.desc} O Halor mede: ${st.sinal}`)));
  updateWho();
  applyMode();
  setTimeout(() => { if (!autoOn) card.setAttribute('aria-live', 'polite'); }, 400);
}

function bootEfeito() { buildDistancia(); }
