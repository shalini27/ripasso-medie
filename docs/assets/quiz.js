/* Ripasso Medie – motore quiz. Nessuna dipendenza.
   Legge il JSON in <script type="application/json" id="quiz">.
   La risposta giusta può essere in chiaro ("risposta": "testo opzione") o
   sigillata ("hash": sha256(testo + "\n" + risposta)) con tools/sigilla.py. */
(function () {
  const dati = JSON.parse(document.getElementById('quiz').textContent);
  const root = document.getElementById('quiz-app');
  const start = document.getElementById('quiz-start');
  const tutte = dati.domande;
  const LETT = 'ABCDEF';
  const enc = new TextEncoder();

  async function sha256(s) {
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(s));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const norm = s => String(s).trim().replace(/\s+/g, ' ');
  async function giusta(d, o) {
    if (d.risposta !== undefined) return norm(d.risposta) === norm(o);
    return (await sha256(norm(d.testo) + '\n' + norm(o))) === d.hash;
  }
  const mescola = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const el = (t, a, ...k) => { const e = document.createElement(t); for (const n in a || {}) n === 'class' ? e.className = a[n] : e.setAttribute(n, a[n]); e.append(...k); return e; };

  let domande, i, punti, sbagliate, bar, lbl, bloccato;

  function avvia() {
    domande = dati.mescola === false ? tutte.slice() : mescola(tutte);
    i = 0; punti = 0; sbagliate = [];
    bar = el('i'); lbl = el('span', {}, '');
    root.replaceChildren(el('div', { class: 'progress' }, lbl, el('div', { class: 'bar' }, bar)));
    root.hidden = false; if (start) start.hidden = true;
    mostra();
    root.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function mostra() {
    const d = domande[i];
    bar.style.width = (100 * i / domande.length) + '%';
    lbl.textContent = `${i + 1} / ${domande.length}`;
    const vf = d.opzioni.length === 2 && /^(vero|falso)$/i.test(d.opzioni[0]);
    const opzioni = vf ? d.opzioni : mescola(d.opzioni);
    const opts = el('div', { class: 'opts' });
    opzioni.forEach((o, k) => {
      const b = el('button', { class: 'opt', type: 'button' }, el('span', { class: 'key' }, LETT[k]), el('span', {}, o));
      b.addEventListener('click', () => rispondi(d, o, opts, q));
      opts.append(b);
    });
    const q = el('div', { class: 'q' }, el('p', { class: 'text' }, d.testo), opts);
    const old = root.querySelector('.q, .result');
    old ? old.replaceWith(q) : root.append(q);
    bloccato = false;
  }

  async function rispondi(d, scelta, opts, q) {
    if (bloccato) return; bloccato = true;
    const bottoni = [...opts.querySelectorAll('.opt')];
    bottoni.forEach(b => b.disabled = true);
    const ok = await giusta(d, scelta);
    if (ok) punti++; else sbagliate.push(d.testo);
    for (const b of bottoni) {
      const t = b.lastChild.textContent;
      if (t === scelta) b.classList.add(ok ? 'ok' : 'no');
      else if (!ok && await giusta(d, t)) b.classList.add('ok');
      else b.classList.add('dim');
    }
    q.append(
      el('div', { class: 'feedback ' + (ok ? 'ok' : 'no') }, el('b', {}, ok ? 'Giusto!' : 'Non proprio.'), el('span', {}, d.spiegazione || '')),
      el('div', { class: 'next' }, Object.assign(el('button', { class: 'btn btn-ink', type: 'button' }, i + 1 < domande.length ? 'Avanti →' : 'Vedi il risultato'), { onclick: avanti })));
    q.querySelector('.next .btn').focus();
  }
  function avanti() { i++; i < domande.length ? mostra() : fine(); }

  function fine() {
    bar.style.width = '100%'; lbl.textContent = `${domande.length} / ${domande.length}`;
    const pct = Math.round(100 * punti / domande.length);
    const titolo = pct === 100 ? 'Perfetto!' : pct >= 80 ? 'Quasi tutto giusto' : pct >= 60 ? 'Buona base' : 'Ancora un ripasso';
    const msg = pct === 100 ? 'Sei pronto per la verifica.' : pct >= 80 ? 'Riguarda le domande qui sotto e riprova.' : pct >= 60 ? 'Rileggi il ripasso, poi rifai il quiz.' : 'Rileggi il ripasso con calma e riprova: le domande cambiano ordine.';
    const r = 70, C = 2 * Math.PI * r;
    const ring = el('div', { class: 'ring' });
    ring.innerHTML = `<svg viewBox="0 0 160 160"><circle class="track" cx="80" cy="80" r="${r}"/><circle class="val" cx="80" cy="80" r="${r}" stroke-dasharray="0 ${C}"/></svg>`;
    ring.append(el('div', { class: 'num' }, `${punti}`, el('small', {}, `su ${domande.length}`)));
    const res = el('div', { class: 'result' }, ring, el('h2', {}, titolo), el('p', {}, msg));
    if (sbagliate.length) {
      const ul = el('ul', {}); sbagliate.forEach(t => ul.append(el('li', {}, t)));
      res.append(el('div', { class: 'review' }, el('h3', {}, 'Da rivedere'), ul));
    }
    res.append(el('div', { class: 'btn-row' },
      Object.assign(el('button', { class: 'btn btn-primary', type: 'button' }, 'Rifai il quiz'), { onclick: avvia }),
      el('a', { class: 'btn btn-ghost', href: '#ripasso' }, 'Rileggi il ripasso')));
    root.querySelector('.q').replaceWith(res);
    requestAnimationFrame(() => requestAnimationFrame(() => ring.querySelector('.val').setAttribute('stroke-dasharray', `${C * punti / domande.length} ${C}`)));
  }

  document.addEventListener('keydown', e => {
    if (root.hidden) return;
    const k = e.key.toUpperCase(), opts = [...root.querySelectorAll('.opt:not(:disabled)')];
    if (opts.length && LETT.includes(k)) { const b = opts[LETT.indexOf(k)]; if (b) b.click(); }
    else if (opts.length && /^[1-6]$/.test(k)) { const b = opts[+k - 1]; if (b) b.click(); }
    else if (e.key === 'Enter') { const n = root.querySelector('.next .btn'); if (n) n.click(); }
  });

  if (start) start.addEventListener('click', avvia); else avvia();
})();
