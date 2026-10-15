#!/usr/bin/env python3
"""Monta o Halor em um único HTML.

    python3 src/build.py            -> index.html (documento completo, abre direto no navegador)
    python3 src/build.py --out CAMINHO
                                    -> grava o documento completo em outro lugar (testes em paralelo)
    python3 src/build.py --fragment CAMINHO
                                    -> também grava uma versão sem <html>/<head>/<body>
                                       (para hospedagens que já envolvem a página)

Ordem: css/*.css, html/*.html e js/*.js em ordem alfabética (o prefixo numérico manda).
O build não faz chamadas de rede; as fontes vêm do Google Fonts no navegador.
"""
import pathlib
import shutil
import sys

SRC = pathlib.Path(__file__).resolve().parent
ROOT = SRC.parent

TITLE = "Halor"
DESCRIPTION = "Halor: plataforma de apresentações que transforma atenção em proposta aceita."
FONTS = ("https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700"
         "&family=JetBrains+Mono:wght@400;500;600&family=Unbounded:wght@500;600;700&display=swap")
FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='16' fill='%2307040f'/%3E"
           "%3Cpath d='M55.56 21.01A26 26 0 1 1 42.99 8.44' fill='none' stroke='%23a970ff' stroke-width='5.5' stroke-linecap='round'/%3E"
           "%3Ccircle cx='32' cy='32' r='8.5' fill='%23f4eeff'/%3E"
           "%3Cpath d='M50.4 6.4Q50.4 13.6 57.6 13.6Q50.4 13.6 50.4 20.8Q50.4 13.6 43.2 13.6Q50.4 13.6 50.4 6.4Z' fill='%23fff'/%3E%3C/svg%3E")


def read_all(folder, ext):
    return "\n".join(p.read_text(encoding="utf-8") for p in sorted((SRC / folder).glob("*" + ext)))


def main():
    css = read_all("css", ".css")
    html = read_all("html", ".html")
    js = read_all("js", ".js")

    head = (
        f'<title>{TITLE}</title>\n'
        f'<meta name="description" content="{DESCRIPTION}">\n'
        '<meta name="theme-color" content="#07040f">\n'
        f'<link rel="icon" href="{FAVICON}">\n'
        '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        f'<link rel="stylesheet" href="{FONTS}">\n'
        f'<style>\n{css}\n</style>\n'
    )
    body = (
        '<a class="skip" href="#conteudo">Pular para o conteúdo</a>\n'
        f'{html}\n<script>\n{js}\n</script>\n'
    )

    doc = (
        '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'{head}</head>\n<body>\n{body}</body>\n</html>\n'
    )
    if "--out" in sys.argv:
        out = pathlib.Path(sys.argv[sys.argv.index("--out") + 1])
        out.write_text(doc, encoding="utf-8")
        print(f"{out}  {len(doc) / 1024:.0f} KB")
        return
    out = ROOT / "index.html"
    out.write_text(doc, encoding="utf-8")
    print(f"index.html  {len(doc) / 1024:.0f} KB")

    shutil.copyfile(SRC / "css" / "00-tokens.css", ROOT / "design-system" / "halor-tokens.css")

    if "--fragment" in sys.argv:
        dest = pathlib.Path(sys.argv[sys.argv.index("--fragment") + 1])
        frag = ('<meta name="claude:viewport-fit-sides" content="cover">\n' + head + body)
        dest.write_text(frag, encoding="utf-8")
        print(f"{dest.name}  {len(frag) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
