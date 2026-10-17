/* ==========================================================================
   VITRINE · catálogo e ripple
   Porte de vtCatalog(), vtMinis() e vtRipples() (prototype/src/js/37-vitrine.js).
   O catálogo vem pronto do servidor (components/vitrine/VitrineCatalog.tsx); aqui
   ele ganha comportamento: o item ao vivo leva até o card no palco, as prévias
   rodam com o cursor ou o foco e respondem ao clique, e tudo o que se clica na
   vitrine solta uma onda (Ripple, efeito 20).
   ========================================================================== */
import { el } from '../../core';
import { qa, reflow, vtClamp, type VtCtx } from './ctx';
import { vtMiniSay } from './data';

/* · Ripple: a onda nasce no ponto do toque e some · */
const VT_RIP = '.vt-demo, .vt-item, .vt-edit, .vt-replay, .vt-ed-reset, .vt-ed-add, .vt-chip, .vt-plus-pill';
function ripple(host: Element, x: number, y: number, ctx: VtCtx) {
  if (ctx.reduced) return;
  const r = host.getBoundingClientRect();
  const s = Math.min(2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)), host.classList.contains('vt-demo') ? 380 : 900);
  const w = ctx.own(el('span', 'vt-rip')); w.setAttribute('aria-hidden', 'true');
  w.style.cssText = `left:${x}px;top:${y}px;--s:${s.toFixed(0)}px`;
  host.append(w);
  ctx.later(() => w.remove(), 760);
}
export function vtRipples(sec: HTMLElement, ctx: VtCtx) {
  ctx.on(sec, 'pointerdown', e => {
    if (e.button !== 0) return;
    const host = (e.target as Element).closest(VT_RIP); if (!host) return;
    const r = host.getBoundingClientRect();
    ripple(host, e.clientX - r.left, e.clientY - r.top, ctx);
  });
  /* clique pelo teclado (Enter ou Espaço): a onda nasce no centro do que foi acionado */
  ctx.on(sec, 'click', e => {
    if (e.detail !== 0) return;
    const host = (e.target as Element).closest(VT_RIP); if (!host) return;
    const r = host.getBoundingClientRect(), t = (e.target as Element).getBoundingClientRect();
    ripple(host, t.left + t.width / 2 - r.left, t.top + t.height / 2 - r.top, ctx);
  });
}

/* · Itens ao vivo: levam até a demonstração no palco · */
export function vtCatalogLinks(sec: HTMLElement, live: Record<number, HTMLElement>, ctx: VtCtx) {
  const pings = new Map<HTMLElement, number>();
  qa<HTMLButtonElement>('#vt-cat .vt-item[data-live]', sec).forEach(it => {
    const card = live[+(it.dataset.n || 0)];
    if (!card) return;
    ctx.on(it, 'click', () => {
      card.scrollIntoView({ behavior: ctx.reduced ? 'auto' : 'smooth', block: 'center' });
      card.setAttribute('tabindex', '-1');
      card.focus({ preventScroll: true });
      card.classList.remove('is-ping'); reflow(card); card.classList.add('is-ping');
      ctx.cancel(pings.get(card) || 0);
      pings.set(card, ctx.later(() => card.classList.remove('is-ping'), 1800));
    });
  });
}

/* · Estado de uma prévia · cyc: o índice em data-s · pick/net: o item aceso (-1 = nenhum).
   Os que não têm estado devolvem null. vtMiniState aplica um estado e devolve, na rede, quantos
   vizinhos acenderam. */
type MiniPart = HTMLElement | SVGElement;
export function vtMiniGet(m: HTMLElement): number | null {
  const k = m.dataset.k;
  if (k === 'cyc') return +(m.dataset.s || 0);
  if (k === 'pick' || k === 'net') return qa<MiniPart>('[data-p]', m).findIndex(x => x.classList.contains('is-pk'));
  return null;
}
export function vtMiniState(m: HTMLElement, i: number) {
  const k = m.dataset.k;
  if (k === 'cyc') { m.dataset.s = String(i); return 0; }
  if (k !== 'pick' && k !== 'net') return 0;
  const ps = qa<MiniPart>('[data-p]', m), on = i >= 0, p = on ? ps[i] : undefined;
  ps.forEach(x => x.classList.toggle('is-pk', x === p));
  m.classList.toggle('has-pk', on);
  let cnt = 0;
  if (k === 'net') {
    const id = p?.dataset.p ?? null, nb = new Set<string>();
    qa<SVGLineElement>('line', m).forEach(l => {
      const ends = (l.dataset.e || '').split(' '), hit = id != null && ends.includes(id);
      l.classList.toggle('on', hit); if (hit) ends.forEach(x => nb.add(x));
    });
    ps.forEach(x => { const v = nb.has(x.dataset.p || '') && x !== p; x.classList.toggle('nb', v); if (v) cnt++; });
  }
  return cnt;
}
/** Valor digitado no editor que um estado novo substitui (o progresso do 13 volta ao do estado). */
export const VT_MINI_VALS = ['--p0', '--p1', '--p2', '--p3'] as const;
/**
 * O clique numa prévia (no catálogo ou ampliada no editor): alterna, escolhe, solta um pulso ou
 * repete, e diz o que fez na região viva (a prévia é decorativa). Devolve o estado novo, ou null
 * se a prévia não tem estado. A prévia pode estar ampliada (transform): as contas de posição
 * voltam à escala dela.
 */
