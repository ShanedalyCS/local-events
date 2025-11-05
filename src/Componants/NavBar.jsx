import React from 'react';
import Account from '../Pages/Account.jsx';
import Home from '../Pages/Home.jsx';
import LogIn from '../Pages/LogIn.jsx';
import Post from '../Pages/Post.jsx';
import Register from '../Pages/Register.jsx';
import { Link } from 'react-router-dom';


export default function NavBar(){
    return(
        <nav className='navbar'>
            <h2>Local Events</h2>
            <Link to = "/">Home</Link>
            <Link to = "/about">Account</Link>
            <Link to = "/login">Login</Link>
            <Link to = "/post">Post</Link>
            <Link to = "/register">Register</Link>
             <Link to = "/events">Events</Link>
        </nav>
    )
}