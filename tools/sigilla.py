#!/usr/bin/env python3
"""Sigilla le risposte di un quiz: sostituisce ogni "risposta": "..." con
"hash": sha256(testo + "\\n" + risposta), così la soluzione non si legge
nel sorgente della pagina pubblicata. Vale per i blocchi
<script type="application/json" id="quiz"> e id="gates" (le domande di
sblocco dei percorsi a passi) e per id="esercizi" (esercizi interattivi:
ogni esercizio ha "soluzioni": [[chiave, valore], ...] che diventano
"hash": [sha256(id|chiave|valore normalizzato), ...]).

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

def norm_val(s):
    s = str(s).lower().replace("\u2019", "'").replace("\u00b4", "'")
    s = re.sub(r"[.,;:!?\"\u00ab\u00bb()\u2026]", "", s)
    s = s.replace("'", " ")
    return " ".join(s.split())

def norm_r(s):
    """parole di una frase: minuscole, senza punteggiatura, apostrofi conservati (per i pezzi di «riscrivi»)"""
    s = str(s).lower().replace("\u2019", "'").replace("\u00b4", "'")
    return re.sub(r"[.,;:!?\"\u00ab\u00bb()\u2026]", " ", s).split()

def dels(s):
    """la parola e tutte le varianti con una lettera tolta (controllo ortografico a distanza 1)"""
    return {s} | {s[:i] + s[i + 1:] for i in range(len(s))}

def h16(s): return hashlib.sha256(s.encode()).hexdigest()[:16]

def sigilla_esercizi(dati):
    n = 0
    for e in dati["esercizi"]:
        if "soluzioni" in e:
            sol = e.pop("soluzioni")
            e["hash"] = sorted({hashlib.sha256(f"{e['id']}|{k}|{norm_val(v)}".encode()).hexdigest() for k, v in sol})
            if e.get("quasi") is True:  # varianti ortografiche (hash corti)
                e["quasi"] = sorted({h16(f"{e['id']}|{k}|{d}") for k, v in sol for d in dels(norm_val(v))})
            n += 1
        if "canon" in e:  # riscrivi: posizione delle parole della frase canonica
            canon = e.pop("canon"); hh, qq, nn = set(), set(), {}
            for k, frase in canon.items():
                ws = norm_r(frase); nn[k] = len(ws)
                for i, w in enumerate(ws):
                    hh.add(h16(f"{e['id']}|{k}|p{i}|{w}"))
                    qq |= {h16(f"{e['id']}|{k}|p{i}|{d}") for d in dels(w)}
            e["pezzi"] = {"n": nn, "h": sorted(hh), "q": sorted(qq)}
        if "chiavi" in e:  # leggi: parole chiave per ogni domanda
            ch = e.pop("chiavi"); hh, nn = set(), {}
            for k, slots in ch.items():
                nn[k] = len(slots)
                for i, alts in enumerate(slots):
                    for a in alts: hh.add(h16(f"{e['id']}|{k}|k{i}|{norm_val(a).replace('-', ' ')}"))
            e["hk"] = {"n": nn, "h": sorted(hh)}
    return n

def main(path):
    html = open(path, encoding="utf-8").read()
    n = 0; found = False
    for ident in ("quiz", "gates", "esercizi"):
        m = re.search(r'(<script type="application/json" id="%s">)(.*?)(</script>)' % ident, html, re.S)
        if not m: continue
        found = True
        dati = json.loads(m.group(2))
        n += sigilla_esercizi(dati) if ident == "esercizi" else sigilla_json(dati)
        nuovo = json.dumps(dati, ensure_ascii=False, indent=None if ident == "esercizi" else 2)
        html = html[:m.start(2)] + "\n" + nuovo + "\n" + html[m.end(2):]
    if not found: sys.exit("Nessun blocco <script type=\"application/json\" id=\"quiz\"> trovato")
    open(path, "w", encoding="utf-8").write(html)
    print(f"{path}: sigillate {n} risposte")

if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(__doc__)
    for p in sys.argv[1:]: main(p)
