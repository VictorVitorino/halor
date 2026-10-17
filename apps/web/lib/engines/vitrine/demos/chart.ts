/* 16 · Chart Build Animation + 15 · Data Highlight · barras, meta, pontos e rótulos entram em etapas;
   a régua percorre a construção. Clicar numa barra acende só ela (as outras esmaecem) com o detalhe.
   Editável: cor, duração da montagem, linha da meta e rótulos. */
import { svgEl } from '../../../core';
import { q, vtAccent, vtClamp, vtEase, vtFmt, type VtCtx, type VtDemo } from '../ctx';

const Q = ['1T25', '2T25', '3T25', '4T25', '1T26', '2T26', '3T26', '4T26'];
const R = [42, 48, 51, 57, 63, 70, 76, 84], M = [45, 48, 52, 55, 58, 62, 66, 70];
const vs = (i: number) => { const d = Math.round((R[i] - M[i]) / M[i] * 100); return `${d >= 0 ? '+' : '−'}${Math.abs(d)}% vs. meta`; };

interface Built {
  bars: SVGRectElement[]; hits: SVGRectElement[]; vals: SVGTextElement[]; mPath: SVGPathElement; len: number; dots: SVGCircleElement[];
  labs: SVGGElement; xl: SVGGElement; yl: SVGGElement; y: (v: number) => number; xc: (i: number) => number; B: number; W: number;
}

