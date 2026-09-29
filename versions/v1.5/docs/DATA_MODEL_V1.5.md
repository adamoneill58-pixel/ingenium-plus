# INGENIUM+ v1.5 data model

## Canonical records

`lib/data.ts` preserves the v1.4 evidence archive. `lib/v15-data.ts` adds the current learning refresh and sample student layer, then exports the canonical `records`, `networkRelationships` and `evidenceSources` collections used by v1.5.

An `Entity` has a stable ID and slug, type, student-facing summary, declared status, university links, themes, source reference, verification date and confidence. Optional fields cover dates, ECTS, level, delivery, languages, prerequisites, outcomes, assessment, imagery and history.

`dataClassification` is mandatory in the v1.5 aggregate:

- `verified` — supported by official INGENIUM or partner evidence.
- `calculated` — derived by transparent INGENIUM+ logic, not an official decision.
- `sample` — fictional demonstration content, especially profiles, participation and Chats.

## Relationships

Relationships are first-class evidence records with stable IDs, source and target IDs, a machine-friendly type, human label, explanation, optional evidence IDs, date and classification. The graph and record pages read from the same collection.

## Status logic

`getComputedStatus` in `lib/v15-logic.ts` is the single status selector. Its precedence is:

1. explicit `statusOverride` for known ambiguity;
2. protected workflow states such as verification required or under development;
3. recurring classification;
4. application-open and deadline dates;
5. activity start and end dates;
6. the retained declared status.

Dates are compared as ISO calendar dates. Passed application deadlines become Closed, Ongoing or Past depending on activity dates. This avoids treating an unchanged official badge as stronger evidence than an explicit date.

## Local student layer

`lib/local-store.ts` owns versioned local-storage keys. A local profile is optional and never enters the public dataset. Saved, joined, semester, tasks, recent views, sample connections and correction reports remain on the device.

Sample students use a deterministic degree model:

- first degree — an explicit local sample connection;
- second degree — shared participation without a direct connection;
- third degree — a mutual sample connection;
- no degree — no supported path.

Recommendation scores are deterministic hints. Every recommendation exposes reasons and never claims eligibility or recognition.
