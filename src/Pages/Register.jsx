import React, {useStae} from 'react';
import { useNavigate } from "react-router-dom"; // Used to navigate after registration
import { supabase } from '../supaBaseClient.jsx';
import Account from '../Pages/Account.jsx';
import Home from '../Pages/Home.jsx';
import LogIn from '../Pages/LogIn.jsx';
import Post from '../Pages/Post.jsx';
import { Link } from 'react-router-dom';

import NavBar from "../Componants/NavBar"


// Registration component
const Register = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();

   // Password validation function
  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /[0-9]/;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) return "Password must be at least 8 characters.";
    if (!hasUppercase.test(password)) return "Password must have at least one uppercase letter.";
    if (!hasLowercase.test(password)) return "Password must have at least one lowercase letter.";
    if (!hasNumber.test(password)) return "Password must have at least one number.";
    if (!hasSpecial.test(password)) return "Password must have at least one special character.";

    return null; // Password is valid
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
  e.preventDefault();

  
  setMessage("Creating your account...");

  // Check password strength
    /*const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(`❌ ${passwordError}`);
      return;
    }*/

  // Create user in Supabase Auth
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  
  // Handle signup errors
  if (signupError) {
    console.error("Signup error:", signupError);
    setMessage(`❌ ${signupError.message}`);
    return;
  }

  // Signup successful. Profile creation.
  const user = signupData.user;
  console.log("✅ User created:", user);

  // Insert into profiles table
  if (user) {
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: user.id,       // match the auth user's id
        username: email,   // default username (can be changed later)
        full_name: "",     // optional
        bio: "",
      },
    ]);

    if (profileError) {
      console.error("Profile insert error:", profileError);
      setMessage(`⚠️ Account created but profile setup failed: ${profileError.message}`);
      return;
    }
  }

  setMessage("✅ Account created! Redirecting to log in...");

  // Wait 1 second so the user sees the message before redirecting
setTimeout(() => {
  navigate("/login");
}, 1000);
};
 
  

  return (
    <div>
      <NavBar />
      <h1>Welcome to the Register page</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;

 