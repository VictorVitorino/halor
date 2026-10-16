/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import Link from 'next/link';
import type { CSSProperties } from 'react';

export default function StudioSidebar() {
  return (
    <aside className="side" id="side" aria-label="Navegação do Estúdio">
      <Link className="logo side-logo" href="/">
        <svg aria-hidden="true">
          <use href="#hl-mark-paper" />
        </svg>
        <span className="wordmark">halor</span>
      </Link>
      {' '}
      <a className="btn btn-primary btn-block side-new" href="/editor" data-deck="new">
        <svg aria-hidden="true">
          <use href="#i-plus" />
        </svg>
        {' '}Nova apresentação
      </a>
      <nav className="side-nav">
        <Link href="/estudio" data-sub="inicio">
          <svg aria-hidden="true">
            <use href="#i-home" />
          </svg>
          Início
        </Link>
        {' '}
        <Link href="/editor" data-sub="editor">
          <svg aria-hidden="true">
            <use href="#i-layers" />
          </svg>
          Editor
        </Link>
        {' '}
        <Link href="/painel" data-sub="painel">
          <svg aria-hidden="true">
            <use href="#i-chart" />
          </svg>
          Painel Halor
        </Link>
        {' '}
        <Link href="/apresentar" data-sub="apresentar">
          <svg aria-hidden="true">
            <use href="#i-present" />
          </svg>
          Apresentar
        </Link>
        <p className="side-h mono">Equipe</p>
        <Link href="/marca">
          <svg aria-hidden="true">
            <use href="#i-palette" />
          </svg>
          Kit de marca
        </Link>
        {' '}
        <Link href="/admin" data-sub="admin">
          <svg aria-hidden="true">
            <use href="#i-users" />
          </svg>
          Administração
        </Link>
        {' '}
        <button type="button" data-open="m-keys">
          <svg aria-hidden="true">
            <use href="#i-keyboard" />
          </svg>
          Guia e atalhos
          <kbd className="side-kbd">?</kbd>
        </button>
      </nav>
      <div className="side-plan">
        <div className="sp-top">
          <span className="chip">Plano Halo</span>
          <Link className="link" href="/assinar">Mudar</Link>
        </div>
        <p className="sp-l">Raio Halor este mês</p>
        <div className="sp-bar" role="meter" aria-valuemin={0} aria-valuemax={50} aria-valuenow={32} aria-label="Análises do Raio Halor usadas">
          <i style={{ width: "64%" } as CSSProperties} />
        </div>
        <p className="sp-n mono num">32 de 50 análises</p>
      </div>
    </aside>
  );
}
