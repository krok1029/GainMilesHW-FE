const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  { ignores: ["dist/*", "coverage/*", "ios/*", "android/*"] },
  {
    rules: {
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: "*", next: "return" },
        {
          blankLine: "always",
          prev: "*",
          next: [
            "function",
            "export",
            "block-like",
            "if",
            "multiline-const",
            "multiline-expression",
          ],
        },
        {
          blankLine: "always",
          prev: [
            "function",
            "export",
            "block-like",
            "if",
            "multiline-const",
            "multiline-expression",
          ],
          next: "*",
        },
      ],
    },
  },
]);
