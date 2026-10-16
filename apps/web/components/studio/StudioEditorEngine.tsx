'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';

/* Motores da tela (v-studio, sub-tela editor). Esqueleto da fundação: por enquanto liga só o Campo Halor. */
export default function StudioEditorEngine() {
  useEngine('v-studio', () => {
    const root = document.getElementById('v-studio') ?? document;
    return bootFields(root);
  }, 'editor');
  return null;
}
