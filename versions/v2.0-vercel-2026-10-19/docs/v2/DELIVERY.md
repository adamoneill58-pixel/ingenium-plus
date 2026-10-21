# v2.0 delivery and acceptance

17 October extension: [PERSONALISED_CAMPUS.md](PERSONALISED_CAMPUS.md) supersedes the older page-memory-only synthetic-community scope and fixed graph/client-budget limits below. It documents the restored demo modes, six personal workspaces, degree filters and isolated synthetic session state. Real account and pilot boundaries remain unchanged. [GEMINI_REFRESH_HANDOFF.md](GEMINI_REFRESH_HANDOFF.md) prepares the pending data refresh.

Review candidate prepared 14 October 2026. This record supersedes overlapping legacy implementation plans for the commissioned public pilot. [SPEC.md](SPEC.md) preserves the full requirement. No production rollout, pilot recruitment or institutional adoption is claimed.

## Baseline and scope

The starting checkout was clean on `perf/reduce-code` at `83261ff2357e18a0025c919ab20850b885355290`; this branch continues those performance improvements. React/TypeScript, vinext/Vite, Cloudflare Worker, D1/Drizzle and private R2 are retained. The original tests passed before edits. The release dataset contained 226 records, 1,007 relationships and 159 sources; the separate legacy validation dataset contained 85 records. These are content counts.

The public canonical v2 dataset contains 222 records, 985 relationships, 163 sources and four explicit component calendar entries. It removes six sample people from public discovery, preserves their historical fixtures separately, retains original public IDs/slugs, updates two researched opportunities and adds two sourced opportunities. Historical dates remain historical. Original catalogue snapshots and Git history preserve the older material. No Drive original was edited.

| Capability at baseline | Audit finding | v2 resolution |
|---|---|---|
| Graph, geography, Explore and Learning | Working but separate filtering/interfaces | One shared discovery component and filtering rules; ten anchors; graph and map load on demand |
| Recommendations and permissions | Substantial existing deterministic engine and permission matrix | Preserved regression suite; anonymous interest matching with explanations; central pilot route policy |
| Header-derived identity and owner bootstrap | Verification was not established in source; email could trigger a role bootstrap locally | Raw headers never authenticate; all legacy private endpoints paused; signed Access verification plus explicit audited team membership |
| Runtime bootstrap | Visitor runtime could seed private state | Request seeding removed; schema migrations and explicit bounded public import outside requests |
| Private uploads | Scanner/extractor unconfigured | Private account routes paused; no object bytes delivered; no invented scan/extraction |
| Local plans | Persistent browser storage | Page-memory shortlist and export; old browser data left untouched |
| Calendar and survey | Required new public journeys | Working views/import/export, independent survey aggregates, gated writes, protected reporting |
| External cloud/pilot | Current host is not evidence of an owned production account, approved calendar feed or pilot | Own-account configuration and activation runbook; collection off; no external rollout |

## Decisions and conflicts

| Source / issue | Resolution and effect |
|---|---|
| Adam's v2 direction versus earlier Phase 2 design scope | Include substantial redesign and fictional collaboration demonstration now. Keep real accounts disabled. |
| Existing security/privacy tracker versus historical header authentication | Local fail-closed lockdown first. No allegation about exploitability of a deployed identity boundary. |
| Phase 2 survey and outreach plan | Preserve thirteen questions and three proposed landing campuses. No recruitment/contact action performed. |
| Student Partnerships official pages: December 1 versus December 18 | Retain conflict warning and unknown availability; no actionable recommendation or calendar download. |
| Oviedo conference source refreshed 14 October | Use November 20–25 and October 18 application date from current official announcement; correct older date label. |
| Legacy catalogue date placeholders and combined BIP spans | Require explicit activity precision; no exact activity export from a year/month placeholder. Split evidenced online and physical BIP components. |
| Legacy private profile/account product versus anonymous pilot | Preserve implementation behind server and database locks; personal mode is not an access switch. Phase 3 requires a separate decision. |
| Retention, ownership and processors | Proposed six weeks, end +90 days for free text, 365 days for team audit. Previewable cleanup prepared; policy remains unapproved. |
| Reporting deadline | Exact December institutional deadline was not verified. Do not promise a completed six-week pilot before an unconfirmed date. |

