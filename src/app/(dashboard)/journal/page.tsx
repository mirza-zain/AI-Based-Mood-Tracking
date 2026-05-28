import Link from "next/link"
import EntryCard from "../../../components/EntryCard"
import NewEntryCard from "../../../components/NewEntryCard"
import { getUserByClerkID } from "../../../../utilis/auth"
import { prisma } from "../../../../utilis/db"
import Question from "../../../components/Question"

const getEntries = async ( ) => {
    const user = await getUserByClerkID()
    if (!user) return []
    const entries = await prisma.journalEntry.findMany({
        where: {
            userId: user.id,
        },
        include: {
            analysis: true,
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
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-8"> 
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Journal</h1>
                <p className="text-sm text-gray-500 mt-1">Record your thoughts, ask questions, and reflect on your days.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <Question />    
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <NewEntryCard />
                {entries.map((entry: any) => (
                    <Link href={`/journal/${entry.id}`} key={entry.id} className="focus:outline-none">
                        <EntryCard entry={entry}/>
                    </Link>
                ))}
            </div>
        </div>
    ) 
}

export default JournalPage