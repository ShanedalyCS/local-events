import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "../supaBaseClient.jsx";
import { useNavigate, Link } from "react-router-dom";

const LogIn = ({ setIsLoggedIn = () => {} }) => {
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
        navigate("/home");
      }, 1000);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2 className="login-title">Configuration needed</h2>
          <p className="login-subtitle">
            Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Netlify site
            environment and redeploy.
          </p>
        </div>
      </div>
    );
  }

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
