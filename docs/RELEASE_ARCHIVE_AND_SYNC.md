# Release archive and Drive reconciliation

Reconciled on 20 September 2026.

## Authoritative archive locations

- Local archive: `/Users/adamoneill/Desktop/INGENIUM+/INGENIUM+_RELEASES`
- Drive archive: [13 — Release Archive & Reconciliation](https://drive.google.com/drive/folders/14YBZll4XqPEDNjCKKzRTgFEpfX9IjOVd)
- Canonical Drive project root: [INGENIUM+](https://drive.google.com/drive/folders/1tCxHtsM4AiU15QE-0O2RtDAEk2TyPprG)

The new Drive folder is append-only. Existing `01 — Current Build`, `11 — Previous Versions — OUTDATED`, source folders and historical archives were not moved, overwritten or deleted.

## What is archived

Recoverable v1.0–v1.5.1 source packages, per-release notes/manifests/checksums, full history/architecture/data/deployment/testing/limitations/recovery documentation, and the sanitised v1.5.1 schema and seed. Git-backed packages were produced with `git archive` from their exact release commits. The unchanged original v1.3 ZIP is retained beside a clean archival package.

The archive excludes Git internals, dependencies, caches, builds, environment files, credentials, signed URLs, private identities, live D1 exports, uploaded documents, R2 objects and live audit data.

## Integrity

The local archive has 46 files. `manifests/CHECKSUMS.sha256` covers all other archive files. Every source ZIP was structurally tested. All 46 Drive files were re-downloaded after upload and matched the local SHA-256 byte-for-byte.

The machine-readable `manifests/SYNC_MANIFEST.json` records the Drive ID, upload time, byte size and local SHA-256 for the 44 payload files. It deliberately excludes itself and the root checksum file from its payload list to avoid self-referential hashes; those two files were uploaded and independently re-downloaded/verified.

## Deployment boundary

The deployed private Sites version remains version 3 from commit `74ebdee75bcc153dfe71de2f328acc38c5a1c266`. This documentation-only Git commit is not deployed. The public v1.5 Sites version 4 and its source commit `211482eac37136a627f94643d3d1947c2c121068` are unchanged.

Use `docs/RELEASE_INDEX.json` for release provenance. The complete sync manifest stays in the local/Drive archive because it contains local filesystem provenance and Drive object IDs that are unnecessary in application source.
