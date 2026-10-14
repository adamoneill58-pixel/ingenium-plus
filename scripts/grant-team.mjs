import { writeFile, mkdir } from "node:fs/promises";
// Explicit operator preparation. Output contains identity data; it stays ignored.
const [subject, role] = process.argv.slice(2);
if (!subject || !["administrator", "pilot_team"].includes(role))
  throw new Error(
    "Usage: node scripts/grant-team.mjs <verified-access-subject> <administrator|pilot_team>",
  );
const q = (v) => `'${v.replace(/'/g, "''")}'`;
await mkdir("work", { recursive: true });
await writeFile(
  "work/grant-team.sql",
  `BEGIN TRANSACTION;\nINSERT INTO pilot_team_memberships(subject,role) SELECT ${q(subject)},${q(role)} WHERE ${role === "administrator" ? "NOT EXISTS(SELECT 1 FROM pilot_team_memberships WHERE role='administrator')" : "EXISTS(SELECT 1 FROM pilot_team_memberships WHERE role='administrator')"};\nINSERT INTO pilot_audit(id,actor_subject,action,target) SELECT lower(hex(randomblob(16))),${q(subject)},'operator.grant',${q(role)} WHERE changes()>0;\nCOMMIT;\n`,
);
console.log(
  "Prepared ignored work/grant-team.sql for operator review. No role was granted. First administrator bootstrap refuses a second administrator; subsequent grants require an existing administrator.",
);
