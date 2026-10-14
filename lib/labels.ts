/**
 * Display labels and colours for record types. Kept separate from `./data` so
 * client components can use them without bundling the v1.4 base dataset.
 */
import type { EntityType } from "./data";

export const typeLabels: Record<EntityType, string> = {
  calendar_event: "Calendar event",
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
  module: "Module",
  course: "Course",
  microcredential: "Microcredential",
  student: "Student",
  learning_resource: "Learning resource",
};

export const typeColours: Record<EntityType, string> = {
  calendar_event: "#007b65",
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
  module: "#00a3c7",
  course: "#147e72",
  microcredential: "#9ab300",
  student: "#e5007e",
  learning_resource: "#7763bf",
};

