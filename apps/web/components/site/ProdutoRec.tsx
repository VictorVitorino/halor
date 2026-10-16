/* Produto · gravação do Estúdio em três cenas (montar, baixar em HTML, importar um arquivo).
   O trilho, o slide aberto e o "depois" da importação nascem do renderizador de slides;
   o loop das cenas e os botões de etapa são ligados em lib/engines/site/produto.ts. */
import { REC_AFTER, REC_OPEN, REC_RAIL } from '@/lib/engines/site/data';
import { slideHTML } from '@/lib/slides';

export default function ProdutoRec() {
  return (
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
              <div className="re-rail" id="re-rail">
                {REC_RAIL.map((m, i) => (
                  <div key={m.n} className={'re-th' + (i === REC_OPEN ? ' on' : '')} dangerouslySetInnerHTML={{ __html: slideHTML(m.s, i + 1, 'halor') }} />
                ))}
              </div>
              <div className="re-canvas" id="re-canvas" dangerouslySetInnerHTML={{ __html: slideHTML(REC_RAIL[REC_OPEN].s, REC_OPEN + 1, 'halor') }} />
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
              <div className="ru-after" id="ru-after" dangerouslySetInnerHTML={{ __html: slideHTML(REC_AFTER, 1, 'halor') }} />
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
  );
}
