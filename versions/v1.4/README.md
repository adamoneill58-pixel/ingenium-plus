# INGENIUM+ v1.4

A student-first discovery layer for the INGENIUM European University. The interactive graph connects official programmes, BIPs, mobility, student projects, communities, platforms and research opportunities across ten partner universities.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production check:

```bash
npm test
npm run start
```

## Useful commands

- `npm run dev` — development server
- `npm run validate:data` — entity, source, journey and relationship integrity checks
- `npm run typecheck` — strict TypeScript check
- `npm run lint` — React and Next.js linting
- `npm run build` — production build
- `npm test` — complete validation and server-rendered route tests

## Product boundaries

- Research is frozen to 5 August 2026; official application and university systems remain authoritative.
- Statuses distinguish open, upcoming, recurring, ongoing, completed, developing and access-unverified records.
- Saved items, ordered journey steps and private notes use browser storage only. There are no accounts, public student profiles or private-student data.
- The official INGENIUM logo files in `public/assets/brand/` are unmodified media-kit assets.

## Evidence

The source ledger is available at `/research`. It combines current official INGENIUM pages with the project evidence library, including D1.3, D3.3, D4.1, D5.1, D5.7, D7.4, D8.2, D8.4, D10.1 and D10.2. Records that could not be confirmed as live are labelled accordingly rather than being promoted as active opportunities.
