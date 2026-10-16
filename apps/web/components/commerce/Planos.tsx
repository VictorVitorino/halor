/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
export default function Planos() {
  return (
    <section className="s-sec" id="planos">
      <div className="wrap">
        <div className="s-head s-head-c">
          <p className="eyebrow">Planos</p>
          <h2 className="display">Escolha o tamanho da sua órbita.</h2>
          <div className="seg" role="group" aria-label="Ciclo de cobrança">
            <button type="button" aria-pressed="false" data-cycle="mensal">Mensal</button>
            {' '}
            <button type="button" aria-pressed="true" data-cycle="anual">
              Anual{' '}
              <span className="save">−20%</span>
            </button>
          </div>
        </div>
        <div className="plans" id="plans" />
        {/* PLANOS EMPRESARIAIS: pacotes de 20 e de 50 a 100 usuários */}
        <div className="ent" id="planos-empresas" role="region" aria-labelledby="ent-title">
          <div className="ent-head">
            <div className="ent-head-t">
              <p className="eyebrow">Planos empresariais</p>
              <h3 className="display" id="ent-title">Um pacote para o time inteiro prender a atenção.</h3>
            </div>
            <p className="ent-lede">
              Quando muita gente apresenta, cada reunião disputa o olhar de alguém. Os pacotes dão a todos o mesmo kit de marca, a mesma biblioteca de efeitos e um painel para ver onde a plateia se envolve. E o preço por pessoa cai.
            </p>
          </div>
          <div className="ent-grid" id="ent-plans" />
          <div className="ent-more">
            <span className="ent-more-ic" aria-hidden="true">
              <svg>
                <use href="#i-share" />
              </svg>
            </span>
            <p>
              <b>Mais de 100 pessoas?</b>
              {' '}O plano Constelação monta um ambiente dedicado, com auditoria e suporte com SLA.
            </p>
            <button className="btn btn-ghost btn-sm" type="button" data-sales="">
              Falar com vendas{' '}
              <svg aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </button>
          </div>
        </div>
        <p className="plans-note muted">Preços em reais. Cancele quando quiser. Garantia de 7 dias nos planos pagos.</p>
      </div>
    </section>
  );
}
