import { auth } from "@clerk/nextjs/server"
import { prisma } from "./db"

export const getUserByClerkID = async () => {
    const {userId} = await auth()

    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId as string,
        }
    })

    return user
}