import React, { useState } from 'react';
import './App.css';
import './index.css'
import Navbar from './Navbar';
import Register from "./Register";
import Login from './Login';
import Home from './Home';
import Logout from './Logout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App({onLogin}) { 
  const [isLogged, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  }
  return (
    <Router>
      <div className="header-container">
        <Navbar/>
        <Routes>
           
          <Route path ='/' element={isLogged && <Home />}/> 
          <Route path ='/Register' element={!isLogged && <Register />}/>
          <Route path ='/Login' element={!isLogged && <Login onLogin={handleLogin}/>} />
          <Route path ='/Logout' element={<Logout />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;