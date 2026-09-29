# INGENIUM+ v1.5.1 — archive notes

v1.5.1 turns the graph-first prototype into an owner-private, migration-driven platform. It adds persistent Student and Staff modes, memberships and permissions, private recommendation profiles, collaboration calls, module proposals, independent review, content versioning, R2 document quarantine, upload/signature/SHA-256 validation, protected downloads, audit evidence, refresh schedules, manual refresh, data health and explainable eligibility-first recommendations.

The archive comes from commit `74ebdee75bcc153dfe71de2f328acc38c5a1c266`, verified as the source for private Sites version 3. The deployment seed contains 104 records, 404 relationships, 34 evidence sources, ten organisations, 104 semantic feature vectors and 25 refresh schedules. The complete test/lint/build suite passes. No live database, identity, private email, uploaded document, R2 object, audit history or credential is included.

An approved malware scanner, OCR/extractor and automatic cloud scheduler are still external requirements. Files remain quarantined pending scanning and review; official university systems remain authoritative.
