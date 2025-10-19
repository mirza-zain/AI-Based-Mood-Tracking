"use client"

import { useState } from "react"
import { useAutosave } from "react-autosave"
import { updateEntry } from "../utilis/api"

const Editor = ({entry}: {entry: {id: string, content: string}}) => {
    const [value, setValue] = useState(entry.content)
    const [isLoading, setIsLoading] = useState(false)
    useAutosave({
        data: value,
        onSave: async (_value) => {
            setIsLoading(true)
            const update = await updateEntry(entry.id, _value)
            setIsLoading(false)
        }
    })
    return (
        <div className="h-full w-full overflow-hidden">
            {isLoading && <div>....Loading</div>}
            <textarea className="w-full h-full p-8 text-xl outline-none" title="journalEntry" value={value} onChange={e => setValue(e.target.value)} />
        </div>
    )
}

export default Editor