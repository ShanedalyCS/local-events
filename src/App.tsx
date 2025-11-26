import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import "./App.css";

// components
import NavBar from "./Componants/NavBar";

// pages
import Home from "./Pages/Home.jsx";
import Account from "./Pages/Account.jsx";
import LogIn from "./Pages/LogIn.jsx";
import Post from "./Pages/Post.jsx";
import Register from "./Pages/Register.jsx";
import Events from "./Pages/Events.jsx";
import EventDetail from "./Pages/EventDetail.jsx";
import Profile from "./Pages/Profile.jsx";

function LayoutWithNav() {
  return (
    <>
      <NavBar />
      <main className="page-content">
        <Outlet />
      </main>
    </>
  );
}

// layout for pages WITHOUT navbar (login/register)
function LayoutNoNav() {
  return (
    <main className="auth-shell">
      <Outlet />
    </main>
  );
}

export default function App() {
  // if you want to use this later for protecting routes
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />

        {/* routes WITH navbar */}
        <Route element={<LayoutWithNav />}>
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/post" element={<Post />} />
          <Route path="/account" element={<Account />} />
        </Route>

        {/* routes WITHOUT navbar */}
        <Route element={<LayoutNoNav />}>
          <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
