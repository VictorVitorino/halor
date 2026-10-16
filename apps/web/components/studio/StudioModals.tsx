/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import type { CSSProperties } from 'react';

export default function StudioModals() {
  return (
    <>
    <div className="modal theme-paper" id="m-import" hidden role="dialog" aria-modal="true" aria-labelledby="m-import-t">
      <div className="modal-bg" data-close="" />
      <div className="modal-box">
        <div className="modal-head">
          <h3 id="m-import-t">Importar para o acervo</h3>
          <button className="btn-icon" type="button" data-close="" aria-label="Fechar">
            <svg aria-hidden="true">
              <use href="#i-x" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <label className="drop" htmlFor="imp-file" id="imp-drop">
            <svg aria-hidden="true">
              <use href="#i-upload" />
            </svg>
            <b>Arraste os arquivos para cá</b>
            <span className="muted">ou clique para escolher · .pptx, .pdf e acervo .json</span>
            <input id="imp-file" type="file" multiple accept=".pptx,.pdf,.json" className="sr-only" />
          </label>
          <div>
            <p className="insp-h">Fila de importação</p>
            <ul className="queue" id="imp-queue">
              <li>
                <svg aria-hidden="true">
                  <use href="#i-file" />
                </svg>
                <div>
                  <b>Abertura do evento Q3.pptx</b>
                  <span className="qbar">
                    <i style={{ width: "100%" } as CSSProperties} />
                  </span>
                </div>
                <span className="chip chip-ok">Pronto · 18 slides</span>
              </li>
              <li>
                <svg aria-hidden="true">
                  <use href="#i-file" />
                </svg>
                <div>
                  <b>Relatório de resultados.pdf</b>
                  <span className="qbar">
                    <i className="run" style={{ width: "62%" } as CSSProperties} />
                  </span>
                </div>
                <span className="chip">62%</span>
              </li>
              <li>
                <svg aria-hidden="true">
                  <use href="#i-file" />
                </svg>
                <div>
                  <b>Boas-vindas ao time.pptx</b>
                  <span className="qbar">
                    <i style={{ width: "0" } as CSSProperties} />
                  </span>
                </div>
                <span className="chip chip-line">Na fila</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-quiet btn-sm" type="button" data-close="" data-toast="A importação para depois do arquivo atual">Parar após o item atual</button>
          <button className="btn btn-primary btn-sm" type="button" data-close="" id="imp-done">Ver no acervo</button>
        </div>
      </div>
    </div>
    <div className="modal theme-paper" id="m-export" hidden role="dialog" aria-modal="true" aria-labelledby="m-export-t">
      <div className="modal-bg" data-close="" />
      <div className="modal-box">
        <div className="modal-head">
          <h3 id="m-export-t">Salvar como</h3>
          <button className="btn-icon" type="button" data-close="" aria-label="Fechar">
            <svg aria-hidden="true">
              <use href="#i-x" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="exp" role="radiogroup" aria-label="Formato">
            <button type="button" role="radio" aria-checked="true" className="exp-hot" data-exp="link">
              <span className="exp-ic">
                <svg aria-hidden="true">
                  <use href="#i-link" />
                </svg>
              </span>
              <b>Link Halor medido</b>
              <small>Abre no navegador e mostra onde o olhar ficou, slide a slide. Recomendado.</small>
            </button>
            {' '}
            <button type="button" role="radio" aria-checked="false" tabIndex={-1} data-exp="html">
              <span className="exp-ic">HTML</span>
              <b>HTML interativo</b>
              <small>Um arquivo único, com animações, que abre offline. Baixa na hora.</small>
            </button>
            {' '}
            <button type="button" role="radio" aria-checked="false" tabIndex={-1} data-exp="pptx">
              <span className="exp-ic">PPTX</span>
              <b>PowerPoint editável</b>
              <small>Textos e formas continuam editáveis.</small>
            </button>
            {' '}
            <button type="button" role="radio" aria-checked="false" tabIndex={-1} data-exp="pptx-img">
              <span className="exp-ic">PPTX</span>
              <b>PowerPoint idêntico</b>
              <small>Cada slide como imagem fiel ao Estúdio.</small>
            </button>
            {' '}
            <button type="button" role="radio" aria-checked="false" tabIndex={-1} data-exp="pdf">
              <span className="exp-ic">PDF</span>
              <b>PDF</b>
              <small>Vetorial, pronto para imprimir ou anexar.</small>
            </button>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-quiet btn-sm" type="button" data-close="">Cancelar</button>
          <button className="btn btn-primary btn-sm" type="button" id="exp-go">Gerar link</button>
        </div>
      </div>
    </div>
    <div className="modal theme-paper" id="m-share" hidden role="dialog" aria-modal="true" aria-labelledby="m-share-t">
      <div className="modal-bg" data-close="" />
      <div className="modal-box">
        <div className="modal-head">
          <h3 id="m-share-t">Compartilhar</h3>
          <button className="btn-icon" type="button" data-close="" aria-label="Fechar">
            <svg aria-hidden="true">
              <use href="#i-x" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="share-row">
            <input className="input" id="share-mail" type="email" placeholder="Adicionar pessoas por e-mail" aria-label="E-mail de quem vai receber" autoComplete="off" />
            <select className="select sel-sm" id="share-perm" aria-label="Permissão">
              <option>Pode editar</option>
              <option>Pode comentar</option>
              <option>Pode ver</option>
            </select>
          </div>
          <ul className="people" id="share-people">
            <li>
              <span className="avatar av-sm">MC</span>
              <div>
                <b>Marina Costa</b>
                <span className="muted">marina@nortesistemas.com.br</span>
              </div>
              <span className="muted">Proprietária</span>
            </li>
            <li>
              <span className="avatar av-sm av-2">RL</span>
              <div>
                <b>Rafael Lima</b>
                <span className="muted">rafael@nortesistemas.com.br</span>
              </div>
              <span className="muted">Pode editar</span>
            </li>
          </ul>
          <div className="share-link">
            <svg aria-hidden="true">
              <use href="#i-link" />
            </svg>
            <div>
              <b>Link Halor medido</b>
              <span className="muted mono" id="share-url">halor.link/kickoff-2027</span>
            </div>
            <label className="switch">
              <input type="checkbox" id="share-on" defaultChecked aria-label="Link ativo" />
              <span />
            </label>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost btn-sm" type="button" id="share-copy">
            <svg aria-hidden="true">
              <use href="#i-copy" />
            </svg>
            {' '}Copiar link
          </button>
          <button className="btn btn-primary btn-sm" type="button" id="share-send">Enviar</button>
        </div>
      </div>
    </div>
    <div className="modal theme-paper" id="m-keys" hidden role="dialog" aria-modal="true" aria-labelledby="m-keys-t">
      <div className="modal-bg" data-close="" />
      <div className="modal-box keys-box">
        <div className="modal-head">
          <h3 id="m-keys-t">Guia rápido e atalhos</h3>
          <button className="btn-icon" type="button" data-close="" aria-label="Fechar">
            <svg aria-hidden="true">
              <use href="#i-x" />
            </svg>
          </button>
        </div>
        <div className="modal-body keys">
          <section>
            <p className="insp-h">Estúdio</p>
            <dl>
              <div>
                <dt>Buscar no acervo</dt>
                <dd>
                  <kbd data-mod="">Ctrl</kbd>
                  <kbd>K</kbd>
                </dd>
              </div>
              <div>
                <dt>Atalhos da capa</dt>
                <dd>
                  <kbd>1</kbd>
                  {' '}a{' '}
                  <kbd>6</kbd>
                </dd>
              </div>
              <div>
                <dt>Abrir este guia</dt>
                <dd>
                  <kbd>?</kbd>
                </dd>
              </div>
            </dl>
          </section>
          <section>
            <p className="insp-h">Editor</p>
            <dl>
              <div>
                <dt>Desfazer · refazer</dt>
                <dd>
                  <kbd data-mod="">Ctrl</kbd>
                  <kbd>Z</kbd>
                  {' '}·{' '}
                  <kbd>Shift</kbd>
                  <kbd data-mod="">Ctrl</kbd>
                  <kbd>Z</kbd>
                </dd>
              </div>
              <div>
                <dt>Novo slide · duplicar</dt>
                <dd>
                  <kbd data-mod="">Ctrl</kbd>
                  <kbd>M</kbd>
                  {' '}·{' '}
                  <kbd data-mod="">Ctrl</kbd>
                  <kbd>D</kbd>
                </dd>
              </div>
              <div>
                <dt>Slide anterior · seguinte</dt>
                <dd>
                  <kbd>PgUp</kbd>
                  {' '}·{' '}
                  <kbd>PgDn</kbd>
                </dd>
              </div>
              <div>
                <dt>Mover o elemento</dt>
                <dd>
                  <kbd>←</kbd>
                  <kbd>↑</kbd>
                  <kbd>→</kbd>
                  <kbd>↓</kbd>
                  {' '}· com{' '}
                  <kbd>Shift</kbd>
                  {' '}anda 5×
                </dd>
              </div>
              <div>
                <dt>Excluir o elemento</dt>
                <dd>
                  <kbd>Delete</kbd>
                </dd>
              </div>
              <div>
                <dt>Editar o texto</dt>
                <dd>clique duplo</dd>
              </div>
              <div>
                <dt>Raio Halor</dt>
                <dd>
                  <kbd>R</kbd>
                </dd>
              </div>
              <div>
                <dt>Apresentar daqui</dt>
                <dd>
                  <kbd data-mod="">Ctrl</kbd>
                  <kbd>Enter</kbd>
                </dd>
              </div>
            </dl>
          </section>
          <section>
            <p className="insp-h">Palco</p>
            <dl>
              <div>
                <dt>Avançar · voltar</dt>
                <dd>
                  <kbd>→</kbd>
                  {' '}ou{' '}
                  <kbd>Espaço</kbd>
                  {' '}·{' '}
                  <kbd>←</kbd>
                </dd>
              </div>
              <div>
                <dt>Primeiro · último slide</dt>
                <dd>
                  <kbd>Home</kbd>
                  {' '}·{' '}
                  <kbd>End</kbd>
                </dd>
              </div>
              <div>
                <dt>Tela cheia</dt>
                <dd>
                  <kbd>F</kbd>
                </dd>
              </div>
              <div>
                <dt>Voltar ao editor</dt>
                <dd>
                  <kbd>Esc</kbd>
                </dd>
              </div>
            </dl>
          </section>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary btn-sm" type="button" data-close="">Entendi</button>
        </div>
      </div>
    </div>
    </>
  );
}
