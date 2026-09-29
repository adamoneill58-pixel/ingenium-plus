# Testing INGENIUM+ v1.5

## Automated release gate

Use Node 22 LTS, then run:

```bash
npm test
npm run lint
```

`npm test` validates the preserved v1.4 archive, v1.5 aggregate integrity, date-driven statuses, sample degree logic, recommendations, semester operations, strict TypeScript, the production Worker build and server rendering for all key routes.

### Release-candidate result — 13 September 2026

- `npm test`: passed (five v1.5 logic tests and 15 rendered routes).
- Safari smoke test: passed for the graph layouts, Explore search/view switch, Learning planner add/remove and ECTS total, rich record evidence/sample Chat, and the optional My Campus form.
- `npm run lint`: environment-blocked. `eslint-config-next@16.2.6` stalls while importing `eslint-plugin-react-hooks@7.1.1` under both Node 22.22.0 and Node 26.0.0, before source linting starts or emits diagnostics. Re-run after the framework dependency is updated or repaired; this is the only unchecked release gate.

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
