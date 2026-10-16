/* Cadeia Halor: os sete passos da atenção que fica. Usada no painel, nos sinais do estúdio e no manual da marca.
   a e b: porcentagem de quem chega a cada passo com e sem Halor (dados ilustrativos de um time de exemplo). */
export interface ChainStep { n: string; v: string; t: string; m: string; a: number; b: number; next: string | null }

export const CHAIN_STEPS: ChainStep[] = [
  { n: 'Atenção', v: 'O olhar para.', t: 'A capa decide em meio segundo se quem assiste continua. Contraste, uma imagem forte e um título curto fazem o olhar parar.', m: 'Passam da capa', a: 68, b: 41, next: 'gera interesse' },
  { n: 'Interesse', v: 'O olhar fica.', t: 'Quando cada slide tem um único destaque, ninguém precisa procurar. A pessoa permanece e lê.', m: 'Ficam mais de 60 s', a: 52, b: 28, next: 'gera curiosidade' },
  { n: 'Curiosidade', v: 'O olhar procura mais.', t: 'Perguntas abertas e números que surpreendem fazem a pessoa avançar por conta própria até o fim.', m: 'Veem 70% dos slides ou mais', a: 40, b: 19, next: 'gera aproximação' },
  { n: 'Aproximação', v: 'Quem assiste pergunta.', t: 'Um comentário, uma dúvida, um pedido de detalhe. É o primeiro passo de quem assiste na sua direção.', m: 'Comentam ou perguntam', a: 27, b: 12, next: 'gera confiança' },
  { n: 'Confiança', v: 'Quem assiste compartilha.', t: 'Ninguém encaminha o que não confia. Cada novo leitor no link é um voto silencioso a seu favor.', m: 'Encaminham para alguém', a: 19, b: 8, next: 'gera parceria' },
  { n: 'Parceria', v: 'Quem assiste convida.', t: 'A conversa continua depois da sala: a pessoa chama outras para ver e quer construir junto.', m: 'Marcam reunião', a: 14, b: 6, next: 'gera valor' },
  { n: 'Valor', v: 'A ideia fica.', t: 'Quem assistiu lembra, repete e volta para rever. Tudo que veio antes trabalhou para este momento.', m: 'Voltam para rever', a: 8, b: 3, next: null }
];
