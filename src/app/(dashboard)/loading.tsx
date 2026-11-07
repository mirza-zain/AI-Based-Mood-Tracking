export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        <div className="h-4 w-80 bg-gray-100 rounded-md"></div>
      </div>

      {/* Question box skeleton */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-100 rounded-xl"></div>
          <div className="w-24 h-12 bg-blue-100/60 rounded-xl"></div>
        </div>
      </div>

      {/* Cards skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-48 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-spin border-2 border-blue-500 border-t-transparent"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
              <div className="h-3 w-full bg-gray-100 rounded"></div>
              <div className="h-3 w-4/5 bg-gray-100 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

