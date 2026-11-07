import { cookies } from "next/headers"
import { prisma } from "./db"
import crypto from "crypto"

// Secure password hashing function
export const hashPassword = (password: string) => {
  return crypto.pbkdf2Sync(password, "mood-tracker-salt-12938", 1000, 64, "sha512").toString("hex")
}

// Session cookie helpers
export const setSession = async (userId: string) => {
  const cookieStore = await cookies()
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

export const getSession = async () => {
  try {
    const cookieStore = await cookies()
    const userIdCookie = cookieStore.get("userId")
    return userIdCookie?.value
  } catch (err) {
    return null
  }
}

export const clearSession = async () => {
  const cookieStore = await cookies()
  cookieStore.set("userId", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}

// Retrieves current authenticated user from session
export const getCurrentUser = async () => {
  const userId = await getSession()
  if (!userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    return user
  } catch (error) {
    console.error("Error retrieving current user:", error)
    return null
  }
}

export const getUser = getCurrentUser
