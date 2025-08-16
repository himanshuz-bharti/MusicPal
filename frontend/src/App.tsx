import {Route,Routes} from 'react-router-dom';
import Home from './pages/HomePage.tsx';
import AuthCallback from './pages/AuthCallback.tsx';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import MainLayout from './layout/MainLayout.tsx';
import UserHome from './pages/UserHome.tsx';
import ChatPage from './pages/ChatPage.tsx';
import AlbumPage from './pages/AlbumPage.tsx';
export default function App(){
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