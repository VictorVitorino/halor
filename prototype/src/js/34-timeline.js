/* ==========================================================================
   LINHA DO TEMPO · painéis que se abrem e um botão para assistir à história
   ========================================================================== */
/* Sete épocas num acordeão (horizontal no desktop, vertical no celular). Nada anda
   sozinho: só o botão "Assistir" conta a história, com a barra enchendo dentro do
   painel aberto, e para no fim. Clique ou setas levam direto a uma época.
   A faixa muda de luz a cada época (data-era na seção) e o ano conta até o novo. */
const TL_YEARS = [2016, 2018, 2020, 2022, 2024, 2026, null];
const TL_DUR = [4600, 4600, 4600, 4600, 8600, 6600, 5600];
const TL_TOTAL = TL_DUR.reduce((a, d) => a + d, 0);
const TL_LABEL = { idle: ['Assistir a linha do tempo', '#i-play'], playing: ['Pausar', '#i-pause'], paused: ['Continuar', '#i-play'], ended: ['Assistir de novo', '#i-replay'] };

function bootTimeline() {
  const sec = $('#linha-do-tempo'), tl = $('#tl'); if (!sec || !tl) return;
  const row = $('.tl-row', tl), cards = $$('.tl-p', row), btns = cards.map(c => $('.tl-btn', c));
  const play = $('#tl-play'), playL = $('.tl-play-l', play), playUse = $('.tl-ico use', play), ringF = $('.tl-ring-f', play), playT = $('.tl-play-t', play);
  const count = $('#tl-cur'), live = $('#tl-live'), glow = $('.tl-glow', sec);
  const N = cards.length, AI = cards.findIndex(c => c.classList.contains('tl-ai')), NOW = cards.findIndex(c => c.classList.contains('tl-now'));
  const wide = matchMedia('(min-width: 960px)');
  let cur = 0, mode = 'idle', p = 0, raf = 0, last = 0, onScreen = false, yRaf = 0, burstT = 0;

  const yearName = k => TL_YEARS[k] ? String(TL_YEARS[k]) : 'Próximos anos';
  const say = msg => { live.textContent = msg; };
  const setMode = m => {
    mode = m; tl.dataset.mode = m;
    playL.textContent = TL_LABEL[m][0]; playUse.setAttribute('href', TL_LABEL[m][1]);
  };
  /* barra do painel aberto e anel do botão (progresso da história inteira) */
  const paint = () => {
    const shown = mode === 'playing' || (mode === 'paused' && p > 0) ? p : 1;
    cards[cur].style.setProperty('--p', shown.toFixed(4));
    const total = mode === 'ended' ? 1 : mode === 'idle' ? 0 : (cur + p) / N;
    ringF.style.strokeDashoffset = String(1 - total);
    /* etiqueta do botão: duração inteira parado, tempo que falta enquanto toca */
    let left = TL_TOTAL;
    if (mode === 'playing' || mode === 'paused') left = TL_DUR.slice(cur).reduce((a, d) => a + d, 0) - p * TL_DUR[cur];
    const txt = Math.max(1, Math.ceil(left / 1000)) + ' s';
    if (playT.textContent !== txt) playT.textContent = txt;
  };

  /* o ano conta do anterior até o novo (2016 → 2024 passa por 2017, 2018...) */
  const resetYears = keep => cards.forEach((c, k) => { if (k !== keep && TL_YEARS[k]) $('.tl-y', c).textContent = TL_YEARS[k]; });
  const countYear = (from, to) => {
    cancelAnimationFrame(yRaf); resetYears(to);
    const yEl = $('.tl-y', cards[to]), a = TL_YEARS[from], b = TL_YEARS[to];
    if (!a || !b || a === b || REDUCED || !onScreen) { if (b) yEl.textContent = b; return; }
    const t0 = performance.now(), D = Math.min(950, 300 + Math.abs(b - a) * 60);
    const step = t => {
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      yEl.textContent = String(Math.round(a + (b - a) * e));
      if (k < 1) yRaf = requestAnimationFrame(step);
    };
    yEl.textContent = String(a); yRaf = requestAnimationFrame(step);
  };

  /* custo escondido da IA: tokens contando, tentativas e resultados que não serviram */
  const cost = AI >= 0 ? $('.tl-cost', cards[AI]) : null;
  const tok = cost && $('#tl-tok'), tries = cost && $('#tl-try'), mtr = cost && $('.tl-mtr', cost);
  const miss = cost ? $$('.tl-miss li', cost) : [], foot = cost && $('.tl-cost-f', cost);
  const PER = 6080, fmtTok = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  let costT = [], costRaf = 0;
  const costFinal = () => {
    costT.forEach(clearTimeout); costT = []; cancelAnimationFrame(costRaf);
    if (!cost) return;
    cost.classList.remove('is-run');
    tok.textContent = fmtTok(PER * 3); tries.textContent = '3ª tentativa'; mtr.style.setProperty('--m', '1');
    miss.forEach(li => li.classList.add('on')); foot.classList.add('on');
  };
  const costRun = () => {
    costFinal();
    if (!cost || REDUCED || !onScreen) return;
    cost.classList.add('is-run');
    tok.textContent = '0'; tries.textContent = '1ª tentativa'; mtr.style.setProperty('--m', '0');
    miss.forEach(li => li.classList.remove('on')); foot.classList.remove('on');
    for (let k = 0; k < 3; k++) {
      costT.push(setTimeout(() => {
        tries.textContent = (k + 1) + 'ª tentativa';
        mtr.style.setProperty('--m', ((k + 1) / 3).toFixed(3));
        const a = PER * k, b = PER * (k + 1), t0 = performance.now();
        const step = t => {
          const e = Math.min(1, (t - t0) / 1100);
          tok.textContent = fmtTok(Math.round(a + (b - a) * (1 - Math.pow(1 - e, 2))));
          if (e < 1) costRaf = requestAnimationFrame(step);
        };
        costRaf = requestAnimationFrame(step);
        costT.push(setTimeout(() => miss[k].classList.add('on'), 1000));
      }, 800 + k * 1900));
    }
    costT.push(setTimeout(() => foot.classList.add('on'), 800 + 3 * 1900));
  };

  /* halo da faixa: segue o centro do painel aberto (no acordeão vertical fica no meio) */
  const offsetIn = n => { let x = 0, y = 0; while (n && n !== sec) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return [x, y]; };
  const placeGlow = () => {
    if (!wide.matches) { glow.style.removeProperty('--gx'); glow.style.removeProperty('--gy'); return; }
    const other = cards.find((c, k) => k !== cur) || cards[0];
    const slim = parseFloat(getComputedStyle(other).flexBasis) || 72, gap = parseFloat(getComputedStyle(row).columnGap) || 10;
    const open = row.clientWidth - (N - 1) * (slim + gap), [x, y] = offsetIn(row);
    glow.style.setProperty('--gx', Math.round(x + cur * (slim + gap) + open / 2) + 'px');
    glow.style.setProperty('--gy', Math.round(y + row.offsetHeight / 2) + 'px');
  };
  /* chegada ao Halor: algumas faíscas acendem em volta do painel */
  const burst = () => {
    clearTimeout(burstT); sec.classList.remove('tl-burst');
    if (REDUCED || !onScreen) return;
    void sec.offsetWidth; sec.classList.add('tl-burst');
    burstT = setTimeout(() => sec.classList.remove('tl-burst'), 2800);
  };

  /* acordeão vertical: o painel de cima que fecha empurra o novo para cima; a página
     acompanha para o cabeçalho aberto continuar à vista (só se ele fosse sair da tela) */
  let viewT = 0;
  const navH = () => ($('#s-nav') ? $('#s-nav').offsetHeight : 64) + 16;
  const settle = (top, force) => { const nav = navH(); if (force || top < nav || top > innerHeight * .55) window.scrollTo({ top: scrollY + top - nav, behavior: REDUCED ? 'auto' : 'smooth' }); };
  const keepInView = (i, prev) => {
    clearTimeout(viewT);
    if (wide.matches || !onScreen) return;
    let top = cards[i].getBoundingClientRect().top;
    if (prev < i) {
      const shut = cards.find((c, k) => k !== i && k !== prev);
      if (shut) top -= cards[prev].offsetHeight - shut.offsetHeight;
    }
    settle(top);
    /* confere depois da animação (fontes, ancoragem de rolagem e afins) */
    viewT = setTimeout(() => { if (onScreen && !wide.matches) settle(cards[i].getBoundingClientRect().top); }, REDUCED ? 30 : 720);
  };

  const go = i => {
    const prev = cur;
    keepInView(i, prev);
    cur = i;
    cards.forEach((c, k) => {
      c.classList.toggle('is-on', k === i); c.classList.toggle('is-past', k < i);
      if (k !== i) c.style.removeProperty('--p');
      btns[k].setAttribute('aria-expanded', String(k === i));
      if (k === i) btns[k].setAttribute('aria-disabled', 'true'); else btns[k].removeAttribute('aria-disabled');
    });
    sec.dataset.era = String(i);
    count.textContent = String(i + 1).padStart(2, '0');
    countYear(prev, i);
    placeGlow();
    if (i === AI) costRun(); else if (prev === AI) costFinal();
    if (i === NOW && prev !== NOW) burst();
    paint();
  };

  /* reprodução: requestAnimationFrame só enquanto toca */
  const tick = t => {
    if (mode !== 'playing') return;
    p += Math.min(80, Math.max(0, t - last)) / TL_DUR[cur]; last = t;
    if (p >= 1) {
      if (cur < N - 1) { p = 0; go(cur + 1); }
      else { p = 1; stop('ended'); return; }
    }
    paint();
    raf = requestAnimationFrame(tick);
  };
  const stop = m => { cancelAnimationFrame(raf); raf = 0; setMode(m); paint(); };
  const start = () => {
    if (mode === 'idle' || mode === 'ended') { p = 0; if (cur !== 0) go(0); else if (AI === 0) costRun(); }
    setMode('playing'); paint();
    last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  };
  play.addEventListener('click', () => {
    if (mode === 'playing') { stop('paused'); say('Pausado em ' + yearName(cur) + '.'); }
    else { const from = mode === 'paused' ? 'Continuando' : 'Assistindo à linha do tempo'; start(); say(from + '.'); }
  });

  /* escolha direta: clique, setas, Home e End (a reprodução pausa) */
  const pick = (i, focus) => {
    if (mode === 'playing') stop('paused');
    p = 0;
    if (i !== cur) go(i); else paint();
    if (focus) btns[i].focus();
  };
  btns.forEach((b, k) => b.addEventListener('click', () => { if (k !== cur) pick(k); }));
  row.addEventListener('keydown', e => {
    const k = btns.indexOf(e.target.closest && e.target.closest('.tl-btn')); if (k < 0) return;
    let n;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(N - 1, k + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = Math.max(0, k - 1);
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = N - 1;
    else return;
    e.preventDefault(); pick(n, true);
  });

  /* fora da tela, em outra aba ou em outra tela do protótipo: pausa e limpa tudo */
  const sleep = () => {
    if (mode === 'playing') stop('paused');
    cancelAnimationFrame(yRaf); resetYears(-1);
    costFinal(); clearTimeout(burstT); clearTimeout(viewT); sec.classList.remove('tl-burst');
    tl.classList.add('is-off');
  };
  tl.classList.add('is-off');
  new IntersectionObserver(es => {
    onScreen = es[0].isIntersecting && currentView === 'v-site';
    if (onScreen) { tl.classList.remove('is-off'); placeGlow(); } else sleep();
  }, { threshold: .12 }).observe(tl);
  document.addEventListener('halor:view', e => { if (e.detail !== 'v-site') { onScreen = false; sleep(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && mode === 'playing') stop('paused'); });
  new ResizeObserver(() => placeGlow()).observe(row);
  if (wide.addEventListener) wide.addEventListener('change', placeGlow);

  setMode('idle'); paint(); placeGlow();
}
