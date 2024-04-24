import React from "react";

function NotesForm() {
  return (
    <div className="form-container">
      <form>
        <h2>Notes Form</h2>
        <label htmlFor="topic">Topic:</label>
        <input type="text" id="topic" name="topic" />

        <label htmlFor="content">Content:</label>
        <textarea id="content" name="content" rows="4" cols="50"></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NotesForm;
