import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Spotify.css";

function Spotify() {
  const AUTH_ENDPOINT =
    "https://accounts.spotify.com/authorize?client_id=4da89da73adc4953a375cc7d7106cb0c&response_type=token&redirect_uri=https://sparkl.pages.dev/home&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20user-top-read%20ugc-image-upload%20app-remote-control%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-follow-modify%20user-follow-read%20user-read-playback-position%20user-read-recently-played";

  const [token, setToken] = useState("");

  const [searchKey, setSearchKey] = useState("");
  const [SearchData, setSearchData] = useState([]);

  const [topArtists, setTopArtists] = useState([]);
  const [likedSongData, setLikedSongData] = useState([]);

  const [isLikedLoading, setIsLikedLoading] = useState(false);
  const [isTopLoading, setIsTopLoading] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [CurrentSong, setCurrentSong] = useState("");

  const [searchType, setSearchType] = useState("artist");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDevice, setActiveDevice] = useState(null);

  //setToken
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  //search artist
  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: searchType,
      },
    });
    console.log(data);
    const searchResults = data[`${searchType}s`].items;
    setSearchData(searchResults);
  };

  //get top artist
  const topArtist = async () => {
    setIsTopLoading(true);
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTopArtists(response.data.items);
    } catch (error) {
      console.error("Failed to fetch top artists:", error);
    } finally {
      setIsTopLoading(false);
    }
  };

  const renderTopArtist = () => {
    return topArtists.map((artist) => <div key={artist.id}>{artist.name}</div>);
  };

  const renderArtists = () => {
    // console.log("SearchData", SearchData);
    return SearchData.map((data) => (
      <div key={data.id} className="searchItem">
        {console.log(data)}
        {data.images ? (
          <img src={data.images[1].url} alt="" className="searchImg" />
        ) : (
          <div>No Image</div>
        )}
        {data.name}
      </div>
    ));
  };

  const getLikedSongs = async () => {
    setIsLikedLoading(true);
    let offset = 0;
    let hasMore = true;
    let songData = [];

    while (hasMore) {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/tracks?limit=20&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        songData = songData.concat(response.data.items);
        console.log(songData);
        offset += 20;
        hasMore = response.data.next !== null;
      } catch (error) {
        console.error("Failed to fetch liked songs:", error);
        break;
      }
    }
    setIsLikedLoading(false);
    setLikedSongData(songData);
    console.log(likedSongData);
  };


  const Pause = async () => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Paused");
    } catch (error) {
      console.error("Failed to pause", error);
    }
  };

  const Play = async () => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Playing");
    } catch (error) {
      console.error("Failed to play", error);
    }
  };
  const Next = async () => {
    try {
      await axios.post(
        `https://api.spotify.com/v1/me/player/next`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Next");
    } catch (error) {
      console.error("Failed to next", error);
    }
  };
  const Previous = async () => {
    try {
      await axios.post(
        `https://api.spotify.com/v1/me/player/previous`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Previous");
    } catch (error) {
      console.error("Failed to previous", error);
    }
  };

  const Shuffle = async () => {
    try {
      setIsShuffle(!isShuffle);
      await axios.put(
        `https://api.spotify.com/v1/me/player/shuffle?state=${isShuffle}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Shuffle");
    } catch (error) {
      console.error("Failed to shuffle", error);
    }
  };

  const playSelectedSong = async (uri) => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris: [uri] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Playing selected song");
    } catch (error) {
      console.error("Failed to play selected song", error);
    }
  };
  useEffect(() => {

    if (token) {
      checkDevices();
      fetchCurrentSong();
      State();
    }
    
  }, [token]);
  const fetchCurrentSong = async () => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.item) {
        setCurrentSong(response.data.item.name);
      } else {
        setCurrentSong("No Song Playing");
      }
    } catch (error) {
      console.error("Failed to fetch current song", error);
    }
  };
  const checkDevices = async () => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/devices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const devices = response.data.devices;
      const activeDevice = devices.find((device) => device.is_active);

      if (activeDevice) {
        setActiveDevice(activeDevice.id);
      } else {
        console.error("No active devices found");
      }
    } catch (error) {
      console.error("Failed to fetch devices", error);
    }
  };
  const State = async () => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/player`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setIsPlaying(response.data.is_playing);
    } catch (error) {
      console.error("Failed to get player state", error);
    }
  };
 const refresh =() =>{
  State()
  fetchCurrentSong()
  checkDevices()
 }

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    window.location.href = "/home";
    window.location.reload();
  };
  return (
    <>
      {!token ? (
        <div className="Spotify">
          <header className="App-header">
            <h1>Spotify</h1>
            <a href={AUTH_ENDPOINT}>Login to Spotify</a>
          </header>
        </div>
      ) : (
        <div className="Spotify">
          <header className="App-header">
            <h1>Spotify</h1>
            <button onClick={logout}>Logout</button>
          </header>
          <div className="SpotifyButtons">
            <button onClick={refresh}>Refresh</button>
            {isPlaying ? (
              <button onClick={Pause}>Pause</button>
            ) : (
              <button onClick={Play}>Play</button>
            )}
            <p>{CurrentSong}</p>
            <button onClick={Pause}>Pause</button>
            <button onClick={Play}>Play</button>
            <button onClick={Next}>Next</button>
            <button onClick={Previous}>Previous</button>
            <button onClick={Shuffle}>Shuffle</button>
          </div>
          <div className="SpotifyData">
            <div className="SpotifySearch">
              <form onSubmit={searchArtists} className="SearchFormSpotify">
                <div>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="artist">Artist</option>
                    <option value="album">Album</option>
                    <option value="playlist">Playlist</option>
                    <option value="track">Track</option>
                    <option value="show">Show</option>
                    <option value="episode">Episode</option>
                    <option value="audiobook">Audiobook</option>
                  </select>
                  <input
                    type="text"
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <button type={"submit"}>Search</button>
                </div>
              </form>
              <div className="searchResultsSpotify">{renderArtists()}</div>
            </div>

            <div>
              <button onClick={topArtist}>Top Artist</button>
              {isTopLoading ? <div>Loading...</div> : renderTopArtist()}
            </div>
            <div className="SpotifyLiked">
              <button onClick={getLikedSongs}>Get Liked Songs</button>
              {isLikedLoading ? (
                <div>Loading...</div>
              ) : (
                likedSongData.map((song, index) => (
                  <div key={index} className="LikedSongs">
                    <p>
                      {index + 1}. {song.track.name}
                    </p>

                    <button onClick={() => playSelectedSong(song.track.uri)}>
                      Play
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Spotify;
