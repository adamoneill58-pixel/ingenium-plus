import { getDiscoveryData } from "@/lib/v2/catalogue";
import { discover } from "@/lib/v2/domain";
export async function GET(request: Request) {
  const d = await getDiscoveryData();
  const p = new URL(request.url).searchParams;
  const records = discover(
    d.records,
    Object.fromEntries(
      [
        "query",
        "type",
        "university",
        "delivery",
        "level",
        "language",
        "status",
        "theme",
        "funding",
        "deadline",
      ].map((k) => [k, p.get(k) ?? ""]),
    ),
  );
  return Response.json(
    { records, storage: d.storage },
    {
      headers: {
        "cache-control":
          d.storage === "database"
            ? "public,max-age=30,stale-while-revalidate=60"
            : "no-store",
      },
    },
  );
}
