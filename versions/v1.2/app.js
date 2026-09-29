const NODE_TYPES = [
  { key: "university", label: "Universities" },
  { key: "student", label: "Students" },
  { key: "bip", label: "BIPs" },
  { key: "module", label: "Modules" },
  { key: "society", label: "Societies" },
  { key: "groupchat", label: "Group Chats" },
  { key: "project", label: "Projects" },
  { key: "event", label: "Events" },
  { key: "opportunity", label: "Opportunities" },
  { key: "organization", label: "Organizations" }
];

const TYPE_LABELS = {
  university: "University",
  student: "Student",
  bip: "BIP",
  module: "Module",
  society: "Society",
  groupchat: "Group Chat",
  project: "Project",
  event: "Event",
  opportunity: "Opportunity",
  organization: "Organization"
};

const ACTION_LABELS = {
  student: "Invite to collaborate",
  university: "Explore campus activity",
  project: "View project network",
  event: "See related activity",
  bip: "View BIP route",
  module: "Find classmates",
  society: "Join society",
  groupchat: "Open group chat",
  opportunity: "Check eligibility",
  organization: "View community links"
};

const UNIVERSITIES = [
  { key: "MTU", label: "MTU", full: "Munster Technological University", country: "Ireland" },
  { key: "XAMK", label: "XAMK", full: "South-Eastern Finland University of Applied Sciences", country: "Finland" },
  { key: "TUIASI", label: "TUIASI", full: "Gheorghe Asachi Technical University of Iasi", country: "Romania" },
  { key: "OVIEDO", label: "Oviedo", full: "University of Oviedo", country: "Spain" },
  { key: "KARLSRUHE", label: "Karlsruhe", full: "Karlsruhe University of Applied Sciences", country: "Germany" },
  { key: "CRETE", label: "Crete", full: "University of Crete", country: "Greece" },
  { key: "SKOVDE", label: "Skovde", full: "University of Skovde", country: "Sweden" },
  { key: "ROUEN", label: "Rouen", full: "University of Rouen Normandy", country: "France" },
  { key: "CHIETI", label: "Chieti-Pescara", full: "University \"G. d'Annunzio\" Chieti-Pescara", country: "Italy" },
  { key: "POZNAN", label: "Poznan", full: "University of Medical Sciences Poznan", country: "Poland" }
];

const TOPICS = [
  { key: "sustainability", label: "Sustainability" },
  { key: "data-visualisation", label: "Data visualisation" },
  { key: "entrepreneurship", label: "Entrepreneurship" },
  { key: "mobility", label: "Mobility" },
  { key: "engineering", label: "Engineering" },
  { key: "belonging", label: "Belonging" },
  { key: "health", label: "Health sciences" },
  { key: "intercultural", label: "Intercultural communication" },
  { key: "ai", label: "AI and digital society" }
];

