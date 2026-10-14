import type { DataClassification, Entity, Relationship, Source } from "./data";

export const RESEARCH_REFRESH_DATE = "2026-09-24";

export const researchRefreshSources: Source[] = [
  {
    "id": "fc-joint-phd-call-2026",
    "title": "INGENIUM launches its 2026 Call for Joint PhD Programmes",
    "kind": "Official INGENIUM call",
    "url": "https://ingenium-university.eu/ingenium-launches-its-2026-call-for-joint-phd-programmes/",
    "publisher": "INGENIUM European University",
    "published": "22 July 2026",
    "notes": "The page still uses opening language, but its 21 August 2026 deadline has passed.",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-microcredential-call-2025",
    "title": "Proposals for INGENIUM Micro-Credentials Creation",
    "kind": "Official INGENIUM call",
    "url": "https://ingenium-university.eu/iec-faculty/2025-joint-academic-offers-call-for-proposals/ingenium-micro-credentials-creation/",
    "publisher": "INGENIUM European University",
    "notes": "Historic call; full-application deadline was 14 January 2026.",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-student-partnerships-2025",
    "title": "INGENIUM Student Partnerships 2025 call document",
    "kind": "Official INGENIUM call PDF",
    "url": "https://ingenium-university.eu/wp-content/uploads/2025/03/INGENIUM-student-led-projects-2025.pdf",
    "publisher": "INGENIUM European University",
    "published": "March 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-student-partnerships-2026",
    "title": "INGENIUM Student Partnerships",
    "kind": "Official INGENIUM scheme page",
    "url": "https://ingenium-university.eu/ingenium-student-partnerships2/",
    "publisher": "INGENIUM European University",
    "notes": "The page mixes open-call wording with a passed 5 April 2026 deadline; stored as closed.",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-education-lab",
    "title": "Education Lab",
    "kind": "Official INGENIUM initiative page",
    "url": "https://ingenium-university.eu/ingenium-staff-academy-call-for-proposals/innovative-teaching/education-lab/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-staff-academy",
    "title": "INGENIUM Staff Academy",
    "kind": "Official INGENIUM initiative page",
    "url": "https://ingenium-university.eu/ingenium-staff-academy-call-for-proposals/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-healthy-campus-toolkit",
    "title": "A Healthy Campus Toolkit",
    "kind": "Official INGENIUM toolkit",
    "url": "https://ingenium-university.eu/initiatives/inclusive-university/healthy-campus/a-healthy-campus-toolkit/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-staff-academy-crete",
    "title": "INGENIUM Staff Academy in Crete",
    "kind": "Official INGENIUM news",
    "url": "https://ingenium-university.eu/ingenium-staff-academy-brought-together-educators-to-share-innovative-pedagogies-in-crete/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-joint-research-groups-call-2026",
    "title": "Call for INGENIUM Joint Research Group Cooperation Proposals",
    "kind": "Official INGENIUM call PDF",
    "url": "https://ingenium-university.eu/wp-content/uploads/2026/03/Call-for-INGENIUM-Joint-Research-Group-Cooperation-Call-final.pdf",
    "publisher": "INGENIUM European University",
    "published": "March 2026",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-eua-evaluation-2026",
    "title": "INGENIUM completes the EUA Institutional Evaluation",
    "kind": "Official INGENIUM news",
    "url": "https://ingenium-university.eu/ingenium-becomes-the-first-alliance-to-complete-the-prestigious-institutional-evaluation-of-the-european-university-association/",
    "publisher": "INGENIUM European University",
    "published": "9 July 2026",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-education-lab-projects",
    "title": "INGENIUM Joint Education Lab Projects from the first calls",
    "kind": "Official INGENIUM project index",
    "url": "https://ingenium-university.eu/ingenium-joint-education-lab-projects-from-the-first-two-calls/",
    "publisher": "INGENIUM European University",
    "published": "1 October 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-joint-academic-offers-2025",
    "title": "Joint Academic Offers Call for Proposals",
    "kind": "Official INGENIUM call",
    "url": "https://ingenium-university.eu/iec-faculty/2025-joint-academic-offers-call-for-proposals/",
    "publisher": "INGENIUM European University",
    "notes": "Page modified in August 2026 but describes deadlines ending in early 2026; treated as closed.",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-progress-report-2023",
    "title": "INGENIUM progress report 1",
    "kind": "Official INGENIUM deliverable",
    "url": "https://ingenium-university.eu/wp-content/uploads/2024/05/INGENIUM-detailed-progress-report-2023.pdf",
    "publisher": "INGENIUM European University",
    "published": "31 January 2024",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-d57-microcredentials",
    "title": "D5.7 INGENIUM Micro-Credentials and Materials",
    "kind": "Official INGENIUM deliverable",
    "url": "https://ingenium-university.eu/wp-content/uploads/2025/10/Deliverable-5.7-INGENIUM-Micro-Credentials-and-Materials.pdf",
    "publisher": "INGENIUM European University",
    "published": "31 December 2024",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-10-days-summer-2024",
    "title": "10 Days of INGENIUM Summer 2024",
    "kind": "Official INGENIUM event page",
    "url": "https://ingenium-university.eu/10-days-of-ingenium-summer-2024/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-staff-academy-webinar-2025",
    "title": "Special Edition Staff Academy webinar: Education Lab Results",
    "kind": "Official INGENIUM event page",
    "url": "https://ingenium-university.eu/event/special-edition-staff-academy-webinar/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-d82-entrepreneurship",
    "title": "D8.2 Final Report on INGENIUM entrepreneurship training",
    "kind": "Official INGENIUM deliverable",
    "url": "https://ingenium-university.eu/wp-content/uploads/2025/12/D-8.2-Resubmitted-October-2025.pdf",
    "publisher": "INGENIUM European University",
    "published": "31 October 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-apn-application-2026",
    "title": "Advanced Practice Nursing application period 2026",
    "kind": "Official INGENIUM opportunity notice",
    "url": "https://ingenium-university.eu/application-period-for-ingenium-study-program-master-of-health-care-advanced-practice-nursing-in-acute-care-is-open-until-the-21st-of-jan/",
    "publisher": "INGENIUM European University",
    "published": "14 January 2026",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-alliance-council-iasi-2026",
    "title": "INGENIUM Alliance Council meeting in Iași",
    "kind": "Official INGENIUM news",
    "url": "https://ingenium-university.eu/ingenium-charts-strategic-future-at-landmark-alliance-council-meeting-in-iasi/",
    "publisher": "INGENIUM European University",
    "published": "26 January 2026",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-education-lab-call-2024",
    "title": "INGENIUM Education Lab Call for Joint Projects",
    "kind": "Official INGENIUM call PDF",
    "url": "https://ingenium-university.eu/educationlab/wp-content/uploads/2024/08/2024_JointProject_Call.pdf",
    "publisher": "INGENIUM European University",
    "published": "2024",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-staff-academy-call-2025",
    "title": "Call for INGENIUM Staff Academy",
    "kind": "Official INGENIUM call",
    "url": "https://ingenium-university.eu/call-for-ingenium-staff-academy-submit-your-proposal-by-march-31st/",
    "publisher": "INGENIUM European University",
    "published": "27 February 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-d21-campus-obstacles",
    "title": "Report on obstacles to the INGENIUM Inter-University Campus",
    "kind": "Official INGENIUM deliverable",
    "url": "https://ingenium-university.eu/wp-content/uploads/2024/05/Report-on-identified-obstacles-Inter-University-Campus.pdf",
    "publisher": "INGENIUM European University",
    "published": "29 February 2024",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-d55-staff-academy",
    "title": "D5.5 INGENIUM Staff Academy Workshops 4-5",
    "kind": "Official INGENIUM deliverable",
    "url": "https://ingenium-university.eu/wp-content/uploads/2025/12/Deliverable-5.5-INGENIUM-Staff-Academy_compressed.pdf",
    "publisher": "INGENIUM European University",
    "published": "31 October 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-10-days-xamk-2025",
    "title": "10 Days of INGENIUM Winter 2025 at Xamk",
    "kind": "Official INGENIUM event page",
    "url": "https://ingenium-university.eu/10-days-of-ingenium-winter-2025/10-days-of-ingenium-2025-xamk/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-research-groups-results-2024",
    "title": "URN announces selected projects from the INGENIUM Research Groups Call",
    "kind": "Official INGENIUM results announcement",
    "url": "https://ingenium-university.eu/ingenium-call-for-proposals-rouen-selected-projects-annoucement/",
    "publisher": "INGENIUM European University",
    "published": "18 April 2024",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-rethinking-assessment",
    "title": "Rethinking Assessment in Higher Education",
    "kind": "Official INGENIUM course page",
    "url": "https://ingenium-university.eu/courses/rethinking-assessment-in-higher-education-inclusive-feedback-rich-and-ai-supported-practices/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-d72-sdg-modules",
    "title": "D7.2 SDG course modules",
    "kind": "Official INGENIUM deliverable",
    "url": "https://ingenium-university.eu/wp-content/uploads/2025/07/Deliverable-7.2-Delivered-30-June-2025.pdf",
    "publisher": "INGENIUM European University",
    "published": "30 June 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-healthy-campus",
    "title": "Healthy Campus",
    "kind": "Official INGENIUM initiative page",
    "url": "https://ingenium-university.eu/initiatives/inclusive-university/healthy-campus/",
    "publisher": "INGENIUM European University",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-inclusion-webinar-2026",
    "title": "Webinar: Invisible Challenges — INGENIUM Inclusion Month",
    "kind": "Official INGENIUM event page",
    "url": "https://ingenium-university.eu/event/webinar-invisible-challenges-ingenium-inclusion-month/",
    "publisher": "INGENIUM European University",
    "published": "10 March 2026",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-d54-staff-academy",
    "title": "D5.4 INGENIUM Staff Academy Workshops 2-3",
    "kind": "Official INGENIUM deliverable",
    "url": "https://ingenium-university.eu/wp-content/uploads/2025/12/Deliverable-5.4-INGENIUM-Staff-Academy_compressed.pdf",
    "publisher": "INGENIUM European University",
    "published": "31 October 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-ilanet-2026",
    "title": "Introducing ILANET: the INGENIUM Language Network",
    "kind": "Official HKA news",
    "url": "https://www.h-ka.de/en/ingenium/news/details-page-news-ingenium/artikel/introducing-ilanet-the-ingenium-language-network",
    "publisher": "Karlsruhe University of Applied Sciences",
    "published": "2 December 2026",
    "notes": "The official page is future-dated relative to the 24 September 2026 retrieval date; claims are retained but marked verification required.",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-cornerstone-language-2026",
    "title": "The Cornerstone INGENIUM foreign language course ended with certificates",
    "kind": "Official MUS news",
    "url": "https://mu-sofia.bg/en/the-cornerstone-ingenium-foreign-language-course-for-academic-and-administrative-staff-ended-with-certificates",
    "publisher": "Medical University Sofia",
    "published": "2 April 2026",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-dental-plate-2025",
    "title": "TUIASI students continue the Dental Ergonomic Plate project",
    "kind": "Official TUIASI news",
    "url": "https://international.tuiasi.ro/tuiasi-students-continue-ingenium-collaboration-in-cork-with-the-dental-ergonomic-plate-project",
    "publisher": "Gheorghe Asachi Technical University of Iași",
    "published": "16 October 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-ingenium-ed-2026",
    "title": "INGENIUM-ED: preparing the next generation of Joint European Study Programmes",
    "kind": "Official TUIASI news",
    "url": "https://www.tuiasi.ro/news/ingenium-ed-the-ingenium-alliance-is-preparing-the-new-generation-of-joint-european-study-programmes/",
    "publisher": "Gheorghe Asachi Technical University of Iași",
    "notes": "Official partner page; project is funded for 36 months through December 2029.",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-phd-scholarships-results",
    "title": "Results of the first INGENIUM PhD mobility scholarship call",
    "kind": "Official University of Crete/INGENIUM results page",
    "url": "https://ingenium-web2.admin.uoc.gr/ingenium-main-site/announcement-of-the-results-of-the-first-call-for-ingenium",
    "publisher": "University of Crete",
    "notes": "Twenty-two proposals were approved; the page does not expose a clear publication date.",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-uda-design-contest-2026",
    "title": "INGENIUM ideas contest for new university gadgets and Erasmus UdA logo",
    "kind": "Official UdA call",
    "url": "https://www.unich.it/avvisi/concorso-di-idee-ingenium-disegna-i-nuovi-gadget-e-il-logo-erasmus-uda",
    "publisher": "University G. d’Annunzio of Chieti–Pescara",
    "published": "12 June 2026",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-next-ingenium-2026",
    "title": "INGENIUM secures two more years of Erasmus+ funding",
    "kind": "Official Xamk news",
    "url": "https://www.xamk.fi/en/ingenium-secures-two-more-years-of-erasmus-funding-for-its-next-phase",
    "publisher": "South-Eastern Finland University of Applied Sciences",
    "published": "20 July 2026",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-healthy-campus-guidelines",
    "title": "INGENIUM Healthy Campus guidelines",
    "kind": "Official Xamk article",
    "url": "https://next.xamk.fi/uutta-luomassa/ingenium-healthy-campus-guidelines-are-calling-for-a-whole-campus-approach-to-promote-wellbeing",
    "publisher": "South-Eastern Finland University of Applied Sciences",
    "published": "18 September 2024",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-best-new-media-2025",
    "title": "The Best New Media Teaching Practices — INGENIUM Call for Ideas",
    "kind": "Official TUIASI call",
    "url": "https://international.tuiasi.ro/ingenium-call-best-new-media-education",
    "publisher": "Gheorghe Asachi Technical University of Iași",
    "published": "12 June 2025",
    "verifiedAt": "2026-09-24"
  },
  {
    "id": "fc-munster-statement-2025",
    "title": "The Munster Statement on the Principles of Research Ethics and Research Integrity",
    "kind": "Official MTU repository publication",
    "url": "https://sword.mtu.ie/ingenium_dissemination/1/",
    "publisher": "Munster Technological University",
    "published": "2025",
    "verifiedAt": "2026-09-24",
    "notes": "Openly licensed alliance output developed by the MARIE project, funded through the INGENIUM Research Groups 2024 call."
  }
];

