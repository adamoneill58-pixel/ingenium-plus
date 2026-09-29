# Release notes — v1.4

## Major additions in v1.4

1. **Dedicated Saved Opportunities Hub (`saved.html`)**:
   - Centralized dashboard for managing all bookmarked BIPs, projects, and events.
   - Dynamic counter badge in the main navigation.
   - Multi-format exporter: Bundled `.ics` calendar download, formatted Markdown summary copying, and print/PDF application summary sheet.
   - Shareable custom journey generator from saved items.

2. **Side-by-Side Comparison Tool (`compare.html`)**:
   - Multi-selection comparison bar floating at the bottom of the screen.
   - Compare up to 3 BIPs or mobility opportunities across 7 key academic and logistical dimensions.
   - Shareable comparison URLs via `?items=id1,id2,id3`.

3. **Graph Collision Relaxation & Hover Tooltips**:
   - Implemented a 25-iteration spring relaxation algorithm in SVG layout that prevents node labels from overlapping around dense university clusters.
   - Floating interactive preview tooltips on node hover displaying type, credits, location, and description.
   - Direct support for loading custom paths via `?custom_journey=...`.

4. **Multi-Language (i18n) Engine**:
   - Integrated client-side translation engine supporting 10 alliance languages: English (EN), Spanish (ES), French (FR), German (DE), Italian (IT), Finnish (FI), Romanian (RO), Greek (EL), Swedish (SV), and Bulgarian (BG).
   - Seamless language switcher in header and footer with persistent choice storage.

5. **PWA & Offline Capability**:
   - Added Web App Manifest (`manifest.json`) and Service Worker (`sw.js`).
   - Enables full offline exploration and homescreen installation.

6. **Accessibility & Usability Refinements**:
   - Focus trapping inside all slide-out drawers and dialogs.
   - ARIA live announcements on search and filter changes.

7. **Data Decoupling & Automated Validation**:
   - Created `data.json` decoupled data model.
   - Added automated Python validation test suite (`scripts/verify_data.py`).
