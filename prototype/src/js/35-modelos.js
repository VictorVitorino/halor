/* ==========================================================================
   MODELOS QUE ENTREGAMOS PRONTOS · carrossel (separado de 36-produto.js)
   Cada cartão é um slide de verdade, em 16:9, montado em HTML + CSS + SVG
   (unidades cqw), e mostra o efeito que nomeia. O movimento é todo em CSS:
   aqui só montamos o markup, pausamos o que sai da tela e fazemos os cards
   holográficos seguirem o cursor.
   ========================================================================== */
const MD_FOOT = (n, paper) => `<div class="md-ft"><b><svg aria-hidden="true"><use href="${paper ? '#hl-mark-paper' : '#hl-mark'}"/></svg>halor</b><span>${String(n).padStart(2, '0')}</span></div>`;

/* Campo Halor em miniatura: pontos ligados por proximidade (semente fixa, sempre igual) */
function mdField(n, seed) {
  let s = seed;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const P = [];
  while (P.length < n) {
    const x = r() * 100, y = r() * 56.25;
    /* zona calma sobre o título: poucos pontos ali */
    if ((x < 66 && y < 40 && r() < .86) || (x < 26 && y > 44)) continue;
    P.push([x, y, .22 + r() * .5]);
  }
  let lines = '';
  P.forEach((a, i) => P.slice(i + 1).forEach(b => {
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    if (d < 15) lines += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" style="opacity:${((1 - d / 15) * .7).toFixed(2)}"/>`;
  }));
  const dots = P.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${p[2].toFixed(2)}" style="animation-delay:-${(r() * 3.2).toFixed(2)}s"/>`).join('');
  return `<svg class="ab-field" viewBox="0 0 100 56.25" preserveAspectRatio="none" aria-hidden="true"><g class="ab-drift"><g class="ab-lines">${lines}</g>${dots}</g></svg>`;
}

