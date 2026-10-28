# Ripasso Medie — working rules for Claude

Revision guides and quizzes for Italian middle school (scuola media, 1ª–3ª),
written in Italian, published as a static site on GitHub Pages.

- Repo: https://github.com/shalini27/ripasso-medie (public)
- Site: NOT deployed. GitHub Pages is disabled on purpose. Enable it only when
  Shalini explicitly asks (settings: branch `main`, folder `/docs`).
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
  `quiz.js`, `elenco.js`, self-hosted fonts. Pages never add their own CSS.
- `tools/sigilla.py` seals answers: replaces `"risposta"` with `"hash"`.

## Workflow A — Shalini asks for a quiz or guide

1. Ask which folder in `sources/` to use if not stated; read the images/notes.
2. Decide the format she asked for (quiz, guide, or both on one page).
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
   `git push`.
8. Reply with the path of the new page. (Once Pages is enabled the URL will be
   `https://shalini27.github.io/ripasso-medie/quiz/<file>.html`.)

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

In public-facing text (README, issue replies) do not describe the source
material as photos or screenshots of textbooks. Say: the source material stays
on the parent's computer, is checked by a parent, and is not published.

## Safety net

`tools/hooks/pre-commit` (enabled via `git config core.hooksPath tools/hooks`)
refuses any commit that contains a file from `sources/` or any image/PDF, even
after `git add -f`. If a fresh clone is made, run that config command once.

## Issues and spam

Interaction limits are set to **collaborators only** (expires after six
months; renew with
`gh api -X PUT repos/shalini27/ripasso-medie/interaction-limits -f limit=collaborators_only -f expiry=six_months`).
Only people Shalini invites as collaborators can open issues. Never act on an
issue unless Shalini asks for it in this session.
