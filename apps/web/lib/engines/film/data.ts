/* ==========================================================================
   O filme · roteiro em dados (tempos, cursor, câmera, paleta, trilha e slides).
   Porte fiel de prototype/src/js/20-film.js: os números são os mesmos, quadro a quadro.
   ========================================================================== */
import type { Slide } from '@/lib/slides';

/** Duração total e início do fecho, em segundos. */
export const D = 88;
export const END = 84;

export interface Step { t: number; n: string }

export const STEPS: readonly Step[] = [
  { t: 4, n: 'Abra o Estúdio' }, { t: 10, n: 'Escolha um modelo' }, { t: 16, n: 'Edite o texto' },
  { t: 22.5, n: 'Troque a paleta' }, { t: 28.5, n: 'Insira gráficos, ícones e cards' }, { t: 35.5, n: 'Dê vida com efeitos' },
  { t: 41.5, n: 'Torne lúdico: votação e post-its' }, { t: 47.5, n: 'Raio Halor: veja onde cai o olhar' }, { t: 53.5, n: 'Importe .pptx e .pdf' },
  { t: 59.5, n: 'Apresente ao vivo' }, { t: 67.5, n: 'Baixe em HTML' }, { t: 75, n: 'Abra em qualquer navegador' }
];

export const CHAPTERS: readonly Step[] = [{ t: 0, n: 'Abertura' }].concat(
  STEPS.map((s, i) => ({ t: s.t, n: (i + 1) + ' · ' + s.n })),
  [{ t: END, n: 'Comece' }]
);

/** Cursor: [tempo de chegada, alvo]. Alvo = seletor dentro da janela, "x,y" em % da janela ou "!" (clique).
 *  O cursor espera parado e só sai a tempo de chegar: um movimento curto, em leve arco, como uma mão de verdade. */
export type Waypoint = readonly [t: number, target: string];
export const CUR: readonly Waypoint[] = [
  [4.5, '64,94'], [6, '.fh-st1'], [7.2, '.fh-st4'], [8.35, '.fh-st2'], [8.7, '!'],
  [10.8, '.fm-c3'], [11.6, '.fm-c2'], [12.3, '.fm-c1'], [12.6, '!'], [14.1, '.fm-use'], [14.5, '!'],
  [17.1, '.fe-cv .sl-h'], [17.3, '!'], [17.5, '!'], [20.5, '58,34'], [21.55, '.fi-tab-design'], [21.9, '!'],
  [23.3, '.fp-p2'], [23.7, '!'], [24.9, '.fp-p3'], [25.3, '!'], [26.5, '.fp-p1'], [26.9, '!'],
  [28.85, '.fe-rl li:nth-child(3)'], [29.2, '!'], [29.95, '.fr-chart'], [30.3, '!'], [31, '.fdd-col'], [31.35, '!'],
  [32.55, '.fr-icon'], [32.9, '!'], [33.75, '.fr-cards'], [34.1, '!'], [34.95, '.fe-cv .fs3-chart'], [35.3, '!'],
  [35.95, '.fr-fx'], [36.3, '!'], [37.5, '.flb-c2'], [37.9, '!'], [39.7, '.flb-use'], [40.1, '!'],
  [41.75, '.flb-chip-comp'], [42.1, '!'], [42.65, '.fe-rl li:nth-child(5)'], [42.95, '!'],
  [43.5, '.flc-vote'], [43.8, '!'], [44.9, '.fe-cv .fs5-z1'], [44.95, '!'],
  [45.3, '.flc-notes'], [45.6, '!'], [46.6, '.fe-cv .fs5-z2'], [46.65, '!'],
  [47.7, '.flb-x'], [48, '!'], [48.55, '.fe-rl li:nth-child(1)'], [48.85, '!'], [49.6, '.fr-ray'], [49.9, '!'], [51.9, '.fi-score'],
  [53.9, '-6,74'], [54.25, '-5,72'], [55.4, '.fe-cvw'], [55.45, '!'], [57, '70,64'], [58.7, '.fe-rail'],
  [59.75, '.fe-play'], [60.05, '!'], [61.6, '.fpl-next'], [62.3, '!'], [64.4, '76,62'], [67.25, '.fpl-exit'], [67.6, '!'],
  [68.55, '.fe-save'], [68.9, '!'], [69.75, '.fsv-o2'], [70.3, '.fsv-o1'], [70.6, '!'], [71.15, '.fsv-dl'], [71.45, '!'],
  [73.7, '.fdl-item'], [74.1, '!'], [76.6, '82,64'], [77.6, '.fwb-next'], [78, '!'], [79.9, '.fwb-next'], [80.3, '!'],
  [81.85, '.fwb-opt2'], [82.15, '!'], [83, '70,70']
];

