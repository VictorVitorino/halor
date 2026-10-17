/* 12 · Counter Animation · números que contam do zero ao valor final. Clicar num indicador o
   destaca, pulsa a barra, reconta e mostra o detalhe. Editável: os três valores e a duração. */
import { el } from '../../../core';
import { q, qa, vtClamp, vtEase, vtFmt, type VtCtx, type VtDemo } from '../ctx';

export function countDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const its = qa<HTMLButtonElement>('.vt-co-i', card), vals = qa('.vt-co-v', card), bars = qa('.vt-co-bar', card);
  const det = q('.vt-co-det', card), list = q('.vt-co-list', card);
  const KEYS = its.map(b => b.querySelector('.vt-co-k')?.textContent || '');
  const DEF = vals.map(v => +(v.dataset.to || 0));
  const shown = DEF.slice();
  let raf = 0, dur = 1800, sel = -1, rerun = 0;

  const to = (i: number) => +(vals[i].dataset.to || 0);
  const goal = (i: number) => +(vals[i].dataset.goal || 1);
  const text = (v: HTMLElement, n: number) => {
    const d = +(v.dataset.dec || 0), pre = v.dataset.pre || '';
    const s = n < 0 ? '−' : pre === '+' ? '+' : '';
    return (pre === '+' ? '' : pre) + s + vtFmt(Math.abs(n), d) + (v.dataset.suf || '');
  };
  const render = (i: number, n: number, e: number) => {
    shown[i] = n;
    vals[i].textContent = text(vals[i], n);
    bars[i].style.setProperty('--w', vtClamp(to(i) / goal(i)).toFixed(3));
    bars[i].style.setProperty('--p', e.toFixed(3));
  };
  const label = (i: number) => its[i].setAttribute('aria-label', `${KEYS[i]}: ${vals[i].textContent}. ${sel === i ? 'Selecionado.' : 'Clique para ver o detalhe.'}`);
  const pct = (i: number) => Math.round(to(i) / goal(i) * 100);
  const DET = [
    () => `${pct(0)}% da meta anual de R$ 14,9 mi. O 4º trimestre puxou a alta.`,
    () => `${pct(1)}% da meta de +59% para o ano. Recompra e novos clientes somam a alta.`,
    () => `${pct(2)}% da meta de 1.240 clientes, média de ${vtFmt(Math.round(to(2) / 12))} por mês.`
  ];
  const detail = () => {
    det.textContent = '';
    if (sel < 0) { det.append(el('span', 'vt-co-hint', 'Clique num indicador para ver o detalhe.')); return; }
    det.append(el('b', '', KEYS[sel]), ' ' + DET[sel]());
    ctx.kick(det, 'is-in');
  };
  const run = () => {
    ctx.unframe(raf);
    if (ctx.reduced) { vals.forEach((_, i) => render(i, to(i), 1)); return; }
    const t0 = performance.now();
    const tick = (t: number) => {
      let done = true;
      vals.forEach((_, i) => {
        const p = vtClamp((t - t0 - 250 - i * 180) / dur);
        if (p < 1) done = false;
        const e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
        render(i, to(i) * e, e);
      });
      if (!done) raf = ctx.frame(tick);
    };
    raf = ctx.frame(tick);
  };
  /* recontagem curta de um indicador, do valor à mostra até o novo */
  const stops: ((() => void) | undefined)[] = [];
  const recount = (i: number, from: number, ms = 650) => {
    stops[i]?.();
    const target = to(i);
    stops[i] = ctx.tween(ms, p => render(i, from + (target - from) * vtEase(p), 1), () => label(i));
  };
  const select = (i: number) => {
    sel = sel === i ? -1 : i;
    its.forEach((b, j) => { b.setAttribute('aria-pressed', String(j === sel)); label(j); });
    list.classList.toggle('has-sel', sel >= 0);
    if (sel >= 0) { ctx.kick(bars[sel], 'is-pulse', 1100); recount(sel, to(sel) * .55, 700); }
    detail();
  };
  its.forEach((b, i) => { ctx.on(b, 'click', () => select(i)); label(i); });
  if (!ctx.reduced) vals.forEach((_, i) => render(i, 0, 0));

  return {
    start: run, replay: run,
    still: () => vals.forEach((_, i) => render(i, to(i), 1)),
    fields: [
      { k: 'v0', t: 'number', l: 'Receita', v: DEF[0], min: 0, max: 999, dec: 1, unit: 'R$ mi' },
      { k: 'v1', t: 'number', l: 'Crescimento', v: DEF[1], min: -99, max: 999, unit: '%' },
      { k: 'v2', t: 'number', l: 'Clientes', v: DEF[2], min: 0, max: 99999, unit: 'novos' },
      { k: 'dur', t: 'range', l: 'Contagem', v: 1.8, min: .4, max: 4, step: .1, fmt: v => vtFmt(v, 1) + ' s' }
    ],
    set(k, v) {
      if (k === 'dur') {
        dur = Number(v) * 1000; ctx.cancel(rerun);
        if (card.classList.contains('is-on')) rerun = ctx.later(run, 420);
        return;
      }
      const i = +k.slice(1);
      if (to(i) === Number(v)) return;
      vals[i].dataset.to = String(v);
      recount(i, shown[i]);
      if (sel === i) detail();
    },
    reset() { if (sel >= 0) select(sel); }
  };
}
