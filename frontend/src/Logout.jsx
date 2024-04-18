import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importing useHistory from react-router-dom

function Logout() {
    const navigate = useNavigate(); // Getting the history object

    const handleLogout = () => {
        // Clear the authentication state by removing the token from localStorage
        localStorage.removeItem('access_token');
        
        // Redirect the user to the login page
        navigate('/login');
    };

    useEffect(() => {
        // Call the handleLogout function when the component mounts
        handleLogout();
    }, []);  // Empty dependency array to run this effect only once

    return (
        <div className='container-logout'> 
            <h1>You are now Logged out</h1>
        </div>
    );
}

export default Logout;
