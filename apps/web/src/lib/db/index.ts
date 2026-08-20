import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseUrl } from "./connection-string";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

function createPool() {
  return new Pool({
    connectionString: getDatabaseUrl(),
    max: process.env.NODE_ENV === "production" ? 10 : 5,
  });
}

export const pool = globalForDb.pool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });

export * from "./schema";
export { createId } from "./id";
