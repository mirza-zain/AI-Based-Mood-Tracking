import Editor from "../../../../components/Editor"
import { getUserByClerkID } from "../../../../../utilis/auth"
import { prisma } from "../../../../../utilis/db"

const getEntry = async (id: string) => {
    const user = await getUserByClerkID()
    if (!user) {
        throw new Error("User not authenticated")
    }
    const entry = await prisma.journalEntry.findUniqueOrThrow({
        where: {
            userId_id: {
                userId: user.id,
                id,
            }
        },
        
        include: {
            analysis: true,
        }
    })

    return entry
}


const EntryPage = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} = await params
    const entry = await getEntry(id)
   
    return (
        <div className="h-full w-full">
            <Editor entry={entry} />
        </div>
    )
}

export default EntryPage