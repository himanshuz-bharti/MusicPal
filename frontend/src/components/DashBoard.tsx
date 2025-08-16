import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Star, Zap, Radio } from 'lucide-react';
import { SignedIn,SignedOut,SignOutButton } from '@clerk/clerk-react';
import SignInOAuthButton from './SignInOAuthButton';
import { useNavigate } from 'react-router-dom';

export default function MusicPalDashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentSong = "Midnight Dreams"
  const currentArtist= "Luna Eclipse"
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const togglePlay = () =>{
    setIsPlaying(!isPlaying);
    navigate('/UserHome');
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate animation values based on scroll
  const dashboardOpacity = Math.min(scrollY / 400, 1);
  const dashboardTransform = Math.max(100 - (scrollY / 8), 0);

  return (
    <div className="min-h-[200vh] bg-black relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30"></div>
      
      {/* Animated background elements - more subtle */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-400"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm bg-gray-900/50 border-b border-gray-800/50 fixed w-full top-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">MusicPal</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Discover</a>
          <a href="#" className="hover:text-white transition-colors">Library</a>
          <a href="#" className="hover:text-white transition-colors">Playlists</a>
          <a href="#" className="hover:text-white transition-colors">Artists</a>
        </div>

        <div>
          <SignedIn>
                <SignOutButton>
                  <button className='rounded-lg p-3 bg-red-600 text-black text-wm font-bold'>
                         Sign Out
                  </button>
                </SignOutButton>
            </SignedIn>
            <SignedOut>
                <SignInOAuthButton/>
            </SignedOut>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32 pt-40">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Your Music,
          <br />
          <span className="text-gray-300">
            Amplified
          </span>
        </h1>
        
        <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-8">
          MusicPal
        </h2>
        
        <p className="text-lg text-gray-400 mb-12 max-w-2xl">
          AI-powered music discovery, smart playlists, and personalized recommendations.
          <br />
          Stop wasting time searching for the perfect song.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-32">
          <button 
            onClick={togglePlay}
            className="bg-gradient-to-r from-green-500 to-green-400 text-black px-8 py-4 rounded-full font-semibold text-lg hover:from-green-400 hover:to-green-300 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>Start Listening</span>
          </button>
          
          <button className="bg-gray-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-700/50 transition-all duration-300 border border-gray-700">
            Get 3 months free now
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce text-gray-500 mb-16">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview with Scroll Animation */}
        <div 
          className="w-full max-w-6xl mx-auto bg-gray-900/60 backdrop-blur-lg rounded-3xl p-8 border border-gray-800/50 shadow-2xl transition-all duration-1000 ease-out"
          style={{
            opacity: dashboardOpacity,
            transform: `translateY(${dashboardTransform}px)`,
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Music Intelligence Dashboard</h3>
            <div className="text-sm text-gray-500">Last updated: Just now</div>
          </div>

          {/* Feature Cards - Left Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1 space-y-6">
              <div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all duration-1000 ease-out"
                style={{
                  opacity: dashboardOpacity,
                  transform: `translateY(${Math.max(dashboardTransform - 20, 0)}px)`,
                  transitionDelay: '200ms'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-8 h-8 text-green-400" />
                  <span className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-1 rounded">AI POWERED</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Smart Discovery</h4>
                <p className="text-gray-400 text-sm">AI analyzes your taste and finds perfect matches</p>
              </div>

              <div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all duration-1000 ease-out"
                style={{
                  opacity: dashboardOpacity,
                  transform: `translateY(${Math.max(dashboardTransform - 40, 0)}px)`,
                  transitionDelay: '400ms'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Radio className="w-8 h-8 text-blue-400" />
                  <span className="text-xs text-blue-400 font-semibold bg-blue-400/10 px-2 py-1 rounded">LIVE</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Radio Stations</h4>
                <p className="text-gray-400 text-sm">Curated stations that adapt to your mood</p>
              </div>
            </div>

            {/* Main Dashboard Interface */}
            <div 
              className="lg:col-span-2 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 transition-all duration-1000 ease-out"
              style={{
                opacity: dashboardOpacity,
                transform: `translateY(${Math.max(dashboardTransform - 60, 0)}px)`,
                transitionDelay: '600ms'
              }}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold">MusicPal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>

              {/* Now Playing */}
              <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Now Playing</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">4.8</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-white font-semibold">{currentSong}</div>
                    <div className="text-gray-400 text-sm">{currentArtist}</div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-400 h-1 rounded-full w-1/3"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={togglePlay}
                      className="bg-green-500 text-black w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">2.4M</div>
                  <div className="text-gray-400 text-sm">Songs</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">847</div>
                  <div className="text-gray-400 text-sm">Playlists</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">156</div>
                  <div className="text-gray-400 text-sm">Artists</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all duration-1000 ease-out"
              style={{
                opacity: dashboardOpacity,
                transform: `translateY(${Math.max(dashboardTransform - 120, 0)}px)`,
                transitionDelay: '1200ms'
              }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border-l-4 border-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">New weekly mix is ready</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border-l-4 border-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Artist you follow released new album</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg border-l-4 border-purple-400">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Friend shared a playlist with you</span>
                </div>
              </div>
            </div>

            <div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 transition-all duration-1000 ease-out"
              style={{
                opacity: dashboardOpacity,
                transform: `translateY(${Math.max(dashboardTransform - 140, 0)}px)`,
                transitionDelay: '1400ms'
              }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">AI Summary</h4>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-3">
                  This week you've been exploring more electronic and indie genres. 
                  Your listening patterns suggest you prefer upbeat tracks in the morning 
                  and ambient sounds in the evening.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-green-400 text-xs font-semibold">AI INSIGHT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}