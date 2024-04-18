import React from "react";
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <div className="navbar-stuff">
            <h1 className='name-org text-lg font-bold'>The <span className="comp"> Foursils </span> Academy</h1>
            <NavLink to='/' className='navlink mx-2'>Home</NavLink>
            <NavLink to='/Register' className='navlink mx-2'>Register</NavLink>
            <NavLink to='/Login' className='navlink mx-2'>Login</NavLink>
            <NavLink to='/Logout' className='navlink mx-2'>Logout</NavLink>

            {/* New buttons for student section */}
            <NavLink to='/explore' className='navlink mx-2'>Explore all courses</NavLink>
            <NavLink to='/mycourses' className='navlink mx-2'>My courses</NavLink>
        </div>
    )
}

export default Navbar;
