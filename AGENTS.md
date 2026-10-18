# INGENIUM+ Vercel checkout

This is the editable Vercel migration of the INGENIUM+ public prototype. Use `VERCEL_DEVELOPMENT.md` for the local workflow.

- Keep existing prototype/sample labels, official source evidence and programme status distinctions.
- `config/vercel-project.json` identifies the intended Vercel project. Verify the linked project and team before publication. Never deploy another project from this checkout.
- Use Node 22.22.0 and the npm lockfile. `npm test` validates the data, logic, types, build and rendered Vercel routes.
- The `.openai/hosting.json` manifest and `worker/` are retained compatibility references. Do not publish this checkout through Sites or push to the `sites-reference` remote.
- The public Vercel runtime uses the reviewed release snapshot. Do not activate collection or invent D1, R2, identity or membership bindings.
- Keep `.env*`, `.vercel/`, `.wrangler/`, credentials and generated deployment bundles out of source control.
