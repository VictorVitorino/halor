/* 24 · Spotlight / Focus · um foco de luz conduz o olhar passo a passo; "Livre" segue o cursor. */
import { q, qa, reflow, type VtCtx, type VtDemo } from '../ctx';

type Step = number | 'free';

const CAPS: Record<string, string> = {
  1: 'Passo 1 · Tudo começa na compra: 100.',
  2: 'Passo 2 · O estoque leva 4 pontos.',
  3: 'Passo 3 · O frete leva 9. É aqui que a margem vaza.',
  free: 'Livre · o foco segue o seu cursor.'
};

export function spotDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const box = q('.vt-sp', card), cap = q('.vt-sp-cap', box), btns = qa<HTMLButtonElement>('.vt-sp-ctl button', box);
  let step: Step = 0, timer = 0, auto = false;

  const place = (x: number, y: number, r?: number, instant?: boolean) => {
    if (instant) box.classList.add('is-free');
    box.style.setProperty('--vt-sx', x + 'px'); box.style.setProperty('--vt-sy', y + 'px');
    if (r) box.style.setProperty('--vt-sr', r + 'px');
    if (instant && step !== 'free') { reflow(box); box.classList.remove('is-free'); }
  };
  const toNode = (k: number, instant: boolean) => {
    const n = box.querySelector(`.vt-sp-node[data-step="${k}"]`); if (!n) return;
    const r = n.getBoundingClientRect(), b = box.getBoundingClientRect();
    place(r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top, Math.max(r.width, r.height) * 1.25, instant);
  };
  const go = (k: Step, fromUser?: boolean) => {
    if (fromUser) { auto = false; ctx.cancel(timer); }
    const first = box.classList.contains('is-off');
    step = k;
    btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.go === String(k))));
    box.classList.toggle('is-free', k === 'free');
    cap.textContent = CAPS[String(k)];
    if (k === 'free') { const b = box.getBoundingClientRect(); if (first) place(b.width / 2, b.height * .4, 84, true); else box.style.setProperty('--vt-sr', '84px'); }
    else toNode(k, first);
    box.classList.remove('is-off');
  };
  const next = () => {
    if (!auto) return;
    const s = typeof step === 'number' ? step : 0;
    if (s >= 3) { auto = false; return; }
    timer = ctx.later(() => { go(s + 1); next(); }, s === 0 ? 350 : 2300);
  };

  btns.forEach(b => ctx.on(b, 'click', () => go(b.dataset.go === 'free' ? 'free' : +(b.dataset.go || 0), true)));
  ctx.on(box, 'pointermove', e => {
    if (step !== 'free') return;
    const b = box.getBoundingClientRect();
    place(e.clientX - b.left, e.clientY - b.top);
  });
  ctx.resize(box, () => { if (typeof step === 'number' && step > 0) toNode(step, true); });
  box.classList.add('is-off');
  ctx.defer(() => {
    box.classList.remove('is-off', 'is-free');
    ['--vt-sx', '--vt-sy', '--vt-sr'].forEach(p => box.style.removeProperty(p));
    btns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    cap.textContent = '';
  });

  return {
    start() { auto = true; step = 0; next(); },
    resume() { if (auto && !timer) next(); },
    pause() { ctx.cancel(timer); timer = 0; },
    replay() { ctx.cancel(timer); box.classList.add('is-off'); auto = true; step = 0; next(); },
    still() { go(3); }
  };
}
