import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const registry = JSON.parse(
  await readFile(new URL("data/sources/registry.json", root), "utf8"),
);
const catalogue = JSON.parse(
  await readFile(new URL("data/catalogue/v2.json", root), "utf8"),
);

assert.equal(registry.version, "2.0");
assert.equal(registry.sources.length, 11, "Alliance plus ten partners required");
assert.equal(
  new Set(registry.sources.map((source) => source.id)).size,
  registry.sources.length,
  "Source registry IDs must be unique",
);

for (const source of registry.sources) {
  for (const key of [
    "id",
    "name",
    "baseUrl",
    "languages",
    "contentCategories",
    "accessMethod",
    "expectedCadence",
    "verificationStatus",
    "lastReviewed",
    "reuseLimitations",
    "imageReuse",
  ]) {
    assert.ok(source[key], `${source.id} is missing ${key}`);
  }
  assert.equal(new URL(source.baseUrl).protocol, "https:");
  assert.match(source.lastReviewed, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(source.contentCategories.length >= 4);
}

const universityIds = catalogue.records
  .filter((record) => record.type === "university")
  .map((record) => record.id)
  .sort();
const registryUniversityIds = registry.sources
  .filter((source) => source.institutionId.startsWith("university-"))
  .map((source) => source.institutionId)
  .sort();
assert.deepEqual(registryUniversityIds, universityIds);

console.log(
  `Validated ${registry.sources.length} governed sources for ${universityIds.length} partner universities.`,
);
