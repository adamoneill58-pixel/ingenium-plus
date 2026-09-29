# INGENIUM+ architecture

## System boundary

The public v1.5 site is a read-only discovery product with browser-local planning. The private v1.5.1 platform adds authenticated mutations, persistent profiles, contribution/review workflows and private documents. They are separate Sites projects and neither may be inferred from the other’s URL.

```text
Browser
  |-- public pages / graph / geography / catalogue
  |-- Student mode
  |-- Staff mode / review / data health
  v
Vinext React application and server routes
  |-- trusted Sites identity -> profile + membership + permission checks
  |-- repository/service layer -> Cloudflare D1
  |-- document service -> private Cloudflare R2 quarantine
  |-- recommendation pipeline -> eligibility -> hybrid scoring -> reasons
  |-- refresh service -> official source snapshot -> proposed change -> review
  v
Independent approval -> immutable version -> published catalogue projection
```

## Frontend

React/Vinext renders the graph-first discovery workspace, geographic map, directories, rich records, Student and Staff workspaces, review queue and data-health dashboard. Verified, calculated and sample labels remain visible. Local planning utilities are not presented as official records.

## Server routes and services

Same-origin API routes handle session discovery, profiles, calls, modules, submissions, documents, reviews, refresh operations, recommendations, feedback and administrator actions. Business rules live in v1.5.1 service/repository modules so route handlers do not directly decide publication or permissions.

## Identity and permissions

The private deployment trusts identity headers supplied by the Sites platform. A profile is mapped to organisation memberships and server-side roles. Student, staff, reviewer and administrator capabilities are enforced for every mutation; hiding a button is never the security boundary. The first verified owner is bootstrapped idempotently with operational roles.

## D1 data model

D1 stores profiles, memberships, versioned content, graph relationships, calls, expressions of interest, documents and links, ingestion/extraction state, proposals, independent review decisions, refresh schedules/runs/snapshots, semantic features, recommendation runs/results/feedback, audit events, rate limits and system state. Published catalogue queries require the published flag; a proposed revision cannot replace the public record until approved.

## R2 document model

R2 stores private bytes under generated keys. D1 stores metadata, SHA-256, scan/extraction status and relationships. Upload validation precedes storage. Downloads are served through an authenticated route. R2 is not a public asset bucket.

## Recommendation pipeline

1. Build a private user/staff context and public content candidate set.
2. Apply role, publication, date and practical eligibility filters.
3. Calculate semantic, lexical/topic, graph, practical and complementarity components.
4. Rank deterministically and store the run/result evidence.
5. Return reasons, not only a score.
6. Record optional feedback for later evaluation.

## Review workflow

Contributors submit a new call/module or a revision. Supporting files remain private. Reviewers inspect the proposal and evidence and record an independent decision. Approval creates/activates a content version and audit evidence; rejection leaves the prior public version intact.

## Refresh workflow

Schedules target evidence sources. A run fetches with a timeout and bounded retry policy, records a checksum/snapshot and either records no change or creates a proposal. Human review remains the publication gate. Manual triggering is implemented; automatic cloud scheduling is not attached.

## Deployment flow

Source is committed and pushed to its project repository. A Sites saved version records an exact commit. Deployment is a separate explicit action. D1/R2 bindings belong only to the private project. The public project has no D1 or R2 binding. A local build, archive, Drive upload or Git push does not by itself deploy production.
