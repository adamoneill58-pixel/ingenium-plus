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

// Demo data: every node has a map position, one or more university anchors, topic tags,
// and a short description. Skills are metadata only, not graph nodes.
const nodes = [
  {
    id: "you",
    label: "You",
    short: "You",
    type: "student",
    universities: ["MTU"],
    topics: ["mobility", "data-visualisation", "sustainability"],
    description: "Sample student profile showing how a personal route can connect to campuses, chats, BIPs, modules and projects.",
    x: 25,
    y: 47
  },
  {
    id: "sofia",
    label: "Sofia Korhonen",
    short: "Sofia",
    type: "student",
    universities: ["XAMK"],
    topics: ["sustainability", "entrepreneurship"],
    description: "XAMK student interested in circular economy projects and student partnership teams.",
    x: 58,
    y: 23
  },
  {
    id: "mihai",
    label: "Mihai Popescu",
    short: "Mihai",
    type: "student",
    universities: ["TUIASI"],
    topics: ["engineering", "data-visualisation", "ai"],
    description: "Engineering student connected to AI, smart cities and graph prototype work.",
    x: 68,
    y: 55
  },
  {
    id: "lara",
    label: "Lara Alvarez",
    short: "Lara",
    type: "student",
    universities: ["OVIEDO"],
    topics: ["mobility", "intercultural"],
    description: "Mobility ambassador helping students find short BIPs and incoming student support.",
    x: 35,
    y: 69
  },
  {
    id: "ada",
    label: "Ada Murphy",
    short: "Ada",
    type: "student",
    universities: ["MTU"],
    topics: ["belonging", "sustainability"],
    description: "Student board member focused on belonging, student voice and community onboarding.",
    x: 29,
    y: 50
  },
  {
    id: "erik",
    label: "Erik Lind",
    short: "Erik",
    type: "student",
    universities: ["SKOVDE"],
    topics: ["ai", "data-visualisation"],
    description: "Student connected to CLARITY-AI and data visualisation activity.",
    x: 52,
    y: 34
  },
  {
    id: "elena",
    label: "Elena Rossi",
    short: "Elena",
    type: "student",
    universities: ["CHIETI"],
    topics: ["health", "sustainability"],
    description: "Student interested in health, wellbeing and sustainability-focused alliance projects.",
    x: 54,
    y: 68
  },
  {
    id: "nina",
    label: "Nina Kowalska",
    short: "Nina",
    type: "student",
    universities: ["POZNAN"],
    topics: ["health", "mobility"],
    description: "Medical sciences student connected to wellbeing BIPs and incoming mobility groups.",
    x: 60,
    y: 46
  },
  {
    id: "mtu",
    label: "Munster Technological University",
    short: "MTU",
    type: "university",
    universities: ["MTU"],
    topics: ["mobility", "belonging", "data-visualisation"],
    description: "INGENIUM partner in Ireland and sample home campus for the personal network route.",
    x: 21,
    y: 44
  },
  {
    id: "xamk",
    label: "South-Eastern Finland University of Applied Sciences",
    short: "XAMK",
    type: "university",
    universities: ["XAMK"],
    topics: ["sustainability", "entrepreneurship"],
    description: "INGENIUM partner in Finland, anchoring sustainability and innovation activity.",
    x: 60,
    y: 18
  },
  {
    id: "tuiasi",
    label: "Gheorghe Asachi Technical University of Iasi",
    short: "TUIASI",
    type: "university",
    universities: ["TUIASI"],
    topics: ["engineering", "data-visualisation", "ai"],
    description: "INGENIUM partner in Romania, anchoring engineering, AI and smart city work.",
    x: 70,
    y: 56
  },
  {
    id: "oviedo",
    label: "University of Oviedo",
    short: "Oviedo",
    type: "university",
    universities: ["OVIEDO"],
    topics: ["mobility", "intercultural", "entrepreneurship"],
    description: "INGENIUM partner in Spain, connected to mobility and student welcome routes.",
    x: 34,
    y: 72
  },
  {
    id: "karlsruhe",
    label: "Karlsruhe University of Applied Sciences",
    short: "Karlsruhe",
    type: "university",
    universities: ["KARLSRUHE"],
    topics: ["engineering", "mobility", "data-visualisation"],
    description: "INGENIUM partner in Germany, used as a host anchor for BIP and smart city activity.",
    x: 48,
    y: 50
  },
  {
    id: "crete",
    label: "University of Crete",
    short: "Crete",
    type: "university",
    universities: ["CRETE"],
    topics: ["health", "intercultural", "sustainability"],
    description: "INGENIUM partner in Greece, connected to wellbeing and intercultural activity.",
    x: 66,
    y: 82
  },
  {
    id: "skovde",
    label: "University of Skovde",
    short: "Skovde",
    type: "university",
    universities: ["SKOVDE"],
    topics: ["ai", "data-visualisation", "engineering"],
    description: "INGENIUM partner in Sweden, connected to AI, games and digital society themes.",
    x: 52,
    y: 29
  },
  {
    id: "rouen",
    label: "University of Rouen Normandy",
    short: "Rouen",
    type: "university",
    universities: ["ROUEN"],
    topics: ["intercultural", "mobility", "belonging"],
    description: "INGENIUM partner in France, connected to intercultural communication and mobility support.",
    x: 39,
    y: 53
  },
  {
    id: "chieti",
    label: "University \"G. d'Annunzio\" Chieti-Pescara",
    short: "Chieti",
    type: "university",
    universities: ["CHIETI"],
    topics: ["health", "sustainability", "entrepreneurship"],
    description: "INGENIUM partner in Italy, connected to wellbeing, innovation and sustainability activity.",
    x: 54,
    y: 66
  },
  {
    id: "poznan",
    label: "University of Medical Sciences Poznan",
    short: "Poznan",
    type: "university",
    universities: ["POZNAN"],
    topics: ["health", "mobility"],
    description: "INGENIUM partner in Poland, anchoring health sciences and mobility activity.",
    x: 59,
    y: 46
  },
  {
    id: "ingenium-plus",
    label: "INGENIUM+",
    short: "INGENIUM+",
    type: "project",
    universities: ["MTU", "XAMK", "TUIASI"],
    topics: ["mobility", "belonging", "data-visualisation"],
    description: "Student-led project testing a graph-first community layer for the INGENIUM European Campus.",
    x: 43,
    y: 43
  },
  {
    id: "europe-campus-map",
    label: "European Campus Map",
    short: "Campus Map",
    type: "project",
    universities: ["MTU", "KARLSRUHE", "TUIASI", "OVIEDO"],
    topics: ["mobility", "data-visualisation", "belonging"],
    description: "Map-based discovery project connecting universities, opportunities and community spaces.",
    x: 49,
    y: 58
  },
  {
    id: "circular-sprint",
    label: "Circular Economy Sprint",
    short: "Circular Sprint",
    type: "project",
    universities: ["XAMK", "MTU", "CHIETI"],
    topics: ["sustainability", "entrepreneurship"],
    description: "Sample student project linking sustainability teams across partner campuses.",
    x: 51,
    y: 37
  },
  {
    id: "health-wellbeing-lab",
    label: "Health and Wellbeing Lab",
    short: "Wellbeing Lab",
    type: "project",
    universities: ["POZNAN", "CRETE", "CHIETI"],
    topics: ["health", "belonging"],
    description: "Cross-campus project connecting health sciences students with wellbeing activity.",
    x: 62,
    y: 66
  },
  {
    id: "academic-communication-bip",
    label: "Academic Communication BIP",
    short: "Academic Comms",
    type: "bip",
    universities: ["ROUEN", "OVIEDO"],
    topics: ["intercultural", "mobility"],
    description: "Blended Intensive Programme for academic and intercultural communication.",
    x: 40,
    y: 61
  },
  {
    id: "clarity-ai-bip",
    label: "CLARITY-AI BIP",
    short: "CLARITY-AI",
    type: "bip",
    universities: ["SKOVDE", "TUIASI", "KARLSRUHE"],
    topics: ["ai", "data-visualisation", "engineering"],
    description: "Sample AI-focused BIP linking students, modules and a Germany 2026 group chat.",
    x: 59,
    y: 38
  },
  {
    id: "wellbeing-bip",
    label: "Nature-Based Wellbeing BIP",
    short: "Wellbeing BIP",
    type: "bip",
    universities: ["CRETE", "POZNAN", "CHIETI"],
    topics: ["health", "sustainability", "belonging"],
    description: "BIP connecting wellbeing, nature-based practice and health sciences students.",
    x: 65,
    y: 75
  },
  {
    id: "smart-cities-bip",
    label: "Smart Cities BIP",
    short: "Smart Cities BIP",
    type: "bip",
    universities: ["KARLSRUHE", "TUIASI", "MTU"],
    topics: ["engineering", "data-visualisation", "mobility"],
    description: "BIP linking students to engineering, data visualisation and urban innovation modules.",
    x: 55,
    y: 52
  },
  {
    id: "sustainable-development-bip",
    label: "Sustainable Development BIP",
    short: "Sustainable BIP",
    type: "bip",
    universities: ["XAMK", "CRETE", "CHIETI"],
    topics: ["sustainability", "entrepreneurship"],
    description: "BIP connecting sustainability societies, innovation modules and project teams.",
    x: 57,
    y: 61
  },
  {
    id: "project-management-module",
    label: "European Project Management",
    short: "Project Mgmt",
    type: "module",
    universities: ["MTU", "ROUEN"],
    topics: ["entrepreneurship", "intercultural"],
    description: "Module for students coordinating cross-campus work and student partnership activity.",
    x: 35,
    y: 48
  },
  {
    id: "data-viz-module",
    label: "Data Visualisation",
    short: "Data Viz",
    type: "module",
    universities: ["MTU", "TUIASI", "SKOVDE"],
    topics: ["data-visualisation", "ai"],
    description: "Module connected to graph design, evidence dashboards and explainable recommendations.",
    x: 56,
    y: 43
  },
  {
    id: "sustainable-innovation-module",
    label: "Sustainable Innovation",
    short: "Sust. Innovation",
    type: "module",
    universities: ["XAMK", "CHIETI"],
    topics: ["sustainability", "entrepreneurship"],
    description: "Module that links sustainability projects with entrepreneurship societies.",
    x: 48,
    y: 32
  },
  {
    id: "intercultural-module",
    label: "Intercultural Communication",
    short: "Intercultural",
    type: "module",
    universities: ["ROUEN", "OVIEDO"],
    topics: ["intercultural", "mobility", "belonging"],
    description: "Module supporting students entering a new campus or international group.",
    x: 38,
    y: 58
  },
  {
    id: "smart-cities-module",
    label: "Smart Cities",
    short: "Smart Cities",
    type: "module",
    universities: ["KARLSRUHE", "TUIASI"],
    topics: ["engineering", "data-visualisation"],
    description: "Module connected to the Smart Cities BIP and technical project teams.",
    x: 61,
    y: 50
  },
  {
    id: "sustainability-society",
    label: "Sustainability Society",
    short: "Sust. Society",
    type: "society",
    universities: ["MTU", "XAMK", "CHIETI"],
    topics: ["sustainability", "belonging"],
    description: "Student society connecting sustainability projects, events and group chats.",
    x: 36,
    y: 38
  },
  {
    id: "erasmus-society",
    label: "Erasmus Society",
    short: "Erasmus",
    type: "society",
    universities: ["OVIEDO", "ROUEN", "MTU"],
    topics: ["mobility", "intercultural", "belonging"],
    description: "Community node for incoming and outgoing mobility students.",
    x: 31,
    y: 63
  },
  {
    id: "entrepreneurship-society",
    label: "Entrepreneurship Society",
    short: "Venture",
    type: "society",
    universities: ["XAMK", "CHIETI", "KARLSRUHE"],
    topics: ["entrepreneurship", "sustainability"],
    description: "Society for students building student partnership ideas and innovation projects.",
    x: 48,
    y: 64
  },
  {
    id: "coding-club",
    label: "Coding Club",
    short: "Coding Club",
    type: "society",
    universities: ["TUIASI", "SKOVDE", "MTU"],
    topics: ["engineering", "ai", "data-visualisation"],
    description: "Technical community connected to AI, graph prototyping and smart city modules.",
    x: 63,
    y: 42
  },
  {
    id: "student-board",
    label: "Student Board",
    short: "Board",
    type: "society",
    universities: ["MTU", "ROUEN", "OVIEDO", "POZNAN"],
    topics: ["belonging", "mobility"],
    description: "Student representation node connected to campus activity and feedback routes.",
    x: 44,
    y: 69
  },
  {
    id: "mtu-chat",
    label: "MTU INGENIUM Students",
    short: "MTU Chat",
    type: "groupchat",
    universities: ["MTU"],
    topics: ["belonging", "mobility"],
    description: "Sample group chat for MTU students joining INGENIUM activities.",
    x: 26,
    y: 39
  },
  {
    id: "germany-bip-chat",
    label: "BIP Germany 2026 Chat",
    short: "Germany Chat",
    type: "groupchat",
    universities: ["KARLSRUHE", "TUIASI", "SKOVDE"],
    topics: ["mobility", "engineering", "data-visualisation"],
    description: "Planning chat for students preparing for the Germany 2026 BIP route.",
    x: 52,
    y: 48
  },
  {
    id: "sustainability-chat",
    label: "Sustainability Projects Chat",
    short: "Sust. Chat",
    type: "groupchat",
    universities: ["XAMK", "MTU", "CHIETI"],
    topics: ["sustainability", "entrepreneurship"],
    description: "Group chat connecting sustainability project teams and society members.",
    x: 43,
    y: 35
  },
  {
    id: "incoming-chat",
    label: "Incoming Mobility Students",
    short: "Mobility Chat",
    type: "groupchat",
    universities: ["ROUEN", "OVIEDO", "MTU", "POZNAN"],
    topics: ["mobility", "intercultural", "belonging"],
    description: "Community chat for students arriving at a new INGENIUM partner campus.",
    x: 42,
    y: 63
  },
  {
    id: "partnership-chat",
    label: "Student Partnership Teams",
    short: "Partnership Chat",
    type: "groupchat",
    universities: ["MTU", "XAMK", "TUIASI"],
    topics: ["belonging", "entrepreneurship", "data-visualisation"],
    description: "Shared team space for students working on alliance-wide pilot projects.",
    x: 46,
    y: 45
  },
  {
    id: "ten-days",
    label: "10 Days of INGENIUM",
    short: "10 Days",
    type: "event",
    universities: ["MTU", "OVIEDO", "ROUEN"],
    topics: ["mobility", "belonging", "intercultural"],
    description: "Alliance event used in the prototype as a visible participation moment.",
    x: 39,
    y: 67
  },
  {
    id: "student-forum",
    label: "European Student Forum",
    short: "Forum",
    type: "event",
    universities: ["POZNAN", "CRETE", "CHIETI"],
    topics: ["belonging", "health", "mobility"],
    description: "Sample forum connecting student board activity with wellbeing and mobility themes.",
    x: 58,
    y: 71
  },
  {
    id: "demo-day",
    label: "INGENIUM+ Demo Day",
    short: "Demo Day",
    type: "event",
    universities: ["MTU", "TUIASI", "XAMK"],
    topics: ["data-visualisation", "belonging"],
    description: "Prototype review session for students, staff and alliance evaluators.",
    x: 45,
    y: 52
  },
  {
    id: "mobility-call",
    label: "Mobility Open Call",
    short: "Mobility Call",
    type: "opportunity",
    universities: ["MTU", "XAMK", "TUIASI", "OVIEDO", "KARLSRUHE", "CRETE", "SKOVDE", "ROUEN", "CHIETI", "POZNAN"],
    topics: ["mobility"],
    description: "Opportunity node for students seeking short-term alliance participation.",
    x: 50,
    y: 72
  },
  {
    id: "student-partnerships",
    label: "Student Partnerships Call",
    short: "Partnerships",
    type: "opportunity",
    universities: ["MTU", "XAMK", "TUIASI"],
    topics: ["belonging", "entrepreneurship", "sustainability"],
    description: "Opportunity for student-led teams to propose alliance projects.",
    x: 40,
    y: 42
  },
  {
    id: "bip-scholarship",
    label: "BIP Mobility Support",
    short: "BIP Support",
    type: "opportunity",
    universities: ["KARLSRUHE", "ROUEN", "CRETE", "POZNAN"],
    topics: ["mobility", "belonging"],
    description: "Sample support opportunity connected to BIP participation routes.",
    x: 58,
    y: 62
  },
  {
    id: "digital-campus-unit",
    label: "Digital Campus Unit",
    short: "Digital Unit",
    type: "organization",
    universities: ["MTU", "TUIASI", "KARLSRUHE"],
    topics: ["data-visualisation", "mobility"],
    description: "Institutional support node for future digital campus integration.",
    x: 54,
    y: 55
  },
  {
    id: "alliance-student-support",
    label: "Alliance Student Support",
    short: "Student Support",
    type: "organization",
    universities: ["ROUEN", "OVIEDO", "POZNAN", "CRETE"],
    topics: ["belonging", "mobility", "health"],
    description: "Support node representing guidance for mobility, wellbeing and community onboarding.",
    x: 48,
    y: 74
  }
];

