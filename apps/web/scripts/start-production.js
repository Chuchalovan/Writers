const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { drizzle } = require("drizzle-orm/node-postgres");
const { migrate } = require("drizzle-orm/node-postgres/migrator");
const { Pool } = require("pg");

const webRoot = path.resolve(__dirname, "..");
const migrationsFolder = path.join(webRoot, "drizzle");
const port = process.env.PORT || "3000";

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("schema");
    return parsed.toString();
  } catch {
    return url;
  }
}

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd: webRoot,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${path.basename(bin)} exited with code ${code}`));
    });
  });
}

async function applyMigrations() {
  if (!fs.existsSync(migrationsFolder)) {
    throw new Error(`Drizzle migrations folder not found: ${migrationsFolder}`);
  }

  const pool = new Pool({
    connectionString: getDatabaseUrl(),
    max: 1,
  });

  try {
    console.log("Applying database migrations...");
    await migrate(drizzle(pool), { migrationsFolder });
    console.log("Database migrations applied.");
  } finally {
    await pool.end();
  }
}

async function main() {
  await applyMigrations();

  const nextBin = require.resolve("next/dist/bin/next", { paths: [webRoot] });
  await run(process.execPath, [
    nextBin,
    "start",
    "--hostname",
    "0.0.0.0",
    "--port",
    String(port),
  ]);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
