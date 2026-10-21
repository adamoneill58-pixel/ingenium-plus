import { requireDatabase } from "@/lib/v151/api";
import { surveyRows, storeSurvey } from "@/lib/v2/pilot";
import { readPilotBody, apiFailure } from "@/lib/v2/public-api";
export async function POST(request: Request) {
  try {
    const value = await readPilotBody(request);
    try {
      surveyRows(value);
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Invalid survey" },
        { status: 400 },
      );
    }
    await storeSurvey(requireDatabase(), value);
    return Response.json(
      { saved: true },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    return apiFailure(e);
  }
}
