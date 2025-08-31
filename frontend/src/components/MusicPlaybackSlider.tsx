import React, { useState, useEffect, use } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Volume2, Heart, ChevronsLeft, ChevronsRight, FolderPlus, X } from 'lucide-react';

import { usePlayerStore } from '../stores/usePlayer';
import { useMusicStore } from '../stores/useMusicStore';
import type {  Album } from '../types';
import AddToAlbumModal from './AlbumModal';

function MusicPlayer({ isPlaying }: { isPlaying: boolean }) {
  const [localVolume, setLocalVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate,setplaybackRate] = useState(1);
  const [showAlbumModal, setShowAlbumModal] = useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null); 
  const [currentIsLiked, setCurrentIsLiked] = useState(false); 
  const [loadingLiked,setloadingLiked] = useState(false);

  const incrementPlayBackRate = () =>{
    const newspeed = Math.min(playbackRate+0.25,2);
    setplaybackRate(newspeed);
    if(audioRef.current){
      audioRef.current.playbackRate=newspeed;
    }
  }
  const decrementPlayBackRate = () =>{
    const newspeed = Math.max(playbackRate-0.25,0.25);
    setplaybackRate(newspeed);
    if(audioRef.current){
      audioRef.current.playbackRate=newspeed;
    }
  }
  const { currentSong, togglePlay, playNext, playPrev, playAlbum } = usePlayerStore();
  const {togglelikeSong, likedSongs, fetchAlbums, albums,addSongtoAlbum} = useMusicStore();

  useEffect(() => {
    audioRef.current = document.querySelector('audio');
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleSongEnd = () => {
      usePlayerStore.setState({ isPlaying: false });
    }
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleSongEnd);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleSongEnd);
    }
  }, [currentSong])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const value = parseFloat(e.target.value);
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }

  useEffect(()=>{
    if(currentSong && likedSongs) {
      const preliked = likedSongs.some((s)=>s._id===currentSong._id);
      setCurrentIsLiked(preliked);
    } else {
      setCurrentIsLiked(false);
    }
  },[currentSong, likedSongs]);

  const handleLike = async (songId:string | undefined) => {
    if(!songId || loadingLiked) return;
    setloadingLiked(true);
    try {
      await togglelikeSong(songId);
      setCurrentIsLiked(!currentIsLiked);
    } catch (error) {
      console.error('Error toggling like',error);
    } finally{
      setloadingLiked(false);
    }
  }

  const handleOpenAlbumModal = () => {
    try {
      // Fetch albums when modal opens
      setShowAlbumModal(true);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  }

  const handleRepeat = () => {
    // Add repeat logic here
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLocalVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  }

  const getProgressPercentage = () => {
    if (!duration || duration === 0) return 0;
    return (currentTime / duration) * 100;
  }

  const getVolumePercentage = () => {
    return localVolume;
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // -- NEW: focus & scroll-lock & ESC-to-close for modal --
  useEffect(() => {
    if (!showAlbumModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // prevent background scroll

    // focus modal for accessibility
    setTimeout(() => {
      modalRef.current?.focus();
    }, 0);

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAlbumModal(false);
      }
    };
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [showAlbumModal]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-lg border-t border-gray-800">
        {/* Left Section - Currently Playing */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img 
            src={currentSong?.imageUrl} 
            alt={currentSong?.title || 'Album cover'}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <h4 className="text-white text-sm font-medium truncate">{currentSong?.title}</h4>
            <p className="text-gray-400 text-xs truncate">{currentSong?.artist}</p>
          </div>
          <button 
            onClick={()=>handleLike(currentSong?._id)}
            className={`p-2 rounded-full hover:bg-gray-800 transition-colors ${
              currentIsLiked ? 'text-green-500' : 'text-gray-400'
            }`}
            aria-label={currentIsLiked ? 'Unlike song' : 'Like song'}
          >
            <Heart className={`w-4 h-4 ${currentIsLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
          <div className="relative inline-block">
            <button
              onClick={()=>handleOpenAlbumModal()}
              aria-label="Add to album"
              className="peer p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400"
              type="button"
            >
          <FolderPlus className="w-4 h-4" />
            </button>
         <span
           className="pointer-events-none absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap
                 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-sm opacity-0
                 transition-opacity duration-150
                 peer-hover:opacity-100 peer-focus:opacity-100"
             role="status"
             aria-hidden="true"
        >
          Add to album
         </span>
         </div>

            <button 
              onClick={playPrev}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300"
              aria-label="Previous song"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
            onClick = {decrementPlayBackRate}
            className='p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300'>
              <ChevronsLeft className='w-5 h-5'/>
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-3 hover:scale-105 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            
            <button onClick={incrementPlayBackRate} className='p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300'>
              <ChevronsRight className='w-5 h-5'/>
            </button>

            <button 
              onClick={playNext}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300"
              aria-label="Next song"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button 
              className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400"
              onClick={()=>handleRepeat()}
            >
              <Repeat className='w-4 h-4'/>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                value={currentTime}
                max={duration || 100}
                step={1}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #1db954 0%, #1db954 ${getProgressPercentage()}%, #4a5568 ${getProgressPercentage()}%, #4a5568 100%)`
                }}
                aria-label="Song progress"
              />
            </div>
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Section - Volume Control */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <div className="w-20 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={localVolume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${getVolumePercentage()}%, #4a5568 ${getVolumePercentage()}%, #4a5568 100%)`
              }}
              aria-label="Volume"
            />
          </div>
        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 12px;
            height: 12px;
            background: #1db954;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
          }
          
          .slider:hover::-webkit-slider-thumb {
            opacity: 1;
          }
          
          .slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: #1db954;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            opacity: 0;
            transition: opacity 0.2s;
          }
          
          .slider:hover::-moz-range-thumb {
            opacity: 1;
          }
        `}</style>
      </div>

       <AddToAlbumModal 
        isOpen={showAlbumModal}
        onClose={() => setShowAlbumModal(false)}
        currentSong={currentSong}
      />
    </>
  );
};

export default MusicPlayer;
