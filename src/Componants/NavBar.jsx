// src/Componants/NavBar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";

export default function NavBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const current = searchParams.get("search") || "";
    setSearch(current);
  }, [searchParams]);

  function submitSearch(e) {
    e.preventDefault();
    const trimmed = search.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("search", trimmed);
    navigate({ pathname: "/events", search: params.toString() });
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-logo">Local Events</h2>
        <Link to="/home">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/post">Post</Link>
      </div>

      <div className="navbar-center">
        <form onSubmit={submitSearch} className="navbar-search-form">
          <input
            type="text"
            placeholder="Search events..."
            className="navbar-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="navbar-right">
        <Link to="/account">Account</Link>
      </div>
    </nav>
  );
}