// Dataset structure: each node has a type, map position, university anchors,
// topic tags, and a short demo description. Topics replace skills as metadata.
const nodes = [
  { id: "you", label: "You", short: "You", type: "student", universities: ["MTU"], topics: ["mobility", "data-visualisation", "sustainability"], description: "Sample student profile showing how a personal route can connect to campuses, chats, BIPs, modules and projects.", x: 25, y: 47 },
  { id: "sofia", label: "Sofia Korhonen", short: "Sofia", type: "student", universities: ["XAMK"], topics: ["sustainability", "entrepreneurship"], description: "XAMK student interested in circular economy projects and student partnership teams.", x: 58, y: 23 },
  { id: "mihai", label: "Mihai Popescu", short: "Mihai", type: "student", universities: ["TUIASI"], topics: ["engineering", "data-visualisation", "ai"], description: "Engineering student connected to AI, smart cities and graph prototype work.", x: 68, y: 55 },
  { id: "lara", label: "Lara Alvarez", short: "Lara", type: "student", universities: ["OVIEDO"], topics: ["mobility", "intercultural"], description: "Mobility ambassador helping students find short BIPs and incoming student support.", x: 35, y: 69 },
  { id: "ada", label: "Ada Murphy", short: "Ada", type: "student", universities: ["MTU"], topics: ["belonging", "sustainability"], description: "Student board member focused on belonging, student voice and community onboarding.", x: 29, y: 50 },
  { id: "erik", label: "Erik Lind", short: "Erik", type: "student", universities: ["SKOVDE"], topics: ["ai", "data-visualisation"], description: "Student connected to CLARITY-AI and data visualisation activity.", x: 52, y: 34 },
  { id: "elena", label: "Elena Rossi", short: "Elena", type: "student", universities: ["CHIETI"], topics: ["health", "sustainability"], description: "Student interested in health, wellbeing and sustainability-focused alliance projects.", x: 54, y: 68 },
  { id: "nina", label: "Nina Kowalska", short: "Nina", type: "student", universities: ["POZNAN"], topics: ["health", "mobility"], description: "Medical sciences student connected to wellbeing BIPs and incoming mobility groups.", x: 60, y: 46 },

  { id: "mtu", label: "Munster Technological University", short: "MTU", type: "university", universities: ["MTU"], topics: ["mobility", "belonging", "data-visualisation"], description: "INGENIUM partner in Ireland and sample home campus for the personal network route.", x: 21, y: 44 },
  { id: "xamk", label: "South-Eastern Finland University of Applied Sciences", short: "XAMK", type: "university", universities: ["XAMK"], topics: ["sustainability", "entrepreneurship"], description: "INGENIUM partner in Finland, anchoring sustainability and innovation activity.", x: 60, y: 18 },
  { id: "tuiasi", label: "Gheorghe Asachi Technical University of Iasi", short: "TUIASI", type: "university", universities: ["TUIASI"], topics: ["engineering", "data-visualisation", "ai"], description: "INGENIUM partner in Romania, anchoring engineering, AI and smart city work.", x: 70, y: 56 },
  { id: "oviedo", label: "University of Oviedo", short: "Oviedo", type: "university", universities: ["OVIEDO"], topics: ["mobility", "intercultural", "entrepreneurship"], description: "INGENIUM partner in Spain, connected to mobility and student welcome routes.", x: 34, y: 72 },
  { id: "karlsruhe", label: "Karlsruhe University of Applied Sciences", short: "Karlsruhe", type: "university", universities: ["KARLSRUHE"], topics: ["engineering", "mobility", "data-visualisation"], description: "INGENIUM partner in Germany, used as a host anchor for BIP and smart city activity.", x: 48, y: 50 },
  { id: "crete", label: "University of Crete", short: "Crete", type: "university", universities: ["CRETE"], topics: ["health", "intercultural", "sustainability"], description: "INGENIUM partner in Greece, connected to wellbeing and intercultural activity.", x: 66, y: 82 },
  { id: "skovde", label: "University of Skovde", short: "Skovde", type: "university", universities: ["SKOVDE"], topics: ["ai", "data-visualisation", "engineering"], description: "INGENIUM partner in Sweden, connected to AI, games and digital society themes.", x: 52, y: 29 },
  { id: "rouen", label: "University of Rouen Normandy", short: "Rouen", type: "university", universities: ["ROUEN"], topics: ["intercultural", "mobility", "belonging"], description: "INGENIUM partner in France, connected to intercultural communication and mobility support.", x: 39, y: 53 },
  { id: "chieti", label: "University \"G. d'Annunzio\" Chieti-Pescara", short: "Chieti", type: "university", universities: ["CHIETI"], topics: ["health", "sustainability", "entrepreneurship"], description: "INGENIUM partner in Italy, connected to wellbeing, innovation and sustainability activity.", x: 54, y: 66 },
  { id: "poznan", label: "University of Medical Sciences Poznan", short: "Poznan", type: "university", universities: ["POZNAN"], topics: ["health", "mobility"], description: "INGENIUM partner in Poland, anchoring health sciences and mobility activity.", x: 59, y: 46 },

  { id: "ingenium-plus", label: "INGENIUM+", short: "INGENIUM+", type: "project", universities: ["MTU", "XAMK", "TUIASI"], topics: ["mobility", "belonging", "data-visualisation"], description: "Student-led project testing a graph-first community layer for the INGENIUM European Campus.", x: 43, y: 43 },
  { id: "europe-campus-map", label: "European Campus Map", short: "Campus Map", type: "project", universities: ["MTU", "KARLSRUHE", "TUIASI", "OVIEDO"], topics: ["mobility", "data-visualisation", "belonging"], description: "Map-based discovery project connecting universities, opportunities and community spaces.", x: 49, y: 58 },
  { id: "circular-sprint", label: "Circular Economy Sprint", short: "Circular Sprint", type: "project", universities: ["XAMK", "MTU", "CHIETI"], topics: ["sustainability", "entrepreneurship"], description: "Sample student project linking sustainability teams across partner campuses.", x: 51, y: 37 },
  { id: "health-wellbeing-lab", label: "Health and Wellbeing Lab", short: "Wellbeing Lab", type: "project", universities: ["POZNAN", "CRETE", "CHIETI"], topics: ["health", "belonging"], description: "Cross-campus project connecting health sciences students with wellbeing activity.", x: 62, y: 66 },

  { id: "academic-communication-bip", label: "Academic Communication BIP", short: "Academic Comms", type: "bip", universities: ["ROUEN", "OVIEDO"], topics: ["intercultural", "mobility"], description: "Blended Intensive Programme for academic and intercultural communication.", x: 40, y: 61 },
  { id: "clarity-ai-bip", label: "CLARITY-AI BIP", short: "CLARITY-AI", type: "bip", universities: ["SKOVDE", "TUIASI", "KARLSRUHE"], topics: ["ai", "data-visualisation", "engineering"], description: "Sample AI-focused BIP linking students, modules and a Germany 2026 group chat.", x: 59, y: 38 },
  { id: "wellbeing-bip", label: "Nature-Based Wellbeing BIP", short: "Wellbeing BIP", type: "bip", universities: ["CRETE", "POZNAN", "CHIETI"], topics: ["health", "sustainability", "belonging"], description: "BIP connecting wellbeing, nature-based practice and health sciences students.", x: 65, y: 75 },
  { id: "smart-cities-bip", label: "Smart Cities BIP", short: "Smart Cities BIP", type: "bip", universities: ["KARLSRUHE", "TUIASI", "MTU"], topics: ["engineering", "data-visualisation", "mobility"], description: "BIP linking students to engineering, data visualisation and urban innovation modules.", x: 55, y: 52 },
  { id: "sustainable-development-bip", label: "Sustainable Development BIP", short: "Sustainable BIP", type: "bip", universities: ["XAMK", "CRETE", "CHIETI"], topics: ["sustainability", "entrepreneurship"], description: "BIP connecting sustainability societies, innovation modules and project teams.", x: 57, y: 61 },

  { id: "project-management-module", label: "European Project Management", short: "Project Mgmt", type: "module", universities: ["MTU", "ROUEN"], topics: ["entrepreneurship", "intercultural"], description: "Module for students coordinating cross-campus work and student partnership activity.", x: 35, y: 48 },
  { id: "data-viz-module", label: "Data Visualisation", short: "Data Viz", type: "module", universities: ["MTU", "TUIASI", "SKOVDE"], topics: ["data-visualisation", "ai"], description: "Module connected to graph design, evidence dashboards and explainable recommendations.", x: 56, y: 43 },
  { id: "sustainable-innovation-module", label: "Sustainable Innovation", short: "Sust. Innovation", type: "module", universities: ["XAMK", "CHIETI"], topics: ["sustainability", "entrepreneurship"], description: "Module that links sustainability projects with entrepreneurship societies.", x: 48, y: 32 },
  { id: "intercultural-module", label: "Intercultural Communication", short: "Intercultural", type: "module", universities: ["ROUEN", "OVIEDO"], topics: ["intercultural", "mobility", "belonging"], description: "Module supporting students entering a new campus or international group.", x: 38, y: 58 },
  { id: "smart-cities-module", label: "Smart Cities", short: "Smart Cities", type: "module", universities: ["KARLSRUHE", "TUIASI"], topics: ["engineering", "data-visualisation"], description: "Module connected to the Smart Cities BIP and technical project teams.", x: 61, y: 50 },

  { id: "sustainability-society", label: "Sustainability Society", short: "Sust. Society", type: "society", universities: ["MTU", "XAMK", "CHIETI"], topics: ["sustainability", "belonging"], description: "Student society connecting sustainability projects, events and group chats.", x: 36, y: 38 },
  { id: "erasmus-society", label: "Erasmus Society", short: "Erasmus", type: "society", universities: ["OVIEDO", "ROUEN", "MTU"], topics: ["mobility", "intercultural", "belonging"], description: "Community node for incoming and outgoing mobility students.", x: 31, y: 63 },
  { id: "entrepreneurship-society", label: "Entrepreneurship Society", short: "Venture", type: "society", universities: ["XAMK", "CHIETI", "KARLSRUHE"], topics: ["entrepreneurship", "sustainability"], description: "Society for students building student partnership ideas and innovation projects.", x: 48, y: 64 },
  { id: "coding-club", label: "Coding Club", short: "Coding Club", type: "society", universities: ["TUIASI", "SKOVDE", "MTU"], topics: ["engineering", "ai", "data-visualisation"], description: "Technical community connected to AI, graph prototyping and smart city modules.", x: 63, y: 42 },
  { id: "student-board", label: "Student Board", short: "Board", type: "society", universities: ["MTU", "ROUEN", "OVIEDO", "POZNAN"], topics: ["belonging", "mobility"], description: "Student representation node connected to campus activity and feedback routes.", x: 44, y: 69 },

  { id: "mtu-chat", label: "MTU INGENIUM Students", short: "MTU Chat", type: "groupchat", universities: ["MTU"], topics: ["belonging", "mobility"], description: "Sample group chat for MTU students joining INGENIUM activities.", x: 26, y: 39 },
  { id: "germany-bip-chat", label: "BIP Germany 2026 Chat", short: "Germany Chat", type: "groupchat", universities: ["KARLSRUHE", "TUIASI", "SKOVDE"], topics: ["mobility", "engineering", "data-visualisation"], description: "Planning chat for students preparing for the Germany 2026 BIP route.", x: 52, y: 48 },
  { id: "sustainability-chat", label: "Sustainability Projects Chat", short: "Sust. Chat", type: "groupchat", universities: ["XAMK", "MTU", "CHIETI"], topics: ["sustainability", "entrepreneurship"], description: "Group chat connecting sustainability project teams and society members.", x: 43, y: 35 },
  { id: "incoming-chat", label: "Incoming Mobility Students", short: "Mobility Chat", type: "groupchat", universities: ["ROUEN", "OVIEDO", "MTU", "POZNAN"], topics: ["mobility", "intercultural", "belonging"], description: "Community chat for students arriving at a new INGENIUM partner campus.", x: 42, y: 63 },
  { id: "partnership-chat", label: "Student Partnership Teams", short: "Partnership Chat", type: "groupchat", universities: ["MTU", "XAMK", "TUIASI"], topics: ["belonging", "entrepreneurship", "data-visualisation"], description: "Shared team space for students working on alliance-wide pilot projects.", x: 46, y: 45 },

  { id: "ten-days", label: "10 Days of INGENIUM", short: "10 Days", type: "event", universities: ["MTU", "OVIEDO", "ROUEN"], topics: ["mobility", "belonging", "intercultural"], description: "Alliance event used in the prototype as a visible participation moment.", x: 39, y: 67 },
  { id: "student-forum", label: "European Student Forum", short: "Forum", type: "event", universities: ["POZNAN", "CRETE", "CHIETI"], topics: ["belonging", "health", "mobility"], description: "Sample forum connecting student board activity with wellbeing and mobility themes.", x: 58, y: 71 },
  { id: "demo-day", label: "INGENIUM+ Demo Day", short: "Demo Day", type: "event", universities: ["MTU", "TUIASI", "XAMK"], topics: ["data-visualisation", "belonging"], description: "Prototype review session for students, staff and alliance evaluators.", x: 45, y: 52 },

  { id: "mobility-call", label: "Mobility Open Call", short: "Mobility Call", type: "opportunity", universities: ["MTU", "XAMK", "TUIASI", "OVIEDO", "KARLSRUHE", "CRETE", "SKOVDE", "ROUEN", "CHIETI", "POZNAN"], topics: ["mobility"], description: "Opportunity node for students seeking short-term alliance participation.", x: 50, y: 72 },
  { id: "student-partnerships", label: "Student Partnerships Call", short: "Partnerships", type: "opportunity", universities: ["MTU", "XAMK", "TUIASI"], topics: ["belonging", "entrepreneurship", "sustainability"], description: "Opportunity for student-led teams to propose alliance projects.", x: 40, y: 42 },
  { id: "bip-scholarship", label: "BIP Mobility Support", short: "BIP Support", type: "opportunity", universities: ["KARLSRUHE", "ROUEN", "CRETE", "POZNAN"], topics: ["mobility", "belonging"], description: "Sample support opportunity connected to BIP participation routes.", x: 58, y: 62 },

  { id: "digital-campus-unit", label: "Digital Campus Unit", short: "Digital Unit", type: "organization", universities: ["MTU", "TUIASI", "KARLSRUHE"], topics: ["data-visualisation", "mobility"], description: "Institutional support node for future digital campus integration.", x: 54, y: 55 },
  { id: "alliance-student-support", label: "Alliance Student Support", short: "Student Support", type: "organization", universities: ["ROUEN", "OVIEDO", "POZNAN", "CRETE"], topics: ["belonging", "mobility", "health"], description: "Support node representing guidance for mobility, wellbeing and community onboarding.", x: 48, y: 74 }
];

