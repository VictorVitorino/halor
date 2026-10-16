/* 37 · Before / After Slider · divisor arrastável (ponteiro e teclado) entre o slide de antes e o de depois. */
import { q, vtClamp, vtEase, type VtCtx, type VtDemo } from '../ctx';

export function baDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-ba-box', card), knob = q('.vt-ba-knob', box);
  let p = 50, stop: (() => void) | null = null, drag = false;
  const set = (v: number) => {
    p = vtClamp(v, 0, 100);
    box.style.setProperty('--p', p.toFixed(2) + '%');
    const r = Math.round(p);
    knob.setAttribute('aria-valuenow', String(r));
    knob.setAttribute('aria-valuetext', r >= 100 ? 'Só o antes' : r <= 0 ? 'Só o depois' : `${r}% antes, ${100 - r}% depois`);
  };
  const fromX = (x: number) => { const r = box.getBoundingClientRect(); return (x - r.left) / r.width * 100; };
  ctx.on(box, 'pointerdown', e => {
    if (e.pointerType === 'touch' && !(e.target as Element).closest('.vt-ba-knob')) return;
    stop?.(); stop = null; drag = true;
    box.setPointerCapture(e.pointerId); set(fromX(e.clientX));
  });
  ctx.on(box, 'pointermove', e => { if (drag) set(fromX(e.clientX)); });
  ctx.on(box, 'pointerup', () => { drag = false; });
  ctx.on(box, 'pointercancel', () => { drag = false; });
  ctx.on(knob, 'keydown', e => {
    const s = e.shiftKey ? 10 : 5;
    const v = ({ ArrowLeft: p - s, ArrowDown: p - s, ArrowRight: p + s, ArrowUp: p + s, Home: 0, End: 100 } as Record<string, number>)[e.key];
    if (v == null) return;
    e.preventDefault(); stop?.(); stop = null; set(v);
  });
  const sweep = () => {
    stop?.(); set(100);
    stop = ctx.tween(1200, t => set(100 - 72 * vtEase(t)), () => { stop = ctx.tween(700, t => set(28 + 22 * vtEase(t)), () => { stop = null; }); });
  };
  set(ctx.reduced ? 50 : 100);
  ctx.defer(() => {
    box.style.removeProperty('--p');
    knob.setAttribute('aria-valuenow', '50'); knob.setAttribute('aria-valuetext', 'Metade antes, metade depois');
  });
  return { start: sweep, replay: sweep, still: () => set(50) };
}
