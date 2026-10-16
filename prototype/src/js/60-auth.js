/* ==========================================================================
   ENTRAR · o halo que observa  |  ASSINAR · checkout com cálculo ao vivo
   ========================================================================== */
const COMMON_PW = ['123456', '12345678', 'senha123', 'password', 'qwerty', 'halor123', 'admin123', '123456789', 'senha', 'abc123'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Abas com setas do teclado (WAI-ARIA: a aba ativa é a única na ordem de tabulação) */
function tabKeys(list, onPick) {
  list.addEventListener('keydown', e => {
    const tabs = $$('[role="tab"]', list), i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let j = null;
    if (step) j = (i + step + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j == null) return;
    e.preventDefault(); onPick(tabs[j]); tabs[j].focus();
  });
}
/* Topo imediato: o html rola suave, e sem isso a troca de tela desliza desde o fim do site */
const toTop = () => { try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (_) { window.scrollTo(0, 0); } };
/* Marca o campo inválido e liga a mensagem a ele */
function invalid(input, on) { if (input) input.setAttribute('aria-invalid', String(!!on)); }

function bindAuth() {
  const eye = $('#eye'), say = $('#eye-say');
  const mood = (m, text) => { if (!eye) return; eye.dataset.mood = m; if (text) say.textContent = text; };
  const pupil = eye ? $('.eye-pupil', eye) : null;
  let mode = 'entrar', state = 'entrar';
  const REST = { entrar: 'Bem-vindo de volta.', criar: 'Que bom ter você aqui.', esqueci: 'Acontece. Vamos recuperar.', enviado: 'Confere a caixa de entrada.', definir: 'Uma senha nova, então.' };
  const rest = () => mood('idle', state === 'entrar' ? REST[mode] : REST[state]);
  const err = $('#auth-err');
  const clearErr = () => { err.hidden = true; $$('#f-login .input').forEach(i => invalid(i, false)); };
  const showState = (s, focus = true) => {
    state = s;
    $$('[data-auth]').forEach(p => { p.hidden = p.dataset.auth !== s; });
    clearErr(); $('#r-err').hidden = true; invalid($('#r-email'), false);
    rest();
    if (!focus) return;
    const panel = $('[data-auth="' + s + '"]');
    const f = $('input', panel) || $('h1', panel);
    if (f) setTimeout(() => f.focus(), 50);
  };
  const setMode = m => {
    mode = m;
    $$('[data-auth-tab]').forEach(b => { const on = b.dataset.authTab === m; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    $('#f-login').setAttribute('aria-labelledby', 'auth-tab-' + m);
    $$('[data-only]').forEach(n => { n.hidden = n.dataset.only !== m; });
    $('#auth-title').textContent = m === 'entrar' ? 'Entrar no Halor' : 'Criar sua conta';
    $('#auth-sub').textContent = m === 'entrar' ? 'Continue de onde parou. Seu acervo está esperando.' : 'Grátis no plano Faísca, para sempre.';
    const b = $('#a-submit'); b.disabled = false; b.textContent = m === 'entrar' ? 'Entrar' : 'Criar conta grátis';
    $('#a-senha').autocomplete = m === 'entrar' ? 'current-password' : 'new-password';
    $('#a-senha').placeholder = m === 'entrar' ? 'Sua senha' : 'Pelo menos 12 caracteres';
    clearErr(); rest();
  };
  $$('[data-auth-tab]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.authTab)));
  tabKeys($('.auth-seg'), t => setMode(t.dataset.authTab));
  $$('[data-auth-go]').forEach(b => b.addEventListener('click', () => showState(b.dataset.authGo)));
  // o olho acompanha o que você digita
  const email = $('#a-email');
  const lookAt = () => { if (!pupil) return; const n = Math.min(email.value.length, 30); pupil.style.transform = `translate(${(n / 30 * 36 - 18).toFixed(1)}px, 14px)`; };
  email.addEventListener('focus', () => { mood('email', 'Qual é o e-mail?'); lookAt(); });
  email.addEventListener('input', () => { lookAt(); invalid(email, false); });
  email.addEventListener('blur', () => { if (pupil) pupil.style.transform = ''; rest(); });
  ['#a-senha', '#d-senha', '#d-senha2'].forEach(s => { const i = $(s); i.addEventListener('focus', () => mood('senha', 'Não estou olhando.')); i.addEventListener('blur', rest); i.addEventListener('input', () => invalid(i, false)); });
  $('#a-nome').addEventListener('focus', () => mood('email', 'Como devemos te chamar?'));
  $('#a-nome').addEventListener('blur', rest);
  $$('[data-sso]').forEach(b => b.addEventListener('click', () => { mood('ok', 'Pode entrar.'); toast('Simulação: login único confirmado'); setTimeout(() => { location.hash = '#estudio'; }, 900); }));

  const fail = (msg, input) => {
    err.hidden = false; $('span', err).textContent = msg;
    if (input) { invalid(input, true); input.focus(); }
    mood('erro', 'Opa, confere aí.');
    setTimeout(() => { if (eye && eye.dataset.mood === 'erro') rest(); }, 1600);
  };
  $('#f-login').addEventListener('submit', e => {
    e.preventDefault(); clearErr();
    const em = email.value.trim(), pwI = $('#a-senha'), pw = pwI.value;
    if (mode === 'criar' && !$('#a-nome').value.trim()) return fail('Diga como devemos te chamar.', $('#a-nome'));
    if (!EMAIL_RE.test(em)) return fail('Digite um e-mail válido, como voce@empresa.com.br.', email);
    if (pw.length < (mode === 'criar' ? 12 : 6)) return fail(mode === 'criar' ? 'Use pelo menos 12 caracteres na senha.' : 'A senha está curta demais. Confira e tente de novo.', pwI);
    if (mode === 'criar' && !$('#a-termos').checked) return fail('Para criar a conta, aceite os termos e a política de privacidade.', $('#a-termos'));
    mood('ok', 'Pode entrar.');
    const b = $('#a-submit'); b.disabled = true; b.textContent = mode === 'entrar' ? 'Entrando…' : 'Criando conta…';
    const was = mode;
    setTimeout(() => { setMode(was); location.hash = '#estudio'; toast(was === 'entrar' ? 'Que bom te ver de novo, Marina' : 'Conta criada no plano Faísca'); }, 900);
  });
  $('#f-esqueci').addEventListener('submit', e => {
    e.preventDefault();
    const r = $('#r-email'), v = r.value.trim(), re = $('#r-err');
    if (!EMAIL_RE.test(v)) { re.hidden = false; $('span', re).textContent = 'Digite o e-mail da sua conta, como voce@empresa.com.br.'; invalid(r, true); r.focus(); mood('erro', 'Opa, confere aí.'); return; }
    $('#sent-to').textContent = v; showState('enviado');
  });
  $('#r-email').addEventListener('input', () => { invalid($('#r-email'), false); $('#r-err').hidden = true; });
  // força da senha
  const d1 = $('#d-senha'), meter = $('#pw-meter');
  d1.addEventListener('input', () => {
    const v = d1.value, mail = ($('#a-email').value.split('@')[0] || '').toLowerCase();
    const ok = { len: v.length >= 12, mail: !mail || !v.toLowerCase().includes(mail), common: !!v && !COMMON_PW.includes(v.toLowerCase()) };
    $$('#pw-reqs li').forEach(li => li.classList.toggle('ok', ok[li.dataset.req] && !!v));
    const score = (ok.len ? 1 : 0) + (ok.mail && v ? 1 : 0) + (ok.common ? 1 : 0) + (v.length >= 16 ? 1 : 0);
    meter.style.width = (score / 4 * 100) + '%';
    meter.style.background = score >= 3 ? 'var(--ok)' : score === 2 ? 'var(--warn)' : 'var(--danger)';
  });
  $('#f-definir').addEventListener('submit', e => {
    e.preventDefault();
    if ($$('#pw-reqs li.ok').length < 3) { mood('erro', 'Falta pouco.'); invalid(d1, true); d1.focus(); return toast('A senha ainda não cumpre os três requisitos'); }
    if (d1.value !== $('#d-senha2').value) { mood('erro', 'Não bateu.'); invalid($('#d-senha2'), true); $('#d-senha2').focus(); return toast('As duas senhas precisam ser iguais'); }
    mood('ok', 'Pode entrar.'); setTimeout(() => { showState('entrar', false); location.hash = '#estudio'; toast('Senha definida. Tudo pronto.'); }, 800);
  });
  viewHooks['v-auth'] = () => { toTop(); setMode('entrar'); showState('entrar', false); };
}

/* Checkout --------------------------------------------------------------- */
const CO_AUD = { time: ['faisca', 'halo', 'orbita'], empresa: ['empresa20', 'empresa50'] };
const coLast = { time: 'halo', empresa: 'empresa20' };
const audOf = id => CO_AUD.empresa.includes(id) ? 'empresa' : 'time';
let coTipPick = null;

function buildCoPlans(aud) {
  const box = $('#co-plans');
  if (box.dataset.group === aud) return;
  const hadFocus = box.contains(document.activeElement);
  box.dataset.group = aud; box.textContent = '';
  box.classList.toggle('co-plans-ent', aud === 'empresa');
  CO_AUD[aud].forEach(id => {
    const p = planById(id);
    const b = el('button', 'co-plan'); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.plan = p.id;
    b.setAttribute('aria-labelledby', 'cpn-' + p.id); b.setAttribute('aria-describedby', 'cpp-' + p.id + ' cpd-' + p.id);
    b.innerHTML = '<span class="cp-r" aria-hidden="true"></span>';
    const n = el('span', 'cp-n'); n.id = 'cpn-' + p.id; n.innerHTML = iconUse(p.id === 'halo' ? '#hl-mark-paper' : p.ic); n.appendChild(document.createTextNode(p.n));
    const pr = el('span', 'cp-p'); pr.id = 'cpp-' + p.id;
    const d = el('span', 'cp-d', p.pack || p.d); d.id = 'cpd-' + p.id;
    b.append(n, pr, d);
    b.addEventListener('click', () => pickPlan(p.id));
    box.appendChild(b);
  });
  $('#co-more').hidden = aud !== 'empresa';
  if (hadFocus) requestAnimationFrame(() => { const c = $('.co-plan[aria-checked="true"]', box) || $('.co-plan', box); if (c) c.focus(); });
}
function pickPlan(id) { HALOR.plan = id; coLast[audOf(id)] = id; renderCheckout(); }

function renderCheckout() {
  const box = $('#co-plans'); if (!box) return;
  let p = planById(HALOR.plan);
  if (!p || p.m == null) { HALOR.plan = 'halo'; p = planById('halo'); }
  const aud = audOf(p.id); coLast[aud] = p.id;
  buildCoPlans(aud);
  $$('.co-aud [data-aud]').forEach(t => { const on = t.dataset.aud === aud; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  $('#co-plans-panel').setAttribute('aria-labelledby', 'co-aud-' + aud);
  $$('.co-plan', box).forEach(b => {
    const q = planById(b.dataset.plan), v = monthly(q), on = q.id === p.id;
    b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
    const pr = $('.cp-p', b); pr.textContent = v ? money(v) : 'Grátis';
    if (v) pr.appendChild(el('small', null, q.per ? ' /pessoa/mês' : ' /mês'));
  });

  /* pessoas: cada tipo de plano tem o seu controle */
  const anual = HALOR.cycle === 'anual', months = anual ? 12 : 1, seats = seatsOf(p), free = p.m === 0;
  $('#co-seats').hidden = !p.seat;
  $$('[data-seat-ctl]').forEach(c => { c.hidden = c.dataset.seatCtl !== p.seat; });
  const tip = $('#co-tip'); tip.hidden = true; coTipPick = null;
  if (p.seat === 'stepper') {
    $('#seats-label').textContent = 'Pessoas no time';
    $('#seats-hint').textContent = 'Mínimo de 3 no plano Órbita';
    $('#seats').textContent = HALOR.seats;
    /* aria-disabled em vez de disabled: o foco do teclado não se perde no limite */
    $('[data-seat="-1"]').setAttribute('aria-disabled', String(HALOR.seats <= p.min));
    $('[data-seat="1"]').setAttribute('aria-disabled', String(HALOR.seats >= p.max));
    /* se um pacote empresarial sai mais em conta, o checkout avisa */
    const e20 = planById('empresa20'), e50 = planById('empresa50'), orb = monthly(p) * seats;
    const pack50 = Math.max(e50.min, Math.ceil(seats / e50.step) * e50.step);
    let alt = null;
    if (seats <= e20.seats && monthly(e20) * e20.seats < orb) alt = { p: e20, n: e20.seats };
    else if (seats > e20.seats && seats <= e50.max && monthly(e50) * pack50 < orb) alt = { p: e50, n: pack50 };
    if (alt) {
      $('span', tip).textContent = 'Com ' + seats + ' pessoas, o pacote ' + alt.p.n + ' custa menos: ' + money(monthly(alt.p) * alt.n) + ' por mês para ' + alt.n + ' acessos.';
      $('#co-tip-go').textContent = 'Trocar para ' + alt.p.n;
      coTipPick = alt; tip.hidden = false;
    } else if (seats >= p.max) {
      $('span', tip).textContent = 'Mais de 100 pessoas? O plano Constelação monta um ambiente dedicado.';
      $('#co-tip-go').textContent = 'Falar com vendas';
      coTipPick = 'vendas'; tip.hidden = false;
    }
  } else if (p.seat === 'fixed') {
    $('#seats-label').textContent = 'Pessoas no pacote';
    $('#seats-hint').textContent = 'Pacote fixo de 20 acessos. Troque as pessoas quando quiser.';
    $('.seat-fixed b').textContent = p.seats;
  } else if (p.seat === 'range') {
    $('#seats-label').textContent = 'Pessoas no pacote';
    $('#seats-hint').textContent = 'De ' + p.min + ' a ' + p.max + ' pessoas, em passos de ' + p.step;
    const rw = $('#co-range');
    if (!rw.children.length) {
      const h = el('output', 'num co-range-n'); h.id = 'co-rng-out'; h.htmlFor = 'co-rng';
      rw.append(h, seatRange('co-rng', p));
      $('#co-rng').setAttribute('aria-labelledby', 'seats-label');
    }
    $('#co-rng-out').textContent = seats + ' pessoas';
  }

  /* resumo */
  const sub = p.m * seats * months, disc = anual ? sub * .2 : 0, cup = HALOR.coupon ? (sub - disc) * .1 : 0, total = sub - disc - cup;
  if (p.seat === 'range') paintRange($('#co-rng'), seats, money(monthly(p) * seats));
  $('#sum-name').textContent = p.n;
  $('#sum-cycle').textContent = free ? 'Grátis para sempre' : anual ? 'Anual · cobrado uma vez por ano' : 'Mensal · renova todo mês';
  const pack = $('#sum-pack'); pack.hidden = !p.pack;
  if (p.pack) $('span', pack).textContent = p.seat === 'range' ? 'Pacote de ' + seats + ' usuários' : p.pack;
  const per = months + (months > 1 ? ' meses' : ' mês');
  $('#sum-l1').textContent = free ? 'Plano Faísca' : seats > 1 ? money(p.m) + ' × ' + seats + ' pessoas × ' + per : 'Plano ' + p.n + ' × ' + per;
  $('#sum-sub').textContent = fmtBRL(sub);
  $('#sum-disc-row').hidden = !anual || free; $('#sum-disc').textContent = '− ' + fmtBRL(disc);
  $('#sum-coupon-row').hidden = !HALOR.coupon || free; $('#sum-coupon').textContent = '− ' + fmtBRL(cup); $('#sum-coupon-name').textContent = 'PRIMEIROOLHAR (10%)';
  $('#coupon').hidden = free;
  $('#sum-total').textContent = fmtBRL(total);
  $('#co-mini-total').textContent = fmtBRL(total);
  const perSeat = seats > 1 ? ', ' + fmtBRL(total / months / seats) + ' por pessoa' : '';
  $('#sum-per').textContent = free ? 'nenhuma cobrança' : anual ? 'equivale a ' + fmtBRL(total / 12) + ' por mês' + perSeat : 'cobrado todo mês' + perSeat;
  $('#co-submit').textContent = free ? 'Criar conta grátis' : HALOR.pay === 'pix' ? 'Gerar Pix e assinar' : HALOR.pay === 'boleto' ? 'Gerar boleto e assinar' : 'Assinar agora';
  $('#co-sec-pay').hidden = free;
  $$('[data-paid]').forEach(f => { f.hidden = free; });
  $('#c-email-l').textContent = free ? 'E-mail' : 'E-mail de cobrança';
  $$('[data-trust]').forEach(u => { u.hidden = (u.dataset.trust === 'free') !== free; });
  /* parcelas: só o anual parcela; o mensal é sempre uma cobrança por mês */
  const parc = $('#k-parc'), keep = parc.selectedIndex;
  parc.textContent = '';
  (anual ? [1, 3, 6, 12] : [1]).forEach(n => { const o = el('option', null, n + 'x de ' + fmtBRL(total / n)); o.value = n; parc.appendChild(o); });
  parc.selectedIndex = Math.min(Math.max(keep, 0), parc.options.length - 1);
}
function buildPixQR() {
  const q = $('#pix-qr'); if (!q || q.children.length) return;
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const N = 25, finder = (r, c) => { const f = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7; const inF = f(0, 0) || f(0, N - 7) || f(N - 7, 0); if (!inF) return null; const rr = r < 7 ? r : r - (N - 7), cc = c < 7 ? c : c - (N - 7); const e = Math.max(Math.abs(rr - 3), Math.abs(cc - 3)); return e === 3 || e <= 1; };
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const f = finder(r, c); const i = el('i'); if (f === true || (f === null && rnd() > .52 && !(r === 7 || c === 7 || r === N - 8 || c === N - 8))) i.className = 'on'; q.appendChild(i); }
}
function bindCheckout() {
  const pickPay = b => {
    HALOR.pay = b.dataset.pay;
    $$('[data-pay]').forEach(x => { const on = x === b; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    $$('[data-pay-panel]').forEach(p => { p.hidden = p.dataset.payPanel !== HALOR.pay; });
    renderCheckout();
  };
  $$('[data-pay]').forEach(b => b.addEventListener('click', () => pickPay(b)));
  tabKeys($('.pay-tabs'), pickPay);
  /* Para quem é: você e seu time, ou empresas */
  const pickAud = t => { HALOR.plan = coLast[t.dataset.aud]; renderCheckout(); };
  $$('.co-aud [data-aud]').forEach(t => t.addEventListener('click', () => pickAud(t)));
  tabKeys($('.co-aud'), pickAud);
  /* grupo de rádio: setas mudam a escolha e o foco */
  $('#co-plans').addEventListener('keydown', e => {
    const items = $$('.co-plan', e.currentTarget), i = items.indexOf(document.activeElement);
    if (i < 0) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let j = null;
    if (step) j = (i + step + items.length) % items.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = items.length - 1;
    if (j == null) return;
    e.preventDefault(); pickPlan(items[j].dataset.plan); items[j].focus();
  });
  $$('[data-seat]').forEach(b => b.addEventListener('click', () => { const o = planById('orbita'); HALOR.seats = Math.max(o.min, Math.min(o.max, HALOR.seats + +b.dataset.seat)); renderCheckout(); }));
  $('#co-tip-go').addEventListener('click', () => {
    if (!coTipPick) return;
    if (coTipPick === 'vendas') return toast('Pedido recebido. Nosso time fala com você em até 1 dia útil.');
    if (coTipPick.p.seat === 'range') HALOR.entSeats = coTipPick.n;
    const n = coTipPick.p.n;
    pickPlan(coTipPick.p.id);
    toast('Pacote ' + n + ' selecionado');
    const c = $('.co-plan[aria-checked="true"]'); if (c) c.focus();
  });
  $('#co-mini-go').addEventListener('click', () => { const s = $('#co-sum'); s.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }); });
  /* cupom: Enter aplica sem enviar o formulário; aplicado, vira "Remover" */
  const cin = $('#c-cupom'), cbtn = $('#c-cupom-ok');
  const paintCoupon = () => { cin.readOnly = HALOR.coupon; cin.classList.toggle('is-ok', HALOR.coupon); cbtn.textContent = HALOR.coupon ? 'Remover' : 'Aplicar'; };
  const applyCoupon = () => {
    if (HALOR.coupon) { HALOR.coupon = false; cin.value = ''; toast('Cupom removido'); paintCoupon(); renderCheckout(); cin.focus(); return; }
    const v = cin.value.trim().toUpperCase();
    if (!v) { toast('Digite um cupom para aplicar'); cin.focus(); return; }
    if (v === 'PRIMEIROOLHAR') { HALOR.coupon = true; cin.value = v; toast('Cupom aplicado: 10% de desconto'); }
    else { toast('Cupom não encontrado. Confira as letras.'); invalid(cin, true); }
    paintCoupon(); renderCheckout();
  };
  cbtn.addEventListener('click', applyCoupon);
  cin.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } });
  cin.addEventListener('input', () => invalid(cin, false));
  paintCoupon();
  // cartão ao vivo
  const num = $('#k-num'), exp = $('#k-exp'), nm = $('#k-name'), cvv = $('#k-cvv');
  num.addEventListener('input', () => {
    const d = num.value.replace(/\D/g, '').slice(0, 16); num.value = d.replace(/(.{4})/g, '$1 ').trim();
    $('#cc-num').textContent = (d + '•'.repeat(16 - d.length)).replace(/(.{4})/g, '$1 ').trim();
    $('#cc-brand').textContent = /^(4011|4312|4389|5041|6277|6362|6363|6504|6505|6516)/.test(d) ? 'ELO' : /^4/.test(d) ? 'VISA' : /^5[1-5]/.test(d) ? 'MASTERCARD' : /^3[47]/.test(d) ? 'AMEX' : 'CARTÃO';
    invalid(num, false);
  });
  exp.addEventListener('input', () => { const d = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; $('#cc-exp').textContent = exp.value || 'MM/AA'; invalid(exp, false); });
  cvv.addEventListener('input', () => { cvv.value = cvv.value.replace(/\D/g, '').slice(0, 4); invalid(cvv, false); });
  nm.addEventListener('input', () => { $('#cc-name').textContent = (nm.value || 'Seu nome').toUpperCase(); });
  cvv.addEventListener('focus', () => { $('#cc').style.transform = 'rotateY(8deg) scale(.98)'; });
  cvv.addEventListener('blur', () => { $('#cc').style.transform = ''; });
  ['#c-nome', '#c-email', '#c-doc', '#c-cep'].forEach(s => $(s).addEventListener('input', () => invalid($(s), false)));
  /* máscaras leves de CPF/CNPJ e CEP */
  $('#c-doc').addEventListener('input', () => {
    const i = $('#c-doc'), d = i.value.replace(/\D/g, '').slice(0, 14);
    i.value = d.length <= 11 ? d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      : d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  });
  $('#c-cep').addEventListener('input', () => { const i = $('#c-cep'), d = i.value.replace(/\D/g, '').slice(0, 8); i.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; });

  const stop = (input, msg) => { invalid(input, true); input.focus(); toast(msg); };
  $('#f-checkout').addEventListener('submit', e => {
    e.preventDefault();
    const p = planById(HALOR.plan), paid = p.m > 0;
    if (!$('#c-nome').value.trim()) return stop($('#c-nome'), 'Digite o seu nome completo');
    if (!EMAIL_RE.test($('#c-email').value.trim())) return stop($('#c-email'), 'Digite um e-mail válido');
    if (paid) {
      const doc = $('#c-doc').value.replace(/\D/g, '').length;
      if (doc !== 11 && doc !== 14) return stop($('#c-doc'), 'Confira o CPF (11 dígitos) ou o CNPJ (14 dígitos)');
      if ($('#c-cep').value.replace(/\D/g, '').length !== 8) return stop($('#c-cep'), 'O CEP tem 8 dígitos');
    }
    if (paid && HALOR.pay === 'cartao') {
      if (num.value.replace(/\D/g, '').length < 13) return stop(num, 'Confira o número do cartão');
      const m = exp.value.match(/^(0[1-9]|1[0-2])\/(\d\d)$/);
      if (!m) return stop(exp, 'Validade no formato MM/AA');
      const now = new Date(), yy = now.getFullYear() % 100, mm = now.getMonth() + 1;
      if (+m[2] < yy || (+m[2] === yy && +m[1] < mm)) return stop(exp, 'Este cartão já venceu. Confira a validade');
      if (cvv.value.length < 3) return stop(cvv, 'O CVV tem 3 ou 4 dígitos');
    }
    const b = $('#co-submit'); b.disabled = true; b.textContent = 'Confirmando…';
    setTimeout(() => {
      b.disabled = false;
      const s = seatsOf(p), mail = $('#c-email').value.trim(), team = s > 1;
      const kind = p.pack ? 'pacote ' : 'plano ';
      const after = HALOR.pay === 'boleto' ? ' O boleto foi para ' + mail + ' e a conta já está liberada enquanto ele compensa.'
        : HALOR.pay === 'pix' ? ' Pix confirmado. Mandamos o recibo para ' + mail + '.'
        : ' Mandamos o recibo para ' + mail + '.';
      $('#done-msg').textContent = !paid ? 'Sua conta Faísca está pronta. Comece pela primeira apresentação.'
        : 'Seu ' + kind + p.n + ' está ativo' + (team ? ' para ' + s + ' pessoas' : '') + '.' + after + (team ? ' Agora é só convidar o time.' : '');
      $('#done-eyebrow').textContent = paid ? 'Assinatura ativa' : 'Conta criada';
      $('#co-invite').hidden = !team || !paid;
      $('#f-checkout').hidden = true; $('#co-done').hidden = false;
      $$('.steps li').forEach((li, i) => { li.className = i < 2 ? 'done' : 'on'; li.toggleAttribute('aria-current', i === 2); if (i === 2) li.setAttribute('aria-current', 'step'); });
      toTop();
      $('#done-title').focus({ preventScroll: true });
    }, 1100);
  });
  $('#co-again').addEventListener('click', resetCheckout);
  viewHooks['v-checkout'] = () => { toTop(); resetCheckout(); };
}
function resetCheckout() {
  $('#f-checkout').hidden = false; $('#co-done').hidden = true;
  $$('.steps li').forEach((li, i) => { li.className = i === 0 ? 'done' : i === 1 ? 'on' : ''; if (i === 1) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
  renderCheckout(); buildPixQR();
}
