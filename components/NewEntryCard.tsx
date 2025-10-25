'use client'

import { useRouter } from "next/navigation"
import { createNewEntry } from "../utilis/api"

const NewEntryCard = () => {
    const router = useRouter()
    
    const handleClick = async () => {
        const data = await createNewEntry()
        router.push(`/journal/${data.id}`)
    }
    
    return (
        <div 
            onClick={handleClick}
            className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
        >
            <div className="px-4 py-5">
                <span className="text-3xl">+</span>
            </div>
            <div className="px-4 py-5">
                <span className="text-lg">New Entry</span>
            </div>
        </div>
    )
}

export default NewEntryCard