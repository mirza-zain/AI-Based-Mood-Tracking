import { NextResponse } from "next/server"
import { getUserByClerkID } from "../../../../utilis/auth"
import { prisma } from "../../../../utilis/db"
import { qa } from "../../../../utilis/ai"

export const POST = async (request: Request) => {
    const { question } = await request.json()
    const user = await getUserByClerkID()

    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user?.id,
        },
        select: {
            id: true,
            content: true,
            createdAt: true
        }
    })

    const answer = await qa(question, entries)

    return NextResponse.json({data: answer})
}