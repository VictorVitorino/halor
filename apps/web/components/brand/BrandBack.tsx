'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* Voltar: leva de volta ao Estúdio quando o manual foi aberto de lá; de qualquer outro lugar, ao site.
   O protótipo sabia a tela anterior pelo roteador; aqui a origem vem do histórico da aba
   (Navigation API, com recuo para document.referrer). Antes de montar vale "Site", igual ao servidor. */
const STUDIO_PATH = /^\/(estudio|editor|painel|apresentar|admin)\/?$/;

interface NavEntryLike { url: string | null; index: number }
interface NavigationLike { currentEntry: NavEntryLike | null; entries(): NavEntryLike[] }

function previousPath(): string | null {
  const here = location.pathname;
  const pathOf = (url: string | null) => {
    if (!url) return null;
    try { const u = new URL(url); return u.origin === location.origin ? u.pathname : null; } catch { return null; }
  };
  const nav = (window as unknown as { navigation?: NavigationLike }).navigation;
  if (nav?.currentEntry) {
    const list = nav.entries();
    /* pula as entradas do próprio manual (âncoras do índice) */
    for (let i = nav.currentEntry.index - 1; i >= 0; i--) {
      const p = pathOf(list[i]?.url ?? null);
      if (p !== here) return p;
    }
    return null;
  }
  return pathOf(document.referrer || null);
}

export default function BrandBack() {
  const [studio, setStudio] = useState(false);
  useEffect(() => {
    const p = previousPath();
    setStudio(!!p && STUDIO_PATH.test(p));
  }, []);
  return (
    <Link className="btn btn-quiet btn-sm" href={studio ? '/estudio' : '/'} id="b-back">
      <svg aria-hidden="true">
        <use href="#i-back" />
      </svg>
      {' '}
      <span>{studio ? 'Estúdio' : 'Site'}</span>
    </Link>
  );
}
