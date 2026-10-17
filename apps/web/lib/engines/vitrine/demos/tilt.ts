/* 03 · 04 · 3D Tilt / Hologram Card · camadas que inclinam com o cursor e reflexo que segue a luz.
   Clique (ou Enter) vira o cartão e mostra o verso com o detalhe. Editável: número, cor, inclinação e reflexo. */
import { q, qa, vtAccent, vtClamp, vtFmt, vtNum, type VtCtx, type VtDemo } from '../ctx';

const KEYS: Record<string, [number, number]> = { ArrowLeft: [0, -5], ArrowRight: [0, 5], ArrowUp: [5, 0], ArrowDown: [-5, 0] };
const SHARE = [.55, .29, .16];

export function tiltDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-ti', card), c = q('.vt-ti-card', box), live = q('.vt-ti-live', box);
  const num = q('.vt-ti-l2 b', c), bnum = q('.vt-ti-bt b', c), cap = q('.vt-ti-l2 span', c), parts = qa('.vt-ti-bl li', c);
  let MAX = 16, flip = false;
  let tx = 0, ty = 0, rx = 0, ry = 0, mx = 50, my = 50, tmx = 50, tmy = 50;
  let manual = false, running = false, raf = 0, t0 = performance.now(), hold = 0;

  const apply = () => {
    c.style.setProperty('--rx', rx.toFixed(2) + 'deg'); c.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    c.style.setProperty('--mx', mx.toFixed(1) + '%'); c.style.setProperty('--my', my.toFixed(1) + '%');
  };
  const frame = (t: number) => {
    if (!running) return;
    if (!manual) {
      const s = (t - t0) / 1000, a = MAX / 16;
      ty = Math.sin(s * .8) * 11 * a; tx = Math.cos(s * .6) * 6 * a;
      tmx = 50 + ty * 3.2; tmy = 50 - tx * 3.2;
    }
    rx += (tx - rx) * .09; ry += (ty - ry) * .09; mx += (tmx - mx) * .09; my += (tmy - my) * .09;
    apply();
    raf = ctx.frame(frame);
  };
  const release = (ms: number) => { hold = ctx.later(() => { manual = false; t0 = performance.now(); }, ms); };
  const label = () => {
    c.setAttribute('aria-label', `Cartão holográfico com a marca do cliente: ${num.textContent}, ${(cap.textContent || '').toLowerCase()}. ${flip ? 'Mostrando o verso. Enter volta para a frente.' : 'Enter vira o cartão e mostra o detalhe; as setas inclinam.'}`);
  };
  const turn = (on: boolean) => {
    flip = on;
    c.classList.toggle('is-flip', on);
    c.setAttribute('aria-pressed', String(on));
    label();
    live.textContent = on ? `Verso: ${parts.map(p => `${p.querySelector('span')?.textContent} ${p.querySelector('b')?.textContent}`).join(', ')}.` : 'Frente do cartão.';
  };

  ctx.on(box, 'pointermove', e => {
    if (ctx.reduced) return;
    const r = c.getBoundingClientRect();
    const px = vtClamp((e.clientX - r.left) / r.width, -.15, 1.15), py = vtClamp((e.clientY - r.top) / r.height, -.15, 1.15);
    manual = true; ctx.cancel(hold);
    ty = vtClamp((px - .5) * 2 * MAX, -MAX, MAX); tx = vtClamp(-(py - .5) * 2 * MAX, -MAX, MAX);
    tmx = px * 100; tmy = py * 100;
  });
  ctx.on(box, 'pointerleave', () => { tx = ty = 0; tmx = tmy = 50; release(900); });
  ctx.on(c, 'click', () => turn(!flip));
  ctx.on(c, 'keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); return; }
    const k = KEYS[e.key];
    if (!k || ctx.reduced) return;
    e.preventDefault(); manual = true; ctx.cancel(hold);
    tx = vtClamp(tx + k[0], -MAX, MAX); ty = vtClamp(ty + k[1], -MAX, MAX);
    tmx = 50 + ty * 3; tmy = 50 - tx * 3;
    release(2500);
  });
  ctx.defer(() => { running = false; });

  const resume = () => { if (running || ctx.reduced) return; running = true; raf = ctx.frame(frame); };
  const pause = () => { running = false; ctx.unframe(raf); };
  return {
    start: resume, resume, pause,
    replay() { turn(false); manual = false; t0 = performance.now(); ry = -38; rx = 10; resume(); },
    still() { rx = 6; ry = -12; mx = 30; my = 30; apply(); },
    fields: [
      { k: 'num', t: 'text', l: 'Número', v: '+38%', max: 12 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'tilt', t: 'range', l: 'Inclinação', v: 16, min: 0, max: 30, step: 1, fmt: v => v + '°' },
      { k: 'sheen', t: 'toggle', l: 'Reflexo', v: true }
    ],
    set(k, v) {
      if (k === 'num') {
        /* sinal de menos tipográfico na frente e no verso */
        const s = String(v).replace(/-(?=\s*\d)/g, '−');
        num.textContent = bnum.textContent = s || ' ';
        /* o verso reparte o número nas três origens, na mesma proporção e com as mesmas
           casas decimais, prefixo e unidade da entrada ("R$ 2,5 mi" vira 1,4 + 0,7 + 0,4) */
        const m = s.match(/^([^\d−]*)(−?)\s*(\d+(?:[.,]\d+)*)(.*)$/);
        if (m) {
          const raw = m[3], n = vtNum(raw);
          const dec = raw.includes(',') ? (raw.split(',').pop() || '').length : /^\d{1,3}(\.\d{3})+$/.test(raw) ? 0 : (raw.split('.')[1] || '').length;
          const u = Math.pow(10, dec), sign = m[2] ? '−' : m[1].includes('+') ? '+' : '', pre = m[1].replace('+', '');
          let left = Math.round(n * u);
          parts.forEach((p, i) => {
            const x = i < 2 ? Math.round(n * u * SHARE[i]) : left; left -= x;
            const b = p.querySelector('b'); if (b) b.textContent = `${sign}${pre}${vtFmt(x / u, dec)}${m[4]}`;
          });
        }
        label();
      } else if (k === 'acc') vtAccent(card, String(v));
      else if (k === 'tilt') { MAX = Number(v); if (ctx.reduced) { rx = MAX * .4; ry = -MAX * .75; apply(); } }
      else if (k === 'sheen') card.classList.toggle('no-sheen', !v);
    },
    reset() { turn(false); }
  };
}
