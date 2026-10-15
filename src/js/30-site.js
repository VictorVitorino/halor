/* ==========================================================================
   SITE · halo interativo da Cadeia Halor e planos
   ========================================================================== */
const HALOR = { cycle: 'anual', plan: 'halo', seats: 5, coupon: false, pay: 'pix' };

const CHAIN_STEPS = [
  { n: 'Atenção', v: 'O olhar para.', t: 'A capa decide em meio segundo se o cliente continua. Contraste, uma imagem forte e um título curto fazem o olhar parar.', m: 'Passam da capa', a: 68, b: 41, next: 'gera interesse' },
  { n: 'Interesse', v: 'O olhar fica.', t: 'Quando cada slide tem um único destaque, o cliente não precisa procurar. Ele permanece e lê.', m: 'Ficam mais de 60 s', a: 52, b: 28, next: 'gera curiosidade' },
  { n: 'Curiosidade', v: 'O olhar procura mais.', t: 'Perguntas abertas e números que surpreendem fazem o cliente avançar por conta própria até o fim.', m: 'Veem 70% dos slides ou mais', a: 40, b: 19, next: 'gera aproximação' },
  { n: 'Aproximação', v: 'O cliente pergunta.', t: 'Um comentário, uma dúvida, um pedido de detalhe. É o primeiro passo do cliente na sua direção.', m: 'Comentam ou perguntam', a: 27, b: 12, next: 'gera confiança' },
  { n: 'Confiança', v: 'O cliente compartilha.', t: 'Ninguém encaminha o que não confia. Cada novo leitor no link é um voto silencioso a seu favor.', m: 'Encaminham para alguém', a: 19, b: 8, next: 'gera parceria' },
  { n: 'Parceria', v: 'O cliente convida.', t: 'A conversa vira reunião, e a reunião vira construção conjunta da solução.', m: 'Marcam reunião', a: 14, b: 6, next: 'gera proposta' },
  { n: 'Proposta', v: 'O cliente assina.', t: 'O centro do halo. Tudo que veio antes trabalhou para este momento.', m: 'Assinam a proposta', a: 8, b: 3, next: null }
];
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

/* Planos ----------------------------------------------------------------- */
const PLANS = [
  { id: 'faisca', n: 'Faísca', ic: '#i-spark', d: 'Para conhecer a luz, sem pagar nada.', m: 0, cta: 'Começar grátis', f: ['3 apresentações ativas', 'Modelos essenciais', 'Exporta PDF', 'Painel Halor com 7 dias de histórico'] },
  { id: 'halo', n: 'Halo', ic: '#hl-mark', hot: true, d: 'Para quem vende e quer ser lembrado.', m: 69, cta: 'Assinar Halo', f: ['Apresentações ilimitadas', 'PowerPoint editável, PDF e HTML', 'Raio Halor: 50 análises por mês', 'Links medidos e Painel completo', 'Sem marca d’água'] },
  { id: 'orbita', n: 'Órbita', ic: '#i-target', d: 'Para times que vendem juntos.', m: 49, per: 'pessoa', min: 3, cta: 'Assinar Órbita', f: ['Tudo do plano Halo', 'Kit de marca travado', 'Biblioteca do time e aprovações', 'Integração com CRM', 'Relatórios por vendedor'] },
  { id: 'constelacao', n: 'Constelação', ic: '#i-share', d: 'Para empresas com muitos times.', m: null, cta: 'Falar com vendas', f: ['SSO e gestão de papéis', 'Auditoria e retenção de dados', 'Ambiente dedicado', 'Implantação e gestão da mudança', 'Suporte com SLA'] }
];
const monthly = p => p.m == null ? null : (HALOR.cycle === 'anual' ? p.m * .8 : p.m);

function renderPlans() {
  const box = $('#plans'); if (!box) return;
  box.textContent = '';
  PLANS.forEach(p => {
    const c = el('article', 'plan' + (p.hot ? ' hot' : ''));
    if (p.hot) { const f = el('div', 'plan-flag'); f.appendChild(el('span', 'chip', 'Mais escolhido')); c.appendChild(f); }
    const nm = el('h3', 'plan-name'); nm.innerHTML = '<svg aria-hidden="true"><use href="' + p.ic + '"/></svg>'; nm.appendChild(document.createTextNode(p.n)); c.appendChild(nm);
    c.appendChild(el('p', 'plan-desc', p.d));
    const pr = el('div', 'plan-price');
    const v = monthly(p);
    if (v == null) { pr.appendChild(el('b', null, 'Sob consulta')); pr.lastChild.style.fontSize = '28px'; }
    else if (v === 0) { pr.append(el('b', null, 'R$ 0'), el('span', null, 'para sempre')); }
    else {
      if (HALOR.cycle === 'anual') pr.appendChild(el('span', 'was', fmtBRL(p.m)));
      pr.append(el('b', null, fmtBRL(v).replace(',00', '')), el('span', null, p.per ? '/' + p.per + '/mês' : '/mês'));
    }
    c.appendChild(pr);
    const ul = el('ul'); p.f.forEach(t => { const li = el('li'); li.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>'; li.appendChild(document.createTextNode(t)); ul.appendChild(li); }); c.appendChild(ul);
    const a = el('a', 'btn btn-block ' + (p.hot ? 'btn-primary' : 'btn-ghost'), p.cta);
    if (p.id === 'constelacao') { a.href = '#planos'; a.addEventListener('click', e => { e.preventDefault(); toast('Pedido recebido. Nosso time responde em até 1 dia útil.'); }); }
    else { a.href = '#assinar'; a.addEventListener('click', () => { HALOR.plan = p.id; }); }
    c.appendChild(a);
    box.appendChild(c);
  });
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-cycle]'); if (!b) return;
  HALOR.cycle = b.dataset.cycle;
  $$('[data-cycle]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cycle === HALOR.cycle)));
  renderPlans();
  if (typeof renderCheckout === 'function') renderCheckout();
});
