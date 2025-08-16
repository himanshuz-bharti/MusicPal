import { useMusicStore } from '../stores/useMusicStore';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Clock, Heart, MoreHorizontal, Shuffle,Music,Pause } from 'lucide-react';
import type { Song, Album } from '../types';
import { LoadingSkeleton } from '../Skeletons/AlbumSkeleton';
import { usePlayerStore } from '../stores/usePlayer';
import MusicPlayer from '../components/MusicPlaybackSlider';

interface SongItemProps {
  song: Song;
  index: number;
  onPlay: (index:number) => void;
  currentSong : Song | null;
  isPlaying : boolean;
  togglePlay:()=>void;
}
const songDuration = (duration:number) =>{
    const minutes = Math.floor(duration/60);
    const remaining_seconds = duration%60;
    const dis_min = minutes.toString().padStart(2,'0');
    const dis_sec = remaining_seconds.toString().padStart(2,'0');
    return `${dis_min}:${dis_sec}`
   }

export const SongItem: React.FC<SongItemProps> = ({ song, index, onPlay,currentSong,isPlaying,togglePlay }) => {
    const isCurrentSong = currentSong?._id === song._id;

  return (
    <div className="group flex items-center gap-4 px-6 py-3 hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer">
      {/* Track Number / Play Button */}
      <div className="w-6 flex items-center justify-center">
        {!(isCurrentSong && isPlaying) && <span className="text-gray-400 text-sm group-hover:hidden">
          {(index + 1).toString().padStart(2, '0')}
        </span>}
        {isCurrentSong && isPlaying ? (
            <div className='w-4 h-4 mr-2 text-green-500 '>
              <Music onClick={togglePlay}/>
            </div>
        ):(
            <Play 
          className="w-4 h-4 text-white hidden group-hover:block hover:scale-110 transition-transform"
          onClick={() => onPlay(index)}
        />
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
          {song.title}
        </h4>
        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
      </div>
     
      {/* Year - this is now where the date will appear */}
      <div className="w-20 text-center text-gray-400 text-sm">
        {song.createdAt.split("T")[0]}
      </div>

      {/* Duration (Clock icon section) */}
      <div className="w-16 text-center text-gray-400 text-sm">
       {songDuration(song.duration)}
      </div>

      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-400" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};



function AlbumPage() {
  const { id } = useParams();
  const { currentAlbum, fetchAlbumById, isLoading } = useMusicStore();
  const {currentSong,playAlbum,togglePlay,isPlaying} = usePlayerStore();
  const [showPlayer,setshowPlayer] = useState(false);
  useEffect(()=>{
    if(isPlaying){
      setshowPlayer(true);
    }
    else{
      const timer = setTimeout(()=>{
        setshowPlayer(false);
      },3000);
      return () =>clearTimeout(timer);
    }
  },[isPlaying])

  useEffect(() => {
    if (id) fetchAlbumById(id);
  }, [id,fetchAlbumById]);

  const handlePlaySong = (index:number) => {
    if(!currentAlbum) return;
    playAlbum(currentAlbum?.songs,index);
    // Add your play logic here
  };
  
  const handlePlayAll = () => {
    if(!currentAlbum) return;
    const isCurrentAlbumPlaying = currentAlbum.songs.some((song)=>song?._id===currentSong?._id);
    if(isCurrentAlbumPlaying) togglePlay();
    else{
        playAlbum(currentAlbum?.songs,0);
    }
  };

  const handleShuffle = () => {
    if(!currentAlbum) return;
    for (let i = currentAlbum?.songs?.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentAlbum.songs[i], currentAlbum.songs[j]] = [currentAlbum.songs[j], currentAlbum.songs[i]];
  }
    if(isPlaying){
        playAlbum(currentAlbum?.songs,0);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!currentAlbum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Album not found</h2>
          <p className="text-gray-400">The requested album could not be loaded.</p>
        </div>
      </div>
    );
  }


  const formatTotalDuration = (songs:Song[]) => {
    const initialseconds = 0;
    const totalseconds = songs.reduce((acc,idx)=>acc+idx.duration,initialseconds);
    const totalminutes = Math.floor(totalseconds/60);
    const remaining_seconds = totalseconds%60;
    const dis_min = totalminutes.toString();
    const dis_sec = remaining_seconds.toString().padStart(2,'0');
    return `${dis_min}:${dis_sec}`;
  };
   const getRandomGradient = () => {
  const gradients = [
    'from-purple-600/80 via-purple-800/60',
    'from-violet-600/80 via-purple-700/60', 
    'from-fuchsia-600/80 via-purple-800/60',
    'from-indigo-600/80 via-purple-700/60',
    'from-pink-600/80 via-purple-800/60',
    'from-purple-500/80 via-violet-700/60',
    'from-magenta-600/80 via-purple-700/60'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative">
       <div className={`h-96 bg-gradient-to-b ${getRandomGradient()} to-black`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 flex items-end gap-6 z-10">
            {/* Album Cover */}
            <div className="relative group">
              <img
                src={currentAlbum.imageUrl as string}
                alt={currentAlbum.name as string}
                className="w-60 h-60 object-cover rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Album Info */}
            <div className="space-y-4 text-white">
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                Album
              </span>
              <h1 className="text-5xl font-bold leading-tight">
                {currentAlbum.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="font-medium">{currentAlbum.artist}</span>
                <span>•</span>
                <span>{currentAlbum?.releaseYear}</span>
                <span>•</span>
                <span>{currentAlbum.songs?.length || 0} songs</span>
                <span>•</span>
                { <span>{formatTotalDuration(currentAlbum.songs)}</span> }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-6 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          className="flex items-center gap-3 bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
        >
          {(isPlaying && currentAlbum.songs.some((song)=>song._id===currentSong?._id))?
          (
            <Pause className="w-5 h-5 fill-current">Pause</Pause>
         
          ):(
            <span>
                <Play className='w-4 h-4 fill-current'>Play</Play>
            </span>
          )}
        </button>
        
        <button
          onClick={()=>handleShuffle()}
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 border border-white/20"
        >
          <Shuffle className="w-5 h-5" />
          Shuffle
        </button>

        <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
          <Heart className="w-6 h-6 text-gray-400 hover:text-red-400" />
        </button>

        <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
          <MoreHorizontal className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Songs List */}
      <div className="px-8 pb-8">
        {/* Header - Updated to show Year and Duration columns separately */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-white/10 text-gray-400 text-sm font-medium">
          <div className="w-6 text-center">#</div>
          <div className="flex-1">Title</div>
          <div className="w-20 text-center">Year</div>
          <div className="w-17 text-center">
            <Clock className="w-6 h-4 mx-auto" />
          </div>
          <div className="w-20"></div>
        </div>

        {/* Song Items */}
        <div className="space-y-1 mt-4">
          {currentAlbum.songs?.map((song, index) => (
            <SongItem
              key={index}
              song={song}
              index={index}
              onPlay={handlePlaySong}
              currentSong={currentSong}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
            />
          )) || (
            <div className="text-center text-gray-400 py-12">
              <p>No songs available in this album.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Spacing */}
                {showPlayer && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
            isPlaying 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0'
          }`}
        >
          <MusicPlayer isPlaying={isPlaying} />
        </div>
      )}
    </div>
  );
}

export default AlbumPage;