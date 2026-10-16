'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { arrived, setNavigator } from '@/lib/engines/studio/nav';
import { bootShell, closeSide } from '@/lib/engines/studio/shell';

const SUBS: Record<string, string> = { estudio: 'inicio', editor: 'editor', painel: 'painel', apresentar: 'apresentar', admin: 'admin' };

/* Casca do Estúdio: liga a barra lateral, a busca, as notificações, os atalhos gerais e os modais,
   entrega o roteador aos motores e marca a sub-tela atual a cada troca de rota. */
export default function StudioShellEngine() {
  const path = usePathname() || '';
  const router = useRouter();
  useEffect(() => { setNavigator(href => router.push(href)); return () => setNavigator(null); }, [router]);
  useEffect(() => bootShell(), []);
  useEffect(() => {
    const sub = SUBS[path.replace(/^\/|\/$/g, '')];
    document.querySelectorAll<HTMLAnchorElement>('#v-studio .side-nav a[data-sub]').forEach(a => {
      if (a.dataset.sub === sub) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    closeSide();
    arrived();
  }, [path]);
  return null;
}
