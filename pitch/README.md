# Pitch Halor · a história em dois minutos

Vídeo-pitch lúdico do Halor, contado pela **Bia**, a berinjela IA do Halor, ao lado do **cliente** (a mesma
berinjela em lilás, de óculos e gravatinha). A narrativa e o storytelling são os do vídeo de referência, cena a
cena (a oportunidade, a chegada, peça por peça, efeito halo, impressionar → decidir, do papel ao contrato, dez anos,
o editor, projetos e efeitos, importar, exportar, ajuste na hora, fecho), com a identidade visual do Halor:
abertura no escuro com o Campo Halor que vira o mundo lavanda (cenas 1 a 7), mundo noite nas demonstrações do
sistema (8 a 12) e no fecho (13), símbolo com o anel aberto, Sora, Instrument Sans e JetBrains Mono.

```
pitch/
├─ index.html            O pitch em um arquivo só (gerado): abre em qualquer navegador, sem rede
├─ build.py              Monta o index.html a partir de src/ (fontes e narração embutidas em base64)
├─ src/
│  ├─ roteiro.json       Roteiro: cenas, chips, falas com tempos, visual previsto
│  ├─ css/               00 tokens da marca · 10 motor · 20 Bia · 30 componentes · 40 cenas
│  ├─ html/              00 sprite · 01 Bia (template SVG) · 02 props · 03/90 palco · 10 a 22 cenas 1 a 13
│  └─ js/                05 tabelas de pose e rosto da Bia (carregam antes do motor) · 10 motor
├─ audio/
│  ├─ take1-raw.mp3      Narração gravada (ElevenLabs, voz Dani, carioca, eleven_v4)
│  ├─ words.json         Palavras com tempo (ElevenLabs Scribe)
│  ├─ narration.mp3      Narração com os respiros por cena (gerada por render/align.py)
│  └─ timing.json        Tabela de cenas e falas em ms
├─ render/
│  ├─ align.py           Corta a narração por cena, insere respiros e grava os tempos no roteiro
│  ├─ render.mjs         Playwright → ffmpeg, quadro a quadro, com áudio e folha de contato
│  └─ shot.mjs           Captura quadros isolados para revisão
├─ preview/              Provas visuais da Bia e dos props
└─ out/halor-pitch.mp4   O vídeo (1080p, 30 fps, com narração)
```

## Como funciona

Tudo o que se move é função de um relógio só, `--t` em milissegundos. Cada elemento entra em `--in`
(relativo ao início da cena) com animações CSS pausadas e `animation-delay` negativo. Os tempos podem ser
ancorados nas palavras da narração: o `align.py` grava em cada cena do roteiro um dicionário `w` (palavra → ms) e
o motor escreve `--w-<palavra>` na seção, então `--in: var(--w-oportunidade)` ou `calc(var(--w-decisao) + 300)`
seguem a voz mesmo quando a narração é regravada; nas chaves da Bia a mesma âncora é `@palavra+300`. A Bia é um
rig SVG dirigido por variáveis CSS que o motor interpola entre poses (`data-keys`), com loops de vida contínuos
(flutuação, braços, olhar, piscada, halo); `data-skin="cliente"` dá a variante do cliente. O Campo Halor usa um
gerador com semente e passo fixo; uma cena pode trocar de mundo no meio (`data-world-from`, `data-world-at`,
`data-world-cx/cy`) e apagar o campo (`data-field-until`). Qualquer `T` reproduz o mesmo quadro, então o vídeo é gravado quadro a quadro, sem depender de tempo real,
e o HTML continua sendo uma apresentação ao vivo: espaço pausa, setas trocam de cena, R repete, M silencia, F tela cheia.

## Comandos

```bash
python3 pitch/build.py                                   # gera pitch/index.html
python3 pitch/render/align.py                            # realinha os tempos à narração (depois de trocar o áudio)
/opt/node22/bin/node pitch/render/render.mjs --in pitch/index.html --out pitch/out/halor-pitch.mp4 \
  --workers 3 --audio pitch/audio/narration.mp3          # renderiza o vídeo
/opt/node22/bin/node pitch/render/render.mjs --in pitch/index.html --sheet pitch/out/sheet.png --every 2000
```

Para trocar a narração: grave o texto de `roteiro.json` (um parágrafo por cena), salve em `audio/take1-raw.mp3`,
salve as palavras com tempo em `audio/words.json` e rode `align.py`; os respiros por cena ficam na tabela
`LEAD`/`TAIL` do script.

## Regras seguidas

- A história, as falas e as composições são as do vídeo de referência; só a identidade visual, a paleta, a
  mascote e o produto demonstrado são do Halor. Nada de travessão.
- O anel do símbolo nunca fecha: a abertura é o significado (o halo da Bia é o mesmo anel aberto).
- A Bia não usa boina nem carimbo: tem o halo flutuante e peças próprias (tablet, clicker, lupa, varinha), e nunca
  fica parada.
