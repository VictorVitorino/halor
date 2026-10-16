/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import type { CSSProperties } from 'react';

export default function Efeito() {
  return (
    <section className="s-sec s-science theme-lilac" id="efeito">
      <div className="wrap">
        <div className="s-head">
          <p className="eyebrow">Por que funciona</p>
          <h2 className="display">O efeito Halor</h2>
          <p className="lede">
            Três ideias da ciência explicam por que um visual bem pensado prende a atenção e fica na memória.
          </p>
        </div>
        <div className="sci-grid">
          <article className="sci" style={{ "--c": "0" } as CSSProperties}>
            <svg className="sci-ic ic-halo" viewBox="0 0 48 48" aria-hidden="true">
              <g className="ic-spin">
                <path pathLength="1" style={{ "--k": "0" } as CSSProperties} d="M39.41 16.82A17 17 0 1 1 31.18 8.59" />
              </g>
              <circle pathLength="1" style={{ "--k": "1" } as CSSProperties} cx="24" cy="24" r="10.5" className="thin" />
              <circle className="fill ic-core" cx="24" cy="24" r="5" />
              <path className="fill ic-spark" d="M36 7.5Q36 12 40.5 12Q36 12 36 16.5Q36 12 31.5 12Q36 12 36 7.5Z" />
            </svg>
            <p className="sci-n display">1920</p>
            <h3 className="sci-h">
              <span className="tw" style={{ "--i": "0" } as CSSProperties}>Efeito</span>
              {' '}
              <span className="tw" style={{ "--i": "1" } as CSSProperties}>halo</span>
            </h3>
            <p>
              Uma boa impressão em um ponto contamina o julgamento do resto. Um slide bem resolvido eleva a apresentação inteira.
            </p>
            <p className="sci-ref mono">Thorndike, Journal of Applied Psychology</p>
          </article>
          <article className="sci" style={{ "--c": "1" } as CSSProperties}>
            <svg className="sci-ic ic-watch" viewBox="0 0 48 48" aria-hidden="true">
              <circle pathLength="1" style={{ "--k": "0" } as CSSProperties} cx="24" cy="27" r="15" />
              <path pathLength="1" style={{ "--k": "1" } as CSSProperties} d="M20 7h8M24 7v5M36 14l2.5-2.5" />
              <path className="ic-hand" pathLength="1" style={{ "--k": "2" } as CSSProperties} d="M24 27V17" />
              <circle className="fill" cx="24" cy="27" r="2" />
              <text className="ic-ms" x="24" y="37.5" textAnchor="middle">50</text>
            </svg>
            <p className="sci-n display">
              50
              <small>ms</small>
            </p>
            <h3 className="sci-h">
              <span className="tw" style={{ "--i": "0" } as CSSProperties}>O</span>
              {' '}
              <span className="tw" style={{ "--i": "1" } as CSSProperties}>primeiro</span>
              {' '}
              <span className="tw" style={{ "--i": "2" } as CSSProperties}>olhar</span>
              {' '}
              <span className="tw" style={{ "--i": "3" } as CSSProperties}>decide</span>
            </h3>
            <p>
              É o tempo para formar uma opinião sobre uma tela. Antes de ler a primeira linha, quem assiste já sentiu.
            </p>
            <p className="sci-ref mono">Lindgaard et al., 2006</p>
          </article>
          <article className="sci" style={{ "--c": "2" } as CSSProperties}>
            <svg className="sci-ic ic-img" viewBox="0 0 48 48" aria-hidden="true">
              <rect pathLength="1" style={{ "--k": "0" } as CSSProperties} x="7" y="10" width="34" height="28" rx="4" />
              <path pathLength="1" style={{ "--k": "1" } as CSSProperties} d="M7 32l10-10 8 8 5-5 11 11" />
              <circle className="fill ic-sun" cx="32" cy="18" r="3.2" />
            </svg>
            <p className="sci-n display">
              img
              <small>&gt;</small>
              txt
            </p>
            <h3 className="sci-h">
              <span className="tw" style={{ "--i": "0" } as CSSProperties}>Imagem</span>
              {' '}
              <span className="tw" style={{ "--i": "1" } as CSSProperties}>fica,</span>
              {' '}
              <span className="tw" style={{ "--i": "2" } as CSSProperties}>texto</span>
              {' '}
              <span className="tw" style={{ "--i": "3" } as CSSProperties}>passa</span>
            </h3>
            <p>
              Lembramos mais do que vemos do que do que lemos. Uma ideia desenhada volta à cabeça muito depois do último slide.
            </p>
            <p className="sci-ref mono">Paivio, dupla codificação, 1971</p>
          </article>
        </div>
        <div className="equation" aria-label="Fórmula do efeito Halor">
          <span className="eq-term">Visual que chama atenção</span>
          {' '}
          <span className="eq-op" aria-hidden="true">×</span>
          {' '}
          <span className="eq-term">Interação que envolve</span>
          {' '}
          <span className="eq-op" aria-hidden="true">=</span>
          {' '}
          <span className="eq-term eq-res">Atenção que fica</span>
        </div>
      </div>
    </section>
  );
}
