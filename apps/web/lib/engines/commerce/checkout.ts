/* ==========================================================================
   ASSINAR · checkout com cálculo ao vivo. Planos por público (você e seu time
   ou empresas), ciclo, regras de pessoas, cupom, Pix/cartão/boleto com cartão
   ao vivo, validação, resumo, barra de total no celular e tela de pronto.
   Porte de bindCheckout/renderCheckout/resetCheckout em prototype/src/js/60-auth.js.
   ========================================================================== */
import { $, $$, el, fmtBRL, toast, REDUCED } from '../../core';
import {
  EMAIL_RE, EMPRESA20, EMPRESA50, HALOR, ORBITA, SALES_MSG, applyCheckoutQuery, arrowIndex, icon, invalid,
  money, monthly, paintRange, planById, seatRange, seatsOf, tabKeys, timers, toTop,
  type Cycle, type Pay, type Plan, type PlanId,
} from './plans';

type Aud = 'time' | 'empresa';
const CO_AUD: Record<Aud, readonly PlanId[]> = { time: ['faisca', 'halo', 'orbita'], empresa: ['empresa20', 'empresa50'] };
/** último plano escolhido em cada público, para a troca de aba voltar a ele */
const coLast: Record<Aud, PlanId> = { time: 'halo', empresa: 'empresa20' };
const audOf = (id: PlanId): Aud => CO_AUD.empresa.includes(id) ? 'empresa' : 'time';
/** o que o atalho da dica faz: trocar para um pacote mais em conta ou falar com vendas */
let coTipPick: { p: Plan; n: number } | 'vendas' | null = null;
const perMonth = (p: Plan) => monthly(p) ?? 0;

function buildCoPlans(aud: Aud) {
  const box = $('#co-plans')!;
  if (box.dataset.group === aud) return;
  const hadFocus = box.contains(document.activeElement);
  box.dataset.group = aud; box.textContent = '';
  box.classList.toggle('co-plans-ent', aud === 'empresa');
  CO_AUD[aud].forEach(id => {
    const p = planById(id)!;
    const b = el('button', 'co-plan'); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.plan = p.id;
    b.setAttribute('aria-labelledby', 'cpn-' + p.id); b.setAttribute('aria-describedby', 'cpp-' + p.id + ' cpd-' + p.id);
    const r = el('span', 'cp-r'); r.setAttribute('aria-hidden', 'true');
    const n = el('span', 'cp-n'); n.id = 'cpn-' + p.id; n.append(icon(p.id === 'halo' ? '#hl-mark-paper' : p.ic), document.createTextNode(p.n));
    const pr = el('span', 'cp-p'); pr.id = 'cpp-' + p.id;
    const d = el('span', 'cp-d', p.pack || p.d); d.id = 'cpd-' + p.id;
    b.append(r, n, pr, d);
    box.appendChild(b);
  });
  $('#co-more')!.hidden = aud !== 'empresa';
  if (hadFocus) requestAnimationFrame(() => { const c = $('.co-plan[aria-checked="true"]', box) || $('.co-plan', box); c?.focus(); });
}
function pickPlan(id: PlanId) { HALOR.plan = id; coLast[audOf(id)] = id; renderCheckout(); }

