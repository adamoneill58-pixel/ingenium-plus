# INGENIUM+ v1.5.1

INGENIUM+ is a graph-first discovery and collaboration platform for the INGENIUM European University. A shared evidence graph supports public discovery, persistent Student Mode and verified Staff Mode.

## Run locally

Use Node.js 22 LTS (22.13 or newer).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:3000`. If that port is occupied, Vite selects the next available port.

For a production-equivalent check:

```bash
npm test
npm run start
```

## Product areas

- `/` — graph-first Network workspace with Geography and Network layouts.
- `/explore` — cross-dataset search and filters with cards or graph results.
- `/learning` — learning catalogue and browser-local semester builder.
- `/records/[slug]` — evidence-rich record pages, connections, history where available, sample people and contextual sample Chats.
- `/student` — persistent private student profile and database-generated, explained module recommendations.
- `/staff` — verified academic profile, call/module submission, uploads, staff recommendations and contribution status.
- `/staff/review` — reviewer proposal and document queue.
- `/staff/data-health` — operational content, refresh, upload and recommendation evidence.
- `/my-campus` and `/my-journey` — preserved optional browser-local planning utilities.
- `/research` — source ledger and freshness model.

## Useful commands

- `npm run validate:data` — v1.4 base-archive entity, source, journey and relationship integrity.
- `npm run test:logic` — v1.5 status, degrees, recommendations, semester and aggregate-data tests.
- `npm run test:v151` — schema, clean seed, backup/restore, permissions, upload security and recommendation tests.
- `npm run db:seed:generate` — regenerate the idempotent D1 seed from the typed v1.5 dataset.
- `npm run recommendations:evaluate` — compare the synthetic hybrid regression fixture with a lexical baseline.
- `npm run typecheck` — strict TypeScript check.
- `npm run lint` — React and Next linting.
- `npm run build` — production Cloudflare Worker build.
- `npm test` — full data, logic, TypeScript, build and rendered-route regression suite.
- `npm run check:links:live` — optional live HTTP check for official links.

## Trust and privacy boundaries

- Explicit dates drive statuses when available; stale “open” badges do not override passed deadlines.
- Conflicting official claims are shown as `Verification required` rather than silently resolved.
- Every record is classified as verified, INGENIUM+ calculated or sample information.
- Official application, enrolment, nomination and recognition systems remain authoritative.
- Student and Staff modes use persistent private profiles when D1 is provisioned. Legacy semester/journey planners remain explicitly browser-local.
- Staff discovery is opt-in; mode switching never changes a membership or permission.
- Drafts, unreviewed contributions and uploaded documents are never public.
- Student profiles and Chats in the public dataset are fictional, visibly labelled samples.
- The seed evidence refresh date is 13 September 2026; production refresh attempts are stored separately and must not be claimed unless a successful run exists.

## Persistence

The existing native deployment architecture is used: Cloudflare D1 as `DB`, private R2 as `DOCUMENTS`, and trusted ChatGPT authentication headers. Apply `drizzle/0000_v151_production.sql`, then the separate idempotent import at `db/seed/v151.sql`, to a clean staging database. Principal public routes use published D1 data when the binding exists and the verified seed fallback otherwise.

See `docs/VNEXT_PRODUCTION_PLAN.md`, `docs/PRODUCTION_ARCHITECTURE.md` and `docs/PRODUCTION_PROGRESS.md` before provisioning or deployment.

## Deployment

The Sites project link and binding names are stored in `.openai/hosting.json`. Saving or committing does not publish. Production publication, real users and real private documents require explicit approval. Follow `docs/DEPLOYMENT_RUNBOOK.md`; the v1.5.1 commit is staging-ready code, not a production launch.
