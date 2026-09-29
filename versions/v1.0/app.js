const NODE_TYPES = [
  { key: "student", label: "Students" },
  { key: "university", label: "Universities" },
  { key: "project", label: "Projects" },
  { key: "event", label: "Events" },
  { key: "programme", label: "Programmes" },
  { key: "skill", label: "Skills" },
  { key: "opportunity", label: "Opportunities" },
  { key: "organization", label: "Organizations" }
];

const UNIVERSITIES = [
  { key: "MTU", label: "Munster Technological University" },
  { key: "XAMK", label: "South-Eastern Finland UAS" },
  { key: "TUIASI", label: "Gheorghe Asachi TU Iasi" },
  { key: "UNIOVI", label: "University of Oviedo" },
  { key: "HKA", label: "Karlsruhe UAS" }
];

const TOPICS = [
  { key: "sustainability", label: "Sustainability" },
  { key: "data-visualisation", label: "Data visualisation" },
  { key: "entrepreneurship", label: "Entrepreneurship" },
  { key: "mobility", label: "Mobility" },
  { key: "engineering", label: "Engineering" },
  { key: "belonging", label: "Belonging" }
];

const TYPE_LABELS = {
  student: "Student",
  university: "University",
  project: "Project",
  event: "Event",
  programme: "Programme",
  skill: "Skill",
  opportunity: "Opportunity",
  organization: "Organization"
};

