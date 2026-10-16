/* ==========================================================================
   Estúdio · Administração: pessoas, papéis, convites, auditoria, configurações e resumo.
   Porte de prototype/src/js/50-studio.js; bootAdmin() é o subHooks.admin (renderAdmin)
   do protótipo, refeito a cada montagem de /admin sobre os dados da sessão.
   ========================================================================== */
import { $, $$, el, toast } from '@/lib/core';
import { bootFields } from '@/lib/engines/particles';
import { closePop, menuFill, openPop, rovingTabs, type MenuItem } from './pop';
import { AUDIT, CONFIG, PEOPLE, STATUS_CHIP, STUDIO, type AdmTab, type Person } from './store';
import { EMAIL_RE, invalid, makeScope } from './util';

function admCounts() {
  /* a tabela mostra uma amostra do time de 21 pessoas: os totais partem da base e acompanham as mudanças */
  $('#adm-n-active')!.textContent = String(14 + PEOPLE.filter(p => p.st === 'ativo').length);
  $('#adm-n-pending')!.textContent = String(2 + PEOPLE.filter(p => p.st === 'convite').length);
}
function admRows() {
  const tb = $('#adm-rows'); if (!tb) return; tb.textContent = '';
  const heads = ['Pessoa', 'Papel', 'Status', 'Último acesso', 'Índice médio', ''];
  PEOPLE.forEach(p => {
    const tr = el('tr');
    const who = el('td', 'td-who'); const w = el('div', 'who');
    const av = el('span', 'avatar av-sm ' + p.av, p.n.split(' ').map(x => x[0]).join('')); av.setAttribute('aria-hidden', 'true');
    const d = el('div'); d.append(el('b', null, p.n), el('span', null, p.m)); w.append(av, d); who.appendChild(w);
    const st = el('td'); const [cc, ct] = STATUS_CHIP[p.st]; st.appendChild(el('span', 'chip ' + cc, ct));
    const act = el('td', 'r td-act'); const b = el('button', 'btn-icon'); b.type = 'button';
    b.setAttribute('aria-label', 'Ações para ' + p.n); b.setAttribute('aria-haspopup', 'menu'); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<svg aria-hidden="true"><use href="#i-dots"/></svg>';
    b.addEventListener('click', () => openPop(b, menuFill(admActions(p)), { align: 'right', label: 'Ações para ' + p.n })); act.appendChild(b);
    tr.append(who, el('td', null, p.role), st, el('td', null, p.last), el('td', 'r', p.idx == null ? 'sem dados' : String(p.idx)), act);
    Array.from(tr.children).forEach((c, i) => { if (heads[i]) (c as HTMLElement).dataset.l = heads[i]; });
    tb.appendChild(tr);
  });
  admCounts(); admPending();
}
function admActions(p: Person): MenuItem[] {
  const me = p.n === 'Marina Costa', items: MenuItem[] = [];
  if (p.st === 'convite') items.push({ t: 'Reenviar convite', ic: '#i-mail', act: () => toast('Convite reenviado para ' + p.m) });
  if (p.st !== 'convite') items.push(p.role === 'Admin'
    ? { t: 'Tornar membro', ic: '#i-users', off: me, act: () => { p.role = 'Membro'; admRows(); toast(p.n + ' agora é membro'); } }
    : { t: 'Tornar admin do time', ic: '#i-shield', act: () => { p.role = 'Admin'; admRows(); toast(p.n + ' agora administra o time'); } });
  if (p.st === 'ativo') items.push({ t: 'Suspender acesso', ic: '#i-lock', off: me, act: () => { p.st = 'suspenso'; admRows(); toast('Acesso de ' + p.n + ' suspenso'); } });
  if (p.st === 'suspenso') items.push({ t: 'Reativar acesso', ic: '#i-check', act: () => { p.st = 'ativo'; p.last = 'agora'; admRows(); toast('Acesso de ' + p.n + ' reativado'); } });
  items.push('-', { t: p.st === 'convite' ? 'Cancelar convite' : 'Remover do time', ic: '#i-trash', danger: true, off: me, act: () => { PEOPLE.splice(PEOPLE.indexOf(p), 1); admRows(); toast(p.n + (p.st === 'convite' ? ': convite cancelado' : ' saiu do time')); } });
  if (me) items.push({ h: 'Você é a dona da conta' });
  return items;
}
function admPending() {
  const ul = $('#adm-pending'); if (!ul) return; ul.textContent = '';
  const pend = PEOPLE.filter(p => p.st === 'convite');
  if (!pend.length) { ul.appendChild(el('li', 'adm-empty', 'Nenhum convite esperando resposta.')); return; }
  pend.forEach(p => {
    const li = el('li'); const d = el('div'); d.append(el('b', null, p.m), el('span', 'muted', p.role + ' · enviado ' + (p.sent || 'ontem')));
    const b = el('button', 'btn btn-quiet btn-xs', 'Reenviar'); b.type = 'button'; b.addEventListener('click', () => toast('Convite reenviado para ' + p.m));
    li.append(d, b); ul.appendChild(li);
  });
}

