import React, { useEffect, useState } from 'react';
import { Home, MessageCircle, Music, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import PlaylistSkeleton from '../Skeletons/PlaylistSkeletons';
import { useMusicStore } from '../stores/useMusicStore';
import type { Album } from '../types';
import { usePlayerStore } from '../stores/usePlayer';
import { Heart, ChevronDown, ChevronRight } from 'lucide-react';
import type { Song } from '../types';

interface NavigationButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

interface AlbumItemProps {
  album: Album;
  onClick: () => void;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  icon, 
  label, 
  isActive = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

const LikedSongsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { likedSongs, fetchlikedSongs, isLoading } = useMusicStore();
  const { currentSong, playAlbum, togglePlay, isPlaying } = usePlayerStore();
  const navigate = useNavigate();

  // FIXED: Only fetch liked songs once when component mounts, not every time dropdown opens
  useEffect(() => {
    // Only fetch if we don't already have liked songs data
    if (!likedSongs || likedSongs.length === 0) {
      fetchlikedSongs();
    }
  }, []); // Empty dependency array - only run once on mount

  const handleSongClick = (song: Song) => {
    if (!song) return;
    if (isPlaying && currentSong?._id === song._id) {
      togglePlay();
    } else {
      playAlbum([song], 0);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-800"
      >
        <Heart className="w-5 h-5" />
        <span className="font-medium flex-1">Liked Songs</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-1 ml-4 border-l border-gray-700 pl-4 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="py-4 text-center text-gray-500 text-sm">
              Loading liked songs...
            </div>
          ) : (likedSongs && likedSongs.length > 0) ? (
            <>
              <div className="space-y-1 py-2">
                {likedSongs.slice(0, 5).map((song, index) => (
                  <div key={song._id} className='flex flex-row gap-3 items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors'>
                    <img src={song.imageUrl} alt={song.title} className='w-10 h-10 rounded object-cover flex-shrink-0'></img>
                    <div className='flex flex-col flex-1 min-w-0'>
                      <h4 className='text-white text-sm font-medium truncate'>{song.title}</h4>
                      <p className='text-gray-400 text-xs truncate'>{song.artist}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSongClick(song);
                      }}
                      className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white flex-shrink-0"
                      aria-label={`Play ${song.title}`}
                    >
                      {isPlaying && currentSong?._id === song._id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-4 text-center text-gray-500 text-sm">
              No liked songs yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AlbumItem: React.FC<AlbumItemProps> = ({ album, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 group"
    >
      <div className="relative w-12 h-12 flex-shrink-0">
        <img
          src={album.imageUrl}
          alt={album.name}
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-md transition-all duration-200 flex items-center justify-center">
          <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{album.name}</h4>
        <p className="text-gray-400 text-sm truncate">{album?.artist}</p>
      </div>
      
      <div className="text-gray-500 text-xs">
        {album?.releaseYear}
      </div>
    </div>
  );
};

export default function LeftSidebar() {
  const navigate = useNavigate();
  const { songs, albums, fetchAlbums, isLoading } = useMusicStore();
  
  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const handleAlbumClick = (album: any) => {
    navigate(`/album/${album._id}`)
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col border-r border-gray-800">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Navigation Section */}
        <div className="p-6 border-b border-gray-800">
          <div className="space-y-2">
            <NavigationButton
              icon={<Home className="w-5 h-5" />}
              label="Home"
              isActive={false}
              onClick={() => handleNavigation('/UserHome')}
            />
            <SignedIn>
              <NavigationButton
                icon={<MessageCircle className="w-5 h-5" />}
                label="Messages"
                isActive={false}
                onClick={() => handleNavigation('/messages')}
              />
              <LikedSongsDropdown />
            </SignedIn>
          </div>
        </div>

        {/* Albums Section */}
        <div className="flex flex-col">
          {/* Albums Header */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-200">Albums</h3>
            </div>
          </div>

          {/* Album Items */}
          <div className="min-h-0">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              <div className="p-4 space-y-1">
                {albums && albums.length > 0 ? (
                  albums.map((album) => (
                    <AlbumItem
                      key={album._id}
                      album={album}
                      onClick={() => handleAlbumClick(album)}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No albums found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
        <div className="text-xs text-gray-500 text-center">
          {albums ? albums.length : 0} albums
        </div>
      </div>
    </div>
  );
};