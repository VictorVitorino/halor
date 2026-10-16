/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines.
   Links internos usam next/link (navegação sem recarregar, como a troca de tela do protótipo). */
import Link from 'next/link';

export default function AuthView() {
  return (
    <div className="auth">
      <aside className="auth-scene theme-night" aria-hidden="true">
        <canvas className="halo-field halor-field" data-field="auth" />
        {' '}
        <Link className="logo logo-night auth-logo" href="/" tabIndex={-1}>
          <svg className="mk-glow">
            <use href="#hl-mark" />
          </svg>
          <span className="wordmark">halor</span>
        </Link>
        <div className="eye-wrap">
          <svg className="eye" id="eye" viewBox="0 0 240 240">
            <defs>
              <radialGradient id="eye-core" cx=".4" cy=".38" r=".7">
                <stop offset="0" stopColor="#fff" />
                <stop offset=".4" stopColor="#e9deff" />
                <stop offset="1" stopColor="#8b3dff" />
              </radialGradient>
              <filter id="eye-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g className="eye-body" filter="url(#eye-glow)">
              <circle className="eye-ring" cx="120" cy="120" r="96" fill="none" stroke="url(#hl-g-ring)" strokeWidth="12" strokeLinecap="round" strokeDasharray="520 83" transform="rotate(-62 120 120)" />
              {' '}
              <circle className="eye-inner" cx="120" cy="120" r="62" fill="none" stroke="#a970ff" strokeWidth="3" opacity=".55" />
              <g className="eye-pupil">
                <circle cx="120" cy="120" r="30" fill="url(#eye-core)" />
              </g>
              <rect className="eye-lid" x="20" y="116" width="200" height="8" rx="4" fill="#c9a6ff" />
            </g>
            <path className="eye-spark" d="M188 36Q188 52 204 52Q188 52 188 68Q188 52 172 52Q188 52 188 36Z" fill="#fff" />
          </svg>
          <p className="eye-say" id="eye-say">Bem-vindo de volta.</p>
        </div>
        <div className="auth-quote">
          <p className="display">Atenção é o primeiro sim.</p>
          <ul className="auth-promise">
            <li>
              <svg>
                <use href="#i-check" />
              </svg>
              Apresentações que prendem o olhar
            </li>
            <li>
              <svg>
                <use href="#i-check" />
              </svg>
              Cada envio medido, do primeiro olhar ao sim
            </li>
            <li>
              <svg>
                <use href="#i-check" />
              </svg>
              Seu acervo salvo na nuvem, em qualquer computador
            </li>
          </ul>
        </div>
      </aside>
      <section className="auth-panel">
        <div className="auth-top">
          <Link className="btn btn-quiet btn-sm" href="/">
            <svg aria-hidden="true">
              <use href="#i-back" />
            </svg>
            {' '}Voltar ao site
          </Link>
          {' '}
          <span className="chip chip-line">
            <svg aria-hidden="true">
              <use href="#i-lock" />
            </svg>
            {' '}Conexão segura
          </span>
        </div>
        <div className="auth-card">
          <Link className="logo auth-mobile-logo" href="/" aria-label="Halor, voltar ao site">
            <svg aria-hidden="true">
              <use href="#hl-mark-paper" />
            </svg>
            <span className="wordmark">halor</span>
          </Link>
          {/* ENTRAR / CRIAR */}
          <div data-auth="entrar">
            <h1 className="auth-h" id="auth-title" tabIndex={-1}>Entrar no Halor</h1>
            <p className="muted auth-sub" id="auth-sub">Continue de onde parou. Seu acervo está esperando.</p>
            <div className="seg auth-seg" role="tablist" aria-label="Acesso">
              <button type="button" role="tab" id="auth-tab-entrar" aria-selected="true" aria-controls="f-login" data-auth-tab="entrar">Entrar</button>
              {' '}
              <button type="button" role="tab" id="auth-tab-criar" aria-selected="false" aria-controls="f-login" tabIndex={-1} data-auth-tab="criar">Criar conta</button>
            </div>
            <form className="auth-form" id="f-login" role="tabpanel" aria-labelledby="auth-tab-entrar" noValidate>
              <div className="field" data-only="criar" hidden>
                <label htmlFor="a-nome">Nome</label>
                {' '}
                <input className="input" id="a-nome" name="nome" autoComplete="name" placeholder="Como devemos te chamar" />
              </div>
              <div className="field">
                <label htmlFor="a-email">E-mail</label>
                {' '}
                <input className="input" id="a-email" name="email" type="email" autoComplete="email" placeholder="voce@empresa.com.br" defaultValue="marina@nortesistemas.com.br" aria-describedby="auth-err" />
              </div>
              <div className="field">
                <label htmlFor="a-senha">Senha</label>
                <div className="input-wrap">
                  <input className="input" id="a-senha" name="senha" type="password" autoComplete="current-password" placeholder="Sua senha" defaultValue="halor-demo-2026" aria-describedby="auth-err" />
                  {' '}
                  <button className="btn-icon" type="button" data-reveal="a-senha" aria-label="Mostrar senha" aria-pressed="false">
                    <svg aria-hidden="true">
                      <use href="#i-eye" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="auth-row" data-only="entrar">
                <label className="check">
                  <input type="checkbox" id="a-lembrar" defaultChecked />
                  {' '}
                  <span>Manter conectado</span>
                </label>
                {' '}
                <button className="link" type="button" data-auth-go="esqueci">Esqueci a senha</button>
              </div>
              <label className="check" data-only="criar" hidden>
                <input type="checkbox" id="a-termos" />
                {' '}
                <span>Aceito os termos e a política de privacidade</span>
              </label>
              <p className="auth-err" id="auth-err" role="alert" hidden>
                <svg aria-hidden="true">
                  <use href="#i-alert" />
                </svg>
                <span />
              </p>
              <button className="btn btn-primary btn-lg btn-block" type="submit" id="a-submit">Entrar</button>
            </form>
            <div className="auth-or">
              <span>ou</span>
            </div>
            <div className="auth-sso">
              <button className="btn btn-ghost btn-block" type="button" data-sso="">
                <svg aria-hidden="true">
                  <use href="#i-google" />
                </svg>
                {' '}Continuar com Google
              </button>
              {' '}
              <button className="btn btn-ghost btn-block" type="button" data-sso="">
                <svg aria-hidden="true">
                  <use href="#i-microsoft" />
                </svg>
                {' '}Continuar com Microsoft
              </button>
              {' '}
              <button className="btn btn-quiet btn-block" type="button" data-sso="">
                <svg aria-hidden="true">
                  <use href="#i-key" />
                </svg>
                {' '}Entrar com SSO da empresa
              </button>
            </div>
          </div>
          {/* ESQUECI */}
          <div data-auth="esqueci" hidden>
            <h1 className="auth-h" tabIndex={-1}>Recuperar o acesso</h1>
            <p className="muted auth-sub">Enviamos um link para criar uma nova senha. Ele vale por 30 minutos.</p>
            <form className="auth-form" id="f-esqueci" noValidate>
              <div className="field">
                <label htmlFor="r-email">E-mail da sua conta</label>
                <input className="input" id="r-email" type="email" autoComplete="email" defaultValue="marina@nortesistemas.com.br" aria-describedby="r-err" />
              </div>
              <p className="auth-err" id="r-err" role="alert" hidden>
                <svg aria-hidden="true">
                  <use href="#i-alert" />
                </svg>
                <span />
              </p>
              <button className="btn btn-primary btn-lg btn-block" type="submit">Enviar link de redefinição</button>
            </form>
            <button className="link auth-back" type="button" data-auth-go="entrar">
              <svg aria-hidden="true">
                <use href="#i-back" />
              </svg>
              {' '}Voltar para entrar
            </button>
          </div>
          {/* ENVIADO */}
          <div data-auth="enviado" hidden>
            <div className="auth-badge">
              <svg aria-hidden="true">
                <use href="#i-mail" />
              </svg>
            </div>
            <h1 className="auth-h" tabIndex={-1}>Verifique seu e-mail</h1>
            <p className="muted auth-sub">
              Se existir uma conta para{' '}
              <b id="sent-to">marina@nortesistemas.com.br</b>
              , o link chega em instantes. Confira também a caixa de spam.
            </p>
            <button className="btn btn-ghost btn-block" type="button" data-auth-go="definir">Abrir o link (simulação)</button>
            {' '}
            <button className="link auth-back" type="button" data-auth-go="esqueci">Usar outro e-mail</button>
          </div>
          {/* DEFINIR SENHA */}
          <div data-auth="definir" hidden>
            <h1 className="auth-h" tabIndex={-1}>Crie uma nova senha</h1>
            <p className="muted auth-sub">Use uma frase que só você saiba. Quanto mais longa, melhor.</p>
            <form className="auth-form" id="f-definir" noValidate>
              <div className="field">
                <label htmlFor="d-senha">Nova senha</label>
                <div className="input-wrap">
                  <input className="input" id="d-senha" type="password" autoComplete="new-password" placeholder="Pelo menos 12 caracteres" aria-describedby="pw-reqs" />
                  <button className="btn-icon" type="button" data-reveal="d-senha" aria-label="Mostrar senha" aria-pressed="false">
                    <svg aria-hidden="true">
                      <use href="#i-eye" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="meter" aria-hidden="true">
                <i id="pw-meter" />
              </div>
              <ul className="reqs" id="pw-reqs" aria-label="Requisitos da senha">
                <li data-req="len">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  12 caracteres ou mais
                </li>
                <li data-req="mail">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Não contém o seu e-mail
                </li>
                <li data-req="common">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Não é uma senha comum
                </li>
              </ul>
              <div className="field">
                <label htmlFor="d-senha2">Confirme a senha</label>
                <input className="input" id="d-senha2" type="password" autoComplete="new-password" />
              </div>
              <button className="btn btn-primary btn-lg btn-block" type="submit">Definir senha e entrar</button>
            </form>
          </div>
        </div>
        <p className="auth-foot muted">Protótipo de interface. Nenhum dado digitado sai desta página.</p>
      </section>
    </div>
  );
}
