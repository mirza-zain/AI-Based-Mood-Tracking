import { NextResponse } from "next/server"
import { prisma, ensureDatabaseTables } from "../../../../../utilis/db"
import { hashPassword, setSession } from "../../../../../utilis/auth"

export async function POST(request: Request) {
  try {
    // Ensure database tables exist before querying
    await ensureDatabaseTables()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const hashedPassword = hashPassword(password)
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Log the user in
    await setSession(user.id)

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Failed to login",
        details: error?.message || String(error),
      },
      { status: 500 }
    )
  }
}
