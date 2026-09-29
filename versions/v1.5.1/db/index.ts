import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb(database?: D1Database) {
  if (!database) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Provision the binding before using persistent platform features."
    );
  }

  return drizzle(database, { schema });
}

export function hasDatabase(database?: D1Database): database is D1Database {
  return Boolean(database);
}
