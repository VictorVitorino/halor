'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootBrand } from '@/lib/engines/brand';

/* Motores da tela (v-brand): índice, demonstrações de movimento e Campos Halor. */
export default function BrandEngine() {
  useEngine('v-brand', () => {
    const root = document.getElementById('v-brand');
    return root ? bootBrand(root) : undefined;
  });
  return null;
}
