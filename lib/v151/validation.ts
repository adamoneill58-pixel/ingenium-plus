const MAX_TEXT = 10_000;

export class ValidationError extends Error {
  status = 400;
}

export function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ValidationError("A JSON object is required");
  return value as Record<string, unknown>;
}

export function requiredText(input: Record<string, unknown>, field: string, max = MAX_TEXT): string {
  const value = input[field];
  if (typeof value !== "string" || !value.trim()) throw new ValidationError(`${field} is required`);
  if (value.length > max) throw new ValidationError(`${field} exceeds ${max} characters`);
  return value.trim();
}

export function optionalText(input: Record<string, unknown>, field: string, max = MAX_TEXT): string | undefined {
  const value = input[field];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new ValidationError(`${field} must be text`);
  if (value.length > max) throw new ValidationError(`${field} exceeds ${max} characters`);
  return value.trim();
}

export function stringList(input: Record<string, unknown>, field: string, limit = 40): string[] {
  const value = input[field];
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) throw new ValidationError(`${field} must be a list of text values`);
  if (value.length > limit) throw new ValidationError(`${field} has too many values`);
  return [...new Set(value.map((item) => item.trim()).filter(Boolean))];
}

export function parseDate(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new ValidationError(`${field} must use YYYY-MM-DD`);
  }
  return value;
}

export function optionalNumber(input: Record<string, unknown>, field: string, min: number, max: number): number | undefined {
  const value = input[field];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    throw new ValidationError(`${field} must be a number between ${min} and ${max}`);
  }
  return value;
}

export function validateCallPayload(value: unknown) {
  const input = asObject(value);
  return {
    title: requiredText(input, "title", 180),
    summary: requiredText(input, "summary", 600),
    description: requiredText(input, "description"),
    callType: optionalText(input, "callType", 80) ?? "collaboration",
    organizationId: optionalText(input, "organizationId", 160),
    disciplines: stringList(input, "disciplines"),
    methods: stringList(input, "methods"),
    skillsOffered: stringList(input, "skillsOffered"),
    skillsSought: stringList(input, "skillsSought"),
    methodsOffered: stringList(input, "methodsOffered"),
    methodsSought: stringList(input, "methodsSought"),
    facilitiesOffered: stringList(input, "facilitiesOffered"),
    facilitiesSought: stringList(input, "facilitiesSought"),
    needs: stringList(input, "needs"),
    teachingThemes: stringList(input, "teachingThemes"),
    targetPartnerTypes: stringList(input, "targetPartnerTypes"),
    eligibility: stringList(input, "eligibility"),
    languages: stringList(input, "languages"),
    countries: stringList(input, "countries"),
    deliveryMode: optionalText(input, "deliveryMode", 100),
    expectedContribution: optionalText(input, "expectedContribution", 2_000),
    projectStage: optionalText(input, "projectStage", 100),
    fundingStatus: optionalText(input, "fundingStatus", 100),
    fundingProgramme: optionalText(input, "fundingProgramme", 200),
    timeCommitment: optionalText(input, "timeCommitment", 200),
    startDate: parseDate(input.startDate, "startDate"),
    endDate: parseDate(input.endDate, "endDate"),
    deadline: parseDate(input.deadline, "deadline"),
    collaborationFormat: optionalText(input, "collaborationFormat", 120),
    location: optionalText(input, "location", 200),
    confidentialityLevel: optionalText(input, "confidentialityLevel", 80),
    contactWorkflow: optionalText(input, "contactWorkflow", 500),
    targetPartnerCount: optionalNumber(input, "targetPartnerCount", 1, 100),
    sourceUrl: optionalText(input, "sourceUrl", 2_000),
  };
}

export function validateModulePayload(value: unknown) {
  const input = asObject(value);
  return {
    title: requiredText(input, "title", 180),
    slug: optionalText(input, "slug", 200),
    summary: requiredText(input, "summary", 800),
    fullDescription: requiredText(input, "fullDescription"),
    organizationId: optionalText(input, "organizationId", 160),
    themes: stringList(input, "themes"),
    methods: stringList(input, "methods"),
    languages: stringList(input, "languages"),
    studyLevels: stringList(input, "studyLevels"),
    prerequisites: stringList(input, "prerequisites"),
    learningOutcomes: stringList(input, "learningOutcomes"),
    skillsDeveloped: stringList(input, "skillsDeveloped"),
    eligibility: optionalText(input, "eligibility", 2_000),
    deliveryMode: optionalText(input, "deliveryMode", 100),
    campus: optionalText(input, "campus", 200),
    location: optionalText(input, "location", 200),
    semester: optionalText(input, "semester", 100),
    startDate: parseDate(input.startDate, "startDate"),
    endDate: parseDate(input.endDate, "endDate"),
    applicationDeadline: parseDate(input.applicationDeadline, "applicationDeadline"),
    workload: optionalText(input, "workload", 200),
    recognitionInformation: optionalText(input, "recognitionInformation", 2_000),
    capacity: optionalNumber(input, "capacity", 0, 100_000),
    ects: optionalNumber(input, "ects", 0, 60),
    officialUrl: optionalText(input, "officialUrl", 2_000),
  };
}
