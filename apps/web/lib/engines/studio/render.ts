/* ==========================================================================
   Estúdio · slides montados com as camadas e o estilo do título do editor.
   Usado pelo trilho, pela tela do editor, pelo palco, pelo acervo e pelo HTML exportado.
   ========================================================================== */
import { escHTML, slideHTML, type Layer, type Slide } from '@/lib/slides';
import { CQ_BASE, FONTS_K, PT_BASE, STUDIO } from './store';

export function layerHTML(l: Layer): string {
  const st = `left:${l.x}%;top:${l.y}%;width:${l.w}%;height:${l.h}%;${l.c ? '--lc:' + l.c + ';' : ''}`;
  let inner = '';
  if (l.k === 'text') inner = `<p style="font-size:${((l.z || 24) / 44 * 4.2).toFixed(2)}cqw;font-weight:${l.wt || 600}${l.f ? ';font-family:' + FONTS_K[l.f] : ''}">${l.t}</p>`;
  else if (l.k === 'arrow') inner = '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M3 20H92" vector-effect="non-scaling-stroke"/><path d="M78 5L95 20L78 35" vector-effect="non-scaling-stroke"/></svg>';
  else if (l.k === 'icon') inner = '<svg aria-hidden="true"><use href="#i-spark"/></svg>';
  else if (l.k === 'image') inner = '<span><svg aria-hidden="true"><use href="#i-image"/></svg>Solte uma imagem</span>';
  return `<div class="ly ly-${l.k}${l.fx ? ' has-fx' : ''}" data-ly="${l.id}" style="${st}">${inner}</div>`;
}

export function titleNode(slide: Element | null): HTMLElement | null {
  if (!slide) return null;
  return slide.querySelector<HTMLElement>('.sl-h') || slide.querySelector<HTMLElement>('.sl-end p');
}

/** aplica camadas e estilo do título num slide já renderizado */
export function paintSlide(slide: HTMLElement | null, s: Slide): HTMLElement | null {
  if (!slide) return slide;
  if (s.layers && s.layers.length) slide.insertAdjacentHTML('beforeend', s.layers.map(layerHTML).join(''));
  const h = titleNode(slide), st = s.st;
  if (h && st) {
    if (st.c) h.style.color = st.c;
    if (st.f) h.style.fontFamily = FONTS_K[st.f];
    if (st.z) h.style.fontSize = ((CQ_BASE[s.type] || 4.2) * st.z / (PT_BASE[s.type] || 44)).toFixed(2) + 'cqw';
    if (st.w) h.style.fontWeight = String(st.w);
    if (st.i) h.style.fontStyle = 'italic';
    if (st.a) h.style.textAlign = st.a;
    if (st.x != null && s.type !== 'end') { h.style.left = st.x + '%'; h.style.top = st.y + '%'; }
  }
  return slide;
}

/** o rodapé dos slides acompanha a apresentação aberta */
export const deckTag = (t: string) => escHTML(String(t || '').split('·')[0].trim() || 'Kickoff 2027');

export function mountSlide(box: HTMLElement, s: Slide, n: number): HTMLElement | null {
  box.innerHTML = slideHTML(s, n, undefined, deckTag(STUDIO.title));
  return paintSlide(box.firstElementChild as HTMLElement | null, s);
}
