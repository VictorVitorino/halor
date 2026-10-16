/* ==========================================================================
   Estúdio · Palco: slide atual e seguinte, notas, cronômetro, pulso da audiência,
   votação ao vivo, teclado, clique no slide e tela cheia.
   Porte de prototype/src/js/50-studio.js; bootStage() é o subHooks.apresentar
   (startStage) mais o bindStage() do protótipo, ligado com a rota /apresentar.
   ========================================================================== */
import { $, $$, el, toast } from '@/lib/core';
import { bootFields } from '@/lib/engines/particles';
import { votesLabel, type Slide } from '@/lib/slides';
import { onStudioKey } from './keys';
import { go } from './nav';
import { closePop, popOpen } from './pop';
import { mountSlide, titleNode } from './render';
import { STUDIO } from './store';
import { clampN, makeScope, modalOpen, plainText, reduced, studioOpen, typingIn } from './util';

let clockT = 0, pulseT = 0, pollT = 0;
const ENTER_Q = ['.sl-sub', '.sl-body', '.sl-img', '.sl-big', '.sl-chart', '.sl-row', '.sl-opts', '.sl-vote', '.sl-line', '.sl-tbl', '.sl-list', '.sl-cta', '.ly'];

function entrance(sl: HTMLElement | null, s: Slide) {
  if (reduced() || !sl) return;
  const h = titleNode(sl);
  if (h) { h.style.setProperty('--fxd', (s.fxd || 900) + 'ms'); h.classList.add('fx-' + (s.fx || 'subir')); }
  let k = 0;
  ENTER_Q.forEach(q => $$(q, sl).forEach(n => {
    const L = n.classList.contains('ly') ? (s.layers || []).find(x => x.id === n.dataset.ly) : undefined;
    n.style.setProperty('--fxdl', (220 + k++ * 90) + 'ms'); n.style.setProperty('--fxd', ((L && L.fxd) || 700) + 'ms');
    n.classList.add(q === '.sl-line' ? 'fx-revelar' : 'fx-' + ((L && L.fx) || 'subir'));
  }));
}
function paintPoll(sl: Element, s: Slide) {
  const opts = s.opts!, raw = opts.reduce((a, o) => a + o[1], 0), tot = raw || 1, mx = Math.max(...opts.map(o => o[1]));
  $$('.sl-opt', sl).forEach((n, i) => { const p = Math.round(opts[i][1] / tot * 100); n.style.setProperty('--v', p + '%'); $('b', n)!.textContent = p + '%'; n.classList.toggle('hi', opts[i][1] === mx); });
  const em = $('.sl-vote em', sl); if (em) em.textContent = votesLabel(raw);
}
function renderStage() {
  const now = $('#stage-now'); if (!now) return;
  const D = STUDIO.deck; STUDIO.stage = clampN(STUDIO.stage, 0, D.length - 1);
  const i = STUDIO.stage, s = D[i];
  entrance(mountSlide(now, s, i + 1), s);
  const nx = D[i + 1], nextBox = $('#stage-next')!;
  if (nx) mountSlide(nextBox, nx, i + 2);
  else nextBox.innerHTML = '<div class="stage-end"><svg aria-hidden="true"><use href="#hl-mark"/></svg><b>Fim da apresentação</b><span>Esc volta ao editor</span></div>';
  $('.stage-next .sk')!.textContent = nx ? 'A seguir · slide ' + (i + 2) : 'A seguir';
  $('#stage-notes')!.textContent = s.n || 'Sem notas para este slide.';
  $('.stage-title')!.textContent = STUDIO.title;
  const dots = $('#stage-dots')!; dots.textContent = '';
  D.forEach((x, k) => {
    const b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Ir para o slide ' + (k + 1) + ': ' + plainText(x.h || x.k || '')); b.title = 'Slide ' + (k + 1);
    if (k === i) b.setAttribute('aria-current', 'true');
    b.addEventListener('click', () => { STUDIO.stage = k; renderStage(); }); dots.appendChild(b);
  });
  $<HTMLButtonElement>('[data-stage="-1"]')!.disabled = i === 0; $<HTMLButtonElement>('[data-stage="1"]')!.disabled = i === D.length - 1;
  $('#stage-live')!.textContent = 'Slide ' + (i + 1) + ' de ' + D.length + ': ' + plainText(s.h || '');
  clearInterval(pollT);
  if (s.type === 'poll') {
    const sl = now.firstElementChild!;
    if (!reduced()) pollT = window.setInterval(() => {
      if (!studioOpen('apresentar')) return clearInterval(pollT);
      const opts = s.opts!, w = opts.map((o, k) => 1 + (k === 0 ? 2.2 : 0) + o[1] / 20), sum = w.reduce((a, b) => a + b, 0);
      let r = Math.random() * sum, k = 0; while (r > w[k]) { r -= w[k]; k++; }
      opts[Math.min(k, opts.length - 1)][1]++; paintPoll(sl, s);
    }, 1100);
  }
}
function stageGo(n: number) { const before = STUDIO.stage; STUDIO.stage = clampN(n, 0, STUDIO.deck.length - 1); if (STUDIO.stage !== before) renderStage(); }
function startStage() {
  STUDIO.stage = STUDIO.cur;
  renderStage();
  let sec = 0;
  const clock = $('#stage-clock')!;
  clock.textContent = '0:00';
  clearInterval(clockT); clearInterval(pulseT);
  clockT = window.setInterval(() => { if (!studioOpen('apresentar')) return; sec++; clock.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }, 1000);
  const pts = Array.from({ length: 30 }, (_, i) => 70 + Math.sin(i / 3) * 8 + Math.random() * 6);
  const path = $('#pulse-path')!, val = $('#pulse-val')!;
  const draw = () => { path.setAttribute('d', 'M' + pts.map((v, i) => (i / 29 * 240).toFixed(1) + ' ' + (56 - (v - 50) / 50 * 52).toFixed(1)).join(' L')); val.textContent = Math.round(pts[29]) + '%'; };
  draw();
  if (!reduced()) pulseT = window.setInterval(() => { if (!studioOpen('apresentar')) return; pts.shift(); const last = pts[pts.length - 1]; pts.push(Math.max(62, Math.min(97, last + (Math.random() - .45) * 7))); draw(); }, 900);
}

