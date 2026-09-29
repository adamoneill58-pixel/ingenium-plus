# Recovery and restore runbook

## 1. Identify the intended release

Read `CURRENT_VERSION.txt`, `manifests/RELEASE_INDEX.json` and `documentation/DEPLOYMENT_INVENTORY.md`. Do not infer a version from a folder or URL name. Match a deployment to its recorded Sites version and full source commit.

## 2. Verify archive integrity

From the archive root:

```bash
shasum -a 256 -c manifests/CHECKSUMS.sha256
unzip -t releases/v1.5.1/INGENIUM+_v1.5.1_SOURCE.zip
```

Stop if a checksum differs. Preserve the damaged copy for investigation; do not overwrite the only evidence.

## 3. Restore source safely

Create a new empty recovery directory and extract the selected `*_SOURCE.zip` into it. Never extract over the active checkout. The ZIP contains source, configuration, tests, migrations and documentation but deliberately excludes dependency directories, secrets and live data.

## 4. Install and verify

Use Node 22 LTS for v1.4–v1.5.1. For v1.5.1, install from the committed lockfile and run:

```bash
npm ci
npm test
npm run lint
npm run recommendations:evaluate
npm run check:links
```

Run `npm run check:links:live` only with network access and interpret availability separately from factual currency. Historical v1.4/v1.5 did not commit a lockfile; install in a disposable recovery copy without committing the generated lockfile to those releases.

For v1.0–v1.3, open through a local static server. Run `node --check app.js`; for v1.3 also run `python3 scripts/verify_data.py`.

## 5. Database recovery

Apply `releases/v1.5.1/data/SCHEMA.sql` to an empty non-production D1-compatible database, then apply `SEED.sql`. Reapplying the seed should be safe because it is idempotent. Confirm 104 content records, 404 relationships, 34 sources, ten organisations, 104 feature vectors and 25 refresh schedules. Run the repository backup/restore verifier before any production recovery.

The archived seed does not restore profiles, memberships, submissions, documents, audit events or R2 objects. Those require an authorised encrypted operational backup and a separately approved incident procedure.

## 6. Deployment boundary

A restored source tree, passing build, Git commit, Git push, Drive upload or Sites saved version is not a production deployment. Before any deployment:

1. Confirm the `.openai/hosting.json` project ID.
2. Confirm whether the target is the public v1.5 project or private v1.5.1 project.
3. Verify D1/R2 bindings only on the private target.
4. Save a version from the exact reviewed commit.
5. Obtain explicit authority for deployment and access-policy changes.
6. Deploy that saved version and verify the resulting URL/status.

Never deploy the private application over the public project or make the private project public as a shortcut.

## 7. Damaged checkout recovery

If a checkout or `node_modules` is damaged, keep the original untouched, extract the archived source to a new directory, install dependencies there and compare results. Do not use `git reset --hard`, destructive cleanup or in-place overwrites as the first recovery step.
