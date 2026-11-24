// Windows는 gradlew.bat, Mac은 ./gradlew를 써야 해서 pnpm 명령 하나로 감싼다.
import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const backend = new URL('../backend/', import.meta.url);
const result = spawnSync(isWindows ? 'gradlew.bat' : './gradlew', process.argv.slice(2), {
  cwd: backend,
  stdio: 'inherit',
  shell: isWindows,
});
if (result.error) console.error(`gradlew 실행 실패: ${result.error.message}`);
process.exit(result.status ?? 1);
