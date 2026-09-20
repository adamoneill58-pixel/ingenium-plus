# Security and privacy

## Identity and authorisation

The hosting layer authenticates the user and supplies trusted identity headers to the Worker. The application maps the stable subject to a profile. A first sign-in creates only a student membership. Staff, contributor, reviewer and administrator roles require an administrator-controlled membership grant. Mode switching changes presentation only.

Every private endpoint checks an explicit permission server-side. Ownership checks protect call-to-academic recommendations and submission monitoring. Reviewer self-approval is denied. Public queries require published status and never join profile tables.

## Database controls

- Foreign keys, uniqueness constraints and score/decision checks.
- Parameter binding for all user values.
- Explicit public/draft state and immutable versions.
- Append-only audit triggers.
- Separate database per environment.
- No direct browser database client.

D1 does not provide PostgreSQL RLS. This is the central residual risk of the native architecture: a future endpoint can be unsafe if it bypasses the shared authorisation layer. Security tests and code review must therefore cover every endpoint before deployment.

## Storage controls

- Private R2 binding; no public bucket route.
- Quarantine prefix and metadata state.
- Filename/MIME/extension/signature/size checks and SHA-256.
- Metadata-write failure cleans up the just-created object.
- Original source file is never modified by extraction or publication.
- Unscanned content cannot be described as safe or public.

## Web and API controls

- JSON endpoints enforce content type and bounded fields/lists.
- State-changing endpoints reject cross-origin requests and persistent D1 rate limits cover profiles, submissions, uploads, feedback, interests, reviews, membership changes, refreshes and rollback.
- Source refresh has a strict HTTPS host allowlist, redirect denial and response-size limit to reduce SSRF risk.
- URLs are rendered as external links only from reviewed records.
- Sensitive or privileged values are server bindings; `.env.example` contains names, not secrets.
- Errors avoid returning stack traces or database details.

## Recommendation privacy and fairness

- No protected characteristic is collected or inferred for ranking.
- Student profiles are private.
- Academic discoverability is opt-in and defaults false.
- Opted-out profiles fail the hard filter.
- Explanations come from score components, not invented narrative.
- Feedback records an interaction, not an application or collaboration.
- Cross-institution diversity is applied only after eligibility.

## Required pre-pilot work

- Threat-model review by an approved security owner.
- Staging penetration and access-control test.
- Approved privacy notice, DPIA decision, retention and subject-rights procedure.
- Scanner integration and safe document-rendering policy.
- Confirm final thresholds and central abuse-monitoring/alert ownership for the implemented rate limits.
- Validate the implemented origin policy against the final hosting authentication contract during staging.
- Dependency and secret scanning in CI.
- Named incident response and data-protection contacts.

No privileged credential is checked in or referenced from a `NEXT_PUBLIC_` variable.
