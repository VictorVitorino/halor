/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines/site.
   As abas do trilho nascem de EVO já no estado da primeira época (o protótipo montava por JS). */
import type { CSSProperties } from 'react';
import { EVO } from '@/lib/engines/site/evo-data';

export default function Timeline() {
  return (
    <section className="s-sec theme-lilac s-tl" id="linha-do-tempo">
      <div className="wrap">
        <div className="s-head">
          <p className="eyebrow">Linha do tempo</p>
          <h2 className="display">Dez anos de apresentações, e para onde vamos.</h2>
          <p className="lede">
            O slide deixou de ser papel na tela. Agora ele se move, responde e chama quem assiste para dentro da conversa.
          </p>
        </div>
        <div className="ev" id="ev" data-i="0">
          <div className="ev-main" id="ev-panel" role="tabpanel" aria-labelledby="ev-tab-0">
            <div className="ev-stage">
              {/* 2016 · slides estáticos */}
              <div className="ev-scene ev-s0" aria-hidden="true">
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
              {/* 2024 · gerado por IA */}
              <div className="ev-scene ev-s4" aria-hidden="true">
                <div className="e4-prompt">
                  <svg aria-hidden="true">
                    <use href="#i-wand" />
                  </svg>
                  <span className="e4-type">Crie slides sobre o plano 2027</span>
                  <b className="e4-go">Gerar</b>
                </div>
                <div className="e4-slide">
                  <p className="e4-t">Plano 2027</p>
                  <ul>
                    <li>Objetivos estratégicos</li>
                    <li>Cronograma em quatro fases</li>
                    <li>Indicadores de sucesso</li>
                  </ul>
                  <i className="e4-img" />
                </div>
                <span className="e4-chip">Pronto em 8 s · 12 slides parados</span>
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
                  <span>12 semanas.</span>
                </p>
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
            </div>
            <div className="ev-info" aria-live="polite">
              <p className="ev-y display">
                <span id="ev-y">2016</span>
                <em className="ev-now">hoje</em>
              </p>
              <h3 className="ev-t" id="ev-t">Slides estáticos</h3>
              <p className="ev-d" id="ev-d">Tópicos em sequência e PDF por e-mail. Quem recebe lê sozinho.</p>
              <p className="ev-who">
                <span className="mono">Quem assiste</span>
                <b id="ev-who">Lê sozinho</b>
              </p>
              <div className="ev-att">
                <span className="mono">Atenção da plateia</span>
                <i>
                  <b />
                </i>
              </div>
            </div>
          </div>
          <div className="ev-rail">
            <div className="ev-rail-in" role="tablist" aria-label="Dez anos de apresentações">
              <span className="ev-track" />
              <span className="ev-fut" />
              <span className="ev-fill" />
              <span className="ev-prog" />
              {EVO.map((e, i) => (
                <button
                  key={e.yr}
                  className={'ev-stop' + (e.now ? ' is-now' : '') + (e.next ? ' is-next' : '')}
                  type="button"
                  id={'ev-tab-' + i}
                  role="tab"
                  aria-controls="ev-panel"
                  aria-selected={i === 0}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  <i />
                  <span className="mono">{e.now ? <>{e.yr + ' '}<em>hoje</em></> : e.yr}</span>
                  <b>{e.t}</b>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="tl-ahead">
          <article>
            <p className="pd-k mono">Do estático ao vivo</p>
            <p>
              Cada slide ganha movimento com propósito: guiar o olhar, dar ritmo e destacar o que importa.
            </p>
          </article>
          <article>
            <p className="pd-k mono">Da plateia ao participante</p>
            <p>
              Quem assiste vota, escreve e responde. Participar é a forma mais forte de prestar atenção.
            </p>
          </article>
          <article>
            <p className="pd-k mono">Do arquivo ao link que responde</p>
            <p>
              Um HTML leve que abre em qualquer tela e continua trabalhando depois que você sai da sala.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
