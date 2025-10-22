'use client'

import { useState } from "react"
import { useAutosave } from "react-autosave"
import { updateEntry } from "../utilis/api"

const Editor = ({entry}: {entry: any}) => {
    const [value, setValue] = useState(entry.content)
    const [isLoading, setIsLoading] = useState(false)
    const [analysis, setAnalysis] = useState(entry.analysis)

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
        <div className="h-full w-full overflow-hidden grid grid-cols-3">
            <div className="col-span-2 flex flex-col">
                {isLoading && <div className="bg-yellow-100 text-yellow-800 p-2 text-center">Updating...</div>}
                <textarea className="flex-1 w-full p-6 text-base outline-none border-none resize-none" title="journalEntry" value={value} onChange={e => setValue(e.target.value)} placeholder="Write about your day..." />
            </div>
             <div className="border-l border-black/10">
                <div className="px-5 py-10" style={{backgroundColor: color}}>
                    <h2 className="text-2xl font-semibold">Analysis</h2>
                </div>
                <div>
                    <ul>
                        {
                            analysisData.map((item) => (
                                <li key={item.name} className="px-4 py-4 border-t border-black/10">
                                    <div className="font-semibold text-sm text-gray-600 mb-1">{item.name}</div>
                                    <div className="text-lg font-medium break-words">{item.value}</div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Editor