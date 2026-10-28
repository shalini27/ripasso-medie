# Design system — Ripasso Medie

Reference feel: Quizlet / Khan Academy. Clean, roomy, big tap targets, nothing
decorative. Everything lives in `docs/assets/style.css`; pages use its classes
and never add their own CSS.

## Tokens (`:root` in style.css)

| Token | Use |
|---|---|
| `--bg` / `--surface` | page ground / cards |
| `--ink` / `--ink-2` | text / secondary text |
| `--line` | borders |
| `--accent` | **actions only**: primary button, focus ring, fallback for progress |
| `--ok` `--ok-bg` / `--no` `--no-bg` | right / wrong feedback |
| `--m-<materia>` | one colour per subject, set via `data-materia` on `<body>` and exposed as `--mc` |
| `--display` / `--body` | Bricolage Grotesque (headings, question text, big numbers) / Figtree (everything else), self-hosted in `assets/fonts/` |
| `--r` `--r-sm` | 16px cards / 10px option tiles |

Dark mode follows the system (`prefers-color-scheme`). Never write a literal
colour in a page; use the tokens.

## Subject colours

italiano, storia, geografia, matematica, scienze, arte (storia dell'arte),
inglese, musica, tecnologia, altro. Put `data-materia="<id>"` on `<body>` of a
quiz/guide page and the subject colour flows into the label, progress bar,
score ring, list markers and definition rules.

## Components

- `.topbar` with `.brand` and `.back` link.
- Home: `.hero` + `.tiles` (`.tile` per subject, `.vuota` when empty).
- Subject page: `.subhead` + `.rows` (`.row` per quiz, newest first, grouped by
  `.year`). Both are rendered by `index.html` from `assets/elenco.js`.
- Quiz/guide page: `.pagehead` (`.materia` label, `h1`, `.meta`), `.panel`
  blocks for content (`ul`, `p.def`, `table`), `.btn.btn-primary#quiz-start`,
  `#quiz-app.quiz` filled by `quiz.js` (progress, `.q`, `.opt`, `.feedback`,
  `.result` with score ring and "Da rivedere" list).
- Buttons: `.btn-primary` (accent, one per view), `.btn-ink`, `.btn-ghost`.

## Rules

1. One column, max 760px, 20px side gutter. Works at 400px (phone), 800px
   (tablet) and desktop. No horizontal scroll, no empty half-screens.
2. One primary action per view. Accent colour appears nowhere else.
3. Question text in display face, 22–28px. Options are full-width tiles with
   a letter key; keyboard A–D / 1–4 and Enter work.
4. Feedback is immediate; the correct option is revealed after a wrong pick,
   with a one-line explanation.
5. Headings and copy in plain Italian, addressed to the kid ("Cosa ripassiamo
   oggi?"), never to the parent.
6. No emoji as UI, no images from textbooks, no decorative icons.
