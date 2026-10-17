/* 35 · Interactive Matrix · bolhas arrastáveis (ponteiro e setas) entre os quadrantes de impacto x esforço.
   Clicar num quadrante (ou na legenda) o destaca. Editável: nova iniciativa (nasce no centro e voa até um
   ponto livre; no máximo 9), cor, rótulos dos quadrantes e eixos. */
import { el } from '../../../core';
import { q, qa, reflow, vtAccent, vtClamp, vtSync, type VtCtx, type VtDemo } from '../ctx';

const QN = ['Ganhos rápidos', 'Grandes apostas', 'Ajustes finos', 'Evitar'];
const START: readonly (readonly [string, number, number])[] = [['Painel', 22, 26], ['Capa nova', 36, 40], ['Treino', 72, 30], ['Migração', 78, 76], ['Relatório', 30, 74]];
const MAXB = 9;
const quad = (x: number, y: number) => (x >= 50 ? 1 : 0) + (y >= 50 ? 2 : 0);
const KEYS = (s: number): Record<string, [number, number]> => ({ ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] });
const pos = (b: HTMLElement) => quad(+(b.dataset.x || 0), +(b.dataset.y || 0));

export function matrixDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const plot = q('.vt-mx-plot', card), leg = q('.vt-mx-leg', card), qs = qa('.vt-mx-q', plot), live = q('.vt-mx-live', card);
  let focusQ = -1, drag: HTMLButtonElement | null = null;
  const lbs = QN.map((name, i) => {
    const b = el('button', 'vt-mx-lb'); b.type = 'button'; b.dataset.q = String(i); b.setAttribute('aria-pressed', 'false');
    b.append(el('span', '', name), el('b', '', '0'));
    leg.append(b); return b;
  });
  const place = (b: HTMLButtonElement) => {
    const x = +(b.dataset.x || 0), y = +(b.dataset.y || 0), k = quad(x, y);
    b.style.left = x + '%'; b.style.top = y + '%';
    b.classList.toggle('is-q0', k === 0);
    b.classList.toggle('is-out', focusQ >= 0 && k !== focusQ);
    b.setAttribute('aria-label', `${b.textContent}: ${QN[k]}. Use as setas para mover.`);
  };
  const tally = () => {
    const n = [0, 0, 0, 0];
    bs.forEach(b => n[pos(b)]++);
    lbs.forEach((l, i) => {
      const c = l.querySelector('b'); if (c) c.textContent = String(n[i]);
      l.setAttribute('aria-label', `${QN[i]}: ${n[i]}. ${focusQ === i ? 'Em destaque.' : 'Destacar.'}`);
    });
  };
  const hot = (k: number) => qs.forEach((d, i) => d.classList.toggle('is-hot', i === k));
  const focus = (k: number) => {
    focusQ = focusQ === k ? -1 : k;
    plot.classList.toggle('has-q', focusQ >= 0);
    qs.forEach((d, i) => d.classList.toggle('is-sel', i === focusQ));
    lbs.forEach((l, i) => l.setAttribute('aria-pressed', String(i === focusQ)));
    bs.forEach(place); tally();
    live.textContent = focusQ >= 0 ? `${QN[focusQ]} em destaque.` : 'Todos os quadrantes.';
  };
  const bind = (b: HTMLButtonElement) => {
    ctx.on(b, 'pointerdown', e => { drag = b; b.setPointerCapture(e.pointerId); b.classList.add('is-drag'); b.style.setProperty('--d', '0ms'); });
    ctx.on(b, 'pointermove', e => {
      if (drag !== b) return;
      const r = plot.getBoundingClientRect();
      b.dataset.x = vtClamp((e.clientX - r.left) / r.width * 100, 6, 94).toFixed(1);
      b.dataset.y = vtClamp((e.clientY - r.top) / r.height * 100, 8, 92).toFixed(1);
      place(b); hot(pos(b));
    });
    const end = () => { if (drag !== b) return; drag = null; b.classList.remove('is-drag'); hot(-1); bs.forEach(place); tally(); };
    ctx.on(b, 'pointerup', end); ctx.on(b, 'pointercancel', end);
    ctx.on(b, 'keydown', e => {
      const d = KEYS(e.shiftKey ? 15 : 5)[e.key];
      if (!d) return;
      e.preventDefault(); b.style.setProperty('--d', '0ms');
      b.dataset.x = String(vtClamp(+(b.dataset.x || 0) + d[0], 6, 94)); b.dataset.y = String(vtClamp(+(b.dataset.y || 0) + d[1], 8, 92));
      place(b); tally();
    });
  };
  const mk = (name: string, x: number | string, y: number | string, i: number) => {
    const b = el('button', 'vt-mx-b', name);
    b.type = 'button'; b.dataset.x = String(x); b.dataset.y = String(y); b.style.setProperty('--d', i * 90 + 'ms');
    plot.append(b); bind(b); return b;
  };
  let bs = START.map(([name, x, y], i) => mk(name, x, y, i));
  /* ponto livre para uma bolha nova: num quadrante sorteado (depois nos outros), o ponto com mais folga
     em relação às outras bolhas e aos nomes dos quadrantes. Folga = distância livre no eixo mais
     afastado, já com uma margem de respiro; se nenhum quadrante tem folga, vale o de maior folga geral */
  const spot = (b: HTMLButtonElement): [number, number] => {
    const r = plot.getBoundingClientRect(), W = r.width, H = r.height;
    if (!W || !H) return [25 + Math.random() * 50, 25 + Math.random() * 50];
    const bw = b.offsetWidth + 12, bh = b.offsetHeight + 8;
    const boxes: [number, number, number, number][] = bs.filter(o => o !== b).map(o => [+(o.dataset.x || 0) / 100 * W, +(o.dataset.y || 0) / 100 * H, o.offsetWidth + 12, o.offsetHeight + 8]);
    if (!card.classList.contains('no-names')) qs.forEach(d => {
      const sp = d.querySelector('span'); if (!sp) return;
      const a = sp.getBoundingClientRect(); boxes.push([a.left - r.left + a.width / 2, a.top - r.top + a.height / 2, a.width + 10, a.height + 8]);
    });
    const room = (x: number, y: number) => boxes.reduce((m, [ox, oy, ow, oh]) => Math.min(m, Math.max(Math.abs(x - ox) - (bw + ow) / 2, Math.abs(y - oy) - (bh + oh) / 2)), Infinity);
    const q0 = Math.floor(Math.random() * 4);
    let best: [number, number, number] = [W / 2, H / 2, -Infinity];
    for (let t = 0; t < 4; t++) {
      const k = (q0 + t) % 4, qx = k % 2, qy = k >> 1;
      const x0 = qx * W / 2 + bw / 2, x1 = Math.max(x0, (qx + 1) * W / 2 - bw / 2), y0 = qy * H / 2 + bh / 2, y1 = Math.max(y0, (qy + 1) * H / 2 - bh / 2);
      let top: [number, number, number] = [x0, y0, -Infinity];
      for (let i = 0; i <= 8; i++) for (let j = 0; j <= 6; j++) {
        const x = x0 + (x1 - x0) * i / 8, y = y0 + (y1 - y0) * j / 6, f = room(x, y);
        if (f > top[2]) top = [x, y, f];
      }
      if (top[2] > best[2]) best = top;
      if (top[2] >= 0) break;
    }
    return [vtClamp(best[0] / W * 100, 6, 94), vtClamp(best[1] / H * 100, 8, 92)];
  };
  lbs.forEach((l, i) => ctx.on(l, 'click', () => focus(i)));
  /* clicar num quadrante vazio também destaca */
  ctx.on(plot, 'click', e => {
    if ((e.target as Element).closest('.vt-mx-b')) return;
    const r = plot.getBoundingClientRect();
    focus(quad((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100));
  });
  const reset = () => {
    bs.forEach((b, i) => { if (i < START.length) { b.dataset.x = String(START[i][1]); b.dataset.y = String(START[i][2]); b.style.setProperty('--d', i * 90 + 'ms'); } place(b); });
    tally();
  };
  reset();

  return {
    replay: reset, still: reset,
    fields: [
      { k: 'add', t: 'add', l: 'Iniciativa', ph: 'Ex.: Portal', max: 14, full: `Máximo de ${MAXB} iniciativas` },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'names', t: 'toggle', l: 'Rótulos', v: true },
      { k: 'axes', t: 'toggle', l: 'Eixos', v: true }
    ],
    set(k, v) {
      if (k === 'add') {
        if (bs.length >= MAXB) { ctx.say(`A matriz já tem ${MAXB} iniciativas.`); return false; }
        const name = String(v);
        /* nasce no centro e voa até um ponto livre */
        const b = mk(name, 50, 50, 0);
        bs.push(b); place(b);
        const [x, y] = spot(b);
        reflow(b);
        b.dataset.x = x.toFixed(1); b.dataset.y = y.toFixed(1);
        place(b); tally(); ctx.kick(b, 'is-new', 700);
        ctx.say(`${name} entrou em ${QN[pos(b)]}. Arraste para mudar de quadrante.`);
        if (bs.length >= MAXB) vtSync(card, 'add', 'full');
        return true;
      }
      if (k === 'acc') vtAccent(card, String(v));
      else if (k === 'names') card.classList.toggle('no-names', !v);
      else if (k === 'axes') card.classList.toggle('no-axes', !v);
    },
    reset() {
      bs.slice(START.length).forEach(b => b.remove()); bs = bs.slice(0, START.length);
      if (focusQ >= 0) focus(focusQ);
      reset(); vtSync(card, 'add', '');
    }
  };
}
