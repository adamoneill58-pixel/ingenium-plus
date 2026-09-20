# Deployment runbook

This runbook prepares a controlled staging release. It is not authorisation to publish.

## Prerequisites

- Approved Cloudflare/Sites account and separate staging project.
- D1 database bound as `DB`.
- Private R2 bucket bound as `DOCUMENTS`.
- Trusted authentication headers enabled by the platform.
- Named initial administrator, reviewer and security/data-protection contacts.
- Approved scanner integration if uploads are enabled.

## Build and migration

1. Use Node 22 LTS.
2. Install from the lockfile and run `npm test`.
3. Run `npm run recommendations:evaluate` and retain the report.
4. Back up the target D1 database and record its identity.
5. Apply `drizzle/0000_v151_production.sql`, then run `db/seed/v151.sql` as the separate idempotent import.
6. Reconcile 104 records, 404 relationships, 34 sources, 10 organisations and 104 feature vectors.
7. Bootstrap the first administrator through the approved control plane/SQL process, never through a browser self-grant.
8. Build a named staging version from the exact Git commit.

## Staging smoke test

- Browse all public routes signed out; confirm no private data appears.
- Confirm homepage reports `published database`, not `verified seed fallback`.
- Create a student profile and verify eligibility-filtered recommendations and feedback.
- Verify a non-staff account cannot enter staff APIs by switching mode.
- Submit a call and module with a verified staff account; confirm they remain non-public.
- Upload each allowed format and rejection cases; confirm originals stay private/pending.
- Review with a different account; exercise approve, reject and changes requested.
- Verify opted-out academics never appear in collaborator results.
- Run a due source refresh and inspect success/failure/proposal history.
- Run accessibility, responsive and keyboard checks.
- Complete the remote D1 and R2 restore drill.

## Rollback

- Application: redeploy the last named approved version.
- Database: stop writes and restore the pre-migration backup into a new D1 resource; verify before rebinding.
- Content: select a prior immutable content version transactionally and append an audit event.
- Documents: restore by manifest/hash into a private recovery bucket; do not change original hashes.

## Production gate

Production deployment requires explicit human approval after staging evidence, governance decisions, scanner/extraction decisions, security review and controlled pilot. This task deliberately does not deploy or replace the current public version.
