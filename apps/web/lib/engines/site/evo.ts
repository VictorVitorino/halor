/* ==========================================================================
   LINHA DO TEMPO · sala de cinema (porte de prototype/src/js/36b-evo.js)
   A pessoa escolhe a época no trilho ou aperta «Assistir à linha do tempo» e a
   jornada toca sozinha: a luz da sala muda, o cometa corre pelo trilho
   marcando o progresso de cada época e o palco troca com máscara e desfoque.
   Em 2024 o painel embaixo do palco gasta tokens a cada tentativa da IA;
   em 2026 o mesmo painel cai para zero: no Halor você edita direto.
   Nada toca sozinho sem o play; com movimento reduzido tudo chega pronto.
   Leitor de tela: só fala quando a pessoa age (escolhe, dá play, pausa, gera).
   A marcação já chega pré-renderizada (Timeline.tsx); este motor só a liga.
   ========================================================================== */
import { $, $$, el, REDUCED } from '@/lib/core';
import { EVO, EVO_GEN_MS, EVO_MORE, EVO_RATE, EVO_TRIES, type EvoTry } from './evo-data';
import type { Dispose } from './produto';

const noop: Dispose = () => {};

type State = 'idle' | 'playing' | 'paused' | 'ended';
type How = 'init' | 'user' | 'auto' | 'restart';
interface Row { k: string; ic: string; label: string; tk: string; res: string; why: string; p: number }

