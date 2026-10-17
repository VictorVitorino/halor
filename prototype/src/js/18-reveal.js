/* ==========================================================================
   REVELAR AO ROLAR · o conteúdo nasce enquanto a pessoa desce e se desfaz
   quando ela sobe, como numa narrativa contínua (scrollytelling reversível).
   Cada bloco ganha uma animação da Web Animations API que avança ao entrar na
   faixa de leitura da tela e volta ao sair, então subir e descer é sempre suave.
   Usa só opacity, translate, scale, filter e clip-path: não briga com os
   transform e as transições que os componentes já têm (hover, carrossel).
   Marcação: data-rv no bloco; data-rv-stagger no pai para escalonar os filhos.
   Além disso, os blocos comuns do site são marcados aqui automaticamente.
   ========================================================================== */
const RV_AUTO = [
  ['[data-rv-stagger]', 'stagger'],
  ['#v-site .s-head', 'stagger'],
  ['#efeito .sci-grid', 'stagger'],
  ['#efeito .equation', 'stagger'],
  ['.pd-what', 'stagger'],
  ['.pd-feats', 'stagger'],
  ['#plans', 'stagger'],
  ['.faq', 'stagger'],
  ['.s-final-in', 'stagger'],
  ['.s-foot-in', 'stagger'],
  ['.pd-rec-frame', 'frame'],
  ['.rec-steps', 'stagger'],
  ['.pitch', 'frame'],
  ['.p-cta', 'one'],
  ['.plans-note', 'one']
];

function bootReveal() {
  const site = $('#v-site'); if (!site || REDUCED || !('animate' in Element.prototype)) return;
  const cover = $('.s-cover', site);
  const items = new Map();   // elemento -> { a: Animation, i: índice no grupo }
  const add = (n, kind, i) => {
    if (!n || items.has(n) || (cover && cover.contains(n)) || n.closest('.proto, .modal')) return;
    const cs = getComputedStyle(n);
    if (cs.display === 'none' || cs.position === 'fixed') return;
    const op = parseFloat(cs.opacity) || 1;
    const heading = /^H[12]$/.test(n.tagName);
    const blur = cs.filter === 'none' && kind !== 'frame';
    const from = { opacity: 0, translate: kind === 'frame' ? '0 56px' : '0 34px', scale: kind === 'frame' ? .965 : .985 };
    const to = { opacity: op, translate: '0 0', scale: 1 };
    if (blur) { from.filter = 'blur(8px)'; to.filter = 'blur(0px)'; }
    if (heading) { from.clipPath = 'inset(0 0 100% 0)'; to.clipPath = 'inset(0 0 -20% 0)'; }
    if (cs.translate !== 'none' || cs.scale !== 'none') { delete from.translate; delete to.translate; delete from.scale; delete to.scale; }
    const a = n.animate([from, to], { duration: kind === 'frame' ? 1100 : 820, delay: Math.min(i, 7) * 85, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' });
    a.pause(); a.currentTime = 0;
    items.set(n, { a, done: false });
  };
  for (const [sel, kind] of RV_AUTO) $$(sel, site).forEach(p => {
    if (kind === 'stagger') [...p.children].filter(c => !c.matches('script, style, [hidden]')).forEach((c, i) => add(c, 'one', i));
    else add(p, kind, 0);
  });
  $$('[data-rv]', site).forEach(n => add(n, n.dataset.rv === 'frame' ? 'frame' : 'one', +(n.dataset.rvI || 0)));

  /* faixa de leitura: um pouco menor que a tela, para o bloco nascer e se desfazer à vista */
  const io = new IntersectionObserver(es => {
    for (const e of es) {
      const it = items.get(e.target); if (!it) continue;
      if (e.isIntersecting) { it.a.playbackRate = 1; it.a.play(); }
      else if (it.a.currentTime > 0) { it.a.playbackRate = -1.6; it.a.play(); }
    }
  }, { rootMargin: '-6% 0px -12% 0px', threshold: 0 });
  items.forEach((_, n) => io.observe(n));
  /* ao sair do site tudo volta ao estado visível, sem animação presa */
  document.addEventListener('halor:view', e => {
    if (e.detail === 'v-site') return;
    items.forEach(it => { it.a.pause(); it.a.currentTime = 0; });
  });
}

/* Menus do site: onda de luz periódica e a seção à vista acesa no menu */
function bootNavFx() {
  const links = $('.s-links'); if (!links) return;
  if (!REDUCED) {
    const wave = () => { links.classList.remove('sweep'); void links.offsetWidth; links.classList.add('sweep'); };
    setTimeout(wave, 2200);
    setInterval(() => { if (currentView === 'v-site' && !document.hidden && window.scrollY < innerHeight * 6) wave(); }, 9000);
  }
  const map = $$('a[href^="#"]', links).map(a => ({ a, s: document.getElementById(a.getAttribute('href').slice(1)) })).filter(x => x.s);
  const seen = new Map();
  const io = new IntersectionObserver(es => {
    es.forEach(e => seen.set(e.target, e.isIntersecting ? e.intersectionRatio : 0));
    let best = null, r = 0;
    map.forEach(x => { const v = seen.get(x.s) || 0; if (v > r) { r = v; best = x; } });
    map.forEach(x => { if (x === best) x.a.setAttribute('aria-current', 'true'); else x.a.removeAttribute('aria-current'); });
  }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, .01, .25, .5, .75, 1] });
  map.forEach(x => io.observe(x.s));
}
