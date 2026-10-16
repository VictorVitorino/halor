/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import Link from 'next/link';
import type { CSSProperties } from 'react';

export default function StudioHome() {
  return (
    <section className="sub" data-subview="inicio" aria-label="Início">
      <div className="st-pad">
        <div className="home-hero">
          <canvas className="halo-field halor-field" data-field="paper" aria-hidden="true" />
          <div className="hh-text">
            <p className="eyebrow" id="hh-date">Quinta-feira, 15 de outubro</p>
            <h1 className="hh-h" id="hh-greet">Bom dia, Marina.</h1>
            <p className="hh-sub">3 pessoas olharam suas apresentações desde ontem. O Grupo Aurora já está a 45{'\u00a0'}cm de você.</p>
            <div className="hh-chain" role="img" aria-label="Grupo Aurora a 45 centímetros: Confiança">
              <span className="hh-chain-k mono">Grupo Aurora</span>
              {' '}
              <span className="hh-dots">
                <i className="on" />
                <i className="on" />
                <i className="on" />
                <i className="on now" />
                <i />
                <i />
              </span>
              {' '}
              <span className="hh-chain-v">45{'\u00a0'}cm · Confiança</span>
            </div>
          </div>
          <div className="hh-week">
            <div className="hh-score">
              <div className="rs-ring">
                <svg viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="33" className="trk" />
                  <circle cx="40" cy="40" r="33" className="val" style={{ strokeDasharray: "170 208" } as CSSProperties} />
                </svg>
                <b>82</b>
              </div>
              <div>
                <p className="rs-k">Índice Halor da semana</p>
                <p className="hh-up">
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M6 2l4 5H2z" fill="currentColor" />
                  </svg>
                  {' '}+6 vs. semana passada
                </p>
              </div>
            </div>
            <dl className="hh-stats">
              <div>
                <dt>Apresentações abertas</dt>
                <dd>14</dd>
              </div>
              <div>
                <dt>Votos da plateia</dt>
                <dd>126</dd>
              </div>
              <div>
                <dt>Olhar por slide</dt>
                <dd>
                  17
                  <small>s</small>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="starts">
          <a className="start start-new" href="/editor" data-deck="new" data-key="1">
            <span className="st-ic">
              <svg aria-hidden="true">
                <use href="#i-plus" />
              </svg>
            </span>
            <b>Nova apresentação</b>
            <small>Em branco ou com o seu kit de marca</small>
            <kbd>1</kbd>
          </a>
          {' '}
          <button className="start" type="button" data-scroll="#modelos" data-key="2">
            <span className="st-ic">
              <svg aria-hidden="true">
                <use href="#i-grid" />
              </svg>
            </span>
            <b>Modelos</b>
            <small>Kickoff, aula, workshop, evento</small>
            <kbd>2</kbd>
          </button>
          {' '}
          <a className="start" href="/editor" data-deck="kickoff" data-key="3">
            <span className="st-ic">
              <svg aria-hidden="true">
                <use href="#i-clock" />
              </svg>
            </span>
            <b>Retomar</b>
            <small>Kickoff 2027</small>
            <kbd>3</kbd>
          </a>
          {' '}
          <button className="start" type="button" data-open="m-import" data-key="4">
            <span className="st-ic">
              <svg aria-hidden="true">
                <use href="#i-upload" />
              </svg>
            </span>
            <b>Importar arquivo</b>
            <small>.pptx, .pdf ou acervo .json</small>
            <kbd>4</kbd>
          </button>
          {' '}
          <button className="start" type="button" data-go="biblioteca" data-key="5">
            <span className="st-ic">
              <svg aria-hidden="true">
                <use href="#i-layers" />
              </svg>
            </span>
            <b>Biblioteca</b>
            <small>Gráficos, votação e efeitos</small>
            <kbd>5</kbd>
          </button>
          {' '}
          <Link className="start" href="/marca" data-key="6">
            <span className="st-ic">
              <svg aria-hidden="true">
                <use href="#i-book" />
              </svg>
            </span>
            <b>Guia da marca</b>
            <small>Cores, fontes e regras</small>
            <kbd>6</kbd>
          </Link>
        </div>
        <div className="home-grid">
          <div className="home-main">
            <div className="sec-h">
              <h2>Acervo</h2>
              <div className="tabs" role="tablist" aria-label="Filtrar acervo">
                <button type="button" role="tab" aria-selected="true" aria-controls="acv" data-acv="todas">Todas</button>
                {' '}
                <button type="button" role="tab" aria-selected="false" aria-controls="acv" tabIndex={-1} data-acv="minhas">Minhas</button>
                {' '}
                <button type="button" role="tab" aria-selected="false" aria-controls="acv" tabIndex={-1} data-acv="time">Do time</button>
                {' '}
                <button type="button" role="tab" aria-selected="false" aria-controls="acv" tabIndex={-1} data-acv="lixeira">Lixeira</button>
              </div>
              <label className="sort">
                <span className="sr-only">Ordenar por</span>
                <select className="select" id="acv-sort">
                  <option value="recentes">Atualizadas recentemente</option>
                  <option value="indice">Maior Índice Halor</option>
                  <option value="vistas">Mais vistas</option>
                  <option value="titulo">Título de A a Z</option>
                </select>
              </label>
            </div>
            <div className="acv-q" id="acv-q" role="status" hidden>
              <span id="acv-q-t" />
              <button className="btn btn-quiet btn-xs" type="button" id="acv-clear">
                <svg aria-hidden="true">
                  <use href="#i-x" />
                </svg>
                {' '}Limpar busca
              </button>
            </div>
            <div className="acv" id="acv" role="tabpanel" aria-label="Apresentações do acervo" />
            <div className="sec-h" id="modelos">
              <h2>Comece com um modelo</h2>
              <span className="muted sec-sub">Todos já aplicam o seu kit de marca</span>
            </div>
            <div className="tpls" id="tpls" />
          </div>
          <aside className="signals" aria-label="Sinais de hoje">
            <div className="sig-h">
              <h2>Sinais de hoje</h2>
              <span className="chip">
                <i className="dot dot-live" />
                {' '}ao vivo
              </span>
            </div>
            <ol className="sig-list" id="sig-list" />
            <Link className="link" href="/painel">
              Ver tudo no Painel Halor{' '}
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
