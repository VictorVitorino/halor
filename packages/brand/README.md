# @halor/brand · a marca Halor

> **Faça cada olhar render.** Apresentações vivas, que prendem o olhar do começo ao fim.

O manual completo e interativo vive no site, na rota [`/marca`](../../apps/web/app/marca). Este pacote guarda as **fontes da verdade** da marca: logo, símbolo, ícones, imagem social e tokens de design.

## O conceito

**Halo + valor = Halor.** O nome vem do *efeito halo* (Thorndike, 1920): a primeira impressão contamina todo o julgamento que vem depois. O Halor transforma isso em produto: apresentações em HTML que se movem, respondem e chamam quem assiste para participar.

O símbolo é um **halo aberto**:

| Parte | Significado |
|---|---|
| Anel aberto | a atenção, que nunca se fecha |
| Anel interno | a confiança que se forma |
| Núcleo aceso | o valor que fica |
| Faísca | o primeiro olhar |

**Regra principal da marca:** o Halor fala de **capturar e manter a atenção da plateia**, não de vendas ou propostas.

## Arquivos

| Arquivo | Uso |
|---|---|
| `svg/halor-logo-night.svg` | logo em fundo escuro (padrão) |
| `svg/halor-logo-paper.svg` | logo em fundo claro (estúdio, documentos) |
| `svg/halor-logo-mono.svg` | uma cor, para gravação, carimbo e impressão simples |
| `svg/halor-mark-{night,paper,mono}.svg` | só o símbolo (avatar, selo, marca d'água) |
| `svg/halor-app-icon.svg` | ícone do app |
| `svg/halor-favicon.svg` | favicon vetorial |
| `png/favicon-{16,32,48}.png`, `png/apple-touch-icon.png` | favicons |
| `png/icon-{192,512}.png`, `png/icon-maskable-512.png` | PWA (o maskable mantém o símbolo na zona segura) |
| `png/og.png` | imagem social 1200 × 630 |
| `tokens/halor-tokens.css` | **fonte única** de cores, tipos, raios, sombras e movimento |
| `tokens/tokens.json`, `tokens/index.ts` | os mesmos tokens para código e ferramentas (gerados) |

A palavra "halor" está **convertida em contornos** nos SVGs: não depende de fonte instalada.

Para regenerar os derivados (tokens em JSON/TS, PNGs e a cópia em `apps/web/public/brand`):

```bash
npm run brand:assets      # na raiz do repositório; precisa do Playwright com Chromium
```

## Cores

| Token | Hex | Papel |
|---|---|---|
| Vazio · `--halor-void` | `#07040F` | fundo do mundo Noite |
| Noite · `--halor-night` | `#0E0820` | superfícies escuras |
| Violeta Halor · `--halor-violet` | `#8B3DFF` | cor de ação e de marca |
| Neon · `--halor-neon` | `#A970FF` | brilho, foco, destaques |
| Brilho · `--halor-glow` | `#C9A6FF` | luz suave, texto de apoio no escuro |
| Lúmen · `--halor-lumen` | `#F4EEFF` | texto no escuro |
| Papel | `#FFFFFF` | fundo do estúdio |
| Névoa | `#F8F6FE` | superfícies claras |
| Lavanda | `#F1EAFF` | faixas de contraste no site |
| Tinta | `#17112B` | texto no claro |

**Três mundos**, trocados por classe: `.theme-night` (site, palco), `.theme-paper` (estúdio, branco limpo com violeta neon leve) e `.theme-lilac` (faixas de contraste). Os componentes usam só papéis (`--bg`, `--text`, `--accent`…), então trocar de mundo é trocar a classe.

## Tipografia

| Família | Uso |
|---|---|
| **Sora** 500 a 700 | títulos, números grandes e a palavra do logo |
| **Instrument Sans** 400 a 700 | interface e texto corrido |
| **JetBrains Mono** 400 a 600 | dados, rótulos, sobretítulos em caixa alta |

## Movimento

- `--ease-halo: cubic-bezier(.22, .61, .36, 1)` para quase tudo; `--ease-spark` (com leve passada) só em pequenos acentos.
- Durações: `--t-fast` 120 ms, `--t-base` 240 ms, `--t-slow` 480 ms, `--t-cine` 900 ms.
- **Movimento com propósito:** guiar o olhar, dar ritmo, destacar o que importa. Tudo respeita `prefers-reduced-motion`.
- **Campo Halor:** partículas que se ligam por proximidade e respiram; o cursor reúne as partículas num halo. É a assinatura viva da marca.

## Voz

- Português do Brasil, frases curtas, concretas e calorosas.
- **Nunca usar travessão (—) nem meia-risca (–).** Use vírgula, ponto, dois-pontos ou "a" ("50 a 100").
- Falar de atenção, participação e lembrança. Evitar jargão de funil de vendas.

## Usos a evitar

- Distorcer, girar ou trocar as cores do símbolo.
- Fechar o anel aberto: a abertura é o significado.
- Colocar o logo Noite sobre fundo claro (use a versão Papel) ou sobre imagens sem contraste.
- Espaço livre menor que a altura do núcleo em volta do logo.
