/* ==========================================================================
   O FILME · 48 s roteirizados em DOM + canvas, com trilha sintetizada opcional
   Roteiro: 50 ms → efeito halo → a cadeia → logo → Crie/Preveja/Apresente/Meça
   → cada olhar vira dado → chamada final
   ========================================================================== */
const Film = (() => {
  const D = 48;
  const CHAPTERS = [
    { t: 0, n: 'Abertura' }, { t: 5.2, n: 'Efeito halo' }, { t: 11, n: 'A cadeia' },
    { t: 21, n: 'Halor' }, { t: 27.5, n: 'Produto' }, { t: 38.4, n: 'Resultado' }, { t: 42.4, n: 'Comece' }
  ];
  const CHAIN = ['#5a35a8', '#7040d6', '#8752f5', '#9f70ff', '#b791ff', '#cfb3ff', '#e9deff'];
  let film, cv, ctx, scenes = [], state = 'poster', t = 0, last = 0, raf = 0, w = 0, h = 0, stars, lastScene = -1;
  let audio = null, soundOn = false, dragging = false;
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => 1 - Math.pow(1 - clamp(v), 3);
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

  function init() {
    film = $('#film'); if (!film) return;
    cv = $('.film-cv', film); ctx = cv.getContext('2d');
    scenes = $$('.sc', film).map(n => ({ n, from: +n.dataset.from, to: +n.dataset.to }));
    stars = makeStars(110);
    const track = $('.film-track', film);
    CHAPTERS.slice(1).forEach(c => { const k = el('span', 'film-tick'); k.style.left = (c.t / D * 100) + '%'; track.appendChild(k); });
    new ResizeObserver(resize).observe(cv);
    $$('[data-film-play]').forEach(b => b.addEventListener('click', () => {
      if (!film.contains(b)) film.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
      if (state === 'playing') return; play();
    }));
    $('[data-film-toggle]', film).addEventListener('click', () => state === 'playing' ? pause() : play());
    $('[data-film-replay]', film).addEventListener('click', () => { seek(0); play(); });
    $('[data-film-sound]', film).addEventListener('click', e => toggleSound(e.currentTarget));
    film.addEventListener('dblclick', e => { if (e.target.closest('.film-bar')) return; fullscreen(); });
    // trilha de progresso: clique, arraste e teclado
    const pos = e => { const r = track.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width) * D; };
    track.addEventListener('pointerdown', e => { dragging = true; track.setPointerCapture(e.pointerId); seek(pos(e)); });
    track.addEventListener('pointermove', e => { if (dragging) seek(pos(e)); });
    track.addEventListener('pointerup', () => { dragging = false; });
    track.addEventListener('keydown', e => {
      const k = e.key;
      if (k === 'ArrowRight') seek(t + 5); else if (k === 'ArrowLeft') seek(t - 5);
      else if (k === 'Home') seek(0); else if (k === 'End') seek(D - .1);
      else if (k === ' ' || k === 'Enter') { state === 'playing' ? pause() : play(); } else return;
      e.preventDefault();
    });
    document.addEventListener('halor:view', e => { if (e.detail !== 'v-site' && state === 'playing') pause(); });
    render();
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight; if (!w) return;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(t);
  }
  function setState(s) {
    state = s; film.dataset.state = s;
    const b = $('[data-film-toggle]', film);
    $('use', b).setAttribute('href', s === 'playing' ? '#i-pause' : s === 'ended' ? '#i-replay' : '#i-play');
    b.setAttribute('aria-label', s === 'playing' ? 'Pausar' : s === 'ended' ? 'Assistir de novo' : 'Reproduzir');
  }
  function play() {
    if (state === 'ended') { t = 0; lastScene = -1; scenes.forEach(s => s.n.classList.remove('on')); }
    setState('playing'); last = performance.now();
    if (soundOn) audioStart();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  function pause() { setState('paused'); cancelAnimationFrame(raf); audioStop(); }
  function tick(now) {
    const dt = Math.min(.1, (now - last) / 1000); last = now; t += dt;
    if (t >= D) { t = D; render(); setState('ended'); audioStop(); return; }
    render(); raf = requestAnimationFrame(tick);
  }
  function seek(nt) {
    t = Math.max(0, Math.min(D - .05, nt));
    if (state === 'poster' || state === 'ended') setState('paused');
    render();
  }
  function render() {
    scenes.forEach((s, i) => {
      const on = t >= s.from && t < s.to;
      if (on !== s.n.classList.contains('on')) s.n.classList.toggle('on', on);
      if (on && i !== lastScene) { lastScene = i; chime(i); }
    });
    $('.film-fill', film).style.width = (t / D * 100) + '%';
    $('.film-time', film).textContent = fmt(t) + ' / ' + fmt(D);
    const tr = $('.film-track', film);
    tr.setAttribute('aria-valuenow', String(Math.round(t)));
    tr.setAttribute('aria-valuetext', Math.round(t) + ' segundos');
    let ch = CHAPTERS[0]; for (const c of CHAPTERS) if (t >= c.t) ch = c;
    $('.film-chap', film).textContent = ch.n;
    draw(t);
  }

  /* · canvas · */
  function ring(x, y, r, a, lw, color) {
    if (r <= 0 || a <= 0) return;
    ctx.save(); ctx.strokeStyle = color || 'rgba(169,112,255,1)';
    ctx.globalAlpha = a * .25; ctx.lineWidth = lw * 6; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke();
    ctx.globalAlpha = a; ctx.lineWidth = lw; ctx.shadowColor = color || 'rgba(139,61,255,1)'; ctx.shadowBlur = 18; ctx.stroke();
    ctx.restore();
  }
  function dot(x, y, r, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
    g.addColorStop(0, 'rgba(255,255,255,' + a + ')'); g.addColorStop(.18, 'rgba(201,166,255,' + a * .8 + ')'); g.addColorStop(1, 'rgba(139,61,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 6, 0, 6.283); ctx.fill();
  }
  function draw(t) {
    if (!w) return;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * .5, u = w / 1000;
    for (const s of stars) { ctx.globalAlpha = Math.max(0, .2 + .3 * Math.sin(t * s.s * 1.5 + s.p)); ctx.fillStyle = '#e9deff'; ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r * u * 1.4, 0, 6.283); ctx.fill(); }
    ctx.globalAlpha = 1;
    if (t < 5.2) {
      const k = ease(t / 2.2); dot(cx, cy - h * .2, (3 + k * 8) * u, k * .9);
    } else if (t < 11) {
      const k = ease((t - 5.2) / 3.2);
      ring(cx, cy, R * (.06 + .78 * k), .9 - .4 * k, 2.4 * u);
      ring(cx, cy, R * (.04 + .5 * k), .5 * k, 1.2 * u);
    } else if (t < 21) {
      for (let i = 0; i < 7; i++) {
        const ti = 11.3 + i * 1.25, k = ease((t - ti) / 1.1); if (k <= 0) continue;
        const r = R * (1.55 - i * .2) * (1.15 - .15 * k);
        ring(cx + w * .16, cy, r, (.25 + i * .09) * k, (1 + i * .35) * u, CHAIN[i]);
      }
    } else if (t < 27.5) {
      const k = ease((t - 21) / 1.8);
      for (let i = 0; i < 7; i++) { const r = R * (1.55 - i * .2) * (1 - k) + R * .32 * k; ring(cx + w * .16 * (1 - k), cy - h * .08 * k, r, (.3 + i * .08) * (1 - k), (1 + i * .3) * u, CHAIN[i]); }
      dot(cx, cy - h * .08, 10 * u, .5 * k);
    } else if (t < 38.4) {
      drawHaloArc(ctx, w * .96, h * .08, R * 1.5, { rx: .55, ry: .55, rot: 0, s: 1.5 + (t - 27.5) * .06, len: 2.1, w: 1.6 * u * 1.6, sp: 0, o: .7 }, 0);
      drawHaloArc(ctx, w * .02, h * 1.05, R * 1.2, { rx: .6, ry: .6, rot: 0, s: 4.6 - (t - 27.5) * .05, len: 1.6, w: 1.2 * u * 1.6, sp: 0, o: .45 }, 0);
    } else if (t < 42.4) {
      for (let k = 0; k < 3; k++) { const ph = (((t - 38.4) / 1.6) + k / 3) % 1; ring(cx, cy, R * (.15 + ph * 1.1), (1 - ph) * .7, 2 * u); }
    } else {
      const k = ease((t - 42.4) / 1.6);
      drawHaloArc(ctx, cx, cy * 1.02, R * 1.05, { rx: .62 + .1 * k, ry: .62 + .1 * k, rot: 0, s: 3.4 + (t - 42.4) * .05, len: 2.6 * k + .2, w: 2.2 * u * 1.6, sp: 0, o: k }, 0);
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
  function chime(i) {
    if (!audio || !soundOn || state !== 'playing') return;
    const ac = audio.ac, o = ac.createOscillator(), g = ac.createGain(), n = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5, 1174.66, 1318.5, 1567.98];
    o.type = 'sine'; o.frequency.value = n[i % n.length];
    g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(.05, ac.currentTime + .02); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + 2.2);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 2.3);
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
