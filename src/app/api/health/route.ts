import { NextResponse } from "next/server"
import { prisma, ensureDatabaseTables } from "../../../../utilis/db"

export async function GET() {
  const envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
    NEON_URL: !!process.env.NEON_URL,
    NEON_KEY: !!process.env.NEON_KEY,
  }

  const activeVar = Object.keys(envVars).find((k) => envVars[k as keyof typeof envVars])

  if (!activeVar) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: "No database connection string found in environment variables.",
        checkedVariables: Object.keys(envVars),
        suggestion:
          "Please add DATABASE_URL (or POSTGRES_PRISMA_URL / NEON_DATABASE_URL) to your Vercel Project Settings > Environment Variables.",
      },
      { status: 500 }
    )
  }

  try {
    // 1. Ensure schema/tables are ready
    await ensureDatabaseTables()

    // 2. Test ping query
    await prisma.$queryRawUnsafe("SELECT 1 as ping")

    // 3. Test user count query
    const userCount = await prisma.user.count()

    return NextResponse.json({
      status: "ok",
      database: "connected",
      detectedVariable: activeVar,
      tablesReady: true,
      registeredUsers: userCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        database: "connection_failed",
        detectedVariable: activeVar,
        error: error?.message || String(error),
        code: error?.code,
      },
      { status: 500 }
    )
  }
}

