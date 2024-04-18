import React, { useState } from "react";
import ModuleForm from "./Components/Module";
import LectureForm from "./Components/Lecture";
import CourseForm from "./Components/Course";
import NotesForm from "./Components/Notes";
import "./index-Neuman.css";
import "./App.css";

function Tutor() {
  const [activeForm, setActiveForm] = useState(null);

  const handleButtonClick = (formName) => {
    setActiveForm(formName);
  };

  const renderForm = () => {
    switch (activeForm) {
      case "module":
        return <ModuleForm />;
      case "lecture":
        return <LectureForm />;
      case "course":
        return <CourseForm />;
      case "notes":
        return <NotesForm />;
      default:
        return null;
    }
  };

  return (
    <div className="tutor-container">
      <div>
        <header className="header">Welcome Tutor</header>
      </div>
      <div className="buttons-top">
        <button className="button" onClick={() => handleButtonClick("module")} key="button1">
          Add Module
        </button>
        <button className="button" onClick={() => handleButtonClick("lecture")} key="button2">
          Add Lecture
        </button>
        <button className="button" onClick={() => handleButtonClick("course")} key="button3">
          Add Course
        </button>
        <button className="button" onClick={() => handleButtonClick("notes")} key="button4">
          Add Notes
        </button>
      </div>
      {renderForm()}
    </div>
  );
}

export default Tutor;


