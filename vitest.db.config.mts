import { defineConfig } from "vitest/config";

/** Database access-policy tests. Require TEST_DATABASE_URL (see docs/phase-1-auth.md). */
export default defineConfig({
  test: {
    include: ["tests/db/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
    testTimeout: 20_000,
  },
});
