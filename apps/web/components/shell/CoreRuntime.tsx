'use client';
import { useEffect } from 'react';
import { initCore } from '@/lib/core';

/** Comportamentos globais (copiar, toast, modais, senha, barra do site) instalados uma vez por sessão.
    Marca o <html> com data-hydrated quando o React assume a página (sinal para testes automatizados). */
export default function CoreRuntime() {
  useEffect(() => {
    const off = initCore();
    const raf = requestAnimationFrame(() => { document.documentElement.dataset.hydrated = '1'; });
    return () => { cancelAnimationFrame(raf); off(); };
  }, []);
  return null;
}
