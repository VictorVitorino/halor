/* ==========================================================================
   PRODUTO · gravação do Estúdio em loop (montar, baixar HTML, apresentar)
   e vitrine de modelos prontos
   ========================================================================== */
const PD_MODELS = [
  { n: 'Kickoff de projeto', ac: '#8b3dff', fx: ['Timeline Motion', 'Reveal'], s: { type: 'tl', k: 'Kickoff', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] } },
  { n: 'Aula e treinamento', ac: '#a970ff', fx: ['Animated Typography', 'Votação'], s: { type: 'steps', k: 'Aula 4', h: 'Três ideias para levar.', s: [['01', 'Ver', 'O olhar decide rápido'], ['02', 'Sentir', 'A emoção segura'], ['03', 'Lembrar', 'A imagem fica']] } },
  { n: 'Relatório executivo', ac: '#6420cc', fx: ['Counter', 'Chart Build'], s: { type: 'kpi', k: 'Resultados', h: 'O trimestre em um número.', big: '+32%', cap: 'de leitura completa dos materiais', unit: '%', bars: [[41, 'T1'], [52, 'T2'], [61, 'T3'], [68, 'T4']] } },
  { n: 'Workshop', ac: '#b791ff', fx: ['Post-its', 'Cronômetro'], s: { type: 'next', k: 'Workshop', h: 'O que não pode faltar?', items: ['Escreva um post-it', 'Vote nas três melhores', 'Combine o próximo passo'], cta: '10 min no cronômetro' } },
  { n: 'Apresentação institucional', ac: '#7a33eb', fx: ['Parallax', 'Glow'], s: { type: 'text', k: 'Quem somos', h: 'Uma história que se vê.', p: ['Missão, números e pessoas em poucos slides.', 'Imagem dominante em cada página.'] } },
  { n: 'Abertura de evento', ac: '#c9a6ff', fx: ['Particle System', 'Shader'], s: { type: 'cover', k: 'Evento 2027', h: 'Bem-vindos.', sub: 'Abertura · auditório principal' } },
  { n: 'Roadmap do ano', ac: '#8752f5', fx: ['Connector', 'Spotlight'], s: { type: 'tl', k: 'Roadmap', h: 'Quatro ondas, um ano.', ms: [['T1', 'Base', .1], ['T2', 'Escala', .37], ['T3', 'Dados', .63], ['T4', 'IA', .9]] } },
  { n: 'Onboarding de time', ac: '#9f70ff', fx: ['Card Stack', 'Flip Card'], s: { type: 'steps', k: 'Boas-vindas', h: 'Sua primeira semana.', s: [['01', 'Conhecer', 'Pessoas e rituais'], ['02', 'Fazer', 'Primeira entrega'], ['03', 'Contar', 'O que aprendeu']] } },
  { n: 'Pesquisa ao vivo', ac: '#5a35a8', fx: ['Votação', 'Counter'], s: { type: 'kpi', k: 'Ao vivo', h: 'A sala respondeu.', big: '87%', cap: 'votaram pela frente de design', unit: '%', bars: [[22, 'A'], [48, 'B'], [87, 'C'], [35, 'D']] } },
  { n: 'Retrospectiva', ac: '#cfb3ff', fx: ['Post-its', 'Matriz'], s: { type: 'next', k: 'Retro', h: 'O que levamos daqui?', items: ['O que funcionou', 'O que mudar', 'Quem puxa o quê'], cta: 'Votação em 3 min' } }
];

function bootProduto() {
  const track = $('#pd-models');
  if (track) {
    PD_MODELS.forEach((m, i) => {
      const c = el('article', 'pd-model'); c.style.setProperty('--ac', m.ac); c.tabIndex = 0;
      const th = el('div', 'pd-mthumb'); th.insertAdjacentHTML('beforeend', slideHTML(m.s, i + 1, 'halor')); c.appendChild(th);
      const b = el('div', 'pd-mb'); b.appendChild(el('b', null, m.n));
      const fx = el('div', 'pd-fx'); m.fx.forEach(f => fx.appendChild(el('span', 'chip', f))); b.appendChild(fx);
      c.appendChild(b); track.appendChild(c);
    });
    const car = track.closest('.pd-carousel'), by = () => Math.max(240, track.clientWidth * .8);
    $('.pd-prev', car).addEventListener('click', () => track.scrollBy({ left: -by(), behavior: REDUCED ? 'auto' : 'smooth' }));
    $('.pd-next', car).addEventListener('click', () => track.scrollBy({ left: by(), behavior: REDUCED ? 'auto' : 'smooth' }));
    let dx = null, sl = 0, moved = false;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dx = e.clientX; sl = track.scrollLeft; moved = false; track.classList.add('drag'); });
    window.addEventListener('pointermove', e => { if (dx == null) return; const d = e.clientX - dx; if (Math.abs(d) > 4) moved = true; track.scrollLeft = sl - d; });
    window.addEventListener('pointerup', () => { dx = null; track.classList.remove('drag'); });
    const edge = () => { car.classList.toggle('at-start', track.scrollLeft < 10); car.classList.toggle('at-end', track.scrollLeft + track.clientWidth > track.scrollWidth - 10); };
    track.addEventListener('scroll', edge, { passive: true }); edge();
    new IntersectionObserver(es => car.classList.toggle('run', es[0].isIntersecting)).observe(car);
  }
  bootEvo();
  bootEfeitoFx();
  const gain = $('.pd-gain');
  if (gain) new IntersectionObserver(es => { if (es[0].isIntersecting) gain.classList.add('on'); }, { threshold: .4 }).observe(gain);
  const stage = $('#rec-stage'); if (!stage) return;
  const rail = $('#re-rail');
  PD_MODELS.slice(0, 4).forEach((m, i) => { const d = el('div', 're-th' + (i === 2 ? ' on' : '')); d.insertAdjacentHTML('beforeend', slideHTML(m.s, i + 1, 'halor')); rail.appendChild(d); });
  $('#re-canvas').innerHTML = slideHTML(PD_MODELS[2].s, 3, 'halor');
  $('#ru-after').innerHTML = slideHTML({ type: 'cover', k: 'Plano 2027', h: 'Plano 2027 em 12 semanas.', sub: 'Importado de apresentacao-antiga.pptx' }, 1, 'halor');
  const URLS = ['estudio.halor · Kickoff 2027', 'estudio.halor · Salvar como', 'estudio.halor · Importar arquivo'];
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

/* O efeito Halor · dispara o desenho dos ícones e a tipografia quando a seção aparece */
function bootEfeitoFx() {
  const sec = $('#efeito'); if (!sec || REDUCED) return;
  sec.classList.add('fx-pre');
  new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; sec.classList.add('fx-go'); sec.classList.remove('fx-pre'); o.disconnect(); }, { threshold: .25 }).observe($('.sci-grid', sec));
}
