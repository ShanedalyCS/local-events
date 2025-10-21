import React from 'react';
import Account from '../Pages/Account.jsx';
import Home from '../Pages/Home.jsx';
import LogIn from '../Pages/LogIn.jsx';
import Post from '../Pages/Post.jsx';
import { Link } from 'react-router-dom';

import NavBar from "../Componants/NavBar"


export default function Register(){
    return(
        <div>
            <NavBar/>
            <h1>Welcome to the Register page</h1>
            <p>This is the register screen.</p>
        </div>
    )
}