export function chartDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const plot = q('.vt-ch-plot', card), svg = q<SVGSVGElement>('.vt-ch-svg', card), tip = q('.vt-ch-tip', card), range = q<HTMLInputElement>('.vt-range', card);
  let g: Built | null = null, prog = ctx.reduced ? 1 : 0, stop: (() => void) | null = null, dur = 2800, sel = -1, hov = -1, replayT = 0;

  const ns = <K extends keyof SVGElementTagNameMap>(t: K, a: Record<string, string | number> = {}, parent: Element = svg) => {
    const n = svgEl(t, a); parent.append(n); return n;
  };
  const clear = () => { svg.querySelectorAll(':scope > :not(title)').forEach(n => n.remove()); };
  const tipAt = (i: number, pin: boolean) => {
    if (!g || i < 0) { tip.hidden = true; return; }
    tip.hidden = false;
    tip.classList.toggle('is-pin', pin);
    tip.textContent = pin ? `${Q[i]} · Receita ${R[i]} · Meta ${M[i]} · ${vs(i)}` : `${Q[i]} · Receita ${R[i]} · Meta ${M[i]}`;
    tip.style.left = vtClamp(g.xc(i), pin ? 130 : 90, g.W - (pin ? 130 : 90)) + 'px';
    tip.style.top = g.y(Math.max(R[i], M[i])) - (pin ? 18 : 0) + 'px';
  };
  const paintSel = () => {
    if (!g) return;
    svg.classList.toggle('has-sel', sel >= 0);
    g.bars.forEach((r, i) => r.classList.toggle('is-sel', i === sel));
    g.vals.forEach((t, i) => t.classList.toggle('is-on', i === sel));
    g.hits.forEach((h, i) => h.setAttribute('aria-pressed', String(i === sel)));
    tipAt(hov >= 0 ? hov : sel, hov < 0 || hov === sel);
  };
  const pick = (i: number) => { sel = sel === i ? -1 : i; hov = -1; paintSel(); if (sel >= 0 && g) ctx.kick(g.bars[sel], 'is-kick', 700); };

  const build = () => {
    const W = plot.clientWidth, H = plot.clientHeight; if (!W || !H) return;
    clear();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const L = 30, Rt = W - 58, T = 20, B = H - 22, band = (Rt - L) / Q.length, bw = Math.min(46, band * .58);
    const y = (v: number) => B - (v / 100) * (B - T), xc = (i: number) => L + band * i + band / 2;
    const uid = card.id + '-c';
    const defs = ns('defs');
    const clip = ns('clipPath', { id: uid }, defs); ns('rect', { x: 0, y: 0, width: W, height: B }, clip);
    const mask = ns('mask', { id: uid + 'm' }, defs);
    const lineD = M.map((v, i) => `${i ? 'L' : 'M'}${xc(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    const mPath = ns('path', { d: lineD, fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }, mask);
    const gridG = ns('g');
    [0, 25, 50, 75, 100].forEach(v => {
      ns('line', { x1: L, x2: Rt, y1: y(v), y2: y(v), class: v ? 'vt-ch-grid' : 'vt-ch-base' }, gridG);
    });
    const yl = ns('g', { class: 'vt-ch-axis' });
    [0, 50, 100].forEach(v => { const t = ns('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'vt-ch-lbl' }, yl); t.textContent = String(v); });
    const xl = ns('g', { class: 'vt-ch-axis' });
    Q.forEach((qq, i) => { if (band < 44 && i % 2 === 0) return; const t = ns('text', { x: xc(i), y: H - 4, 'text-anchor': 'middle', class: 'vt-ch-lbl' }, xl); t.textContent = qq; });
    const barsG = ns('g', { 'clip-path': `url(#${uid})` });
    const hits: SVGRectElement[] = [], vals: SVGTextElement[] = [];
    const bars = R.map((v, i) => {
      const hit = ns('rect', { x: xc(i) - band / 2, y: T, width: band, height: B - T, class: 'vt-ch-hit', tabindex: 0, role: 'button', 'aria-pressed': 'false', 'aria-label': `${Q[i]}: receita ${v}, meta ${M[i]}. Destacar.` });
      const r = ns('rect', { x: xc(i) - bw / 2, width: bw, rx: 4, y: B, height: 0, class: 'vt-ch-bar' + (i === R.length - 1 ? ' is-hi' : '') }, barsG);
      ctx.on(hit, 'pointerenter', () => { hov = i; r.classList.add('is-hov'); tipAt(i, i === sel); });
      ctx.on(hit, 'pointerleave', () => { hov = -1; r.classList.remove('is-hov'); tipAt(sel, true); });
      ctx.on(hit, 'focus', () => { r.classList.add('is-hov'); r.classList.toggle('is-kf', hit.matches(':focus-visible')); if (sel < 0) tipAt(i, false); });
      ctx.on(hit, 'blur', () => { r.classList.remove('is-hov', 'is-kf'); tipAt(sel, true); });
      ctx.on(hit, 'click', () => pick(i));
      ctx.on(hit, 'keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); }
        else if (e.key === 'Escape' && sel >= 0) { e.preventDefault(); pick(sel); }
      });
      hits.push(hit);
      return r;
    });
    const line = ns('path', { d: lineD, class: 'vt-ch-meta', mask: `url(#${uid}m)` });
    const len = line.getTotalLength();
    mPath.setAttribute('stroke-dasharray', String(len));
    const dots = M.map((v, i) => ns('circle', { cx: xc(i), cy: y(v), r: 4.5, class: 'vt-ch-dot' }));
    const labs = ns('g');
    R.forEach((v, i) => { const t = ns('text', { x: xc(i), y: y(v) - 8, 'text-anchor': 'middle', class: 'vt-ch-sv' }, labs); t.textContent = String(v); vals.push(t); });
    const v0 = ns('text', { x: xc(R.length - 1), y: y(R[R.length - 1]) - 8, 'text-anchor': 'middle', class: 'vt-ch-val' }, labs); v0.textContent = String(R[R.length - 1]);
    const v2 = ns('text', { x: xc(M.length - 1) + bw / 2 + 8, y: y(M[M.length - 1]) + 4, 'text-anchor': 'start', class: 'vt-ch-lbl vt-ch-ml' }, labs); v2.textContent = 'Meta ' + M[M.length - 1];
    g = { bars, hits, vals, mPath, len, dots, labs, xl, yl, y, xc, B, W };
    render(prog);
    paintSel();
  };

  const render = (p: number) => {
    prog = p; if (!g) return;
    const b = g;
    const pb = vtClamp(p / .45);
    b.bars.forEach((r, i) => { const e = vtEase(vtClamp((pb - i * .07) / .51)); const h = (b.B - b.y(R[i])) * e; r.setAttribute('y', String(b.B - h)); r.setAttribute('height', String(h + (h > 0 ? 4 : 0))); });
    b.mPath.setAttribute('stroke-dashoffset', String(b.len * (1 - vtEase(vtClamp((p - .45) / .3)))));
    const pd = vtClamp((p - .68) / .17);
    b.dots.forEach((d, i) => { const e = vtClamp(pd * b.dots.length - i); d.setAttribute('r', (4.5 * vtEase(e)).toFixed(2)); d.style.opacity = e > 0 ? '1' : '0'; });
    const pl = vtClamp((p - .84) / .16);
    [b.labs, b.xl, b.yl].forEach(n => { n.style.opacity = String(pl); });
    range.value = String(Math.round(p * 100));
    range.style.setProperty('--v', p * 100 + '%');
    range.setAttribute('aria-valuetext', p < .45 ? 'Barras crescendo' : p < .75 ? 'Meta se desenhando' : p < .9 ? 'Pontos surgindo' : 'Gráfico completo');
  };

  const play = () => { stop?.(); render(0); stop = ctx.tween(dur, p => render(p), () => { stop = null; }); };
  ctx.on(range, 'input', () => { stop?.(); stop = null; render(+range.value / 100); });
  /* clicar no fundo do gráfico apaga o destaque */
  ctx.on(plot, 'click', e => { if (!(e.target as Element).closest('.vt-ch-hit') && sel >= 0) pick(sel); });
  ctx.resize(plot, build);
  ctx.defer(() => { g = null; range.value = '100'; });

  return {
    start: play, replay: play, still: () => render(1),
    fields: [
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'dur', t: 'range', l: 'Montagem', v: 2.8, min: 1, max: 6, step: .2, fmt: v => vtFmt(v, 1) + ' s' },
      { k: 'meta', t: 'toggle', l: 'Meta', v: true },
      { k: 'labels', t: 'toggle', l: 'Rótulos', v: true }
    ],
    set(k, v) {
      if (k === 'acc') vtAccent(card, String(v));
      else if (k === 'meta') card.classList.toggle('no-meta', !v);
      else if (k === 'labels') card.classList.toggle('no-lbl', !v);
      else if (k === 'dur') {
        dur = Number(v) * 1000; ctx.cancel(replayT);
        if (!ctx.reduced && card.classList.contains('is-on')) replayT = ctx.later(play, 420);
      }
    },
    reset() { if (sel >= 0) pick(sel); }
  };
}
