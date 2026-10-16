/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; os atalhos usam next/link e o Campo Halor vem do NotFoundEngine. */
import Link from 'next/link';

export default function NotFoundView() {
  return (
    <div className="nf">
      <canvas className="halo-field halor-field" data-field="nf" aria-hidden="true" />
      <p className="eyebrow no-rule">Erro 404</p>
      <p className="nf-n display">
        4
        <svg aria-hidden="true">
          <use href="#hl-mark" />
        </svg>
        4
      </p>
      <h1 className="display">Esta página saiu da órbita.</h1>
      <p className="lede">O endereço pode ter mudado ou a apresentação foi para a lixeira.</p>
      <div className="s-cta">
        <Link className="btn btn-primary" href="/estudio">Ir para o acervo</Link>
        <Link className="btn btn-ghost" href="/">Voltar ao site</Link>
      </div>
    </div>
  );
}
