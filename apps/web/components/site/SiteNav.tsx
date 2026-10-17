/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import type { CSSProperties } from 'react';
import Link from 'next/link';
export default function SiteNav() {
  return (
    <header className="s-nav" id="s-nav">
      <div className="wrap s-nav-in">
        <Link className="logo logo-night" href="/" aria-label="Halor, início">
          <svg className="mk-glow" aria-hidden="true">
            <use href="#hl-mark" />
          </svg>
          <span className="wordmark">halor</span>
        </Link>
        <button className="s-menu" type="button" aria-expanded="false" aria-controls="s-links" aria-label="Menu das seções">
          <span className="s-menu-i" aria-hidden="true"><i /><i /><i /></span>
        </button>
        <nav className="s-links" id="s-links" aria-label="Seções do site">
          <a href="#efeito">Efeito Halor</a>
          {' '}
          <a href="#produto">Produto</a>
          {' '}
          <a href="#linha-do-tempo">Linha do tempo</a>
          {' '}
          <a href="#vitrine">Vitrine de efeitos</a>
          {' '}
          <a href="#planos">Planos</a>
          {' '}
          <Link className="s-menu-only" href="/entrar" style={{ '--i': 5 } as CSSProperties}>Entrar</Link>
        </nav>
        <div className="s-nav-cta">
          <Link className="btn btn-quiet btn-sm" href="/entrar">Entrar</Link>
          {' '}
          <Link className="btn btn-primary btn-sm" href="/assinar/?plano=faisca" data-plan="faisca">Começar grátis</Link>
        </div>
      </div>
    </header>
  );
}
