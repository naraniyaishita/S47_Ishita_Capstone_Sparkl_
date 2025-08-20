import React, {useState, useEffect, useContext} from 'react'
import Navbar from '../Navbar'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../Styles/Watchlist.css'
import UserContext from '../User/UserContext'
import Loginfirst from "../Loginfirst";

function Watchlist() {

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("All");
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true);
    const {username, userId} = useContext(UserContext);


    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePlatformChange = (e) => {
        setSelectedPlatform(e.target.value);
    };

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_SERVER}/watchList/${userId}`)
            .then((datas) => {
                setDatas(datas.data)
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [userId]);

    const filteredWatchList = datas
        .filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(
            (item) => selectedPlatform === "All" || item.whereTo === selectedPlatform
        );

    const handleDelete = async (id) => {
        try {
            await axios
                .delete(`${import.meta.env.VITE_SERVER}/watchlist/delete/${id}`)
                .then((res) => {
                    window.location.reload();
                });
        } catch (error) {
        }
    };
    return username && username.length > 0 ? (
        <>
            <Navbar/>
            <div className="watchlist-container">
                <div className="watchlist-header">
                    <h1 className="watchlist-title">Your Watch List</h1>
                    <button className="add-btn" onClick={() => navigate("/watchlist/add")}>
                         ADD
                    </button>
                </div>

                <div className="watchlist-controls">
                    <input
                        type="search"
                        value={searchQuery}
                        className="search-input"
                        onChange={handleSearchInputChange}
                        placeholder="Search movies and shows..."
                    />
                    <select
                        className="platform-select"
                        name="whereto"
                        value={selectedPlatform}
                        onChange={handlePlatformChange}
                    >
                        <option value="All">All Platforms</option>
                        <option value="Netflix">Netflix</option>
                        <option value="HBO Max">HBO Max</option>
                        <option value="Disney+">Disney+</option>
                        <option value="Hulu">Hulu</option>
                        <option value="Amazon Prime">Amazon Prime</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <p className="loading-text">Loading your watchlist...</p>
                    </div>
                ) : (
                    <div className="watchlist-grid">
                        {filteredWatchList && filteredWatchList.length > 0 ? (
                            filteredWatchList.map((item) => (
                                <div key={item._id} className="watch-card">
                                    <div className="card-image-container">
                                        <img
                                            src={item.coverImageURL}
                                            alt={item.title}
                                            className="card-image"
                                        />
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">{item.title}</h3>
                                        <div className="card-genres">
                                            {item.genre &&
                                                item.genre.map((genre, id) => (
                                                    <span key={id} className="genre-tag">
                            {genre}
                          </span>
                                                ))}
                                        </div>
                                        <p className="card-platform">
                                            <span className="platform-label">Where to watch:</span> {item.whereTo}
                                        </p>
                                        <div className="card-actions">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => navigate(`/watchlist/${item._id}/edit`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="action-btn remove-btn"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p className="empty-message">
                                    Your watchlist is empty
                                </p>
                                <p className="empty-submessage">
                                    Start building your collection by adding movies and shows you want to watch
                                </p>
                                <button
                                    className="empty-action-btn"
                                    onClick={() => navigate("/watchlist/add")}
                                >
                                    Add Your First Item
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    ) : <Loginfirst/>
}

export default Watchlist