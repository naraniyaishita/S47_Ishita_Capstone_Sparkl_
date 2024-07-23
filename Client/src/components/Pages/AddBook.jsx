import React, { useState, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Add.css'
import bookCover from '../../assets/bookCover.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../User/UserContext';
import Loginfirst from '../Loginfirst';
function AddBook() {
  const {username } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const searchBooks = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?title=${searchTerm}`);
      setResults(response.data.docs);
      console.log(response.data.docs);
    } catch (error) {
      toast.error("Error fetching data")
      console.error('Error fetching data: ', error);
    }
    finally {
      setLoading(false); 
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    searchBooks();
  };

  const handleAdd =(book) => {
    navigate('/books/add/form', {state :{book}})
  }
  
  return  username && username.length > 0 ?(
    <div >
      <ToastContainer style={{width: '30vw', height:'14vh'}} autoClose={3000}/>
      <form onSubmit={handleSearch} className='addSearch'>
        <input
          type="text"
          placeholder="Search for a book"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
      {loading ? ( 
        <div className='loadingMessage'>Searching for your book...</div>
      ) : (
        <div className='searchResults'>
          {results.map((book) => (
            <div key={book.key} className='searchResult'>
              <img 
                src={ book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : bookCover}  
                alt={book.title}
              />
              <h3>{book.title}</h3>
              <button onClick={() => handleAdd(book)}>Add</button>
            </div>
          ))}
        </div>
      )}
    </div>
  ):<Loginfirst/>
}

export default AddBook
