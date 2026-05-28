'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAutosave } from "react-autosave"
import { updateEntry, deleteEntry } from "../../utilis/api"

const Editor = ({entry}: {entry: any}) => {
    const router = useRouter()
    const [value, setValue] = useState(entry.content)
    const [isLoading, setIsLoading] = useState(false)
    const [analysis, setAnalysis] = useState(entry.analysis)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
            return
        }
        
        setIsLoading(true)
        const success = await deleteEntry(entry.id)
        if (success) {
            router.push('/journal')
        } else {
            alert('Failed to delete entry')
            setIsLoading(false)
        }
    }

    const {mood, summary, color, subject, negative} = analysis || {}
    const analysisData = [
        {name: 'Summary', value: summary},
        {name: 'Subject', value: subject},
        {name: 'Mood', value: mood},
        {name: 'Negative', value: negative ? 'True' : 'False'},
    ]
    useAutosave({
        data: value,
        onSave: async (_value) => {
            setIsLoading(true)
            try {
                const data = await updateEntry(entry.id, _value)
                if (data && data.analysis) {
                    setAnalysis(data.analysis)
                }
            } catch (error) {
                console.error("Error updating entry:", error)
            } finally {
                setIsLoading(false)
            }
        }
    })
    return (
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 overflow-hidden bg-white">
            {/* Editor Canvas */}
            <div className="lg:col-span-2 flex flex-col h-full relative">
                {isLoading && (
                    <div className="absolute top-6 right-8 flex items-center gap-2 text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full animate-pulse shadow-sm z-10">
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                    </div>
                )}
                <textarea 
                    className="flex-1 w-full p-10 text-lg md:text-xl outline-none resize-none bg-gray-50/10 placeholder-gray-400 text-gray-800 leading-relaxed font-sans border-0" 
                    placeholder="Write your heart out..."
                    title="journalEntry" 
                    value={value} 
                    onChange={e => setValue(e.target.value)} 
                />
            </div>

            {/* Analysis Sidebar */}
            <div className="border-t lg:border-t-0 lg:border-l border-gray-200/60 flex flex-col h-full bg-gray-50/30 justify-between">
                <div>
                    <div className="px-8 py-8 border-b border-gray-200/60 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">AI Analysis</h2>
                        <div 
                            className="w-4 h-4 rounded-full shadow-lg ring-4 ring-white animate-pulse"
                            style={{ backgroundColor: color || '#cbd5e1', boxShadow: `0 0 12px ${color || '#cbd5e1'}` }}
                            title={`Mood Color: ${color}`}
                        />
                    </div>
                    <div className="divide-y divide-gray-100 px-8 py-4">
                        {analysisData.map((item) => (
                            <div key={item.name} className="py-5 flex flex-col gap-1.5">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.name}</span>
                                <span className="text-sm font-semibold text-gray-800 leading-relaxed">
                                    {item.name === 'Negative' ? (
                                        item.value === 'True' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">Yes</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">No</span>
                                        )
                                    ) : (
                                        item.value || 'Processing...'
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-8 border-t border-gray-200/60 bg-white">
                    <button 
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="w-full bg-red-50 hover:bg-red-100 active:scale-[0.98] border border-red-200 px-4 py-3 rounded-xl text-red-600 text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Journal Entry
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Editor