import { useAuthStore } from '../stores/useAuth';
import { axiosInstance } from '../lib/axios';
import { useAuth } from '@clerk/clerk-react'
import { Loader } from 'lucide-react';
import React, { useState,useEffect } from 'react'

function AuthProvider({children}: {children: React.ReactNode}) {
    const {getToken}= useAuth();
    const [loading,setloading] = useState(true);
    const {checkAdminStatus} = useAuthStore();

    const updateApiToken = async(token:string | null ) =>{
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        else delete axiosInstance.defaults.headers.common['Authorization'];
    }

    useEffect(()=>{
        const initAuth = async () =>{
            try {
                const token = await getToken();
                updateApiToken(token);
                if(token){
                    await checkAdminStatus();
                }
            } catch (error) {
                updateApiToken(null);
                console.log('Error in init Auth:',error);
            }
            finally{
                setloading(false);
            }
        }
        initAuth();
    },[getToken])

    if(loading){
        return (
            <div className='h-screen flex item-center justify-center'>
                <Loader className='animate-spin h-10 w-10 text-green-700' />
                <span className='ml-2 text-lg'>Loading...</span>
            </div>
        )
    }
    
  return (
    <div>
      {children}
    </div>
  )
}

export default AuthProvider
