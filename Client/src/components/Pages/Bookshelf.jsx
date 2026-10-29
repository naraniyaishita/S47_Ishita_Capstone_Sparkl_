import React from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/BookShelf.css";
import UserContext from "../User/UserContext";
import Loginfirst from "../Loginfirst";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BookShelf() {
  const navigate = useNavigate();
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/books`)
      .then((books) => {
        setBooks(books.data)
        setLoading(false);
      })
      .catch((err) =>{
        setLoading(false);
      });
  }, []);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER}/books/delete/${id}`).then(res => {
        
        window.alert('Are you sure you want to delete this item?')
        window.location.reload()
      })
      
    } catch (error) {
      toast.error("Failed to delete book. Please try again.", {});
    }
  };

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER}/books/update/${bookId}`, { wantTo: newStatus });
      setBooks(Books.map(book => book._id === bookId ? { ...book, wantTo: newStatus } : book));
    } catch (error) {
      toast.error("Error encountered while updating book status. Please try again.")
    }
 };

  return isAuthenticated ?(
    <>
      <Navbar />
      
      <div className="shelfTitle">
      <ToastContainer autoClose={2000} style={{width: '30vw', height:'14vh'}}/>
        <button className="AddBtn"  onClick={() => navigate('/books/add')}>
          {" "}
           ADD BOOK{" "}
        </button>
        <h2>Your Book Shelf</h2>
      </div>

      {loading ? (
        <div className="loading">
          <p>Loading books...</p>
        </div>
      ) : (
        Books.length === 0 ? (
          <div className="book-empty-state">
            <h2>Your bookshelf is empty</h2>
            <p>Start building your collection by adding books you want to read</p>
            <button onClick={() => navigate('/books/add')}>Add Your First Book</button>
          </div>
        ) : (
        <div className="bookShelf">
          <div className="shelf">
            <h2 className="shelfSubTitle">Currently Reading</h2>
            <div className="books">
              {Books.filter((book) => book.wantTo === "reading").map((book) => (
                <div className="book" key={book._id}>
                  <div>
                    <img
                      src={book.coverImageURL}
                      alt={book.title}
                      className="bookCover"
                    />
                  </div>
                  <div className="bookInfo">
                    <di className="bookTitle">{book.title} </di>
                    <p className="bookAuthor">{book.author}</p>
                    <div className="bookGenreDiv">
                      {book.genres.map((genre, id) => (
                        <p key={id} className="bookGenre">
                          {genre}
                        </p>
                      ))}
                    </div>
                    <div className="bookOptions">
                      <select
                        name=""
                        id=""
                        onChange={(e) =>
                          handleStatusChange(book._id, e.target.value)
                        }
                      >
                        <option value="reading">Currently Reading</option>
                        <option value="read">Want to read</option>
                        <option value="already">Already Read</option>
                      </select>
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="shelf">
            <h2 className="shelfSubTitle">Want to Read</h2>
            <div className="books">
              {Books.filter((book) => book.wantTo === "read").map((book) => (
                <div className="book" key={book._id}>
                  <div>
                    <img
                      src={book.coverImageURL}
                      alt={book.title}
                      className="bookCover"
                    />
                  </div>
                  <div className="bookInfo">
                    <h3 className="bookTitle">{book.title}</h3>
                    <p className="bookAuthor">{book.author}</p>
                    <div className="bookGenreDiv">
                      {book.genres &&
                        book.genres.map((genre, id) => (
                          <p key={id} className="bookGenre">
                            {genre}
                          </p>
                        ))}
                    </div>
                    <div className="bookOptions">
                      <select
                        name=""
                        id=""
                        onChange={(e) =>
                          handleStatusChange(book._id, e.target.value)
                        }
                      >
                        <option value="read">Want to read</option>
                        <option value="reading">Currently Reading</option>
                        <option value="already">Already Read</option>
                      </select>
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="shelf">
            <h2 className="shelfSubTitle">Already Read</h2>
            <div className="books">
              {Books.filter((book) => book.wantTo === "already").map((book) => (
                <div className="book" key={book._id}>
                  <div>
                    <img
                      src={book.coverImageURL}
                      alt={book.title}
                      className="bookCover"
                    />
                  </div>
                  <div className="bookInfo">
                    <h3 className="bookTitle">{book.title}</h3>
                    <p className="bookAuthor">{book.author}</p>
                    <div className="bookGenreDiv">
                      {book.genres &&
                        book.genres.map((genre, id) => (
                          <p key={id} className="bookGenre">
                            {genre}
                          </p>
                        ))}
                    </div>
                    <div className="bookOptions">
                      <select
                        name=""
                        id=""
                        onChange={(e) =>
                          handleStatusChange(book._id, e.target.value)
                        }
                      >
                        <option value="already">Already Read</option>
                        <option value="read">Want to read</option>
                        <option value="reading">Currently Reading</option>
                      </select>
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )
      )}
    </>
  ) : <Loginfirst />;
}

export default BookShelf;
