import type { EntityStatus } from "@/lib/data";

export function StatusBadge({ status }: { status: EntityStatus }) {
  const slug = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge status-badge--${slug}`}>{status}</span>;
}
