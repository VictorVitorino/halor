/* Catálogo dos 40 efeitos, já no estado inicial do filtro "Todos": 8 itens à mostra
   e a pílula "+ 32 efeitos" que leva à escolha do plano. A marcação é a mesma que o
   protótipo gerava em vtCatalog(); o motor (lib/engines/vitrine) liga filtro e cliques. */
import Link from 'next/link';
import { VT_FX, VT_LIVE, VT_SHOW, vtPlusLabel, vtPlusText, type VtFx } from '@/lib/engines/vitrine/data';

function Item({ fx }: { fx: VtFx }) {
  const [n, name, fam, , dose, sum] = fx;
  const isLive = VT_LIVE.has(n);
  const body = (
    <>
      <div className="vt-item-top">
        <span className="vt-item-n">{String(n).padStart(2, '0')}</span>
        <span className="vt-item-c">{fam}</span>
        {isLive && <span className="vt-live">Ao vivo</span>}
        <span className="vt-dose" role="img" aria-label={`Dose de movimento ${dose} de 3`}>
          {[1, 2, 3].map(i => <i key={i} className={i <= dose ? 'on' : undefined} />)}
        </span>
      </div>
      <p className="vt-item-t">{name}</p>
      <p className="vt-item-s">{sum}</p>
    </>
  );
  return isLive ? (
    <button className="vt-item" type="button">
      {body}
      <span className="sr-only">Ir para a demonstração ao vivo.</span>
    </button>
  ) : (
    <div className="vt-item">{body}</div>
  );
}

export default function VitrineCatalog() {
  const total = VT_FX.length;
  return (
    <>
      <ul className="vt-cat" id="vt-cat" aria-label="Catálogo de efeitos">
        {VT_FX.map((fx, i) => (
          <li key={fx[0]} data-intents={fx[3]} hidden={i >= VT_SHOW}>
            <Item fx={fx} />
          </li>
        ))}
      </ul>
      <Link className="vt-plus-pill" href="/assinar" aria-label={vtPlusLabel(total)} hidden={total <= VT_SHOW}>
        <span aria-hidden="true">+</span>
        <b>{vtPlusText(total)}</b>
      </Link>
    </>
  );
}
