// import React, { useState, useEffect } from 'react';

// // Define API endpoints
// const COURSES_URL = "http://127.0.0.1:5000/user/courses";
// const ENROL_URL = "http://127.0.0.1:5000/user/enroll";
// const SEARCH_URL = "http://127.0.0.1:5000/user/search/courses";

// const CourseDisplay = () => {
//   // State variables
//   const [courses, setCourses] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [tokenDetails, setTokenDetails] = useState("");
//   const [userId, setUserId] = useState("");
//   const [searchMessage, setSearchMessage] = useState("");
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [enrollmentStatus, setEnrollmentStatus] = useState(null);

//   // Function to fetch courses from the backend
//   const fetchCourses = async (url) => {
//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           'Authorization': `Bearer ${tokenDetails}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setCourses(data);
//       } else {
//         console.error('Failed to fetch courses');
//       }
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     }
//   };

//   // useEffect hook to fetch courses when the component mounts
//   useEffect(() => {
//     fetchCourses(COURSES_URL);
//   }, []);

//   // useEffect hooks for fetching token and user ID from local storage
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       setTokenDetails(JSON.parse(token));
//     }
//   }, []);

//   useEffect(() => {
//     const userId = localStorage.getItem("user_id");
//     if (userId) {
//       setUserId(JSON.parse(userId));
//     }
//   }, []);

//   // Function to handle course enrollment
//   const enrollCourse = async (courseId) => {
//     try {
//       const response = await fetch(ENROL_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${tokenDetails}`,
//         },
//         body: JSON.stringify({
//           course_id: courseId,
//           user_id: userId,
//           registration_id: courseId,
//         }),
//       });
//       if (response.ok) {
//         console.log('Course enrolled successfully');
//         // Add the enrolled course to the enrolledCourses state
//         const enrolledCourse = courses.find(course => course.id === courseId);
//         setEnrolledCourses(prevCourses => [...prevCourses, enrolledCourse]);
//         setEnrollmentStatus("You have successfully enrolled for the course");
//       } else if (response.status === 409) {
//         console.error('Already enrolled in course');
//         setEnrollmentStatus("You have already enrolled for the course");
//       } else {
//         console.error('Failed to enroll in course');
//         setEnrollmentStatus("Failed to enroll in course,Confirm if you have already enrolled for the course");
//       }
//     } catch (error) {
//       console.error('Error enrolling in course:', error);
//       setEnrollmentStatus("Error enrolling in course");
//     }
//   };

//   // Function to handle search query submission
//   const handleSearch = async () => {
//     try {
//       if (searchQuery.trim() !== "") {
//         const response = await fetch(`${SEARCH_URL}/${searchQuery}`, {
//           method: "GET",
//           headers: {
//             'Authorization': `Bearer ${tokenDetails}`
//           }
//         });
//         if (response.ok) {
//           const data = await response.json();
//           if (data.length === 0) {
//             setSearchMessage("Course Not On Offer");
//           } else {
//             setSearchMessage("");
//             setCourses(data);
//           }
//         } else {
//           console.error('Error searching for courses:', response.statusText);
//           setSearchMessage("Course Not On Offer");
//         }
//       } else {
//         setSearchMessage("Please type in the search bar the course you are interested in");
//         fetchCourses(COURSES_URL); // Fetch all courses if search query is empty
//       }
//     } catch (error) {
//       console.error('Error searching for courses:', error.message);
//       setSearchMessage("Error searching for courses");
//     }
//   };

//   return (
//     <div className="course-details">
//       <h2>Available Courses</h2>
//       {/* Search bar */}
//       <div>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search for courses..."
//         />
//         <button onClick={handleSearch}>Search</button>
//       </div>
//       {/* Search message */}
//       {searchMessage && <p>{searchMessage}</p>}
//       {/* Display available courses */}
//       {courses.length === 0 ? (
//         <p>No courses available.</p>
//       ) : (
//         courses.map(course => (
//           <div key={course.id} className="course-card">
//             <h3>{course.title}</h3>
//             <p>{course.description}</p>
//             {/* Disable enroll button if course is already enrolled */}
//             {enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id) ? (
//               <button disabled>Enrolled</button>
//             ) : (
//               <button onClick={() => enrollCourse(course.id)}>Enroll</button>
//             )}
//           </div>
//         ))
//       )}

