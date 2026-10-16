/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines/site. */
import Link from 'next/link';
import ProdutoModels from './ProdutoModels';
import ProdutoRec from './ProdutoRec';

export default function Produto() {
  return (
    <section className="s-sec s-prod" id="produto">
      <div className="wrap">
        <div className="s-head">
          <p className="eyebrow">Produto</p>
          <h2 className="display">Apresentações em HTML, vivas e interativas.</h2>
          <p className="lede">
            Você monta como sempre fez e a apresentação sai viva: se move, responde e chama a plateia para participar.
          </p>
        </div>
        <div className="pd-what">
          <article>
            <p className="pd-k mono">O que é</p>
            <h3>Um estúdio de apresentações no navegador</h3>
            <p>Cria, apresenta e compartilha. Sem instalar nada.</p>
          </article>
          <article>
            <p className="pd-k mono">O que faz</p>
            <h3>Transforma slide em experiência</h3>
            <p>
              Modelos com o seu kit de marca, 40 efeitos e componentes lúdicos. Importa e exporta em HTML, PDF e PPT.
            </p>
          </article>
          <article className="pd-gain">
            <p className="pd-k mono">O ganho principal</p>
            <h3>Animação e interação sem programar</h3>
            <p>
              Antes exigia código, Claude Code ou contas de IA. Agora qualquer pessoa cria, e quem recebe abre no navegador.
            </p>
          </article>
        </div>
        <ProdutoRec />
        <ProdutoModels />
        <ul className="feat-grid pd-feats">
          <li>
            <svg aria-hidden="true">
              <use href="#i-layers" />
            </svg>
            <h3>Estúdio no navegador</h3>
            <p>Faixa de inserção, camadas, atalhos e salvamento na nuvem.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-palette" />
            </svg>
            <h3>Modelos e kit de marca</h3>
            <p>Cores, fontes e logo travados. Todo slide nasce na sua identidade.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-wand" />
            </svg>
            <h3>40 efeitos prontos</h3>
            <p>Movimento, 3D, dados e narrativa. Veja todos na vitrine abaixo.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-cards" />
            </svg>
            <h3>Componentes lúdicos</h3>
            <p>Votação, post-its, formulário e cronômetro dentro do slide.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-target" />
            </svg>
            <h3>Raio Halor</h3>
            <p>Mostra por onde o olhar de quem assiste vai passar, antes de você apresentar.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-upload" />
            </svg>
            <h3>Importa o que você já tem</h3>
            <p>Arquivos .pptx e .pdf viram slides editáveis.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-download" />
            </svg>
            <h3>Exporta para tudo</h3>
            <p>HTML interativo, PDF e PowerPoint editável ou idêntico.</p>
          </li>
          <li>
            <svg aria-hidden="true">
              <use href="#i-users" />
            </svg>
            <h3>Times e versões</h3>
            <p>Comentários por slide, histórico de versões e administração.</p>
          </li>
        </ul>
        <div className="p-cta">
          <Link className="btn btn-ghost" href="/estudio">
            Abrir o Estúdio{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
