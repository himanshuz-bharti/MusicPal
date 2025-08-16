import { axiosInstance } from '../lib/axios';
import {create} from 'zustand';
interface AuthStore{
    isAdmin:boolean,
    error: string | null,
    isLoading:boolean,
    checkAdminStatus:()=>Promise<void>,
    reset:()=>void
}
export const useAuthStore = create<AuthStore>((set)=>({
    isAdmin:false,
    error:null,
    isLoading:false,
    checkAdminStatus:async()=>{
        set({isLoading:true})
        try {
            const res = await axiosInstance.get('/admin/check');
            
            set({
                isAdmin:res.data.admin
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
    reset:()=>{
        set({isAdmin:false,isLoading:false,error:null})
    }
}))