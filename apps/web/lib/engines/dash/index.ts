/* ==========================================================================
   PAINEL HALOR · ciclo de vida da tela: desenha, redesenha quando a largura
   muda de faixa, responde aos filtros e à troca "Antes do Halor / Com Halor".
   Porte de prototype/src/js/40-dash.js (dashAll e ouvintes globais).
   ========================================================================== */
import { $$, toast } from '../../core';
import type { DashMode } from './data';
import { dashRender } from './render';

/* a comparação escolhida vale para a sessão inteira, como no protótipo */
let mode: DashMode = 'com';

/** Liga o painel dentro de `scope` (a sub-tela do estúdio) e devolve a limpeza. */
export function bootDash(scope: HTMLElement): () => void {
  const ac = new AbortController(), on = { signal: ac.signal };
  const boards = $$('.dash', scope);
  const drawn = new Map<HTMLElement, AbortController>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => { timers.delete(t); fn(); }, ms);
    timers.add(t);
    return t;
  };

  const draw = (d: HTMLElement) => {
    drawn.get(d)?.abort();
    const c = new AbortController(); drawn.set(d, c);
    dashRender(d, mode, c.signal);
  };
  const drawAll = () => boards.forEach(d => { if (d.offsetParent !== null || !d.children.length) draw(d); });
  const redrawBusy = (ms: number) => boards.forEach(d => {
    d.classList.add('busy');
    later(() => { draw(d); d.classList.remove('busy'); }, ms);
  });
  const syncMode = () => $$<HTMLButtonElement>('[data-dash-mode]', scope).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.dashMode === mode)));

  syncMode();
  drawAll();

  /* redesenha quando a largura muda de faixa (texto dos gráficos sempre legível) */
  let dashW = 0, dashT: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener('resize', () => {
    if (dashT) { clearTimeout(dashT); timers.delete(dashT); }
    dashT = later(() => { const w = Math.round(window.innerWidth / 80); if (w !== dashW) { dashW = w; drawAll(); } }, 180);
  }, on);

  /* filtros do painel: dados ilustrativos, mas a tela responde */
  scope.addEventListener('change', e => {
    const s = (e.target as Element | null)?.closest<HTMLSelectElement>('.filters select'); if (!s) return;
    const lab = s.closest('.flt')?.querySelector('span')?.textContent ?? '';
    redrawBusy(160);
    toast(lab + ': ' + s.value + '. Dados ilustrativos.');
  }, on);

  scope.addEventListener('click', e => {
    const b = (e.target as Element | null)?.closest<HTMLElement>('[data-dash-mode]'); if (!b) return;
    mode = b.dataset.dashMode === 'antes' ? 'antes' : 'com';
    syncMode();
    redrawBusy(120);
  }, on);

  return () => {
    ac.abort();
    timers.forEach(t => clearTimeout(t)); timers.clear();
    drawn.forEach(c => c.abort()); drawn.clear();
    boards.forEach(d => d.classList.remove('busy'));
  };
}
