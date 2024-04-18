// CourseCard.jsx

import React from 'react';

function CourseCard({ course, onEnroll, onViewDetails }) {
    return (
        <div className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button onClick={() => onEnroll(course.id)}>Enroll</button>
            <button onClick={() => onViewDetails(course)}>View Details</button>
        </div>
    );
}

export default CourseCard;
