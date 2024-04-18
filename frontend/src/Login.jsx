import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
const LOGIN_URL = "http://127.0.0.1:5000/user/signin"

function Login({onLogin}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const logindetails = {
      username: username,
      password: password
    }

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(logindetails)
    })
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      localStorage.setItem(JSON.stringify(data));
      onLogin()
      

      
        
    } else {
      throw new Error("Failed to authenticate");
    }

   }
   catch (error) {
    console.log(error)
  }

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to authenticate");
        }
  
        // Assuming the server responds with a token upon successful login
        const data = await response.json();
        // Set the token in a cookie with expiry date
        localStorage.setItem('access_token', JSON.stringify(data))

        setIsLoggedIn(true);
  
        // Redirect to the home component after succesheshful login
        navigate("/home");
      } catch (error) {
        setError("Invalid username or password.");
      }
    };

  return (
    <div className="container">
      <h1>Welcome Home</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
      {isLoggedIn && <div>Logged in successfully!</div>}
    </div>
  );
}

export default Login;
