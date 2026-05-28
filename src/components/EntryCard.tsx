const EntryCard = ({ entry }: { entry: any }) => {
  const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  
  const summary = entry.analysis?.summary || "No summary available."
  const mood = entry.analysis?.mood || "No mood"
  const color = entry.analysis?.color || "#cbd5e1"

  return (
    <div className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200/80 transition-all duration-200 flex flex-col justify-between h-48">
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {date}
        </div>
        <p className="text-sm font-medium text-gray-600 line-clamp-3 leading-relaxed">
          {summary}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div
          className="w-2.5 h-2.5 rounded-full shadow-sm"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
        <span className="text-xs font-bold text-gray-800 capitalize tracking-wide">
          {mood}
        </span>
      </div>
    </div>
  )
}

export default EntryCard