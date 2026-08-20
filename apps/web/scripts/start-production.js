const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..", "..");
const port = process.env.PORT || "3000";
const isWin = process.platform === "win32";

function resolveBin(name) {
  const fileName = isWin ? `${name}.cmd` : name;
  const candidates = [
    path.join(webRoot, "node_modules", ".bin", fileName),
    path.join(repoRoot, "node_modules", ".bin", fileName),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? name;
}

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd: webRoot,
      stdio: "inherit",
      env: process.env,
      shell: isWin,
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

async function main() {
  await run(resolveBin("drizzle-kit"), ["migrate"]);
  await run(resolveBin("next"), [
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
