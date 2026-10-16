/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import type { CSSProperties } from 'react';

export default function StudioAdmin() {
  return (
    <section className="sub" data-subview="admin" aria-label="Administração">
      <div className="st-pad">
        <div className="sec-h sec-h-top">
          <div>
            <p className="eyebrow">Administração</p>
            <h1 className="st-h1">Pessoas e acesso</h1>
          </div>
          <button className="btn btn-primary btn-sm" type="button" id="adm-invite-go">
            <svg aria-hidden="true">
              <use href="#i-plus" />
            </svg>
            {' '}Convidar pessoa
          </button>
        </div>
        <div className="tabs adm-tabs" role="tablist" aria-label="Seções da administração">
          <button type="button" role="tab" id="adm-t-users" aria-selected="true" aria-controls="adm-p-users" data-adm="users">Usuários</button>
          {' '}
          <button type="button" role="tab" id="adm-t-invite" aria-selected="false" aria-controls="adm-p-invite" tabIndex={-1} data-adm="invite">Convidar</button>
          {' '}
          <button type="button" role="tab" id="adm-t-audit" aria-selected="false" aria-controls="adm-p-audit" tabIndex={-1} data-adm="audit">Auditoria</button>
          {' '}
          <button type="button" role="tab" id="adm-t-config" aria-selected="false" aria-controls="adm-p-config" tabIndex={-1} data-adm="config">Configurações</button>
          {' '}
          <button type="button" role="tab" id="adm-t-sum" aria-selected="false" aria-controls="adm-p-sum" tabIndex={-1} data-adm="sum">Resumo</button>
        </div>
        <div className="adm-panel" id="adm-p-users" role="tabpanel" aria-labelledby="adm-t-users">
          <div className="adm-sum">
            <div>
              <span className="muted">Pessoas ativas</span>
              <b id="adm-n-active">18</b>
            </div>
            <div>
              <span className="muted">Convites pendentes</span>
              <b id="adm-n-pending">3</b>
            </div>
            <div>
              <span className="muted">Apresentações</span>
              <b>246</b>
            </div>
            <div>
              <span className="muted">Espaço usado</span>
              <b>12,4 GB</b>
              <span className="adm-bar" role="meter" aria-valuemin={0} aria-valuemax={30} aria-valuenow={12.4} aria-label="12,4 de 30 GB usados">
                <i style={{ width: "41%" } as CSSProperties} />
              </span>
            </div>
          </div>
          <div className="tbl-wrap">
            <table className="tbl tbl-stack">
              <caption className="sr-only">Pessoas do time, papel, status, último acesso e Índice Halor médio</caption>
              <thead>
                <tr>
                  <th scope="col">Pessoa</th>
                  <th scope="col">Papel</th>
                  <th scope="col">Status</th>
                  <th scope="col">Último acesso</th>
                  <th scope="col" className="r">Índice médio</th>
                  <th scope="col">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody id="adm-rows" />
            </table>
          </div>
        </div>
        <div className="adm-panel" id="adm-p-invite" role="tabpanel" aria-labelledby="adm-t-invite" hidden>
          <form className="adm-card" id="adm-invite-f" noValidate>
            <div>
              <h2 className="adm-h">Convidar para o time</h2>
              <p className="muted adm-p">Quem entra já recebe o kit de marca, os modelos e a biblioteca de efeitos do time.</p>
            </div>
            <div className="adm-inv-row">
              <div className="field">
                <label htmlFor="adm-mail">E-mail</label>
                <input className="input" id="adm-mail" type="email" placeholder="nome@nortesistemas.com.br" autoComplete="off" aria-describedby="adm-mail-h" />
              </div>
              <div className="field">
                <label htmlFor="adm-role">Papel</label>
                <select className="select" id="adm-role">
                  <option>Membro</option>
                  <option>Admin</option>
                  <option>Só assiste</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit">
                <svg aria-hidden="true">
                  <use href="#i-mail" />
                </svg>
                {' '}Enviar convite
              </button>
            </div>
            <p className="hint" id="adm-mail-h">Separe vários e-mails com vírgula. O convite vale por 7 dias.</p>
          </form>
          <div className="adm-card">
            <h3 className="adm-h3">Convites pendentes</h3>
            <ul className="adm-list" id="adm-pending" />
          </div>
        </div>
        <div className="adm-panel" id="adm-p-audit" role="tabpanel" aria-labelledby="adm-t-audit" hidden>
          <div className="adm-card">
            <h2 className="adm-h">Auditoria</h2>
            <ol className="adm-log" id="adm-log" />
          </div>
        </div>
        <div className="adm-panel" id="adm-p-config" role="tabpanel" aria-labelledby="adm-t-config" hidden>
          <div className="adm-card">
            <h2 className="adm-h">Configurações do time</h2>
            <ul className="adm-cfg" id="adm-cfg" />
          </div>
        </div>
        <div className="adm-panel" id="adm-p-sum" role="tabpanel" aria-labelledby="adm-t-sum" hidden>
          <div className="adm-sum">
            <div>
              <span className="muted">Apresentações feitas</span>
              <b>246</b>
            </div>
            <div>
              <span className="muted">Votos da plateia</span>
              <b>3.412</b>
            </div>
            <div>
              <span className="muted">Olhar médio por slide</span>
              <b>17 s</b>
            </div>
            <div>
              <span className="muted">Pessoas alcançadas</span>
              <b>5.980</b>
            </div>
          </div>
          <div className="adm-card">
            <h2 className="adm-h">Índice Halor por área · outubro</h2>
            <ul className="adm-bars" id="adm-bars" />
          </div>
        </div>
      </div>
    </section>
  );
}
