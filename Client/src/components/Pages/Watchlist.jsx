import React, {useState, useEffect, useContext} from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Watchlist.css'
import UserContext  from '../User/UserContext'

function Watchlist() {

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [datas, setDatas] = useState([]);
  const { userId } = useContext(UserContext);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/watchList/${userId}`)
      .then((datas) => setDatas(datas.data))
      .catch((err) => console.log(err));
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
        console.log(error);
      }
    };
  return (
    <>
      <Navbar />
      <h2 className="watchListTitle">Your Watch List</h2>

      <div className="search-container">
        <input
          type="search"
          value={searchQuery}
          className="search-bar"
          onChange={handleSearchInputChange}
          placeholder="Search..."
        />
        <button className="add" onClick={() => navigate("/watchlist/add")}>
         + ADD
        </button>
        <select
          className="where-to"
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

      <div className="watchList">
    {filteredWatchList && filteredWatchList.length > 0 ? (
      filteredWatchList.map((list) => (
        <div key={list._id} className="watchItem">
          <div>
            <img
              src={list.coverImageURL}
              alt=""
              className="watchItemImg"
            />
          </div>
          <div className="watchTitle">{list.title}</div>
          <div className="watchGenreDiv">
            {list.genre &&
              list.genre.map((genres, id) => (
                <p key={id} className="watchGenre">
                  {genres}
                </p>
              ))}
          </div>
          <p className="watchWhere">Where to watch : {list.whereTo}</p>
          <button
            className="remove"
            onClick={() => handleDelete(list._id)}
          >
            Remove
          </button>
          <button
            className="edit"
            onClick={() => navigate(`/watchlist/${list._id}/edit`)}
          >
            Edit
          </button>
        </div>
      ))
    ) : (
      <p className="empty-watchlist-message">
        Nothing in your watchlist. Try exploring by clicking on the add button.
      </p>
    )}
  </div>
    </>
  );
}



export default Watchlist
