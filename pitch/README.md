# Pitch Halor · a história em dois minutos

Vídeo-pitch lúdico do Halor, contado pela **Bia**, a berinjela IA do Halor. Segue a mesma estrutura do pitch
anterior (oportunidade, apresentação, o que faz, efeito halo, cadeia, depois da sala, dez anos, estúdio,
começar, importar, exportar, antes de apresentar, fecho), agora inteiramente na identidade Halor: mundo Noite
com o Campo Halor na abertura e no fecho, mundo Papel no Estúdio, símbolo com o anel aberto, Sora, Instrument Sans e
JetBrains Mono.

```
pitch/
├─ index.html            O pitch em um arquivo só (gerado): abre em qualquer navegador, sem rede
├─ build.py              Monta o index.html a partir de src/ (fontes e narração embutidas em base64)
├─ src/
│  ├─ roteiro.json       Roteiro: cenas, chips, falas com tempos, visual previsto
│  ├─ css/               00 tokens da marca · 10 motor · 20 Bia · 30 componentes · 40 cenas
│  ├─ html/              00 sprite · 01 Bia (template SVG) · 02 props · 03/90 palco · 10 a 22 cenas 1 a 13
│  └─ js/                10 motor · 20 tabelas de pose e rosto da Bia
├─ audio/
│  ├─ take1-raw.mp3      Narração gravada (ElevenLabs, voz Bruna da Costa, eleven_v4)
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
(relativo ao início da cena) com animações CSS pausadas e `animation-delay` negativo; a Bia é um rig SVG dirigido
por variáveis CSS que o motor interpola entre poses (`data-keys`); o Campo Halor usa um gerador com semente e passo
fixo. Qualquer `T` reproduz o mesmo quadro, então o vídeo é gravado quadro a quadro, sem depender de tempo real,
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

- O Halor fala de atenção, participação e lembrança. Nada de travessão. Nada do produto anterior.
- O anel do símbolo nunca fecha: a abertura é o significado (vale para o portal da cena 10).
- A carimbada da Bia tem três tempos (ergue, bate, onda de luz) e só acontece quando um slide ganha vida.