const nodes = [
  {
    id: "you",
    label: "You",
    short: "You",
    type: "student",
    universities: ["MTU"],
    topics: ["data-visualisation", "mobility", "sustainability"],
    description: "Pilot profile for the personal network view.",
    x: 46,
    y: 48
  },
  {
    id: "sofia",
    label: "Sofia Korhonen",
    short: "Sofia",
    type: "student",
    universities: ["XAMK"],
    topics: ["sustainability", "entrepreneurship"],
    description: "Student partner interested in circular economy projects.",
    x: 23,
    y: 34
  },
  {
    id: "mihai",
    label: "Mihai Popescu",
    short: "Mihai",
    type: "student",
    universities: ["TUIASI"],
    topics: ["engineering", "data-visualisation"],
    description: "Engineering student connected to prototype data modelling.",
    x: 70,
    y: 35
  },
  {
    id: "lara",
    label: "Lara Alvarez",
    short: "Lara",
    type: "student",
    universities: ["UNIOVI"],
    topics: ["mobility", "entrepreneurship"],
    description: "Mobility ambassador supporting short programme discovery.",
    x: 76,
    y: 63
  },
  {
    id: "ada",
    label: "Ada Murphy",
    short: "Ada",
    type: "student",
    universities: ["MTU"],
    topics: ["belonging", "sustainability"],
    description: "Student board member focused on participation and belonging.",
    x: 33,
    y: 69
  },
  {
    id: "mtu",
    label: "Munster Technological University",
    short: "MTU",
    type: "university",
    universities: ["MTU"],
    topics: ["mobility", "belonging"],
    description: "INGENIUM partner university and INGENIUM+ lead institution in the pilot.",
    x: 32,
    y: 52
  },
  {
    id: "xamk",
    label: "South-Eastern Finland UAS",
    short: "Xamk",
    type: "university",
    universities: ["XAMK"],
    topics: ["sustainability", "entrepreneurship"],
    description: "INGENIUM partner university represented in the pilot dataset.",
    x: 16,
    y: 18
  },
  {
    id: "tuiasi",
    label: "Gheorghe Asachi TU Iasi",
    short: "TUIASI",
    type: "university",
    universities: ["TUIASI"],
    topics: ["engineering", "data-visualisation"],
    description: "INGENIUM partner university represented in the pilot dataset.",
    x: 84,
    y: 20
  },
  {
    id: "uniovi",
    label: "University of Oviedo",
    short: "Oviedo",
    type: "university",
    universities: ["UNIOVI"],
    topics: ["mobility", "entrepreneurship"],
    description: "INGENIUM partner university represented in the pilot dataset.",
    x: 89,
    y: 74
  },
  {
    id: "hka",
    label: "Karlsruhe UAS",
    short: "HKA",
    type: "university",
    universities: ["HKA"],
    topics: ["engineering", "mobility"],
    description: "INGENIUM partner university included as an expansion node.",
    x: 57,
    y: 82
  },
  {
    id: "ingenium-plus",
    label: "INGENIUM+",
    short: "INGENIUM+",
    type: "project",
    universities: ["MTU", "XAMK", "TUIASI"],
    topics: ["data-visualisation", "belonging", "mobility"],
    description: "Student-led graph-first prototype for alliance-scale discovery.",
    x: 52,
    y: 25
  },
  {
    id: "circular-sprint",
    label: "Circular Economy Sprint",
    short: "Circular Sprint",
    type: "project",
    universities: ["XAMK", "MTU"],
    topics: ["sustainability", "entrepreneurship"],
    description: "Sample student partnership linking sustainability interests to collaborators.",
    x: 27,
    y: 17
  },
  {
    id: "campus-map",
    label: "European Campus Map",
    short: "Campus Map",
    type: "project",
    universities: ["MTU", "TUIASI", "UNIOVI", "HKA"],
    topics: ["mobility", "belonging", "data-visualisation"],
    description: "A map layer that links programmes, events, and partner institutions.",
    x: 61,
    y: 56
  },
  {
    id: "ten-days",
    label: "10 Days of INGENIUM",
    short: "10 Days",
    type: "event",
    universities: ["MTU", "XAMK", "TUIASI", "UNIOVI"],
    topics: ["mobility", "belonging"],
    description: "Alliance event used as a participation moment in the pilot graph.",
    x: 44,
    y: 78
  },
  {
    id: "design-workshop",
    label: "Graph Design Workshop",
    short: "Design Lab",
    type: "event",
    universities: ["MTU", "TUIASI"],
    topics: ["data-visualisation", "belonging"],
    description: "Prototype testing session for graph labels, filters, and user journeys.",
    x: 61,
    y: 42
  },
  {
    id: "smart-cities-bip",
    label: "Smart Cities BIP",
    short: "Smart BIP",
    type: "programme",
    universities: ["TUIASI", "HKA", "UNIOVI"],
    topics: ["engineering", "mobility", "data-visualisation"],
    description: "Sample blended intensive programme linking students, hosts, and topics.",
    x: 78,
    y: 49
  },
  {
    id: "micro-credential",
    label: "Micro-credential Studio",
    short: "Credential",
    type: "programme",
    universities: ["XAMK", "MTU", "HKA"],
    topics: ["entrepreneurship", "mobility"],
    description: "Joint learning pathway represented as a programme node.",
    x: 42,
    y: 13
  },
  {
    id: "sustainability",
    label: "Sustainability",
    short: "Sustainability",
    type: "skill",
    universities: ["MTU", "XAMK"],
    topics: ["sustainability"],
    description: "Theme node used for collaborator and project discovery.",
    x: 15,
    y: 49
  },
  {
    id: "data-viz",
    label: "Data Visualisation",
    short: "Data Viz",
    type: "skill",
    universities: ["MTU", "TUIASI", "HKA"],
    topics: ["data-visualisation", "engineering"],
    description: "Skill node connecting graph modelling, evidence, and technical work.",
    x: 66,
    y: 18
  },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship",
    short: "Venture",
    type: "skill",
    universities: ["XAMK", "UNIOVI", "HKA"],
    topics: ["entrepreneurship"],
    description: "Theme node for project invitations and innovation activity.",
    x: 18,
    y: 72
  },
  {
    id: "engineering",
    label: "Engineering",
    short: "Engineering",
    type: "skill",
    universities: ["TUIASI", "HKA", "MTU"],
    topics: ["engineering"],
    description: "Skill node linking technical students to programmes and projects.",
    x: 90,
    y: 41
  },
  {
    id: "mobility-call",
    label: "Mobility Open Call",
    short: "Mobility Call",
    type: "opportunity",
    universities: ["MTU", "XAMK", "TUIASI", "UNIOVI", "HKA"],
    topics: ["mobility"],
    description: "Opportunity node for students seeking short-term alliance participation.",
    x: 67,
    y: 72
  },
  {
    id: "student-partnerships",
    label: "Student Partnerships",
    short: "Partnerships",
    type: "opportunity",
    universities: ["MTU", "XAMK", "TUIASI"],
    topics: ["belonging", "entrepreneurship", "sustainability"],
    description: "Call pathway for student-led INGENIUM projects.",
    x: 38,
    y: 31
  },
  {
    id: "sustainability-club",
    label: "Sustainability Club",
    short: "Sust. Club",
    type: "organization",
    universities: ["XAMK", "MTU"],
    topics: ["sustainability", "belonging"],
    description: "Sample student organization for community context.",
    x: 11,
    y: 61
  },
  {
    id: "student-board",
    label: "Student Board",
    short: "Board",
    type: "organization",
    universities: ["MTU", "UNIOVI", "TUIASI"],
    topics: ["belonging", "mobility"],
    description: "Student representation node connected to participation activity.",
    x: 51,
    y: 68
  },
  {
    id: "digital-campus",
    label: "Digital Campus Unit",
    short: "Digital Unit",
    type: "organization",
    universities: ["MTU", "TUIASI", "HKA"],
    topics: ["data-visualisation", "mobility"],
    description: "Institutional support node for later integration planning.",
    x: 72,
    y: 84
  }
];

