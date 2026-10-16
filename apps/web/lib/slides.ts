/* ==========================================================================
   Slides · um renderizador de slides em HTML usado no editor, nas miniaturas,
   no acervo, no palco, no filme, na prévia do produto e no manual da marca.
   Porte de prototype/src/js/50-studio.js (DECK e slideHTML).
   ========================================================================== */

export type SlideType = 'cover' | 'text' | 'kpi' | 'steps' | 'tl' | 'table' | 'next' | 'poll' | 'end';
export interface Slide {
  type: SlideType;
  /** sobretítulo, título, subtítulo e nota do apresentador */
  k?: string; h: string; sub?: string; n?: string;
  p?: string[];
  big?: string; cap?: string; unit?: string; bars?: [number, string][];
  s?: [string, string, string][];
  ms?: [string, string, number][];
  head?: string[]; rows?: [string, string, string][];
  items?: string[]; cta?: string;
  opts?: [string, number][]; code?: string;
  /** camadas extras do editor (texto, forma, imagem) */
  layers?: unknown[];
  [key: string]: unknown;
}

export const votesLabel = (n: number) => (n === 0 ? 'esperando o primeiro voto' : n === 1 ? '1 voto' : n + ' votos');
export const escHTML = (t: unknown) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c]);

/* As quatro primeiras posições alimentam prévias no site: mexa com cuidado. */
export const DECK: Slide[] = [
  { type: 'cover', k: 'Kickoff · 2027', h: 'Plano 2027 em 12 semanas.', sub: 'Time de produto · 4 de novembro', n: 'Entrar em silêncio e deixar a capa respirar três segundos antes de falar.' },
  { type: 'text', k: 'O desafio', h: 'Muita informação, pouca atenção.', p: ['Hoje cada reunião começa com 40 slides.', 'Metade da sala desliga antes do quinto.'], n: 'Perguntar quem leu o último material até o fim. Esperar as mãos subirem.' },
  { type: 'kpi', k: 'Meta do trimestre', h: 'Queremos dobrar a leitura completa dos nossos materiais até março.', big: '2×', cap: 'leitura completa, de 34% para 68%', unit: '%', bars: [[34, 'Hoje'], [45, 'Mês 1'], [57, 'Mês 2'], [68, 'Mês 3']], n: 'Abrir com a pergunta: o que faria você ler um material até o fim? Depois mostrar o 2× e pausar dois segundos.' },
  { type: 'steps', k: 'Como funciona', h: 'Três movimentos, uma cadeia.', s: [['01', 'Diagnóstico', 'Raio-x dos materiais atuais'], ['02', 'Redesenho', 'Modelos com o kit de marca'], ['03', 'Medição', 'Painel por time']], n: 'Um movimento por vez. Avançar só quando a sala olhar para o card.' },
  { type: 'poll', k: 'Votação ao vivo', h: 'Por onde a gente começa?', opts: [['Materiais do time', 17], ['Treinamento', 12], ['Medição', 8], ['Eventos', 5]], code: 'K27', n: 'Ler o código em voz alta e deixar a votação aberta. Comentar o resultado enquanto as barras andam.' },
  { type: 'tl', k: 'Cronograma', h: 'Nove meses do primeiro olhar ao resultado.', ms: [['Mês 1', 'Diagnóstico', .1], ['Mês 3', 'Modelos no ar', .37], ['Mês 6', 'Time treinado', .63], ['Mês 9', 'Meta de ciclo', .9]], n: 'Apontar o mês 3: é ali que o time vê o primeiro resultado.' },
  { type: 'table', k: 'Recursos', h: 'Quem faz o quê.', head: ['Frente', 'Duração', 'Quem'], rows: [['Estúdio Halor', '12 semanas', 'Todo o time'], ['Treinamento de apresentação', '2 encontros', '4 h cada'], ['Total', '12 semanas', '25 pessoas']], n: 'Lembrar que o treinamento cabe na agenda atual do time.' },
  { type: 'next', k: 'Próximos passos', h: 'Combinamos o começo?', items: ['Validar o escopo com o time', 'Aprovar até 30 de outubro', 'Kickoff em 4 de novembro'], cta: 'Kickoff em 4 de novembro', n: 'Fechar com a data do kickoff e abrir para perguntas.' },
  { type: 'end', h: 'Obrigado.', sub: 'marina@nortesistemas.com.br', n: 'Deixar o contato na tela enquanto respondem às perguntas.' }
];

