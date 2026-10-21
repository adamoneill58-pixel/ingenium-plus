import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const target = JSON.parse(await readFile(new URL("../config/vercel-project.json", import.meta.url), "utf8"));
const mode = process.argv[2] ?? "preview";
if (!["preview", "production", "stage"].includes(mode)) throw new Error("Choose preview, production or stage.");

let linked;
try {
  linked = JSON.parse(await readFile(new URL("../.vercel/project.json", import.meta.url), "utf8"));
} catch {
  throw new Error("Run npm run vercel:link once before deploying this checkout.");
}
if (linked.projectId !== target.projectId || linked.orgId !== target.orgId) {
  throw new Error("This checkout is linked to a different Vercel project. Deployment stopped.");
}

function vercel(args) {
  const result = spawnSync("npx", ["--yes", "vercel@64.5.0", ...args, "--scope", target.orgId, "--non-interactive"], {
    cwd: root, stdio: "inherit", env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

vercel(["project", "inspect"]);
vercel(["deploy", "--prebuilt", ...(mode === "preview" ? [] : ["--prod"]), ...(mode === "stage" ? ["--skip-domain"] : [])]);