const edges = [
  ["you", "mtu", "studies at"], ["you", "ingenium-plus", "works on"], ["you", "mtu-chat", "member of"], ["you", "data-viz-module", "taking module"], ["you", "smart-cities-bip", "interested in"],
  ["sofia", "xamk", "studies at"], ["sofia", "sustainable-development-bip", "joined"], ["sofia", "sustainability-chat", "member of"], ["sofia", "circular-sprint", "works on"],
  ["mihai", "tuiasi", "studies at"], ["mihai", "clarity-ai-bip", "joined"], ["mihai", "coding-club", "member of"], ["mihai", "data-viz-module", "taking module"],
  ["lara", "oviedo", "studies at"], ["lara", "incoming-chat", "moderates"], ["lara", "erasmus-society", "member of"],
  ["ada", "mtu", "studies at"], ["ada", "student-board", "member of"], ["ada", "sustainability-society", "member of"],
  ["erik", "skovde", "studies at"], ["erik", "clarity-ai-bip", "joined"], ["erik", "coding-club", "member of"],
  ["elena", "chieti", "studies at"], ["elena", "wellbeing-bip", "joined"], ["elena", "health-wellbeing-lab", "works on"],
  ["nina", "poznan", "studies at"], ["nina", "wellbeing-bip", "joined"], ["nina", "incoming-chat", "member of"],
  ["ingenium-plus", "student-partnerships", "funded through"], ["ingenium-plus", "partnership-chat", "uses chat"], ["ingenium-plus", "europe-campus-map", "prototype layer"], ["ingenium-plus", "demo-day", "reviewed at"], ["ingenium-plus", "digital-campus-unit", "supported by"],
  ["europe-campus-map", "mobility-call", "surfaces"], ["europe-campus-map", "academic-communication-bip", "maps route"], ["europe-campus-map", "smart-cities-bip", "maps route"],
  ["circular-sprint", "sustainability-society", "supported by"], ["circular-sprint", "sustainable-innovation-module", "uses module"],
  ["health-wellbeing-lab", "wellbeing-bip", "connected to"], ["health-wellbeing-lab", "alliance-student-support", "supported by"],
  ["academic-communication-bip", "rouen", "hosted by"], ["academic-communication-bip", "intercultural-module", "includes module"], ["academic-communication-bip", "incoming-chat", "uses chat"],
  ["clarity-ai-bip", "skovde", "hosted by"], ["clarity-ai-bip", "data-viz-module", "includes module"], ["clarity-ai-bip", "germany-bip-chat", "uses chat"], ["clarity-ai-bip", "karlsruhe", "partner campus"],
  ["wellbeing-bip", "crete", "hosted by"], ["wellbeing-bip", "bip-scholarship", "eligible for"], ["wellbeing-bip", "alliance-student-support", "supported by"],
  ["smart-cities-bip", "karlsruhe", "hosted by"], ["smart-cities-bip", "smart-cities-module", "includes module"], ["smart-cities-bip", "germany-bip-chat", "uses chat"], ["smart-cities-bip", "bip-scholarship", "eligible for"],
  ["sustainable-development-bip", "xamk", "hosted by"], ["sustainable-development-bip", "sustainability-chat", "uses chat"], ["sustainable-development-bip", "sustainable-innovation-module", "includes module"],
  ["project-management-module", "mtu", "offered by"], ["project-management-module", "student-partnerships", "supports"], ["data-viz-module", "tuiasi", "partner campus"], ["data-viz-module", "digital-campus-unit", "supported by"],
  ["sustainable-innovation-module", "entrepreneurship-society", "linked to"], ["intercultural-module", "erasmus-society", "linked to"], ["smart-cities-module", "coding-club", "linked to"],
  ["sustainability-society", "sustainability-chat", "uses chat"], ["erasmus-society", "incoming-chat", "uses chat"], ["entrepreneurship-society", "student-partnerships", "promotes"], ["coding-club", "germany-bip-chat", "joins"],
  ["student-board", "ten-days", "organises"], ["student-board", "student-forum", "represents"], ["mtu-chat", "mtu", "based at"], ["mtu-chat", "incoming-chat", "shares students"], ["partnership-chat", "student-partnerships", "coordinates"], ["partnership-chat", "project-management-module", "supports"],
  ["ten-days", "mobility-call", "leads to"], ["ten-days", "oviedo", "linked campus"], ["student-forum", "poznan", "hosted near"], ["student-forum", "alliance-student-support", "supported by"],
  ["mobility-call", "bip-scholarship", "connected to"], ["mobility-call", "incoming-chat", "follow up in"], ["student-partnerships", "demo-day", "showcased at"], ["bip-scholarship", "alliance-student-support", "advised by"]
].map(([source, target, relation], index) => ({ id: `e${index + 1}`, source, target, relation }));

