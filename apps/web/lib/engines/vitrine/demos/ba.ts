/* 37 · Before / After Slider · divisor arrastável (ponteiro e teclado) entre o slide de antes e o de depois.
   Editável: número e legenda do depois, cor e etiquetas. */
import { q, vtAccent, vtClamp, vtEase, type VtCtx, type VtDemo } from '../ctx';

export function baDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-ba-box', card), knob = q('.vt-ba-knob', box), big = q('.vt-ba-big', box), kk = q('.vt-ba-k', box);
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
  /* ao editar o depois, o divisor abre espaço para ele aparecer */
  const reveal = () => { if (p > 45) { stop?.(); const a = p; stop = ctx.tween(500, t => set(a + (35 - a) * vtEase(t)), () => { stop = null; }); } };
  set(ctx.reduced ? 50 : 100);
  return {
    start: sweep, replay: sweep, still: () => set(50),
    fields: [
      { k: 'num', t: 'text', l: 'Número', v: big.textContent || '', max: 8 },
      { k: 'cap', t: 'text', l: 'Legenda', v: kk.textContent || '', max: 24 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'tags', t: 'toggle', l: 'Etiquetas', v: true }
    ],
    set(k, v) {
      if (k === 'num') { big.textContent = String(v) || ' '; reveal(); }
      else if (k === 'cap') { kk.textContent = String(v) || ' '; reveal(); }
      else if (k === 'acc') { vtAccent(card, String(v)); reveal(); }
      else if (k === 'tags') card.classList.toggle('no-tags', !v);
    }
  };
}
