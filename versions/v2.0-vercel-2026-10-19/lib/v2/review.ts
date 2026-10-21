import { validDay } from "./domain";
export async function reviewAvailability(
  database: D1Database,
  subject: string,
  value: unknown,
) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Object.assign(new Error("Invalid review"), { status: 400 });
  const input = value as Record<string, unknown>;
  if (
    Object.keys(input).some((k) => !["id", "decision", "reason"].includes(k)) ||
    typeof input.id !== "string" ||
    !["approved", "rejected"].includes(String(input.decision)) ||
    typeof input.reason !== "string" ||
    input.reason.trim().length < 5 ||
    input.reason.length > 500
  )
    throw Object.assign(
      new Error("A decision and review reason (5–500 characters) are required"),
      { status: 400 },
    );
  const proposal = await database
    .prepare(
      "SELECT target_id AS targetId,payload_json AS payload,proposed_by AS author FROM proposed_changes WHERE id=? AND target_type='availability' AND status='pending'",
    )
    .bind(input.id)
    .first<{ targetId: string; payload: string; author: string | null }>();
  if (!proposal)
    throw Object.assign(new Error("Pending proposal not found"), {
      status: 409,
    });
  if (proposal.author === subject)
    throw Object.assign(new Error("Self-review is not allowed"), {
      status: 403,
    });
  const update = JSON.parse(proposal.payload);
  if (
    !["open", "closed"].includes(update.availability) ||
    !validDay(update.deadline)
  )
    throw Object.assign(new Error("Invalid source observation"), {
      status: 400,
    });
  const claim = crypto.randomUUID();
  const statements = [
    database
      .prepare(
        "INSERT INTO pilot_review_decisions(id,proposal_id,reviewer_subject,decision,reason) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM proposed_changes WHERE id=? AND status='pending')",
      )
      .bind(
        claim,
        input.id,
        subject,
        input.decision,
        input.reason.trim(),
        input.id,
      ),
  ];
  if (input.decision === "approved")
    statements.push(
      database
        .prepare(
          "UPDATE content_records SET availability_status=?,deadline=?,source_conflict=0,last_verified_at=CURRENT_TIMESTAMP WHERE id=? AND EXISTS(SELECT 1 FROM pilot_review_decisions WHERE id=?)",
        )
        .bind(update.availability, update.deadline, proposal.targetId, claim),
    );
  statements.push(
    database
      .prepare(
        "UPDATE proposed_changes SET status=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=? AND status='pending' AND EXISTS(SELECT 1 FROM pilot_review_decisions WHERE id=?)",
      )
      .bind(input.decision, input.id, claim),
  );
  statements.push(
    database
      .prepare(
        "INSERT INTO pilot_audit(id,actor_subject,action,target) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM pilot_review_decisions WHERE id=?)",
      )
      .bind(
        crypto.randomUUID(),
        subject,
        `availability.${input.decision}`,
        proposal.targetId,
        claim,
      ),
  );
  await database.batch(statements);
  const won = await database
    .prepare("SELECT id FROM pilot_review_decisions WHERE id=?")
    .bind(claim)
    .first();
  if (!won)
    throw Object.assign(new Error("This proposal was already decided"), {
      status: 409,
    });
  return { reviewed: true };
}
