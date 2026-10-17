/* ==========================================================================
   PRODUTO · gravação do Estúdio em loop (montar, baixar HTML, apresentar)
   e vitrine de modelos prontos
   ========================================================================== */
/* slides da gravação do Estúdio (trilho e canvas) */
const REC_SLIDES = [
  { type: 'tl', k: 'Kickoff', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] },
  { type: 'steps', k: 'Aula 4', h: 'Três ideias para levar.', s: [['01', 'Ver', 'O olhar decide rápido'], ['02', 'Sentir', 'A emoção segura'], ['03', 'Lembrar', 'A imagem fica']] },
  { type: 'kpi', k: 'Resultados', h: 'O trimestre em um número.', big: '+32%', cap: 'de leitura completa dos materiais', unit: '%', bars: [[41, 'T1'], [52, 'T2'], [61, 'T3'], [68, 'T4']] },
  { type: 'next', k: 'Workshop', h: 'O que não pode faltar?', items: ['Escreva um post-it', 'Vote nas três melhores', 'Combine o próximo passo'], cta: '10 min no cronômetro' }
];

function bootProduto() {
  bootEfeitoFx();
  const gain = $('.pd-gain');
  if (gain) new IntersectionObserver(es => { if (es[0].isIntersecting) gain.classList.add('on'); }, { threshold: .4 }).observe(gain);
  const stage = $('#rec-stage'); if (!stage) return;
  const rail = $('#re-rail');
  REC_SLIDES.forEach((s, i) => { const d = el('div', 're-th' + (i === 2 ? ' on' : '')); d.insertAdjacentHTML('beforeend', slideHTML(s, i + 1, 'halor')); rail.appendChild(d); });
  $('#re-canvas').innerHTML = slideHTML(REC_SLIDES[2], 3, 'halor');
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
