/* ==========================================================================
   Estúdio · utilitários compartilhados pelas sub-telas.
   Porte de prototype/src/js/50-studio.js ("Utilitários do Estúdio").
   Nada aqui toca em window, document ou navigator no carregamento do módulo:
   plataforma e toque são lidos na hora do uso.
   ========================================================================== */
import { $$, currentSub, currentView } from '@/lib/core';

export const plainText = (h: string) => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent || ''; };
export const fold = (t: unknown) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const slugify = (t: string) => fold(t).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'apresentacao';
export const clampN = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

let mac: boolean | null = null;
/** Mac, iPhone ou iPad: o modificador dos atalhos vira ⌘. Calculado no primeiro uso. */
export const isMac = () => (mac ??= /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
export const modKey = (e: KeyboardEvent | MouseEvent) => (isMac() ? e.metaKey : e.ctrlKey);
export const MOD = () => (isMac() ? '⌘' : 'Ctrl+');
export const touch = () => matchMedia('(hover: none) and (pointer: coarse)').matches;

export const typingIn = (t: EventTarget | null) =>
  t instanceof Element && (!!t.closest('input, textarea, select') || (t as HTMLElement).isContentEditable === true);
/** A sub-tela do estúdio está à vista ('inicio', 'editor', 'apresentar', 'admin', 'painel'). */
export const studioOpen = (sub: string) => currentView === 'v-studio' && currentSub === sub;
export const modalOpen = () => $$('.modal').some(m => !m.hidden);
export const hhmm = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
/** Equivalente local do invalid() de 60-auth.js: marca ou desmarca um campo com erro. */
export const invalid = (input: Element | null, on: boolean) => { if (input) input.setAttribute('aria-invalid', String(!!on)); };
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** No Mac, os atalhos escritos com Ctrl passam a mostrar ⌘ (idempotente). */
export function applyMod(root: ParentNode = document) {
  if (!isMac()) return;
  $$('[data-mod]', root).forEach(n => { n.textContent = '⌘'; });
  $$('[title*="Ctrl+"]', root).forEach(n => { n.title = n.title.replace(/Ctrl\+/g, '⌘'); });
}

/** Escopo de uma tela ligada: ouvintes com AbortController e temporizadores que a limpeza cancela. */
export interface Scope {
  signal: AbortSignal;
  o: AddEventListenerOptions;
  later: (fn: () => void, ms: number) => number;
  every: (fn: () => void, ms: number) => number;
  dispose: () => void;
}
export function makeScope(): Scope {
  const ac = new AbortController(), timeouts = new Set<number>(), intervals = new Set<number>();
  return {
    signal: ac.signal,
    o: { signal: ac.signal },
    later(fn, ms) { const id = window.setTimeout(() => { timeouts.delete(id); fn(); }, ms); timeouts.add(id); return id; },
    every(fn, ms) { const id = window.setInterval(fn, ms); intervals.add(id); return id; },
    dispose() { ac.abort(); timeouts.forEach(clearTimeout); intervals.forEach(clearInterval); timeouts.clear(); intervals.clear(); },
  };
}
