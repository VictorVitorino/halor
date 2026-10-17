/* 11 · Animated Typography · o título entra palavra a palavra (CSS, com .is-on); clicar numa
   palavra a torna a palavra-chave com sublinhado de luz. As palavras formam uma barra de
   ferramentas com foco itinerante (setas, Home, End; Enter escolhe).
   Editável: título, cor, ritmo de entrada e sublinhado. */
import { el } from '../../../core';
import { q, qa, vtAccent, vtRestart, type VtCtx, type VtDemo } from '../ctx';

export function typeDemo(card: HTMLElement, ctx: VtCtx): VtDemo {
  const h = q('.vt-ty-h', card), sr = q('.vt-ty-sr', card);
  let ws = qa<HTMLButtonElement>('.w', h), key = ws.findIndex(w => w.classList.contains('vt-ty-u')), replayT = 0;

  const pick = (i: number, draw?: boolean) => {
    key = i;
    ws.forEach((w, j) => { w.classList.toggle('vt-ty-u', j === i); w.setAttribute('aria-pressed', String(j === i)); w.tabIndex = j === i ? 0 : -1; });
    if (draw && ws[i]) ctx.kick(ws[i], 'is-pick', 900);
  };
  const build = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const prev = ws[key]?.textContent;
    h.textContent = '';
    let i = 0;
    ws = words.map((t, j) => {
      const b = el('button', 'w', t); b.type = 'button';
      if (/\d/.test(t)) { b.classList.add('vt-ty-n'); i++; }
      b.style.setProperty('--i', String(i++));
      if (j) h.append(' ');
      h.append(b); return b;
    });
    h.style.setProperty('--n', String(i));
    /* a palavra-chave continua a mesma; se ela sumiu, vai para o primeiro número ou, sem número, para a palavra mais longa */
    let k = ws.findIndex(w => w.textContent === prev);
    if (k < 0) k = ws.findIndex(w => w.classList.contains('vt-ty-n'));
    if (k < 0) k = ws.reduce((a, w, j) => (w.textContent || '').length > (ws[a].textContent || '').length ? j : a, 0);
    pick(k);
    sr.textContent = words.join(' ');
  };

  ctx.on(h, 'click', e => { const b = (e.target as Element).closest<HTMLButtonElement>('.w'); if (b) pick(ws.indexOf(b), true); });
  ctx.on(h, 'keydown', e => {
    const i = ws.indexOf(document.activeElement as HTMLButtonElement); if (i < 0) return;
    const j = ({ ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: ws.length - 1 } as Record<string, number>)[e.key];
    if (j == null) return;
    e.preventDefault();
    const n = ws[(j + ws.length) % ws.length];
    ws.forEach(w => { w.tabIndex = w === n ? 0 : -1; }); n.focus();
  });
  ctx.on(h, 'focusout', e => { if (!h.contains(e.relatedTarget as Node)) ws.forEach((w, j) => { w.tabIndex = j === key ? 0 : -1; }); });

  const TITLE = sr.textContent || '';
  pick(key);
  return {
    replay() { if (ws[key]) ctx.kick(ws[key], 'is-pick', 900); },
    fields: [
      { k: 'title', t: 'text', l: 'Título', v: TITLE, max: 64 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'speed', t: 'range', l: 'Ritmo', v: 110, min: 40, max: 260, step: 10, fmt: v => v + ' ms' },
      { k: 'line', t: 'toggle', l: 'Sublinhado', v: true }
    ],
    set(k, v) {
      if (k === 'title') build(String(v) || TITLE);
      else if (k === 'acc') vtAccent(card, String(v));
      else if (k === 'line') card.classList.toggle('no-line', !v);
      else if (k === 'speed') {
        card.style.setProperty('--vt-stg', v + 'ms');
        ctx.cancel(replayT);
        if (!ctx.reduced && card.classList.contains('is-on')) replayT = ctx.later(() => vtRestart(card), 380);
      }
    },
    reset() { const i = ws.findIndex(w => w.textContent === 'cresceu'); if (i >= 0) pick(i); }
  };
}
