import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import viteLogo from '/vite.svg'
import './App.css'


// ADD PAGES HERE ..
import Home from './Pages/Home.jsx';
import Account from './Pages/Account.jsx';
import LogIn from './Pages/LogIn.jsx';
import Post from './Pages/Post.jsx';
import Register from './Pages/Register.jsx';



function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/about" element={<Account />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/post" element={<Post />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>  
    
    </>
  )
}

export default App
