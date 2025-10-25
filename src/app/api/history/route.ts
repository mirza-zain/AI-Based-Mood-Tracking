import { NextResponse } from "next/server"
import { getUserByClerkID } from "../../../../utilis/auth"
import { prisma } from "../../../../utilis/db"

export const GET = async () => {
    try {
        const user = await getUserByClerkID()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const entries = await prisma.journalEntry.findMany({
            where: {
                userId: user.id,
            },
            include: {
                analysis: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        // Transform data for the chart
        const chartData = entries.map((entry: any, index: number) => ({
            name: entry.analysis?.subject || `Entry ${index + 1}`,
            mood: entry.analysis?.mood || 'unknown',
            date: entry.createdAt,
            summary: entry.analysis?.summary || '',
            color: entry.analysis?.color || '#808080',
            content: entry.content,
        }))

        return NextResponse.json({ data: chartData })
    } catch (error) {
        console.error('Error fetching history:', error)
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }
}
