'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootAdmin } from '@/lib/engines/studio/admin';

/* Motores da sub-tela admin do Estúdio (v-studio): ligam ao montar a rota e desligam ao sair. */
export default function StudioAdminEngine() {
  useEngine('v-studio', bootAdmin, 'admin');
  return null;
}