type RefreshEntityInput = Omit<Entity, "lastVerified" | "dataClassification" | "confidence"> & {
  confidence?: Entity["confidence"];
  dataClassification?: DataClassification;
};

function refreshEntity(input: RefreshEntityInput): Entity {
  return {
    ...input,
    lastVerified: RESEARCH_REFRESH_DATE,
    confidence: input.confidence ?? "High",
    dataClassification: input.dataClassification ?? "verified",
    sourceIds: input.sourceIds ?? [input.sourceId],
  };
}

export const researchRefreshEntities: Entity[] = [
  {
    "id": "opportunity-joint-phd-call-2026",
    "slug": "joint-phd-call-2026",
    "title": "INGENIUM Joint PhD Programmes Call 2026",
    "type": "opportunity",
    "subtype": "Joint doctoral admissions call",
    "studentSummary": "The 2026 alliance-wide admissions call covered Earth and Planetary Sciences, Human-Centred AI, and Innovative Strategies for Wellbeing.",
    "fullDescription": "Applications closed on 21 August 2026. The call described international co-supervision, mobility and funded doctoral positions, with programmes due to start on 2 November 2026.",
    "status": "Closed",
    "availability": "2026 application window closed",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Doctoral study",
      "Research",
      "Mobility"
    ],
    "academicLevel": "Doctoral",
    "deliveryMode": "International joint supervision and mobility",
    "applicationDeadline": "2026-08-21",
    "startDate": "2026-11-02",
    "language": "English",
    "funding": "Funded doctoral positions and funded mobility; allocation varies by programme",
    "actionLabel": "View the archived call",
    "officialUrl": "https://ingenium-university.eu/ingenium-launches-its-2026-call-for-joint-phd-programmes/",
    "sourceId": "fc-joint-phd-call-2026",
    "confidence": "High"
  },
  {
    "id": "opportunity-microcredential-proposals-2025",
    "slug": "microcredential-proposals-2025",
    "title": "INGENIUM Micro-Credentials Creation Call 2025/2026",
    "type": "opportunity",
    "subtype": "Academic development call",
    "studentSummary": "A closed call invited educators and RDI professionals to create alliance micro-credentials and reusable learning materials.",
    "status": "Closed",
    "availability": "Full applications closed 14 January 2026",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Micro-credentials",
      "Teaching innovation",
      "Lifelong learning"
    ],
    "applicationDeadline": "2026-01-14",
    "eligibility": "Educators and education/RDI professionals; priority for INGENIUM research teams, Education Lab projects and Staff Academy initiatives",
    "actionLabel": "View the archived call",
    "officialUrl": "https://ingenium-university.eu/iec-faculty/2025-joint-academic-offers-call-for-proposals/ingenium-micro-credentials-creation/",
    "sourceId": "fc-microcredential-call-2025",
    "confidence": "High"
  },
  {
    "id": "opportunity-student-partnerships-call-2025",
    "slug": "student-partnerships-call-2025",
    "title": "INGENIUM Student Partnerships Call 2025",
    "type": "opportunity",
    "subtype": "Student seed-funding call",
    "studentSummary": "The 2025 call offered student teams up to €10,000 for cross-alliance projects involving multiple INGENIUM universities.",
    "status": "Completed",
    "availability": "Call and funded-project period completed",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Student projects",
      "Seed funding",
      "International collaboration"
    ],
    "applicationOpenDate": "2025-03-18",
    "applicationDeadline": "2025-05-11",
    "startDate": "2025-06-01",
    "endDate": "2025-12-15",
    "funding": "Up to €10,000 per project",
    "eligibility": "Bachelor, Master, PhD and eligible lifelong-learning students or recognised student organisations",
    "deliveryMode": "On-site, online or hybrid",
    "actionLabel": "View the 2025 call document",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2025/03/INGENIUM-student-led-projects-2025.pdf",
    "sourceId": "fc-student-partnerships-2025",
    "confidence": "High"
  },
  {
    "id": "opportunity-student-partnerships-call-2026",
    "slug": "student-partnerships-call-2026",
    "title": "INGENIUM Student Partnerships Call 2026",
    "type": "opportunity",
    "subtype": "Student seed-funding call",
    "studentSummary": "The 2026 call funded student-led projects proposed by teams spanning at least three alliance universities.",
    "status": "Closed",
    "availability": "Application deadline passed; six funded projects are represented separately",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Student projects",
      "Seed funding",
      "International collaboration"
    ],
    "applicationDeadline": "2026-04-05",
    "funding": "Up to €10,000 per project",
    "eligibility": "Students or student organisations from at least three INGENIUM partner universities",
    "actionLabel": "View the 2026 scheme page",
    "officialUrl": "https://ingenium-university.eu/ingenium-student-partnerships2/",
    "sourceId": "fc-student-partnerships-2026",
    "confidence": "High"
  },
  {
    "id": "opportunity-joint-academic-offers-call-2025",
    "slug": "joint-academic-offers-call-2025",
    "title": "Joint Academic Offers Call for Proposals 2025/2026",
    "type": "opportunity",
    "subtype": "Alliance academic-development call",
    "studentSummary": "A multi-route call supported joint degrees, PhDs, micro-credentials, BIPs, collaborative teaching and catalogue courses.",
    "status": "Closed",
    "availability": "The published development deadlines ended in January 2026",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Joint programmes",
      "Collaborative teaching",
      "BIPs",
      "Micro-credentials"
    ],
    "applicationOpenDate": "2025-01-01",
    "applicationDeadline": "2026-01-23",
    "funding": "Seed funding and co-funding for development, mobility and pilot delivery",
    "eligibility": "Academic staff across all partner universities; student participation encouraged",
    "actionLabel": "View the archived call",
    "officialUrl": "https://ingenium-university.eu/iec-faculty/2025-joint-academic-offers-call-for-proposals/",
    "sourceId": "fc-joint-academic-offers-2025",
    "confidence": "High"
  },
  {
    "id": "opportunity-joint-research-groups-call-2026",
    "slug": "joint-research-groups-call-2026",
    "title": "INGENIUM Joint Research Group Cooperation Call 2026",
    "type": "opportunity",
    "subtype": "Doctoral-ecosystem cooperation call",
    "studentSummary": "A closed 2026 call supported groups from at least three universities to create shared doctoral and early-career training activities.",
    "status": "Closed",
    "availability": "Applications closed; funded activity may continue through 8 November 2026",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Research groups",
      "Doctoral training",
      "Early-career researchers"
    ],
    "applicationDeadline": "2026-04-19",
    "startDate": "2026-05-01",
    "endDate": "2026-11-08",
    "funding": "Generally up to €10,000 per project",
    "eligibility": "Doctoral candidates, early-career researchers and academic staff involved in doctoral training",
    "actionLabel": "View the official call",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2026/03/Call-for-INGENIUM-Joint-Research-Group-Cooperation-Call-final.pdf",
    "sourceId": "fc-joint-research-groups-call-2026",
    "confidence": "High"
  },
  {
    "id": "opportunity-education-lab-call-2024",
    "slug": "education-lab-call-2024",
    "title": "INGENIUM Education Lab Joint Projects Call 2024",
    "type": "opportunity",
    "subtype": "Teaching-innovation project call",
    "studentSummary": "The 2024 Education Lab call supported multi-university teams developing innovative teaching methods, courses and educational products.",
    "status": "Completed",
    "availability": "2024 call completed",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Teaching innovation",
      "Co-creation",
      "Education Lab"
    ],
    "applicationOpenDate": "2024-09-02",
    "applicationDeadline": "2024-10-14",
    "eligibility": "Faculty and education, teaching and RDI specialists; each project needed at least two partner universities",
    "actionLabel": "View the 2024 call",
    "officialUrl": "https://ingenium-university.eu/educationlab/wp-content/uploads/2024/08/2024_JointProject_Call.pdf",
    "sourceId": "fc-education-lab-call-2024",
    "confidence": "High"
  },
  {
    "id": "opportunity-staff-academy-call-2025",
    "slug": "staff-academy-call-2025",
    "title": "INGENIUM Staff Academy Call 2025 — Crete",
    "type": "opportunity",
    "subtype": "Staff teaching-practice call",
    "studentSummary": "A closed call invited staff to propose innovative pedagogical sessions for the May 2025 Staff Academy in Crete.",
    "status": "Completed",
    "availability": "Submission and event dates have passed",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uoc",
    "countries": [
      "Greece"
    ],
    "city": "Crete",
    "themes": [
      "Staff development",
      "Teaching innovation",
      "Pedagogy"
    ],
    "applicationDeadline": "2025-03-31",
    "startDate": "2025-05-19",
    "endDate": "2025-05-23",
    "eligibility": "Staff at INGENIUM universities",
    "actionLabel": "View the archived call",
    "officialUrl": "https://ingenium-university.eu/call-for-ingenium-staff-academy-submit-your-proposal-by-march-31st/",
    "sourceId": "fc-staff-academy-call-2025",
    "confidence": "High"
  },
  {
    "id": "opportunity-best-new-media-practices-2025",
    "slug": "best-new-media-practices-2025",
    "title": "Best New Media Teaching Practices Call 2025",
    "type": "opportunity",
    "subtype": "Teaching-innovation ideas competition",
    "studentSummary": "Educators and young innovators submitted digital and participatory-learning ideas for presentation during 10 Days of INGENIUM 2026.",
    "status": "Completed",
    "availability": "Submissions closed 30 September 2025; winners were due in November 2025",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Digital teaching",
      "Participatory learning",
      "Young innovators"
    ],
    "applicationDeadline": "2025-09-30",
    "eligibility": "Alliance educators plus students and young staff aged 18–25",
    "funding": "Prize trip to 10 Days of INGENIUM 2026 with travel and accommodation covered",
    "actionLabel": "View the archived call",
    "officialUrl": "https://next.xamk.fi/uutta-luomassa/ingenium-healthy-campus-guidelines-are-calling-for-a-whole-campus-approach-to-promote-wellbeing",
    "sourceId": "fc-best-new-media-2025",
    "confidence": "High"
  },
  {
    "id": "opportunity-apn-application-2026",
    "slug": "advanced-practice-nursing-application-2026",
    "title": "Advanced Practice Nursing 2026 Application Window",
    "type": "opportunity",
    "subtype": "Joint master’s application round",
    "studentSummary": "The January 2026 application round covered the alliance-developed Master of Health Care in Advanced Practice Nursing in Acute Care.",
    "status": "Closed",
    "availability": "Applications closed 21 January 2026 at 15:00",
    "universityIds": [
      "university-xamk",
      "university-mus"
    ],
    "hostUniversityId": "university-xamk",
    "countries": [
      "Finland",
      "Bulgaria"
    ],
    "themes": [
      "Nursing",
      "Acute care",
      "Joint education"
    ],
    "academicLevel": "Master’s",
    "applicationOpenDate": "2026-01-07",
    "applicationDeadline": "2026-01-21",
    "eligibility": "Qualified nurses seeking advanced acute-care expertise",
    "actionLabel": "View the archived application notice",
    "officialUrl": "https://ingenium-university.eu/application-period-for-ingenium-study-program-master-of-health-care-advanced-practice-nursing-in-acute-care-is-open-until-the-21st-of-jan/",
    "sourceId": "fc-apn-application-2026",
    "confidence": "High"
  },
  {
    "id": "opportunity-uda-design-contest-2026",
    "slug": "uda-ingenium-design-contest-2026",
    "title": "UdA INGENIUM Gadget and Erasmus Logo Design Contest 2026",
    "type": "opportunity",
    "subtype": "Student design competition",
    "studentSummary": "UdA invited eligible design students to create international-student merchandise concepts and a new Erasmus UdA logo.",
    "status": "Closed",
    "availability": "Submission deadline passed; a results document is linked from the official page",
    "universityIds": [
      "university-uda"
    ],
    "hostUniversityId": "university-uda",
    "countries": [
      "Italy"
    ],
    "themes": [
      "Design",
      "Competition",
      "Student creativity"
    ],
    "applicationDeadline": "2026-07-06",
    "eligibility": "UdA students enrolled in the 2025/26 Bachelor in Design or Master in Eco Inclusive Design",
    "funding": "€1,000 gross prize for the winner",
    "language": "Italian",
    "actionLabel": "View the contest and results",
    "officialUrl": "https://www.unich.it/avvisi/concorso-di-idee-ingenium-disegna-i-nuovi-gadget-e-il-logo-erasmus-uda",
    "sourceId": "fc-uda-design-contest-2026",
    "confidence": "High"
  },
  {
    "id": "opportunity-phd-scholarships-results-2024",
    "slug": "phd-scholarships-results-first-call",
    "title": "First INGENIUM PhD Mobility Scholarship Results",
    "type": "opportunity",
    "subtype": "Doctoral mobility call results",
    "studentSummary": "The first alliance scholarship round approved 22 PhD mobility and research-stay proposals.",
    "status": "Completed",
    "availability": "Historic results; the publication date is not exposed on the page",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Doctoral mobility",
      "Research stays",
      "Scholarships"
    ],
    "academicLevel": "Doctoral",
    "funding": "Scholarship support for mobility and research stays; individual amounts not stated on the results page",
    "actionLabel": "View the official results",
    "officialUrl": "https://ingenium-web2.admin.uoc.gr/ingenium-main-site/announcement-of-the-results-of-the-first-call-for-ingenium",
    "sourceId": "fc-phd-scholarships-results",
    "confidence": "Medium"
  },
  {
    "id": "initiative-education-lab",
    "slug": "education-lab",
    "title": "INGENIUM Education Lab",
    "type": "initiative",
    "subtype": "Decentralised teaching and learning network",
    "studentSummary": "A cross-alliance space for faculty, students, RDI specialists and external stakeholders to co-create and test teaching innovations.",
    "status": "Ongoing",
    "availability": "Operational initiative; individual calls open and close by edition",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Teaching innovation",
      "Co-creation",
      "RDI"
    ],
    "workPackage": "WP5",
    "funding": "Selected joint projects can receive up to €20,000 per university under published calls",
    "actionLabel": "Explore the Education Lab",
    "officialUrl": "https://ingenium-university.eu/ingenium-staff-academy-call-for-proposals/innovative-teaching/education-lab/",
    "sourceId": "fc-education-lab",
    "confidence": "High",
    "featured": true
  },
  {
    "id": "initiative-staff-academy",
    "slug": "staff-academy",
    "title": "INGENIUM Staff Academy",
    "type": "initiative",
    "subtype": "Alliance staff-development programme",
    "studentSummary": "A recurring programme of workshops and webinars where educators exchange and develop innovative pedagogical practice.",
    "status": "Recurring",
    "availability": "Recurring alliance programme; event-specific calls and dates vary",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Staff development",
      "Pedagogy",
      "Professional learning"
    ],
    "recurrence": "recurring",
    "actionLabel": "Explore Staff Academy",
    "officialUrl": "https://ingenium-university.eu/ingenium-staff-academy-call-for-proposals/",
    "sourceId": "fc-staff-academy",
    "confidence": "High",
    "featured": true
  },
  {
    "id": "initiative-healthy-campus",
    "slug": "healthy-campus",
    "title": "INGENIUM Healthy Campus",
    "type": "initiative",
    "subtype": "Whole-campus wellbeing framework",
    "studentSummary": "A shared alliance approach for embedding health and wellbeing across teaching, services, environments and campus culture.",
    "status": "Ongoing",
    "availability": "Guidelines and toolkit are published; implementation maturity varies by university",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Wellbeing",
      "Inclusion",
      "Campus life"
    ],
    "workPackage": "WP9",
    "actionLabel": "Explore Healthy Campus",
    "officialUrl": "https://ingenium-university.eu/initiatives/inclusive-university/healthy-campus/",
    "sourceId": "fc-healthy-campus",
    "sourceIds": [
      "fc-healthy-campus",
      "fc-healthy-campus-guidelines",
      "fc-healthy-campus-toolkit"
    ],
    "confidence": "High",
    "featured": true
  },
  {
    "id": "initiative-ilanet-language-network",
    "slug": "ilanet-language-network",
    "title": "ILANET — INGENIUM Language Network",
    "type": "initiative",
    "subtype": "Alliance language-learning network",
    "studentSummary": "An alliance network connecting pre-mobility language courses with a reciprocal linguistic-tandem programme for students and staff.",
    "fullDescription": "An official HKA page says ILANET was created in November 2025 and is operational, but that page is dated 2 December 2026—after this research cut-off. The entity is retained with verification required.",
    "status": "Verification required",
    "availability": "Official operational claim is future-dated relative to the research cut-off",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Languages",
      "Mobility",
      "Intercultural learning"
    ],
    "deliveryMode": "Online courses and peer tandems",
    "eligibility": "INGENIUM students and staff",
    "actionLabel": "View official network description",
    "officialUrl": "https://www.h-ka.de/en/ingenium/news/details-page-news-ingenium/artikel/introducing-ilanet-the-ingenium-language-network",
    "sourceId": "fc-ilanet-2026",
    "confidence": "Medium"
  },
  {
    "id": "initiative-eua-institutional-evaluation-2026",
    "slug": "eua-institutional-evaluation-2026",
    "title": "EUA Institutional Evaluation of INGENIUM",
    "type": "initiative",
    "subtype": "Alliance-wide institutional evaluation",
    "studentSummary": "INGENIUM completed the European University Association Institutional Evaluation Programme and received the EUA-IEP evaluation seal.",
    "status": "Completed",
    "availability": "Evaluation complete; final report referenced through DEQAR",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Quality assurance",
      "Governance",
      "European integration"
    ],
    "endDate": "2026-04-10",
    "actionLabel": "Read the official milestone report",
    "officialUrl": "https://ingenium-university.eu/ingenium-becomes-the-first-alliance-to-complete-the-prestigious-institutional-evaluation-of-the-european-university-association/",
    "sourceId": "fc-eua-evaluation-2026",
    "confidence": "High"
  },
  {
    "id": "project-education-lab-cohorts-2024-2025",
    "slug": "education-lab-projects-2024-2025",
    "title": "INGENIUM Joint Education Lab Projects — 2024 and 2025 Cohorts",
    "type": "project",
    "subtype": "Portfolio of funded teaching-innovation projects",
    "studentSummary": "The first Education Lab cohorts produced micro-credentials, VR and STEAM activities, COIL resources, sustainability reporting, leadership and health-promotion learning.",
    "status": "Ongoing",
    "availability": "Selected projects and outputs are published; project-level dates vary",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Teaching innovation",
      "Micro-credentials",
      "Digital learning"
    ],
    "actionLabel": "Explore the selected projects",
    "officialUrl": "https://ingenium-university.eu/ingenium-joint-education-lab-projects-from-the-first-two-calls/",
    "sourceId": "fc-education-lab-projects",
    "confidence": "High"
  },
  {
    "id": "project-dental-ergonomic-plate",
    "slug": "dental-ergonomic-plate",
    "title": "Dental Ergonomic Plate",
    "type": "project",
    "subtype": "INGENIUM Student Partnership",
    "studentSummary": "Engineering and dental students from TUIASI, MUS and MTU are co-designing a wearable instrument plate for more efficient and comfortable clinical work.",
    "status": "Verification required",
    "availability": "Two 2025 development stages are documented; the final prototype and present status are not yet confirmed",
    "universityIds": [
      "university-tuiasi",
      "university-mus",
      "university-mtu"
    ],
    "hostUniversityId": "university-tuiasi",
    "countries": [
      "Romania",
      "Bulgaria",
      "Ireland"
    ],
    "themes": [
      "Dental medicine",
      "Engineering design",
      "Prototyping"
    ],
    "startDate": "2025-07-01",
    "endDate": "2025-10-11",
    "actionLabel": "View the project update",
    "officialUrl": "https://international.tuiasi.ro/tuiasi-students-continue-ingenium-collaboration-in-cork-with-the-dental-ergonomic-plate-project",
    "sourceId": "fc-dental-plate-2025",
    "confidence": "Medium"
  },
  {
    "id": "project-ingenium-ed",
    "slug": "ingenium-ed",
    "title": "INGENIUM-ED",
    "shortTitle": "INGENIUM-ED",
    "type": "project",
    "subtype": "European Degree Label alignment project",
    "studentSummary": "A 36-month project coordinating alliance joint programmes with the emerging Joint European Degree Label criteria.",
    "status": "Upcoming",
    "availability": "Funding confirmed; runs for 36 months through December 2029",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uniovi",
    "themes": [
      "European Degree",
      "Joint programmes",
      "Student support"
    ],
    "endDate": "2029-12-31",
    "funding": "Funded project; amount not stated on the official partner page",
    "whyItMatters": "Targets adapted and newly designed joint programmes and support for at least 200 students, including underrepresented learners.",
    "actionLabel": "Read the official project announcement",
    "officialUrl": "https://www.tuiasi.ro/news/ingenium-ed-the-ingenium-alliance-is-preparing-the-new-generation-of-joint-european-study-programmes/",
    "sourceId": "fc-ingenium-ed-2026",
    "confidence": "High",
    "featured": true
  },
  {
    "id": "project-next-ingenium",
    "slug": "next-ingenium",
    "title": "Next INGENIUM",
    "type": "project",
    "subtype": "Next Erasmus+ alliance phase",
    "studentSummary": "The funded next phase aims to deepen academic, legal and operational integration through December 2028.",
    "status": "Upcoming",
    "availability": "Funding selected in July 2026; the exact operational start date is not stated",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uniovi",
    "themes": [
      "Alliance integration",
      "European Campus",
      "Mobility",
      "Joint education"
    ],
    "endDate": "2028-12-31",
    "funding": "Approximately €7.2 million in Erasmus+ support",
    "whyItMatters": "Published targets include seven joint programmes with enrolled students, more than twenty pathways, twenty micro-credentials, over one hundred catalogue courses and about three thousand mobility experiences by end-2028.",
    "actionLabel": "Read the funding announcement",
    "officialUrl": "https://www.xamk.fi/en/ingenium-secures-two-more-years-of-erasmus-funding-for-its-next-phase",
    "sourceId": "fc-next-ingenium-2026",
    "confidence": "High",
    "featured": true
  },
  {
    "id": "initiative-ingenium-egtc",
    "slug": "ingenium-egtc",
    "title": "INGENIUM European Grouping of Territorial Cooperation",
    "shortTitle": "INGENIUM EGTC",
    "type": "initiative",
    "subtype": "Planned permanent legal entity",
    "studentSummary": "INGENIUM is preparing an EGTC to give the alliance legal personality for contracts, staffing, property and direct funding access.",
    "status": "Under development",
    "availability": "Statutes approved; national authorisations underway; operational launch not verified",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-xamk",
    "countries": [
      "Finland"
    ],
    "themes": [
      "Governance",
      "Legal entity",
      "Long-term sustainability"
    ],
    "actionLabel": "Read the official status update",
    "officialUrl": "https://www.xamk.fi/en/ingenium-secures-two-more-years-of-erasmus-funding-for-its-next-phase",
    "sourceId": "fc-next-ingenium-2026",
    "confidence": "High"
  },
  {
    "id": "initiative-annual-education-cycle",
    "slug": "annual-education-cycle",
    "title": "INGENIUM Annual Education Cycle",
    "type": "initiative",
    "subtype": "Recurring joint-education development process",
    "studentSummary": "A planned annual process will identify skills needs, call for joint education, support co-design through Staff Academy and review delivery at an annual conference.",
    "status": "Planned",
    "availability": "First full cycle is planned for academic year 2027/2028",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Joint education",
      "Skills needs",
      "Co-design"
    ],
    "startDate": "2027-09-01",
    "endDate": "2028-08-31",
    "actionLabel": "Read the Next INGENIUM description",
    "officialUrl": "https://www.xamk.fi/en/ingenium-secures-two-more-years-of-erasmus-funding-for-its-next-phase",
    "sourceId": "fc-next-ingenium-2026",
    "confidence": "High"
  },
  {
    "id": "event-staff-academy-crete-2025",
    "slug": "staff-academy-crete-2025",
    "title": "INGENIUM Staff Academy — Crete 2025",
    "type": "event",
    "subtype": "Staff Academy workshop",
    "studentSummary": "Educators from across the alliance met in Crete to exchange and develop innovative teaching practices.",
    "status": "Completed",
    "availability": "Historical event",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uoc",
    "countries": [
      "Greece"
    ],
    "city": "Crete",
    "themes": [
      "Pedagogy",
      "Peer learning",
      "Staff development"
    ],
    "startDate": "2025-05-20",
    "endDate": "2025-05-22",
    "dateLabel": "20–22 May 2025",
    "actionLabel": "Read the event report",
    "officialUrl": "https://ingenium-university.eu/ingenium-staff-academy-brought-together-educators-to-share-innovative-pedagogies-in-crete/",
    "sourceId": "fc-staff-academy-crete",
    "sourceIds": [
      "fc-staff-academy-crete",
      "fc-staff-academy-call-2025"
    ],
    "confidence": "High"
  },
  {
    "id": "event-staff-academy-webinar-results-2025",
    "slug": "staff-academy-education-lab-results-2025",
    "title": "Staff Academy Webinar — Education Lab Results",
    "type": "event",
    "subtype": "Special-edition webinar",
    "studentSummary": "A special Staff Academy webinar showcased Education Lab work on disruptive media, student leadership and sustainability-reporting skills.",
    "status": "Completed",
    "availability": "Historical online event",
    "universityIds": [
      "university-xamk",
      "university-mtu",
      "university-urn",
      "university-hs",
      "university-tuiasi",
      "university-uniovi",
      "university-uda",
      "university-uoc"
    ],
    "hostUniversityId": "university-xamk",
    "themes": [
      "Education Lab",
      "Teaching innovation",
      "Knowledge sharing"
    ],
    "deliveryMode": "Online via Zoom",
    "startDate": "2025-12-02",
    "endDate": "2025-12-02",
    "dateLabel": "2 December 2025",
    "actionLabel": "View the event page",
    "officialUrl": "https://ingenium-university.eu/event/special-edition-staff-academy-webinar/",
    "sourceId": "fc-staff-academy-webinar-2025",
    "confidence": "High"
  },
  {
    "id": "event-10-days-summer-2024",
    "slug": "10-days-summer-2024",
    "title": "10 Days of INGENIUM — Summer 2024",
    "type": "event",
    "subtype": "Third edition of 10 Days of INGENIUM",
    "studentSummary": "The third edition combined schools, Staff Academy and Science Factory activity in Iași and Rouen.",
    "status": "Completed",
    "availability": "Historical event",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-tuiasi",
    "countries": [
      "Romania",
      "France"
    ],
    "city": "Iași and Rouen",
    "themes": [
      "Design thinking",
      "Sustainability",
      "Research and education"
    ],
    "startDate": "2024-05-20",
    "endDate": "2024-05-31",
    "dateLabel": "20–31 May 2024",
    "actionLabel": "Explore the 2024 edition",
    "officialUrl": "https://ingenium-university.eu/10-days-of-ingenium-summer-2024/",
    "sourceId": "fc-10-days-summer-2024",
    "confidence": "High"
  },
  {
    "id": "event-10-days-winter-xamk-2025",
    "slug": "10-days-winter-xamk-2025",
    "title": "10 Days of INGENIUM — Xamk Winter 2025",
    "type": "event",
    "subtype": "10 Days of INGENIUM edition",
    "studentSummary": "Xamk hosted a Junior Winter School, Staff Academy and WP4/WP7/WP9 meetings during the February 2025 edition.",
    "status": "Completed",
    "availability": "Historical event",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-xamk",
    "countries": [
      "Finland"
    ],
    "themes": [
      "Student learning",
      "Staff development",
      "Alliance collaboration"
    ],
    "startDate": "2025-02-10",
    "endDate": "2025-02-14",
    "dateLabel": "10–14 February 2025",
    "actionLabel": "Explore the edition",
    "officialUrl": "https://ingenium-university.eu/10-days-of-ingenium-winter-2025/10-days-of-ingenium-2025-xamk/",
    "sourceId": "fc-10-days-xamk-2025",
    "confidence": "High"
  },
  {
    "id": "event-alliance-council-iasi-2026",
    "slug": "alliance-council-iasi-2026",
    "title": "INGENIUM Alliance Council Meeting — Iași 2026",
    "type": "event",
    "subtype": "Alliance governance meeting",
    "studentSummary": "Alliance leaders and the restructured Student Board agreed the Next INGENIUM concept and strategic integration priorities.",
    "status": "Completed",
    "availability": "Historical governance meeting",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-tuiasi",
    "countries": [
      "Romania"
    ],
    "city": "Iași",
    "themes": [
      "Governance",
      "Next INGENIUM",
      "European integration"
    ],
    "startDate": "2026-01-26",
    "endDate": "2026-01-26",
    "dateLabel": "26 January 2026",
    "actionLabel": "Read the meeting report",
    "officialUrl": "https://ingenium-university.eu/ingenium-charts-strategic-future-at-landmark-alliance-council-meeting-in-iasi/",
    "sourceId": "fc-alliance-council-iasi-2026",
    "confidence": "High"
  },
  {
    "id": "event-invisible-challenges-2026",
    "slug": "invisible-challenges-webinar-2026",
    "title": "Invisible Challenges — INGENIUM Inclusion Month Webinar",
    "type": "event",
    "subtype": "Student wellbeing webinar",
    "studentSummary": "A student-focused discussion explored invisible challenges including grief, anxiety, chronic pain, loneliness and burnout.",
    "status": "Completed",
    "availability": "Historical online event",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Inclusion",
      "Mental health",
      "Student wellbeing"
    ],
    "deliveryMode": "Online",
    "startDate": "2026-03-10",
    "endDate": "2026-03-10",
    "dateLabel": "10 March 2026",
    "actionLabel": "View the event page",
    "officialUrl": "https://ingenium-university.eu/event/webinar-invisible-challenges-ingenium-inclusion-month/",
    "sourceId": "fc-inclusion-webinar-2026",
    "confidence": "High"
  },
  {
    "id": "course-cornerstone-english-staff-2025",
    "slug": "cornerstone-english-staff-2025",
    "title": "Cornerstone INGENIUM English Course for Staff",
    "type": "course",
    "subtype": "Self-paced staff language course",
    "studentSummary": "MUS delivered and certified a 60-hour English course for academic and administrative staff as the first step in its alliance language-integration work.",
    "status": "Completed",
    "availability": "First cohort completed with certificates",
    "universityIds": [
      "university-mus"
    ],
    "hostUniversityId": "university-mus",
    "countries": [
      "Bulgaria"
    ],
    "themes": [
      "Languages",
      "Staff development",
      "Mobility readiness"
    ],
    "deliveryMode": "Self-paced with MUS-developed resources",
    "startDate": "2025-12-01",
    "endDate": "2026-02-28",
    "dateLabel": "December 2025–February 2026",
    "workload": "60 hours over three months",
    "eligibility": "Academic and administrative staff at Medical University Sofia",
    "language": "English",
    "workPackage": "WP2",
    "actionLabel": "Read the completion report",
    "officialUrl": "https://mu-sofia.bg/en/the-cornerstone-ingenium-foreign-language-course-for-academic-and-administrative-staff-ended-with-certificates",
    "sourceId": "fc-cornerstone-language-2026",
    "confidence": "High"
  },
  {
    "id": "course-rethinking-assessment",
    "slug": "rethinking-assessment-higher-education",
    "title": "Rethinking Assessment in Higher Education",
    "type": "course",
    "subtype": "Staff micro-credential course",
    "studentSummary": "A practice-based course on inclusive assessment, feedback, student agency and responsible AI-supported assessment.",
    "status": "Verification required",
    "availability": "Course content is published, but current dates, workload and enrolment route were not exposed in the retrieved page",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Assessment",
      "Inclusive education",
      "Artificial intelligence"
    ],
    "eligibility": "Higher-education faculty, teachers, instructors and educators",
    "actionLabel": "View the official course page",
    "officialUrl": "https://ingenium-university.eu/courses/rethinking-assessment-in-higher-education-inclusive-feedback-rich-and-ai-supported-practices/",
    "sourceId": "fc-rethinking-assessment",
    "confidence": "Medium"
  },
  {
    "id": "learning-resource-healthy-campus-toolkit",
    "slug": "healthy-campus-toolkit",
    "title": "INGENIUM Healthy Campus Toolkit",
    "type": "learning_resource",
    "subtype": "Alliance wellbeing toolkit",
    "studentSummary": "A practical resource collecting whole-campus recommendations, best practices and materials for supporting student and staff wellbeing.",
    "status": "Ongoing",
    "availability": "Public toolkit",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "themes": [
      "Wellbeing",
      "Campus design",
      "Mental health"
    ],
    "workPackage": "WP9",
    "actionLabel": "Open the toolkit",
    "officialUrl": "https://ingenium-university.eu/initiatives/inclusive-university/healthy-campus/a-healthy-campus-toolkit/",
    "sourceId": "fc-healthy-campus-toolkit",
    "sourceIds": [
      "fc-healthy-campus-toolkit",
      "fc-healthy-campus-guidelines"
    ],
    "confidence": "High"
  },
  {
    "id": "learning-resource-progress-report-2023",
    "slug": "ingenium-progress-report-2023",
    "title": "INGENIUM Progress Report 1",
    "type": "learning_resource",
    "subtype": "Alliance deliverable and progress report",
    "studentSummary": "The first progress report maps the 2023–2026 work programme, its ten work packages and the alliance’s first-year outputs.",
    "status": "Completed",
    "availability": "Final public deliverable",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uniovi",
    "themes": [
      "Alliance strategy",
      "Work packages",
      "Deliverables"
    ],
    "startDate": "2023-01-01",
    "endDate": "2023-12-31",
    "dateLabel": "2023 progress; delivered 31 January 2024",
    "funding": "€14.4 million Erasmus programme reported for the 2023–2026 project",
    "actionLabel": "Read the report",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2024/05/INGENIUM-detailed-progress-report-2023.pdf",
    "sourceId": "fc-progress-report-2023",
    "confidence": "High"
  },
  {
    "id": "learning-resource-microcredentials-d57",
    "slug": "d57-microcredentials-materials",
    "title": "D5.7 — INGENIUM Micro-Credentials and Materials",
    "type": "learning_resource",
    "subtype": "Official deliverable",
    "studentSummary": "The deliverable defines the alliance approach to micro-credentials, open materials, qualification criteria, quality assessment and shared platforms.",
    "status": "Completed",
    "availability": "Final public deliverable",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uniovi",
    "themes": [
      "Micro-credentials",
      "Open educational resources",
      "Quality assurance"
    ],
    "endDate": "2024-12-31",
    "dateLabel": "Delivered 31 December 2024",
    "workPackage": "WP5",
    "actionLabel": "Read the deliverable",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2025/10/Deliverable-5.7-INGENIUM-Micro-Credentials-and-Materials.pdf",
    "sourceId": "fc-d57-microcredentials",
    "confidence": "High"
  },
  {
    "id": "learning-resource-entrepreneurship-d82",
    "slug": "d82-entrepreneurship-training",
    "title": "D8.2 — INGENIUM Entrepreneurship Training Report",
    "type": "learning_resource",
    "subtype": "Official deliverable",
    "studentSummary": "The final report documents alliance entrepreneurship training, the BMC resource, innovation challenge, accelerator, joint degree work and soft landings.",
    "status": "Completed",
    "availability": "Final public deliverable",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-mtu",
    "themes": [
      "Entrepreneurship",
      "Innovation",
      "Training"
    ],
    "endDate": "2025-10-31",
    "dateLabel": "Delivered 31 October 2025",
    "workPackage": "WP8",
    "actionLabel": "Read the deliverable",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2025/12/D-8.2-Resubmitted-October-2025.pdf",
    "sourceId": "fc-d82-entrepreneurship",
    "confidence": "High"
  },
  {
    "id": "learning-resource-campus-obstacles-d21",
    "slug": "d21-campus-obstacles",
    "title": "D2.1 — Obstacles to the INGENIUM Inter-University Campus",
    "type": "learning_resource",
    "subtype": "Official deliverable",
    "studentSummary": "A report identifying legal, administrative and operational barriers to the European Campus and guidelines for partner implementation.",
    "status": "Completed",
    "availability": "Final public deliverable",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uniovi",
    "themes": [
      "European Campus",
      "Governance",
      "Implementation"
    ],
    "endDate": "2024-02-29",
    "dateLabel": "Delivered 29 February 2024",
    "workPackage": "WP2",
    "actionLabel": "Read the deliverable",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2024/05/Report-on-identified-obstacles-Inter-University-Campus.pdf",
    "sourceId": "fc-d21-campus-obstacles",
    "confidence": "High"
  },
  {
    "id": "learning-resource-staff-academy-d54",
    "slug": "d54-staff-academy-workshops-2-3",
    "title": "D5.4 — INGENIUM Staff Academy Workshops 2–3",
    "type": "learning_resource",
    "subtype": "Official deliverable",
    "studentSummary": "A final deliverable documenting the second and third Staff Academy workshops, webinars and shared teaching materials.",
    "status": "Completed",
    "availability": "Final public deliverable",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uniovi",
    "themes": [
      "Staff Academy",
      "Pedagogy",
      "Knowledge transfer"
    ],
    "endDate": "2025-10-31",
    "dateLabel": "Revised 31 October 2025",
    "workPackage": "WP5",
    "actionLabel": "Read the deliverable",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2025/12/Deliverable-5.4-INGENIUM-Staff-Academy_compressed.pdf",
    "sourceId": "fc-d54-staff-academy",
    "confidence": "High"
  },
  {
    "id": "learning-resource-staff-academy-d55",
    "slug": "d55-staff-academy-workshops-4-5",
    "title": "D5.5 — INGENIUM Staff Academy Workshops 4–5",
    "type": "learning_resource",
    "subtype": "Official deliverable",
    "studentSummary": "A final deliverable documenting later Staff Academy workshops, webinars, learning communities and education-innovation coordination.",
    "status": "Completed",
    "availability": "Final public deliverable",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-uniovi",
    "themes": [
      "Staff Academy",
      "Pedagogy",
      "Learning communities"
    ],
    "endDate": "2025-10-31",
    "dateLabel": "Delivered 31 October 2025",
    "workPackage": "WP5",
    "actionLabel": "Read the deliverable",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2025/12/Deliverable-5.5-INGENIUM-Staff-Academy_compressed.pdf",
    "sourceId": "fc-d55-staff-academy",
    "confidence": "High"
  },
  {
    "id": "learning-resource-sdg-modules-d72",
    "slug": "d72-sdg-course-modules",
    "title": "D7.2 — INGENIUM SDG Course Modules",
    "type": "learning_resource",
    "subtype": "Official deliverable and course-material collection",
    "studentSummary": "Ten transition-based SDG modules combine guides, videos, seminars, exercises, games and community-engagement material for reuse across the alliance.",
    "status": "Ongoing",
    "availability": "Public deliverable; its learning materials are intended to be updated over time",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-hs",
    "themes": [
      "Sustainable development",
      "Course materials",
      "Open learning"
    ],
    "endDate": "2025-06-30",
    "dateLabel": "Initial deliverable 30 June 2025",
    "workPackage": "WP7",
    "actionLabel": "Read the deliverable",
    "officialUrl": "https://ingenium-university.eu/wp-content/uploads/2025/07/Deliverable-7.2-Delivered-30-June-2025.pdf",
    "sourceId": "fc-d72-sdg-modules",
    "confidence": "High"
  },
  {
    "id": "learning-resource-munster-statement",
    "slug": "munster-statement-research-ethics-integrity",
    "title": "Munster Statement on Research Ethics and Research Integrity",
    "type": "learning_resource",
    "subtype": "Alliance research-integrity statement",
    "studentSummary": "A multidisciplinary alliance statement translating shared research-ethics and research-integrity principles into a reusable institutional resource.",
    "status": "Ongoing",
    "availability": "Public under a Creative Commons Attribution 4.0 licence",
    "universityIds": [
      "university-uniovi",
      "university-mus",
      "university-uoc",
      "university-hka",
      "university-xamk",
      "university-uda",
      "university-hs",
      "university-mtu",
      "university-urn",
      "university-tuiasi"
    ],
    "hostUniversityId": "university-mtu",
    "themes": [
      "Research ethics",
      "Research integrity",
      "Open knowledge"
    ],
    "dateLabel": "Published 2025",
    "actionLabel": "Read the statement",
    "officialUrl": "https://sword.mtu.ie/ingenium_dissemination/1/",
    "sourceId": "fc-munster-statement-2025",
    "confidence": "High"
  }
].map((item) =>
  refreshEntity(item as RefreshEntityInput),
);

