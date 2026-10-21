import { pilotWindow } from "@/lib/v2/window";
import Link from "next/link";
import { getRuntimeBindings } from "@/lib/v151/bindings";
export const metadata = { title: "About this pilot" };
export default function AboutPilot() {
  const e = getRuntimeBindings();
  const active = pilotWindow(e).enabled;
  return (
    <main id="main-content" className="campus-main inner-campus prose-campus">
      <span className="eyebrow">A STUDENT-LED PROTOTYPE</span>
      <h1>About this pilot.</h1>
      <p>
        INGENIUM+ helps you discover learning, mobility, projects and
        communities across ten universities. Institutional adoption, a supported
        pilot and the official calendar content arrangement remain proposals.
      </p>
      <h2>Browse without an account</h2>
      <p>
        Public discovery needs no sign-in. Personal and staff profile workflows
        are paused. Shortlists and interests stay temporarily in page memory;
        export your plan before closing or refreshing. Older browser-local plans
        are not read or deleted.
      </p>
      <h2>Usage and feedback</h2>
      <p>
        {active
          ? "Pilot collection is enabled in this environment."
          : "Pilot collection is not activated in this environment; the survey is a preview."}{" "}
        When enabled, the application stores daily counts of visits, content
        interactions, result-count buckets, calendar exports and
        useful/not-useful responses. It does not store analytics cookies, IP
        addresses, browser identifiers or search text. Campus entry links count
        their own landing visits only.
      </p>
      <p>
        These counts do not establish unique visitors, returning users or
        completed applications. Hosting providers still process network requests
        according to their own settings and terms.
      </p>
      <h2>Survey handling</h2>
      <p>
        Closed answers are stored as separate weekly totals. University and role
        are never joined. Optional free-text answers are stored separately, with
        no role or campus attached, and remain restricted pending review. Please
        do not enter personal information. Shared reports suppress small counts.
      </p>
      <h2>Before public pilot activation</h2>
      <p>
        The team must confirm ownership, privacy and incident contacts,
        infrastructure logging, retention and approved processor arrangements.
        The proposed free-text retention is pilot end plus 90 days; the proposed
        team audit retention is 12 months. Neither is presented as an approved
        policy here.
      </p>
      <h2>Official information decides</h2>
      <p>
        Always check the official university page before applying. INGENIUM+
        cannot confirm admission, enrolment, funding or credit recognition.
      </p>
      <Link className="button button--primary" href="/explore">
        Explore the campus
      </Link>
    </main>
  );
}
