/* ==========================================================================
   LINHA DO TEMPO · sala de cinema
   A pessoa escolhe a época no trilho ou aperta «Assistir à linha do tempo» e a
   jornada toca sozinha: a luz da sala muda, o cometa corre pelo trilho
   marcando o progresso de cada época e o palco troca com máscara e desfoque.
   Em 2024 o painel embaixo do palco gasta tokens a cada tentativa da IA;
   em 2026 o mesmo painel cai para zero: no Halor você edita direto.
   Nada toca sozinho sem o play; com movimento reduzido tudo chega pronto.
   Leitor de tela: só fala quando a pessoa age (escolhe, dá play, pausa, gera).
   ========================================================================== */
const EVO = [
  { yr: '2016', y: '2016', era: 'Antes do Halor', t: 'Slides estáticos', d: 'Tópicos em sequência e um PDF por e-mail. Quem recebe lê sozinho, se ler.', who: 'Lê sozinho', a: .16, ms: 5000 },
  { yr: '2018', y: '2018', era: 'Antes do Halor', t: 'Na nuvem', d: 'O arquivo virou link e o time edita junto. Na hora de apresentar, o slide continua parado.', who: 'Comenta', a: .28, ms: 5000 },
  { yr: '2020', y: '2020', era: 'Antes do Halor', t: 'Tela compartilhada', d: 'Tudo por vídeo. O slide disputa a atenção com dez abas, notificações e câmeras desligadas.', who: 'Divide a atenção', a: .2, ms: 5000 },
  { yr: '2022', y: '2022', era: 'Antes do Halor', t: 'Modelos prontos', d: 'Design em minutos, mas com a mesma cara de mil outras apresentações.', who: 'Reconhece o modelo', a: .34, ms: 5000 },
  { yr: '2024', y: '2024', era: 'Antes do Halor', t: 'Gerado por IA', d: 'Um texto vira slides em segundos. Só que cada tentativa gasta tokens, e o resultado nem sempre sai como você imaginou.', who: 'Recebe pronto', a: .42, ms: 10500, ai: true },
  { yr: '2026', y: '2026', era: 'Hoje, com o Halor', t: 'HTML vivo e lúdico', d: 'A apresentação se move, responde e convida a participar. Você edita direto no slide, sem código e sem gastar tokens.', who: 'Participa', a: .88, ms: 8000, now: true },
  { yr: 'Próximos', y: 'Próximos anos', era: 'Para onde vamos', t: 'Apresentação que conversa', d: 'Ela se adapta a quem assiste, tira dúvidas e mede a atenção ao vivo.', who: 'Conversa', a: .96, ms: 6500, next: true }
];
/* as três tentativas do roteiro de 2024 (valores ilustrativos) e as que a pessoa pede a mais */
const EVO_TRIES = [
  { tk: 18420, k: 'x', v: 1, flag: 'Fora da marca', res: 'Não saiu como esperado', why: 'cores e fonte fora da marca' },
  { tk: 21960, k: 'x', v: 2, flag: 'Número inventado', res: 'Não saiu como esperado', why: 'o gráfico inventou um +418%' },
  { tk: 19310, k: 'meh', v: 3, flag: 'Serve, mas parado', res: 'Quase', why: 'serve, mas é um slide parado' }
];
const EVO_MORE = [
  { tk: 20110, k: 'x', v: 1, flag: 'Texto genérico', res: 'Não saiu como esperado', why: 'texto genérico, sem a sua voz' },
  { tk: 17680, k: 'x', v: 2, flag: 'Ano trocado', res: 'Não saiu como esperado', why: 'trocou o ano para 2072' },
  { tk: 22540, k: 'meh', v: 3, flag: 'Slides demais', res: 'Quase', why: 'pediu 12 slides, vieram 19' },
  { tk: 18930, k: 'x', v: 1, flag: 'Logo distorcido', res: 'Não saiu como esperado', why: 'logo distorcido no rodapé' }
];
const EVO_RATE = 30; /* R$ por milhão de tokens, só para ilustrar */
const EVO_GEN_MS = 1500;

