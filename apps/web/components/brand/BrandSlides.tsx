/* Modelos de slide do manual, desenhados pelo mesmo renderizador do Estúdio.
   Porte do trecho de renderPreviews() em prototype/src/js/50-studio.js que preenchia #apl-slides,
   agora renderizado no servidor (slideHTML devolve só texto). */
import { slideHTML, type Slide } from '@/lib/slides';

const MODELS: Slide[] = [
  { type: 'cover', k: 'Modelo · capa', h: 'Faça cada olhar render.', sub: 'Halor · manual da marca' },
  { type: 'kpi', k: 'Modelo · número', h: 'Um destaque por slide.', big: '50ms', cap: 'para o cérebro julgar um visual', bars: [[41, 'Antes'], [52, 'M1'], [61, 'M2'], [68, 'M3']] },
  { type: 'poll', k: 'Modelo · votação', h: 'A plateia escolhe o rumo.', opts: [['Atenção', 21], ['Interação', 34], ['Memória', 12]], code: 'H24' },
];

const HTML = MODELS.map((s, i) => slideHTML(s, i + 1, 'halor')).join('');

export default function BrandSlides() {
  return <div className="apl-slides" id="apl-slides" dangerouslySetInnerHTML={{ __html: HTML }} />;
}
