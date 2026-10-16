/* ==========================================================================
   COMÉRCIO · planos, estado da assinatura e peças de interface compartilhadas
   entre a seção de planos do site e o checkout.
   Porte da parte de planos de prototype/src/js/30-site.js.
   Nada aqui toca em window ou document no carregamento do módulo: as funções
   que montam DOM só rodam dentro dos motores, já no navegador.
   ========================================================================== */
import { $$, el, fmtBRL, svgEl } from '../../core';

export type Cycle = 'anual' | 'mensal';
export type Pay = 'pix' | 'cartao' | 'boleto';
export type PlanId = 'faisca' | 'halo' | 'orbita' | 'constelacao' | 'empresa20' | 'empresa50';

interface PlanInfo {
  id: PlanId;
  /** nome à vista */
  n: string;
  /** ícone do sprite (href do <use>) */
  ic: string;
  /** descrição curta */
  d: string;
  /** preço mensal cheio, por pessoa quando `per` existe; null = sob consulta; 0 = grátis */
  m: number | null;
  cta: string;
  f: string[];
  hot?: boolean;
  flag?: string;
  /** nome do pacote empresarial */
  pack?: string;
  per?: 'pessoa';
}
/** Como o número de pessoas é escolhido: stepper livre, pacote fixo ou faixa com controle deslizante. */
type SeatRule =
  | { seat?: undefined }
  | { seat: 'stepper'; min: number; max: number }
  | { seat: 'fixed'; seats: number }
  | { seat: 'range'; min: number; max: number; step: number };
export type Plan = PlanInfo & SeatRule;
export type SeatMode = NonNullable<Plan['seat']>;

/** Estado da assinatura. Vive na memória da sessão, como no protótipo; a URL do checkout o sobrescreve. */
export interface CommerceState {
  cycle: Cycle;
  plan: PlanId;
  /** pessoas no plano Órbita (stepper) */
  seats: number;
  /** pessoas no pacote Empresa 50 a 100 (faixa) */
  entSeats: number;
  coupon: boolean;
  pay: Pay;
}
export const HALOR: CommerceState = { cycle: 'anual', plan: 'halo', seats: 5, entSeats: 50, coupon: false, pay: 'pix' };

/* Planos ----------------------------------------------------------------- */
const FAISCA = { id: 'faisca', n: 'Faísca', ic: '#i-spark', d: 'Para conhecer a luz, sem pagar nada.', m: 0, cta: 'Começar grátis', f: ['3 apresentações ativas', 'Modelos essenciais', 'Exporta PDF', 'Painel Halor com 7 dias de histórico'] } satisfies Plan;
const HALO = { id: 'halo', n: 'Halo', ic: '#hl-mark', hot: true, d: 'Para quem apresenta e quer ser lembrado.', m: 69, cta: 'Assinar Halo', f: ['Apresentações ilimitadas', 'Exporta em todos os formatos', 'Raio Halor: 50 análises por mês', 'Links medidos e Painel completo', 'Sem marca d’água'] } satisfies Plan;
export const ORBITA = { id: 'orbita', n: 'Órbita', ic: '#i-target', d: 'Para times que apresentam juntos.', m: 49, per: 'pessoa', seat: 'stepper', min: 3, max: 100, cta: 'Assinar Órbita', f: ['Tudo do plano Halo', 'Kit de marca travado', 'Biblioteca do time e aprovações', 'Integração com CRM', 'Relatórios por pessoa'] } satisfies Plan;
const CONSTELACAO = { id: 'constelacao', n: 'Constelação', ic: '#i-share', d: 'Para empresas com mais de 100 pessoas.', m: null, cta: 'Falar com vendas', f: ['Mais de 100 pessoas, sem teto', 'Tudo do Empresa 50 a 100', 'Auditoria e retenção de dados', 'Ambiente dedicado', 'Suporte com SLA'] } satisfies Plan;
export const EMPRESA20 = { id: 'empresa20', n: 'Empresa 20', ic: '#i-users', pack: 'Pacote de 20 usuários', d: 'Para uma área inteira que apresenta junta e quer prender a atenção em toda reunião.', m: 39, per: 'pessoa', seat: 'fixed', seats: 20, cta: 'Assinar pacote', f: ['Tudo do plano Órbita', '20 acessos com troca livre de pessoas', 'Painel do administrador', 'Kit de marca por área', 'Onboarding guiado do time', 'Suporte prioritário'] } satisfies Plan;
export const EMPRESA50 = { id: 'empresa50', n: 'Empresa 50 a 100', ic: '#i-layers', pack: 'Pacote de 50 a 100 usuários', hot: true, flag: 'Menor preço por pessoa', d: 'Para empresas em que várias áreas apresentam toda semana, do treinamento à reunião de resultados.', m: 32, per: 'pessoa', seat: 'range', min: 50, max: 100, step: 10, cta: 'Assinar pacote', f: ['Tudo do Empresa 20', 'SSO e gestão de papéis', 'Vários kits de marca', 'Implantação e treinamento ao vivo', 'Gerente de sucesso dedicado'] } satisfies Plan;