export function vtMiniHit(m: HTMLElement, e: MouseEvent, kb: boolean, n: number, name: string, ctx: VtCtx): number | null {
  if (m.querySelector('.vm-hit')) ctx.kick(m, 'is-hit', 1000);
  const k = m.dataset.k;
  if (k === 'cyc') {
    const s = (+(m.dataset.s || 0) + 1) % +(m.dataset.n || 1);
    VT_MINI_VALS.forEach(v => m.style.removeProperty(v));
    vtMiniState(m, s); ctx.say(vtMiniSay(n, name, s)); return s;
  }
  if (k === 'pick' || k === 'net') {
    const ps = qa<MiniPart>('[data-p]', m);
    let p = kb ? null : (e.target as Element).closest<MiniPart>('[data-p]');
    if (p && !m.contains(p)) p = null;
    if (!p) { const i = ps.findIndex(x => x.classList.contains('is-pk')); p = ps[(i + 1) % ps.length]; }
    const on = !p.classList.contains('is-pk'), i = on ? ps.indexOf(p) : -1;
    const cnt = vtMiniState(m, i);
    ctx.say(vtMiniSay(n, name, ps.indexOf(p), on, cnt));
    return i;
  }
  ctx.say(vtMiniSay(n, name));
  if (k === 'spawn') {
    const r = m.getBoundingClientRect(), sc = r.width / (m.offsetWidth || r.width);
    const w = r.width / sc, h = r.height / sc;
    const x = kb ? w * (.2 + Math.random() * .6) : (e.clientX - r.left) / sc, y = kb ? h * (.3 + Math.random() * .4) : (e.clientY - r.top) / sc;
    if (x < 0 || y < 0 || x > w || y > h) return null;
    const css = `left:${x}px;top:${y}px`;
    const ns = [el('i', 'vm-pg vm-sp'), el('i', 'vm-pg vm-sp d2'), el('i', 'vm-dt vm-bc vm-sp')];
    ns.forEach(n => { n.style.cssText = css; m.append(ctx.own(n)); });
    ctx.later(() => ns.forEach(n => n.remove()), ctx.reduced ? 900 : 1700);
  }
  return null;
}

/* · Prévias: rodam com o cursor ou o foco, respondem ao clique · */
export function vtMinis(sec: HTMLElement, ctx: VtCtx) {
  const play = (m: HTMLElement, on: boolean) => m.classList.toggle('is-play', on && !ctx.reduced);
  const restart = (m: HTMLElement) => { if (ctx.reduced) return; m.classList.remove('is-play'); reflow(m); m.classList.add('is-play'); };
  qa<HTMLButtonElement>('#vt-cat .vt-item', sec).forEach(it => {
    const m = it.querySelector<HTMLElement>('.vt-mini'); if (!m) return;
    let hov = false, tap = 0;
    ctx.on(it, 'pointerenter', e => { if (e.pointerType !== 'mouse') return; hov = true; play(m, true); });
    ctx.on(it, 'pointerleave', e => {
      if (e.pointerType !== 'mouse') return;
      hov = false; play(m, false); m.classList.remove('is-ptr');
      m.style.removeProperty('--mx'); m.style.removeProperty('--my');
    });
    ctx.on(it, 'pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = m.getBoundingClientRect();
      m.style.setProperty('--mx', vtClamp((e.clientX - r.left) / r.width, -.2, 1.2).toFixed(3));
      m.style.setProperty('--my', vtClamp((e.clientY - r.top) / r.height, -.2, 1.2).toFixed(3));
      m.classList.add('is-ptr');
    });
    ctx.on(it, 'focus', () => { if (it.matches(':focus-visible')) play(m, true); });
    ctx.on(it, 'blur', () => { if (!hov) play(m, false); });
    if (it.dataset.live) return;
    ctx.on(it, 'click', e => {
      restart(m);
      if (!hov) { ctx.cancel(tap); tap = ctx.later(() => { if (!hov && document.activeElement !== it) play(m, false); }, 4200); }
      vtMiniHit(m, e, e.detail === 0, +(it.dataset.n || 0), it.querySelector('.vt-item-t')?.textContent || '', ctx);
    });
  });
  /* a primeira vez que o catálogo aparece, cada prévia roda uma vez, em cascata */
  if (ctx.reduced || !('IntersectionObserver' in window)) return;
  const cat = sec.querySelector('#vt-cat'); if (!cat) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.disconnect();
    qa<HTMLElement>('#vt-cat > li:not([hidden]) .vt-mini', sec).forEach((m, i) => ctx.later(() => {
      if (m.classList.contains('is-play')) return;
      play(m, true);
      ctx.later(() => { if (!m.closest('.vt-item')?.matches(':hover, :focus-visible')) play(m, false); }, 3700);
    }, 200 + i * 140));
  }), { threshold: .25 });
  io.observe(cat);
  ctx.defer(() => io.disconnect());
}
