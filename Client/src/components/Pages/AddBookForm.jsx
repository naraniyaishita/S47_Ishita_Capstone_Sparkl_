import React, { useState, useContext } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../User/UserContext';
import '../Styles/Add.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loginfirst from "../Loginfirst";


function AddBookForm() {
  const location = useLocation();
  const { book } = location.state;
  const [title, setTitle] = useState(book.title)
  const [coverImageURL, setCoverImageURL] = useState(`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`)
  const [author, setAuthor] = useState(book.author_name[0]);
  const [wantTo, setWantTo] = useState("read");
  const [genreInput, setGenreInput] = useState('');

  const { username,userId } = useContext(UserContext);

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

      const response = await axios.post(`${import.meta.env.VITE_SERVER}/books`, postData);
      toast.success("Book added successfully!");
      setTimeout(()=>{
        navigate('/bookshelf')
      }, 1000)
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book. Please try again.");
    }
  }
  return username && username.length > 0 ? (
  <div className="add-book-container">
    <div className="add-book-card">
      <h2>Add a New Book</h2>
      <form>
        <label>Enter Book Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Enter Cover Image URL</label>
        <input type="text" value={coverImageURL} onChange={(e) => setCoverImageURL(e.target.value)} />

        <label>Enter Author</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />

        <label>Enter Genre (separated by commas)</label>
        <input type="text" value={genreInput} onChange={handleGenreInputChange} />

        <label>Want to?</label>
        <select value={wantTo} onChange={(e) => setWantTo(e.target.value)}>
          <option value="read">Read</option>
          <option value="already">Already</option>
          <option value="reading">Reading</option>
        </select>

        <button type="submit" onClick={handleSubmit}>Add Book</button>
      </form>
    </div>
    <ToastContainer style={{ width: '30vw', height: '14vh' }} />
  </div>
) : <Loginfirst />

}
export default AddBookForm