const state = {
  selectedId: "ingenium-plus",
  mode: "explore",
  search: "",
  university: "all",
  topic: "all",
  activeTypes: new Set(NODE_TYPES.map((type) => type.key)),
  showList: true,
  nav: "map",
  // Zoom/pan state: screen = graphPoint * scale + translate.
  map: {
    scale: 1,
    minScale: 0.8,
    maxScale: 3.5,
    tx: 0,
    ty: 0,
    width: 900,
    height: 560,
    padX: 50,
    padY: 44,
    isPanning: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startTx: 0,
    startTy: 0,
    dragMoved: false
  }
};

const nodeById = new Map(nodes.map((node) => [node.id, node]));
const adjacency = new Map(nodes.map((node) => [node.id, []]));

edges.forEach((edge) => {
  if (!nodeById.has(edge.source) || !nodeById.has(edge.target)) return;
  adjacency.get(edge.source).push({ edge, otherId: edge.target });
  adjacency.get(edge.target).push({ edge, otherId: edge.source });
});

const els = {
  stage: document.querySelector("#map-stage"),
  svg: document.querySelector("#graph-svg"),
  search: document.querySelector("#search-input"),
  university: document.querySelector("#university-filter"),
  topic: document.querySelector("#topic-filter"),
  typeFilters: document.querySelector("#type-filters"),
  visibleCount: document.querySelector("#visible-count"),
  listToggle: document.querySelector("#list-toggle"),
  listPanel: document.querySelector("#network-list"),
  listCount: document.querySelector("#list-count"),
  nodeList: document.querySelector("#node-list"),
  detail: document.querySelector("#detail-content"),
  empty: document.querySelector("#empty-state"),
  tooltip: document.querySelector("#node-tooltip"),
  zoomIn: document.querySelector("#zoom-in"),
  zoomOut: document.querySelector("#zoom-out"),
  mapReset: document.querySelector("#map-reset"),
  fitSelected: document.querySelector("#fit-selected")
};

function init() {
  populateFilters();
  bindEvents();
  render();

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => renderGraph());
    observer.observe(els.svg);
  } else {
    window.addEventListener("resize", renderGraph);
  }
}

function populateFilters() {
  els.university.append(option("all", "All universities"));
  UNIVERSITIES.forEach((university) => {
    els.university.append(option(university.key, `${university.label} - ${university.country}`));
  });

  els.topic.append(option("all", "All topics"));
  TOPICS.forEach((topic) => els.topic.append(option(topic.key, topic.label)));

  NODE_TYPES.forEach((type) => {
    const label = document.createElement("label");
    label.className = "type-row";
    label.innerHTML = `
      <input type="checkbox" value="${type.key}" checked>
      <i class="type-swatch ${type.key}" aria-hidden="true"></i>
      <span>${type.label}</span>
    `;
    els.typeFilters.append(label);
  });
}

function bindEvents() {
  els.search.addEventListener("input", () => {
    state.search = els.search.value.trim().toLowerCase();
    state.nav = "custom";
    render();
  });

  els.university.addEventListener("change", () => {
    state.university = els.university.value;
    state.nav = "custom";
    render();
  });

  els.topic.addEventListener("change", () => {
    state.topic = els.topic.value;
    state.nav = "custom";
    render();
  });

  els.typeFilters.addEventListener("change", (event) => {
    if (event.target.type !== "checkbox") return;
    if (event.target.checked) state.activeTypes.add(event.target.value);
    else state.activeTypes.delete(event.target.value);
    state.nav = "custom";
    render();
  });

  els.listToggle.addEventListener("change", () => {
    state.showList = els.listToggle.checked;
    renderList();
  });

  document.querySelector("#reset-view").addEventListener("click", () => {
    resetState();
    resetMapView();
  });

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      if (state.mode === "mine") state.selectedId = "you";
      syncControls();
      render();
      if (state.mode === "mine") fitSelected();
    });
  });

  document.querySelectorAll(".journey-button").forEach((button) => {
    button.addEventListener("click", () => applyJourney(button.dataset.journey));
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => applyNav(button.dataset.nav));
  });

  bindMapInteractions();
}

