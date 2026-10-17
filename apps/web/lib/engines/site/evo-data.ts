/* Linha do tempo · dados das épocas e das tentativas de IA (espelho de prototype/src/js/36b-evo.js). */

/** Uma época da linha do tempo */
export interface EvoStop {
  /** rótulo curto no trilho */
  yr: string;
  /** ano por extenso no palco */
  y: string;
  /** de que lado da história a época está (antes do Halor, hoje, para onde vamos) */
  era: string;
  t: string;
  d: string;
  /** o que quem assiste faz */
  who: string;
  /** atenção da plateia, de 0 a 1 */
  a: number;
  /** quanto tempo a época fica no ar quando a pessoa aperta «Assistir» */
  ms: number;
  /** 2024: o painel de tokens embaixo do palco */
  ai?: boolean;
  /** 2026: hoje, com o Halor */
  now?: boolean;
  next?: boolean;
}

export const EVO: EvoStop[] = [
  { yr: '2016', y: '2016', era: 'Antes do Halor', t: 'Slides estáticos', d: 'Tópicos em sequência e um PDF por e-mail. Quem recebe lê sozinho, se ler.', who: 'Lê sozinho', a: .16, ms: 5000 },
  { yr: '2018', y: '2018', era: 'Antes do Halor', t: 'Na nuvem', d: 'O arquivo virou link e o time edita junto. Na hora de apresentar, o slide continua parado.', who: 'Comenta', a: .28, ms: 5000 },
  { yr: '2020', y: '2020', era: 'Antes do Halor', t: 'Tela compartilhada', d: 'Tudo por vídeo. O slide disputa a atenção com dez abas, notificações e câmeras desligadas.', who: 'Divide a atenção', a: .2, ms: 5000 },
  { yr: '2022', y: '2022', era: 'Antes do Halor', t: 'Modelos prontos', d: 'Design em minutos, mas com a mesma cara de mil outras apresentações.', who: 'Reconhece o modelo', a: .34, ms: 5000 },
  { yr: '2024', y: '2024', era: 'Antes do Halor', t: 'Gerado por IA', d: 'Um texto vira slides em segundos. Só que cada tentativa gasta tokens, e o resultado nem sempre sai como você imaginou.', who: 'Recebe pronto', a: .42, ms: 10500, ai: true },
  { yr: '2026', y: '2026', era: 'Hoje, com o Halor', t: 'HTML vivo e lúdico', d: 'A apresentação se move, responde e convida a participar. Você edita direto no slide, sem código e sem gastar tokens.', who: 'Participa', a: .88, ms: 8000, now: true },
  { yr: 'Próximos', y: 'Próximos anos', era: 'Para onde vamos', t: 'Apresentação que conversa', d: 'Ela se adapta a quem assiste, tira dúvidas e mede a atenção ao vivo.', who: 'Conversa', a: .96, ms: 6500, next: true },
];

/** Uma tentativa de gerar com IA (valores ilustrativos) */
export interface EvoTry {
  /** tokens gastos na tentativa */
  tk: number;
  /** x: errou · meh: serve, mas parado */
  k: 'x' | 'meh';
  /** variante visual do slide gerado no palco (1 fora da marca, 2 número inventado, 3 parado) */
  v: 1 | 2 | 3;
  /** selo no slide gerado */
  flag: string;
  res: string;
  why: string;
}

/** as três tentativas do roteiro de 2024 */
export const EVO_TRIES: EvoTry[] = [
  { tk: 18420, k: 'x', v: 1, flag: 'Fora da marca', res: 'Não saiu como esperado', why: 'cores e fonte fora da marca' },
  { tk: 21960, k: 'x', v: 2, flag: 'Número inventado', res: 'Não saiu como esperado', why: 'o gráfico inventou um +418%' },
  { tk: 19310, k: 'meh', v: 3, flag: 'Serve, mas parado', res: 'Quase', why: 'serve, mas é um slide parado' },
];

/** as que a pessoa pede a mais em «Gerar de novo» */
export const EVO_MORE: EvoTry[] = [
  { tk: 20110, k: 'x', v: 1, flag: 'Texto genérico', res: 'Não saiu como esperado', why: 'texto genérico, sem a sua voz' },
  { tk: 17680, k: 'x', v: 2, flag: 'Ano trocado', res: 'Não saiu como esperado', why: 'trocou o ano para 2072' },
  { tk: 22540, k: 'meh', v: 3, flag: 'Slides demais', res: 'Quase', why: 'pediu 12 slides, vieram 19' },
  { tk: 18930, k: 'x', v: 1, flag: 'Logo distorcido', res: 'Não saiu como esperado', why: 'logo distorcido no rodapé' },
];

/** R$ por milhão de tokens, só para ilustrar */
export const EVO_RATE = 30;
/** duração de uma geração no painel */
export const EVO_GEN_MS = 1500;
