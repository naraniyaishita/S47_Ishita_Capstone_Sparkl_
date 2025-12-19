import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Spotify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  TbMusic,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
  TbArrowsShuffle,
  TbRefresh,
} from "react-icons/tb";

function Spotify() {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  const AUTH_ENDPOINT =
    `https://accounts.spotify.com/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-currently-playing user-top-read playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-recently-played`;
console.log("CLIENT_ID:", import.meta.env.VITE_CLIENT_ID);
console.log("REDIRECT_URI:", import.meta.env.VITE_REDIRECT_URI);

  const [token, setToken] = useState("");

  const [searchKey, setSearchKey] = useState("");
  const [SearchData, setSearchData] = useState([]);

  const [topArtists, setTopArtists] = useState([]);
  const [likedSongData, setLikedSongData] = useState([]);

  const [isLikedLoading, setIsLikedLoading] = useState(false);
  const [isTopLoading, setIsTopLoading] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [CurrentSong, setCurrentSong] = useState("");

  const [searchType, setSearchType] = useState("track");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDevice, setActiveDevice] = useState(null);

  //setToken
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.sessionStorage.getItem("Spotifytoken");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.sessionStorage.setItem("Spotifytoken", token);

      window.history.replaceState(null, null, "/home");
    }

    setToken(token);
  }, []);
  // Cheeking token validity
  const checkTokenValidity = async () => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error("Token is invalid or expired", error);
      // logout();
      // toast.info("Please login again to continue");
      return false;
    }
  };
  // Search Songs and albums
  const searchItems = async (e) => {
    refresh();
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
    const searchResults = data[`${searchType}s`].items;
    setSearchData(searchResults);
  };
  const renderSearchResults = () => {
    return SearchData.map((data) => {
      // choose correct image path depending on type
      const imageUrl =
        searchType === "track"
          ? data.album?.images?.[2]?.url
          : data.images?.[2]?.url;

      return (
        <div key={data.id} className="searchItem">
          <button
            style={{
              backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
            }}
            onClick={() => playSelectedItem(data.uri, searchType)}
            className="PlayButton"
          >
            <TbPlayerPlayFilled />
          </button>

          <div>
            <p>{data.name}</p>
            <p>{data.artists?.[0]?.name}</p>
          </div>
        </div>
      );
    });
  };

  //Top artist
  const topArtist = async () => {
    refresh();
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
    return topArtists.map((artist) => (
      <div className="topArtists" key={artist.id}>
        {artist.name}
      </div>
    ));
  };
  // Liked songs
  const getLikedSongs = async () => {
    refresh();
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
        songData = songData.concat(response.data.items);
        offset += 20;
        hasMore = response.data.next !== null;
      } catch (error) {
        console.error("Failed to fetch liked songs:", error);
        break;
      }
    }
    setIsLikedLoading(false);
    setLikedSongData(songData);
  };

  //Playbacks

  //Pause
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
    } catch (error) {
      console.error("Failed to pause", error);
    }
  };
  //Play
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
    } catch (error) {
      console.error("Failed to next", error);
    }
  };

  //Previous
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
    } catch (error) {
      console.error("Failed to previous", error);
    }
  };
  //Shuffle
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
    } catch (error) {
      console.error("Failed to shuffle", error);
    }
  };

  //Play selected
  const playSelectedItem = async (uri, type) => {
    try {
      const requestBody =
        type === "album" ? { context_uri: uri } : { uris: [uri] };
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(`Failed to play selected ${type}`, error);
    }
  };
  //Current Song
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
  //Devices
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
        toast.error("No active devices found, Please Connect your device");
      }
    } catch (error) {
      // toast.error("Failed to fetch devices");
      console.error("Failed to fetch devices", error);
    }
  };
  //Player State
  const State = async () => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/me/player`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsPlaying(response.data.is_playing);
    } catch (error) {
      console.error("Failed to get player state", error);
    }
  };
  //Refresh
  const refresh = () => {
    checkTokenValidity();
    State();
    fetchCurrentSong();
    checkDevices();
  };
  // setInterval(refresh, 1000 * 60 * 2);
  //Logout
  const logout = () => {
    setToken("");
    window.sessionStorage.removeItem("Spotifytoken");
  };

  return (
    <>
      {!token ? (
        <div className="Spotify">
          {/* Spotify */}
          <header className="App-header">
            <h1>
              <img
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png"
                alt="spotify"
                className="SpotifyLogo"
              />{" "}
            </h1>
            <button className="SpotifyLoginButton">
              <a href={AUTH_ENDPOINT}>Login to Spotify</a>
            </button>
          </header>
        </div>
      ) : (
        <div className="Spotify">
          <header className="App-header">
            <h1>
              <img
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png"
                alt="spotify"
                className="SpotifyLogo"
              />
            </h1>
            <button onClick={logout} className="SpotifyLogoutButton">
              Logout
            </button>
          </header>
          {/* Spotify Playback Buttons */}
          <div className="SpotifyButtons">
            <div className="SpotifyPlayer">
              <button onClick={refresh}>
                {" "}
                <TbRefresh /> Refresh
              </button>

              <p className="CurrentSong">
                <TbMusic />
                {CurrentSong}
              </p>
            </div>
            <button onClick={Pause}>
              <TbPlayerPauseFilled />
            </button>
            <button onClick={Play}>
              <TbPlayerPlayFilled />
            </button>
            <button onClick={Next}>
              <TbPlayerTrackNextFilled />
            </button>
            <button onClick={Previous}>
              <TbPlayerTrackPrevFilled />
            </button>
            <button onClick={Shuffle}>
              <TbArrowsShuffle />
            </button>
          </div>
          <div className="SpotifyData">
            {/* Spotify Search */}
            <div className="SpotifySearch">
              <form onSubmit={searchItems} className="SearchFormSpotify">
                <div className="SearchInputSpotify">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="track">Track</option>
                    <option value="album">Album</option>
                  </select>
                  <input
                    type="text"
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <button type={"submit"}>Search</button>
                </div>
              </form>

              {searchKey && renderSearchResults()?.length > 0 && (
                <div className="searchResultsSpotify">
                  {renderSearchResults()}
                </div>
              )}
            </div>
            {/* Spotify Top Artist */}
            <div className="SpotifyTop">
              <button onClick={topArtist} className="SpotifyGetButton">
                Top Artist
              </button>
              {isTopLoading ? (
                <div>Loading...</div>
              ) : (
                <div> {renderTopArtist()}</div>
              )}
            </div>
            <div className="SpotifyLiked">
              <button onClick={getLikedSongs} className="SpotifyGetButton">
                Get Liked Songs
              </button>
              {isLikedLoading ? (
                <div>Loading...</div>
              ) : (
                <div className="LikedSongsContainer">
                  {likedSongData.map((song, index) => (
                    <div key={index} className="LikedSong">
                      <button
                        style={{
                          backgroundImage: `url(${song.track.album.images[2].url})`,
                        }}
                        onClick={() => playSelectedItem(song.track.uri)}
                        className="PlayButton"
                      >
                        <TbPlayerPlayFilled />
                      </button>
                      <p>{song.track.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Spotify;
