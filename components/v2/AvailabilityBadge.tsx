import type { Entity } from "@/lib/data";
import { availability } from "@/lib/v2/domain";
export function AvailabilityBadge({ record }: { record: Entity }) {
  const a = availability(record);
  return (
    <span
      className={`availability availability--${a.value}`}
      title={
        a.conflict
          ? "Conflicting source information needs verification"
          : a.label === "Closing soon"
            ? "Confirmed deadline is within 14 days"
            : undefined
      }
    >
      {a.label}
      {a.conflict ? " · verification required" : ""}
    </span>
  );
}
