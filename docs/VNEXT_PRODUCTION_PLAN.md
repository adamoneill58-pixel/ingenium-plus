# INGENIUM+ v1.5.1 production-transition plan

Status date: 19 September 2026. This document records the implemented transition, not a claim that a production service is live.

## Objective

Move the graph-first v1.5 discovery prototype to a controlled multi-user platform with persistent Student and Staff modes, reviewed institutional contributions, private document storage, scheduled source monitoring and explainable recommendations. Official university systems remain authoritative for admission, enrolment, recognition and academic records.

## Architecture decision

The specification recommended Supabase/PostgreSQL by default. The repository audit found a concrete incompatibility with that default: the existing application is a vinext Cloudflare Worker already configured for D1, R2 and platform-provided ChatGPT authentication, while no Supabase project, credentials, local runtime or dependency existed. v1.5.1 therefore implements the same responsibilities with:

- Cloudflare D1 for relational persistence and migrations;
- Cloudflare R2 for immutable upload originals;
- trusted `oai-authenticated-user-*` headers for identity;
- server-side membership and permission checks for access control;
- a Worker scheduled handler for source refresh;
- deterministic local semantic feature vectors, avoiding disclosure to an unapproved external embedding provider.

This is a material deviation. D1 is SQLite, not PostgreSQL, and has no PostgreSQL row-level-security facility. The implementation compensates with deny-by-default server endpoints, role tests, published-only public queries, schema constraints and audit events. A future PostgreSQL move remains possible because the service and schema boundaries are explicit.

## Delivery phases

| Phase | Result in v1.5.1 | Verification |
| --- | --- | --- |
| 0. Audit | Existing graph, routes, local state, auth scaffold, hosting config and Git state inspected | Baseline test/build passed before changes |
| 1. Persistence and security | 20-table D1 model, role permissions, D1/R2 bindings and migration | Clean migration tests and security tests |
| 2. Static migration | Idempotent generator imports 104 records, 404 relationships and 34 sources with provenance and feature vectors | Seed applies twice safely; reconciliation test |
| 3. Identity and modes | Authenticated profiles, Student/Staff routes, mode switch and verified memberships | Render, API and role-boundary tests |
| 4. Contributions | Call/module submission, quarantine upload, own-submission status and human review | Route build plus migration/validation tests |
| 5. Recommendations | Eligibility-first hybrid engine, four recommendation types, explanations, feedback and persisted runs | Determinism, eligibility, opt-out and metric tests |
| 6. Refresh | Official-host allowlist, checksums, run history, review proposals and Data Health | Unit/build verification; no live scheduled run without D1 |
| 7. Hardening | Production build, route rendering, local backup/restore, documentation | Full Node 22 suite |
| 8. Controlled pilot | Not executed | Blocked by approval, real identities, staging resources and institutional governance |

## Immediate provisioning sequence

1. Create separate staging D1 and R2 resources in the approved Cloudflare/Sites account.
2. Bind D1 as `DB` and R2 as `DOCUMENTS`.
3. Apply `drizzle/0000_v151_production.sql`, then `drizzle/0001_v151_seed.sql`.
4. Insert the first administrator membership through an approved out-of-band bootstrap process; there is deliberately no self-promotion endpoint.
5. Connect an approved malware-scanning service. Until then, uploads remain private with `scan_status=pending`.
6. Connect an approved extraction service if PDF/Office extraction is required; no confidential document may be sent externally without approval.
7. Run staging smoke, permission, accessibility, upload, restore and refresh tests.
8. Obtain the institutional decisions listed in `PRODUCTION_PROGRESS.md` before inviting pilot users.

## Completion rule

The local/staging-ready implementation is complete only when the checked-in tests pass. Production transition remains incomplete until resources are provisioned, scanning is enforced, an approved controlled pilot is complete, and a human explicitly approves deployment.
