/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines.
   Links internos usam next/link (navegação sem recarregar, como a troca de tela do protótipo). */
import Link from 'next/link';

export default function CheckoutView() {
  return (
    <>
    <header className="co-top">
      <div className="wrap co-top-in">
        <Link className="logo" href="/">
          <svg aria-hidden="true">
            <use href="#hl-mark-paper" />
          </svg>
          <span className="wordmark">halor</span>
        </Link>
        <ol className="steps" aria-label="Etapas da assinatura">
          <li className="done">
            <i>1</i>
            <span>Plano</span>
          </li>
          <li className="on" aria-current="step">
            <i>2</i>
            <span>Pagamento</span>
          </li>
          <li>
            <i>3</i>
            <span>Pronto</span>
          </li>
        </ol>
        <span className="chip chip-line co-secure">
          <svg aria-hidden="true">
            <use href="#i-shield" />
          </svg>
          {' '}Pagamento protegido
        </span>
      </div>
    </header>
    <main className="wrap co-main" id="co-form-wrap">
      <form className="co-grid" id="f-checkout" noValidate>
        <div className="co-left">
          <section className="co-sec">
            <div className="co-sec-h">
              <h2>Escolha o plano</h2>
              <div className="seg" role="group" aria-label="Ciclo de cobrança">
                <button type="button" aria-pressed="false" data-cycle="mensal">Mensal</button>
                <button type="button" aria-pressed="true" data-cycle="anual">
                  Anual{' '}
                  <span className="save">−20%</span>
                </button>
              </div>
            </div>
            <div className="tabs co-aud" role="tablist" aria-label="Para quem é o plano">
              <button type="button" role="tab" id="co-aud-time" aria-selected="true" aria-controls="co-plans-panel" data-aud="time">
                <svg aria-hidden="true">
                  <use href="#i-target" />
                </svg>
                Você e seu time
              </button>
              {' '}
              <button type="button" role="tab" id="co-aud-empresa" aria-selected="false" aria-controls="co-plans-panel" tabIndex={-1} data-aud="empresa">
                <svg aria-hidden="true">
                  <use href="#i-users" />
                </svg>
                Empresas{' '}
                <span className="co-aud-n">20 a 100 pessoas</span>
              </button>
            </div>
            <div className="co-plans-panel" id="co-plans-panel" role="tabpanel" aria-labelledby="co-aud-time">
              <div className="co-plans" id="co-plans" role="radiogroup" aria-label="Plano" />
              <button className="co-more" type="button" id="co-more" data-sales="" hidden>
                <span className="cp-n">
                  <svg aria-hidden="true">
                    <use href="#i-share" />
                  </svg>
                  Constelação
                </span>
                {' '}
                <span className="co-more-p">Mais de 100 pessoas</span>
                {' '}
                <span className="co-more-l">
                  Falar com vendas{' '}
                  <svg aria-hidden="true">
                    <use href="#i-arrow" />
                  </svg>
                </span>
              </button>
            </div>
            <div className="co-seats" id="co-seats" hidden>
              <div className="co-seats-t">
                <p className="label" id="seats-label">Pessoas no time</p>
                <p className="hint" id="seats-hint">Mínimo de 3 no plano Órbita</p>
              </div>
              <div className="stepper" data-seat-ctl="stepper" role="group" aria-labelledby="seats-label">
                <button type="button" className="btn-icon" data-seat="-1" aria-label="Remover pessoa">
                  <svg aria-hidden="true">
                    <use href="#i-minus" />
                  </svg>
                </button>
                <output id="seats" className="num" aria-live="polite">5</output>
                <button type="button" className="btn-icon" data-seat="1" aria-label="Adicionar pessoa">
                  <svg aria-hidden="true">
                    <use href="#i-plus" />
                  </svg>
                </button>
              </div>
              <p className="seat-fixed" data-seat-ctl="fixed">
                <svg aria-hidden="true">
                  <use href="#i-lock" />
                </svg>
                <b className="num">20</b>
                {' '}pessoas
              </p>
              <div className="co-range" data-seat-ctl="range" id="co-range" />
              <p className="co-tip" id="co-tip" hidden>
                <svg aria-hidden="true">
                  <use href="#i-spark" />
                </svg>
                <span />
                <button className="link" type="button" id="co-tip-go" />
              </p>
            </div>
            <div className="co-mini" id="co-mini">
              <span>Total hoje</span>
              <b className="num" id="co-mini-total">R$ 0,00</b>
              <button className="link" type="button" id="co-mini-go">Ver resumo</button>
            </div>
          </section>
          <section className="co-sec">
            <h2>Seus dados</h2>
            <div className="co-fields">
              <div className="field">
                <label htmlFor="c-nome">Nome completo</label>
                <input className="input" id="c-nome" autoComplete="name" defaultValue="Marina Costa" />
              </div>
              <div className="field">
                <label htmlFor="c-email" id="c-email-l">E-mail de cobrança</label>
                <input className="input" id="c-email" type="email" autoComplete="email" defaultValue="financeiro@nortesistemas.com.br" />
              </div>
              <div className="field" data-paid="">
                <label htmlFor="c-doc">CPF ou CNPJ</label>
                <input className="input" id="c-doc" inputMode="numeric" defaultValue="12.345.678/0001-90" maxLength={18} />
              </div>
              <div className="field" data-paid="">
                <label htmlFor="c-cep">CEP</label>
                <input className="input" id="c-cep" inputMode="numeric" autoComplete="postal-code" defaultValue="04538-132" maxLength={9} />
              </div>
            </div>
          </section>
          <section className="co-sec" id="co-sec-pay">
            <h2>Forma de pagamento</h2>
            <div className="pay-tabs" role="tablist" aria-label="Forma de pagamento">
              <button type="button" role="tab" id="pay-tab-pix" aria-selected="true" aria-controls="pay-pix" data-pay="pix">
                <svg aria-hidden="true">
                  <use href="#i-pix" />
                </svg>
                <span>Pix</span>
                <small>aprovação na hora</small>
              </button>
              {' '}
              <button type="button" role="tab" id="pay-tab-cartao" aria-selected="false" aria-controls="pay-cartao" tabIndex={-1} data-pay="cartao">
                <svg aria-hidden="true">
                  <use href="#i-card" />
                </svg>
                <span>Cartão</span>
                <small>até 12x no anual</small>
              </button>
              {' '}
              <button type="button" role="tab" id="pay-tab-boleto" aria-selected="false" aria-controls="pay-boleto" tabIndex={-1} data-pay="boleto">
                <svg aria-hidden="true">
                  <use href="#i-barcode" />
                </svg>
                <span>Boleto</span>
                <small>compensa em até 2 dias</small>
              </button>
            </div>
            <div className="pay-panel" id="pay-pix" data-pay-panel="pix" role="tabpanel" aria-labelledby="pay-tab-pix">
              <div className="pix">
                <div className="pix-qr-wrap">
                  <div className="pix-qr" id="pix-qr" role="img" aria-label="QR Code Pix ilustrativo, gerado ao confirmar" />
                  <span className="pix-qr-lock">
                    <svg aria-hidden="true">
                      <use href="#i-lock" />
                    </svg>
                    Gerado ao confirmar
                  </span>
                </div>
                <div className="pix-info">
                  <p>
                    <b>Escaneie com o app do seu banco</b>
                  </p>
                  <p className="muted">
                    Ao confirmar, o QR Code é gerado para o valor exato. Pague por ele ou pelo código copia e cola em até 30 minutos: a assinatura ativa assim que o Pix cai.
                  </p>
                  <div className="pix-code">
                    <span className="mono" id="pix-code">00020126580014br.gov.bcb.pix0136halor-demo…</span>
                    <button className="btn btn-ghost btn-xs" type="button" data-copy="#pix-code">
                      <svg aria-hidden="true">
                        <use href="#i-copy" />
                      </svg>
                      {' '}Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="pay-panel" id="pay-cartao" data-pay-panel="cartao" role="tabpanel" aria-labelledby="pay-tab-cartao" hidden>
              <div className="card-grid">
                <div className="cc" id="cc" aria-hidden="true">
                  <div className="cc-glow" />
                  <div className="cc-top">
                    <svg className="cc-mark">
                      <use href="#hl-mark" />
                    </svg>
                    <span className="cc-brand mono" id="cc-brand">CARTÃO</span>
                  </div>
                  <p className="cc-num mono" id="cc-num">•••• •••• •••• ••••</p>
                  <div className="cc-bot">
                    <div>
                      <small>Nome</small>
                      <span id="cc-name">MARINA COSTA</span>
                    </div>
                    <div>
                      <small>Validade</small>
                      <span id="cc-exp">MM/AA</span>
                    </div>
                  </div>
                </div>
                <div className="co-fields co-fields-1">
                  <div className="field">
                    <label htmlFor="k-num">Número do cartão</label>
                    <input className="input mono" id="k-num" inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000 0000" maxLength={19} />
                  </div>
                  <div className="field">
                    <label htmlFor="k-name">Nome impresso</label>
                    <input className="input" id="k-name" autoComplete="off" defaultValue="Marina Costa" />
                  </div>
                  <div className="co-fields co-fields-3">
                    <div className="field">
                      <label htmlFor="k-exp">Validade</label>
                      <input className="input mono" id="k-exp" inputMode="numeric" autoComplete="off" placeholder="MM/AA" maxLength={5} />
                    </div>
                    <div className="field">
                      <label htmlFor="k-cvv">CVV</label>
                      <input className="input mono" id="k-cvv" inputMode="numeric" autoComplete="off" placeholder="123" maxLength={4} />
                    </div>
                    <div className="field">
                      <label htmlFor="k-parc">Parcelas sem juros</label>
                      <select className="select" id="k-parc">
                        <option>1x sem juros</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pay-panel" id="pay-boleto" data-pay-panel="boleto" role="tabpanel" aria-labelledby="pay-tab-boleto" hidden>
              <p className="boleto-note">
                <svg aria-hidden="true">
                  <use href="#i-barcode" />
                </svg>
                {' '}O boleto é gerado depois de confirmar e enviado para o e-mail de cobrança. A conta fica ativa por 3 dias enquanto ele compensa.
              </p>
            </div>
          </section>
        </div>
        <aside className="co-sum" id="co-sum" aria-label="Resumo da assinatura">
          <div className="sum-card theme-night">
            <canvas className="halo-field halor-field" data-field="sum" aria-hidden="true" />
            <p className="eyebrow">Resumo</p>
            <div className="sum-plan">
              <svg aria-hidden="true">
                <use href="#hl-mark" />
              </svg>
              <div>
                <p className="sum-name display" id="sum-name">Halo</p>
                <p className="sum-cycle muted" id="sum-cycle">Anual · cobrado uma vez por ano</p>
              </div>
            </div>
            <p className="sum-pack" id="sum-pack" hidden>
              <svg aria-hidden="true">
                <use href="#i-users" />
              </svg>
              <span />
            </p>
            <dl className="sum-lines">
              <div>
                <dt id="sum-l1">Plano Halo × 12 meses</dt>
                <dd className="num" id="sum-sub">R$ 828,00</dd>
              </div>
              <div className="sum-disc" id="sum-disc-row">
                <dt>Desconto anual (20%)</dt>
                <dd className="num" id="sum-disc">− R$ 165,60</dd>
              </div>
              <div className="sum-coupon-row" id="sum-coupon-row" hidden>
                <dt>
                  Cupom{' '}
                  <span id="sum-coupon-name" />
                </dt>
                <dd className="num" id="sum-coupon">− R$ 0,00</dd>
              </div>
            </dl>
            <div className="coupon" id="coupon">
              <input className="input" id="c-cupom" placeholder="Cupom de desconto" aria-label="Cupom de desconto" defaultValue="PRIMEIROOLHAR" autoComplete="off" spellCheck={false} />
              <button className="btn btn-ghost btn-sm" type="button" id="c-cupom-ok">Aplicar</button>
            </div>
            <div className="sum-total">
              <span>Total hoje</span>
              <b className="num" id="sum-total">R$ 662,40</b>
            </div>
            <p className="sum-per muted" id="sum-per">equivale a R$ 55,20 por mês</p>
            <button className="btn btn-primary btn-lg btn-block" type="submit" id="co-submit">Assinar agora</button>
            <ul className="sum-trust" data-trust="paid">
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                Cancele quando quiser
              </li>
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                7 dias de garantia
              </li>
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                Nota fiscal automática
              </li>
            </ul>
            <ul className="sum-trust" data-trust="free" hidden>
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                3 apresentações ativas para começar
              </li>
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                Grátis para sempre no Faísca
              </li>
              <li>
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                Mude de plano quando quiser
              </li>
            </ul>
          </div>
          <p className="demo-note">
            <svg aria-hidden="true">
              <use href="#i-alert" />
            </svg>
            {' '}Ambiente de demonstração. Nenhum pagamento é processado e nada é enviado.
          </p>
        </aside>
      </form>
      <section className="co-done" id="co-done" hidden aria-live="polite">
        <div className="done-halo" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <use href="#hl-mark-paper" />
          </svg>
          <i />
          <i />
          <i />
        </div>
        <p className="eyebrow" id="done-eyebrow">Assinatura ativa</p>
        <h1 className="display" id="done-title" tabIndex={-1}>Bem-vindo à órbita.</h1>
        <p className="lede" id="done-msg">Seu plano Halo está ativo. Mandamos o recibo para o seu e-mail.</p>
        <div className="s-cta">
          <Link className="btn btn-primary btn-lg" href="/estudio">
            Abrir o Estúdio{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </Link>
          <Link className="btn btn-ghost btn-lg" href="/admin" id="co-invite" hidden>
            <svg aria-hidden="true">
              <use href="#i-users" />
            </svg>
            {' '}Convidar o time
          </Link>
          <button className="btn btn-ghost btn-lg" type="button" id="co-again">Ver o checkout de novo</button>
        </div>
      </section>
    </main>
    </>
  );
}
