# INGENIUM+ — version history

This repository makes the development of **INGENIUM+** browsable from the earliest recovered prototype through the October 2026 Vercel release. Each release is preserved in its own folder so the architecture, interface and evidence model can be compared directly over time.

INGENIUM+ is a student-led discovery prototype/platform for exploring opportunities, learning, projects, events and connections across the INGENIUM European University alliance. It is not an official INGENIUM or university service. Official institutional systems remain authoritative.

## Browse the versions

| Version | What changed | Source |
| --- | --- | --- |
| **v1.0** | Earliest recovered dependency-free graph prototype. | [`versions/v1.0`](versions/v1.0) |
| **v1.1** | Ten partner-university anchors, sample campus records and guided demo journeys. | [`versions/v1.1`](versions/v1.1) |
| **v1.2** | Zoom/pan, graph controls, hover previews, mini profiles and an accessible list fallback. | [`versions/v1.2`](versions/v1.2) |
| **v1.3** | Multi-page static app, separate data file, source ledger and data verifier. | [`versions/v1.3`](versions/v1.3) |
| **v1.4** | React/Vinext rebuild with Geography and Network views over a validated catalogue. | [`versions/v1.4`](versions/v1.4) |
| **v1.5** | Graph workspace, Explore and Learning experiences, richer records, semester planning and explained recommendations. | [`versions/v1.5`](versions/v1.5) |
| **v2.0 Vercel** | Map-first connected campus, guest discovery, real feature demos and the approved visual redesign. | [`versions/v2.0-vercel-2026-10-19`](versions/v2.0-vercel-2026-10-19) |
| **v1.5.1** | Private-platform architecture: Student/Staff modes, permissions, review workflows, versioned content, protected documents, audit evidence and data-health tooling. | [`versions/v1.5.1`](versions/v1.5.1) |

The current public preview is **INGENIUM+ v2.0 on Vercel**, at [ingenium-plus.vercel.app](https://ingenium-plus.vercel.app). Its released interface is preserved in [`versions/v2.0-vercel-2026-10-19`](versions/v2.0-vercel-2026-10-19) from commit `860fdef10faf424e8dc09ade7f5b0f4531e9acd3`. The current development source is on the repository’s [main branch](https://github.com/adamoneill58-pixel/ingenium-plus). Older `chatgpt.site` links inside historical snapshots are retained as provenance.

## Repository layout

```text
versions/          Expanded, browsable source snapshots for v1.0-v2.0
release-metadata/  Release notes, manifests and original archive checksums
docs/              Project history, architecture, provenance and verification notes
```

The expanded folders are intended for comparison and learning. Each version remains a historical snapshot: known limitations and historical inconsistencies are documented rather than silently rewritten.

## Integrity and privacy

The source snapshots were prepared from the verified INGENIUM+ release archive. Dependency folders, build caches, Git internals, credentials, local environment files, private identities, uploaded documents and live database/object-storage exports are excluded. The v1.5.1 snapshot contains only source-controlled schema and sanitised seed/catalogue material.

For release provenance, exact commit identifiers and verification status, see [`release-metadata/RELEASE_INDEX.json`](release-metadata/RELEASE_INDEX.json) and the per-version release notes. The archive and verification process is described in [`docs/TEST_AND_VERIFICATION_REPORT.md`](docs/TEST_AND_VERIFICATION_REPORT.md).

## Running a version locally

- **v1.0-v1.3:** open the version's `index.html` in a browser. Some browser security settings may require serving the folder with a small local web server.
- **v1.4-v1.5.1:** follow the `README.md` inside that version. Use the Node version recorded by the snapshot where present; do not assume dependencies are interchangeable across releases.

## Status note

This repository demonstrates product development and technical progress. It does not claim institutional adoption, production approval, completed student validation or authority over admissions, applications, enrolment, recognition, academic records or published calls.
