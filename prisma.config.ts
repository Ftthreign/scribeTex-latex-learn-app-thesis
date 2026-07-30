import { defineConfig } from "@prisma/config";

import { loadEnvFile } from "node:process";
try {
  loadEnvFile();
} catch (e) {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "bun run ./prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
