/* ==========================================================================
   SITE · halo interativo da Cadeia Halor e planos
   ========================================================================== */
const HALOR = { cycle: 'anual', plan: 'halo', seats: 5, entSeats: 50, coupon: false, pay: 'pix' };

const CHAIN_STEPS = [
  { n: 'Atenção', v: 'O olhar para.', t: 'A capa decide em meio segundo se quem assiste continua. Contraste, uma imagem forte e um título curto fazem o olhar parar.', m: 'Passam da capa', a: 68, b: 41, next: 'gera interesse' },
  { n: 'Interesse', v: 'O olhar fica.', t: 'Quando cada slide tem um único destaque, ninguém precisa procurar. A pessoa permanece e lê.', m: 'Ficam mais de 60 s', a: 52, b: 28, next: 'gera curiosidade' },
  { n: 'Curiosidade', v: 'O olhar procura mais.', t: 'Perguntas abertas e números que surpreendem fazem a pessoa avançar por conta própria até o fim.', m: 'Veem 70% dos slides ou mais', a: 40, b: 19, next: 'gera aproximação' },
  { n: 'Aproximação', v: 'Quem assiste pergunta.', t: 'Um comentário, uma dúvida, um pedido de detalhe. É o primeiro passo de quem assiste na sua direção.', m: 'Comentam ou perguntam', a: 27, b: 12, next: 'gera confiança' },
  { n: 'Confiança', v: 'Quem assiste compartilha.', t: 'Ninguém encaminha o que não confia. Cada novo leitor no link é um voto silencioso a seu favor.', m: 'Encaminham para alguém', a: 19, b: 8, next: 'gera parceria' },
  { n: 'Parceria', v: 'Quem assiste convida.', t: 'A conversa continua depois da sala: a pessoa chama outras para ver e quer construir junto.', m: 'Marcam reunião', a: 14, b: 6, next: 'gera valor' },
  { n: 'Valor', v: 'A ideia fica.', t: 'Quem assistiu lembra, repete e volta para rever. Tudo que veio antes trabalhou para este momento.', m: 'Voltam para rever', a: 8, b: 3, next: null }
];

/* Planos ----------------------------------------------------------------- */
/* seat: como o número de pessoas é escolhido (stepper livre, pacote fixo ou faixa) */
const PLANS = [
  { id: 'faisca', n: 'Faísca', ic: '#i-spark', d: 'Para conhecer a luz, sem pagar nada.', m: 0, cta: 'Começar grátis', f: ['3 apresentações ativas', 'Modelos essenciais', 'Exporta PDF', 'Painel Halor com 7 dias de histórico'] },
  { id: 'halo', n: 'Halo', ic: '#hl-mark', hot: true, d: 'Para quem apresenta e quer ser lembrado.', m: 69, cta: 'Assinar Halo', f: ['Apresentações ilimitadas', 'Exporta em todos os formatos', 'Raio Halor: 50 análises por mês', 'Links medidos e Painel completo', 'Sem marca d’água'] },
  { id: 'orbita', n: 'Órbita', ic: '#i-target', d: 'Para times que apresentam juntos.', m: 49, per: 'pessoa', seat: 'stepper', min: 3, max: 100, cta: 'Assinar Órbita', f: ['Tudo do plano Halo', 'Kit de marca travado', 'Biblioteca do time e aprovações', 'Integração com CRM', 'Relatórios por pessoa'] },
  { id: 'constelacao', n: 'Constelação', ic: '#i-share', d: 'Para empresas com mais de 100 pessoas.', m: null, cta: 'Falar com vendas', f: ['Mais de 100 pessoas, sem teto', 'Tudo do Empresa 50 a 100', 'Auditoria e retenção de dados', 'Ambiente dedicado', 'Suporte com SLA'] }
];
const ENTERPRISE = [
  { id: 'empresa20', n: 'Empresa 20', ic: '#i-users', pack: 'Pacote de 20 usuários', d: 'Para uma área inteira que apresenta junta e quer prender a atenção em toda reunião.', m: 39, per: 'pessoa', seat: 'fixed', seats: 20, cta: 'Assinar pacote', f: ['Tudo do plano Órbita', '20 acessos com troca livre de pessoas', 'Painel do administrador', 'Kit de marca por área', 'Onboarding guiado do time', 'Suporte prioritário'] },
  { id: 'empresa50', n: 'Empresa 50 a 100', ic: '#i-layers', pack: 'Pacote de 50 a 100 usuários', hot: true, flag: 'Menor preço por pessoa', d: 'Para empresas em que várias áreas apresentam toda semana, do treinamento à reunião de resultados.', m: 32, per: 'pessoa', seat: 'range', min: 50, max: 100, step: 10, cta: 'Assinar pacote', f: ['Tudo do Empresa 20', 'SSO e gestão de papéis', 'Vários kits de marca', 'Implantação e treinamento ao vivo', 'Gerente de sucesso dedicado'] }
];
const planById = id => PLANS.find(x => x.id === id) || ENTERPRISE.find(x => x.id === id);
const seatsOf = p => p.seat === 'fixed' ? p.seats : p.seat === 'range' ? HALOR.entSeats : p.seat === 'stepper' ? HALOR.seats : 1;
const monthly = p => p.m == null ? null : (HALOR.cycle === 'anual' ? p.m * .8 : p.m);
const money = v => fmtBRL(v).replace(',00', '');
const iconUse = href => '<svg aria-hidden="true"><use href="' + href + '"/></svg>';

