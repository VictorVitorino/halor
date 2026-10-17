/* ==========================================================================
   SITE · movimento de rolagem
   Barra fixa com o progresso da leitura, menu que acende a seção à vista
   (com Glow / Light Sweep e neon em Planos) e Scroll Reveal reversível:
   os blocos se montam ao descer e se desmontam ao subir, saindo e voltando
   pelo mesmo lado. Blocos novos podem pedir o efeito direto na marcação com
   data-rv="up|card|scale|line|words|eyebrow" e style="--rv-i: N".
   ========================================================================== */
const RV_MAP = [
  ['.s-head > .eyebrow, .s-head-row .eyebrow, .faq-grid .eyebrow', 'eyebrow'],
  ['.s-head h2, .s-head-row h2, .faq-grid h2, .s-final h2', 'words'],
  ['.s-head > .lede, .s-head-row .lede, .s-head > .seg', 'up'],
  ['.sci-grid > .sci', 'line'], ['.equation > *', 'scale'],
  ['.pd-what > article', 'card'], ['.pd-rec', 'scale'], ['.pd-sub', 'up'], ['.pd-carousel', 'up'],
  ['.feat-grid > li', 'line'], ['.p-cta', 'up'],
  ['.tl-ahead > article', 'card'],
  ['.vt-filter', 'up'], ['.vt-cat-head', 'up'], ['.vt-stats > li', 'line'], ['.vt-prin > li', 'card'],
  ['.plans > .plan', 'card'], ['.ent', 'up'], ['.plans-note', 'up'],
  ['.faq details', 'line'], ['.s-final-in > *:not(h2)', 'up'], ['.s-foot-in > *', 'up']
];

/* título: cada palavra vira uma máscara com a palavra dentro (o espaço duro mantém pares juntos) */
function rvWords(h) {
  if (h.dataset.rvSplit) return;
  h.dataset.rvSplit = '1';
  let k = 0;
  const wrap = node => { const w = el('span', 'rv-w'), i = el('span'); i.style.setProperty('--wi', k++); w.appendChild(i); node.replaceWith(w); i.appendChild(node); };
  [...h.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const parts = n.textContent.split(/([ \t\n]+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(p => {
        if (!p) return;
        if (/^[ \t\n]+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
        const w = el('span', 'rv-w'), i = el('span', null, p); i.style.setProperty('--wi', k++); w.appendChild(i); frag.appendChild(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== 'BR') wrap(n);
  });
}

function bootReveal() {
  const site = $('#v-site'); if (!site || REDUCED || !('IntersectionObserver' in window)) return;
  const scope = [...$$('main > section:not(.s-hero)', site), ...$$('footer', site)];
  scope.forEach(sec => RV_MAP.forEach(([q, kind]) => {
    const groups = new Map();
    $$(q, sec).forEach(n => {
      if (n.closest('.vt-card') || n.hasAttribute('data-rv')) return;
      const g = groups.get(n.parentNode) || 0; groups.set(n.parentNode, g + 1);
      n.dataset.rv = kind;
      if (!n.style.getPropertyValue('--rv-i')) n.style.setProperty('--rv-i', g % 6);
    });
  }));
  $$('[data-rv="words"]', site).forEach(rvWords);
  const io = new IntersectionObserver(es => es.forEach(e => {
    const t = e.target;
    if (e.isIntersecting) { t.removeAttribute('data-rv-out'); t.classList.add('rv-in'); }
    else { t.dataset.rvOut = e.boundingClientRect.top < 0 ? 'up' : 'down'; t.classList.remove('rv-in'); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  $$('[data-rv]', site).forEach(n => io.observe(n));
  site.classList.add('rv-on');
  /* blocos que nascem depois (planos, vitrine) entram no mesmo observador */
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (n.nodeType !== 1) return;
    [n, ...$$('[data-rv]', n)].forEach(x => { if (x.dataset && x.dataset.rv) { if (x.dataset.rv === 'words') rvWords(x); io.observe(x); } });
  }))).observe(site, { childList: true, subtree: true });
}

function bootNavMotion() {
  const nav = $('#s-nav'); if (!nav) return;
  const links = $$('.s-links a[href^="#"]', nav), list = $('.s-links', nav);
  const prog = el('span', 's-nav-prog'); prog.setAttribute('aria-hidden', 'true'); nav.appendChild(prog);
  let raf = 0;
  const paint = () => { raf = 0; const max = document.documentElement.scrollHeight - innerHeight; prog.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true }); paint();
  const map = new Map();
  links.forEach((a, i) => {
    a.style.setProperty('--i', i);
    if (a.getAttribute('href') === '#planos') a.classList.add('nav-neon');
    const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map.set(s, a);
  });
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      const a = map.get(e.target); if (!a) return;
      a.classList.toggle('is-on', e.isIntersecting);
      if (e.isIntersecting) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((a, s) => spy.observe(s));
  }
  bootNavMenu(nav, list);
  if (REDUCED || !list) return;
  list.classList.add('nav-intro');
  setTimeout(() => list.classList.remove('nav-intro'), 3200);
  /* de tempos em tempos a luz volta a passar pelo menu */
  setInterval(() => {
    if (document.hidden || currentView !== 'v-site') return;
    list.classList.remove('nav-idle'); void list.offsetWidth; list.classList.add('nav-idle');
  }, 9000);
}

/* menu compacto (até 960 px): o botão abre o painel com os mesmos links.
   Fecha ao escolher uma seção, com Esc (o foco volta ao botão), ao tocar fora,
   quando o foco sai da barra e quando a tela volta a ser larga. */
function bootNavMenu(nav, list) {
  const btn = $('.s-menu', nav); if (!btn || !list) return;
  const mq = matchMedia('(max-width: 960px)');
  let t = 0;
  const isOpen = () => nav.classList.contains('menu-open');
  const setOpen = on => {
    if (on === isOpen()) return;
    nav.classList.toggle('menu-open', on);
    btn.setAttribute('aria-expanded', String(on));
    if (on && !REDUCED) {
      list.classList.remove('nav-intro'); void list.offsetWidth; list.classList.add('nav-intro');
      clearTimeout(t); t = setTimeout(() => list.classList.remove('nav-intro'), 1800);
    }
  };
  btn.addEventListener('click', () => setOpen(!isOpen()));
  list.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) { setOpen(false); btn.focus(); } });
  document.addEventListener('pointerdown', e => { if (isOpen() && !nav.contains(e.target)) setOpen(false); });
  nav.addEventListener('focusout', e => { if (isOpen() && e.relatedTarget && !nav.contains(e.relatedTarget)) setOpen(false); });
  mq.addEventListener('change', () => { if (!mq.matches) setOpen(false); });
}
