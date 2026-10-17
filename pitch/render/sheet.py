#!/usr/bin/env python3
"""Folha de contato dos quadros capturados por shot.mjs.

    python3 pitch/render/sheet.py <pasta com tNNNNNN.jpg> <saida.jpg> [colunas=4] [largura_celula=480]
"""
import glob, os, sys
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
cw = int(sys.argv[4]) if len(sys.argv) > 4 else 480
fs = sorted(glob.glob(os.path.join(src, 't*.jpg')))
ch = cw * 9 // 16
rows = (len(fs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, rows * (ch + 18)), 'black'); d = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    im = Image.open(f).resize((cw, ch)); x = (i % cols) * cw; y = (i // cols) * (ch + 18)
    sheet.paste(im, (x, y + 18)); d.text((x + 4, y + 3), os.path.basename(f)[1:-4].lstrip('0') + ' ms', fill='white')
sheet.save(out, quality=82); print(out, sheet.size)