//       {/* Display enrolled courses */}
//       <div className="my-courses">
//         {enrolledCourses.map(course => (
//           <div key={course.id} className="course-card">
//             <h3>{course.title}</h3>
//             <p>{course.description}</p>
//           </div>
//         ))}
//       </div>

//       {/* Enrollment status message */}
//       {enrollmentStatus && <p>{enrollmentStatus}</p>}
//     </div>
//   );
// };

// export default CourseDisplay;


import React, { useState, useEffect } from 'react';
import './CourseDisplay.css'; // Import the CSS file

import './CoursesDisplay.css';

// URLs for API endpoints
const COURSES_URL = "http://127.0.0.1:5000/user/courses";
const ENROL_URL = "http://127.0.0.1:5000/user/enroll";
const SEARCH_URL = "http://127.0.0.1:5000/user/search/courses";

const CourseDisplay = () => {
  // State variables
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenDetails, setTokenDetails] = useState("");
  const [userId, setUserId] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

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

  // Effect hook to fetch courses when component mounts
  useEffect(() => {
    fetchCourses(COURSES_URL);
  }, []);

  // Effect hook to retrieve token from local storage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenDetails(JSON.parse(token));
    }
  }, []);

  // Effect hook to retrieve user ID from local storage
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setUserId(JSON.parse(userId));
    }
  }, []);

  // Function to enroll in a course
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
        const enrolledCourse = courses.find(course => course.id === courseId);
        setEnrolledCourses(prevCourses => [...prevCourses, enrolledCourse]);
        setEnrollmentStatus("Course Enrolled successfully");
      } else if (response.status === 409) {
        console.error('Already enrolled in course');
        setEnrollmentStatus("You have already enrolled for the course");
      } else {
        console.error('Failed to enroll in course');
        setEnrollmentStatus("Failed to enrol in course, Confirm if you have already enrolled for the course");
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setEnrollmentStatus("Error enrolling in course");
    }
  };

  // Function to handle course search
  const handleSearch = async () => {
    try {
      if (searchQuery.trim() !== "") {
        const response = await fetch(`${SEARCH_URL}/${searchQuery}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${tokenDetails}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.length === 0) {
            setSearchMessage("Course Not On Offer");
          } else {
            setSearchMessage("");
            setCourses(data);
          }
        } else {
          console.error('Error searching for courses:', response.statusText);
          setSearchMessage("Course Not On Offer");
        }
      } else {
        setSearchMessage("Please type in the search bar the course you are interested in");
        fetchCourses(COURSES_URL);
      }
    } catch (error) {
      console.error('Error searching for courses:', error.message);
      setSearchMessage("Error searching for courses");
    }
  };

  // JSX rendering
  return (
    <div className="course-details">
      <h2>Available Courses</h2>
      {/* Search input and button */}
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for courses..."
        />
        <br/>
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search message and enrollment status messages */}
      {searchMessage && <p className="error-message">{searchMessage}</p>}
      {enrollmentStatus && <p className="error-message">{enrollmentStatus}</p>}

      {/* Display available courses */}
      <div className="course-cards">
      {courses.length !== 0 ? (
  courses.map(course => (
    <div key={course.id} className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      {/* Check if course is already enrolled */}
      {enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id) ? (
        <button disabled>Enrolled</button>
      ) : (
        <button onClick={() => enrollCourse(course.id)}>Enroll</button>
      )}
    </div>
  ))
) : (
  <p className="error-message">No courses available.</p>
)}

      </div>
      {/* Display enrolled courses */}
      <div className="my-courses">
        {enrolledCourses.map(course => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>


      {/* Enrollment status message */}
      {enrollmentStatus && <p>{enrollmentStatus}</p>}
    </div>
  );
};

export default CourseDisplay;



