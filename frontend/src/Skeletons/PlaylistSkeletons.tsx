import React from 'react';
import { Music } from 'lucide-react';

const PlaylistSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Playlist Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer group animate-pulse"
            >
              {/* Playlist Image Skeleton */}
              <div className="w-12 h-12 bg-gray-700 rounded-md flex-shrink-0"></div>
              
              {/* Playlist Info */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Playlist Name */}
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                
                {/* Artist Name */}
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              
              {/* Song Count */}
              <div className="text-right space-y-2">
                <div className="h-3 bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          <div className="h-3 bg-gray-700 rounded w-32 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSkeleton;