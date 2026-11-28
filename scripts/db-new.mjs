import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const description = process.argv
  .slice(2)
  .join("_")
  .trim()
  .toLowerCase()
  .replace(/[\s-]+/g, "_");

if (!/^[a-z][a-z0-9_]*$/.test(description)) {
  console.error("Usage: pnpm db:new create_companies");
  console.error("Use English letters, numbers, and underscores.");
  process.exit(1);
}

const version = new Date().toISOString().replace(/\D/g, "").slice(0, 14);

const migrationDir = fileURLToPath(
  new URL("../infra/flyway/sql/", import.meta.url),
);

mkdirSync(migrationDir, { recursive: true });

const duplicate = readdirSync(migrationDir).some((file) =>
  file.startsWith(`V${version}__`),
);

if (duplicate) {
  console.error("Migration version already exists. Please try again.");
  process.exit(1);
}

const filename = `V${version}__${description}.sql`;
const filepath = join(migrationDir, filename);

writeFileSync(filepath, `-- ${description}\n`, {
  encoding: "utf8",
  flag: "wx",
});

console.log(`Created: infra/flyway/sql/${filename}`);
