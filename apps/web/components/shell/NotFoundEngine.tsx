'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';

/* Motores da tela (v-404): o Campo Halor em volta do 4·4. A tela não tem outro comportamento. */
export default function NotFoundEngine() {
  useEngine('v-404', () => {
    const root = document.getElementById('v-404');
    return root ? bootFields(root) : undefined;
  });
  return null;
}
