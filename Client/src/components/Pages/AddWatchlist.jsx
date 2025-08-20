import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar';
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
    const [loading, setLoading] = useState(false);

    const { username } = useContext(UserContext);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setPage(1);
        setLoading(true);
        try {
            setSearchResult([]);
            const response = await axios.get(`https://www.omdbapi.com/?s=${searchTerm}&t=${searchTerm}&apikey=3cb6abaf&page=1`);
            if (response.data.Response === "True") {
                setNoResult(false);
                const newResults = response.data.Search || [];
                setSearchResult(newResults);
            } else {
                setNoResult(true);
            }
        } catch (error) {
            console.error(error);
            setNoResult(true);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        const newPage = page + 1;
        setPage(newPage);
        setLoading(true);
        try {
            const response = await axios.get(`https://www.omdbapi.com/?s=${searchTerm}&t=${searchTerm}&apikey=3cb6abaf&page=${newPage}`);
            const newResults = response.data.Search || [];
            setSearchResult((prevResults) => [...prevResults, ...newResults]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = (watch) => {
        navigate("/watchlist/add/form", { state: { watch } });
    };

    const handleManualAdd = () => {
        const emptyWatch = {
            Title: "",
            Type: "movie",
            Poster: "",
            Year: ""
        };
        navigate("/watchlist/add/form", { state: { watch: emptyWatch } });
    };

    return username && username.length > 0 ? (
        <>
            <Navbar />
            <div className="add-watchlist-container">
                <div className="add-watchlist-header">
                    <h1 className="add-watchlist-title">Add to Watchlist</h1>
                    <p className="add-watchlist-subtitle">Search for movies and TV shows to add to your collection</p>
                </div>

                <div className="search-section">
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-container">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for movies, TV shows..."
                                className="search-input-field"
                                required
                            />
                            <button type="submit" className="search-btn" disabled={loading}>
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="results-section">
                    {noResult && (
                        <div className="no-results">
                            <p className="no-results-message">No results found for "{searchTerm}"</p>
                            <p className="no-results-submessage">Try a different search term or add manually</p>
                            <button onClick={handleManualAdd} className="manual-add-btn">
                                Add Manually
                            </button>
                        </div>
                    )}

                    {loading && searchResult.length === 0 && (
                        <div className="loading-section">
                            <p className="loading-text">Searching for "{searchTerm}"...</p>
                        </div>
                    )}

                    {searchResult.length > 0 && (
                        <div className="search-results-container">
                            <div className="results-header">
                                <h2 className="results-title">Search Results</h2>
                                <p className="results-count">{searchResult.length} results found</p>
                            </div>

                            <div className="search-results-grid">
                                {searchResult.map((watch) => (
                                    <div key={watch.imdbID} className="search-result-card">
                                        <div className="result-image-container">
                                            <img
                                                src={watch.Poster !== 'N/A' ? watch.Poster : placeHolder}
                                                alt={watch.Title}
                                                className="result-image"
                                            />
                                            <div className="result-overlay">
                                                <button
                                                    onClick={() => handleAdd(watch)}
                                                    className="add-to-watchlist-btn"
                                                >
                                                    Add to Watchlist
                                                </button>
                                            </div>
                                        </div>
                                        <div className="result-content">
                                            <h3 className="result-title">{watch.Title}</h3>
                                            <div className="result-details">
                                                <span className="result-year">{watch.Year}</span>
                                                <span className="result-type">{watch.Type}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {searchResult.length > 0 && searchResult.length % 10 === 0 && (
                                <div className="load-more-section">
                                    <button
                                        onClick={handleLoadMore}
                                        className="load-more-btn"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Load More Results"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    ) : <Loginfirst />
}

export default AddWatch;