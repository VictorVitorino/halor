/* Produto · modelos que entregamos prontos. Os cartões nascem de PD_MODELS com o
   renderizador de slides (o protótipo montava por JS no carregamento); setas, arrasto,
   máscaras nas bordas e os efeitos dos slides são ligados em lib/engines/site/produto.ts. */
import type { CSSProperties } from 'react';
import { PD_MODELS } from '@/lib/engines/site/data';
import { slideHTML } from '@/lib/slides';

export default function ProdutoModels() {
  return (
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
        <div className="pd-track" id="pd-models" tabIndex={0} aria-label="Modelos prontos, role para o lado">
          {PD_MODELS.map((m, i) => (
            <article key={m.n} className="pd-model" style={{ '--ac': m.ac } as CSSProperties} tabIndex={0}>
              <div className="pd-mthumb" dangerouslySetInnerHTML={{ __html: slideHTML(m.s, i + 1, 'halor') }} />
              <div className="pd-mb">
                <b>{m.n}</b>
                <div className="pd-fx">
                  {m.fx.map(f => <span key={f} className="chip">{f}</span>)}
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
