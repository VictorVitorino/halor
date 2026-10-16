'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';

/* Motores da tela (v-checkout). Esqueleto da fundação: por enquanto liga só o Campo Halor. */
export default function CheckoutEngine() {
  useEngine('v-checkout', () => {
    const root = document.getElementById('v-checkout') ?? document;
    return bootFields(root);
  });
  return null;
}
