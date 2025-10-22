import { NextResponse } from "next/server"
import { getUserByClerkID } from "../../../../utilis/auth"
import { prisma } from "../../../../utilis/db"
import { revalidatePath } from "next/cache"
import { analyze } from "../../../../utilis/ai"

export const POST = async (req: Request) => {
    const user = await getUserByClerkID()
    
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    // Get content from request body
    let content = 'Write about your day!'
    
    try {
        const text = await req.text()
        if (text) {
            const body = JSON.parse(text)
            if (body.content) {
                content = body.content
            }
        }
    } catch (error) {
        console.log('Error parsing body, using default')
    }
    
    const entry = await prisma.journalEntry.create({
        data: {
            userId: user.id,
            content: content
        }
    })

    try {
        const analysis = await analyze(entry.content)
        await prisma.analysis.create({
            data: {
                entryId: entry.id,
                ...analysis
            }
        })
    } catch (error) {
        console.error('Failed to analyze:', error)
    }

    revalidatePath('/journal')

    return NextResponse.json({data: entry})
}