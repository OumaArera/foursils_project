import React, { useState, useEffect } from 'react';
import Search from './Search';

const SEARCH_URL = "http://127.0.0.1:5000/user/search/courses/";

const SearchCourses = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [tokenDetails, setTokenDetails] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setTokenDetails(JSON.parse(token));
    }
  }, []);

  const handleSearch = async (searchTerm) => {
    try {
      if (searchTerm.trim() !== "") {
        setLoading(true);
        const response = await fetch(`${SEARCH_URL}/${searchTerm}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${tokenDetails}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          setError(null);
        } else if (response.status === 404) {
          setError("No results found for the search term");
        } else {
          setError("Failed to fetch search results. Please try again later.");
        }
      } else {
        setSearchResults([]);
        setError("Please enter a search term");
      }
    } catch (error) {
      setError("An error occurred while searching. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Course Search</h1>
      <Search onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {searchResults.length === 0 && !error && !loading ? (
          <p>No results found</p>
        ) : (
          searchResults.map((course) => (
            <div key={course.id}>
              <div>{course.title}</div>
              <div>{course.description}</div>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchCourses;