function bindMapInteractions() {
  els.zoomIn.addEventListener("click", () => zoomBy(1.2));
  els.zoomOut.addEventListener("click", () => zoomBy(1 / 1.2));
  els.mapReset.addEventListener("click", resetMapView);
  els.fitSelected.addEventListener("click", fitSelected);

  els.svg.addEventListener("wheel", (event) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
    const point = localPointFromEvent(event);
    zoomAt(point.x, point.y, state.map.scale * factor);
  }, { passive: false });

  els.svg.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".graph-node")) return;
    state.map.isPanning = true;
    state.map.pointerId = event.pointerId;
    state.map.startX = event.clientX;
    state.map.startY = event.clientY;
    state.map.startTx = state.map.tx;
    state.map.startTy = state.map.ty;
    state.map.dragMoved = false;
    els.stage.classList.add("is-panning");
    els.svg.setPointerCapture(event.pointerId);
  });

  els.svg.addEventListener("pointermove", (event) => {
    if (!state.map.isPanning || event.pointerId !== state.map.pointerId) return;
    const dx = event.clientX - state.map.startX;
    const dy = event.clientY - state.map.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) state.map.dragMoved = true;
    state.map.tx = state.map.startTx + dx;
    state.map.ty = state.map.startTy + dy;
    applyMapTransform();
  });

  els.svg.addEventListener("pointerup", endPan);
  els.svg.addEventListener("pointercancel", endPan);
  els.svg.addEventListener("pointerleave", (event) => {
    if (state.map.isPanning) endPan(event);
  });
}

function endPan(event) {
  if (!state.map.isPanning || event.pointerId !== state.map.pointerId) return;
  state.map.isPanning = false;
  state.map.pointerId = null;
  els.stage.classList.remove("is-panning");
  try {
    els.svg.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture may already be released by the browser.
  }
}

function resetState() {
  state.selectedId = "ingenium-plus";
  state.mode = "explore";
  state.search = "";
  state.university = "all";
  state.topic = "all";
  state.activeTypes = new Set(NODE_TYPES.map((type) => type.key));
  state.showList = true;
  state.nav = "map";
  syncControls();
  render();
}

function setActiveTypes(types) {
  state.activeTypes = new Set(types);
}

function applyJourney(journey) {
  state.search = "";
  state.university = "all";
  state.topic = "all";
  state.showList = true;
  state.nav = "custom";

  if (journey === "my-route") {
    state.mode = "mine";
    state.selectedId = "you";
    setActiveTypes(["student", "university", "bip", "module", "society", "groupchat", "project", "opportunity"]);
  }

  if (journey === "bip-finder") {
    state.mode = "trace";
    state.selectedId = "smart-cities-bip";
    setActiveTypes(["university", "student", "bip", "module", "groupchat", "opportunity"]);
  }

  if (journey === "sustainability") {
    state.mode = "trace";
    state.selectedId = "sustainable-development-bip";
    state.topic = "sustainability";
    setActiveTypes(["university", "student", "bip", "module", "society", "groupchat", "project", "opportunity"]);
  }

  if (journey === "groupchats") {
    state.mode = "mine";
    state.selectedId = "mtu-chat";
    setActiveTypes(["student", "university", "groupchat", "society", "bip", "project"]);
  }

  if (journey === "mtu-projects") {
    state.mode = "trace";
    state.selectedId = "mtu";
    state.university = "MTU";
    setActiveTypes(["university", "student", "project", "module", "society", "groupchat", "opportunity"]);
  }

  syncControls();
  render();
  fitSelected();
}

function applyNav(nav) {
  state.nav = nav;
  state.search = "";
  state.university = "all";
  state.topic = "all";
  state.showList = true;

  if (nav === "map") {
    state.mode = "explore";
    state.selectedId = "ingenium-plus";
    setActiveTypes(NODE_TYPES.map((type) => type.key));
  } else if (nav === "profile") {
    state.mode = "mine";
    state.selectedId = "you";
    setActiveTypes(["student", "university", "bip", "module", "society", "groupchat", "project", "opportunity"]);
  } else {
    state.mode = "explore";
    state.selectedId = firstNodeOfType(nav)?.id || "ingenium-plus";
    setActiveTypes(["university", "student", nav]);
  }

  syncControls();
  render();
  fitSelected();
}

function syncControls() {
  els.search.value = state.search;
  els.university.value = state.university;
  els.topic.value = state.topic;
  els.listToggle.checked = state.showList;

  els.typeFilters.querySelectorAll("input").forEach((input) => {
    input.checked = state.activeTypes.has(input.value);
  });

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode));
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === state.nav);
  });
}

function render() {
  const visibleNodes = getVisibleNodes();
  if (visibleNodes.length && !visibleNodes.some((node) => node.id === state.selectedId)) {
    state.selectedId = visibleNodes[0].id;
  }

  renderGraph();
  renderList();
  renderDetails();
  els.visibleCount.textContent = `${visibleNodes.length} nodes`;
}

function getVisibleNodes() {
  const mineIds = state.mode === "mine" ? neighborhood("you", 2) : null;
  return nodes.filter((node) => {
    if (!state.activeTypes.has(node.type)) return false;
    if (mineIds && !mineIds.has(node.id)) return false;
    if (state.university !== "all" && !node.universities.includes(state.university)) return false;
    if (state.topic !== "all" && !node.topics.includes(state.topic)) return false;
    if (state.search && !matchesSearch(node, state.search)) return false;
    return true;
  });
}

function getVisibleEdges(visibleIds) {
  return edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
}

function matchesSearch(node, term) {
  const haystack = [
    node.label,
    node.short,
    node.type,
    node.description,
    ...node.universities.map(universityText),
    ...node.topics.map(topicLabel)
  ].join(" ").toLowerCase();
  return haystack.includes(term);
}

