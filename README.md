# INGENIUM+ v2.0

A student-led European campus discovery workspace: one catalogue, explained connections, a calendar, temporary planning and an isolated academic collaboration demonstration.

## Run locally

Use Node 22 from `.nvmrc`, then `npm ci` and `npm run dev`. Open the URL printed by Vite. No account, cloud credentials or external AI service is required. Local development uses a clearly labelled research snapshot. Production without a configured database shows an unavailable state; it does not pretend to use live data.

## What is available

- Discover: shared search and filters, List / Network / Map, all ten university anchors, selected-record details and official links. Heavy graph code loads on request.
- Calendar: agenda, month and upcoming deadlines; separate activity/deadline/nomination/online entries; optional fictional examples; individual `.ics` exports with selected alarms. Conflicting or approximate dates cannot be exported as confirmed. Discovery filters and selection survive the calendar link.
- My Campus: optional interests, explained suggestions, temporary shortlist, comparison, upcoming actions, advisory credit totals and JSON plan export. State lives in page memory and is lost on refresh; old browser storage is neither read nor deleted.
- Collaborate: fictional course-to-colleague demonstration with reviewed tags, complementary expertise and a draft expression of interest. No real academic directory or messages.
- Pilot: three proposed campus landing routes, thirteen-question survey preview and aggregate services. Collection defaults off and requires configured dates and edge controls. Team dashboard, weekly suppressed CSV and source-review tools require verified Access identity plus an explicit database role.

Real student/staff workflows, profile writes, unscanned downloads and the entire legacy private API are paused in this release. The product is a pilot prototype; no adoption, participant or completed-application claim is made.

## Checks

`npm test` runs data integrity, legacy logic/security/workflows, v2 behavioural tests, TypeScript, the production build and rendered routes. `npm run lint` checks source. `npm run check:links` validates public URL syntax; `npm run check:links:live` is an optional external HTTP check. `npm run data:import` validates the canonical v2 dataset and writes an ignored dry-run SQL file. The CI workflow runs lint, tests and URL syntax checks on pull requests; repository rules still need to be enabled by an owner.

## Handover

Start with [Delivery and acceptance](docs/v2/DELIVERY.md), [Cloud and maintenance runbook](docs/v2/RUNBOOK.md), and [Pilot evaluation pack](docs/v2/PILOT-PACK.md). [The commissioned specification](docs/v2/SPEC.md) governs scope; [the previous README](docs/v2/LEGACY-README-v151.md) is historical and does not describe active private functionality.

This branch is a review candidate. A build, a merged PR, an authorised deployment and a verified public pilot are separate outcomes.
