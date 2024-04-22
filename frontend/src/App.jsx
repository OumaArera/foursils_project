// import React, { useState } from 'react';
import './App.css';
import './index.css'
import Navbar from './Navbar';
import Register from "./Register";
import Login from './Login';
import Home from './Home';
import "./Login.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => { 

  
  return (
    <Router>
      <div className="header-container">
        <Navbar/>
        <Routes>
          <Route path ='/' element={<Home />}/>
          <Route path ='/Register' element={<Register />}/>
          <Route path ='/Login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;