const edges = [
  { id: "e1", source: "you", target: "mtu", relation: "studies at" },
  { id: "e2", source: "you", target: "ingenium-plus", relation: "works on" },
  { id: "e3", source: "you", target: "mtu-chat", relation: "member of" },
  { id: "e4", source: "you", target: "data-viz-module", relation: "taking module" },
  { id: "e5", source: "you", target: "smart-cities-bip", relation: "interested in" },
  { id: "e6", source: "sofia", target: "xamk", relation: "studies at" },
  { id: "e7", source: "sofia", target: "sustainable-development-bip", relation: "joined" },
  { id: "e8", source: "sofia", target: "sustainability-chat", relation: "member of" },
  { id: "e9", source: "sofia", target: "circular-sprint", relation: "works on" },
  { id: "e10", source: "mihai", target: "tuiasi", relation: "studies at" },
  { id: "e11", source: "mihai", target: "clarity-ai-bip", relation: "joined" },
  { id: "e12", source: "mihai", target: "coding-club", relation: "member of" },
  { id: "e13", source: "mihai", target: "data-viz-module", relation: "taking module" },
  { id: "e14", source: "lara", target: "oviedo", relation: "studies at" },
  { id: "e15", source: "lara", target: "incoming-chat", relation: "moderates" },
  { id: "e16", source: "lara", target: "erasmus-society", relation: "member of" },
  { id: "e17", source: "ada", target: "mtu", relation: "studies at" },
  { id: "e18", source: "ada", target: "student-board", relation: "member of" },
  { id: "e19", source: "ada", target: "sustainability-society", relation: "member of" },
  { id: "e20", source: "erik", target: "skovde", relation: "studies at" },
  { id: "e21", source: "erik", target: "clarity-ai-bip", relation: "joined" },
  { id: "e22", source: "erik", target: "coding-club", relation: "member of" },
  { id: "e23", source: "elena", target: "chieti", relation: "studies at" },
  { id: "e24", source: "elena", target: "wellbeing-bip", relation: "joined" },
  { id: "e25", source: "elena", target: "health-wellbeing-lab", relation: "works on" },
  { id: "e26", source: "nina", target: "poznan", relation: "studies at" },
  { id: "e27", source: "nina", target: "wellbeing-bip", relation: "joined" },
  { id: "e28", source: "nina", target: "incoming-chat", relation: "member of" },
  { id: "e29", source: "ingenium-plus", target: "student-partnerships", relation: "funded through" },
  { id: "e30", source: "ingenium-plus", target: "partnership-chat", relation: "uses chat" },
  { id: "e31", source: "ingenium-plus", target: "europe-campus-map", relation: "prototype layer" },
  { id: "e32", source: "ingenium-plus", target: "demo-day", relation: "reviewed at" },
  { id: "e33", source: "ingenium-plus", target: "digital-campus-unit", relation: "supported by" },
  { id: "e34", source: "europe-campus-map", target: "mobility-call", relation: "surfaces" },
  { id: "e35", source: "europe-campus-map", target: "academic-communication-bip", relation: "maps route" },
  { id: "e36", source: "europe-campus-map", target: "smart-cities-bip", relation: "maps route" },
  { id: "e37", source: "circular-sprint", target: "sustainability-society", relation: "supported by" },
  { id: "e38", source: "circular-sprint", target: "sustainable-innovation-module", relation: "uses module" },
  { id: "e39", source: "health-wellbeing-lab", target: "wellbeing-bip", relation: "connected to" },
  { id: "e40", source: "health-wellbeing-lab", target: "alliance-student-support", relation: "supported by" },
  { id: "e41", source: "academic-communication-bip", target: "rouen", relation: "hosted by" },
  { id: "e42", source: "academic-communication-bip", target: "intercultural-module", relation: "includes module" },
  { id: "e43", source: "academic-communication-bip", target: "incoming-chat", relation: "uses chat" },
  { id: "e44", source: "clarity-ai-bip", target: "skovde", relation: "hosted by" },
  { id: "e45", source: "clarity-ai-bip", target: "data-viz-module", relation: "includes module" },
  { id: "e46", source: "clarity-ai-bip", target: "germany-bip-chat", relation: "uses chat" },
  { id: "e47", source: "clarity-ai-bip", target: "karlsruhe", relation: "partner campus" },
  { id: "e48", source: "wellbeing-bip", target: "crete", relation: "hosted by" },
  { id: "e49", source: "wellbeing-bip", target: "bip-scholarship", relation: "eligible for" },
  { id: "e50", source: "wellbeing-bip", target: "alliance-student-support", relation: "supported by" },
  { id: "e51", source: "smart-cities-bip", target: "karlsruhe", relation: "hosted by" },
  { id: "e52", source: "smart-cities-bip", target: "smart-cities-module", relation: "includes module" },
  { id: "e53", source: "smart-cities-bip", target: "germany-bip-chat", relation: "uses chat" },
  { id: "e54", source: "smart-cities-bip", target: "bip-scholarship", relation: "eligible for" },
  { id: "e55", source: "sustainable-development-bip", target: "xamk", relation: "hosted by" },
  { id: "e56", source: "sustainable-development-bip", target: "sustainability-chat", relation: "uses chat" },
  { id: "e57", source: "sustainable-development-bip", target: "sustainable-innovation-module", relation: "includes module" },
  { id: "e58", source: "project-management-module", target: "mtu", relation: "offered by" },
  { id: "e59", source: "project-management-module", target: "student-partnerships", relation: "supports" },
  { id: "e60", source: "data-viz-module", target: "tuiasi", relation: "partner campus" },
  { id: "e61", source: "data-viz-module", target: "digital-campus-unit", relation: "supported by" },
  { id: "e62", source: "sustainable-innovation-module", target: "entrepreneurship-society", relation: "linked to" },
  { id: "e63", source: "intercultural-module", target: "erasmus-society", relation: "linked to" },
  { id: "e64", source: "smart-cities-module", target: "coding-club", relation: "linked to" },
  { id: "e65", source: "sustainability-society", target: "sustainability-chat", relation: "uses chat" },
  { id: "e66", source: "erasmus-society", target: "incoming-chat", relation: "uses chat" },
  { id: "e67", source: "entrepreneurship-society", target: "student-partnerships", relation: "promotes" },
  { id: "e68", source: "coding-club", target: "germany-bip-chat", relation: "joins" },
  { id: "e69", source: "student-board", target: "ten-days", relation: "organises" },
  { id: "e70", source: "student-board", target: "student-forum", relation: "represents" },
  { id: "e71", source: "mtu-chat", target: "mtu", relation: "based at" },
  { id: "e72", source: "mtu-chat", target: "incoming-chat", relation: "shares students" },
  { id: "e73", source: "partnership-chat", target: "student-partnerships", relation: "coordinates" },
  { id: "e74", source: "partnership-chat", target: "project-management-module", relation: "supports" },
  { id: "e75", source: "ten-days", target: "mobility-call", relation: "leads to" },
  { id: "e76", source: "ten-days", target: "oviedo", relation: "linked campus" },
  { id: "e77", source: "student-forum", target: "poznan", relation: "hosted near" },
  { id: "e78", source: "student-forum", target: "alliance-student-support", relation: "supported by" },
  { id: "e79", source: "mobility-call", target: "bip-scholarship", relation: "connected to" },
  { id: "e80", source: "mobility-call", target: "incoming-chat", relation: "follow up in" },
  { id: "e81", source: "student-partnerships", target: "demo-day", relation: "showcased at" },
  { id: "e82", source: "bip-scholarship", target: "alliance-student-support", relation: "advised by" }
];

