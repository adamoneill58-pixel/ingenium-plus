export const EMBEDDING_PROVIDER = "ingenium-local-feature-hash";
export const EMBEDDING_MODEL = "taxonomy-hash-v1";
export const EMBEDDING_DIMENSIONS = 96;

const concepts: Record<string, string[]> = {
  ai: ["ai", "artificial", "intelligence", "machine", "learning", "algorithm", "digital"],
  sustainability: ["sustainable", "sustainability", "climate", "green", "circular", "environment"],
  education: ["education", "teaching", "learning", "pedagogy", "student", "curriculum"],
  health: ["health", "healthcare", "wellbeing", "nursing", "care", "medical"],
  entrepreneurship: ["entrepreneurship", "startup", "innovation", "business", "founder"],
  mobility: ["mobility", "erasmus", "travel", "international", "exchange", "blended"],
  research: ["research", "study", "analysis", "method", "evidence", "doctoral"],
};

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return result >>> 0;
}
export function tokenise(value: string): string[] {
  const base = value.toLocaleLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").split(" ").filter((word) => word.length > 2);
  const expanded = [...base];
  for (const [concept, terms] of Object.entries(concepts)) if (base.some((word) => terms.includes(word))) expanded.push(`concept:${concept}`);
  return expanded;
}

export function embedText(value: string): number[] {
  const vector = Array.from({ length: EMBEDDING_DIMENSIONS }, () => 0);
  for (const token of tokenise(value)) {
    const hashed = hash(token);
    const index = hashed % EMBEDDING_DIMENSIONS;
    vector[index] += (hashed & 1) === 0 ? 1 : -1;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, item) => sum + item * item, 0));
  return magnitude ? vector.map((item) => Number((item / magnitude).toFixed(6))) : vector;
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length || !left.length) return 0;
  let dot = 0; let leftMagnitude = 0; let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) { dot += left[index] * right[index]; leftMagnitude += left[index] ** 2; rightMagnitude += right[index] ** 2; }
  if (!leftMagnitude || !rightMagnitude) return 0;
  return Math.max(0, Math.min(1, dot / Math.sqrt(leftMagnitude * rightMagnitude)));
}
