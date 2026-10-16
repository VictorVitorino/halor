/* ==========================================================================
   O EFEITO HALOR · os ícones se desenham e a tipografia entra quando a seção
   aparece. Com movimento reduzido tudo já chega pronto.
   Porte de prototype/src/js/36-produto.js (bootEfeitoFx).
   ========================================================================== */
import { $, REDUCED } from '@/lib/core';
import type { Dispose } from './produto';

const noop: Dispose = () => {};

export function bootEfeitoFx(root: ParentNode): Dispose {
  const sec = $('#efeito', root), grid = sec && $('.sci-grid', sec);
  /* já entrou (ex.: o motor religou depois de uma edição em dev): não repete */
  if (!sec || !grid || REDUCED || sec.classList.contains('fx-go')) return noop;
  sec.classList.add('fx-pre');
  const io = new IntersectionObserver((es, o) => {
    if (!es[0].isIntersecting) return;
    sec.classList.add('fx-go'); sec.classList.remove('fx-pre'); o.disconnect();
  }, { threshold: .25 });
  io.observe(grid);
  return () => { io.disconnect(); sec.classList.remove('fx-pre'); };
}
