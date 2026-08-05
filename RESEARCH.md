# Research record

Research freeze: **5 August 2026**

## Editorial method

1. Inventory the v1.3 data and the supplied deliverables.
2. Resolve institution names into ten canonical university anchors.
3. Separate historical facts, current services, open calls, recurring routes, targets and programme-development plans.
4. Re-check time-sensitive claims against first-party public pages.
5. Store a source, verification date, confidence level and explicit status on every entity.
6. Keep unverified information visible only where it helps explain the ecosystem; never give it an Apply or Register call to action.

The result contains 85 entities and 343 typed relationships. Complete university associations are retained in the data; graph density is controlled visually, not by silently deleting edges.

## Current findings that materially changed v1.4

- The CBPT Joint Master’s is a live 2026/27 opportunity: EU applications close 6 September 2026 and the first cohort is scheduled to begin 1 October 2026.
- The Human-Centred AI joint doctoral call closes 21 August 2026.
- PhD Mobility and Co-Supervision Scholarship applications close 11 September 2026 at 12:00 CEST, with support of up to €1,000 per month for a maximum of four months.
- Xamk’s Advanced Practice Nursing degree had a supplementary application from 3–6 August 2026. It is a Xamk national degree developed through INGENIUM cooperation, not yet a fully joint alliance award.
- The Business Model Canvas course is live and evergreen: approximately one hour, self-directed and accompanied by a digital badge. A badge is not represented as ECTS or proof of microcredential accreditation.
- The Student Sustainability Hub is live and provides official proposal/contact routes.
- Current official reporting says 12 Pathways will welcome students in 2026/27. D4.1 contains 13 pilots, but the current report does not identify which pilot is delayed. Only Xamk Social Services is given a confirmed start label in the dataset; the others remain verification-required.
- All four 2026 10 Days schools are completed. Stale application language on an event page is not carried into v1.4.
- Six 2026 Student Partnership projects received direct funding. INGENIUM+ and ResQDrone received support to seek alternative funding and are kept distinct.

## Source conflicts and cautious resolutions

| Conflict | v1.4 resolution |
|---|---|
| The BIP catalogue cards, main list, framework PDF and some event details differ. | Preserve a 13-record catalogue, use detail pages where verified, and route applications through the home university. No local deadline is invented. |
| CLARITY-AI summary timing conflicts with its event detail. | Treat the detail page as canonical where surfaced; do not add an unsupported local deadline. |
| “Engage & Enjoy”, “Study Skills” and “INGENIUM Inclusion BIP” conflict across catalogue surfaces. | Do not inflate the catalogue beyond the frozen 13 records; expose the official catalogue for final confirmation. |
| D4.1 has 13 Pathway pilots; current news says 12 will welcome students. | Keep 13 research records, but label unconfirmed pilots “Verification required”. |
| The Entrepreneurship and Innovation bachelor had earlier 2026 planning language; D4.1 says it was not ready for 2026/27. | Use the later, more cautious “Under development; 2027/28 or later” label. |
| Legal Sciences material conflicts between 2025/26 and 2026/27 intake language. | Label “Verification required”; do not expose an application CTA. |
| Rehabilitation/Balneology material conflicts on accreditation, agreement and launch timing. | Label “Under development”. |
| SMaCC material includes wording apparently copied from another programme. | Keep the programme as development evidence and require live verification. |
| “Chemical and Biochemical Process Technology” and “Technologies” both appear. | Store the official current singular name and retain the plural form as an alias. |
| D7.4 gives a December 2024 call date for an April 2024 Hackathon. | Omit the impossible call date. |
| D5.7 contains inconsistent recommended OER licences. | Do not publish a single alliance-wide licence rule. |
| HS/HIS, Xamk/XAMK and Ud’A/UdA vary. | Store one canonical institution with supported aliases. |
| Historical platform authentication may have changed. | Use the current Digital INGENIUM guidance at the research date and tell users to re-check access. |

## Deliberately omitted or de-emphasised

- Hypothetical microcredentials in D5.7, including “Student Leadership” and language-inclusion examples.
- The unnamed credential reported as developed/tested in D10.1.
- Early programme concepts not present in the latest endorsed portfolio.
- Individual names for the 20 funded 2024 research projects, because the reviewed evidence gives only aggregate counts.
- A current 2026 SDG Hackathon, Student Innovation Challenge intake or completed Accelerator pilot, because no live first-party call/result was found.
- Achievement claims based only on targets, including 500 BMC learners, 30 challenge students and 12 Accelerator participants.
- A public group-chat feature, personal profiles or member lists. Intra-Alliance is an authenticated internal service, not evidence of a public student chat product.
- Official-event photography. The supplied repository path was useful as context, but v1.4 does not bundle photographs whose individual usage rights and credit line were not confirmed. The interface uses the supplied official logo kit and a clearly abstract generated social card only.

## Maintenance recommendation

Run `npm run validate:data` for structural integrity, `npm run check:links` for URL syntax and `npm run check:links:live` during a research refresh. Re-check every Open or Upcoming record first, then Pathways, platform access and community joining routes. Update `RESEARCH_DATE` only after that review is complete.
