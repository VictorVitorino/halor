'use client';
import { useRouter } from 'next/navigation';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';
import { bootAuth } from '@/lib/engines/commerce/auth';

/* Motores da tela de entrada (v-auth): o Campo Halor da cena e o fluxo de acesso com o olho que observa.
   Depois do login o roteador leva ao estúdio sem recarregar, e o toast (no layout) continua à vista. */
export default function AuthEngine() {
  const router = useRouter();
  useEngine('v-auth', () => {
    const root = document.getElementById('v-auth') ?? document;
    const offFields = bootFields(root);
    const offAuth = bootAuth(path => router.push(path));
    return () => { offAuth(); offFields(); };
  });
  return null;
}
