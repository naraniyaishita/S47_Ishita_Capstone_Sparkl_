import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Add.css";
import placeHolder from '../../assets/placeHolder.jpg'

function AddWatch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [page, setPage] = useState(1);
  const [noResult, setNoResult] = useState(false);

  const options = {
    method: "GET",
    url: `https://www.omdbapi.com/?s=${searchTerm}&t=${searchTerm}&apikey=3cb6abaf&page=${page}`,
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setSearchResult([]);
      const response = await axios.request(options);
      if (response.data.Response === "True") {
        setNoResult(false);
        const newResults = response.data.Search || [];
        setSearchResult((prevResults) => [...prevResults, ...newResults]);
        console.log(response.data);
        console.log(searchResult);
      } else {
        console.log("No results found");
        setNoResult(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadMore = async () => {
    setPage(page + 1);
    const response = await axios.request(options);
    const newResults = response.data.Search || [];
    setSearchResult((prevResults) => [...prevResults, ...newResults]);
    console.log(response.data);
    console.log(searchResult);
  };

  const handleAdd = (watch) => {
    navigate("/watchlist/add/form", { state: { watch } });
  };

  return (
    <div>
      <form className="addSearch" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      {noResult ? (
        <p>
          No results found add manually ?{"  "}
          <button onClick={handleAdd}>Add</button>{" "}
        </p>
      ) : (
        searchResult.length > 0 && (
          <div>
            <div className="searchResults">
              {searchResult.map((watch) => (
                <div key={watch.id} className="searchResult">
                  <img
                     src={watch.Poster !== 'N/A' ? watch.Poster : placeHolder} 
                     alt={watch.Title} 
                     style={{ maxWidth: '200px' }} 
                  />
                  <h3>{watch.Title}</h3>
                  <p>{watch.Released}</p>
                  <button onClick={() => handleAdd(watch)}>Add</button>
                </div>
              ))}
            </div>
            <button onClick={handleLoadMore} className="loadMore">
              Load More...
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default AddWatch;
