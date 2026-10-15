/* ==========================================================================
   O FILME · 60 s roteirizados em DOM + canvas, com trilha sintetizada opcional
   Roteiro: 50 ms → efeito halo → o que brilha primeiro → a cadeia na régua de
   7 m até 0 → halor · Faça cada olhar render. → o Estúdio por dentro (crie,
   importe, preveja, salve como, envie, apresente, meça) → nove resultados →
   cada olhar vira dado → comece grátis.
   Relógio: cada cena recebe --lt (segundos desde o início dela) e as animações
   CSS ficam pausadas, guiadas por animation-delay. Contadores, digitação,
   cursor e réguas são calculados aqui a partir do mesmo tempo, então qualquer
   ponto da trilha mostra o quadro exato.
   ========================================================================== */
const Film = (() => {
  const D = 60;
  const CHAPTERS = [
    { t: 0, n: 'Abertura' }, { t: 3, n: 'Efeito halo' }, { t: 8, n: 'A cadeia' }, { t: 11, n: 'Halor' },
    { t: 13.5, n: 'Crie' }, { t: 22.5, n: 'Importe' }, { t: 25.5, n: 'Preveja' }, { t: 28.5, n: 'Salve e envie' }, { t: 34.5, n: 'Apresente' }, { t: 42, n: 'Meça' }, { t: 44.5, n: 'Resultados' }, { t: 56, n: 'Comece' }
  ];
  // mundo Papel: abre a partir da faísca do logo e fecha no aviso do link copiado
  const PAPER = [{ a: 13.5, b: 32, from: 'spark', to: 'toast' }, { a: 42, b: 44.5, from: 'center', to: null }];
  // clarões de corte: [tempo, duração, intensidade]
  const FLASH = [[2.94, .08, .7], [32, .16, .35], [42, .12, .25], [44.5, .14, .45], [56, .3, .3]];
  // trilha: semitons acima de dó 5; os resultados sobem um semitom por quadro
  const CUES = [[.05, 0], [3, 4], [6, 7], [8, 9], [11, 12], [13.5, 7], [15.5, 9], [17.5, 11], [20.5, 12], [22.5, 14], [25.5, 12], [28.5, 14], [32, 16], [34.5, 12], [37, 14], [39.5, 16], [42, 19]]
    .concat([0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => [44.5 + k, 7 + k]), [[53.5, 12], [56, 'chord']]);
  const TAU = Math.PI * 2, ARC0 = -25 * Math.PI / 180, ARCL = 320 * Math.PI / 180, GAP = -45 * Math.PI / 180;

  /* slides usados nas miniaturas (renderizados por slideHTML) */
  const FS = {
    cover: { type: 'cover', k: 'Kickoff · 2027', h: 'Plano 2027', sub: 'Do kickoff à entrega · Grupo Aurora' },
    text: { type: 'text', k: 'Contexto', h: 'Por que agora.', p: ['Três frentes, um só plano.', 'Kickoff em 4 de novembro.'] },
    tl: { type: 'tl', k: 'Cronograma', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] },
    team: { type: 'steps', k: 'Equipe', h: 'Quem faz acontecer.', s: [['01', 'Marina', 'Comercial'], ['02', 'Rafael', 'Produto'], ['03', 'Júlia', 'Operação']] },
    kpi: { type: 'kpi', k: 'Meta', h: 'Do kickoff à entrega em 84 dias.', big: '84', cap: 'dias, com entregas a cada quatro semanas', bars: [[28, 'S4'], [56, 'S8'], [70, 'S10'], [84, 'S12']] },
    next: { type: 'next', k: 'Próximos passos', h: 'Combinamos o começo?', items: ['Validar o escopo', 'Kickoff em 4 de novembro', 'Primeira entrega em S4'], cta: 'Kickoff em 4 de novembro' },
    table: { type: 'table', k: 'Investimento', h: 'Um plano para o time.', rows: [['Plano Órbita · 25 pessoas', '12 meses', 'R$ 11.760'], ['Implantação', 'uma vez', 'R$ 8.000'], ['Total no primeiro ano', '', 'R$ 19.760']] },
    end: { type: 'end', h: 'Obrigado.', sub: 'marina@nortesistemas.com.br' },
    t1: { type: 'cover', k: 'Proposta', h: 'Sua proposta, com luz própria.', sub: 'Cliente · data' },
    t2: { type: 'kpi', k: 'Tração', h: 'Crescemos 3× em um ano.', big: '3×', cap: 'receita recorrente em 12 meses', bars: [[30, 'T1'], [48, 'T2'], [70, 'T3'], [92, 'T4']] },
    t3: { type: 'steps', k: 'Status', h: 'Onde estamos em três frentes.', s: [['01', 'No prazo', 'Comercial'], ['02', 'Atenção', 'Técnica'], ['03', 'Concluído', 'Treinamento']] },
    t4: { type: 'tl', k: 'Kickoff', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] },
    t5: { type: 'text', k: 'Aula', h: 'O efeito halo em 10 minutos.', p: ['Três ideias, um exercício.'] },
    t6: { type: 'end', h: 'Comece aqui.', sub: 'Kit de marca aplicado' },
    'r-prop': { type: 'cover', k: 'Proposta comercial', h: 'Menos ciclo, mais contratos.', sub: 'Para Grupo Aurora' },
    'r-pitch': { type: 'kpi', k: 'Pitch · Série A', h: 'Crescemos 3× em um ano.', big: '3×', cap: 'receita recorrente', bars: [[30, 'T1'], [48, 'T2'], [70, 'T3'], [92, 'T4']] }
  };
  const RAIL = ['cover', 'text', 'tl', 'team', 'kpi', 'next', 'table', 'end'];
  const RIB = [['i-text', 'Texto'], ['i-shape', 'Formas'], ['i-image', 'Imagem'], ['i-bars', 'Gráficos'], ['i-table', 'Tabela'], ['i-cards', 'Cards'], ['|'], ['i-grid', 'Modelos'], ['i-wand', 'Efeitos'], ['|'], ['i-target', 'Raio Halor']];
  const POSTS = ['integração', 'treinamento', 'prazo', 'dados', 'suporte', 'escopo', 'metas', 'piloto', 'agenda', 'acessos'];
  const POST_XY = [[2, 4], [26, 0], [50, 6], [74, 2], [6, 36], [30, 32], [54, 38], [76, 34], [14, 68], [46, 70]];

  let film, cv, ctx, paperEl, flashEl, fillEl, timeEl, chapEl, track;
  let scenes = [], state = 'poster', t = 0, last = 0, raf = 0, w = 0, h = 0, stars;
  let audio = null, soundOn = false, dragging = false, pclipLast = '', paperClip = null, paperOn = false;
  const A = {}, RULES = {}, VOTES = [], SEATS = 38;
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => 1 - Math.pow(1 - clamp(v), 3);
  const eio = v => { v = clamp(v); return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
  const lin = v => clamp(v);
  const nums = s => s.trim().split(/\s+/).map(Number);
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function valAt(segs, lt, fn) {
    let v = segs[0][0];
    for (const [a, b, at, du] of segs) if (lt >= at) v = a + (b - a) * (REDUCED ? 1 : (fn || ease)((lt - at) / du));
    return v;
  }
  // régua: com movimento reduzido a luz salta de parada em parada, sem deslizar
  function ruleX(r, lt) {
    if (!REDUCED) return valAt(r.segs, lt, eio);
    const [a, b, at, du] = r.segs[0], x = a + (b - a) * clamp((lt - at) / du);
    let snap = a; for (const p of r.stops) if (p <= x + 1e-6 && p >= a) snap = p;
    return snap;
  }
  // posição de um elemento relativa a uma raiz posicionada, sem transformações
  function box(n, root) {
    const r = { x: 0, y: 0, w: n.offsetWidth, h: n.offsetHeight };
    while (n && n !== root) { r.x += n.offsetLeft; r.y += n.offsetTop; n = n.offsetParent; }
    return r;
  }

  /* · montagem: miniaturas, faixas, trilhos, palavras, votos e post-its · */
  function build() {
    $$('[data-slide]', film).forEach(e => { const s = FS[e.dataset.slide]; if (s) e.innerHTML = slideHTML(s, +(e.dataset.nSlide || 1), 'halor'); });
    $$('[data-ribbon]', film).forEach(r => {
      r.innerHTML = RIB.map(([ic, lb]) => ic === '|' ? '<span class="fm-rb-sep"></span>'
        : `<span class="fm-rb${ic === 'i-target' ? ' ray fm-ray' : ''}"><svg aria-hidden="true"><use href="#${ic}"/></svg><em>${lb}</em></span>`).join('');
      if (r.dataset.ray) $('.ray', r).dataset.on = r.dataset.ray + ' 99';
    });
    $$('[data-rail]', film).forEach(r => {
      const act = +r.dataset.rail, drop = r.dataset.drop ? nums(r.dataset.drop) : null;
      r.innerHTML = RAIL.map((k, i) => {
        const badge = drop && (i === 4 || i === 5)
          ? `<span class="fm-badge fa fa-pop" style="--at:${drop[i - 4]};--du:.35"><svg aria-hidden="true"><use href="#${i === 4 ? 'fi-vote' : 'fi-note'}"/></svg></span>` : '';
        return `<li${i + 1 === act ? ' class="act"' : ''}>${slideHTML(FS[k], i + 1, 'halor')}${badge}</li>`;
      }).join('');
    });
    $$('[data-words]', film).forEach(e => {
      const [at, st] = nums(e.dataset.words), words = e.textContent.trim().split(/\s+/);
      e.textContent = '';
      words.forEach((wd, i) => {
        const sp = el('span', 'fw fa fa-up', wd); sp.style.setProperty('--at', (at + i * st).toFixed(2)); sp.style.setProperty('--du', '.4');
        e.appendChild(sp); if (i < words.length - 1) e.appendChild(document.createTextNode(' '));
      });
    });
    // 38 votos: 17 em Prazo, 13 em Escopo, 8 em Equipe, numa ordem fixa
    const bag = [].concat(Array(17).fill(0), Array(13).fill(1), Array(8).fill(2));
    for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(rnd(i + 3) * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
    const per = [0, 0, 0];
    bag.forEach((c, i) => { const dep = 2.55 + i * .044; VOTES.push({ c, n: per[c]++, seat: (i * 7) % SEATS, dep, arr: dep + .42 }); });
    $$('[data-votes]', film).forEach(e => {
      const c = +e.dataset.votes;
      VOTES.filter(v => v.c === c).forEach(v => { const d = el('i', 'fa fa-pop'); d.style.setProperty('--at', v.arr.toFixed(2)); d.style.setProperty('--du', '.28'); e.appendChild(d); });
    });
    $$('[data-posts]', film).forEach(b => {
      const [at, al] = nums(b.dataset.posts);
      POSTS.forEach((word, i) => {
        const inList = i < 5, [x, y] = POST_XY[i];
        const p = el('span', 'fs-pi fd');
        p.style.cssText = `--x1:${x}%;--y1:${y}%;--w1:22%;--r:${((rnd(i + 40) - .5) * 10).toFixed(1)}deg;--x2:22%;--y2:${i * 19}%;--w2:56%;--xt:${(al + i * .03).toFixed(2)};--xn:${inList ? 'f-align' : 'f-out'};--xdu:${inList ? .45 : .2}`;
        const s = el('span', 'fa fa-rise2', word); s.style.setProperty('--at', (at + i * .1).toFixed(2));
        p.appendChild(s); b.appendChild(p);
      });
    });
    $$('[data-dots]', film).forEach(b => {
      const n = +b.dataset.dots;
      for (let i = 0; i < n; i++) {
        const o = el('i', 'fd'); o.style.cssText = `--xt:${(.8 + i * .006).toFixed(3)};--xn:f-x-rise;--xdu:.2`;
        const d = el('b', 'fa fa-align'); d.style.cssText = `--at:${(.02 + i * .008).toFixed(3)};--sx:${((rnd(i + 70) - .5) * 26).toFixed(1)}cqw;--sy:${((rnd(i + 90) - .5) * 18).toFixed(1)}cqw`;
        o.appendChild(d); b.appendChild(o);
      }
    });
  }

  function parseScene(n) {
    const s = { n, from: +n.dataset.from, to: +n.dataset.to, fi: n.dataset.fi != null ? +n.dataset.fi : .18, fo: n.dataset.fo != null ? +n.dataset.fo : .18, vis: false };
    s.counts = $$('[data-n]', n).map(e => ({ e, segs: [nums(e.dataset.n)].concat(e.dataset.n2 ? [nums(e.dataset.n2)] : []), pad: +(e.dataset.pad || 0), suf: e.dataset.suf || '', fn: e.dataset.ez === 'lin' ? lin : ease, ring: e.hasAttribute('data-ring'), last: null }));
    s.types = $$('[data-type]', n).map(e => { const [at, du] = nums(e.dataset.type); return { e, at, du, full: e.textContent, last: -1 }; });
    s.clocks = $$('[data-clock]', n).map(e => { const [s0, at] = nums(e.dataset.clock); return { e, s0, at, last: '' }; });
    s.ons = $$('[data-on]', n).map(e => { const [a, b] = nums(e.dataset.on); return { e, a, b }; });
    s.rules = $$('[data-walk]', n).map(e => {
      const r = { e, segs: [nums(e.dataset.walk)], warm: e.hasAttribute('data-warm'), dot: $('.fr-dot', e), ticks: $$('[data-pos]', e).map(k => ({ k, p: +k.dataset.pos })) };
      if (e.dataset.anchor) RULES[e.dataset.anchor] = { segs: r.segs, from: s.from, stops: r.ticks.map(k => k.p) };
      r.stops = r.ticks.map(k => k.p);
      return r;
    });
    s.mocks = $$('[data-cur]', n).map(m => ({
      m, cur: $('.fm-cur', m), rip: $('.fm-rip', m), pts: [], ok: false,
      way: m.dataset.cur.split('|').map(x => { x = x.trim(); const i = x.indexOf(' '); return { t: +x.slice(0, i), tg: x.slice(i + 1).trim() }; }),
      hov: $$('[data-hov]', m).map(e => ({ e, r: null })),
      drags: $$('[data-drag]', m).map(e => { const [a, b] = nums(e.dataset.drag); return { e, a, b }; }),
      flips: $$('[data-flip]', m).map(e => { const p = e.dataset.flip.split('|'); return { e, from: p[0], to: p[1], at: +p[2], du: +p[3] }; })
    }));
    s.mocks.forEach(mk => { mk.clicks = mk.way.filter(x => x.tg === '!').map(x => x.t); });
    return s;
  }

  function init() {
    film = $('#film'); if (!film) return;
    cv = $('.film-cv', film); ctx = cv.getContext('2d');
    paperEl = $('.film-paper', film); flashEl = $('.film-flash', film);
    fillEl = $('.film-fill', film); timeEl = $('.film-time', film); chapEl = $('.film-chap', film); track = $('.film-track', film);
    build();
    scenes = $$('.sc', film).map(parseScene);
    stars = makeStars(110);
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
  function measure() {
    if (!film || !film.offsetWidth) return;
    $$('[data-anchor]', film).forEach(n => { const b = box(n, film); A[n.dataset.anchor] = { x: b.x + b.w / 2, y: b.y + b.h / 2, l: b.x, t: b.y, w: b.w, h: b.h }; });
    if (A.mark) A.spark = { x: A.mark.l + A.mark.w * .7875, y: A.mark.t + A.mark.h * .2125 };
    for (const s of scenes) for (const mk of s.mocks) mk.ok = false;
  }
  function measureMock(mk) {
    const m = mk.m, W = m.offsetWidth, H = m.offsetHeight; if (!W) return;
    let prev = { x: 50, y: 50 };
    mk.pts = mk.way.map(wp => {
      let p = prev;
      if (/^-?[\d.]+,-?[\d.]+$/.test(wp.tg)) { const [x, y] = wp.tg.split(',').map(Number); p = { x, y }; }
      else if (wp.tg !== '!') { const e = $(wp.tg, m); if (e) { const b = box(e, m); p = { x: (b.x + b.w * .5) / W * 100, y: (b.y + b.h * .55) / H * 100 }; } }
      prev = p; return p;
    });
    mk.hov.forEach(o => { const b = box(o.e, m); o.r = [b.x / W * 100, b.y / H * 100, (b.x + b.w) / W * 100, (b.y + b.h) / H * 100]; });
    mk.flips.forEach(f => {
      const a = $(f.from, m), z = $(f.to, film), zm = z && z.closest('.fm'); if (!a || !zm) return;
      const ba = box(a, m), bz = box(z, zm), ZW = zm.offsetWidth, ZH = zm.offsetHeight;
      f.r0 = [ba.x / W * 100, ba.y / H * 100, ba.w / W * 100, ba.h / H * 100];
      f.r1 = [bz.x / ZW * 100, bz.y / ZH * 100, bz.w / ZW * 100, bz.h / ZH * 100];
    });
    mk.ok = true;
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

  /* · quadro: cenas, papel, clarão, barra e canvas · */
  function render() {
    for (const s of scenes) {
      const vis = t >= s.from && t < s.to + (REDUCED ? 0 : s.fo);
      if (vis !== s.vis) { s.vis = vis; s.n.classList.toggle('on', vis); if (vis) s.mocks.forEach(mk => { mk.ok = false; }); }
      if (!vis) continue;
      const lt = t - s.from;
      let op = 1;
      if (!REDUCED) { if (s.fi > 0) op = Math.min(op, lt / s.fi); if (t > s.to && s.fo > 0) op = Math.min(op, 1 - (t - s.to) / s.fo); }
      s.n.style.opacity = clamp(op).toFixed(3);
      s.n.style.setProperty('--lt', lt.toFixed(3));
      update(s, lt);
    }
    paperFrame(); flashFrame(); barFrame(); draw();
  }
  function update(s, lt) {
    for (const c of s.counts) {
      const v = valAt(c.segs, lt, c.fn);
      if (c.ring) { const C = 207.3, str = (v / 100 * C).toFixed(1) + ' ' + C; if (str !== c.last) { c.e.style.strokeDasharray = str; c.last = str; } }
      else { const r = Math.round(v), txt = (c.pad ? String(r).padStart(c.pad, '0') : String(r)) + c.suf; if (txt !== c.last) { c.e.textContent = txt; c.last = txt; } }
    }
    for (const y of s.types) {
      const k = REDUCED ? (lt >= y.at ? 1 : 0) : clamp((lt - y.at) / y.du), n = Math.round(y.full.length * k);
      if (n !== y.last) { y.e.textContent = y.full.slice(0, n); y.last = n; }
      y.e.classList.toggle('typing', !REDUCED && lt >= y.at - .25 && lt < y.at + y.du + .3);
    }
    for (const c of s.clocks) {
      const sec = c.s0 + Math.max(0, Math.floor(lt - c.at)), txt = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
      if (txt !== c.last) { c.e.textContent = txt; c.last = txt; }
    }
    for (const o of s.ons) o.e.classList.toggle('act', lt >= o.a && lt < o.b);
    for (const r of s.rules) {
      const x = ruleX(r, lt);
      r.e.style.setProperty('--x', x.toFixed(4));
      for (const tk of r.ticks) tk.k.classList.toggle('lit', x >= tk.p - .002);
      if (r.warm && r.dot) { r.dot.style.setProperty('--dc', 'rgb(' + warm(x).join(',') + ')'); r.dot.style.setProperty('--ds', (.6 + .9 * x).toFixed(3)); }
    }
    for (const mk of s.mocks) updateMock(mk, lt);
  }
  function updateMock(mk, lt) {
    if (!mk.ok) measureMock(mk);
    const wy = mk.way, P = mk.pts; if (!P.length) return;
    let i = 0; while (i < wy.length - 1 && lt >= wy[i + 1].t) i++;
    let p;
    if (lt <= wy[0].t || i >= wy.length - 1) p = P[lt <= wy[0].t ? 0 : P.length - 1];
    else if (REDUCED) p = P[i];
    else { const k = eio((lt - wy[i].t) / (wy[i + 1].t - wy[i].t)); p = { x: P[i].x + (P[i + 1].x - P[i].x) * k, y: P[i].y + (P[i + 1].y - P[i].y) * k }; }
    if (mk.cur) {
      mk.cur.style.left = p.x.toFixed(2) + '%'; mk.cur.style.top = p.y.toFixed(2) + '%';
      mk.cur.style.opacity = lt >= wy[0].t ? 1 : 0;
      mk.cur.classList.toggle('down', mk.clicks.some(c => lt >= c - .06 && lt < c + .1));
    }
    if (mk.rip) {
      let c = null; for (const ct of mk.clicks) if (lt >= ct && lt < ct + .45) c = ct;
      if (c == null || REDUCED) mk.rip.style.opacity = 0;
      else { const q = (lt - c) / .45; mk.rip.style.left = p.x.toFixed(2) + '%'; mk.rip.style.top = p.y.toFixed(2) + '%'; mk.rip.style.opacity = (1 - q).toFixed(3); mk.rip.style.transform = 'scale(' + (.3 + q).toFixed(3) + ')'; }
    }
    for (const o of mk.hov) if (o.r) o.e.classList.toggle('hov', lt >= wy[0].t && p.x >= o.r[0] && p.x <= o.r[2] && p.y >= o.r[1] && p.y <= o.r[3]);
    for (const d of mk.drags) {
      const on = lt >= d.a && lt < d.b; d.e.classList.toggle('act', on);
      if (on) { d.e.style.left = p.x.toFixed(2) + '%'; d.e.style.top = p.y.toFixed(2) + '%'; }
    }
    for (const f of mk.flips) {
      if (!f.r0 || lt < f.at) { f.e.classList.remove('act'); continue; }
      const k = REDUCED ? 1 : eio((lt - f.at) / f.du), r = f.r0.map((v, j) => v + (f.r1[j] - v) * k);
      f.e.classList.add('act');
      f.e.style.left = r[0].toFixed(2) + '%'; f.e.style.top = r[1].toFixed(2) + '%'; f.e.style.width = r[2].toFixed(2) + '%'; f.e.style.height = r[3].toFixed(2) + '%';
    }
  }
  function warm(x) {
    const a = [166, 156, 196], b = [169, 112, 255], c = [244, 238, 255];
    const [p, q, k] = x < .5 ? [a, b, x / .5] : [b, c, (x - .5) / .5];
    return p.map((v, i) => Math.round(v + (q[i] - v) * k));
  }
  function paperFrame() {
    let op = 0; paperClip = null; paperOn = false;
    for (const p of PAPER) {
      if (t < p.a || t >= p.b) continue;
      op = 1; paperOn = true;
      if (REDUCED) break;
      const fi = (t - p.a) / .42, fo = p.to ? (p.b - t) / .36 : 9;
      if (fi < 1) paperClip = circ(p.from, ease(fi)); else if (fo < 1) paperClip = circ(p.to, ease(fo));
    }
    const clip = paperClip ? `circle(${paperClip.r.toFixed(1)}px at ${paperClip.x.toFixed(1)}px ${paperClip.y.toFixed(1)}px)` : 'none';
    paperEl.style.opacity = op;
    if (clip !== pclipLast) { film.style.setProperty('--pclip', clip); pclipLast = clip; }
  }
  function circ(name, k) {
    const a = (name !== 'center' && A[name]) || { x: w / 2, y: h / 2 };
    const R = Math.hypot(Math.max(a.x, w - a.x), Math.max(a.y, h - a.y));
    return { x: a.x, y: a.y, r: Math.max(.1, R * k) };
  }
  function flashFrame() {
    let f = 0;
    if (!REDUCED && state !== 'poster') for (const [ft, d, a] of FLASH) { const q = (t - ft) / d; if (q > -.4 && q < 1) f = Math.max(f, a * (q < 0 ? 1 + q / .4 : 1 - q)); }
    flashEl.style.opacity = f.toFixed(3);
  }
  function barFrame() {
    fillEl.style.width = (t / D * 100) + '%';
    timeEl.textContent = fmt(t) + ' / ' + fmt(D);
    let ch = CHAPTERS[0]; for (const c of CHAPTERS) if (t >= c.t) ch = c;
    track.setAttribute('aria-valuenow', String(Math.round(t)));
    track.setAttribute('aria-valuetext', Math.round(t) + ' de ' + D + ' segundos · ' + ch.n);
    if (chapEl.textContent !== ch.n) chapEl.textContent = ch.n;
  }

  /* · canvas: estrelas, arcos neon, partículas e pulsos que acompanham as cenas · */
  function glow(x, y, r, a, c) {
    if (r <= 0 || a <= 0) return;
    c = c || [201, 166, 255];
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,' + Math.min(1, a) + ')'); g.addColorStop(.22, 'rgba(' + c.join(',') + ',' + a * .7 + ')'); g.addColorStop(1, 'rgba(139,61,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  function dot(x, y, r, a) { glow(x, y, r * 6, a); }
  function ring(x, y, r, a, lw, a0, a1) {
    if (r <= 0 || a <= 0) return;
    ctx.save(); ctx.strokeStyle = 'rgba(169,112,255,1)'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x, y, r, a0 == null ? 0 : a0, a1 == null ? TAU : a1);
    ctx.globalAlpha = a * .25; ctx.lineWidth = lw * 6; ctx.stroke();
    ctx.globalAlpha = a; ctx.lineWidth = lw; ctx.shadowColor = 'rgba(139,61,255,1)'; ctx.shadowBlur = 18; ctx.stroke();
    ctx.globalAlpha = a * .8; ctx.lineWidth = lw * .4; ctx.strokeStyle = '#fff'; ctx.shadowBlur = 4; ctx.stroke();
    ctx.restore();
  }
  function spark4(x, y, s, a) {
    if (s <= 0 || a <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(201,166,255,1)'; ctx.shadowBlur = s * 1.6;
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
    ctx.restore();
  }
  function starsAt(u) {
    ctx.fillStyle = '#e9deff';
    for (const s of stars) { ctx.globalAlpha = REDUCED ? .3 : Math.max(0, .2 + .3 * Math.sin(t * s.s * 1.5 + s.p)); ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r * u * 1.4, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function walk(name, tt) { const r = RULES[name]; return r ? ruleX(r, tt - r.from) : 0; }
  function seat(i) {
    const b = A.aud; if (!b) return { x: w / 2, y: h * .9 };
    const cols = Math.ceil(SEATS / 2), row = i < cols ? 0 : 1, col = i % cols;
    return { x: b.l + (col + .5 + row * .5) / (cols + .5) * b.w, y: b.t + b.h * (row ? .78 : .32) };
  }
  function draw() {
    if (!w) return;
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, w, h);
    const u = w / 1000, cx = w / 2, cy = h / 2, R = Math.min(w, h) * .5;
    if (state === 'poster') {
      ctx.globalCompositeOperation = 'lighter'; starsAt(u);
      drawHaloArc(ctx, cx, cy * 1.08, R * 1.1, { rx: .7, ry: .7, rot: 0, s: 3.5, len: 2.6, w: 2.2 * u * 1.6, sp: 0, o: .75 }, 0);
      drawHaloArc(ctx, cx, cy * 1.08, R * 1.1, { rx: .95, ry: .62, rot: .1, s: 4, len: 1.6, w: 1.2 * u * 1.6, sp: 0, o: .4 }, 0);
      ctx.globalCompositeOperation = 'source-over'; return;
    }
    if (paperOn) {
      const a = A.fv || { x: w * .18, y: h * .5 }, Rp = Math.max(w, h) * .3;
      if (paperClip) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; starsAt(u); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(paperClip.x, paperClip.y, paperClip.r, 0, TAU); ctx.clip(); }
      drawHaloArc(ctx, a.x, a.y, Rp, { rx: .62, ry: .62, rot: -.5, s: 3.1 + t * .05, len: 2.8, w: 2.2 * u * 1.4, sp: 0, o: .5 }, 0, true);
      drawHaloArc(ctx, a.x, a.y, Rp, { rx: .92, ry: .46, rot: -.3, s: 2.5 - t * .03, len: 2, w: 1.2 * u * 1.4, sp: 0, o: .35 }, 0, true);
      if (paperClip) ctx.restore();
      return;
    }
    ctx.globalCompositeOperation = 'lighter';
    starsAt(u);

    if (t < 3.05) {                                        // 50 ms: a faísca acende
      const a = A.spk || { x: cx, y: cy - h * .25 }, k = ease((t - .05) / .7);
      glow(a.x, a.y, (16 + 30 * k) * u, .7 * k);
      if (t > 2.7) { const f = clamp((t - 2.7) / .3); ring(cx, cy, R * (.06 + .08 * f), f * .9, 2.4 * u, ARC0, ARC0 + ARCL * f); }
    }
    if (t >= 2.95 && t < 6.25) {                           // efeito halo: o halo aberto do logo se desenha
      const lt = t - 2.95, k = ease(lt / 1.8), d = ease(lt / 1.1), out = 1 - clamp((t - 5.8) / .45), r = (h > w ? w * .5 : R) * (.16 + .8 * k);
      ring(cx, cy, r, (.95 - .35 * k) * out, 2.6 * u, ARC0, ARC0 + ARCL * d);
      ring(cx, cy, r * .62, .3 * k * out, 1.1 * u);
      if (lt > .9) { const sp = ease((lt - .9) / .5); spark4(cx + r * Math.cos(GAP), cy + r * Math.sin(GAP), 10 * u * sp, out * sp); }
    }
    if (t >= 6 && t < 8.2) {                               // o que brilha primeiro: a luz escorre para trás
      const lt = t - 6, c0 = A.sh0, r0 = A.rule || { l: w * .12, t: h * .6 };
      if (c0) glow(c0.x, c0.y, c0.w * .62 * ease(lt / .5), .3 * (1 - clamp((lt - 1.35) / .3)));
      [1, 2, 3].forEach((j, i) => {
        const a = A['sh' + j]; if (!a || !c0) return;
        const k = clamp((lt - .36 - i * .12) / .3); if (k <= 0 || k >= 1) return;
        glow(c0.x + (a.x - c0.x) * ease(k), c0.y + (a.y - c0.y) * ease(k), 22 * u, .9 * Math.sin(k * Math.PI));
      });
      ['sh0', 'sh1', 'sh2', 'sh3'].forEach((n, i) => {
        const a = A[n]; if (!a) return;
        const k = clamp((lt - 1.44 - i * .06) / .5); if (k <= 0) return;
        const e = ease(k); dot(a.x + (r0.l - a.x) * e, a.y + (r0.t - a.y) * e, (2.6 + 2 * (1 - e)) * u, .85);
      });
    }
    if (t >= 8 && t < 11.45 && A.rule) {                   // a cadeia: a luz anda de 7 m até 0
      const lt = t - 8, rr = A.rule, p = walk('rule', t), xe = rr.l + rr.w, y = rr.t + rr.h / 2, mk = A.mark || { x: cx, y: cy * .8, w: R * .5 };
      const mv = ease((t - 11) / .4);
      const x = rr.l + p * rr.w + (mk.x - xe) * mv, yy = y + (mk.y - y) * mv;
      const g = ctx.createLinearGradient(rr.l, 0, Math.max(rr.l + 1, x), 0); g.addColorStop(0, 'rgba(139,61,255,0)'); g.addColorStop(1, 'rgba(201,166,255,.85)');
      ctx.strokeStyle = g; ctx.lineWidth = 2.4 * u; ctx.globalAlpha = .8 * (1 - mv); ctx.beginPath(); ctx.moveTo(rr.l, y); ctx.lineTo(rr.l + p * rr.w, y); ctx.stroke(); ctx.globalAlpha = 1;
      const amp = 70 * u * Math.pow(1 - p, 1.5);
      for (let i = 0; i < 24; i++) {
        const f = (i + .5) / 24, px = rr.l + p * rr.w + (xe - rr.l - p * rr.w) * f;
        const jy = amp * (rnd(i) - .5) * 2 * (REDUCED ? 1 : Math.sin(t * (2 + rnd(i + 9) * 4) + i));
        dot(px, y + jy, .7 * u, (.25 + .45 * p) * (1 - mv));
      }
      glow(x, yy, (14 + 26 * p) * u * (1 - .5 * mv), .9, warm(p));
      if (lt > 2.3) { const k = ease((lt - 2.3) / .5), hx = xe + (mk.x - xe) * mv, hr = R * .09 * (1 - mv) + mk.w * .406 * mv; ring(hx, yy, hr, .9 * k * (1 - .7 * mv), 2.4 * u, ARC0, ARC0 + ARCL * k); }
    }
    if (t >= 11 && t < 13.8) {                             // halor: arcos neon atrás do logo
      const lt = t - 11, k = ease(lt / 1.6), mk = A.mark || { x: cx, y: cy * .8, w: R * .5 };
      drawHaloArc(ctx, mk.x, mk.y, R * 1.3, { rx: .62, ry: .62, rot: -.6, s: 3.4 + lt * .1, len: 2.5 * k + .1, w: 2.2 * u * 1.6, sp: 0, o: .9 * k }, 0);
      drawHaloArc(ctx, mk.x, mk.y, R * 1.3, { rx: .92, ry: .5, rot: -.3, s: 2.9 - lt * .06, len: 1.8 * k, w: 1.4 * u * 1.6, sp: 0, o: .55 * k }, 0);
      glow(mk.x, mk.y, mk.w * .55, .3 * k);
    }
    if (t >= 32 && t < 34.6) {                             // envie: a faísca do link viaja até o celular
      const lt = t - 32, a0 = A.toast || { x: w * .66, y: h * .9 }, ph = A.phone || { l: w * .6, t: h * .2, w: w * .2, h: h * .6 }, a1 = { x: ph.l - 6 * u, y: ph.t + ph.h * .3, w: ph.w };
      const c = { x: Math.min(a0.x, a1.x) - w * .16, y: (a0.y + a1.y) / 2 }, k = clamp(lt / .55), e = eio(k);
      const q = f => ({ x: (1 - f) * (1 - f) * a0.x + 2 * (1 - f) * f * c.x + f * f * a1.x, y: (1 - f) * (1 - f) * a0.y + 2 * (1 - f) * f * c.y + f * f * a1.y });
      ctx.save(); ctx.strokeStyle = 'rgba(201,166,255,.8)'; ctx.lineWidth = 2 * u; ctx.shadowColor = 'rgba(139,61,255,1)'; ctx.shadowBlur = 12;
      ctx.globalAlpha = .75 * (1 - clamp((lt - 1) / .8)); ctx.beginPath();
      for (let i = 0; i <= 32; i++) { const pt = q(e * i / 32); i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y); }
      ctx.stroke(); ctx.restore();
      if (k < 1) { const pt = q(e); spark4(pt.x, pt.y, 12 * u, 1); glow(pt.x, pt.y, 30 * u, .6); }
      else glow(ph.l + ph.w / 2, ph.t + ph.h * .35, ph.w * .9, .28 * (1 - clamp((lt - .55) / 1.2)));
      const r2 = A.rule2; if (r2) { const p = walk('rule2', t); glow(r2.l + p * r2.w, r2.t + r2.h / 2, 26 * u, .7 * clamp((lt - .3) / .3)); }
    }
    if (t >= 34.5 && t < 42.2) {                           // palco: a plateia chega, vota e escreve
      const lt = t - 34.5, out = 1 - clamp((t - 42) / .2);
      for (let i = 0; i < SEATS; i++) {
        const ti = i < 4 ? 0 : .15 + (i - 4) / 34 * 1.9, k = REDUCED ? (lt >= ti ? 1 : 0) : ease((lt - ti) / .45); if (k <= 0) continue;
        const s = seat(i), y = s.y + (h + 20 - s.y) * (1 - k) + (REDUCED ? 0 : Math.sin(t * 2 + i) * .8 * u);
        dot(s.x, y, 1.1 * u, .55 * out); glow(s.x, y, 5 * u, .5 * out, [169, 112, 255]);
      }
      if (lt > 2.4 && lt < 5.2) for (const v of VOTES) {
        const k = (lt - v.dep) / .42; if (k <= 0 || k >= 1) continue;
        const s = seat(v.seat), tg = A['vc' + v.c]; if (!tg) continue;
        const ty = tg.t + tg.h - (v.n + .5) / 17 * tg.h, e = eio(k);
        const x = s.x + (tg.x - s.x) * e, y = s.y + (ty - s.y) * e - Math.sin(k * Math.PI) * h * .06;
        dot(x, y, 1.3 * u, .9 * (1 - k * .4)); glow(x, y, 9 * u, .5, [139, 61, 255]);
      }
      if (lt > 5 && !REDUCED) for (let i = 0; i < 14; i++) {
        const k = ((lt - 5 + rnd(i) * 1.2) / 1.1) % 1, s = seat((i * 5) % SEATS);
        dot(s.x, s.y - k * h * .45, .9 * u, .35 * Math.sin(k * Math.PI) * out);
      }
    }
    if (t >= 44.5 && t < 53.55) {                          // resultados: arcos girando e saídas com faíscas
      const lt = t - 44.5, k = Math.min(8, Math.floor(lt)), q = lt - k;
      drawHaloArc(ctx, cx, cy, R * 1.5, { rx: .66, ry: .66, rot: 0, s: lt * .55, len: 2.2, w: 1.8 * u * 1.6, sp: 0, o: .55 }, 0);
      drawHaloArc(ctx, cx, cy, R * 1.5, { rx: .84, ry: .84, rot: 0, s: 3.2 - lt * .4, len: 1.4, w: 1.1 * u * 1.6, sp: 0, o: .32 }, 0);
      if (q < .3) glow(cx, cy, R * (.5 + q), .22 * (1 - q / .3));
      if (k === 0 && q > .78) { const f = (q - .78) / .22; for (let i = 0; i < 22; i++) { const an = rnd(i + 5) * TAU, d = R * (.15 + .7 * f * (.5 + rnd(i + 8))); spark4(cx + Math.cos(an) * d, cy + Math.sin(an) * d * .7, (4 + 4 * rnd(i)) * u * (1 - f * .5), 1 - f); } }
      if (k === 5 && q > .8) { const f = (q - .8) / .2; for (let i = 0; i < 18; i++) { const x = cx + (i - 8.5) * w * .033, y = cy + h * .08 - f * h * (.3 + rnd(i) * .2); spark4(x, y, 5 * u, 1 - f); } }
      if (k === 6 && q > .78) glow(cx, cy, R * (.5 + 1.2 * (q - .78) / .22), .9 * Math.sin((q - .78) / .22 * Math.PI), [244, 238, 255]);
      if (k === 8 && q > .82) spark4(cx, cy, 14 * u * ease((q - .82) / .12), 1);
    }
    if (t >= 53.5 && t < 56.3) {                           // cada olhar vira dado: os resultados viram faíscas e convergem
      const lt = t - 53.5, k = REDUCED ? 1 : eio(lt / 1.6), fade = 1 - clamp((lt - 1.6) / .5), Rr = Math.max(w, h) * .62;
      for (let i = 0; i < 9; i++) {
        const an = i / 9 * TAU + .35 + lt * .4 * (1 - k), r = Rr * (1 - k), x = cx + Math.cos(an) * r, y = cy + Math.sin(an) * r * .62;
        if (!REDUCED) { const r1 = Rr * (1 - eio((lt - .12) / 1.6)), x1 = cx + Math.cos(an) * r1, y1 = cy + Math.sin(an) * r1 * .62; ctx.save(); ctx.strokeStyle = 'rgba(201,166,255,.5)'; ctx.lineWidth = 1.4 * u; ctx.globalAlpha = fade; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); }
        spark4(x, y, 7 * u, fade);
      }
      glow(cx, cy, R * .5 * k, .32 * k);
    }
    if (t >= 56) {                                         // comece: as faíscas formam o logo e o halo respira
      const lt = t - 56, mk = A.mark2 || { x: cx, y: cy * .7, w: R * .4 }, kk = ease((lt - .2) / 1.6);
      const br = REDUCED ? 1 : 1 + .03 * Math.sin(lt * TAU / 2.4);
      if (lt < .6 && !REDUCED) for (let i = 0; i < 9; i++) { const an = i / 9 * TAU, f = eio(lt / .5), r = R * .5 * (1 - f); spark4(mk.x + Math.cos(an) * r, mk.y + Math.sin(an) * r, 6 * u, 1 - f * .6); }
      drawHaloArc(ctx, cx, cy * 1.04, R * 1.08 * br, { rx: .64 + .1 * kk, ry: .64 + .1 * kk, rot: 0, s: 3.4 + lt * .06, len: 2.6 * kk + .2, w: 2.2 * u * 1.6, sp: 0, o: kk }, 0);
      drawHaloArc(ctx, cx, cy * 1.04, R * 1.08 * br, { rx: .95, ry: .66, rot: .1, s: 4 - lt * .05, len: 1.4 * kk, w: 1.2 * u * 1.6, sp: 0, o: .45 * kk }, 0);
      glow(mk.x, mk.y, mk.w * .8 * br, .3 * kk);
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  /* · som: um pad grave e um sino por cena (só depois do clique) · */
  function audioInit() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    const ac = new AC(), master = ac.createGain(), lp = ac.createBiquadFilter();
    master.gain.value = 0; lp.type = 'lowpass'; lp.frequency.value = 520; lp.connect(master); master.connect(ac.destination);
    [[55, 'sawtooth', .1], [82.41, 'sawtooth', .08], [110, 'sine', .22], [164.81, 'sine', .08]].forEach(([f, ty, gv], i) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = ty; o.frequency.value = f; o.detune.value = i * 5; g.gain.value = gv; o.connect(g); g.connect(lp); o.start();
    });
    const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = .08; lg.gain.value = 260; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    return { ac, master };
  }
  function audioStart() { if (!audio) audio = audioInit(); if (!audio) return; audio.ac.resume(); audio.master.gain.setTargetAtTime(.06, audio.ac.currentTime, .5); }
  function audioStop() { if (audio) audio.master.gain.setTargetAtTime(0, audio.ac.currentTime, .25); }
  function bell(semi, vol, len) {
    const ac = audio.ac, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = 523.25 * Math.pow(2, semi / 12);
    g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(vol, ac.currentTime + .02); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + len);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + len + .1);
  }
  function cues(a, b) {
    if (!audio || !soundOn || state !== 'playing') return;
    for (const [ct, n] of CUES) if (ct > a && ct <= b) { if (n === 'chord') [-12, 0, 4, 7, 12].forEach(s => bell(s, .035, 3.6)); else bell(n, .045, 1.8); }
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
