'use client';
import { useEffect } from 'react';
import { initCore } from '@/lib/core';

/** Comportamentos globais (copiar, toast, modais, senha, barra do site) instalados uma vez por sessão. */
export default function CoreRuntime() {
  useEffect(() => initCore(), []);
  return null;
}
