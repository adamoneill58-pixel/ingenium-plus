import type { Entity } from "../data";
import { availability } from "./domain";

const preferredIds = [
  "opportunity-student-partnerships-2627-round1",
  "opportunity-local-student-events-2026",
  "course-basics-media-education-jan-2027",
  "initiative-bmc",
];

export function featuredOpportunities(records: Entity[], today?: string) {
  const eligible = records.filter((record) =>
    record.dataClassification !== "sample" &&
    ["opportunity", "course", "microcredential", "initiative"].includes(record.type) &&
    availability(record, today).value === "open",
  );
  const chosen = preferredIds.flatMap((id) => eligible.find((record) => record.id === id) ?? []);
  return [...chosen, ...eligible.filter((record) => !chosen.some((item) => item.id === record.id))].slice(0, 3);
}
