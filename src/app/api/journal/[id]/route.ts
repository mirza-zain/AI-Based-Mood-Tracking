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
            user: {
                connect: { id: user.id }
            },
            mood: analysis.mood,
            summary: analysis.summary,
            subject: analysis.subject,
            color: analysis.color,
            negative: analysis.negative,
        },
        update: {
            mood: analysis.mood,
            summary: analysis.summary,
            subject: analysis.subject,
            color: analysis.color,
            negative: analysis.negative,
        },
    })

    return NextResponse.json({data: {...updatedEntry, analysis: updated}})
}

export const DELETE = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params
        const user = await getUserByClerkID()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Verify the entry belongs to the user
        const entry = await prisma.journalEntry.findUnique({
            where: { id }
        })

        if (!entry || entry.userId !== user.id) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 })
        }

        // Delete the analysis first (due to foreign key constraint)
        await prisma.analysis.deleteMany({
            where: {
                entryId: id
            }
        })

        // Then delete the entry
        await prisma.journalEntry.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete error:", error)
        return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }
}