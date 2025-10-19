import { Param } from "@prisma/client/runtime/library"
import { getUserByClerkID } from "../../../../../utilis/auth"
import { prisma } from "../../../../../utilis/db"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, {params}: {params: {id: string}}) => {
    const {content} = await request.json()
    const user = await getUserByClerkID()
    const updatedEntry = await prisma.journalEntry.update({
        where: {
            userId_id: {
                userId: user.id,
                id: params.id,
            },
        },
        data: {
            content,
        }
    })
    return NextResponse.json({data: updatedEntry})
}