function renderGraph() {
  const visibleNodes = getVisibleNodes();
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = getVisibleEdges(visibleIds);
  const highlightIds = getHighlightIds();
  const highlightedEdges = getHighlightedEdgeIds(highlightIds);
  const width = Math.max(els.svg.clientWidth || 900, 360);
  const height = Math.max(els.svg.clientHeight || 560, 520);
  const padX = width < 620 ? 28 : 50;
  const padY = height < 580 ? 32 : 44;

  state.map.width = width;
  state.map.height = height;
  state.map.padX = padX;
  state.map.padY = padY;

  els.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  els.svg.replaceChildren();
  els.empty.hidden = visibleNodes.length > 0;

  const viewport = svgEl("g", { id: "viewport-group" });
  const mapLayer = svgEl("g", { "aria-hidden": "true" });
  const edgeLayer = svgEl("g", { "aria-hidden": "true" });
  const nodeLayer = svgEl("g");
  const labelLayer = svgEl("g", { "aria-hidden": "true" });
  viewport.append(mapLayer, edgeLayer, nodeLayer, labelLayer);
  els.svg.append(viewport);

  renderEuropeMap(mapLayer, width, height, padX, padY);

  visibleEdges.forEach((edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    const p1 = pointFor(source, width, height, padX, padY);
    const p2 = pointFor(target, width, height, padX, padY);
    const isHighlighted = highlightedEdges.has(edge.id);
    const isDimmed = state.mode === "trace" && (!highlightIds.has(edge.source) || !highlightIds.has(edge.target));

    edgeLayer.append(svgEl("line", {
      class: classNames("graph-edge", isHighlighted && "is-highlighted", isDimmed && "is-dimmed"),
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y
    }));
  });

  visibleNodes.forEach((node) => {
    const point = pointFor(node, width, height, padX, padY);
    const radius = radiusFor(node);
    const isSelected = node.id === state.selectedId;
    const isHighlighted = highlightIds.has(node.id);
    const isDimmed = state.mode === "trace" && !isHighlighted;
    const group = svgEl("g", {
      class: classNames("graph-node", `type-${node.type}`, isSelected && "is-selected", isHighlighted && "is-highlighted", isDimmed && "is-dimmed"),
      transform: `translate(${point.x} ${point.y})`,
      tabindex: "0",
      focusable: "true",
      role: "button",
      "aria-label": `${typeLabel(node.type)}: ${node.label}`
    });

    group.append(svgEl("circle", { r: radius, cx: 0, cy: 0 }));
    group.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(node.id, { center: true });
    });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectNode(node.id, { center: true });
      }
    });
    group.addEventListener("pointerenter", (event) => showTooltip(node, event));
    group.addEventListener("pointermove", (event) => moveTooltip(event));
    group.addEventListener("pointerleave", hideTooltip);
    group.addEventListener("focus", () => showTooltipAtNode(node));
    group.addEventListener("blur", hideTooltip);
    nodeLayer.append(group);
  });

  renderNodeLabels(labelLayer, visibleNodes, highlightIds, width, height, padX, padY);
  applyMapTransform();
}

function renderEuropeMap(layer, width, height, padX, padY) {
  const polygon = (points, className = "map-land") => {
    layer.append(svgEl("polygon", {
      class: className,
      points: points.map(([x, y]) => {
        const p = pointFromPercent(x, y, width, height, padX, padY);
        return `${p.x},${p.y}`;
      }).join(" ")
    }));
  };

  polygon([[32, 33], [46, 25], [61, 29], [72, 41], [79, 58], [69, 73], [53, 78], [39, 70], [30, 56]]);
  polygon([[21, 39], [26, 36], [29, 45], [24, 51], [18, 48]]);
  polygon([[43, 72], [50, 62], [58, 70], [56, 82], [47, 84]]);
  polygon([[61, 78], [70, 76], [73, 84], [64, 88]]);
  polygon([[47, 20], [56, 10], [64, 18], [60, 31], [51, 30]]);

  layer.append(svgEl("path", {
    class: "map-waterline",
    d: `M ${padX} ${height * 0.64} C ${width * 0.28} ${height * 0.52}, ${width * 0.56} ${height * 0.75}, ${width - padX} ${height * 0.58}`
  }));

  const labelPoint = pointFromPercent(39, 26, width, height, padX, padY);
  const label = svgEl("text", { class: "map-label", x: labelPoint.x, y: labelPoint.y });
  label.textContent = "European Campus";
  layer.append(label);
}

function renderNodeLabels(layer, visibleNodes, highlightIds, width, height, padX, padY) {
  const directIds = new Set([state.selectedId]);
  connectedEdges(state.selectedId).forEach((item) => directIds.add(item.otherId));
  const placed = [];
  const ordered = visibleNodes.slice().sort((a, b) => labelPriority(a, directIds, highlightIds) - labelPriority(b, directIds, highlightIds));

  ordered.forEach((node) => {
    const priority = labelPriority(node, directIds, highlightIds);
    if (priority > 3) return;

    const point = pointFor(node, width, height, padX, padY);
    const radius = radiusFor(node);
    const labelWidth = Math.max(42, Math.min(128, node.short.length * 7 + 16));
    const labelHeight = 18;
    const labelX = clamp(point.x, labelWidth / 2 + 8, width - labelWidth / 2 - 8);
    const belowY = point.y + radius + 16;
    const aboveY = point.y - radius - 9;
    const labelY = belowY + 4 > height ? aboveY : belowY;
    const box = { left: labelX - labelWidth / 2, right: labelX + labelWidth / 2, top: labelY - labelHeight + 3, bottom: labelY + 4 };
    const isSelected = node.id === state.selectedId;
    const collides = placed.some((existing) => boxesIntersect(existing, box));
    if (!isSelected && collides) return;

    const text = svgEl("text", { class: classNames("graph-label", isSelected && "is-selected"), x: labelX, y: labelY, "text-anchor": "middle" });
    text.textContent = node.short;
    layer.append(text);
    placed.push(box);
  });
}

function renderList() {
  const visibleNodes = getVisibleNodes();
  els.listPanel.hidden = !state.showList;
  els.listCount.textContent = `${visibleNodes.length} items`;
  els.nodeList.replaceChildren();

  visibleNodes.forEach((node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = classNames("node-card", node.id === state.selectedId && "is-selected");
    button.innerHTML = `
      <strong>${escapeHtml(node.label)}</strong>
      <span>${typeLabel(node.type)} | ${escapeHtml(universitySummary(node))}</span>
      <span>${escapeHtml(topicSummary(node))}</span>
    `;
    button.addEventListener("click", () => selectNode(node.id, { center: true }));
    els.nodeList.append(button);
  });
}

