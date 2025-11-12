import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import viteLogo from '/vite.svg'
import './App.css'


// ADD PAGES HERE ..
import Home from './Pages/Home.jsx';
import Account from './Pages/Account.jsx';
import LogIn from './Pages/LogIn.jsx';
import Post from './Pages/Post.jsx';
import Register from './Pages/Register.jsx';
import Events from './Pages/Events.jsx';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/post" element={<Post />} />
           <Route path="/events" element={<Events/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>  
    
    </>
  )
}

export default App
