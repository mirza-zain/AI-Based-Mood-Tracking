const EntryCard = ({entry}: {entry: any}) => {
    const date = new Date(entry.createdAt).toDateString()
    const summary = entry.analysis?.summary || 'No summary'
    const mood = entry.analysis?.mood || 'No mood'
    
    return (
        <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5">{date}</div>
            <div className="px-4 py-5">{summary}</div>
            <div className="px-4 py-5">{mood}</div>
        </div>
    )
}

export default EntryCard