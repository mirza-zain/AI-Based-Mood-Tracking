'use client'

import { useRouter } from "next/navigation"
import { createNewEntry } from "../../utilis/api"

const NewEntryCard = () => {
  const router = useRouter()
  
  const handleClick = async () => {
    const data = await createNewEntry()
    router.push(`/journal/${data.id}`)
  }
  
  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-500/50 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center h-48 text-center p-6"
    >
      <div className="w-12 h-12 rounded-full bg-white border border-gray-200/80 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 group-hover:border-blue-500/20 group-hover:bg-blue-50 transition-all duration-200 text-gray-400 group-hover:text-blue-500">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
        New Journal Entry
      </span>
    </div>
  )
}

export default NewEntryCard