import Editor from "../../../../../components/Editor"
import { getUserByClerkID } from "../../../../../utilis/auth"
import { prisma } from "../../../../../utilis/db"

const getEntry = async (id: string) => {
    const user = await getUserByClerkID()
    const entry = await prisma.journalEntry.findUnique({
        where: {
            userId_id: {
                userId: user.id,
                id,
            }
        }
    })

    return entry
}


const EntryPage = async ({params}: {params: {id: string}}) => {
    const entry = await getEntry(params.id)
    
    if (!entry) {
        return <div>Entry not found</div>
    }
    
    return (
        <div className="h-full w-full">
            <Editor entry={entry} />
        </div>
    )
}

export default EntryPage