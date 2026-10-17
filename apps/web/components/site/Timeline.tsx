/* Gerado a partir de prototype/src/html/13b-site-timeline.html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo e já nasce no estado da primeira época (2016, parada);
   o play, o trilho, a luz da sala e o painel de tokens são ligados por lib/engines/site/evo.ts. */
import type { CSSProperties } from 'react';

export default function Timeline() {
  return (
    <section className="s-sec theme-night s-tl" id="linha-do-tempo" data-era="0" data-tok="closed" aria-labelledby="tl-h">
      <div className="tl-amb" aria-hidden="true" />
      <div className="wrap">
        <div className="s-head">
          <p className="eyebrow">Linha do tempo</p>
          <h2 className="display" id="tl-h">Dez anos de apresentações, e para onde vamos.</h2>
          <p className="lede">
            Do PDF por e-mail ao slide que gasta tokens para ser gerado. Aperte o play e veja a apresentação ganhar vida, época por época.
          </p>
        </div>
        <div className="ev" id="ev" data-i="0" data-state="idle">
          <div className="ev-bar" data-rv="up">
            <button className="ev-play" id="ev-play" type="button">
              <span className="ev-play-ic" aria-hidden="true">
                <svg className="ev-ring" viewBox="0 0 52 52">
                  <circle className="trk" cx="26" cy="26" r="24" pathLength="1" />
                  <circle className="val" cx="26" cy="26" r="24" pathLength="1" />
                </svg>
                {' '}
                <svg className="ic">
                  <use href="#i-play" />
                </svg>
              </span>
              {' '}
              <span className="ev-play-tx">
                <span className="ev-play-l">Assistir à linha do tempo</span>
                <span className="ev-play-s mono">7 épocas · 45 s</span>
              </span>
            </button>
            <div className="ev-rail">
              <div className="ev-rail-in" role="tablist" aria-label="Épocas das apresentações">
                <span className="ev-line" aria-hidden="true">
                  <i className="ev-line-past" />
                  <i className="ev-line-fut" />
                  <i className="ev-line-fill" />
                  <i className="ev-comet" />
                </span>
                {' '}
                <button className="ev-stop" type="button" role="tab" id="ev-tab-0" aria-controls="ev-panel" aria-selected="true" tabIndex={0}>
                  <i className="ev-dot" aria-hidden="true" />
                  <span className="ev-yr mono">2016</span>
                  <b>Slides estáticos</b>
                </button>
                {' '}
                <button className="ev-stop" type="button" role="tab" id="ev-tab-1" aria-controls="ev-panel" aria-selected="false" tabIndex={-1}>
                  <i className="ev-dot" aria-hidden="true" />
                  <span className="ev-yr mono">2018</span>
                  <b>Na nuvem</b>
                </button>
                {' '}
                <button className="ev-stop" type="button" role="tab" id="ev-tab-2" aria-controls="ev-panel" aria-selected="false" tabIndex={-1}>
                  <i className="ev-dot" aria-hidden="true" />
                  <span className="ev-yr mono">2020</span>
                  <b>Tela compartilhada</b>
                </button>
                {' '}
                <button className="ev-stop" type="button" role="tab" id="ev-tab-3" aria-controls="ev-panel" aria-selected="false" tabIndex={-1}>
                  <i className="ev-dot" aria-hidden="true" />
                  <span className="ev-yr mono">2022</span>
                  <b>Modelos prontos</b>
                </button>
                {' '}
                <button className="ev-stop is-ai" type="button" role="tab" id="ev-tab-4" aria-controls="ev-panel" aria-selected="false" tabIndex={-1}>
                  <i className="ev-dot" aria-hidden="true" />
                  <span className="ev-yr mono">2024</span>
                  <b>Gerado por IA</b>
                </button>
                {' '}
                <button className="ev-stop is-now" type="button" role="tab" id="ev-tab-5" aria-controls="ev-panel" aria-selected="false" tabIndex={-1}>
                  <i className="ev-dot" aria-hidden="true">
                    <s />
                    <s />
                    <s />
                    <s />
                    <s />
                    <s />
                  </i>
                  <span className="ev-yr mono">
                    2026{' '}
                    <em>hoje</em>
                  </span>
                  <b>HTML vivo e lúdico</b>
                </button>
                {' '}
                <button className="ev-stop is-next" type="button" role="tab" id="ev-tab-6" aria-controls="ev-panel" aria-selected="false" tabIndex={-1}>
                  <i className="ev-dot" aria-hidden="true" />
                  <span className="ev-yr mono">Próximos</span>
                  <b>Apresentação que conversa</b>
                </button>
              </div>
            </div>
            <div className="ev-arrows">
              <button className="ev-arrow" id="ev-prev" type="button" aria-label="Época anterior">
                <svg aria-hidden="true">
                  <use href="#i-back" />
                </svg>
              </button>
              {' '}
              <button className="ev-arrow" id="ev-next" type="button" aria-label="Próxima época">
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </button>
            </div>
          </div>
          {/* legenda da época acima do palco (celular) e controle fixo enquanto toca */}
          <div className="ev-dock" id="ev-dock">
            <div className="ev-dock-in">
              <button className="ev-dock-play" id="ev-dock-play" type="button" aria-label="Pausar a linha do tempo">
                <svg className="ic" aria-hidden="true">
                  <use href="#i-pause" />
                </svg>
              </button>
              <p className="ev-dock-tx" aria-hidden="true">
                <span className="ev-dock-n mono" id="ev-dock-n">01 / 07</span>
                <b id="ev-dock-y">2016</b>
                <span className="ev-dock-t" id="ev-dock-t">Slides estáticos</span>
              </p>
              <i className="ev-dock-prog" aria-hidden="true">
                <i />
              </i>
            </div>
          </div>
          <div className="ev-panel" id="ev-panel" role="tabpanel" aria-labelledby="ev-tab-0" tabIndex={0}>
            <div className="ev-main">
              <div className="ev-info" data-rv="up" style={{ "--rv-i": "1" } as CSSProperties}>
                <p className="ev-k mono">
                  <b id="ev-n">01</b>
                  <span>/ 07</span>
                  <i />
                  <span id="ev-era">Antes do Halor</span>
                </p>
                <p className="ev-y display">
                  <span id="ev-y">2016</span>
                </p>
                <h3 className="ev-t" id="ev-t">Slides estáticos</h3>
                <p className="ev-d" id="ev-d">Tópicos em sequência e um PDF por e-mail. Quem recebe lê sozinho, se ler.</p>
                <dl className="ev-meta">
                  <div className="ev-who">
                    <dt className="mono">Quem assiste</dt>
                    <dd id="ev-who">Lê sozinho</dd>
                  </div>
                  <div className="ev-att">
                    <dt className="mono">Atenção da plateia</dt>
                    <dd>
                      <b id="ev-att">16</b>
                      <small>%</small>
                      <i className="ev-meter">
                        <i />
                      </i>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="ev-screen" data-rv="scale" style={{ "--rv-i": "2" } as CSSProperties}>
                <span className="ev-dust" aria-hidden="true">
                  <i style={{ "--x": "2", "--y": "22", "--d": "0", "--s": "3px" } as CSSProperties} />
                  <i style={{ "--x": "4", "--y": "62", "--d": "2.1", "--s": "2px" } as CSSProperties} />
                  <i style={{ "--x": "1", "--y": "86", "--d": "4.4", "--s": "3px", "--o": ".5" } as CSSProperties} />
                  <i style={{ "--x": "97", "--y": "28", "--d": "1.2", "--s": "2px" } as CSSProperties} />
                  <i style={{ "--x": "98", "--y": "60", "--d": "5.3", "--s": "3px" } as CSSProperties} />
                  <i style={{ "--x": "95", "--y": "84", "--d": "3.1", "--s": "2px", "--o": ".6" } as CSSProperties} />
                  <i style={{ "--x": "12", "--y": "4", "--d": ".6", "--s": "3px" } as CSSProperties} />
                  <i style={{ "--x": "31", "--y": "6", "--d": "6.2", "--s": "2px", "--o": ".5" } as CSSProperties} />
                  <i style={{ "--x": "52", "--y": "3", "--d": "2.7", "--s": "3px" } as CSSProperties} />
                  <i style={{ "--x": "73", "--y": "5", "--d": "4.9", "--s": "2px" } as CSSProperties} />
                  <i style={{ "--x": "89", "--y": "8", "--d": "1.7", "--s": "3px", "--o": ".5" } as CSSProperties} />
                  <i style={{ "--x": "16", "--y": "95", "--d": "3.8", "--s": "2px" } as CSSProperties} />
                  <i style={{ "--x": "42", "--y": "97", "--d": "5.8", "--s": "3px", "--o": ".6" } as CSSProperties} />
                  <i style={{ "--x": "66", "--y": "94", "--d": "7.1", "--s": "2px" } as CSSProperties} />
                  <i style={{ "--x": "86", "--y": "96", "--d": ".9", "--s": "3px" } as CSSProperties} />
                  <i style={{ "--x": "60", "--y": "2", "--d": "6.6", "--s": "2px", "--o": ".4" } as CSSProperties} />
                </span>
                <div className="ev-stage" id="ev-stage">
                  {/* 2016 · slides estáticos */}
                  <div className="ev-scene ev-s0 on" aria-hidden="true">
                    <div className="e0-app">
                      <div className="e0-bar">
                        <i />
                        <i />
                        <i />
                        <span>apresentacao_final_v3.ppt</span>
                      </div>
                      <div className="e0-body">
                        <div className="e0-rail">
                          <i />
                          <i className="on" />
                          <i />
                          <i />
                        </div>
                        <div className="e0-slide">
                          <p className="e0-t">Resultados do 3º trimestre</p>
                          <ul>
                            <li>Receita cresceu em relação ao trimestre anterior</li>
                            <li>Custos operacionais dentro do previsto</li>
                            <li>Três novos clientes no período</li>
                            <li>Próximos passos para o 4º trimestre</li>
                          </ul>
                          <span className="e0-n">7 / 48</span>
                        </div>
                      </div>
                      <div className="e0-notes">Clique para adicionar anotações</div>
                    </div>
                    <div className="e0-mail">
                      <svg aria-hidden="true">
                        <use href="#i-file" />
                      </svg>
                      <span>
                        <b>Segue a apresentação em anexo</b>
                        <em>apresentacao_final_v3.pdf · 14 MB</em>
                      </span>
                    </div>
                  </div>
                  {/* 2018 · na nuvem */}
                  <div className="ev-scene ev-s1" aria-hidden="true">
                    <div className="e1-app">
                      <div className="e1-top">
                        <span className="e1-doc">Resultados T3</span>
                        <span className="e1-av">
                          <i style={{ "--h": "205" } as CSSProperties}>A</i>
                          <i style={{ "--h": "150" } as CSSProperties}>R</i>
                          <i style={{ "--h": "28" } as CSSProperties}>L</i>
                        </span>
                        <span className="e1-share">Compartilhar</span>
                      </div>
                      <div className="e1-slide">
                        <p className="e1-t">Resultados do trimestre</p>
                        <div className="e1-cols">
                          <div className="e1-chart">
                            <i style={{ "--v": ".45" } as CSSProperties} />
                            <i style={{ "--v": ".6" } as CSSProperties} />
                            <i style={{ "--v": ".78" } as CSSProperties} />
                          </div>
                          <ul>
                            <li />
                            <li />
                            <li />
                          </ul>
                        </div>
                        <span className="e1-cur e1-cur-a" style={{ "--h": "205" } as CSSProperties}>
                          <svg viewBox="0 0 12 16" aria-hidden="true">
                            <path d="M1 1l10 9.2-4.6.4 2.6 5.2-2 .9-2.6-5.3L1 14.6z" />
                          </svg>
                          <em>Ana</em>
                        </span>
                        {' '}
                        <span className="e1-cur e1-cur-b" style={{ "--h": "150" } as CSSProperties}>
                          <svg viewBox="0 0 12 16" aria-hidden="true">
                            <path d="M1 1l10 9.2-4.6.4 2.6 5.2-2 .9-2.6-5.3L1 14.6z" />
                          </svg>
                          <em>Rui</em>
                        </span>
                        {' '}
                        <span className="e1-com">
                          <b>Lia</b>
                          {' '}Pode trocar o gráfico?
                        </span>
                      </div>
                      <span className="e1-link">Link copiado</span>
                    </div>
                  </div>
                  {/* 2020 · tela compartilhada */}
                  <div className="ev-scene ev-s2" aria-hidden="true">
                    <div className="e2-call">
                      <div className="e2-tabs">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <b>10 abas abertas</b>
                      </div>
                      <div className="e2-main">
                        <span className="e2-rec">Você está apresentando</span>
                        <div className="e2-slide">
                          <p>Resultados do trimestre</p>
                          <ul>
                            <li />
                            <li />
                            <li />
                          </ul>
                        </div>
                      </div>
                      <div className="e2-side">
                        <i style={{ "--h": "205" } as CSSProperties} data-n="A" />
                        <i style={{ "--h": "150" } as CSSProperties} data-n="R" />
                        <i style={{ "--h": "28" } as CSSProperties} data-n="L" />
                        <i style={{ "--h": "300" } as CSSProperties} data-n="M" />
                      </div>
                      <div className="e2-dock">
                        <i />
                        <i />
                        <i className="r" />
                        <i />
                      </div>
                    </div>
                    <div className="e2-notif">
                      <p style={{ "--k": "0" } as CSSProperties}>
                        <b>Nova mensagem</b>
                        Viu o e-mail de ontem?
                      </p>
                      <p style={{ "--k": "1" } as CSSProperties}>
                        <b>Calendário</b>
                        Outra reunião em 5 min
                      </p>
                      <p style={{ "--k": "2" } as CSSProperties}>
                        <b>Chat do time</b>
                        3 novas menções
                      </p>
                    </div>
                  </div>
                  {/* 2022 · modelos prontos */}
                  <div className="ev-scene ev-s3" aria-hidden="true">
                    <div className="e3-row">
                      <figure style={{ "--k": "0" } as CSSProperties}>
                        <div className="e3-sl">
                          <i className="e3-band" />
                          <p>Nossa estratégia</p>
                          <i className="e3-l" />
                          <i className="e3-l s" />
                          <i className="e3-img" />
                        </div>
                        <figcaption>Empresa A</figcaption>
                      </figure>
                      <figure style={{ "--k": "1" } as CSSProperties}>
                        <div className="e3-sl">
                          <i className="e3-band" />
                          <p>Nossa estratégia</p>
                          <i className="e3-l" />
                          <i className="e3-l s" />
                          <i className="e3-img" />
                        </div>
                        <figcaption>Empresa B</figcaption>
                      </figure>
                      <figure style={{ "--k": "2" } as CSSProperties}>
                        <div className="e3-sl">
                          <i className="e3-band" />
                          <p>Nossa estratégia</p>
                          <i className="e3-l" />
                          <i className="e3-l s" />
                          <i className="e3-img" />
                        </div>
                        <figcaption>Empresa C</figcaption>
                      </figure>
                    </div>
                    <span className="e3-stamp">Modelo 12 · usado 2,4 mil vezes</span>
                  </div>
                  {/* 2024 · gerado por IA: cada tentativa gasta tokens */}
                  <div className="ev-scene ev-s4" aria-hidden="true" data-try="0">
                    <div className="e4-prompt">
                      <svg aria-hidden="true">
                        <use href="#i-wand" />
                      </svg>
                      <span className="e4-type">Crie 12 slides sobre o plano 2027, com a nossa marca…</span>
                      <b className="e4-go">Gerar</b>
                    </div>
                    <div className="e4-slide">
                      <div className="e4-res">
                        <p className="e4-t">Plano 2027</p>
                        <ul>
                          <li>Objetivos estratégicos</li>
                          <li>Cronograma em quatro fases</li>
                          <li>Indicadores de sucesso</li>
                        </ul>
                        <div className="e4-chart">
                          <i style={{ "--v": ".34" } as CSSProperties} />
                          <i style={{ "--v": ".5" } as CSSProperties} />
                          <i style={{ "--v": ".62" } as CSSProperties} />
                          <i className="e4-odd" style={{ "--v": ".96" } as CSSProperties}>
                            <em>+418%</em>
                          </i>
                        </div>
                      </div>
                      <div className="e4-gen">
                        <i />
                        <i />
                        <i />
                        <i />
                        <span>Gerando…</span>
                      </div>
                      <span className="e4-flag" id="ev-flag">Fora da marca</span>
                    </div>
                    <span className="e4-chip">
                      Tentativa{' '}
                      <b id="ev-chip-n">1</b>
                      <i />
                      <b id="ev-chip-k">0</b>
                      {' '}tokens
                    </span>
                  </div>
                  {/* 2026 · Halor, HTML vivo e lúdico */}
                  <div className="ev-scene ev-s5" aria-hidden="true">
                    <span className="e5-p" style={{ "--x": "8", "--y": "18", "--d": "0" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "22", "--y": "72", "--d": "1.4" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "38", "--y": "30", "--d": "2.6" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "55", "--y": "12", "--d": ".8" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "63", "--y": "48", "--d": "3.3" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "78", "--y": "24", "--d": "1.9" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "90", "--y": "64", "--d": "4.1" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "47", "--y": "86", "--d": "2.2" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "84", "--y": "88", "--d": ".4" } as CSSProperties} />
                    <span className="e5-p" style={{ "--x": "14", "--y": "44", "--d": "3.7" } as CSSProperties} />
                    {' '}
                    <svg className="e5-mark" aria-hidden="true">
                      <use href="#hl-mark" />
                    </svg>
                    <p className="e5-k">Kickoff 2027</p>
                    <p className="e5-t">
                      Plano 2027 em{' '}
                      <span className="e5-ed">
                        12 semanas.
                        <i className="e5-h" />
                        <i className="e5-h" />
                        <i className="e5-h" />
                        <i className="e5-h" />
                      </span>
                    </p>
                    <span className="e5-tag">
                      <svg aria-hidden="true">
                        <use href="#i-edit" />
                      </svg>
                      Editando · 0 tokens
                    </span>
                    <div className="e5-chart">
                      <i style={{ "--v": ".42" } as CSSProperties} />
                      <i style={{ "--v": ".58" } as CSSProperties} />
                      <i style={{ "--v": ".74" } as CSSProperties} />
                      <i style={{ "--v": ".94" } as CSSProperties} />
                    </div>
                    <div className="e5-vote">
                      <p>Qual frente começa primeiro?</p>
                      <div>
                        <span>Produto</span>
                        <i style={{ "--v": ".62" } as CSSProperties} />
                        <b>62%</b>
                      </div>
                      <div>
                        <span>Design</span>
                        <i style={{ "--v": ".28" } as CSSProperties} />
                        <b>28%</b>
                      </div>
                      <div>
                        <span>Operação</span>
                        <i style={{ "--v": ".1" } as CSSProperties} />
                        <b>10%</b>
                      </div>
                      <em>87% da sala votou</em>
                    </div>
                    <span className="e5-spark" style={{ "--k": "0" } as CSSProperties} />
                    <span className="e5-spark" style={{ "--k": "1" } as CSSProperties} />
                    <span className="e5-spark" style={{ "--k": "2" } as CSSProperties} />
                  </div>
                  {/* próximos anos · apresentação que conversa */}
                  <div className="ev-scene ev-s6" aria-hidden="true">
                    <div className="e6-slide">
                      <span className="e6-heat" style={{ "--x": "22", "--y": "58" } as CSSProperties} />
                      <span className="e6-heat e6-heat-b" style={{ "--x": "38", "--y": "62" } as CSSProperties} />
                      <p className="e6-t">Resultados do T3</p>
                      <div className="e6-chart">
                        <i style={{ "--v": ".4" } as CSSProperties} />
                        <i style={{ "--v": ".55" } as CSSProperties} />
                        <i className="hot" style={{ "--v": ".9" } as CSSProperties} />
                        <i style={{ "--v": ".66" } as CSSProperties} />
                      </div>
                      <div className="e6-chat">
                        <p className="e6-q">
                          <svg aria-hidden="true">
                            <use href="#hl-mark" />
                          </svg>
                          <span>Notei que o T3 prendeu a sala. Quer ver o detalhe?</span>
                        </p>
                        <p className="e6-a">Sim, mostra</p>
                      </div>
                      <div className="e6-live">
                        <span>Atenção ao vivo</span>
                        <b>92%</b>
                        <svg viewBox="0 0 60 16" aria-hidden="true">
                          <path pathLength="1" d="M1 13 L9 11 L17 12 L25 7 L33 9 L41 4 L49 5 L59 2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <i className="ev-wipe" aria-hidden="true" />
                </div>
                <i className="ev-floor" aria-hidden="true" />
              </div>
            </div>
            {/* embaixo do palco: o custo de gerar com IA (2024) e o contraste com o Halor (2026) */}
            <div className="ev-tok" id="ev-tok" data-mode="ai">
              <div className="ev-tok-in">
                <div className="ev-tok-card">
                  <div className="ev-tok-ctx">
                    <p className="ev-tok-k mono">
                      <svg aria-hidden="true">
                        <use href="#i-token" />
                      </svg>
                      <span className="ai-only">Necessidade de tokens</span>
                      <span className="hl-only">Com o Halor, sem tokens</span>
                    </p>
                    <p className="ev-tok-prompt ai-only">
                      <span className="mono">Prompt</span>
                      {' '}
                      <q>Crie 12 slides sobre o plano 2027, com a nossa marca e um gráfico de metas.</q>
                    </p>
                    <p className="ev-tok-prompt hl-only">
                      <span className="mono">Sem prompt</span>
                      {' '}
                      <q>Você clica no slide e edita. Sem fila, sem nova tentativa, sem conta para pagar.</q>
                    </p>
                    <p className="ev-tok-msg">
                      <svg className="ai-only" aria-hidden="true">
                        <use href="#i-alert" />
                      </svg>
                      <svg className="hl-only" aria-hidden="true">
                        <use href="#i-check" />
                      </svg>
                      <span className="ai-only">Gerar com IA consome tokens a cada tentativa e nem sempre sai como esperado.</span>
                      <span className="hl-only">Com o Halor, zero tokens: você edita direto no slide, do seu jeito.</span>
                    </p>
                  </div>
                  <ol className="ev-tries" id="ev-tries" aria-label="Tentativas" />
                  <div className="ev-tok-r">
                    <p className="ev-tok-big">
                      <span className="ev-tok-lab">
                        <span className="mono ai-only">Tokens gastos</span>
                        <span className="mono hl-only">Tokens com o Halor</span>
                        <span className="ev-tok-tag mono ai-only">valores ilustrativos</span>
                      </span>
                      <b id="ev-tok-n">0</b>
                    </p>
                    <p className="ev-tok-sum">
                      <span>
                        <b id="ev-tok-t">0</b>
                        {' '}
                        <span id="ev-tok-tl">tentativas</span>
                      </span>
                      <span>
                        ≈{' '}
                        <b id="ev-tok-c">R$ 0,00</b>
                      </span>
                    </p>
                    <button className="ev-regen ai-only" id="ev-regen" type="button">
                      <svg aria-hidden="true">
                        <use href="#i-replay" />
                      </svg>
                      Gerar de novo
                    </button>
                    <p className="ev-own hl-only">
                      <svg aria-hidden="true">
                        <use href="#i-edit" />
                      </svg>
                      Você edita direto
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="sr-only" id="ev-sr" role="status" />
        </div>
        <div className="tl-ahead">
          <article>
            <p className="tl-k mono">Do estático ao vivo</p>
            <p>
              Cada slide ganha movimento com propósito: guiar o olhar, dar ritmo e destacar o que importa.
            </p>
          </article>
          <article>
            <p className="tl-k mono">Da plateia ao participante</p>
            <p>
              Quem assiste vota, escreve e responde. Participar é a forma mais forte de prestar atenção.
            </p>
          </article>
          <article>
            <p className="tl-k mono">Do arquivo ao link que responde</p>
            <p>
              Um HTML leve que abre em qualquer tela e continua trabalhando depois que você sai da sala.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
