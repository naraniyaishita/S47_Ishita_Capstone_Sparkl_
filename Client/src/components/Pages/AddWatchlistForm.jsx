import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function AddWatchlistForm() {
  const location = useLocation();
  const { watch } = location.state;
  console.log(watch);
  const [title, setTitle] = useState(watch.Title);
  const [type, setType] = useState(watch.Type === "series" ? "Series" : "Movie");
  const [coverImageURL, setCoverImageURL] = useState(watch.Poster);
  const [genreInput, setGenreInput] = useState("");
  const [whereTo, setWhereTo] = useState("");
  const userId = "6624c26997d84aa1a02bc970";
  
  const navigate = useNavigate();

  const handleGenreInputChange = (e) => {
    setGenreInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const genreArray = genreInput.split(',').map(genre => genre.trim());
      console.log(genreArray);

      const response = await axios.post('http://localhost:2004/watchList', {
        userId,
        title,
        coverImageURL,
        type,
        genre: genreArray,
        whereTo,
      });
      console.log(response);
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
