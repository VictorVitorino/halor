'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';

/* Motores da tela (v-404). Esqueleto da fundação: por enquanto liga só o Campo Halor. */
export default function NotFoundEngine() {
  useEngine('v-404', () => {
    const root = document.getElementById('v-404') ?? document;
    return bootFields(root);
  });
  return null;
}
