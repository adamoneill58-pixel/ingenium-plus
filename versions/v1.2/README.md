# INGENIUM+ European Campus Graph

INGENIUM+ is a student-led prototype for a graph-first digital campus experience inside the INGENIUM European University Alliance.

The prototype is built around one idea:

> No endless feed. INGENIUM+ helps students discover people, group chats, modules, societies, BIPs, projects, events and opportunities through a living map of the INGENIUM European Campus.

## How to Run

Open `index.html` in a browser.

If your browser blocks local files, run a small local server from this folder:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/index.html
```

## Files

- `index.html` - page structure, header navigation, controls, graph area, detail panel and footer.
- `styles.css` - INGENIUM-style colourway, responsive layout, map styling, zoom controls and node colours.
- `app.js` - sample dataset, filters, journeys, SVG map rendering, zoom/pan interactions, hover previews and mini profile logic.
- `README.md` - project notes and running instructions.

## Dataset

All data is sample/demo data for prototype use. It includes:

- 10 INGENIUM partner university anchor nodes placed approximately on a stylised Europe map.
- Student nodes, group chats, modules, societies, BIPs, projects, events, opportunities and organization nodes.
- Topic tags such as sustainability, mobility, data visualisation, engineering, belonging, health sciences and AI.

Skills are not graph nodes. They are represented only as topic metadata.

## Interaction

- Use the mouse wheel or trackpad scroll over the map to zoom in and out.
- Click and drag the SVG map to pan around Europe.
- Use the floating controls for Zoom +, Zoom -, Reset map and Fit selected.
- Click a node to select it and show a mini profile in the detail panel.
- Hover a node to see a lightweight preview with its name, type and university/country.
- The list fallback still updates with filters and can be used to select nodes.

## Technology

This prototype uses only:

- Vanilla HTML
- CSS
- JavaScript
- Inline SVG rendering

There are no frameworks, build tools, package managers, external libraries, APIs or backend services.

## Main Demo Journeys

- **My route** - focuses on the sample student profile and nearby community links.
- **BIP finder** - highlights a BIP route, host campuses, related modules, chat and support opportunity.
- **Sustainability network** - filters the map to sustainability-related campuses, BIPs, societies, chats and projects.
- **Group chats near me** - shows how INGENIUM+ acts as a community layer, not just a static database.
- **MTU projects** - shows project and community activity around the MTU campus anchor.

## Prototype Status

Student Partnership Prototype 2026. Built as a student-led pilot for the INGENIUM European University Alliance.
