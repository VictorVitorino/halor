/* ==========================================================================
   O filme · som: um pad grave, um sino por passo e cliques suaves do cursor.
   O AudioContext só nasce dentro de um gesto (play ou ativar som), nunca no carregamento.
   ========================================================================== */

type AudioCtor = typeof AudioContext;

export interface FilmAudio {
  /** sobe o pad (cria o contexto na primeira vez) */
  start(): void;
  /** baixa o pad, sem fechar o contexto */
  stop(): void;
  bell(semi: number, vol: number, len: number): void;
  click(): void;
  /** fecha o contexto e solta os osciladores */
  close(): void;
  readonly ready: boolean;
}

interface Graph { ac: AudioContext; master: GainNode }

function audioInit(): Graph | null {
  const w = window as Window & { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
  const AC: AudioCtor | undefined = w.AudioContext || w.webkitAudioContext;
  if (!AC) return null;
  const ac = new AC(), master = ac.createGain(), lp = ac.createBiquadFilter();
  master.gain.value = 0; lp.type = 'lowpass'; lp.frequency.value = 480; lp.connect(master); master.connect(ac.destination);
  ([[55, 'sawtooth', .08], [82.41, 'sawtooth', .06], [110, 'sine', .2], [164.81, 'sine', .07]] as const).forEach(([f, ty, gv], i) => {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = ty; o.frequency.value = f; o.detune.value = i * 5; g.gain.value = gv; o.connect(g); g.connect(lp); o.start();
  });
  const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = .08; lg.gain.value = 220; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  return { ac, master };
}

export function makeFilmAudio(): FilmAudio {
  let audio: Graph | null = null;
  return {
    get ready() { return !!audio; },
    start() {
      if (!audio) audio = audioInit(); if (!audio) return;
      void audio.ac.resume().catch(() => {});
      audio.master.gain.setTargetAtTime(.05, audio.ac.currentTime, .5);
    },
    stop() { if (audio) audio.master.gain.setTargetAtTime(0, audio.ac.currentTime, .25); },
    bell(semi, vol, len) {
      if (!audio) return;
      const ac = audio.ac, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = 523.25 * Math.pow(2, semi / 12);
      g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(vol, ac.currentTime + .02); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + len);
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + len + .1);
    },
    click() {
      if (!audio) return;
      const ac = audio.ac, o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
      o.type = 'triangle'; o.frequency.setValueAtTime(1900, ac.currentTime); o.frequency.exponentialRampToValueAtTime(700, ac.currentTime + .04);
      f.type = 'highpass'; f.frequency.value = 500;
      g.gain.setValueAtTime(.05, ac.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .06);
      o.connect(f); f.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + .08);
    },
    close() {
      if (!audio) return;
      const ac = audio.ac; audio = null;
      if (ac.state !== 'closed') void ac.close().catch(() => {});
    }
  };
}