/** Liga a administração (ao montar /admin) e devolve a limpeza. */
export function bootAdmin(): () => void {
  const sub = $('[data-subview="admin"]'); if (!sub || !$('#adm-rows')) return () => {};
  const S = makeScope(), o = S.o;
  admRows();
  const log = $('#adm-log')!; log.textContent = '';
  AUDIT.forEach(([ic, t, w]) => {
    const li = el('li'); li.innerHTML = `<span class="al-ic"><svg aria-hidden="true"><use href="${ic}"/></svg></span>`;
    const d = el('div'); const p = el('p'); p.innerHTML = t; d.append(p, el('small', null, w)); li.appendChild(d); log.appendChild(li);
  });
  const cfg = $('#adm-cfg')!; cfg.textContent = '';
  CONFIG.forEach((row, i) => {
    const [n, d, on] = row;
    const li = el('li'); const tx = el('div'); const lb = el('label', null, n); lb.htmlFor = 'cfg-' + i;
    const desc = el('span', 'muted', d); desc.id = 'cfg-d-' + i; tx.append(lb, desc);
    const sw = el('span', 'switch'); const inp = el('input'); inp.type = 'checkbox'; inp.id = 'cfg-' + i; inp.checked = on; inp.setAttribute('aria-describedby', 'cfg-d-' + i);
    inp.addEventListener('change', () => { row[2] = inp.checked; toast(n + ': ' + (inp.checked ? 'ligado' : 'desligado')); });
    sw.append(inp, el('span')); li.append(tx, sw); cfg.appendChild(li);
  });
  const bars = $('#adm-bars')!; bars.textContent = '';
  ([['Produto', 86, 64], ['Treinamento', 81, 92], ['Eventos', 77, 38], ['Pessoas', 72, 52]] as const).forEach(([n, v, c]) => {
    const li = el('li'); li.append(el('span', 'ab-n', n)); const t = el('span', 'ab-t'); const i = el('i'); i.style.width = v + '%'; t.appendChild(i);
    li.append(t, el('b', 'num', String(v)), el('small', 'muted', c + ' apresentações')); bars.appendChild(li);
  });
  const tabs = $$('[data-adm]', sub);
  const showAdm = (t: HTMLElement) => {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
    $$('.adm-panel', sub).forEach(p => { p.hidden = p.id !== 'adm-p-' + t.dataset.adm; });
    STUDIO.adm = t.dataset.adm as AdmTab;
  };
  tabs.forEach(t => t.addEventListener('click', () => showAdm(t), o));
  rovingTabs(tabs[0].parentElement!, showAdm, S.signal);
  const cur = tabs.find(t => t.dataset.adm === STUDIO.adm); if (cur && STUDIO.adm !== 'users') showAdm(cur);
  const f = $<HTMLFormElement>('#adm-invite-f')!, mail = $<HTMLInputElement>('#adm-mail')!, help = $('#adm-mail-h')!;
  $('#adm-invite-go')!.addEventListener('click', () => { showAdm($('[data-adm="invite"]', sub)!); mail.focus(); }, o);
  f.addEventListener('submit', e => {
    e.preventDefault();
    const list = mail.value.split(/[,;\s]+/).map(x => x.trim()).filter(Boolean);
    const bad = list.filter(x => !EMAIL_RE.test(x));
    if (!list.length || bad.length) { invalid(mail, true); mail.focus(); help.textContent = list.length ? 'Confira: ' + bad.join(', ') : 'Digite pelo menos um e-mail.'; help.classList.add('err'); return; }
    mail.removeAttribute('aria-invalid'); help.classList.remove('err'); help.textContent = 'Separe vários e-mails com vírgula. O convite vale por 7 dias.';
    const role = $<HTMLSelectElement>('#adm-role')!.value;
    list.forEach(m => { const n = m.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); PEOPLE.push({ n, m, role, st: 'convite', last: 'nunca entrou', idx: null, av: 'av-3', sent: 'agora' }); });
    mail.value = ''; admRows();
    toast(list.length === 1 ? 'Convite enviado para ' + list[0] : list.length + ' convites enviados');
  }, o);
  mail.addEventListener('input', () => mail.removeAttribute('aria-invalid'), o);
  const offFields = bootFields(document.getElementById('v-studio') ?? document);
  return () => { S.dispose(); offFields(); closePop(false); };
}
