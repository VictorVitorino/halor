/* ==========================================================================
   Estúdio · casca compartilhada pelas sub-telas: menu lateral móvel com véu,
   busca (Ctrl K), notificações, atalhos gerais e os modais de importar,
   salvar como e compartilhar. Ligada uma vez pelo layout do Estúdio.
   Porte de prototype/src/js/50-studio.js (bindEditor, bindHome, bindExport, bindShare, bindImport).
   ========================================================================== */
import { $, $$, closeModal, copyText, currentView, el, openModal, REDUCED, toast } from '@/lib/core';
import { openDeck } from './editor';
import { exportHTML } from './export';
import { clearSearch, renderHome, searchScroll } from './home';
import { onStudioKey } from './keys';
import { go, setPending } from './nav';
import { closePop, installPop, openPop, popOpen } from './pop';
import { ACERVO, SESSION, SIGNALS, SIG_FILL, SIG_INK, STUDIO, type ImportItem, type ShareInvite } from './store';
import { EMAIL_RE, applyMod, invalid, makeScope, modKey, modalOpen, slugify, studioOpen, typingIn, type Scope } from './util';

/** Fecha o menu lateral móvel (ao trocar de sub-tela, como o showSub do protótipo). */
export function closeSide() {
  $('#side')?.classList.remove('open');
  $('#side-toggle')?.setAttribute('aria-expanded', 'false');
}

/** Clique simples, sem modificador: o que a página trata sozinha em vez de abrir outra aba. */
const plainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/* · Salvar como · */
function bindExport(S: Scope) {
  const opts = $$('.exp [role="radio"]'), goBtn = $('#exp-go'), box = $('.exp'); if (!goBtn || !box) return;
  const LABEL: Record<string, string> = { link: 'Gerar link', html: 'Baixar HTML', pptx: 'Gerar PowerPoint', 'pptx-img': 'Gerar PowerPoint', pdf: 'Gerar PDF' };
  const pickExp = (b: HTMLElement) => {
    opts.forEach(x => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
    goBtn.textContent = LABEL[b.dataset.exp!]; SESSION.exp = b.dataset.exp!;
  };
  opts.forEach(b => b.addEventListener('click', () => pickExp(b), S.o));
  box.addEventListener('keydown', e => {
    const i = opts.indexOf(document.activeElement as HTMLElement); if (i < 0) return;
    const n = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key]; if (!n) return;
    e.preventDefault(); const b = opts[(i + n + opts.length) % opts.length]; b.focus(); pickExp(b);
  }, S.o);
  goBtn.addEventListener('click', () => {
    const k = $('.exp [aria-checked="true"]')!.dataset.exp!, slug = slugify(STUDIO.title);
    closeModal($('#m-export')!);
    if (k === 'html') return exportHTML();
    if (k === 'link') return copyText('https://halor.link/' + slug, null, 'Link medido criado e copiado: halor.link/' + slug);
    toast(({ pptx: 'PowerPoint editável pronto: ', 'pptx-img': 'PowerPoint idêntico pronto: ', pdf: 'PDF vetorial pronto: ' } as Record<string, string>)[k] + slug + (k === 'pdf' ? '.pdf' : '.pptx'));
  }, S.o);
  /* o formato escolhido continua escolhido durante a sessão */
  const cur = opts.find(b => b.dataset.exp === SESSION.exp); if (cur && SESSION.exp !== 'link') pickExp(cur);
}

