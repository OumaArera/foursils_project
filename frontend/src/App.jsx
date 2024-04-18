import React, { useState } from 'react';
import './App.css';
import './index.css'
import Navbar from './Navbar';
import Register from "./Register";
import Login from './Login';
import Home from './Home';


function App({onLogin}) { 
  const [isLogged, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  }
  return (

  )
}

export default App;


