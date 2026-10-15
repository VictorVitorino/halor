/* ==========================================================================
   MARCA · amostras de cor clicáveis, escala da cadeia, índice com destaque
   ========================================================================== */
const SWATCHES = {
  night: [
    ['Vazio', '#07040F', 'Chão do mundo Noite', '#ffffff'],
    ['Noite', '#0E0820', 'Superfícies e cartões', '#ffffff'],
    ['Crepúsculo', '#171030', 'Painéis elevados', '#ffffff'],
    ['Violeta Halor', '#8B3DFF', 'Ação principal · 5:1 com branco', '#ffffff'],
    ['Neon', '#A970FF', 'Violeta como texto no escuro', '#07040f'],
    ['Brilho', '#C9A6FF', 'Halos, foco e realces', '#07040f'],
    ['Lúmen', '#F4EEFF', 'Texto e núcleo do halo', '#07040f']
  ],
  paper: [
    ['Papel', '#FFFFFF', 'Fundo do Estúdio', '#17112b'],
    ['Névoa', '#F8F6FE', 'Fundo do app', '#17112b'],
    ['Lilás 50', '#F3EEFF', 'Seleção e destaque suave', '#17112b'],
    ['Lilás 200', '#D9C7FF', 'Bordas de destaque', '#17112b'],
    ['Linha', '#E8E3F4', 'Divisórias', '#17112b'],
    ['Violeta 700', '#6421D1', 'Violeta como texto · 7,8:1', '#ffffff'],
    ['Grafite', '#4A4366', 'Texto de apoio', '#ffffff'],
    ['Tinta', '#17112B', 'Texto principal · 18:1', '#ffffff']
  ]
};
function renderBrand() {
  $$('[data-swatches]').forEach(box => {
    if (box.children.length) return;
    SWATCHES[box.dataset.swatches].forEach(([n, hex, use, ink]) => {
      const b = el('button', 'sw'); b.type = 'button'; b.setAttribute('aria-label', 'Copiar ' + n + ' ' + hex);
      const c = el('span', 'sw-c'); c.style.setProperty('--c', hex);
      if (hex === '#FFFFFF') c.style.boxShadow = 'inset 0 -1px 0 var(--line)';
      const em = el('em', null, 'Copiar'); em.style.color = '#17112b'; c.appendChild(em);
      const t = el('span', 'sw-b'); t.append(el('b', null, n), el('span', null, hex), el('small', null, use));
      b.append(c, t);
      b.addEventListener('click', () => copyText(hex));
      box.appendChild(b);
    });
  });
  $$('[data-chain]').forEach(box => {
    if (box.children.length) return;
    const night = box.dataset.chain === 'night';
    const cols = night ? ['#5A35A8', '#7040D6', '#8752F5', '#9F70FF', '#B791FF', '#CFB3FF', '#E9DEFF'] : ['#C4A6FF', '#B08AFF', '#9C6CFF', '#8B4FFA', '#7A33EB', '#6420CC', '#4A11A0'];
    cols.forEach((hex, i) => {
      const d = el('div'); d.style.setProperty('--c', hex);
      const ink = night ? (i <= 2 ? '#fff' : '#17112b') : (i <= 2 ? '#17112b' : '#fff');
      d.style.setProperty('--t', ink);
      d.append(el('b', null, (i + 1) + ' · ' + CHAIN_STEPS[i].n), el('span', null, hex));
      box.appendChild(d);
    });
  });
  // índice: destaca a seção visível
  const links = $$('.b-toc a');
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); });
  }, { rootMargin: '-30% 0px -60% 0px' });
  $$('.b-sec').forEach(s => obs.observe(s));
  // reinicia a animação ao clicar
  $$('[data-replay]').forEach(b => b.addEventListener('click', () => {
    const s = $('.mv-stage > *', b); const c = s.cloneNode(true); s.replaceWith(c);
  }));
}
