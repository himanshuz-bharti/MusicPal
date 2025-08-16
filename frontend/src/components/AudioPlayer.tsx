import { usePlayerStore } from '../stores/usePlayer';
import React, { useEffect, useRef } from 'react'

function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongref = useRef<string | null>(null);

    const {currentSong,isPlaying,playNext} = usePlayerStore();

    useEffect(()=>{
       if(isPlaying) audioRef.current?.play();
       else audioRef.current?.pause();
    },[isPlaying]);

    // useEffect(()=>{
    //   const audio = audioRef.current;
    //   if(!audio) return;
    //   const handletimeUpdate = () =>{
    //      setcurrentTime(audio.currentTime);
    //   }
    //   audio?.addEventListener('timeupdate',handletimeUpdate);
    //   return ()=>audio.removeEventListener('timeupdate',handletimeUpdate);
    // },[setcurrentTime])

    useEffect(()=>{
      const audio = audioRef.current;
      const handleSongEnd =()=>{
        playNext();
      }
      audio?.addEventListener('ended',handleSongEnd);

      return ()=>audio?.removeEventListener('ended',handleSongEnd);
    },[playNext]);

    useEffect(()=>{
        if(!audioRef.current || !currentSong) return;
      const audio = audioRef.current;
      const isSongChanged = prevSongref.current !== currentSong?.audioUrl;
      if(isSongChanged){
        audio.src = currentSong?.audioUrl;
        audio.currentTime=0;
        prevSongref.current = currentSong?.audioUrl;
        if(isPlaying) audio.play();
      }
    },[currentSong,isPlaying]);

  return (
    <audio ref={audioRef}/>
  )
}

export default AudioPlayer