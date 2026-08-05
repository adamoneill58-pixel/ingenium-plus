export type EntityType =
  | "university"
  | "bip"
  | "programme"
  | "pathway"
  | "project"
  | "event"
  | "community"
  | "platform"
  | "opportunity"
  | "initiative"
  | "framework";

export type EntityStatus =
  | "Open"
  | "Upcoming"
  | "Ongoing"
  | "Completed"
  | "Recurring"
  | "Planned"
  | "Under development"
  | "Archived"
  | "Access unverified"
  | "Verification required";

export type Confidence = "High" | "Medium" | "Low";

export interface Source {
  id: string;
  title: string;
  kind: string;
  url?: string;
  published?: string;
}

export interface Entity {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  type: EntityType;
  subtype?: string;
  studentSummary: string;
  fullDescription?: string;
  status: EntityStatus;
  availability?: string;
  universityIds: string[];
  hostUniversityId?: string;
  countries?: string[];
  city?: string;
  themes: string[];
  academicLevel?: string;
  deliveryMode?: string;
  mobilityType?: string;
  startDate?: string;
  endDate?: string;
  dateLabel?: string;
  applicationDeadline?: string;
  ects?: number;
  eqfLevel?: string;
  workload?: string;
  eligibility?: string;
  language?: string;
  capacity?: string;
  funding?: string;
  actionLabel?: string;
  officialUrl?: string;
  sourceId: string;
  lastVerified: string;
  confidence: Confidence;
  workPackage?: string;
  featured?: boolean;
  aliases?: string[];
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: string;
  label: string;
  explanation: string;
}

export interface Journey {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  nodeIds: string[];
  accent: "teal" | "cyan" | "lime" | "magenta";
}

export const RESEARCH_DATE = "2026-08-05";

export const sources: Source[] = [
  {
    id: "partners",
    title: "INGENIUM partner universities",
    kind: "Official INGENIUM webpage",
    url: "https://ingenium-university.eu/about-us/partners/",
  },
  {
    id: "bips-2627",
    title: "INGENIUM Blended Intensive Programmes 2026/2027",
    kind: "Official INGENIUM call",
    url: "https://ingenium-university.eu/students/ingenium-european-campus/short-term-mobility-opportunities/bips-2026-2027/",
    published: "2026",
  },
  {
    id: "student-partnerships-2026",
    title: "The INGENIUM Student Partnerships 2026 Call selects six innovative student-led projects",
    kind: "Official INGENIUM news",
    url: "https://ingenium-university.eu/the-ingenium-student-partnerships-2026-call-selects-six-innovative-student-led-projects-across-the-alliance/",
    published: "2026",
  },
  {
    id: "joint-programmes",
    title: "D4.1 Joint Programmes Report",
    kind: "Official INGENIUM deliverable",
    published: "October 2025",
  },
  {
    id: "joint-master-cbpt",
    title: "Joint Master’s Programme in Chemical and Biochemical Process Technology",
    kind: "Official programme page",
    url: "https://ingenium-university.eu/students/ingenium-european-campus/study-programmes/joint-masters-programme-in-chemical-and-biochemical-process-technology/",
  },
  {
    id: "microcredentials",
    title: "D5.7 INGENIUM Microcredentials and Materials",
    kind: "Official INGENIUM deliverable",
    published: "December 2024",
  },
  {
    id: "innovation-strategy",
    title: "D5.1 Report on INGENIUM Innovation Strategy",
    kind: "Official INGENIUM deliverable",
    published: "April 2024",
  },
  {
    id: "platforms",
    title: "D3.3 INGENIUM Platforms",
    kind: "Official INGENIUM deliverable",
    published: "December 2025 revision",
  },
  {
    id: "digital-platforms",
    title: "Digital Student Platforms",
    kind: "Official INGENIUM webpage",
    url: "https://ingenium-university.eu/students/digital-ingenium/digital-student-platforms/",
  },
  {
    id: "virtual-registry",
    title: "Virtual Student Registry",
    kind: "Official INGENIUM webpage",
    url: "https://ingenium-university.eu/students/digital-ingenium/virtual-student-registry/",
  },
  {
    id: "entrepreneurship-training",
    title: "D8.2 Final Report on INGENIUM entrepreneurship training",
    kind: "Official INGENIUM deliverable",
    published: "October 2025",
  },
  {
    id: "accelerator",
    title: "D8.4 Final Report on Transnational Incubation and Acceleration Programme",
    kind: "Official INGENIUM deliverable",
    published: "November 2025",
  },
  {
    id: "founders-hub",
    title: "INGENIUM Founders HUB",
    kind: "Official INGENIUM project page",
    url: "https://ingenium-university.eu/ingenium-student-partnerships2/ingenium-student-partnerships-2025-call/ingenium-founders-hub/",
  },
  {
    id: "bmc-live",
    title: "Business Model Canvas digital learning resource",
    kind: "Official INGENIUM Education Platform course",
    url: "https://elearn.ingenium-university.eu/course/view.php?id=28",
  },
  {
    id: "sustainability-hub",
    title: "INGENIUM Student Sustainability Hub",
    kind: "Official INGENIUM initiative page",
    url: "https://ingenium-university.eu/initiatives/student-sustainability-hub/",
  },
  {
    id: "human-centred-ai-doctorate",
    title: "Joint Doctoral Programme in Human-Centred Artificial Intelligence",
    kind: "Official INGENIUM programme and call page",
    url: "https://ingenium-university.eu/research/joint-doctorate-programmes/joint-doctoral-programme-in-human-centred-artificial-intelligence-foundations-and-applications/",
  },
  {
    id: "phd-mobility-2026",
    title: "INGENIUM PhD Mobility and Co-Supervision Scholarships",
    kind: "Official INGENIUM call",
    url: "https://ingenium-university.eu/call-for-ingenium-phd-mobility-and-co-supervision-scholarships-is-now-open/",
  },
  {
    id: "pathway-framework-live",
    title: "INGENIUM Pathway Framework",
    kind: "Official INGENIUM framework page",
    url: "https://ingenium-university.eu/iec-faculty/ingenium-pathway-framework/",
  },
  {
    id: "next-phase-funding",
    title: "INGENIUM secures two more years of Erasmus+ funding for its next phase",
    kind: "Official INGENIUM news",
    url: "https://ingenium-university.eu/ingenium-secures-two-more-years-of-erasmus-funding-for-its-next-phase/",
    published: "2026",
  },
  {
    id: "digital-ingenium",
    title: "Digital INGENIUM",
    kind: "Official INGENIUM student service page",
    url: "https://ingenium-university.eu/students/digital-ingenium/",
  },
  {
    id: "sdg-hackathon",
    title: "D7.4 The INGENIUM SDG Hackathon",
    kind: "Official INGENIUM deliverable",
    published: "July 2024",
  },
  {
    id: "student-board",
    title: "Students at the Centre: INGENIUM Student Board",
    kind: "Official INGENIUM feature",
    url: "https://ingenium-university.eu/students-at-the-centre/",
  },
  {
    id: "european-campus",
    title: "INGENIUM European Campus",
    kind: "Official INGENIUM webpage",
    url: "https://ingenium-university.eu/students/ingenium-european-campus/",
  },
  {
    id: "short-mobility",
    title: "Short-term Mobility Opportunities",
    kind: "Official INGENIUM webpage",
    url: "https://ingenium-university.eu/students/ingenium-european-campus/short-term-mobility-opportunities/",
  },
  {
    id: "long-mobility",
    title: "Long-term Mobility Opportunities",
    kind: "Official INGENIUM webpage",
    url: "https://ingenium-university.eu/students/ingenium-european-campus/student-mobility/",
  },
  {
    id: "winter-2026",
    title: "10 Days of INGENIUM Winter 2026",
    kind: "Official INGENIUM event page",
    url: "https://ingenium-university.eu/10-days-of-ingenium-winter-2026/",
  },
  {
    id: "summer-2026",
    title: "10 Days of INGENIUM Summer 2026",
    kind: "Official INGENIUM event page",
    url: "https://ingenium-university.eu/10-days-of-ingenium-summer-2026/",
  },
  {
    id: "progress-report",
    title: "D1.3 INGENIUM Alliance Progress Report 2",
    kind: "Official INGENIUM deliverable",
    url: "https://ingenium-university.eu/wp-content/uploads/2025/03/D1.3-INGENIUM-alliance-Progress-Report-2.pdf",
    published: "January 2025",
  },
  {
    id: "long-term-strategy",
    title: "D10.1 INGENIUM Long-term Strategy",
    kind: "Official INGENIUM deliverable",
    published: "November 2025",
  },
];

