export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/test/**/*.test.js"],
  setupFiles: ["<rootDir>/test/env.js"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
};
