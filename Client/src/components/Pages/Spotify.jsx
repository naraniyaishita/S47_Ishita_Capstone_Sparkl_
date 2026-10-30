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

function generateRandomString(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => possible[x % possible.length])
    .join("");
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
const spotifyAxios = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

let spotifyRefreshPromise;

async function refreshSpotifyToken() {
  const refreshToken = sessionStorage.getItem("SpotifyrefreshToken");

  if (!refreshToken) {
    throw new Error("Spotify refresh token not found");
  }

  try {
    const response = await spotifyAxios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        client_id: import.meta.env.VITE_CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      })
    );
    const { access_token, expires_in, refresh_token } = response.data;

    sessionStorage.setItem("Spotifytoken", access_token);
    sessionStorage.setItem(
      "SpotifytokenExpiry",
      Date.now() + expires_in * 1000
    );
    if (refresh_token) {
      sessionStorage.setItem("SpotifyrefreshToken", refresh_token);
    }

    return access_token;
  } catch (error) {
    console.error(
      "Spotify token refresh failed:",
      error.response?.data || error.message
    );
    if (error.response?.data?.error === "invalid_grant") {
      sessionStorage.removeItem("Spotifytoken");
      sessionStorage.removeItem("SpotifyrefreshToken");
      sessionStorage.removeItem("SpotifytokenExpiry");
    }
    throw error;
  }
}

async function getValidSpotifyToken() {
  const accessToken = sessionStorage.getItem("Spotifytoken");
  const expiry = sessionStorage.getItem("SpotifytokenExpiry");

  if (!accessToken) {
    throw new Error("Spotify access token not found");
  }

  const isExpired =
    !expiry || Date.now() >= Number(expiry) - 5 * 60 * 1000;

  if (!isExpired) {
    return accessToken;
  }

  if (!spotifyRefreshPromise) {
    spotifyRefreshPromise = refreshSpotifyToken().finally(() => {
      spotifyRefreshPromise = undefined;
    });
  }

  return spotifyRefreshPromise;
}

