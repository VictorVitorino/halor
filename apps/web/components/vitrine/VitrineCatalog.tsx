/* Catálogo dos 40 efeitos, já no estado inicial do filtro "Todos": 8 itens à mostra (o botão +,
   em Vitrine.tsx, mostra os outros ali mesmo). Cada item é um botão só com conteúdo de frase
   (spans) e uma prévia brincável; o nome acessível é o número e o nome do efeito, e o resumo,
   a dose e a instrução vão na descrição. Os que têm demonstração ao vivo levam até o card no
   palco. Ao lado do item fica o botão Editar efeito (EditButton). O invólucro .vt-item-rv entra
   no Scroll Reveal reversível (data-rv="card"); o li fica livre para o pulo do filtro. A marcação
   é a mesma que o protótipo gera em vtCatalog(); o motor (lib/engines/vitrine) liga filtro,
   prévias, cliques e o editor das prévias. */
import type { CSSProperties } from 'react';
import { VT_FX, VT_LIVE, VT_SHOW, type VtFx } from '@/lib/engines/vitrine/data';
import { vtMiniParts } from '@/lib/engines/vitrine/vt-minis';

function Item({ fx }: { fx: VtFx }) {
  const [n, name, fam, , dose, sum] = fx;
  const isLive = VT_LIVE.has(n);
  const mini = vtMiniParts(n);
  const id = 'vt-i' + n;
  return (
    <button className="vt-item" type="button" data-n={n} data-live={isLive ? '1' : undefined} aria-labelledby={`${id}-n ${id}-t`} aria-describedby={`${id}-s ${id}-h`}>
      <span className={mini.className} aria-hidden="true" data-k={mini.k} data-n={mini.n} data-s={mini.s} dangerouslySetInnerHTML={{ __html: mini.html }} />
      <span className="vt-item-top">
        <span className="vt-item-n" id={`${id}-n`}>{String(n).padStart(2, '0')}</span>
        <span className="vt-item-c">{fam}</span>
        {isLive && <span className="vt-live">Ao vivo</span>}
        <span className="vt-dose" aria-hidden="true">
          {[1, 2, 3].map(i => <i key={i} className={i <= dose ? 'on' : ''} />)}
        </span>
      </span>
      <span className="vt-item-t" id={`${id}-t`}>{name}</span>
      <span className="vt-item-s" id={`${id}-s`}>{sum}</span>
      <span className="sr-only" id={`${id}-h`}>{`Dose de movimento ${dose} de 3. ${isLive ? 'Ao vivo: leva à demonstração editável no palco.' : 'Clique para mexer na prévia.'}`}</span>
    </button>
  );
}

/* Editar efeito: irmão do botão do item (nunca dentro dele), numa faixa no pé do item. Nos ao vivo
   leva ao painel do card no palco; nos outros abre o editor da prévia (janela criada pelo motor). */
function EditButton({ fx }: { fx: VtFx }) {
  const [n, name] = fx;
  const isLive = VT_LIVE.has(n);
  return (
    <button className="btn btn-ghost btn-xs vt-edit vt-item-ed" type="button" data-n={n} aria-label={`Editar efeito: ${name}`} aria-haspopup={isLive ? undefined : 'dialog'}>
      <svg aria-hidden="true"><use href="#i-sliders" /></svg>
      <span>Editar efeito</span>
    </button>
  );
}

export default function VitrineCatalog() {
  return (
    <ul className="vt-cat" id="vt-cat" aria-label="Catálogo de efeitos">
      {VT_FX.map((fx, i) => (
        <li key={fx[0]} data-intents={fx[3]} hidden={i >= VT_SHOW}>
          <div className="vt-item-rv" data-rv="card" style={{ '--rv-i': i % 4 } as CSSProperties}>
            <Item fx={fx} />
            <EditButton fx={fx} />
          </div>
        </li>
      ))}
    </ul>
  );
}