function renderCheckout() {
  const box = $('#co-plans'); if (!box) return;
  let p = planById(HALOR.plan);
  if (!p || p.m == null) { HALOR.plan = 'halo'; p = planById('halo')!; }
  const price = p.m ?? 0;
  const aud = audOf(p.id); coLast[aud] = p.id;
  buildCoPlans(aud);
  $$('.co-aud [data-aud]').forEach(t => { const on = t.dataset.aud === aud; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  $('#co-plans-panel')!.setAttribute('aria-labelledby', 'co-aud-' + aud);
  $$('.co-plan', box).forEach(b => {
    const q = planById(b.dataset.plan)!, v = monthly(q), on = q.id === p.id;
    b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
    const pr = $('.cp-p', b)!; pr.textContent = v ? money(v) : 'Grátis';
    if (v) pr.appendChild(el('small', null, q.per ? ' /pessoa/mês' : ' /mês'));
  });

  /* pessoas: cada tipo de plano tem o seu controle */
  const anual = HALOR.cycle === 'anual', months = anual ? 12 : 1, seats = seatsOf(p), free = price === 0;
  $('#co-seats')!.hidden = !p.seat;
  $$('[data-seat-ctl]').forEach(c => { c.hidden = c.dataset.seatCtl !== p.seat; });
  const tip = $('#co-tip')!, tipGo = $('#co-tip-go')!; tip.hidden = true; coTipPick = null;
  if (p.seat === 'stepper') {
    $('#seats-label')!.textContent = 'Pessoas no time';
    $('#seats-hint')!.textContent = 'Mínimo de 3 no plano Órbita';
    $('#seats')!.textContent = String(HALOR.seats);
    /* aria-disabled em vez de disabled: o foco do teclado não se perde no limite */
    $('[data-seat="-1"]')!.setAttribute('aria-disabled', String(HALOR.seats <= p.min));
    $('[data-seat="1"]')!.setAttribute('aria-disabled', String(HALOR.seats >= p.max));
    /* se um pacote empresarial sai mais em conta, o checkout avisa */
    const e20 = EMPRESA20, e50 = EMPRESA50, orb = perMonth(p) * seats;
    const pack50 = Math.max(e50.min, Math.ceil(seats / e50.step) * e50.step);
    let alt: { p: Plan; n: number } | null = null;
    if (seats <= e20.seats && perMonth(e20) * e20.seats < orb) alt = { p: e20, n: e20.seats };
    else if (seats > e20.seats && seats <= e50.max && perMonth(e50) * pack50 < orb) alt = { p: e50, n: pack50 };
    if (alt) {
      $('span', tip)!.textContent = 'Com ' + seats + ' pessoas, o pacote ' + alt.p.n + ' custa menos: ' + money(perMonth(alt.p) * alt.n) + ' por mês para ' + alt.n + ' acessos.';
      tipGo.textContent = 'Trocar para ' + alt.p.n;
      coTipPick = alt; tip.hidden = false;
    } else if (seats >= p.max) {
      $('span', tip)!.textContent = 'Mais de 100 pessoas? O plano Constelação monta um ambiente dedicado.';
      tipGo.textContent = 'Falar com vendas';
      coTipPick = 'vendas'; tip.hidden = false;
    }
  } else if (p.seat === 'fixed') {
    $('#seats-label')!.textContent = 'Pessoas no pacote';
    $('#seats-hint')!.textContent = 'Pacote fixo de 20 acessos. Troque as pessoas quando quiser.';
    $('.seat-fixed b')!.textContent = String(p.seats);
  } else if (p.seat === 'range') {
    $('#seats-label')!.textContent = 'Pessoas no pacote';
    $('#seats-hint')!.textContent = 'De ' + p.min + ' a ' + p.max + ' pessoas, em passos de ' + p.step;
    const rw = $('#co-range')!;
    if (!rw.children.length) {
      const h = el('output', 'num co-range-n'); h.id = 'co-rng-out'; h.setAttribute('for', 'co-rng');
      rw.append(h, seatRange('co-rng', p));
      $('#co-rng')!.setAttribute('aria-labelledby', 'seats-label');
    }
    $('#co-rng-out')!.textContent = seats + ' pessoas';
  }

  /* resumo */
  const sub = price * seats * months, disc = anual ? sub * .2 : 0, cup = HALOR.coupon ? (sub - disc) * .1 : 0, total = sub - disc - cup;
  if (p.seat === 'range') paintRange($<HTMLInputElement>('#co-rng')!, seats, money(perMonth(p) * seats));
  $('#sum-name')!.textContent = p.n;
  $('#sum-cycle')!.textContent = free ? 'Grátis para sempre' : anual ? 'Anual · cobrado uma vez por ano' : 'Mensal · renova todo mês';
  const pack = $('#sum-pack')!; pack.hidden = !p.pack;
  if (p.pack) $('span', pack)!.textContent = p.seat === 'range' ? 'Pacote de ' + seats + ' usuários' : p.pack;
  const per = months + (months > 1 ? ' meses' : ' mês');
  $('#sum-l1')!.textContent = free ? 'Plano Faísca' : seats > 1 ? money(price) + ' × ' + seats + ' pessoas × ' + per : 'Plano ' + p.n + ' × ' + per;
  $('#sum-sub')!.textContent = fmtBRL(sub);
  $('#sum-disc-row')!.hidden = !anual || free; $('#sum-disc')!.textContent = '− ' + fmtBRL(disc);
  $('#sum-coupon-row')!.hidden = !HALOR.coupon || free; $('#sum-coupon')!.textContent = '− ' + fmtBRL(cup); $('#sum-coupon-name')!.textContent = 'PRIMEIROOLHAR (10%)';
  $('#coupon')!.hidden = free;
  $('#sum-total')!.textContent = fmtBRL(total);
  $('#co-mini-total')!.textContent = fmtBRL(total);
  const perSeat = seats > 1 ? ', ' + fmtBRL(total / months / seats) + ' por pessoa' : '';
  $('#sum-per')!.textContent = free ? 'nenhuma cobrança' : anual ? 'equivale a ' + fmtBRL(total / 12) + ' por mês' + perSeat : 'cobrado todo mês' + perSeat;
  $('#co-submit')!.textContent = free ? 'Criar conta grátis' : HALOR.pay === 'pix' ? 'Gerar Pix e assinar' : HALOR.pay === 'boleto' ? 'Gerar boleto e assinar' : 'Assinar agora';
  $('#co-sec-pay')!.hidden = free;
  $$('[data-paid]').forEach(f => { f.hidden = free; });
  $('#c-email-l')!.textContent = free ? 'E-mail' : 'E-mail de cobrança';
  $$('[data-trust]').forEach(u => { u.hidden = (u.dataset.trust === 'free') !== free; });
  /* parcelas: só o anual parcela; o mensal é sempre uma cobrança por mês */
  const parc = $<HTMLSelectElement>('#k-parc')!, keep = parc.selectedIndex;
  parc.textContent = '';
  (anual ? [1, 3, 6, 12] : [1]).forEach(n => { const o = el('option', null, n + 'x de ' + fmtBRL(total / n)); o.value = String(n); parc.appendChild(o); });
  parc.selectedIndex = Math.min(Math.max(keep, 0), parc.options.length - 1);
}

function buildPixQR() {
  const q = $('#pix-qr'); if (!q || q.children.length) return;
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const N = 25;
  const finder = (r: number, c: number): boolean | null => {
    const f = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    const inF = f(0, 0) || f(0, N - 7) || f(N - 7, 0); if (!inF) return null;
    const rr = r < 7 ? r : r - (N - 7), cc = c < 7 ? c : c - (N - 7);
    const e = Math.max(Math.abs(rr - 3), Math.abs(cc - 3)); return e === 3 || e <= 1;
  };
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const f = finder(r, c); const i = el('i');
    if (f === true || (f === null && rnd() > .52 && !(r === 7 || c === 7 || r === N - 8 || c === N - 8))) i.className = 'on';
    q.appendChild(i);
  }
}

function paintSteps(done: boolean) {
  $$('.steps li').forEach((li, i) => {
    if (done) { li.className = i < 2 ? 'done' : 'on'; if (i === 2) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); }
    else { li.className = i === 0 ? 'done' : i === 1 ? 'on' : ''; if (i === 1) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); }
  });
}
function resetCheckout() {
  $('#f-checkout')!.hidden = false; $('#co-done')!.hidden = true;
  paintSteps(false);
  renderCheckout(); buildPixQR();
}