export const PLANS: readonly Plan[] = [FAISCA, HALO, ORBITA, CONSTELACAO];
export const ENTERPRISE: readonly Plan[] = [EMPRESA20, EMPRESA50];

export const planById = (id: string | null | undefined): Plan | undefined =>
  id ? PLANS.find(x => x.id === id) || ENTERPRISE.find(x => x.id === id) : undefined;
export const seatsOf = (p: Plan): number =>
  p.seat === 'fixed' ? p.seats : p.seat === 'range' ? HALOR.entSeats : p.seat === 'stepper' ? HALOR.seats : 1;
export const monthly = (p: Plan): number | null => p.m == null ? null : (HALOR.cycle === 'anual' ? p.m * .8 : p.m);
export const money = (v: number) => fmtBRL(v).replace(',00', '');

/** <svg aria-hidden="true"><use href="…"/></svg>, igual ao iconUse do protótipo. */
export function icon(href: string): SVGSVGElement {
  const s = svgEl('svg', { 'aria-hidden': 'true' });
  s.appendChild(svgEl('use', { href }));
  return s;
}

/* Pessoas: limites e arredondamento para quando o número chega pela URL */
const clampInt = (v: number, a: number, b: number) => Math.max(a, Math.min(b, Math.round(v)));
export function setSeatsFor(p: Plan, n: number) {
  if (!Number.isFinite(n)) return;
  if (p.seat === 'stepper') HALOR.seats = clampInt(n, p.min, p.max);
  else if (p.seat === 'range') HALOR.entSeats = clampInt(Math.round((n - p.min) / p.step) * p.step + p.min, p.min, p.max);
}

/* Caminho entre o site e o checkout: a URL leva plano, pessoas e ciclo -------- */
export const CHECKOUT_PATH = '/assinar/';
/** ?plano=…&pessoas=…&ciclo=… a partir do estado (e do plano pedido, se houver). */
export function checkoutQuery(p: Plan | undefined = planById(HALOR.plan)): string {
  const q = new URLSearchParams();
  if (p && p.m != null) {
    q.set('plano', p.id);
    if (p.seat === 'stepper' || p.seat === 'range') q.set('pessoas', String(seatsOf(p)));
  }
  q.set('ciclo', HALOR.cycle);
  return '?' + q.toString();
}
/** Monta /assinar/?plano=…&pessoas=…&ciclo=… */
export const checkoutHref = (p?: Plan) => CHECKOUT_PATH + checkoutQuery(p);
/** Lê a URL do checkout e aplica ao estado. Parâmetros inválidos são ignorados. */
export function applyCheckoutQuery(search: string) {
  const q = new URLSearchParams(search);
  const c = q.get('ciclo');
  if (c === 'anual' || c === 'mensal') HALOR.cycle = c;
  const p = planById(q.get('plano'));
  if (p && p.m != null) HALOR.plan = p.id;
  const n = q.get('pessoas');
  if (n != null && n.trim() !== '') { const tgt = p || planById(HALOR.plan); if (tgt) setSeatsFor(tgt, Number(n)); }
}

