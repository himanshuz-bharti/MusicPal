export const LoadingFriendSkeleton = () => {
  return (
    <div className="space-y-3 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-1">
            <div className="h-3 w-24 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-2 w-16 bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}