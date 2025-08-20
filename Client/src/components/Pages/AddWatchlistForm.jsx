import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import UserContext from '../User/UserContext';
import Loginfirst from "../Loginfirst";

function AddWatchlistForm() {
    const location = useLocation();
    const { watch } = location.state || { watch: { Title: "", Type: "movie", Poster: "", Year: "" } };
    const [title, setTitle] = useState(watch.Title || "");
    const [type, setType] = useState(watch.Type === "series" ? "Series" : "Movie");
    const [coverImageURL, setCoverImageURL] = useState(watch.Poster !== "N/A" ? watch.Poster : "");
    const [genreInput, setGenreInput] = useState("");
    const [whereTo, setWhereTo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { username, userId } = useContext(UserContext);
    const navigate = useNavigate();

    const handleGenreInputChange = (e) => {
        setGenreInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            const genreArray = genreInput.split(',').map(genre => genre.trim()).filter(genre => genre);

            const response = await axios.post(`${import.meta.env.VITE_SERVER}/watchList`, {
                userId,
                title: title.trim(),
                coverImageURL: coverImageURL.trim(),
                type,
                genre: genreArray,
                whereTo,
            });
            navigate('/watchlist');
        } catch (error) {
            console.error(error);
            // You can add error handling here (toast notification, etc.)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/watchlist/add');
    };

    return username && username.length > 0 ? (
        <>
            <Navbar />
            <div className="form-container-wrapper">
                <div className="form-container-modern">
                    <div className="form-header">
                        <h1 className="form-title">Add to Your Watchlist</h1>
                        <p className="form-subtitle">Fill in the details for your movie or TV show</p>
                    </div>

                    <form onSubmit={handleSubmit} className="watchlist-form">
                        <div className="form-grid">
                            {/* Left Column */}
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="title" className="form-label">Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        placeholder="Enter movie or show title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="type" className="form-label">Type</label>
                                    <select
                                        id="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="Movie">Movie</option>
                                        <option value="Series">TV Series</option>
                                        <option value="Documentary">Documentary</option>
                                        <option value="Animation">Animation</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="genre" className="form-label">Genres</label>
                                    <input
                                        type="text"
                                        id="genre"
                                        placeholder="Action, Drama, Comedy (separate with commas)"
                                        value={genreInput}
                                        onChange={handleGenreInputChange}
                                        className="form-input"
                                    />
                                    <small className="form-help">Separate multiple genres with commas</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="whereTo" className="form-label">Where to Watch *</label>
                                    <select
                                        id="whereTo"
                                        value={whereTo}
                                        onChange={(e) => setWhereTo(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Platform</option>
                                        <option value="Netflix">Netflix</option>
                                        <option value="HBO Max">HBO Max</option>
                                        <option value="Disney+">Disney+</option>
                                        <option value="Hulu">Hulu</option>
                                        <option value="Amazon Prime">Amazon Prime</option>
                                        <option value="Apple TV+">Apple TV+</option>
                                        <option value="Paramount+">Paramount+</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor="coverImageURL" className="form-label">Cover Image URL</label>
                                    <input
                                        type="url"
                                        id="coverImageURL"
                                        placeholder="https://example.com/poster.jpg"
                                        value={coverImageURL}
                                        onChange={(e) => setCoverImageURL(e.target.value)}
                                        className="form-input"
                                    />
                                </div>

                                {/* Image Preview */}
                                {coverImageURL && (
                                    <div className="form-group">
                                        <label className="form-label">Preview</label>
                                        <div className="image-preview">
                                            <img
                                                src={coverImageURL}
                                                alt="Preview"
                                                className="preview-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cancel-btn"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting || !title.trim() || !whereTo}
                            >
                                {isSubmitting ? "Adding..." : "Add to Watchlist"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ) : <Loginfirst />
}

export default AddWatchlistForm;