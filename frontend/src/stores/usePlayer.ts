import type { Song } from '../types';
import {create} from 'zustand';
interface PlayStore{
    currentSong:Song | null,
    isPlaying:boolean,
    queue:Song[],
    curridx:number,
    initializeQueue:(songs:Song[])=>void,
    playAlbum:(songs:Song[],startIndex?:number)=>void,
    setCurrentSong:(song:Song | null)=>void,
    togglePlay:()=>void,
    playNext:()=>void,
    playPrev:()=>void
}
export const usePlayerStore = create<PlayStore>((set,get)=>({
    currentSong:null,
    isPlaying:false,
    queue:[],
    curridx:-1,
    initializeQueue:(songs)=>{
        set({
            queue:songs,
            currentSong:get().currentSong ||  songs[0],
            curridx:get().curridx===-1?0:get().curridx,
        })
    },
    playAlbum:(songs,startIndex=0)=>{
        if(songs.length==0) return;
        set({
            queue:songs,
            currentSong:songs[startIndex],
            curridx:startIndex,
            isPlaying:true,
        })
    },
    setCurrentSong:(song)=>{
        if(!song) return;
        const songindex = get().queue.findIndex((val)=>val._id===song._id);
        set({
            currentSong:song,
            curridx:songindex!==-1?songindex:get().curridx,
            isPlaying:true,

        })
    },
    togglePlay:()=>{
        const playStatus=get().isPlaying;
        set({
            isPlaying:!playStatus,
        })

    },
    playNext:()=>{
       const currentindex=get().curridx;
       const queue=get().queue;
       if(currentindex+1>=queue.length){
        set({isPlaying:false})
       }
       else{
         set({
         currentSong:queue[currentindex+1],
         curridx:currentindex+1,
         isPlaying:true,
        })
       }
    },
    playPrev:()=>{
       const currentindex=get().curridx;
       const queue=get().queue;
       if(currentindex-1<0){
        set({isPlaying:false});
       }
       else{
         set({
        currentSong:queue[currentindex-1],
        curridx:currentindex-1,
        isPlaying:true
        })
       }
    }
}))