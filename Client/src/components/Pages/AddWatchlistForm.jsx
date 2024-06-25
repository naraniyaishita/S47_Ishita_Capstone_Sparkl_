import React, { useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

function AddWatchlistForm() {
  const location = useLocation();
  const { watch } = location.state;
  console.log(watch);
  const [title, setTitle] = useState(watch.Title)
  const [type, setType] = useState(watch.Type)
  const [coverImageURL, setCoverImageURL] = useState(watch.Poster)
  const [genreInput, setGenreInput] = useState("")
  const [whereTo, setWhereTo] = useState("")
  const  userId  = "6624c26997d84aa1a02bc970";
  
 
  const navigate = useNavigate();

  const handleGenreInputChange = (e) => {
    setGenreInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const genreArray = genreInput.split(',').map(genre => genre.trim());
      console.log(genreArray);
      setTitle(watch.Title)
      setCoverImageURL(watch.Poster)
      if (watch.Type == "series") {
        setType("Series")
      }
      else {
        setType("Movie")
      }
      console.log(title)
      console.log(coverImageURL)
      console.log(type)
      console.log(userId)

      const response = await axios.post('http://localhost:2004/watchList', { userId, title, coverImageURL, type, genre:genreArray , whereTo });
      console.log(response);
      navigate('/watchlist')
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Enter Title</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label htmlFor="">Enter Cover Image URL</label>
        <input
          type="text"
          placeholder="Cover Image URL"
          value={coverImageURL}
          onChange={(e) => setCoverImageURL(e.target.value)}
        />
        <br />
        <label htmlFor="">Enter Type</label>
        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <br />
        <label htmlFor="">Enter Genre</label>
        <input
          type="text"
          placeholder="Genre"
          value={genreInput}
          onChange={handleGenreInputChange}
        />
        <br />
        <label htmlFor="">Enter Where To Watch</label>
        <select name="whereTo" id="" value={whereTo} onChange={(e) => setWhereTo(e.target.value)}>
        <option value="">Select</option>
        <option value="Netflix">Netflix</option>
        <option value="HBO Max">HBO Max</option>
        <option value="Disney+">Disney+</option>
        <option value="Hulu">Hulu</option>
        <option value="Amazon Prime">Amazon Prime</option>
        <option value="Other">Other</option>
        </select>
        <br />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AddWatchlistForm