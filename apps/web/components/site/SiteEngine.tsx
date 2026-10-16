'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';

/* Motores da tela (v-site). Esqueleto da fundação: por enquanto liga só o Campo Halor. */
export default function SiteEngine() {
  useEngine('v-site', () => {
    const root = document.getElementById('v-site') ?? document;
    return bootFields(root);
  });
  return null;
}
