/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import type { CSSProperties } from 'react';

export default function StudioEditor() {
  return (
    <section className="sub sub-editor" data-subview="editor" aria-label="Editor">
      <div className="ed-top">
        <div className="ed-file">
          <a className="btn-icon" href="/estudio" aria-label="Voltar ao início">
            <svg aria-hidden="true">
              <use href="#i-back" />
            </svg>
          </a>
          <div className="ed-name">
            <input id="ed-title" defaultValue="Kickoff 2027 · Time de produto" aria-label="Título da apresentação" spellCheck={false} />
            <span className="save-pill" id="save-pill" role="status">
              <svg aria-hidden="true">
                <use href="#i-check" />
              </svg>
              {' '}
              <span>Salvo na nuvem às 09:42</span>
            </span>
          </div>
        </div>
        <nav className="ed-menu" aria-label="Menus do editor">
          <button type="button" data-menu="arquivo" aria-haspopup="menu" aria-expanded="false">Arquivo</button>
          <button type="button" data-menu="editar" aria-haspopup="menu" aria-expanded="false">Editar</button>
          <button type="button" data-menu="inserir" aria-haspopup="menu" aria-expanded="false">Inserir</button>
          <button type="button" data-menu="slide" aria-haspopup="menu" aria-expanded="false">Slide</button>
          <button type="button" data-menu="organizar" aria-haspopup="menu" aria-expanded="false">Organizar</button>
          <button type="button" data-menu="apresentar" aria-haspopup="menu" aria-expanded="false">Apresentar</button>
          <button type="button" data-menu="ajuda" aria-haspopup="menu" aria-expanded="false">Ajuda</button>
        </nav>
        <div className="ed-actions">
          <button className="btn-icon ed-more" type="button" id="ed-more" aria-label="Menus do editor" title="Menus: arquivo, editar, slide, organizar, apresentar e ajuda" aria-haspopup="menu" aria-expanded="false">
            <svg aria-hidden="true">
              <use href="#i-dots" />
            </svg>
          </button>
          {' '}
          <button className="btn-icon" type="button" id="ed-undo" aria-label="Desfazer" aria-keyshortcuts="Control+Z" title="Desfazer (Ctrl+Z)" aria-disabled="true">
            <svg aria-hidden="true">
              <use href="#i-undo" />
            </svg>
          </button>
          {' '}
          <button className="btn-icon" type="button" id="ed-redo" aria-label="Refazer" aria-keyshortcuts="Control+Shift+Z" title="Refazer (Ctrl+Shift+Z)" aria-disabled="true">
            <svg aria-hidden="true">
              <use href="#i-redo" />
            </svg>
          </button>
          {' '}
          <button className="btn btn-ghost btn-sm" type="button" data-open="m-share">
            <svg aria-hidden="true">
              <use href="#i-share" />
            </svg>
            <span>Compartilhar</span>
          </button>
          {' '}
          <button className="btn btn-ghost btn-sm" type="button" data-open="m-export">
            <svg aria-hidden="true">
              <use href="#i-download" />
            </svg>
            <span>Salvar como</span>
          </button>
          {' '}
          <a className="btn btn-primary btn-sm" href="/apresentar" aria-keyshortcuts="Control+Enter" title="Apresentar do slide atual (Ctrl+Enter)">
            <svg aria-hidden="true">
              <use href="#i-play" />
            </svg>
            <span>Apresentar</span>
          </a>
        </div>
      </div>
      <div className="ribbon" role="toolbar" aria-label="Inserir elementos" data-skip="">
        <button type="button" data-ins="text" title="Caixa de texto no slide">
          <svg aria-hidden="true">
            <use href="#i-text" />
          </svg>
          Texto
        </button>
        {' '}
        <button type="button" data-ins="shape" title="Forma no slide">
          <svg aria-hidden="true">
            <use href="#i-shape" />
          </svg>
          Formas
        </button>
        {' '}
        <button type="button" data-ins="arrow" title="Seta no slide">
          <svg aria-hidden="true">
            <use href="#i-arrowline" />
          </svg>
          Seta
        </button>
        {' '}
        <button type="button" data-ins="image" title="Espaço para imagem no slide">
          <svg aria-hidden="true">
            <use href="#i-image" />
          </svg>
          Imagem
        </button>
        {' '}
        <button type="button" data-ins="icon" title="Ícone no slide">
          <svg aria-hidden="true">
            <use href="#i-spark" />
          </svg>
          Ícones
        </button>
        {' '}
        <span className="rb-sep" />
        {' '}
        <button type="button" data-ins="kpi" title="Novo slide com gráfico">
          <svg aria-hidden="true">
            <use href="#i-bars" />
          </svg>
          Gráficos
        </button>
        {' '}
        <button type="button" data-ins="table" title="Novo slide com tabela">
          <svg aria-hidden="true">
            <use href="#i-table" />
          </svg>
          Tabela
        </button>
        {' '}
        <button type="button" data-ins="steps" title="Novo slide com cards">
          <svg aria-hidden="true">
            <use href="#i-cards" />
          </svg>
          Cards
        </button>
        {' '}
        <button type="button" data-ins="poll" className="rb-new" title="Novo slide de votação ao vivo">
          <svg aria-hidden="true">
            <use href="#i-vote" />
          </svg>
          Votação
        </button>
        {' '}
        <span className="rb-sep" />
        {' '}
        <button type="button" data-ins="tpl" aria-haspopup="menu" aria-expanded="false">
          <svg aria-hidden="true">
            <use href="#i-grid" />
          </svg>
          Modelos
        </button>
        {' '}
        <button type="button" data-ins="fx">
          <svg aria-hidden="true">
            <use href="#i-wand" />
          </svg>
          Efeitos
        </button>
        {' '}
        <span className="rb-sep" />
        {' '}
        <button type="button" className="rb-ray" id="ray-toggle" aria-pressed="false" aria-keyshortcuts="R" title="Raio Halor (R)">
          <svg aria-hidden="true">
            <use href="#i-target" />
          </svg>
          Raio Halor
        </button>
      </div>
      <div className="ed-body">
        <aside className="ed-rail" aria-label="Slides">
          <div className="rail-h">
            <span>Slides</span>
            <span className="muted mono num" id="rail-n">8</span>
          </div>
          <ol className="rail-list" id="rail-list" />
          <button className="btn btn-ghost btn-sm btn-block rail-new" type="button" id="rail-new" aria-haspopup="menu" aria-expanded="false" aria-keyshortcuts="Control+M" title="Novo slide (Ctrl+M)">
            <svg aria-hidden="true">
              <use href="#i-plus" />
            </svg>
            {' '}
            <span>Novo slide</span>
          </button>
        </aside>
        <div className="ed-stage">
          <div className="ed-canvas-wrap">
            <div className="ed-canvas" id="ed-canvas" />
            <div className="ray-layer" id="ray-layer" hidden>
              <span className="ray-heat rh1" />
              <span className="ray-heat rh2" />
              <span className="ray-heat rh3" />
              {' '}
              <span className="ray-n" style={{ left: "10%", top: "16%" } as CSSProperties}>1</span>
              <span className="ray-n" style={{ left: "47%", top: "44%" } as CSSProperties}>2</span>
              <span className="ray-n" style={{ left: "80%", top: "22%" } as CSSProperties}>3</span>
              <span className="ray-n" style={{ left: "10%", top: "84%" } as CSSProperties}>4</span>
              {' '}
              <span className="ray-legend mono">Mapa de atenção previsto · primeiros 3 segundos</span>
            </div>
            <div className="sel-box" id="sel-box" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <span className="sel-tag mono">Título · 44 pt</span>
            </div>
            <div className="float-bar" id="float-bar" role="toolbar" aria-label="Formatar título">
              <button className="btn-icon" type="button" data-fb="bold" aria-label="Negrito" aria-pressed="false">
                <svg aria-hidden="true">
                  <use href="#i-bold" />
                </svg>
              </button>
              {' '}
              <button className="btn-icon" type="button" data-fb="italic" aria-label="Itálico" aria-pressed="false">
                <svg aria-hidden="true">
                  <use href="#i-italic" />
                </svg>
              </button>
              {' '}
              <button className="btn-icon" type="button" data-fb="align" aria-label="Alinhamento: à esquerda">
                <svg aria-hidden="true">
                  <use href="#i-align" />
                </svg>
              </button>
              {' '}
              <span className="fb-div" aria-hidden="true" />
              {' '}
              <button className="fb-sw" type="button" data-fb-c="#17112b" style={{ "--c": "#17112b" } as CSSProperties} aria-label="Cor Tinta" aria-pressed="false" />
              <button className="fb-sw" type="button" data-fb-c="#8b3dff" style={{ "--c": "#8b3dff" } as CSSProperties} aria-label="Cor Violeta Halor" aria-pressed="false" />
            </div>
            <div className="float-bar ly-bar" id="ly-bar" role="toolbar" aria-label="Elemento selecionado" hidden>
              <span className="ly-name mono" id="ly-name">Forma</span>
              {' '}
              <button className="btn-icon" type="button" data-lyb="front" aria-label="Trazer elemento para a frente" title="Trazer para a frente">
                <svg aria-hidden="true">
                  <use href="#i-up" />
                </svg>
              </button>
              {' '}
              <button className="btn-icon" type="button" data-lyb="back" aria-label="Enviar elemento para trás" title="Enviar para trás">
                <svg aria-hidden="true">
                  <use href="#i-down" />
                </svg>
              </button>
              {' '}
              <span className="fb-div" aria-hidden="true" />
              {' '}
              <button className="btn-icon" type="button" data-lyb="dup" aria-label="Duplicar elemento" aria-keyshortcuts="Control+D" title="Duplicar elemento (Ctrl+D)">
                <svg aria-hidden="true">
                  <use href="#i-copy" />
                </svg>
              </button>
              {' '}
              <button className="btn-icon" type="button" data-lyb="del" aria-label="Excluir elemento" title="Excluir elemento (Delete)">
                <svg aria-hidden="true">
                  <use href="#i-trash" />
                </svg>
              </button>
            </div>
          </div>
          <div className="ed-status">
            <span className="mono num" id="ed-pos">Slide 3 de 8</span>
            <span className="muted ed-tip">
              Clique duas vezes para editar o texto ·{' '}
              <button type="button" className="ed-keys" data-open="m-keys">
                <kbd>?</kbd>
                {' '}mostra os atalhos
              </button>
            </span>
            <span className="mono num">100%</span>
          </div>
        </div>
        <aside className="insp" aria-label="Propriedades">
          <div className="tabs" role="tablist" aria-label="Painel de propriedades">
            <button type="button" role="tab" id="insp-t-design" aria-selected="false" aria-controls="insp-p-design" tabIndex={-1} data-insp="design">Design</button>
            {' '}
            <button type="button" role="tab" id="insp-t-anim" aria-selected="false" aria-controls="insp-p-anim" tabIndex={-1} data-insp="anim">Animação</button>
            {' '}
            <button type="button" role="tab" id="insp-t-halor" aria-selected="true" aria-controls="insp-p-halor" data-insp="halor">
              <svg className="tab-ic" aria-hidden="true">
                <use href="#i-target" />
              </svg>
              Halor
            </button>
          </div>
          <div className="insp-panel" id="insp-p-halor" role="tabpanel" aria-labelledby="insp-t-halor" data-insp-panel="halor">
            <div className="ray-score">
              <div className="rs-ring">
                <svg viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="33" className="trk" />
                  <circle cx="40" cy="40" r="33" className="val" style={{ strokeDasharray: "178 208" } as CSSProperties} />
                </svg>
                <b>86</b>
              </div>
              <div>
                <p className="rs-k">Índice Halor do slide</p>
                <p className="rs-v">Forte. O olhar encontra a mensagem em 1,2 s.</p>
              </div>
            </div>
            <div className="insp-sec">
              <p className="insp-h">Caminho do olhar</p>
              <ol className="gaze" id="gaze" />
            </div>
            <div className="insp-sec">
              <p className="insp-h">Checagens</p>
              <ul className="checks" id="checks" />
            </div>
          </div>
          <div className="insp-panel" id="insp-p-design" role="tabpanel" aria-labelledby="insp-t-design" data-insp-panel="design" hidden>
            <p className="insp-sel" id="insp-sel">
              <svg aria-hidden="true">
                <use href="#i-text" />
              </svg>
              <span>Título do slide</span>
            </p>
            <div className="insp-sec" id="d-text">
              <p className="insp-h">Texto</p>
              <div className="insp-row">
                <select className="select" id="d-font" aria-label="Fonte">
                  <option value="ui">Instrument Sans</option>
                  <option value="display">Sora</option>
                  <option value="mono">JetBrains Mono</option>
                </select>
                <select className="select sel-sm" id="d-size" aria-label="Tamanho em pontos" defaultValue="44">
                  <option>56</option>
                  <option>44</option>
                  <option>36</option>
                  <option>28</option>
                </select>
              </div>
              <div className="seg seg-sm" id="d-weight" role="group" aria-label="Peso">
                <button type="button" data-w="400" aria-pressed="false">Regular</button>
                <button type="button" data-w="600" aria-pressed="true">Semibold</button>
                <button type="button" data-w="700" aria-pressed="false">Bold</button>
              </div>
            </div>
            <div className="insp-sec">
              <p className="insp-h">Cores do kit de marca</p>
              <div className="kit-sw" id="d-colors" role="group" aria-label="Cor do elemento">
                <button type="button" data-c="#17112b" style={{ "--c": "#17112b" } as CSSProperties} aria-label="Tinta" aria-pressed="true" />
                <button type="button" data-c="#8b3dff" style={{ "--c": "#8b3dff" } as CSSProperties} aria-label="Violeta Halor" aria-pressed="false" />
                <button type="button" data-c="#c4a6ff" style={{ "--c": "#c4a6ff" } as CSSProperties} aria-label="Lilás" aria-pressed="false" />
                <button type="button" data-c="#4a4366" style={{ "--c": "#4a4366" } as CSSProperties} aria-label="Grafite" aria-pressed="false" />
                <button type="button" data-c="#e9dfff" style={{ "--c": "#e9dfff" } as CSSProperties} aria-label="Lilás claro" aria-pressed="false" />
                <button type="button" data-c="#07040f" style={{ "--c": "#07040f" } as CSSProperties} aria-label="Vazio" aria-pressed="false" />
              </div>
            </div>
            <div className="insp-sec">
              <p className="insp-h">Posição e tamanho</p>
              <div className="xywh">
                <label>
                  X
                  <input className="input" id="d-x" inputMode="numeric" defaultValue="96" />
                </label>
                <label>
                  Y
                  <input className="input" id="d-y" inputMode="numeric" defaultValue="72" />
                </label>
                <label>
                  L
                  <input className="input" id="d-w" inputMode="numeric" defaultValue="720" />
                </label>
                <label>
                  A
                  <input className="input" id="d-h" inputMode="numeric" defaultValue="132" />
                </label>
              </div>
              <p className="hint">
                Em pixels, num slide de 1280 × 720. As setas do teclado movem o elemento; com Shift, ele anda 5×.
              </p>
            </div>
          </div>
          <div className="insp-panel" id="insp-p-anim" role="tabpanel" aria-labelledby="insp-t-anim" data-insp-panel="anim" hidden>
            <div className="insp-sec">
              <p className="insp-h">Entrada no Palco</p>
              <div className="fx-grid" id="d-fx" role="group" aria-label="Efeito de entrada">
                <button type="button" data-fx="revelar" aria-pressed="true">
                  <i className="fx-pv fx-pv-revelar" aria-hidden="true" />
                  Revelar
                </button>
                <button type="button" data-fx="brilho" aria-pressed="false">
                  <i className="fx-pv fx-pv-brilho" aria-hidden="true" />
                  Brilho
                </button>
                <button type="button" data-fx="subir" aria-pressed="false">
                  <i className="fx-pv fx-pv-subir" aria-hidden="true" />
                  Subir
                </button>
                <button type="button" data-fx="halo" aria-pressed="false">
                  <i className="fx-pv fx-pv-halo" aria-hidden="true" />
                  Halo
                </button>
              </div>
              <p className="hint">Clique para ver a entrada no slide. É assim que ela aparece no Palco.</p>
            </div>
            <div className="insp-sec">
              <p className="insp-h">Duração</p>
              <input type="range" min="200" max="1600" step="100" defaultValue="900" className="range" id="d-dur" aria-label="Duração da animação em milissegundos" aria-valuetext="900 milissegundos" />
              <p className="hint mono" id="d-dur-v">900 ms · curva halo-out</p>
            </div>
            <button className="btn btn-ghost btn-sm" type="button" id="d-fx-play">
              <svg aria-hidden="true">
                <use href="#i-play" />
              </svg>
              {' '}Ver de novo
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
