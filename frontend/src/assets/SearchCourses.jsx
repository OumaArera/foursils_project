import React, { useState, useEffect } from 'react';
import Search from './Search';

const SEARCH_URL ="http://127.0.0.1:5000/user/search/courses/"

const SearchCourses = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [tokenDetails, setTokenDetails] = useState("")


  // const token = localStorage.getItem('access_token');
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenDetails(JSON.parse(token));
    }
  }, []);

  

  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch(`${SEARCH_URL}/${searchTerm}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${tokenDetails}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Error searching for courses:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching for courses:', error.message);
    }
  };

  
  return (
    <div>
      <h1>Course Search</h1>
      <Search onSearch={handleSearch} />
      <ul>
        {searchResults.length === 0 ? (
          <li>No matching courses found</li>
        ) : (
          searchResults.map((course) => (
            <div>
                <div key={course.id}>{course.title}</div>
                <div key={course.id} >{course.description}</div>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchCourses;
