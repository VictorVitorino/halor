/* ==========================================================================
   PAINEL HALOR · gráficos em SVG desenhados à escala, com dica ao passar o
   mouse/foco e tabela gêmea. Porte de prototype/src/js/40-dash.js.
   Cada desenho recebe um AbortSignal: ao redesenhar ou ao sair da tela,
   todos os ouvintes dos gráficos anteriores são removidos.
   ========================================================================== */
import { el, svgEl, fmtNum } from '../../core';
import { CHAIN_STEPS } from '../../data/chain';
import { DASH, type DashMode } from './data';

interface TipRow { n: string; v: string; c: string }

/** Desenha o painel inteiro dentro de `root` (um `.dash`). */
export function dashRender(root: HTMLElement, mode: DashMode, signal: AbortSignal) {
  const app = root.dataset.dash === 'app', A = mode === 'com';
  root.textContent = '';
  /* topo: índice + KPIs */
  const top = el('div', 'd-top');
  const hero = el('div', 'd-card d-hero');
  const ring = el('div', 'd-ring'), sc = A ? DASH.score.a : DASH.score.b, C = 2 * Math.PI * 46;
  ring.innerHTML = `<svg viewBox="0 0 112 112" aria-hidden="true"><circle cx="56" cy="56" r="46" class="trk"/><circle cx="56" cy="56" r="46" class="val" style="stroke-dasharray:${(sc / 100 * C).toFixed(1)} ${C.toFixed(1)}"/></svg>`;
  ring.appendChild(el('b', null, String(sc)));
  const ht = el('div', 'd-hero-t');
  ht.append(el('p', 'd-label', 'Índice Halor do time'), el('p', 'd-delta' + (A ? '' : ' flat'), A ? '+28 pontos desde julho' : 'Base antes do Halor'), el('p', null, 'Média do quanto suas apresentações prendem o olhar, de 0 a 100.'));
  hero.append(ring, ht);
  const kp = el('div', 'd-card d-kpis');
  DASH.kpis.forEach(k => {
    const t = el('div', 'd-kpi'), v = A ? k.a : k.b;
    t.appendChild(el('p', 'd-label', k.k));
    const vv = el('p', 'v', String(v)); if (k.u) vv.appendChild(el('small', null, k.u)); t.appendChild(vv);
    const d = el('p', 'd-delta' + (A ? '' : ' flat'));
    if (A) {
      d.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2l4 5H2z" fill="currentColor"/></svg>';
      d.appendChild(document.createTextNode('+' + (k.a - k.b) + (k.u === '%' ? ' p.p.' : k.u ? ' ' + k.u : '') + ' vs. antes'));
    } else d.textContent = k.sub;
    t.appendChild(d);
    t.appendChild(sparkline(k.spark, A));
    kp.appendChild(t);
  });
  top.append(hero, kp); root.appendChild(top);

  /* linha + cadeia */
  const row = el('div', 'd-row');
  row.append(lineCard(A, chartW(root, 1.1 / 2.1), signal), chainCard(A, chartW(root, 1 / 2.1), signal));
  root.appendChild(row);
  if (app) {
    /* no Papel as células escuras pedem texto branco; na Noite, as claras pedem tinta */
    const paper = !!root.closest('.theme-paper') && !root.closest('.theme-night');
    root.appendChild(heatCard(A, paper));
    root.appendChild(insightsRow());
  }
}

/* largura do desenho = largura real do cartão, para o texto do gráfico ficar sempre em 11 a 12 px */
function chartW(root: HTMLElement, share: number) {
  const avail = root.clientWidth || Math.min(1180, window.innerWidth - 300);
  const card = window.innerWidth > 1060 ? (avail - 16) * share : avail;
  return Math.round(Math.max(300, Math.min(720, card - 46)));
}

function sparkline(vals: number[], A: boolean): SVGSVGElement {
  const W = 120, H = 30, mx = Math.max(...vals), mn = Math.min(...vals);
  const x = (i: number) => i / (vals.length - 1) * W, y = (v: number) => H - 3 - (v - mn) / (mx - mn || 1) * (H - 6);
  const s = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'd-spark', 'aria-hidden': 'true', preserveAspectRatio: 'none' });
  const pts = vals.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1));
  if (A) {
    s.appendChild(svgEl('polyline', { points: pts.slice(0, 6).join(' '), class: 'sp' }));
    s.appendChild(svgEl('polyline', { points: pts.slice(5).join(' '), class: 'sp-now' }));
    s.appendChild(svgEl('circle', { cx: x(11), cy: y(vals[11]), r: 3.5, class: 'sp-dot' }));
  } else s.appendChild(svgEl('polyline', { points: pts.slice(0, 6).join(' '), class: 'sp' }));
  return s;
}

