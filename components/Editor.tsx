'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAutosave } from "react-autosave"
import { updateEntry, deleteEntry } from "../utilis/api"

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
            const data = await updateEntry(entry.id, _value)
            setAnalysis(data.analysis)
            setIsLoading(false)
        }
    })
    return (
        <div className="w-full h-full grid grid-cols-3">
            <div className="col-span-2">
                {isLoading && <div>...loading</div>}
                <textarea 
                    className="w-full h-full p-8 text-xl outline-none" 
                    title="journalEntry" 
                    value={value} 
                    onChange={e => setValue(e.target.value)} 
                />
            </div>
            <div className="border-l border-black/10">
                <div className="px-6 py-10" style={{backgroundColor: color}}>
                    <h2 className="text-2xl">Analysis</h2>
                </div>
                <div>
                    <ul>
                        {
                            analysisData.map((item) => (
                                <li key={item.name} className="px-2 py-4 flex items-center justify-between border-b border-black/10">
                                    <span className="text-lg font-semibold">{item.name}</span>
                                    <span>{item.value}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="p-4">
                    <button 
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="w-full bg-red-600 px-4 py-2 rounded-lg text-white"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Editor