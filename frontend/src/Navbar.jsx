import React from "react";
import { NavLink } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
    return (
        <div>
            
            <div className="navbar-container">
            <div className="titleee">
            <h1 className='name-org'>The <span className="comp"> Foursils </span> Academy</h1>
            </div>
            <div className="linksss">
            <div className="dropdown">
            <NavLink to='/' className='dropbtn'>Get Started</NavLink>
                <div className="dropdown-content">
                    <NavLink to='/Register' className='navlink'>Register</NavLink>
                    <NavLink to='/Login' className='navlink'>Login</NavLink>
                </div>
            </div>
            <NavLink to='/' className='homebtn'>Home</NavLink>
            {/* <NavLink to='/Logout' className='logout-btn'>Logout</NavLink> */}
            </div>
            </div>
            
        </div>
    );
}

export default Navbar;