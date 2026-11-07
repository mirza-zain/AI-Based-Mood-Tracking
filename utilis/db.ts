import { PrismaClient } from "@prisma/client"

/**
 * Normalizes connection URL for Neon PostgreSQL:
 * - Converts postgres:// to postgresql://
 * - Enforces sslmode=require (required by Neon)
 * - Appends pgbouncer=true if connecting via Neon pooler (-pooler)
 */
export function normalizeDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  let u = url.trim()

  // Remove surrounding quotes if accidentally included in .env
  if ((u.startsWith('"') && u.endsWith('"')) || (u.startsWith("'") && u.endsWith("'"))) {
    u = u.slice(1, -1).trim()
  }

  // Ensure protocol is postgresql://
  if (u.startsWith("postgres://")) {
    u = u.replace(/^postgres:\/\//, "postgresql://")
  }

  // Neon pooled connection handling
  if (u.includes("-pooler")) {
    if (!u.includes("sslmode=")) {
      u += u.includes("?") ? "&sslmode=require" : "?sslmode=require"
    }
    if (!u.includes("pgbouncer=")) {
      u += u.includes("?") ? "&pgbouncer=true" : "?pgbouncer=true"
    }
  } else if (!u.includes("sslmode=")) {
    u += u.includes("?") ? "&sslmode=require" : "?sslmode=require"
  }

  return u
}

// Check all possible environment variable names used by Neon, Vercel, or custom setups
const rawDatabaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.NEON_URL ||
  process.env.NEON_KEY ||
  process.env.DATABASE_POSTGRES_URL

const resolvedDatabaseUrl = normalizeDatabaseUrl(rawDatabaseUrl)

// Ensure process.env.DATABASE_URL is set for Prisma runtime
if (resolvedDatabaseUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedDatabaseUrl
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(resolvedDatabaseUrl ? { datasourceUrl: resolvedDatabaseUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

let tablesChecked = false

/**
 * Ensures that the required database tables exist in Neon PostgreSQL.
 * If tables are missing (e.g. fresh database without manual db push),
 * this automatically initializes them without failing the user request.
 */
export async function ensureDatabaseTables() {
  if (tablesChecked) return

  try {
    // Quick test query to check if User table exists
    await prisma.$queryRawUnsafe('SELECT 1 FROM "User" LIMIT 1')
    tablesChecked = true
    return
  } catch (err: any) {
    console.warn("User table not found or not ready. Auto-initializing Neon schema...")
  }

  try {
    // 1. Create User table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `)

    // 2. Create JournalEntry table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "JournalEntry" (
        "id" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "JournalEntry_userId_id_key" ON "JournalEntry"("userId", "id");
    `)

    // 3. Create Analysis table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Analysis" (
        "id" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "entryId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "mood" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "color" TEXT NOT NULL,
        "negative" BOOLEAN NOT NULL,
        "subject" TEXT NOT NULL,
        "sentimentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
        CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Analysis_entryId_key" ON "Analysis"("entryId");
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Analysis_userId_idx" ON "Analysis"("userId");
    `)

    console.log("✅ Neon database tables verified and initialized successfully.")
    tablesChecked = true
  } catch (initErr) {
    console.error("❌ Failed to automatically initialize database tables:", initErr)
    throw initErr
  }
}
