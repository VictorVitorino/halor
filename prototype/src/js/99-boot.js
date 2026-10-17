/* ==========================================================================
   Partida
   ========================================================================== */
/* cada módulo parte isolado: se um falhar, os outros seguem e o erro aparece no console */
function safe(fn, name) {
  try { fn(); } catch (err) { console.error('[halor] falha ao iniciar ' + name, err); }
}
function boot() {
  safe(bootVitrine, 'vitrine');
  safe(bootModelos, 'modelos');
  safe(bootTimeline, 'linha do tempo');
  safe(bootProduto, 'produto');
  safe(renderPlans, 'planos');
  safe(dashAll, 'painel');
  safe(renderPreviews, 'prévias');
  safe(() => { renderEditor(); bindEditor(); }, 'editor');
  safe(bindHome, 'início');
  safe(bindStage, 'palco');
  safe(bindAuth, 'entrar');
  safe(bindCheckout, 'checkout');
  safe(renderBrand, 'marca');
  safe(() => Pitch.init(), 'vídeo');
  subHooks.apresentar = startStage;
  subHooks.admin = renderAdmin;
  subHooks.editor = renderEditor;
  subHooks.painel = dashAll;
  subHooks.inicio = renderHome;
  route();
  safe(bootHalos, 'halos');
  safe(bootFields, 'campo');
  safe(bootNavFx, 'menu');
  safe(bootProtoAway, 'barra do protótipo');
  safe(bootReveal, 'revelar ao rolar');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
