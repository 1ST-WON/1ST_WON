import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";

const service = process.argv[2];

const commonKeys = ["DB_HOST", "DB_PORT", "DB_NAME", "JWT_SECRET"];

const serviceKeys = {
  issuer: [
    "ISSUER_DB_USER",
    "ISSUER_DB_PASSWORD",
    "ISSUER_PORT",
    "BROKER_API_URL",
  ],
  broker: [
    "BROKER_DB_USER",
    "BROKER_DB_PASSWORD",
    "BROKER_PORT",
    "ISSUER_API_URL",
    "MTS_API_URL",
    "BLOCKCHAIN_RPC_URL",
    "BLOCKCHAIN_CHAIN_ID",
    "BLOCKCHAIN_CONTRACT_ADDRESS",
  ],
  mts: ["MTS_DB_USER", "MTS_DB_PASSWORD", "MTS_PORT", "BROKER_API_URL"],
};

if (!Object.hasOwn(serviceKeys, service)) {
  console.error("Usage: node scripts/backend-run.mjs <issuer|broker|mts>");
  process.exit(1);
}

const root = fileURLToPath(new URL("../", import.meta.url));
const envFile = new URL("../.env", import.meta.url);
const fileEnv = parseEnv(readFileSync(envFile, "utf8"));

const systemKeys = new Set([
  "PATH",
  "SYSTEMROOT",
  "WINDIR",
  "COMSPEC",
  "PATHEXT",
  "TEMP",
  "TMP",
  "HOME",
  "USERPROFILE",
  "USERNAME",
  "USER",
  "HOMEDRIVE",
  "HOMEPATH",
  "APPDATA",
  "LOCALAPPDATA",
  "JAVA_HOME",
  "GRADLE_USER_HOME",
  "LANG",
  "LC_ALL",
]);

const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) =>
    systemKeys.has(key.toUpperCase()),
  ),
);

for (const key of [...commonKeys, ...serviceKeys[service]]) {
  const value = process.env[key] ?? fileEnv[key];

  if (value !== undefined) {
    env[key] = value;
  }
}

const passwordKey = `${service.toUpperCase()}_DB_PASSWORD`;

if (!env[passwordKey]) {
  console.error(`Missing required environment variable: ${passwordKey}`);
  process.exit(1);
}

console.log(`Starting ${service} backend...`);

const result = spawnSync(
  process.execPath,
  ["scripts/gradle.mjs", "--no-daemon", `:${service}:bootRun`],
  {
    cwd: root,
    env,
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
