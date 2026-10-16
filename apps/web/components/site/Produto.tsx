/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
export default function Produto() {
  return (
    <section className="s-sec s-prod" id="produto">
      <div className="wrap">
        <div className="s-head">
          <p className="eyebrow">Produto</p>
          <h2 className="display">Apresentações em HTML, vivas e interativas.</h2>
          <p className="lede">
            Você monta como sempre fez e a apresentação sai viva: se move, responde e chama a plateia para participar.
          </p>
        </div>
        <div className="pd-what">
          <article>
            <p className="pd-k mono">O que é</p>
            <h3>Um estúdio de apresentações no navegador</h3>
            <p>Cria, apresenta e compartilha. Sem instalar nada.</p>
          </article>
          <article>
            <p className="pd-k mono">O que faz</p>
            <h3>Transforma slide em experiência</h3>
            <p>
              Modelos com o seu kit de marca, 40 efeitos e componentes lúdicos. Importa e exporta em HTML, PDF e PPT.
            </p>
          </article>
          <article className="pd-gain">
            <p className="pd-k mono">O ganho principal</p>
            <h3>Animação e interação sem programar</h3>
            <p>
              Antes exigia código, Claude Code ou contas de IA. Agora qualquer pessoa cria, e quem recebe abre no navegador.
            </p>
          </article>
        </div>
        <div className="pd-rec" id="pd-rec">
          <div className="pd-rec-frame">
            <div className="pf-bar">
              <i />
              <i />
              <i />
              <span className="mono rec-url" id="rec-url">estudio.halor · Kickoff 2027</span>
              <span className="rec-live">
                <i className="dot dot-live" />
                {' '}gravação do Estúdio
              </span>
            </div>
            <div className="rec-stage" id="rec-stage" data-state="0">
              <div className="rec-s rec-edit theme-paper">
                <div className="re-top">
                  <svg aria-hidden="true">
                    <use href="#hl-mark-paper" />
                  </svg>
                  <span>Kickoff 2027</span>
                  <i className="re-saved">Salvo</i>
                  <span className="re-btn">Apresentar</span>
                </div>
                <div className="re-rib">
                  <i>Texto</i>
                  <i>Formas</i>
                  <i>Imagem</i>
                  <i className="on">Gráficos</i>
                  <i>Cards</i>
                  <i>Efeitos</i>
                  <i>Votação</i>
                </div>
                <div className="re-body">
                  <div className="re-rail" id="re-rail" />
                  <div className="re-canvas" id="re-canvas" />
                </div>
              </div>
              <div className="rec-s rec-dl theme-paper">
                <div className="rd-box">
                  <p className="rd-h">Salvar como</p>
                  <div className="rd-opt on">
                    <b>HTML</b>
                    <span>HTML interativo</span>
                    <em>Abre em qualquer navegador</em>
                  </div>
                  <div className="rd-opt">
                    <b>PDF</b>
                    <span>PDF</span>
                  </div>
                  <div className="rd-opt">
                    <b>PPTX</b>
                    <span>PowerPoint editável</span>
                  </div>
                  <div className="rd-opt">
                    <b>PPTX</b>
                    <span>PowerPoint idêntico</span>
                  </div>
                  <span className="rd-go">Baixar</span>
                </div>
                <div className="rd-bar">
                  <svg aria-hidden="true">
                    <use href="#i-file" />
                  </svg>
                  <span>kickoff-2027.html</span>
                  <i>
                    <b />
                  </i>
                  <em>concluído</em>
                </div>
              </div>
              <div className="rec-s rec-up theme-paper">
                <div className="ru-drop">
                  <svg aria-hidden="true">
                    <use href="#i-upload" />
                  </svg>
                  <b>Solte seu arquivo aqui</b>
                  <span>.pptx ou .pdf</span>
                </div>
                <div className="ru-file">
                  <svg aria-hidden="true">
                    <use href="#i-file" />
                  </svg>
                  <span>apresentacao-antiga.pptx</span>
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
                  </div>
                  <div className="ru-after" id="ru-after" />
                  <span className="ru-sweep" aria-hidden="true" />
                  {' '}
                  <span className="ru-tag ru-tag-a mono">antes</span>
                  <span className="ru-tag ru-tag-b mono">depois</span>
                </div>
              </div>
              <span className="rec-cursor" aria-hidden="true" />
            </div>
          </div>
          <ol className="rec-steps" aria-label="Etapas da gravação">
            <li>
              <button type="button" data-rec="0" aria-pressed="true">
                <b>1</b>
                <span>
                  <strong>Monte</strong>
                  <small>Modelo, kit de marca e efeitos.</small>
                </span>
              </button>
            </li>
            <li>
              <button type="button" data-rec="1" aria-pressed="false">
                <b>2</b>
                <span>
                  <strong>Baixe em HTML, PDF ou PPT</strong>
                  <small>Já pronto para apresentar.</small>
                </span>
              </button>
            </li>
            <li>
              <button type="button" data-rec="2" aria-pressed="false">
                <b>3</b>
                <span>
                  <strong>Já tem um modelo?</strong>
                  <small>Faça upload do seu arquivo e veja a mágica acontecer.</small>
                </span>
              </button>
            </li>
          </ol>
        </div>
        <div className="pd-models">
          <div className="pd-sub">
            <h3>Modelos que entregamos prontos</h3>
            <p className="muted">
              Cada modelo já sai com o seu kit de marca e os efeitos certos para o que você quer comunicar.
            </p>
          </div>
          <div className="pd-carousel">
            <button className="pd-nav pd-prev" type="button" aria-label="Modelos anteriores">
              <svg aria-hidden="true">
                <use href="#i-back" />
              </svg>
            </button>
            <div className="pd-track" id="pd-models" tabIndex={0} aria-label="Modelos prontos, role para o lado" />
            <button className="pd-nav pd-next" type="button" aria-label="Próximos modelos">
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </button>
          </div>
        </div>
        <ul className="feat-grid pd-feats">
          <li>
            <svg aria-hidden="true">
              <use href="#i-layers" />
            </svg>
            <h3>Estúdio no navegador</h3>
            <p>Faixa de inserção, camadas, atalhos e salvamento na nuvem.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-palette" />
            </svg>
            <h3>Modelos e kit de marca</h3>
            <p>Cores, fontes e logo travados. Todo slide nasce na sua identidade.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-wand" />
            </svg>
            <h3>40 efeitos prontos</h3>
            <p>Movimento, 3D, dados e narrativa. Veja todos na vitrine abaixo.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-cards" />
            </svg>
            <h3>Componentes lúdicos</h3>
            <p>Votação, post-its, formulário e cronômetro dentro do slide.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-target" />
            </svg>
            <h3>Raio Halor</h3>
            <p>Mostra por onde o olhar de quem assiste vai passar, antes de você apresentar.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-upload" />
            </svg>
            <h3>Importa o que você já tem</h3>
            <p>Arquivos .pptx e .pdf viram slides editáveis.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-download" />
            </svg>
            <h3>Exporta para tudo</h3>
            <p>HTML interativo, PDF e PowerPoint editável ou idêntico.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-users" />
            </svg>
            <h3>Times e versões</h3>
            <p>Comentários por slide, histórico de versões e administração.</p>
          </li>
        </ul>
        <div className="p-cta">
          <a className="btn btn-ghost" href="/estudio">
            Abrir o Estúdio{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
