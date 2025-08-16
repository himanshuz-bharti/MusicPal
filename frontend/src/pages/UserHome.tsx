import { Music, TrendingUp, Heart, Star, Settings, Pause } from "lucide-react";
import { useAuthStore } from "../stores/useAuth";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/clerk-react";
import SignInOAuthButton from "../components/SignInOAuthButton";
import { useMusicStore } from "../stores/useMusicStore";
import { useEffect, useState } from "react";
import PlayButton from "../components/PlayButton";
import MusicPlayer from "../components/MusicPlaybackSlider";
import { usePlayerStore } from "../stores/usePlayer";


function UserHome() {
  const { isAdmin } = useAuthStore();
  const { 
    fetchMadeforYouSongs, 
    fetchFeaturedSongs, 
    fetchTrendingSongs,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
    isLoading 
  } = useMusicStore();

  const {initializeQueue} = usePlayerStore();

  useEffect(()=>{
    if(madeForYouSongs.length>0 && featuredSongs.length>0 && trendingSongs.length>0){
      const allSongs = [...madeForYouSongs,...featuredSongs,...trendingSongs];
      initializeQueue(allSongs);
    }
  },[madeForYouSongs,featuredSongs,trendingSongs,initializeQueue])

  const {isPlaying} = usePlayerStore();
  const [activeSection, setActiveSection] = useState('featured');
  const [showPlayer,setshowPlayer] = useState(false);

  useEffect(()=>{
    if(isPlaying){
      setshowPlayer(true);
    }
    else{
      const timer = setTimeout(()=>{
        setshowPlayer(false);
      },3000);
      return () =>clearTimeout(timer);
    }
  },[isPlaying])

  useEffect(() => {
    // Fetch all song data on component mount
    fetchFeaturedSongs();
    fetchMadeforYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeforYouSongs, fetchTrendingSongs]);

  const SongCard = ({ songs, song, index, layout = 'horizontal' }) => {
  
    if (layout === 'vertical') {
      return (
        <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-4 hover:bg-emerald-700/40 transition-all duration-300 cursor-pointer group hover:scale-105">
          <div className="flex flex-col">
            <div className="relative mb-3 w-full aspect-square">
              <img 
                src={song.imageUrl} 
                alt={song.title}
                className="w-full h-full rounded-lg object-cover shadow-lg"
              />
              
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1">{song.title}</h3>
              <p className="text-emerald-200/80 text-xs font-medium line-clamp-1">{song.artist}</p>
             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PlayButton song={song} />
            </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-emerald-800/30 backdrop-blur-sm rounded-lg p-3 hover:bg-emerald-700/40 transition-all duration-300 cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={song.imageUrl} 
              alt={song.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            
          </div>
           <div className="flex flex-row gap-1">
            <div className="space-y-1">
              <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1">{song.title}</h3>
              <p className="text-emerald-200/80 text-xs font-medium line-clamp-1">{song.artist}</p>
              </div>
             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PlayButton song={song} />
            </div>
            </div> 
        </div>
      </div>
    );
  };

  const SectionGrid = ({ songs, title, icon: Icon, layout = 'horizontal' }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className={`grid gap-6 ${
        layout === 'vertical' 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {songs?.slice(0, 6).map((song, index) => (
          <SongCard songs={songs} key={song._id || index} song={song} index={index} layout={layout} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-stone-900 to-gray-900">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-gray-800/60 to-emerald-800/60 backdrop-blur-lg border-b border-emerald-600/30 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              MusicPal
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link 
                to="/admin"
                className="flex items-center gap-2 px-3 py-2 bg-emerald-700/50 hover:bg-emerald-600/50 text-white rounded-lg transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </Link>
            )}
            
            <SignedOut>
              <SignInOAuthButton />
            </SignedOut>
            
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-emerald-800 border-emerald-700",
                    userButtonPopoverActions: "text-white"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveSection('featured')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm ${
              activeSection === 'featured' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-emerald-800/50 text-emerald-200'
            }`}
          >
            <Star className="w-4 h-4" />
            Featured
          </button>
          <button 
            onClick={() => setActiveSection('madeForYou')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm ${
              activeSection === 'madeForYou' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-emerald-800/50 text-emerald-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            Made for You
          </button>
          <button 
            onClick={() => setActiveSection('trending')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm ${
              activeSection === 'trending' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-emerald-800/50 text-emerald-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {/* Featured Section */}
              {(activeSection === 'featured' || window.innerWidth >= 768) && (
                <SectionGrid 
                  songs={featuredSongs} 
                  title="Featured Songs" 
                  icon={Star}
                  layout="horizontal"
                />
              )}

              {/* Made for You Section - Now uses vertical layout */}
              {(activeSection === 'madeForYou' || window.innerWidth >= 768) && (
                <SectionGrid 
                  songs={madeForYouSongs} 
                  title="Made for You" 
                  icon={Heart}
                  layout="vertical"
                />
              )}

              {/* Trending Section - Now uses vertical layout */}
              {(activeSection === 'trending' || window.innerWidth >= 768) && (
                <SectionGrid 
                  songs={trendingSongs} 
                  title="Trending Now" 
                  icon={TrendingUp}
                  layout="vertical"
                />
              )}
            </>
          )}
          {showPlayer && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
            isPlaying 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0'
          }`}
        >
          <MusicPlayer isPlaying={isPlaying} />
        </div>
      )}
        </div>
      </main>
    </div>
  );
}

export default UserHome;