const universityRelationship = (entity: Entity, universityId: string): Relationship => ({
  id: `rel-refresh-${entity.id}-${universityId}`,
  source: entity.id,
  target: universityId,
  type: entity.hostUniversityId === universityId ? "hosted_by" : "involves",
  label: entity.hostUniversityId === universityId ? "Hosted or led by" : "Involves",
  explanation: `${entity.title} is supported by official evidence linking it to this INGENIUM partner.`,
  sourceIds: entity.sourceIds,
  dataClassification: "verified",
});

const extraRelationships: Relationship[] = [
  ["rel-refresh-healthy-toolkit-initiative", "learning-resource-healthy-campus-toolkit", "initiative-healthy-campus", "supports", "Supports", "The toolkit provides the published guidance and resources for the Healthy Campus initiative.", ["fc-healthy-campus-toolkit", "fc-healthy-campus-guidelines"]],
  ["rel-refresh-education-call-lab", "opportunity-education-lab-call-2024", "initiative-education-lab", "call_for", "Call for", "The 2024 call selected cross-university projects for the Education Lab.", ["fc-education-lab-call-2024"]],
  ["rel-refresh-education-projects-lab", "project-education-lab-cohorts-2024-2025", "initiative-education-lab", "part_of", "Part of", "The published 2024 and 2025 project cohorts are outputs of the Education Lab.", ["fc-education-lab-projects"]],
  ["rel-refresh-staff-call-academy", "opportunity-staff-academy-call-2025", "initiative-staff-academy", "call_for", "Call for", "The 2025 call recruited teaching-practice sessions for the Staff Academy in Crete.", ["fc-staff-academy-call-2025"]],
  ["rel-refresh-staff-event-academy", "event-staff-academy-crete-2025", "initiative-staff-academy", "edition_of", "Edition of", "The Crete workshop was a dated edition of the recurring Staff Academy.", ["fc-staff-academy-crete", "fc-staff-academy-call-2025"]],
  ["rel-refresh-staff-webinar-academy", "event-staff-academy-webinar-results-2025", "initiative-staff-academy", "part_of", "Part of", "The webinar was delivered as a special Staff Academy edition.", ["fc-staff-academy-webinar-2025"]],
  ["rel-refresh-d54-staff-academy", "learning-resource-staff-academy-d54", "initiative-staff-academy", "documents", "Documents", "D5.4 documents Staff Academy workshops two and three.", ["fc-d54-staff-academy"]],
  ["rel-refresh-d55-staff-academy", "learning-resource-staff-academy-d55", "initiative-staff-academy", "documents", "Documents", "D5.5 documents Staff Academy workshops four and five.", ["fc-d55-staff-academy"]],
  ["rel-refresh-phd-results-call", "opportunity-phd-scholarships-results-2024", "opportunity-phd-mobility-2026", "precedes", "Earlier call results", "The 22 approved proposals document the first scholarship round before the separately represented 2026 call.", ["fc-phd-scholarships-results"]],
  ["rel-refresh-apn-call-programme", "opportunity-apn-application-2026", "programme-apn", "application_for", "Application for", "The January 2026 window was an application round for the Advanced Practice Nursing programme.", ["fc-apn-application-2026"]],
  ["rel-refresh-next-campus", "project-next-ingenium", "opportunity-european-campus", "extends", "Extends", "Next INGENIUM is the funded next phase of deeper European Campus integration.", ["fc-next-ingenium-2026"]],
  ["rel-refresh-cycle-staff-academy", "initiative-annual-education-cycle", "initiative-staff-academy", "uses", "Uses", "The published Annual Education Cycle places selected teams into the Staff Academy for co-design.", ["fc-next-ingenium-2026"]],
  ["rel-refresh-ed-cbpt", "project-ingenium-ed", "programme-cbpt", "supports", "Supports", "INGENIUM-ED starts its European Degree Label alignment work with the CBPT joint master.", ["fc-ingenium-ed-2026"]],
  ["rel-refresh-ed-entrepreneurship", "project-ingenium-ed", "programme-entrepreneurship-ba", "supports", "Supports", "The official INGENIUM-ED description includes the Bachelor in Innovation and Entrepreneurship among its four new programmes.", ["fc-ingenium-ed-2026"]],
  ["rel-refresh-ed-smacc", "project-ingenium-ed", "programme-smacc", "supports", "Supports", "The official INGENIUM-ED description includes SMAC2 among programmes to align with European Degree Label criteria.", ["fc-ingenium-ed-2026"]]
].map(([id, source, target, type, label, explanation, sourceIds]) => ({
  id: id as string,
  source: source as string,
  target: target as string,
  type: type as string,
  label: label as string,
  explanation: explanation as string,
  sourceIds: sourceIds as string[],
  dataClassification: "verified" as const,
}));

export const researchRefreshRelationships: Relationship[] = [
  ...researchRefreshEntities.flatMap((entity) =>
    entity.universityIds.map((universityId) => universityRelationship(entity, universityId)),
  ),
  ...extraRelationships,
];
