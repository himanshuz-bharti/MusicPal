import React, { useEffect, useState } from 'react'
import { MessageCircle, Users, Search, MoreVertical, Phone, Video, Lock, UserPlus, Music } from 'lucide-react'
import { useChatStore } from '../stores/useChatStore'
import { useUser } from '@clerk/clerk-react';
import SignInOAuthButton from './SignInOAuthButton';
import { LoadingFriendSkeleton } from '../Skeletons/FriendsSkeleton';

// Login required page
const LoginRequiredPage = () => {
  return (
    <div className="min-h-screen mt-5 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Main content */}
        <div className="relative bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Icon with glow effect */}
          <div className="text-center mb-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title and description */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Connect with Friends
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Please login to see what your friends are listening to and join the conversation
            </p>
          </div>

          {/* Features preview */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Real-time Chat</p>
                <p className="text-gray-400 text-xs">Connect instantly with friends</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <Users className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Online Status</p>
                <p className="text-gray-400 text-xs">See who's currently online</p>
              </div>
            </div>
            
          </div>

          {/* Login prompt */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
              <Lock className="w-4 h-4" />
              <span>Authentication required</span>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
              <UserPlus className="w-4 h-4 mb-2 inline mr-2" />
              <SignInOAuthButton/>
            </button>
            
            <p className="text-gray-500 text-xs mt-4">
              Join thousands of users already connected
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Individual friend card component
const FriendCard = ({ user,isPlaying }) => {
  const isOnline = Math.random() > 0.4; // Random online status for demo
  const lastSeen = isOnline ? 'Online' : `${Math.floor(Math.random() * 60) + 1}m ago`;
  
  return (
    <div className="group flex items-center gap-3 p-3 hover:bg-gray-800/60 rounded-lg transition-all duration-200 cursor-pointer">
      {/* Profile Picture with Online Status */}
      <div className="relative">
        <img
          src={user.imageUrl}
          alt={user.fullname}
          className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-700 group-hover:ring-gray-600 transition-all"
        />
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className='flex flex-row'>
           <h3 className="text-gray-200 font-medium text-sm group-hover:text-white transition-colors truncate">
            {user.fullname}
           </h3>
           <span className='mt-1'>{isPlaying && <Music className='size-3 text-emerald-300 shrink-0'/>}</span>
        </div>
        {isPlaying ? (
            <div className='mt-1'>
              <div className='text-sm mt-1 text-white font-small truncate'>Somebody's Me</div>
              <div className='text-xs text-zinc-400 truncate'>Enrique</div>
            </div>
        ) :(
            <div>
            <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
           <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
           {lastSeen}
        </p></div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 hover:bg-gray-700 rounded-md transition-colors">
          <MessageCircle className="w-3.5 h-3.5 text-gray-400 hover:text-blue-400" />
        </button>
        <button className="p-1.5 hover:bg-gray-700 rounded-md transition-colors">
          <Phone className="w-3.5 h-3.5 text-gray-400 hover:text-green-400" />
        </button>
        <button className="p-1.5 hover:bg-gray-700 rounded-md transition-colors">
          <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

function FriendsActivity() {
  const {users, fetchusers, isLoading} = useChatStore();
  const {user} = useUser();
  const [isPlaying,setIsPlaying] = useState(true);
  useEffect(() => {
    if(user) fetchusers();
  }, [user]);

  // Show login page if user is not defined
  if (!user) {
    return <LoginRequiredPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Friends Activity
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">
                See who's online and connect
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search friends..."
              className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 focus:border-gray-600"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
            <p className="text-green-400 text-xs font-medium">Online</p>
            <p className="text-white text-sm font-semibold">
              {users ? users.filter(() => Math.random() > 0.4).length : 0}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <Users className="w-3 h-3 text-blue-400 mx-auto mb-1" />
            <p className="text-blue-400 text-xs font-medium">Friends</p>
            <p className="text-white text-sm font-semibold">{users?.length || 0}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <MessageCircle className="w-3 h-3 text-purple-400 mx-auto mb-1" />
            <p className="text-purple-400 text-xs font-medium">Messages</p>
            <p className="text-white text-sm font-semibold">
              {Math.floor(Math.random() * 20) + 5}
            </p>
          </div>
        </div>

        {/* Friends List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-white font-medium text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              Your Friends
            </h2>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <LoadingFriendSkeleton />
            ) : users && users.length > 0 ? (
              <div className="p-2">
                {users.map((user, index) => (
                  <FriendCard key={user.clerkId} user={user} isPlaying={isPlaying}/>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-gray-300 text-sm font-medium mb-1">No Friends Yet</h3>
                <p className="text-gray-500 text-xs">Start connecting with people!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #374151;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 2px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}

export default FriendsActivity