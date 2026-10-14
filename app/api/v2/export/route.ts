import { requirePilotTeam } from "@/lib/v2/team";
import { isoWeek, reportCsv, type ReportRow } from "@/lib/v2/pilot";
import { apiFailure } from "@/lib/v2/public-api";
export async function GET(request: Request) {
  try {
    const { database, identity } = await requirePilotTeam(request);
    const usage = await database
      .prepare(
        "SELECT event_type,target_id,day,campus,count FROM usage_daily_counts",
      )
      .all<{
        event_type: string;
        target_id: string;
        day: string;
        campus: string;
        count: number;
      }>();
    const groups = new Map<string, ReportRow>();
    for (const r of usage.results) {
      const week = isoWeek(new Date(`${r.day}T00:00:00Z`));
      const group = `${r.event_type}${r.campus ? ` · ${r.campus}` : ""}`;
      const key = JSON.stringify([week, group, r.target_id]);
      const prior = groups.get(key);
      groups.set(key, {
        week,
        group,
        target: r.target_id,
        count: Number(prior?.count ?? 0) + r.count,
      });
    }
    const survey = await database
      .prepare(
        "SELECT question,option,iso_week,role,count FROM survey_answer_counts",
      )
      .all<{
        question: number;
        option: string;
        iso_week: string;
        role: string;
        count: number;
      }>();
    for (const r of survey.results) {
      const key = `survey-${r.question}-${r.option}-${r.iso_week}-${r.role}`;
      groups.set(key, {
        week: r.iso_week,
        group: `Survey Q${r.question}${r.role ? ` · ${r.role}` : ""}`,
        target: r.option,
        count: r.count,
      });
    }
    await database
      .prepare(
        "INSERT INTO pilot_audit(id,actor_subject,action,target) VALUES (?,?,'export','weekly-aggregates')",
      )
      .bind(crypto.randomUUID(), identity.userId)
      .run();
    return new Response(reportCsv([...groups.values()]), {
      headers: {
        "content-type": "text/csv;charset=utf-8",
        "content-disposition":
          "attachment; filename=ingenium-weekly-report.csv",
        "cache-control": "private,no-store",
      },
    });
  } catch (e) {
    return apiFailure(e);
  }
}