/* tag: nome da apresentação no rodapé (opcional; sem ele vale o Kickoff de exemplo) */
export function slideHTML(s: Slide, n: number, brand?: 'halor' | string, tag?: string): string {
  const foot = brand === 'halor'
    ? `<div class="sl-foot"><b><svg aria-hidden="true"><use href="${s.type === 'cover' ? '#hl-mark' : '#hl-mark-paper'}"/></svg>halor</b><span>${String(n).padStart(2, '0')}</span></div>`
    : `<div class="sl-foot"><span>Norte Sistemas · ${tag || 'Kickoff 2027'}</span><span>${String(n).padStart(2, '0')}</span></div>`;
  switch (s.type) {
    case 'cover': return `<div class="slide sl-cover"><span class="sl-ring"></span><span class="sl-ring sl-ring2"></span><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><p class="sl-sub">${s.sub}</p>${foot}</div>`;
    case 'text': return `<div class="slide sl-text sl-light"><p class="sl-k">${s.k}</p><p class="sl-h" style="width:48%">${s.h}</p><div class="sl-body">${s.p!.map(x => `<p class="sl-p">${x}</p>`).join('')}</div><span class="sl-img"></span>${foot}</div>`;
    case 'kpi': {
      const mx = Math.max(...s.bars!.map(b => b[0]));
      return `<div class="slide sl-kpi"><p class="sl-k">${s.k}</p><p class="sl-h" data-title>${s.h}</p><div class="sl-big"><b>${s.big}</b><span>${s.cap}</span></div><div class="sl-chart">${s.bars!.map((b, i) => `<i class="${i === s.bars!.length - 1 ? 'hi' : ''}" style="--h:${(b[0] / mx * 92).toFixed(0)}%"><em>${b[0]}${s.unit || ' d'}</em></i>`).join('')}</div><div class="sl-axis">${s.bars!.map(b => `<span>${b[1]}</span>`).join('')}</div>${foot}</div>`;
    }
    case 'steps': return `<div class="slide sl-steps sl-light"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><div class="sl-row">${s.s!.map(x => `<div class="sl-step"><b>${x[0]}</b><strong>${x[1]}</strong><span class="sl-p">${x[2]}</span></div>`).join('')}</div>${foot}</div>`;
    case 'tl': return `<div class="slide sl-tl"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><span class="sl-line"></span>${s.ms!.map(m => `<div class="sl-ms" style="left:${6 + m[2] * 88}%"><span>${m[1]}</span><i></i><small>${m[0]}</small></div>`).join('')}${foot}</div>`;
    case 'table': { const hd = s.head || ['Item', 'Período', 'Valor']; return `<div class="slide sl-table sl-light"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><table class="sl-tbl"><thead><tr>${hd.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${s.rows!.map((r, i) => `<tr class="${i === s.rows!.length - 1 ? 'tot' : ''}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>${foot}</div>`; }
    case 'next': return `<div class="slide sl-next"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><div class="sl-list">${s.items!.map((x, i) => `<div><i>${i + 1}</i>${x}</div>`).join('')}</div><div class="sl-cta">${s.cta}</div>${foot}</div>`;
    case 'poll': {
      const opts = s.opts!, raw = opts.reduce((a, o) => a + o[1], 0), tot = raw || 1, mx = Math.max(...opts.map(o => o[1]));
      return `<div class="slide sl-poll sl-light"><p class="sl-k">${s.k}</p><p class="sl-h">${s.h}</p><div class="sl-opts">${opts.map(o => { const p = Math.round(o[1] / tot * 100); return `<div class="sl-opt${o[1] === mx ? ' hi' : ''}" style="--v:${p}%"><span>${o[0]}</span><b>${p}%</b></div>`; }).join('')}</div><div class="sl-vote"><small>Vote pelo celular</small><b>halor.link</b><span>código <strong>${s.code || 'K27'}</strong></span><em>${votesLabel(raw)}</em></div>${foot}</div>`;
    }
    case 'end': return `<div class="slide sl-end">${brand === 'halor' ? '<svg aria-hidden="true"><use href="#hl-mark"/></svg>' : ''}<p>${s.h}</p><small>${s.sub}</small></div>`;
  }
  return '';
}
