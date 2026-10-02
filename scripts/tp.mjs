#!/usr/bin/env node
import { search } from "@inquirer/prompts";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROJECTS_DIR = path.join(ROOT, "projects");

function fail(msg, code = 1) {
  process.stderr.write(`tp: ${msg}\n`);
  process.exit(code);
}

async function main() {
  let entries;
  try {
    entries = await fs.promises.readdir(PROJECTS_DIR, { withFileTypes: true });
  } catch (err) {
    fail(`cannot read ${PROJECTS_DIR} (${err.code || err.message})`);
  }

  const dirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  if (dirs.length === 0) {
    fail(`no projects found in ${PROJECTS_DIR}`);
  }

  // Non-interactive shortcuts
  const arg = process.argv[2];
  if (arg === "--list") {
    for (const d of dirs) {
      process.stdout.write(
        path.join(PROJECTS_DIR, d).replace(/\\/g, "/") + "\n",
      );
    }
    return;
  }
  if (arg && arg !== "--list") {
    const exact = dirs.find((d) => d === arg);
    const fuzzy = dirs.find((d) => d.toLowerCase().includes(arg.toLowerCase()));
    const chosen = exact || fuzzy;
    if (!chosen) fail(`no project matches "${arg}"`);
    return writeResult(path.join(PROJECTS_DIR, chosen));
  }

  if (!process.stdin.isTTY) {
    fail(
      "interactive prompt requires a TTY (run the `tp` shell function instead of `pnpm tp`)",
    );
  }

  const chosen = await search({
    message: "Jump to project",
    source: (term) => {
      const t = (term || "").toLowerCase();
      return t ? dirs.filter((d) => d.toLowerCase().includes(t)) : dirs;
    },
  });

  if (!chosen) fail("no project selected");
  writeResult(path.join(PROJECTS_DIR, chosen));
}

function writeResult(target) {
  const resultFile =
    process.env.TP_RESULT_FILE ||
    path.join(os.tmpdir(), `tp-${process.pid}.txt`);
  const normalized = target.replace(/\\/g, "/"); // Node emits C:\... on Windows
  try {
    fs.writeFileSync(resultFile, normalized, "utf8");
  } catch (err) {
    fail(`cannot write result file ${resultFile} (${err.message})`);
  }
  process.stderr.write(`tp -> ${normalized}\n`);
}

main().catch((err) => {
  process.stderr.write(`tp: ${err?.stack || err}\n`);
  process.exit(1);
});
