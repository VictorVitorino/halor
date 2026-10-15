/* ==========================================================================
   ENTRAR · o halo que observa  |  ASSINAR · checkout com cálculo ao vivo
   ========================================================================== */
const COMMON_PW = ['123456', '12345678', 'senha123', 'password', 'qwerty', 'halor123', 'admin123', '123456789', 'senha', 'abc123'];

function bindAuth() {
  const eye = $('#eye'), say = $('#eye-say');
  const mood = (m, text) => { if (!eye) return; eye.dataset.mood = m; if (text) say.textContent = text; };
  const pupil = $('.eye-pupil', eye);
  let mode = 'entrar';
  const showState = s => {
    $$('[data-auth]').forEach(p => { p.hidden = p.dataset.auth !== s; });
    const msgs = { entrar: 'Bem-vindo de volta.', esqueci: 'Acontece. Vamos recuperar.', enviado: 'Confere a caixa de entrada.', definir: 'Uma senha nova, então.' };
    mood('idle', msgs[s]);
    const f = $('[data-auth="' + s + '"] input'); if (f) setTimeout(() => f.focus(), 50);
  };
  const setMode = m => {
    mode = m;
    $$('[data-auth-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.authTab === m)));
    $$('[data-only]').forEach(n => { n.hidden = n.dataset.only !== m; });
    $('#auth-title').textContent = m === 'entrar' ? 'Entrar no Halor' : 'Criar sua conta';
    $('#auth-sub').textContent = m === 'entrar' ? 'Continue de onde parou. Seu acervo está esperando.' : 'Grátis no plano Faísca. Sem cartão de crédito.';
    $('#a-submit').textContent = m === 'entrar' ? 'Entrar' : 'Criar conta grátis';
    $('#a-senha').autocomplete = m === 'entrar' ? 'current-password' : 'new-password';
    mood('idle', m === 'entrar' ? 'Bem-vindo de volta.' : 'Que bom ter você aqui.');
  };
  $$('[data-auth-tab]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.authTab)));
  $$('[data-auth-go]').forEach(b => b.addEventListener('click', () => showState(b.dataset.authGo)));
  // o olho acompanha o que você digita
  const email = $('#a-email');
  const lookAt = () => { if (!pupil) return; const n = Math.min(email.value.length, 30); pupil.style.transform = `translate(${(n / 30 * 36 - 18).toFixed(1)}px, 14px)`; };
  email.addEventListener('focus', () => { mood('email', 'Qual é o e-mail?'); lookAt(); });
  email.addEventListener('input', lookAt);
  email.addEventListener('blur', () => { if (pupil) pupil.style.transform = ''; });
  ['#a-senha', '#d-senha', '#d-senha2'].forEach(s => { const i = $(s); i.addEventListener('focus', () => mood('senha', 'Não estou olhando.')); i.addEventListener('blur', () => mood('idle', '')); });
  $('#a-nome').addEventListener('focus', () => mood('email', 'Como devemos te chamar?'));
  $$('[data-sso]').forEach(b => b.addEventListener('click', () => { mood('ok', 'Pode entrar.'); toast('Simulação: login único confirmado'); setTimeout(() => { location.hash = '#estudio'; }, 900); }));

  const err = $('#auth-err');
  const fail = msg => { err.hidden = false; $('span', err).textContent = msg; mood('erro', 'Opa, confere aí.'); setTimeout(() => { if (eye.dataset.mood === 'erro') mood('idle', ''); }, 1400); };
  $('#f-login').addEventListener('submit', e => {
    e.preventDefault(); err.hidden = true;
    const em = email.value.trim(), pw = $('#a-senha').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return fail('Digite um e-mail válido, como voce@empresa.com.br.');
    if (pw.length < (mode === 'criar' ? 12 : 6)) return fail(mode === 'criar' ? 'Use pelo menos 12 caracteres na senha.' : 'A senha está curta demais. Confira e tente de novo.');
    if (mode === 'criar' && !$('#a-termos').checked) return fail('Para criar a conta, aceite os termos e a política de privacidade.');
    mood('ok', 'Pode entrar.');
    const b = $('#a-submit'); b.disabled = true; b.textContent = mode === 'entrar' ? 'Entrando…' : 'Criando conta…';
    setTimeout(() => { b.disabled = false; setMode(mode); location.hash = '#estudio'; toast(mode === 'entrar' ? 'Que bom te ver de novo, Marina' : 'Conta criada no plano Faísca'); }, 900);
  });
  $('#f-esqueci').addEventListener('submit', e => { e.preventDefault(); $('#sent-to').textContent = $('#r-email').value || 'seu e-mail'; showState('enviado'); });
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
    if ($$('#pw-reqs li.ok').length < 3) { mood('erro', 'Falta pouco.'); return toast('A senha ainda não cumpre os três requisitos'); }
    if (d1.value !== $('#d-senha2').value) { mood('erro', 'Não bateu.'); return toast('As duas senhas precisam ser iguais'); }
    mood('ok', 'Pode entrar.'); setTimeout(() => { showState('entrar'); location.hash = '#estudio'; toast('Senha definida. Tudo pronto.'); }, 800);
  });
  viewHooks['v-auth'] = () => { showState('entrar'); setMode('entrar'); };
}

