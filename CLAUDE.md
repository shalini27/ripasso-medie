# Ripasso Medie — working rules for Claude

Revision guides and quizzes for Italian middle school (scuola media, 1ª–3ª),
written in Italian, published as a static site on GitHub Pages.

- Repo: https://github.com/shalini27/ripasso-medie (public)
- Site: https://shalini27.github.io/ripasso-medie/ (GitHub Pages, branch
  `main`, folder `/docs`; redeploys automatically ~1 minute after each push).
- Owner: Shalini (shalini27). Other parents open issues; they do not push.

## Privacy rules (non-negotiable)

- `sources/` holds textbook screenshots, photos, PDFs and private notes. It is
  git-ignored, as are all image/PDF types outside `docs/assets/img/`. Read from
  it freely; **never** copy or move files from it into `docs/`, never
  `git add -f` anything inside it, never mention file names from it in commits.
- No children's names, class names, school names or teachers' names in any
  committed file, commit message or issue comment.
- Published content is rewritten in our own words. No verbatim textbook
  paragraphs; a short quoted definition is fine.
- Before every push: `git status` must show nothing from `sources/` and no
  images.

## Layout

- `docs/` the published site. Plain HTML/CSS/JS, no build step, no Node.
- `docs/index.html` is the home: subject tiles, then (via `#<materia>`) that
  subject's pages, newest first (array order). It renders `docs/assets/elenco.js`; **add one
  entry there for every new page** at the TOP of the array (file, titolo,
  materia, classe, optional argomento, tipo, domande). A `data` field is
  optional and used **only if Shalini gives the date**; never invent one.
