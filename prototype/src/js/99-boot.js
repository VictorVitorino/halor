/* ==========================================================================
   Partida
   ========================================================================== */
function boot() {
  bootVitrine();
  bootModelos();
  bootTimeline();
  bootProduto();
  renderPlans();
  dashAll();
  renderPreviews();
  renderEditor(); bindEditor();
  bindHome();
  bindStage();
  bindAuth();
  bindCheckout();
  renderBrand();
  Pitch.init();
  subHooks.apresentar = startStage;
  subHooks.admin = renderAdmin;
  subHooks.editor = renderEditor;
  subHooks.painel = dashAll;
  subHooks.inicio = renderHome;
  route();
  bootHalos();
  bootFields();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