const edges = [
  { id: "e1", source: "you", target: "mtu", relation: "studies at" },
  { id: "e2", source: "you", target: "ingenium-plus", relation: "works on" },
  { id: "e3", source: "you", target: "data-viz", relation: "skilled in" },
  { id: "e4", source: "you", target: "sustainability", relation: "interested in" },
  { id: "e5", source: "you", target: "ten-days", relation: "attended" },
  { id: "e6", source: "sofia", target: "xamk", relation: "studies at" },
  { id: "e7", source: "sofia", target: "circular-sprint", relation: "works on" },
  { id: "e8", source: "sofia", target: "sustainability", relation: "interested in" },
  { id: "e9", source: "mihai", target: "tuiasi", relation: "studies at" },
  { id: "e10", source: "mihai", target: "ingenium-plus", relation: "works on" },
  { id: "e11", source: "mihai", target: "engineering", relation: "skilled in" },
  { id: "e12", source: "lara", target: "uniovi", relation: "studies at" },
  { id: "e13", source: "lara", target: "smart-cities-bip", relation: "attended" },
  { id: "e14", source: "lara", target: "mobility-call", relation: "interested in" },
  { id: "e15", source: "ada", target: "mtu", relation: "studies at" },
  { id: "e16", source: "ada", target: "student-board", relation: "member of" },
  { id: "e17", source: "ada", target: "sustainability-club", relation: "member of" },
  { id: "e18", source: "ingenium-plus", target: "student-partnerships", relation: "funded by" },
  { id: "e19", source: "ingenium-plus", target: "design-workshop", relation: "tested through" },
  { id: "e20", source: "ingenium-plus", target: "campus-map", relation: "connected to" },
  { id: "e21", source: "ingenium-plus", target: "mtu", relation: "led at" },
  { id: "e22", source: "ingenium-plus", target: "xamk", relation: "partnered with" },
  { id: "e23", source: "ingenium-plus", target: "tuiasi", relation: "partnered with" },
  { id: "e24", source: "circular-sprint", target: "sustainability-club", relation: "supported by" },
  { id: "e25", source: "circular-sprint", target: "sustainability", relation: "connected to" },
  { id: "e26", source: "campus-map", target: "mobility-call", relation: "surfaces" },
  { id: "e27", source: "campus-map", target: "digital-campus", relation: "supported by" },
  { id: "e28", source: "campus-map", target: "ten-days", relation: "maps" },
  { id: "e29", source: "ten-days", target: "student-board", relation: "organised with" },
  { id: "e30", source: "ten-days", target: "mobility-call", relation: "leads to" },
  { id: "e31", source: "design-workshop", target: "data-viz", relation: "connected to" },
  { id: "e32", source: "design-workshop", target: "student-board", relation: "reviewed by" },
  { id: "e33", source: "smart-cities-bip", target: "tuiasi", relation: "hosted by" },
  { id: "e34", source: "smart-cities-bip", target: "hka", relation: "partnered with" },
  { id: "e35", source: "smart-cities-bip", target: "engineering", relation: "connected to" },
  { id: "e36", source: "smart-cities-bip", target: "data-viz", relation: "uses" },
  { id: "e37", source: "micro-credential", target: "xamk", relation: "organised by" },
  { id: "e38", source: "micro-credential", target: "entrepreneurship", relation: "connected to" },
  { id: "e39", source: "student-partnerships", target: "entrepreneurship", relation: "supports" },
  { id: "e40", source: "student-partnerships", target: "sustainability", relation: "supports" },
  { id: "e41", source: "mobility-call", target: "uniovi", relation: "promoted by" },
  { id: "e42", source: "mobility-call", target: "hka", relation: "promoted by" },
  { id: "e43", source: "digital-campus", target: "data-viz", relation: "uses" },
  { id: "e44", source: "engineering", target: "hka", relation: "anchored at" }
];

