/* ==========================================================================
   VÍDEO · Conheça o Halor. Os botões [data-film-play] (o da capa e o do pôster)
   levam até o vídeo e tocam com som; pausa ao sair da tela.
   O filme interativo anterior continua em lib/engines/film (arquivado).
   ========================================================================== */
import { $, $$, REDUCED } from '../core';

export function bootPitch(root: ParentNode = document): () => void {
  const box = $<HTMLElement>('#pitch', root);
  const v = box ? $<HTMLVideoElement>('#pitch-video', box) : null;
  if (!box || !v) return () => {};
  const ac = new AbortController(), on = { signal: ac.signal };
  const set = (s: string) => { box.dataset.state = s; };
  const play = () => { v.controls = true; v.play().catch(() => { v.controls = true; }); };

  $$('[data-film-play]', document).forEach(b => b.addEventListener('click', () => {
    if (!box.contains(b)) box.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
    play();
  }, on));
  v.addEventListener('play', () => set('playing'), on);
  v.addEventListener('pause', () => { if (!v.ended) set('paused'); }, on);
  v.addEventListener('ended', () => {
    set('ended'); v.controls = false;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, on);

  return () => { ac.abort(); if (!v.paused) v.pause(); };
}
