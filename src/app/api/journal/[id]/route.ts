import { revalidatePath } from "next/cache"
import { analyze } from "../../../../../utilis/ai"
import { getUserByClerkID } from "../../../../../utilis/auth"
import { prisma } from "../../../../../utilis/db"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params
    const {content} = await request.json()
    const user = await getUserByClerkID()
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const updatedEntry = await prisma.journalEntry.update({
        where: {
            userId_id: {
                userId: user.id,
                id: id,
            },
        },
        data: {
            content,
        }
    })
    
    const analysis = await analyze(updatedEntry.content)

    const updated = await prisma.analysis.upsert({
        where: {
            entryId: updatedEntry.id,
        },
        create: {
            entryId: updatedEntry.id,
            ...analysis
        },
        update: {
            ...analysis
        },
    })

    return NextResponse.json({data: {...updatedEntry, analysis: updated}})
}