# Test and verification report

Reproduced on 20 September 2026 unless marked historical. Modern builds used Node.js 22.22.0.

| Release | Check | Result | Evidence/notes |
|---|---|---|---|
| v1.0 | JavaScript syntax | Pass | `node --check app.js` |
| v1.1 | JavaScript syntax | Pass | `node --check app.js` |
| v1.2 | JavaScript syntax | Pass | `node --check app.js` |
| v1.3 | JavaScript syntax | Pass | `node --check app.js` |
| v1.3 | Data verifier | Pass | Recovered `scripts/verify_data.py` completed successfully |
| v1.3 | Original ZIP integrity | Pass | No compressed-data errors; local SHA/size matches the existing Drive ZIP |
| v1.4 | Data validation | Pass | 85 entities, 343 relationships, 29 sources, six journeys |
| v1.4 | TypeScript/build | Pass | Clean install, production build completed |
| v1.4 | Rendered routes | Pass | 11/11 routes |
| v1.4 | Lint | Pass | No lint errors |
| v1.4 | Link syntax | Pass | 35 unique public URLs |
| v1.5 | Logic | Pass | 5/5 tests |
| v1.5 | Data/TypeScript/build | Pass | Data counts above; production build completed |
| v1.5 | Rendered routes | Pass | 15/15 routes |
| v1.5 | Lint | **Historical acceptance gap** | One `react-hooks/preserve-manual-memoization` error in `LearningWorkspace.tsx`; archived source left unchanged |
| v1.5.1 | v1.5 logic | Pass | 5/5 tests |
| v1.5.1 | Database/security/workflow/recommendation suite | Pass | 15/15 tests, including clean migration, idempotent seed, constraints, permissions, signatures and versioned review |
| v1.5.1 | Backup/restore | Pass | Non-production restore reconciled 104 content records |
| v1.5.1 | TypeScript/build | Pass | Production build completed |
| v1.5.1 | Rendered routes | Pass | 19/19 routes |
| v1.5.1 | Lint | Pass | No lint errors |
| v1.5.1 | Recommendation evaluation | Pass | recall@3 1.0; NDCG@3 0.9598603945740938; eligibility violations 0; coverage 1.0 |
| v1.5.1 | Link syntax/live availability | Pass | All 35 URLs responded; one partner site returned 403 but was treated as reachable by the checker |
| v1.5.1 | Production dependency audit | Pass | 0 known vulnerabilities |
| v1.5.1 | Production-style upload/download | Pass, same-day historical evidence | Isolated D1/R2-style test: authenticated staff session, PDF upload 201, protected download 200, SHA-256 match; not repeated against live production |
| All | Archive integrity | Pass | Every final ZIP opened and extracted without compressed-data errors; final SHA-256 recorded after packaging |

## Environment notes

The old v1.5 working folder contained a damaged `node_modules` tree and initially failed module resolution. That directory was not used as test evidence. v1.4 and v1.5 were exported from their exact commits and installed into clean temporary directories before testing.

v1.4 and v1.5 commits did not contain a lockfile, so a clean temporary `npm install` was used and its generated lockfile was not added to the historical archive. v1.5.1 has a committed lockfile and was verified from its clean staging repository.