const state = {
  selectedId: "ingenium-plus",
  mode: "explore",
  search: "",
  university: "all",
  topic: "all",
  activeTypes: new Set(NODE_TYPES.map((type) => type.key)),
  showList: true,
  nav: "map"
};

const nodeById = new Map(nodes.map((node) => [node.id, node]));
const adjacency = new Map(nodes.map((node) => [node.id, []]));

edges.forEach((edge) => {
  if (!nodeById.has(edge.source) || !nodeById.has(edge.target)) {
    console.warn("Skipped edge with missing node", edge);
    return;
  }
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
    if (event.target.checked) {
      state.activeTypes.add(event.target.value);
    } else {
      state.activeTypes.delete(event.target.value);
    }
    state.nav = "custom";
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
      if (state.mode === "mine") state.selectedId = "you";
      syncControls();
      render();
    });
  });

  document.querySelectorAll(".journey-button").forEach((button) => {
    button.addEventListener("click", () => applyJourney(button.dataset.journey));
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => applyNav(button.dataset.nav));
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
  state.nav = "map";
  syncControls();
  render();
}

function setActiveTypes(types) {
  state.activeTypes = new Set(types);
}

// Journeys are demo presets that show how students might enter the map
// through a personal route, a BIP search, a theme, a chat, or a campus.
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

