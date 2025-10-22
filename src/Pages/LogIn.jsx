 import { Link } from 'react-router-dom';
import NavBar from "../Componants/NavBar"
import React, { useState } from 'react';


const LogIn = () => {  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = (e) => {
    e.preventDefault();
    
    console.log('Login button clicked!');
    console.log('Logging in with', { email, password });

    // Later: Login authentication logic here
    
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
