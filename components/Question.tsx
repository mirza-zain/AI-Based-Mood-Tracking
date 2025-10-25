'use client'

import { useState } from "react"
import { askQuestion } from "../utilis/api"

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
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                    disabled={loading}
                    onChange={onChange} 
                    value={value} 
                    type="text" 
                    placeholder="Ask a question about your entries..."
                    className="flex-1 border border-gray-300 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button 
                    disabled={loading} 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                    {loading ? 'Asking...' : 'Ask'}
                </button>
            </form>
            {loading && <div className="text-gray-500 text-sm">Searching your entries...</div>}
            {response && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Answer:</p>
                    <p className="text-gray-700 leading-relaxed">{response}</p>
                </div>
            )}
        </div>
    )
}

export default Question