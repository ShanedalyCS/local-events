import React from 'react';
import Account from '../Pages/Account.jsx';
import LogIn from '../Pages/LogIn.jsx';
import Post from '../Pages/Post.jsx';
import Register from '../Pages/Register.jsx';
import { Link } from 'react-router-dom';

import NavBar from "../Componants/NavBar"


export default function Home(){
    return(
        <div>
            <NavBar/>
            <h1>Welcome to the Home Page</h1>
            <p>This is the main landing page of the application.</p>
        </div>
    )
}