/* Catálogo dos 40 efeitos, já no estado inicial do filtro "Todos": 8 itens à mostra (o botão +,
   em Vitrine.tsx, mostra os outros ali mesmo). Cada item é um botão com uma prévia brincável;
   os que têm demonstração ao vivo levam até o card no palco. A marcação é a mesma que o
   protótipo gera em vtCatalog(); o motor (lib/engines/vitrine) liga filtro, prévias e cliques. */
import { VT_FX, VT_LIVE, VT_SHOW, type VtFx } from '@/lib/engines/vitrine/data';
import { vtMiniParts } from '@/lib/engines/vitrine/vt-minis';

function Item({ fx }: { fx: VtFx }) {
  const [n, name, fam, , dose, sum] = fx;
  const isLive = VT_LIVE.has(n);
  const mini = vtMiniParts(n);
  return (
    <button className="vt-item" type="button" data-n={n} data-live={isLive ? '1' : undefined}>
      <div className={mini.className} aria-hidden="true" data-k={mini.k} data-n={mini.n} data-s={mini.s} dangerouslySetInnerHTML={{ __html: mini.html }} />
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
      <span className="sr-only">{isLive ? 'Ir para a demonstração ao vivo e editável.' : 'Clique para mexer na prévia.'}</span>
    </button>
  );
}

export default function VitrineCatalog() {
  return (
    <ul className="vt-cat" id="vt-cat" aria-label="Catálogo de efeitos">
      {VT_FX.map((fx, i) => (
        <li key={fx[0]} data-intents={fx[3]} hidden={i >= VT_SHOW}>
          <Item fx={fx} />
        </li>
      ))}
    </ul>
  );
}
