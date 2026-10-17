import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // Tests run against a separate database so they never touch development data.
    env: {
      DATABASE_URL: "postgresql://portfolio:portfolio@localhost:5433/portfolio_ref_test",
      AUTH_CODE_SECRET: "test-only-auth-code-secret",
      JWT_SECRET: "test-only-jwt-secret-at-least-32-chars",
      CAPTCHA_SECRET: "test-only-captcha-secret",
    },
    // Database tests share one database and clean it per test; run files one at a time.
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
      // server-only throws outside Next.js; in tests it can be an empty module.
      "server-only": new URL("./node_modules/server-only/empty.js", import.meta.url).pathname,
    },
  },
});
