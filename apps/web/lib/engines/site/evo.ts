/* ==========================================================================
   LINHA DO TEMPO · viagem no tempo. Um palco mostra como a apresentação era
   em cada época; o trilho avança sozinho enquanto a seção está à vista e para
   quando a pessoa escolhe, passa o mouse ou foca com o teclado.
   Porte de prototype/src/js/36-produto.js (bootEvo). As abas do trilho já
   chegam pré-renderizadas (Timeline.tsx).
   ========================================================================== */
import { $, $$, REDUCED } from '@/lib/core';
import { EVO } from './data';
import type { Dispose } from './produto';

const noop: Dispose = () => {};

export function bootEvo(root: ParentNode): Dispose {
  const ev = $('#ev', root);
  if (!ev) return noop;
  const rail = $('.ev-rail', ev), inner = $('.ev-rail-in', ev), info = $('.ev-info', ev), panel = $('#ev-panel', ev);
  const track = $('.ev-track', ev), fut = $('.ev-fut', ev), fill = $('.ev-fill', ev), prog = $('.ev-prog', ev), att = $('.ev-att b', ev);
  const yEl = $('#ev-y', ev), tEl = $('#ev-t', ev), dEl = $('#ev-d', ev), whoEl = $('#ev-who', ev);
  if (!rail || !inner || !info || !panel || !track || !fut || !fill || !prog || !att || !yEl || !tEl || !dEl || !whoEl) return noop;
  const scenes = $$('.ev-scene', ev);
  const tabs = $$<HTMLButtonElement>('.ev-stop', inner);
  const N = Math.min(EVO.length, tabs.length), NOW = EVO.findIndex(e => e.now);
  if (!N) return noop;
  const ac = new AbortController(), on = { signal: ac.signal };

  let cur = -1, timer = 0, visible = false, hold = false, user = false, seen = false;
  let P: [number, number][] = [];

  /* traço do trilho: passado até hoje, futuro tracejado, preenchimento até a época atual e progresso até a próxima */
  const layout = () => {
    P = tabs.slice(0, N).map(b => {
      const d = $('i', b)!;
      return [b.offsetLeft + d.offsetLeft + d.offsetWidth / 2, b.offsetTop + d.offsetTop + d.offsetHeight / 2];
    });
    if (!P.length || !P[0][0]) return;
    const y = P[0][1] - 1.5 + 'px';
    const seg = (n: HTMLElement, x0: number, x1: number) => { n.style.left = x0 + 'px'; n.style.width = Math.max(0, x1 - x0) + 'px'; n.style.top = y; };
    seg(track, P[0][0], P[NOW][0]); seg(fut, P[NOW][0], P[N - 1][0]);
    seg(fill, P[0][0], P[Math.max(0, cur)][0]);
    if (cur >= 0 && cur < N - 1) seg(prog, P[cur][0], P[cur + 1][0]); else prog.style.width = '0px';
  };

  /* leitor de tela: anuncia a época quando a pessoa escolhe ou pausa; no avanço automático fica em silêncio */
  const live = () => info.setAttribute('aria-live', REDUCED || !visible || hold || user ? 'polite' : 'off');

  const schedule = () => {
    clearTimeout(timer); ev.classList.remove('ticking'); live();
    if (REDUCED || !visible || hold || user || cur < 0) return;
    const dur = cur === NOW ? 6500 : cur === N - 1 ? 5200 : 4300;
    ev.style.setProperty('--dur', dur + 'ms'); void ev.offsetWidth; ev.classList.add('ticking');
    timer = window.setTimeout(() => go((cur + 1) % N), dur);
  };

  const go = (i: number) => {
    live();
    cur = i; ev.dataset.i = String(i);
    tabs.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; b.classList.toggle('past', k < i); });
    scenes.forEach((s, k) => s.classList.toggle('on', k === i));
    panel.setAttribute('aria-labelledby', tabs[i].id);
    const e = EVO[i];
    yEl.textContent = e.y; tEl.textContent = e.t; dEl.textContent = e.d; whoEl.textContent = e.who;
    att.style.setProperty('--a', String(e.a));
    info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
    layout();
    const t = tabs[i], left = t.offsetLeft - (rail.clientWidth - t.offsetWidth) / 2;
    if (rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left, behavior: REDUCED ? 'auto' : 'smooth' });
    schedule();
  };

  tabs.slice(0, N).forEach((b, i) => b.addEventListener('click', () => { user = true; go(i); }, on));
  inner.addEventListener('keydown', e => {
    const k = e.key; let n = cur;
    if (k === 'ArrowRight' || k === 'ArrowDown') n = (cur + 1) % N;
    else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (cur - 1 + N) % N;
    else if (k === 'Home') n = 0;
    else if (k === 'End') n = N - 1;
    else return;
    e.preventDefault(); user = true; go(n); tabs[n].focus();
  }, on);
  ev.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hold = true; schedule(); } }, on);
  ev.addEventListener('pointerleave', () => { hold = false; schedule(); }, on);
  ev.addEventListener('focusin', () => { hold = true; schedule(); }, on);
  ev.addEventListener('focusout', e => { if (!ev.contains(e.relatedTarget as Node | null)) { hold = false; schedule(); } }, on);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(timer); ev.classList.remove('ticking'); } else schedule();
  }, on);

  const io = new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible) { if (!seen) { seen = true; go(cur); } else schedule(); }
    else { clearTimeout(timer); ev.classList.remove('ticking'); user = false; }
  }, { threshold: .35 });
  io.observe(ev);
  const ro = new ResizeObserver(layout);
  ro.observe(inner);

  go(0); clearTimeout(timer);

  return () => { ac.abort(); io.disconnect(); ro.disconnect(); clearTimeout(timer); ev.classList.remove('ticking'); };
}
