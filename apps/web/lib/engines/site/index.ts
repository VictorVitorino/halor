/* ==========================================================================
   SITE · motores da página inicial (fora o filme, a vitrine e os planos,
   que têm motores próprios). Porte de prototype/src/js/36-produto.js.
   Cada parte devolve a própria limpeza; bootSite junta todas.
   ========================================================================== */
import { bootEfeitoFx } from './efeito';
import { bootEvo } from './evo';
import { bootCarousel, bootGain, bootRec, type Dispose } from './produto';

export type { Dispose } from './produto';

export function bootSite(root: ParentNode): Dispose {
  const ds: Dispose[] = [bootCarousel(root), bootEvo(root), bootEfeitoFx(root), bootGain(root), bootRec(root)];
  return () => { for (const d of ds.reverse()) d(); };
}
