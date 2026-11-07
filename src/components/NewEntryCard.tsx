'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createNewEntry } from "../../utilis/api"

const NewEntryCard = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    try {
      const data = await createNewEntry()
      if (data?.id) {
        router.push(`/journal/${data.id}`)
      } else {
        setLoading(false)
      }
    } catch (err) {
      console.error("Failed to create new entry:", err)
      setLoading(false)
    }
  }
  
  return (
    <div 
      onClick={handleClick}
      aria-disabled={loading}
      className={`group rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center h-48 text-center p-6 select-none ${
        loading
          ? "border-blue-300 bg-blue-50/40 cursor-not-allowed pointer-events-none"
          : "cursor-pointer border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-500/50 hover:shadow-md"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm transition-all duration-200 ${
          loading
            ? "bg-blue-100 text-blue-600 border border-blue-200"
            : "bg-white border border-gray-200/80 text-gray-400 group-hover:scale-110 group-hover:border-blue-500/20 group-hover:bg-blue-50 group-hover:text-blue-500"
        }`}
      >
        {loading ? (
          <svg className="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </div>
      <span
        className={`text-sm font-semibold transition-colors ${
          loading ? "text-blue-600 animate-pulse" : "text-gray-500 group-hover:text-blue-600"
        }`}
      >
        {loading ? "Creating entry..." : "New Journal Entry"}
      </span>
    </div>
  )
}

export default NewEntryCard
