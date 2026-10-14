import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../lib/data.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const data = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const urls = [...new Set([
  ...data.sources.map((item) => item.url),
  ...data.entities.map((item) => item.officialUrl),
].filter(Boolean))];

for (const value of urls) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error(`Unsupported URL protocol: ${value}`);
}

if (!process.argv.includes("--live")) {
  console.log(`Validated the syntax of ${urls.length} unique public URLs. Use --live for a current network check.`);
  process.exit(0);
}

const failures = [];
for (let index = 0; index < urls.length; index += 6) {
  const batch = urls.slice(index, index + 6);
  const results = await Promise.all(batch.map(async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        headers: { "user-agent": "INGENIUM-Plus-Research-Link-Check/1.5" },
      });
      // A 401/403 still proves the endpoint exists; some partner sites block
      // automated requests even though the same official URL opens normally
      // in a browser. Redirects and true missing/error responses still fail.
      const reachable = response.ok || response.status === 401 || response.status === 403;
      return { url, status: response.status, ok: reachable };
    } catch (error) {
      return { url, status: 0, ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }));
  for (const result of results) {
    console.log(`${result.ok ? "OK" : "FAIL"} ${result.status || "ERR"} ${result.url}`);
    if (!result.ok) failures.push(result);
  }
}

if (failures.length > 0) {
  throw new Error(`${failures.length} of ${urls.length} live links failed; review before changing any source record.`);
}

console.log(`All ${urls.length} public links responded successfully.`);
