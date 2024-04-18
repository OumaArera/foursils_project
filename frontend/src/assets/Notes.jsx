import React, { useState, useEffect } from "react";

const LECTURES_URL = "http://127.0.0.1:5000/user/lecture"
const NOTES_URL = "http://127.0.0.1:5000/user/create/notes"

function NotesForm() {

    const [lectures, setLectures] = useState([])
    const [selectedLecture, setSelectedLecture] = useState("")
    const [tokenDetails, setTokenDetails] = useState("")
    const [notes, setNotes] = useState({
        topic : "",
        content : ""
    })

    useEffect(() =>{
        getLectures()
    },[])

    // const token = localStorage.getItem('access_token');
    // const token = localStorage.getItem('access_token');
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenDetails(JSON.parse(token));
    }
  }, []);

    const getLectures = async () =>{
        try {
            const response = await fetch(LECTURES_URL, {
                method : "GET",
                headers: {
                    'Authorization': `Bearer ${tokenDetails}`
                }
            })
            if (response.ok){
                const data = await response.json()
                setLectures(data)
            }
            
        } catch (error) {
            
        }
    }

    const handleLecture = event =>{
        setSelectedLecture(event.target.value)
    }

    const handleNotes = e =>{
        const {name, value} = e.target;

        setNotes(prev =>({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmitNotes = async event =>{
        event.preventDefault()

        const newNotes = {
            topic: notes.topic,
            content: notes.content,
            lecture_id: selectedLecture
        }

        try {
            const response = await fetch(NOTES_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenDetails}`
                },
                body: JSON.stringify(newNotes)
            })

            if (response.ok){
                console.log('Notes created successfully');

            } else {
              console.error('Failed to create lecture');
            }
            
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmitNotes}>
        <h2>Notes Form</h2>

        <select id="lecture" name="course" value={selectedLecture} onChange={handleLecture}>
          <option value="">Select a course</option>
          {lectures.map(lecture => (
            <option key={lecture.id} value={lecture.id}>
              {lecture.title}
            </option>
          ))}
        </select>

        <label htmlFor="topic">Topic:</label>
        <input 
        type="text" 
        id="topic" 
        name="topic" 
        value={notes.topic}
        onChange={handleNotes}
        />

        <label htmlFor="content">Content:</label>
        <textarea 
        id="content" 
        name="content" 
        rows="4" 
        cols="50"
        value={notes.content}
        onChange={handleNotes}
        >

        </textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NotesForm;