/* Checkout --------------------------------------------------------------- */
function renderCheckout() {
  const box = $('#co-plans'); if (!box) return;
  if (!box.children.length) {
    PLANS.slice(0, 3).forEach(p => {
      const b = el('button', 'co-plan'); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.plan = p.id;
      b.innerHTML = '<span class="cp-r" aria-hidden="true"></span>';
      const n = el('span', 'cp-n'); n.innerHTML = '<svg aria-hidden="true"><use href="' + (p.id === 'halo' ? '#hl-mark-paper' : p.ic) + '"/></svg>'; n.appendChild(document.createTextNode(p.n));
      b.append(n, el('span', 'cp-p'), el('span', 'cp-d', p.d));
      b.addEventListener('click', () => { HALOR.plan = p.id; renderCheckout(); });
      box.appendChild(b);
    });
  }
  $$('.co-plan', box).forEach(b => {
    const p = PLANS.find(x => x.id === b.dataset.plan), v = monthly(p);
    b.setAttribute('aria-checked', String(p.id === HALOR.plan));
    const pr = $('.cp-p', b); pr.textContent = v ? fmtBRL(v).replace(',00', '') : 'Grátis';
    if (v) pr.appendChild(el('small', null, p.per ? ' /pessoa/mês' : ' /mês'));
  });
  const p = PLANS.find(x => x.id === HALOR.plan) || PLANS[1];
  const anual = HALOR.cycle === 'anual', months = anual ? 12 : 1;
  const seats = p.id === 'orbita' ? HALOR.seats : 1;
  $('#co-seats').hidden = p.id !== 'orbita';
  $('#seats').textContent = HALOR.seats;
  const sub = p.m * seats * months, disc = anual ? sub * .2 : 0, cup = HALOR.coupon ? (sub - disc) * .1 : 0, total = sub - disc - cup;
  $('#sum-name').textContent = p.n;
  $('#sum-cycle').textContent = p.m === 0 ? 'Grátis para sempre' : anual ? 'Anual · cobrado uma vez por ano' : 'Mensal · renova todo mês';
  $('#sum-l1').textContent = p.m === 0 ? 'Plano Faísca' : 'Plano ' + p.n + (seats > 1 ? ' × ' + seats + ' pessoas' : '') + ' × ' + months + (months > 1 ? ' meses' : ' mês');
  $('#sum-sub').textContent = fmtBRL(sub);
  $('#sum-disc-row').hidden = !anual || p.m === 0; $('#sum-disc').textContent = '− ' + fmtBRL(disc);
  $('#sum-coupon-row').hidden = !HALOR.coupon || p.m === 0; $('#sum-coupon').textContent = '− ' + fmtBRL(cup); $('#sum-coupon-name').textContent = 'PRIMEIROOLHAR (10%)';
  $('#sum-total').textContent = fmtBRL(total);
  $('#sum-per').textContent = p.m === 0 ? 'nenhuma cobrança' : anual ? 'equivale a ' + fmtBRL(total / 12) + ' por mês' : 'cobrado todo mês';
  $('#co-submit').textContent = p.m === 0 ? 'Criar conta grátis' : HALOR.pay === 'pix' ? 'Gerar Pix e assinar' : HALOR.pay === 'boleto' ? 'Gerar boleto e assinar' : 'Assinar agora';
  $$('.co-sec')[2].hidden = p.m === 0;
}
function buildPixQR() {
  const q = $('#pix-qr'); if (!q || q.children.length) return;
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const N = 25, finder = (r, c) => { const f = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7; const inF = f(0, 0) || f(0, N - 7) || f(N - 7, 0); if (!inF) return null; const rr = r < 7 ? r : r - (N - 7), cc = c < 7 ? c : c - (N - 7); const e = Math.max(Math.abs(rr - 3), Math.abs(cc - 3)); return e === 3 || e <= 1; };
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const f = finder(r, c); const i = el('i'); if (f === true || (f === null && rnd() > .52 && !(r === 7 || c === 7 || r === N - 8 || c === N - 8))) i.className = 'on'; q.appendChild(i); }
}
function bindCheckout() {
  $$('[data-pay]').forEach(b => b.addEventListener('click', () => {
    HALOR.pay = b.dataset.pay;
    $$('[data-pay]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    $$('[data-pay-panel]').forEach(p => { p.hidden = p.dataset.payPanel !== HALOR.pay; });
    renderCheckout();
  }));
  $$('[data-seat]').forEach(b => b.addEventListener('click', () => { HALOR.seats = Math.max(3, Math.min(200, HALOR.seats + +b.dataset.seat)); renderCheckout(); }));
  $('#c-cupom-ok').addEventListener('click', () => {
    const v = $('#c-cupom').value.trim().toUpperCase();
    if (v === 'PRIMEIROOLHAR') { HALOR.coupon = true; toast('Cupom aplicado: 10% de desconto'); }
    else { HALOR.coupon = false; toast('Cupom não encontrado. Confira as letras.'); }
    renderCheckout();
  });
  // cartão ao vivo
  const num = $('#k-num'), exp = $('#k-exp'), nm = $('#k-name');
  num.addEventListener('input', () => {
    const d = num.value.replace(/\D/g, '').slice(0, 16); num.value = d.replace(/(.{4})/g, '$1 ').trim();
    $('#cc-num').textContent = (d + '•'.repeat(16 - d.length)).replace(/(.{4})/g, '$1 ').trim();
    $('#cc-brand').textContent = /^4/.test(d) ? 'VISA' : /^5[1-5]/.test(d) ? 'MASTERCARD' : /^3[47]/.test(d) ? 'AMEX' : /^(4011|4312|4389|5041|6277|6362|6363|6504|6505|6516)/.test(d) ? 'ELO' : 'CARTÃO';
  });
  exp.addEventListener('input', () => { const d = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; $('#cc-exp').textContent = exp.value || 'MM/AA'; });
  nm.addEventListener('input', () => { $('#cc-name').textContent = (nm.value || 'Seu nome').toUpperCase(); });
  $('#k-cvv').addEventListener('focus', () => { $('#cc').style.transform = 'rotateY(8deg) scale(.98)'; });
  $('#k-cvv').addEventListener('blur', () => { $('#cc').style.transform = ''; });
  $('#f-checkout').addEventListener('submit', e => {
    e.preventDefault();
    if (HALOR.pay === 'cartao' && PLANS.find(x => x.id === HALOR.plan).m > 0) {
      if (num.value.replace(/\D/g, '').length < 13) { num.focus(); return toast('Confira o número do cartão'); }
      if (!/^(0[1-9]|1[0-2])\/\d\d$/.test(exp.value)) { exp.focus(); return toast('Validade no formato MM/AA'); }
    }
    const b = $('#co-submit'); b.disabled = true; b.textContent = 'Confirmando…';
    setTimeout(() => {
      b.disabled = false;
      const p = PLANS.find(x => x.id === HALOR.plan);
      $('#done-msg').textContent = p.m === 0 ? 'Sua conta Faísca está pronta. Comece pela primeira apresentação.' : 'Seu plano ' + p.n + ' está ativo. Mandamos o recibo para ' + $('#c-email').value + '.';
      $('#f-checkout').hidden = true; $('#co-done').hidden = false;
      $$('.steps li').forEach((li, i) => { li.className = i < 2 ? 'done' : 'on'; li.toggleAttribute('aria-current', i === 2); });
      window.scrollTo(0, 0);
    }, 1100);
  });
  $('#co-again').addEventListener('click', resetCheckout);
  viewHooks['v-checkout'] = () => { resetCheckout(); };
}
function resetCheckout() {
  $('#f-checkout').hidden = false; $('#co-done').hidden = true;
  $$('.steps li').forEach((li, i) => { li.className = i === 0 ? 'done' : i === 1 ? 'on' : ''; if (i === 1) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
  renderCheckout(); buildPixQR();
}