/* · Compartilhar · */
function shareRow(list: HTMLElement, v: ShareInvite, fresh: boolean) {
  const li = el('li');
  li.append(el('span', 'avatar av-sm av-3', v.ini));
  const d = el('div'); d.append(el('b', null, v.name), el('span', 'muted', v.mail)); li.append(d, el('span', 'muted', v.perm));
  li.dataset.session = '';
  if (fresh) li.classList.add('new');
  list.appendChild(li);
}
function bindShare(S: Scope) {
  const mail = $<HTMLInputElement>('#share-mail'), list = $('#share-people'), on = $<HTMLInputElement>('#share-on'); if (!mail || !list || !on) return;
  const url = () => 'halor.link/' + slugify(STUDIO.title);
  document.addEventListener('click', e => { if ((e.target as Element | null)?.closest?.('[data-open="m-share"]')) $('#share-url')!.textContent = url(); }, S.o);
  $('#share-copy')!.addEventListener('click', () => {
    if (!on.checked) return toast('Ligue o link antes de copiar');
    copyText('https://' + url(), null, 'Link copiado: ' + url());
  }, S.o);
  on.addEventListener('change', () => { SESSION.shareOn = on.checked; toast(on.checked ? 'Link ligado. Quem tiver o endereço abre a apresentação.' : 'Link desligado. O endereço para de abrir na hora.'); }, S.o);
  const send = () => {
    const v = mail.value.trim();
    if (!EMAIL_RE.test(v)) { invalid(mail, true); mail.focus(); return toast(v ? 'Confira o e-mail: falta alguma parte' : 'Digite o e-mail de quem vai receber'); }
    mail.removeAttribute('aria-invalid');
    const nm = v.split('@')[0].replace(/[._-]+/g, ' ');
    const ini = nm.split(' ').filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join('') || '?';
    const inv: ShareInvite = { ini, name: nm.replace(/\b\w/g, c => c.toUpperCase()), mail: v, perm: $<HTMLSelectElement>('#share-perm')!.value };
    SESSION.invites.push(inv); shareRow(list, inv, true); mail.value = '';
    toast('Convite enviado para ' + v);
  };
  $('#share-send')!.addEventListener('click', send, S.o);
  mail.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(); } }, S.o);
  mail.addEventListener('input', () => mail.removeAttribute('aria-invalid'), S.o);
  /* convites e estado do link da sessão (a casca é refeita quando a pessoa volta ao Estúdio) */
  on.checked = SESSION.shareOn;
  $$('[data-session]', list).forEach(n => n.remove());
  SESSION.invites.forEach(v => shareRow(list, v, false));
}

/* · Importar · */
function bindImport(S: Scope) {
  const q = $('#imp-queue'), drop = $('#imp-drop'), inp = $<HTMLInputElement>('#imp-file'); if (!q || !drop || !inp) return;
  const show = (it: ImportItem) => {
    const li = el('li'); li.innerHTML = '<svg aria-hidden="true"><use href="#i-file"/></svg>'; li.dataset.session = '';
    const d = el('div'); d.appendChild(el('b', null, it.name));
    const bar = el('span', 'qbar'), i = el('i', it.ok && it.p < 100 ? 'run' : ''); i.style.width = it.p ? it.p + '%' : '0'; bar.appendChild(i); d.appendChild(bar);
    const chip = el('span', !it.ok ? 'chip chip-danger' : it.p >= 100 ? 'chip chip-ok' : 'chip', !it.ok ? 'Formato não aceito' : it.p >= 100 ? 'Pronto · ' + it.pages + ' slides' : Math.round(it.p) + '%');
    li.append(d, chip); q.prepend(li);
    if (!it.ok || it.p >= 100) return;
    const step = () => {
      it.p = Math.min(100, it.p + (REDUCED ? 100 : 12 + Math.random() * 18)); i.style.width = it.p + '%';
      chip.textContent = it.p < 100 ? Math.round(it.p) + '%' : 'Pronto · ' + it.pages + ' slides';
      if (it.p >= 100) { i.classList.remove('run'); chip.className = 'chip chip-ok'; } else S.later(step, 260);
    };
    step();
  };
  const add = (files: FileList) => {
    Array.from(files).forEach(f => {
      const ok = /\.(pptx|pdf|json)$/i.test(f.name);
      const it: ImportItem = { name: f.name, ok, pages: 6 + Math.floor(Math.random() * 14), p: 0 };
      SESSION.imports.push(it);
      if (ok) {
        SESSION.added++;
        ACERVO.unshift({ t: f.name.replace(/\.[^.]+$/, ''), h: f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ') + '.', who: 'minhas', when: 'agora', score: 70 + Math.floor(Math.random() * 15), views: 0 });
      }
      show(it);
    });
    renderHome();
  };
  inp.addEventListener('change', () => { if (inp.files) add(inp.files); inp.value = ''; }, S.o);
  (['dragenter', 'dragover'] as const).forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('over'); }, S.o));
  (['dragleave', 'drop'] as const).forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('over'); }, S.o));
  drop.addEventListener('drop', e => { if (e.dataTransfer && e.dataTransfer.files.length) add(e.dataTransfer.files); }, S.o);
  $('#imp-done')!.addEventListener('click', () => {
    go('/estudio');
    const added = SESSION.added;
    toast(added ? (added === 1 ? '1 arquivo novo no acervo' : added + ' arquivos novos no acervo') : '3 arquivos no acervo. O relatório da importação está pronto.');
    SESSION.added = 0;
  }, S.o);
  /* fila da sessão (a casca é refeita quando a pessoa volta ao Estúdio) */
  $$('[data-session]', q).forEach(n => n.remove());
  SESSION.imports.forEach(show);
}

