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
