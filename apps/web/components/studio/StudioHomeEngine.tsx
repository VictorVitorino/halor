'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootHome } from '@/lib/engines/studio/home';

/* Motores da sub-tela inicio do Estúdio (v-studio): ligam ao montar a rota e desligam ao sair. */
export default function StudioHomeEngine() {
  useEngine('v-studio', bootHome, 'inicio');
  return null;
}
