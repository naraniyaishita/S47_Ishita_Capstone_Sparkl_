import React, { useContext } from "react";
import Navbar from "./Navbar";
import UserContext from "./User/UserContext";
import "./Styles/Home.css";
import Spotify from "./Pages/Spotify";
function HomePage() {
  const { username } = useContext(UserContext);
  return (
    <div>
      <Navbar />
      <h1 id="helloUser">Hello, {username} </h1>
      <div>
        <Spotify />
      </div>
    </div>
  );
}

export default HomePage;
