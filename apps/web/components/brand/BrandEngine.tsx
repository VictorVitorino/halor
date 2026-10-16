'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';

/* Motores da tela (v-brand). Esqueleto da fundação: por enquanto liga só o Campo Halor. */
export default function BrandEngine() {
  useEngine('v-brand', () => {
    const root = document.getElementById('v-brand') ?? document;
    return bootFields(root);
  });
  return null;
}