const state = {
  selectedId: "ingenium-plus",
  mode: "explore",
  search: "",
  university: "all",
  topic: "all",
  activeTypes: new Set(NODE_TYPES.map((type) => type.key)),
  showList: true
};

const nodeById = new Map(nodes.map((node) => [node.id, node]));
const adjacency = new Map(nodes.map((node) => [node.id, []]));

edges.forEach((edge) => {
  adjacency.get(edge.source).push({ edge, otherId: edge.target });
  adjacency.get(edge.target).push({ edge, otherId: edge.source });
});

const els = {
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
  empty: document.querySelector("#empty-state")
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
  UNIVERSITIES.forEach((university) => els.university.append(option(university.key, universityLabel(university.key))));

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
    render();
  });

  els.university.addEventListener("change", () => {
    state.university = els.university.value;
    render();
  });

  els.topic.addEventListener("change", () => {
    state.topic = els.topic.value;
    render();
  });

  els.typeFilters.addEventListener("change", (event) => {
    if (event.target.type !== "checkbox") return;
    if (event.target.checked) {
      state.activeTypes.add(event.target.value);
    } else {
      state.activeTypes.delete(event.target.value);
    }
    render();
  });

  els.listToggle.addEventListener("change", () => {
    state.showList = els.listToggle.checked;
    renderList();
  });

  document.querySelector("#reset-view").addEventListener("click", resetState);

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      syncControls();
      render();
    });
  });

  document.querySelectorAll(".journey-button").forEach((button) => {
    button.addEventListener("click", () => applyJourney(button.dataset.journey));
  });
}

function resetState() {
  state.selectedId = "ingenium-plus";
  state.mode = "explore";
  state.search = "";
  state.university = "all";
  state.topic = "all";
  state.activeTypes = new Set(NODE_TYPES.map((type) => type.key));
  state.showList = true;
  syncControls();
  render();
}

function applyJourney(journey) {
  state.search = "";
  state.activeTypes = new Set(NODE_TYPES.map((type) => type.key));
  state.showList = true;

  if (journey === "mtu-projects") {
    state.university = "MTU";
    state.topic = "all";
    state.mode = "path";
    state.selectedId = "mtu";
  }

  if (journey === "sustainability") {
    state.university = "all";
    state.topic = "sustainability";
    state.mode = "path";
    state.selectedId = "sustainability";
  }

  if (journey === "mobility") {
    state.university = "all";
    state.topic = "mobility";
    state.mode = "path";
    state.selectedId = "smart-cities-bip";
  }

  syncControls();
  render();
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
    ...node.universities.map(universityLabel),
    ...node.topics.map(topicLabel)
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(term);
}

