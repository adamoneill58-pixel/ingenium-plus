# INGENIUM+ v1.5 release notes

Release date: 13 September 2026

## Highlights

- Re-centres the product on a large graph workspace with Geography and Network modes over one dataset.
- Constrains the geographic camera to prevent panning or zooming beyond the Europe map.
- Adds unified Explore search and filters with card and graph representations.
- Adds Learning discovery, current 2026/2027 catalogue records and a browser-local semester builder with ECTS totals and duplicate prevention.
- Adds rich record pages with connected evidence, relevant facts, sources, university subnetworks, related records and local actions.
- Adds optional My Campus profiles, profile completion, a You node, deterministic student degrees, local tasks/activity and explained recommendations.
- Adds clearly labelled fictional student profiles and contextual read-only sample Chats.
- Centralises date-driven status logic so elapsed deadlines cannot remain actionable merely because a source badge is stale.
- Exposes verified, calculated and sample classifications throughout the experience.

## Data refresh

Current official Course Catalogue, 2026/2027 learning announcement, BIP catalogue, joint-doctorate pages and Annual Education Call were checked on 13 September 2026. Climate Adapted Urban Infrastructure, the Annual Education Call, CLARITY-AI and SeismicX remain `Verification required` because official timelines conflict. The Wellbeing and Human-Centred AI doctorates are retained as verified programmes, but their 21 August 2026 calls are closed.

The v1.4 evidence archive remains intact and is aggregated with v1.5 data rather than overwritten. Historical records remain discoverable.

## Boundaries

This release does not create accounts, enrol students, guarantee recognition, send messages or publish real student data. Local actions are device-only prototypes. Official systems remain authoritative.

## Deployment procedure

1. Use Node 22 LTS and run `npm test` plus `npm run lint`.
2. Run the production preview and complete `docs/TESTING.md`.
3. Confirm the intended Git diff and unchanged Sites project ID in `.openai/hosting.json`.
4. Create a named Sites saved version from this exact working tree.
5. Deploy only that reviewed saved version through the explicit Sites deployment action.
6. Open the production URL in a fresh session and repeat the smoke tests.

Local saves and commits never deploy automatically.

## Suggested v1.6 priorities

- Authenticated opt-in profiles with consent, portability and deletion controls.
- Partner-maintained structured feeds for courses, calls and local recognition rules.
- Real nomination/enrolment deep links with institution-specific eligibility checks.
- Moderated, authenticated contextual communities instead of sample Chats.
- Server-side saved plans and cross-device continuity.
- Automated source-change detection with a human verification queue.
