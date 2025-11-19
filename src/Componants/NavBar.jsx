// src/Componants/NavBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [search, setSearch] = useState("");

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-logo">Local Events</h2>
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/post">Post</Link>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search..."
          className="navbar-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="navbar-right">
        <Link to="/account">Account</Link>
      </div>
    </nav>
  );
}
