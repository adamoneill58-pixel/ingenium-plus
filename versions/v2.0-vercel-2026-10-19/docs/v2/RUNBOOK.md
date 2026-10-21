# Cloud, migration and maintenance runbook

This is an operator handover, not evidence of a deployed v2 service. No cloud resources, roles, network policies, repository rules or paid services were created by this build. Never use live private data for staging.

## Local development and verification

Use Node from `.nvmrc` and the lockfile. `npm ci`, `npm run dev`. Local research fallback is labelled. `npm test`, `npm run lint`, `npm run check:links` are the release checks. The full HTTP sweep is optional and may encounter source blocking; do not change catalogue facts merely to make a link check green. Verify the critical official application links manually.

Local public discovery needs no identity. Production defaults to `ALLOW_STATIC_FALLBACK=false`; missing bindings or migration failures produce an unavailable/setup state. All `/api/v151/*` routes and private profile workflows remain paused independently of UI mode. No automatic profile/session/administrator bootstrap occurs on a visitor GET.

The connected-campus hosted release explicitly sets `PUBLIC_CATALOGUE_MODE=release-snapshot`. This mode serves the reviewed, public-only v2 catalogue bundled with the Worker, consistently across discovery, details, network and calendar; it performs no request-time seed or database import. Its source label is “Source-backed release snapshot”. Switch back to database mode only after a reviewed import has been applied and verified through the configured database import workflow. The checked-in refresh handler is available, but no recurring hosted source-refresh schedule is activated by this release.

Before the first hosted v2 migration, the live database overview confirmed only the v1 tables: `calendar_events` and pilot tables were absent. The unapplied v2 migration was adjusted to preserve the legacy audit column instead of dropping historical data. All new pilot aggregate tables exclude identifiers, and private account routes remain paused. No existing row or column is removed by the upgrade.

## Own Cloudflare account, separate staging and production

An authorised operator creates two separate Workers/D1/R2 resource sets and supplies actual names and IDs. Keep buckets private, accounts protected and secrets in the deployment control plane. Use `.env.example` as a list of inputs, not a file to commit with values. The generator requires `INGENIUM_WORKER_NAME`, `INGENIUM_DB_ID`, `INGENIUM_R2_BUCKET`, `PUBLIC_BASE_URL`; Access domain and AUD remain server configuration. Set one environment's values at a time.

```bash
npm run cloud:configure
INGENIUM_DEPLOY_CONFIG=.wrangler/ingenium.jsonc npm run build
npx wrangler deploy --dry-run --config dist/server/wrangler.json --outdir work/cloud-dry-run
```

The generated `.wrangler/ingenium.jsonc` is ignored. Paths resolve relative to that file; the built config under `dist/server` points at compiled Worker/assets. Rebuilding is required after switching targets. A synthetic staging config and the built deployment dry run were exercised locally. Synthetic example IDs are not provisioned resources and must never be deployed.

After Adam authorises a specific staging rollout, the operator can use the built `dist/server/wrangler.json` for deployment. This task does not authorise that final action. Do not deploy directly from the historical Sites binding configuration. Verify the host, Worker name, D1 ID and R2 bucket in the dry-run output before proceeding. Keep a build/commit record and an explicit production promotion decision.

## Migration, import and recovery

1. Before an authorised target migration, export the target D1 database to a private, encrypted operator location. Record checksum, timestamp, commit and schema version. Verify a restored synthetic/staging copy with integrity and row-count checks. Do not store private SQL in the repository or Drive originals.
2. Apply `drizzle/0000_v151_production.sql` on an empty target, then `0001_v2_pilot.sql` exactly once via the migration journal. On an existing v1.5.1 target, apply only pending `0001`. Do not use the historical seed/bootstrap in visitor requests. The migration adds availability/calendar/aggregate tables, removes legacy audit IP hashes and installs profile-write locks.
3. Run `npm run data:import` for validation and an ignored `work/v2-import.sql` dry run. Format is `version:"2.0.0"`, `sources`, `records`, `relationships`, optional `calendarEvents`. IDs/slugs/source endpoints are validated; calendar IDs are stable and unique; dates must be possible; timed values need an offset and confirmed valid timezone; approximate windows need a label.
4. Select the correct config explicitly. For an authorised local import: `INGENIUM_DEPLOY_CONFIG=.wrangler/ingenium.jsonc npm run data:import -- --apply-local`. Remote application additionally requires `--apply-remote --confirm-remote-import`; do not run it merely because a build passed. Migration commands must likewise pass the reviewed config explicitly.
5. Imports are insert-only and repeatable, including interruption and retry. Existing reviewed rows/version pointers survive. This also means refreshed JSON does not silently overwrite older database content. Prepare a reviewed revision for existing records whose facts differ; the availability queue supports independent approval. A fresh target imports the current canonical values.
6. Verify published counts, no orphan edges, source attribution, unpublished exclusion, preview status, real identity rejection and protected roles. Compare database/public output rather than just trusting import success.

