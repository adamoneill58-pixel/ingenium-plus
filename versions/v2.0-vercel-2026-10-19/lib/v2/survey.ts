export const universities = [
  "MTU",
  "Xamk",
  "TUIASI",
  "Oviedo",
  "Crete",
  "G. d’Annunzio Chieti-Pescara",
  "Karlsruhe UAS",
  "Medical University Sofia",
  "Skövde",
  "Rouen Normandy",
];
export const roles = ["Student", "Academic", "Other staff"];
export const questions = [
  { id: 1, text: "Which university are you at?", options: universities },
  { id: 2, text: "Are you a student or academic staff?", options: roles },
  {
    id: 3,
    text: "If a student, what level?",
    options: ["Bachelor", "Master", "PhD"],
  },
  {
    id: 4,
    text: "How easy was it to find opportunities relevant to you?",
    options: ["1", "2", "3", "4", "5"],
  },
  {
    id: 5,
    text: "Did you find an opportunity you didn’t know about before?",
    options: ["Yes", "No"],
  },
  {
    id: 6,
    text: "Which view did you find most useful?",
    options: ["Graph", "Map", "Search and cards", "Calendar"],
  },
  {
    id: 7,
    text: "How relevant were the recommendations to you?",
    options: ["1", "2", "3", "4", "5"],
  },
  {
    id: 8,
    text: "Did the reasons shown help you decide what to explore?",
    options: ["Yes", "Somewhat", "No"],
  },
  {
    id: 9,
    text: "Did you go on to an official university or INGENIUM page from INGENIUM+?",
    options: ["Yes", "No"],
  },
  {
    id: 10,
    text: "Did you add a reminder or plan a semester?",
    options: ["Yes", "No", "Didn’t notice the option"],
  },
  {
    id: 11,
    text: "How likely are you to recommend INGENIUM+ to a fellow student or colleague?",
    options: Array.from({ length: 11 }, (_, i) => String(i)),
  },
  { id: 12, text: "What’s the one thing we should improve?", options: [] },
  {
    id: 13,
    text: "What feature would make you use INGENIUM+ every week?",
    options: [],
  },
];
export const surveyIntro =
  "This short survey helps us improve INGENIUM+. Please don’t include your name or contact details. Answers are stored separately and small counts are suppressed in shared reports.";
