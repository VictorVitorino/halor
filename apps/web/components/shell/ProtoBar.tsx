'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import ProtoNav from './ProtoNav';

/* Barra "Protótipo": atalho para todas as telas enquanto o produto está em revisão.
   Some com NEXT_PUBLIC_HIDE_PROTO=1. Marca a tela atual e recolhe no editor. */
export default function ProtoBar() {
  const path = usePathname() || '/';
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nav = box.current?.querySelector<HTMLElement>('.proto'); if (!nav) return;
    const key = path.replace(/^\/|\/$/g, '') || 'site';
    nav.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach(a => {
      if (a.dataset.route === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const cur = nav.querySelector<HTMLElement>('a[aria-current="page"]'), pb = cur?.parentElement;
    if (cur && pb && pb.scrollWidth > pb.clientWidth) {
      const l = cur.offsetLeft, r = l + cur.offsetWidth;
      if (l < pb.scrollLeft) pb.scrollLeft = l - 8; else if (r > pb.scrollLeft + pb.clientWidth) pb.scrollLeft = r - pb.clientWidth + 8;
    }
    nav.classList.remove('peek');
    if (key !== 'editor') return;
    const t = setTimeout(() => nav.classList.add('peek'), 1200);
    return () => clearTimeout(t);
  }, [path]);
  if (process.env.NEXT_PUBLIC_HIDE_PROTO === '1') return null;
  return <div ref={box} style={{ display: 'contents' }}><ProtoNav /></div>;
}
