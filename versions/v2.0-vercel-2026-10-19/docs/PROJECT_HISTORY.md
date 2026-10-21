# INGENIUM+ project history

## Purpose

INGENIUM+ began as a student-led attempt to make the INGENIUM European University visible as a connected campus rather than a set of disconnected webpages. The product concept is graph-first: people, universities, modules, programmes, mobility routes, projects, communities, events and calls are presented through their relationships. It routes users to authoritative sources and does not replace official academic systems.

## Release timeline

### v1.0 — earliest recovered graph prototype

The earliest recovered local version is a dependency-free HTML/CSS/JavaScript graph prototype. It established the central visual discovery concept. The archive contains the three recovered files exactly as source evidence; no deployment or Git commit has been verified for this version.

### v1.1 — documented European Campus graph

v1.1 added a project README and described a stylised Europe graph with ten partner-university anchors, sample students, chats, modules, societies, BIPs, projects, events and opportunities. All records in this generation were explicitly sample/demo data. It remained browser-only, with no accounts, server or database.

### v1.2 — improved graph interaction

v1.2 added zoom, pan, fit/reset controls, hover previews and mini profiles while preserving the static browser-only architecture. The graph and list fallback shared the same in-page sample dataset.

### v1.3 — recovered static multi-page archive

The folder and Drive archive identify this generation as v1.3. Its internal README and release notes call it “v1.4”, an historical labelling inconsistency preserved and documented rather than silently rewritten. It expanded the static application into multiple pages, decoupled `data.json`, a validation script and planned PWA/i18n/saved/comparison features. Several placeholder files in the recovered source are zero-length, so this archive is historical evidence rather than the later verified v1.4 application.

### v1.4 — verified public baseline

v1.4 moved to a Next.js-compatible React/Vinext codebase while preserving the graph-first idea. Commit `3dd95690f187f301d45ce28426b718c26de32041` is the verified release commit associated with Sites version 3. It contains 85 entities, 343 relationships, 29 source records and six guided journeys. Geography and Network views use one data model, and geographic campus placement was added to the Europe map. Data was a frozen verified/sample/calculated snapshot and user actions remained browser-local.

### v1.5 — public graph-first discovery release

v1.5, commit `211482eac37136a627f94643d3d1947c2c121068`, re-centred the product on a large graph workspace and added unified Explore, Learning, rich record pages, a browser-local semester builder, optional My Campus profile, deterministic recommendations, fictional student profiles and read-only sample chats. It centralised date-derived status logic and exposed verified, calculated and sample classifications. Sites version 4 is publicly deployed at the historical `ingenium-plus-v14` URL.

### v1.5.1 — unified public platform

v1.5.1 changes the operating model and consolidates the previously separate discovery and authenticated-workflow builds. The public catalogue remains available to all visitors, while authenticated Student and Staff capabilities use trusted Sites identity and server-enforced roles. The application uses D1 for persistent structured data, private R2 storage for protected documents, governed contribution workflows, refresh schedules and explainable recommendations. The checked-in runtime seed contains 226 content records, 1,007 relationships and 159 sources and is applied in bounded batches by the configured-owner bootstrap.

## Architectural transitions

1. Static browser graph: v1.0–v1.2.
2. Static multi-page/data-file generation: recovered v1.3.
3. React/Vinext, validated catalogue and graph/geography product: v1.4.
4. Rich browser-local planning, profiles and recommendations: v1.5.
5. Unified public discovery plus authenticated server routes, persistent D1 data, protected R2 documents and governed contribution workflows: v1.5.1.

## Deployment history

The canonical public Site first hosted v1.4 and v1.5 and now hosts the unified v1.5.1 build. Its URL retains the historical `v14` slug; source provenance, not the slug, determines the deployed version. The former owner-only staging Site is superseded and is not a current product version. Archive creation and Git commits do not deploy the Site; only a saved and published Sites version does.

## Open governance questions

Institutional ownership, controller/processor roles, privacy impact assessment, retention, accessibility ownership, operational support, source-owner responsibilities, scanner/extraction procurement, automatic scheduler operation and any real-user pilot require formal agreement. No release claims official adoption or measured student impact.