const universitySeed = [
  ["uniovi", "UNIOVI", "University of Oviedo", "Oviedo", "Spain", "https://www.uniovi.es/en/", "A comprehensive university in Asturias with strengths spanning engineering, health, sciences and the humanities."],
  ["mus", "MUS", "Medical University Sofia", "Sofia", "Bulgaria", "https://mu-sofia.bg/en/", "A specialist medical university connecting INGENIUM students to health, nursing and biomedical learning."],
  ["uoc", "UoC", "University of Crete", "Heraklion and Rethymno", "Greece", "https://www.uoc.gr/en/", "A comprehensive research university with strengths including computer science, ecology and medicine."],
  ["hka", "HKA", "Karlsruhe University of Applied Sciences", "Karlsruhe", "Germany", "https://www.h-ka.de/en/", "An applied-sciences university closely connected to engineering, technology and regional industry."],
  ["xamk", "Xamk", "South-Eastern Finland University of Applied Sciences", "South-eastern Finland", "Finland", "https://www.xamk.fi/en/", "A multi-campus university of applied sciences focused on practical learning, innovation and regional impact."],
  ["uda", "Ud’A", "University G. d’Annunzio of Chieti–Pescara", "Chieti–Pescara", "Italy", "https://en.unich.it/", "A comprehensive university connecting disciplines from science and medicine to society and culture."],
  ["hs", "HS", "University of Skövde", "Skövde", "Sweden", "https://www.his.se/en/", "A professionally oriented university known for applied research, informatics, health and game development."],
  ["mtu", "MTU", "Munster Technological University", "Cork and Kerry", "Ireland", "https://www.mtu.ie/", "A multi-campus technological university grounded in applied learning, industry and entrepreneurship."],
  ["urn", "URN", "University of Rouen Normandy", "Rouen", "France", "https://www.univ-rouen.fr/", "A large comprehensive university connecting INGENIUM to Normandy’s academic and regional ecosystem."],
  ["tuiasi", "TUIASI", "Gheorghe Asachi Technical University of Iași", "Iași", "Romania", "https://www.tuiasi.ro/?lang=en", "A technical university with deep expertise in engineering, technology and workforce-focused education."],
] as const;

const universities: Entity[] = universitySeed.map(([id, shortTitle, title, city, country, officialUrl, studentSummary]) => ({
  id: `university-${id}`,
  slug: id,
  title,
  shortTitle,
  type: "university",
  subtype: "Partner university",
  studentSummary,
  status: "Ongoing",
  universityIds: [`university-${id}`],
  countries: [country],
  city,
  themes: ["European campus", "Mobility", "Collaboration"],
  officialUrl,
  actionLabel: "Visit university",
  sourceId: "partners",
  lastVerified: RESEARCH_DATE,
  confidence: "High",
  featured: true,
  aliases: id === "hs" ? ["HIS"] : undefined,
}));

const allUniversityIds = universities.map((university) => university.id);

function bip(
  slug: string,
  title: string,
  hostUniversityId: string,
  dateLabel: string,
  ects: number,
  themes: string[],
  capacity?: string,
  subtype = "Blended Intensive Programme",
): Entity {
  return {
    id: `bip-${slug}`,
    slug,
    title,
    type: "bip",
    subtype,
    studentSummary: "A verified INGENIUM programme combining virtual collaboration with a short period of physical mobility.",
    fullDescription: "Applications and local deadlines are managed through each student’s home university. Check the official catalogue and your local INGENIUM or international office before applying.",
    status: "Upcoming",
    availability: "Applications managed by the home university",
    universityIds: [hostUniversityId],
    hostUniversityId,
    themes,
    academicLevel: "Higher education students",
    deliveryMode: "Blended",
    mobilityType: "Short-term physical mobility plus virtual learning",
    dateLabel,
    ects,
    eligibility: "Students at INGENIUM partner universities; programme-specific conditions may apply",
    language: "English",
    capacity,
    actionLabel: "View official catalogue",
    officialUrl: sources.find((source) => source.id === "bips-2627")?.url,
    sourceId: "bips-2627",
    lastVerified: RESEARCH_DATE,
    confidence: "High",
  };
}

const bips: Entity[] = [
  bip("academic-communication", "Academic Communication", "university-hka", "November–December 2026", 5, ["Communication", "Intercultural learning"], "15–20 students"),
  bip("engage-enjoy", "Engage & Enjoy: an Inclusive and Multicultural INGENIUM Experience", "university-uniovi", "April 2027", 3, ["Inclusion", "Intercultural learning"], "1–5 participants per partner"),
  bip("clarity-ai", "CLARITY-AI: Critical Learning in the Technology Age of AI", "university-tuiasi", "September 2026", 3, ["Artificial intelligence", "Critical thinking", "Digital learning"], "15–25 students"),
  bip("ethical-ai-health", "Ethical, Effective and Efficient Uses of AI for Health and Social Sciences Research", "university-mtu", "October 2026", 3, ["Artificial intelligence", "Health", "Research"], "15–25 students"),
  bip("international-project-challenge", "International Project Challenge", "university-xamk", "April 2027", 5, ["Collaboration", "Innovation", "Project work"], "15–25 students"),
  bip("medchem", "MedChem BIP: Exploring Medicinal Chemistry", "university-uda", "June 2027", 3, ["Chemistry", "Health", "Laboratory learning"]),
  bip("digital-health", "Multidisciplinary Approaches to Digital Competence and Innovation in Health and Social Care", "university-hs", "November 2026", 3, ["Digital skills", "Health", "Innovation"], "30 students"),
  bip("nature-wellbeing", "Nature-Based Wellbeing Experience", "university-xamk", "May 2027", 3, ["Wellbeing", "Nature", "Sustainability"], "15–30 students"),
  bip("accounting-skills", "Non-technical Skills for Accountants", "university-mtu", "November 2026", 5, ["Business", "Communication", "Professional skills"], "15–25 students"),
  bip("community-youth", "School Community Development and Youth Work Approaches", "university-xamk", "May 2027", 3, ["Community", "Youth work", "Inclusion"], "15–25 students", "BIP — conditions apply"),
  bip("seismicx", "SeismicX: Engineering Structures for the Real World", "university-tuiasi", "November 2026", 3, ["Engineering", "Infrastructure", "Built environment"], "15–25 students", "BIP — conditions apply"),
  bip("sustainable-cosmetics", "Sustainable Cosmetics & Entrepreneurship", "university-tuiasi", "September 2026", 3, ["Sustainability", "Entrepreneurship", "Chemistry"], "15–25 students"),
  bip("corporate-responsibility", "Sustainable Development and Corporate Responsibility", "university-uoc", "November–December 2026", 3, ["Sustainability", "Business", "Responsibility"], "15–25 students"),
];

function programme(partial: Omit<Entity, "type" | "sourceId" | "lastVerified" | "confidence"> & { sourceId?: string; confidence?: Confidence }): Entity {
  return {
    ...partial,
    type: "programme",
    sourceId: partial.sourceId ?? "joint-programmes",
    lastVerified: RESEARCH_DATE,
    confidence: partial.confidence ?? "Medium",
  };
}

const programmes: Entity[] = [
  programme({
    id: "programme-cbpt",
    slug: "chemical-biochemical-process-technology",
    title: "Joint Master’s in Chemical and Biochemical Process Technology",
    shortTitle: "CBPT",
    subtype: "Joint Master’s programme",
    studentSummary: "A two-year English-language programme with a structured study journey across Romania, Spain and France.",
    fullDescription: "Semester one is planned at TUIASI, semester two at the University of Oviedo, semester three at the University of Rouen Normandy and semester four as a dissertation at one of the partners.",
    status: "Open",
    availability: "Applications open to eligible EU applicants until 6 September 2026; first cohort begins 1 October 2026",
    universityIds: ["university-tuiasi", "university-uniovi", "university-urn"],
    hostUniversityId: "university-tuiasi",
    countries: ["Romania", "Spain", "France"],
    themes: ["Chemical engineering", "Biotechnology", "Sustainability"],
    academicLevel: "Master’s",
    deliveryMode: "In person across three universities",
    mobilityType: "Integrated international mobility",
    dateLabel: "Applications recorded for 6 July–6 September 2026",
    applicationDeadline: "2026-09-06",
    startDate: "2026-10-01",
    ects: 120,
    eligibility: "EU applicants for the 2026/27 intake; consult the official programme page for full admission conditions",
    language: "English",
    funding: "At least ten scholarships of up to €20,000 were announced for the first cohort, subject to official conditions.",
    actionLabel: "Check official programme",
    officialUrl: sources.find((source) => source.id === "joint-master-cbpt")?.url,
    sourceId: "joint-master-cbpt",
    confidence: "High",
    featured: true,
    aliases: ["Chemical and Biochemical Process Technologies"],
  }),
  programme({
    id: "programme-entrepreneurship-ba",
    slug: "entrepreneurship-innovation-ba",
    title: "Bachelor in Entrepreneurship and Innovation",
    subtype: "Flagship programme",
    studentSummary: "A proposed transnational bachelor’s programme combining entrepreneurship, innovation and applied learning.",
    status: "Under development",
    availability: "Not ready for 2026/27; the latest report points to 2027/28 or later",
    universityIds: ["university-mtu", "university-uda", "university-urn", "university-xamk"],
    hostUniversityId: "university-mtu",
    countries: ["Ireland", "Italy", "France", "Finland"],
    themes: ["Entrepreneurship", "Innovation", "Business"],
    academicLevel: "Bachelor’s",
    workload: "6–8 semesters; 180–240 ECTS under discussion",
    actionLabel: "View evidence",
  }),
  programme({
    id: "programme-apn",
    slug: "advanced-practice-nursing",
    title: "Advanced Practice Nursing in Acute Care",
    subtype: "Flagship programme",
    studentSummary: "A Xamk Master’s developed through INGENIUM cooperation, with the wider alliance programme still taking shape.",
    fullDescription: "This is currently a Xamk national degree rather than a fully joint INGENIUM award. Other national and collaborative components remain at different stages.",
    status: "Open",
    availability: "Xamk supplementary application 3–6 August 2026; wider joint delivery remains in development",
    universityIds: ["university-xamk", "university-mus", "university-uniovi", "university-hs"],
    hostUniversityId: "university-xamk",
    themes: ["Health", "Nursing", "Acute care"],
    academicLevel: "Master’s",
    workload: "Partner models range from 90 to 120 ECTS",
    applicationDeadline: "2026-08-06",
    eligibility: "See Xamk’s official degree page for admission requirements",
    actionLabel: "Check Xamk programme",
    officialUrl: "https://www.xamk.fi/en/degree-programmes/advanced-practice-nursing-in-acute-care/",
    confidence: "High",
  }),
  programme({
    id: "programme-ai",
    slug: "artificial-intelligence-master",
    title: "Joint Master’s in Artificial Intelligence",
    subtype: "Flagship programme",
    studentSummary: "A planned 120 ECTS programme connecting engineering and AI expertise across six universities.",
    status: "Under development",
    availability: "Joint implementation expected no earlier than 2027/28",
    universityIds: ["university-tuiasi", "university-uda", "university-hs", "university-hka", "university-uniovi", "university-xamk"],
    hostUniversityId: "university-tuiasi",
    themes: ["Artificial intelligence", "Engineering", "Digital skills"],
    academicLevel: "Master’s",
    ects: 120,
    workload: "Four semesters",
    actionLabel: "View evidence",
  }),
  programme({
    id: "programme-sdce",
    slug: "sustainable-development-circular-economy",
    title: "Sustainable Development and Circular Economy",
    shortTitle: "SDCE",
    subtype: "Flagship programme",
    studentSummary: "A proposed joint Master’s connecting sustainability, circular economy and applied interdisciplinary learning.",
    status: "Verification required",
    availability: "Reported feasible for 2026/27, but live recruitment has not been confirmed",
    universityIds: ["university-tuiasi", "university-hs", "university-hka", "university-mtu", "university-uda", "university-xamk"],
    hostUniversityId: "university-tuiasi",
    themes: ["Sustainability", "Circular economy", "Innovation"],
    academicLevel: "Master’s",
    ects: 120,
    workload: "Four semesters",
    actionLabel: "View evidence",
  }),
  programme({
    id: "programme-smacc",
    slug: "sustainable-coastal-conservation",
    title: "Sustainable Management in Coastal Conservation",
    shortTitle: "SMaCC",
    subtype: "Flagship programme",
    studentSummary: "A developing joint Master’s focused on the sustainable management and conservation of coastal environments.",
    status: "Verification required",
    availability: "Reported feasible for 2026/27; accreditation and live recruitment require confirmation",
    universityIds: ["university-urn", "university-mtu", "university-uniovi"],
    hostUniversityId: "university-urn",
    themes: ["Sustainability", "Coastal conservation", "Environmental management"],
    academicLevel: "Master’s",
    ects: 120,
    workload: "Four semesters; approximately 15 students proposed",
    actionLabel: "View evidence",
  }),
  programme({
    id: "programme-legal-sciences",
    slug: "legal-sciences-international-law",
    title: "Legal Sciences for Internationalisation and Business Innovation / International Law",
    subtype: "Double Master’s degree",
    studentSummary: "A double-degree route connecting legal studies in Italy and France.",
    status: "Verification required",
    availability: "Accredited, but official reports conflict on the first intake year",
    universityIds: ["university-uda", "university-urn"],
    hostUniversityId: "university-uda",
    themes: ["Law", "Internationalisation", "Business innovation"],
    academicLevel: "Master’s",
    ects: 120,
    actionLabel: "View evidence",
  }),
  programme({
    id: "programme-rehabilitation",
    slug: "rehabilitation-balneology",
    title: "Health Professions of Rehabilitation Sciences / Rehabilitation & Balneology",
    subtype: "Double Master’s degree",
    studentSummary: "A developing Italian–Bulgarian double degree in rehabilitation and health sciences.",
    status: "Under development",
    availability: "Agreement and launch timing remain unresolved in the latest evidence",
    universityIds: ["university-uda", "university-mus"],
    hostUniversityId: "university-uda",
    themes: ["Health", "Rehabilitation", "Balneology"],
    academicLevel: "Master’s",
    ects: 120,
    actionLabel: "View evidence",
  }),
  programme({
    id: "programme-civil-engineering",
    slug: "civil-engineering-double-master",
    title: "Double Master’s Degree in Civil Engineering",
    subtype: "Double Master’s degree",
    studentSummary: "An accredited engineering route connecting TUIASI and Ud’A.",
    status: "Ongoing",
    availability: "First intake reported for 2025/26; current admissions should be confirmed locally",
    universityIds: ["university-tuiasi", "university-uda"],
    hostUniversityId: "university-tuiasi",
    themes: ["Engineering", "Infrastructure", "Built environment"],
    academicLevel: "Master’s",
    ects: 120,
    actionLabel: "View evidence",
  }),
  programme({
    id: "programme-chemistry",
    slug: "chemistry-double-master",
    title: "Double Master’s Degree in Chemistry",
    subtype: "Double Master’s degree",
    studentSummary: "A staggered double-degree route connecting chemistry study in Rouen and Oviedo.",
    status: "Ongoing",
    availability: "Partner implementation is staggered; confirm current intake details",
    universityIds: ["university-urn", "university-uniovi"],
    hostUniversityId: "university-urn",
    themes: ["Chemistry", "Laboratory learning", "Mobility"],
    academicLevel: "Master’s",
    actionLabel: "View evidence",
  }),
  programme({
    id: "programme-eu4m",
    slug: "eu4m-mechatronic-engineering",
    title: "EU4M Joint Master in Mechatronic Engineering",
    shortTitle: "EU4M",
    subtype: "Erasmus Mundus Joint Master",
    studentSummary: "An operational 120 ECTS programme with mandatory study periods in at least two countries.",
    status: "Ongoing",
    availability: "Operational from 2025/26; check the official consortium for the current call",
    universityIds: ["university-uniovi", "university-hka", "university-hs"],
    hostUniversityId: "university-uniovi",
    themes: ["Mechatronics", "Engineering", "Mobility"],
    academicLevel: "Master’s",
    ects: 120,
    capacity: "30 students per cohort reported",
    actionLabel: "View evidence",
    confidence: "High",
  }),
  programme({
    id: "programme-human-centred-ai-doctorate",
    slug: "human-centred-ai-doctorate",
    title: "Joint Doctoral Programme in Human-Centred Artificial Intelligence",
    shortTitle: "Human-Centred AI PhD",
    subtype: "Joint doctoral programme",
    studentSummary: "A live INGENIUM doctoral call focused on human-centred AI foundations and applications.",
    fullDescription: "The programme call is verified as open. Consult the official page for the research themes, host arrangements and full admission documentation.",
    status: "Open",
    availability: "Call open; deadline 21 August 2026",
    universityIds: [],
    themes: ["Artificial intelligence", "Research", "Doctoral study"],
    academicLevel: "Doctoral",
    deliveryMode: "Joint doctoral programme",
    applicationDeadline: "2026-08-21",
    eligibility: "See the official call for doctoral admission and research requirements",
    actionLabel: "Open doctoral call",
    officialUrl: sources.find((source) => source.id === "human-centred-ai-doctorate")?.url,
    sourceId: "human-centred-ai-doctorate",
    confidence: "High",
    featured: true,
  }),
];

const pathwaySeed = [
  ["biomedicine", "Biomedicine", "Bachelor’s", "university-hs"],
  ["commerce-marketing", "Commerce and Marketing", "Bachelor’s", "university-uniovi"],
  ["molecular-biodesign", "Molecular Biodesign", "Bachelor’s", "university-hs"],
  ["sustainable-habitat", "Sciences of Sustainable Habitat", "Bachelor’s", "university-uda"],
  ["social-services", "Social Services", "Bachelor’s", "university-xamk"],
  ["social-work", "Social Work", "Bachelor’s", "university-uniovi"],
  ["tourism", "Tourism", "Bachelor’s", "university-uniovi"],
  ["automotive-electronics", "Automotive Electronic Control Systems", "Master’s", "university-tuiasi"],
  ["biotechnology-environment-health", "Biotechnology of Environment and Health", "Master’s", "university-uniovi"],
  ["electrical-energy", "Electrical Energy Conversion and Power Systems", "Master’s", "university-uniovi"],
  ["telecommunications-it", "Information Technologies for Telecommunications", "Master’s", "university-tuiasi"],
  ["machine-learning-robotics", "Machine Learning, Robotics and Control", "Master’s", "university-tuiasi"],
  ["modern-languages-management", "Modern Languages for Management and International Cooperation", "Master’s", "university-uda"],
] as const;

const pathways: Entity[] = pathwaySeed.map(([slug, title, academicLevel, hostUniversityId]) => ({
  id: `pathway-${slug}`,
  slug,
  title,
  type: "pathway",
  subtype: "INGENIUM Pathway Programme pilot",
  studentSummary: "An optional international pathway attached to an existing nationally accredited degree.",
  fullDescription: "The Pathway Framework is designed to combine transdisciplinary learning, physical or virtual mobility and alliance activities, with recognition through the diploma supplement when fully implemented.",
  status: slug === "social-services" ? "Upcoming" : "Verification required",
  availability: slug === "social-services"
    ? "Xamk confirms this Pathway begins in autumn 2026"
    : "One of thirteen pilots in D4.1; current reporting confirms twelve will welcome students in 2026/27 but does not identify every live pilot",
  universityIds: [hostUniversityId],
  hostUniversityId,
  themes: title.includes("Sustain") || title.includes("Environment") ? ["Sustainability", "Mobility", "Flexible learning"] : ["Flexible learning", "Mobility", "European campus"],
  academicLevel,
  mobilityType: "Physical and/or virtual mobility",
  workload: "The framework targets approximately 25% of total ECTS through international mobility when fully implemented",
  actionLabel: "View Pathway framework",
  officialUrl: sources.find((source) => source.id === "pathway-framework-live")?.url,
  sourceId: "pathway-framework-live",
  lastVerified: RESEARCH_DATE,
  confidence: "Medium",
}));

function project(slug: string, title: string, universityIds: string[], funding: string, studentSummary: string, themes: string[], funded = true): Entity {
  return {
    id: `project-${slug}`,
    slug,
    title,
    type: "project",
    subtype: funded ? "Funded Student Partnership" : "Student Partnership proposal",
    studentSummary,
    status: funded ? "Ongoing" : "Planned",
    availability: funded ? "Implementation reported through 15 December 2026" : "Supported to identify alternative funding; not selected for direct 2026 funding",
    universityIds,
    themes,
    funding,
    actionLabel: "View official announcement",
    officialUrl: sources.find((source) => source.id === "student-partnerships-2026")?.url,
    sourceId: "student-partnerships-2026",
    lastVerified: RESEARCH_DATE,
    confidence: "High",
  };
}

const projects: Entity[] = [
  project("futureproof", "FutureProof Escape", ["university-tuiasi", "university-uniovi", "university-hs", "university-uda", "university-uoc", "university-xamk", "university-mus", "university-hka", "university-mtu"], "€10,000 awarded", "An interactive escape-room experience using teamwork and gamification to explore campus sustainability.", ["Sustainability", "Gamification", "Collaboration"]),
  project("ecocommute", "EcoCommute", ["university-uniovi", "university-urn", "university-tuiasi"], "€7,800 awarded", "A student initiative exploring more sustainable and accessible transport for internships and exchanges.", ["Sustainability", "Mobility", "Accessibility"]),
  project("leadership-lab", "Student Leadership & Entrepreneurship Lab", ["university-mus", "university-uda", "university-xamk"], "€10,000 awarded", "International practical learning designed to strengthen leadership, entrepreneurship and work-ready skills.", ["Entrepreneurship", "Leadership", "Professional skills"]),
  project("immunobattle", "ImmunoBattle — The Warriors Within You", ["university-uniovi", "university-hs", "university-uda"], "€10,000 awarded", "An interdisciplinary health-education project making immunity and public-health topics engaging and accessible.", ["Health", "Science communication", "Gamification"]),
  project("ingenium-platform", "INGENIUM Platform", ["university-uniovi", "university-tuiasi", "university-hs"], "€7,550 awarded", "An intensive programme for ESN volunteers combining intercultural learning, field visits and organisational skills.", ["Intercultural learning", "Mobility", "Student organisations"]),
  project("infrastructurelink", "InfrastructureLink", ["university-tuiasi", "university-mtu", "university-hka", "university-uda", "university-hs"], "€8,200 awarded", "A transnational exchange connecting students around infrastructure, engineering and shared challenges.", ["Engineering", "Infrastructure", "Collaboration"]),
  project("ingenium-plus", "INGENIUM+", ["university-mtu", "university-tuiasi", "university-xamk"], "Alternative funding support", "The student-led discovery concept behind this graph-based platform.", ["Digital learning", "Student connection", "Data visualisation"], false),
  project("resqdrone", "ResQDrone", ["university-hka", "university-hs", "university-uniovi"], "Alternative funding support", "A proposal using AI-powered drones to support rescue authorities alongside AI and robotics workshops.", ["Artificial intelligence", "Robotics", "Public safety"], false),
];

const events: Entity[] = [
  {
    id: "event-winter-iasi-2026", slug: "senior-winter-iasi-2026", title: "Senior Winter School 2026 — Science Meets Industry", type: "event", subtype: "10 Days of INGENIUM", studentSummary: "An advanced school connecting research, industry and innovation in Iași.", status: "Completed", availability: "Historical event", universityIds: ["university-tuiasi"], hostUniversityId: "university-tuiasi", countries: ["Romania"], city: "Iași", themes: ["Research", "Industry", "Innovation"], startDate: "2026-01-26", endDate: "2026-01-30", dateLabel: "26–30 January 2026", actionLabel: "View event story", officialUrl: sources.find((source) => source.id === "winter-2026")?.url, sourceId: "winter-2026", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "event-winter-skovde-2026", slug: "junior-winter-skovde-2026", title: "Junior Winter School 2026 — Sustainability in Action", type: "event", subtype: "10 Days of INGENIUM", studentSummary: "A practical, interdisciplinary sustainability school hosted in Skövde.", status: "Completed", availability: "Historical event", universityIds: ["university-hs"], hostUniversityId: "university-hs", countries: ["Sweden"], city: "Skövde", themes: ["Sustainability", "Collaboration", "Student learning"], startDate: "2026-02-02", endDate: "2026-02-06", dateLabel: "2–6 February 2026", actionLabel: "View event story", officialUrl: sources.find((source) => source.id === "winter-2026")?.url, sourceId: "winter-2026", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "event-summer-cork-2026", slug: "senior-summer-cork-2026", title: "Senior Summer School 2026 — Enabling Research for Impact", type: "event", subtype: "10 Days of INGENIUM", studentSummary: "Five days of interdisciplinary work on sustainable innovation, entrepreneurship and research impact.", status: "Completed", availability: "Historical event", universityIds: ["university-mtu"], hostUniversityId: "university-mtu", countries: ["Ireland"], city: "Cork", themes: ["Research", "Sustainability", "Entrepreneurship"], startDate: "2026-05-25", endDate: "2026-05-29", dateLabel: "25–29 May 2026", actionLabel: "View event story", officialUrl: sources.find((source) => source.id === "summer-2026")?.url, sourceId: "summer-2026", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "event-summer-sofia-2026", slug: "junior-summer-sofia-2026", title: "Junior Summer School 2026 — Health Promotion in the New Era", type: "event", subtype: "10 Days of INGENIUM", studentSummary: "A health-focused school combining AI, labour-market change and emergency medicine.", status: "Completed", availability: "Historical event", universityIds: ["university-mus"], hostUniversityId: "university-mus", countries: ["Bulgaria"], city: "Sofia", themes: ["Health", "Artificial intelligence", "Emergency medicine"], startDate: "2026-06-01", endDate: "2026-06-05", dateLabel: "1–5 June 2026", actionLabel: "View event story", officialUrl: sources.find((source) => source.id === "summer-2026")?.url, sourceId: "summer-2026", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "event-sdg-hackathon-2024", slug: "sdg-hackathon-2024", title: "INGENIUM SDG Hackathon", type: "event", subtype: "International online/hybrid challenge", studentSummary: "Forty students in nine international teams developed campus-level sustainability solutions with mentor support.", status: "Completed", availability: "Historical event held 17–18 April 2024", universityIds: allUniversityIds, hostUniversityId: "university-urn", themes: ["Sustainability", "Challenge-based learning", "International teams"], startDate: "2024-04-17", endDate: "2024-04-18", dateLabel: "17–18 April 2024", language: "English; B2/C1 was required", capacity: "40 participants across nine teams", actionLabel: "Explore the outcome", sourceId: "sdg-hackathon", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "event-science-factory-2024", slug: "science-factory-2024", title: "Science Factory — Waste Management", type: "event", subtype: "10 Days follow-on activity", studentSummary: "Students adapted the winning Hackathon idea to the different realities of INGENIUM campuses.", status: "Completed", availability: "Historical activity held in Rouen, 27–31 May 2024", universityIds: allUniversityIds, hostUniversityId: "university-urn", themes: ["Waste management", "Campus sustainability", "Co-creation"], dateLabel: "27–31 May 2024", actionLabel: "View evidence", sourceId: "sdg-hackathon", lastVerified: RESEARCH_DATE, confidence: "High",
  },
];

