# INGENIUM+ v2.0 source census

Reviewed 15 October 2026.

## What is in the release

The v2 catalogue contains **222 public records**, **985 explicit relationships**, **163 evidence-source entries** and **4 calendar events**. The records cover ten partner universities and the alliance across courses, BIPs, programmes, pathways, projects, events, communities, platforms, opportunities, initiatives, learning resources, microcredentials and frameworks.

These are research and discovery records. Counts describe what this release can display; they do not describe usage, adoption, enrolments, participation or impact.

## Governed source registry

`data/sources/registry.json` is the machine-readable source registry. It records, for the alliance and all ten partners:

- official base URL;
- known languages;
- expected content categories;
- access and verification method;
- intended check cadence;
- reuse limitations and image policy;
- last registry review date; and
- source-specific cautions.

The registry is intentionally conservative. Where a site does not publish an explicit reusable-content licence, INGENIUM+ stores facts, short attributed summaries and the official next-step URL. It does not copy images. A primary-source page remains authoritative for eligibility, application, enrolment, assessment and credit.

## Coverage by partner

| Source | Main coverage | Known limitation |
| --- | --- | --- |
| INGENIUM alliance | Alliance news, events, calls, education, communities and services | Partner-specific eligibility can still live on a local university page |
| University of Oviedo | Courses, mobility, research and events | Spanish pages can contain fuller detail |
| Medical University Sofia | Health education, mobility, research and events | Specialist eligibility and academic level need manual review |
| University of Crete | Courses, mobility, research and events | Heraklion and Rethymno must not be conflated |
| Karlsruhe UAS | Applied courses, mobility and research | German programme pages may be authoritative |
| Xamk | Courses, open learning, RDI projects and mobility | Host university does not imply one physical campus |
| Ud’A Chieti–Pescara | Courses, mobility, research and events | Chieti or Pescara venue cannot be inferred |
| University of Skövde | Courses, mobility, research and events | HS is the display abbreviation; HIS is retained as an alias |
| MTU | Courses, mobility, research, innovation and events | Cork or Kerry campus cannot be inferred |
| University of Rouen Normandy | Courses, mobility, research and events | French pages may be the only detailed source |
| TUIASI | Engineering courses, mobility, research and events | Romanian calls may have fuller application detail |

## Import and review workflow

1. Discover candidate URLs only inside the registered official domains.
2. Capture title, source URL, source publisher, access date and a bounded factual summary.
3. Keep unconfirmed date, credit, eligibility, language, capacity, funding and location fields empty.
4. Compare an alliance page with the responsible partner page when both exist. Record conflicts instead of choosing silently.
5. Store the draft as unpublished, with confidence and classification.
6. Review the source and the proposed official next step.
7. Publish only the reviewed public projection.
8. Refresh active calls daily where infrastructure permits; check the general catalogue weekly; route parsing failures and changed evidence to the review queue.

The existing D1 import, publication projection, status-refresh and review interfaces remain the technical path for this workflow. The source registry validator runs as part of `npm run validate:data`.

## Map provenance

The ten green campus pins use the universities’ known city-level locations. Opportunity points use deterministic visual offsets around each associated campus so that clusters can separate as the user zooms in. Multi-campus records appear at every associated university, and counts use the same associations. Those points represent a **campus relationship**, not a claimed venue. Online and alliance-wide records must never be interpreted as physical locations.

The base tiles are loaded from OpenStreetMap with visible attribution. A production deployment with material traffic should use a suitable hosted tile service or a self-hosted tile policy rather than relying on the community tile endpoint at scale.

## External content

The embed component accepts provider-specific identifiers for:

- individual eligible LinkedIn public posts;
- YouTube videos or playlists; and
- public Google Calendars.

It constructs the provider URL itself, rejects arbitrary iframe URLs, never accepts copied HTML, uses a sandboxed iframe, and waits for the visitor to choose to load the provider. The current release embeds the official INGENIUM YouTube channel’s upload playlist because the official INGENIUM site links that channel.

LinkedIn profiles, company-page feeds and arbitrary posts are linked out. LinkedIn only offers a dependable embed for eligible individual public posts, and API access requires a separate approved integration. Canvas data is not fetched: a real connection requires institutional OAuth/LTI approval, data-processing decisions and scoped access. The learning spaces in this release are therefore clearly marked prototypes.

## Synthetic content boundary

Synthetic people, groups, posts, messages, discussions and course activity exist only to demonstrate the future community and learning experience. Every synthetic surface carries a persistent demo label. Synthetic content contains no real email address or claim of participation, and it is never mixed into the evidence catalogue.
