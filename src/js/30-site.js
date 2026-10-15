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