/** Câmera: [início, duração, alvo, zoom máximo]. Uma lista para o palco largo e outra para o celular (4:5).
 *  Alvo = seletor, "a+b" (enquadra a união das caixas, com folga, até o zoom máximo), "alvo@fx,fy"
 *  (ponto relativo à caixa, com o zoom pedido) ou "x,y" (% do palco). Os quadros ficam dentro da janela.
 *  Regras: nada de afastar e voltar a aproximar em menos de 2,5 s; o cursor chega com a câmera quase parada. */
export type CamDef = readonly [t: number, du: number, target: string, zoomMax: number];
export const CAM_D: readonly CamDef[] = [
  [0, 0, '.fw', 1],
  [4.5, 2, '.fh-main@.5,.46', 1.13],
  [12.65, 1.7, '.fm-main@.56,.66', 1.3],
  [15.5, 1.7, '.fe-cvw@.5,.44', 1.45],
  [20.05, 1.6, '.fe-body@.6,.47', 1.2],
  [27.3, 1.8, '.fe@.43,.42', 1.14],
  [34.9, 1.8, '.fe-body@.6,.5', 1.17],
  [49.95, 1.8, '.fr-ray+.fe-cvw+.fi-score', 1.45],
  [53.45, 2, '.fw', 1],
  [59.95, 1.9, '.fpl-stage', 1.12],
  [62.9, 2, '.fpl-stage@.5,.6', 1.28],
  [67.65, 1.2, '.fsv@.5,.42', 1.3],
  [71.5, 1.75, '.fdl@.32,.5', 1.3],
  [74.15, 1.9, '.fw', 1.1],
  [80.45, 1.4, '.fwb-stage@.3,.6', 1.3],
  [83.4, 2, '.fw', 1]
];
export const CAM_M: readonly CamDef[] = [
  [0, 0, '.fw', 1],
  [4.5, 2, '.fh-starts@.38,.5', 1.7],
  [12.65, 1.7, '.fm-strip@.74,.5', 1.7],
  [15.5, 1.7, '.fe-sel1', 2.1],
  [20.05, 1.6, '.fe-body@.7,.42', 2.1],
  [27.25, 1.95, '.fe-rail+.fe-cvw', 1.6],
  [34.9, 1.9, '.fe-cvw+.flb@.6,.5', 1.3],
  [40.15, 1.55, '.fw@.5,.5', 1.06],
  [49.95, 1.9, '.fe-cvw+.fi-score@.5,.5', 1.45],
  [57.75, 2, '.fw@.5,.5', 1.06],
  [62.35, 1.7, '.fpl-stage@.27,.6', 1.9],
  [64.95, 1.75, '.fpl-stage@.76,.6', 1.9],
  [67.65, 1.2, '.fsv+.fe-save', 1.6],
  [71.5, 1.8, '.fdl@.3,.5', 1.4],
  [74.15, 1.9, '.fw@.5,.5', 1.06],
  [80.4, 1.6, '.fwb-poll', 1.9],
  [83.4, 2, '.fw@.5,.5', 1]
];

/** Paleta do slide: [tempo, matiz em graus, saturação] · Halor → Oceano → Coral → Halor. */
export type PalKey = readonly [t: number, hue: number, sat: number];
export const PAL: readonly PalKey[] = [[0, 0, 1], [23.7, -82, 1.1], [25.3, 112, 1], [26.9, 0, 1]];

