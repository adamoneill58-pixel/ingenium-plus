#!/usr/bin/env node
// Reports raw and gzip sizes for the client JavaScript chunks and the Worker
// entry produced by `npm run build`. Use before/after a change to measure the
// effect of bundle reductions. Pass `--json` for machine-readable output.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const root = new URL("..", import.meta.url).pathname;
const clientDir = join(root, "dist/client/assets");
const workerEntry = join(root, "dist/server/index.js");

if (!existsSync(clientDir)) {
  console.error("dist/client/assets not found. Run `npm run build` first.");
  process.exit(1);
}

const measure = (path) => {
  const bytes = readFileSync(path);
  return { raw: bytes.length, gzip: gzipSync(bytes).length };
};

const kb = (value) => `${(value / 1024).toFixed(1)} KB`.padStart(10);

const chunks = readdirSync(clientDir)
  .filter((name) => name.endsWith(".js"))
  .map((name) => ({ name, ...measure(join(clientDir, name)) }))
  .sort((left, right) => right.raw - left.raw);

const serverJs = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".js")) serverJs.push({ name: path.slice(root.length), ...measure(path) });
  }
};
walk(join(root, "dist/server"));
serverJs.sort((left, right) => right.raw - left.raw);

const total = chunks.reduce((sum, chunk) => ({ raw: sum.raw + chunk.raw, gzip: sum.gzip + chunk.gzip }), { raw: 0, gzip: 0 });
const worker = existsSync(workerEntry) ? measure(workerEntry) : null;

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ client: { total, chunks }, worker, serverLargest: serverJs.slice(0, 10) }, null, 2));
} else {
  console.log("Client JavaScript (dist/client/assets)");
  console.log(`${"raw".padStart(10)}${"gzip".padStart(10)}  chunk`);
  for (const chunk of chunks) console.log(`${kb(chunk.raw)}${kb(chunk.gzip)}  ${chunk.name}`);
  console.log(`${kb(total.raw)}${kb(total.gzip)}  TOTAL (${chunks.length} chunks)`);
  if (worker) console.log(`\nWorker entry dist/server/index.js: ${kb(worker.raw).trim()} raw, ${kb(worker.gzip).trim()} gzip`);
  console.log("\nLargest server chunks");
  for (const chunk of serverJs.slice(0, 8)) console.log(`${kb(chunk.raw)}${kb(chunk.gzip)}  ${chunk.name}`);
}

