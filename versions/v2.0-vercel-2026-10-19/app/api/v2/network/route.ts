import { getRuntimeDataset } from "@/lib/v151/runtime-data";
export async function GET() {
  const d = await getRuntimeDataset();
  return Response.json(
    {
      relationships: d.relationships.map(
        ({ id, source, target, label, explanation }) => ({
          id,
          source,
          target,
          label,
          explanation,
        }),
      ),
    },
    {
      headers: {
        "cache-control":
          d.storage === "database" || d.storage === "release-snapshot" ? "public,max-age=30" : "no-store",
      },
    },
  );
}
