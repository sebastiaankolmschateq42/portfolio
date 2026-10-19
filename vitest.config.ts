import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    env: {
      DATABASE_URL: "postgresql://portfolio:portfolio@localhost:5433/portfolio_test",
      AUTH_CODE_SECRET: "test-only-auth-code-secret",
      JWT_SECRET: "test-only-jwt-secret-at-least-32-chars",
      CAPTCHA_SECRET: "test-only-captcha-secret",
    },
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
      "server-only": new URL("./node_modules/server-only/empty.js", import.meta.url).pathname,
    },
  },
});
