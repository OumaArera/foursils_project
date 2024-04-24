import React, { useState, useEffect } from "react";
// import { useHistory } from 'react-router-dom';
const LOGIN_URL = "http://127.0.0.1:5000/user/signin";
import ModuleForm from "./assets/Module";
import LectureForm from "./assets/Lecture";
import NotesForm from "./assets/Notes";
import CourseForm from "./assets/Course";
import "./Login.css";
import CourseDetails from "./assets/CoursesDisplay";
import MyCourses from "./assets/MyCouses";
// import SearchCourses from "./assets/SearchCourses";


function Login() {
  // const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [create, setCreate] = useState(1);
  const [myCourses, setMyCourses] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {

      try {
        setRole(JSON.parse(storedRole));
      } catch (error) {
        console.error("Error parsing stored role:", error);
      }
    } else {
      console.warn("No role found in local storage.");

    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const logindetails = {
      email: username,
      password_hash: password,
    };

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(logindetails),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", JSON.stringify(data.access_token));
        localStorage.setItem("user_id", JSON.stringify(data.user_id));
        localStorage.setItem("role", JSON.stringify(data.role));
        setIsLoggedIn(true);
        // history.push('/');


      } else {
        throw new Error("Failed to authenticate");
      }
    } catch (error) {
      console.log(error);
    }

    if (!username || !password) {
      setError("Please enter both email and password.");
      return;
    }
  };

  const handleCreateCourse = () => {
    setCreate(2);
  };

  const handleCreateModule = () => {
    setCreate(3);
  };

  const handleCreateLecture = () => {
    setCreate(4);
  };

  const handleCreateNotes = () => {
    setCreate(5);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
  };

  const handleMyCourses = () => {
    setMyCourses((prevState) => !prevState);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
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
        </div>
      ) : (
        <div>
          <div>
            <button id="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
          {role === "instructor" && (
            <div>
              <button id="course-crt" onClick={handleCreateCourse}>
                Course
              </button>
              {create === 2 && <CourseForm />}
              <button id="module-crt" onClick={handleCreateModule}>
                Module
              </button>
              {create === 3 && <ModuleForm />}
              <button id="lecture-crt" onClick={handleCreateLecture}>
                Lecture
              </button>
              {create === 4 && <LectureForm />}
              <button id="notes-crt" onClick={handleCreateNotes}>
                Notes
              </button>
              {create === 5 && <NotesForm />}
            </div>
          )}
          {/* Student */}
          {role === "student" && (
            <div>
              <div>
                {/* {<SearchCourses />} */}
                {!myCourses && <CourseDetails />}
                {myCourses && <MyCourses />}
              </div>
              <button id="course-crt" onClick={handleMyCourses}>
                My Courses
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
