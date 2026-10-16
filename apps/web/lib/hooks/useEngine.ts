'use client';
import { useEffect } from 'react';
import { enterView, leaveView } from '../core';

export type Dispose = void | (() => void);

/**
 * Liga os motores de uma tela quando ela monta e desliga quando sai.
 * Os motores trabalham sobre a marcação já renderizada (por id e data-*),
 * devem ser idempotentes e devolver a limpeza (no modo estrito o React monta duas vezes em dev).
 */
export function useEngine(view: string, boot: () => Dispose, sub: string | null = null) {
  useEffect(() => {
    enterView(view, sub);
    const dispose = boot();
    return () => { if (typeof dispose === 'function') dispose(); leaveView(view); };
    // a tela e a sub-tela definem o ciclo; boot é estável por arquivo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, sub]);
}
