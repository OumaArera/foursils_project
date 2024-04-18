import React from 'react';

function CourseContent({ course, onDropCourse }) {
    return (
        <div>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <button onClick={() => onDropCourse(course.id)}>Drop the course</button>
        </div>
    );
}

export default CourseContent;
