// Generates prisma/schema.prod.prisma from prisma/schema.prisma at build time,
// switching the datasource provider to PostgreSQL for production (Vercel).
// Keeping it generated (not hand-maintained) guarantees the two schemas stay in
// sync and avoids any file-encoding/BOM issues.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("prisma/schema.prisma", "utf8");
const out = src.replace('provider = "sqlite"', 'provider = "postgresql"');

if (!out.includes('provider = "postgresql"')) {
  console.error("Could not find the sqlite datasource provider to switch.");
  process.exit(1);
}

// utf8 here writes without a BOM, which Prisma requires.
writeFileSync("prisma/schema.prod.prisma", out, { encoding: "utf8" });
console.log("Generated prisma/schema.prod.prisma (postgresql).");