/**
 * Liga o checkout. Lê plano, pessoas e ciclo da URL (?plano=…&pessoas=…&ciclo=…).
 * Idempotente; devolve a limpeza.
 */
export function bootCheckout(): () => void {
  const form = $<HTMLFormElement>('#f-checkout');
  if (!form || !$('#co-plans')) return () => {};
  const ac = new AbortController(), o = { signal: ac.signal }, T = timers();
  const on = <K extends keyof HTMLElementEventMap>(n: Element | null, type: K, fn: (e: HTMLElementEventMap[K]) => void) => n?.addEventListener(type, fn as EventListener, o);

  applyCheckoutQuery(location.search);

  /* ciclo, pessoas da faixa e "falar com vendas" (no protótipo eram ouvintes globais) */
  const paintCycle = () => $$('[data-cycle]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cycle === HALOR.cycle)));
  document.addEventListener('click', e => {
    const tg = e.target as Element | null; if (!tg?.closest) return;
    const s = tg.closest('[data-sales]');
    if (s) { e.preventDefault(); toast(SALES_MSG); return; }
    const cy = tg.closest<HTMLElement>('[data-cycle]');
    if (cy) { HALOR.cycle = cy.dataset.cycle as Cycle; paintCycle(); renderCheckout(); }
  }, o);
  document.addEventListener('input', e => {
    const r = (e.target as Element | null)?.closest?.<HTMLInputElement>('[data-ent-range]'); if (!r) return;
    HALOR.entSeats = +r.value;
    renderCheckout();
  }, o);

  /* forma de pagamento */
  const payPanels = (pay: Pay) => {
    $$('[data-pay]').forEach(x => { const sel = x.dataset.pay === pay; x.setAttribute('aria-selected', String(sel)); x.tabIndex = sel ? 0 : -1; });
    $$('[data-pay-panel]').forEach(p => { p.hidden = p.dataset.payPanel !== pay; });
  };
  const pickPay = (b: HTMLElement) => { HALOR.pay = b.dataset.pay as Pay; payPanels(HALOR.pay); renderCheckout(); };
  $$('[data-pay]').forEach(b => on(b, 'click', () => pickPay(b)));
  tabKeys($('.pay-tabs'), pickPay, ac.signal);
  /* para quem é: você e seu time, ou empresas */
  const pickAud = (t: HTMLElement) => { HALOR.plan = coLast[t.dataset.aud as Aud]; renderCheckout(); };
  $$('.co-aud [data-aud]').forEach(t => on(t, 'click', () => pickAud(t)));
  tabKeys($('.co-aud'), pickAud, ac.signal);
  /* grupo de rádio: clique escolhe; setas mudam a escolha e o foco (os botões são remontados, por isso a delegação) */
  const plansBox = $('#co-plans')!;
  on(plansBox, 'click', e => {
    const b = (e.target as Element | null)?.closest?.<HTMLElement>('.co-plan'); if (!b) return;
    pickPlan(b.dataset.plan as PlanId);
  });
  on(plansBox, 'keydown', e => {
    const items = $$('.co-plan', plansBox), i = items.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const j = arrowIndex(e.key, i, items.length);
    if (j == null) return;
    e.preventDefault(); pickPlan(items[j].dataset.plan as PlanId); items[j].focus();
  });
  $$('[data-seat]').forEach(b => on(b, 'click', () => {
    HALOR.seats = Math.max(ORBITA.min, Math.min(ORBITA.max, HALOR.seats + Number(b.dataset.seat)));
    renderCheckout();
  }));
  on($('#co-tip-go'), 'click', () => {
    const pick = coTipPick;
    if (!pick) return;
    if (pick === 'vendas') { toast(SALES_MSG); return; }
    if (pick.p.seat === 'range') HALOR.entSeats = pick.n;
    const n = pick.p.n;
    pickPlan(pick.p.id);
    toast('Pacote ' + n + ' selecionado');
    $('.co-plan[aria-checked="true"]')?.focus();
  });
  on($('#co-mini-go'), 'click', () => { $('#co-sum')?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }); });

  /* cupom: Enter aplica sem enviar o formulário; aplicado, vira "Remover" */
  const cin = $<HTMLInputElement>('#c-cupom')!, cbtn = $<HTMLButtonElement>('#c-cupom-ok')!;
  const paintCoupon = () => { cin.readOnly = HALOR.coupon; cin.classList.toggle('is-ok', HALOR.coupon); cbtn.textContent = HALOR.coupon ? 'Remover' : 'Aplicar'; };
  const applyCoupon = () => {
    if (HALOR.coupon) { HALOR.coupon = false; cin.value = ''; toast('Cupom removido'); paintCoupon(); renderCheckout(); cin.focus(); return; }
    const v = cin.value.trim().toUpperCase();
    if (!v) { toast('Digite um cupom para aplicar'); cin.focus(); return; }
    if (v === 'PRIMEIROOLHAR') { HALOR.coupon = true; cin.value = v; toast('Cupom aplicado: 10% de desconto'); }
    else { toast('Cupom não encontrado. Confira as letras.'); invalid(cin, true); }
    paintCoupon(); renderCheckout();
  };
  on(cbtn, 'click', applyCoupon);
  on(cin, 'keydown', e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } });
  on(cin, 'input', () => invalid(cin, false));
  if (HALOR.coupon) cin.value = 'PRIMEIROOLHAR';
  paintCoupon();

  /* cartão ao vivo */
  const num = $<HTMLInputElement>('#k-num')!, exp = $<HTMLInputElement>('#k-exp')!, nm = $<HTMLInputElement>('#k-name')!, cvv = $<HTMLInputElement>('#k-cvv')!;
  const cc = $('#cc')!;
  on(num, 'input', () => {
    const d = num.value.replace(/\D/g, '').slice(0, 16); num.value = d.replace(/(.{4})/g, '$1 ').trim();
    $('#cc-num')!.textContent = (d + '•'.repeat(16 - d.length)).replace(/(.{4})/g, '$1 ').trim();
    $('#cc-brand')!.textContent = /^(4011|4312|4389|5041|6277|6362|6363|6504|6505|6516)/.test(d) ? 'ELO' : /^4/.test(d) ? 'VISA' : /^5[1-5]/.test(d) ? 'MASTERCARD' : /^3[47]/.test(d) ? 'AMEX' : 'CARTÃO';
    invalid(num, false);
  });
  on(exp, 'input', () => { const d = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; $('#cc-exp')!.textContent = exp.value || 'MM/AA'; invalid(exp, false); });
  on(cvv, 'input', () => { cvv.value = cvv.value.replace(/\D/g, '').slice(0, 4); invalid(cvv, false); });
  on(nm, 'input', () => { $('#cc-name')!.textContent = (nm.value || 'Seu nome').toUpperCase(); });
  on(cvv, 'focus', () => { cc.style.transform = 'rotateY(8deg) scale(.98)'; });
  on(cvv, 'blur', () => { cc.style.transform = ''; });
  const cNome = $<HTMLInputElement>('#c-nome')!, cEmail = $<HTMLInputElement>('#c-email')!, cDoc = $<HTMLInputElement>('#c-doc')!, cCep = $<HTMLInputElement>('#c-cep')!;
  [cNome, cEmail, cDoc, cCep].forEach(i => on(i, 'input', () => invalid(i, false)));
  /* máscaras leves de CPF/CNPJ e CEP */
  on(cDoc, 'input', () => {
    const d = cDoc.value.replace(/\D/g, '').slice(0, 14);
    cDoc.value = d.length <= 11 ? d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      : d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  });
  on(cCep, 'input', () => { const d = cCep.value.replace(/\D/g, '').slice(0, 8); cCep.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; });

  const stop = (input: HTMLInputElement, msg: string) => { invalid(input, true); input.focus(); toast(msg); };
  on(form, 'submit', e => {
    e.preventDefault();
    const p = planById(HALOR.plan)!, paid = (p.m ?? 0) > 0;
    if (!cNome.value.trim()) return stop(cNome, 'Digite o seu nome completo');
    if (!EMAIL_RE.test(cEmail.value.trim())) return stop(cEmail, 'Digite um e-mail válido');
    if (paid) {
      const doc = cDoc.value.replace(/\D/g, '').length;
      if (doc !== 11 && doc !== 14) return stop(cDoc, 'Confira o CPF (11 dígitos) ou o CNPJ (14 dígitos)');
      if (cCep.value.replace(/\D/g, '').length !== 8) return stop(cCep, 'O CEP tem 8 dígitos');
    }
    if (paid && HALOR.pay === 'cartao') {
      if (num.value.replace(/\D/g, '').length < 13) return stop(num, 'Confira o número do cartão');
      const m = exp.value.match(/^(0[1-9]|1[0-2])\/(\d\d)$/);
      if (!m) return stop(exp, 'Validade no formato MM/AA');
      const now = new Date(), yy = now.getFullYear() % 100, mm = now.getMonth() + 1;
      if (+m[2] < yy || (+m[2] === yy && +m[1] < mm)) return stop(exp, 'Este cartão já venceu. Confira a validade');
      if (cvv.value.length < 3) return stop(cvv, 'O CVV tem 3 ou 4 dígitos');
    }
    const b = $<HTMLButtonElement>('#co-submit')!; b.disabled = true; b.textContent = 'Confirmando…';
    T.set(() => {
      b.disabled = false;
      const s = seatsOf(p), mail = cEmail.value.trim(), team = s > 1;
      const kind = p.pack ? 'pacote ' : 'plano ';
      const after = HALOR.pay === 'boleto' ? ' O boleto foi para ' + mail + ' e a conta já está liberada enquanto ele compensa.'
        : HALOR.pay === 'pix' ? ' Pix confirmado. Mandamos o recibo para ' + mail + '.'
        : ' Mandamos o recibo para ' + mail + '.';
      $('#done-msg')!.textContent = !paid ? 'Sua conta Faísca está pronta. Comece pela primeira apresentação.'
        : 'Seu ' + kind + p.n + ' está ativo' + (team ? ' para ' + s + ' pessoas' : '') + '.' + after + (team ? ' Agora é só convidar o time.' : '');
      $('#done-eyebrow')!.textContent = paid ? 'Assinatura ativa' : 'Conta criada';
      $('#co-invite')!.hidden = !team || !paid;
      form.hidden = true; $('#co-done')!.hidden = false;
      paintSteps(true);
      toTop();
      $('#done-title')?.focus({ preventScroll: true });
    }, 1100);
  });
  on($('#co-again'), 'click', resetCheckout);

  /* ao entrar na tela: estado da memória e da URL aplicado à marcação */
  paintCycle();
  payPanels(HALOR.pay);
  resetCheckout();

  return () => { ac.abort(); T.clear(); };
}