/* Bloco de preço: linha do preço cheio (reservada mesmo vazia para alinhar), valor e nota */
function priceBlock(p) {
  const anual = HALOR.cycle === 'anual', v = monthly(p);
  const pr = el('div', 'plan-price');
  const was = el('p', 'pp-was'), row = el('p', 'pp-row'), note = el('p', 'pp-note');
  if (v == null) { row.appendChild(el('b', 'pp-ask', 'Sob consulta')); note.textContent = 'Proposta sob medida para a empresa'; }
  else if (v === 0) { row.append(el('b', null, 'R$ 0')); note.textContent = 'Grátis para sempre'; }
  else {
    if (anual) { was.append(el('span', 'sr-only', 'De '), el('s', null, money(p.m)), el('span', 'sr-only', ' por')); }
    row.append(el('b', 'num', money(v)), el('span', null, p.per ? '/pessoa/mês' : '/mês'));
    if (p.seat === 'stepper') note.textContent = 'A partir de ' + p.min + ' pessoas';
    else if (p.seat) note.textContent = Math.round((1 - p.m / planById('orbita').m) * 100) + '% abaixo do Órbita, por pessoa';
    else note.textContent = anual ? money(v * 12) + ' cobrados por ano' : 'Cobrado todo mês';
  }
  pr.append(was, row, note);
  return pr;
}
function featList(items, cls) {
  const ul = el('ul', cls || null);
  items.forEach(t => { const li = el('li'); li.innerHTML = iconUse('#i-check'); li.appendChild(document.createTextNode(t)); ul.appendChild(li); });
  return ul;
}
function planCta(p, cls) {
  if (p.m == null) { const b = el('button', cls, p.cta); b.type = 'button'; b.dataset.sales = ''; return b; }
  const a = el('a', cls, p.cta); a.href = '#assinar'; a.dataset.plan = p.id; return a;
}

function renderPlans() {
  const box = $('#plans'); if (!box) return;
  box.textContent = '';
  PLANS.forEach(p => {
    const c = el('article', 'plan' + (p.hot ? ' hot' : ''));
    if (p.hot) { const f = el('div', 'plan-flag'); f.appendChild(el('span', 'chip', 'Mais escolhido')); c.appendChild(f); }
    const nm = el('h3', 'plan-name'); nm.innerHTML = iconUse(p.ic); nm.appendChild(document.createTextNode(p.n)); c.appendChild(nm);
    c.appendChild(el('p', 'plan-desc', p.d));
    c.appendChild(priceBlock(p));
    c.appendChild(featList(p.f));
    c.appendChild(planCta(p, 'btn btn-block ' + (p.hot ? 'btn-primary' : 'btn-ghost')));
    box.appendChild(c);
  });
  renderEnterprise();
}

