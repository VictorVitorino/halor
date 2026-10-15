/* ==========================================================================
   PRODUTO · gravação do Estúdio em loop (montar, baixar HTML, apresentar)
   e vitrine de modelos prontos
   ========================================================================== */
const PD_MODELS = [
  { n: 'Kickoff de projeto', fx: ['Timeline Motion', 'Reveal'], s: { type: 'tl', k: 'Kickoff', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] } },
  { n: 'Aula e treinamento', fx: ['Animated Typography', 'Votação'], s: { type: 'steps', k: 'Aula 4', h: 'Três ideias para levar.', s: [['01', 'Ver', 'O olhar decide rápido'], ['02', 'Sentir', 'A emoção segura'], ['03', 'Lembrar', 'A imagem fica']] } },
  { n: 'Relatório executivo', fx: ['Counter Animation', 'Chart Build'], s: { type: 'kpi', k: 'Resultados', h: 'O trimestre em um número.', big: '+32%', cap: 'de leitura completa dos materiais', bars: [[41, 'T1'], [52, 'T2'], [61, 'T3'], [68, 'T4']] } },
  { n: 'Workshop', fx: ['Post-its', 'Cronômetro'], s: { type: 'next', k: 'Workshop', h: 'O que não pode faltar?', items: ['Escreva um post-it', 'Vote nas três melhores', 'Combine o próximo passo'], cta: '10 min no cronômetro' } },
  { n: 'Apresentação institucional', fx: ['Parallax', 'Glow'], s: { type: 'text', k: 'Quem somos', h: 'Uma história que se vê.', p: ['Missão, números e pessoas em poucos slides.', 'Imagem dominante em cada página.'] } },
  { n: 'Abertura de evento', fx: ['Particle System', 'Animated Shader'], s: { type: 'cover', k: 'Evento 2027', h: 'Bem-vindos.', sub: 'Abertura · auditório principal' } }
];

function bootProduto() {
  const grid = $('#pd-models');
  if (grid) PD_MODELS.forEach((m, i) => {
    const c = el('article', 'pd-model');
    c.insertAdjacentHTML('beforeend', slideHTML(m.s, i + 1, 'halor'));
    const b = el('div', 'pd-mb'); b.appendChild(el('b', null, m.n));
    const fx = el('div', 'pd-fx'); m.fx.forEach(f => fx.appendChild(el('span', 'chip', f))); b.appendChild(fx);
    c.appendChild(b); grid.appendChild(c);
  });
  const stage = $('#rec-stage'); if (!stage) return;
  const rail = $('#re-rail');
  PD_MODELS.slice(0, 4).forEach((m, i) => { const d = el('div', 're-th' + (i === 2 ? ' on' : '')); d.insertAdjacentHTML('beforeend', slideHTML(m.s, i + 1, 'halor')); rail.appendChild(d); });
  $('#re-canvas').innerHTML = slideHTML(PD_MODELS[2].s, 3, 'halor');
  $('#rs-slide').innerHTML = slideHTML({ type: 'cover', k: 'Kickoff 2027', h: 'Do kickoff à entrega.', sub: 'Aberto no navegador · sem instalar nada' }, 1, 'halor');
  const URLS = ['estudio.halor · Kickoff 2027', 'estudio.halor · Kickoff 2027', 'arquivo:///kickoff-2027.html'];
  let st = 0, timer = 0, visible = false;
  const set = n => {
    st = n; stage.dataset.state = String(n);
    stage.classList.remove('play'); void stage.offsetWidth; stage.classList.add('play');
    $('#rec-url').textContent = URLS[n];
    $$('[data-rec]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.rec === n)));
  };
  const loop = () => { clearTimeout(timer); if (REDUCED || !visible || currentView !== 'v-site') return; timer = setTimeout(() => { set((st + 1) % 3); loop(); }, 4600); };
  $$('[data-rec]').forEach(b => b.addEventListener('click', () => { set(+b.dataset.rec); loop(); }));
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) { set(st); loop(); } else clearTimeout(timer); }).observe(stage);
  document.addEventListener('halor:view', loop);
  set(0);
}