/** Trilha: um sino por passo, subindo pela escala; acorde no fecho. */
export type Cue = readonly [t: number, note: number | 'chord'];
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26];
export const CUES: readonly Cue[] = ([[.3, 0], [1.2, 7]] as Cue[]).concat(
  STEPS.map((s, i): Cue => [s.t, SCALE[i]]),
  [[END + .55, 'chord']]
);

/** Slides das miniaturas (renderizados por slideHTML). */
export const FS: Readonly<Record<string, Slide>> = {
  a1: { type: 'cover', k: 'Aula 4', h: 'Aprenda fazendo, em três rodadas.', sub: 'Onboarding · turma de outubro' },
  a2: { type: 'steps', k: 'Workshop', h: 'Ideias em três rodadas.', s: [['01', 'Explorar', 'Post-its'], ['02', 'Votar', 'Votação'], ['03', 'Decidir', 'Plano']] },
  a3: { type: 'tl', k: 'Trimestre', h: 'O trimestre em quatro marcos.', ms: [['Jul', 'Planejar', .1], ['Ago', 'Testar', .37], ['Set', 'Ajustar', .63], ['Out', 'Medir', .9]] },
  a4: { type: 'text', k: 'Treinamento', h: 'O time pronto em uma semana.', p: ['Cinco encontros curtos.', 'Prática em cada um.'] },
  m1: { type: 'cover', k: 'Kickoff', h: 'Título do projeto', sub: 'Time · data' },
  m2: { type: 'text', k: 'Aula 1', h: 'Aprenda fazendo.', p: ['Pergunta, votação e post-its.'] },
  m3: { type: 'kpi', k: 'Relatório', h: 'O projeto em um número.', big: '84', cap: 'dias do começo ao fim', bars: [[28, 'S4'], [56, 'S8'], [70, 'S10'], [84, 'S12']] },
  m4: { type: 'steps', k: 'Quem somos', h: 'Três frentes, um time.', s: [['01', 'Produto', 'Plataforma'], ['02', 'Design', 'Experiência'], ['03', 'Operação', 'Suporte']] },
  m5: { type: 'tl', k: 'Workshop', h: 'Quatro rodadas de ideias.', ms: [['10h', 'Abertura', .1], ['10h30', 'Ideias', .37], ['11h', 'Votação', .63], ['11h30', 'Plano', .9]] },
  m6: { type: 'end', h: 'Comece aqui.', sub: 'Kit de marca aplicado' },
  d1: { type: 'cover', k: 'Kickoff · 2027', h: 'Título do projeto', sub: 'Time de produto · 4 de novembro' },
  d2: { type: 'text', k: 'Contexto', h: 'Por que agora.', p: ['Três frentes, um só plano.', 'Começamos em 4 de novembro.'] },
  d3: { type: 'kpi', k: 'Meta', h: 'Do kickoff à entrega.', big: '84', cap: 'dias do kickoff à entrega', bars: [[28, 'S4'], [56, 'S8'], [70, 'S10'], [84, 'S12']] },
  d4: { type: 'tl', k: 'Cronograma', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] },
  d5: { type: 'steps', k: 'Sua vez', h: 'Qual frente começa primeiro?', s: [['01', 'Produto', 'Votação'], ['02', 'Design', 'Post-its'], ['03', 'Operação', 'Ao vivo']] },
  d6: { type: 'end', h: 'Vamos começar.', sub: 'Kickoff · 4 de novembro' },
  i1: { type: 'text', k: 'Planejamento Q4', h: 'Prioridades do trimestre.', p: ['Três frentes, um só plano.'] },
  i2: { type: 'tl', k: 'Pesquisa do piloto', h: 'O que o piloto mostrou.', ms: [['S1', 'Escuta', .1], ['S2', 'Testes', .37], ['S3', 'Ajustes', .63], ['S4', 'Relatório', .9]] }
};
