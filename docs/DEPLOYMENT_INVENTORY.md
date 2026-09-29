# Deployment inventory

Verified on 20 September 2026.

| Layer | v1.4 | v1.5 | v1.5.1 private |
|---|---|---|---|
| Archival source | Git commit | Git commit | Git commit |
| Commit | `3dd95690f187f301d45ce28426b718c26de32041` | `211482eac37136a627f94643d3d1947c2c121068` | `74ebdee75bcc153dfe71de2f328acc38c5a1c266` |
| Archive | `releases/v1.4/INGENIUM+_v1.4_SOURCE.zip` | `releases/v1.5/INGENIUM+_v1.5_SOURCE.zip` | `releases/v1.5.1/INGENIUM+_v1.5.1_SOURCE.zip` |
| Sites project | Public project | Same public project | Separate private project |
| Saved/deployed version | Historical version 3 | Current version 4 | Current version 3 |
| URL | Same historical public URL | `https://ingenium-plus-v14.a0n720x.chatgpt.site` | `https://ingenium-plus-v151-private.a0n720x.chatgpt.site` |
| Access | Public | Public | Custom, owner-only |
| D1 | None | None | `DB` binding |
| R2 | None | None | `DOCUMENTS` binding |
| Deployment status | Superseded by v1.5 | Succeeded | Succeeded |

## Local sources

- v1.0–v1.2 were recovered from `/Users/adamoneill/Desktop/INGENIUM+/` and are not Git-backed.
- v1.3 was recovered from `/Users/adamoneill/Downloads/INGENIUM+_1.3` and the matching Drive archive.
- v1.4 and v1.5 were exported from the Git history in `/Users/adamoneill/Desktop/INGENIUM+/Actual_build/INGENIUM+_1.5`.
- v1.5.1 was exported from the private staging repository in this Codex project workspace.

Local paths are provenance notes, not portable restore locations. Use the archive-relative paths for recovery.

## What is not deployed or archived

The archive does not contain the live D1 database, runtime profiles, the owner’s identity, private email, auth subject, uploaded files, R2 objects, live audit records, credentials, access tokens or signed links. Git and Drive documentation updates do not publish a new Sites version. No deployment was performed during reconciliation.
