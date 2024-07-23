import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Add.css";
import placeHolder from '../../assets/placeHolder.jpg'
import UserContext from "../User/UserContext";
import Loginfirst from "../Loginfirst";


function AddWatch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [page, setPage] = useState(1);
  const [noResult, setNoResult] = useState(false);

  const { username } = useContext(UserContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);  
    try {
      setSearchResult([]);
      const response = await axios.get(`https://www.omdbapi.com/?s=${searchTerm}&t=${searchTerm}&apikey=3cb6abaf&page=1`);
      if (response.data.Response === "True") {
        setNoResult(false);
        const newResults = response.data.Search || [];
        setSearchResult(newResults);
      } else {
        console.log("No results found");
        setNoResult(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadMore = async () => {
    const newPage = page + 1;
    setPage(newPage);
    try {
      const response = await axios.get(`https://www.omdbapi.com/?s=${searchTerm}&t=${searchTerm}&apikey=3cb6abaf&page=${newPage}`);
      const newResults = response.data.Search || [];
      setSearchResult((prevResults) => [...prevResults, ...newResults]);
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = (watch) => {
    navigate("/watchlist/add/form", { state: { watch } });
  };

  return username && username.length > 0 ?(
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
                <div key={watch.imdbID} className="searchResult">
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
  ) : <Loginfirst/>
}

export default AddWatch;
