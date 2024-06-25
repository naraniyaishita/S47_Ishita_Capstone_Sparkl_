import React, { useState, useContext } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function AddBookForm() {
  const location = useLocation();
  const { book } = location.state;
  const [title, setTitle] = useState(book.title)
  const [coverImageURL, setCoverImageURL] = useState(`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`)
  const [author, setAuthor] = useState(book.author_name[0]);
  const [wantTo, setWantTo] = useState("read");
  const [genreInput, setGenreInput] = useState('');

  const  userId  = "6624c26997d84aa1a02bc970";

  const navigate = useNavigate();
  

  const handleGenreInputChange = (e) => {
    setGenreInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const genreArray = genreInput.split(',').map(genre => genre.trim());

      const postData = {
        userId,
        title,
        coverImageURL,
        author,
        wantTo,
        genres: genreArray
      };

      const response = await axios.post('http://localhost:2004/books', postData);
      console.log(response.data);
      navigate('/bookshelf')
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <form action="">
        <label htmlFor="">Enter Book Title</label>
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
        <label htmlFor="">Enter Author</label>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <br />
        <label htmlFor="">Enter Genre (separated by commas)</label>
        <input
          type="text"
          placeholder='Genre'
          value={genreInput}
          onChange={handleGenreInputChange} />
        <br />
        <label htmlFor="">Want to ?</label>
        <select name="wantTo" id="" value={wantTo} onChange={(e) => setWantTo(e.target.value)}>
          <option value="read">Read</option>
          <option value="already">Already</option>
          <option value="reading">Reading</option>
        </select>
        <br />
        <button type="submit" onClick={handleSubmit}>Add Book</button>
      </form>
    </div>
  )
}
export default AddBookForm