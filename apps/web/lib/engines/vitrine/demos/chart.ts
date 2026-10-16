/* 16 · Chart Build Animation · barras, meta, pontos e rótulos entram em etapas; a régua percorre a construção. */
import { svgEl } from '../../../core';
import { q, vtClamp, vtEase, type VtCtx, type VtDemo } from '../ctx';

const Q = ['1T25', '2T25', '3T25', '4T25', '1T26', '2T26', '3T26', '4T26'];
const R = [42, 48, 51, 57, 63, 70, 76, 84], M = [45, 48, 52, 55, 58, 62, 66, 70];

interface Built {
  bars: SVGRectElement[]; mPath: SVGPathElement; len: number; dots: SVGCircleElement[];
  labs: SVGGElement; xl: SVGGElement; yl: SVGGElement; y: (v: number) => number; B: number;
}

export function chartDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const plot = q('.vt-ch-plot', card), svg = q<SVGSVGElement>('.vt-ch-svg', card), tip = q('.vt-ch-tip', card), range = q<HTMLInputElement>('.vt-range', card);
  let g: Built | null = null, prog = ctx.reduced ? 1 : 0, stop: (() => void) | null = null;

  const ns = <K extends keyof SVGElementTagNameMap>(t: K, a: Record<string, string | number> = {}, parent: Element = svg) => {
    const n = svgEl(t, a); parent.append(n); return n;
  };
  const clear = () => { svg.querySelectorAll(':scope > :not(title)').forEach(n => n.remove()); };

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
    const bars = R.map((v, i) => {
      const hit = ns('rect', { x: xc(i) - band / 2, y: T, width: band, height: B - T, class: 'vt-ch-hit', tabindex: 0, role: 'img', 'aria-label': `${Q[i]}: receita ${v}, meta ${M[i]}` });
      const r = ns('rect', { x: xc(i) - bw / 2, width: bw, rx: 4, y: B, height: 0, class: 'vt-ch-bar' + (i === R.length - 1 ? ' is-hi' : '') }, barsG);
      const show = () => {
        r.classList.add('is-hov');
        tip.hidden = false;
        tip.textContent = `${Q[i]} · Receita ${v} · Meta ${M[i]}`;
        tip.style.left = vtClamp(xc(i), 80, W - 80) + 'px'; tip.style.top = y(Math.max(v, M[i])) + 'px';
      };
      const hide = () => { r.classList.remove('is-hov'); tip.hidden = true; };
      ctx.on(hit, 'pointerenter', show); ctx.on(hit, 'pointerleave', hide);
      ctx.on(hit, 'focus', show); ctx.on(hit, 'blur', hide);
      return r;
    });
    const line = ns('path', { d: lineD, class: 'vt-ch-meta', mask: `url(#${uid}m)` });
    const len = line.getTotalLength();
    mPath.setAttribute('stroke-dasharray', String(len));
    const dots = M.map((v, i) => ns('circle', { cx: xc(i), cy: y(v), r: 4.5, class: 'vt-ch-dot' }));
    const labs = ns('g');
    const v0 = ns('text', { x: xc(R.length - 1), y: y(R[R.length - 1]) - 8, 'text-anchor': 'middle', class: 'vt-ch-val' }, labs); v0.textContent = String(R[R.length - 1]);
    const v2 = ns('text', { x: xc(M.length - 1) + bw / 2 + 8, y: y(M[M.length - 1]) + 4, 'text-anchor': 'start', class: 'vt-ch-lbl' }, labs); v2.textContent = 'Meta ' + M[M.length - 1];
    g = { bars, mPath, len, dots, labs, xl, yl, y, B };
    render(prog);
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

  const play = () => { stop?.(); render(0); stop = ctx.tween(2800, p => render(p), () => { stop = null; }); };
  ctx.on(range, 'input', () => { stop?.(); stop = null; render(+range.value / 100); });
  ctx.resize(plot, build);
  ctx.defer(() => {
    clear(); g = null;
    tip.hidden = true; tip.textContent = ''; tip.style.removeProperty('left'); tip.style.removeProperty('top');
    svg.setAttribute('viewBox', '0 0 640 220');
    range.value = '100'; range.style.removeProperty('--v'); range.setAttribute('aria-valuetext', 'Gráfico completo');
  });

  return { start: play, replay: play, still: () => render(1) };
}
