/* Produto · modelos que entregamos prontos. Os cartões nascem de PD_MODELS e cada
   miniatura vem do renderizador próprio do Produto (pd-thumbs.ts, as mesmas strings do
   protótipo), com um efeito vivo e o chip com o nome do efeito. O cabeçalho leva a pausa
   dos efeitos e as setas (na calha, fora das miniaturas); o trilho é uma parada só de Tab e
   as setas do teclado andam de modelo em modelo. Comportamento em lib/engines/site/produto.ts. */
import type { CSSProperties } from 'react';
import { PD_MODELS } from '@/lib/engines/site/data';
import { pdThumbHTML } from '@/lib/engines/site/pd-thumbs';

export default function ProdutoModels() {
  return (
    <div className="pd-models">
      <div className="pd-mhead">
        <div className="pd-sub">
          <h3>Modelos que entregamos prontos</h3>
          <p className="muted">
            Cada modelo já sai no seu kit de marca e com um efeito que trabalha pela mensagem. Passe o cursor, toque ou navegue com as setas para ver o efeito de novo.
          </p>
        </div>
        <div className="pd-ctl" data-rv="up">
          <button className="pd-fxpause" type="button" aria-controls="pd-models">
            <svg aria-hidden="true">
              <use href="#i-pause" />
            </svg>
            <span>Pausar efeitos</span>
          </button>
          <button className="pd-nav pd-prev" type="button" aria-label="Modelos anteriores" aria-controls="pd-models" disabled>
            <svg aria-hidden="true">
              <use href="#i-back" />
            </svg>
          </button>
          <button className="pd-nav pd-next" type="button" aria-label="Próximos modelos" aria-controls="pd-models">
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </button>
        </div>
      </div>
      <div className="pd-carousel">
        <div className="pd-track" id="pd-models" tabIndex={0} role="region" aria-label="Modelos prontos. Use as setas do teclado para percorrer os modelos.">
          {PD_MODELS.map(m => (
            <article key={m.id} className="pd-model" role="group" aria-labelledby={`pd-m-${m.id}`} style={{ '--ac': m.ac } as CSSProperties}>
              <div className="pd-mthumb" aria-hidden="true" dangerouslySetInnerHTML={{ __html: pdThumbHTML(m.id) }} />
              <div className="pd-mb">
                <h4 id={`pd-m-${m.id}`}>{m.n}</h4>
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
        <p className="sr-only" id="pd-live" aria-live="polite" />
      </div>
    </div>
  );
}
