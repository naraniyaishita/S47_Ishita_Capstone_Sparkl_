import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../User/UserContext';

function AddWatchlistForm() {
  const location = useLocation();
  const { watch } = location.state;
  const [title, setTitle] = useState(watch.Title);
  const [type, setType] = useState(watch.Type === "series" ? "Series" : "Movie");
  const [coverImageURL, setCoverImageURL] = useState(watch.Poster);
  const [genreInput, setGenreInput] = useState("");
  const [whereTo, setWhereTo] = useState("");
  const { userId } = useContext(UserContext);

  
  const navigate = useNavigate();

  const handleGenreInputChange = (e) => {
    setGenreInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const genreArray = genreInput.split(',').map(genre => genre.trim());
    

      const response = await axios.post(`${import.meta.env.VITE_SERVER}/watchList`, {
        userId,
        title,
        coverImageURL,
        type,
        genre: genreArray,
        whereTo,
      });
      navigate('/watchlist');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Enter Title</label>
        <input
          type="text"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label htmlFor="coverImageURL">Enter Cover Image URL</label>
        <input
          type="text"
          id="coverImageURL"
          placeholder="Cover Image URL"
          value={coverImageURL}
          onChange={(e) => setCoverImageURL(e.target.value)}
        />
        <br />
        <label htmlFor="type">Enter Type</label>
        <input
          type="text"
          id="type"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <br />
        <label htmlFor="genre">Enter Genre</label>
        <input
          type="text"
          id="genre"
          placeholder="Genre"
          value={genreInput}
          onChange={handleGenreInputChange}
        />
        <br />
        <label htmlFor="whereTo">Enter Where To Watch</label>
        <select
          id="whereTo"
          value={whereTo}
          onChange={(e) => setWhereTo(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Netflix">Netflix</option>
          <option value="HBO Max">HBO Max</option>
          <option value="Disney+">Disney+</option>
          <option value="Hulu">Hulu</option>
          <option value="Amazon Prime">Amazon Prime</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddWatchlistForm;
