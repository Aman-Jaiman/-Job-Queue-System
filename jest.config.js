export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/server/test/**/*.test.js"],
  setupFiles: ["<rootDir>/server/test/env.js"],
  setupFilesAfterEnv: ["<rootDir>/server/test/setup.js"],
};
