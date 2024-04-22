import React, { useState, useEffect } from 'react';
import './MyCourses.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// Define API endpoints
const MY_COURSES_URL = "http://127.0.0.1:5000/user/my/courses";
const COURSE_CONTENT_URL = "http://127.0.0.1:5000/user/";


// const DROP_COURSE_URL = "http://127.0.0.1:5000/user/drop/course";

const DROP_COURSE_URL = "http://127.0.0.1:5000/user/drop/course"


const MyCourses = () => {
  // State variables
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenDetails, setTokenDetails] = useState("");
  const [userId, setUserId] = useState("");
  const [courseContent, setCourseContent] = useState(null);
  const [dropMessage, setDropMessage] = useState(""); // Added state for drop message

  // Fetch token details from local storage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenDetails(JSON.parse(token));
    }
  }, []);

  // Fetch user ID from local storage
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setUserId(JSON.parse(userId));
    }
  }, []);

  // Fetch user's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${MY_COURSES_URL}/${userId}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${tokenDetails}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId, tokenDetails]);

  // Fetch course content when "Start" button is clicked
  const startCourse = async (courseId) => {
    try {

      const response = await fetch(`${COURSE_CONTENT_URL}/${courseId}`, {

        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenDetails}`
        }
      });
      if (response.ok) {
        const content = await response.json();
        setCourseContent(content);
      } else {
        console.error('Failed to fetch course content');
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
    }
  };

  // Remove course when "Drop" button is clicked
  const dropCourse = async (courseId) => {
    try {
      const response = await fetch(`${DROP_COURSE_URL}/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenDetails}`
        }
      });
      if (response.ok) {
        // Update courses list without the dropped course
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));

        // Set success message
        setDropMessage('Course dropped successfully.');
      } else {
        // Set error message if response is not OK
        setDropMessage('Failed to drop course.');
        throw new Error('Failed to drop course.');



      } 

    } catch (error) {
      // Set error message if fetch fails
      console.error('Error dropping course:', error);
      setDropMessage('Error dropping course. Please try again later.');
    }
  };

  // Render loading state while fetching courses
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render courses
  return (
    <div className="course-details">
      <h2>My Courses</h2>
      {/* Display drop message if exists */}
      {dropMessage && (
        <p className="error-message">
          {dropMessage}
        </p>
      )}
      {courses.length === 0 ? (
        <p className="error-message">No courses enrolled.</p>
      ) : (
        <div className="course-cards">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Enrollment Date: {new Date(course.enrollment_date).toLocaleDateString()}</p>
              <button onClick={() => startCourse(course.id)}>Start</button>
              <button className="drop-button" onClick={() => dropCourse(course.id)}>  
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Render course content if available */}
      {courseContent && (
        <div>
          <h2>Course Content</h2>
          {/* Render the content here */}
          <ul>
            {courseContent.lectures.map(lecture => (
              <li key={lecture.id}>
                <h3>{lecture.title}</h3>
                <p>{lecture.description}</p>
              </li>
            ))}
          </ul>
          <h3>Notes</h3>
          <p>{courseContent.notes}</p>
          <h3>Modules</h3>
          <ul>
            {courseContent.modules.map(module => (
              <li key={module.id}>
                <h4>{module.title}</h4>
                <p>{module.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyCourses;

