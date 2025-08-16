import { axiosInstance } from "../lib/axios";
import {create} from "zustand";

interface ChatStore{
    users:any[],
    isLoading:boolean,
    error:any,
    fetchusers:()=>Promise<void>
}
export const useChatStore = create<ChatStore>((set)=>({
    users:[],
    isLoading:false,
    error:null,
    fetchusers:async()=>{
        set({isLoading:true})
        try {
            const res = await axiosInstance.get('/user');
            
            set({users:res.data.users});
        } catch (error:any) {
            set({error:error?.response?.data?.message})
        } finally{
            set({isLoading:false});
        }
    }
}))