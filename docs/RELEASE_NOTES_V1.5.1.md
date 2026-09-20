# INGENIUM+ v1.5.1 release notes

v1.5.1 turns the graph-first v1.5 prototype into a migration-driven, staging-ready multi-user platform while preserving the existing public discovery experience.

## Added

- Persistent Student and verified Staff modes.
- Organisation memberships and server-enforced roles.
- Private student and opt-in academic recommendation profiles.
- Practical student delivery/travel/semester/credit constraints and explicit academic offered-versus-sought expertise.
- Reviewed collaboration-call and module submissions.
- Versioned call and module revisions that leave the prior public version intact until approval.
- Private R2 document quarantine with upload validation and SHA-256.
- Reviewer queue, contribution status and Data Health views.
- Proposal comparison, authenticated evidence download, document decisions and internal expression-of-interest workflow.
- Explainable eligibility-first recommendations for students, calls and academics.
- Local semantic feature vectors, graph/practical/complementarity scoring and feedback.
- Scheduled official-source checks that create review proposals rather than silently publishing.
- Conditional source requests, timeouts and bounded exponential retry evidence.
- Versioned content, audit evidence, idempotent data seed and recovery documentation.
- Same-origin mutation checks, persistent rate limits, duplicate-file rejection and trusted scanner/extractor integration boundaries.

## Preserved

The geography/network graph, public directories, learning catalogue, record pages, source ledger and browser-local planning utilities remain available. The existing verified/sample/calculated labels continue to apply.

## Important deployment boundary

No production deployment, D1/R2 provisioning, real-user pilot, real private-document import, scanner or extraction provider is included in this repository commit. Uploads must remain unavailable or quarantined until an approved scanner is connected. Official university systems remain authoritative.
