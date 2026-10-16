/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
export default function Faq() {
  return (
    <section className="s-sec s-faq theme-lilac" id="faq">
      <div className="wrap faq-grid">
        <div>
          <p className="eyebrow">Perguntas</p>
          <h2 className="display">O que todo mundo pergunta.</h2>
        </div>
        <div className="faq">
          <details open>
            <summary>O que é o efeito halo, na prática?</summary>
            <p>
              É a tendência de julgar tudo a partir de uma primeira impressão. Se a capa e os primeiros slides passam cuidado e clareza, quem assiste tende a confiar mais nos números e nas ideias que vêm depois.
            </p>
          </details>
          <details>
            <summary>Preciso saber design para usar?</summary>
            <p>
              Não. Os modelos e o kit de marca já resolvem cores, fontes e espaçamento. O Raio Halor aponta o que ajustar em cada slide, em linguagem simples.
            </p>
          </details>
          <details>
            <summary>Meus arquivos de PowerPoint funcionam?</summary>
            <p>
              Sim. Importe .pptx ou .pdf e continue editando. Na saída, exporte PowerPoint editável, PowerPoint idêntico, PDF ou HTML interativo.
            </p>
          </details>
          <details>
            <summary>Como o Halor mede a atenção sem invadir a privacidade?</summary>
            <p>
              Medimos a leitura do link: tempo por slide, profundidade e compartilhamentos. Não usamos câmera nem rastreamento fora do Halor. Os dados ficam no Brasil e seguem a LGPD.
            </p>
          </details>
          <details>
            <summary>Vocês têm planos para empresas?</summary>
            <p>
              Sim. O pacote Empresa 20 reúne 20 usuários, e o Empresa 50 a 100 vai de 50 a 100 usuários, em passos de 10. Os dois trazem tudo do Órbita, painel do administrador e kit de marca por área, com preço menor por pessoa. Acima de 100 pessoas, o plano Constelação monta um ambiente dedicado.{' '}
              <a href="#planos-empresas">Ver os pacotes</a>
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
