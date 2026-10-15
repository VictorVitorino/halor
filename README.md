# Halor · A venda segue a luz.

Nova marca, design system e protótipo navegável da plataforma de apresentações que antes se chamava **Canteiro**.
Abra `index.html` direto no navegador: um único arquivo, sem build obrigatório, com todas as telas.

## A ideia

**Halo + valor = Halor.** O nome junta o *efeito halo* (Thorndike, 1920: a primeira impressão contamina todo o julgamento)
com o valor que ele gera numa negociação. A marca organiza a venda em uma cadeia de sete anéis:

> Atenção → Interesse → Curiosidade → Aproximação → Confiança → Parceria → Proposta

Visto de cima, todo funil é um halo. Cada anel vira um indicador no **Painel Halor**, e o logo é esse halo:
um anel aberto (atenção), um anel interno (confiança), um núcleo aceso (proposta) e uma faísca (o primeiro olhar).

## Telas do protótipo

A barra flutuante "Protótipo" leva a todas. Cada uma também abre por endereço (`index.html#painel`, por exemplo).

| Endereço | Tela | Mundo |
|---|---|---|
| `#site` | Site: hero com halos neon, **filme de 48 s** (roteiro em canvas + DOM, trilha opcional), efeito Halor interativo, ciência, prévia do Painel, produto, planos, FAQ | Noite |
| `#entrar` | Entrar · criar conta · esqueci a senha · definir senha (o halo da esquerda "olha" o e-mail e fecha o olho na senha) | Noite + Papel |
| `#assinar` | Checkout: plano, ciclo, pessoas, Pix / cartão (cartão ao vivo) / boleto, cupom `PRIMEIROOLHAR`, confirmação | Papel |
| `#estudio` | Início (a nova capa): saudação, Índice Halor da semana, atalhos, acervo, modelos, sinais da cadeia | Papel |
| `#editor` | Editor: menus, faixa de inserção, trilho de slides, **Raio Halor** (mapa de atenção previsto), inspetor Design / Animação / Halor | Papel |
| `#painel` | Painel Halor: índice, KPIs, linha mensal, cadeia antes × com Halor, mapa de atenção por slide, tabelas | Papel |
| `#apresentar` | Palco: slide atual, próximo, notas, cronômetro e pulso da audiência | Noite |
| `#admin` | Administração: pessoas, papéis, convites, espaço | Papel |
| `#marca` | Manual da marca: conceito, logo, cores, tipografia, componentes, movimento, voz, aplicações, Canteiro → Halor, próximas ondas, tokens | Papel + Noite |

Todos os números do painel são **ilustrativos** (carteira de exemplo). Formulários e pagamento são simulação: nada é enviado.

## Design system

- **Tokens:** `design-system/halor-tokens.css`. Os componentes usam só papéis (`--bg`, `--text`, `--accent`…);
  trocar de mundo é trocar a classe `.theme-night` ou `.theme-paper`.
- **Cores-núcleo:** Vazio `#07040F` · Violeta Halor `#8B3DFF` · Neon `#A970FF` · Brilho `#C9A6FF` · Lúmen `#F4EEFF`.
  Estúdio: Papel `#FFFFFF` · Névoa `#F8F6FE` · Lilás `#F3EEFF` · Tinta `#17112B`.
- **Escala da Cadeia Halor:** rampa ordinal de 7 tons validada (luminosidade monotônica, passos visíveis) para Papel e Noite.
- **Tipografia:** Unbounded (display e logo) · Instrument Sans (interface e texto) · JetBrains Mono (dados e rótulos).
- **Logo:** `brand/halor-logo-{night,paper,mono}.svg`, `brand/halor-mark-*.svg`, `brand/halor-app-icon.svg`
  (palavra convertida em contornos, não depende de fonte instalada).

## Como editar

```
src/
  css/   00-tokens · 10-base · 20-site · 30-film · 40-auth · 50-studio · 60-dash · 70-brand
  html/  00-sprite (logo e ícones) · 05-proto · 10-site · 20-auth · 30-studio · 40-brand
  js/    00-core (roteador) · 10-halo (canvas) · 20-film · 30-site · 40-dash · 50-studio · 60-auth · 70-brand · 99-boot
  build.py
```

```
python3 src/build.py      # gera index.html e copia os tokens para design-system/
```
