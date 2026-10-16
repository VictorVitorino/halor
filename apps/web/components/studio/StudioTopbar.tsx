/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
export default function StudioTopbar() {
  return (
    <header className="topbar">
      <button className="btn-icon side-toggle" type="button" id="side-toggle" aria-label="Abrir menu" aria-expanded="false">
        <svg aria-hidden="true">
          <use href="#i-menu" />
        </svg>
      </button>
      {' '}
      <label className="search">
        <svg aria-hidden="true">
          <use href="#i-search" />
        </svg>
        <input id="st-search" type="search" placeholder="Buscar apresentações, slides e modelos" aria-label="Buscar no acervo" aria-keyshortcuts="Control+K Meta+K" autoComplete="off" />
        <kbd>
          <span data-mod="">Ctrl</span>
          {' '}K
        </kbd>
      </label>
      <div className="tb-right">
        <button className="btn btn-ghost btn-sm" type="button" data-open="m-import">
          <svg aria-hidden="true">
            <use href="#i-upload" />
          </svg>
          <span>Importar</span>
        </button>
        {' '}
        <button className="btn-icon" type="button" id="bell" aria-label="Notificações, 3 novas" aria-haspopup="menu" aria-expanded="false">
          <svg aria-hidden="true">
            <use href="#i-bell" />
          </svg>
          <span className="badge-dot" />
        </button>
        {' '}
        <a className="avatar" href="/entrar" aria-label="Conta de Marina Costa. Sair">MC</a>
      </div>
    </header>
  );
}