function renderGraph() {
  const visibleNodes = getVisibleNodes();
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = getVisibleEdges(visibleIds);
  const highlightIds = getHighlightIds();
  const highlightedEdges = getHighlightedEdgeIds(highlightIds);
  const width = Math.max(els.svg.clientWidth || 900, 360);
  const height = Math.max(els.svg.clientHeight || 520, 420);
  const padX = width < 620 ? 30 : 48;
  const padY = height < 520 ? 34 : 44;

  els.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  els.svg.replaceChildren();
  els.empty.hidden = visibleNodes.length > 0;

  const edgeLayer = svgEl("g", { "aria-hidden": "true" });
  const nodeLayer = svgEl("g");
  const labelLayer = svgEl("g", { "aria-hidden": "true" });
  els.svg.append(edgeLayer, nodeLayer, labelLayer);

  visibleEdges.forEach((edge) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    const p1 = pointFor(source, width, height, padX, padY);
    const p2 = pointFor(target, width, height, padX, padY);
    const isHighlighted = highlightedEdges.has(edge.id);
    const isDimmed = isDimmedEdge(edge, highlightIds);

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
    const isDimmed = state.mode === "path" && !isHighlighted;
    const group = svgEl("g", {
      class: classNames(
        "graph-node",
        `type-${node.type}`,
        isSelected && "is-selected",
        isHighlighted && "is-highlighted",
        isDimmed && "is-dimmed"
      ),
      transform: `translate(${point.x} ${point.y})`,
      tabindex: "0",
      focusable: "true",
      role: "button",
      "aria-label": `${typeLabel(node.type)}: ${node.label}`
    });

    group.append(svgEl("circle", { r: radius, cx: 0, cy: 0 }));

    group.addEventListener("click", () => selectNode(node.id));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectNode(node.id);
      }
    });

    nodeLayer.append(group);
  });

  renderNodeLabels(labelLayer, visibleNodes, highlightIds, width, height, padX, padY);
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
      <strong>${node.label}</strong>
      <span>${typeLabel(node.type)} | ${universityText(node)}</span>
      <span>${topicText(node)}</span>
    `;
    button.addEventListener("click", () => selectNode(node.id));
    els.nodeList.append(button);
  });
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
    const labelWidth = Math.max(44, Math.min(126, node.short.length * 7 + 16));
    const labelHeight = 18;
    const labelX = clamp(point.x, labelWidth / 2 + 8, width - labelWidth / 2 - 8);
    const belowY = point.y + radius + 17;
    const aboveY = point.y - radius - 9;
    const labelY = belowY + 4 > height ? aboveY : belowY;
    const box = {
      left: labelX - labelWidth / 2,
      right: labelX + labelWidth / 2,
      top: labelY - labelHeight + 3,
      bottom: labelY + 4
    };
    const isSelected = node.id === state.selectedId;
    const collides = placed.some((existing) => boxesIntersect(existing, box));

    if (!isSelected && collides) return;

    const text = svgEl("text", {
      class: classNames("graph-label", isSelected && "is-selected"),
      x: labelX,
      y: labelY,
      "text-anchor": "middle"
    });
    text.textContent = node.short;
    layer.append(text);
    placed.push(box);
  });
}

function labelPriority(node, directIds, highlightIds) {
  if (node.id === state.selectedId) return 0;
  if (directIds.has(node.id)) return 1;
  if (highlightIds.has(node.id)) return 2;
  if (node.type === "university" || node.type === "project") return 3;
  return 4;
}

function boxesIntersect(a, b) {
  return a.left < b.right + 4 && a.right > b.left - 4 && a.top < b.bottom + 4 && a.bottom > b.top - 4;
}

function renderDetails() {
  const node = nodeById.get(state.selectedId);
  if (!node) {
    els.detail.innerHTML = `<section class="detail-card"><p class="empty-detail">No node selected.</p></section>`;
    return;
  }

  const connections = connectedEdges(node.id);
  const twoStepCount = Math.max(neighborhood(node.id, 2).size - 1, 0);

  els.detail.innerHTML = `
    <section class="detail-card">
      <h2>Selected</h2>
      <h1>${node.label}</h1>
      <div class="tag-row">
        <span class="tag">${typeLabel(node.type)}</span>
        ${node.universities.map((code) => `<span class="tag">${universityShort(code)}</span>`).join("")}
      </div>
      <p class="detail-copy">${node.description}</p>
      <div class="metric-row">
        <div class="metric"><b>${connections.length}</b><span>Direct links</span></div>
        <div class="metric"><b>${twoStepCount}</b><span>Two-step reach</span></div>
      </div>
      <div class="detail-actions">
        <button class="primary" type="button" data-action="trace">Trace paths</button>
        <button type="button" data-action="mine">My network</button>
      </div>
    </section>
    <section class="detail-card">
      <h2>Connections</h2>
      <div class="connection-list">
        ${connections.map((item) => connectionMarkup(node.id, item)).join("")}
      </div>
    </section>
  `;

  els.detail.querySelector('[data-action="trace"]').addEventListener("click", () => {
    state.mode = "path";
    syncControls();
    render();
  });

  els.detail.querySelector('[data-action="mine"]').addEventListener("click", () => {
    state.mode = "mine";
    state.selectedId = "you";
    syncControls();
    render();
  });

  els.detail.querySelectorAll(".connection-card").forEach((button) => {
    button.addEventListener("click", () => selectNode(button.dataset.nodeId));
  });
}

function connectionMarkup(selectedId, item) {
  const other = nodeById.get(item.otherId);
  const relation = relationFor(selectedId, item.edge);
  return `
    <button class="connection-card" type="button" data-node-id="${other.id}">
      <strong>${other.label}</strong>
      <span>${relation}</span>
    </button>
  `;
}

function relationFor(selectedId, edge) {
  if (edge.source === selectedId) return edge.relation;
  return `linked by ${edge.relation}`;
}

function selectNode(id) {
  state.selectedId = id;
  render();
}

function connectedEdges(id) {
  return adjacency.get(id).slice().sort((a, b) => {
    const first = nodeById.get(a.otherId).label;
    const second = nodeById.get(b.otherId).label;
    return first.localeCompare(second);
  });
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
  if (state.mode === "path") return neighborhood(state.selectedId, 2);
  const ids = new Set([state.selectedId]);
  connectedEdges(state.selectedId).forEach((item) => ids.add(item.otherId));
  return ids;
}

function getHighlightedEdgeIds(highlightIds) {
  return new Set(
    edges
      .filter((edge) => highlightIds.has(edge.source) && highlightIds.has(edge.target))
      .map((edge) => edge.id)
  );
}

function edgeTouchesSelected(edge) {
  return edge.source === state.selectedId || edge.target === state.selectedId;
}

function isDimmedEdge(edge, highlightIds) {
  if (state.mode !== "path") return false;
  return !highlightIds.has(edge.source) || !highlightIds.has(edge.target);
}

function pointFor(node, width, height, padX, padY) {
  return {
    x: padX + ((width - padX * 2) * node.x) / 100,
    y: padY + ((height - padY * 2) * node.y) / 100
  };
}

function radiusFor(node) {
  if (node.type === "university") return 17;
  if (node.type === "project") return 16;
  if (node.type === "programme" || node.type === "event") return 15;
  if (node.type === "skill") return 12;
  return 13;
}

function universityText(node) {
  if (!node.universities.length) return "Alliance";
  return node.universities.map(universityShort).join(", ");
}

function topicText(node) {
  if (!node.topics.length) return "No topic";
  return node.topics.map(topicLabel).join(", ");
}

function universityLabel(code) {
  return UNIVERSITIES.find((university) => university.key === code)?.label || code;
}

function universityShort(code) {
  return code === "UNIOVI" ? "Oviedo" : code;
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
    if (value !== false && value !== null && value !== undefined) {
      element.setAttribute(key, value);
    }
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

init();
