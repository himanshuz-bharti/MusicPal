import React from 'react'
import type { Song } from '../types'
import { Play,Pause } from 'lucide-react'
import { usePlayerStore } from '../stores/usePlayer';
function PlayButton({song}: {song: Song}) {
    const {setCurrentSong,togglePlay,isPlaying,currentSong,playAlbum} = usePlayerStore();
    const handlePlay = () =>{
        if(currentSong && song._id===currentSong?._id) togglePlay();
        else setCurrentSong(song);
    }
  return (
    <div>
        <button className='bg-green-700 text-white flex items-center gap-2 p-2 mt-2 rounded-lg' onClick={handlePlay}>
          {(isPlaying && currentSong?._id===song._id)?(
            <Pause className='w-4 h-4' />
          ):(
            <Play className='w-4 h-4'/>
          )}
        </button>
    </div>
  )
}

export default PlayButton