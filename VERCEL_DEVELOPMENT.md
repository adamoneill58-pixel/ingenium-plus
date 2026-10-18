# INGENIUM+ development and deployment

This is the editable Vercel checkout of INGENIUM+. Open `INGENIUM+.code-workspace` in VS Code. The project keeps the existing interface, styles, public catalogue, simulations and eight feature videos.

Configured production address: https://ingenium-plus.vercel.app

Vercel project: `A0N / ingeniumplus`. The exact project identity is in `config/vercel-project.json`. Deployment scripts check the local link and stop if it points to a different project.

## Run and edit

Use Node.js 22.22.0, as pinned in `.nvmrc`.

```sh
nvm use
npm ci
npm run dev -- --port 3019
```

Open http://localhost:3019. Changes to the source reload through Vite. The public demo runs without database credentials. Its catalogue uses the same reviewed release snapshot as the existing site.

In this prepared checkout, dependencies and the Vercel link are already set up. VS Code's **Terminal > Run Task** includes **INGENIUM+: develop**, **build for Vercel**, **test**, **deploy preview** and **deploy production**.

## Test and publish changes

```sh
npm test
npm run deploy:preview
npm run deploy
```

The deployment commands run the checks and upload the tested Vercel build. A preview does not update the public production address. The production command publishes to the configured project. Sign in to the Vercel CLI when it requests authentication.

For a fresh clone or another computer, run `npm run vercel:link` once. This selects the existing INGENIUM+ project; it does not create another project. Credentials and `.env.local` are ignored by Git and excluded from upload. Do not commit tokens or environment files.

## Hosting implementation

`vite.vercel.config.ts` adds Nitro to the existing pinned Vinext renderer. `proxy.ts` preserves the request policy previously enforced by the Cloudflare entrypoint. The Vercel runtime reads the bundled public catalogue, and private account workflows and unactivated pilot collection remain closed.

`npm test` validates the data, logic, types and actual compiled Vercel function. `npm run test:sites` retains the historical Cloudflare regression path. The old `vite.config.ts`, `worker/` and `.openai/hosting.json` remain reference/development compatibility files; Vercel publication uses `vercel.json` and `vite.vercel.config.ts`.

The public interface, social/learning simulations and eight video assets are shared unchanged. Existing Cloudflare database and storage resources are not copied or written during the Vercel deployment. Activating real account, team, upload or collection services requires a separate backend configuration.

## Source control

Work on the `vercel-migration` branch in this normal local Git checkout. The `sites-reference` remote points at the original local source and has pushing disabled. This deployment is not connected to automatic GitHub builds: publish from this folder with the checked deployment commands. Changes made in the older Sites checkout do not automatically update this Vercel project.
