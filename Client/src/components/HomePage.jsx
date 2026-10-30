import React, { useContext } from "react";
import Navbar from "./Navbar";
import UserContext from "./User/UserContext";
import "./Styles/Home.css";
import Loginfirst from "./Loginfirst";
import SpotifyLayout from "./Spotify/SpotifyLayout";
import SpotifyHome from "./Spotify/pages/SpotifyHome";

function HomePage() {
  const { isAuthenticated } = useContext(UserContext);
  return isAuthenticated ? (
    <div className="spk-page">
      <Navbar />
      <SpotifyLayout>
        <SpotifyHome />
      </SpotifyLayout>
    </div>
  ) : (
    <Loginfirst />
  );
}

export default HomePage;
