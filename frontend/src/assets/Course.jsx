import React, { useState, useEffect } from "react";

const CREATE_COURSE_URL = "http://127.0.0.1:5000//user/create/courses"

const CourseForm = () => {

  const [tokenDetails, setTokenDetails] = useState("")
  const [userId, setUserId] = useState("")
  const [addCourse, setAddCourse] = useState({
    title: '',
    description: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddCourse(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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


  const handleSubmit = async event => {
    event.preventDefault();

    const newCourse = {
      title: addCourse.title,
      description: addCourse.description,
      instructor_id: userId
    }
    
    try {
        const response = await fetch(CREATE_COURSE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenDetails}` 
          },
          body: JSON.stringify(newCourse)
        });
    
        if (response.ok) {
          console.log('Course created successfully!');
          // Optionally, you can reset the form fields here
          setAddCourse({
            title: '',
            description: ''
          })
        } else {
          const data = await response.json();
          console.error('Error creating course:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Course Form</h2>
      
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={addCourse.title} onChange={handleChange} />

        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" rows="4" cols="50" value={addCourse.description} onChange={handleChange}></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CourseForm;




