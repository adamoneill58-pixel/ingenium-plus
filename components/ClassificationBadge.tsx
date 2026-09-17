import type { DataClassification } from "@/lib/data";

const labels: Record<DataClassification, string> = {
  verified: "Verified information",
  calculated: "INGENIUM+ calculated",
  sample: "Sample information",
};

export function ClassificationBadge({ classification = "verified" }: { classification?: DataClassification }) {
  return <span className={`classification classification--${classification}`}>{labels[classification]}</span>;
}
