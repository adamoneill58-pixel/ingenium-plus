# Data model

The canonical dataset is `lib/data.ts`. It is deliberately static for v1.4 so the full experience works locally and in a hosted production build without API keys.

## Entity

Each entity has:

- Identity: `id`, `slug`, `title`, optional short title and aliases.
- Classification: entity `type`, subtype, themes and status.
- Student copy: short summary, optional full description and availability guidance.
- Place and ownership: `universityIds`, optional host, countries and city.
- Study/mobility fields: level, delivery, mobility type, dates, deadline, ECTS, EQF, workload, eligibility, language, capacity and funding.
- Action fields: action label and official URL.
- Provenance: source ID, last-verified date, confidence and optional work package.
- Presentation: featured flag.

Canonical entity types are University, BIP, Programme, Pathway, Student Project, Event, Community, Platform, Opportunity, Initiative and Framework.

Statuses are normalised as Open, Upcoming, Ongoing, Completed, Recurring, Planned, Under development, Archived, Access unverified and Verification required. “Access unverified” is used only when an official service or community exists but a current student entry point could not be confirmed.

## Relationship

Every relationship has an ID, source entity, target entity, machine-readable type, student-facing label and evidence-based explanation. University associations are materialised as graph relationships; none are discarded to make the visual simpler. Visual opacity and mode filtering handle density.

Examples include `hosted_by`, `connected_to`, `produced`, `continued_through`, `delivered_through`, `prepares_for`, `represents_students_in` and `related_research_route`.

## Journey

A journey has an ID, title, eyebrow, summary, accent and ordered set of entity IDs. The order expresses a discovery narrative; it is not automatically a prerequisite chain. Branching alternatives are exposed through progressive disclosure in the interface.

## Source

A source stores an ID, human-readable title, evidence kind, optional public URL and optional publication/revision date. Local filesystem paths never enter the public dataset.

## Local planner

Browser storage uses three versioned keys:

- `ingenium-plus-v14-saved` — favourite entity IDs.
- `ingenium-plus-v14-journey` — ordered journey entity IDs.
- `ingenium-plus-v14-planner` — private per-entity status and notes.

No planner data is transmitted. Export creates a local JSON file containing only the user’s chosen steps and notes.
