import React, {useState, useEffect} from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Watchlist.css'

function Watchlist() {

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [datas, setDatas] = useState([]);
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:2004/watchList`)
      .then((datas) => setDatas(datas.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredWatchList = datas
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (item) => selectedPlatform === "All" || item.whereTo === selectedPlatform
    );

  const handleDelete = async (id) => {

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
        {filteredWatchList &&
          filteredWatchList.map((list) => {
            return (
              <div key={list._id} className="watchItem">
                {/* {console.log(list)} */}
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
            );
          })}
      </div>
    </>
  );
}



export default Watchlist
