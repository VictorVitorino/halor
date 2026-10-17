/* Produto · modelos que entregamos prontos. Os cartões nascem de PD_MODELS e cada
   miniatura vem do renderizador próprio do Produto (pd-thumbs.ts, as mesmas strings do
   protótipo), com um efeito vivo e o chip com o nome do efeito. Setas, arrasto, teclado,
   máscaras nas bordas e o liga/desliga dos efeitos são ligados em lib/engines/site/produto.ts. */
import type { CSSProperties } from 'react';
import { PD_MODELS } from '@/lib/engines/site/data';
import { pdThumbHTML } from '@/lib/engines/site/pd-thumbs';

export default function ProdutoModels() {
  return (
    <div className="pd-models">
      <div className="pd-sub">
        <h3>Modelos que entregamos prontos</h3>
        <p className="muted">
          Cada modelo já sai no seu kit de marca e com um efeito que trabalha pela mensagem. Passe o cursor ou foque um modelo para ver o efeito de novo.
        </p>
      </div>
      <div className="pd-carousel">
        <button className="pd-nav pd-prev" type="button" aria-label="Modelos anteriores">
          <svg aria-hidden="true">
            <use href="#i-back" />
          </svg>
        </button>
        <div className="pd-track" id="pd-models" tabIndex={0} role="region" aria-label="Modelos prontos. Use as setas para ver mais.">
          {PD_MODELS.map(m => (
            <article key={m.id} className="pd-model" tabIndex={0} style={{ '--ac': m.ac } as CSSProperties}>
              <div className="pd-mthumb" aria-hidden="true" dangerouslySetInnerHTML={{ __html: pdThumbHTML(m.id) }} />
              <div className="pd-mb">
                <b>{m.n}</b>
                <p>{m.d}</p>
                <div className="pd-fx">
                  {m.fx.map((f, i) => (
                    <span key={f} className={'chip' + (i ? ' chip-line' : ' pd-fxchip')}>
                      {i ? null : (
                        <svg aria-hidden="true">
                          <use href="#i-spark" />
                        </svg>
                      )}
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <button className="pd-nav pd-next" type="button" aria-label="Próximos modelos">
          <svg aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </button>
      </div>
    </div>
  );
}
