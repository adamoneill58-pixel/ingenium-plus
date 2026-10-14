import { writeFile, mkdir } from "node:fs/promises";
// Generates local configuration only. It never creates resources or deploys.
const env = process.env;
const required = [
  "INGENIUM_DB_ID",
  "INGENIUM_R2_BUCKET",
  "PUBLIC_BASE_URL",
  "INGENIUM_WORKER_NAME",
];
for (const k of required)
  if (!env[k]) throw new Error(`Supply ${k} from your own Cloudflare account`);
if (!/^[a-f0-9-]{36}$/i.test(env.INGENIUM_DB_ID))
  throw new Error("A real D1 database UUID is required");
if (new URL(env.PUBLIC_BASE_URL).protocol !== "https:")
  throw new Error("Use an HTTPS public URL");
await mkdir(".wrangler", { recursive: true });
const config = {
  name: env.INGENIUM_WORKER_NAME,
  main: "../worker/index.ts",
  compatibility_date: "2026-10-14",
  compatibility_flags: ["nodejs_compat"],
  assets: { directory: "../dist/client", binding: "ASSETS" },
  d1_databases: [
    {
      binding: "DB",
      database_name: env.INGENIUM_WORKER_NAME,
      database_id: env.INGENIUM_DB_ID,
      migrations_dir: "../drizzle",
    },
  ],
  r2_buckets: [{ binding: "DOCUMENTS", bucket_name: env.INGENIUM_R2_BUCKET }],
  triggers: { crons: ["0 5 * * 1"] },
  vars: {
    PUBLIC_BASE_URL: env.PUBLIC_BASE_URL,
    ALLOW_STATIC_FALLBACK: "false",
    PILOT_ANALYTICS_ENABLED: "false",
    EDGE_RATE_LIMIT_READY: "false",
    ACCESS_TEAM_DOMAIN: env.ACCESS_TEAM_DOMAIN ?? "",
    ACCESS_AUD: env.ACCESS_AUD ?? "",
  },
  observability: { enabled: false },
};
await writeFile(
  ".wrangler/ingenium.jsonc",
  JSON.stringify(config, null, 2) + "\n",
);
console.log(
  "Prepared .wrangler/ingenium.jsonc. No account settings or resources were changed. Build with INGENIUM_DEPLOY_CONFIG=.wrangler/ingenium.jsonc. Use separate resource IDs and config for staging.",
);
