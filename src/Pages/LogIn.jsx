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
    <div className="login-container">
      <NavBar/>
      <h2>Log In</h2>
      <form onSubmit={handleLogIn}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LogIn;
