# Gemini catalogue refresh handoff

The overnight refresh is expected from Adam. It has not been received or imported. Preserve the synthetic campus layer when reviewing that evidence.

## Evidence contract

Provide structured records with stable IDs/slugs, title, official publisher and URL, date accessed, factual summary and explicit evidence for dates, application status, delivery mode, eligibility, credits, funding and locations. Unknown fields stay unknown. Distinguish deadlines from activity dates and online from physical components. Keep conflicting sources separately rather than resolving silently. Prioritise current official alliance and partner sources. Do not supply invented profiles, participants or correspondence as research evidence.

## Stable demo references

| Demo space | Existing catalogue ID | Existing slug |
| --- | --- | --- |
| Adam's BIP | bip-clarity-ai | clarity-ai |
| Adam's conference | event-final-student-conference-oviedo-2026 | final-ingenium-student-conference-oviedo-2026 |
| Adam's chess club | community-ingenium-chess-club | ingenium-chess-club |
| Paul's work package | initiative-education-lab | education-lab |
| Paul's module | course-rethinking-assessment | rethinking-assessment-higher-education |
| Paul's research concept | opportunity-joint-research-groups-call-2026 | joint-research-groups-call-2026 |

These link to source-backed context; they do not assert that the synthetic workspace is official or either persona participates. Keep IDs stable when refreshing an entity. If a record must be replaced or retired, make an explicit reviewed mapping in `lib/v2/campus-simulation.ts`, preserve old evidence and explain retirement.

## Import sequence

1. Diff the pack against `data/catalogue/v2.json` and the source registry.
2. Validate provenance, URLs, dates, visibility and IDs; quarantine unsupported claims and conflicts.
3. Use the existing reviewed catalogue import pipeline. Keep synthetic people, messages, workshops, resources and memberships solely in `campus-simulation.ts` and local state.
4. Reconcile the six references and synthetic descriptions quoting official dates.
5. Run validators, full tests, typecheck, lint and production/browser journeys. Update documented counts only after verification.
6. Publish through Sites and verify the deployed catalogue and both persona journeys.
