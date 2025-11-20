import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supaBaseClient.jsx";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Creating your account...");

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      console.error("Signup error:", signupError);
      setMessage(`Sign up failed: ${signupError.message}`);
      return;
    }

    const user = signupData.user;

    if (user) {
      const { error: profileError } = await supabase.from("testtable").insert([
        {
          id: user.id,
          username,
        },
      ]);

      if (profileError) {
        console.error("Profile insert error:", profileError);
        setMessage(`Account created but profile setup failed: ${profileError.message}`);
        return;
      }
    }

    setMessage("Account created! Redirecting to log in...");

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Create Your Account</h1>
        <p className="register-subtitle">Sign up to get started</p>

        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email address"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username (display name)"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