function renderDetails() {
  const node = nodeById.get(state.selectedId);
  if (!node) {
    els.detail.innerHTML = `<section class="detail-card"><p class="empty-detail">No node selected.</p></section>`;
    return;
  }

  const connections = connectedEdges(node.id);
  const twoStepCount = Math.max(neighborhood(node.id, 2).size - 1, 0);
  const contexts = connectionContexts(node, connections);

  els.detail.innerHTML = `
    <section class="detail-card">
      <h2>Mini profile</h2>
      <h1>${escapeHtml(node.label)}</h1>
      <div class="tag-row">
        <span class="tag">${typeLabel(node.type)}</span>
        ${node.universities.map((code) => `<span class="tag">${escapeHtml(universityTag(code))}</span>`).join("")}
        ${node.topics.map((topic) => `<span class="tag topic">${escapeHtml(topicLabel(topic))}</span>`).join("")}
      </div>
      <p class="detail-copy">${escapeHtml(node.description)}</p>
      <div class="metric-row">
        <div class="metric"><b>${connections.length}</b><span>Direct links</span></div>
        <div class="metric"><b>${twoStepCount}</b><span>Two-step reach</span></div>
      </div>
      <div class="detail-actions">
        <button class="primary" type="button">${ACTION_LABELS[node.type] || "Explore links"}</button>
        <button type="button" data-action="trace">Trace Connections</button>
        <button type="button" data-action="fit">Fit selected</button>
      </div>
    </section>
    <section class="detail-card">
      <h2>Connection context</h2>
      <div class="context-list">${contexts.map(contextMarkup).join("")}</div>
    </section>
    <section class="detail-card">
      <h2>Connected nodes</h2>
      <div class="connection-list">${connections.map((item) => connectionMarkup(node.id, item)).join("")}</div>
    </section>
  `;

  els.detail.querySelector('[data-action="trace"]').addEventListener("click", () => {
    state.mode = "trace";
    syncControls();
    render();
  });

  els.detail.querySelector('[data-action="fit"]').addEventListener("click", fitSelected);
  els.detail.querySelectorAll(".connection-card").forEach((button) => {
    button.addEventListener("click", () => selectNode(button.dataset.nodeId, { center: true }));
  });
}

function contextMarkup(context) {
  return `
    <div class="context-card">
      <strong>${escapeHtml(context.title)}</strong>
      <span>${escapeHtml(context.text)}</span>
    </div>
  `;
}

function connectionMarkup(selectedId, item) {
  const other = nodeById.get(item.otherId);
  const relation = relationFor(selectedId, item.edge);
  return `
    <button class="connection-card" type="button" data-node-id="${other.id}">
      <strong>${escapeHtml(other.label)}</strong>
      <span>${escapeHtml(typeLabel(other.type))} | ${escapeHtml(relation)}</span>
    </button>
  `;
}

function connectionContexts(node, connections) {
  const connected = connections.map((item) => ({ item, node: nodeById.get(item.otherId) }));
  const groups = contextGroupsFor(node.type);
  const cards = groups.map((group) => {
    const matches = connected.filter((entry) => group.types.includes(entry.node.type));
    if (!matches.length) return null;
    const names = matches.slice(0, 4).map((entry) => entry.node.short || entry.node.label).join(", ");
    return { title: group.title, text: `${group.prefix} ${names}${matches.length > 4 ? " and more" : ""}.` };
  }).filter(Boolean);

  if (cards.length) return cards.slice(0, 5);
  return [{ title: "Why this is connected", text: "This node is part of the visible INGENIUM+ graph through shared campuses, topics, activities or student community links." }];
}

function contextGroupsFor(type) {
  const fallback = [
    { title: "Campus anchors", types: ["university"], prefix: "Connected through" },
    { title: "Community layer", types: ["student", "groupchat", "society"], prefix: "Community links include" },
    { title: "Activity links", types: ["bip", "module", "project", "event", "opportunity"], prefix: "Related activity includes" }
  ];

  return {
    bip: [
      { title: "Host and partner campuses", types: ["university"], prefix: "This BIP is anchored by" },
      { title: "Related modules", types: ["module"], prefix: "Students can connect through" },
      { title: "Group chat", types: ["groupchat"], prefix: "Planning and questions happen in" },
      { title: "Support opportunity", types: ["opportunity"], prefix: "Useful support includes" },
      { title: "Student route", types: ["student"], prefix: "Students already linked include" }
    ],
    university: [
      { title: "Students", types: ["student"], prefix: "Student links include" },
      { title: "BIPs", types: ["bip"], prefix: "BIP routes include" },
      { title: "Modules", types: ["module"], prefix: "Related modules include" },
      { title: "Societies and chats", types: ["society", "groupchat"], prefix: "Community spaces include" }
    ],
    groupchat: [
      { title: "Students", types: ["student"], prefix: "Members or moderators include" },
      { title: "Societies", types: ["society"], prefix: "Society links include" },
      { title: "BIPs", types: ["bip"], prefix: "BIP routes using this chat include" },
      { title: "Projects", types: ["project", "opportunity"], prefix: "Project and opportunity links include" }
    ],
    student: [
      { title: "Home campus", types: ["university"], prefix: "Campus connection:" },
      { title: "Chats", types: ["groupchat"], prefix: "Community chats include" },
      { title: "Modules", types: ["module"], prefix: "Learning links include" },
      { title: "Projects and BIPs", types: ["project", "bip"], prefix: "Activity routes include" }
    ],
    project: [
      { title: "Team members", types: ["student"], prefix: "Team or student links include" },
      { title: "Modules", types: ["module"], prefix: "Knowledge links include" },
      { title: "Events", types: ["event"], prefix: "Showcase or event links include" },
      { title: "Opportunities", types: ["opportunity"], prefix: "Opportunity links include" }
    ],
    module: [
      { title: "Campuses", types: ["university"], prefix: "Offered or partnered through" },
      { title: "BIPs", types: ["bip"], prefix: "Used by" },
      { title: "Students", types: ["student"], prefix: "Student links include" },
      { title: "Communities", types: ["society", "groupchat"], prefix: "Community links include" }
    ],
    society: [
      { title: "Students", types: ["student"], prefix: "Student members include" },
      { title: "Chats", types: ["groupchat"], prefix: "Active chats include" },
      { title: "Events", types: ["event"], prefix: "Event links include" },
      { title: "Projects", types: ["project", "opportunity"], prefix: "Project links include" }
    ],
    opportunity: [
      { title: "Routes", types: ["bip", "project", "event"], prefix: "Relevant routes include" },
      { title: "Support", types: ["organization", "groupchat"], prefix: "Students can follow up through" }
    ],
    event: [
      { title: "Organisers and communities", types: ["society", "organization"], prefix: "Connected organisers include" },
      { title: "Follow-on activity", types: ["opportunity", "project"], prefix: "Next steps include" },
      { title: "Campuses", types: ["university"], prefix: "Campus links include" }
    ]
  }[type] || fallback;
}

function selectNode(id, options = {}) {
  // Node selection drives highlighting, list state, mini profile content and optional map centering.
  state.selectedId = id;
  render();
  if (options.center) centerSelectedNode({ targetScale: Math.max(state.map.scale, 1.35), smooth: true });
}

function connectedEdges(id) {
  return adjacency.get(id).slice().sort((a, b) => nodeById.get(a.otherId).label.localeCompare(nodeById.get(b.otherId).label));
}

