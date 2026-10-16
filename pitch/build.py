#!/usr/bin/env python3
"""Monta o Pitch Halor em um único HTML, sem chamadas de rede.

    python3 pitch/build.py            -> pitch/index.html
    python3 pitch/build.py --out X    -> grava em outro caminho

Ordem: css/*.css, html/*.html e js/*.js em ordem alfabética (o prefixo numérico manda).
O roteiro (src/roteiro.json) vira `const ROTEIRO = {...}` antes dos scripts.
As fontes (Sora, Instrument Sans, JetBrains Mono) são embutidas em base64 a partir de apps/web/app/fonts.
Se existir pitch/audio/narration.mp3, a narração também é embutida (data URI); use --no-audio para deixá-la de fora.
"""
import base64
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "src"
ROOT = HERE.parent
FONTS = ROOT / "apps" / "web" / "app" / "fonts"

TITLE = "Pitch Halor"
DESCRIPTION = "Pitch lúdico do Halor, o programa de apresentações vivas em HTML: a Bia apresenta o efeito halo, o Estúdio e o Raio Halor em dois minutos."
FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='16' fill='%2307040f'/%3E"
           "%3Cpath d='M55.56 21.01A26 26 0 1 1 42.99 8.44' fill='none' stroke='%23a970ff' stroke-width='5.5' stroke-linecap='round'/%3E"
           "%3Ccircle cx='32' cy='32' r='8.5' fill='%23f4eeff'/%3E"
           "%3Cpath d='M50.4 6.4Q50.4 13.6 57.6 13.6Q50.4 13.6 50.4 20.8Q50.4 13.6 43.2 13.6Q50.4 13.6 50.4 6.4Z' fill='%23fff'/%3E%3C/svg%3E")

FONT_FACES = [
    ("Sora", "sora-latin-wght-normal.woff2", "100 800"),
    ("Instrument Sans", "instrument-sans-latin-400-normal.woff2", "400"),
    ("Instrument Sans", "instrument-sans-latin-500-normal.woff2", "500"),
    ("Instrument Sans", "instrument-sans-latin-600-normal.woff2", "600"),
    ("Instrument Sans", "instrument-sans-latin-700-normal.woff2", "700"),
    ("JetBrains Mono", "jetbrains-mono-latin-400-normal.woff2", "400"),
    ("JetBrains Mono", "jetbrains-mono-latin-500-normal.woff2", "500"),
    ("JetBrains Mono", "jetbrains-mono-latin-600-normal.woff2", "600"),
]


def read_all(folder, ext):
    return "\n".join(p.read_text(encoding="utf-8") for p in sorted((SRC / folder).glob("*" + ext)))


def font_css():
    out = []
    for family, file, weight in FONT_FACES:
        data = base64.b64encode((FONTS / file).read_bytes()).decode("ascii")
        out.append(f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};font-display:block;"
                   f"src:url(data:font/woff2;base64,{data}) format('woff2')}}")
    return "\n".join(out)


def main():
    css = read_all("css", ".css")
    html = read_all("html", ".html")
    js = read_all("js", ".js")
    roteiro = json.loads((SRC / "roteiro.json").read_text(encoding="utf-8"))

    audio_tag = ""
    audio = HERE / "audio" / "narration.mp3"
    if audio.exists() and "--no-audio" not in sys.argv:
        data = base64.b64encode(audio.read_bytes()).decode("ascii")
        audio_tag = f'<audio id="narr" preload="auto" src="data:audio/mpeg;base64,{data}"></audio>\n'

    head = (
        f'<title>{TITLE}</title>\n'
        f'<meta name="description" content="{DESCRIPTION}">\n'
        '<meta name="theme-color" content="#07040f">\n'
        '<style>:root{color-scheme:dark;background:#000}</style>\n'
        f'<link rel="icon" href="{FAVICON}">\n'
        f'<style>\n{font_css()}\n</style>\n'
        f'<style>\n{css}\n</style>\n'
    )
    body = (
        f'{html}\n{audio_tag}'
        f'<script>\nconst ROTEIRO = {json.dumps(roteiro, ensure_ascii=False)};\n</script>\n'
        f'<script>\n{js}\n</script>\n'
    )
    doc = (
        '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'{head}</head>\n<body>\n{body}</body>\n</html>\n'
    )
    out = pathlib.Path(sys.argv[sys.argv.index("--out") + 1]) if "--out" in sys.argv else HERE / "index.html"
    out.write_text(doc, encoding="utf-8")
    print(f"{out}  {len(doc) / 1024:.0f} KB")

    # fragmento sem <html>/<head>/<body>, para hospedagens que já envolvem a página (artifact do claude.ai)
    if "--fragment" in sys.argv:
        dest = pathlib.Path(sys.argv[sys.argv.index("--fragment") + 1])
        dest.parent.mkdir(parents=True, exist_ok=True)
        frag = head + body
        dest.write_text(frag, encoding="utf-8")
        print(f"{dest}  {len(frag) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