// Filtering keeps the map, list fallback and detail panel aligned to one data source.
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
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(term);
}

// Graph rendering uses one SVG: a subtle Europe map layer, then edges,
// nodes and collision-aware labels.
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

  els.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  els.svg.replaceChildren();
  els.empty.hidden = visibleNodes.length > 0;

  const mapLayer = svgEl("g", { "aria-hidden": "true" });
  const edgeLayer = svgEl("g", { "aria-hidden": "true" });
  const nodeLayer = svgEl("g");
  const labelLayer = svgEl("g", { "aria-hidden": "true" });
  els.svg.append(mapLayer, edgeLayer, nodeLayer, labelLayer);

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

  const arc = svgEl("path", {
    class: "map-waterline",
    d: `M ${padX} ${height * 0.64} C ${width * 0.28} ${height * 0.52}, ${width * 0.56} ${height * 0.75}, ${width - padX} ${height * 0.58}`
  });
  layer.append(arc);

  const label = svgEl("text", {
    class: "map-label",
    x: pointFromPercent(39, 26, width, height, padX, padY).x,
    y: pointFromPercent(39, 26, width, height, padX, padY).y
  });
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
    button.addEventListener("click", () => selectNode(node.id));
    els.nodeList.append(button);
  });
}

// The detail panel turns graph structure into student-facing actions.
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
      </div>
    </section>
    <section class="detail-card">
      <h2>Connected nodes</h2>
      <div class="connection-list">
        ${connections.map((item) => connectionMarkup(node.id, item)).join("")}
      </div>
    </section>
  `;

  els.detail.querySelector('[data-action="trace"]').addEventListener("click", () => {
    state.mode = "trace";
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
      <strong>${escapeHtml(other.label)}</strong>
      <span>${escapeHtml(typeLabel(other.type))} | ${escapeHtml(relation)}</span>
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
  if (state.mode === "trace") return neighborhood(state.selectedId, 2);
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

init();
