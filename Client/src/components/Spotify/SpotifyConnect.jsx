import React from "react";
import { useSpotify } from "../../spotify/SpotifyProvider";

export default function SpotifyConnect() {
  const { login } = useSpotify();

  return (
    <div className="Spotify">
      <header className="App-header">
        <h1>
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png"
            alt="spotify"
            className="SpotifyLogo"
          />
        </h1>
        <button onClick={login} className="SpotifyLoginButton">
          Login to Spotify
        </button>
      </header>
    </div>
  );
}
