export type DemoProfile = {
  id: string;
  name: string;
  initials: string;
  university: string;
  role: string;
  interests: string[];
  synthetic: true;
};

export type DemoGroup = {
  id: string;
  name: string;
  description: string;
  members: number;
  topic: string;
  linkedRecordSlug: string;
  linkedRecordLabel: string;
  synthetic: true;
};

export const demoProfiles: DemoProfile[] = [
  {
    id: "ava-demo",
    name: "Ava K. · fictional",
    initials: "AK",
    university: "MTU",
    role: "Software development student",
    interests: ["AI", "mobility", "student projects"],
    synthetic: true,
  },
  {
    id: "leo-demo",
    name: "Leo M. · fictional",
    initials: "LM",
    university: "UNIOVI",
    role: "Environmental science student",
    interests: ["sustainability", "cities", "exchange"],
    synthetic: true,
  },
  {
    id: "sofia-demo",
    name: "Sofia R. · fictional",
    initials: "SR",
    university: "TUIASI",
    role: "Civil engineering student",
    interests: ["structures", "climate", "BIPs"],
    synthetic: true,
  },
  {
    id: "noah-demo",
    name: "Noah L. · fictional",
    initials: "NL",
    university: "HS",
    role: "Human-centred AI student",
    interests: ["responsible AI", "games", "research"],
    synthetic: true,
  },
];

export const demoGroups: DemoGroup[] = [
  {
    id: "ai-across-campuses",
    name: "AI across campuses",
    description:
      "A sample discussion space for students comparing responsible AI study and project routes.",
    members: 42,
    topic: "Artificial intelligence",
    linkedRecordSlug: "clarity-ai",
    linkedRecordLabel: "CLARITY-AI BIP",
    synthetic: true,
  },
  {
    id: "sustainable-campus-builders",
    name: "Sustainable campus builders",
    description:
      "A sample peer group connecting mobility, student projects and practical sustainability ideas.",
    members: 67,
    topic: "Sustainability",
    linkedRecordSlug: "student-sustainability-hub",
    linkedRecordLabel: "Student Sustainability Hub",
    synthetic: true,
  },
  {
    id: "first-ingenium-step",
    name: "Your first INGENIUM step",
    description:
      "A sample welcome group for comparing campuses, application routes and first mobility questions.",
    members: 118,
    topic: "Mobility",
    linkedRecordSlug: "short-term-mobility",
    linkedRecordLabel: "Short-term mobility routes",
    synthetic: true,
  },
];

export const demoPosts = [
  {
    id: "post-demo-1",
    authorId: "ava-demo",
    groupId: "ai-across-campuses",
    age: "18 min",
    body: "I’m comparing the CLARITY-AI BIP with the Human-Centred AI doctorate record. Has anyone mapped which route makes sense before a master’s?",
    linkedRecordSlug: "clarity-ai",
    linkedRecordLabel: "Explore the real CLARITY-AI record",
    reactions: 12,
    comments: 4,
    synthetic: true as const,
  },
  {
    id: "post-demo-2",
    authorId: "leo-demo",
    groupId: "sustainable-campus-builders",
    age: "1 hr",
    body: "A small cross-campus team could turn EcoCommute into a shared challenge. I added the source-backed project below so we can start from the same evidence.",
    linkedRecordSlug: "ecocommute",
    linkedRecordLabel: "Open the real EcoCommute project record",
    reactions: 24,
    comments: 7,
    synthetic: true as const,
  },
  {
    id: "post-demo-3",
    authorId: "sofia-demo",
    groupId: "first-ingenium-step",
    age: "Yesterday",
    body: "The map made the ten campuses clear, but the strongest part was filtering to blended opportunities before checking the official page. Sharing that route for other first-time visitors.",
    linkedRecordSlug: "short-term-mobility",
    linkedRecordLabel: "Review the real short-term mobility record",
    reactions: 31,
    comments: 9,
    synthetic: true as const,
  },
];

export const demoMessages = [
  {
    id: "message-demo-1",
    profileId: "sofia-demo",
    text: "Would you like to compare the SeismicX and sustainable habitat records before Friday?",
    time: "14:20",
    synthetic: true as const,
  },
  {
    id: "message-demo-2",
    profileId: "ava-demo",
    text: "Yes. I’ll add the official links here so we do not rely on the demo conversation for programme facts.",
    time: "14:27",
    synthetic: true as const,
  },
];

export const demoCourseSpaces = [
  {
    id: "clarity-ai-studio",
    slug: "clarity-ai-studio",
    title: "CLARITY-AI studio",
    subtitle: "Sample companion space for a real BIP record",
    campus: "Alliance-wide demo",
    linkedRecordSlug: "clarity-ai",
    accent: "cyan",
    progress: 42,
    modules: [
      {
        title: "Start here",
        items: ["Welcome and boundaries", "Open the official BIP record"],
      },
      {
        title: "Critical AI foundations",
        items: ["Bias mapping activity", "Source-checking discussion"],
      },
      {
        title: "Cross-campus project",
        items: ["Form a sample team", "Prepare a concept note"],
      },
    ],
    tasks: [
      { id: "ai-task-1", title: "Read the official opportunity page", due: "Before applying" },
      { id: "ai-task-2", title: "Post one source-checking question", due: "Demo week 1" },
      { id: "ai-task-3", title: "Draft a team concept note", due: "Demo week 2" },
    ],
    synthetic: true as const,
  },
  {
    id: "wellbeing-seminar",
    slug: "wellbeing-seminar",
    title: "Sustainable wellbeing seminar",
    subtitle: "Sample learning shell linked to a real course record",
    campus: "Xamk-linked demo",
    linkedRecordSlug: "sustainable-wellbeing-changing-society",
    accent: "green",
    progress: 18,
    modules: [
      { title: "Orientation", items: ["Course overview", "Learning agreement questions"] },
      { title: "Wellbeing and society", items: ["Reading prompts", "Campus comparison"] },
      { title: "Reflection", items: ["Peer response", "Personal next-step plan"] },
    ],
    tasks: [
      { id: "well-task-1", title: "Check the official course details", due: "Before planning" },
      { id: "well-task-2", title: "Compare two campus contexts", due: "Demo week 1" },
    ],
    synthetic: true as const,
  },
];
