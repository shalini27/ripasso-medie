/* Un simbolo per materia, disegnato a linea (viewBox 24x24, stroke currentColor).
   Si usa con <span class="icona" data-icona="storia"></span> */
window.ICONE = {
  italiano: '<path d="M3 5.5C5.5 4.5 8 4.5 12 6c4-1.5 6.5-1.5 9-.5V19c-2.5-1-5-1-9 .5-4-1.5-6.5-1.5-9-.5z"/><path d="M12 6v13.5"/>',
  storia: '<path d="M4 20h16M5 17h14"/><path d="M6 17V9M10 17V9M14 17V9M18 17V9"/><path d="M4 9h16l-8-5z"/>',
  geografia: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  matematica: '<path d="M3 13l2.5 6L10 5h11"/><path d="M14 11l5 5M19 11l-5 5"/>',
  scienze: '<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)"/>',
  arte: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-.8 2-1.8 0-1.2-1.2-1.7-1.2-2.8 0-.9.7-1.4 1.6-1.4H16a5 5 0 0 0 5-5c0-4-4-7-9-7z"/><circle cx="7.5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="9.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7" r="1.2" fill="currentColor" stroke="none"/>',
  inglese: '<path d="M4 5h16v10H10l-5 4v-4H4z"/><path d="M8 8.5v4M11 8.5v4M8 10.5h3M14 8.5v4"/>',
  musica: '<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  tecnologia: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/>',
  altro: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5V14M12 17h.01"/>'
};
window.icona = id => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONE[id] || ICONE.altro}</svg>`;
document.querySelectorAll('[data-icona]').forEach(e => { e.innerHTML = icona(e.dataset.icona); });

/* Illustrazioni piatte per le tessere della home (viewBox 120x120).
   Due toni: colore della materia (currentColor) e una sua tinta (.t). */
window.ILLU = {
  italiano: `<path class="t" d="M14 34c14-6 28-6 46 2v56c-18-8-32-8-46-2z"/><path d="M60 36c18-8 32-8 46-2v58c-14-6-28-6-46 2z"/><path class="l" d="M24 48h26M24 58h26M24 68h26M70 46h26M70 56h26M70 66h26"/><path d="M84 14l12 12-30 30-16 4 4-16z"/><path class="t" d="M54 60l12 12"/>`,
  storia: `<path d="M12 44l48-30 48 30z"/><path class="t" d="M20 44h80v8H20z"/><rect x="26" y="52" width="10" height="40"/><rect x="44" y="52" width="10" height="40"/><rect x="66" y="52" width="10" height="40"/><rect x="84" y="52" width="10" height="40"/><path class="t" d="M14 92h92v10H14z"/><path d="M8 102h104v6H8z"/>`,
  geografia: `<circle class="t" cx="60" cy="52" r="38"/><path d="M34 30c10-4 18 2 20 10s-6 12-4 20 10 8 8 16-12 6-18 2-10-14-10-24 0-20 4-24zM74 26c6 2 12 10 12 18s-8 6-8 14 8 10 4 16-10 0-12-6 2-14-2-20-2-18 6-22z"/><path d="M58 90h4v10h-4z"/><path class="t" d="M40 100h40v8H40z"/><path d="M96 12l10 6-6 10-10-6z"/>`,
  matematica: `<path class="t" d="M14 86L78 22l18 18-64 64z"/><path d="M26 86l-8-8 8-8 4 4-4 4 4 4zM42 70l-8-8 8-8 4 4-4 4 4 4zM58 54l-8-8 8-8 4 4-4 4 4 4z"/><path d="M8 102c0-20 16-36 36-36h0v36z"/><path class="t" d="M20 102c0-13 11-24 24-24v24z"/><path d="M80 78h30M95 63v30M80 108h30"/>`,
  scienze: `<path class="t" d="M44 14h24v34l24 44c3 6-1 12-8 12H28c-7 0-11-6-8-12l24-44z"/><path d="M50 60L30 96c-1 2 0 4 2 4h48c2 0 3-2 2-4L62 60z"/><circle cx="44" cy="82" r="4" class="t"/><circle cx="60" cy="90" r="3" class="t"/><circle cx="66" cy="76" r="2.5" class="t"/><path d="M40 12h32v6H40z"/><path d="M90 20h10v40a5 5 0 0 1-10 0z"/><path class="t" d="M90 42h10v18a5 5 0 0 1-10 0z"/>`,
  arte: `<path class="t" d="M60 14c-28 0-48 20-48 44 0 22 18 36 36 36 8 0 10-6 10-10 0-6-6-8-6-14 0-6 4-8 10-8h8c16 0 26-10 26-22 0-16-16-26-36-26z"/><circle cx="34" cy="50" r="8"/><circle cx="46" cy="30" r="8"/><circle cx="68" cy="26" r="8"/><circle cx="86" cy="42" r="8"/><path d="M70 110l34-56 10 6-30 56z"/><path class="t" d="M64 118l6-8 14 8z"/>`,
  inglese: `<path d="M12 22h60a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H40l-16 14V64H20a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z"/><path class="t" d="M48 60h56a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-4v14l-18-14H56a8 8 0 0 1-8-8z"/><path class="l" d="M26 36h12M26 46h32M62 76h30M62 88h20"/>`,
  musica: `<path class="l" d="M10 40h100M10 52h100M10 64h100M10 76h100M10 88h100"/><ellipse class="t" cx="36" cy="80" rx="12" ry="9"/><path d="M46 80V26l34-8v48"/><ellipse class="t" cx="70" cy="66" rx="12" ry="9"/><path d="M46 36l34-8v10l-34 8z"/>`,
  tecnologia: `<path class="t" d="M20 40h60v44H20z"/><path d="M10 84h80v8H10z"/><path d="M28 50h44v26H28z" class="l"/><circle cx="92" cy="40" r="20"/><circle class="t" cx="92" cy="40" r="9"/><path d="M90 12h4v10h-4zM90 58h4v10h-4zM64 38h10v4H64zM110 38h10v4h-10zM72 20l3-3 7 7-3 3zM104 56l3-3 7 7-3 3zM72 60l-3-3 7-7 3 3zM104 24l-3-3 7-7 3 3z"/>`,
  altro: `<circle class="t" cx="60" cy="60" r="44"/><path d="M48 48a12 12 0 1 1 18 10c-4 3-6 5-6 10v4h-8v-6c0-8 4-11 8-14a5 5 0 1 0-5-6z"/><circle cx="56" cy="86" r="5"/>`
};
window.illu = id => `<svg viewBox="0 0 120 120" aria-hidden="true"><g fill="currentColor">${ILLU[id] || ILLU.altro}</g></svg>`;