const MD_THUMBS = {
  /* 01 · Connector / Flow Line: a linha se desenha, liga as etapas e uma luz corre por ela */
  kickoff: n => {
    const d = 'M13 37C24 37 27 26 38 26S52 38 63 38S76 25 87 25';
    const nodes = [['Kickoff', 'Semana 1', 13, 37], ['Desenho', 'Semana 4', 38, 26], ['Piloto', 'Semana 8', 63, 38], ['Entrega', 'Semana 12', 87, 25]];
    return `<div class="md-s md-dark md-kick">
      <p class="md-k md-up md-p0">Kickoff · 2027</p>
      <p class="md-h md-up md-p1">Do kickoff à entrega.</p>
      <svg class="kk-svg" viewBox="0 0 100 56.25" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="md-kk-g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6b3fd6"/><stop offset=".55" stop-color="#a970ff"/><stop offset="1" stop-color="#f4eeff"/></linearGradient></defs>
        <path class="kk-route" d="${d}"/><path class="kk-line" d="${d}" pathLength="1"/><path class="kk-spark" d="${d}" pathLength="100"/>
      </svg>
      ${nodes.map((x, i) => `<div class="kk-n md-pop md-p${2 + i * 2}${i === 3 ? ' kk-end' : ''}" style="left:${x[2]}cqw;top:${x[3]}cqw;--d:${(i * .6).toFixed(1)}s"><i></i><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}
      ${MD_FOOT(n)}</div>`;
  },

  /* 02 · Icon Motion: ícones de linha se desenham e ganham vida (piscar, pulsar, acender) */
  aula: n => `<div class="md-s md-paper md-aula">
      <span class="au-blob"></span>
      <p class="md-k md-up md-p0">Aula 4 · Atenção</p>
      <p class="md-h md-up md-p1">Três ideias para levar.</p>
      <div class="au-row">
        <div class="au-t md-up md-p2" style="--d:1.17s"><em>01</em><span class="au-ic au-eye"><svg viewBox="0 0 24 24" aria-hidden="true"><g class="au-lid"><path class="md-draw" pathLength="1" d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle class="md-draw au-pupil" pathLength="1" cx="12" cy="12" r="3.2"/></g></svg></span><b>Ver</b><small>O olhar decide</small></div>
        <div class="au-t md-up md-p4" style="--d:2.07s"><em>02</em><span class="au-ic au-heart"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="md-draw au-beat" pathLength="1" d="M12 20.3s-7.6-4.5-9.4-9.3C1.4 7.8 3.5 4.4 7 4.4c2.1 0 3.6 1.1 5 3 1.4-1.9 2.9-3 5-3 3.5 0 5.6 3.4 4.4 6.6-1.8 4.8-9.4 9.3-9.4 9.3z"/></svg></span><b>Sentir</b><small>A emoção segura</small></div>
        <div class="au-t md-up md-p6" style="--d:2.97s"><em>03</em><span class="au-ic au-bulb"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="md-draw au-glass" pathLength="1" d="M12 3.2a6 6 0 0 0-3.7 10.7c.8.6 1.2 1.4 1.2 2.3v.8h5v-.8c0-.9.4-1.7 1.2-2.3A6 6 0 0 0 12 3.2z"/><path class="md-draw" pathLength="1" d="M9.6 19.6h4.8M10.6 22h2.8"/><path class="au-ray" d="M12 .4v1.1M4.2 3.6l.8.8M19.8 3.6l-.8.8M1.4 10.6h1.1M21.5 10.6h1.1"/></svg></span><b>Lembrar</b><small>A ideia fica</small></div>
      </div>
      ${MD_FOOT(n, true)}</div>`,

  /* 03 · Hologram 3D Cards: cards translúcidos inclinados, com brilho e linhas de varredura */
  workshop: n => {
    const cards = [['01', 'Mapa da jornada', 12, 3], ['02', 'Teste rápido', 18, 4], ['03', 'Roda de ideias', 9, 2]];
    return `<div class="md-s md-dark md-ws">
      <span class="ws-floor"></span><span class="ws-beam"></span>
      <p class="md-k md-up md-p0">Workshop · 10 min</p>
      <p class="md-h md-up md-p1">Qual ideia segue?</p>
      <div class="ws-stage"><div class="ws-sway"><div class="ws-rig">
        ${cards.map((c, i) => `<div class="ws-c ws-c${i + 1} md-p${2 + i * 2}"><div class="ws-f"><div class="ws-ci"><small>${c[0]}</small><b>${c[1]}</b><span class="ws-v">${'<i></i>'.repeat(c[3])}${c[2]} votos</span></div><span class="ws-scan"></span>${i === 1 ? '<em>na frente</em>' : ''}</div></div>`).join('')}
      </div></div></div>
      ${MD_FOOT(n)}</div>`;
  },

  /* 04 · Data Highlight + Progress Motion: anel enche, número conta, a barra certa acende */
  relatorio: n => {
    const bars = [[38, 'T1', 41], [44, 'T2', 48], [50, 'T3', 55], [66, 'T4', 72]];
    return `<div class="md-s md-paper md-rel">
      <p class="md-k md-up md-p0">Resultados · 2027</p>
      <p class="md-h md-up md-p1">O ano em um número.</p>
      <div class="rl-ring"><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="rl-tr" cx="20" cy="20" r="16"/><circle class="rl-pr" cx="20" cy="20" r="16" pathLength="100"/></svg><div class="rl-in"><b><span class="md-cnt" style="--to:94"></span>%</b><small>da meta</small></div></div>
      <div class="rl-chart">
        <span class="rl-goal md-fade md-p7"><em>meta 70</em></span>
        ${bars.map((b, i) => `<i class="rl-b${i === 3 ? ' rl-hi' : ''} md-p${3 + i}" style="--h:${b[2]}%;left:${4 + i * 25}%"><span class="rl-f"></span><em>${b[0]}</em></i>`).join('')}
        <span class="rl-call"><b>+<span class="md-cnt" style="--to:32"></span>%</b><small>vs. T3</small></span>
        <div class="rl-ax">${bars.map(b => `<span>${b[1]}</span>`).join('')}</div>
      </div>
      ${MD_FOOT(n, true)}</div>`;
  },

  /* 05 · Glow / Light Sweep: título varrido por uma faixa de luz e a marca respirando em halo */
  institucional: n => `<div class="md-s md-dark md-inst">
      <span class="in-aura"></span><span class="in-ring"></span><span class="in-pulse"></span><span class="in-pulse in-pulse2"></span>
      <span class="in-mk md-pop md-p1"><svg class="in-mark" aria-hidden="true"><use href="#hl-mark"/></svg></span>
      <p class="md-k md-up md-p0">Quem somos</p>
      <p class="md-h in-h md-up md-p2"><span>Uma história</span><span>que se vê.</span></p>
      <span class="in-line md-gx md-p4"></span>
      <div class="in-stats md-up md-p5"><div><b>12</b><small>anos</small></div><div><b>340</b><small>pessoas</small></div><div><b>4</b><small>países</small></div></div>
      <span class="in-sweep"></span>
      ${MD_FOOT(n)}</div>`,

  /* 06 · Progress Motion: o marcador "hoje" avança e cada onda do ano enche no mesmo passo */
  roadmap: n => {
    const rows = [['Base', 26, 17], ['Escala', 43, 17], ['Dados', 51.5, 25.5], ['IA', 68.5, 25.5]];
    return `<div class="md-s md-lilac md-road">
      <p class="md-k md-up md-p0">Roadmap 2027</p>
      <p class="md-h md-up md-p1">Quatro ondas, um ano.</p>
      <div class="rm-grid">
        <div class="rm-hd md-fade md-p1">${['T1', 'T2', 'T3', 'T4'].map((q, i) => `<span style="left:${26 + i * 17}cqw">${q}</span>`).join('')}</div>
        ${rows.map((r, i) => `<div class="rm-r md-up md-p${2 + i}" style="top:${22.6 + i * 5.4}cqw;--x0:${r[1]};--len:${r[2]}"><b>${r[0]}</b><em><span class="md-cnt"></span>%</em><span class="rm-bar" style="left:${r[1]}cqw;width:${r[2]}cqw"><i></i><svg class="rm-ok" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.4 2.3 4.6-5"/></svg></span></div>`).join('')}
        <span class="rm-now md-fade md-p2"><em>hoje</em></span>
      </div>
      ${MD_FOOT(n, true)}</div>`;
  },

  /* 07 · Reveal / Mask Reveal: uma íris abre a cena, o título surge por máscara, partículas no fundo */
  abertura: n => `<div class="md-s md-dark md-open">
      <div class="ab-iris"></div><span class="ab-irisring"></span>
      ${mdField(30, 7)}
      <span class="ab-ring md-pop md-p8"></span>
      <p class="md-k md-up md-p3">Evento 2027 · Abertura</p>
      <p class="ab-h"><span class="ab-title">Bem-vindos.</span></p><span class="ab-edge"></span>
      <p class="ab-sub md-p8">Auditório principal · 19h</p>
      ${MD_FOOT(n)}</div>`,

  /* 08 · BPMN Flow Motion: início, tarefas, decisão e fim, com um token percorrendo o fluxo */
  processo: n => `<div class="md-s md-paper md-bpmn">
      <p class="md-k md-up md-p0">Processo · Aprovação</p>
      <p class="md-h md-up md-p1">Do pedido à entrega.</p>
      <svg class="bp-svg md-fade md-p1" viewBox="0 0 100 56.25" preserveAspectRatio="none" aria-hidden="true">
        <defs><marker id="md-bp-ar" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#8a80a8"/></marker></defs>
        <path class="bp-trail" d="M8 38H58.5V25H42.5V38H88.5" pathLength="138.5"/>
        <path class="bp-flow" d="M10.2 38H13.3M29.7 38H34.3M50.7 38H54.9M62.1 38H65.8M82.2 38H85.9" marker-end="url(#md-bp-ar)"/>
        <path class="bp-flow" d="M58.5 34.4V25H42.5V32.8" marker-end="url(#md-bp-ar)"/>
      </svg>
      <span class="bp-lbl md-fade md-p3" style="left:45cqw;top:20.8cqw">ajustar</span>
      <span class="bp-lbl md-fade md-p3" style="left:60.6cqw;top:34.4cqw">sim</span>
      <span class="bp-ev bp-start md-pop md-p1"></span>
      <div class="bp-task bp-t1 md-pop md-p2" style="left:13.5cqw"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg><b>Pedido</b><i></i></div>
      <div class="bp-task bp-t2 md-pop md-p2" style="left:34.5cqw"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg><b>Análise</b><i></i></div>
      <span class="bp-gw md-pop md-p3"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg></span>
      <div class="bp-task bp-t3 md-pop md-p3" style="left:66cqw"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l4.5 4.5 10-10"/></svg><b>Entrega</b><i></i></div>
      <span class="bp-ev bp-end md-pop md-p3"></span>
      <span class="bp-token"></span>
      ${MD_FOOT(n, true)}</div>`,

  /* 09 · Motion Graphics: formas e tipografia coreografadas */
  onboarding: n => `<div class="md-s md-violet md-onb">
      <span class="ob-circle md-pop md-p1"><i></i></span>
      <span class="ob-square md-p3"></span>
      <span class="ob-pill md-p4"></span>
      <span class="ob-arc"></span>
      <span class="ob-dots">${'<i></i>'.repeat(9)}</span>
      <svg class="ob-zig" viewBox="0 0 30 8" aria-hidden="true"><path class="md-draw md-p5" pathLength="1" d="M1 6l4-4 4 4 4-4 4 4 4-4 4 4 4-4"/></svg>
      <p class="md-k md-up md-p0">Boas-vindas · Semana 1</p>
      <p class="md-h ob-h"><span class="ob-w md-p1">Boas-vindas</span><br><span class="ob-w md-p2">ao</span> <span class="ob-w md-p3">time.</span></p>
      <p class="ob-lbl md-up md-p4">Sua primeira semana</p>
      <div class="ob-days"><span class="ob-hl"></span>${['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((d, i) => `<span class="ob-d md-pop md-p${5 + i}">${d}</span>`).join('')}</div>
      ${MD_FOOT(n)}</div>`,

  /* 10 · Data Highlight: votação ao vivo, barras se reordenam e a vencedora acende */
  pesquisa: n => {
    const rows = [['a', 'Materiais do time', 46, 0], ['b', 'Treinamento', 10, 3], ['c', 'Medição', 28, 1], ['d', 'Eventos', 16, 2]];
    return `<div class="md-s md-dark md-poll">
      <p class="md-k md-up md-p0"><i class="pl-live"></i>Ao vivo · <span class="pl-tot md-cnt" style="--to:128"></span> votos</p>
      <p class="md-h md-up md-p1">Por onde a gente começa?</p>
      <div class="pl-list">${rows.map(r => `<div class="pl-row pl-${r[0]}" style="--v:${r[2]};--s:${r[3]}"><span class="pl-name">${r[1]}</span><b><span class="pl-n"></span>%</b><i class="pl-bar"></i>${r[0] === 'a' ? '<em class="pl-win">mais votada</em>' : ''}</div>`).join('')}</div>
      <div class="pl-box md-up md-p2"><small>Vote pelo celular</small><b>halor.link</b><span>código <strong>K27</strong></span><i class="pl-plus">+1</i><i class="pl-plus pl-plus2">+1</i><i class="pl-plus pl-plus3">+1</i></div>
      ${MD_FOOT(n)}</div>`;
  }
};

const PD_MODELS = [
  { n: 'Kickoff de projeto', ac: '#8b3dff', fx: ['Connector / Flow Line', 'Glow'], th: 'kickoff' },
  { n: 'Aula e treinamento', ac: '#a970ff', fx: ['Icon Motion', 'Reveal'], th: 'aula' },
  { n: 'Workshop', ac: '#b791ff', fx: ['Hologram 3D Cards', 'Light Sweep'], th: 'workshop' },
  { n: 'Relatório executivo', ac: '#6420cc', fx: ['Data Highlight', 'Progress Motion'], th: 'relatorio' },
  { n: 'Apresentação institucional', ac: '#7a33eb', fx: ['Glow / Light Sweep'], th: 'institucional' },
  { n: 'Roadmap do ano', ac: '#8752f5', fx: ['Progress Motion', 'Data Highlight'], th: 'roadmap' },
  { n: 'Abertura de evento', ac: '#c9a6ff', fx: ['Mask Reveal', 'Partículas'], th: 'abertura' },
  { n: 'Processo e fluxo', ac: '#7040d6', fx: ['BPMN Flow Motion', 'Connector'], th: 'processo' },
  { n: 'Onboarding de time', ac: '#9f70ff', fx: ['Motion Graphics', 'Tipografia animada'], th: 'onboarding' },
  { n: 'Pesquisa ao vivo', ac: '#5a35a8', fx: ['Data Highlight', 'Votação ao vivo'], th: 'pesquisa' }
];

function bootModelos() {
  const track = $('#pd-models');
  if (!track) return;
  PD_MODELS.forEach((m, i) => {
    const c = el('article', 'pd-model'); c.style.setProperty('--ac', m.ac); c.tabIndex = 0;
    const th = el('div', 'pd-mthumb'); th.setAttribute('aria-hidden', 'true');
    th.insertAdjacentHTML('beforeend', MD_THUMBS[m.th](i + 1)); c.appendChild(th);
    const b = el('div', 'pd-mb'); b.appendChild(el('b', null, m.n));
    const fx = el('div', 'pd-fx'); m.fx.forEach(f => fx.appendChild(el('span', 'chip', f))); b.appendChild(fx);
    c.appendChild(b); track.appendChild(c);
  });

  const car = track.closest('.pd-carousel'), by = () => Math.max(240, track.clientWidth * .8);
  $('.pd-prev', car).addEventListener('click', () => track.scrollBy({ left: -by(), behavior: REDUCED ? 'auto' : 'smooth' }));
  $('.pd-next', car).addEventListener('click', () => track.scrollBy({ left: by(), behavior: REDUCED ? 'auto' : 'smooth' }));
  let dx = null, sl = 0;
  track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dx = e.clientX; sl = track.scrollLeft; track.classList.add('drag'); });
  window.addEventListener('pointermove', e => { if (dx == null) return; track.scrollLeft = sl - (e.clientX - dx); });
  window.addEventListener('pointerup', () => { dx = null; track.classList.remove('drag'); });
  const edge = () => { car.classList.toggle('at-start', track.scrollLeft < 10); car.classList.toggle('at-end', track.scrollLeft + track.clientWidth > track.scrollWidth - 10); };
  track.addEventListener('scroll', edge, { passive: true }); edge();

  /* cada slide só anima enquanto aparece (na tela e dentro da faixa visível do carrossel) */
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('md-on', e.isIntersecting)), { threshold: .05 });
  $$('.pd-model', track).forEach(c => io.observe(c));

  /* cards holográficos seguem o cursor */
  if (!REDUCED) $$('.md-ws', track).forEach(s => {
    const card = s.closest('.pd-model');
    card.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = s.getBoundingClientRect();
      const k = v => Math.max(-1, Math.min(1, v * 2 - 1)).toFixed(3);
      s.style.setProperty('--mx', k((e.clientX - r.left) / r.width));
      s.style.setProperty('--my', k((e.clientY - r.top) / r.height));
    });
    card.addEventListener('pointerleave', () => { s.style.setProperty('--mx', 0); s.style.setProperty('--my', 0); });
  });
}
