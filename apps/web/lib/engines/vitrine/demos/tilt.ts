/* 03 · 04 · 3D Tilt / Hologram Card · camadas que inclinam com o cursor e reflexo que segue a luz. */
import { q, vtClamp, type VtCtx, type VtDemo } from '../ctx';

const KEYS: Record<string, [number, number]> = { ArrowLeft: [0, -5], ArrowRight: [0, 5], ArrowUp: [5, 0], ArrowDown: [-5, 0] };

export function tiltDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-ti', card), c = q('.vt-ti-card', box), MAX = 16;
  let tx = 0, ty = 0, rx = 0, ry = 0, mx = 50, my = 50, tmx = 50, tmy = 50;
  let manual = false, running = false, raf = 0, t0 = performance.now(), hold = 0;

  const apply = () => {
    c.style.setProperty('--rx', rx.toFixed(2) + 'deg'); c.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    c.style.setProperty('--mx', mx.toFixed(1) + '%'); c.style.setProperty('--my', my.toFixed(1) + '%');
  };
  const frame = (t: number) => {
    if (!running) return;
    if (!manual) {
      const s = (t - t0) / 1000;
      ty = Math.sin(s * .8) * 11; tx = Math.cos(s * .6) * 6;
      tmx = 50 + ty * 3.2; tmy = 50 - tx * 3.2;
    }
    rx += (tx - rx) * .09; ry += (ty - ry) * .09; mx += (tmx - mx) * .09; my += (tmy - my) * .09;
    apply();
    raf = ctx.frame(frame);
  };
  const release = (ms: number) => { hold = ctx.later(() => { manual = false; t0 = performance.now(); }, ms); };

  ctx.on(box, 'pointermove', e => {
    if (ctx.reduced) return;
    const r = c.getBoundingClientRect();
    const px = vtClamp((e.clientX - r.left) / r.width, -.15, 1.15), py = vtClamp((e.clientY - r.top) / r.height, -.15, 1.15);
    manual = true; ctx.cancel(hold);
    ty = vtClamp((px - .5) * 2 * MAX, -MAX, MAX); tx = vtClamp(-(py - .5) * 2 * MAX, -MAX, MAX);
    tmx = px * 100; tmy = py * 100;
  });
  ctx.on(box, 'pointerleave', () => { tx = ty = 0; tmx = tmy = 50; release(900); });
  ctx.on(c, 'keydown', e => {
    const k = KEYS[e.key];
    if (!k || ctx.reduced) return;
    e.preventDefault(); manual = true; ctx.cancel(hold);
    tx = vtClamp(tx + k[0], -MAX, MAX); ty = vtClamp(ty + k[1], -MAX, MAX);
    tmx = 50 + ty * 3; tmy = 50 - tx * 3;
    release(2500);
  });
  ctx.defer(() => { running = false; ['--rx', '--ry', '--mx', '--my'].forEach(p => c.style.removeProperty(p)); });

  const resume = () => { if (running || ctx.reduced) return; running = true; raf = ctx.frame(frame); };
  const pause = () => { running = false; ctx.unframe(raf); };
  return {
    start: resume, resume, pause,
    replay() { manual = false; t0 = performance.now(); ry = -38; rx = 10; resume(); },
    still() { rx = 6; ry = -12; mx = 30; my = 30; apply(); }
  };
}
