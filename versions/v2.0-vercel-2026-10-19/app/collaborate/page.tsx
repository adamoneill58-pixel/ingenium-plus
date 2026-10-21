import { CollaborationDemo } from "@/components/v2/CollaborationDemo";
import { StaffCollaboration } from "@/components/v2/StaffCollaboration";
export const metadata = { title: "Collaborate" };
export default function CollaboratePage() {
  return (
    <main id="main-content" className="campus-main inner-campus">
      <header className="inner-hero">
        <span className="eyebrow">IDEAS TRAVEL FURTHER TOGETHER</span>
        <h1>
          Find the expertise
          <br />
          that completes yours.
        </h1>
        <p>
          Explore how a course contribution could begin a new academic
          collaboration across universities.
        </p>
      </header>
      <StaffCollaboration />
      <details className="legacy-demo-section"><summary>Course-to-colleague matching demo</summary><CollaborationDemo /></details>
    </main>
  );
}
