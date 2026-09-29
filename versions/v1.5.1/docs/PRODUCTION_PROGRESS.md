# INGENIUM+ v1.5.1 production progress

Last updated: 20 September 2026. Branch: `v1.5.1`.

## Implemented and locally verified

- Existing v1.5 graph-first experience and principal routes preserved.
- Migration-driven D1 schema for organisations, identities, memberships, profiles, graph content/versioning, calls, interest, documents, review, recommendations, refresh and audit.
- Idempotent seed generator and checked-in seed for 104 records, 404 relationships, 34 sources, 10 universities and 104 semantic feature vectors.
- Principal public routes read published D1 rows when bound, with a clearly identified static seed fallback for local rendering/recovery.
- Student and Staff routes plus visible mode switching that does not grant permissions.
- Preferred mode persistence, with every protected operation still re-authorised server-side.
- Trusted-header authentication mapping, default student membership, administrator-only role grant and deny-by-default staff APIs.
- Private student profiles with practical study, delivery, travel, schedule and credit preferences; structured staff offered/sought expertise, methods, facilities and teaching interests; staff discoverability opt-in.
- Call and module submission, proposal state, independent review, changes requested/rejection/approval and immutable content versions.
- Published call/module revision workflows that preserve the live version until independent approval; rejected revisions leave public data unchanged.
- Private R2 quarantine upload implementation with allowlist, size, filename, MIME/extension/signature/structural checks, duplicate-hash rejection, hash and cleanup controls.
- Ingestion-job and extraction-result schema plus trusted scanner/extractor recording boundaries; extraction always creates a review proposal.
- Own-submission monitoring, in-product expression of interest, proposal comparison, evidence download/document decisions and expanded Data Health interfaces.
- Four deterministic recommendation types, hard filters, lexical/taxonomy/local-semantic/graph/practical/complementarity scoring, organisation diversity, explanations, stored runs and feedback.
- Official-host source refresh with conditional requests, timeouts, exponential retry scheduling, checksums, run records, failure evidence and human review proposals.
- Append-only audit triggers.
- Same-origin mutation enforcement and persistent per-account rate limits for high-impact actions.
- Clean migration/seed and local database backup/restore verification.

## Implemented but not production-verified

- D1/R2 bindings and scheduled Worker handler: code and configuration exist; no remote resource is provisioned.
- ChatGPT identity headers: existing hosting integration retained; role lifecycle needs staging validation with real approved test accounts.
- R2 uploads: storage path is implemented but cannot be exercised without a bucket binding.
- Live source refresh: implementation is tested structurally; no run is claimed without a provisioned D1 scheduler and recorded result.
- Public D1 cutover: queries are implemented; production currently falls back until migrations are applied and bindings exist.

## Designed but deliberately not represented as complete

- Malware scanning and general PDF/Office extraction. New uploads remain private/pending until approved services are connected.
- High-volume queue-backed extraction/recommendation jobs. Current on-demand calculation is appropriate to the seeded dataset.
- Automated scanner/extractor execution and safe document rendering. Integration contracts and proposal storage exist; providers are not provisioned.
- Remote object-storage backup/restore.
- User data export/deletion interface and institutional contact workflow.

## Blocked by credentials or infrastructure

- Staging and production D1 database IDs.
- Staging and production R2 bucket IDs.
- Deployment/scheduler authority.
- Approved scanner/extraction endpoints and service credentials.
- Remote backup/restore controls.

## Blocked by governance and explicit approval

- Institutional authentication/domain rules and first administrator.
- Real user invitations or pilot.
- Real personal/confidential document import.
- Public contact/discoverability policy.
- Privacy notice, controller/processor roles, DPIA decision and retention schedule.
- Production publication or replacement of the current deployment.

## Phase status

| Phase | Status |
| --- | --- |
| 0 Audit and architecture | Complete locally |
| 1 Database and security foundation | Complete locally using D1/R2 alternative; remote provisioning pending |
| 2 Static-data migration | Complete and reconciled locally |
| 3 Identity and modes | Complete locally; staging identity/role test pending |
| 4 Calls, modules and uploads | Submission and quarantine complete; scanner/extractor pending |
| 5 Recommendation foundation | Complete local deterministic hybrid baseline |
| 6 Recommendation experiences | Student, staff, collaborator, call-to-staff and feedback APIs implemented |
| 7 Refresh and monitoring | Implemented; scheduled remote run pending |
| 8 Evaluation and hardening | Automated checks complete; security/accessibility and remote restore pending |
| 9 Controlled pilot | Not started; requires approval |

