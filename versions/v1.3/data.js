(function () {
  "use strict";

  const verified = "2026-08-05";

  const sources = {
    partners: {
      title: "INGENIUM partner universities",
      url: "https://ingenium-university.eu/about-us/partners/",
      kind: "Official INGENIUM webpage"
    },
    bips: {
      title: "INGENIUM Blended Intensive Programmes 2026/2027",
      url: "https://ingenium-university.eu/students/ingenium-european-campus/short-term-mobility-opportunities/bips-2026-2027/",
      kind: "Official INGENIUM call"
    },
    partnerships: {
      title: "The INGENIUM Student Partnerships 2026 Call selects six innovative student-led projects",
      url: "https://ingenium-university.eu/the-ingenium-student-partnerships-2026-call-selects-six-innovative-student-led-projects-across-the-alliance/",
      kind: "Official INGENIUM news"
    },
    summer2026: {
      title: "10 Days of INGENIUM Summer 2026",
      url: "https://ingenium-university.eu/10-days-of-ingenium-summer-2026/",
      kind: "Official INGENIUM event page"
    },
    winter2026: {
      title: "10 Days of INGENIUM Winter 2026",
      url: "https://ingenium-university.eu/10-days-of-ingenium-winter-2026/",
      kind: "Official INGENIUM event page"
    },
    studentBoard: {
      title: "Students at the Centre: INGENIUM Student Board",
      url: "https://ingenium-university.eu/students-at-the-centre/",
      kind: "Official INGENIUM feature"
    },
    founders: {
      title: "INGENIUM Founders HUB",
      url: "https://ingenium-university.eu/ingenium-student-partnerships/ingenium-founders-hub/",
      kind: "Official INGENIUM project page"
    },
    europeanCampus: {
      title: "INGENIUM European Campus",
      url: "https://ingenium-university.eu/students/ingenium-european-campus/",
      kind: "Official INGENIUM webpage"
    },
    shortMobility: {
      title: "Short-term Mobility Opportunities",
      url: "https://ingenium-university.eu/students/ingenium-european-campus/short-term-mobility-opportunities/",
      kind: "Official INGENIUM webpage"
    },
    longMobility: {
      title: "Long-term Mobility Opportunities",
      url: "https://ingenium-university.eu/students/ingenium-european-campus/student-mobility/",
      kind: "Official INGENIUM webpage"
    },
    digitalPlatforms: {
      title: "Digital Student Platforms",
      url: "https://ingenium-university.eu/students/digital-ingenium/digital-student-platforms/",
      kind: "Official INGENIUM webpage"
    },
    registry: {
      title: "Virtual Student Registry",
      url: "https://ingenium-university.eu/students/digital-ingenium/virtual-student-registry/",
      kind: "Official INGENIUM webpage"
    },
    jointMaster: {
      title: "Joint Master’s Programme in Chemical and Biochemical Process Technology",
      url: "https://ingenium-university.eu/students/ingenium-european-campus/study-programmes/joint-masters-programme-in-chemical-and-biochemical-process-technology/",
      kind: "Official programme page"
    },
    style: {
      title: "INGENIUM Visual Identity Styleguide 2024",
      url: "https://ingenium-university.eu/wp-content/uploads/2025/08/INGENIUM-Styleguide-2024-weboptimized.pdf",
      kind: "Official brand guide"
    },
    progress: {
      title: "INGENIUM Alliance Progress Report 2",
      url: "https://ingenium-university.eu/wp-content/uploads/2025/03/D1.3-INGENIUM-alliance-Progress-Report-2.pdf",
      kind: "Official deliverable"
    }
  };

  const universities = [
    { id: "university-uniodv", short: "UNIOVI", name: "University of Oviedo", city: "Oviedo", country: "Spain", lat: 43.36, lon: -5.85, url: "https://www.uniovi.es/en/", description: "INGENIUM partner university in Asturias, Spain." },
    { id: "university-mus", short: "MUS", name: "Medical University Sofia", city: "Sofia", country: "Bulgaria", lat: 42.68, lon: 23.32, url: "https://mu-sofia.bg/en/", description: "INGENIUM partner university specialising in health and medical education." },
    { id: "university-uoc", short: "UoC", name: "University of Crete", city: "Heraklion", country: "Greece", lat: 35.31, lon: 25.08, url: "https://www.uoc.gr/en/", description: "INGENIUM partner university on Crete, Greece." },
    { id: "university-hka", short: "HKA", name: "Karlsruhe University of Applied Sciences", city: "Karlsruhe", country: "Germany", lat: 49.01, lon: 8.4, url: "https://www.h-ka.de/en/", description: "INGENIUM partner university of applied sciences in Karlsruhe." },
    { id: "university-xamk", short: "Xamk", name: "South-Eastern Finland University of Applied Sciences", city: "Mikkeli", country: "Finland", lat: 61.69, lon: 27.27, url: "https://www.xamk.fi/en/", description: "INGENIUM partner university with campuses in south-eastern Finland." },
    { id: "university-uda", short: "Ud’A", name: "University G. d’Annunzio of Chieti–Pescara", city: "Chieti–Pescara", country: "Italy", lat: 42.35, lon: 14.17, url: "https://en.unich.it/", description: "INGENIUM partner university in the Abruzzo region of Italy." },
    { id: "university-his", short: "HIS", name: "University of Skövde", city: "Skövde", country: "Sweden", lat: 58.39, lon: 13.85, url: "https://www.his.se/en/", description: "INGENIUM partner university in Skövde, Sweden." },
    { id: "university-mtu", short: "MTU", name: "Munster Technological University", city: "Cork", country: "Ireland", lat: 51.89, lon: -8.49, url: "https://www.mtu.ie/", description: "INGENIUM partner technological university in south-west Ireland." },
    { id: "university-urn", short: "URN", name: "University of Rouen Normandy", city: "Rouen", country: "France", lat: 49.44, lon: 1.1, url: "https://www.univ-rouen.fr/", description: "INGENIUM partner university in Normandy, France." },
    { id: "university-tuiasi", short: "TUIASI", name: "Gheorghe Asachi Technical University of Iași", city: "Iași", country: "Romania", lat: 47.16, lon: 27.59, url: "https://www.tuiasi.ro/?lang=en", description: "INGENIUM partner technical university in Iași, Romania." }
  ].map((item) => ({
    ...item,
    type: "university",
    themes: ["European campus"],
    universityIds: [item.id],
    status: "current",
    source: sources.partners,
    lastVerifiedAt: verified
  }));

  const allUniversities = universities.map((university) => university.id);

  function bip(id, name, hostId, city, startDate, dateLabel, ects, bipType, themes, extra) {
    return {
      id: `bip-${id}`,
      type: "bip",
      name,
      hostId,
      universityIds: [hostId],
      eligibleUniversityIds: allUniversities,
      city,
      startDate,
      dateLabel,
      datePrecision: "month",
      status: "upcoming",
      ects,
      bipType,
      delivery: "Blended: virtual learning plus physical mobility",
      funding: "Erasmus+ support is available; arrangements and deadlines are managed by each home university.",
      application: "Apply through your home university’s INGENIUM or international office.",
      description: "A verified INGENIUM Blended Intensive Programme combining online collaboration with a short physical mobility period.",
      themes,
      source: sources.bips,
      lastVerifiedAt: verified,
      ...(extra || {})
    };
  }

  const bips = [
    bip("academic-communication", "Academic Communication", "university-hka", "Karlsruhe, Germany", "2026-11-01", "November–December 2026", 5, "Transversal", ["Communication", "Intercultural learning"], { capacity: "15–20 students" }),
    bip("engage-enjoy", "Engage & Enjoy: an Inclusive and Multicultural INGENIUM Experience", "university-uniodv", "Oviedo, Spain", "2027-04-01", "April 2027", 3, "Transversal", ["Inclusion", "Intercultural learning"], { capacity: "1–5 participants per partner university" }),
    bip("clarity-ai", "CLARITY-AI: Critical Learning in the Technology Age of AI", "university-tuiasi", "Iași, Romania", "2026-09-01", "September 2026", 3, "Transversal", ["Artificial intelligence", "Critical thinking", "Digital learning"], { capacity: "15–25 students" }),
    bip("ethical-ai-health", "Exploring Ethical, Effective and Efficient Uses of AI to Support Health and Social Sciences Researchers", "university-mtu", "Cork, Ireland", "2026-10-01", "October 2026", 3, "Transversal", ["Artificial intelligence", "Health", "Research"], { capacity: "15–25 students" }),
    bip("international-project-challenge", "International Project Challenge", "university-xamk", "Mikkeli, Finland", "2027-04-01", "April 2027", 5, "Cross-disciplinary", ["Collaboration", "Innovation", "Project work"], { capacity: "15–25 students" }),
    bip("medchem", "MedChem BIP: Exploring Medicinal Chemistry", "university-uda", "Pescara, Italy", "2027-06-01", "June 2027", 3, "Discipline-specific", ["Chemistry", "Health", "Laboratory learning"]),
    bip("digital-health", "Multidisciplinary Approaches to Digital Competence and Innovation in Health and Social Care", "university-his", "Skövde, Sweden", "2026-11-01", "November 2026", 3, "Cross-disciplinary", ["Digital skills", "Health", "Innovation"], { capacity: "30 students" }),
    bip("nature-wellbeing", "Nature-Based Wellbeing Experience", "university-xamk", "Savonlinna, Finland", "2027-05-01", "May 2027", 3, "Transversal", ["Wellbeing", "Nature", "Sustainability"], { capacity: "15–30 students" }),
    bip("accounting-skills", "Non-technical Skills for Accountants", "university-mtu", "Cork, Ireland", "2026-11-01", "November 2026", 5, "Discipline-specific", ["Business", "Communication", "Professional skills"], { capacity: "15–25 students" }),
    bip("community-youth", "School Community Development and Youth Work Approaches", "university-xamk", "Mikkeli, Finland", "2027-05-01", "May 2027", 3, "Transversal — conditions apply", ["Community", "Youth work", "Inclusion"], { capacity: "15–25 students" }),
    bip("seismicx", "SeismicX: Engineering Structures for the Real World", "university-tuiasi", "Iași, Romania", "2026-11-01", "November 2026", 3, "Discipline-specific — conditions apply", ["Engineering", "Infrastructure", "Built environment"], { capacity: "15–25 students" }),
    bip("sustainable-cosmetics", "Sustainable Cosmetics & Entrepreneurship", "university-tuiasi", "Iași, Romania", "2026-09-01", "September 2026", 3, "Discipline-specific", ["Sustainability", "Entrepreneurship", "Chemistry"], { capacity: "15–25 students" }),
    bip("corporate-responsibility", "Sustainable Development and Corporate Responsibility", "university-uoc", "Heraklion, Greece", "2026-11-01", "November–December 2026", 3, "Cross-disciplinary", ["Sustainability", "Business", "Responsibility"], { capacity: "15–25 students" })
  ];

  function project(id, name, universityIds, funding, description, themes, extra) {
    return {
      id: `project-${id}`,
      type: "project",
      name,
      universityIds,
      status: "current",
      dateLabel: "Implementation through 15 December 2026",
      funding,
      description,
      themes,
      source: sources.partnerships,
      lastVerifiedAt: verified,
      ...(extra || {})
    };
  }

  const projects = [
    project("futureproof", "FutureProof Escape", ["university-tuiasi", "university-uniodv", "university-his", "university-uda", "university-uoc", "university-xamk", "university-mus", "university-hka", "university-mtu"], "€10,000 awarded", "An interactive escape-room experience using teamwork and gamification to explore sustainability challenges on university campuses.", ["Sustainability", "Gamification", "Collaboration"]),
    project("ecocommute", "EcoCommute", ["university-uniodv", "university-urn", "university-tuiasi"], "€7,800 awarded", "A student initiative exploring more sustainable and accessible transport choices for internships and international exchanges.", ["Sustainability", "Mobility", "Accessibility"]),
    project("leadership-lab", "Student Leadership & Entrepreneurship Lab", ["university-mus", "university-uda", "university-xamk"], "€10,000 awarded", "International practical learning designed to strengthen leadership, entrepreneurship and work-ready skills.", ["Entrepreneurship", "Leadership", "Professional skills"]),
    project("immunobattle", "ImmunoBattle — The Warriors Within You", ["university-uniodv", "university-his", "university-uda"], "€10,000 awarded", "An interdisciplinary health-education project making the immune system and public-health topics engaging and accessible.", ["Health", "Science communication", "Gamification"]),
    project("ingenium-platform", "INGENIUM Platform", ["university-uniodv", "university-tuiasi", "university-his"], "€7,550 awarded", "An intensive Oviedo programme for ESN volunteers combining workshops, intercultural learning, field visits and organisational skills.", ["Intercultural learning", "Mobility", "Student organisations"]),
    project("infrastructurelink", "InfrastructureLink", ["university-tuiasi", "university-mtu", "university-hka", "university-uda", "university-his"], "€8,200 awarded", "A transnational exchange connecting students around infrastructure, engineering and innovative responses to shared challenges.", ["Engineering", "Infrastructure", "Collaboration"]),
    project("ingenium-plus", "INGENIUM+", ["university-mtu", "university-tuiasi", "university-xamk"], "Supported to identify alternative funding", "A student-led graph-based platform that makes programmes, projects, communities and collaboration routes across INGENIUM easier to discover.", ["Digital learning", "Student connection", "Data visualisation"], { featured: true, url: "about.html" }),
    project("resqdrone", "ResQDrone", ["university-hka", "university-his", "university-uniodv"], "Supported to identify alternative funding", "A proposal using AI-powered drones to support local rescue authorities, alongside hands-on AI, robotics and engineering workshops.", ["Artificial intelligence", "Robotics", "Public safety"])
  ];

  const events = [
    {
      id: "event-winter-iasi", type: "event", name: "Senior Winter School 2026 — Science Meets Industry", hostId: "university-tuiasi", universityIds: ["university-tuiasi"], city: "Iași, Romania", startDate: "2026-01-26", endDate: "2026-01-30", dateLabel: "26–30 January 2026", status: "past", themes: ["Research", "Industry", "Innovation"], description: "Part of 10 Days of INGENIUM Winter 2026, bringing advanced students and researchers together around science–industry connections.", source: sources.winter2026, lastVerifiedAt: verified
    },
    {
      id: "event-winter-skovde", type: "event", name: "Junior Winter School 2026 — Sustainability in Action", hostId: "university-his", universityIds: ["university-his"], city: "Skövde, Sweden", startDate: "2026-02-02", endDate: "2026-02-06", dateLabel: "2–6 February 2026", status: "past", themes: ["Sustainability", "Collaboration", "Student learning"], description: "A Junior Winter School focused on practical sustainability, interdisciplinary learning and student collaboration.", source: sources.winter2026, lastVerifiedAt: verified
    },
    {
      id: "event-summer-cork", type: "event", name: "Senior Summer School 2026 — Enabling Research for Impact", hostId: "university-mtu", universityIds: ["university-mtu"], city: "Cork, Ireland", startDate: "2026-05-25", endDate: "2026-05-29", dateLabel: "25–29 May 2026", status: "past", themes: ["Research", "Sustainability", "Entrepreneurship"], description: "Five days of interdisciplinary workshops and collaboration on sustainable innovation, entrepreneurship and research impact.", source: sources.summer2026, lastVerifiedAt: verified
    },
    {
      id: "event-summer-sofia", type: "event", name: "Junior Summer School 2026 — Health Promotion in the New Era", hostId: "university-mus", universityIds: ["university-mus"], city: "Sofia, Bulgaria", startDate: "2026-06-01", endDate: "2026-06-05", dateLabel: "1–5 June 2026", status: "past", themes: ["Health", "Artificial intelligence", "Emergency medicine"], description: "A Junior Summer School built around two BIPs: AI and Labour Market Transformation, and Emergency Medicine in a Changing World.", source: sources.summer2026, lastVerifiedAt: verified
    }
  ];

  const communities = [
    {
      id: "community-student-board", type: "community", name: "INGENIUM Student Board", universityIds: allUniversities, status: "current", access: "Contact your local INGENIUM coordinator", platform: "Official alliance governance and student network", themes: ["Student voice", "Governance", "Intercultural learning"], description: "The official student voice within INGENIUM, with representation and voting rights in alliance governance. Participation begins through a local INGENIUM coordinator.", source: sources.studentBoard, lastVerifiedAt: verified
    },
    {
      id: "community-founders-hub", type: "community", name: "INGENIUM Founders HUB", universityIds: allUniversities, status: "current", access: "Use the official project page", platform: "Student-led entrepreneurship network", themes: ["Entrepreneurship", "Mentoring", "Collaboration"], description: "A student-led entrepreneurship network designed to help students find co-founders, mentors and opportunities across INGENIUM.", source: sources.founders, lastVerifiedAt: verified
    }
  ];

  const opportunities = [
    {
      id: "opportunity-european-campus", type: "opportunity", subtype: "Service", name: "INGENIUM European Campus", universityIds: allUniversities, status: "current", themes: ["European campus", "Study", "Mobility"], description: "The alliance-wide route into teaching, research, mobility and collaboration opportunities offered across the ten partner institutions.", source: sources.europeanCampus, lastVerifiedAt: verified
    },
    {
      id: "opportunity-short-mobility", type: "opportunity", subtype: "Mobility", name: "Short-term Mobility Opportunities", universityIds: allUniversities, status: "current", themes: ["Mobility", "Junior School", "Senior School"], description: "Short international learning routes including Junior and Senior Schools and other intensive alliance activities.", source: sources.shortMobility, lastVerifiedAt: verified
    },
    {
      id: "opportunity-long-mobility", type: "opportunity", subtype: "Mobility", name: "Long-term Mobility Opportunities", universityIds: allUniversities, status: "current", themes: ["Mobility", "Study abroad", "European campus"], description: "Semester-scale mobility and flexible alternatives coordinated through each student’s local international office.", source: sources.longMobility, lastVerifiedAt: verified
    },
    {
      id: "opportunity-digital-platforms", type: "opportunity", subtype: "Digital service", name: "Digital Student Platforms", universityIds: allUniversities, status: "current", themes: ["Applications", "Digital learning", "Student services"], description: "Official routes for selected student submissions and applications, including alliance schools, hackathons and other calls.", source: sources.digitalPlatforms, lastVerifiedAt: verified
    },
    {
      id: "opportunity-registry", type: "opportunity", subtype: "Digital service", name: "Virtual Student Registry", universityIds: allUniversities, status: "current", themes: ["Student services", "Courses", "Digital learning"], description: "The developing alliance student-information environment for curriculum, course registration, examinations and student records.", source: sources.registry, lastVerifiedAt: verified
    },
    {
      id: "opportunity-joint-master", type: "opportunity", subtype: "Study programme", name: "Joint Master’s in Chemical and Biochemical Process Technology", universityIds: ["university-tuiasi", "university-uniodv", "university-urn"], hostId: "university-tuiasi", status: "upcoming", startDate: "2026-09-01", dateLabel: "Applications: 6 July–6 September 2026", applicationDeadline: "2026-09-06", ects: 120, themes: ["Chemical engineering", "Biotechnology", "Sustainability"], description: "A two-year, 120 ECTS English-language joint programme with a structured study journey across Romania, Spain and France.", funding: "At least ten scholarships of up to €20,000 are announced for the first cohort, subject to official conditions.", source: sources.jointMaster, lastVerifiedAt: verified
    }
  ];

  const nodes = [...universities, ...bips, ...projects, ...events, ...communities, ...opportunities];

  const journeys = [
    { id: "bip-finder", name: "Find a BIP", icon: "✦", description: "Move from the European campus to real 2026/27 BIPs and their host universities.", types: ["university", "bip"], nodeIds: ["opportunity-european-campus", ...bips.map((item) => item.id)] },
    { id: "sustainability", name: "Sustainability across INGENIUM", icon: "↗", description: "Trace sustainable mobility, learning, wellbeing and student-led projects.", themes: ["Sustainability"], nodeIds: ["project-futureproof", "project-ecocommute", "bip-sustainable-cosmetics", "bip-corporate-responsibility", "bip-nature-wellbeing", "event-winter-skovde"] },
    { id: "communities", name: "Communities and group routes", icon: "◎", description: "Find verified student networks without publishing private chats or personal data.", nodeIds: ["community-student-board", "community-founders-hub", "project-ingenium-platform", "project-ingenium-plus"] },
    { id: "mtu", name: "Explore MTU’s network", icon: "⌁", description: "Follow Cork’s links to BIPs, projects, research and the wider alliance.", universityId: "university-mtu", nodeIds: ["university-mtu", "bip-ethical-ai-health", "bip-accounting-skills", "project-infrastructurelink", "project-ingenium-plus", "event-summer-cork"] },
    { id: "my-journey", name: "My INGENIUM journey", icon: "◇", description: "Build a private route from your home university and interests. It stays on this device.", configurable: true, nodeIds: [] },
    { id: "ten-days", name: "The 10 Days journey", icon: "◷", description: "Explore the two-host winter and summer editions of 2026.", nodeIds: events.map((item) => item.id) }
  ];

  window.INGENIUM_DATA = {
    version: "1.4",
    researchDate: verified,
    sources,
    universities,
    bips,
    projects,
    events,
    communities,
    opportunities,
    nodes,
    journeys
  };
})();
