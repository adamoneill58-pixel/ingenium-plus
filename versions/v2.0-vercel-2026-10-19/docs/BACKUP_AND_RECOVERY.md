# Backup and recovery

Database and object storage are backed up and restored separately because a database row alone is not a document original.

## D1 database

Before every production migration or major import:

1. Create and label a D1 export/backup using the approved Cloudflare control plane.
2. Record database identity, application commit, migration filenames, row-count reconciliation and backup timestamp.
3. Retain according to the institutional schedule.
4. Apply migrations only after the backup is verified.

Recovery creates a separate non-production D1 database from the backup, runs integrity/count checks, binds a staging Worker and exercises public reads plus reviewer/audit queries. Never test a restore over the live database.

`npm run test:v151` includes a local backup/restore exercise: it builds the migrated and seeded database, creates a SQLite backup, opens it separately, runs `integrity_check` and reconciles content row counts. This verifies the logical process, not the remote control-plane export.

## R2 documents

Production must enable an approved object-retention/versioning strategy or scheduled replication to a separate recovery bucket/account. The manifest must include storage key, size, SHA-256, metadata and database document ID. Recovery verifies each object hash against D1 before making a document available to reviewers.

An R2 backup has not been tested because no bucket is provisioned. This is a staging gate.

## Recovery objectives

RPO/RTO are institutional decisions. A reasonable pilot proposal is 24-hour RPO and four-hour RTO for database metadata, with the same or stronger protection for source originals, but this is not approved policy.

## Incident recovery order

1. Disable writes/uploads and preserve logs.
2. Identify the last known-good application commit, database backup and object manifest.
3. Restore into isolated staging.
4. Verify integrity, roles, published pointers, document hashes and audit continuity.
5. Obtain incident-owner approval.
6. Switch traffic or redeploy the known-good application.
7. Reconcile writes after the restored point; never silently discard them.
