'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* Casca do estúdio: marca a sub-tela atual na barra lateral. Esqueleto da fundação. */
export default function StudioShellEngine() {
  const path = usePathname() || '';
  useEffect(() => {
    const sub = ({ estudio: 'inicio', editor: 'editor', painel: 'painel', apresentar: 'apresentar', admin: 'admin' } as Record<string, string>)[path.replace(/^\/|\/$/g, '')];
    document.querySelectorAll<HTMLAnchorElement>('#v-studio .side-nav a[data-sub]').forEach(a => {
      if (a.dataset.sub === sub) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }, [path]);
  return null;
}
