(function () {
  "use strict";

  const DATA = window.INGENIUM_DATA;
  if (!DATA) return;

  const page = document.body.dataset.page || "graph";

  // --- i18n Localization Engine ---
  const I18N = {
    en: {
      graph: "Graph", bips: "BIPs", events: "Events", projects: "Projects", communities: "Communities",
      universities: "Universities", opportunities: "Opportunities", research: "Research & sources", about: "About",
      saved: "Saved", compare: "Compare", more: "More",
      exploreJourney: "Explore a journey", filters: "Filters", shareView: "Copy network link",
      save: "☆ Save", savedState: "★ Saved", addToCal: "Add to calendar", details: "View details →",
      viewInNetwork: "View in network", showResults: "Show results", clearAll: "Clear all",
      searchPlaceholder: "Search BIPs, projects, universities…",
      graphHelp: "Drag to move · scroll or pinch to zoom · select a node to explore",
      noConnections: "No matching connections",
      compareNow: "Compare now →", compareTitle: "Side-by-Side Comparison",
      comparePrompt: "Select up to 3 programmes to compare requirements, ECTS credits, and host universities.",
      savedTitle: "My Saved Opportunities", savedSubtitle: "Review, compare, and export your bookmarked programmes and events.",
      exportIcs: "Download All (.ics)", exportMd: "Copy Markdown Summary", printView: "Print Summary",
      shareJourney: "Share as Custom Journey", emptySaved: "You haven't saved any items yet.",
      emptySavedDesc: "Browse the network or catalogues and click 'Save' to collect items here.",
      customJourney: "Custom Journey",
      uniCount: "Universities", bipCount: "Verified BIPs", projCount: "Funded Projects", nodeCount: "Verified nodes"
    },
    es: {
      graph: "Red", bips: "BIPs", events: "Eventos", projects: "Proyectos", communities: "Comunidades",
      universities: "Universidades", opportunities: "Oportunidades", research: "Investigación y fuentes", about: "Acerca de",
      saved: "Guardados", compare: "Comparar", more: "Más",
      exploreJourney: "Explorar ruta", filters: "Filtros", shareView: "Copiar enlace de red",
      save: "☆ Guardar", savedState: "★ Guardado", addToCal: "Añadir al calendario", details: "Ver detalles →",
      viewInNetwork: "Ver en la red", showResults: "Mostrar resultados", clearAll: "Borrar todo",
      searchPlaceholder: "Buscar BIPs, proyectos, universidades…",
      graphHelp: "Arrastra para mover · rueda o pellizco para zoom · selecciona un nodo",
      noConnections: "No se encontraron conexiones",
      compareNow: "Comparar ahora →", compareTitle: "Comparación paralela",
      comparePrompt: "Selecciona hasta 3 programas para comparar requisitos, créditos ECTS y sedes.",
      savedTitle: "Mis oportunidades guardadas", savedSubtitle: "Revisa, compara y exporta tus programas y eventos marcados.",
      exportIcs: "Descargar todo (.ics)", exportMd: "Copiar resumen Markdown", printView: "Imprimir resumen",
      shareJourney: "Compartir como ruta personalizada", emptySaved: "Aún no has guardado ningún elemento.",
      emptySavedDesc: "Explora la red o los catálogos y haz clic en 'Guardar' para recopilar elementos aquí.",
      customJourney: "Ruta personalizada",
      uniCount: "Universidades", bipCount: "BIPs verificados", projCount: "Proyectos financiados", nodeCount: "Nodos verificados"
    },
    fr: {
      graph: "Réseau", bips: "BIPs", events: "Événements", projects: "Projets", communities: "Communautés",
      universities: "Universités", opportunities: "Opportunités", research: "Recherche & sources", about: "À propos",
      saved: "Enregistrés", compare: "Comparer", more: "Plus",
      exploreJourney: "Explorer un parcours", filters: "Filtres", shareView: "Copier le lien",
      save: "☆ Sauvegarder", savedState: "★ Sauvegardé", addToCal: "Ajouter au calendrier", details: "Voir détails →",
      viewInNetwork: "Voir dans le réseau", showResults: "Afficher résultats", clearAll: "Tout effacer",
      searchPlaceholder: "Rechercher BIPs, projets, universités…",
      graphHelp: "Glisser pour déplacer · zoom molette ou pincement · cliquer pour explorer",
      noConnections: "Aucune connexion correspondante",
      compareNow: "Comparer maintenant →", compareTitle: "Comparaison côte à côte",
      comparePrompt: "Sélectionnez jusqu'à 3 programmes pour comparer les crédits ECTS et les universités d'accueil.",
      savedTitle: "Mes opportunités enregistrées", savedSubtitle: "Consultez, comparez et exportez vos sélections.",
      exportIcs: "Tout télécharger (.ics)", exportMd: "Copier le résumé Markdown", printView: "Imprimer le résumé",
      shareJourney: "Partager en parcours personnalisé", emptySaved: "Vous n'avez encore rien enregistré.",
      emptySavedDesc: "Parcourez le réseau et cliquez sur 'Sauvegarder' pour ajouter des éléments ici.",
      customJourney: "Parcours personnalisé",
      uniCount: "Universités", bipCount: "BIPs vérifiés", projCount: "Projets financés", nodeCount: "Nœuds vérifiés"
    },
    de: {
      graph: "Netzwerk", bips: "BIPs", events: "Events", projects: "Projekte", communities: "Communities",
      universities: "Universitäten", opportunities: "Chancen", research: "Quellen & Forschung", about: "Über uns",
      saved: "Gemerkt", compare: "Vergleichen", more: "Mehr",
      exploreJourney: "Route erkunden", filters: "Filter", shareView: "Netzwerk-Link kopieren",
      save: "☆ Merken", savedState: "★ Gemerkt", addToCal: "Zum Kalender hinzufügen", details: "Details ansehen →",
      viewInNetwork: "Im Netzwerk anzeigen", showResults: "Ergebnisse zeigen", clearAll: "Alles zurücksetzen",
      searchPlaceholder: "BIPs, Projekte, Unis suchen…",
      graphHelp: "Ziehen zum Bewegen · Scrollen/Pinchen für Zoom · Knoten anklicken",
      noConnections: "Keine passenden Verbindungen",
      compareNow: "Jetzt vergleichen →", compareTitle: "Direktvergleich",
      comparePrompt: "Wähle bis zu 3 Programme, um ECTS, Formate und Partneruniversitäten zu vergleichen.",
      savedTitle: "Meine gemerkten Angebote", savedSubtitle: "Überprüfe, vergleiche und exportiere deine Auswahl.",
      exportIcs: "Alles herunterladen (.ics)", exportMd: "Markdown-Übersicht kopieren", printView: "Übersicht drucken",
      shareJourney: "Als Route teilen", emptySaved: "Noch keine Angebote gemerkt.",
      emptySavedDesc: "Erkunde das Netzwerk und klicke auf 'Merken', um Favoriten zu sammeln.",
      customJourney: "Individuelle Route",
      uniCount: "Universitäten", bipCount: "Geprüfte BIPs", projCount: "Geförderte Projekte", nodeCount: "Geprüfte Knoten"
    },
    it: {
      graph: "Rete", bips: "BIP", events: "Eventi", projects: "Progetti", communities: "Comunità",
      universities: "Università", opportunities: "Opportunità", research: "Fonti e ricerca", about: "Informazioni",
      saved: "Salvati", compare: "Confronta", more: "Altro",
      exploreJourney: "Esplora percorso", filters: "Filtri", shareView: "Copia link rete",
      save: "☆ Salva", savedState: "★ Salvato", addToCal: "Aggiungi al calendario", details: "Vedi dettagli →",
      viewInNetwork: "Vedi nella rete", showResults: "Mostra risultati", clearAll: "Cancella tutto",
      searchPlaceholder: "Cerca BIP, progetti, università…",
      graphHelp: "Trascina per muoverti · rotella o pinch per zoomare · seleziona un nodo",
      noConnections: "Nessuna connessione trovata",
      compareNow: "Confronta ora →", compareTitle: "Confronto affiancato",
      comparePrompt: "Seleziona fino a 3 programmi per confrontare crediti ECTS e requisiti.",
      savedTitle: "Le mie opportunità salvate", savedSubtitle: "Rivedi, confronta ed esporta i tuoi preferiti.",
      exportIcs: "Scarica tutto (.ics)", exportMd: "Copia riassunto Markdown", printView: "Stampa riassunto",
      shareJourney: "Condividi percorso personalizzato", emptySaved: "Non hai ancora salvato nulla.",
      emptySavedDesc: "Esplora la rete e clicca 'Salva' per aggiungere opportunità qui.",
      customJourney: "Percorso personalizzato",
      uniCount: "Università", bipCount: "BIP verificati", projCount: "Progetti finanziati", nodeCount: "Nodi verificati"
    },
    fi: {
      graph: "Verkko", bips: "BIP-ohjelmat", events: "Tapahtumat", projects: "Hankkeet", communities: "Yhteisöt",
      universities: "Yliopistot", opportunities: "Mahdollisuudet", research: "Lähteet ja tutkimus", about: "Tietoa",
      saved: "Tallennetut", compare: "Vertaile", more: "Lisää",
      exploreJourney: "Tutki polkua", filters: "Suodattimet", shareView: "Kopioi linkki",
      save: "☆ Tallenna", savedState: "★ Tallennettu", addToCal: "Lisää kalenteriin", details: "Katso tiedot →",
      viewInNetwork: "Näytä verkossa", showResults: "Näytä tulokset", clearAll: "Tyhjennä kaikki",
      searchPlaceholder: "Hae BIP-ohjelmia, hankkeita, yliopistoja…",
      graphHelp: "Vedä siirtääksesi · zoomaa hiirellä tai nipistämällä · valitse solmu",
      noConnections: "Ei vastaavia yhteyksiä",
      compareNow: "Vertaile nyt →", compareTitle: "Rinnakkaisvertailu",
      comparePrompt: "Valitse enintään 3 ohjelmaa vertaillaksesi opintopisteitä ja vaatimuksia.",
      savedTitle: "Tallennetut mahdollisuudet", savedSubtitle: "Tarkastele, vertaile ja vie valitsemasi ohjelmat.",
      exportIcs: "Lataa kaikki (.ics)", exportMd: "Kopioi Markdown-kooste", printView: "Tulosta kooste",
      shareJourney: "Jaa omana polkuna", emptySaved: "Et ole vielä tallentanut kohteita.",
      emptySavedDesc: "Selaa verkkoa ja paina 'Tallenna' kerätäksesi kohteita tähän.",
      customJourney: "Mukautettu polku",
      uniCount: "Yliopistot", bipCount: "Tarkistetut BIPit", projCount: "Rahoitetut hankkeet", nodeCount: "Verkkosolmut"
    },
    ro: {
      graph: "Rețea", bips: "BIP-uri", events: "Evenimente", projects: "Proiecte", communities: "Comunități",
      universities: "Universități", opportunities: "Oportunități", research: "Cercetare & surse", about: "Despre",
      saved: "Salvate", compare: "Compară", more: "Mai mult",
      exploreJourney: "Explorează un traseu", filters: "Filtre", shareView: "Copiază linkul rețelei",
      save: "☆ Salvează", savedState: "★ Salvat", addToCal: "Adaugă în calendar", details: "Vezi detalii →",
      viewInNetwork: "Vezi în rețea", showResults: "Arată rezultatele", clearAll: "Șterge tot",
      searchPlaceholder: "Caută BIP-uri, proiecte, universități…",
      graphHelp: "Trage pentru a naviga · zoom cu rotița sau gest · selectează un nod",
      noConnections: "Nicio conexiune găsită",
      compareNow: "Compară acum →", compareTitle: "Comparație comparativă",
      comparePrompt: "Selectează până la 3 programe pentru a compara creditele ECTS și universitățile gazdă.",
      savedTitle: "Oportunitățile mele salvate", savedSubtitle: "Revizuiește, compară și exportă selecțiile tale.",
      exportIcs: "Descarcă tot (.ics)", exportMd: "Copiază rezumat Markdown", printView: "Imprimă rezumat",
      shareJourney: "Partajează traseu personalizat", emptySaved: "Nu ai salvat încă niciun element.",
      emptySavedDesc: "Explorează rețeaua și apasă 'Salvează' pentru a adăuga oportunități aici.",
      customJourney: "Traseu personalizat",
      uniCount: "Universități", bipCount: "BIP-uri verificate", projCount: "Proiecte finanțate", nodeCount: "Noduri verificate"
    },
    el: {
      graph: "Δίκτυο", bips: "BIPs", events: "Εκδηλώσεις", projects: "Έργα", communities: "Κοινότητες",
      universities: "Πανεπιστήμια", opportunities: "Ευκαιρίες", research: "Έρευνα & πηγές", about: "Σχετικά",
      saved: "Αποθηκευμένα", compare: "Σύγκριση", more: "Περισσότερα",
      exploreJourney: "Εξερεύνηση διαδρομής", filters: "Φίλτρα", shareView: "Αντιγραφή συνδέσμου",
      save: "☆ Αποθήκευση", savedState: "★ Αποθηκεύτηκε", addToCal: "Προσθήκη στο ημερολόγιο", details: "Προβολή λεπτομερειών →",
      viewInNetwork: "Προβολή στο δίκτυο", showResults: "Εμφάνιση αποτελεσμάτων", clearAll: "Καθαρισμός όλων",
      searchPlaceholder: "Αναζήτηση BIPs, έργων, πανεπιστημίων…",
      graphHelp: "Σύρετε για περιήγηση · ζουμ με κύλιση · επιλέξτε έναν κόμβο",
      noConnections: "Δεν βρέθηκαν συνδέσεις",
      compareNow: "Σύγκριση τώρα →", compareTitle: "Συγκριτική προβολή",
      comparePrompt: "Επιλέξτε έως και 3 προγράμματα για να συγκρίνετε μονάδες ECTS και πανεπιστήμια.",
      savedTitle: "Οι αποθηκευμένες ευκαιρίες μου", savedSubtitle: "Ελέγξτε, συγκρίνετε και εξάγετε τα επιλεγμένα προγράμματα.",
      exportIcs: "Λήψη όλων (.ics)", exportMd: "Αντιγραφή σύνοψης Markdown", printView: "Εκτύπωση σύνοψης",
      shareJourney: "Κοινοποίηση προσαρμοσμένης διαδρομής", emptySaved: "Δεν έχετε αποθηκεύσει ακόμα προγράμματα.",
      emptySavedDesc: "Περιηγηθείτε στο δίκτυο και πατήστε 'Αποθήκευση' για να συλλέξετε επιλογές.",
      customJourney: "Προσαρμοσμένη διαδρομή",
      uniCount: "Πανεπιστήμια", bipCount: "Επαληθευμένα BIPs", projCount: "Χρηματοδοτούμενα έργα", nodeCount: "Επαληθευμένοι κόμβοι"
    },
    sv: {
      graph: "Nätverk", bips: "BIP-program", events: "Evenemang", projects: "Projekt", communities: "Gemenskap",
      universities: "Universitet", opportunities: "Möjligheter", research: "Forskning & källor", about: "Om oss",
      saved: "Sparade", compare: "Jämför", more: "Mer",
      exploreJourney: "Utforska rutt", filters: "Filter", shareView: "Kopiera länk",
      save: "☆ Spara", savedState: "★ Sparad", addToCal: "Lägg till i kalender", details: "Visa detaljer →",
      viewInNetwork: "Visa i nätverk", showResults: "Visa resultat", clearAll: "Rensa alla",
      searchPlaceholder: "Sök BIP:er, projekt, lärosäten…",
      graphHelp: "Dra för att flytta · zooma med skroll · välj nod för detaljer",
      noConnections: "Inga matchande kopplingar",
      compareNow: "Jämför nu →", compareTitle: "Jämförelse",
      comparePrompt: "Välj upp till 3 program för att jämföra högskolepoäng och krav.",
      savedTitle: "Mina sparade möjligheter", savedSubtitle: "Granska, jämför och exportera dina bokmärken.",
      exportIcs: "Ladda ned alla (.ics)", exportMd: "Kopiera Markdown-översikt", printView: "Skriv ut översikt",
      shareJourney: "Dela som egen rutt", emptySaved: "Du har inga sparade objekt än.",
      emptySavedDesc: "Bläddra i nätverket och klicka på 'Spara' för att samla alternativ här.",
      customJourney: "Anpassad rutt",
      uniCount: "Universitet", bipCount: "Verifierade BIP:er", projCount: "Finansierade projekt", nodeCount: "Verifierade noder"
    },
    bg: {
      graph: "Мрежа", bips: "BIP програми", events: "Събития", projects: "Проекти", communities: "Общности",
      universities: "Университети", opportunities: "Възможности", research: "Източници", about: "За нас",
      saved: "Запазени", compare: "Сравни", more: "Още",
      exploreJourney: "Изследвай маршрут", filters: "Филтри", shareView: "Копирай връзка",
      save: "☆ Запази", savedState: "★ Запазено", addToCal: "Добави в календар", details: "Виж детайли →",
      viewInNetwork: "Виж в мрежата", showResults: "Покажи резултати", clearAll: "Изчисти всичко",
      searchPlaceholder: "Търсене на BIP, проекти, университети…",
      graphHelp: "Плъзнете за преместване · мащабирайте със скрол · изберете възел",
      noConnections: "Няма намерени връзки",
      compareNow: "Сравни сега →", compareTitle: "Сравнение едно до друго",
      comparePrompt: "Изберете до 3 програми, за да сравните кредити ECTS и изисквания.",
      savedTitle: "Моите запазени възможности", savedSubtitle: "Прегледайте, сравнете и експортирайте избора си.",
      exportIcs: "Изтегли всички (.ics)", exportMd: "Копирай Markdown резюме", printView: "Печат на резюме",
      shareJourney: "Сподели като персонализиран маршрут", emptySaved: "Все още нямате запазени програми.",
      emptySavedDesc: "Разгледайте мрежата и натиснете 'Запази', за да съберете елементи тук.",
      customJourney: "Персонализиран маршрут",
      uniCount: "Университети", bipCount: "Проверени BIP", projCount: "Финансирани проекти", nodeCount: "Проверени възли"
    }
  };

  let currentLang = localStorage.getItem("ingenium-plus-lang") || "en";
  if (!I18N[currentLang]) currentLang = "en";

  function t(key, fallback) {
    const dict = I18N[currentLang] || I18N.en;
    return dict[key] || (I18N.en && I18N.en[key]) || fallback || key;
  }

  function setLanguage(lang) {
    if (I18N[lang]) {
      currentLang = lang;
      localStorage.setItem("ingenium-plus-lang", lang);
      renderHeader();
      renderFooter();
      if (page === "graph") {
        const help = document.querySelector(".graph-help");
        if (help) help.textContent = t("graphHelp");
        const search = document.getElementById("graph-search");
        if (search) search.placeholder = t("searchPlaceholder");
      } else {
        initContentPage();
      }
      updateCompareBar();
      showToast(`Language updated: ${lang.toUpperCase()}`);
    }
  }

  const typeLabels = {
    university: "University",
    bip: "BIP",
    project: "Project",
    event: "Event",
    community: "Community",
    opportunity: "Opportunity"
  };

  function getNavItems() {
    return [
      ["graph", t("graph"), "index.html"],
      ["bips", t("bips"), "bips.html"],
      ["events", t("events"), "events.html"],
      ["projects", t("projects"), "projects.html"],
      ["saved", `${t("saved")}${savedIds.size ? ` <span class="nav-saved-count">${savedIds.size}</span>` : ""}`, "saved.html"]
    ];
  }

  function getMoreItems() {
    return [
      ["communities", t("communities"), "communities.html"],
      ["universities", t("universities"), "universities.html"],
      ["opportunities", t("opportunities"), "opportunities.html"],
      ["compare", t("compare"), "compare.html"],
      ["research", t("research"), "research.html"],
      ["about", t("about"), "about.html"]
    ];
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getUniversity(id) {
    return DATA.universities.find((item) => item.id === id);
  }

  function getNode(id) {
    return DATA.nodes.find((item) => item.id === id);
  }

  function nodeUniversityNames(node, limit) {
    const names = (node.universityIds || []).map(getUniversity).filter(Boolean).map((item) => item.short);
    const max = limit || 4;
    return names.length > max ? `${names.slice(0, max).join(" · ")} +${names.length - max}` : names.join(" · ");
  }

  function detailFile(node) {
    const map = { bip: "bips.html", project: "projects.html", event: "events.html", community: "communities.html", university: "universities.html", opportunity: "opportunities.html" };
    return `${map[node.type] || "index.html"}?item=${encodeURIComponent(node.id)}`;
  }

  function graphLink(node) {
    return `index.html?node=${encodeURIComponent(node.id)}`;
  }

  function statusText(node) {
    if (node.status === "past") return "Past";
    if (node.status === "upcoming") return "Upcoming";
    return "Current";
  }

  // --- Saved and Compare State ---
  const savedIds = new Set(JSON.parse(localStorage.getItem("ingenium-plus-saved") || "[]"));
  const compareIds = new Set(JSON.parse(localStorage.getItem("ingenium-plus-compare") || "[]"));

  function saveState() {
    localStorage.setItem("ingenium-plus-saved", JSON.stringify([...savedIds]));
    renderHeader();
  }

  function saveCompareState() {
    localStorage.setItem("ingenium-plus-compare", JSON.stringify([...compareIds]));
    updateCompareBar();
  }

  function toggleSaved(id, button) {
    if (savedIds.has(id)) savedIds.delete(id); else savedIds.add(id);
    saveState();
    if (button) {
      button.classList.toggle("is-saved", savedIds.has(id));
      button.textContent = savedIds.has(id) ? t("savedState") : t("save");
    }
    showToast(savedIds.has(id) ? "Saved to your list" : "Removed from saved items");
    if (page === "saved") renderSaved();
  }

  function toggleCompare(id, button) {
    if (compareIds.has(id)) {
      compareIds.delete(id);
      showToast("Removed from comparison");
    } else {
      if (compareIds.size >= 3) {
        showToast("You can compare up to 3 items at once");
        return;
      }
      compareIds.add(id);
      showToast("Added to comparison");
    }
    saveCompareState();
    if (button) {
      button.classList.toggle("is-active", compareIds.has(id));
      button.textContent = compareIds.has(id) ? "✓ Comparing" : "+ Compare";
    }
    if (page === "compare") renderCompare();
  }

  function updateCompareBar() {
    let bar = document.getElementById("compare-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "compare-bar";
      bar.className = "compare-bar";
      document.body.appendChild(bar);
    }
    if (compareIds.size === 0 || page === "compare") {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    bar.innerHTML = `
      <div class="compare-bar-info">
        <span>⚖</span>
        <strong>${t("compare")}: ${compareIds.size}/3</strong>
      </div>
      <div class="compare-bar-actions">
        <a href="compare.html" class="button button-primary button-small">${t("compareNow")}</a>
        <button type="button" class="button button-secondary button-small" id="clear-compare-btn">×</button>
      </div>`;
    document.getElementById("clear-compare-btn")?.addEventListener("click", () => {
      compareIds.clear();
      saveCompareState();
      document.querySelectorAll("[data-compare]").forEach(btn => {
        btn.classList.remove("is-active");
        btn.textContent = "+ Compare";
      });
    });
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 2200);
  }

  function renderHeader() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;
    const regular = getNavItems().map(([id, label, href]) => `<a href="${href}" class="${page === id ? "is-active" : ""}" ${page === id ? 'aria-current="page"' : ""}>${label}</a>`).join("");
    const more = getMoreItems().map(([id, label, href]) => `<a href="${href}" class="${page === id ? "is-active" : ""}" ${page === id ? 'aria-current="page"' : ""}>${label}</a>`).join("");
    
    const langOptions = Object.keys(I18N).map(l => `<option value="${l}" ${l === currentLang ? "selected" : ""}>${l.toUpperCase()}</option>`).join("");

    header.innerHTML = `
      <a class="site-brand" href="index.html" aria-label="INGENIUM+ home">
        <img src="https://ingenium-university.eu/wp-content/uploads/2024/03/ingenium-main-logo.svg" alt="INGENIUM European University">
        <span class="version-tag">PLUS · 1.4</span>
      </a>
      <button class="mobile-menu-button" type="button" aria-expanded="false" aria-label="Open menu">☰</button>
      <nav class="main-nav" aria-label="Main navigation">
        ${regular}
        <details class="more-menu" ${getMoreItems().some(([id]) => id === page) ? "open" : ""}>
          <summary>${t("more")}</summary>
          <nav aria-label="More pages">${more}</nav>
        </details>
        <select class="lang-select" aria-label="Select language" id="header-lang-select">
          ${langOptions}
        </select>
      </nav>`;

    const toggle = header.querySelector(".mobile-menu-button");
    const nav = header.querySelector(".main-nav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "×" : "☰";
    });

    header.querySelector("#header-lang-select")?.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  }

  function renderFooter() {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;
    const langOptions = Object.keys(I18N).map(l => `<option value="${l}" ${l === currentLang ? "selected" : ""}>${l.toUpperCase()}</option>`).join("");

    footer.innerHTML = `
      <div class="footer-main">
        <div class="footer-brand">
          <div class="footer-wordmark">INGENIUM+</div>
          <p>A student-led discovery layer for the INGENIUM European University. Real public information, connected with care.</p>
        </div>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="index.html">${t("graph")}</a><a href="bips.html">${t("bips")}</a><a href="events.html">${t("events")}</a><a href="projects.html">${t("projects")}</a><a href="saved.html">${t("saved")}</a><a href="compare.html">${t("compare")}</a><a href="communities.html">${t("communities")}</a><a href="universities.html">${t("universities")}</a><a href="research.html">${t("research")}</a>
        </nav>
      </div>
      <div class="footer-meta">
        <span>INGENIUM+ v${DATA.version} · research checked ${DATA.researchDate}</span>
        <div style="display:flex;align-items:center;gap:12px">
          <span>Student Partnership prototype</span>
          <select class="lang-select" aria-label="Select language" id="footer-lang-select">${langOptions}</select>
        </div>
      </div>`;

    footer.querySelector("#footer-lang-select")?.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  }

  function cardHtml(node, options) {
    const opts = options || {};
    const meta = [];
    if (node.dateLabel) meta.push(node.dateLabel);
    if (node.ects) meta.push(`${node.ects} ECTS`);
    if (node.city) meta.push(node.city);
    if (node.universityIds && node.universityIds.length) meta.push(nodeUniversityNames(node));
    if (node.subtype) meta.push(node.subtype);

    const isSaved = savedIds.has(node.id);
    const isComparing = compareIds.has(node.id);

    return `
      <article class="content-card ${node.type === "university" ? "university-card" : ""}" data-type="${node.type}" data-name="${escapeHtml(node.name.toLowerCase())}" data-universities="${escapeHtml((node.universityIds || []).join(" "))}">
        ${node.type === "university" ? `<div class="uni-monogram">${escapeHtml(node.short)}</div>` : ""}
        <div class="card-top">
          <span class="type-badge">${escapeHtml(node.subtype || typeLabels[node.type])}</span>
          ${node.type === "university" ? "" : `<span class="status-badge ${node.status === "past" ? "past" : ""}">${statusText(node)}</span>`}
        </div>
        <h2>${escapeHtml(node.name)}</h2>
        <p>${escapeHtml(node.description)}</p>
        ${meta.length ? `<div class="card-meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : ""}
        <div class="tag-row">${(node.themes || []).slice(0, 3).map((theme) => `<span class="tag">${escapeHtml(theme)}</span>`).join("")}</div>
        <div class="card-actions">
          <a class="card-link" href="${detailFile(node)}">${t("details")}</a>
          ${node.type !== "university" ? `<button class="compare-button ${isComparing ? "is-active" : ""}" data-compare="${node.id}" type="button">${isComparing ? "✓ Comparing" : "+ Compare"}</button>` : ""}
          ${opts.calendar && node.startDate && node.datePrecision !== "month" ? `<button class="save-button calendar-button" data-calendar="${node.id}" type="button">${t("addToCal")}</button>` : `<button class="save-button ${isSaved ? "is-saved" : ""}" data-save="${node.id}" type="button">${isSaved ? t("savedState") : t("save")}</button>`}
        </div>
      </article>`;
  }

  function bindCardActions(container) {
    container.querySelectorAll("[data-save]").forEach((button) => button.addEventListener("click", () => toggleSaved(button.dataset.save, button)));
    container.querySelectorAll("[data-compare]").forEach((button) => button.addEventListener("click", () => toggleCompare(button.dataset.compare, button)));
    container.querySelectorAll("[data-calendar]").forEach((button) => button.addEventListener("click", () => downloadCalendar(getNode(button.dataset.calendar))));
  }

  function dateCompact(date) {
    return String(date || "").replaceAll("-", "");
  }

  function addDays(dateString, days) {
    const date = new Date(`${dateString}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function downloadCalendar(node) {
    if (!node || !node.startDate) return;
    const end = node.endDate ? addDays(node.endDate, 1) : addDays(node.startDate, 1);
    const content = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//INGENIUM+//v1.4//EN", "BEGIN:VEVENT",
      `UID:${node.id}@ingenium-plus`, `DTSTART;VALUE=DATE:${dateCompact(node.startDate)}`, `DTEND;VALUE=DATE:${dateCompact(end)}`,
      `SUMMARY:${node.name.replaceAll(",", "\\,")}`, `DESCRIPTION:${node.description.replaceAll(",", "\\,")}`,
      node.city ? `LOCATION:${node.city.replaceAll(",", "\\,")}` : "", `URL:${node.source.url}`, "END:VEVENT", "END:VCALENDAR"
    ].filter(Boolean).join("\r\n");
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${node.id}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function downloadBundledCalendar(nodeList) {
    const events = nodeList.filter(n => n.startDate);
    if (!events.length) {
      showToast("No exact-date events in your selection to export");
      return;
    }
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//INGENIUM+//v1.4//EN"];
    events.forEach(node => {
      const end = node.endDate ? addDays(node.endDate, 1) : addDays(node.startDate, 1);
      lines.push(
        "BEGIN:VEVENT",
        `UID:${node.id}@ingenium-plus`,
        `DTSTART;VALUE=DATE:${dateCompact(node.startDate)}`,
        `DTEND;VALUE=DATE:${dateCompact(end)}`,
        `SUMMARY:${node.name.replaceAll(",", "\\,")}`,
        `DESCRIPTION:${node.description.replaceAll(",", "\\,")}`,
        node.city ? `LOCATION:${node.city.replaceAll(",", "\\,")}` : "",
        `URL:${node.source?.url || ""}`,
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.filter(Boolean).join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ingenium-saved-events.ics";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`Exported ${events.length} events to calendar`);
  }

  function copyMarkdownSummary(nodeList) {
    if (!nodeList.length) return;
    let md = `# INGENIUM+ Saved Opportunities (${nodeList.length})\n\n`;
    md += `Exported from INGENIUM+ on ${new Date().toLocaleDateString()}.\n\n`;
    md += `| Programme / Opportunity | Type | ECTS | Host / Location | Timing |\n`;
    md += `|---|---|---|---|---|\n`;
    nodeList.forEach(n => {
      const ects = n.ects ? `${n.ects} ECTS` : "-";
      const loc = n.city || (n.universityIds || []).map(getUniversity).filter(Boolean).map(u => u.short).join(", ") || "-";
      const time = n.dateLabel || "-";
      md += `| [${n.name}](${n.source?.url || ""}) | ${n.subtype || typeLabels[n.type]} | ${ects} | ${loc} | ${time} |\n`;
    });
    md += `\n*Note: Confirm deadlines and funding with your home university's INGENIUM / Erasmus office.*\n`;

    navigator.clipboard.writeText(md).then(() => {
      showToast("Markdown summary copied to clipboard!");
    }).catch(() => {
      showToast("Could not copy markdown automatically");
    });
  }

  function detailFacts(node) {
    const facts = [];
    if (node.dateLabel) facts.push(["When", node.dateLabel]);
    if (node.city) facts.push(["Where", node.city]);
    if (node.ects) facts.push(["Credit", `${node.ects} ECTS`]);
    if (node.bipType) facts.push(["BIP type", node.bipType]);
    if (node.delivery) facts.push(["Format", node.delivery]);
    if (node.capacity) facts.push(["Published capacity", node.capacity]);
    if (node.funding) facts.push(["Funding / status", node.funding]);
    if (node.access) facts.push(["How to join", node.access]);
    if (node.platform) facts.push(["Community type", node.platform]);
    if (node.universityIds && node.universityIds.length) facts.push(["Connected universities", nodeUniversityNames(node, 10)]);
    return facts;
  }

  function detailInnerHtml(node, includeHeading) {
    const isSaved = savedIds.has(node.id);
    const isComparing = compareIds.has(node.id);
    return `
      <p class="detail-kicker">${escapeHtml(node.subtype || typeLabels[node.type])} · ${statusText(node)}</p>
      ${includeHeading === false ? "" : `<h2 id="detail-title">${escapeHtml(node.name)}</h2>`}
      ${node.city ? `<p class="detail-location">${escapeHtml(node.city)}</p>` : ""}
      <p class="detail-summary">${escapeHtml(node.description)}</p>
      <div class="detail-facts">${detailFacts(node).map(([label, value]) => `<div class="detail-fact"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
      ${node.application ? `<div class="prose callout"><strong>Application route</strong><p>${escapeHtml(node.application)}</p></div>` : ""}
      <div class="tag-row">${(node.themes || []).map((theme) => `<span class="tag">${escapeHtml(theme)}</span>`).join("")}</div>
      <div class="source-box"><span>Official source</span><a href="${node.source.url}" target="_blank" rel="noopener">${escapeHtml(node.source.title)} ↗</a><small>${escapeHtml(node.source.kind)} · checked ${escapeHtml(node.lastVerifiedAt)}</small></div>
      <div class="detail-actions">
        <a class="button button-primary" href="${graphLink(node)}">${t("viewInNetwork")}</a>
        ${node.type !== "university" ? `<button class="button button-secondary ${isComparing ? "is-active" : ""}" data-compare="${node.id}" type="button">${isComparing ? "✓ In comparison" : "+ Compare"}</button>` : ""}
        <button class="button button-secondary detail-save ${isSaved ? "is-saved" : ""}" data-save="${node.id}" type="button">${isSaved ? t("savedState") : t("save")}</button>
      </div>`;
  }

  function renderDetailPage(node) {
    const target = document.getElementById("page-content");
    const related = DATA.nodes.filter((candidate) => candidate.id !== node.id && (candidate.universityIds || []).some((id) => (node.universityIds || []).includes(id))).slice(0, 6);
    target.innerHTML = `
      <nav aria-label="Breadcrumb"><a class="card-link" href="${detailFile({ ...node, id: "" }).split("?")[0]}">← Back to ${typeLabels[node.type]}s</a></nav>
      <section class="section-block" style="margin-top:30px">
        <div class="prose"><h2>${escapeHtml(node.name)}</h2>${detailInnerHtml(node, false)}</div>
      </section>
      ${related.length ? `<section class="section-block"><div class="section-head"><div><p class="eyebrow">Connected in the graph</p><h2>Related routes</h2></div></div><div class="card-grid">${related.map((item) => cardHtml(item)).join("")}</div></section>` : ""}`;
    bindCardActions(target);
  }

  // --- Page Renderers ---

  function renderSaved() {
    const target = document.getElementById("page-content");
    const savedNodes = [...savedIds].map(getNode).filter(Boolean);
    const totalEcts = savedNodes.reduce((acc, n) => acc + (n.ects || 0), 0);
    const bipCount = savedNodes.filter(n => n.type === "bip").length;
    const projCount = savedNodes.filter(n => n.type === "project").length;

    if (!savedNodes.length) {
      target.innerHTML = `
        <div class="prose">
          <div class="callout" style="text-align:center;padding:48px 24px">
            <h2>${t("emptySaved")}</h2>
            <p>${t("emptySavedDesc")}</p>
            <div style="margin-top:24px;display:flex;justify-content:center;gap:12px;flex-wrap:wrap">
              <a class="button button-primary" href="index.html">${t("viewInNetwork")}</a>
              <a class="button button-secondary" href="bips.html">Browse BIPs</a>
            </div>
          </div>
        </div>`;
      return;
    }

    target.innerHTML = `
      <div class="stat-row">
        <div class="stat"><strong>${savedNodes.length}</strong><span>Saved items</span></div>
        <div class="stat"><strong>${bipCount}</strong><span>BIPs</span></div>
        <div class="stat"><strong>${projCount}</strong><span>Projects</span></div>
        <div class="stat"><strong>${totalEcts}</strong><span>Total ECTS</span></div>
      </div>
      <div class="saved-toolbar">
        <div class="saved-actions-group">
          <button type="button" class="button button-primary button-small" id="saved-export-ics">📅 ${t("exportIcs")}</button>
          <button type="button" class="button button-secondary button-small" id="saved-export-md">📋 ${t("exportMd")}</button>
          <button type="button" class="button button-secondary button-small" id="saved-print">🖨 ${t("printView")}</button>
          <button type="button" class="button button-secondary button-small" id="saved-share-journey">🔗 ${t("shareJourney")}</button>
        </div>
        <button type="button" class="text-button" id="saved-clear-all" style="color:var(--magenta);font-size:12px">${t("clearAll")}</button>
      </div>
      <div class="card-grid">${savedNodes.map(item => cardHtml(item)).join("")}</div>`;

    bindCardActions(target);

    document.getElementById("saved-export-ics")?.addEventListener("click", () => downloadBundledCalendar(savedNodes));
    document.getElementById("saved-export-md")?.addEventListener("click", () => copyMarkdownSummary(savedNodes));
    document.getElementById("saved-print")?.addEventListener("click", () => window.print());
    document.getElementById("saved-share-journey")?.addEventListener("click", () => {
      const url = `${location.origin}${location.pathname.replace("saved.html", "index.html")}?custom_journey=${[...savedIds].join(",")}`;
      navigator.clipboard.writeText(url).then(() => {
        showToast("Custom journey link copied to clipboard!");
      });
    });
    document.getElementById("saved-clear-all")?.addEventListener("click", () => {
      if (confirm("Remove all saved items?")) {
        savedIds.clear();
        saveState();
        renderSaved();
      }
    });
  }

  function renderCompare() {
    const target = document.getElementById("page-content");
    const params = new URLSearchParams(location.search);
    const urlItems = params.get("items") ? params.get("items").split(",").filter(Boolean) : [];
    if (urlItems.length > 0) {
      urlItems.forEach(id => compareIds.add(id));
      saveCompareState();
    }

    const items = [...compareIds].map(getNode).filter(Boolean);

    const selectableNodes = DATA.nodes.filter(n => n.type !== "university" && !compareIds.has(n.id));
    const addOptions = `<option value="">+ Add another programme to compare...</option>` +
      selectableNodes.map(n => `<option value="${n.id}">[${n.subtype || typeLabels[n.type]}] ${escapeHtml(n.name)}</option>`).join("");

    target.innerHTML = `
      <div class="saved-toolbar">
        <div>
          <p style="margin:0;font-size:13px;font-weight:600">${t("comparePrompt")}</p>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          ${items.length < 3 ? `<select class="page-select" id="compare-add-select" style="font-size:12px">${addOptions}</select>` : ""}
          ${items.length > 0 ? `<button type="button" class="text-button" id="compare-clear-btn" style="color:var(--magenta);font-size:12px">${t("clearAll")}</button>` : ""}
        </div>
      </div>
      ${items.length === 0 ? `
        <div class="prose">
          <div class="callout" style="text-align:center;padding:48px 24px">
            <h2>No programmes selected for comparison</h2>
            <p>Go to the BIPs, Opportunities, or Network view and click "+ Compare" on any card.</p>
            <div style="margin-top:20px"><a class="button button-primary" href="bips.html">Browse BIPs</a></div>
          </div>
        </div>` : `
        <div class="compare-grid">
          ${items.map(item => `
            <div class="compare-column">
              <button class="compare-remove" data-remove-compare="${item.id}" title="Remove from comparison" aria-label="Remove ${escapeHtml(item.name)}">×</button>
              <div class="compare-column-head">
                <span class="type-badge">${escapeHtml(item.subtype || typeLabels[item.type])}</span>
                <h3 style="margin:12px 0 6px;font-size:16px">${escapeHtml(item.name)}</h3>
                <small style="color:var(--muted)">${statusText(item)}</small>
              </div>
              <div class="compare-field">
                <span class="compare-field-label">Host / Partners</span>
                <span class="compare-field-value">${nodeUniversityNames(item, 8) || item.city || "-"}</span>
              </div>
              <div class="compare-field">
                <span class="compare-field-label">Credits & Timing</span>
                <span class="compare-field-value">${item.ects ? `${item.ects} ECTS` : "N/A"} · ${escapeHtml(item.dateLabel || "Varies")}</span>
              </div>
              <div class="compare-field">
                <span class="compare-field-label">Format / Delivery</span>
                <span class="compare-field-value">${escapeHtml(item.delivery || item.bipType || item.platform || "-")}</span>
              </div>
              <div class="compare-field">
                <span class="compare-field-label">Capacity / Funding</span>
                <span class="compare-field-value">${escapeHtml(item.capacity || item.funding || "Erasmus+ grant support eligible")}</span>
              </div>
              <div class="compare-field">
                <span class="compare-field-label">Themes</span>
                <div class="tag-row">${(item.themes || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
              </div>
              <div class="compare-field">
                <span class="compare-field-label">Official Route</span>
                <a href="${item.source.url}" target="_blank" rel="noopener" class="card-link">${escapeHtml(item.source.title)} ↗</a>
              </div>
              <div style="margin-top:auto;padding-top:16px;display:flex;gap:8px">
                <a href="${graphLink(item)}" class="button button-primary button-small" style="flex:1;text-align:center">${t("viewInNetwork")}</a>
                <button type="button" class="button button-secondary button-small" data-save="${item.id}">${savedIds.has(item.id) ? t("savedState") : t("save")}</button>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    `;

    bindCardActions(target);

    document.getElementById("compare-add-select")?.addEventListener("change", (e) => {
      if (e.target.value) {
        toggleCompare(e.target.value);
      }
    });

    document.getElementById("compare-clear-btn")?.addEventListener("click", () => {
      compareIds.clear();
      saveCompareState();
      renderCompare();
    });

    target.querySelectorAll("[data-remove-compare]").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleCompare(btn.dataset.removeCompare);
      });
    });
  }

  function renderBips() {
    const target = document.getElementById("page-content");
    const itemId = new URLSearchParams(location.search).get("item");
    if (itemId) return renderDetailPage(getNode(itemId) || DATA.bips[0]);
    const universities = DATA.universities.map((item) => `<option value="${item.id}">${escapeHtml(item.short)} · ${escapeHtml(item.country)}</option>`).join("");
    target.innerHTML = `
      <div class="stat-row"><div class="stat"><strong>13</strong><span>${t("bipCount")}</span></div><div class="stat"><strong>7</strong><span>Host countries</span></div><div class="stat"><strong>3–5</strong><span>ECTS</span></div><div class="stat"><strong>10</strong><span>${t("uniCount")}</span></div></div>
      <div class="page-tools"><input class="page-search" id="directory-search" type="search" placeholder="Search subjects or programme names"><select class="page-select" id="directory-university"><option value="all">All host universities</option>${universities}</select><select class="page-select" id="directory-type"><option value="all">All BIP types</option><option>Transversal</option><option>Cross-disciplinary</option><option>Discipline-specific</option></select><span class="result-count" id="directory-count"></span></div>
      <div class="card-grid" id="directory-grid">${DATA.bips.map((item) => cardHtml(item)).join("")}</div>
      <div class="source-box" style="margin-top:30px"><span>Important</span><a href="${DATA.sources.bips.url}" target="_blank" rel="noopener">Check the official call and your home-university instructions before applying ↗</a><small>Local deadlines and funding arrangements can differ.</small></div>`;
    bindCardActions(target);
    bindDirectoryFilters(DATA.bips, (item, filters) => {
      const search = `${item.name} ${item.description} ${(item.themes || []).join(" ")}`.toLowerCase();
      const typeMatch = filters.type === "all" || item.bipType.toLowerCase().startsWith(filters.type.toLowerCase());
      return search.includes(filters.query) && (filters.university === "all" || item.hostId === filters.university) && typeMatch;
    });
  }

  function bindDirectoryFilters(items, matcher) {
    const search = document.getElementById("directory-search");
    const university = document.getElementById("directory-university");
    const type = document.getElementById("directory-type");
    const grid = document.getElementById("directory-grid");
    const count = document.getElementById("directory-count");
    if (!grid) return;
    const update = () => {
      const filters = { query: (search?.value || "").trim().toLowerCase(), university: university?.value || "all", type: type?.value || "all" };
      let visible = 0;
      items.forEach((item) => {
        const card = grid.querySelector(`[data-name="${CSS.escape(item.name.toLowerCase())}"]`);
        const show = matcher(item, filters);
        if (card) card.hidden = !show;
        if (show) visible += 1;
      });
      if (count) count.textContent = `${visible} result${visible === 1 ? "" : "s"}`;
    };
    [search, university, type].filter(Boolean).forEach((control) => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", update));
    update();
  }

  function renderEvents() {
    const target = document.getElementById("page-content");
    const itemId = new URLSearchParams(location.search).get("item");
    if (itemId) return renderDetailPage(getNode(itemId) || DATA.events[0]);
    const upcoming = DATA.nodes.filter((item) => (item.type === "event" || item.type === "bip") && item.status === "upcoming");
    target.innerHTML = `
      <section class="section-block">
        <div class="section-head">
          <div><p class="eyebrow">Timeline & Deadlines</p><h2>Upcoming learning moments</h2></div>
          <p>Upcoming BIPs and alliance events with verified dates and calendar sync.</p>
        </div>
        <div class="card-grid">${upcoming.map((item) => cardHtml(item, { calendar: true })).join("")}</div>
      </section>
      <section class="section-block">
        <div class="section-head">
          <div><p class="eyebrow">Archive</p><h2>10 Days of INGENIUM · 2026</h2></div>
          <p>Past seasonal events preserved as verified records of student learning.</p>
        </div>
        <div class="timeline">${DATA.events.map((item) => `
          <article class="timeline-item">
            <time>${escapeHtml(item.dateLabel)}</time>
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <div style="font-size:11px;color:var(--muted);margin-top:2px">${escapeHtml(item.city)} · ${nodeUniversityNames(item)}</div>
            </div>
            <button class="button button-secondary button-small calendar-button" data-calendar="${item.id}" type="button">${t("addToCal")}</button>
          </article>`).join("")}
        </div>
      </section>`;
    bindCardActions(target);
  }

  function renderProjects() {
    const target = document.getElementById("page-content");
    const itemId = new URLSearchParams(location.search).get("item");
    if (itemId) return renderDetailPage(getNode(itemId) || DATA.projects[0]);
    const funded = DATA.projects.filter((item) => item.funding.includes("awarded"));
    const supported = DATA.projects.filter((item) => !item.funding.includes("awarded"));
    target.innerHTML = `
      <section class="section-block"><div class="section-head"><div><p class="eyebrow">2026 Student Partnerships</p><h2>Six funded projects</h2></div><p>Selected by a joint process involving alliance leadership and student representation.</p></div><div class="card-grid">${funded.map((item) => cardHtml(item)).join("")}</div></section>
      <section class="section-block"><div class="section-head"><div><p class="eyebrow">Additional support</p><h2>Ideas continuing their journey</h2></div><p>These initiatives were publicly described as receiving support to identify alternative funding, rather than as funded winners.</p></div><div class="card-grid two">${supported.map((item) => cardHtml(item)).join("")}</div></section>`;
    bindCardActions(target);
  }

  function renderCommunities() {
    const target = document.getElementById("page-content");
    const itemId = new URLSearchParams(location.search).get("item");
    if (itemId) return renderDetailPage(getNode(itemId) || DATA.communities[0]);
    target.innerHTML = `
      <div class="prose"><div class="callout"><strong>Verified routes only</strong><p>INGENIUM+ does not publish private invitation links, phone numbers, participant lists or simulated chat activity. Where an official public route is available, it is linked to the responsible organisation.</p></div></div>
      <section class="section-block"><div class="section-head"><div><p class="eyebrow">Alliance-wide</p><h2>Student communities</h2></div><p>A deliberately small directory until more community owners and joining routes can be verified.</p></div><div class="card-grid two">${DATA.communities.map((item) => cardHtml(item)).join("")}</div></section>
      <section class="section-block"><div class="section-head"><div><p class="eyebrow">Connected projects</p><h2>Community-building in practice</h2></div></div><div class="card-grid">${DATA.projects.filter((item) => item.themes.some((theme) => ["Student organisations", "Student connection", "Intercultural learning"].includes(theme))).map((item) => cardHtml(item)).join("")}</div></section>`;
    bindCardActions(target);
  }

  function renderUniversities() {
    const target = document.getElementById("page-content");
    const itemId = new URLSearchParams(location.search).get("item");
    if (itemId) return renderDetailPage(getNode(itemId) || DATA.universities[0]);
    target.innerHTML = `<div class="stat-row"><div class="stat"><strong>10</strong><span>${t("uniCount")}</span></div><div class="stat"><strong>10</strong><span>Countries</span></div><div class="stat"><strong>1</strong><span>European campus</span></div><div class="stat"><strong>${DATA.nodes.length}</strong><span>${t("nodeCount")}</span></div></div><div class="card-grid">${DATA.universities.map((item) => cardHtml(item)).join("")}</div>`;
    bindCardActions(target);
  }

  function renderOpportunities() {
    const target = document.getElementById("page-content");
    const itemId = new URLSearchParams(location.search).get("item");
    if (itemId) return renderDetailPage(getNode(itemId) || DATA.opportunities[0]);
    target.innerHTML = `<section class="section-block"><div class="section-head"><div><p class="eyebrow">Study and move</p><h2>Routes into the European campus</h2></div><p>Use these verified services as starting points, then confirm local procedures with your home institution.</p></div><div class="card-grid">${DATA.opportunities.map((item) => cardHtml(item)).join("")}</div></section><section class="section-block"><div class="section-head"><div><p class="eyebrow">Short international learning</p><h2>Blended Intensive Programmes</h2></div><a class="button button-secondary" href="bips.html">Browse all 13</a></div><div class="card-grid">${DATA.bips.slice(0, 3).map((item) => cardHtml(item)).join("")}</div></section>`;
    bindCardActions(target);
  }

  function renderResearch() {
    const target = document.getElementById("page-content");
    const sources = Object.values(DATA.sources);
    target.innerHTML = `
      <div class="stat-row"><div class="stat"><strong>${DATA.nodes.length}</strong><span>Public graph nodes</span></div><div class="stat"><strong>${sources.length}</strong><span>Primary sources</span></div><div class="stat"><strong>${DATA.researchDate}</strong><span>Research date</span></div><div class="stat"><strong>0</strong><span>Public student profiles</span></div></div>
      <section class="section-block"><div class="section-head"><div><p class="eyebrow">Evidence first</p><h2>Research method</h2></div></div><div class="prose"><p>Version 1.4 replaces demo nodes with a reviewed public dataset. A node is published only when it can be traced to an official INGENIUM or partner-university source.</p><h3>Freshness</h3><p>Every record carries a last-verified date. Past events remain visible as an archive. Month-only programme dates are presented as months and are not silently converted into exact calendar dates.</p><h3>Privacy</h3><p>No individual student is published as a graph node. Private chats, personal contact details and invitation links are excluded unless an authorised public joining route exists.</p><h3>Limitations</h3><p>Local application deadlines and funding arrangements may differ. Students should always confirm them with their home university. This prototype does not scrape official sites or claim to be an authoritative student-information system.</p></div></section>
      <section class="section-block"><div class="section-head"><div><p class="eyebrow">Source registry</p><h2>Official references</h2></div></div><table class="source-table"><thead><tr><th>Source</th><th>Kind</th><th>Verified</th><th>Link</th></tr></thead><tbody>${sources.map((source) => `<tr><td>${escapeHtml(source.title)}</td><td>${escapeHtml(source.kind)}</td><td>${DATA.researchDate}</td><td><a href="${source.url}" target="_blank" rel="noopener">Open source ↗</a></td></tr>`).join("")}</tbody></table></section>`;
  }

  function renderAbout() {
    const target = document.getElementById("page-content");
    target.innerHTML = `
      <div class="prose">
        <blockquote>No endless feed. INGENIUM+ makes the European campus visible through relationships.</blockquote>
        <h2>Why it exists</h2><p>INGENIUM brings together ten universities, yet many students encounter the alliance through a single event, email or mobility. INGENIUM+ explores a different interface: a graph that shows how opportunities, programmes, projects, communities and campuses connect.</p>
        <h2>Student-led origins</h2><p>The concept was developed by students connected through alliance experiences. The current team brings together students from Munster Technological University, Gheorghe Asachi Technical University of Iași and Xamk. The concept received recognition in the INGENIUM Best New Media Practices competition’s Young Innovators category.</p>
        <h2>What changed in v1.4</h2><p>This release introduces a dedicated Saved Opportunities hub with calendar and markdown export, side-by-side programme comparison, graph hover tooltips, spring collision relaxation, multi-language localization, and full offline PWA support.</p>
        <h2>What it is not</h2><p>It is not an official application portal, student registry or live chat service. It is a discovery prototype that routes students back to verified official sources.</p>
        <div class="callout"><strong>Start exploring</strong><p><a class="button button-primary" href="index.html">Open the network graph</a></p></div>
      </div>`;
  }

  function initContentPage() {
    const renderers = {
      bips: renderBips,
      events: renderEvents,
      projects: renderProjects,
      communities: renderCommunities,
      universities: renderUniversities,
      opportunities: renderOpportunities,
      research: renderResearch,
      about: renderAbout,
      saved: renderSaved,
      compare: renderCompare
    };
    if (renderers[page]) renderers[page]();
  }

  // --- Graph Visualization with Collision Relaxation & Tooltips ---

  function initGraph() {
    const svg = document.getElementById("network-svg");
    if (!svg) return;
    const NS = "http://www.w3.org/2000/svg";
    const WIDTH = 1200;
    const HEIGHT = 720;
    svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    const tooltipEl = document.getElementById("graph-tooltip");

    const params = new URLSearchParams(location.search);
    const customRoute = params.get("custom_journey") || params.get("nodes");
    const state = {
      query: params.get("q") || "",
      types: new Set((params.get("types") || Object.keys(typeLabels).join(",")).split(",").filter(Boolean)),
      university: params.get("university") || "all",
      theme: params.get("theme") || "all",
      status: params.get("status") || "all",
      journey: params.get("journey") || (customRoute ? "custom" : null),
      customNodes: customRoute ? customRoute.split(",").filter(Boolean) : [],
      selected: params.get("node") || null,
      scale: 1,
      tx: 0,
      ty: 0,
      listView: false
    };

    const positions = new Map();
    const nodeEls = new Map();
    const edgeEls = [];
    const pointerMap = new Map();
    let root;
    let drag = null;
    let pinchDistance = null;

    function project(lon, lat) {
      return { x: 92 + ((lon + 12) / 44) * 1010, y: 92 + ((62 - lat) / 28) * 520 };
    }

    function hash(text) {
      let value = 0;
      for (let i = 0; i < text.length; i += 1) value = ((value << 5) - value + text.charCodeAt(i)) | 0;
      return Math.abs(value);
    }

    // Position calculation with spring-based collision relaxation
    function positionNodes() {
      // 1. Initial Geographic Anchors for Universities
      DATA.universities.forEach((node) => positions.set(node.id, project(node.lon, node.lat)));

      // 2. Initial Radial Offsets for Non-University Nodes
      const nonUniNodes = DATA.nodes.filter((node) => node.type !== "university");
      nonUniNodes.forEach((node) => {
        const anchors = (node.universityIds || []).map((id) => positions.get(id)).filter(Boolean);
        let base = anchors[0] || { x: WIDTH / 2, y: HEIGHT / 2 };
        if (node.universityIds && node.universityIds.length === DATA.universities.length) base = { x: WIDTH / 2, y: HEIGHT / 2 };
        const h = hash(node.id);
        const angle = ((h % 360) * Math.PI) / 180;
        const radius = 35 + (h % 75);
        positions.set(node.id, {
          x: Math.max(50, Math.min(WIDTH - 50, base.x + Math.cos(angle) * radius)),
          y: Math.max(50, Math.min(HEIGHT - 50, base.y + Math.sin(angle) * radius))
        });
      });

      // 3. Collision Avoidance Relaxation Passes (25 iterations)
      const minDist = 62;
      for (let iter = 0; iter < 25; iter++) {
        for (let i = 0; i < nonUniNodes.length; i++) {
          const nodeA = nonUniNodes[i];
          const posA = positions.get(nodeA.id);

          for (let j = i + 1; j < nonUniNodes.length; j++) {
            const nodeB = nonUniNodes[j];
            const posB = positions.get(nodeB.id);

            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;
            const dist = Math.hypot(dx, dy) || 1;

            if (dist < minDist) {
              const overlap = (minDist - dist) / 2;
              const nx = (dx / dist) * overlap * 0.4;
              const ny = (dy / dist) * overlap * 0.4;

              posA.x = Math.max(45, Math.min(WIDTH - 45, posA.x - nx));
              posA.y = Math.max(45, Math.min(HEIGHT - 45, posA.y - ny));
              posB.x = Math.max(45, Math.min(WIDTH - 45, posB.x + nx));
              posB.y = Math.max(45, Math.min(HEIGHT - 45, posB.y + ny));
            }
          }
        }
      }
    }

    function createSvg(name, attrs) {
      const element = document.createElementNS(NS, name);
      Object.entries(attrs || {}).forEach(([key, value]) => element.setAttribute(key, value));
      return element;
    }

    function nodeShape(node, radius) {
      if (node.type === "bip") return createSvg("rect", { class: "node-ring", x: -radius * .72, y: -radius * .72, width: radius * 1.44, height: radius * 1.44, rx: 2, transform: "rotate(45)" });
      if (node.type === "project") return createSvg("rect", { class: "node-ring", x: -radius, y: -radius, width: radius * 2, height: radius * 2, rx: 4 });
      if (node.type === "event") return createSvg("polygon", { class: "node-ring", points: `${-radius},0 ${-radius/2},${-radius*.86} ${radius/2},${-radius*.86} ${radius},0 ${radius/2},${radius*.86} ${-radius/2},${radius*.86}` });
      if (node.type === "community") return createSvg("rect", { class: "node-ring", x: -radius, y: -radius * .8, width: radius * 2, height: radius * 1.6, rx: radius * .75 });
      return createSvg("circle", { class: "node-ring", cx: 0, cy: 0, r: radius });
    }

    function iconText(node) {
      if (node.type === "university") return node.short;
      return { bip: "B", project: "P", event: "E", community: "C", opportunity: "O" }[node.type] || "•";
    }

    function showTooltip(node, event) {
      if (!tooltipEl || !node) return;
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - rect.left + 15;
      const y = event.clientY - rect.top + 15;

      const meta = [];
      if (node.city) meta.push(node.city);
      if (node.ects) meta.push(`${node.ects} ECTS`);
      if (node.dateLabel) meta.push(node.dateLabel);

      tooltipEl.innerHTML = `
        <div class="graph-tooltip-title">${escapeHtml(node.name)}</div>
        <div class="graph-tooltip-meta">
          <span class="type-badge">${escapeHtml(node.subtype || typeLabels[node.type])}</span>
          ${meta.map(m => `<span>${escapeHtml(m)}</span>`).join(" · ")}
        </div>
        <p class="graph-tooltip-desc">${escapeHtml(node.description)}</p>
      `;

      tooltipEl.style.left = `${Math.min(x, rect.width - 240)}px`;
      tooltipEl.style.top = `${Math.min(y, rect.height - 130)}px`;
      tooltipEl.hidden = false;
      tooltipEl.classList.add("is-visible");
    }

    function hideTooltip() {
      if (!tooltipEl) return;
      tooltipEl.classList.remove("is-visible");
      tooltipEl.hidden = true;
    }

    function buildGraph() {
      positionNodes();
      svg.innerHTML = "";
      root = createSvg("g", { class: "graph-root" });
      svg.appendChild(root);

      const backdrop = createSvg("g", { class: "graph-backdrop" });
      backdrop.innerHTML = `<path class="map-outline" d="M188 206 C230 126 366 103 443 141 C505 92 615 106 654 166 C746 119 900 154 938 242 C1011 286 995 384 923 409 C887 483 771 508 695 474 C610 543 473 511 436 443 C343 457 240 405 245 327 C176 301 146 251 188 206Z"></path><text class="map-label" x="600" y="352">ONE EUROPEAN CAMPUS</text>`;
      root.appendChild(backdrop);

      const edgesGroup = createSvg("g", { class: "edges" });
      root.appendChild(edgesGroup);
      DATA.nodes.filter((node) => node.type !== "university").forEach((node) => {
        const ids = node.hostId ? [node.hostId] : (node.universityIds || []).slice(0, node.type === "project" ? 6 : 2);
        ids.forEach((universityId) => {
          const from = positions.get(universityId);
          const to = positions.get(node.id);
          if (!from || !to) return;
          const line = createSvg("line", { class: "network-edge", x1: from.x, y1: from.y, x2: to.x, y2: to.y, "data-a": universityId, "data-b": node.id });
          edgesGroup.appendChild(line);
          edgeEls.push(line);
        });
      });

      const nodesGroup = createSvg("g", { class: "nodes" });
      root.appendChild(nodesGroup);
      DATA.nodes.forEach((node) => {
        const pos = positions.get(node.id);
        const radius = node.type === "university" ? 18 : 11;
        const group = createSvg("g", { class: `network-node node-${node.type} ${node.type === "university" ? "is-anchor" : ""}`, transform: `translate(${pos.x} ${pos.y})`, tabindex: "0", role: "button", "aria-label": `${typeLabels[node.type]}: ${node.name}`, "data-id": node.id });
        group.appendChild(nodeShape(node, radius));
        const core = createSvg("circle", { class: "node-core", cx: 0, cy: 0, r: node.type === "university" ? 11 : 5.5 });
        group.appendChild(core);
        const icon = createSvg("text", { class: "node-icon", x: 0, y: .5 });
        icon.textContent = iconText(node);
        group.appendChild(icon);
        const label = createSvg("text", { class: "node-label", x: 0, y: node.type === "university" ? 34 : 26 });
        const max = node.type === "university" ? 23 : 28;
        label.textContent = node.name.length > max ? `${node.name.slice(0, max - 1)}…` : node.name;
        group.appendChild(label);

        group.addEventListener("click", (event) => { event.stopPropagation(); selectNode(node.id, true); });
        group.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectNode(node.id, true); } });
        group.addEventListener("mouseenter", (e) => {
          updateRelationships(node.id, true);
          showTooltip(node, e);
        });
        group.addEventListener("mousemove", (e) => showTooltip(node, e));
        group.addEventListener("mouseleave", () => {
          updateRelationships(state.selected, false);
          hideTooltip();
        });

        nodesGroup.appendChild(group);
        nodeEls.set(node.id, group);
      });
      applyTransform();
      applyFilters();
    }

    function applyTransform() {
      root.setAttribute("transform", `translate(${state.tx} ${state.ty}) scale(${state.scale})`);
    }

    function visibleNodes() {
      const query = state.query.trim().toLowerCase();
      return DATA.nodes.filter((node) => {
        const text = `${node.name} ${node.description} ${(node.themes || []).join(" ")} ${node.city || ""}`.toLowerCase();
        const typeOk = state.types.has(node.type);
        const universityOk = state.university === "all" || (node.universityIds || []).includes(state.university) || node.id === state.university;
        const themeOk = state.theme === "all" || (node.themes || []).includes(state.theme);
        const statusOk = state.status === "all" || node.status === state.status;
        const searchOk = !query || text.includes(query);
        return typeOk && universityOk && themeOk && statusOk && searchOk;
      });
    }

    function applyFilters() {
      const visible = new Set(visibleNodes().map((node) => node.id));
      DATA.nodes.forEach((node) => nodeEls.get(node.id)?.classList.toggle("is-hidden", !visible.has(node.id)));
      edgeEls.forEach((line) => {
        const show = visible.has(line.dataset.a) && visible.has(line.dataset.b);
        line.style.display = show ? "" : "none";
      });
      const count = document.getElementById("visible-count");
      if (count) count.textContent = `${visible.size} ${t("nodeCount")}`;
      document.getElementById("graph-empty").hidden = visible.size > 0;
      updateFilterCount();
      updateList();
      updateUrl();
      if (state.journey) applyJourney(state.journey, false);
      if (state.selected) updateRelationships(state.selected, false);
    }

    function updateFilterCount() {
      let count = 0;
      if (state.types.size !== Object.keys(typeLabels).length) count += 1;
      if (state.university !== "all") count += 1;
      if (state.theme !== "all") count += 1;
      if (state.status !== "all") count += 1;
      if (state.query) count += 1;
      const badge = document.getElementById("filter-count");
      if (badge) badge.textContent = count ? `· ${count}` : "";
    }

    function updateUrl() {
      const next = new URLSearchParams();
      if (state.query) next.set("q", state.query);
      if (state.types.size !== Object.keys(typeLabels).length) next.set("types", [...state.types].join(","));
      if (state.university !== "all") next.set("university", state.university);
      if (state.theme !== "all") next.set("theme", state.theme);
      if (state.status !== "all") next.set("status", state.status);
      if (state.journey && state.journey !== "custom") next.set("journey", state.journey);
      if (state.customNodes && state.customNodes.length) next.set("custom_journey", state.customNodes.join(","));
      if (state.selected) next.set("node", state.selected);
      history.replaceState(null, "", `${location.pathname}${next.toString() ? `?${next}` : ""}`);
    }

    function updateRelationships(id, hover) {
      const related = new Set();
      if (id) {
        related.add(id);
        edgeEls.forEach((line) => {
          if (line.dataset.a === id) related.add(line.dataset.b);
          if (line.dataset.b === id) related.add(line.dataset.a);
        });
      }
      edgeEls.forEach((line) => {
        const hit = id && (line.dataset.a === id || line.dataset.b === id);
        line.classList.toggle("is-related", Boolean(hit));
        line.classList.toggle("is-dimmed", Boolean(id && !hit));
      });
      nodeEls.forEach((element, nodeId) => {
        element.classList.toggle("is-related", related.has(nodeId) && nodeId !== id);
        if (!state.journey) element.classList.toggle("is-dimmed", Boolean(id && !related.has(nodeId)));
      });
      if (!hover && !id && !state.journey) nodeEls.forEach((element) => element.classList.remove("is-dimmed", "is-related"));
    }

    function selectNode(id, open) {
      state.selected = id;
      nodeEls.forEach((element, nodeId) => element.classList.toggle("is-selected", nodeId === id));
      updateRelationships(id, false);
      updateUrl();
      if (open && id) openDetail(getNode(id));
    }

    function openDetail(node) {
      if (!node) return;
      const content = document.getElementById("detail-content");
      content.innerHTML = detailInnerHtml(node, true);
      bindCardActions(content);
      openDrawer(document.getElementById("detail-drawer"));
    }

    function journeyNodes(journey) {
      if (journey.id === "my-journey") {
        const settings = JSON.parse(localStorage.getItem("ingenium-plus-journey") || "null");
        if (!settings) return [];
        return DATA.nodes.filter((node) => node.id === settings.university || (node.universityIds || []).includes(settings.university) || (node.themes || []).includes(settings.theme)).map((node) => node.id);
      }
      const ids = new Set(journey.nodeIds || []);
      if (journey.universityId) ids.add(journey.universityId);
      [...ids].forEach((nodeId) => {
        const node = getNode(nodeId);
        (node?.universityIds || []).forEach((universityId) => ids.add(universityId));
      });
      return [...ids];
    }

    function applyJourney(id, announce) {
      let ids = new Set();
      let name = "";
      if (id === "custom" && state.customNodes.length) {
        ids = new Set(state.customNodes);
        state.customNodes.forEach(nid => {
          const n = getNode(nid);
          (n?.universityIds || []).forEach(u => ids.add(u));
        });
        name = t("customJourney");
      } else {
        const journey = DATA.journeys.find((item) => item.id === id);
        if (!journey) return;
        ids = new Set(journeyNodes(journey));
        name = journey.name;
        if (journey.id === "my-journey" && !ids.size) {
          document.getElementById("journey-dialog").showModal();
          return;
        }
      }

      state.journey = id;
      nodeEls.forEach((element, nodeId) => {
        element.classList.toggle("is-journey", ids.has(nodeId));
        element.classList.toggle("is-dimmed", !ids.has(nodeId));
      });
      edgeEls.forEach((line) => {
        const inJourney = ids.has(line.dataset.a) && ids.has(line.dataset.b);
        line.classList.toggle("is-journey", inJourney);
        line.classList.toggle("is-dimmed", !inJourney);
      });
      document.getElementById("active-journey").hidden = false;
      document.getElementById("active-journey-name").textContent = name;
      updateUrl();
      if (announce) showToast(`${name} highlighted`);
    }

    function clearJourney() {
      state.journey = null;
      state.customNodes = [];
      nodeEls.forEach((element) => element.classList.remove("is-journey", "is-dimmed"));
      edgeEls.forEach((line) => line.classList.remove("is-journey", "is-dimmed"));
      document.getElementById("active-journey").hidden = true;
      updateRelationships(state.selected, false);
      updateUrl();
    }

    function updateList() {
      const list = document.getElementById("network-list");
      if (!list) return;
      const nodes = visibleNodes();
      list.innerHTML = `<div class="network-list-grid">${nodes.map((item) => cardHtml(item)).join("")}</div>`;
      bindCardActions(list);
    }

    function setListView(listView) {
      state.listView = listView;
      document.getElementById("network-frame").hidden = listView;
      document.getElementById("network-list").hidden = !listView;
      document.getElementById("graph-tab").classList.toggle("is-active", !listView);
      document.getElementById("list-tab").classList.toggle("is-active", listView);
      document.getElementById("graph-tab").setAttribute("aria-selected", String(!listView));
      document.getElementById("list-tab").setAttribute("aria-selected", String(listView));
    }

    function resetView() {
      state.scale = 1; state.tx = 0; state.ty = 0; applyTransform();
    }

    function zoomAt(factor, x, y) {
      const old = state.scale;
      const next = Math.max(.55, Math.min(3.2, old * factor));
      const px = x == null ? WIDTH / 2 : x;
      const py = y == null ? HEIGHT / 2 : y;
      state.tx = px - ((px - state.tx) * next) / old;
      state.ty = py - ((py - state.ty) * next) / old;
      state.scale = next;
      applyTransform();
    }

    function eventPoint(event) {
      const rect = svg.getBoundingClientRect();
      return { x: ((event.clientX - rect.left) / rect.width) * WIDTH, y: ((event.clientY - rect.top) / rect.height) * HEIGHT };
    }

    svg.addEventListener("wheel", (event) => {
      event.preventDefault();
      const point = eventPoint(event);
      zoomAt(event.deltaY < 0 ? 1.12 : .89, point.x, point.y);
    }, { passive: false });

    svg.addEventListener("pointerdown", (event) => {
      svg.setPointerCapture(event.pointerId);
      pointerMap.set(event.pointerId, eventPoint(event));
      const point = eventPoint(event);
      drag = { x: point.x, y: point.y, tx: state.tx, ty: state.ty };
      svg.classList.add("is-dragging");
    });

    svg.addEventListener("pointermove", (event) => {
      if (!pointerMap.has(event.pointerId)) return;
      pointerMap.set(event.pointerId, eventPoint(event));
      if (pointerMap.size === 2) {
        const [a, b] = [...pointerMap.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance) zoomAt(distance / pinchDistance, (a.x + b.x) / 2, (a.y + b.y) / 2);
        pinchDistance = distance;
      } else if (drag) {
        const point = eventPoint(event);
        state.tx = drag.tx + point.x - drag.x;
        state.ty = drag.ty + point.y - drag.y;
        applyTransform();
      }
    });

    const endPointer = (event) => {
      pointerMap.delete(event.pointerId);
      if (pointerMap.size < 2) pinchDistance = null;
      if (!pointerMap.size) { drag = null; svg.classList.remove("is-dragging"); }
    };
    svg.addEventListener("pointerup", endPointer);
    svg.addEventListener("pointercancel", endPointer);
    svg.addEventListener("click", (event) => {
      if (event.target === svg || event.target.closest(".graph-backdrop")) {
        state.selected = null;
        selectNode(null, false);
        closeDrawers();
      }
    });

    function populateControls() {
      const typeWrap = document.getElementById("type-filters");
      if (typeWrap) {
        typeWrap.innerHTML = Object.entries(typeLabels).map(([id, label]) => `<label><input type="checkbox" value="${id}" ${state.types.has(id) ? "checked" : ""}><span>${label}</span></label>`).join("");
        typeWrap.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => { if (input.checked) state.types.add(input.value); else state.types.delete(input.value); applyFilters(); }));
      }
      const university = document.getElementById("university-filter");
      if (university) {
        university.innerHTML = `<option value="all">All universities</option>${DATA.universities.map((item) => `<option value="${item.id}">${escapeHtml(item.short)} · ${escapeHtml(item.country)}</option>`).join("")}`;
        university.value = state.university;
        university.addEventListener("change", () => { state.university = university.value; applyFilters(); });
      }
      const themes = [...new Set(DATA.nodes.flatMap((item) => item.themes || []))].sort();
      const theme = document.getElementById("theme-filter");
      if (theme) {
        theme.innerHTML = `<option value="all">All themes</option>${themes.map((item) => `<option>${escapeHtml(item)}</option>`).join("")}`;
        theme.value = state.theme;
        theme.addEventListener("change", () => { state.theme = theme.value; applyFilters(); });
      }
      const status = document.getElementById("status-filter");
      if (status) {
        status.value = state.status;
        status.addEventListener("change", () => { state.status = status.value; applyFilters(); });
      }
      const search = document.getElementById("graph-search");
      if (search) {
        search.value = state.query;
        search.placeholder = t("searchPlaceholder");
        search.addEventListener("input", () => { state.query = search.value; applyFilters(); });
      }
    }

    function populateJourneys() {
      const wrap = document.getElementById("journey-options");
      if (!wrap) return;
      wrap.innerHTML = DATA.journeys.map((journey) => `<button class="journey-card" type="button" data-journey="${journey.id}"><i>${journey.icon}</i><span><strong>${escapeHtml(journey.name)}</strong><span>${escapeHtml(journey.description)}</span></span></button>`).join("") + `
        <div class="my-journey-form"><select id="my-home" aria-label="Home university"><option value="">Choose home university</option>${DATA.universities.map((item) => `<option value="${item.id}">${escapeHtml(item.short)} · ${escapeHtml(item.country)}</option>`).join("")}</select><select id="my-theme" aria-label="Main interest"><option value="">Choose an interest</option>${[...new Set(DATA.nodes.flatMap((item) => item.themes || []))].sort().map((item) => `<option>${escapeHtml(item)}</option>`).join("")}</select><button id="my-journey-build" class="button button-primary" type="button">${t("buildRoute", "Build my route")}</button></div>`;
      wrap.querySelectorAll("[data-journey]").forEach((button) => button.addEventListener("click", () => {
        if (button.dataset.journey === "my-journey" && !localStorage.getItem("ingenium-plus-journey")) { showToast("Choose a home university and interest below"); return; }
        applyJourney(button.dataset.journey, true);
        document.getElementById("journey-dialog").close();
      }));
      const saved = JSON.parse(localStorage.getItem("ingenium-plus-journey") || "null");
      if (saved) { document.getElementById("my-home").value = saved.university; document.getElementById("my-theme").value = saved.theme; }
      document.getElementById("my-journey-build").addEventListener("click", () => {
        const university = document.getElementById("my-home").value;
        const theme = document.getElementById("my-theme").value;
        if (!university || !theme) { showToast("Choose both a home university and an interest"); return; }
        localStorage.setItem("ingenium-plus-journey", JSON.stringify({ university, theme }));
        applyJourney("my-journey", true);
        document.getElementById("journey-dialog").close();
      });
    }

    function clearFilters() {
      state.query = ""; state.types = new Set(Object.keys(typeLabels)); state.university = "all"; state.theme = "all"; state.status = "all";
      document.getElementById("graph-search").value = "";
      document.querySelectorAll("#type-filters input").forEach((input) => { input.checked = true; });
      document.getElementById("university-filter").value = "all";
      document.getElementById("theme-filter").value = "all";
      document.getElementById("status-filter").value = "all";
      applyFilters();
    }

    document.getElementById("zoom-in")?.addEventListener("click", () => zoomAt(1.22));
    document.getElementById("zoom-out")?.addEventListener("click", () => zoomAt(.82));
    document.getElementById("zoom-reset")?.addEventListener("click", resetView);
    document.getElementById("filters-open")?.addEventListener("click", () => openDrawer(document.getElementById("filter-drawer")));
    document.getElementById("journey-open")?.addEventListener("click", () => document.getElementById("journey-dialog").showModal());
    document.getElementById("journey-clear")?.addEventListener("click", clearJourney);
    document.getElementById("filters-clear")?.addEventListener("click", clearFilters);
    document.getElementById("empty-clear")?.addEventListener("click", clearFilters);
    document.getElementById("graph-tab")?.addEventListener("click", () => setListView(false));
    document.getElementById("list-tab")?.addEventListener("click", () => setListView(true));
    document.getElementById("share-view")?.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(location.href); showToast("Network link copied to clipboard"); }
      catch (_) { showToast("Copy the address bar to share this view"); }
    });

    populateControls();
    populateJourneys();
    buildGraph();
    if (state.journey) applyJourney(state.journey, false);
    if (state.selected && getNode(state.selected)) selectNode(state.selected, true);
  }

  // --- Accessibility & Focus Management ---

  let lastActiveElement = null;

  function trapFocus(container) {
    const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    container.onkeydown = function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
  }

  function openDrawer(drawer) {
    if (!drawer) return;
    lastActiveElement = document.activeElement;
    document.querySelectorAll(".drawer.is-open").forEach((item) => { if (item !== drawer) { item.classList.remove("is-open"); item.setAttribute("aria-hidden", "true"); } });
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    const backdrop = document.getElementById("drawer-backdrop");
    if (backdrop) backdrop.hidden = false;
    trapFocus(drawer);
    setTimeout(() => drawer.querySelector("button, a, input, select")?.focus(), 80);
  }

  function closeDrawers() {
    document.querySelectorAll(".drawer.is-open").forEach((drawer) => { drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); drawer.onkeydown = null; });
    document.body.classList.remove("drawer-open");
    const backdrop = document.getElementById("drawer-backdrop");
    if (backdrop) backdrop.hidden = true;
    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  document.querySelectorAll("[data-close-drawer]").forEach((button) => button.addEventListener("click", closeDrawers));
  document.getElementById("drawer-backdrop")?.addEventListener("click", closeDrawers);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDrawers(); });

  // --- Initialisation ---
  renderHeader();
  renderFooter();
  updateCompareBar();

  if (page === "graph") initGraph(); else initContentPage();

  // Register PWA Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
