# Testing

Validation date: **5 August 2026**

## Automated checks

Run the complete suite with:

```bash
npm test
npm run lint
```

The release checks:

- 85 entity records, 343 relationships, 29 sources and 6 journeys.
- Unique entity IDs, slugs, source IDs, relationship IDs and journey IDs.
- Exactly ten canonical universities and thirteen frozen BIP records.
- Valid entity types/statuses, titles, sources, verification dates and university references.
- Complete materialisation of every declared non-university ↔ university association.
- Valid relationship endpoints and journey references.
- HTTP(S) URL syntax and cautious calls to action for planned/developing records.
- Strict TypeScript compilation.
- ESLint with no errors or warnings.
- Production vinext build across all 11 routes, including the homepage.
- Server-rendered smoke tests for the homepage and all 10 principal subpages.

## Manual functional checklist

- Search returns title, theme, university and alias matches.
- Graph mode changes alter the visible research layer.
- Type, university, theme and status filters can be combined and cleared.
- Graph zoom, pan, fit and reset controls work.
- Selecting a node or edge opens an evidence-backed detail panel.
- Direct card links select a node in a compatible graph mode.
- Graph/list view, filters, mode, query, selected node and journey persist in the shareable URL.
- Accessible list includes both nodes and visible relationship explanations.
- Guided journeys show a concise first set and allow every remaining route to be revealed.
- Save, add-step, compare, calendar export and link-copy actions are implemented.
- My Journey supports ordering, status, private notes, removal and local JSON export.
- Desktop and mobile layouts have explicit breakpoints at 1180, 860 and 620 pixels.
- Reduced-motion preferences are respected.

## Environment note

The in-app browser’s security policy refused the local `localhost` preview during this build, so a screenshot-driven browser pass could not be completed through that surface. This restriction was not bypassed. The production renderer, route smoke tests, strict type/lint checks and direct asset inspection were completed instead. A final human visual pass in Safari/Chrome is recommended after deployment, especially for Cytoscape label density at 320–390 px widths.

## Link checks

`npm run check:links` validates URL syntax without network access. `npm run check:links:live` performs a time-sensitive first-party network check and should be run during each research refresh; a failed live request should be reviewed rather than automatically deleting the source.
