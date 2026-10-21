# Staff Mode

Staff Mode lives at `/staff`. It supports controlled academic profiles, collaboration calls, module submissions, evidence uploads, recommendation experiences and status monitoring.

## Access flow

```mermaid
flowchart LR
  A[Authenticated person] --> B{Active verified membership?}
  B -- No --> C[Staff workspace denied]
  B -- Yes --> D[Staff profile]
  D --> E[Optional discoverability consent]
  D --> F[Calls and modules]
  D --> G[Call and collaborator recommendations]
```

An administrator grants staff, contributor, reviewer or administrator membership after institutional verification. There is no self-promotion path. Mode switching is navigation and never grants a role.

## Academic profile

Staff can store university, title, department, research interests, teaching areas, languages, availability, preferred contact route and collaboration formats. Offered and sought skills, methods, facilities and teaching topics are distinct fields so complementarity can be scored rather than inferred from generic similarity. Discoverability is a separate opt-in checkbox and defaults off. Private contact data is not returned by collaborator matching.

## Call lifecycle

```mermaid
stateDiagram-v2
  [*] --> PendingReview: staff submits structured call
  PendingReview --> ChangesRequested: reviewer asks for changes
  PendingReview --> Rejected: reviewer rejects
  PendingReview --> Published: independent reviewer approves
  Published --> Closed: deadline or owner action
  Published --> PendingReview: material revision proposed
```

Calls capture title, summary, description, type, disciplines, offered/sought skills, methods and facilities, teaching themes, target partner types, expected contribution, stage, funding, eligibility, countries, delivery/collaboration format, time commitment, dates, location, confidentiality, contact workflow and official source. An expression of interest is recorded inside INGENIUM+ and does not send an email. A contributor can prepare a revision from My submissions; the existing published version remains live until a different reviewer approves the revision.

## Module lifecycle

```mermaid
stateDiagram-v2
  [*] --> UnderReview: staff submits module
  UnderReview --> ChangesRequested
  UnderReview --> Archived: rejected
  UnderReview --> Published: approved and versioned
  Published --> UnderReview: revision proposed
  Published --> Archived: withdrawn through reviewed change
```

Modules capture prerequisites, outcomes, skills, campus/location, semester/dates, workload, capacity, recognition and the official application route in addition to core academic metadata. They remain `is_published=0` until initial approval. Each approved payload becomes an immutable version, the public pointer is updated and a semantic feature vector is regenerated. Rejected revisions do not alter the published version.

## Status monitoring

`/api/v151/submissions` returns only the authenticated contributor’s proposals, calls and documents. The workspace shows proposal status and separate scan/review status for uploads.

## Reviewer and administrator areas

- `/staff/review`: pending changes with current-versus-proposed values, authenticated original-evidence download, document decisions and quarantined status; self-review is denied.
- `/staff/data-health`: published/unverified counts, proposal state, document state, refresh runs and recommendation activity.
- `POST /api/v151/admin/memberships`: administrator-only membership grant after first sign-in.

Reviewers can approve, reject or request changes. Production document approval must additionally enforce `scan_status=clean`; the scanner dependency is not provisioned in this checkout, so uploaded documents remain private.