## Acceptance audit

Status meanings: **Verified local**, **Implemented/unverified remote**, **Partial**, **Blocked by approval**, or **Not applicable to chosen architecture**.

| Criteria | Status | Evidence or gap |
| --- | --- | --- |
| Published relational reads and route parity | Verified local / remote pending | D1 published loader, clean seed and route renders; PostgreSQL criterion replaced by documented D1 decision |
| Public/private separation; shared graph; safe mode switch | Verified local | published-only SQL, permission matrix and mode tests |
| Student profile and recommendations | Verified local | persistent endpoint, hard filters, explanations and feedback controls |
| Staff profile, calls, modules, status and recommendations | Verified local | staff endpoints/workspace; requires verified membership |
| Upload originals private/validated/quarantined | Implemented/unverified remote | R2 implementation; bucket and scanner absent |
| Review, rejection, change request, version and audit | Verified local | proposal workflow and immutable content versions |
| Reviewer source document rendering/diff | Partial | authenticated original download and structured current/proposed comparison exist; scanner/extractor and safe inline renderer pending |
| Rollback | Verified local / remote pending | version rollback API and revision-preservation workflow tests pass; remote drill pending |
| Deterministic, eligible, opt-in, complementary explanations | Verified local | automated recommendation/security tests |
| Embedding regeneration | Verified local | seed and approval upsert local feature vectors |
| Retryable/idempotent background recommendation jobs | Partial | input-hash idempotence and stored runs exist; external queue binding is not provisioned, so first calculation remains on demand |
| Offline baseline comparison | Verified synthetic | evaluation command; no real labelled set |
| Human pilot evidence | Blocked by approval | no users invited and no claim made |
| Scheduled refresh and change proposals | Implemented/unverified remote | Worker handler and run/proposal service; no live run claimed |
| Stale-data visibility and audit chain | Verified local | timestamps, Data Health and append-only audit |
| Clean migrations and database restore | Verified local | automated SQLite migration/seed and backup/restore |
| Storage restore | Blocked by infrastructure | no R2 bucket |
| Production build and secret boundary | Verified local | Node 22 build, route rendering, server startup, same-origin controls and `.env.example` |
| Controlled staging pilot | Blocked by approval/infrastructure | required before production transition |

## Verification results

- `npm test`: passed on Node 22.22.0.
  - 85 preserved base entities, 343 relationships, 29 sources and 6 journeys validated.
  - Five preserved v1.5 logic tests passed.
  - Ten v1.5.1 database, workflow, security and recommendation tests passed.
  - Clean migration/seed and non-production restore passed with 104 content records.
  - Strict TypeScript passed.
  - Production Worker build passed with 36 public/API routes.
  - Nineteen server-rendered route checks passed.
- Hosting-compatible Sites build helper: passed.
- Portable production server: `/`, `/student` and `/staff` returned HTTP 200.
- Synthetic recommendation evaluation: Precision@3 `0.583333`, Recall@3 `1`, NDCG@3 `0.959860`, eligibility violations `0`, coverage `1`. The lexical baseline NDCG@3 was `0.662178`; this is synthetic evidence only, not a real-world superiority claim.
- `npm run lint`: environment-blocked. The inherited Next.js ESLint preset stalled before analysing even a single file on two bounded runs; it emitted no source diagnostic. TypeScript, build and route rendering remain green.
- Automated localhost browser inspection: blocked because the in-app browser could not verify its administrator-enforced security policy. Direct production-server responses and rendered-route tests passed; no security bypass was attempted.

## Exact next human action

Approve creation/use of a dedicated staging D1 database and private R2 bucket in the existing Sites/Cloudflare project. Then provide or select the first administrator/reviewer identities and the approved malware-scanning approach. Do not upload real documents or invite real users before those decisions and the staging gate are complete.
