import React, { useState } from "react";
import { supabase } from "../supaBaseClient.jsx";
import { useNavigate, Link } from "react-router-dom";

const LogIn = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogIn = async (e) => {
    e.preventDefault();

    setMessage("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setMessage(`Login failed: ${error.message}`);
    } else {
      console.log("Login success:", data);
      setMessage("Successfully logged in!");
      setIsLoggedIn(true);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Log in to your account to continue</p>

        <form onSubmit={handleLogIn} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
