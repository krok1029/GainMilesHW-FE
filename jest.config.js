module.exports = {
  preset: "jest-expo",
  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],
  collectCoverageFrom: [
    "src/shared/dialog/dialogManager.ts",
    "src/features/consultation/api/*.ts",
  ],
};
