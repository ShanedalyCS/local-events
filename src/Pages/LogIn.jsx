import React from 'react';
import Account from '../Pages/Account.jsx';
import Home from '../Pages/Home.jsx';
import Post from '../Pages/Post.jsx';
import Register from '../Pages/Register.jsx';
import { Link } from 'react-router-dom';

import NavBar from "../Componants/NavBar"


export default function LogIn(){
    return(
        <div>
            <NavBar/>
            <h1>Welcome to the LogIn Page</h1>
            <p>This is the login page.</p>
        </div>
    )
}