# Halor · Faça cada olhar render.

Programa de apresentações lúdicas em HTML: apresentações vivas, que prendem o olhar do começo ao fim. Sem código.

Este repositório reúne **a marca, o design system e o front end** do Halor (antes chamado Canteiro).

```
halor/
├─ apps/web/            Front end em Next.js 16 (App Router, React 19, TypeScript, exportação estática)
├─ packages/brand/      Marca: logos, símbolo, ícones, imagem social e tokens de design (fonte única)
├─ packages/ui/         Componentes React do design system (Icon, Mark, Logo, Button, Chip, Eyebrow, sprite)
├─ prototype/           Protótipo original em arquivo único (referência visual e de comportamento)
└─ tools/               Conversor HTML → TSX e harness de comparação visual com o protótipo
```

## Começar

Requer Node 20.9 ou mais novo.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # gera o site estático em apps/web/out
npm run typecheck
npm run brand:assets # regenera tokens (JSON/TS), favicons, ícones e imagem social a partir de packages/brand
```

O build gera HTML estático por rota (`apps/web/out`), pronto para qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, S3). Variáveis opcionais:

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública, usada em metadados, sitemap e robots (padrão `https://halor.app`) |
| `NEXT_PUBLIC_HIDE_PROTO=1` | esconde a barra "Protótipo" de navegação entre telas |

## Rotas

| Rota | Tela | Mundo |
|---|---|---|
| `/` | Site: capa com o Campo Halor, filme "Conheça o Halor" (1 min 28 s), O efeito Halor, Produto, Linha do tempo (viagem no tempo), Vitrine de efeitos, Planos (inclui empresariais de 20 e de 50 a 100 usuários), Perguntas | Noite + Lavanda |
| `/entrar` | Entrar, criar conta, esqueci a senha, definir senha | Noite + Papel |
| `/assinar` | Checkout: plano, ciclo, pessoas, Pix, cartão ou boleto, cupom, confirmação | Papel |
| `/estudio` | Início do estúdio: Índice Halor, atalhos, acervo, modelos, sinais | Papel |
| `/editor` | Editor: faixa de inserção, trilho de slides, Raio Halor, inspetor | Papel |
| `/painel` | Painel Halor: atenção da plateia por apresentação e por slide | Papel |
| `/apresentar` | Palco do apresentador | Noite |
| `/admin` | Pessoas, papéis, convites | Papel |
| `/marca` | Manual da marca interativo | Papel + Noite |

Os números do painel são ilustrativos e formulários e pagamento são simulação: nada é enviado.

## Arquitetura do front end

- **Marcação fiel.** Cada tela nasceu da conversão automática do HTML do protótipo para TSX (`tools/html-to-tsx.mjs`), então o visual aprovado é preservado pixel a pixel.
- **Motores por tela.** O comportamento (filme, partículas, carrossel, editor, checkout…) vive em módulos TypeScript em `apps/web/lib/engines/<área>`. Cada tela liga os seus com o hook `useEngine(view, boot)`, que chama o motor ao montar e executa a limpeza ao sair. Os motores nunca tocam em `window` no carregamento do módulo (as páginas são pré-renderizadas no build) e removem todos os ouvintes, timers e observadores ao desmontar.
- **Núcleo compartilhado.** `lib/core.ts` (utilitários de DOM, toast, cópia, modais, ciclo das telas), `lib/slides.ts` (renderizador de slides usado no editor, palco, filme e site), `lib/engines/particles.ts` (Campo Halor), `lib/engines/halo.ts` (arcos neon), `lib/data/chain.ts` (Cadeia Halor).
- **Estilos.** `apps/web/styles/*.css` na mesma ordem do protótipo, importados por `app/globals.css`. Os tokens de `packages/brand/tokens/halor-tokens.css` são a fonte única; trocar de mundo é trocar a classe `.theme-night`, `.theme-paper` ou `.theme-lilac`.
- **Fontes.** Sora, Instrument Sans e JetBrains Mono auto-hospedadas com `next/font` (sem chamada externa).
- **Metadados.** Título, descrição, Open Graph, ícones, manifest PWA, robots e sitemap gerados pelo próprio Next.

## Qualidade

`tools/visual-diff.mjs` compara cada rota do app com a mesma tela do protótipo e imprime a diferença de pixels:

```bash
node tools/visual-diff.mjs --base http://127.0.0.1:3000 --routes site,entrar,estudio --widths 1440,390 --out /tmp/vd
```

## Protótipo

O protótipo de arquivo único continua em `prototype/` e gera o `prototype/index.html` publicado como artifact:

```bash
npm run prototype    # ou: python3 prototype/src/build.py
```

## Marca

Conceito, cores, tipografia, voz e usos do logo: [`packages/brand/README.md`](packages/brand/README.md) e a rota `/marca`.
