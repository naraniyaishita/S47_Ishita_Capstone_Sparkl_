import React from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/BookShelf.css";
import UserContext from "../User/UserContext";

function BookShelf() {
  const navigate = useNavigate();
  const [Books, setBooks] = useState([]);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`http://localhost:2004/books/${userId}`)
      .then((books) => {
        setBooks(books.data);
      })
      .catch((err) => console.log(err));
  }, [userId]);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2004/books/delete/${id}`).then(res => {
        window.location.reload()
      })
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      await axios.put(`http://localhost:2004/books/update/${bookId}`, { wantTo: newStatus });
      setBooks(Books.map(book => book._id === bookId ? { ...book, wantTo: newStatus } : book));
    } catch (error) {
      console.log(error);
    }
 };

  return (
    <>
      <Navbar />

      <h2 className="shelfTitle">
        <button className="AddBtn"  onClick={() => navigate('/books/add')}>
          {" "}
          + ADD BOOK{" "}
        </button>
        Your Book Shelf
      </h2>

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
                  <h3 className="bookTitle">{book.title} </h3>
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
    </>
  );
}

export default BookShelf;
