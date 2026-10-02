#!/usr/bin/env node
import { select, input, confirm } from "@inquirer/prompts";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "templates");
const PROJECTS_DIR = path.join(ROOT, "projects");

async function discoverTemplates() {
  const entries = await fs.readdir(TEMPLATES_DIR, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(TEMPLATES_DIR, e.name);
    let meta = { label: e.name, description: "" };
    try {
      const raw = await fs.readFile(path.join(dir, "template.json"), "utf8");
      meta = { ...meta, ...JSON.parse(raw) };
    } catch {}
    out.push({ id: e.name, dir, ...meta });
  }
  return out;
}

async function copyTemplate(src, dest, vars) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    if (entry.name === "template.json") continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyTemplate(s, d, vars);
      continue;
    }
    const buf = await fs.readFile(s);
    try {
      const text = buf.toString("utf8");
      if (text.includes("\uFFFD")) throw new Error("binary");
      const replaced = text.replace(
        /\{\{\s*([\w-]+)\s*\}\}/g,
        (_, k) => vars[k] ?? "",
      );
      await fs.writeFile(d, replaced);
    } catch {
      await fs.writeFile(d, buf);
    }
  }
}

async function main() {
  const templates = await discoverTemplates();
  if (!templates.length) {
    console.error(pc.red(`No templates found in ${TEMPLATES_DIR}`));
    process.exit(1);
  }

  const templateId = await select({
    message: "Pick a template",
    choices: templates.map((t) => ({
      name: `${t.label}  ${pc.gray(t.description)}`,
      value: t.id,
    })),
  });

  const name = await input({
    message: "Project name",
    validate: (v) =>
      /^[a-z0-9][a-z0-9-_]*$/i.test(v) || "Use letters, numbers, - or _",
  });

  const dest = path.join(PROJECTS_DIR, name);
  try {
    await fs.access(dest);
    console.error(pc.red(`Destination already exists: ${dest}`));
    process.exit(1);
  } catch {}

  const template = templates.find((t) => t.id === templateId);
  await copyTemplate(template.dir, dest, { name });

  console.log(pc.green(`✔ Created projects/${name}`));

  if (template.postInstall) {
    const run = await confirm({
      message: `Run "${template.postInstall}"?`,
      default: true,
    });
    if (run) {
      const { execa } = await import("execa");
      await execa(template.postInstall, {
        cwd: dest,
        stdio: "inherit",
        shell: true,
      });
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
