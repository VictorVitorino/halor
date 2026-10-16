'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootStage } from '@/lib/engines/studio/stage';

/* Motores da sub-tela apresentar do Estúdio (v-studio): ligam ao montar a rota e desligam ao sair. */
export default function StudioStageEngine() {
  useEngine('v-studio', bootStage, 'apresentar');
  return null;
}
