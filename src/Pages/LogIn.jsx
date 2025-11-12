import { Link } from 'react-router-dom';
import NavBar from "../Componants/NavBar"
import React, { useState } from 'react';
import { supabase } from "../supaBaseClient";
import { useNavigate } from "react-router-dom";
import Home from '../Pages/Home.jsx';




const LogIn = () => {  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState("");


  const handleLogIn = async (e) => {
  e.preventDefault();

  setMessage("Logging in..."); // optional feedback
  console.log("Login button clicked!", { email, password });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    setMessage(`❌ ${error.message}`);
  } else {
    console.log("Login success:", data);
    setMessage("✅ Successfully logged in!");
    navigate("/"); // Redirect to home page
  }
};



  return (
    <div>
      <NavBar />

      <div className="login-container">
        <h2 className="login-title">Log In</h2>

        <form className="login-form" onSubmit={handleLogIn}>
          <input
            type="email"
            placeholder="Email address"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default LogIn;
