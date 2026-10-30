import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import "./Styles/Nav.css";
import UserContext from "./User/UserContext";

const pages = [
  { name: "Home", path: "/home" },
  { name: "Search", path: "/spotify/search" },
  { name: "Library", path: "/spotify/library" },
  { name: "Bookshelf", path: "/bookshelf" },
  { name: "Watchlist", path: "/watchlist" },
  { name: "Blogs", path: "/blogs" },
];

function Navbar() {
  const navigate = useNavigate();
  const { setUserName, setUserEmail, setUserId, setToken } = useContext(UserContext);

  const logout = () => {
    sessionStorage.clear();
    setUserName("");
    setUserEmail("");
    setUserId("");
    setToken("");
    navigate("/login");
  };

  return (
    <nav className="nav" role="navigation" aria-label="Main Navigation">
      <div className="logo" onClick={() => navigate("/home")} role="button">
        <span className="app">Sparkl  </span>
      </div>
      <div className="linkButton" role="menubar">
        {pages.map((page) => (
          <button
            key={page.name}
            role="menuitem"
            onClick={() => navigate(page.path)}
          >
            {page.name}
          </button>
        ))}
        <button onClick={logout} className="logoutButton">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
