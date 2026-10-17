/* ==========================================================================
   VÍDEO · Conheça o Halor. Os botões [data-film-play] (o da capa e o do pôster)
   levam até o vídeo e tocam com som. Pausa ao sair do site.
   ========================================================================== */
const Pitch = (() => {
  function init() {
    const box = $('#pitch'); if (!box) return;
    const v = $('#pitch-video', box);
    const set = s => { box.dataset.state = s; };
    const play = () => { v.controls = true; const p = v.play(); if (p && p.catch) p.catch(() => { v.controls = true; }); };
    $$('[data-film-play]').forEach(b => b.addEventListener('click', () => {
      if (!box.contains(b)) box.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
      play();
    }));
    v.addEventListener('play', () => set('playing'));
    v.addEventListener('pause', () => { if (!v.ended) set('paused'); });
    v.addEventListener('ended', () => { set('ended'); v.controls = false; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); });
    document.addEventListener('halor:view', e => { if (e.detail !== 'v-site' && !v.paused) v.pause(); });
  }
  return { init };
})();
