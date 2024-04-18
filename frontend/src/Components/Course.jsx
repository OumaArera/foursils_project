import React, { useState } from "react";

function CourseForm() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Your form submission logic here
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