function neighborhood(startId, depth) {
  const visited = new Set([startId]);
  let frontier = [startId];
  for (let level = 0; level < depth; level += 1) {
    const next = [];
    frontier.forEach((id) => {
      adjacency.get(id).forEach((item) => {
        if (!visited.has(item.otherId)) {
          visited.add(item.otherId);
          next.push(item.otherId);
        }
      });
    });
    frontier = next;
  }
  return visited;
}

function getHighlightIds() {
  if (state.mode === "mine") return neighborhood("you", 2);
  if (state.mode === "trace") return neighborhood(state.selectedId, 2);
  const ids = new Set([state.selectedId]);
  connectedEdges(state.selectedId).forEach((item) => ids.add(item.otherId));
  return ids;
}

function getHighlightedEdgeIds(highlightIds) {
  return new Set(edges.filter((edge) => highlightIds.has(edge.source) && highlightIds.has(edge.target)).map((edge) => edge.id));
}

function zoomBy(factor) {
  zoomAt(state.map.width / 2, state.map.height / 2, state.map.scale * factor);
}

function zoomAt(screenX, screenY, requestedScale) {
  const nextScale = clamp(requestedScale, state.map.minScale, state.map.maxScale);
  const worldX = (screenX - state.map.tx) / state.map.scale;
  const worldY = (screenY - state.map.ty) / state.map.scale;
  state.map.scale = nextScale;
  state.map.tx = screenX - worldX * nextScale;
  state.map.ty = screenY - worldY * nextScale;
  applyMapTransform();
}

function applyMapTransform() {
  const group = document.querySelector("#viewport-group");
  if (!group) return;
  group.setAttribute("transform", `translate(${state.map.tx} ${state.map.ty}) scale(${state.map.scale})`);
}

function resetMapView() {
  // Reset keeps filters and selection intact while restoring the readable whole-campus view.
  state.map.scale = 1;
  state.map.tx = 0;
  state.map.ty = 0;
  applyMapTransform();
}

function fitSelected() {
  centerSelectedNode({ targetScale: Math.max(state.map.scale, 1.55), smooth: true });
}

function centerSelectedNode({ targetScale = 1.45 } = {}) {
  const node = nodeById.get(state.selectedId);
  if (!node) return;
  const point = pointFor(node, state.map.width, state.map.height, state.map.padX, state.map.padY);
  const nextScale = clamp(targetScale, state.map.minScale, Math.min(state.map.maxScale, 2.2));
  state.map.scale = nextScale;
  state.map.tx = state.map.width / 2 - point.x * nextScale;
  state.map.ty = state.map.height / 2 - point.y * nextScale;
  applyMapTransform();
}

function localPointFromEvent(event) {
  const rect = els.svg.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * state.map.width;
  const y = ((event.clientY - rect.top) / rect.height) * state.map.height;
  return { x, y };
}

function showTooltip(node, event) {
  // Tooltip logic is intentionally light: it follows the cursor and never captures clicks.
  els.tooltip.innerHTML = `
    <strong>${escapeHtml(node.label)}</strong>
    <span>${typeLabel(node.type)} | ${escapeHtml(universitySummary(node))}</span>
  `;
  els.tooltip.hidden = false;
  moveTooltip(event);
}

function showTooltipAtNode(node) {
  const point = pointFor(node, state.map.width, state.map.height, state.map.padX, state.map.padY);
  const screenX = state.map.tx + point.x * state.map.scale;
  const screenY = state.map.ty + point.y * state.map.scale;
  positionTooltip(screenX + 14, screenY + 12);
  els.tooltip.innerHTML = `
    <strong>${escapeHtml(node.label)}</strong>
    <span>${typeLabel(node.type)} | ${escapeHtml(universitySummary(node))}</span>
  `;
  els.tooltip.hidden = false;
}

function moveTooltip(event) {
  const rect = els.stage.getBoundingClientRect();
  positionTooltip(event.clientX - rect.left + 14, event.clientY - rect.top + 14);
}

function positionTooltip(x, y) {
  const maxX = els.stage.clientWidth - 240;
  const maxY = els.stage.clientHeight - 90;
  els.tooltip.style.left = `${clamp(x, 8, Math.max(8, maxX))}px`;
  els.tooltip.style.top = `${clamp(y, 8, Math.max(8, maxY))}px`;
}

function hideTooltip() {
  els.tooltip.hidden = true;
}

function relationFor(selectedId, edge) {
  if (edge.source === selectedId) return edge.relation;
  return `linked by ${edge.relation}`;
}

function labelPriority(node, directIds, highlightIds) {
  if (node.id === state.selectedId) return 0;
  if (directIds.has(node.id)) return 1;
  if (node.type === "university") return 2;
  if (highlightIds.has(node.id)) return 3;
  return 4;
}

function boxesIntersect(a, b) {
  return a.left < b.right + 4 && a.right > b.left - 4 && a.top < b.bottom + 4 && a.bottom > b.top - 4;
}

function pointFor(node, width, height, padX, padY) {
  return pointFromPercent(node.x, node.y, width, height, padX, padY);
}

function pointFromPercent(x, y, width, height, padX, padY) {
  return {
    x: padX + ((width - padX * 2) * x) / 100,
    y: padY + ((height - padY * 2) * y) / 100
  };
}

function radiusFor(node) {
  if (node.type === "university") return 17;
  if (node.type === "bip") return 15;
  if (node.type === "student") return 13;
  if (node.type === "groupchat") return 14;
  if (node.type === "module" || node.type === "project") return 14;
  if (node.type === "opportunity") return 13;
  return 12;
}

function firstNodeOfType(type) {
  return nodes.find((node) => node.type === type);
}

function universitySummary(node) {
  if (!node.universities.length) return "INGENIUM";
  return node.universities.map(universityTag).join(", ");
}

function topicSummary(node) {
  if (!node.topics.length) return "No topic tags";
  return node.topics.map(topicLabel).join(", ");
}

function universityText(code) {
  const university = UNIVERSITIES.find((item) => item.key === code);
  return university ? `${university.full} ${university.country} ${university.label}` : code;
}

function universityTag(code) {
  const university = UNIVERSITIES.find((item) => item.key === code);
  return university ? `${university.label}, ${university.country}` : code;
}

function topicLabel(key) {
  return TOPICS.find((topic) => topic.key === key)?.label || key;
}

function typeLabel(key) {
  return TYPE_LABELS[key] || key;
}

function option(value, label) {
  const item = document.createElement("option");
  item.value = value;
  item.textContent = label;
  return item;
}

function svgEl(name, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== false && value !== null && value !== undefined) element.setAttribute(key, value);
  });
  return element;
}

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function clamp(value, min, max) {
  if (max < min) return value;
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

init();
