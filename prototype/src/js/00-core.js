/* ==========================================================================
   Núcleo · utilitários, roteador por hash, modais, toast, cópia
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmtBRL = v => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtNum = (v, d = 0) => v.toFixed(d).replace('.', ',');
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const svgEl = (tag, attrs = {}) => { const n = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };

/* Toast */
let toastT;
function toast(msg) {
  const t = $('#toast'); if (!t) return;
  $('span', t).textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* Copiar (com recuo para execCommand e, por fim, para seleção do texto).
   label é opcional: a mensagem do toast quando a cópia dá certo. */
function copyText(text, node, label) {
  const done = () => toast(label || 'Copiado');
  const legacy = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove(); return ok;
  };
  const fallback = () => {
    if (legacy()) return done();
    if (!node) return toast('Não deu para copiar aqui. Selecione o texto e use Ctrl+C');
    const r = document.createRange(); r.selectNodeContents(node);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    toast('Texto selecionado. Use Ctrl+C');
  };
  try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
}
document.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]');
  if (c) { const n = $(c.dataset.copy); if (n) copyText(n.textContent, n); }
  const ct = e.target.closest('[data-copy-text]');
  if (ct) copyText(ct.dataset.copyText, null, ct.dataset.copyLabel);
  const tt = e.target.closest('[data-toast]');
  if (tt) toast(tt.dataset.toast);
});

/* Modais */
let lastFocus = null;
function openModal(id) {
  const m = document.getElementById(id); if (!m) return;
  lastFocus = document.activeElement;
  m.hidden = false;
  const f = m.querySelector('input, button:not([data-close]), a[href]') || m.querySelector('button');
  setTimeout(() => f && f.focus(), 30);
}
function closeModal(m) { m.hidden = true; if (lastFocus) lastFocus.focus(); }
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]');
  if (o) { e.preventDefault(); openModal(o.dataset.open); }
  const c = e.target.closest('[data-close]');
  if (c) { const m = c.closest('.modal'); if (m) closeModal(m); }
});
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
document.addEventListener('keydown', e => {
  const m = $$('.modal').find(x => !x.hidden); if (!m) return;
  if (e.key === 'Escape') { e.preventDefault(); closeModal(m); return; }
  /* foco preso dentro do modal aberto */
  if (e.key === 'Tab') {
    const f = $$(FOCUSABLE, m).filter(n => n.offsetParent !== null && !n.closest('.sr-only'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !m.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !m.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  }
});

/* Mostrar/ocultar senha */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-reveal]'); if (!b) return;
  const inp = document.getElementById(b.dataset.reveal);
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  b.setAttribute('aria-pressed', String(show));
  b.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  $('use', b).setAttribute('href', show ? '#i-eye-off' : '#i-eye');
});

/* Roteador ---------------------------------------------------------------- */
const ROUTES = {
  site: { view: 'v-site' },
  entrar: { view: 'v-auth' },
  assinar: { view: 'v-checkout' },
  estudio: { view: 'v-studio', sub: 'inicio' },
  editor: { view: 'v-studio', sub: 'editor' },
  painel: { view: 'v-studio', sub: 'painel' },
  apresentar: { view: 'v-studio', sub: 'apresentar' },
  admin: { view: 'v-studio', sub: 'admin' },
  marca: { view: 'v-brand' },
  '404': { view: 'v-404' }
};
const viewHooks = {};   // id da view -> função chamada ao mostrar
const subHooks = {};    // sub-tela do estúdio -> função
let currentView = null;
let protoT = 0;

function showView(id) {
  if (currentView === id) return;
  $$('.view').forEach(v => { v.hidden = v.id !== id; });
  currentView = id;
  document.dispatchEvent(new CustomEvent('halor:view', { detail: id }));
  if (viewHooks[id]) viewHooks[id]();
}
function showSub(sub) {
  $$('#v-studio .sub').forEach(s => { s.hidden = s.dataset.subview !== sub; });
  $$('#v-studio .side-nav a[data-sub]').forEach(a => { if (a.dataset.sub === sub) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#side')?.classList.remove('open');
  $('#side-toggle')?.setAttribute('aria-expanded', 'false');
  if (subHooks[sub]) subHooks[sub]();
}
function route() {
  const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
  const key = raw || 'site';
  let r = ROUTES[key];
  let target = null;
  if (!r) {
    target = document.getElementById(key);
    const v = target && target.closest('.view');
    if (v) r = { view: v.id, anchor: true };
    else r = ROUTES['404'];
  }
  showView(r.view);
  if (r.sub) showSub(r.sub);
  const routeKey = r.anchor ? (r.view === 'v-site' ? 'site' : r.view === 'v-brand' ? 'marca' : '') : (ROUTES[key] ? key : '');
  $$('.proto a').forEach(a => { if (a.dataset.route === routeKey) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  /* barra do protótipo: mantém a tela atual à vista quando ela rola na horizontal */
  const pa = $('.proto a[aria-current="page"]'), pb = pa && pa.parentElement;
  if (pb && pb.scrollWidth > pb.clientWidth) {
    const l = pa.offsetLeft, r = l + pa.offsetWidth;
    if (l < pb.scrollLeft) pb.scrollLeft = l - 8; else if (r > pb.scrollLeft + pb.clientWidth) pb.scrollLeft = r - pb.clientWidth + 8;
  }
  /* no editor a barra do protótipo recolhe depois de um instante (o CSS decide em que telas isso vale) */
  const proto = $('.proto');
  if (proto) { clearTimeout(protoT); if (r.sub === 'editor') protoT = setTimeout(() => proto.classList.add('peek'), 1200); else proto.classList.remove('peek'); }
  if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }));
  else window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* "Pular para o conteúdo": fora do site, leva ao conteúdo da tela atual em vez de trocar de tela */
document.addEventListener('click', e => {
  const s = e.target.closest('a.skip'); if (!s) return;
  const v = currentView && document.getElementById(currentView); if (!v || v.contains(document.getElementById('conteudo'))) return;
  const shown = (q, r) => $$(q, r).find(n => n.getClientRects().length);
  const sub = $$('.sub', v).find(x => !x.hidden);
  const t = (sub && (shown('[data-skip]', sub) || shown('h1, h2', sub) || sub)) || shown('[data-skip]', v) || shown('main, h1', v) || v;
  e.preventDefault();
  if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
  t.focus({ preventScroll: true });
  /* só rola quando o destino não está à vista (o CSS dá a folga da barra fixa com scroll-margin) */
  const tr = t.getBoundingClientRect();
  if (tr.top < 72 || tr.top > innerHeight * .6) t.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' });
});

/* Rolagem: barra do site ganha fundo */
window.addEventListener('scroll', () => {
  const n = $('#s-nav'); if (n) n.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });
