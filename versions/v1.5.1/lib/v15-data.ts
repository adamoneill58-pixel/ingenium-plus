import {
  entities as v14Entities,
  relationships as v14Relationships,
  sources as v14Sources,
  type DataClassification,
  type Entity,
  type Relationship,
  type Source,
} from "./data";

export const V15_RESEARCH_DATE = "2026-09-13";

const courseCatalogueUrl = "https://ingenium-university.eu/courses/";
const autumnCoursesUrl = "https://ingenium-university.eu/expand-your-studies-with-the-ingenium-course-catalogue-apply-for-the-first-online-courses-of-2026-2027/";

export const v15Sources: Source[] = [
  {
    id: "course-catalogue-2026",
    title: "INGENIUM Course Catalogue",
    kind: "Official INGENIUM catalogue",
    url: courseCatalogueUrl,
    publisher: "INGENIUM European University",
    verifiedAt: V15_RESEARCH_DATE,
    notes: "Catalogue labels are cross-checked against explicit dates because some registration badges remain visible after deadlines.",
  },
  {
    id: "autumn-learning-2026",
    title: "First online courses of 2026/2027",
    kind: "Official INGENIUM news",
    url: autumnCoursesUrl,
    published: "11 August 2026",
    publisher: "INGENIUM European University",
    verifiedAt: V15_RESEARCH_DATE,
  },
  {
    id: "doctorates-2026",
    title: "INGENIUM Joint Doctoral Programmes",
    kind: "Official INGENIUM programme index",
    url: "https://ingenium-university.eu/doctoral-ecosystems/joint-doctorate-programmes/",
    publisher: "INGENIUM European University",
    verifiedAt: V15_RESEARCH_DATE,
  },
  {
    id: "wellbeing-doctorate-2026",
    title: "Joint Doctoral Programme in Innovative Strategies for Wellbeing",
    kind: "Official INGENIUM programme page",
    url: "https://ingenium-university.eu/research/joint-doctorate-programmes/joint-doctoral-programme-in-innovative-strategies-for-wellbeing/",
    publisher: "INGENIUM European University",
    verifiedAt: V15_RESEARCH_DATE,
  },
  {
    id: "education-call-2026",
    title: "INGENIUM Annual Education Call 2026/2027",
    kind: "Official INGENIUM call",
    url: "https://ingenium-university.eu/iec-faculty/ingenium-annual-education-call-2026-2027/",
    publisher: "INGENIUM European University",
    verifiedAt: V15_RESEARCH_DATE,
    notes: "The page contains conflicting deadline summaries; the record is therefore marked verification required.",
  },
];

function learning(partial: Omit<Entity, "sourceId" | "lastVerified" | "confidence" | "dataClassification"> & {
  sourceId?: string;
  confidence?: Entity["confidence"];
}): Entity {
  return {
    ...partial,
    sourceId: partial.sourceId ?? "autumn-learning-2026",
    sourceIds: [partial.sourceId ?? "autumn-learning-2026", "course-catalogue-2026"],
    lastVerified: V15_RESEARCH_DATE,
    confidence: partial.confidence ?? "High",
    dataClassification: "verified",
  };
}

export const learningEntities: Entity[] = [
  learning({
    id: "course-sustainable-wellbeing",
    slug: "sustainable-wellbeing-changing-society",
    title: "Sustainable Wellbeing in Changing Society",
    type: "course",
    subtype: "Cross-university online course",
    studentSummary: "Explore participation, social inclusion and sustainable wellbeing through an online Xamk course open through the INGENIUM catalogue.",
    fullDescription: "The official 2026/2027 course announcement gives a 27 September application deadline and a teaching period from 12 October to 15 December 2026. Recognition must be agreed with the home university.",
    status: "Open",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Wellbeing", "Sustainability", "Social inclusion"],
    academicLevel: "Bachelor’s",
    studyLevels: ["Bachelor"],
    deliveryMode: "Online",
    language: "English",
    languages: ["English"],
    startDate: "2026-10-12",
    endDate: "2026-12-15",
    applicationDeadline: "2026-09-27",
    dateLabel: "12 October–15 December 2026",
    ects: 5,
    eligibility: "Students at INGENIUM partner universities; confirm local recognition before applying",
    whyItMatters: "Adds a cross-university social-services perspective to the INGENIUM sustainable-wellbeing pathway.",
    actionLabel: "Check course and apply",
    officialUrl: courseCatalogueUrl,
    featured: true,
  }),
  learning({
    id: "course-basics-media-education",
    slug: "basics-media-education",
    title: "Basics of Media Education",
    type: "course",
    subtype: "Cross-university online course",
    studentSummary: "Build practical media literacy through discussion, media production, analysis and critical reflection.",
    status: "Ongoing",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Media literacy", "Education", "Digital skills"],
    academicLevel: "Bachelor’s",
    studyLevels: ["Bachelor"],
    deliveryMode: "Online",
    language: "English",
    languages: ["English"],
    startDate: "2026-09-07",
    endDate: "2026-12-15",
    applicationDeadline: "2026-08-23",
    dateLabel: "7 September–15 December 2026",
    ects: 5,
    whyItMatters: "Makes a quality-assured Xamk course discoverable beyond its home institution.",
    actionLabel: "View catalogue record",
    officialUrl: courseCatalogueUrl,
  }),
  learning({
    id: "course-ecec-finland",
    slug: "early-childhood-education-care-finland",
    title: "Early Childhood Education and Care in Finland",
    shortTitle: "ECEC in Finland",
    type: "course",
    subtype: "Self-directed online course",
    studentSummary: "Understand the Finnish early-childhood system, its national curriculum and your own educational principles.",
    status: "Ongoing",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Education", "Childhood", "Inclusion"],
    academicLevel: "Bachelor’s",
    studyLevels: ["Bachelor"],
    deliveryMode: "Self-learning online",
    language: "English",
    languages: ["English"],
    startDate: "2026-09-07",
    endDate: "2027-02-15",
    applicationDeadline: "2026-08-23",
    dateLabel: "7 September 2026–15 February 2027",
    ects: 3,
    actionLabel: "View catalogue record",
    officialUrl: courseCatalogueUrl,
  }),
  learning({
    id: "course-beginners-finnish-1",
    slug: "beginners-finnish-1",
    title: "Beginners’ Finnish 1",
    type: "course",
    subtype: "Self-directed language course",
    studentSummary: "Start learning Finnish independently online while gaining cultural context for study or mobility in Finland.",
    status: "Coming soon",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Languages", "Mobility", "Intercultural learning"],
    academicLevel: "Bachelor’s",
    studyLevels: ["Bachelor"],
    deliveryMode: "Self-learning online",
    language: "English and Finnish",
    languages: ["English", "Finnish"],
    startDate: "2026-09-14",
    endDate: "2027-02-15",
    applicationDeadline: "2026-08-30",
    dateLabel: "14 September 2026–15 February 2027",
    ects: 2,
    actionLabel: "View catalogue record",
    officialUrl: courseCatalogueUrl,
  }),
  learning({
    id: "course-beginners-finnish-2",
    slug: "beginners-finnish-2",
    title: "Beginners’ Finnish 2",
    type: "course",
    subtype: "Self-directed language course",
    studentSummary: "Continue beginner Finnish through an online Xamk course for learners with Finnish 1 or equivalent skills.",
    status: "Coming soon",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Languages", "Mobility", "Intercultural learning"],
    academicLevel: "Bachelor’s",
    studyLevels: ["Bachelor"],
    deliveryMode: "Self-learning online",
    language: "English and Finnish",
    languages: ["English", "Finnish"],
    startDate: "2026-09-14",
    endDate: "2027-02-15",
    applicationDeadline: "2026-08-30",
    dateLabel: "14 September 2026–15 February 2027",
    ects: 2,
    prerequisites: ["Beginners’ Finnish 1 or corresponding skills"],
    actionLabel: "View catalogue record",
    officialUrl: courseCatalogueUrl,
  }),
  learning({
    id: "course-culture-finland",
    slug: "culture-finland",
    title: "Culture Finland",
    type: "course",
    subtype: "Self-directed online course",
    studentSummary: "Use Finnish culture as a lens for reflecting on your own cultural assumptions and intercultural behaviour.",
    status: "Coming soon",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Culture", "Mobility", "Intercultural learning"],
    academicLevel: "Bachelor’s",
    studyLevels: ["Bachelor"],
    deliveryMode: "Self-learning online",
    language: "English",
    languages: ["English"],
    startDate: "2026-09-14",
    endDate: "2027-02-15",
    applicationDeadline: "2026-08-30",
    dateLabel: "14 September 2026–15 February 2027",
    ects: 3,
    actionLabel: "View catalogue record",
    officialUrl: courseCatalogueUrl,
  }),
  learning({
    id: "module-acute-care-professional-development",
    slug: "advanced-practice-nursing-professional-development",
    title: "Advanced Practice Nursing and Professional Development in Acute Care Nursing",
    shortTitle: "Acute Care Nursing",
    type: "module",
    subtype: "Master’s module",
    studentSummary: "A specialist online module for healthcare professionals studying at Master’s level.",
    status: "Coming soon",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Nursing", "Acute care", "Professional development"],
    academicLevel: "Master’s",
    studyLevels: ["Master"],
    deliveryMode: "Online",
    language: "English",
    languages: ["English"],
    startDate: "2026-09-16",
    endDate: "2026-12-31",
    applicationDeadline: "2026-09-06",
    dateLabel: "16 September–31 December 2026",
    eligibility: "Healthcare professionals with a healthcare degree studying at Master’s level",
    actionLabel: "View catalogue record",
    officialUrl: courseCatalogueUrl,
  }),
  learning({
    id: "module-acute-care-research-development",
    slug: "research-development-acute-care-nursing",
    title: "Research and Development in Acute Care Nursing",
    shortTitle: "Acute Care R&D",
    type: "module",
    subtype: "Master’s module",
    studentSummary: "Connect acute-care nursing practice with research and development through lectures and an online written assignment.",
    status: "Coming soon",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Nursing", "Research", "Acute care"],
    academicLevel: "Master’s",
    studyLevels: ["Master"],
    deliveryMode: "Online",
    language: "English",
    languages: ["English"],
    startDate: "2026-11-16",
    endDate: "2026-12-31",
    applicationDeadline: "2026-09-06",
    dateLabel: "16 November–31 December 2026",
    ects: 4,
    eligibility: "Healthcare professionals with a healthcare degree studying at Master’s level",
    assessment: "Online written assignment",
    actionLabel: "View catalogue record",
    officialUrl: courseCatalogueUrl,
  }),
  learning({
    id: "microcredential-climate-infrastructure",
    slug: "climate-adapted-urban-infrastructure",
    title: "Climate Adapted Urban Infrastructure",
    type: "microcredential",
    subtype: "Online microcredential",
    studentSummary: "Translate climate science and policy into practical ways to assess and manage urban-infrastructure resilience.",
    fullDescription: "Official INGENIUM sources disagree on the start date and enrolment deadline. The learning opportunity is verified, but students should confirm the current registration window on the official source.",
    status: "Verification required",
    statusOverride: "Verification required",
    universityIds: ["university-xamk"],
    hostUniversityId: "university-xamk",
    countries: ["Finland"],
    themes: ["Climate adaptation", "Infrastructure", "Sustainability"],
    academicLevel: "Bachelor’s",
    studyLevels: ["Bachelor"],
    deliveryMode: "Online",
    language: "English",
    languages: ["English"],
    startDate: "2026-10-04",
    endDate: "2026-10-30",
    dateLabel: "October 2026 — official dates conflict",
    ects: 5,
    whyItMatters: "Connects the sustainable-wellbeing Pathway to practical infrastructure resilience.",
    actionLabel: "Verify course dates",
    officialUrl: courseCatalogueUrl,
  }),
  learning({
    id: "course-innovation-management-entrepreneurship",
    slug: "innovation-management-entrepreneurship",
    title: "Innovation Management and Entrepreneurship",
    type: "course",
    subtype: "Alliance-wide accelerator course",
    studentSummary: "Turn ideas into practical business value in a course developed by MTU, the University of Crete and the University of Oviedo.",
    status: "Verification required",
    universityIds: ["university-mtu", "university-uoc", "university-uniovi"],
    hostUniversityId: "university-mtu",
    themes: ["Innovation", "Entrepreneurship", "Business"],
    deliveryMode: "Virtual",
    dateLabel: "From 29 September 2026",
    startDate: "2026-09-29",
    eligibility: "Students and staff of the ten INGENIUM universities",
    whyItMatters: "Creates a shared entrepreneurship learning route across all ten universities.",
    actionLabel: "Verify registration route",
    officialUrl: courseCatalogueUrl,
    sourceId: "course-catalogue-2026",
  }),
  learning({
    id: "learning-swedish-culture-language",
    slug: "taste-swedish-culture-language",
    title: "A Taste of Swedish Culture and Language",
    type: "learning_resource",
    subtype: "Evergreen online learning resource",
    studentSummary: "Begin exploring Swedish language and culture through short online modules designed by the University of Skövde.",
    status: "Recurring",
    recurrence: "recurring",
    universityIds: ["university-hs"],
    hostUniversityId: "university-hs",
    countries: ["Sweden"],
    themes: ["Languages", "Culture", "Mobility"],
    academicLevel: "All levels",
    deliveryMode: "Virtual",
    language: "English and Swedish",
    languages: ["English", "Swedish"],
    dateLabel: "Evergreen catalogue resource",
    actionLabel: "Open learning resource",
    officialUrl: courseCatalogueUrl,
    sourceId: "course-catalogue-2026",
  }),
  learning({
    id: "opportunity-annual-education-call-2026",
    slug: "annual-education-call-2026-2027",
    title: "INGENIUM Annual Education Call 2026/2027",
    type: "opportunity",
    subtype: "Education co-creation call",
    studentSummary: "A call for staff and programme coordinators to create joint learning across the ten universities.",
    fullDescription: "The official page verifies fast-track and general routes but contains conflicting deadline summaries. The opportunity is retained with a verification-required status rather than presenting one disputed deadline as authoritative.",
    status: "Verification required",
    statusOverride: "Verification required",
    universityIds: [
      "university-mtu", "university-hka", "university-xamk", "university-hs", "university-uoc",
      "university-mus", "university-uniovi", "university-urn", "university-uda", "university-tuiasi",
    ],
    themes: ["Joint education", "Teaching innovation", "European campus"],
    academicLevel: "Staff and programme coordinators",
    applicationOpenDate: "2026-09-14",
    eligibility: "Academic staff and programme coordinators across the ten INGENIUM partners",
    actionLabel: "Verify official timeline",
    officialUrl: "https://ingenium-university.eu/iec-faculty/ingenium-annual-education-call-2026-2027/",
    sourceId: "education-call-2026",
    confidence: "High",
  }),
  learning({
    id: "programme-doctorate-wellbeing",
    slug: "joint-doctorate-innovative-strategies-wellbeing",
    title: "Joint Doctoral Programme in Innovative Strategies for Wellbeing",
    shortTitle: "Wellbeing PhD",
    type: "programme",
    subtype: "Joint doctoral programme",
    studentSummary: "An interdisciplinary doctorate connecting public health, prevention, technology and personalised wellbeing research.",
    fullDescription: "Co-developed by Ud’A, MTU and Xamk. The programme is verified, but its 21 August 2026 application deadline has passed even though the official page still displays an open label.",
    status: "Closed",
    universityIds: ["university-uda", "university-mtu", "university-xamk"],
    hostUniversityId: "university-uda",
    countries: ["Italy", "Ireland", "Finland"],
    themes: ["Wellbeing", "Public health", "Research", "Artificial intelligence"],
    academicLevel: "Doctoral",
    studyLevels: ["PhD"],
    applicationDeadline: "2026-08-21",
    availability: "The 2026 application deadline has passed",
    whyItMatters: "Connects three alliance universities around preventive, evidence-based and technology-supported wellbeing research.",
    actionLabel: "View programme",
    officialUrl: "https://ingenium-university.eu/research/joint-doctorate-programmes/joint-doctoral-programme-in-innovative-strategies-for-wellbeing/",
    sourceId: "wellbeing-doctorate-2026",
    confidence: "High",
  }),
];

export interface StudentProfile {
  id: string;
  displayName: string;
  sample: boolean;
  universityId: string;
  programmeId?: string;
  studyLevel?: string;
  year?: string;
  interests: string[];
  goals: string[];
  languages: string[];
  joinedEntityIds: string[];
  savedEntityIds: string[];
  connectionIds: string[];
}

export const sampleStudents: StudentProfile[] = [
  { id: "student-sofia", displayName: "Sofia", sample: true, universityId: "university-hka", studyLevel: "Bachelor", year: "3", interests: ["Artificial intelligence", "Communication"], goals: ["Study abroad"], languages: ["English", "German"], joinedEntityIds: ["bip-academic-communication", "bip-clarity-ai"], savedEntityIds: ["course-innovation-management-entrepreneurship"], connectionIds: ["student-emma", "student-lucas"] },
  { id: "student-emma", displayName: "Emma", sample: true, universityId: "university-mtu", studyLevel: "Bachelor", year: "4", interests: ["Software development", "Entrepreneurship"], goals: ["Build a European project"], languages: ["English"], joinedEntityIds: ["bip-academic-communication", "course-innovation-management-entrepreneurship"], savedEntityIds: ["bip-clarity-ai"], connectionIds: ["student-sofia", "student-anna"] },
  { id: "student-lucas", displayName: "Lucas", sample: true, universityId: "university-xamk", studyLevel: "Master", year: "1", interests: ["Wellbeing", "Health"], goals: ["Cross-university learning"], languages: ["English", "Finnish"], joinedEntityIds: ["course-sustainable-wellbeing", "module-acute-care-research-development"], savedEntityIds: [], connectionIds: ["student-sofia"] },
  { id: "student-anna", displayName: "Anna", sample: true, universityId: "university-uda", studyLevel: "PhD", year: "1", interests: ["Public health", "Research"], goals: ["Build a research network"], languages: ["English", "Italian"], joinedEntityIds: ["programme-doctorate-wellbeing", "project-immunobattle"], savedEntityIds: ["course-sustainable-wellbeing"], connectionIds: ["student-emma"] },
  { id: "student-maria", displayName: "Maria", sample: true, universityId: "university-tuiasi", studyLevel: "Bachelor", year: "3", interests: ["Artificial intelligence", "Critical thinking"], goals: ["Join a BIP"], languages: ["English", "Romanian"], joinedEntityIds: ["bip-clarity-ai", "bip-seismicx"], savedEntityIds: [], connectionIds: ["student-lukas"] },
  { id: "student-lukas", displayName: "Lukas", sample: true, universityId: "university-hs", studyLevel: "Master", year: "2", interests: ["Digital health", "Games"], goals: ["Meet project collaborators"], languages: ["English", "Swedish"], joinedEntityIds: ["bip-digital-health", "project-immunobattle"], savedEntityIds: [], connectionIds: ["student-maria"] },
];

export const studentEntities: Entity[] = sampleStudents.map((student) => ({
  id: student.id,
  slug: student.id,
  title: student.displayName,
  shortTitle: student.displayName,
  type: "student",
  subtype: "Sample student profile",
  studentSummary: `${student.studyLevel ?? "Student"} sample profile at ${student.universityId.replace("university-", "").toUpperCase()}.`,
  status: "Ongoing",
  universityIds: [student.universityId],
  hostUniversityId: student.universityId,
  themes: student.interests,
  academicLevel: student.studyLevel,
  language: student.languages.join(", "),
  sourceId: "partners",
  lastVerified: V15_RESEARCH_DATE,
  confidence: "High",
  dataClassification: "sample",
  whyItMatters: "Demonstrates how shared academic participation can make a European student network visible.",
}));

function relationship(
  id: string,
  source: string,
  target: string,
  type: string,
  label: string,
  explanation: string,
  dataClassification: DataClassification = "verified",
  sourceIds?: string[],
): Relationship {
  return { id, source, target, type, label, explanation, dataClassification, sourceIds };
}

const learningRelationships: Relationship[] = learningEntities.flatMap((entity) => [
  ...entity.universityIds.map((universityId) => relationship(
    `rel-${entity.id}-${universityId}`,
    entity.id,
    universityId,
    entity.hostUniversityId === universityId ? "hosted_by" : "available_through",
    entity.hostUniversityId === universityId ? "Hosted by" : "Available through",
    `${entity.title} is ${entity.hostUniversityId === universityId ? "hosted by" : "available through"} ${v14Entities.find((item) => item.id === universityId)?.title ?? "this partner"}.`,
    "verified",
    entity.sourceIds,
  )),
  relationship(`rel-${entity.id}-education-platform`, entity.id, "platform-education", "delivered_through", "Learning route", `${entity.title} is discovered through the INGENIUM learning environment or Course Catalogue; access conditions remain course-specific.`, "verified", entity.sourceIds),
]);

const studentRelationships: Relationship[] = sampleStudents.flatMap((student) => [
  relationship(`rel-${student.id}-${student.universityId}`, student.id, student.universityId, "studies_at", "Studies at", `${student.displayName} is a sample profile at this university.`, "sample"),
  ...student.joinedEntityIds.map((entityId) => relationship(`rel-${student.id}-${entityId}`, student.id, entityId, "participated_in", "Participates in", `${student.displayName} has sample participation in ${entityId}.`, "sample")),
  ...student.connectionIds.filter((target) => student.id.localeCompare(target) < 0).map((target) => relationship(`rel-${student.id}-${target}`, student.id, target, "connected_with", "Connected with", "This explicit connection is sample information used to demonstrate student network degrees.", "sample")),
]);

const v15EntityOverrides: Partial<Record<string, Partial<Entity>>> = {
  "bip-clarity-ai": {
    statusOverride: "Verification required",
    dateLabel: "October–November 2026 — official dates conflict",
    studentSummary: "A verified INGENIUM BIP in critical learning and AI whose current official pages disagree on its delivery dates.",
    fullDescription: "The detailed official page gives online activity from 5–24 October and a physical week from 2–6 November 2026, while the alliance catalogue labels the BIP as September 2026. Confirm the active schedule and home-university process before making plans.",
    lastVerified: V15_RESEARCH_DATE,
    sourceIds: ["bips-2627"],
  },
  "bip-seismicx": {
    statusOverride: "Verification required",
    studentSummary: "A verified engineering BIP whose current official schedule needs confirmation before students make travel plans.",
    fullDescription: "Current official INGENIUM information for SeismicX contains conflicting schedule details. Confirm the physical week, virtual component and local nomination deadline with the official catalogue and home university.",
    lastVerified: V15_RESEARCH_DATE,
    sourceIds: ["bips-2627"],
  },
  "programme-human-centred-ai-doctorate": {
    studentSummary: "A verified INGENIUM doctoral programme in human-centred AI whose 2026 application call has closed.",
    fullDescription: "The joint doctoral programme remains a verified INGENIUM learning route, but its stated 21 August 2026 application deadline has passed. Consult the official page for programme details and any future call.",
    availability: "The 2026 application deadline has passed",
    actionLabel: "View doctoral programme",
    lastVerified: V15_RESEARCH_DATE,
  },
};

export const records: Entity[] = [
  ...v14Entities.map((entity) => ({
    ...entity,
    ...v15EntityOverrides[entity.id],
    dataClassification: entity.dataClassification ?? "verified" as const,
  })),
  ...learningEntities,
  ...studentEntities,
];

export const networkRelationships: Relationship[] = [
  ...v14Relationships.map((item) => ({ ...item, dataClassification: item.dataClassification ?? "verified" as const })),
  ...learningRelationships,
  ...studentRelationships,
];

export const evidenceSources: Source[] = [...v14Sources, ...v15Sources];
export const recordById = new Map(records.map((record) => [record.id, record]));
export const recordBySlug = new Map(records.map((record) => [record.slug, record]));
export const evidenceById = new Map(evidenceSources.map((source) => [source.id, source]));

export interface SampleChatMessage {
  id: string;
  studentId: string;
  body: string;
  sharedRecordId?: string;
}

export interface SampleChat {
  entityId: string;
  title: string;
  messages: SampleChatMessage[];
}

export const sampleChats: SampleChat[] = [
  {
    entityId: "bip-academic-communication",
    title: "Academic Communication participants",
    messages: [
      { id: "chat-ac-1", studentId: "student-sofia", body: "Does anyone know when the first online session starts?" },
      { id: "chat-ac-2", studentId: "student-emma", body: "I found the official BIP catalogue entry. I’m checking the local MTU nomination process next.", sharedRecordId: "bip-academic-communication" },
    ],
  },
  {
    entityId: "course-sustainable-wellbeing",
    title: "Sustainable Wellbeing learners",
    messages: [
      { id: "chat-sw-1", studentId: "student-lucas", body: "Has anyone spoken with their study adviser about recognition yet?" },
      { id: "chat-sw-2", studentId: "student-anna", body: "I’m comparing this with the wellbeing doctorate research themes.", sharedRecordId: "programme-doctorate-wellbeing" },
    ],
  },
  {
    entityId: "bip-clarity-ai",
    title: "CLARITY-AI participants",
    messages: [
      { id: "chat-ai-1", studentId: "student-maria", body: "I’m travelling from Iași. Is anyone else joining the physical week?" },
      { id: "chat-ai-2", studentId: "student-sofia", body: "I saved the critical-thinking reading list and will share the official link when it appears." },
    ],
  },
];
