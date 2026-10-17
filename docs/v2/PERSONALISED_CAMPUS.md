# Personalised connected campus — 17 October 2026

This extension implements Adam's request for fuller student and staff demonstrations while preserving the existing catalogue, map, calendar, learning and community tools. It demonstrates synthetic journeys, not real accounts, memberships, correspondence or institutional appointments.

## Two journeys

Student mode opens Adam O’Neill, a Software Development demo persona at MTU. His three joined spaces are the CLARITY-AI BIP studio, upcoming Oviedo Student Conference and online chess club. Each has a populated group conversation, participants, tasks and usable synthetic resources. BIP resources include a handbook, bias workbook, concept template and peer-review checklist. The conference workshop sheet supports booking, cancellation, capacity checks and time-clash protection.

Staff mode opens Paul O’Neill in an explicitly simulated MTU collaboration role. His spaces are a WP5 teaching-innovation working group, a shared responsible-AI module and proposed cross-alliance responsible-AI research project. These include group discussions, an actionable delivery board, editable/downloadable working documents, module outline and rubric, and proposal stage selector. Stages stop at discussion; no proposal is submitted.

Both personas have direct messages, small working-team conversations, fictional connections, an activity feed and personal tasks. Sending, connecting, joining, reacting, posting, completing tasks, editing resources and workshop choices affect only the selected demo persona.

## Map and graph priorities

Map/List/Network retains its existing filters and adds connection degree and an option to include demo people. Results are stably ranked:

1. Joined activities, direct connections and the persona's own profile.
2. Activities matching the student's course topics or staff teaching/research interests.
3. Activities or people reached through a demo connection.
4. Wider-alliance discovery.

Topic matching explains relevance, never eligibility. People are synthetic; map locations remain university associations rather than personal positions or exact venues. Synthetic person-to-person and person-to-space graph edges exist only in the presentation layer. Real catalogue items preserve their evidence page and offer a related demo workspace where one exists.

## Official-site computer-use review

The official [INGENIUM homepage](https://ingenium-university.eu/) and student/staff menus were inspected in Safari using computer use on 17 October 2026. Student pathways include BIPs, joint study, mobility and student partnerships. Staff pathways include teaching innovation, Staff Academy, Education Lab, joint programmes and research opportunities. The [research page](https://ingenium-university.eu/research/) describes research training and international research cooperation. These distinct pathways informed the two journeys. No person's involvement, module approval or work-package appointment was inferred.

## Storage and source boundaries

The synthetic layer uses the dedicated sessionStorage key `ingenium-synthetic-campus-v1` so interactions survive navigation and reload in the same browser tab. This is an explicit exception for this user-requested simulation to the earlier page-memory-only demonstration requirement. It contains demo content and local changes, has no account identifier or telemetry purpose, and never reads or migrates legacy personal plans. Reset affects the current persona independently.

The real catalogue, planner, protected APIs and anonymous pilot remain separate. Student/Staff demo mode grants no authentication or staff permission. The source-backed snapshot still contains 222 records, 985 relationships, 163 source entries and four explicit calendar entries. Fictional people and their edges are excluded. Pilot analytics remain disabled. There are no delivered messages, real registrations, shared edits or live presence claims.

## Verification and deferred work

Tests cover ranking, connection changes, persona isolation, chat membership, workshop capacity/overlaps, staff drafts/proposal stages, serialization/reset, catalogue separation, six workspace routes, profiles and unknown routes. Browser checks cover mode switching, booking and clash rejection, and saving a staff module review. Full tests, lint, typecheck and production route checks are required before publication.

The user explicitly deferred compact layouts and performance optimisation. The former 330 KB aggregate-client budget is diagnostic rather than blocking this expansion. Catalogue payload exclusion and lazy network rendering remain checked. Gemini's new evidence pack is pending; see GEMINI_REFRESH_HANDOFF.md.
