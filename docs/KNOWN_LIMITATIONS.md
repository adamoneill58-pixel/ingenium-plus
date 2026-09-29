# Known limitations

## External services

- No approved malware scanner is connected.
- No OCR or document-extraction provider is connected.
- Uploaded files remain private and quarantined until scanning and independent review; the platform must not label them clean or extracted without provider evidence.
- Refresh schedules exist in D1, but no automatic cloud schedule is attached. Manual refresh is available.

## Access and governance

- The private deployment is owner-only. This is not a multi-institution production pilot.
- Institutional ownership, data-controller/processor roles, privacy impact assessment, retention, incident response, accessibility ownership, moderation, maintenance and support require formal agreement.
- Official university systems remain authoritative for applications, enrolment, recognition and academic records.
- The software and archive do not establish institutional adoption, programme approval or student impact.

## Data and recommendations

- Source facts are snapshots and require continued verification. A successful link check is not a content re-verification.
- The recommendation evaluation uses a small synthetic fixture set; its metrics are engineering evidence, not real-world fairness or effectiveness evidence.
- Staff discovery is opt-in, but any future real-user rollout still needs policy, consent, deletion, portability and oversight processes.
- Calculated and sample records must remain labelled and cannot be presented as official facts.

## Historical releases

- The recovered v1.3 folder is labelled v1.3 externally but calls itself v1.4 internally. Several recovered PWA/comparison placeholder files are empty. Both facts are preserved in the archive.
- v1.5 passes functional/build tests but has one reproducible React Compiler lint acceptance gap. The historical release was not rewritten during archiving.
- v1.0–v1.2 have no verified Git commit or deployment provenance.
