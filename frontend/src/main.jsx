import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' 
import './index.css'
import App from './App.jsx'
import Admin from './Admin.jsx'
import TempleDetails from './TempleDetails.jsx'
import EditTemple from './EditTemple.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import Profile from './Profile.jsx'
import ProtectedRoute from './ProtectedRoute.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/temple/:id" element={<TempleDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/profile" element={
       <ProtectedRoute>
         <Profile />
       </ProtectedRoute>
     } />

        <Route path="/admin" element={ <ProtectedRoute><Admin /></ProtectedRoute> } />
        <Route path="/edit/:id" element={ <ProtectedRoute><EditTemple /></ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)