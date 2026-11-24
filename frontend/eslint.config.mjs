import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const moneyMessage =
  "금액·수량은 shared/lib/money.ts에서 bigint로만 다룬다 (ADR-38).";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        // TODO(mock 피드백): 노션은 "React 컴포넌트 함수 PascalCase 허용"만 있어, 화살표 함수 컴포넌트(변수)도 같이 허용함
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
        // TODO(mock 피드백): 객체·타입 속성 이름 규칙은 노션에 없음. API 타입은 자동 생성이고 헤더(Idempotency-Key) 같은 이름이 있어 검사하지 않음
        {
          selector: [
            "objectLiteralProperty",
            "objectLiteralMethod",
            "typeProperty",
            "typeMethod",
          ],
          format: null,
        },
        { selector: "import", format: null },
      ],
      "no-restricted-globals": [
        "error",
        { name: "parseFloat", message: moneyMessage },
      ],
      "no-restricted-properties": [
        "error",
        { object: "Number", property: "parseFloat", message: moneyMessage },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
