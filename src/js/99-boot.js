/* ==========================================================================
   Partida
   ========================================================================== */
function boot() {
  bootEfeito();
  renderPlans();
  dashAll();
  renderPreviews();
  renderEditor(); bindEditor();
  bindHome();
  bindStage();
  bindAuth();
  bindCheckout();
  renderBrand();
  Film.init();
  subHooks.apresentar = startStage;
  subHooks.admin = renderAdmin;
  subHooks.editor = renderEditor;
  route();
  bootHalos();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
