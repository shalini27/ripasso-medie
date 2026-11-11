#!/usr/bin/env python3
"""Genera i clip audio inglesi con Kokoro (voci britanniche) da una lista di frasi.

Uso:
  node tools/audio/frasi-inglese.js > /tmp/frasi.json
  ~/.local/venvs/tts/bin/python tools/audio/tts.py /tmp/frasi.json docs/assets/audio/inglese-describing-people \
      --model <cartella con kokoro-v1.0.onnx e voices-v1.0.bin>

Scrive un mp3 per frase (nome = voce + hash del testo) e manifest.json {testo: file}.
Frasi già presenti nel manifest non vengono rigenerate.
"""
import argparse, hashlib, json, os, sys

VOICES = {"q": "bf_emma", "a": "bm_george"}  # domande: voce femminile, risposte: voce maschile

ap = argparse.ArgumentParser()
ap.add_argument("frasi"); ap.add_argument("out"); ap.add_argument("--model", required=True)
ap.add_argument("--speed", type=float, default=0.95)
a = ap.parse_args()

import soundfile as sf
from kokoro_onnx import Kokoro
fmts = sf.available_formats()
if "MP3" not in fmts: sys.exit("libsndfile senza MP3: " + ", ".join(fmts))

os.makedirs(a.out, exist_ok=True)
mpath = os.path.join(a.out, "manifest.json")
manifest = json.load(open(mpath)) if os.path.exists(mpath) else {}
frasi = json.load(open(a.frasi))
kokoro = Kokoro(os.path.join(a.model, "kokoro-v1.0.onnx"), os.path.join(a.model, "voices-v1.0.bin"))

n = 0
for f in frasi:
    text, voice = f["text"], VOICES[f["voice"]]
    name = voice + "-" + hashlib.sha1(text.encode()).hexdigest()[:8] + ".mp3"
    if manifest.get(text) == name and os.path.exists(os.path.join(a.out, name)): continue
    samples, sr = kokoro.create(text, voice=voice, speed=a.speed, lang="en-gb")
    sf.write(os.path.join(a.out, name), samples, sr, format="MP3")
    manifest[text] = name; n += 1
    print(voice, name, text)

json.dump(manifest, open(mpath, "w"), ensure_ascii=False, indent=1)
print(f"{n} clip nuovi, {len(manifest)} in totale")