async function spotifyApiRequest(method, url, data, config = {}) {
  const accessToken = await getValidSpotifyToken();

  return axios({
    method,
    url,
    data,
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

function Spotify() {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI =
    import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/home`;
  const login = async () => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem("code_verifier", codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    scope:
      "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-currently-playing user-top-read playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-recently-played",
  });

  window.location.href =
    `https://accounts.spotify.com/authorize?${params.toString()}`;
};

  const [token, setToken] = useState(
  sessionStorage.getItem("Spotifytoken") || ""
);

  const [searchKey, setSearchKey] = useState("");
  const [SearchData, setSearchData] = useState([]);

  const [topArtists, setTopArtists] = useState([]);
  const [likedSongData, setLikedSongData] = useState([]);

  const [isLikedLoading, setIsLikedLoading] = useState(false);
  const [isTopLoading, setIsTopLoading] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const [searchType, setSearchType] = useState("track");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDevice, setActiveDevice] = useState(null);
  const [spotifyProfile, setSpotifyProfile] = useState(null);

  //setToken

  useEffect(() => {
  const exchangeToken = async () => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");
    const error = params.get("error");

    // Spotify may redirect back with an authorization error
    if (error) {
      console.error("Spotify authorization failed:", error);
      return;
    }

    // No authorization code means there is nothing to exchange
    if (!code) return;

    // Avoid exchanging the same code multiple times
    if (sessionStorage.getItem("Spotifytoken")) {
      setToken(sessionStorage.getItem("Spotifytoken"));
      return;
    }

    const codeVerifier = sessionStorage.getItem("code_verifier");

    if (!codeVerifier) {
      console.error("Spotify code verifier is missing");
      return;
    }

    try {
      const response = await spotifyAxios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        })
      );

      const { access_token, refresh_token, expires_in } = response.data;

      sessionStorage.setItem("Spotifytoken", access_token);
      if (refresh_token) {
        sessionStorage.setItem("SpotifyrefreshToken", refresh_token);
      }
      sessionStorage.setItem(
        "SpotifytokenExpiry",
        Date.now() + expires_in * 1000
      );
      sessionStorage.removeItem("code_verifier");

      setToken(access_token);

      // Remove authorization code from URL
      window.history.replaceState({}, document.title, "/home");
    } catch (error) {
      console.error(
        "Spotify token exchange failed:",
        error.response?.data || error.message
      );
    }
  };

  exchangeToken();
}, []);

  useEffect(() => {
    const restoreSpotifySession = async () => {
      if (!sessionStorage.getItem("Spotifytoken")) return;

      try {
        const validToken = await getValidSpotifyToken();
        setToken(validToken);
      } catch (error) {
        console.error("Could not restore Spotify session", error);
        setToken("");
      }
    };

    restoreSpotifySession();
  }, []);

  useEffect(() => {
    if (token) {
      topArtist();
      getLikedSongs();
      refresh();
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;
    const intervalId = window.setInterval(() => refresh(true), 30_000);
    return () => window.clearInterval(intervalId);
  }, [token]);

  // Cheeking token validity
  const checkTokenValidity = async () => {
    try {
      const response = await spotifyApiRequest(
        "get",
        "https://api.spotify.com/v1/me"
      );
      setSpotifyProfile(response.data);
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
    const { data } = await spotifyApiRequest(
      "get",
      "https://api.spotify.com/v1/search",
      undefined,
      { params: { q: searchKey, type: searchType } }
    );
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
      const response = await spotifyApiRequest(
        "get",
        "https://api.spotify.com/v1/me/top/artists",
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
        {artist.images?.[2]?.url && (
          <img src={artist.images[2].url} alt="" />
        )}
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
    const pageSize = 50;

    while (hasMore) {
      try {
        const response = await spotifyApiRequest(
          "get",
          `https://api.spotify.com/v1/me/tracks?limit=${pageSize}&offset=${offset}`,
        );
        songData = songData.concat(response.data.items);
        offset += pageSize;
        hasMore = Boolean(response.data.next);
      } catch (error) {
        console.error("Failed to fetch liked songs:", error);
        break;
      }
    }
    setIsLikedLoading(false);
    setLikedSongData(songData);
  };

  //Playbacks

  const notifyPlaybackError = (error, action = "start playback") => {
    const reason = error.response?.data?.error?.reason;
    if (error.response?.status === 404 || reason === "NO_ACTIVE_DEVICE") {
      toast.warning("No active Spotify player. Open Spotify on a device and start playback first.");
      return;
    }
    toast.error(`Couldn't ${action}. ${error.response?.data?.error?.message || "Please try again."}`);
  };

  //Pause
  const Pause = async () => {
    try {
      await spotifyApiRequest(
        "put",
        `https://api.spotify.com/v1/me/player/pause`,
        {}
      );
      setIsPlaying(false);
    } catch (error) {
      console.error("Failed to pause", error);
    }
  };
  //Play
  const Play = async () => {
    try {
      await spotifyApiRequest(
        "put",
        `https://api.spotify.com/v1/me/player/play`,
        {}
      );
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to play", error);
      notifyPlaybackError(error);
    }
  };
  const togglePlayback = () => (isPlaying ? Pause() : Play());
  const Next = async () => {
    try {
      await spotifyApiRequest(
        "post",
        `https://api.spotify.com/v1/me/player/next`,
        {}
      );
    } catch (error) {
      console.error("Failed to next", error);
    }
  };

  //Previous
  const Previous = async () => {
    try {
      await spotifyApiRequest(
        "post",
        `https://api.spotify.com/v1/me/player/previous`,
        {}
      );
    } catch (error) {
      console.error("Failed to previous", error);
    }
  };
  //Shuffle
  const Shuffle = async () => {
    try {
      const nextShuffleState = !isShuffle;
      await spotifyApiRequest(
        "put",
        `https://api.spotify.com/v1/me/player/shuffle?state=${nextShuffleState}`,
        {}
      );
      setIsShuffle(nextShuffleState);
    } catch (error) {
      console.error("Failed to shuffle", error);
    }
  };

  //Play selected
  const playSelectedItem = async (uri, type) => {
    try {
      const requestBody =
        type === "album" ? { context_uri: uri } : { uris: [uri] };
      await spotifyApiRequest(
        "put",
        `https://api.spotify.com/v1/me/player/play`,
        requestBody
      );
      setIsPlaying(true);
      State();
    } catch (error) {
      console.error(`Failed to play selected ${type}`, error);
      notifyPlaybackError(error, "play this item");
    }
  };
  //Devices
  const checkDevices = async (silent = false) => {
    try {
      const response = await spotifyApiRequest(
        "get",
        "https://api.spotify.com/v1/me/player/devices",
      );

      const devices = response.data.devices;
      const activeDevice = devices.find((device) => device.is_active);

      if (activeDevice) {
        setActiveDevice(activeDevice.id);
      } else if (!silent) {
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
      const response = await spotifyApiRequest(
        "get",
        "https://api.spotify.com/v1/me/player"
      );
      setIsPlaying(Boolean(response.data?.is_playing));
      setIsShuffle(Boolean(response.data?.shuffle_state));
      setCurrentTrack(response.data?.item || null);
    } catch (error) {
      console.error("Failed to get player state", error);
    }
  };
  //Refresh
  const refresh = (silent = false) => {
    checkTokenValidity();
    State();
    checkDevices(silent);
  };
  // setInterval(refresh, 1000 * 60 * 2);
  //Logout
  const logout = () => {
    setToken("");
    sessionStorage.removeItem("Spotifytoken");
    sessionStorage.removeItem("SpotifyrefreshToken");
    sessionStorage.removeItem("SpotifytokenExpiry");
    sessionStorage.removeItem("code_verifier");
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
            <button onClick={login} className="SpotifyLoginButton">
              Login to Spotify
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
            <div className="SpotifyHeaderActions">
              {spotifyProfile && (
                <a
                  className="SpotifyProfile"
                  href={spotifyProfile.external_urls?.spotify || `https://open.spotify.com/user/${spotifyProfile.id}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${spotifyProfile.display_name || "Spotify"} profile on Spotify`}
                >
                  {spotifyProfile.images?.[1]?.url || spotifyProfile.images?.[0]?.url ? (
                    <img
                      src={spotifyProfile.images?.[1]?.url || spotifyProfile.images?.[0]?.url}
                      alt=""
                    />
                  ) : (
                    <span>{(spotifyProfile.display_name || "S").charAt(0).toUpperCase()}</span>
                  )}
                  <span>{spotifyProfile.display_name || "Spotify profile"}</span>
                </a>
              )}
              <button onClick={logout} className="SpotifyLogoutButton">
                Logout
              </button>
            </div>
          </header>
          {/* Spotify Playback Buttons */}
          <div className="SpotifyButtons">
            <div className="SpotifyPlayer">
              <button onClick={refresh}>
                {" "}
                <TbRefresh /> Refresh
              </button>

              <div className="CurrentSong">
                {currentTrack?.album?.images?.[2]?.url ? (
                  <img
                    className="CurrentSongCover"
                    src={currentTrack.album.images[2].url}
                    alt=""
                  />
                ) : (
                  <TbMusic className="CurrentSongFallback" />
                )}
                <div className="CurrentSongDetails">
                  <strong>{currentTrack?.name || "Nothing playing"}</strong>
                  {currentTrack?.artists?.length > 0 && (
                    <span>{currentTrack.artists.map((artist) => artist.name).join(", ")}</span>
                  )}
                </div>
              </div>
            </div>
            <form onSubmit={searchItems} className="SpotifySearchBar">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                aria-label="Search type"
              >
                <option value="track">Track</option>
                <option value="album">Album</option>
              </select>
              <input
                type="search"
                value={searchKey}
                placeholder="Search Spotify..."
                onChange={(e) => setSearchKey(e.target.value)}
                aria-label="Search Spotify"
              />
              <button type="submit">Search</button>
            </form>
            {searchKey && renderSearchResults()?.length > 0 && (
              <div className="searchResultsSpotify searchResultsBar">
                {renderSearchResults()}
              </div>
            )}
            <button onClick={togglePlayback} aria-label={isPlaying ? "Pause" : "Play"} title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <TbPlayerPauseFilled /> : <TbPlayerPlayFilled />}
            </button>
            <button onClick={Next}>
              <TbPlayerTrackNextFilled />
            </button>
            <button onClick={Previous}>
              <TbPlayerTrackPrevFilled />
            </button>
            <button onClick={Shuffle} className={isShuffle ? "isActive" : ""} aria-label={`Shuffle ${isShuffle ? "on" : "off"}`} aria-pressed={isShuffle} title={`Shuffle ${isShuffle ? "on" : "off"}`}>
              <TbArrowsShuffle />
            </button>
          </div>
          <div className="SpotifyData">
            {/* Spotify Top Artist */}
            <div className="SpotifyTop">
              <div className="SpotifySectionHeader">
                <h2>Your Top Artists</h2>
                <button onClick={topArtist} className="SpotifySectionRefresh" aria-label="Refresh top artists" title="Refresh top artists">
                  <TbRefresh />
                </button>
              </div>
              {isTopLoading ? (
                <div className="SpotifyLoading">Loading artists…</div>
              ) : (
                <div> {renderTopArtist()}</div>
              )}
            </div>
            <div className="SpotifyLiked">
              <div className="SpotifySectionHeader">
                <div>
                  <h2>Liked Songs</h2>
                  <span>{likedSongData.length} tracks</span>
                </div>
                <button onClick={getLikedSongs} className="SpotifySectionRefresh" aria-label="Refresh liked songs" title="Refresh liked songs">
                  <TbRefresh />
                </button>
              </div>
              {isLikedLoading ? (
                <div className="SpotifyLoading">Loading liked songs…</div>
              ) : (
                <div className="LikedSongsContainer">
                  {likedSongData.map((song, index) => song.track && (
                    <div key={song.track.id || index} className="LikedSong">
                      <button
                        style={{
                          backgroundImage: song.track.album?.images?.[2]?.url
                            ? `url(${song.track.album.images[2].url})`
                            : "none",
                        }}
                        onClick={() => playSelectedItem(song.track.uri)}
                        className="PlayButton"
                      >
                        <TbPlayerPlayFilled />
                      </button>
                      <div>
                        <p>{song.track.name}</p>
                        <small>{song.track.artists?.[0]?.name}</small>
                      </div>
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
