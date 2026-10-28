#!/usr/bin/env python3
"""Sigilla le risposte di un quiz: sostituisce ogni "risposta": "..." con
"hash": sha256(testo + "\\n" + risposta), così la soluzione non si legge
nel sorgente della pagina pubblicata.

Uso:  python3 tools/sigilla.py docs/quiz/nome-quiz.html
Idempotente: le domande già sigillate restano com'erano.
"""
import hashlib, json, re, sys

def norm(s): return " ".join(str(s).split())

def sigilla_json(dati):
    n = 0
    for d in dati["domande"]:
        if "risposta" in d:
            r = norm(d.pop("risposta"))
            if r not in map(norm, d["opzioni"]):
                sys.exit(f"ERRORE: la risposta «{r}» non è tra le opzioni di: {d['testo']}")
            d["hash"] = hashlib.sha256((norm(d["testo"]) + "\n" + r).encode()).hexdigest()
            n += 1
    return n

def main(path):
    html = open(path, encoding="utf-8").read()
    m = re.search(r'(<script type="application/json" id="quiz">)(.*?)(</script>)', html, re.S)
    if not m: sys.exit("Blocco <script type=\"application/json\" id=\"quiz\"> non trovato")
    dati = json.loads(m.group(2))
    n = sigilla_json(dati)
    nuovo = json.dumps(dati, ensure_ascii=False, indent=2)
    open(path, "w", encoding="utf-8").write(html[:m.start(2)] + "\n" + nuovo + "\n" + html[m.end(2):])
    print(f"{path}: sigillate {n} risposte")

if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(__doc__)
    for p in sys.argv[1:]: main(p)
