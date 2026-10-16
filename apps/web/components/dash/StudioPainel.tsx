/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
export default function StudioPainel() {
  return (
    <section className="sub" data-subview="painel" aria-label="Painel Halor">
      <div className="st-pad">
        <div className="sec-h sec-h-top">
          <div>
            <p className="eyebrow">Painel Halor</p>
            <h1 className="st-h1">Onde o olhar ficou</h1>
          </div>
          <div className="seg" role="group" aria-label="Comparar períodos">
            <button type="button" aria-pressed="false" data-dash-mode="antes">Antes do Halor</button>
            <button type="button" aria-pressed="true" data-dash-mode="com">Com Halor</button>
          </div>
        </div>
        <div className="filters" role="group" aria-label="Filtros">
          <label className="flt">
            <span>Período</span>
            <select className="select">
              <option>Últimos 90 dias</option>
              <option>Últimos 30 dias</option>
              <option>Últimos 7 dias</option>
              <option>Este ano</option>
            </select>
          </label>
          {' '}
          <label className="flt">
            <span>Área</span>
            <select className="select">
              <option>Todas as áreas</option>
              <option>Treinamento</option>
              <option>Eventos</option>
              <option>Produto</option>
            </select>
          </label>
          {' '}
          <label className="flt">
            <span>Pessoa</span>
            <select className="select">
              <option>Todo o time</option>
              <option>Marina Costa</option>
              <option>Rafael Lima</option>
            </select>
          </label>
          {' '}
          <label className="flt">
            <span>Apresentação</span>
            <select className="select">
              <option>Todas</option>
              <option>Kickoff 2027</option>
            </select>
          </label>
        </div>
        <div className="dash" data-dash="app" />
        <p className="dash-note mono">Dados ilustrativos · time de exemplo com 100 apresentações por mês</p>
      </div>
    </section>
  );
}
