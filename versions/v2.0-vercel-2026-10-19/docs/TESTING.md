# Testing INGENIUM+ v1.5

## Automated release gate

Use Node 22 LTS, then run:

```bash
npm test
npm run lint
```

`npm test` validates the preserved v1.4 archive, v1.5 aggregate integrity, date-driven statuses, sample degree logic, recommendations, semester operations, strict TypeScript, the production Worker build and server rendering for all key routes.

### v1.5.1 release-candidate result — 20 September 2026

- `npm test`: passed: data validation, five v1.5 logic tests, ten v1.5.1 tests, clean migration/seed, backup/restore, strict TypeScript, production Worker build and 19 rendered routes.
- `npm run recommendations:evaluate`: passed with zero synthetic eligibility violations; see `RECOMMENDATION_EVALUATION.md` for the non-production metrics.
- Portable production server: home, Student and Staff routes returned HTTP 200.
- `npm run lint`: environment-blocked. The inherited Next.js ESLint preset stalls before source analysis or diagnostics, even for one file. Re-run after the framework dependency is repaired; the compiler, build and route checks pass.
- Automated localhost visual inspection: blocked by an unavailable admin-enforced in-app browser security check. No bypass was attempted.

## Manual interaction checklist

1. Homepage: confirm the compact introduction is followed by an approximately 70vh graph workspace and current Actionable now records.
2. Geography: zoom out and pan in every direction; the map must continue covering the canvas with no white void.
3. Network: switch layouts, search a title, press Enter, select nodes and edges, close the detail panel and use the accessible list.
4. Filters: combine type, university, country, status and theme on Explore; switch cards/graph without changing the result count.
5. Records: open a rich learning record and a university; check evidence, calculated status, connections, official link and university subgraph.
6. Learning: filter records, add the same record twice, verify duplicate prevention, reorder, remove and check ECTS total.
7. My Campus: create an optional profile, inspect completion, recommendations and the You network, add a task and connect a sample profile.
8. Chats: open a contextual record with a sample Chat; verify all labels say sample and that no send control exists.
9. Responsive: repeat the core flow at phone, tablet and desktop sizes. The record detail should become a mobile bottom sheet.
10. Accessibility: navigate all controls by keyboard, verify visible focus, form labels, live result announcements and reduced-motion behaviour.

## Live evidence checks

`npm run check:links:live` performs network requests and is intentionally separate from the deterministic release gate. A successful HTTP response does not prove that a date or badge is current; inspect the official content before changing records.
