# INGENIUM+ v1.4

**Your European campus, made visible.**

Version 1.4 expands INGENIUM+ into a full-featured, accessible, offline-ready Progressive Web App (PWA) with a dedicated Saved Opportunities Hub, Side-by-Side Comparison tool, Spring-based collision avoidance, interactive hover tooltips, 10-language internationalization, and multi-format export capabilities.

## Run it

The site remains completely dependency-free. Open `index.html` directly, or run a local server from this folder:

```bash
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/index.html`.

## Pages

- `index.html` — interactive network graph, filters, collision relaxation, tooltips, and guided journeys.
- `bips.html` — verified 2026/27 BIP catalogue, comparison selector, and search filters.
- `events.html` — upcoming learning moments, timeline, and 10 Days 2026 archive.
- `projects.html` — funded 2026 Student Partnerships plus supported initiatives.
- `saved.html` — dedicated Saved Opportunities Hub with calendar (.ics) and Markdown export.
- `compare.html` — side-by-side comparison view for up to 3 programmes and mobility routes.
- `communities.html` — verified, privacy-conscious community directory.
- `universities.html` — ten university hubs and country profiles.
- `opportunities.html` — mobility, study, and digital-service routes.
- `research.html` — methodology, data schema, limitations, and source registry.
- `about.html` — project story and v1.4 architecture.

## Key Features in v1.4

- **Saved Items Hub & Exporter**: Bookmark opportunities across the site; export as a bundled `.ics` calendar, formatted Markdown summary, or print-ready application sheet.
- **Side-by-Side Comparison Tool**: Compare 2–3 BIPs or projects across host university, ECTS, delivery format, funding, and application prerequisites.
- **Graph Collision Relaxation & Hover Tooltips**: 25-iteration spring relaxation prevents label overlaps; hovering over nodes shows rich preview cards.
- **Alliance-wide Multi-Language (i18n)**: Instant client-side localization across 10 partner languages: English (EN), Spanish (ES), French (FR), German (DE), Italian (IT), Finnish (FI), Romanian (RO), Greek (EL), Swedish (SV), Bulgarian (BG).
- **PWA & Offline Capability**: Installable web app powered by `manifest.json` and `sw.js` service worker for zero-network offline discovery.
- **Custom Journey Sharing**: Encode and share custom discovery pathways via URL (`?custom_journey=...`).
- **Focus Trapping & Accessibility**: Full keyboard modal focus traps and ARIA live announcements.
- **Data Validation & Decoupling**: Dataset decoupled into `data.json` with an automated validation script `scripts/verify_data.py`.

## Technology

- Semantic HTML5 & CSS3 (INGENIUM design tokens & Montserrat typography).
- Vanilla ES6 JavaScript (Zero bundlers, zero npm dependencies, zero backend).
- Inline SVG network rendering with dynamic physics relaxation.
- Service Worker & Cache API for offline resilience.

## Status

Student Partnership prototype. INGENIUM+ routes users to official sources and is not itself an official application portal, registry, or live messaging service.