Primary source register: the [Drive specification](https://docs.google.com/document/d/1X_O0qlKSCGtsy4eYPI16sIV780zWm5FTjhcuBzn7zno/edit), [security tracker](https://docs.google.com/document/d/1U_JGnbNymvDOX1YBlW-k7CHjAqUOEn7w8IqUWG9A1-Y/edit), [roadmap](https://docs.google.com/document/d/1vciqLaYbEZjmja4PCjU37kF7htX5Qrre1LNzxAnrZwY/edit), [official Campus page](https://ingenium-university.eu/students/ingenium-european-campus/), [conference announcement](https://ingenium-university.eu/applications-open-for-the-ingenium-student-conference-in-oviedo/), [tandems](https://ingenium-university.eu/ingenium-linguistic-tandems-student-edition/) and [ambassadors](https://ingenium-university.eu/students/ingenium-european-campus/ingenium-ambassadors-call-2026-2027/). Official Access JWT documentation and RFC 5545 informed the implementation. Documents describe proposed governance, not completed approval.

## Acceptance matrix

| Requirement | Implementation / evidence | Release dependency |
|---|---|---|
| 1. Public published-only reads; no profile writes | Public queries join published endpoints; private sources excluded. Route integration tests cover forged visits/no writes; profile insert/update triggers. | Recheck staged D1 bindings |
| 2. Verified identity and deliberate methods | Access crypto tests cover signature/issuer/AUD/expiry/nbf; manifest covers every legacy method and unknown APIs. Team role provisioned explicitly; reason/self-review/race guards. | Real Access domain/AUD and named roles; no SSO claim |
| 3. Consistent views and navigation | Shared `discover`, URL filters, selected node, calendar round trip, empty states; browser checks for list/network/map and calendar. Network adds fixed campus anchors and caps drawn items; results count remains catalogue count. | Large-catalogue usability assessment |
| 4. Closed/unknown/conflict handling | Behavioural tests for running courses with closed applications, reviewed reopenings, parse conflicts; shared badges and export guard. | Human review of official conflicts |
| 5. Calendar correctness | Explicit precision, multiple stable component IDs, UTC offsets/DST/local day, all-day exclusive end, UTF-8 folding/escaping/alarms, approximate and conflicting rejection. | Official import/content route; no live feed claim |
| 6. Import/migration/recovery | Repeat and interrupted import tests preserve reviewed records; additive upgrade and synthetic database backup/restore verified. | Backup actual target before any authorised migration |
| 7. Quarantine | Legacy endpoint lock plus metadata-only download route; no R2 byte path. Original size/type/signature tests retained. | Approved scanner/extractor and rights before future enablement |
| 8. Pilot state/analytics | Memory store replaces automatic browser storage; allowlist, nonnullable aggregate keys, rejected IDs/unknown fields, landing-only campus, activation-window tests. | Edge abuse controls and processor/logging decisions |
| 9. Survey/report privacy | Independent closed counts; SQL prohibits Q1/Q2 role association; unlinked flagged text; weekly suppression and subtraction tests; CSV excludes raw text. | Approved contact/retention; restricted free-text review workflow before any access |
| 10. Academic demo | Fictional Academics A/B/C, complementarity and practical constraints, manual entry/reviewed tags, draft only. Real profiles unavailable. | Phase 3 authorisation and privacy/visibility decisions |
| 11. Responsive/accessibility | Semantic labels, skip link, focus styles, reduced motion, list alternative; browser viewport and keyboard checks recorded in VERIFICATION.md. | Independent accessibility assessment; no WCAG certification |
| 12. Engineering checks | Data/logic/security/workflow/v2 tests, TypeScript, build, rendered routes, lint and URL syntax. Bundles compared to actual starting commit. | Remote CI and staged scheduled invocation verification |

## Design and representative screens

`app/v2.css` contains shared green/teal, paper, accent, spacing and type tokens. Official logo is reused. Navigation centres Discover, Learn, Community, Calendar, My Campus and Collaborate. Cards show availability in text, source freshness, conditional funding and official routes. Heavy network rendering is optional and has an equivalent List view. A small purpose-built slippy map now supplies the default interactive view, clustering all filtered host-connected records around ten geographic university anchors without adding a large mapping bundle. Host location is not asserted as an opportunity venue. Community and learning screens use persistent demo labels and separate their synthetic activity from real catalogue records. See `screens/` for browser captures; replace the older map capture during final browser verification.

## Connected-campus v2.0 slice

| Capability | Implemented state | Boundary / dependency |
| --- | --- | --- |
| Interactive map | Slippy map, pan/zoom, clusters, zoom disclosure, filters, campus focus, record selection, evidence route and List/Network alternatives | OpenStreetMap community tiles suit this prototype; choose an appropriate production tile service for material traffic |
| Source governance | Registry for the alliance and all ten partners; validation in the data check; source census and review workflow | Automated extraction remains subject to robots, access, translation quality and reviewer capacity |
| Community | Native feed, demo profiles, groups, join/leave, reactions, saves and local chat linked to real records | Entire social layer is synthetic and page-memory only; no real account, message or participation claim |
| Learning | Real learning catalogue plus two interactive sample spaces with modules, tasks, progress, discussion and people | No Canvas connection, enrolment, grades or academic record |
| External content | Click-to-load, sandboxed, provider-specific YouTube/LinkedIn-post/public-calendar embed policy; official INGENIUM YouTube uploads configured | LinkedIn page/profile feeds are linked out; only eligible individual public posts can be embedded |
| Homepage | Map-first hierarchy, compact utility navigation, real activity and explicitly synthetic community preview | Final acceptance still depends on browser QA and public-site deployment evidence |

The source-backed content counts remain 222 public records, 985 relationships, 163 evidence sources and four explicit calendar events. The richer appearance must not be interpreted as current adoption or live community activity.

## Prioritised remaining backlog

| Priority / phase | Work and acceptance criteria |
|---|---|
| P0 activation | Adam reviews concrete staging; resource separation, verified Access, explicit team roles, configured edge limits, logging/privacy/contact/retention decisions. Anonymous collection stays disabled until approved. |
| P0 data | Agree official calendar import owner/format; reviewer verifies source conflicts. Imported editions/components have stable IDs and precision; no inferred exact deadlines. |
| P1 operations | Apply on synthetic staging from clean backup; verify a real scheduled run and alert failure; run retention preview; rehearse restoration. CI checks must be required by actual repository rules. |
| P1 evaluation | Human-led pilot recruitment and task sessions; report weekly suppressed figures, task evidence and limitations. Verify the real December deadline. |
| P2 / Phase 3 | Consent/ownership/visibility model, persistent private saves/notes/tasks, explicit opt-in legacy plan import, account rights/deletion, opted-in academics and course matching. Integration tests must prove owner-only reads/writes, immediate opt-out and no automatic contact. |

The old 32–47 engineer-day estimate is superseded by this delivered local slice. Remaining staging/resource verification is provisionally 2–4 engineering days once access and decisions exist; governance and recruitment have no confirmed duration. The persistent-account/collaboration phase is provisionally 15–25 engineering days after an agreed data/privacy model, excluding institutional review and scanner procurement. These are planning estimates, not promises. A credible December checkpoint is a reviewed build, staged operations evidence and early task feedback; a complete six-week evaluation depends on the approved start date.
