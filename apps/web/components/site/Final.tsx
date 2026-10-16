/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import Link from 'next/link';
export default function Final() {
  return (
    <section className="s-final">
      <canvas className="halo-field halor-field" data-field="final" aria-hidden="true" />
      <div className="wrap s-final-in">
        <h2 className="display">
          Seja visto.
          <br />
          Seja lembrado.
          <br />
          <span className="lux">Seja escolhido.</span>
        </h2>
        <div className="s-cta">
          <Link className="btn btn-lumen btn-lg" href="/assinar/?plano=faisca" data-plan="faisca" data-attract="">Começar grátis</Link>
          {' '}
          <Link className="btn btn-ghost btn-lg" href="/entrar" data-attract="">Já tenho conta</Link>
        </div>
        <p className="s-final-note mono">Plano Faísca grátis para sempre</p>
      </div>
    </section>
  );
}
