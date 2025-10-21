import React from 'react';
import Account from '../Pages/Account.jsx';
import Home from '../Pages/Home.jsx';
import LogIn from '../Pages/LogIn.jsx';
import Register from '../Pages/Register.jsx';
import { Link } from 'react-router-dom';

import NavBar from "../Componants/NavBar"


export default function Post(){
    return(
        <div>
            <NavBar/>
            <h1>Welcome to the Posts Page</h1>
            <p>This is the post page.</p>
        </div>
    )
}