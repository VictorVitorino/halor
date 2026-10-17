/* ==========================================================================
   Partida
   ========================================================================== */
function boot() {
  bootVitrine();
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
  Film.init();
  subHooks.apresentar = startStage;
  subHooks.admin = renderAdmin;
  subHooks.editor = renderEditor;
  subHooks.painel = dashAll;
  subHooks.inicio = renderHome;
  route();
  bootHalos();
  bootFields();
  bootNavMotion();
  bootReveal();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
