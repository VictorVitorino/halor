# Pitch Halor · o vídeo em dois atos

Vídeo-pitch do Halor, conduzido pela **Bia** (a guia do Halor) ao lado do **cliente** (a mesma berinjela em
lilás, de óculos e gravatinha), narrado pela Dani (voz carioca). São cerca de dois minutos em dois atos:

- **Ato 1 · O que o Halor é** (cenas 1 a 7, mundo noite). Logo de cara: um programa de apresentações lúdicas
  que não exige código nem inteligência artificial para construir. A ferramenta editando ao vivo (clique,
  arraste, edite), mais de 40 efeitos e animações, personagens que vivem dentro da apresentação, o upload de um
  PDF ou PowerPoint que tem cada frame identificado e transformado em slides lúdicos, as demais funcionalidades
  (kit de marca, votação ao vivo, notas, cronômetro, Raio Halor e Painel) e, por último, o download em HTML
  interativo, PDF ou PowerPoint editável ou idêntico.
- **Ato 2 · O olhar Halor** (cenas 8 a 13, mundo papel com palcos escuros, fecho na noite). O efeito halo, o
  primeiro olhar em 50 milissegundos (Lindgaard et al., 2006), o olhar Halor (luz no que importa, movimento com
  propósito, plateia participando), os segundos de atenção que cada efeito ganha e o Painel que mede isso slide a
  slide (simulação ilustrativa), atenção que vira lembrança e decisão, e o fecho com a marca.

A linguagem visual segue um guia de 40 efeitos de apresentação (Motion Graphics, Icon Motion, Glow / Light
Sweep, Hologram 3D Cards, Reveal / Mask Reveal, Chart Build, Counter, Connector / Flow Line, Timeline Motion,
Animated Shader e outros), sempre na paleta e na tipografia do Halor: brilho em cada clique, ícones que se
desenham, máscaras, câmera que empurra, luz vazada e contadores.

```
pitch/
├─ index.html            O pitch em um arquivo só (gerado): abre em qualquer navegador, sem rede
├─ build.py              Monta o index.html a partir de src/ (fontes e narração embutidas em base64)
├─ src/
│  ├─ roteiro.json       Roteiro: cenas, chips, falas com tempos e tempo de cada palavra
│  ├─ css/               00 tokens · 10 motor · 20 Bia · 30 componentes · 35 kit de movimento · 41 a 53 cenas 1 a 13
│  ├─ html/              00 sprite · 01 Bia (template SVG) · 02 props · 03/90 palco · 10 a 22 cenas 1 a 13
│  └─ js/                05 tabelas de pose e rosto da Bia (carregam antes do motor) · 10 motor
├─ audio/
│  ├─ take1-raw.mp3      Narração gravada (ElevenLabs, voz Dani, carioca, eleven_v4)
│  ├─ words.json         Palavras com tempo (ElevenLabs Scribe)
│  ├─ narration.mp3      Narração com os respiros por cena (gerada por render/align.py)
│  └─ timing.json        Tabela de cenas e falas em ms
├─ render/
│  ├─ align.py           Alinha a transcrição ao roteiro, insere respiros e grava os tempos por palavra
│  ├─ render.mjs         Playwright → ffmpeg, quadro a quadro, com áudio e folha de contato
│  ├─ shot.mjs           Captura quadros isolados para revisão
│  └─ sheet.py           Monta uma folha de contato com quadros capturados
├─ preview/              Provas visuais da Bia e dos props
├─ out/halor-pitch.mp4   O vídeo em 1080p (30 fps, com narração), reduzido do master 4K
└─ out/halor-pitch-4k.mp4  O master em 4K (3840×2160), quando couber no repositório
```

## Como funciona

Tudo o que se move é função de um relógio só, `--t` em milissegundos. Cada elemento entra em `--in`
(relativo ao início da cena) com animações CSS pausadas e `animation-delay` negativo (`.k` entra, `.kx` sai,
`.l` repete). Os tempos são ancorados nas palavras da narração: o `align.py` grava em cada cena do roteiro um
dicionário `w` (palavra → ms) e o motor escreve `--w-<palavra>` na seção, então `--in: var(--w-upload)` ou
`calc(var(--w-cresce) + 300)` seguem a voz mesmo quando a narração é regravada; nas chaves da Bia a mesma âncora
é `@palavra+300`. O kit de movimento (`35-kit.css`) traz o brilho de clique, o cursor com halo, o Icon Motion,
as máscaras, a câmera, a luz vazada e o beacon; cada cena tem o próprio CSS com classes prefixadas (`.s7-…`).
A Bia é um rig SVG dirigido por variáveis CSS que o motor interpola entre poses (`data-keys`), com loops de vida
contínuos; `data-skin="cliente"` dá a variante do cliente. Qualquer `T` reproduz o mesmo quadro, então o vídeo é
gravado quadro a quadro, sem depender de tempo real, e o HTML continua sendo uma apresentação ao vivo: espaço
pausa, setas trocam de cena, R repete, M silencia, F tela cheia.

## Comandos

```bash
python3 pitch/build.py                                   # gera pitch/index.html
python3 pitch/build.py --only s5 --no-audio --out /tmp/s5.html   # uma cena isolada, para revisar
python3 pitch/render/align.py                            # realinha os tempos à narração (depois de trocar o áudio)
node pitch/render/shot.mjs file:///tmp/s5.html /tmp/f 39000 41000 44000   # quadros nos tempos absolutos
python3 pitch/render/sheet.py /tmp/f /tmp/folha.jpg      # folha de contato
/opt/node22/bin/node pitch/render/render.mjs --in pitch/index.html --out pitch/out/halor-pitch-4k.mp4 \
  --workers 4 --scale 2 --crf 18 --jpeg 95 --audio pitch/audio/narration.mp3   # o master em 4K (3840×2160)
ffmpeg -i pitch/out/halor-pitch-4k.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -crf 18 \
  -pix_fmt yuv420p -movflags +faststart -c:a copy pitch/out/halor-pitch.mp4   # o 1080p, reduzido do 4K
```

O palco é vetorial (HTML, CSS e SVG), então `--scale 2` captura cada quadro em 4K de verdade, sem
ampliação. O 1080p sai do 4K por redução (supersampling), o que deixa bordas e textos mais limpos do que a
captura direta em 1080p. Em 4K cada quadro leva alguns segundos para rasterizar (os brilhos e desfoques
custam caro); com quatro trabalhadores o filme inteiro leva perto de uma hora.

Para trocar a narração: grave o texto de `roteiro.json` (um parágrafo por cena), salve em `audio/take1-raw.mp3`,
salve as palavras com tempo em `audio/words.json` e rode `align.py`; os respiros por cena ficam na tabela
`LEAD`/`TAIL` do script.

## Regras seguidas

- O Halor não exige IA para construir: a Bia é a guia e personagem, nunca uma "IA que gera".
- Os segundos de atenção são uma simulação ilustrativa e aparecem marcados assim; a citação dos 50 ms é
  Lindgaard et al., 2006.
- Do guia de efeitos vêm só a linguagem e a coreografia: nenhuma marca, nome ou cor de terceiros.
- O anel do símbolo nunca fecha: a abertura é o significado (o halo da Bia é o mesmo anel aberto). Nada de
  travessão nos textos.
