/* ==========================================================================
   PAINEL HALOR · dados ilustrativos de um time de exemplo.
   Porte de prototype/src/js/40-dash.js (objeto DASH).
   ========================================================================== */

/** Comparação à vista: antes do Halor ou com Halor. */
export type DashMode = 'antes' | 'com';

export interface DashKpi {
  /** nome, apoio quando não há variação, valor antes, valor com Halor e unidade */
  k: string; sub: string; b: number; a: number; u: '' | '%' | 's';
  /** os 12 meses, de janeiro a dezembro; o Halor entra em julho */
  spark: number[];
}
export interface DashInsight { ic: string; t: string; p: string }
export interface DashData {
  months: string[];
  /** pessoas que voltaram para rever, a cada 100, por mês */
  signed: number[];
  kpis: DashKpi[];
  score: { b: number; a: number };
  /** os 9 slides de "Kickoff 2027", na ordem do deck */
  slides: string[];
  /** segundos médios de leitura por slide */
  heat: { b: number[]; a: number[] };
  insights: DashInsight[];
}

export const DASH: DashData = {
  months: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  // pessoas que voltaram para rever, a cada 100, por mês. O Halor entra em julho.
  signed: [3.1, 2.8, 3.4, 3.0, 3.3, 3.2, 4.6, 5.5, 6.2, 6.9, 7.4, 8.0],
  kpis: [
    { k: 'Taxa de atenção', sub: 'passam da capa', b: 41, a: 68, u: '%', spark: [40, 42, 39, 41, 43, 41, 52, 58, 61, 64, 66, 68] },
    { k: 'Tempo de olhar', sub: 'média por slide', b: 9, a: 17, u: 's', spark: [9, 8, 9, 10, 9, 9, 12, 13, 15, 15, 16, 17] },
    { k: 'Interações', sub: 'votos e post-its por apresentação', b: 6, a: 14, u: '', spark: [6, 5, 6, 7, 6, 6, 8, 10, 11, 12, 13, 14] },
    { k: 'Voltaram para rever', sub: 'a cada 100 pessoas', b: 3, a: 8, u: '', spark: [3.1, 2.8, 3.4, 3.0, 3.3, 3.2, 4.6, 5.5, 6.2, 6.9, 7.4, 8.0] },
  ],
  score: { b: 54, a: 82 },
  /* os 9 slides de "Kickoff 2027", na ordem do deck: a votação é onde o olhar mais fica */
  slides: ['Capa', 'Desafio', 'Meta', 'Como funciona', 'Votação', 'Cronograma', 'Recursos', 'Próximos passos', 'Fim'],
  heat: { b: [6, 5, 7, 4, 3, 4, 2, 2, 1], a: [9, 11, 22, 14, 31, 16, 6, 9, 4] },
  insights: [
    { ic: '#i-image', t: 'Imagem dominante segura o olhar', p: 'Slides com uma imagem ocupando mais de 30% da área tiveram 2,1× mais tempo de leitura.' },
    { ic: '#i-target', t: 'Um destaque por slide gera perguntas', p: 'Gráficos com um único valor em destaque receberam 3× mais comentários.' },
    { ic: '#i-vote', t: 'Perguntar segura a sala', p: 'Slides com votação ao vivo tiveram 3× mais tempo de olhar que slides só de texto.' },
  ],
};
