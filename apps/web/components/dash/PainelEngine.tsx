'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootDash } from '@/lib/engines/dash';

/* Motores da sub-tela Painel (v-studio · painel): gráficos, filtros e a troca antes/com Halor. */
export default function PainelEngine() {
  useEngine('v-studio', () => {
    const scope = document.querySelector<HTMLElement>('#v-studio .sub[data-subview="painel"]');
    return scope ? bootDash(scope) : undefined;
  }, 'painel');
  return null;
}