/** Liga a casca do Estúdio (layout) e devolve a limpeza. */
export function bootShell(): () => void {
  const side = $('#side'), scrim = $('#side-scrim'), tog = $('#side-toggle'), sIn = $<HTMLInputElement>('#st-search'), bell = $('#bell');
  if (!side || !scrim || !tog || !sIn || !bell) return () => {};
  const S = makeScope(), o = S.o;
  const offPop = installPop();
  /* modificador da plataforma nos atalhos (barra superior e guia de atalhos) */
  applyMod(document);

  /* lado: menu móvel com véu */
  const setSide = (on: boolean) => { side.classList.toggle('open', on); scrim.hidden = !on; tog.setAttribute('aria-expanded', String(on)); if (on) $('.side-nav a', side)?.focus(); };
  tog.addEventListener('click', () => setSide(!side.classList.contains('open')), o);
  scrim.addEventListener('click', () => { setSide(false); tog.focus(); }, o);
  const offSide = onStudioKey('side', e => {
    if (!e.defaultPrevented && !modalOpen() && e.key === 'Escape' && side.classList.contains('open')) { e.preventDefault(); setSide(false); tog.focus(); }
  });
  document.addEventListener('halor:view', () => { scrim.hidden = true; }, o);
  const mo = new MutationObserver(() => { if (!side.classList.contains('open')) scrim.hidden = true; });
  mo.observe(side, { attributes: true, attributeFilter: ['class'] });

  /* "Nova apresentação" da barra lateral */
  $$('[data-deck]', side).forEach(a => a.addEventListener('click', e => { e.preventDefault(); openDeck('new'); toast('Nova apresentação com o seu kit de marca'); }, o));

  /* busca */
  if (matchMedia('(max-width: 640px)').matches) sIn.placeholder = matchMedia('(max-width: 420px)').matches ? 'Buscar' : 'Buscar no acervo';
  sIn.addEventListener('input', () => {
    const was = STUDIO.q, goHome = !!sIn.value.trim() && !studioOpen('inicio');
    STUDIO.q = sIn.value.trim();
    /* começo de uma busca com o acervo fora da tela (celular): o resultado sobe até o olhar */
    if (goHome) { if (STUDIO.q && !was) setPending('search-scroll'); go('/estudio'); }
    renderHome();
    if (!goHome && STUDIO.q && !was) S.later(searchScroll, 0);
  }, o);
  sIn.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sIn.value) { e.stopPropagation(); clearSearch(); }
    else if (e.key === 'Enter') { const first = $('#acv a.deck'); if (first) first.focus(); }
  }, o);

  /* notificações */
  const markSeen = () => {
    STUDIO.bellSeen = true;
    const dot = $('.badge-dot', bell); if (dot) dot.style.display = 'none';
    bell.setAttribute('aria-label', 'Notificações');
  };
  if (STUDIO.bellSeen) markSeen();
  const toPainel = (e: MouseEvent) => { closePop(false); if (!plainClick(e)) return; e.preventDefault(); go('/painel'); };
  bell.addEventListener('click', () => openPop(bell, box => {
    box.appendChild(el('p', 'pop-h', 'Notificações'));
    SIGNALS.slice(0, 3).forEach(s => {
      const a = el('a', 'pop-n'); a.href = '/painel'; a.setAttribute('role', 'menuitem');
      const r = el('span', 'sig-ring', String(s.r + 1)); r.style.setProperty('--sw', SIG_FILL[s.r]); r.style.color = SIG_INK[s.r];
      const tx = el('span'); const p = el('span', 'pn-t'); p.innerHTML = s.h; tx.append(p, el('small', null, s.w)); a.append(r, tx);
      a.addEventListener('click', toPainel); box.appendChild(a);
    });
    const all = el('a', 'pop-all', 'Ver tudo no Painel Halor'); all.href = '/painel'; all.setAttribute('role', 'menuitem'); all.addEventListener('click', toPainel); box.appendChild(all);
    markSeen();
  }, { cls: 'pop-wide', align: 'right', label: 'Notificações' }), o);

  /* atalhos gerais do Estúdio */
  const offStudio = onStudioKey('studio', e => {
    if (e.defaultPrevented || currentView !== 'v-studio' || modalOpen()) return;
    const k = e.key.toLowerCase();
    if (modKey(e) && k === 'k') { e.preventDefault(); sIn.focus(); sIn.select(); return; }
    if (typingIn(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '?' || e.key === 'F1') { e.preventDefault(); openModal('m-keys'); return; }
    if (studioOpen('inicio') && /^[1-6]$/.test(e.key) && !popOpen()) {
      const t = $(`.start[data-key="${e.key}"]`);
      if (t) { e.preventDefault(); t.classList.add('pressed'); S.later(() => t.classList.remove('pressed'), 180); t.click(); }
    }
  });

  /* modais da casca */
  bindExport(S); bindShare(S); bindImport(S);

  return () => { S.dispose(); mo.disconnect(); offPop(); offSide(); offStudio(); };
}