function chartTip(card: HTMLElement): HTMLDivElement {
  const t = el('div', 'd-tip');
  card.querySelector('.d-chart')!.appendChild(t);
  return t;
}
function showTip(tip: HTMLElement, chart: HTMLElement, x: number, y: number, title: string, rows: TipRow[]) {
  tip.textContent = '';
  tip.appendChild(el('p', 'tt', title));
  rows.forEach(r => {
    const tr = el('div', 'tr'), sp = el('span'), i = el('i');
    i.style.setProperty('--c', r.c);
    sp.append(i, document.createTextNode(r.n)); tr.append(sp, el('b', null, r.v)); tip.appendChild(tr);
  });
  const cw = chart.clientWidth, tw = 170;
  tip.style.left = Math.max(0, Math.min(cw - tw, x + 14)) + 'px';
  tip.style.top = Math.max(0, y - 20) + 'px';
  tip.classList.add('on');
}

function lineCard(A: boolean, W: number, signal: AbortSignal): HTMLDivElement {
  const on = { signal };
  const card = el('div', 'd-card');
  const hd = el('div', 'd-head'), ht = el('div');
  ht.append(el('h3', null, 'Pessoas que voltaram para rever, a cada 100'), el('p', null, A ? 'Por mês. Apresentações Halor a partir de julho.' : 'Por mês, antes das apresentações Halor.'));
  hd.appendChild(ht); card.appendChild(hd);
  const ch = el('div', 'd-chart'); card.appendChild(ch);
  const H = W < 420 ? 220 : 240, L = 34, Rr = 44, T = 14, B = 26, iw = W - L - Rr, ih = H - T - B, ymax = 10;
  const n = A ? 12 : 6, data = DASH.signed.slice(0, n);
  const X = (i: number) => L + i / 11 * iw, Y = (v: number) => T + ih - v / ymax * ih;
  const s = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Linha mensal de pessoas que voltaram para rever, a cada 100' });
  if (A) s.appendChild(svgEl('rect', { x: X(5.5), y: T, width: X(11) - X(5.5) + 8, height: ih, class: 'evt-band' }));
  [0, 2, 4, 6, 8, 10].forEach(v => {
    s.appendChild(svgEl('line', { x1: L, x2: W - Rr + 8, y1: Y(v), y2: Y(v), class: 'grid' }));
    const t = svgEl('text', { x: L - 8, y: Y(v) + 4, 'text-anchor': 'end', class: 'tick' }); t.textContent = String(v); s.appendChild(t);
  });
  DASH.months.forEach((mo, i) => {
    if (i % (W < 440 ? 2 : 1)) return;
    const t = svgEl('text', { x: X(i), y: H - 6, 'text-anchor': 'middle', class: 'tick' }); t.textContent = mo; s.appendChild(t);
  });
  const pts = data.map((v, i): [number, number] => [X(i), Y(v)]);
  const dLine = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  s.appendChild(svgEl('path', { d: dLine + ` L${pts[pts.length - 1][0].toFixed(1)} ${Y(0)} L${X(0)} ${Y(0)} Z`, class: 'area' }));
  s.appendChild(svgEl('path', { d: dLine, class: 'line' }));
  if (A) {
    s.appendChild(svgEl('line', { x1: X(5.5), x2: X(5.5), y1: T, y2: T + ih, class: 'evt' }));
    const et = svgEl('text', { x: X(5.5) + 6, y: T + 12, class: 'evt-lab' }); et.textContent = 'Halor ativado'; s.appendChild(et);
  }
  const lastP = pts[pts.length - 1];
  s.appendChild(svgEl('circle', { cx: lastP[0], cy: lastP[1], r: 5, class: 'mk' }));
  const lv = svgEl('text', { x: lastP[0] + 10, y: lastP[1] + 4, class: 'val-lab' }); lv.textContent = fmtNum(data[n - 1], 1); s.appendChild(lv);
  if (A) { const fv = svgEl('text', { x: pts[0][0] + 6, y: pts[0][1] - 10, class: 'val-lab mut' }); fv.textContent = fmtNum(data[0], 1); s.appendChild(fv); }
  const xh = svgEl('line', { x1: 0, x2: 0, y1: T, y2: T + ih, class: 'xhair' }); s.appendChild(xh);
  const hit = svgEl('rect', { x: L, y: T, width: iw, height: ih, fill: 'transparent', tabindex: '0', 'aria-label': 'Explorar valores mensais com as setas' });
  s.appendChild(hit); ch.appendChild(s);
  const tip = chartTip(card);
  let fi = n - 1;
  const at = (i: number) => {
    i = Math.max(0, Math.min(n - 1, i)); fi = i;
    xh.setAttribute('x1', String(X(i))); xh.setAttribute('x2', String(X(i))); ch.classList.add('hover');
    const r = s.getBoundingClientRect(), k = r.width / W;
    showTip(tip, ch, X(i) * k, Y(data[i]) * k, DASH.months[i] + (i > 5 ? ' · com Halor' : ' · antes'), [{ n: 'Voltaram', v: fmtNum(data[i], 1), c: 'var(--c-after)' }]);
  };
  const hide = () => { ch.classList.remove('hover'); tip.classList.remove('on'); };
  hit.addEventListener('pointermove', e => { const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W; at(Math.round((x - L) / iw * 11)); }, on);
  hit.addEventListener('pointerleave', hide, on);
  hit.addEventListener('focus', () => at(fi), on);
  hit.addEventListener('blur', hide, on);
  hit.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { at(fi + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { at(fi - 1); e.preventDefault(); }
  }, on);
  card.appendChild(tableToggle(['Mês', 'Voltaram, a cada 100'], data.map((v, i) => [DASH.months[i], fmtNum(v, 1)])));
  return card;
}