function bootEvo() {
  const sec = $('#linha-do-tempo'), ev = $('#ev');
  if (!sec || !ev || ev.dataset.on) return;
  ev.dataset.on = '1';
  const tabs = $$('.ev-stop', ev), scenes = $$('.ev-scene', ev), stage = $('#ev-stage'), info = $('.ev-info', ev), panel = $('#ev-panel');
  const bar = $('.ev-bar', ev), screen = $('.ev-screen', ev), railIn = $('.ev-rail-in', ev);
  const play = $('#ev-play'), playUse = $('.ev-play-ic .ic use', ev), playL = $('.ev-play-l', ev), playS = $('.ev-play-s', ev);
  const dock = $('#ev-dock'), dockIn = $('.ev-dock-in', ev), dockPlay = $('#ev-dock-play'), dockUse = $('use', dockPlay), dockN = $('#ev-dock-n'), dockY = $('#ev-dock-y'), dockT = $('#ev-dock-t');
  const prev = $('#ev-prev'), next = $('#ev-next'), sr = $('#ev-sr'), meter = $('.ev-meter', ev);
  const yEl = $('#ev-y'), tEl = $('#ev-t'), dEl = $('#ev-d'), whoEl = $('#ev-who'), attEl = $('#ev-att'), nEl = $('#ev-n'), eraEl = $('#ev-era');
  const tok = $('#ev-tok'), list = $('#ev-tries'), tokN = $('#ev-tok-n'), tokT = $('#ev-tok-t'), tokTl = $('#ev-tok-tl'), tokC = $('#ev-tok-c'), regen = $('#ev-regen');
  const s4 = $('.ev-s4', ev), flag = $('#ev-flag'), chipN = $('#ev-chip-n'), chipK = $('#ev-chip-k');
  const N = EVO.length, NOW = EVO.findIndex(e => e.now), AI = EVO.findIndex(e => e.ai);
  const TOTAL = EVO.reduce((s, e) => s + e.ms, 0), BEFORE = EVO.map((e, i) => EVO.slice(0, i).reduce((s, x) => s + x.ms, 0));
  const SECS = Math.round(TOTAL / 1000), SCRIPT = EVO_TRIES.reduce((s, x) => s + x.tk, 0);
  const fmtK = n => Math.round(n).toLocaleString('pt-BR');
  const brl = n => 'R$ ' + (n * EVO_RATE / 1e6).toFixed(2).replace('.', ',');
  const say = m => { sr.textContent = ''; setTimeout(() => { sr.textContent = m; }, 60); };

  let cur = 0, state = 'idle', away = false, visible = false, elapsed = 0, last = 0, raf = 0, leadUntil = 0;
  let outT = 0, glideT = 0, attShown = EVO[0].a;
  let log = [], total = 0, busy = false, seqT = [];
  /* a câmera só acompanha o play enquanto a pessoa não rolar a página por conta própria */
  let userScrolled = false, docked = false, dockRaf = 0;
  const tw = {};

  /* ---- pequenos motores: interpolação de números e pintura do trilho ---- */
  const tween = (key, from, to, ms, fn) => {
    cancelAnimationFrame(tw[key]);
    if (REDUCED || ms <= 0) { fn(to); return; }
    const t0 = performance.now();
    const step = now => { const k = Math.max(0, Math.min(1, (now - t0) / ms)), e = 1 - Math.pow(1 - k, 3); fn(from + (to - from) * e); if (k < 1) tw[key] = requestAnimationFrame(step); };
    tw[key] = requestAnimationFrame(step);
  };
  const setF = f => ev.style.setProperty('--ev-f', f.toFixed(4));
  const setG = g => ev.style.setProperty('--ev-g', Math.max(0, Math.min(1, g)).toFixed(4));
  const fNow = () => parseFloat(ev.style.getPropertyValue('--ev-f')) || 0;
  const glide = i => {
    const to = i / (N - 1);
    ev.classList.toggle('back', to < fNow());
    ev.classList.add('glide'); setF(to);
    clearTimeout(glideT); glideT = setTimeout(() => ev.classList.remove('glide', 'back'), 900);
  };

  /* ---- botão de play (e o do dock): rótulo, ícone e anel ---- */
  const paintPlay = () => {
    ev.dataset.state = state;
    const ic = state === 'playing' ? '#i-pause' : state === 'ended' ? '#i-replay' : '#i-play';
    playUse.setAttribute('href', ic); dockUse.setAttribute('href', ic);
    playL.textContent = state === 'playing' ? 'Pausar' : state === 'paused' ? 'Continuar' : state === 'ended' ? 'Assistir de novo' : 'Assistir à linha do tempo';
    playS.textContent = state === 'playing' ? `Época ${cur + 1} de ${N}` : state === 'paused' ? `Pausado em ${EVO[cur].y}` : state === 'ended' ? `Do começo · ${SECS} s` : `${N} épocas · ${SECS} s`;
    dockPlay.setAttribute('aria-label', state === 'playing' ? 'Pausar a linha do tempo' : state === 'paused' ? 'Continuar a linha do tempo' : state === 'ended' ? 'Assistir de novo à linha do tempo' : 'Assistir à linha do tempo');
  };
  const paintArrows = () => {
    prev.setAttribute('aria-disabled', String(cur === 0));
    next.setAttribute('aria-disabled', String(cur === N - 1));
  };

  /* ---- painel de tokens ---- */
  const setTok = v => { tokN.textContent = fmtK(v); };
  const setSum = (n, label, cost) => { tokT.textContent = String(n); tokTl.textContent = label; tokC.textContent = cost; };
  const clearSeq = () => { seqT.forEach(clearTimeout); seqT = []; cancelAnimationFrame(tw.tok); cancelAnimationFrame(tw.bar); };
  const later = (ms, fn) => seqT.push(setTimeout(fn, ms));
  const row = o => {
    const li = el('li', 'ev-try'); li.dataset.k = o.k;
    li.innerHTML = `<span class="ev-try-n mono"></span><span class="ev-try-bar"><i></i></span><b class="ev-try-k"></b><span class="ev-try-r"><svg aria-hidden="true"><use href="#i-${o.ic}"/></svg><span><b></b><em></em></span></span>`;
    $('.ev-try-n', li).textContent = o.label; $('.ev-try-k', li).textContent = o.tk;
    $('.ev-try-r b', li).textContent = o.res; $('.ev-try-r em', li).textContent = o.why;
    $('.ev-try-bar i', li).style.setProperty('--p', o.p);
    list.appendChild(li);
    while (list.children.length > 3) list.firstElementChild.remove();
    return li;
  };
  const resetTok = () => {
    clearSeq(); busy = false; log = []; total = 0; list.textContent = ''; list.setAttribute('aria-label', 'Tentativas');
    tok.classList.remove('done', 'counting', 'zero'); setTok(0); setSum(0, 'tentativas', brl(0));
    s4.dataset.try = '0'; s4.dataset.gen = '0'; delete s4.dataset.fk; chipN.textContent = '1'; chipK.textContent = '0';
    regen.removeAttribute('aria-disabled');
  };
  const spec = k => k < EVO_TRIES.length ? EVO_TRIES[k] : EVO_MORE[(k - EVO_TRIES.length) % EVO_MORE.length];
  const finishTry = (li, s, quiet) => {
    total += s.tk; log.push(s);
    li.dataset.k = s.k;
    $('use', li).setAttribute('href', s.k === 'x' ? '#i-x' : '#i-alert');
    $('.ev-try-k', li).textContent = fmtK(s.tk);
    $('.ev-try-r b', li).textContent = s.res; $('.ev-try-r em', li).textContent = s.why;
    $('.ev-try-bar i', li).style.setProperty('--p', 1);
    /* o selo do palco mostra o custo desta tentativa; o total fica no painel */
    s4.dataset.gen = '0'; s4.dataset.try = String(s.v); s4.dataset.fk = s.k; flag.textContent = s.flag;
    chipN.textContent = String(log.length); chipK.textContent = fmtK(s.tk);
    tok.classList.remove('counting'); setTok(total);
    setSum(log.length, log.length === 1 ? 'tentativa' : 'tentativas', brl(total));
    if (!quiet) say(`Tentativa ${log.length}: mais ${fmtK(s.tk)} tokens, ${s.res.toLowerCase()}, ${s.why}. Total de ${fmtK(total)} tokens, cerca de ${brl(total)}.`);
  };
  /* uma geração: a linha nasce, a barra enche e os tokens sobem até o resultado */
  const startTry = (quiet = true) => {
    const s = spec(log.length), n = log.length + 1, base = total;
    const li = row({ k: 'run', ic: 'replay', label: `Tentativa ${n}`, tk: '0', res: 'Gerando…', why: '', p: 0 });
    const bar = $('.ev-try-bar i', li), kEl = $('.ev-try-k', li);
    bar.style.setProperty('--ms', EVO_GEN_MS + 'ms');
    tw.bar = requestAnimationFrame(() => { tw.bar = requestAnimationFrame(() => bar.style.setProperty('--p', 1)); });
    s4.dataset.gen = '1'; chipN.textContent = String(n); chipK.textContent = '0'; tok.classList.add('counting');
    tween('tok', base, base + s.tk, EVO_GEN_MS, v => { setTok(v); const d = fmtK(v - base); kEl.textContent = d; chipK.textContent = d; });
    later(EVO_GEN_MS + 60, () => finishTry(li, s, quiet));
  };
  const press = () => { regen.classList.add('press'); setTimeout(() => regen.classList.remove('press'), 420); };
  const done = () => { busy = false; regen.removeAttribute('aria-disabled'); tok.classList.add('done'); };
  /* o roteiro de 2024: três tentativas, duas erram e a terceira «serve, mas parada» */
  const runSeq = () => {
    resetTok(); tok.dataset.mode = 'ai';
    if (REDUCED) {
      EVO_TRIES.forEach((s, k) => { const li = row({ k: s.k, ic: 'x', label: `Tentativa ${k + 1}`, tk: '', res: '', why: '', p: 1 }); finishTry(li, s, true); });
      done(); return;
    }
    busy = true; regen.setAttribute('aria-disabled', 'true');
    later(800, () => startTry());
    later(3300, press); later(3500, () => startTry());
    later(6000, press); later(6200, () => startTry());
    later(8000, done);
  };
  /* 2026: o mesmo painel vira o contraste. O que a IA gastou fica riscado; com o Halor, o zero chega direto */
  const showHalor = () => {
    clearSeq(); busy = false;
    const aiTotal = log.length >= EVO_TRIES.length ? total : SCRIPT, aiN = Math.max(log.length, EVO_TRIES.length);
    tok.dataset.mode = 'hl'; tok.classList.remove('counting', 'done', 'zero'); list.textContent = ''; list.setAttribute('aria-label', 'Comparação: IA e Halor');
    row({ k: 'old', ic: 'x', label: 'Com IA', tk: fmtK(aiTotal), res: `${aiN} tentativas`, why: 'e o slide ainda parado', p: 1 });
    row({ k: 'ok', ic: 'check', label: 'Com o Halor', tk: '0', res: 'Do seu jeito', why: 'na primeira edição', p: 0 });
    setSum(1, 'edição', 'R$ 0,00'); setTok(0);
    if (!REDUCED) { void tok.offsetWidth; tok.classList.add('zero'); }
  };
  const tokenEra = (i, from) => {
    const open = i === AI || i === NOW;
    tok.classList.toggle('is-open', open); sec.dataset.tok = open ? 'open' : 'closed';
    if (i === AI) runSeq();
    else if (i === NOW) { if (from !== NOW) showHalor(); }
    else { clearSeq(); busy = false; if (from === AI) s4.dataset.gen = '0'; }
  };

  /* ---- câmera: enquanto toca (e a pessoa não rolou), a página mantém o palco à vista ---- */
  const dockTop = () => { const n = $('.s-nav'); return n ? n.offsetHeight : 72; };
  const narrow = () => innerWidth < 900;
  const below = () => dockTop() + dockIn.offsetHeight + 14; /* onde o palco fica, logo abaixo da faixa do dock */
  const glideBy = y => { if (Math.abs(y) > 6) window.scrollBy({ top: y, behavior: REDUCED ? 'auto' : 'smooth' }); };
  /* enquadra: no desktop, o player inteiro; no celular, o palco logo abaixo do dock */
  const frame = () => {
    if (userScrolled) return;
    if (narrow()) { glideBy(screen.getBoundingClientRect().top - below()); return; }
    const r = ev.getBoundingClientRect(), s = screen.getBoundingClientRect();
    if (r.top < 72 || s.bottom > innerHeight - 8) glideBy(r.top - 100);
  };
  /* em 2024 o painel abre embaixo: a página sobe só o bastante para mostrá-lo, sem tirar o palco da tela */
  const follow = () => {
    if (state !== 'playing' || userScrolled) return;
    const over = tok.getBoundingClientRect().bottom - innerHeight + 16;
    if (over <= 0) return;
    glideBy(Math.max(0, Math.min(over, screen.getBoundingClientRect().top - below())));
  };
  /* preso: no celular, quando a legenda chega ao topo; no desktop, quando o botão de play some sob o menu */
  const paintDock = () => {
    dockRaf = 0;
    const top = dockTop();
    const d = narrow() ? bar.getBoundingClientRect().bottom + 16 <= top + 1 : play.getBoundingClientRect().bottom < top + 4;
    if (d !== docked) { docked = d; ev.classList.toggle('docked', d); }
  };
  const queueDock = () => { if (!dockRaf) dockRaf = requestAnimationFrame(paintDock); };

  /* ---- troca de época ---- */
  const show = (i, how) => {
    const from = cur; cur = i;
    ev.dataset.i = String(i); sec.dataset.era = String(i);
    tabs.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; b.classList.toggle('past', k < i); });
    panel.setAttribute('aria-labelledby', tabs[i].id);
    scenes.forEach(s => s.classList.remove('out'));
    if (from !== i && !REDUCED && how !== 'init') {
      scenes[from].classList.add('out');
      stage.dataset.dir = i < from ? 'back' : 'fwd';
      stage.classList.remove('wiping'); void stage.offsetWidth; stage.classList.add('wiping');
      clearTimeout(outT); outT = setTimeout(() => { scenes.forEach(s => s.classList.remove('out')); stage.classList.remove('wiping'); }, 950);
    }
    scenes.forEach((s, k) => s.classList.toggle('on', k === i));
    const e = EVO[i], n = String(i + 1).padStart(2, '0');
    yEl.textContent = e.y; tEl.textContent = e.t; dEl.textContent = e.d; whoEl.textContent = e.who; eraEl.textContent = e.era;
    nEl.textContent = n; dockN.textContent = `${n} / ${String(N).padStart(2, '0')}`; dockY.textContent = e.yr; dockT.textContent = e.t;
    if (!REDUCED && how !== 'init') { info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap'); }
    meter.style.setProperty('--a', e.a);
    tween('att', attShown, e.a, 900, v => { attShown = v; attEl.textContent = String(Math.round(v * 100)); });
    ev.classList.remove('burst');
    if (i === NOW && from !== NOW && !REDUCED && how !== 'init') { void ev.offsetWidth; ev.classList.add('burst'); }
    if (how !== 'auto') glide(i);
    if (how !== 'init') tokenEra(i, from);
    paintArrows(); paintPlay();
    if (how === 'user') say(`${e.y}, ${e.t}. ${e.d} Atenção da plateia: ${Math.round(e.a * 100)}%.`);
    if (state === 'playing' && i === AI) later(900, follow);
    else if (state === 'playing' && how === 'auto' && (narrow() || (i !== NOW && ev.getBoundingClientRect().top < 64))) frame();
  };

  /* ---- relógio do play ---- */
  const tick = now => {
    raf = 0;
    if (state !== 'playing') return;
    const dt = Math.min(now - last, 100); last = now;
    if (now >= leadUntil) {
      ev.classList.remove('glide', 'back');
      elapsed += dt;
      const e = EVO[cur], p = Math.min(1, elapsed / e.ms);
      setF(cur < N - 1 ? (cur + p) / (N - 1) : 1 + p / (2 * (N - 1)));
      setG((BEFORE[cur] + elapsed) / TOTAL);
      if (elapsed >= e.ms) {
        if (cur < N - 1) { elapsed = 0; show(cur + 1, 'auto'); }
        else { finish(); return; }
      }
    }
    raf = requestAnimationFrame(tick);
  };
  const run = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(tick); };
  const start = () => {
    if (state === 'ended' || (state === 'idle' && cur === N - 1)) { elapsed = 0; show(0, 'restart'); leadUntil = performance.now() + 850; }
    else if (state === 'idle') { elapsed = 0; leadUntil = 0; if (cur === AI) runSeq(); }
    state = 'playing'; away = false; paintPlay(); setG((BEFORE[cur] + elapsed) / TOTAL);
    frame(); run();
    if (cur === AI) later(900, follow);
  };
  const pause = why => {
    if (state !== 'playing') return;
    state = 'paused'; away = why === 'away'; cancelAnimationFrame(raf); raf = 0; paintPlay();
    if (!away) say(`Pausado em ${EVO[cur].y}, ${EVO[cur].t}.`);
  };
  const resume = () => { state = 'playing'; away = false; paintPlay(); run(); };
  const finish = () => {
    state = 'ended'; cancelAnimationFrame(raf); raf = 0; setF(1); setG(1); paintPlay();
    say('Fim da linha do tempo. Para ver de novo, use Assistir de novo.');
  };
  const pick = i => {
    if (i < 0 || i >= N || i === cur) return;
    elapsed = 0;
    if (state === 'ended') state = 'idle';
    show(i, 'user');
    if (state === 'playing') leadUntil = performance.now() + 850;
    if (state !== 'idle') setG(BEFORE[i] / TOTAL);
  };
  /* o mesmo comando no botão grande e no dock; dar play ou continuar devolve a câmera ao palco */
  const toggle = () => {
    if (state === 'playing') { pause('user'); return; }
    userScrolled = false;
    if (state === 'paused') { resume(); frame(); say(`Continuando em ${EVO[cur].y}.`); }
    else { start(); say(`Reproduzindo a linha do tempo, a partir de ${EVO[cur].y}.`); }
  };

  play.addEventListener('click', toggle);
  dockPlay.addEventListener('click', toggle);
  prev.addEventListener('click', () => pick(cur - 1));
  next.addEventListener('click', () => pick(cur + 1));
  tabs.forEach((b, i) => b.addEventListener('click', () => pick(i)));
  /* trilho horizontal: só as setas laterais, Home e End trocam de época; as verticais continuam rolando a página */
  railIn.addEventListener('keydown', e => {
    const k = e.key; let n = cur;
    if (k === 'ArrowRight') n = (cur + 1) % N;
    else if (k === 'ArrowLeft') n = (cur - 1 + N) % N;
    else if (k === 'Home') n = 0;
    else if (k === 'End') n = N - 1;
    else return;
    e.preventDefault(); pick(n); tabs[n].focus();
  });
  regen.addEventListener('click', () => {
    if (busy || tok.dataset.mode !== 'ai') return;
    pause('user');
    busy = true; regen.setAttribute('aria-disabled', 'true'); tok.classList.remove('done');
    startTry(false);
    later(EVO_GEN_MS + 120, done);
  });

  /* a pessoa rolou por conta própria: a câmera para de acompanhar até o próximo «Assistir» ou «Continuar» */
  const mine = () => { userScrolled = true; };
  const SCROLL_KEYS = ['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', ' ', 'Home', 'End'];
  addEventListener('wheel', mine, { passive: true });
  addEventListener('touchmove', mine, { passive: true });
  addEventListener('keydown', e => {
    if (!SCROLL_KEYS.includes(e.key)) return;
    const t = e.target instanceof Element ? e.target : null;
    if (t && t.closest('[role="tablist"], input, textarea, select, [contenteditable]')) return;
    if (e.key === ' ' && t && t.closest('button, a, summary, [role="button"]')) return;
    mine();
  });
  document.addEventListener('pointerdown', e => { if (e.target === document.documentElement) mine(); });
  addEventListener('scroll', queueDock, { passive: true });
  addEventListener('resize', () => { ev.style.setProperty('--ev-top', dockTop() + 'px'); queueDock(); }, { passive: true });

  /* fora da tela, o play espera; ao voltar, continua de onde parou */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => {
      const e = es[es.length - 1];
      visible = e.isIntersecting && e.intersectionRatio >= .2;
      if (visible) {
        if (!ev.classList.contains('hello') && !REDUCED) ev.classList.add('hello');
        if (away && state === 'paused' && !document.hidden) resume();
      } else pause('away');
    }, { threshold: [0, .2, .4] }).observe(ev);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause('away');
    else if (away && state === 'paused' && visible) resume();
  });

  ev.style.setProperty('--ev-top', dockTop() + 'px');
  sec.dataset.tok = 'closed';
  setF(0); setG(0);
  show(0, 'init');
  paintDock();
}
