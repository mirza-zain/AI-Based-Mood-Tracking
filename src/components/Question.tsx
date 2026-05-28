'use client'

import { useState } from "react"
import { askQuestion } from "../../utilis/api"

const Question = () => {
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState('')

    const onChange = (e: any) => {
        setValue(e.target.value)
    }
    
    const handleSubmit = async (e: any) => {
        e.preventDefault()

        setLoading(true)
        const answer = await askQuestion(value)
        setResponse(answer)
        setValue('')
        setLoading(false)
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input 
                    disabled={loading}
                    onChange={onChange} 
                    value={value} 
                    type="text" 
                    placeholder="Ask a question about your entries..."
                    className="flex-1 border border-gray-200 px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:bg-gray-50 transition-all placeholder:text-gray-400"
                />
                <button 
                    disabled={loading} 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center min-w-[80px]"
                >
                    {loading ? 'Asking...' : 'Ask'}
                </button>
            </form>
            {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse">
                    <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Searching your entries...</span>
                </div>
            )}
            {response && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Answer</p>
                    <p className="text-gray-700 leading-relaxed text-sm">{response}</p>
                </div>
            )}
        </div>
    )
}

export default Question