/* Peças de interface ------------------------------------------------------ */
/** Bloco de preço: linha do preço cheio (reservada mesmo vazia para alinhar), valor e nota. */
export function priceBlock(p: Plan): HTMLDivElement {
  const anual = HALOR.cycle === 'anual', v = monthly(p);
  const pr = el('div', 'plan-price');
  const was = el('p', 'pp-was'), row = el('p', 'pp-row'), note = el('p', 'pp-note');
  if (v == null || p.m == null) { row.appendChild(el('b', 'pp-ask', 'Sob consulta')); note.textContent = 'Proposta sob medida para a empresa'; }
  else if (v === 0) { row.append(el('b', null, 'R$ 0')); note.textContent = 'Grátis para sempre'; }
  else {
    if (anual) was.append(el('span', 'sr-only', 'De '), el('s', null, money(p.m)), el('span', 'sr-only', ' por'));
    row.append(el('b', 'num', money(v)), el('span', null, p.per ? '/pessoa/mês' : '/mês'));
    if (p.seat === 'stepper') note.textContent = 'A partir de ' + p.min + ' pessoas';
    else if (p.seat) note.textContent = Math.round((1 - p.m / ORBITA.m) * 100) + '% abaixo do Órbita, por pessoa';
    else note.textContent = anual ? money(v * 12) + ' cobrados por ano' : 'Cobrado todo mês';
  }
  pr.append(was, row, note);
  return pr;
}
export function featList(items: readonly string[], cls?: string): HTMLUListElement {
  const ul = el('ul', cls || null);
  items.forEach(t => { const li = el('li'); li.append(icon('#i-check'), document.createTextNode(t)); ul.appendChild(li); });
  return ul;
}
export function planCta(p: Plan, cls: string): HTMLAnchorElement | HTMLButtonElement {
  if (p.m == null) { const b = el('button', cls, p.cta); b.type = 'button'; b.dataset.sales = ''; return b; }
  const a = el('a', cls, p.cta); a.href = checkoutHref(p); a.dataset.plan = p.id; return a;
}

/** Controle deslizante de pessoas (site e checkout usam o mesmo). */
export function seatRange(id: string, p: Plan & { seat: 'range' }): HTMLDivElement {
  const w = el('div', 'rng-wrap');
  const r = el('input', 'rng'); r.type = 'range'; r.id = id;
  r.min = String(p.min); r.max = String(p.max); r.step = String(p.step); r.value = String(HALOR.entSeats);
  r.dataset.entRange = '';
  const ticks = el('div', 'rng-ticks'); ticks.setAttribute('aria-hidden', 'true');
  const n = (p.max - p.min) / p.step;
  for (let i = 0; i <= n; i++) { const t = el('span', null, String(p.min + i * p.step)); t.style.setProperty('--k', String(i / n)); ticks.appendChild(t); }
  w.append(r, ticks);
  return w;
}
export function paintRange(r: HTMLInputElement, v: number, total?: string) {
  const min = +r.min, max = +r.max;
  r.value = String(v);
  r.style.setProperty('--fill', ((v - min) / (max - min) * 100) + '%');
  r.setAttribute('aria-valuetext', v + ' pessoas' + (total ? ', total de ' + total + ' por mês' : ''));
  const w = r.closest('.rng-wrap');
  if (w) $$('.rng-ticks span', w).forEach(t => t.classList.toggle('on', Number(t.textContent) === v));
}

/* Comportamentos comuns ---------------------------------------------------- */
export const SALES_MSG = 'Pedido recebido. Nosso time fala com você em até 1 dia útil.';
/** Marca o campo inválido e liga a mensagem a ele. */
export function invalid(input: Element | null | undefined, on: boolean) { if (input) input.setAttribute('aria-invalid', String(!!on)); }
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Topo imediato: o html rola suave, e sem isso a troca de tela desliza. */
export const toTop = () => { try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch { window.scrollTo(0, 0); } };

/** Abas com setas do teclado (WAI-ARIA: a aba ativa é a única na ordem de tabulação). */
export function tabKeys(list: HTMLElement | null, onPick: (tab: HTMLElement) => void, signal: AbortSignal) {
  if (!list) return;
  list.addEventListener('keydown', e => {
    const tabs = $$('[role="tab"]', list), i = tabs.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const j = arrowIndex(e.key, i, tabs.length);
    if (j == null) return;
    e.preventDefault(); onPick(tabs[j]); tabs[j].focus();
  }, { signal });
}
/** Índice de destino para setas, Home e End num grupo circular. */
export function arrowIndex(key: string, i: number, len: number): number | null {
  const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[key];
  if (step) return (i + step + len) % len;
  if (key === 'Home') return 0;
  if (key === 'End') return len - 1;
  return null;
}

/** Pilha de temporizadores de um motor, para limpar tudo ao desligar. */
export function timers() {
  const ids = new Set<ReturnType<typeof setTimeout>>();
  return {
    set(fn: () => void, ms: number) { const id = setTimeout(() => { ids.delete(id); fn(); }, ms); ids.add(id); return id; },
    clear() { ids.forEach(clearTimeout); ids.clear(); },
  };
}
