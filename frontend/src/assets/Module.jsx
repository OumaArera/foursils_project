import React, { useState, useEffect } from "react";

const COURSES_URL ='http://127.0.0.1:5000/user/courses'
const MODULE_URL = 'http://127.0.0.1:5000/user/create/module'

function ModuleForm() {

  const [modules, setModules] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [tokenDetails, setTokenDetails] = useState("")
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: ''
  });

  useEffect(() => {
    
    listCourses();
  }, []);
  
  // const token = localStorage.getItem('access_token');
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenDetails(JSON.parse(token));
    }
  }, []);

  const listCourses = async () => {

    try {
      const response = await fetch(COURSES_URL, {
        method: "GET",
        headers : {
            'Authorization': `Bearer ${tokenDetails}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setModules(data);
      } else {
        throw new Error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCourseChange = event => {
    setSelectedCourse(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const moduleData = {
      title: formData.title,
      description: formData.description,
      order: formData.order,
      course_id: selectedCourse
    };

    try {
      const response = await fetch(MODULE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${tokenDetails}`
        },
        body: JSON.stringify(moduleData)
      });

      if (response.ok) {
        // Handle success, e.g., display a success message
        console.log("Module created successfully");
      } else {
        throw new Error("Failed to create module");
      }
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Module Form</h2>
        <label htmlFor="course">Select Course:</label>
        <select id="course" name="course" value={selectedCourse} onChange={handleCourseChange}>
          <option value="">Select a course</option>
          {modules.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />

        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" rows="4" cols="50" value={formData.description} onChange={handleChange}></textarea>

        <label htmlFor="order">Order:</label>
        <input type="text" id="order" name="order" value={formData.order} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ModuleForm;


