#!/usr/bin/env python3
"""Alinha o filme à narração.

Lê pitch/audio/take1-raw.mp3 (narração contínua) e pitch/audio/words.json (palavras com tempos, ElevenLabs Scribe),
corta a narração nos parágrafos (um por cena) e remonta com respiros antes e depois de cada cena
(tabela LEAD/TAIL abaixo). Grava:
  pitch/audio/narration.mp3   narração com os respiros (o que o filme toca)
  pitch/audio/timing.json     tabela de cenas e falas (ms) para conferência
e atualiza pitch/src/roteiro.json: `from`/`to` de cada cena e `at` de cada fala.

    python3 pitch/render/align.py
"""
import json
import pathlib
import subprocess

HERE = pathlib.Path(__file__).resolve().parent
PITCH = HERE.parent
AUDIO = PITCH / "audio"
ROTEIRO = PITCH / "src" / "roteiro.json"

# respiro antes da primeira palavra (lead) e depois da última (tail) de cada cena, em segundos
LEAD = {"s1": 1.6, "s2": .3, "s3": .3, "s4": .3, "s5": .3, "s6": .3, "s7": .3, "s8": .8, "s9": .3, "s10": .3, "s11": .3, "s12": .9, "s13": .3}
TAIL = {"s1": 1.3, "s2": 1.2, "s3": 1.2, "s4": 1.1, "s5": 1.0, "s6": .5, "s7": .4, "s8": .4, "s9": .9, "s10": 1.1, "s11": .5, "s12": 1.1, "s13": 1.8}


def norm(w):
    return "".join(ch for ch in w.lower() if ch.isalnum())


def main():
    words = json.loads((AUDIO / "words.json").read_text())["words"]
    words = [w for w in words if w.get("type", "word") == "word"]
    rot = json.loads(ROTEIRO.read_text(encoding="utf-8"))

    # casa as falas com as palavras, em sequência
    wi = 0
    scenes = []
    for sc in rot["scenes"]:
        lines = []
        for ln in sc["lines"]:
            toks = [t for t in ln["text"].split() if norm(t)]
            first = words[wi]
            for t in toks:
                assert norm(words[wi]["text"]) == norm(t), (ln["id"], words[wi]["text"], t)
                wi += 1
            last = words[wi - 1]
            lines.append({"id": ln["id"], "start": first["start"], "end": last["end"]})
        scenes.append({"id": sc["id"], "speech_start": lines[0]["start"], "speech_end": lines[-1]["end"], "lines": lines})
    assert wi == len(words), (wi, len(words))

    # cortes entre parágrafos: ponto médio do silêncio natural
    cuts = []
    for a, b in zip(scenes, scenes[1:]):
        cuts.append((a["speech_end"] + b["speech_start"]) / 2)
    total_raw = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(AUDIO / "take1-raw.mp3")]).decode())
    seg_bounds = [0.0] + cuts + [total_raw]

    # linha do tempo nova
    t = 0.0
    filt, inputs = [], []
    timeline = []
    for i, sc in enumerate(scenes):
        a, b = seg_bounds[i], seg_bounds[i + 1]
        lead_sil = LEAD[sc["id"]] - (sc["speech_start"] - a)     # silêncio a inserir antes do segmento
        tail_sil = TAIL[sc["id"]] - (b - sc["speech_end"])       # silêncio a inserir depois
        lead_sil = max(0.0, lead_sil); tail_sil = max(0.0, tail_sil)
        start = t + lead_sil                                     # onde o segmento começa na linha nova
        offset = start - a                                       # deslocamento das palavras deste segmento
        sc_from = t
        t = start + (b - a) + tail_sil
        timeline.append({"id": sc["id"], "from": sc_from, "to": t, "offset": offset,
                         "lines": [{"id": l["id"], "at": l["start"] + offset, "end": l["end"] + offset} for l in sc["lines"]]})
        filt.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[s{i}]")
        if lead_sil > 0.005:
            filt.append(f"anullsrc=r=44100:cl=mono,atrim=0:{lead_sil:.3f}[l{i}]"); inputs.append(f"[l{i}]")
        inputs.append(f"[s{i}]")
        if tail_sil > 0.005:
            filt.append(f"anullsrc=r=44100:cl=mono,atrim=0:{tail_sil:.3f}[t{i}]"); inputs.append(f"[t{i}]")
    filt.append("".join(inputs) + f"concat=n={len(inputs)}:v=0:a=1[out]")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(AUDIO / "take1-raw.mp3"), "-filter_complex", ";".join(filt), "-map", "[out]", "-ac", "1", "-ar", "44100", "-b:a", "160k", str(AUDIO / "narration.mp3")]
    subprocess.check_call(cmd)

    # grava roteiro e tabela
    by_id = {s["id"]: s for s in timeline}
    for sc in rot["scenes"]:
        s = by_id[sc["id"]]
        sc["from"] = int(round(s["from"] * 1000)); sc["to"] = int(round(s["to"] * 1000))
        for ln, l in zip(sc["lines"], s["lines"]):
            ln["at"] = int(round(l["at"] * 1000))
    ROTEIRO.write_text(json.dumps(rot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (AUDIO / "timing.json").write_text(json.dumps(timeline, indent=1), encoding="utf-8")
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(AUDIO / "narration.mp3")]).decode())
    print(f"narration.mp3 {dur:.2f} s · filme {timeline[-1]['to']:.2f} s")
    for s in timeline:
        print(f"{s['id']:>4} {s['from']*1000:7.0f} → {s['to']*1000:7.0f}  ({(s['to']-s['from']):5.2f} s)  " + "  ".join(f"{l['id']}@{(l['at']-s['from'])*1000:.0f}" for l in s["lines"]))


if __name__ == "__main__":
    main()
