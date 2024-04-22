import React, { useState, useEffect } from "react";

function LectureForm() {
  // State variables to manage form data and lectures list
  const [formData, setFormData] = useState({
    lectureTitle: '',
    title: '',
    videoUrl: '',
    duration: '',
    moduleId: ''
  });
  const [lectures, setLectures] = useState([]);

  // Effect hook to fetch all lectures when component mounts
  useEffect(() => {
    fetchAllLectures();
  }, []);

  // Function to fetch all lectures
  const fetchAllLectures = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/user/lecture');
      if (response.ok) {
        const data = await response.json();
        setLectures(data);
      } else {
        console.error('Failed to fetch lectures');
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/user/create/lecture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Refresh the list of lectures after successful creation
        fetchAllLectures();
        console.log('Lecture created successfully');
      } else {
        console.error('Failed to create lecture');
      }
    } catch (error) {
      console.error('Error creating lecture:', error);
    }
  };

  // Function to handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Lecture Form</h2>
        <label htmlFor="lectureTitle">Lecture Title:</label>
        <input type="text" id="lectureTitle" name="lectureTitle" value={formData.lectureTitle} onChange={handleChange} />

        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />

        <label htmlFor="videoUrl">Video URL:</label>
        <input type="text" id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleChange} />

        <label htmlFor="duration">Duration:</label>
        <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} />

        <label htmlFor="moduleId">Module ID:</label>
        <input type="text" id="moduleId" name="moduleId" value={formData.moduleId} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>

      {/* Display list of lectures */}
      <div>
        <h2>List of Lectures</h2>
        <ul>
          {lectures.map((lecture) => (
            <li key={lecture.id}>
              <p>Title: {lecture.title}</p>
              <p>Video URL: {lecture.video_url}</p>
              <p>Duration: {lecture.duration}</p>
              <p>Module ID: {lecture.module_id}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LectureForm;