export function bootEvo(root: ParentNode): Dispose {
  const sec = $('#linha-do-tempo', root), ev = $('#ev', root);
  if (!sec || !ev) return noop;
  const tabs = $$<HTMLButtonElement>('.ev-stop', ev), scenes = $$('.ev-scene', ev);
  const stage = $('#ev-stage', ev), info = $('.ev-info', ev), panel = $('#ev-panel', ev), screen = $('.ev-screen', ev), railIn = $('.ev-rail-in', ev), bar = $('.ev-bar', ev);
  const play = $<HTMLButtonElement>('#ev-play', ev), playUse = $<SVGUseElement>('.ev-play-ic .ic use', ev), playL = $('.ev-play-l', ev), playS = $('.ev-play-s', ev);
  const dockIn = $('.ev-dock-in', ev), dockPlay = $<HTMLButtonElement>('#ev-dock-play', ev), dockUse = $<SVGUseElement>('#ev-dock-play use', ev);
  const dockN = $('#ev-dock-n', ev), dockY = $('#ev-dock-y', ev), dockT = $('#ev-dock-t', ev);
  const prev = $<HTMLButtonElement>('#ev-prev', ev), next = $<HTMLButtonElement>('#ev-next', ev), sr = $('#ev-sr', ev), meter = $('.ev-meter', ev);
  const yEl = $('#ev-y', ev), tEl = $('#ev-t', ev), dEl = $('#ev-d', ev), whoEl = $('#ev-who', ev), attEl = $('#ev-att', ev), nEl = $('#ev-n', ev), eraEl = $('#ev-era', ev);
  const tok = $('#ev-tok', ev), list = $('#ev-tries', ev), tokN = $('#ev-tok-n', ev), tokT = $('#ev-tok-t', ev), tokTl = $('#ev-tok-tl', ev), tokC = $('#ev-tok-c', ev);
  const regen = $<HTMLButtonElement>('#ev-regen', ev), s4 = $('.ev-s4', ev), flag = $('#ev-flag', ev), chipN = $('#ev-chip-n', ev), chipK = $('#ev-chip-k', ev);
  if (!stage || !info || !panel || !screen || !railIn || !bar || !play || !playUse || !playL || !playS || !dockIn || !dockPlay || !dockUse
    || !dockN || !dockY || !dockT || !prev || !next || !sr || !meter
    || !yEl || !tEl || !dEl || !whoEl || !attEl || !nEl || !eraEl || !tok || !list || !tokN || !tokT || !tokTl || !tokC
    || !regen || !s4 || !flag || !chipN || !chipK) return noop;
  const N = Math.min(EVO.length, tabs.length, scenes.length);
  if (!N) return noop;
  const NOW = EVO.findIndex(e => e.now), AI = EVO.findIndex(e => e.ai);
  const TOTAL = EVO.reduce((s, e) => s + e.ms, 0), BEFORE = EVO.map((e, i) => EVO.slice(0, i).reduce((s, x) => s + x.ms, 0));
  const SECS = Math.round(TOTAL / 1000), SCRIPT = EVO_TRIES.reduce((s, x) => s + x.tk, 0);
  const fmtK = (n: number) => Math.round(n).toLocaleString('pt-BR');
  const brl = (n: number) => 'R$ ' + (n * EVO_RATE / 1e6).toFixed(2).replace('.', ',');
  const ac = new AbortController(), on = { signal: ac.signal }, onPassive = { signal: ac.signal, passive: true };

  let cur = 0, state: State = 'idle', away = false, visible = false, elapsed = 0, last = 0, raf = 0, leadUntil = 0;
  let outT = 0, glideT = 0, sayT = 0, pressT = 0, attShown = EVO[0].a;
  let log: EvoTry[] = [], total = 0, busy = false, seqT: number[] = [];
  /* a câmera só acompanha o play enquanto a pessoa não rolar a página por conta própria */
  let userScrolled = false, docked = false, dockRaf = 0;
  const tw: Record<string, number> = {};

  const say = (m: string) => { sr.textContent = ''; clearTimeout(sayT); sayT = window.setTimeout(() => { sr.textContent = m; }, 60); };

  /* ---- pequenos motores: interpolação de números e pintura do trilho ---- */
  const tween = (key: string, from: number, to: number, ms: number, fn: (v: number) => void) => {
    cancelAnimationFrame(tw[key]);
    if (REDUCED || ms <= 0) { fn(to); return; }
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.max(0, Math.min(1, (now - t0) / ms)), e = 1 - Math.pow(1 - k, 3);
      fn(from + (to - from) * e);
      if (k < 1) tw[key] = requestAnimationFrame(step);
    };
    tw[key] = requestAnimationFrame(step);
  };
  const setF = (f: number) => ev.style.setProperty('--ev-f', f.toFixed(4));
  const setG = (g: number) => ev.style.setProperty('--ev-g', Math.max(0, Math.min(1, g)).toFixed(4));
  const fNow = () => parseFloat(ev.style.getPropertyValue('--ev-f')) || 0;
  const glide = (i: number) => {
    const to = i / (N - 1);
    ev.classList.toggle('back', to < fNow());
    ev.classList.add('glide'); setF(to);
    clearTimeout(glideT); glideT = window.setTimeout(() => ev.classList.remove('glide', 'back'), 900);
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
  const setTok = (v: number) => { tokN.textContent = fmtK(v); };
  const setSum = (n: number, label: string, cost: string) => { tokT.textContent = String(n); tokTl.textContent = label; tokC.textContent = cost; };
  const clearSeq = () => { seqT.forEach(clearTimeout); seqT = []; cancelAnimationFrame(tw.tok); cancelAnimationFrame(tw.bar); };
  const later = (ms: number, fn: () => void) => { seqT.push(window.setTimeout(fn, ms)); };
  const row = (o: Row) => {
    const li = el('li', 'ev-try'); li.dataset.k = o.k;
    li.innerHTML = `<span class="ev-try-n mono"></span><span class="ev-try-bar"><i></i></span><b class="ev-try-k"></b><span class="ev-try-r"><svg aria-hidden="true"><use href="#i-${o.ic}"/></svg><span><b></b><em></em></span></span>`;
    $('.ev-try-n', li)!.textContent = o.label; $('.ev-try-k', li)!.textContent = o.tk;
    $('.ev-try-r b', li)!.textContent = o.res; $('.ev-try-r em', li)!.textContent = o.why;
    $('.ev-try-bar i', li)!.style.setProperty('--p', String(o.p));
    list.appendChild(li);
    while (list.children.length > 3) list.firstElementChild!.remove();
    return li;
  };
  const resetTok = () => {
    clearSeq(); busy = false; log = []; total = 0; list.textContent = ''; list.setAttribute('aria-label', 'Tentativas');
    tok.classList.remove('done', 'counting', 'zero'); setTok(0); setSum(0, 'tentativas', brl(0));
    s4.dataset.try = '0'; s4.dataset.gen = '0'; delete s4.dataset.fk; chipN.textContent = '1'; chipK.textContent = '0';
    regen.removeAttribute('aria-disabled');
  };
  const spec = (k: number) => k < EVO_TRIES.length ? EVO_TRIES[k] : EVO_MORE[(k - EVO_TRIES.length) % EVO_MORE.length];
  const finishTry = (li: HTMLElement, s: EvoTry, quiet: boolean) => {
    total += s.tk; log.push(s);
    li.dataset.k = s.k;
    $('use', li)?.setAttribute('href', s.k === 'x' ? '#i-x' : '#i-alert');
    $('.ev-try-k', li)!.textContent = fmtK(s.tk);
    $('.ev-try-r b', li)!.textContent = s.res; $('.ev-try-r em', li)!.textContent = s.why;
    $('.ev-try-bar i', li)!.style.setProperty('--p', '1');
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
    const barI = $('.ev-try-bar i', li)!, kEl = $('.ev-try-k', li)!;
    barI.style.setProperty('--ms', EVO_GEN_MS + 'ms');
    /* rAF duplo guardado em tw: a limpeza cancela os dois quadros */
    tw.bar = requestAnimationFrame(() => { tw.bar = requestAnimationFrame(() => { if (!ac.signal.aborted) barI.style.setProperty('--p', '1'); }); });
    s4.dataset.gen = '1'; chipN.textContent = String(n); chipK.textContent = '0'; tok.classList.add('counting');
    tween('tok', base, base + s.tk, EVO_GEN_MS, v => { setTok(v); const d = fmtK(v - base); kEl.textContent = d; chipK.textContent = d; });
    later(EVO_GEN_MS + 60, () => finishTry(li, s, quiet));
  };
  const press = () => { regen.classList.add('press'); clearTimeout(pressT); pressT = window.setTimeout(() => regen.classList.remove('press'), 420); };
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
  const tokenEra = (i: number, from: number) => {
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
  /* posição na tela sem as transformações do scroll reveal (o trilho e o palco entram com translate/scale) */
  const at = (n: HTMLElement) => ev.getBoundingClientRect().top + n.offsetTop;
  const glideBy = (y: number) => { if (Math.abs(y) > 6) window.scrollBy({ top: y, behavior: REDUCED ? 'auto' : 'smooth' }); };
  /* enquadra: no desktop, o player inteiro; no celular, o palco logo abaixo do dock */
  const frame = () => {
    if (userScrolled) return;
    if (narrow()) { glideBy(at(screen) - below()); return; }
    const top = ev.getBoundingClientRect().top;
    if (top < 72 || at(screen) + screen.offsetHeight > innerHeight - 8) glideBy(top - 100);
  };
  /* em 2024 o painel abre embaixo: a página sobe só o bastante para mostrá-lo, sem tirar o palco da tela */
  const follow = () => {
    if (state !== 'playing' || userScrolled) return;
    const over = tok.getBoundingClientRect().bottom - innerHeight + 16;
    if (over <= 0) return;
    glideBy(Math.max(0, Math.min(over, at(screen) - below())));
  };
  /* preso: no celular, quando a legenda chega ao topo; no desktop, quando o botão de play some sob o menu */
  const paintDock = () => {
    dockRaf = 0;
    const top = dockTop();
    const d = narrow() ? at(bar) + bar.offsetHeight + 16 <= top + 1 : at(play) + play.offsetHeight < top + 4;
    if (d !== docked) { docked = d; ev.classList.toggle('docked', d); }
  };
  const queueDock = () => { if (!dockRaf) dockRaf = requestAnimationFrame(paintDock); };

  /* ---- troca de época ---- */
  const show = (i: number, how: How) => {
    const from = cur; cur = i;
    ev.dataset.i = String(i); sec.dataset.era = String(i);
    tabs.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; b.classList.toggle('past', k < i); });
    panel.setAttribute('aria-labelledby', tabs[i].id);
    scenes.forEach(s => s.classList.remove('out'));
    if (from !== i && !REDUCED && how !== 'init') {
      scenes[from].classList.add('out');
      stage.dataset.dir = i < from ? 'back' : 'fwd';
      stage.classList.remove('wiping'); void stage.offsetWidth; stage.classList.add('wiping');
      clearTimeout(outT); outT = window.setTimeout(() => { scenes.forEach(s => s.classList.remove('out')); stage.classList.remove('wiping'); }, 950);
    }
    scenes.forEach((s, k) => s.classList.toggle('on', k === i));
    const e = EVO[i], n = String(i + 1).padStart(2, '0');
    yEl.textContent = e.y; tEl.textContent = e.t; dEl.textContent = e.d; whoEl.textContent = e.who; eraEl.textContent = e.era;
    nEl.textContent = n; dockN.textContent = `${n} / ${String(N).padStart(2, '0')}`; dockY.textContent = e.yr; dockT.textContent = e.t;
    if (!REDUCED && how !== 'init') { info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap'); }
    meter.style.setProperty('--a', String(e.a));
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
  const finish = () => {
    state = 'ended'; cancelAnimationFrame(raf); raf = 0; setF(1); setG(1); paintPlay();
    say('Fim da linha do tempo. Para ver de novo, use Assistir de novo.');
  };
  const tick = (now: number) => {
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
  const pause = (why: 'user' | 'away') => {
    if (state !== 'playing') return;
    state = 'paused'; away = why === 'away'; cancelAnimationFrame(raf); raf = 0; paintPlay();
    if (!away) say(`Pausado em ${EVO[cur].y}, ${EVO[cur].t}.`);
  };
  const resume = () => { state = 'playing'; away = false; paintPlay(); run(); };
  const pick = (i: number) => {
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

  play.addEventListener('click', toggle, on);
  dockPlay.addEventListener('click', toggle, on);
  prev.addEventListener('click', () => pick(cur - 1), on);
  next.addEventListener('click', () => pick(cur + 1), on);
  tabs.slice(0, N).forEach((b, i) => b.addEventListener('click', () => pick(i), on));
  /* trilho horizontal: só as setas laterais, Home e End trocam de época; as verticais continuam rolando a página */
  railIn.addEventListener('keydown', e => {
    const k = e.key; let n = cur;
    if (k === 'ArrowRight') n = (cur + 1) % N;
    else if (k === 'ArrowLeft') n = (cur - 1 + N) % N;
    else if (k === 'Home') n = 0;
    else if (k === 'End') n = N - 1;
    else return;
    e.preventDefault(); pick(n); tabs[n].focus();
  }, on);
  regen.addEventListener('click', () => {
    if (busy || tok.dataset.mode !== 'ai') return;
    pause('user');
    busy = true; regen.setAttribute('aria-disabled', 'true'); tok.classList.remove('done');
    startTry(false);
    later(EVO_GEN_MS + 120, done);
  }, on);

  /* a pessoa rolou por conta própria: a câmera para de acompanhar até o próximo «Assistir» ou «Continuar» */
  const mine = () => { userScrolled = true; };
  const SCROLL_KEYS = ['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', ' ', 'Home', 'End'];
  window.addEventListener('wheel', mine, onPassive);
  window.addEventListener('touchmove', mine, onPassive);
  window.addEventListener('keydown', e => {
    if (!SCROLL_KEYS.includes(e.key)) return;
    const t = e.target instanceof Element ? e.target : null;
    if (t && t.closest('[role="tablist"], input, textarea, select, [contenteditable]')) return;
    if (e.key === ' ' && t && t.closest('button, a, summary, [role="button"]')) return;
    mine();
  }, on);
  document.addEventListener('pointerdown', e => { if (e.target === document.documentElement) mine(); }, on);
  window.addEventListener('scroll', queueDock, onPassive);
  window.addEventListener('resize', () => { ev.style.setProperty('--ev-top', dockTop() + 'px'); queueDock(); }, onPassive);

  /* fora da tela, o play espera; ao voltar, continua de onde parou */
  let io: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(es => {
      const e = es[es.length - 1];
      visible = e.isIntersecting && e.intersectionRatio >= .2;
      if (visible) {
        if (!ev.classList.contains('hello') && !REDUCED) ev.classList.add('hello');
        if (away && state === 'paused' && !document.hidden) resume();
      } else pause('away');
    }, { threshold: [0, .2, .4] });
    io.observe(ev);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause('away');
    else if (away && state === 'paused' && visible) resume();
  }, on);

  /* estado inicial (o mesmo da marcação pré-renderizada): 2016, parado, painel fechado */
  resetTok(); tok.classList.remove('is-open'); tok.dataset.mode = 'ai'; sec.dataset.tok = 'closed';
  ev.style.setProperty('--ev-top', dockTop() + 'px');
  setF(0); setG(0);
  show(0, 'init');
  paintDock();

  return () => {
    ac.abort(); io?.disconnect();
    cancelAnimationFrame(raf); cancelAnimationFrame(dockRaf); Object.values(tw).forEach(cancelAnimationFrame);
    clearSeq(); [outT, glideT, sayT, pressT].forEach(clearTimeout);
    state = 'idle';
    ev.classList.remove('glide', 'back', 'burst', 'hello', 'docked');
    info.classList.remove('swap');
    stage.classList.remove('wiping'); scenes.forEach(s => s.classList.remove('out'));
    tok.classList.remove('is-open', 'done', 'counting', 'zero'); regen.classList.remove('press');
    sec.dataset.tok = 'closed';
    sr.textContent = '';
  };
}
