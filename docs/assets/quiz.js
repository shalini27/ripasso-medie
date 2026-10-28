/* Ripasso Medie – motore quiz. Nessuna dipendenza.
   Legge il JSON in <script type="application/json" id="quiz"> e lo mostra
   una domanda alla volta. La risposta giusta può essere in chiaro
   ("risposta": "testo dell'opzione") oppure sigillata ("hash": sha256). */
(async function () {
  const dati = JSON.parse(document.getElementById('quiz').textContent);
  const root = document.getElementById('app');
  const tutte = dati.domande;

  const enc = new TextEncoder();
  async function sha256(s) {
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(s));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  function norm(s) { return String(s).trim().replace(/\s+/g, ' '); }
  async function giusta(d, opzione) {
    if (d.risposta !== undefined) return norm(d.risposta) === norm(opzione);
    return (await sha256(norm(d.testo) + '\n' + norm(opzione))) === d.hash;
  }
  function mescola(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) k === 'class' ? e.className = attrs[k] : e.setAttribute(k, attrs[k]);
    for (const k of kids) e.append(k);
    return e;
  }

  let domande, i, punti, barra;

  function avvia() {
    domande = dati.mescola === false ? tutte.slice() : mescola(tutte);
    i = 0; punti = 0;
    root.replaceChildren();
    barra = el('div', { class: 'barra' }, el('span'));
    root.append(barra);
    mostra();
  }

  function mostra() {
    barra.firstChild.style.width = (100 * i / domande.length) + '%';
    const d = domande[i];
    const card = el('div', { class: 'card domanda' },
      el('div', { class: 'n' }, `Domanda ${i + 1} di ${domande.length}`),
      el('p', { class: 'testo' }, d.testo));
    const box = el('div', { class: 'opzioni' });
    const opzioni = d.opzioni.length === 2 && /^(vero|falso)$/i.test(d.opzioni[0]) ? d.opzioni : mescola(d.opzioni);
    for (const o of opzioni) {
      const b = el('button', { type: 'button' }, o);
      b.addEventListener('click', () => rispondi(d, o, box, card));
      box.append(b);
    }
    card.append(box);
    const vecchia = root.querySelector('.domanda');
    vecchia ? vecchia.replaceWith(card) : root.append(card);
    card.scrollIntoView({ block: 'nearest' });
  }

  async function rispondi(d, scelta, box, card) {
    const bottoni = [...box.querySelectorAll('button')];
    bottoni.forEach(b => b.disabled = true);
    const ok = await giusta(d, scelta);
    if (ok) punti++;
    for (const b of bottoni) {
      if (b.textContent === scelta) b.classList.add(ok ? 'ok' : 'no');
      else if (!ok && await giusta(d, b.textContent)) b.classList.add('ok');
    }
    const sp = el('div', { class: 'spiegazione ' + (ok ? 'ok' : 'no') },
      (ok ? 'Giusto! ' : 'Non proprio. ') + (d.spiegazione || ''));
    card.append(sp);
    const avanti = el('button', { class: 'btn', type: 'button' }, i + 1 < domande.length ? 'Avanti →' : 'Vedi il risultato');
    avanti.style.marginTop = '14px';
    avanti.addEventListener('click', () => { i++; i < domande.length ? mostra() : fine(); });
    card.append(avanti);
    avanti.focus();
  }

  function fine() {
    barra.firstChild.style.width = '100%';
    const pct = Math.round(100 * punti / domande.length);
    const msg = pct === 100 ? 'Perfetto! 🎉' : pct >= 80 ? 'Bravissimo/a!' : pct >= 60 ? 'Bene, ancora un ripasso e ci sei.' : 'Rileggi il ripasso qui sopra e riprova.';
    const card = el('div', { class: 'card risultato' },
      el('div', { class: 'punteggio' }, `${punti} / ${domande.length}`),
      el('p', {}, msg));
    const btn = el('button', { class: 'btn', type: 'button' }, 'Ricomincia');
    btn.addEventListener('click', avvia);
    card.append(btn);
    root.querySelector('.domanda').replaceWith(card);
  }

  avvia();
})();
