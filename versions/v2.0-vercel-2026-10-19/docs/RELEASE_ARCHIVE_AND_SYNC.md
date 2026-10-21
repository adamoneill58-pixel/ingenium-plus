# Release archive and reconciliation

Reconciled on 20 September 2026.

## Authoritative locations

- Canonical public source: the `main` branch of this repository.
- Canonical public deployment: the Site configured in `.openai/hosting.json`.
- Historical release archives remain in private storage. Local filesystem paths, cloud-object IDs and private archive links are intentionally not published here.

## What is archived

Recoverable v1.0–v1.5.1 source packages, per-release notes/manifests/checksums, full history/architecture/data/deployment/testing/limitations/recovery documentation, and the sanitised v1.5.1 schema and seed. Git-backed packages were produced with `git archive` from their exact release commits. The unchanged original v1.3 ZIP is retained beside a clean archival package.

The archive excludes Git internals, dependencies, caches, builds, environment files, credentials, signed URLs, private identities, live D1 exports, uploaded documents, R2 objects and live audit data.

## Integrity

The local archive has 46 files. `manifests/CHECKSUMS.sha256` covers all other archive files. Every source ZIP was structurally tested. All 46 Drive files were re-downloaded after upload and matched the local SHA-256 byte-for-byte.

The machine-readable `manifests/SYNC_MANIFEST.json` records the Drive ID, upload time, byte size and local SHA-256 for the 44 payload files. It deliberately excludes itself and the root checksum file from its payload list to avoid self-referential hashes; those two files were uploaded and independently re-downloaded/verified.

## Deployment boundary

The former public-only and owner-only deployments are historical. The repository now maintains one canonical public build on `main`, deployed through the Site configured in `.openai/hosting.json`. Old deployments and archives are not authoritative and must not be treated as current product versions.

Use `docs/RELEASE_INDEX.json` for historical release provenance. The complete private sync manifest is intentionally excluded because it contains local filesystem provenance and cloud object IDs that are unnecessary in public application source.
