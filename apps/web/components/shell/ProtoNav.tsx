/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   Links do Next: navegar pela barra não recarrega a página e mantém a sessão do estúdio. */
import Link from 'next/link';

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
      <Link href="/" data-route="site">Site</Link>
      {' '}
      <Link href="/entrar" data-route="entrar">Entrar</Link>
      {' '}
      <Link href="/assinar" data-route="assinar">Assinar</Link>
      {' '}
      <Link href="/estudio" data-route="estudio">Estúdio</Link>
      {' '}
      <Link href="/editor" data-route="editor">Editor</Link>
      {' '}
      <Link href="/apresentar" data-route="apresentar">Palco</Link>
      {' '}
      <Link href="/painel" data-route="painel">Painel</Link>
      {' '}
      <Link href="/admin" data-route="admin">Admin</Link>
      {' '}
      <Link href="/marca" data-route="marca">Marca</Link>
    </nav>
  );
}
