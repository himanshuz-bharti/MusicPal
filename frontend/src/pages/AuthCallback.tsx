import { axiosInstance }  from "../lib/axios.ts";
import { useUser } from "@clerk/clerk-react"
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 

export default function AuthCallback() {
    const {isLoaded,user} = useUser();
    console.log('user',user);
    const navigate = useNavigate();
    const syncattempted = useRef(false);
    useEffect(() => {
         if (!isLoaded || !user || syncattempted.current) return;
        const syncUser = async () => {
        try {
         
           await axiosInstance.post('/auth/callback', {
        id:        user.id,
        firstName: user.firstName,
        lastName:  user.lastName,
        imageUrl:  user.imageUrl,
      });
     syncattempted.current=true;
    } catch (err) {
      console.error('error in auth callback', err);
    } finally {
      navigate('/UserHome');
    }
  };

  syncUser();
}, [isLoaded, user, navigate]);



  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        {/* Simple spinning loader */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin"></div>
        </div>

        {/* Main text with animated dots */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-green-400 flex items-center justify-center gap-1">
            <span>Redirecting</span>
            <span className="inline-flex">
              <span className="animate-pulse" style={{ animationDelay: '0s', animationDuration: '1.5s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '1s', animationDuration: '1.5s' }}>.</span>
            </span>
          </h1>
          
          <p className="text-lg text-green-300 font-medium">
            Logging you in
          </p>
        </div>

        {/* Simple progress indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Optional status message */}
        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Please wait a moment...
          </p>
        </div>
      </div>
    </div>
  );
}