`npm run test:v151` includes a synthetic additive upgrade, D1-compatible SQLite backup, reopen and integrity/foreign-key/count checks. It is evidence for the local recovery procedure, not a backup of production. Rollback uses the private pre-migration export restored into a separate verified resource, or a forward repair. A previous Worker can be restored only with a schema it supports. Do not promise a lossless down migration: later aggregates, reviews and other writes would need explicit preservation/reconciliation. The removal of IP hashes is intentional; prevent them being reintroduced by a legacy application rollback.

## Team authentication and operational routes

Set `ACCESS_TEAM_DOMAIN` to the configured `<team>.cloudflareaccess.com` host and `ACCESS_AUD` to the Access application audience. Configure actual host/path protection in the account separately; the Worker also validates RS256 signature against that team's certificates, issuer, audience, expiry and not-before. Old `oai-*` headers never establish identity. This is not university SSO.

After verifying the intended Access subject, `node scripts/grant-team.mjs <subject> administrator` prepares ignored SQL for one first administrator. Review and execute only on the authorised target. Later `pilot_team` preparation requires an existing administrator. No email match grants a role. Identity alone is insufficient: `pilot_team_memberships` is checked on every dashboard/export/review service request. Administrators can trigger refresh and approve/reject availability proposals with a 5–500 character reason; repeated/concurrent decisions cannot apply twice. Self-review is prohibited. Public visitors cannot access these tools.

## Weekly refresh and data health

The own-account config declares Monday 05:00 UTC. The scheduled Worker checks only the three explicit official source URLs in `lib/v2/status-refresh.ts`, respecting robots, no redirects, timeouts and bounded response size. It stores factual observations, attempt/check status and review proposals; it does not archive pages or scrape personal profiles. Automatic closure is limited to an already-reviewed matching elapsed deadline. New/reopened availability requires review. A parse conflict makes availability unknown; other failures retain the assertion with a warning. Human verification remains separate from successful parsing.

The protected dashboard shows stale/conflicted/failed records, pending availability reviews, the latest refresh summary and aggregate totals. Detail tables are capped and labelled; totals use separate sums. For a new source, add an explicit URL/parser fixture and independent review. Failure alerts can use an operator-controlled `ALERT_WEBHOOK_URL` with a fixed message and no identity/record details.

Before activation, trigger `/api/v2/refresh` as an authorised staging administrator with same-origin JSON; inspect the queue and timestamps. Use Wrangler's documented local scheduled-test mechanism against the compiled Worker, then verify one actual deployed cron result in Data Health. A cron declaration is not proof that a deployed schedule ran. The service deliberately does not retry unboundedly; the next reviewed manual or weekly attempt is available after a failure.

## Pilot collection, privacy, abuse control and cleanup

Collection defaults off in both browser and API. Enable only after decisions on controller/processor roles, contact, rights, incident handling, retention and infrastructure logging. Configure the host's edge abuse control for `/api/v2/events` and `/api/v2/survey`, verify it blocks bursts, then set `EDGE_RATE_LIMIT_READY=true`; that flag does not create a rate-limit policy. Configure approved `PILOT_START_DATE`, optional duration, and `PILOT_ANALYTICS_ENABLED=true` only after staging review. Collection stops outside the configured UTC date window. No per-IP application limiter or raw event log is introduced. Decide provider log settings separately; the generated application config disables Workers observability, which is not a claim that providers process no network data.

Closed survey answers are independent weekly counts. Q1/Q2 cannot carry a role dimension. Free text has only question/week, stays flagged and is not displayed/exported by the dashboard. An approved restricted review workflow is needed before accessing it. Exports include weekly counts only, suppression below five and complementary suppression. Never externally copy exact dashboard tables or use marginal totals to reconstruct suppressed cells.

`PILOT_START_DATE=... node scripts/retention.mjs` prepares COUNT-only preview SQL. With approved `SURVEY_RETENTION_DAYS`, `AUDIT_RETENTION_DAYS` and `RETENTION_APPROVED=true`, it prepares DELETE SQL in ignored `work/retention.sql`; it never executes. The current proposal removes free text on/after pilot end +90 days and audit entries older than365 days. Review the preview on the chosen target before any authorised cleanup; schedule execution only after policy approval. Tests prove preview preserves rows and cleanup preserves recent audit entries. Aggregate retention is still a policy decision; do not silently claim indefinite approval.

## Promotion and maintenance

Require the actual CI `verify` check and PR review through repository rules configured by its owner. The workflow file alone does not enforce branch protection. Review staging screens, public-only database output, forged/expired identity, cross-origin writes, ICS imports in a real calendar client, same-origin edge controls, actual cron results, alerts, restore and cleanup preview. Record outcomes and approvals before production promotion. No public pilot communications have been sent.

Weekly: review Data Health, source conflicts and official links; process independent reviews; inspect restricted operational alerts; verify backups and aggregate reporting. At pilot end: stop collection, export approved suppressed results, review retention dates and deliver the evaluation pack. Persistent profiles, uploads/extraction, opted-in academic discovery, personal notes/tasks and contact workflows remain Phase 3 decisions and must not be enabled by changing a visual mode.

Current pricing, limits and network settings depend on the chosen account. Check [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/) and [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545) before operational activation. No paid-plan requirement or cost promise is made here.
