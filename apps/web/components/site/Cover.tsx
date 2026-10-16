/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import type { CSSProperties } from 'react';

export default function Cover() {
  return (
    <div className="s-cover field-in">
      <canvas className="halo-field halor-field" data-field="hero" aria-hidden="true" />
      <div className="wrap s-hero-in s-hero-copy">
        <p className="eyebrow no-rule s-in" style={{ "--d": ".25s" } as CSSProperties}>Programa de Apresentações Lúdicas</p>
        <h1 className="display s-h1">
          <span className="w" style={{ "--i": "0" } as CSSProperties}>Faça</span>
          {' '}
          <span className="w" style={{ "--i": "1" } as CSSProperties}>cada</span>
          {' '}
          <span className="w" style={{ "--i": "2" } as CSSProperties}>olhar</span>
          {' '}
          <span className="w lux" style={{ "--i": "3" } as CSSProperties}>render.</span>
        </h1>
        <p className="s-sub s-in" style={{ "--d": "1.05s" } as CSSProperties}>
          O que exigia código agora é{' '}
          <span className="neon-band">de todo mundo</span>
          .
        </p>
        <p className="lede s-lede s-in" style={{ "--d": "1.3s" } as CSSProperties}>Apresentações vivas, que prendem o olhar do começo ao fim.</p>
        <div className="s-cta s-in" style={{ "--d": "1.5s" } as CSSProperties}>
          <a className="btn btn-primary btn-lg" href="/assinar" data-plan="faisca" data-attract="">
            Começar grátis{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
          {' '}
          <button className="btn btn-ghost btn-lg" type="button" data-film-play="" data-attract="">
            <svg aria-hidden="true">
              <use href="#i-play" />
            </svg>
            {' '}Conheça o Halor{' '}
            <span className="s-dur">(1 min 28 s)</span>
          </button>
        </div>
      </div>
      <div className="s-cover-foot wrap s-in" style={{ "--d": "1.6s" } as CSSProperties}>
        <span className="s-hint mono">Passe o mouse para reunir as partículas · clique para soltar uma onda</span>
        {' '}
        <button className="btn btn-quiet btn-sm s-replay" type="button" data-field-replay="hero">
          <svg aria-hidden="true">
            <use href="#i-replay" />
          </svg>
          {' '}Repetir entrada
        </button>
      </div>
    </div>
  );
}
