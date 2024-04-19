import React, { useState, useEffect } from 'react';


const MY_COURSES_URL = "http://127.0.0.1:5000/user/my/courses"

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenDetails, setTokenDetails] = useState("")
  const [userId, setUserId] = useState("")

  // const token = localStorage.getItem('access_token');
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


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${MY_COURSES_URL}/${userId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${tokenDetails}`
            }
        });

        if (response.ok){
            const data = await response.json()
            setCourses(data)
        }
        
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;