/* Planos empresariais ----------------------------------------------------- */
function renderEnterprise() {
  const box = $('#ent-plans'); if (!box) return;
  const keepFocus = document.activeElement && box.contains(document.activeElement) ? document.activeElement.id : null;
  box.textContent = '';
  ENTERPRISE.forEach(p => {
    const c = el('article', 'ent-card' + (p.hot ? ' hot' : '')); c.dataset.plan = p.id;
    c.setAttribute('aria-labelledby', 'ent-n-' + p.id);
    if (p.flag) { const f = el('div', 'plan-flag'); f.appendChild(el('span', 'chip', p.flag)); c.appendChild(f); }
    const head = el('div', 'ent-card-h');
    const nm = el('h4', 'plan-name'); nm.id = 'ent-n-' + p.id; nm.innerHTML = iconUse(p.ic); nm.appendChild(document.createTextNode(p.n));
    head.append(nm, el('span', 'chip chip-line ent-pack', p.pack));
    c.append(head, el('p', 'plan-desc', p.d));

    const body = el('div', 'ent-body');
    const left = el('div', 'ent-left');
    left.appendChild(priceBlock(p));
    const tot = el('div', 'ent-total');
    const tl = el('p', 'ent-total-v'); tl.append(el('b', 'num'), el('span', null, '/mês'));
    tot.append(el('span', 'label', 'Total do pacote'), tl, el('small'));
    left.appendChild(tot);
    body.append(left, featList(p.f, 'ent-feats'));
    c.appendChild(body);
    /* pessoas: pacote fixo mostra os 20 acessos; a faixa ganha um controle deslizante */
    const seats = el('div', 'ent-seats');
    const sh = el('div', 'ent-seats-h');
    if (p.seat === 'fixed') {
      sh.append(el('span', 'label', 'Pessoas no pacote'), el('b', 'num ent-seat-n', String(p.seats)));
      const dots = el('div', 'ent-dots'); dots.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < p.seats; i++) { const d = el('i'); d.style.setProperty('--i', i); dots.appendChild(d); }
      seats.append(sh, dots, el('p', 'ent-seats-note', 'Acessos fixos. Troque as pessoas quando quiser.'));
    } else {
      const lb = el('label', 'label', 'Pessoas no pacote'); lb.htmlFor = 'ent-rng';
      const out = el('output', 'num ent-seat-n'); out.htmlFor = 'ent-rng'; out.id = 'ent-rng-out';
      sh.append(lb, out);
      seats.append(sh, seatRange('ent-rng', p), el('p', 'ent-seats-note', 'Arraste para escolher, de ' + p.step + ' em ' + p.step + ' pessoas.'));
    }
    c.appendChild(seats);

    const cta = el('div', 'ent-cta');
    const go = planCta(p, 'btn ' + (p.hot ? 'btn-primary' : 'btn-ghost'));
    go.innerHTML = p.cta + ' ' + iconUse('#i-arrow');
    /* leitor de tela: os dois cartões têm os mesmos rótulos, o nome do pacote desfaz a dúvida */
    go.setAttribute('aria-label', p.cta + ' ' + p.n);
    const talk = el('button', 'btn btn-quiet', 'Falar com vendas'); talk.type = 'button'; talk.dataset.sales = '';
    talk.setAttribute('aria-label', 'Falar com vendas sobre o ' + p.n);
    cta.append(go, talk);
    c.appendChild(cta);
    box.appendChild(c);
  });
  updateEnterprise();
  if (keepFocus && document.getElementById(keepFocus)) document.getElementById(keepFocus).focus();
}
/* Controle deslizante de pessoas (site e checkout usam o mesmo) */
function seatRange(id, p) {
  const w = el('div', 'rng-wrap');
  const r = el('input', 'rng'); r.type = 'range'; r.id = id; r.min = p.min; r.max = p.max; r.step = p.step; r.value = HALOR.entSeats;
  r.dataset.entRange = '';
  const ticks = el('div', 'rng-ticks'); ticks.setAttribute('aria-hidden', 'true');
  const n = (p.max - p.min) / p.step;
  for (let i = 0; i <= n; i++) { const t = el('span', null, String(p.min + i * p.step)); t.style.setProperty('--k', i / n); ticks.appendChild(t); }
  w.append(r, ticks);
  return w;
}
function paintRange(r, v, total) {
  const min = +r.min, max = +r.max;
  r.value = v;
  r.style.setProperty('--fill', ((v - min) / (max - min) * 100) + '%');
  r.setAttribute('aria-valuetext', v + ' pessoas' + (total ? ', total de ' + total + ' por mês' : ''));
  const w = r.closest('.rng-wrap');
  if (w) $$('.rng-ticks span', w).forEach(t => t.classList.toggle('on', +t.textContent === v));
}
function updateEnterprise() {
  const anual = HALOR.cycle === 'anual';
  ENTERPRISE.forEach(p => {
    const c = $('.ent-card[data-plan="' + p.id + '"]'); if (!c) return;
    const s = seatsOf(p), v = monthly(p), tot = v * s;
    $('.ent-total-v b', c).textContent = money(tot);
    $('.ent-total small', c).textContent = anual ? money(tot * 12) + ' por ano, para ' + s + ' pessoas' : 'Para ' + s + ' pessoas, cobrança mensal';
    const r = $('input[type="range"]', c);
    if (r) { paintRange(r, s, money(tot)); $('output', c).textContent = s; }
  });
}
document.addEventListener('input', e => {
  const r = e.target.closest('[data-ent-range]'); if (!r) return;
  HALOR.entSeats = +r.value;
  updateEnterprise();
  if (r.id !== 'ent-rng' && typeof renderCheckout === 'function') renderCheckout();
});

/* Navegação para o checkout: o link diz qual plano chega pré-selecionado.
   Botões "Começar grátis" sem plano explícito levam ao Faísca. */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#assinar"]'); if (!a) return;
  if (a.dataset.plan) HALOR.plan = a.dataset.plan;
  else if (/grátis/i.test(a.textContent)) HALOR.plan = 'faisca';
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-sales]'); if (!b) return;
  e.preventDefault();
  toast('Pedido recebido. Nosso time fala com você em até 1 dia útil.');
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-cycle]'); if (!b) return;
  HALOR.cycle = b.dataset.cycle;
  $$('[data-cycle]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cycle === HALOR.cycle)));
  renderPlans();
  if (typeof renderCheckout === 'function') renderCheckout();
});
