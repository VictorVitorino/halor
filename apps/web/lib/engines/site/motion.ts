/* ==========================================================================
   SITE · movimento de rolagem
   Barra fixa com o progresso da leitura, menu que acende a seção à vista
   (com Glow / Light Sweep e neon em Planos) e Scroll Reveal reversível:
   os blocos se montam ao descer e se desmontam ao subir, saindo e voltando
   pelo mesmo lado. Blocos novos podem pedir o efeito direto na marcação com
   data-rv="up|card|scale|line|words|eyebrow" e style={{ '--rv-i': N }}.
   Porte de prototype/src/js/31-motion.js.
   ========================================================================== */
import { $, $$, REDUCED, currentView, el } from '@/lib/core';
import type { Dispose } from './produto';

const RV_MAP: [string, string][] = [
  ['.s-head > .eyebrow, .s-head-row .eyebrow, .faq-grid .eyebrow', 'eyebrow'],
  ['.s-head h2, .s-head-row h2, .faq-grid h2, .s-final h2', 'words'],
  ['.s-head > .lede, .s-head-row .lede, .s-head > .seg', 'up'],
  ['.sci-grid > .sci', 'line'], ['.equation > *', 'scale'],
  ['.pd-what > article', 'card'], ['.pd-rec', 'scale'], ['.pd-sub', 'up'], ['.pd-carousel', 'up'],
  ['.feat-grid > li', 'line'], ['.p-cta', 'up'],
  ['.tl-ahead > article', 'card'],
  ['.vt-filter', 'up'], ['.vt-cat-head', 'up'], ['.vt-stats > li', 'line'], ['.vt-prin > li', 'card'],
  ['.plans > .plan', 'card'], ['.ent', 'up'], ['.plans-note', 'up'],
  ['.faq details', 'line'], ['.s-final-in > *:not(h2)', 'up'], ['.s-foot-in > *', 'up'],
];

/* título: cada palavra vira uma máscara com a palavra dentro (o espaço duro mantém pares juntos).
   Idempotente: o modo estrito do React monta duas vezes. */
function rvWords(h: HTMLElement) {
  if (h.dataset.rvSplit) return;
  h.dataset.rvSplit = '1';
  let k = 0;
  const word = () => { const w = el('span', 'rv-w'), i = el('span'); i.style.setProperty('--wi', String(k++)); w.appendChild(i); return [w, i] as const; };
  Array.from(h.childNodes).forEach(n => {
    if (n.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      (n.textContent ?? '').split(/([ \t\n]+)/).forEach(p => {
        if (!p) return;
        if (/^[ \t\n]+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
        const [w, i] = word(); i.textContent = p; frag.appendChild(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName !== 'BR') {
      const [w, i] = word(); n.replaceWith(w); i.appendChild(n);
    }
  });
}

export function bootReveal(root: ParentNode): Dispose {
  const site = (root instanceof HTMLElement && root.id === 'v-site' ? root : $('#v-site', root)) as HTMLElement | null;
  if (!site || REDUCED || typeof IntersectionObserver === 'undefined') return () => {};
  const scope = [...$$('main > section:not(.s-hero)', site), ...$$('footer', site)];
  scope.forEach(sec => RV_MAP.forEach(([q, kind]) => {
    const groups = new Map<Node, number>();
    $$(q, sec).forEach(n => {
      if (n.closest('.vt-card') || n.hasAttribute('data-rv')) return;
      const parent = n.parentNode as Node, g = groups.get(parent) ?? 0; groups.set(parent, g + 1);
      n.dataset.rv = kind;
      if (!n.style.getPropertyValue('--rv-i')) n.style.setProperty('--rv-i', String(g % 6));
    });
  }));
  $$('[data-rv="words"]', site).forEach(rvWords);
  const io = new IntersectionObserver(es => es.forEach(e => {
    const t = e.target as HTMLElement;
    if (e.isIntersecting) { t.removeAttribute('data-rv-out'); t.classList.add('rv-in'); }
    else { t.dataset.rvOut = e.boundingClientRect.top < 0 ? 'up' : 'down'; t.classList.remove('rv-in'); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  $$('[data-rv]', site).forEach(n => io.observe(n));
  site.classList.add('rv-on');
  /* blocos que nascem depois (planos, vitrine) entram no mesmo observador */
  const mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (!(n instanceof HTMLElement)) return;
    [n, ...$$('[data-rv]', n)].forEach(x => { if (x.dataset.rv) { if (x.dataset.rv === 'words') rvWords(x); io.observe(x); } });
  })));
  mo.observe(site, { childList: true, subtree: true });
  return () => {
    io.disconnect(); mo.disconnect(); site.classList.remove('rv-on');
    $$('[data-rv]', site).forEach(n => { n.classList.remove('rv-in'); n.removeAttribute('data-rv-out'); });
  };
}

export function bootNavMotion(root: ParentNode): Dispose {
  const nav = $('#s-nav', root);
  if (!nav) return () => {};
  const list = $('.s-links', nav), links = $$<HTMLAnchorElement>('.s-links a[href^="#"]', nav);
  const ac = new AbortController();
  const prog = el('span', 's-nav-prog'); prog.setAttribute('aria-hidden', 'true'); nav.appendChild(prog);
  let raf = 0;
  const paint = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : '0');
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true, signal: ac.signal });
  paint();
  const map = new Map<Element, HTMLAnchorElement>();
  links.forEach((a, i) => {
    a.style.setProperty('--i', String(i));
    const href = a.getAttribute('href') ?? '';
    if (href === '#planos') a.classList.add('nav-neon');
    const s = document.getElementById(href.slice(1)); if (s) map.set(s, a);
  });
  let spy: IntersectionObserver | null = null;
  if (typeof IntersectionObserver !== 'undefined') {
    spy = new IntersectionObserver(es => es.forEach(e => {
      const a = map.get(e.target); if (!a) return;
      a.classList.toggle('is-on', e.isIntersecting);
      if (e.isIntersecting) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_a, s) => spy!.observe(s));
  }
  let intro = 0, idle = 0;
  if (!REDUCED && list) {
    list.classList.add('nav-intro');
    intro = window.setTimeout(() => list.classList.remove('nav-intro'), 3200);
    /* de tempos em tempos a luz volta a passar pelo menu */
    idle = window.setInterval(() => {
      if (document.hidden || currentView !== 'v-site') return;
      list.classList.remove('nav-idle'); void list.offsetWidth; list.classList.add('nav-idle');
    }, 9000);
  }
  return () => {
    ac.abort(); cancelAnimationFrame(raf); clearTimeout(intro); clearInterval(idle); spy?.disconnect(); prog.remove();
    list?.classList.remove('nav-intro', 'nav-idle');
    links.forEach(a => { a.classList.remove('is-on', 'nav-neon'); a.removeAttribute('aria-current'); });
  };
}
