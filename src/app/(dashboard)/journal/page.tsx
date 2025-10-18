import EntryCard from "../../../../components/EntryCard"
import NewEntryCard from "../../../../components/NewEntryCard"
import { getUserByClerkID } from "../../../../utilis/auth"
import { prisma } from "../../../../utilis/db"

const getEntries = async ( ) => {
    const user = await getUserByClerkID()
    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })
    return entries
}

const JournalPage = async () => {
    const entries = await getEntries()
    return (
        <div className="p-10 bg-zinc-400/10"> 
            <h2 className="text-3xl mb-5">Journal</h2>
            <div className="grid grid-cols-3 gap-4">
                <NewEntryCard />
                {entries.map((entry) => (
                    <EntryCard key={entry.id} entry={entry}/>
                ))}
            </div>
        </div>
    ) 
}

export default JournalPage