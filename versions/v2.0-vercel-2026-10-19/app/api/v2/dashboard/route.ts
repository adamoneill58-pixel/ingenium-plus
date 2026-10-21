import { catalogueHealth } from "@/lib/v2/health";
import { getPublishedDataset } from "@/lib/v151/data-access";
import { requirePilotTeam } from "@/lib/v2/team";
import { apiFailure } from "@/lib/v2/public-api";
import { pilotWindow } from "@/lib/v2/window";
import { getRuntimeBindings } from "@/lib/v151/bindings";
export async function GET(request: Request) {
  try {
    const { database, role } = await requirePilotTeam(request);
    const period = pilotWindow(getRuntimeBindings());
    const start = period.start || "0000-01-01",
      end = period.end || "9999-12-31";
    const [usage, survey, health, total, respondents, refresh] =
      await Promise.all([
        database
          .prepare(
            "SELECT * FROM usage_daily_counts WHERE day>=? AND day<? ORDER BY day DESC LIMIT 2000",
          )
          .bind(start, end)
          .all(),
        database
          .prepare(
            "SELECT * FROM survey_answer_counts ORDER BY iso_week DESC LIMIT 2000",
          )
          .all(),
        database
          .prepare(
            "SELECT COUNT(*) AS stale FROM content_records WHERE is_published=1 AND (last_checked IS NULL OR check_error IS NOT NULL OR last_checked<datetime('now','-7 days'))",
          )
          .first(),
        database
          .prepare(
            "SELECT COALESCE(SUM(count),0) AS count FROM usage_daily_counts WHERE day>=? AND day<?",
          )
          .bind(start, end)
          .first(),
        database
          .prepare(
            "SELECT COALESCE(SUM(count),0) AS count FROM survey_answer_counts WHERE question=2",
          )
          .first(),
        database
          .prepare(
            "SELECT value_json AS summary,updated_at AS checkedAt FROM system_state WHERE key='v2_status_refresh'",
          )
          .first(),
      ]);
    const catalogue = await getPublishedDataset(database);
    const pending = await database
      .prepare(
        "SELECT COUNT(*) count FROM proposed_changes WHERE target_type='availability' AND status='pending'",
      )
      .first();
    return Response.json(
      {
        usage: usage.results,
        survey: survey.results,
        health: {
          ...health,
          ...catalogueHealth(catalogue.records),
          pending,
          storage: catalogue.storage,
        },
        total,
        respondents,
        role,
        period,
        refresh,
        detailLimit: 2000,
      },
      { headers: { "cache-control": "private,no-store" } },
    );
  } catch (e) {
    return apiFailure(e);
  }
}