/** Liga o palco (ao montar /apresentar) e devolve a limpeza. */
export function bootStage(): () => void {
  const sub = $<HTMLElement>('[data-subview="apresentar"]'); if (!sub || !$('#stage-now')) return () => {};
  const S = makeScope(), o = S.o;
  $$('[data-stage]', sub).forEach(b => b.addEventListener('click', () => stageGo(STUDIO.stage + +b.dataset.stage!), o));
  const fs = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else sub.requestFullscreen().catch(() => toast('Tela cheia indisponível aqui'));
    } catch { toast('Tela cheia indisponível aqui'); }
  };
  const offKey = onStudioKey('stage', e => {
    if (e.defaultPrevented || !studioOpen('apresentar') || modalOpen() || popOpen()) return;
    if (typingIn(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    const onBtn = e.target instanceof Element && e.target.closest('button, a');
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (!onBtn && (e.key === ' ' || e.key === 'Enter'))) { e.preventDefault(); stageGo(STUDIO.stage + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (!onBtn && e.key === 'Backspace')) { e.preventDefault(); stageGo(STUDIO.stage - 1); }
    else if (e.key === 'Home') { e.preventDefault(); stageGo(0); }
    else if (e.key === 'End') { e.preventDefault(); stageGo(STUDIO.deck.length - 1); }
    else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); fs(); }
    else if (e.key === 'Escape' && !document.fullscreenElement) { STUDIO.cur = STUDIO.stage; go('/editor'); }
  });
  $('#stage-fs', sub)?.addEventListener('click', fs, o);
  /* clique ou toque no slide: terço da esquerda volta, o resto avança (como no HTML exportado) */
  $('.stage-now', sub)?.addEventListener('click', e => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); stageGo(STUDIO.stage + (e.clientX - r.left < r.width / 3 ? -1 : 1)); }, o);
  document.addEventListener('fullscreenchange', () => {
    const on = !!document.fullscreenElement; const b = $('#stage-fs');
    if (b) { b.setAttribute('aria-label', on ? 'Sair da tela cheia' : 'Tela cheia'); b.setAttribute('aria-pressed', String(on)); }
  }, o);
  /* sair pelo botão volta ao editor no slide em que o palco parou */
  $('.stage-top a[href^="/editor"]', sub)?.addEventListener('click', () => { STUDIO.cur = STUDIO.stage; }, o);
  const offFields = bootFields(document.getElementById('v-studio') ?? document);
  startStage();
  return () => {
    S.dispose(); offKey(); offFields(); closePop(false);
    clearInterval(clockT); clearInterval(pulseT); clearInterval(pollT);
    if (document.fullscreenElement && sub.contains(document.fullscreenElement)) document.exitFullscreen().catch(() => {});
  };
}