- Subject ids: italiano, storia, geografia, matematica, scienze, arte (storia
  dell'arte), inglese, musica, tecnologia, altro. Set `data-materia` on `<body>`.
- `docs/quiz/<materia>-<argomento>.html` one page per topic.
  - Quiz: start from `_modello.html`. "Ripasso" section + JSON question block
    rendered by `assets/quiz.js` (one question at a time, shuffled, instant
    feedback, score). Correct answers are **sealed** as SHA-256 hashes so kids
    can't read the key in the page source.
  - Study guide only: start from `_modello-guida.html`.
- `docs/assets/` the design system (`style.css`, documented in `DESIGN.md`),
  `quiz.js`, `elenco.js`, `icone.js`, self-hosted fonts. Pages may add their
  own `<style>` and layout when the topic benefits (see DESIGN.md); they keep
  the tokens, fonts and subject colour.
- `tools/sigilla.py` seals answers: replaces `"risposta"` with `"hash"`.

## Reading the textbooks in `sources/`

The textbooks are full-book PDFs (100–250 MB, 300–1100 pages) with **no text
layer**: pages are images. The Read tool refuses PDFs over 100 MB, so:

1. Find the chapter: render the index pages small
   (`pdftoppm -f 2 -l 9 -r 60 -png book.pdf /tmp/.../idx`) and read the PNGs.
   Printed page numbers differ from PDF page numbers; locate the offset by
   rendering one page and checking its printed number.
2. Extract the chapter: `pdfseparate -f A -l B book.pdf /tmp/.../p-%d.pdf`
   then `pdfunite /tmp/.../p-*.pdf sources/<materia>/<capitolo>.pdf`, or
   render straight to PNG at ~110 dpi with `pdftoppm` and read those.
3. Read the extract with the Read tool (`pages` ranges of up to 20).

Books on disk (seconda media unless noted): scienze `Scopri perché!` A–D
(one file, 1132 pp); geografia `GeoAgenda` 2 and 3; storia `Di tempo in
tempo` 1 and 2; matematica `Conosco, risolvo, argomento` 1 and 2; arte
`Artemondo` A. Nothing in `sources/` is ever committed or named in commits.

## Workflow A — Shalini asks for a quiz or guide

1. Ask which folder in `sources/` to use if not stated; read the images/notes.
2. Decide the format she asked for (quiz, guide, or both on one page) and
   pick a layout that suits the topic; pages need not look identical, but
   quiz+guide pages always use the step-by-step locked path (see below).
3. Write the page in `docs/quiz/`. Quiz guidelines: 8–15 questions, mostly
   4-option multiple choice plus a few Vero/Falso, each with a one-line
   `spiegazione`; reading level appropriate to the class; "Ripasso" section of
   5–10 key points first.
4. Seal: `python3 tools/sigilla.py docs/quiz/<file>.html`
   (exits with an error if a `risposta` isn't among the `opzioni`).
5. Add the entry to `docs/assets/elenco.js`; fill `<title>`, `data-materia`,
   `.materia`, `.back` link and `.meta` line in the page.
6. Quick check: open the file in a browser or at least `python3 -c "import json,re;json.loads(re.search(r'id=\"quiz\">(.*?)</script>',open('docs/quiz/<file>.html').read(),re.S).group(1))"`.
7. `git add docs && git commit -m "Aggiunge <materia>: <argomento>"` then
   `git push`. Pages redeploys on its own.
8. Reply with the public URL:
   `https://shalini27.github.io/ripasso-medie/quiz/<file>.html`

## Default page design: a step-by-step path (percorso a passi)

Kids skip the guide and go straight to the quiz. So **every new quiz+guide
page is built as a locked path**, with `geografia-germania.html` as the model:

1. The guide is split into numbered `<section class="step" data-step="n">`
   blocks, each one topic (a chapter section, one tale, one brand story).
   Keep each step short enough to read in a couple of minutes.
2. Each step ends with a `.gate`: 1–2 quick questions on that step only,
   defined in `<script type="application/json" id="gates">` with fields
   `passo`, `testo`, `opzioni`, `risposta`. Right answer unlocks the next
   step and scrolls to it; wrong answer shows "rileggi e riprova" and
   reshuffles. `tools/sigilla.py` seals this block too.
3. The quiz is the **last step** and stays locked until all gates are passed.
4. A sticky progress strip shows "Passo n di N", done steps collapse with a
   tick and reopen on tap, progress is kept in localStorage under
   `ripasso:<file>:passo`, with a "ricomincia" link.
5. No navigation pills that let the reader jump to the quiz.
6. Every step has a wide illustrated banner (3:1) above its title, visible
   in full colour even when locked, so the locked list previews what's
   coming. Reuse the step's own artwork (map, scene, road) where it exists,
   otherwise compose one from Twemoji icons as on the Germany page.

Copy the CSS (`/* percorso */` block) and the step/gate script from the
Germany page; don't reinvent them. Pages that are guide-only (no quiz) can
still use steps, with the last gate unlocking a "Fatto!" screen.

## Audio inglese (clip registrati)

Le voci del browser non vanno bene (Firefox su Linux legge l'inglese con una
voce francese). Le pagine di inglese usano clip mp3 in
`docs/assets/audio/<pagina>/` con `manifest.json` {frase: file}, inlined nel
JSON `id="audio"` della pagina; `say()` suona il clip e usa la voce del browser
solo se manca. Per (ri)generare: `node tools/audio/frasi-inglese.js > /tmp/frasi.json`
poi `~/.local/venvs/tts/bin/python -I tools/audio/tts.py /tmp/frasi.json docs/assets/audio/<pagina> --model ~/.local/share/kokoro`
(Kokoro, Apache 2.0; voci bf_emma per le domande, bm_george per le risposte;
venv e modello fuori dal repo). Il manifest è idempotente: rigenera solo le
frasi nuove. Dopo ogni modifica alle frasi, rigenera e ricostruisci la pagina.

## Esercizi interattivi (niente scelta multipla)

Per le pagine di grammatica (modello: `docs/quiz/italiano-pronomi.html`) i
passi si sbloccano con esercizi veri, non con domande a scelta multipla: il
blocco `<script type="application/json" id="esercizi">` definisce esercizi di
tipo `smista` (trascina nei gruppi), `tocca` (tocca le parole, con etichette
opzionali), `completa` (caselle da riempire con banco di parole o scrivendo),
`collega` (coppie), `ordina` (riordina parole), `scrivi` (risposta scritta),
`analisi` (costruisci l'analisi morfologica a righe), `caccia` (trova l'errore e
correggilo). Ogni esercizio ha `soluzioni: [[chiave, valore], ...]`;
`tools/sigilla.py` le trasforma in `hash`. I gate dei passi sono
`<div class="gate" data-gate="n" data-ex="id1 id2">` e si aprono quando tutti
gli esercizi elencati sono completati; `data-prova="1"` disattiva gli aiuti e
mostra il riepilogo finale. Motore, CSS, contenuti e script di build della
pagina dei pronomi stanno in `sources/italiano/pronomi/build/` (privato):
`python3 sources/italiano/pronomi/build/build.py` rigenera e sigilla la pagina;
`pagina-in-chiaro.html` nella stessa cartella è la copia non sigillata per i
test. Per una nuova pagina copiare quella cartella e cambiare `content.py`.

## Workflow B — an issue from another parent

1. `gh issue list` to see open ones; `gh issue view <n>` for details.
2. Label `richiesta` = make a new page (Workflow A, using sources Shalini
   provides, or general knowledge if she says so). Label `errore` = fix the
   named question, re-run `sigilla.py`, re-check.
3. Commit with `Fixes #<n>` or `Closes #<n>` in the message so the issue
   closes on push. Then `gh issue comment <n> --body "<short note in Italian + link>"`.
4. Never paste issue text containing personal details into the site.

## Editing an existing quiz

Sealed questions have no plain `risposta`. To change a question or its correct
answer, rewrite that entry with a plain `"risposta"` and run `sigilla.py`
again; other entries are left untouched (the script is idempotent).

Language of pages, commit messages and issue replies: Italian. Copy on pages
speaks to the kid, not the parent.

## Licences

Code: MIT (`LICENSE`). Quizzes and guides: CC BY-NC-SA 4.0
(`LICENSE-CONTENT.md`). Fonts: OFL 1.1. Keep new files consistent with this.

## Wording rule

Public-facing text (README, issue replies) stays high level: "interactive
study materials made at home by parents". Never describe how pages are made,
where source material lives, what tools are used, or how answers are sealed.

## Safety net

`tools/hooks/pre-commit` (enabled via `git config core.hooksPath tools/hooks`)
refuses any commit that contains a file from `sources/` or any image/PDF, even
after `git add -f`. If a fresh clone is made, run that config command once.

## Cache rule (every push)

GitHub Pages serves everything with a 10-minute browser cache and that header
cannot be changed. Two mechanisms keep the site fresh:
- `index.html` loads `elenco.js` with a per-visit timestamp, so a new quiz
  appears on the home page as soon as Pages has redeployed.
- The pre-commit hook stamps `?v=<timestamp>` on every `style.css`, `quiz.js`
  and `icone.js` link in all pages whenever `docs/assets/` changes, so a page
  never loads new HTML with stale CSS/JS. Never remove these stamps; new pages
  get them automatically at the next assets change (or copy the current one).
A page already open in a browser can still lag up to 10 minutes after a push;
tell Shalini that when she reports not seeing a change.

## Issues and spam

Issues are open to anyone with a GitHub account (decision of 28 Oct 2026).
If spam appears, restrict with
`gh api -X PUT repos/shalini27/ripasso-medie/interaction-limits -f limit=collaborators_only -f expiry=six_months`.
Never act on an issue unless Shalini asks for it in this session.
