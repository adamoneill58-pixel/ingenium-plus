import type { Entity } from "../data";
import { availability } from "./domain";
export function catalogueHealth(records: Entity[], now = new Date()) {
  const cutoff = now.getTime() - 7 * 86400000;
  const needsCheck = (r: Entity) =>
    !r.lastChecked ||
    !Number.isFinite(Date.parse(r.lastChecked)) ||
    Date.parse(r.lastChecked) < cutoff ||
    Boolean(r.lastCheckError) ||
    availability(r).conflict;
  return {
    conflicts: records.filter((r) => availability(r).conflict).length,
    failed: records.filter((r) => r.lastCheckError).length,
    records: records
      .filter(needsCheck)
      .slice(0, 100)
      .map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        lastChecked: r.lastChecked,
        lastVerified: r.lastVerified,
        conflict: availability(r).conflict,
        failed: Boolean(r.lastCheckError),
      })),
    coverage: records
      .filter((r) => r.type === "university")
      .map((u) => ({
        id: u.id,
        title: u.shortTitle ?? u.title,
        records: records.filter(
          (r) => r.type !== "university" && r.universityIds.includes(u.id),
        ).length,
        themes: [
          ...new Set(
            records
              .filter(
                (r) =>
                  r.type !== "university" && r.universityIds.includes(u.id),
              )
              .flatMap((r) => r.themes),
          ),
        ].length,
      })),
  };
}
