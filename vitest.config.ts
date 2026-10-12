import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // Tests run against a separate database so they never touch development data.
    env: { DATABASE_URL: "postgresql://portfolio:portfolio@localhost:5433/portfolio_test" },
    // Database tests share one database and clean it per test; run files one at a time.
    fileParallelism: false,
  },
  resolve: { alias: { "@": new URL(".", import.meta.url).pathname } },
});
