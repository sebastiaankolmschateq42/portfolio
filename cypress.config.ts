import { defineConfig } from "cypress";
import { config as loadEnv } from "dotenv";
import { SignJWT } from "jose";
import { Client } from "pg";
import react from "@vitejs/plugin-react";

loadEnv({ path: ".env.local", quiet: true });

const TEST_DOMAIN = "cypress.test";

type Role = "USER" | "ADMIN";

async function withDb<T>(run: (db: Client) => Promise<T>): Promise<T> {
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  try {
    return await run(db);
  } finally {
    await db.end();
  }
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on) {
      on("task", {
        resetTestData() {
          return withDb(async (db) => {
            await db.query("DELETE FROM users WHERE email LIKE $1", [`%@${TEST_DOMAIN}`]);
            return null;
          });
        },

        async createSession({ name, role }: { name: string; role: Role }) {
          const userId = await withDb(async (db) => {
            const { rows } = await db.query(
              `INSERT INTO users (id, email, display_name, password_hash, role, email_verified_at)
               VALUES (gen_random_uuid(), $1, $2, 'not-used', $3, now())
               RETURNING id`,
              [`${name.toLowerCase()}@${TEST_DOMAIN}`, name, role],
            );
            return rows[0].id as string;
          });

          const secret = process.env.JWT_SECRET;
          if (!secret) throw new Error("JWT_SECRET is not set");
          return new SignJWT({ role })
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(userId)
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(new TextEncoder().encode(secret));
        },
      });
    },
  },

  component: {
    specPattern: "cypress/component/**/*.cy.tsx",
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        plugins: [react()],
        resolve: { alias: { "@": new URL(".", import.meta.url).pathname } },
      },
    },
  },
});
