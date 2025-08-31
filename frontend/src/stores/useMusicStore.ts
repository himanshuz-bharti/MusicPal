import type { Album, Song } from '../types';
import { axiosInstance } from '../lib/axios';
import {create} from 'zustand';
interface MusicStore{
    albums:Album[],
    songs:Song[],
    isLoading:boolean,
    error:any,
    currentAlbum:Album | null,
    madeForYouSongs:Song[],
    featuredSongs:Song[],
    trendingSongs:Song[],
    likedSongs:Song[],
    fetchlikedSongs:()=>Promise<void>,  
    togglelikeSong:(songId:string)=>Promise<void>, 
    fetchAlbums:()=>Promise<void>,
    fetchAlbumById:(id:string)=>Promise<void>,
    fetchMadeforYouSongs:()=>Promise<void>,
    fetchTrendingSongs:()=>Promise<void>,
    fetchFeaturedSongs:()=>Promise<void>,
    createAlbum:(albumName:string,imgFile:File,songId:string)=>Promise<void>,
    deleteAlbum:(albumId:string)=>Promise<void>,
    addSongtoAlbum:(songId:string,albumId:string)=>Promise<void>,
    removeSongFromAlbum:(songId:string,albumId:string)=>Promise<void>,

}
export const useMusicStore = create<MusicStore>((set)=>({
   albums:[],
   songs:[],
   isLoading:false,
   error:null,
   currentAlbum:null,
   madeForYouSongs:[],
   featuredSongs:[],
   trendingSongs:[],
   likedSongs:[],
   fetchlikedSongs:async()=>{
     set({
        isLoading:true,
        error:null,
    })
      try {
        const res = await axiosInstance.get('/user/likedSongs');
        set({
            likedSongs:res.data.likedSongs,
        })
      } catch (error:any) {
        set({
            error:error?.response?.data?.message
        })
      }finally{
          set({
            isLoading:false
          })
        }
   },
   togglelikeSong:async(songId:string)=>{
       try {
        console.log('Song',songId);
        const res = await axiosInstance.post(`/user/togglelikeSong/${songId}`);
        set({
            likedSongs:res.data.likedSongs,
        })
       } catch (error:any) {
           set({
               error:error?.response?.data?.message
           })
       }
   },
   fetchAlbums:async()=>{
    set({
        isLoading:true,
        error:null,
    })
     try {
        const res = await axiosInstance.get('/album');
        set({
            albums:res.data.albums
        })
     } catch (error:any) {
        set({
            error:error?.response?.data?.message
        })
     }finally{
          set({
            isLoading:false
          })
        }
   },
   fetchAlbumById:async(id)=> {
       set({
        isLoading:true,
        error:null,
       })
       try {
        const res = await axiosInstance.get(`/album/${id}`);
        set({
            currentAlbum:res.data.requestedAlbum
        })
       } catch (error:any) {
        set({
            error:error?.response?.data?.message
        })
       } finally{
        set({
            isLoading:false
        })
       }
   },
   fetchMadeforYouSongs:async()=>{
    set({isLoading:true, error:null});
    try {
        const res = await axiosInstance.get('/song/made-for-you');
        set({
            madeForYouSongs:res.data.madeforyouSongs
        })
    } catch (error:any) {
        set({error:error?.response?.data?.message})
    } finally{
        set({isLoading:false})
    }
   },
   fetchFeaturedSongs:async()=>{
     set({isLoading:true, error:null});
    try {
        const res = await axiosInstance.get('/song/featured');
        set({
            featuredSongs:res.data.featuredSongs
        })
    } catch (error:any) {
        set({error:error?.response?.data?.message})
    } finally{
        set({isLoading:false})
    }
   },
   fetchTrendingSongs:async()=>{
      set({isLoading:true, error:null});
    try {
        const res = await axiosInstance.get('/song/trending');
        set({
            trendingSongs:res.data.trendingSongs
        })
    } catch (error:any) {
        set({error:error?.response?.data?.message})
    } finally{
        set({isLoading:false})
    }
   },
   createAlbum:async(albumName:string,imgFile:File,songId:string)=>{
       set({
        isLoading:true,
        error:null,
       })
       try {
        const formdata = new FormData();
        formdata.append('albumName', albumName);
        formdata.append('imageFile', imgFile);
        formdata.append('songId', songId);
        const res = await axiosInstance.post('/album/createAlbum', formdata,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });
        console.log(res);
        set({
            albums:res.data.albums,
        })
       } catch (error:any) {
        set({error:error?.response?.data?.message})
       }finally{
        set({isLoading:false});
       }
   },
   deleteAlbum:async(albumId:string)=>{
      set({
        isLoading:true,
        error:null,
      })
      try {
        const res = await axiosInstance.delete(`/album/${albumId}`);
        set({
            albums:res.data.albums,
        })
      } catch (error:any) {
        set({error:error?.response?.data?.message})
      }finally{
        set({isLoading:false});
      }
   },
   addSongtoAlbum:async(songId:string,albumId:string)=>{
    set({
        isLoading:true,
        error:null,
    })
    try {
        const res = await axiosInstance.post('/album/addSongToAlbum',{songId,albumId});
        set({
            albums:res.data.albums
        })
        
    } catch (error:any) {
        set({error:error?.response?.data?.message})
    }finally{
          set({
            isLoading:false
          })
        }
   },
   removeSongFromAlbum:async(songId:string,albumId:string)=>{
    set({
        isLoading:true,
        error:null,
    })
     try {
        const res = await axiosInstance.post('/album/removeSongFromAlbum',{songId,albumId});
                set({
                currentAlbum:res.data.album
        })
     } catch (error:any) {
        set({error:error?.response?.data?.message})
     }finally{
          set({
            isLoading:false
          })
        }
    }
}))