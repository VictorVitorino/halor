/* ==========================================================================
   ENTRAR · o halo que observa. Entrar, criar conta, esqueci a senha,
   link enviado e definir senha, com o olho que acompanha o que se digita.
   Porte de bindAuth em prototype/src/js/60-auth.js.
   ========================================================================== */
import { $, $$, toast } from '../../core';
import { EMAIL_RE, invalid, tabKeys, timers } from './plans';

const COMMON_PW = ['123456', '12345678', 'senha123', 'password', 'qwerty', 'halor123', 'admin123', '123456789', 'senha', 'abc123'];

type AuthMode = 'entrar' | 'criar';
type AuthState = 'entrar' | 'esqueci' | 'enviado' | 'definir';
type Mood = 'idle' | 'email' | 'senha' | 'erro' | 'ok';
type PwReq = 'len' | 'mail' | 'common';

const REST: Record<AuthMode | Exclude<AuthState, 'entrar'>, string> = {
  entrar: 'Bem-vindo de volta.', criar: 'Que bom ter você aqui.', esqueci: 'Acontece. Vamos recuperar.',
  enviado: 'Confere a caixa de entrada.', definir: 'Uma senha nova, então.',
};

/**
 * Liga a tela de entrada. `go` leva ao estúdio depois do login (o roteador do Next).
 * Idempotente; devolve a limpeza.
 */
export function bootAuth(go: (path: string) => void): () => void {
  const form = $<HTMLFormElement>('#f-login');
  if (!form) return () => {};
  const ac = new AbortController(), o = { signal: ac.signal }, T = timers();
  const on = <K extends keyof HTMLElementEventMap>(n: Element | null, type: K, fn: (e: HTMLElementEventMap[K]) => void) => n?.addEventListener(type, fn as EventListener, o);

  const eye = $<SVGSVGElement>('#eye'), say = $('#eye-say')!;
  const mood = (m: Mood, text?: string) => { if (!eye) return; eye.dataset.mood = m; if (text) say.textContent = text; };
  const pupil = eye ? $<SVGGElement>('.eye-pupil', eye) : null;
  let mode: AuthMode = 'entrar', state: AuthState = 'entrar';
  const rest = () => mood('idle', state === 'entrar' ? REST[mode] : REST[state]);
  const err = $('#auth-err')!;
  const clearErr = () => { err.hidden = true; $$('#f-login .input').forEach(i => invalid(i, false)); };
  const showState = (s: AuthState, focus = true) => {
    state = s;
    $$('[data-auth]').forEach(p => { p.hidden = p.dataset.auth !== s; });
    clearErr(); $('#r-err')!.hidden = true; invalid($('#r-email'), false);
    rest();
    if (!focus) return;
    const panel = $('[data-auth="' + s + '"]')!;
    const f = $('input', panel) || $('h1', panel);
    if (f) T.set(() => f.focus(), 50);
  };
  const submit = $<HTMLButtonElement>('#a-submit')!, senha = $<HTMLInputElement>('#a-senha')!;
  const setMode = (m: AuthMode) => {
    mode = m;
    $$('[data-auth-tab]').forEach(b => { const sel = b.dataset.authTab === m; b.setAttribute('aria-selected', String(sel)); b.tabIndex = sel ? 0 : -1; });
    form.setAttribute('aria-labelledby', 'auth-tab-' + m);
    $$('[data-only]').forEach(n => { n.hidden = n.dataset.only !== m; });
    $('#auth-title')!.textContent = m === 'entrar' ? 'Entrar no Halor' : 'Criar sua conta';
    $('#auth-sub')!.textContent = m === 'entrar' ? 'Continue de onde parou. Seu acervo está esperando.' : 'Grátis no plano Faísca, para sempre.';
    submit.disabled = false; submit.textContent = m === 'entrar' ? 'Entrar' : 'Criar conta grátis';
    senha.autocomplete = m === 'entrar' ? 'current-password' : 'new-password';
    senha.placeholder = m === 'entrar' ? 'Sua senha' : 'Pelo menos 12 caracteres';
    clearErr(); rest();
  };
  $$('[data-auth-tab]').forEach(b => on(b, 'click', () => setMode(b.dataset.authTab as AuthMode)));
  tabKeys($('.auth-seg'), t => setMode(t.dataset.authTab as AuthMode), ac.signal);
  $$('[data-auth-go]').forEach(b => on(b, 'click', () => showState(b.dataset.authGo as AuthState)));

  /* o olho acompanha o que você digita */
  const email = $<HTMLInputElement>('#a-email')!;
  const lookAt = () => { if (!pupil) return; const n = Math.min(email.value.length, 30); pupil.style.transform = `translate(${(n / 30 * 36 - 18).toFixed(1)}px, 14px)`; };
  on(email, 'focus', () => { mood('email', 'Qual é o e-mail?'); lookAt(); });
  on(email, 'input', () => { lookAt(); invalid(email, false); });
  on(email, 'blur', () => { if (pupil) pupil.style.transform = ''; rest(); });
  ['#a-senha', '#d-senha', '#d-senha2'].forEach(s => {
    const i = $<HTMLInputElement>(s);
    on(i, 'focus', () => mood('senha', 'Não estou olhando.')); on(i, 'blur', rest); on(i, 'input', () => invalid(i, false));
  });
  const nome = $<HTMLInputElement>('#a-nome')!;
  on(nome, 'focus', () => mood('email', 'Como devemos te chamar?'));
  on(nome, 'blur', rest);
  $$('[data-sso]').forEach(b => on(b, 'click', () => { mood('ok', 'Pode entrar.'); toast('Simulação: login único confirmado'); T.set(() => go('/estudio/'), 900); }));

  const fail = (msg: string, input?: HTMLInputElement) => {
    err.hidden = false; $('span', err)!.textContent = msg;
    if (input) { invalid(input, true); input.focus(); }
    mood('erro', 'Opa, confere aí.');
    T.set(() => { if (eye && eye.dataset.mood === 'erro') rest(); }, 1600);
  };
  on(form, 'submit', e => {
    e.preventDefault(); clearErr();
    const em = email.value.trim(), pw = senha.value;
    if (mode === 'criar' && !nome.value.trim()) return fail('Diga como devemos te chamar.', nome);
    if (!EMAIL_RE.test(em)) return fail('Digite um e-mail válido, como voce@empresa.com.br.', email);
    if (pw.length < (mode === 'criar' ? 12 : 6)) return fail(mode === 'criar' ? 'Use pelo menos 12 caracteres na senha.' : 'A senha está curta demais. Confira e tente de novo.', senha);
    const termos = $<HTMLInputElement>('#a-termos')!;
    if (mode === 'criar' && !termos.checked) return fail('Para criar a conta, aceite os termos e a política de privacidade.', termos);
    mood('ok', 'Pode entrar.');
    submit.disabled = true; submit.textContent = mode === 'entrar' ? 'Entrando…' : 'Criando conta…';
    const was = mode;
    T.set(() => { setMode(was); go('/estudio/'); toast(was === 'entrar' ? 'Que bom te ver de novo, Marina' : 'Conta criada no plano Faísca'); }, 900);
  });

  const fEsq = $<HTMLFormElement>('#f-esqueci'), rEmail = $<HTMLInputElement>('#r-email')!, rErr = $('#r-err')!;
  on(fEsq, 'submit', e => {
    e.preventDefault();
    const v = rEmail.value.trim();
    if (!EMAIL_RE.test(v)) { rErr.hidden = false; $('span', rErr)!.textContent = 'Digite o e-mail da sua conta, como voce@empresa.com.br.'; invalid(rEmail, true); rEmail.focus(); mood('erro', 'Opa, confere aí.'); return; }
    $('#sent-to')!.textContent = v; showState('enviado');
  });
  on(rEmail, 'input', () => { invalid(rEmail, false); rErr.hidden = true; });

  /* força da senha */
  const d1 = $<HTMLInputElement>('#d-senha')!, d2 = $<HTMLInputElement>('#d-senha2')!, meter = $('#pw-meter')!;
  on(d1, 'input', () => {
    const v = d1.value, mail = (email.value.split('@')[0] || '').toLowerCase();
    const ok: Record<PwReq, boolean> = { len: v.length >= 12, mail: !mail || !v.toLowerCase().includes(mail), common: !!v && !COMMON_PW.includes(v.toLowerCase()) };
    $$('#pw-reqs li').forEach(li => li.classList.toggle('ok', ok[li.dataset.req as PwReq] && !!v));
    const score = (ok.len ? 1 : 0) + (ok.mail && v ? 1 : 0) + (ok.common ? 1 : 0) + (v.length >= 16 ? 1 : 0);
    meter.style.width = (score / 4 * 100) + '%';
    meter.style.background = score >= 3 ? 'var(--ok)' : score === 2 ? 'var(--warn)' : 'var(--danger)';
  });
  on($('#f-definir'), 'submit', e => {
    e.preventDefault();
    if ($$('#pw-reqs li.ok').length < 3) { mood('erro', 'Falta pouco.'); invalid(d1, true); d1.focus(); toast('A senha ainda não cumpre os três requisitos'); return; }
    if (d1.value !== d2.value) { mood('erro', 'Não bateu.'); invalid(d2, true); d2.focus(); toast('As duas senhas precisam ser iguais'); return; }
    mood('ok', 'Pode entrar.');
    T.set(() => { showState('entrar', false); go('/estudio/'); toast('Senha definida. Tudo pronto.'); }, 800);
  });

  /* ao entrar na tela: aba Entrar, painel de entrada */
  setMode('entrar'); showState('entrar', false);

  return () => { ac.abort(); T.clear(); };
}
