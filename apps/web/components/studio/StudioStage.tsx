/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
export default function StudioStage() {
  return (
    <section className="sub sub-stage theme-night" data-subview="apresentar" aria-label="Modo palco">
      <canvas className="halo-field halor-field" data-field="stage" aria-hidden="true" />
      <div className="stage-top">
        <span className="chip">
          <i className="dot dot-live" />
          {' '}Ao vivo
        </span>
        {' '}
        <span className="stage-title">Kickoff 2027 · Time de produto</span>
        {' '}
        <span className="stage-clock mono num" id="stage-clock" role="timer" aria-label="Tempo de apresentação" title="Tempo de apresentação">0:00</span>
        {' '}
        <a className="btn btn-ghost btn-sm" href="/editor" aria-keyshortcuts="Escape" title="Voltar ao editor (Esc)">
          <svg aria-hidden="true">
            <use href="#i-x" />
          </svg>
          <span>Sair</span>
        </a>
      </div>
      <div className="stage-body" data-skip="">
        <div className="stage-now">
          <div id="stage-now" />
        </div>
        <div className="stage-side">
          <div className="stage-next">
            <p className="sk mono">A seguir · slide 4</p>
            <div id="stage-next" />
          </div>
          <div className="stage-notes">
            <p className="sk mono">Notas</p>
            <p id="stage-notes">
              Abrir com a pergunta: o que faria você ler um material até o fim? Depois mostrar o 2× e pausar dois segundos.
            </p>
          </div>
          <div className="stage-pulse">
            <p className="sk mono">Pulso da audiência</p>
            <div className="pulse-row">
              <b id="pulse-val">87%</b>
              <span className="muted">atenção agora · 4 pessoas</span>
            </div>
            <svg viewBox="0 0 240 56" className="pulse-svg" aria-hidden="true">
              <path id="pulse-path" d="" />
            </svg>
          </div>
        </div>
      </div>
      <div className="stage-dock">
        <button className="btn-icon" type="button" aria-label="Slide anterior" data-stage="-1">
          <svg aria-hidden="true">
            <use href="#i-back" />
          </svg>
        </button>
        <div className="stage-dots" id="stage-dots" />
        <button className="btn-icon" type="button" aria-label="Próximo slide" data-stage="1">
          <svg aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </button>
        {' '}
        <span className="dock-sep" />
        {' '}
        <button className="btn-icon" type="button" aria-label="Tela cheia" aria-keyshortcuts="F" title="Tela cheia (F)" id="stage-fs">
          <svg aria-hidden="true">
            <use href="#i-expand" />
          </svg>
        </button>
      </div>
      <p className="stage-keys mono" aria-hidden="true">
        <kbd>←</kbd>
        <kbd>→</kbd>
        {' '}ou clique no slide ·{' '}
        <kbd>F</kbd>
        {' '}tela cheia ·{' '}
        <kbd>Esc</kbd>
        {' '}volta ao editor
      </p>
      <p className="sr-only" id="stage-live" aria-live="polite" />
    </section>
  );
}
