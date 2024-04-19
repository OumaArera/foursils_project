import React, { useState, useEffect } from 'react';

const COURSES_URL = "http://127.0.0.1:5000/user/courses";
const ENROL_URL = "http://127.0.0.1:5000/user/enroll";
const SEARCH_URL = "http://127.0.0.1:5000/user/search/courses";

const CourseDetails = () => {
  
  // State to store courses fetched from the backend
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenDetails, setTokenDetails] = useState("");
  const [userId, setUserId] = useState("");

  // Function to fetch courses from the backend
  const fetchCourses = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${tokenDetails}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // useEffect hook to fetch courses when the component mounts
  useEffect(() => {
    fetchCourses(COURSES_URL);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenDetails(JSON.parse(token));
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setUserId(JSON.parse(userId));
    }
  }, []);

  // Function to handle course enrollment
  const enrollCourse = async (courseId) => {
    try {
      const response = await fetch(ENROL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenDetails}`, 
        },
        body: JSON.stringify({
          course_id: courseId,
          user_id: userId, 
          registration_id: courseId, 
        }),
      });
      if (response.ok) {
        console.log('Course enrolled successfully');
      } else {
        console.error('Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  // Function to handle search query submission
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      fetchCourses(`${SEARCH_URL}/${searchQuery}`);
    } else {
      // If search query is empty, fetch all courses
      fetchCourses(COURSES_URL);
    }
  };

  return (
    <div className="course-details">
      <h2>Available Courses</h2>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for courses..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <button onClick={() => enrollCourse(course.id)}>Enroll</button>
        </div>
      ))}
    </div>
  );
};

export default CourseDetails;


