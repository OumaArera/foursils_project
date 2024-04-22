import React, { useState, useEffect } from 'react';

// Define API endpoints
const MY_COURSES_URL = "http://127.0.0.1:5000/user/my/courses";
const COURSE_CONTENT_URL = "http://127.0.0.1:5000/user/";
const DROP_COURSE_URL = "http://127.0.0.1:5000/user/drop/course"

const MyCourses = () => {
  // State variables
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenDetails, setTokenDetails] = useState("");
  const [userId, setUserId] = useState("");
  const [courseContent, setCourseContent] = useState(null);

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
      const response = await fetch(`${COURSE_CONTENT_URL}/${courseId}/content`, {
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

      } else {
        console.error('Failed to drop course');

      }
    } catch (error) {
      console.error('Error dropping course:', error);
    }
  };

  // Render loading state while fetching courses
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render courses
  return (
    <div>
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses enrolled.</p>
      ) : (
        <div>
          {courses.map(course => (
            <div key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Enrollment Date: {new Date(course.enrollment_date).toLocaleDateString()}</p>
              <button onClick={() => startCourse(course.id)}>Start</button>
              <button onClick={() => dropCourse(course.id)}>Drop</button>
            </div>
          ))}
        </div>
      )}

      {/* Render course content if available */}
      {courseContent && (
        <div>
          <h2>Course Content</h2>
          {/* Render the content here */}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
