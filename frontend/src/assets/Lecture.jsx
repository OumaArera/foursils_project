import React, { useState, useEffect } from "react";

const MODULES_URL ='http://127.0.0.1:5000/user/module'
const CREATE_LECTURE_URL ='http://127.0.0.1:5000/user/create/lecture'

function LectureForm() {
  // State variables to manage form data and lectures list
  const [formData, setFormData] = useState({
    lectureTitle: '',
    title: '',
    videoUrl: '',
    duration: '',
    moduleId: ''
  });

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("")
  const [tokenDetails, setTokenDetails] = useState("")

  useEffect(() => {
    fetchAllModules();
  }, []);

  // const token = localStorage.getItem('access_token');
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenDetails(JSON.parse(token));
    }
  }, []);

  const handleModule = event =>{
    setSelectedModule(event.target.value);
  }

  // const token = localStorage.getItem('access_token');

  const fetchAllModules = async () => {
    try {
      const response = await fetch(MODULES_URL, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${tokenDetails}` 
        }

      });
      if (response.ok) {
        const data = await response.json();
        setModules(data);
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

    const lectureData = {
        title: formData.title,
        video_url: formData.videoUrl,
        duration: formData.duration,
        module_id: selectedModule
      }

    try {
      const response = await fetch(CREATE_LECTURE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenDetails}`
        },
        body: JSON.stringify(lectureData)
      });

      if (response.ok) {
        console.log('Lecture created successfully');

      } else {
        console.error('Failed to create lecture');
      }
    } catch (error) {
      console.error('Error creating lecture:', error);
    }
  };

  // Function to handle form input changes
  const handleChange = event => {
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
        <select id="lecture" name="course" value={selectedModule} onChange={handleModule}>
          <option value="">Select a course</option>
          {modules.map(module => (
            <option key={module.id} value={module.id}>
              {module.title}
            </option>
          ))}
        </select>

        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />

        <label htmlFor="videoUrl">Video URL:</label>
        <input type="text" id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleChange} />

        <label htmlFor="duration">Duration:</label>
        <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>

      
    </div>
  );
}

export default LectureForm;


