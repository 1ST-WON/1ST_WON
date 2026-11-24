// commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "test", "docs", "chore", "ci"],
    ],
    "scope-enum": [2, "always", ["fe", "be", "contract", "infra"]],
    "subject-case": [0],
  },
};
