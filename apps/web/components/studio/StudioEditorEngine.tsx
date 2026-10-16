'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootEditor } from '@/lib/engines/studio/editor';

/* Motores da sub-tela editor do Estúdio (v-studio): ligam ao montar a rota e desligam ao sair. */
export default function StudioEditorEngine() {
  useEngine('v-studio', bootEditor, 'editor');
  return null;
}
