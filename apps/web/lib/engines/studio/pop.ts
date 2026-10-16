/* ==========================================================================
   Estúdio · menus flutuantes (menus do editor, novo slide, notificações, ações)
   e abas com setas. Porte de prototype/src/js/50-studio.js.
   ========================================================================== */
import { $, $$, el } from '@/lib/core';
import { clampN } from './util';

export interface MenuEntry { t: string; ic?: string; k?: string; off?: boolean; danger?: boolean; act: () => void }
export type MenuItem = MenuEntry | '-' | { h: string };
export interface PopOptions { cls?: string; role?: string; label?: string | null; align?: 'right' }

interface PopState { el: HTMLElement; btn: HTMLElement; t: number }
let POP: PopState | null = null;

export const popOpen = () => POP !== null;

export function closePop(back = true) {
  if (!POP) return; const p = POP; POP = null;
  p.el.remove(); p.btn.setAttribute('aria-expanded', 'false'); p.btn.classList.remove('pop-on');
  if (back && p.btn.isConnected) p.btn.focus();
}

export function openPop(btn: HTMLElement, fill: (box: HTMLElement) => void, opt: PopOptions = {}) {
  if (POP && POP.btn === btn) return closePop();
  closePop(false);
  const box = el('div', 'pop theme-paper' + (opt.cls ? ' ' + opt.cls : ''));
  box.setAttribute('role', opt.role || 'menu'); if (opt.label) box.setAttribute('aria-label', opt.label);
  fill(box); document.body.appendChild(box);
  POP = { el: box, btn, t: performance.now() }; btn.setAttribute('aria-expanded', 'true'); btn.classList.add('pop-on');
  const r = btn.getBoundingClientRect(), bw = box.offsetWidth, bh = box.offsetHeight, vw = document.documentElement.clientWidth, vh = window.innerHeight;
  const x = opt.align === 'right' ? r.right - bw : r.left;
  let y = r.bottom + 6;
  if (y + bh > vh - 8 && r.top - bh - 6 > 8) y = r.top - bh - 6;
  box.style.left = clampN(x, 8, vw - bw - 8) + 'px'; box.style.top = clampN(y, 8, Math.max(8, vh - bh - 8)) + 'px';
  const first = $('[role="menuitem"]:not([aria-disabled="true"]), a, button', box); if (first) first.focus();
}

export function menuFill(items: MenuItem[]) {
  return (box: HTMLElement) => items.forEach(it => {
    if (it === '-') { box.appendChild(el('span', 'pop-sep')); return; }
    if ('h' in it) { box.appendChild(el('p', 'pop-h', it.h)); return; }
    const b = el('button', 'pop-i' + (it.danger ? ' danger' : '')); b.type = 'button'; b.setAttribute('role', 'menuitem');
    if (it.ic) b.insertAdjacentHTML('beforeend', `<svg aria-hidden="true"><use href="${it.ic}"/></svg>`);
    b.appendChild(el('span', null, it.t));
    if (it.k) b.appendChild(el('kbd', null, it.k));
    if (it.off) b.setAttribute('aria-disabled', 'true');
    b.addEventListener('click', () => { if (it.off) return; closePop(false); it.act(); });
    box.appendChild(b);
  });
}

/** Fecha o menu ao clicar fora, com Esc ou Tab, ao rolar e ao redimensionar; setas navegam pelos itens. */
export function installPop(): () => void {
  const ac = new AbortController(), o = { signal: ac.signal };
  document.addEventListener('pointerdown', e => {
    const t = e.target as Node | null;
    if (POP && t && !POP.el.contains(t) && !POP.btn.contains(t)) closePop(false);
  }, o);
  document.addEventListener('keydown', e => {
    if (!POP) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePop(); return; }
    if (e.key === 'Tab') { closePop(false); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
      const its = $$('[role="menuitem"]:not([aria-disabled="true"])', POP.el); if (!its.length) return;
      e.preventDefault(); const i = its.indexOf(document.activeElement as HTMLElement);
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? its.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + its.length) % its.length;
      its[n].focus();
    }
  }, { capture: true, signal: ac.signal });
  window.addEventListener('resize', () => closePop(false), o);
  /* rolar a página fecha o menu (menos o rolar que o próprio clique de abertura provoca) */
  document.addEventListener('scroll', e => {
    if (POP && !POP.el.contains(e.target as Node) && performance.now() - POP.t > 250) closePop(false);
  }, { capture: true, signal: ac.signal });
  return () => { ac.abort(); closePop(false); };
}

/** tablist com setas, Home e End (ativação automática) */
export function rovingTabs(list: HTMLElement, activate: (t: HTMLElement) => void, signal: AbortSignal) {
  list.addEventListener('keydown', e => {
    const tabs = $$('[role="tab"]', list), i = tabs.indexOf(document.activeElement as HTMLElement); if (i < 0) return;
    const n = ({ ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 } as Record<string, number>)[e.key];
    if (n == null) return;
    e.preventDefault(); const t = tabs[(n + tabs.length) % tabs.length]; t.focus(); activate(t);
  }, { signal });
}
