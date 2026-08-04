#!/usr/bin/env node
/**
 * Push Manuscript backlog to Asana from scripts/asana-backlog.csv
 *
 * Usage:
 *   ASANA_ACCESS_TOKEN=... ASANA_PROJECT_GID=... node scripts/push-asana-backlog.mjs
 *
 * Get PAT: https://app.asana.com/0/my-apps
 * Project GID: from URL https://app.asana.com/0/PROJECT_GID/list
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(__dirname, "asana-backlog.csv");
const API_BASE = "https://app.asana.com/api/1.0";
const BATCH_SIZE = 10;

const token = process.env.ASANA_ACCESS_TOKEN;
const projectGid = process.env.ASANA_PROJECT_GID;

if (!token || !projectGid) {
  console.error(
    "Missing env vars. Required:\n" +
      "  ASANA_ACCESS_TOKEN — Personal Access Token\n" +
      "  ASANA_PROJECT_GID  — numeric project id from Asana URL"
  );
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let i = 0;
  const len = text.length;

  while (i < len) {
    if (text[i] === "\n" || text[i] === "\r") {
      i++;
      continue;
    }

    const fields = [];
    while (i < len) {
      let value = "";
      if (text[i] === '"') {
        i++;
        while (i < len) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') {
              value += '"';
              i += 2;
            } else {
              i++;
              break;
            }
          } else {
            value += text[i++];
          }
        }
      } else {
        while (i < len && text[i] !== "," && text[i] !== "\n" && text[i] !== "\r") {
          value += text[i++];
        }
      }
      fields.push(value);
      if (text[i] === ",") i++;
      else break;
    }
    if (fields.some((f) => f.length > 0)) rows.push(fields);
    while (i < len && (text[i] === "\n" || text[i] === "\r")) i++;
  }
  return rows;
}

async function asana(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(json)}`);
  }
  return json.data;
}

async function getOrCreateSection(name) {
  const sections = await asana("GET", `/projects/${projectGid}/sections?opt_fields=name,gid`);
  const existing = sections.find((s) => s.name === name);
  if (existing) return existing.gid;

  const created = await asana("POST", "/sections", {
    data: { name, project: projectGid },
  });
  console.log(`  + section: ${name}`);
  return created.gid;
}

async function createTasksBatch(tasks) {
  const actions = tasks.map((task) => ({
    relative_path: "/tasks",
    method: "post",
    data: {
      name: task.name,
      notes: task.notes,
      projects: [projectGid],
      memberships: task.sectionGid
        ? [{ project: projectGid, section: task.sectionGid }]
        : undefined,
    },
    options: { fields: ["gid", "name"] },
  }));

  const result = await asana("POST", "/batch", { data: { actions } });
  return result;
}

function buildNotes(row, headers) {
  const get = (key) => row[headers.indexOf(key)] ?? "";
  const parts = [get("Description")];
  const meta = [
    ["Priority", get("Priority")],
    ["Release", get("Release")],
    ["Sprint", get("Sprint")],
    ["Status", get("Status")],
  ].filter(([, v]) => v);
  if (meta.length) {
    parts.push("", "—", ...meta.map(([k, v]) => `${k}: ${v}`));
  }
  return parts.join("\n").trim();
}

async function main() {
  const csv = readFileSync(CSV_PATH, "utf8");
  const [headerRow, ...dataRows] = parseCsv(csv);
  const headers = headerRow;

  const items = dataRows.map((row) => ({
    name: row[headers.indexOf("Name")],
    section: row[headers.indexOf("Section")],
    notes: buildNotes(row, headers),
  }));

  console.log(`Project ${projectGid}: ${items.length} tasks from ${CSV_PATH}\n`);

  const sectionNames = [...new Set(items.map((i) => i.section).filter(Boolean))];
  const sectionMap = {};
  for (const name of sectionNames) {
    sectionMap[name] = await getOrCreateSection(name);
  }

  let created = 0;
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const chunk = items.slice(i, i + BATCH_SIZE).map((item) => ({
      name: item.name,
      notes: item.notes,
      sectionGid: sectionMap[item.section],
    }));

    const results = await createTasksBatch(chunk);
    for (const r of results) {
      if (r.status_code >= 200 && r.status_code < 300) {
        created++;
        console.log(`  ✓ ${r.body?.data?.name ?? "task"}`);
      } else {
        console.error(`  ✗ ${r.status_code}: ${JSON.stringify(r.body)}`);
      }
    }
  }

  console.log(`\nDone: ${created}/${items.length} tasks created.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
