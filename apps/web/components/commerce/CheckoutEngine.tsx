'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';
import { bootCheckout } from '@/lib/engines/commerce/checkout';

/* Motores do checkout (v-checkout): o Campo Halor do resumo e o checkout com cálculo ao vivo.
   O plano, as pessoas e o ciclo chegam pela URL (/assinar/?plano=…&pessoas=…&ciclo=…), lidos no motor. */
export default function CheckoutEngine() {
  useEngine('v-checkout', () => {
    const root = document.getElementById('v-checkout') ?? document;
    const offFields = bootFields(root);
    const offCheckout = bootCheckout();
    return () => { offCheckout(); offFields(); };
  });
  return null;
}
