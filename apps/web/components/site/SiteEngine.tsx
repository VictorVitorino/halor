'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFields } from '@/lib/engines/particles';
import { bootSite } from '@/lib/engines/site';

/* Motores da tela (v-site): o Campo Halor da capa e do fechamento, o Produto
   (carrossel, gravação do Estúdio), a Linha do tempo e a entrada do Efeito.
   O filme, a vitrine e os planos ligam os próprios motores. */
export default function SiteEngine() {
  useEngine('v-site', () => {
    const root = document.getElementById('v-site') ?? document;
    const disposers = [bootFields(root), bootSite(root)];
    return () => { for (const d of disposers) d(); };
  });
  return null;
}
