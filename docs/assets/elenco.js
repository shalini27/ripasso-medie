/* Elenco di tutte le pagine pubblicate. Una riga per quiz/guida.
   materia: italiano | storia | geografia | matematica | scienze | arte | inglese | musica | tecnologia | altro
   ordine:  la prima riga è la più recente (aggiungi in cima). Niente date.
   argomento: breve etichetta opzionale (es. "capitolo 3")
   data:    opzionale, solo se fornita (AAAA-MM-GG): mostra "verifica 12 nov"
   tipo:    "quiz" | "guida" | "quiz+guida"      domande: numero (solo per i quiz) */
window.MATERIE = [
  ["italiano","Italiano"],["storia","Storia"],["geografia","Geografia"],["matematica","Matematica"],
  ["scienze","Scienze"],["arte","Storia dell'arte"],["inglese","Inglese"],["musica","Musica"],["tecnologia","Tecnologia"]
];
window.RIPASSO = [
  {file:"italiano-odissea.html", titolo:"L'Odissea", materia:"italiano", classe:"2ª", argomento:"epica · pp. 148–155 e slide", tipo:"quiz+guida", domande:31},
  {file:"geografia-germania.html", titolo:"La Germania", materia:"geografia", classe:"2ª", argomento:"capitolo 16 · fiabe dei Grimm · marchi tedeschi", tipo:"quiz+guida", domande:15},
  {file:"scienze-microrganismi.html", titolo:"I microrganismi", materia:"scienze", classe:"2ª", argomento:"unità B2", tipo:"quiz+guida", domande:29},
  {file:"inglese-episode-1-what-are-you-doing.html", titolo:"Episode 1 – What are you doing this afternoon?", materia:"inglese", classe:"2ª", tipo:"quiz"},
  {file:"musica-medioevo-in-musica.html", titolo:"Il Medioevo in musica", materia:"musica", classe:"2ª", tipo:"quiz+guida", domande:109},
  {file:"storia-comuni-papi-imperatori-peste.html", titolo:"Comuni, papi, imperatori e la peste", materia:"storia", classe:"2ª", argomento:"capitoli 12–13", tipo:"quiz+guida", domande:100}
];