function chainCard(A: boolean, W: number, signal: AbortSignal): HTMLDivElement {
  const on = { signal };
  const card = el('div', 'd-card');
  const hd = el('div', 'd-head'), ht = el('div');
  ht.append(el('h3', null, 'Cadeia Halor: quantos chegam a cada passo'), el('p', null, 'A cada 100 pessoas que receberam a apresentação'));
  const lg = el('div', 'd-legend');
  const l1 = el('span'), i1 = el('i'); i1.style.setProperty('--c', 'var(--c-before)'); l1.append(i1, document.createTextNode('Antes'));
  lg.appendChild(l1);
  if (A) { const l2 = el('span'), i2 = el('i'); i2.style.setProperty('--c', 'var(--c-after)'); l2.append(i2, document.createTextNode('Com Halor')); lg.appendChild(l2); }
  hd.append(ht, lg); card.appendChild(hd);
  const ch = el('div', 'd-chart'); card.appendChild(ch);
  const LW = 104, RW = 40, rowH = 34, H = CHAIN_STEPS.length * rowH + 4, iw = W - LW - RW, X = (v: number) => v / 100 * iw;
  const s = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Barras por passo da cadeia, antes e com Halor' });
  [0, 25, 50, 75, 100].forEach(v => s.appendChild(svgEl('line', { x1: LW + X(v), x2: LW + X(v), y1: 0, y2: H - 2, class: 'grid' })));
  const tip = chartTip(card);
  /* barra com as pontas da direita arredondadas */
  const rb = (x: number, y: number, w: number, h: number, cls: string) => {
    const r = Math.min(4, w / 2);
    return svgEl('path', { class: cls, d: `M${x} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x}Z` });
  };
  CHAIN_STEPS.forEach((st, i) => {
    const y0 = i * rowH + 3;
    const lab = svgEl('text', { x: LW - 10, y: y0 + rowH / 2 + 2, 'text-anchor': 'end', class: 'lab' }); lab.textContent = st.n; s.appendChild(lab);
    const bh = A ? 11 : 16, gap = 2;
    const yb = A ? y0 + 4 : y0 + (rowH - bh) / 2 - 1;
    s.appendChild(rb(LW, yb, Math.max(2, X(st.b)), bh, 'bar-b'));
    const endX = LW + X(st.b), endY = yb + bh / 2;
    if (A) {
      const ya = yb + bh + gap;
      s.appendChild(rb(LW, ya, Math.max(2, X(st.a)), bh, 'bar-a'));
      const t2 = svgEl('text', { x: LW + X(st.a) + 6, y: ya + bh / 2 + 4, class: 'val-lab' }); t2.textContent = String(st.a); s.appendChild(t2);
      const t1 = svgEl('text', { x: endX + 6, y: endY + 4, class: 'val-lab mut' }); t1.textContent = String(st.b); s.appendChild(t1);
    } else {
      const t1 = svgEl('text', { x: endX + 6, y: endY + 4, class: 'val-lab' }); t1.textContent = String(st.b); s.appendChild(t1);
    }
    const hit = svgEl('rect', { x: 0, y: y0, width: W, height: rowH, class: 'hit', tabindex: '0', 'aria-label': st.n + ': antes ' + st.b + (A ? ', com Halor ' + st.a : '') });
    const show = () => {
      const r = s.getBoundingClientRect(), k = r.width / W;
      const rows: TipRow[] = [{ n: 'Antes', v: String(st.b), c: 'var(--c-before)' }];
      if (A) rows.unshift({ n: 'Com Halor', v: String(st.a), c: 'var(--c-after)' });
      showTip(tip, ch, (LW + X(A ? st.a : st.b)) * k, y0 * k, 'Passo ' + (i + 1) + ' · ' + st.n, rows);
    };
    const hide = () => tip.classList.remove('on');
    hit.addEventListener('pointerenter', show, on); hit.addEventListener('focus', show, on);
    hit.addEventListener('pointerleave', hide, on); hit.addEventListener('blur', hide, on);
    s.appendChild(hit);
  });
  ch.appendChild(s);
  card.appendChild(tableToggle(['Passo', 'Antes', 'Com Halor'], CHAIN_STEPS.map(st => [st.n, String(st.b), A ? String(st.a) : 'sem dado'])));
  return card;
}

