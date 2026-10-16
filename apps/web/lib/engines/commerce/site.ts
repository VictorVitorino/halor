/* ==========================================================================
   PLANOS DO SITE · cartões de plano, pacotes empresariais com controle de
   pessoas, ciclo de cobrança e o caminho até o checkout.
   Porte de renderPlans/renderEnterprise/updateEnterprise e dos ouvintes
   globais de prototype/src/js/30-site.js.
   ========================================================================== */
import { $, $$, el, toast } from '../../core';
import {
  ENTERPRISE, HALOR, PLANS, SALES_MSG, CHECKOUT_PATH, checkoutHref, featList, icon, monthly, money,
  paintRange, planById, planCta, priceBlock, seatRange, seatsOf, type Cycle,
} from './plans';

function renderPlans() {
  const box = $('#plans'); if (!box) return;
  box.textContent = '';
  PLANS.forEach(p => {
    const c = el('article', 'plan' + (p.hot ? ' hot' : ''));
    if (p.hot) { const f = el('div', 'plan-flag'); f.appendChild(el('span', 'chip', 'Mais escolhido')); c.appendChild(f); }
    const nm = el('h3', 'plan-name'); nm.append(icon(p.ic), document.createTextNode(p.n)); c.appendChild(nm);
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
  const act = document.activeElement;
  const keepFocus = act && box.contains(act) ? act.id : null;
  box.textContent = '';
  ENTERPRISE.forEach(p => {
    const c = el('article', 'ent-card' + (p.hot ? ' hot' : '')); c.dataset.plan = p.id;
    c.setAttribute('aria-labelledby', 'ent-n-' + p.id);
    if (p.flag) { const f = el('div', 'plan-flag'); f.appendChild(el('span', 'chip', p.flag)); c.appendChild(f); }
    const head = el('div', 'ent-card-h');
    const nm = el('h4', 'plan-name'); nm.id = 'ent-n-' + p.id; nm.append(icon(p.ic), document.createTextNode(p.n));
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
      for (let i = 0; i < p.seats; i++) { const d = el('i'); d.style.setProperty('--i', String(i)); dots.appendChild(d); }
      seats.append(sh, dots, el('p', 'ent-seats-note', 'Acessos fixos. Troque as pessoas quando quiser.'));
    } else if (p.seat === 'range') {
      const lb = el('label', 'label', 'Pessoas no pacote'); lb.htmlFor = 'ent-rng';
      const out = el('output', 'num ent-seat-n'); out.setAttribute('for', 'ent-rng'); out.id = 'ent-rng-out';
      sh.append(lb, out);
      seats.append(sh, seatRange('ent-rng', p), el('p', 'ent-seats-note', 'Arraste para escolher, de ' + p.step + ' em ' + p.step + ' pessoas.'));
    }
    c.appendChild(seats);

    const cta = el('div', 'ent-cta');
    const go = planCta(p, 'btn ' + (p.hot ? 'btn-primary' : 'btn-ghost'));
    go.textContent = p.cta + ' ';
    go.appendChild(icon('#i-arrow'));
    /* leitor de tela: os dois cartões têm os mesmos rótulos, o nome do pacote desfaz a dúvida */
    go.setAttribute('aria-label', p.cta + ' ' + p.n);
    const talk = el('button', 'btn btn-quiet', 'Falar com vendas'); talk.type = 'button'; talk.dataset.sales = '';
    talk.setAttribute('aria-label', 'Falar com vendas sobre o ' + p.n);
    cta.append(go, talk);
    c.appendChild(cta);
    box.appendChild(c);
  });
  updateEnterprise();
  if (keepFocus) document.getElementById(keepFocus)?.focus();
}

function updateEnterprise() {
  const anual = HALOR.cycle === 'anual';
  ENTERPRISE.forEach(p => {
    const c = $('.ent-card[data-plan="' + p.id + '"]'); if (!c) return;
    const s = seatsOf(p), tot = (monthly(p) ?? 0) * s;
    $('.ent-total-v b', c)!.textContent = money(tot);
    $('.ent-total small', c)!.textContent = anual ? money(tot * 12) + ' por ano, para ' + s + ' pessoas' : 'Para ' + s + ' pessoas, cobrança mensal';
    const r = $<HTMLInputElement>('input[type="range"]', c);
    if (r) { paintRange(r, s, money(tot)); $('output', c)!.textContent = String(s); }
    /* o link do pacote leva o número de pessoas escolhido */
    const go = $<HTMLAnchorElement>('a[data-plan]', c);
    if (go) go.href = checkoutHref(p);
  });
}

const isCheckoutLink = (a: HTMLAnchorElement) => {
  try {
    const u = new URL(a.href, location.href);
    return u.origin === location.origin && u.pathname.replace(/\/+$/, '') + '/' === CHECKOUT_PATH;
  } catch { return false; }
};

/**
 * Liga os planos do site. `go` navega sem recarregar (o roteador do Next), usado pelos
 * botões dos cartões de plano num clique simples. Idempotente; devolve a limpeza.
 */
export function bootPlanos(go?: (href: string) => void): () => void {
  if (!$('#plans')) return () => {};
  const ac = new AbortController(), o = { signal: ac.signal };

  const paintCycle = () => $$('[data-cycle]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.cycle === HALOR.cycle)));
  paintCycle();
  renderPlans();

  document.addEventListener('input', e => {
    const r = (e.target as Element | null)?.closest?.<HTMLInputElement>('[data-ent-range]'); if (!r) return;
    HALOR.entSeats = +r.value;
    updateEnterprise();
  }, o);

  document.addEventListener('click', e => {
    const tg = e.target as Element | null; if (!tg?.closest) return;
    const s = tg.closest('[data-sales]');
    if (s) { e.preventDefault(); toast(SALES_MSG); return; }
    const cy = tg.closest<HTMLElement>('[data-cycle]');
    if (cy) { HALOR.cycle = cy.dataset.cycle as Cycle; paintCycle(); renderPlans(); }
  }, o);

  /* Navegação para o checkout: o link diz qual plano chega pré-selecionado, com o ciclo
     e as pessoas escolhidos aqui. Botões "Começar grátis" sem plano explícito levam ao Faísca.
     O estado fica na memória (vale para links do next/link, que navegam sem recarregar, e o
     checkout então escreve o plano na URL) e o href é reescrito antes da navegação, para
     links comuns e para abrir em outra aba. */
  const toCheckout = (e: Event) => {
    const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]');
    if (!a || !isCheckoutLink(a)) return;
    const id = a.dataset.plan || (/grátis/i.test(a.textContent || '') ? 'faisca' : null);
    const p = planById(id);
    if (e.type === 'click' && p && p.m != null) HALOR.plan = p.id;
    a.href = checkoutHref(p);
    /* os botões dos cartões (criados aqui) navegam como o next/link num clique simples */
    const me = e as MouseEvent;
    if (go && e.type === 'click' && !e.defaultPrevented && me.button === 0 && !me.metaKey && !me.ctrlKey && !me.shiftKey && !me.altKey
      && a.closest('#plans, #ent-plans') && (!a.target || a.target === '_self')) {
      e.preventDefault();
      go(a.pathname + a.search);
    }
  };
  for (const t of ['pointerdown', 'click', 'auxclick', 'contextmenu']) document.addEventListener(t, toCheckout, { capture: true, signal: ac.signal });

  return () => ac.abort();
}
