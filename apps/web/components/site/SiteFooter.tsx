/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
export default function SiteFooter() {
  return (
    <footer className="s-foot">
      <div className="wrap s-foot-in">
        <div className="sf-brand">
          <a className="logo logo-night" href="/">
            <svg aria-hidden="true">
              <use href="#hl-mark" />
            </svg>
            <span className="wordmark">halor</span>
          </a>
          <p className="muted">Faça cada olhar render.</p>
        </div>
        <nav className="sf-cols" aria-label="Rodapé">
          <div>
            <p className="sf-h mono">Produto</p>
            <a href="/estudio">Estúdio</a>
            <a href="#vitrine">Vitrine de efeitos</a>
            <a href="/editor">Raio Halor</a>
            <a href="#planos">Planos</a>
            <a href="#planos-empresas">Planos empresariais</a>
          </div>
          <div>
            <p className="sf-h mono">Aprender</p>
            <a href="#efeito">Efeito Halor</a>
            <a href="#linha-do-tempo">Linha do tempo</a>
            <a href="/marca">Manual da marca</a>
            <a href="#faq">Perguntas</a>
          </div>
          <div>
            <p className="sf-h mono">Conta</p>
            <a href="/entrar">Entrar</a>
            <a href="/assinar">Assinar</a>
            <a href="/admin">Administração</a>
          </div>
        </nav>
      </div>
      <div className="wrap sf-legal">
        <span>© 2026 Halor</span>
        <span>Privacidade</span>
        <span>Termos</span>
        <span>LGPD</span>
      </div>
    </footer>
  );
}