const HEAT_STEPS = ['--c-chain-1', '--c-chain-2', '--c-chain-3', '--c-chain-4', '--c-chain-5', '--c-chain-6', '--c-chain-7'];

function heatCard(A: boolean, paper: boolean): HTMLDivElement {
  const card = el('div', 'd-card');
  const hd = el('div', 'd-head'), ht = el('div');
  ht.append(el('h3', null, 'Mapa de atenção por slide'), el('p', null, 'Segundos médios de leitura em “Kickoff 2027”'));
  hd.appendChild(ht); card.appendChild(hd);
  const vals = A ? DASH.heat.a : DASH.heat.b;
  const row = el('div', 'd-heat-row'); row.style.setProperty('--n', String(vals.length));
  const bin = (v: number) => Math.min(6, Math.floor(v / 5));
  vals.forEach((v, i) => {
    const c = el('div', 'd-cell'), b = bin(v);
    c.tabIndex = 0;
    c.style.setProperty('--c', 'var(' + HEAT_STEPS[b] + ')');
    c.setAttribute('aria-label', DASH.slides[i] + ': ' + v + ' segundos');
    c.title = DASH.slides[i] + ' · ' + v + ' s';
    c.appendChild(el('b', null, v + 's'));
    c.dataset.bin = String(b);
    const dark = paper ? b >= 3 : b <= 2;
    c.style.setProperty('--ink-c', dark ? '#fff' : '#17112b');
    const col = el('div', 'd-hcol'); col.append(c, el('span', 'd-hlab', DASH.slides[i])); row.appendChild(col);
  });
  card.appendChild(row);
  const scl = el('div', 'd-scale'), bar = el('i');
  HEAT_STEPS.forEach(sv => { const b = el('b'); b.style.setProperty('--c', 'var(' + sv + ')'); bar.appendChild(b); });
  scl.append(document.createTextNode('0 s'), bar, document.createTextNode('30 s ou mais'));
  card.appendChild(scl);
  card.appendChild(tableToggle(['Slide', 'Segundos'], vals.map((v, i) => [DASH.slides[i], String(v)])));
  return card;
}

function insightsRow(): HTMLDivElement {
  const r = el('div', 'd-ins');
  DASH.insights.forEach(n => {
    const c = el('div', 'd-card d-in'), ic = el('span', 'ic');
    ic.innerHTML = '<svg aria-hidden="true"><use href="' + n.ic + '"/></svg>';
    const tx = el('div'); tx.append(el('b', null, n.t), el('p', null, n.p));
    c.append(ic, tx); r.appendChild(c);
  });
  return r;
}

function tableToggle(head: string[], rows: string[][]): HTMLDetailsElement {
  const d = el('details', 'd-tbl-toggle'), s = el('summary');
  s.innerHTML = '<svg aria-hidden="true"><use href="#i-chev"/></svg>';
  s.prepend(document.createTextNode('Ver dados em tabela '));
  d.appendChild(s);
  const w = el('div', 'd-tbl-wrap'), t = el('table', 'd-tbl'), th = el('thead'), tr = el('tr');
  head.forEach((h, i) => { const c = el('th', i ? 'n' : null, h); c.scope = 'col'; tr.appendChild(c); });
  th.appendChild(tr); t.appendChild(th);
  const tb = el('tbody');
  rows.forEach(r => { const x = el('tr'); r.forEach((v, i) => x.appendChild(el('td', i ? 'n' : null, v))); tb.appendChild(x); });
  t.appendChild(tb);
  w.appendChild(t); d.appendChild(w);
  return d;
}
