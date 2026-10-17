/* Produto · gravação do Estúdio em três cenas: (1) monte a apresentação em HTML e edite
   ali mesmo, no modo apresentação; (2) baixe em HTML, PDF ou PPT; (3) já tem um modelo?
   PDF, PPT ou HTML viram apresentação Halor. Marcação estática, idêntica à do protótipo
   (convertida com as regras de tools/html-to-tsx.mjs); o loop das cenas, as etapas e o
   botão de pausa são ligados em lib/engines/site/produto.ts. */
import type { CSSProperties } from 'react';

export default function ProdutoRec() {
  return (
    <div className="pd-rec" id="pd-rec">
      <div className="pd-rec-frame">
        <div className="pf-bar">
          <i />
          <i />
          <i />
          <span className="mono rec-url" id="rec-url">estudio.halor · kickoff-2027.html</span>
          <span className="rec-live">
            <i className="dot dot-live" />
            {' '}gravação do Estúdio
          </span>
        </div>
        <div className="rec-stage" id="rec-stage" data-state="0" role="img" aria-label="Cena 1 de 3: a apresentação montada em HTML e editada ali mesmo, no modo apresentação.">
          {/* cena 1 · monte e edite na própria apresentação */}
          <div className="rec-s rec-edit">
            <div className="re-ui theme-paper">
              <div className="re-top">
                <svg aria-hidden="true">
                  <use href="#hl-mark-paper" />
                </svg>
                <span>Kickoff 2027</span>
                <i className="re-saved">Salvo</i>
                <span className="re-html mono">&lt;/&gt; HTML</span>
                <span className="re-btn">
                  <svg aria-hidden="true">
                    <use href="#i-play" />
                  </svg>
                  Apresentar
                </span>
              </div>
              <div className="re-rib">
                <i>Texto</i>
                <i>Formas</i>
                <i>Imagem</i>
                <i>Gráficos</i>
                <i>Cards</i>
                <i className="on">Efeitos</i>
                <i>Votação</i>
              </div>
              <div className="re-body">
                <div className="re-rail">
                  <i className="re-th" />
                  <i className="re-th" />
                  <i className="re-th on" />
                  <i className="re-th" />
                </div>
                <div className="re-canvas">
                  <div className="pd-sl">
                    <span className="pd-sl-ring" />
                    <p className="pd-sl-k">Resultados 2026</p>
                    <p className="pd-sl-h">Leitura completa dos materiais</p>
                    <div className="pd-sl-num">
                      <b>+32%</b>
                      <span>em relação a 2025</span>
                    </div>
                    <div className="pd-sl-bars">
                      <i style={{ "--h": "44%" } as CSSProperties} />
                      <i style={{ "--h": "58%" } as CSSProperties} />
                      <i style={{ "--h": "71%" } as CSSProperties} />
                      <i className="hi" style={{ "--h": "92%" } as CSSProperties} />
                    </div>
                    <div className="pd-sl-foot">
                      <b>
                        <svg aria-hidden="true">
                          <use href="#hl-mark" />
                        </svg>
                        halor
                      </b>
                      <span>03</span>
                    </div>
                  </div>
                  <span className="re-pick" />
                </div>
              </div>
            </div>
            <div className="re-show">
              <div className="re-slide">
                <div className="pd-sl">
                  <span className="pd-sl-ring" />
                  <p className="pd-sl-k">Resultados 2026</p>
                  <p className="pd-sl-h">Leitura completa dos materiais</p>
                  <div className="pd-sl-num re-num">
                    <span className="re-val">
                      <b className="re-old">+32%</b>
                      <b className="re-new">+41%</b>
                      <i className="re-caret" />
                      <span className="re-sweep" />
                      <span className="re-sel">
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    </span>
                    <span>em relação a 2025</span>
                  </div>
                  <div className="pd-sl-bars">
                    <i style={{ "--h": "44%" } as CSSProperties} />
                    <i style={{ "--h": "58%" } as CSSProperties} />
                    <i style={{ "--h": "71%" } as CSSProperties} />
                    <i className="hi" style={{ "--h": "92%" } as CSSProperties} />
                  </div>
                  <div className="pd-sl-foot">
                    <b>
                      <svg aria-hidden="true">
                        <use href="#hl-mark" />
                      </svg>
                      halor
                    </b>
                    <span>03</span>
                  </div>
                </div>
                <div className="re-bar">
                  <span className="rb-edit">
                    <svg aria-hidden="true">
                      <use href="#i-edit" />
                    </svg>
                    Editar aqui
                  </span>
                  <span className="rb-aa">Aa</span>
                  <span className="rb-fx">
                    <svg aria-hidden="true">
                      <use href="#i-spark" />
                    </svg>
                    <em className="rb-fx-a">Efeito</em>
                    <em className="rb-fx-b">Glow / Light Sweep</em>
                  </span>
                  <span className="rb-ok">
                    <svg aria-hidden="true">
                      <use href="#i-check" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="re-hud">
                <i className="dot dot-live" />
                <span>Apresentando</span>
                <b className="mono">03 / 12</b>
              </div>
              <p className="re-toast">
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                Editado ao vivo, sem sair da apresentação
              </p>
            </div>
          </div>
          {/* cena 2 · baixe em HTML, PDF ou PPT */}
          <div className="rec-s rec-dl theme-paper">
            <div className="rd-bg">
              <i />
              <i />
              <i />
            </div>
            <div className="rd-box">
              <div className="rd-head">
                <p className="rd-h">Baixar apresentação</p>
                <span className="mono">kickoff-2027</span>
              </div>
              <div className="rd-opts">
                <div className="rd-opt rd-html">
                  <span className="rd-file">
                    <b>HTML</b>
                  </span>
                  <strong>HTML interativo</strong>
                  <em>Abre em qualquer navegador, com efeitos e votação.</em>
                  <i className="rd-ck">
                    <svg aria-hidden="true">
                      <use href="#i-check" />
                    </svg>
                  </i>
                </div>
                <div className="rd-opt rd-pdf">
                  <span className="rd-file">
                    <b>PDF</b>
                  </span>
                  <strong>PDF</strong>
                  <em>Para imprimir, anexar e enviar.</em>
                </div>
                <div className="rd-opt rd-ppt">
                  <span className="rd-file">
                    <b>PPT</b>
                  </span>
                  <strong>PowerPoint</strong>
                  <em>Editável ou idêntico ao slide.</em>
                </div>
              </div>
              <div className="rd-foot">
                <span>Efeitos, votação e notas vão junto</span>
                <span className="rd-go">
                  <svg aria-hidden="true">
                    <use href="#i-download" />
                  </svg>
                  Baixar
                </span>
              </div>
            </div>
            <div className="rd-bar">
              <span className="rd-fi">
                <b>HTML</b>
              </span>
              <span className="rd-name">kickoff-2027.html</span>
              <i className="rd-prog">
                <b />
              </i>
              <em>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                Pronto para apresentar
              </em>
            </div>
          </div>
          {/* cena 3 · já tem um modelo? upload do PDF, PPT ou HTML */}
          <div className="rec-s rec-up theme-paper">
            <div className="ru-drop">
              <svg aria-hidden="true">
                <use href="#i-upload" />
              </svg>
              <b>Solte aqui o seu arquivo</b>
              <span className="mono">PDF · PPT · HTML</span>
            </div>
            <div className="ru-files">
              <span className="ru-f ru-pdf">
                <b>PDF</b>
                <i>relatorio.pdf</i>
              </span>
              <span className="ru-f ru-ppt">
                <b>PPT</b>
                <i>plano-2027.pptx</i>
              </span>
              <span className="ru-f ru-htm">
                <b>HTML</b>
                <i>pagina.html</i>
              </span>
            </div>
            <div className="ru-read">
              <svg aria-hidden="true">
                <use href="#i-file" />
              </svg>
              <span>
                Lendo{' '}
                <b>plano-2027.pptx</b>
                {' '}· 12 slides
              </span>
              <i>
                <b />
              </i>
            </div>
            <div className="ru-magic">
              <div className="ru-before">
                <p className="rb-t">Plano 2027</p>
                <ul>
                  <li>Objetivos do trimestre</li>
                  <li>Cronograma em 12 semanas</li>
                  <li>Responsáveis por frente</li>
                  <li>Próximos passos</li>
                </ul>
                <span className="rb-img" />
                <span className="rb-n">1</span>
              </div>
              <div className="ru-after">
                <div className="pd-sl pd-sl-plan">
                  <span className="pd-sl-ring" />
                  <p className="pd-sl-k">Plano 2027</p>
                  <p className="pd-sl-h">12 semanas, quatro frentes, um time.</p>
                  <div className="pd-sl-tl">
                    <span className="pd-sl-line" />
                    <div style={{ "--x": "6%" } as CSSProperties}>
                      <i />
                      <b>Kickoff</b>
                      <small>S1</small>
                    </div>
                    <div style={{ "--x": "36%" } as CSSProperties}>
                      <i />
                      <b>Desenho</b>
                      <small>S4</small>
                    </div>
                    <div style={{ "--x": "66%" } as CSSProperties}>
                      <i />
                      <b>Piloto</b>
                      <small>S8</small>
                    </div>
                    <div style={{ "--x": "94%" } as CSSProperties}>
                      <i />
                      <b>Entrega</b>
                      <small>S12</small>
                    </div>
                  </div>
                  <div className="pd-sl-foot">
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
              <span className="ru-sweep" />
              {' '}
              <span className="ru-wand">
                <svg aria-hidden="true">
                  <use href="#i-wand" />
                </svg>
              </span>
              {' '}
              <span className="ru-spk s1" />
              <span className="ru-spk s2" />
              <span className="ru-spk s3" />
              {' '}
              <span className="ru-tag ru-tag-a mono">antes</span>
              <span className="ru-tag ru-tag-b mono">depois</span>
            </div>
            <div className="ru-chips">
              <span>
                <svg aria-hidden="true">
                  <use href="#i-palette" />
                </svg>
                Kit de marca aplicado
              </span>
              <span>
                <svg aria-hidden="true">
                  <use href="#i-layers" />
                </svg>
                12 slides editáveis
              </span>
              <span>
                <svg aria-hidden="true">
                  <use href="#i-wand" />
                </svg>
                6 efeitos sugeridos
              </span>
            </div>
          </div>
          <span className="rec-cursor" aria-hidden="true" />
        </div>
      </div>
      <div className="rec-side">
        <p className="rec-kick mono">Como funciona</p>
        <ol className="rec-steps" aria-label="Etapas da gravação do Estúdio">
          <li>
            <button type="button" data-rec="0" aria-pressed="true" aria-controls="rec-stage">
              <b>1</b>
              <span>
                <strong>Monte: construa apresentações em HTML</strong>
                <small>Já pronta para apresentar e para editar na própria apresentação.</small>
              </span>
              <i className="rec-prog" aria-hidden="true" />
            </button>
          </li>
          <li>
            <button type="button" data-rec="1" aria-pressed="false" aria-controls="rec-stage">
              <b>2</b>
              <span>
                <strong>Baixe em HTML, PDF ou PPT</strong>
                <small>Já pronto para apresentar.</small>
              </span>
              <i className="rec-prog" aria-hidden="true" />
            </button>
          </li>
          <li>
            <button type="button" data-rec="2" aria-pressed="false" aria-controls="rec-stage">
              <b>3</b>
              <span>
                <strong>Já tem um modelo?</strong>
                <small>Faça upload do PDF, PPT ou até mesmo de um HTML, e veja a mágica acontecer.</small>
              </span>
              <i className="rec-prog" aria-hidden="true" />
            </button>
          </li>
        </ol>
        <button className="rec-pause" type="button" id="rec-pause">
          <svg aria-hidden="true">
            <use href="#i-pause" />
          </svg>
          <span>Pausar a gravação</span>
        </button>
      </div>
    </div>
  );
}
