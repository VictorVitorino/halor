/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado por FilmEngine (lib/engines/film). */
import type { CSSProperties } from 'react';
import FilmEngine from './FilmEngine';

export default function Film() {
  return (
    <div className="wrap s-film-wrap" id="filme">
      <div className="film" id="film" data-state="poster" role="region" aria-label="Filme Conheça o Halor" aria-describedby="film-roteiro">
        <svg className="film-defs" width="0" height="0" aria-hidden="true" focusable="false">
          <symbol id="fi-vote" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M5 19V13M10 19V6M15 19v-9M20 19v-4" />
          </symbol>
          <symbol id="fi-note" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
            <path d="M5 4.5h14v9.5l-5 5H5z" />
            <path d="M14 19v-5h5" />
          </symbol>
          <symbol id="fi-form" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 9h8M8 12.5h8M8 16h4.5" />
          </symbol>
          <symbol id="fi-timer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <circle cx="12" cy="13.5" r="7" />
            <path d="M12 13.5V9.8M9.5 3.5h5M18 6.8l1.5-1.5" />
          </symbol>
          <symbol id="fi-cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M4 9h9M4 13h16M4 17h7M15 9h5M13 17h7" />
          </symbol>
          <symbol id="fi-quiz" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2-2.4 3.6M12 17v.01" />
          </symbol>
          <symbol id="fi-spark" viewBox="0 0 24 24">
            <path d="M12 1Q12 12 23 12Q12 12 12 23Q12 12 1 12Q12 12 12 1Z" fill="currentColor" />
          </symbol>
          <symbol id="fi-cursor" viewBox="0 0 24 24">
            <path d="M5 3l14 8.2-6.1 1.4L9.6 19z" fill="#17112b" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          </symbol>
          <symbol id="fi-reload" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12a7 7 0 1 1-2.1-5" />
            <path d="M19 4.5V8h-3.5" />
          </symbol>
        </svg>
        {' '}
        <canvas className="film-cv" aria-hidden="true" />
        <div className="film-scenes" aria-hidden="true">
          {/* 0:00 · abertura no mundo Noite */}
          <div className="sc sc-c sc-open" data-from="0" data-to="3.15" data-fi=".5" data-fo=".5" data-rc=".5">
            <span className="f-mk" data-anchor="mark">
              <svg className="f-mark" viewBox="0 0 64 64">
                <path className="fa fa-draw" style={{ "--at": ".25", "--du": "1.1", "--len": "146" } as CSSProperties} d="M55.56 21.01A26 26 0 1 1 42.99 8.44" fill="none" stroke="url(#hl-g-ring)" strokeWidth="5.5" strokeLinecap="round" />
                {' '}
                <circle className="fa fa-fade" style={{ "--at": ".8", "--du": ".5" } as CSSProperties} cx="32" cy="32" r="16.5" fill="none" stroke="url(#hl-g-ring)" strokeWidth="1.6" />
                {' '}
                <circle className="f-core fa fa-core" style={{ "--at": ".55", "--du": ".6" } as CSSProperties} cx="32" cy="32" r="8.5" fill="url(#hl-g-core)" />
                {' '}
                <path className="f-spark fa fa-spark" style={{ "--at": "1.15", "--du": ".6" } as CSSProperties} d="M50.4 6.4Q50.4 13.6 57.6 13.6Q50.4 13.6 50.4 20.8Q50.4 13.6 43.2 13.6Q50.4 13.6 50.4 6.4Z" fill="#fff" />
              </svg>
            </span>
            <p className="f-word wordmark fa fa-up" style={{ "--at": ".9" } as CSSProperties}>halor</p>
            <p className="f-tag fa fa-up" style={{ "--at": "1.35" } as CSSProperties}>
              Faça cada olhar{' '}
              <span className="f-lux" style={{ "--lat": "1.6" } as CSSProperties}>render.</span>
            </p>
          </div>
          {/* 0:04 a 1:24 · a gravação de tela do Estúdio */}
          <div className="sc sc-app" data-from="3.65" data-to="84" data-o="0" data-fi=".01" data-fo=".8">
            <div className="fw-cam">
              <div className="fw fa fa-win" style={{ "--at": "3.65", "--du": "1.2" } as CSSProperties} data-cur="">
                <div className="fw-in">
                  {/* navegador */}
                  <div className="fw-chrome">
                    <div className="fw-tabs">
                      <span className="fw-dots">
                        <i />
                        <i />
                        <i />
                      </span>
                      {' '}
                      <span className="fw-tab fw-tab1" data-on="0 74.9">
                        <svg aria-hidden="true">
                          <use href="#hl-mark-paper" />
                        </svg>
                        <em>Estúdio Halor</em>
                      </span>
                      {' '}
                      <span className="fw-tab fw-tab2 fa fa-tab" style={{ "--at": "74.3", "--du": ".5" } as CSSProperties} data-on="74.9 99">
                        <svg aria-hidden="true">
                          <use href="#i-file" />
                        </svg>
                        <em>kickoff-2027.html</em>
                      </span>
                      {' '}
                      <span className="fw-tplus">
                        <svg aria-hidden="true">
                          <use href="#i-plus" />
                        </svg>
                      </span>
                    </div>
                    <div className="fw-addr">
                      <span className="fw-nav">
                        <svg aria-hidden="true">
                          <use href="#i-back" />
                        </svg>
                        <svg className="fw-fwd" aria-hidden="true">
                          <use href="#i-arrow" />
                        </svg>
                        <svg aria-hidden="true">
                          <use href="#fi-reload" />
                        </svg>
                      </span>
                      {' '}
                      <span className="fw-url">
                        <svg aria-hidden="true">
                          <use href="#i-lock" />
                        </svg>
                        {' '}
                        <span data-on="0 10">
                          estudio.halor.app/
                          <b>inicio</b>
                        </span>
                        {' '}
                        <span data-on="10 16">
                          estudio.halor.app/
                          <b>modelos</b>
                        </span>
                        {' '}
                        <span data-on="16 74.9">
                          estudio.halor.app/
                          <b>editor/kickoff-2027</b>
                        </span>
                        {' '}
                        <span data-on="74.9 99">
                          Arquivo ·{' '}
                          <b>Downloads/kickoff-2027.html</b>
                        </span>
                      </span>
                      {' '}
                      <span className="fw-dlic" data-on="71.5 99">
                        <svg aria-hidden="true">
                          <use href="#i-download" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="fw-app">
                    {/* casca do Início e dos Modelos: barra lateral e barra superior */}
                    <div className="sc fw-shell" data-from="3.65" data-to="15.9" data-o="0" data-fi="0" data-fo=".22">
                      <aside className="fh-side">
                        <p className="fh-logo">
                          <svg aria-hidden="true">
                            <use href="#hl-mark-paper" />
                          </svg>
                          <b>halor</b>
                        </p>
                        <span className="fh-new">
                          <svg aria-hidden="true">
                            <use href="#i-plus" />
                          </svg>
                          Nova apresentação
                        </span>
                        {' '}
                        <span className="fh-ni" data-on="0 10">
                          <svg aria-hidden="true">
                            <use href="#i-home" />
                          </svg>
                          Início
                        </span>
                        {' '}
                        <span className="fh-ni" data-on="10 99">
                          <svg aria-hidden="true">
                            <use href="#i-grid" />
                          </svg>
                          Modelos
                        </span>
                        {' '}
                        <span className="fh-ni">
                          <svg aria-hidden="true">
                            <use href="#i-layers" />
                          </svg>
                          Acervo
                        </span>
                        {' '}
                        <span className="fh-ni">
                          <svg aria-hidden="true">
                            <use href="#i-wand" />
                          </svg>
                          Biblioteca
                        </span>
                        {' '}
                        <span className="fh-ni">
                          <svg aria-hidden="true">
                            <use href="#i-present" />
                          </svg>
                          Apresentar
                        </span>
                        <p className="fh-sh">Equipe</p>
                        <span className="fh-ni">
                          <svg aria-hidden="true">
                            <use href="#i-palette" />
                          </svg>
                          Kit de marca
                        </span>
                        {' '}
                        <span className="fh-ni">
                          <svg aria-hidden="true">
                            <use href="#i-book" />
                          </svg>
                          Guia da marca
                        </span>
                      </aside>
                      <div className="fh-top">
                        <span className="fh-search">
                          <svg aria-hidden="true">
                            <use href="#i-search" />
                          </svg>
                          Buscar apresentações, slides e modelos
                        </span>
                        {' '}
                        <span className="fh-imp">
                          <svg aria-hidden="true">
                            <use href="#i-upload" />
                          </svg>
                          Importar
                        </span>
                        {' '}
                        <span className="fh-av">MC</span>
                      </div>
                      {/* Passo 1 · Início */}
                      <div className="sc fh-main" data-from="3.65" data-to="10" data-o="0" data-fi="0" data-fo=".2">
                        <p className="fh-eb">Quinta-feira, 15 de outubro</p>
                        <p className="fh-h">Bom dia, Marina.</p>
                        <p className="fh-sub">O que vamos apresentar hoje?</p>
                        <div className="fh-starts">
                          <span className="fh-st fh-st1 fh-st-p" data-hov="">
                            <i>
                              <svg aria-hidden="true">
                                <use href="#i-plus" />
                              </svg>
                            </i>
                            <b>Nova apresentação</b>
                            <small>Em branco ou com o seu kit de marca</small>
                            <kbd>1</kbd>
                          </span>
                          {' '}
                          <span className="fh-st fh-st2" data-hov="" data-on="8.7 99">
                            <i>
                              <svg aria-hidden="true">
                                <use href="#i-grid" />
                              </svg>
                            </i>
                            <b>Modelos</b>
                            <small>Kickoff, aula, workshop</small>
                            <kbd>2</kbd>
                          </span>
                          {' '}
                          <span className="fh-st fh-st3" data-hov="">
                            <i>
                              <svg aria-hidden="true">
                                <use href="#i-clock" />
                              </svg>
                            </i>
                            <b>Retomar</b>
                            <small>Aula de onboarding</small>
                            <kbd>3</kbd>
                          </span>
                          {' '}
                          <span className="fh-st fh-st4" data-hov="">
                            <i>
                              <svg aria-hidden="true">
                                <use href="#i-upload" />
                              </svg>
                            </i>
                            <b>Importar arquivo</b>
                            <small>.pptx, .pdf ou .html</small>
                            <kbd>4</kbd>
                          </span>
                          {' '}
                          <span className="fh-st fh-st5" data-hov="">
                            <i>
                              <svg aria-hidden="true">
                                <use href="#i-layers" />
                              </svg>
                            </i>
                            <b>Biblioteca</b>
                            <small>Modelos, efeitos e componentes</small>
                            <kbd>5</kbd>
                          </span>
                          {' '}
                          <span className="fh-st fh-st6" data-hov="">
                            <i>
                              <svg aria-hidden="true">
                                <use href="#i-book" />
                              </svg>
                            </i>
                            <b>Guia da marca</b>
                            <small>Cores, fontes e regras</small>
                            <kbd>6</kbd>
                          </span>
                        </div>
                        <div className="fh-ah">
                          <b>Acervo</b>
                          <span className="act">Todas</span>
                          <span>Minhas</span>
                          <span>Do time</span>
                        </div>
                        <div className="fh-acv">
                          <span>
                            <span className="fw-th" data-slide="a1" />
                            <b>Aula de onboarding</b>
                            <small>há 12 min</small>
                          </span>
                          {' '}
                          <span>
                            <span className="fw-th" data-slide="a2" />
                            <b>Workshop de produto</b>
                            <small>ontem</small>
                          </span>
                          {' '}
                          <span>
                            <span className="fw-th" data-slide="a3" />
                            <b>Relatório do trimestre</b>
                            <small>há 2 dias</small>
                          </span>
                          {' '}
                          <span>
                            <span className="fw-th" data-slide="a4" />
                            <b>Treinamento do time</b>
                            <small>semana passada</small>
                          </span>
                        </div>
                      </div>
                      {/* Passo 2 · Modelos */}
                      <div className="sc fm-main" data-from="10" data-to="16.15" data-o="0" data-fw=".15" data-fi=".34" data-fo="0" data-fz=".012">
                        <div className="fm-head">
                          <span className="fm-back">
                            <svg aria-hidden="true">
                              <use href="#i-back" />
                            </svg>
                            Início
                          </span>
                          <div>
                            <p className="fm-h">Modelos</p>
                            <p className="fm-sub">Roteiros completos para adaptar. Todos com o seu kit de marca.</p>
                          </div>
                          <span className="fm-n">06 modelos</span>
                        </div>
                        <div className="fm-grid">
                          <span className="fm-c fm-c1" data-hov="" data-on="12.6 99">
                            <span className="fw-th" data-slide="m1" />
                            <em>06 slides</em>
                            <b>Kickoff de projeto</b>
                            <small>Objetivos, papéis e cronograma</small>
                          </span>
                          {' '}
                          <span className="fm-c fm-c2" data-hov="">
                            <span className="fw-th" data-slide="m2" />
                            <em>10 slides</em>
                            <b>Aula e treinamento</b>
                            <small>Perguntas, votação e post-its</small>
                          </span>
                          {' '}
                          <span className="fm-c fm-c3" data-hov="">
                            <span className="fw-th" data-slide="m3" />
                            <em>07 slides</em>
                            <b>Relatório executivo</b>
                            <small>Indicadores, riscos e decisões</small>
                          </span>
                          {' '}
                          <span className="fm-c fm-c4" data-hov="">
                            <span className="fw-th" data-slide="m4" />
                            <em>08 slides</em>
                            <b>Apresentação institucional</b>
                            <small>Quem somos e o que fazemos</small>
                          </span>
                          {' '}
                          <span className="fm-c fm-c5" data-hov="">
                            <span className="fw-th" data-slide="m5" />
                            <em>09 slides</em>
                            <b>Workshop</b>
                            <small>Dinâmicas e quadro de ideias</small>
                          </span>
                          {' '}
                          <span className="fm-c fm-c6" data-hov="">
                            <span className="fw-th" data-slide="m6" />
                            <em>01 slide</em>
                            <b>Em branco</b>
                            <small>Com o seu kit de marca</small>
                          </span>
                        </div>
                        <div className="fm-strip fa fa-up" style={{ "--at": "12.7", "--du": ".55" } as CSSProperties}>
                          <p>
                            <em>Roteiro completo</em>
                            <b>Kickoff de projeto</b>
                          </p>
                          <div className="fm-sts">
                            <span className="fw-th" data-slide="d1" />
                            <span className="fw-th" data-slide="d2" />
                            <span className="fw-th" data-slide="d3" />
                            <span className="fw-th" data-slide="d4" />
                            <span className="fw-th" data-slide="d5" />
                            <span className="fw-th" data-slide="d6" />
                          </div>
                          <span className="fm-use" data-hov="">
                            <svg aria-hidden="true">
                              <use href="#i-check" />
                            </svg>
                            Usar modelo
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Passos 3 a 11 · Editor */}
                    <div className="sc fe" data-from="15.9" data-to="75.5" data-o="0" data-fw=".16" data-fi=".38" data-fo="0" data-fz=".014">
                      <div className="fe-top">
                        <span className="fe-back">
                          <svg aria-hidden="true">
                            <use href="#i-back" />
                          </svg>
                        </span>
                        <div className="fe-name">
                          <b>Kickoff de projeto 2027</b>
                          <span>
                            <svg aria-hidden="true">
                              <use href="#i-check" />
                            </svg>
                            Salvo às 09:42
                          </span>
                        </div>
                        <span className="fe-menu">
                          <span>Arquivo</span>
                          <span>Editar</span>
                          <span>Inserir</span>
                          <span>Slide</span>
                          <span>Apresentar</span>
                          <span>Ajuda</span>
                        </span>
                        {' '}
                        <span className="fe-acts">
                          <span className="fe-ic" title="Desfazer">
                            <svg aria-hidden="true">
                              <use href="#i-undo" />
                            </svg>
                          </span>
                          {' '}
                          <span className="fe-ic" title="Refazer">
                            <svg aria-hidden="true">
                              <use href="#i-redo" />
                            </svg>
                          </span>
                          {' '}
                          <span className="fe-btn fe-save" data-hov="">
                            <svg aria-hidden="true">
                              <use href="#i-download" />
                            </svg>
                            Salvar como
                          </span>
                          {' '}
                          <span className="fe-btn fe-btn-p fe-play" data-hov="">
                            <svg aria-hidden="true">
                              <use href="#i-play" />
                            </svg>
                            Apresentar
                          </span>
                        </span>
                      </div>
                      <div className="fe-rb">
                        <span className="fr">
                          <svg aria-hidden="true">
                            <use href="#i-text" />
                          </svg>
                          Texto
                        </span>
                        {' '}
                        <span className="fr">
                          <svg aria-hidden="true">
                            <use href="#i-shape" />
                          </svg>
                          Formas
                        </span>
                        {' '}
                        <span className="fr">
                          <svg aria-hidden="true">
                            <use href="#i-arrowline" />
                          </svg>
                          Seta
                        </span>
                        {' '}
                        <span className="fr">
                          <svg aria-hidden="true">
                            <use href="#i-image" />
                          </svg>
                          Imagem
                        </span>
                        {' '}
                        <span className="fr fr-icon" data-hov="" data-on="32.9 33.4">
                          <svg aria-hidden="true">
                            <use href="#i-spark" />
                          </svg>
                          Ícones
                        </span>
                        {' '}
                        <span className="fr fr-chart" data-hov="" data-on="30.3 31.35">
                          <svg aria-hidden="true">
                            <use href="#i-bars" />
                          </svg>
                          Gráficos
                        </span>
                        {' '}
                        <span className="fr fr-cards" data-hov="" data-on="34.1 34.6">
                          <svg aria-hidden="true">
                            <use href="#i-cards" />
                          </svg>
                          Cards
                        </span>
                        {' '}
                        <span className="fr-sep" />
                        {' '}
                        <span className="fr">
                          <svg aria-hidden="true">
                            <use href="#i-grid" />
                          </svg>
                          Modelos
                        </span>
                        {' '}
                        <span className="fr fr-fx" data-hov="" data-on="36.3 48.05">
                          <svg aria-hidden="true">
                            <use href="#i-wand" />
                          </svg>
                          Efeitos
                        </span>
                        {' '}
                        <span className="fr-sep" />
                        {' '}
                        <span className="fr fr-ray" data-hov="" data-on="49.9 53.5">
                          <svg aria-hidden="true">
                            <use href="#i-target" />
                          </svg>
                          Raio Halor
                        </span>
                      </div>
                      <div className="fe-body">
                        <aside className="fe-rail">
                          <p className="fe-rh">
                            Slides{' '}
                            <b data-on="0 58.1">6</b>
                            <b data-on="58.1 99">8</b>
                          </p>
                          <div className="fe-rlw">
                            <ol className="fe-rl fd" style={{ "--xt": "58", "--xn": "fe-rl-up", "--xdu": ".6", "--xez": "cubic-bezier(.22,.61,.36,1)" } as CSSProperties}>
                              <li data-on="15.9 29.2|48.85 99">
                                <span className="fw-pal" data-clone="1" />
                              </li>
                              <li>
                                <span className="fw-pal" data-slide="d2" data-n-slide="2" />
                              </li>
                              <li data-on="29.2 42.95">
                                <span className="fw-pal" data-clone="3" />
                              </li>
                              <li>
                                <span className="fw-pal" data-slide="d4" data-n-slide="4" />
                              </li>
                              <li data-on="42.95 48.85">
                                <span className="fw-pal" data-clone="5" />
                              </li>
                              <li>
                                <span className="fw-pal" data-slide="d6" data-n-slide="6" />
                              </li>
                              <li className="fa fa-in" style={{ "--at": "58.15" } as CSSProperties}>
                                <span className="fw-pal" data-slide="i1" data-n-slide="7" />
                                <em className="fe-new">novo</em>
                              </li>
                              <li className="fa fa-in" style={{ "--at": "58.35" } as CSSProperties}>
                                <span className="fw-pal" data-slide="i2" data-n-slide="8" />
                                <em className="fe-new">novo</em>
                              </li>
                            </ol>
                          </div>
                        </aside>
                        <div className="fe-stage">
                          <div className="fe-cvw">
                            <div className="fe-cv fw-pal">
                              {/* slide 1 · capa com o título digitado */}
                              <div className="fe-cs" data-cs="1" data-on="15.9 29.2|48.85 99">
                                <div className="slide sl-cover">
                                  <span className="sl-ring" />
                                  <span className="sl-ring sl-ring2" />
                                  <p className="sl-k">Kickoff · 2027</p>
                                  <p className="sl-h">
                                    <span className="fe-old fd" data-on="17.5 17.95" style={{ "--xt": "17.95", "--xdu": ".05" } as CSSProperties}>Título do projeto</span>
                                    <span data-type="18 2.1">Plano 2027 em 12 semanas.</span>
                                  </p>
                                  <p className="sl-sub">Time de produto · 4 de novembro</p>
                                  <div className="sl-foot">
                                    <b>
                                      <svg aria-hidden="true">
                                        <use href="#hl-mark" />
                                      </svg>
                                      halor
                                    </b>
                                    <span>01</span>
                                  </div>
                                </div>
                              </div>
                              {/* slide 3 · gráfico, ícone e cards inseridos */}
                              <div className="fe-cs" data-cs="3" data-on="29.2 42.95">
                                <div className="slide sl-light fs3">
                                  <p className="sl-k">Meta</p>
                                  <p className="sl-h">Do kickoff à entrega.</p>
                                  <div className="fs3-chart fa fa-fade" style={{ "--at": "31.35", "--du": ".3" } as CSSProperties} data-on="38 99">
                                    <i className="fa fa-bar" style={{ "--at": "31.45", "--h": "30%" } as CSSProperties}>
                                      <em>S4</em>
                                    </i>
                                    <i className="fa fa-bar" style={{ "--at": "31.6", "--h": "52%" } as CSSProperties}>
                                      <em>S8</em>
                                    </i>
                                    <i className="fa fa-bar" style={{ "--at": "31.75", "--h": "74%" } as CSSProperties}>
                                      <em>S10</em>
                                    </i>
                                    <i className="fs3-hi fa fa-bar" style={{ "--at": "31.9", "--h": "96%" } as CSSProperties}>
                                      <em>S12</em>
                                    </i>
                                    {' '}
                                    <span className="fs3-sh">
                                      <span className="fa fa-shine" style={{ "--at": "38.05", "--du": "1.3" } as CSSProperties} />
                                    </span>
                                  </div>
                                  <span className="fs3-icon fa fa-pop" style={{ "--at": "33", "--du": ".55" } as CSSProperties}>
                                    <svg aria-hidden="true">
                                      <use href="#i-target" />
                                    </svg>
                                  </span>
                                  <div className="fs3-cards">
                                    <span className="fa fa-drop" style={{ "--at": "34.2" } as CSSProperties}>
                                      <b>S4</b>
                                      Desenho pronto
                                    </span>
                                    {' '}
                                    <span className="fa fa-drop" style={{ "--at": "34.35" } as CSSProperties}>
                                      <b>S8</b>
                                      Piloto no ar
                                    </span>
                                    {' '}
                                    <span className="fa fa-drop" style={{ "--at": "34.5" } as CSSProperties}>
                                      <b>S12</b>
                                      Entrega final
                                    </span>
                                  </div>
                                  <div className="sl-foot">
                                    <b>
                                      <svg aria-hidden="true">
                                        <use href="#hl-mark-paper" />
                                      </svg>
                                      halor
                                    </b>
                                    <span>03</span>
                                  </div>
                                </div>
                              </div>
                              {/* slide 5 · votação e post-its */}
                              <div className="fe-cs" data-cs="5" data-on="42.95 48.85">
                                <div className="slide sl-light fs5">
                                  <p className="sl-k">Sua vez</p>
                                  <p className="sl-h">Qual frente começa primeiro?</p>
                                  <span className="fs5-zone fs5-z1" data-on="43.85 44.95" />
                                  {' '}
                                  <span className="fs5-zone fs5-z2" data-on="45.65 46.65" />
                                  <div className="fs5-poll fa fa-pop" style={{ "--at": "44.95", "--du": ".55" } as CSSProperties}>
                                    <p>
                                      <svg aria-hidden="true">
                                        <use href="#fi-vote" />
                                      </svg>
                                      Votação ao vivo
                                    </p>
                                    <span>
                                      <b>Produto</b>
                                      <i />
                                      <em>0</em>
                                    </span>
                                    <span>
                                      <b>Design</b>
                                      <i />
                                      <em>0</em>
                                    </span>
                                    <span>
                                      <b>Operação</b>
                                      <i />
                                      <em>0</em>
                                    </span>
                                  </div>
                                  <div className="fs5-notes fa fa-pop" style={{ "--at": "46.65", "--du": ".55" } as CSSProperties}>
                                    <p>
                                      <svg aria-hidden="true">
                                        <use href="#fi-note" />
                                      </svg>
                                      Post-its da plateia
                                    </p>
                                    <span>Escreva aqui</span>
                                    <span>Escreva aqui</span>
                                    <span>Escreva aqui</span>
                                    <span>Escreva aqui</span>
                                  </div>
                                  <div className="sl-foot">
                                    <b>
                                      <svg aria-hidden="true">
                                        <use href="#hl-mark-paper" />
                                      </svg>
                                      halor
                                    </b>
                                    <span>05</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* camadas por cima do slide */}
                            <span className="fe-sel fe-sel1" data-on="17.45 21.9">
                              <i />
                              <i />
                              <i />
                              <i />
                              <em>Título · 54 pt</em>
                            </span>
                            {' '}
                            <span className="fe-sel fe-sel3" data-on="35.3 42.95">
                              <i />
                              <i />
                              <i />
                              <i />
                              <em>Gráfico de colunas</em>
                            </span>
                            <div className="fe-ray fd" data-on="49.95 53.85" style={{ "--xt": "53.45", "--xdu": ".4" } as CSSProperties}>
                              <span className="fe-heat fe-h1 fa fa-fade" style={{ "--at": "50", "--du": ".8" } as CSSProperties} />
                              {' '}
                              <span className="fe-heat fe-h2 fa fa-fade" style={{ "--at": "50.2", "--du": ".8" } as CSSProperties} />
                              {' '}
                              <span className="fe-heat fe-h3 fa fa-fade" style={{ "--at": "50.4", "--du": ".8" } as CSSProperties} />
                              {' '}
                              <b className="fa fa-pop" style={{ "--at": "50.7", "--du": ".45", left: "30%", top: "42%" } as CSSProperties}>1</b>
                              {' '}
                              <b className="fa fa-pop" style={{ "--at": "51.1", "--du": ".45", left: "80%", top: "24%" } as CSSProperties}>2</b>
                              {' '}
                              <b className="fa fa-pop" style={{ "--at": "51.5", "--du": ".45", left: "22%", top: "69%" } as CSSProperties}>3</b>
                              {' '}
                              <em className="fa fa-up" style={{ "--at": "50.3" } as CSSProperties}>Mapa de atenção previsto · primeiros 3 s</em>
                            </div>
                            <span className="fe-toast fe-toast1 fa fd" data-on="40.2 41.65" style={{ "--an": "f-toast", "--at": "40.2", "--du": ".45", "--xt": "41.3", "--xdu": ".35" } as CSSProperties}>
                              <svg aria-hidden="true">
                                <use href="#i-check" />
                              </svg>
                              Brilho aplicado ao gráfico
                            </span>
                          </div>
                          <p className="fe-status">
                            <span data-on="0 29.2|48.85 58.1">Slide 1 de 6</span>
                            <span data-on="58.1 99">Slide 1 de 8</span>
                            <span data-on="29.2 42.95">Slide 3 de 6</span>
                            <span data-on="42.95 48.85">Slide 5 de 6</span>
                            <span className="fe-hint">Duplo clique edita o texto · F1 mostra os atalhos</span>
                            <span>100%</span>
                          </p>
                        </div>
                        <aside className="fe-insp">
                          <div className="fi-tabs">
                            <span className="fi-tab-design" data-hov="" data-on="21.9 36.35">Design</span>
                            {' '}
                            <span>Animação</span>
                            {' '}
                            <span data-on="15.9 21.9|48.05 99">
                              <svg aria-hidden="true">
                                <use href="#i-target" />
                              </svg>
                              Halor
                            </span>
                          </div>
                          {/* painel Halor */}
                          <div className="fi-p" data-on="15.9 21.9|48.05 99">
                            <div className="fi-empty" data-on="0 49.95|53.5 99">
                              <span>
                                <svg aria-hidden="true">
                                  <use href="#i-target" />
                                </svg>
                              </span>
                              {' '}
                              <b>Raio Halor</b>
                              <p>Ligue para prever onde cai o primeiro olhar da plateia.</p>
                            </div>
                            <div className="fi-ray" data-on="49.95 53.5">
                              <div className="fi-score">
                                <span className="fi-ring">
                                  <svg viewBox="0 0 80 80" aria-hidden="true">
                                    <circle cx="40" cy="40" r="33" />
                                    <circle className="fi-val" cx="40" cy="40" r="33" data-n="0 91 50 1.4" data-ring="" />
                                  </svg>
                                  <b data-n="0 91 50 1.4">0</b>
                                </span>
                                <div>
                                  <em>Índice Halor do slide</em>
                                  <p>Muito forte. O olhar acha a mensagem em 0,8 s.</p>
                                </div>
                              </div>
                              <p className="fi-h">Ordem do olhar</p>
                              <ol className="fi-gaze">
                                <li className="fa fa-up" style={{ "--at": "50.7" } as CSSProperties}>
                                  <i>1</i>
                                  Título
                                </li>
                                <li className="fa fa-up" style={{ "--at": "51.1" } as CSSProperties}>
                                  <i>2</i>
                                  Anel de luz
                                </li>
                                <li className="fa fa-up" style={{ "--at": "51.5" } as CSSProperties}>
                                  <i>3</i>
                                  Subtítulo
                                </li>
                              </ol>
                            </div>
                          </div>
                          {/* painel Design: paleta do kit */}
                          <div className="fi-p" data-on="21.9 36.35">
                            <p className="fi-h">Paleta da apresentação</p>
                            <div className="fp-list">
                              <span className="fp-r fp-p1" data-hov="" data-on="21.9 23.7|26.9 99">
                                <span className="fp-sw" style={{ "--a": "#17112b", "--b": "#6421d1", "--c": "#8b3dff", "--d": "#c4a6ff", "--e": "#f3eeff" } as CSSProperties} />
                                <b>Halor</b>
                                <svg aria-hidden="true">
                                  <use href="#i-check" />
                                </svg>
                              </span>
                              {' '}
                              <span className="fp-r fp-p2" data-hov="" data-on="23.7 25.3">
                                <span className="fp-sw" style={{ "--a": "#0c1f33", "--b": "#0f5f8a", "--c": "#1f8fd1", "--d": "#86cdf0", "--e": "#e6f5fc" } as CSSProperties} />
                                <b>Oceano</b>
                                <svg aria-hidden="true">
                                  <use href="#i-check" />
                                </svg>
                              </span>
                              {' '}
                              <span className="fp-r fp-p3" data-hov="" data-on="25.3 26.9">
                                <span className="fp-sw" style={{ "--a": "#2e1310", "--b": "#b5402a", "--c": "#ef6a4c", "--d": "#f7b39f", "--e": "#fdeee9" } as CSSProperties} />
                                <b>Coral</b>
                                <svg aria-hidden="true">
                                  <use href="#i-check" />
                                </svg>
                              </span>
                              {' '}
                              <span className="fp-r fp-p4" data-hov="">
                                <span className="fp-sw" style={{ "--a": "#141414", "--b": "#3d3d45", "--c": "#6b6b78", "--d": "#b9b9c4", "--e": "#f1f1f4" } as CSSProperties} />
                                <b>Grafite</b>
                                <svg aria-hidden="true">
                                  <use href="#i-check" />
                                </svg>
                              </span>
                            </div>
                            <p className="fi-h">Texto</p>
                            <div className="fi-row">
                              <span>Fonte do kit</span>
                              <span>54 pt</span>
                            </div>
                            <div className="fi-seg">
                              <span>Regular</span>
                              <span className="act">Semibold</span>
                              <span>Bold</span>
                            </div>
                            <p className="fi-h">Posição</p>
                            <div className="fi-xy">
                              <span>X 96</span>
                              <span>Y 228</span>
                              <span>L 760</span>
                              <span>A 140</span>
                            </div>
                          </div>
                          {/* Biblioteca: efeitos e componentes */}
                          <div className="flb fa fa-lib fd" style={{ "--at": "36.35", "--du": ".5", "--xt": "48.02", "--xdu": ".32", "--xn": "f-lib-out" } as CSSProperties} data-on="36.3 48.34">
                            <div className="flb-h">
                              <b>Biblioteca</b>
                              <span className="flb-x" data-hov="">
                                <svg aria-hidden="true">
                                  <use href="#i-x" />
                                </svg>
                              </span>
                            </div>
                            <div className="flb-tabs">
                              <span>Modelos</span>
                              <span className="act">Efeitos e animações</span>
                            </div>
                            <p className="flb-n">
                              <b>198</b>
                              {' '}efeitos e componentes
                            </p>
                            <div className="flb-chips">
                              <span data-on="0 42.1">Todos</span>
                              <span>Entrada</span>
                              <span>Contínuo</span>
                              <span className="flb-chip-comp" data-hov="" data-on="42.1 99">Componentes</span>
                            </div>
                            <div className="flb-gs">
                              <div className="flb-pane" data-on="0 42.1">
                                <div className="flb-g">
                                  <span className="flb-c" data-hov="">
                                    <i className="pv-rev">
                                      <b>Aa</b>
                                    </i>
                                    <b>Revelar</b>
                                    <small>Texto que surge por máscara</small>
                                  </span>
                                  {' '}
                                  <span className="flb-c flb-c2" data-hov="" data-on="37.9 99">
                                    <i className="pv-glow">
                                      <b>Aa</b>
                                    </i>
                                    <b>Brilho</b>
                                    <small>Luz que corre e destaca</small>
                                  </span>
                                  {' '}
                                  <span className="flb-c" data-hov="">
                                    <i className="pv-up">
                                      <b>Aa</b>
                                    </i>
                                    <b>Subir</b>
                                    <small>Entrada suave de baixo</small>
                                  </span>
                                  {' '}
                                  <span className="flb-c" data-hov="">
                                    <i className="pv-halo">
                                      <b>Aa</b>
                                    </i>
                                    <b>Halo</b>
                                    <small>Anel de luz em volta</small>
                                  </span>
                                </div>
                                <span className="flb-use" data-hov="" data-on="37.95 42.1">
                                  <svg aria-hidden="true">
                                    <use href="#i-check" />
                                  </svg>
                                  <span data-on="0 40.1">Usar este efeito</span>
                                  <span data-on="40.1 99">Efeito aplicado</span>
                                </span>
                              </div>
                              <div className="flb-pane flb-g flb-g2" data-on="42.1 99">
                                <span className="flb-k flc-vote" data-hov="">
                                  <i>
                                    <svg aria-hidden="true">
                                      <use href="#fi-vote" />
                                    </svg>
                                  </i>
                                  <b>Votação</b>
                                  <small>A plateia vota pelo celular</small>
                                </span>
                                {' '}
                                <span className="flb-k flc-notes" data-hov="">
                                  <i>
                                    <svg aria-hidden="true">
                                      <use href="#fi-note" />
                                    </svg>
                                  </i>
                                  <b>Post-its</b>
                                  <small>Ideias da plateia ao vivo</small>
                                </span>
                                {' '}
                                <span className="flb-k" data-hov="">
                                  <i>
                                    <svg aria-hidden="true">
                                      <use href="#fi-timer" />
                                    </svg>
                                  </i>
                                  <b>Cronômetro</b>
                                  <small>Tempo para a dinâmica</small>
                                </span>
                                {' '}
                                <span className="flb-k" data-hov="">
                                  <i>
                                    <svg aria-hidden="true">
                                      <use href="#fi-quiz" />
                                    </svg>
                                  </i>
                                  <b>Quiz</b>
                                  <small>Perguntas com placar</small>
                                </span>
                                {' '}
                                <span className="flb-k" data-hov="">
                                  <i>
                                    <svg aria-hidden="true">
                                      <use href="#fi-cloud" />
                                    </svg>
                                  </i>
                                  <b>Nuvem de palavras</b>
                                  <small>O que a sala pensa</small>
                                </span>
                                {' '}
                                <span className="flb-k" data-hov="">
                                  <i>
                                    <svg aria-hidden="true">
                                      <use href="#fi-form" />
                                    </svg>
                                  </i>
                                  <b>Formulário</b>
                                  <small>Perguntas rápidas</small>
                                </span>
                              </div>
                            </div>
                          </div>
                        </aside>
                      </div>
                      {/* menu Gráficos */}
                      <div className="fdd fa fa-dd" style={{ "--at": "30.35", "--du": ".25" } as CSSProperties} data-on="30.3 31.35">
                        <p>Gráficos</p>
                        <span className="fdd-col" data-hov="">
                          <svg aria-hidden="true">
                            <use href="#i-bars" />
                          </svg>
                          Colunas
                        </span>
                        {' '}
                        <span data-hov="">
                          <svg aria-hidden="true">
                            <use href="#i-chart" />
                          </svg>
                          Linha
                        </span>
                        {' '}
                        <span data-hov="">
                          <svg aria-hidden="true">
                            <use href="#i-target" />
                          </svg>
                          Rosca
                        </span>
                        {' '}
                        <span data-hov="">
                          <svg aria-hidden="true">
                            <use href="#i-table" />
                          </svg>
                          Tabela
                        </span>
                      </div>
                      {/* Passo 9 · arrastar e importar */}
                      <div className="fdrop fa fa-fade fd" style={{ "--at": "54.7", "--du": ".25", "--xt": "55.42", "--xdu": ".25" } as CSSProperties} data-on="54.7 55.67">
                        <span>
                          <svg aria-hidden="true">
                            <use href="#i-upload" />
                          </svg>
                          Solte para importar
                          <small>.pptx e .pdf viram slides editáveis</small>
                        </span>
                      </div>
                      <div className="fmod-dim fa fa-fade fd" style={{ "--at": "55.45", "--du": ".3", "--xt": "57.95", "--xdu": ".3" } as CSSProperties} data-on="55.45 58.25" />
                      <div className="fim fa fa-pop fd" style={{ "--at": "55.45", "--du": ".45", "--s0": ".94", "--xt": "57.95", "--xdu": ".28", "--xn": "f-pop-out" } as CSSProperties} data-on="55.45 58.23">
                        <div className="fim-h">
                          <b>Importar arquivos</b>
                          <svg aria-hidden="true">
                            <use href="#i-x" />
                          </svg>
                        </div>
                        <div className="fim-r">
                          <span className="fim-ic fim-pp">PPTX</span>
                          <div>
                            <b>planejamento-q4.pptx</b>
                            <span className="fim-bar">
                              <i className="fa fa-w" style={{ "--at": "55.7", "--du": "1.6", "--w0": "0%", "--w1": "100%" } as CSSProperties} />
                            </span>
                          </div>
                          <em data-on="0 57.3">Convertendo</em>
                          <em className="ok" data-on="57.3 99">
                            <svg aria-hidden="true">
                              <use href="#i-check" />
                            </svg>
                            14 slides
                          </em>
                        </div>
                        <div className="fim-r">
                          <span className="fim-ic fim-pd">PDF</span>
                          <div>
                            <b>pesquisa-do-piloto.pdf</b>
                            <span className="fim-bar">
                              <i className="fa fa-w" style={{ "--at": "55.9", "--du": "1.7", "--w0": "0%", "--w1": "100%" } as CSSProperties} />
                            </span>
                          </div>
                          <em data-on="0 57.6">Convertendo</em>
                          <em className="ok" data-on="57.6 99">
                            <svg aria-hidden="true">
                              <use href="#i-check" />
                            </svg>
                            8 páginas
                          </em>
                        </div>
                        <p className="fim-f">Os slides entram no fim do trilho, já editáveis.</p>
                      </div>
                      {/* Passo 11 · Salvar como */}
                      <div className="fmod-dim fa fa-fade fd" style={{ "--at": "68.95", "--du": ".3", "--xt": "71.45", "--xdu": ".3" } as CSSProperties} data-on="68.95 71.75" />
                      <div className="fsv fa fa-pop fd" style={{ "--at": "68.95", "--du": ".45", "--s0": ".94", "--xt": "71.45", "--xdu": ".28", "--xn": "f-pop-out" } as CSSProperties} data-on="68.95 71.73">
                        <div className="fsv-h">
                          <div>
                            <b>Salvar como</b>
                            <p>Gera um arquivo novo. O original fica intacto.</p>
                          </div>
                          <svg aria-hidden="true">
                            <use href="#i-x" />
                          </svg>
                        </div>
                        <span className="fsv-o fsv-o1 act" data-hov="">
                          <i>HTML</i>
                          <span>
                            <b>HTML interativo</b>
                            <small>Com efeitos, votação e post-its</small>
                          </span>
                          <em>Recomendado</em>
                        </span>
                        {' '}
                        <span className="fsv-o fsv-o2" data-hov="">
                          <i>PDF</i>
                          <span>
                            <b>PDF</b>
                            <small>Imagem em alta resolução</small>
                          </span>
                        </span>
                        {' '}
                        <span className="fsv-o fsv-o3" data-hov="">
                          <i>PPTX</i>
                          <span>
                            <b>PowerPoint editável</b>
                            <small>Textos e formas editáveis</small>
                          </span>
                        </span>
                        {' '}
                        <span className="fsv-o fsv-o4" data-hov="">
                          <i>PPTX</i>
                          <span>
                            <b>PowerPoint idêntico</b>
                            <small>Cada slide fiel ao original</small>
                          </span>
                        </span>
                        {' '}
                        <span className="fsv-o fsv-o5" data-hov="">
                          <i>
                            <svg aria-hidden="true">
                              <use href="#i-link" />
                            </svg>
                          </i>
                          <span>
                            <b>Link Halor</b>
                            <small>Abre no navegador e mostra a atenção</small>
                          </span>
                        </span>
                        <div className="fsv-f">
                          <span className="fsv-fn">
                            kickoff-2027
                            <b>.html</b>
                          </span>
                          <span className="fsv-dl" data-hov="">
                            <svg aria-hidden="true">
                              <use href="#i-download" />
                            </svg>
                            Baixar
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Passo 10 · Apresentar (modo palco) */}
                    <div className="sc fpl" data-from="60.05" data-to="67.72" data-o="0" data-fi=".5" data-fo=".5" data-fz=".02">
                      <div className="fpl-stage fd" style={{ "--xt": "67.6", "--xdu": ".26", "--xez": "cubic-bezier(.25,.5,.45,1)" } as CSSProperties}>
                        <div className="fpl-s" data-on="0 62.9">
                          <div className="slide sl-cover f-bd" />
                          <div className="slide sl-cover fd f-swap" style={{ "--xt": "62.3", "--xdu": ".15", "--xez": "cubic-bezier(.37,0,.63,1)" } as CSSProperties}>
                            <span className="sl-ring fa fa-fade" style={{ "--at": "60.4", "--du": "1" } as CSSProperties} />
                            <span className="sl-ring sl-ring2" />
                            <p className="sl-k fa fa-up" style={{ "--at": "60.5" } as CSSProperties}>Kickoff · 2027</p>
                            <p className="sl-h">
                              <span className="fa fa-mask" style={{ "--at": "60.7", "--du": ".7" } as CSSProperties}>Plano 2027 em 12 semanas.</span>
                            </p>
                            <p className="sl-sub fa fa-up" style={{ "--at": "61.2" } as CSSProperties}>Time de produto · 4 de novembro</p>
                            <div className="sl-foot">
                              <b>
                                <svg aria-hidden="true">
                                  <use href="#hl-mark" />
                                </svg>
                                halor
                              </b>
                              <span>01</span>
                            </div>
                          </div>
                        </div>
                        <div className="fpl-s fa fa-fade" style={{ "--at": "62.45", "--du": ".45" } as CSSProperties} data-on="62.35 99">
                          <div className="slide sl-light fs5">
                            <p className="sl-k">Sua vez</p>
                            <p className="sl-h">Qual frente começa primeiro?</p>
                            <div className="fs5-poll">
                              <p>
                                <svg aria-hidden="true">
                                  <use href="#fi-vote" />
                                </svg>
                                Votação ao vivo ·{' '}
                                <b data-n="0 38 62.7 2.5" data-ez="lin">0</b>
                                {' '}votos
                              </p>
                              <span>
                                <b>Produto</b>
                                <i>
                                  <u className="fa fa-w" style={{ "--at": "62.7", "--du": "2.5", "--w0": "0%", "--w1": "100%", "--ez": "linear" } as CSSProperties} />
                                </i>
                                <em data-n="0 17 62.7 2.5" data-ez="lin">0</em>
                              </span>
                              {' '}
                              <span>
                                <b>Design</b>
                                <i>
                                  <u className="fa fa-w" style={{ "--at": "62.7", "--du": "2.5", "--w0": "0%", "--w1": "76%", "--ez": "linear" } as CSSProperties} />
                                </i>
                                <em data-n="0 13 62.7 2.5" data-ez="lin">0</em>
                              </span>
                              {' '}
                              <span>
                                <b>Operação</b>
                                <i>
                                  <u className="fa fa-w" style={{ "--at": "62.7", "--du": "2.5", "--w0": "0%", "--w1": "47%", "--ez": "linear" } as CSSProperties} />
                                </i>
                                <em data-n="0 8 62.7 2.5" data-ez="lin">0</em>
                              </span>
                            </div>
                            <div className="fs5-notes fs5-live">
                              <p>
                                <svg aria-hidden="true">
                                  <use href="#fi-note" />
                                </svg>
                                Post-its da plateia
                              </p>
                              <span className="fa fa-note" style={{ "--at": "64.6", "--r": "-3deg" } as CSSProperties}>integração</span>
                              <span className="fa fa-note" style={{ "--at": "64.95", "--r": "2deg" } as CSSProperties}>prazos</span>
                              <span className="fa fa-note" style={{ "--at": "65.3", "--r": "-1deg" } as CSSProperties}>dados do piloto</span>
                              <span className="fa fa-note" style={{ "--at": "65.65", "--r": "3deg" } as CSSProperties}>agenda</span>
                              <span className="fa fa-note" style={{ "--at": "66", "--r": "-2deg" } as CSSProperties}>metas claras</span>
                              <span className="fa fa-note" style={{ "--at": "66.35", "--r": "1deg" } as CSSProperties}>acessos</span>
                            </div>
                            <div className="sl-foot">
                              <b>
                                <svg aria-hidden="true">
                                  <use href="#hl-mark-paper" />
                                </svg>
                                halor
                              </b>
                              <span>05</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="fpl-bar fd" style={{ "--xt": "67.6", "--xdu": ".26", "--xez": "cubic-bezier(.25,.5,.45,1)" } as CSSProperties}>
                        <span className="fpl-logo">
                          <svg aria-hidden="true">
                            <use href="#hl-mark" />
                          </svg>
                          halor
                        </span>
                        {' '}
                        <span className="fpl-t">Kickoff de projeto 2027</span>
                        {' '}
                        <span className="fpl-b">Anterior</span>
                        {' '}
                        <span className="fpl-n">
                          <span data-on="0 62.35">01</span>
                          <span data-on="62.35 99">05</span>
                          {' '}/ 08
                        </span>
                        {' '}
                        <span className="fpl-b fpl-next" data-hov="">
                          Próximo
                          <svg aria-hidden="true">
                            <use href="#i-arrow" />
                          </svg>
                        </span>
                        {' '}
                        <span className="fpl-code">
                          halor.app/ao-vivo ·{' '}
                          <b>4721</b>
                        </span>
                        {' '}
                        <span className="fpl-live">
                          <i />
                          <b data-n="0 38 62.4 1.6">0</b>
                          {' '}na plateia
                        </span>
                        {' '}
                        <span className="fpl-b fpl-exit" data-hov="">
                          <svg aria-hidden="true">
                            <use href="#i-x" />
                          </svg>
                          Sair
                        </span>
                      </div>
                    </div>
                    {/* Passo 12 · o arquivo baixado roda numa aba nova */}
                    <div className="sc fwb" data-from="74.9" data-to="84.9" data-o="0" data-fi=".45" data-fo="0">
                      <div className="fwb-stage">
                        <div className="fwb-s" data-on="0 78.6">
                          <div className="slide sl-cover f-bd" />
                          <div className="slide sl-cover fd f-swap" style={{ "--xt": "78", "--xdu": ".15", "--xez": "cubic-bezier(.37,0,.63,1)" } as CSSProperties}>
                            <span className="sl-ring fa fa-fade" style={{ "--at": "75.2", "--du": "1" } as CSSProperties} />
                            <span className="sl-ring sl-ring2" />
                            <p className="sl-k fa fa-up" style={{ "--at": "75.3" } as CSSProperties}>Kickoff · 2027</p>
                            <p className="sl-h">
                              <span className="fa fa-mask" style={{ "--at": "75.5", "--du": ".7" } as CSSProperties}>Plano 2027 em 12 semanas.</span>
                            </p>
                            <p className="sl-sub fa fa-up" style={{ "--at": "76" } as CSSProperties}>Time de produto · 4 de novembro</p>
                            <div className="sl-foot">
                              <b>
                                <svg aria-hidden="true">
                                  <use href="#hl-mark" />
                                </svg>
                                halor
                              </b>
                              <span>01</span>
                            </div>
                          </div>
                        </div>
                        <div className="fwb-s fa fa-fade" style={{ "--at": "78.15", "--du": ".45" } as CSSProperties} data-on="78.05 80.9">
                          <div className="slide sl-light f-bd" />
                          <div className="slide sl-light fs3 fd f-swap" style={{ "--xt": "80.3", "--xdu": ".15", "--xez": "cubic-bezier(.37,0,.63,1)" } as CSSProperties}>
                            <p className="sl-k">Meta</p>
                            <p className="sl-h">Do kickoff à entrega.</p>
                            <div className="fs3-chart act">
                              <i className="fa fa-bar" style={{ "--at": "78.2", "--h": "30%" } as CSSProperties}>
                                <em>S4</em>
                              </i>
                              <i className="fa fa-bar" style={{ "--at": "78.35", "--h": "52%" } as CSSProperties}>
                                <em>S8</em>
                              </i>
                              <i className="fa fa-bar" style={{ "--at": "78.5", "--h": "74%" } as CSSProperties}>
                                <em>S10</em>
                              </i>
                              <i className="fs3-hi fa fa-bar" style={{ "--at": "78.65", "--h": "96%" } as CSSProperties}>
                                <em>S12</em>
                              </i>
                              {' '}
                              <span className="fs3-sh">
                                <span className="fa fa-shine" style={{ "--at": "78.9", "--du": "1.3" } as CSSProperties} />
                              </span>
                            </div>
                            <span className="fs3-icon">
                              <svg aria-hidden="true">
                                <use href="#i-target" />
                              </svg>
                            </span>
                            <div className="fs3-cards">
                              <span className="fa fa-drop" style={{ "--at": "78.6" } as CSSProperties}>
                                <b>S4</b>
                                Desenho pronto
                              </span>
                              <span className="fa fa-drop" style={{ "--at": "78.75" } as CSSProperties}>
                                <b>S8</b>
                                Piloto no ar
                              </span>
                              <span className="fa fa-drop" style={{ "--at": "78.9" } as CSSProperties}>
                                <b>S12</b>
                                Entrega final
                              </span>
                            </div>
                            <div className="sl-foot">
                              <b>
                                <svg aria-hidden="true">
                                  <use href="#hl-mark-paper" />
                                </svg>
                                halor
                              </b>
                              <span>03</span>
                            </div>
                          </div>
                        </div>
                        <div className="fwb-s fa fa-fade" style={{ "--at": "80.45", "--du": ".45" } as CSSProperties} data-on="80.35 99">
                          <div className="slide sl-light fs5">
                            <p className="sl-k">Sua vez</p>
                            <p className="sl-h">Qual frente começa primeiro?</p>
                            <div className="fs5-poll fwb-poll">
                              <p>
                                <svg aria-hidden="true">
                                  <use href="#fi-vote" />
                                </svg>
                                Votação · toque para votar
                              </p>
                              <span>
                                <b>Produto</b>
                                <i>
                                  <u style={{ width: "100%" } as CSSProperties} />
                                </i>
                                <em>17</em>
                              </span>
                              {' '}
                              <span className="fwb-opt2" data-hov="" data-on="82.15 99">
                                <b>Design</b>
                                <i>
                                  <u className="fa fa-w" style={{ "--at": "82.2", "--du": ".5", "--w0": "76%", "--w1": "82%" } as CSSProperties} />
                                </i>
                                <em data-n="13 14 82.2 .3">13</em>
                              </span>
                              {' '}
                              <span>
                                <b>Operação</b>
                                <i>
                                  <u style={{ width: "47%" } as CSSProperties} />
                                </i>
                                <em>8</em>
                              </span>
                            </div>
                            <div className="fs5-notes fs5-live">
                              <p>
                                <svg aria-hidden="true">
                                  <use href="#fi-note" />
                                </svg>
                                Post-its da plateia
                              </p>
                              <span style={{ "--r": "-3deg" } as CSSProperties}>integração</span>
                              <span style={{ "--r": "2deg" } as CSSProperties}>prazos</span>
                              <span style={{ "--r": "-1deg" } as CSSProperties}>dados do piloto</span>
                              <span style={{ "--r": "3deg" } as CSSProperties}>agenda</span>
                              <span style={{ "--r": "-2deg" } as CSSProperties}>metas claras</span>
                              <span style={{ "--r": "1deg" } as CSSProperties}>acessos</span>
                            </div>
                            <span className="fwb-ok fa fa-up" style={{ "--at": "82.3" } as CSSProperties}>
                              <svg aria-hidden="true">
                                <use href="#i-check" />
                              </svg>
                              Seu voto entrou
                            </span>
                            <div className="sl-foot">
                              <b>
                                <svg aria-hidden="true">
                                  <use href="#hl-mark-paper" />
                                </svg>
                                halor
                              </b>
                              <span>05</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="fwb-nav">
                        <svg aria-hidden="true">
                          <use href="#i-back" />
                        </svg>
                        <span>
                          <span data-on="0 78.05">01</span>
                          <span data-on="78.05 80.35">03</span>
                          <span data-on="80.35 99">05</span>
                          {' '}/ 08
                        </span>
                        <span className="fwb-next" data-hov="">
                          <svg aria-hidden="true">
                            <use href="#i-arrow" />
                          </svg>
                        </span>
                        <svg aria-hidden="true">
                          <use href="#i-expand" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* barra de download do navegador */}
                  <div className="fdl fa fa-shelf fd" style={{ "--at": "71.55", "--du": ".45", "--xt": "74.75", "--xdu": ".4", "--xn": "f-shelf-out" } as CSSProperties} data-on="71.5 75.15">
                    <span className="fdl-item" data-hov="">
                      <span className="fdl-ic">HTML</span>
                      {' '}
                      <span className="fdl-tx">
                        <b>kickoff-2027.html</b>
                        <small>
                          <span data-on="0 73">
                            Baixando ·{' '}
                            <span data-n="0 24 71.7 1.25" data-ez="lin" data-dec="1">0</span>
                            {' '}de 2,4 MB
                          </span>
                          <span className="ok" data-on="73 99">
                            <svg aria-hidden="true">
                              <use href="#i-check" />
                            </svg>
                            2,4 MB · concluído
                          </span>
                        </small>
                        <span className="fdl-bar">
                          <i className="fa fa-w" style={{ "--at": "71.7", "--du": "1.25", "--w0": "0%", "--w1": "100%", "--ez": "linear" } as CSSProperties} />
                        </span>
                      </span>
                    </span>
                    {' '}
                    <span className="fdl-all">Mostrar tudo</span>
                  </div>
                </div>
                {/* arquivos e componentes arrastados */}
                <span className="fw-file fw-file1" data-drag="54.25 55.45">
                  <i>PPTX</i>
                  planejamento-q4.pptx
                </span>
                {' '}
                <span className="fw-file fw-file2" data-drag="54.25 55.45">
                  <i>PDF</i>
                  pesquisa-do-piloto.pdf
                </span>
                {' '}
                <span className="fw-ghost" data-drag="43.85 44.95">
                  <svg aria-hidden="true">
                    <use href="#fi-vote" />
                  </svg>
                  Votação
                </span>
                {' '}
                <span className="fw-ghost" data-drag="45.65 46.65">
                  <svg aria-hidden="true">
                    <use href="#fi-note" />
                  </svg>
                  Post-its
                </span>
                {' '}
                <span className="fw-rip" />
                {' '}
                <span className="fw-cur">
                  <svg aria-hidden="true">
                    <use href="#fi-cursor" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          {/* legenda do passo 12 */}
          <div className="sc f-legsc" data-from="76.9" data-to="80.9" data-fi=".55" data-fo=".5">
            <p className="f-leg">
              <b>Abre em qualquer navegador.</b>
              {' '}
              <span>Sem instalar nada.</span>
            </p>
          </div>
          {/* legendas dos passos: montadas pelo script a partir de STEPS */}
          <div className="f-caps" data-caps="" />
        </div>
        {/* 1:24 · fecho (fica acessível: tem o botão final) */}
        <div className="film-scenes film-end">
          <div className="sc sc-c sc-end" data-from="84" data-to="89" data-fi=".8">
            <span className="f-mk f-mk-end" aria-hidden="true" data-anchor="mark2">
              <svg className="f-mark" viewBox="0 0 64 64">
                <path className="fa fa-draw" style={{ "--at": ".55", "--du": "1", "--len": "146" } as CSSProperties} d="M55.56 21.01A26 26 0 1 1 42.99 8.44" fill="none" stroke="url(#hl-g-ring)" strokeWidth="5.5" strokeLinecap="round" />
                {' '}
                <circle className="fa fa-fade" style={{ "--at": ".9", "--du": ".5" } as CSSProperties} cx="32" cy="32" r="16.5" fill="none" stroke="url(#hl-g-ring)" strokeWidth="1.6" />
                {' '}
                <circle className="f-core fa fa-core" style={{ "--at": ".7", "--du": ".55" } as CSSProperties} cx="32" cy="32" r="8.5" fill="url(#hl-g-core)" />
                {' '}
                <path className="f-spark fa fa-spark" style={{ "--at": "1.15", "--du": ".6" } as CSSProperties} d="M50.4 6.4Q50.4 13.6 57.6 13.6Q50.4 13.6 50.4 20.8Q50.4 13.6 43.2 13.6Q50.4 13.6 50.4 6.4Z" fill="#fff" />
              </svg>
            </span>
            <p className="f-word wordmark fa fa-up" style={{ "--at": ".8" } as CSSProperties}>halor</p>
            <p className="f-tag fa fa-up" style={{ "--at": "1" } as CSSProperties}>
              Faça cada olhar{' '}
              <span className="f-lux" style={{ "--lat": "1.2" } as CSSProperties}>render.</span>
            </p>
            <a className="btn btn-primary f-cta fa fa-pop" style={{ "--at": "1.3", "--du": ".6" } as CSSProperties} href="/assinar">Comece grátis</a>
          </div>
        </div>
        <div className="film-poster">
          <div className="fp-in">
            <p className="eyebrow no-rule">Conheça o Halor · 1 min 28 s</p>
            <p className="fp-title display">
              O Estúdio Halor,
              <br />
              passo a passo
            </p>
            <button className="film-bigplay" type="button" data-film-play="" aria-label="Assistir ao filme Conheça o Halor, 1 minuto e 28 segundos">
              <svg aria-hidden="true">
                <use href="#i-play" />
              </svg>
            </button>
          </div>
        </div>
        <div className="film-bar">
          <button className="btn-icon film-btn" type="button" data-film-toggle="" aria-label="Reproduzir">
            <svg aria-hidden="true">
              <use href="#i-play" />
            </svg>
          </button>
          {' '}
          <span className="film-time mono num">0:00 / 1:28</span>
          <div className="film-track" role="slider" tabIndex={0} aria-label="Posição do filme" aria-valuemin={0} aria-valuemax={88} aria-valuenow={0} aria-valuetext="0 segundos">
            <div className="film-fill" />
          </div>
          <span className="film-chap">Abertura</span>
          {' '}
          <button className="btn-icon film-btn" type="button" data-film-sound="" aria-pressed="false" aria-label="Ativar som">
            <svg aria-hidden="true">
              <use href="#i-mute" />
            </svg>
          </button>
          {' '}
          <button className="btn-icon film-btn" type="button" data-film-replay="" aria-label="Recomeçar o filme">
            <svg aria-hidden="true">
              <use href="#i-replay" />
            </svg>
          </button>
        </div>
      </div>
      <div className="sr-only" id="film-roteiro">
        <p>
          Roteiro do filme, em 1 minuto e 28 segundos: uma gravação de tela do Estúdio Halor, passo a passo.
        </p>
        <ol>
          <li>Abertura: o símbolo Halor acende. Faça cada olhar render.</li>
          <li>
            Abra o Estúdio: a tela Início mostra a saudação, seis atalhos e o acervo. O cursor clica em Modelos.
          </li>
          <li>
            Escolha um modelo: Kickoff de projeto, Aula e treinamento, Relatório executivo, Apresentação institucional, Workshop ou Em branco. O cursor escolhe Kickoff de projeto e usa o modelo.
          </li>
          <li>Edite o texto: duplo clique no título da capa e um título novo é digitado.</li>
          <li>
            Troque a paleta: o slide e o trilho passam por Oceano e Coral e voltam para a paleta Halor.
          </li>
          <li>Insira: um gráfico de colunas se desenha, um ícone e três cards entram no slide.</li>
          <li>
            Dê vida: na Biblioteca, em Efeitos e animações, o efeito Brilho toca no gráfico e é aplicado.
          </li>
          <li>Torne lúdico: votação e post-its são arrastados para o slide.</li>
          <li>
            Raio Halor: o mapa de atenção previsto mostra as manchas de calor e a ordem do olhar, 1, 2 e 3. Índice 91.
          </li>
          <li>
            Importe: um .pptx e um .pdf são arrastados, convertidos numa fila e entram no trilho como slides novos.
          </li>
          <li>Apresente: o modo palco abre, a plateia vota ao vivo e os post-its aparecem.</li>
          <li>
            Baixe em HTML: em Salvar como, HTML interativo, PDF, PowerPoint editável, PowerPoint idêntico ou Link Halor. O arquivo kickoff-2027.html é baixado.
          </li>
          <li>
            Abra em qualquer navegador: o arquivo abre numa aba nova e a apresentação roda ali, com votação. Sem instalar nada.
          </li>
          <li>Fecho: Halor. Faça cada olhar render. Comece grátis.</li>
        </ol>
      </div>
      <FilmEngine />
    </div>
  );
}
