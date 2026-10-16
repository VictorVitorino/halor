/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
export default function ProtoNav() {
  return (
    <nav className="proto" aria-label="Telas do protótipo">
      <span className="proto-tag">
        <svg aria-hidden="true">
          <use href="#hl-mark" />
        </svg>
        <span>Protótipo</span>
      </span>
      {' '}
      <a href="/" data-route="site">Site</a>
      {' '}
      <a href="/entrar" data-route="entrar">Entrar</a>
      {' '}
      <a href="/assinar" data-route="assinar">Assinar</a>
      {' '}
      <a href="/estudio" data-route="estudio">Estúdio</a>
      {' '}
      <a href="/editor" data-route="editor">Editor</a>
      {' '}
      <a href="/apresentar" data-route="apresentar">Palco</a>
      {' '}
      <a href="/painel" data-route="painel">Painel</a>
      {' '}
      <a href="/admin" data-route="admin">Admin</a>
      {' '}
      <a href="/marca" data-route="marca">Marca</a>
    </nav>
  );
}
