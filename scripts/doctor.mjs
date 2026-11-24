// 기준 버전은 저장소 설정 파일(.nvmrc, package.json, libs.versions.toml)에서 읽는다. 버전을 바꿀 때 한 곳만 고치기 위해서다.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const isWindows = process.platform === 'win32';

const pkg = JSON.parse(read('package.json'));
const expected = {
  node: read('.nvmrc').trim(),
  pnpm: pkg.packageManager.split('@')[1],
  java: read('backend/gradle/libs.versions.toml').match(/^java\s*=\s*"(\d+)"/m)[1],
  gitleaks: pkg.toolVersions.gitleaks,
};

function run(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: 'utf8', shell: isWindows });
  if (result.error) return null;
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}

const howTo = {
  node: isWindows
    ? `winget install Schniz.fnm 후 저장소 루트에서 fnm install; fnm use`
    : `brew install fnm 후 저장소 루트에서 fnm install && fnm use`,
  pnpm: `corepack 없이: npm i -g pnpm@${expected.pnpm} (설치 후에는 packageManager가 버전을 맞춘다)`,
  java: isWindows
    ? `winget install EclipseAdoptium.Temurin.21.JDK`
    : `brew install --cask temurin@21`,
  docker: `Docker Desktop 설치 후 실행 (docker compose v2 포함)`,
  gitleaks: `https://github.com/gitleaks/gitleaks/releases/tag/v${expected.gitleaks} 에서 ${
    isWindows ? 'windows_x64.zip' : process.arch === 'arm64' ? 'darwin_arm64.tar.gz' : 'darwin_x64.tar.gz'
  } 를 받아 PATH에 둔다${isWindows ? '' : ' (또는 brew install gitleaks 후 gitleaks version 확인)'}`,
};

const checks = {
  node: () => {
    const actual = process.versions.node;
    return { ok: actual === expected.node, actual, want: expected.node };
  },
  pnpm: () => {
    const actual = run('pnpm', ['--version'])?.trim() ?? null;
    return { ok: actual === expected.pnpm, actual, want: expected.pnpm };
  },
  java: () => {
    const out = run('java', ['-version']);
    const major = out?.match(/version "(\d+)/)?.[1] ?? null;
    if (major === expected.java) return { ok: true, actual: major, want: expected.java };
    // Gradle 실행에는 17 이상이면 되고, 빌드용 21은 foojay가 자동으로 받는다.
    if (major && Number(major) >= 17) {
      return { ok: true, warn: true, actual: major, want: `${expected.java} (빌드용 ${expected.java}는 Gradle이 자동으로 받음)` };
    }
    return { ok: false, actual: major, want: `${expected.java}` };
  },
  docker: () => {
    const out = run('docker', ['compose', 'version']);
    const actual = out?.match(/v?(\d+\.\d+\.\d+)/)?.[1] ?? null;
    const ok = actual !== null && Number(actual.split('.')[0]) >= 2;
    return { ok, actual, want: 'compose v2 이상' };
  },
  gitleaks: () => {
    const actual = run('gitleaks', ['version'])?.trim().replace(/^v/, '') ?? null;
    return { ok: actual === expected.gitleaks, actual, want: expected.gitleaks };
  },
};

const picked = process.argv.slice(2);
const names = picked.length > 0 ? picked : Object.keys(checks);
let failed = 0;

for (const name of names) {
  const { ok, warn, actual, want } = checks[name]();
  const mark = !ok ? '❌' : warn ? '⚠️ ' : '✅';
  console.log(`${mark} ${name.padEnd(9)} 내 버전: ${actual ?? '없음'}  /  규칙: ${want}`);
  if (!ok) {
    failed += 1;
    console.log(`   → 설치: ${howTo[name]}`);
  }
}

if (failed > 0) {
  console.log(`\n${failed}개가 규칙과 다릅니다. 위 안내대로 맞춘 뒤 다시 실행하세요. (AI는 여기서 멈추고 사람에게 알린다)`);
  process.exit(1);
}
console.log('\n모두 규칙과 같습니다.');
