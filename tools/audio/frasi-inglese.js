// Estrae tutte le frasi pronunciate dalla pagina "Describing people"
// e scrive un JSON [{text, voice}] da dare a tools/audio/tts.py.
// Uso: node tools/audio/frasi-inglese.js > /tmp/frasi.json
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/../../docs/quiz/inglese-describing-people.html', 'utf8');
const chars = JSON.parse(html.match(/<script type="application\/json" id="chars">([\s\S]*?)<\/script>/)[1]);
// stessa logica della pagina
const pro = c => c.sex === 'm' ? { s: 'he', Is: "He's", has: "He's got", wears: 'He wears', does: 'does he' } : { s: 'she', Is: "She's", has: "She's got", wears: 'She wears', does: 'does she' };
const Q = c => { const p = pro(c); return [`Who's ${c.name}?`, `What's ${p.s} like?`, `What ${p.does} look like?`]; };
const A = c => {
  const p = pro(c); const [[q1, a1], [q2, a2]] = c.pers;
  const pers = q1 === 'not very' ? `${p.Is.replace("'s", "")} isn't very ${a1}, but ${p.s}'s ${q2} ${a2}.` : (q2 === 'not very' ? `${p.Is} ${q1} ${a1}, but ${p.s} isn't very ${a2}.` : `${p.Is} ${q1} ${a1} and ${q2} ${a2}.`);
  const extra = c.extra === 'glasses' ? ` ${p.wears} glasses.` : c.extra === 'beard' ? ` ${p.has} a beard.` : '';
  return [`${p.Is} ${c.role}.`, pers, `${p.Is} ${c.h} and ${c.b}. ${p.has} ${c.hair} hair and ${c.eyes} eyes.${extra}`];
};
const out = new Map();
const add = (text, voice) => { if (!out.has(text)) out.set(text, voice); };
for (const c of chars) { Q(c).forEach(t => add(t, 'q')); A(c).forEach(t => add(t, 'a')); }
// esempi in fondo alla pagina
const ex = html.match(/<div class="gloss" id="examples">([\s\S]*?)<\/div>/)[1];
for (const m of ex.matchAll(/<summary>(.*?)<\/summary><p>(.*?)<\/p>/g)) { add(m[1], 'q'); add(m[2], 'a'); }
console.log(JSON.stringify([...out].map(([text, voice]) => ({ text, voice })), null, 1));
