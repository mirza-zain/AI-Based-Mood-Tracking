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
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

export const getSession = async () => {
  const cookieStore = await cookies()
  const userIdCookie = cookieStore.get("userId")
  return userIdCookie?.value
}

export const clearSession = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("userId")
}

// Retrieves current authenticated user. Keeps name compatibility with existing routes.
export const getUserByClerkID = async () => {
  const userId = await getSession()
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  return user
}