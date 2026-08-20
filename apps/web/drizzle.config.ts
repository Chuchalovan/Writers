import { defineConfig } from "drizzle-kit";

function databaseUrl() {
  const url = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/manuscript";
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("schema");
    return parsed.toString();
  } catch {
    return url;
  }
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl(),
  },
});
