# Verification evidence — 14 October 2026

Verification covers the local review candidate. No staged/public v2 deployment, actual cron run, provider policy, real identity or participant outcome is asserted.

## Automated checks

- Supported Node22.22.0, from the repository's supported Node22 line.
- Original baseline `npm test`: passed before edits at `83261ff`.
- Final data integrity: 85 legacy entities/29 sources/343 relationships/6 journeys preserved; canonical v2 import validates 222 public records, 163 sources, 985 relationships and four explicit component calendar entries.
- Legacy logic:6 tests passed.
- Existing v1.5.1 schema/recommendation/security/workflows and revised lockdown bootstrap:15 tests passed. The old automatic owner/bootstrap expectations were replaced with tests proving unprovisioned identities cannot create profiles or roles; other regression checks remain.
- v2 behavioural suite:24 tests passed, including actual SQLite migration/import, interruption/retry, public projection, privacy SQL constraints, calendar/DST/folding, source-refresh conflict/failure fixtures, independent review, signed JWT verification, activation window, cleanup and coverage.
- Production Worker route suite:28 tests passed, including twenty rendered public routes, legacy API lockdown, unknown campus404, public catalogue/ICS, collection/origin rejection, client bundle guard and signed team role/export/review end-to-end verification.
- Total:73 tests, zero failures. Additive upgrade and synthetic file backup/restore verification also passed; restored integrity, foreign keys, published record counts and aggregate row checked.
- TypeScript: passed. Production build: passed. ESLint: passed, no warnings. Whitespace check: passed. URL syntax:180 unique public URLs passed.
- Own-account configuration with synthetic resource IDs: production build passed, and Wrangler deployment dry run passed with compiled Worker/assets/D1/R2 bindings. No upload/deployment occurred.

The final route checks were rerun after adding the positive signed-role/reporting workflow and bundle guard. Generated dry-run output initially entered the linter; the configuration now explicitly ignores generated `work/` and `outputs/`, matching their Git-ignore status. No source or test rule was disabled.

## Browser checks and screens

- Desktop1440×1000: homepage, search, lazy network, shared AI filter carried into Calendar, calendar deadlines/conflict warning, My Campus save/navigation, fictional course matching/draft.
- Phone390×844: discovery/filter/list layout, keyboard Enter opens the menu, fictional course matching and unsent expression draft. No horizontal document overflow in checked screens.
- Tablet768×1024: calendar/month view and menu. Fixed the860px/760px navigation gap and rechecked. No horizontal document overflow.
- Additional default desktop preview: map projection and ten-campus list; fresh tab reported no console errors. Heavy graph's custom-wheel warning was removed by using Cytoscape's default.
- Survey shows the questions and a disabled submit button while collection is not activated. No feedback was submitted to a live service.
- Semantic labels, focus styling, reduced-motion CSS and equivalent list access inspected. This is not independent screen-reader or WCAG certification.

Representative browser captures are in `screens/`: home desktop, calendar desktop, calendar tablet, phone discovery and map desktop. Screenshot pixel sizes exclude browser chrome/scrollbars and can differ slightly from the emulated viewport dimensions. Captures contain public catalogue or fictional data only.

## Bundle comparison

Measurements use `scripts/report-bundle-size.mjs --json` with Node's gzip and the same starting commit. `bundle-before.json` and `bundle-after.json` preserve per-chunk evidence.

| Measure | Baseline bytes | v2 bytes | Change |
|---|---:|---:|---:|
| All client JavaScript, raw | 939591 | 883079 | -6.0% |
| All client JavaScript, gzip | 297704 | 284982 | -4.3% |
| Worker entry, raw | 1224154 | 945483 | -22.8% |
| Worker entry, gzip | 263330 | 210594 | -20.0% |

Client totals count every route chunk, including optional Cytoscape; they are not initial-page download sizes. The build guard keeps the research catalogue prose out of routine client assets, caps all client gzip at330,000bytes and checks Cytoscape is not an initial script dependency. Graph rendering remains lazy. These size reductions do not establish an equivalent user-perceived speedup; deployed cold-start/latency/Web Vitals need actual staging measurement.

## Remaining external or unavailable checks

No real Access account/domain/AUD, resource provisioning, edge-rate policy, staged migration, real calendar-client import, scheduled invocation, webhook delivery, production recovery or public rollout was performed. A full180-URL HTTP sweep was not run; critical official pages were refreshed through research, with the conference date rechecked at the final audit. The calendar feed/content arrangement remains unapproved. Pilot contacts, institutional/privacy decisions, retention and December reporting date remain open. Phase3 real accounts and collaboration remain disabled as required.
