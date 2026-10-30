import React, { useContext } from "react";
import Navbar from "./Navbar";
import Loginfirst from "./Loginfirst";
import UserContext from "./User/UserContext";
import SpotifyLayout from "./Spotify/SpotifyLayout";

export default function MusicRoute() {
  const { isAuthenticated } = useContext(UserContext);

  if (!isAuthenticated) {
    return <Loginfirst />;
  }

  return (
    <div className="spk-page">
      <Navbar />
      <SpotifyLayout />
    </div>
  );
}
