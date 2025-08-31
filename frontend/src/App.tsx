import {Route,Routes} from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/HomePage.tsx';
import AuthCallback from './pages/AuthCallback.tsx';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import MainLayout from './layout/MainLayout.tsx';
import UserHome from './pages/UserHome.tsx';
import ChatPage from './pages/ChatPage.tsx';
import AlbumPage from './pages/AlbumPage.tsx';
import { useMusicStore } from './stores/useMusicStore.ts';
export default function App(){
  const { fetchlikedSongs, likedSongs } = useMusicStore();

  // SOLUTION: Fetch liked songs once at the app level when user is authenticated
  useEffect(() => {
    // Only fetch if we don't already have the data
    if (!likedSongs || likedSongs.length === 0) {
      fetchlikedSongs();
    }
  }, []);
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sso-callback' element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={'/auth-callback'}/>}/>
      <Route path='/auth-callback' element={<AuthCallback/>}/>
      <Route element={<MainLayout/>}>
         <Route path='/UserHome' element={<UserHome/>}/>
         <Route path='/chat' element={<ChatPage/>}/>
         <Route path='/album/:id' element={<AlbumPage/>}/>
      </Route>
    </Routes>
    </>
  )
}