/* Amostras de cor e escala da Cadeia Halor do manual.
   Porte de renderBrand() em prototype/src/js/70-brand.js, agora renderizado no servidor.
   Clicar numa amostra copia o código: o núcleo cuida de [data-copy-text] por delegação. */
import type { CSSProperties } from 'react';
import { CHAIN_STEPS } from '@/lib/data/chain';

type World = 'night' | 'paper';
/** nome, código, uso e a tinta que lê sobre a cor */
type Swatch = [name: string, hex: string, use: string, ink: string];

const SWATCHES: Record<World, Swatch[]> = {
  night: [
    ['Vazio', '#07040F', 'Chão do mundo Noite', '#ffffff'],
    ['Noite', '#0E0820', 'Superfícies e cartões', '#ffffff'],
    ['Crepúsculo', '#171030', 'Painéis elevados', '#ffffff'],
    ['Violeta Halor', '#8B3DFF', 'Ação principal · 5:1 com branco', '#ffffff'],
    ['Neon', '#A970FF', 'Violeta como texto no escuro', '#07040f'],
    ['Brilho', '#C9A6FF', 'Halos, foco e realces', '#07040f'],
    ['Lúmen', '#F4EEFF', 'Texto e núcleo do halo', '#07040f'],
  ],
  paper: [
    ['Papel', '#FFFFFF', 'Fundo do Estúdio', '#17112b'],
    ['Névoa', '#F8F6FE', 'Fundo do app', '#17112b'],
    ['Lilás 50', '#F3EEFF', 'Seleção e destaque suave', '#17112b'],
    ['Lilás 200', '#D9C7FF', 'Bordas de destaque', '#17112b'],
    ['Linha', '#E8E3F4', 'Divisórias', '#17112b'],
    ['Violeta 700', '#6421D1', 'Violeta como texto · 7,8:1', '#ffffff'],
    ['Grafite', '#4A4366', 'Texto de apoio', '#ffffff'],
    ['Tinta', '#17112B', 'Texto principal · 18:1', '#ffffff'],
  ],
};

/* Um matiz só, do primeiro passo ao último: no Papel escurece, na Noite acende. */
const CHAIN_COLORS: Record<World, string[]> = {
  paper: ['#C4A6FF', '#B08AFF', '#9C6CFF', '#8B4FFA', '#7A33EB', '#6420CC', '#4A11A0'],
  night: ['#5A35A8', '#7040D6', '#8752F5', '#9F70FF', '#B791FF', '#CFB3FF', '#E9DEFF'],
};

export function Swatches({ world }: { world: World }) {
  return (
    <div className="sw-grid" data-swatches={world}>
      {SWATCHES[world].map(([n, hex, use]) => (
        <button key={hex} className="sw" type="button" aria-label={`Copiar ${n} ${hex}`} data-copy-text={hex} data-copy-label={`${n} ${hex} copiado`}>
          <span className="sw-c" style={{ '--c': hex, ...(hex === '#FFFFFF' ? { boxShadow: 'inset 0 -1px 0 var(--line)' } : null) } as CSSProperties}>
            <em style={{ color: '#17112b' }}>Copiar</em>
          </span>
          <span className="sw-b">
            <b>{n}</b>
            <span>{hex}</span>
            <small>{use}</small>
          </span>
        </button>
      ))}
    </div>
  );
}

export function ChainScale({ world }: { world: World }) {
  const night = world === 'night';
  return (
    <div className={night ? 'chain-sw chain-night theme-night' : 'chain-sw'} data-chain={world}>
      {CHAIN_COLORS[world].map((hex, i) => {
        const ink = night ? (i <= 2 ? '#fff' : '#17112b') : (i <= 2 ? '#17112b' : '#fff');
        return (
          <div key={hex} style={{ '--c': hex, '--t': ink } as CSSProperties}>
            <b>{(i + 1) + ' · ' + CHAIN_STEPS[i].n}</b>
            <span>{hex}</span>
          </div>
        );
      })}
    </div>
  );
}
