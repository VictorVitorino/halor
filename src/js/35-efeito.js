/* ==========================================================================
   EFEITO HALOR · seção interativa do site
   ========================================================================== */
const RING_FILL = ['#5a35a8', '#7040d6', '#8752f5', '#9f70ff', '#b791ff', '#cfb3ff', '#e9deff'];
const RING_INK = ['#fff', '#fff', '#fff', '#17112b', '#17112b', '#17112b', '#17112b'];

function buildHaloRings() {
  const svg = $('#halo-rings'); if (!svg) return;
  const C = 260, radii = [250, 216, 182, 148, 114, 80, 46], gap = 3;
  const defs = svgEl('defs'); svg.appendChild(defs);
  CHAIN_STEPS.forEach((s, i) => {
    const g = svgEl('g', { class: 'ring', 'data-i': i, tabindex: '0', role: 'button', 'aria-label': 'Anel ' + (i + 1) + ': ' + s.n });
    const ro = radii[i], ri = i < 6 ? radii[i + 1] + gap : 0;
    if (i < 6) {
      const d = `M${C - ro},${C}a${ro},${ro} 0 1,0 ${ro * 2},0a${ro},${ro} 0 1,0 ${-ro * 2},0Z M${C - ri},${C}a${ri},${ri} 0 1,1 ${ri * 2},0a${ri},${ri} 0 1,1 ${-ri * 2},0Z`;
      g.appendChild(svgEl('path', { d, 'fill-rule': 'evenodd', fill: RING_FILL[i] }));
      const rm = (ro + ri) / 2 - 4, pid = 'rp' + i;
      defs.appendChild(svgEl('path', { id: pid, d: `M${C - rm},${C} A${rm},${rm} 0 0 1 ${C + rm},${C}` }));
      const tx = svgEl('text', { class: 'ring-label', fill: RING_INK[i] });
      const tp = svgEl('textPath', { href: '#' + pid, startOffset: '50%', 'text-anchor': 'middle' });
      tp.textContent = s.n; tx.appendChild(tp); g.appendChild(tx);
    } else {
      g.appendChild(svgEl('circle', { cx: C, cy: C, r: ro, fill: RING_FILL[i] }));
      const tx = svgEl('text', { x: C, y: C + 5, 'text-anchor': 'middle', class: 'core-label', fill: '#17112b' }); tx.textContent = s.n; g.appendChild(tx);
    }
    svg.appendChild(g);
  });
  const list = $('#hs-list');
  CHAIN_STEPS.forEach((s, i) => {
    const b = el('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.i = i; b.setAttribute('aria-selected', 'false');
    const ic = el('i', null, String(i + 1)); ic.style.setProperty('--sw', RING_FILL[i]); ic.style.setProperty('--sw-ink', RING_INK[i]);
    b.append(ic, document.createTextNode(s.n)); list.appendChild(b);
  });
  let active = 0, auto = true, timer = 0, inView = false;
  const set = (i, user) => {
    active = i; if (user) auto = false;
    svg.classList.add('has-active');
    $$('.ring', svg).forEach(r => r.classList.toggle('active', +r.dataset.i === i));
    $$('button', list).forEach(b => b.setAttribute('aria-selected', String(+b.dataset.i === i)));
    const s = CHAIN_STEPS[i], d = $('#hs-detail'); d.textContent = '';
    d.append(el('p', 'hs-k', 'Anel ' + (i + 1) + ' de 7'), el('p', 'hs-name', s.n), el('p', 'hs-verb', s.v), el('p', 'hs-txt', s.t));
    const m = el('div', 'hs-metric'), lab = el('span', null, s.m + ' · a cada 100 envios'), val = el('b', 'num', String(s.a));
    val.appendChild(el('small', null, 'antes ' + s.b)); m.append(lab, val); d.appendChild(m);
    if (s.next) { const nx = el('p', 'hs-next'); nx.innerHTML = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>'; nx.appendChild(document.createTextNode(s.n + ' ' + s.next)); d.appendChild(nx); }
  };
  svg.addEventListener('click', e => { const r = e.target.closest('.ring'); if (r) set(+r.dataset.i, true); });
  svg.addEventListener('keydown', e => { const r = e.target.closest('.ring'); if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); set(+r.dataset.i, true); } });
  svg.addEventListener('pointerover', e => { const r = e.target.closest('.ring'); if (r && e.pointerType === 'mouse') set(+r.dataset.i, true); });
  list.addEventListener('click', e => { const b = e.target.closest('button'); if (b) set(+b.dataset.i, true); });
  list.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (active + (e.key === 'ArrowRight' ? 1 : 6)) % 7; set(n, true); $$('button', list)[n].focus();
  });
  new IntersectionObserver(es => { inView = es[0].isIntersecting; }).observe(svg);
  set(0);
  if (!REDUCED) timer = setInterval(() => { if (auto && inView && currentView === 'v-site') set((active + 1) % 7); }, 3200);
}


function bootEfeito() { buildHaloRings(); }