const communities: Entity[] = [
  {
    id: "community-student-board", slug: "student-board", title: "INGENIUM Student Board", type: "community", subtype: "Official student representation", studentSummary: "The official student voice in alliance governance, connecting representatives from all ten universities.", status: "Ongoing", availability: "Participation begins through a local INGENIUM coordinator", universityIds: allUniversityIds, themes: ["Student voice", "Governance", "Intercultural learning"], actionLabel: "Visit official page", officialUrl: sources.find((source) => source.id === "student-board")?.url, sourceId: "student-board", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "community-founders-hub", slug: "founders-hub", title: "INGENIUM Founders HUB", type: "community", subtype: "Entrepreneurship network", studentSummary: "A verified student-led entrepreneurship project; its current participation route is not publicly stated.", status: "Access unverified", availability: "Project verified; current participation route and operational status are not stated", universityIds: allUniversityIds, themes: ["Entrepreneurship", "Mentoring", "Collaboration"], actionLabel: "View official project", officialUrl: sources.find((source) => source.id === "founders-hub")?.url, sourceId: "founders-hub", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "community-sustainability-board", slug: "student-sustainability-board", title: "Student Sustainability Board", type: "community", subtype: "Student advisory network", studentSummary: "A student group that advised alliance sustainability activities including the game jam and Sustainability Week.", status: "Verification required", availability: "Active in 2024; the current joining route requires confirmation", universityIds: allUniversityIds, themes: ["Sustainability", "Student voice", "Campus action"], actionLabel: "View evidence", sourceId: "progress-report", lastVerified: RESEARCH_DATE, confidence: "Medium",
  },
  {
    id: "community-sustainability-hub", slug: "student-sustainability-hub", title: "Student Sustainability Hub", type: "community", subtype: "Sustainability action gateway", studentSummary: "A live alliance hub where students can explore sustainability work, submit a proposal or contact the Student Sustainability Board.", status: "Ongoing", availability: "Live public hub with proposal and contact routes", universityIds: allUniversityIds, themes: ["Sustainability", "Student voice", "Campus action"], actionLabel: "Open Sustainability Hub", officialUrl: sources.find((source) => source.id === "sustainability-hub")?.url, sourceId: "sustainability-hub", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
];

const platforms: Entity[] = [
  {
    id: "platform-education", slug: "education-platform", title: "INGENIUM Education Platform", shortTitle: "IEP", type: "platform", subtype: "Moodle learning platform", studentSummary: "The live alliance learning environment for courses, training resources and microcredentials.", fullDescription: "Eight partner universities use institutional single sign-on. At the research date, HKA and MTU users request local accounts through the INGENIUM helpdesk. Individual course access conditions still apply.", status: "Ongoing", availability: "Operational; course enrolment conditions vary", universityIds: allUniversityIds, themes: ["Digital learning", "Courses", "Accessibility"], deliveryMode: "Online", actionLabel: "Visit learning platform", officialUrl: "https://elearn.ingenium-university.eu/", sourceId: "digital-ingenium", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "platform-front-portal", slug: "official-website", title: "Official INGENIUM Front Portal", type: "platform", subtype: "Public website", studentSummary: "The authoritative public source for alliance news, calls, events, programmes and application routes.", status: "Ongoing", availability: "Public", universityIds: allUniversityIds, themes: ["Official information", "Applications", "Events"], actionLabel: "Visit official website", officialUrl: "https://ingenium-university.eu/", sourceId: "platforms", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "platform-intra-alliance", slug: "intra-alliance", title: "INGENIUM Intra-Alliance Site", type: "platform", subtype: "Secure collaboration space", studentSummary: "A restricted internal environment with forums, calendars and shared alliance resources—not a public group-chat product.", status: "Access unverified", availability: "Authenticated member service; student eligibility and sign-in route should be checked locally", universityIds: allUniversityIds, themes: ["Collaboration", "Forums", "Internal resources"], actionLabel: "View Digital INGENIUM", officialUrl: sources.find((source) => source.id === "digital-ingenium")?.url, sourceId: "digital-ingenium", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "platform-open-data", slug: "open-data-repository", title: "Open Data & Open Science Repository", type: "platform", subtype: "Open repository", studentSummary: "A public repository for open research outputs and educational resources.", status: "Ongoing", availability: "Public resources; contribution rules vary", universityIds: allUniversityIds, themes: ["Open science", "Educational resources", "Research"], actionLabel: "Visit repository", officialUrl: "https://opendata.ingenium-university.eu/", sourceId: "microcredentials", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "platform-virtual-registry", slug: "virtual-student-registry", title: "Virtual Student Registry", type: "platform", subtype: "Service described", studentSummary: "An alliance service described for course registration, curricula, examinations and records; no operational student access point was verified.", status: "Access unverified", availability: "Officially described, but a live student access point was not verified", universityIds: allUniversityIds, themes: ["Student services", "Course registration", "Digital campus"], actionLabel: "View official description", officialUrl: sources.find((source) => source.id === "virtual-registry")?.url, sourceId: "virtual-registry", lastVerified: RESEARCH_DATE, confidence: "High",
  },
];

const initiatives: Entity[] = [
  {
    id: "initiative-bmc", slug: "business-model-canvas", title: "INGENIUM Business Model Canvas Resource", shortTitle: "BMC", type: "initiative", subtype: "Entrepreneurship learning resource", studentSummary: "A live one-hour, self-directed introduction to business modelling with a digital badge.", status: "Recurring", availability: "Live evergreen course for INGENIUM students and staff", universityIds: allUniversityIds, hostUniversityId: "university-mtu", themes: ["Entrepreneurship", "Sustainability", "Business modelling"], deliveryMode: "Online through the Education Platform", workload: "Approximately one hour", eligibility: "INGENIUM students and staff", actionLabel: "Open live course", officialUrl: sources.find((source) => source.id === "bmc-live")?.url, sourceId: "bmc-live", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "initiative-innovation-challenge", slug: "student-innovation-challenge", title: "Student Innovation Challenge", type: "initiative", subtype: "Challenge-based learning", studentSummary: "Interdisciplinary student teams work with industry partners on real innovation challenges.", status: "Verification required", availability: "A 2025 edition is documented; the reported 2026 expansion must be verified", universityIds: ["university-mtu", "university-uda", "university-hs", "university-uoc"], hostUniversityId: "university-mtu", themes: ["Innovation", "Entrepreneurship", "Industry"], actionLabel: "View evidence", sourceId: "entrepreneurship-training", lastVerified: RESEARCH_DATE, confidence: "Medium", featured: true,
  },
  {
    id: "initiative-accelerator", slug: "ingenium-accelerator", title: "INGENIUM Accelerator", type: "initiative", subtype: "Transnational accelerator framework", studentSummary: "A planned advanced route covering validation, markets, finance, pitching, intellectual property and company formation.", status: "Under development", availability: "A 12-participant 2026 pilot was planned; no live application or completed pilot was verified", universityIds: ["university-mtu", "university-uniovi", "university-uoc"], hostUniversityId: "university-mtu", themes: ["Entrepreneurship", "Start-ups", "Mentoring"], actionLabel: "View evidence", sourceId: "accelerator", lastVerified: RESEARCH_DATE, confidence: "Medium",
  },
  {
    id: "initiative-soft-landings", slug: "soft-landings", title: "Soft Landings Initiative", type: "initiative", subtype: "Cross-border incubation support", studentSummary: "A developing route for entrepreneurs to explore partner markets through hot-desking and local incubation support.", status: "Under development", availability: "Joining process and student eligibility are not yet public", universityIds: ["university-mtu", "university-uniovi", "university-hka", "university-hs"], themes: ["Entrepreneurship", "Mobility", "Incubation"], actionLabel: "View evidence", sourceId: "accelerator", lastVerified: RESEARCH_DATE, confidence: "Medium",
  },
  {
    id: "initiative-wastewise", slug: "wastewise", title: "WasteWise — Make Waste Matter!", type: "initiative", subtype: "SDG Hackathon winning concept", studentSummary: "A student proposal turning food waste into compost, vegetables and support for students and university restaurants.", status: "Completed", availability: "Winning 2024 concept; campus-wide implementation has not been verified", universityIds: allUniversityIds, hostUniversityId: "university-urn", themes: ["Waste management", "Food systems", "Sustainability"], actionLabel: "View evidence", sourceId: "sdg-hackathon", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "initiative-tuiasi-waste", slug: "tuiasi-waste-programme", title: "TUIASI Integrated Waste Management Proposal", type: "initiative", subtype: "Science Factory campus concept", studentSummary: "A campus proposal combining awareness, recycling challenges, clean-up days and food-waste reuse.", status: "Completed", availability: "A winning student proposal; implementation has not been verified", universityIds: ["university-tuiasi"], hostUniversityId: "university-tuiasi", themes: ["Waste management", "Campus action", "Student engagement"], actionLabel: "View evidence", sourceId: "sdg-hackathon", lastVerified: RESEARCH_DATE, confidence: "High",
  },
];

const opportunities: Entity[] = [
  {
    id: "opportunity-european-campus", slug: "european-campus", title: "INGENIUM European Campus", type: "opportunity", subtype: "Alliance-wide gateway", studentSummary: "The main route into study, mobility, research and collaboration across the ten partner universities.", status: "Ongoing", availability: "Current", universityIds: allUniversityIds, themes: ["European campus", "Study", "Mobility"], actionLabel: "Explore official campus", officialUrl: sources.find((source) => source.id === "european-campus")?.url, sourceId: "european-campus", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "opportunity-short-mobility", slug: "short-term-mobility", title: "Short-term Mobility Opportunities", type: "opportunity", subtype: "Mobility route", studentSummary: "Short international learning experiences including BIPs and Junior or Senior Schools.", status: "Recurring", availability: "Check current calls and your home university’s local process", universityIds: allUniversityIds, themes: ["Mobility", "BIPs", "10 Days"], mobilityType: "Short-term", actionLabel: "View official mobility route", officialUrl: sources.find((source) => source.id === "short-mobility")?.url, sourceId: "short-mobility", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
  {
    id: "opportunity-long-mobility", slug: "long-term-mobility", title: "Long-term Mobility Opportunities", type: "opportunity", subtype: "Mobility route", studentSummary: "Semester-scale study mobility coordinated through each student’s local international office.", status: "Recurring", availability: "Local processes and deadlines apply", universityIds: allUniversityIds, themes: ["Mobility", "Study abroad", "European campus"], mobilityType: "Long-term", actionLabel: "View official mobility route", officialUrl: sources.find((source) => source.id === "long-mobility")?.url, sourceId: "long-mobility", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "opportunity-digital-applications", slug: "digital-applications", title: "Digital Student Applications", type: "opportunity", subtype: "Official service route", studentSummary: "Official digital routes for selected schools, hackathons and alliance calls.", status: "Ongoing", availability: "Availability changes by call", universityIds: allUniversityIds, themes: ["Applications", "Student services", "Digital campus"], actionLabel: "Visit official platforms", officialUrl: sources.find((source) => source.id === "digital-platforms")?.url, sourceId: "digital-platforms", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "opportunity-phd-mobility-2026", slug: "phd-mobility-co-supervision-2026", title: "PhD Mobility and Co-Supervision Scholarships", type: "opportunity", subtype: "Doctoral mobility call", studentSummary: "A live mobility route for doctoral researchers to develop co-supervision and research collaboration across INGENIUM.", status: "Open", availability: "Applications close 11 September 2026 at 12:00 CEST", universityIds: allUniversityIds, themes: ["Doctoral study", "Research", "Mobility"], academicLevel: "Doctoral", mobilityType: "Research mobility", applicationDeadline: "2026-09-11", funding: "Up to €1,000 per month for a maximum of four months", eligibility: "See the official call for applicant and host requirements", actionLabel: "Open scholarship call", officialUrl: sources.find((source) => source.id === "phd-mobility-2026")?.url, sourceId: "phd-mobility-2026", lastVerified: RESEARCH_DATE, confidence: "High", featured: true,
  },
];

const frameworks: Entity[] = [
  {
    id: "framework-pathways", slug: "pathway-framework", title: "INGENIUM Pathway Framework", type: "framework", subtype: "Flexible learning framework", studentSummary: "A model for adding international, interdisciplinary learning to an existing nationally accredited degree.", status: "Ongoing", availability: "Current reporting says twelve Pathways will welcome students in 2026/27; it does not name which of the thirteen D4.1 pilots is delayed", universityIds: allUniversityIds, themes: ["Flexible learning", "Mobility", "Recognition"], mobilityType: "Normally expects at least 25% of study periods in physical mobility", actionLabel: "View official framework", officialUrl: sources.find((source) => source.id === "pathway-framework-live")?.url, sourceId: "pathway-framework-live", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "framework-microcredentials", slug: "microcredential-framework", title: "INGENIUM Microcredential Framework", type: "framework", subtype: "Quality and design framework", studentSummary: "The common model for designing credible, portable and student-centred short learning experiences.", status: "Ongoing", availability: "Framework available; it is not itself a catalogue of live courses", universityIds: allUniversityIds, themes: ["Microcredentials", "Lifelong learning", "Quality assurance"], actionLabel: "View evidence", sourceId: "microcredentials", lastVerified: RESEARCH_DATE, confidence: "High",
  },
  {
    id: "framework-microcredential-descriptor", slug: "microcredential-descriptor", title: "Microcredential Descriptor", type: "framework", subtype: "Programme information standard", studentSummary: "A structured way to describe issuer, ECTS, EQF, workload, outcomes, assessment, prerequisites and stackability.", status: "Ongoing", availability: "Published as part of the framework", universityIds: allUniversityIds, themes: ["Microcredentials", "Transparency", "Recognition"], actionLabel: "View evidence", sourceId: "microcredentials", lastVerified: RESEARCH_DATE, confidence: "High",
  },
];

export const entities: Entity[] = [
  ...universities,
  ...bips,
  ...programmes,
  ...pathways,
  ...projects,
  ...events,
  ...communities,
  ...platforms,
  ...initiatives,
  ...opportunities,
  ...frameworks,
];

const universityRelationships: Relationship[] = entities
  .filter((entity) => entity.type !== "university")
  .flatMap((entity) => entity.universityIds.map((universityId) => ({
    id: `rel-${entity.id}-${universityId}`,
    source: entity.id,
    target: universityId,
    type: entity.hostUniversityId === universityId ? "hosted_by" : "connected_to",
    label: entity.hostUniversityId === universityId ? "Hosted by" : "Connected to",
    explanation: entity.hostUniversityId === universityId
      ? `${entity.title} is hosted or coordinated by ${entities.find((item) => item.id === universityId)?.title ?? "this university"}.`
      : `${entity.title} involves or is connected to ${entities.find((item) => item.id === universityId)?.title ?? "this university"}.`,
  })));

const storyRelationships: Relationship[] = [
  { id: "rel-campus-short", source: "opportunity-european-campus", target: "opportunity-short-mobility", type: "includes", label: "Includes", explanation: "The European Campus includes short-term mobility routes such as BIPs and 10 Days schools." },
  { id: "rel-campus-long", source: "opportunity-european-campus", target: "opportunity-long-mobility", type: "includes", label: "Includes", explanation: "The European Campus also connects students to semester-scale mobility." },
  { id: "rel-short-bips", source: "opportunity-short-mobility", target: "bip-clarity-ai", type: "example", label: "Example route", explanation: "CLARITY-AI is one verified example of a 2026/27 short-term mobility opportunity." },
  { id: "rel-pathway-framework", source: "framework-pathways", target: "pathway-biomedicine", type: "implemented_by", label: "Implemented by", explanation: "Biomedicine is one of thirteen pilots intended to test the INGENIUM Pathway Framework." },
  { id: "rel-microcredentials-platform", source: "framework-microcredentials", target: "platform-education", type: "delivered_through", label: "Delivered through", explanation: "INGENIUM microcredentials are intended to be delivered through the Education Platform where possible." },
  { id: "rel-descriptor-framework", source: "framework-microcredential-descriptor", target: "framework-microcredentials", type: "part_of", label: "Part of", explanation: "The descriptor is the common information structure within the INGENIUM microcredential framework." },
  { id: "rel-bmc-platform", source: "initiative-bmc", target: "platform-education", type: "delivered_through", label: "Delivered through", explanation: "The Business Model Canvas resource was designed for delivery through the alliance learning platform." },
  { id: "rel-bmc-challenge", source: "initiative-bmc", target: "initiative-innovation-challenge", type: "prepares_for", label: "Can prepare for", explanation: "Business modelling skills can prepare students for challenge-based entrepreneurship activity." },
  { id: "rel-challenge-accelerator", source: "initiative-innovation-challenge", target: "initiative-accelerator", type: "may_progress_to", label: "May progress to", explanation: "The planned accelerator represents a more advanced entrepreneurship route after early challenge-based learning." },
  { id: "rel-accelerator-soft", source: "initiative-accelerator", target: "initiative-soft-landings", type: "supported_by", label: "Supported by", explanation: "Soft-landing support is intended to help ventures explore partner markets after development." },
  { id: "rel-founders-challenge", source: "community-founders-hub", target: "initiative-innovation-challenge", type: "connects_to", label: "Connects to", explanation: "The Founders HUB provides a community route into entrepreneurship opportunities and collaboration." },
  { id: "rel-hackathon-wastewise", source: "event-sdg-hackathon-2024", target: "initiative-wastewise", type: "produced", label: "Produced", explanation: "WasteWise was selected as the winning solution of the 2024 SDG Hackathon." },
  { id: "rel-wastewise-science", source: "initiative-wastewise", target: "event-science-factory-2024", type: "continued_through", label: "Continued through", explanation: "The WasteWise concept was carried into the Science Factory during the Rouen 10 Days of INGENIUM." },
  { id: "rel-science-tuiasi", source: "event-science-factory-2024", target: "initiative-tuiasi-waste", type: "adapted_into", label: "Adapted into", explanation: "A student team adapted the waste-management concept to the TUIASI campus case." },
  { id: "rel-sustainability-board-hack", source: "community-sustainability-board", target: "event-sdg-hackathon-2024", type: "shares_theme", label: "Shares student-action theme", explanation: "Both connect student voice with campus sustainability action." },
  { id: "rel-project-plus-campus", source: "project-ingenium-plus", target: "opportunity-european-campus", type: "maps", label: "Maps", explanation: "INGENIUM+ was conceived to make the European Campus and its opportunities easier for students to navigate." },
  { id: "rel-cbpt-campus", source: "programme-cbpt", target: "opportunity-european-campus", type: "embodies", label: "Embodies", explanation: "The joint programme is a concrete example of an integrated European Campus study journey." },
  { id: "rel-student-board-campus", source: "community-student-board", target: "opportunity-european-campus", type: "represents_students_in", label: "Represents students in", explanation: "The Student Board carries student perspectives into alliance decision-making." },
  { id: "rel-sustainability-hub-board", source: "community-sustainability-hub", target: "community-sustainability-board", type: "contact_route_for", label: "Contact route for", explanation: "The live Student Sustainability Hub provides an official route to contact the Student Sustainability Board or submit an idea." },
  { id: "rel-sustainability-hub-hackathon", source: "community-sustainability-hub", target: "event-sdg-hackathon-2024", type: "continues_theme", label: "Continues the theme", explanation: "The current Sustainability Hub carries forward the alliance's student-led sustainability action reflected in the historical Hackathon." },
  { id: "rel-doctorate-phd-mobility", source: "programme-human-centred-ai-doctorate", target: "opportunity-phd-mobility-2026", type: "related_research_route", label: "Related research route", explanation: "The live doctoral programme and the separate mobility scholarship call are distinct but complementary research opportunities." },
  { id: "rel-doctorate-campus", source: "programme-human-centred-ai-doctorate", target: "opportunity-european-campus", type: "part_of", label: "Part of the research campus", explanation: "The joint doctoral call is an alliance-level research opportunity within the broader European Campus." },
];

export const relationships: Relationship[] = [...universityRelationships, ...storyRelationships];

export const journeys: Journey[] = [
  {
    id: "find-a-bip",
    title: "Find a BIP",
    eyebrow: "Study abroad",
    summary: "Move from the European Campus to verified 2026/27 BIPs, compare themes and find the correct application route.",
    nodeIds: ["opportunity-european-campus", "opportunity-short-mobility", ...bips.map((item) => item.id)],
    accent: "cyan",
  },
  {
    id: "european-pathway",
    title: "Build a European study pathway",
    eyebrow: "Flexible learning",
    summary: "See how a home degree can connect to mobility, Pathway pilots, joint programmes and shorter learning formats.",
    nodeIds: ["framework-pathways", ...pathways.map((item) => item.id), "programme-cbpt", "framework-microcredentials", "opportunity-long-mobility"],
    accent: "lime",
  },
  {
    id: "sustainability-changemaker",
    title: "Become a sustainability changemaker",
    eyebrow: "From idea to campus action",
    summary: "Follow a real student journey from the SDG Hackathon to WasteWise, the Science Factory and a campus-level proposal.",
    nodeIds: ["community-sustainability-board", "event-sdg-hackathon-2024", "initiative-wastewise", "event-science-factory-2024", "initiative-tuiasi-waste", "project-futureproof", "project-ecocommute"],
    accent: "teal",
  },
  {
    id: "entrepreneurship",
    title: "Explore entrepreneurship",
    eyebrow: "Build something",
    summary: "Move from business-modelling skills to an innovation challenge, mentoring, accelerator development and a founder community.",
    nodeIds: ["initiative-bmc", "initiative-innovation-challenge", "community-founders-hub", "initiative-accelerator", "initiative-soft-landings", "programme-entrepreneurship-ba", "project-leadership-lab"],
    accent: "magenta",
  },
  {
    id: "digital-learning",
    title: "Develop a new skill",
    eyebrow: "Digital learning",
    summary: "Understand the difference between the learning platform, the microcredential framework and a genuinely live course.",
    nodeIds: ["platform-education", "framework-microcredentials", "framework-microcredential-descriptor", "platform-open-data", "initiative-bmc"],
    accent: "teal",
  },
  {
    id: "ten-days",
    title: "Experience 10 Days",
    eyebrow: "Meet the alliance",
    summary: "Explore the four completed Winter and Summer School experiences from 2026 and their host campuses.",
    nodeIds: ["event-winter-iasi-2026", "event-winter-skovde-2026", "event-summer-cork-2026", "event-summer-sofia-2026", "opportunity-short-mobility"],
    accent: "cyan",
  },
];

export const entityById = new Map(entities.map((entity) => [entity.id, entity]));
export const sourceById = new Map(sources.map((source) => [source.id, source]));

export const typeLabels: Record<EntityType, string> = {
  university: "University",
  bip: "BIP",
  programme: "Programme",
  pathway: "Pathway",
  project: "Student project",
  event: "Event",
  community: "Community",
  platform: "Platform",
  opportunity: "Opportunity",
  initiative: "Initiative",
  framework: "Framework",
};

export const typeColours: Record<EntityType, string> = {
  university: "#293133",
  bip: "#009ee3",
  programme: "#009878",
  pathway: "#829800",
  project: "#e5007e",
  event: "#c60068",
  community: "#7156b8",
  platform: "#48666f",
  opportunity: "#007b65",
  initiative: "#ad3e82",
  framework: "#687a13",
};
