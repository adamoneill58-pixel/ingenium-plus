# Static-data migration and reconciliation

## Source

The importer reads the validated v1.5 aggregate exported by `lib/v15-data.ts`. That aggregate preserves the original v1.4 evidence archive and adds v1.5 learning records and visibly labelled sample profiles. The source module remains the canonical seed input, not the production read path.

## Generate and apply

```bash
npm run db:seed:generate
```

This creates `db/seed/v151.sql`. Apply the schema migration first, then run the separate seed/import:

1. `drizzle/0000_v151_production.sql`
2. `db/seed/v151.sql` (seed/import; not an automatic schema migration)

The seed uses stable source IDs, record IDs, relationship IDs, version IDs and `INSERT OR IGNORE`/`INSERT OR REPLACE`. Running it again does not create duplicates. Do not hand-edit the generated seed; update the typed source and regenerate.

## Reconciliation result

Generated on 19 September 2026:

| Collection | Source | Seed target |
| --- | ---: | ---: |
| Records | 104 | 104 published content records and initial versions |
| Relationships | 404 | 404 graph relationships |
| Evidence sources | 34 | 34 evidence rows |
| Partner organisations | 10 | 10 organisation rows |
| Semantic vectors | 104 | 104 local feature vectors |

The database test applies both files to a clean SQLite database, verifies the ten organisation anchors, checks minimum record/relationship counts, exercises constraints and confirms audit immutability.

## Public read cutover

Principal public routes call `getRuntimeDataset()`. With a D1 binding, it reads only published database rows and their published versions. Without a binding—or before a database has been seeded—it reports and uses `static-fallback`, which exists solely for local rendering and safe deployment recovery. Private rows are never used as fallback content.

## Rollback

- Application rollback: redeploy the last approved application version; the v1.5.1 migration is additive.
- Content rollback: point `content_records.published_version_id` to a prior reviewed version in a transaction and append an audit event. The operational API for this must be exercised in staging before production access is delegated.
- Migration rollback: restore the D1 backup captured immediately before migration. Do not attempt an ad-hoc destructive down migration on production.

## Remaining production check

The migration is verified against local SQLite, which matches D1 SQL semantics used here. It has not been executed against a provisioned remote D1 resource because no staging or production binding/credentials were supplied.
