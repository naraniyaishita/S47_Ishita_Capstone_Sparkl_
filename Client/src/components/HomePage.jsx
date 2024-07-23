import React, { useContext, } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UserContext from "./User/UserContext";
import "./Styles/Home.css";
import Spotify from "./Pages/Spotify";
import Loginfirst from "./Loginfirst";
function HomePage() {
  const { username } = useContext(UserContext);
  return username && username.length > 0 ? (
    <div>
      <Navbar />
      <h1 id="helloUser">Hello, {username} </h1>
      <div>
        <Spotify />
      </div>
    </div>
  ): <Loginfirst/>
}
export default HomePage;
