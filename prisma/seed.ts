import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const displayName = process.env.ADMIN_DISPLAY_NAME?.trim() || "Admin";

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin account.");
  process.exit(1);
}
if (password.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const passwordHash = await bcrypt.hash(password, 12);

// Creates the admin, or makes an existing account with this address the admin.
await prisma.user.upsert({
  where: { email },
  create: { email, displayName, passwordHash, role: "ADMIN", emailVerifiedAt: new Date() },
  update: { displayName, passwordHash, role: "ADMIN", emailVerifiedAt: new Date() },
});

console.log(`Admin account ready: ${email}`);
await prisma.$disconnect();
