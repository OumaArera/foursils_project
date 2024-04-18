import React, { useState, useEffect } from 'react';
import CourseContent from './CourseContent';
import CourseCard from './CourseCard'; // Import the CourseCard component

function ExploreCourses() {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/user/courses');
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const enrollCourse = async (courseId) => {
        try {
            const response = await fetch('/user/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ course_id: courseId, user_id: userID }),
            });
            if (!response.ok) {
                throw new Error('Failed to enroll in course');
            }
            const data = await response.json();
            console.log('Enrollment successful:', data);
            // Optionally, you can update the UI to reflect the enrollment status
        } catch (error) {
            console.error('Error enrolling in course:', error);
        }
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
    };

    const handleDropCourse = () => {
        setSelectedCourse(null);
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() !== "") {
            try {
                const response = await fetch(`/user/search/courses/${query}`);
                if (!response.ok) {
                    throw new Error('Failed to search for courses');
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error searching for courses:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div>
            <h2>Explore All Courses</h2>
            <input
                type="text"
                placeholder="Search courses by title"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults.length > 0 ? (
                <div>
                    {searchResults.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            enrollCourse={enrollCourse}
                            handleCourseClick={handleCourseClick}
                        />
                    ))}
                </div>
            ) : (
                <div>
                    {courses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            enrollCourse={enrollCourse}
                            handleCourseClick={handleCourseClick}
                        />
                    ))}
                </div>
            )}
            {selectedCourse && (
                <CourseContent course={selectedCourse} onDropCourse={handleDropCourse} />
            )}
        </div>
    );
}

export default ExploreCourses;
