export const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="relative">
        {/* Header Skeleton */}
        <div className="h-96 bg-gradient-to-b from-gray-700/50 to-transparent">
          <div className="absolute bottom-8 left-8 flex items-end gap-6">
            <div className="w-60 h-60 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-4 w-16 bg-gray-600 rounded animate-pulse"></div>
              <div className="h-12 w-80 bg-gray-600 rounded animate-pulse"></div>
              <div className="h-6 w-60 bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Songs Skeleton */}
        <div className="px-8 py-6 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3">
              <div className="w-6 h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-gray-600 rounded animate-pulse"></div>
              </div>
              <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};