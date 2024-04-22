import React, { useEffect } from "react";
import { useHistory } from "react-router-dom"; // Importing useHistory from react-router-dom

function Logout() {
    const history = useHistory(); // Getting the history object

    const handleLogout = () => {
        // Clear the authentication state by removing the token from localStorage
        localStorage.removeItem('token');
        
        // Redirect the user to the login page
        history.push('/login');
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
