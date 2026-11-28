// 폴더마다 린트 설정 위치가 달라서, 포맷을 먼저 한 뒤 각 폴더 기준으로 린트를 순서대로 돌린다.
const quote = (files) => files.map((file) => JSON.stringify(file)).join(" ");

export default (files) => {
  const pick = (pattern) => files.filter((file) => pattern.test(file));
  const commands = [];

  const formattable = pick(/\.(tsx?|[cm]?js|css|sol)$/);
  if (formattable.length > 0) {
    commands.push(`prettier --write --ignore-unknown ${quote(formattable)}`);
  }

  for (const service of ["issuer", "broker", "mts"]) {
    const frontendCode = pick(
      new RegExp(`[\\\\/]frontend[\\\\/]${service}[\\\\/].*\\.(tsx?|[cm]?js)$`),
    );

    if (frontendCode.length > 0) {
      commands.push(
        `pnpm --filter ./frontend/${service} exec eslint --fix ${quote(frontendCode)}`,
      );
    }
  }

  const solidity = pick(/[\\/]contracts[\\/].*\.sol$/);
  if (solidity.length > 0) {
    commands.push(`pnpm --filter ./contracts exec solhint ${quote(solidity)}`);
  }

  if (pick(/[\\/]backend[\\/].*\.java$/).length > 0) {
    commands.push("node scripts/gradle.mjs spotlessApply");
  }

  return commands;
};
