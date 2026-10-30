import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  clearSpotifySession,
  exchangeAuthorizationCode,
  getStoredAccessToken,
  getValidSpotifyToken,
  startSpotifyLogin,
} from "./auth";
import {
  addItemsToPlaylist,
  addToQueue,
  createPlaylist,
  getDevices,
  getFollowedArtists,
  getLikedTracks,
  getPlaybackState,
  getPlaylists,
  getProfile,
  getQueue,
  getRecentlyPlayed,
  getSavedAlbums,
  pause,
  play,
  playbackErrorMessage,
  seekTo,
  setRepeat,
  setShuffle,
  skipNext,
  skipPrevious,
  transferPlayback,
} from "./api";

const SpotifyContext = createContext(null);

const CACHE_TTL = 5 * 60 * 1000;
let spotifySdkPromise;

function loadSpotifySdk() {
  if (window.Spotify) return Promise.resolve(window.Spotify);
  if (spotifySdkPromise) return spotifySdkPromise;

  spotifySdkPromise = new Promise((resolve, reject) => {
    const previousReadyHandler = window.onSpotifyWebPlaybackSDKReady;
    window.onSpotifyWebPlaybackSDKReady = () => {
      previousReadyHandler?.();
      resolve(window.Spotify);
    };
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onload = () => {
      if (window.Spotify) resolve(window.Spotify);
    };
    script.onerror = () => reject(new Error("Could not load Spotify Web Playback SDK"));
    document.body.appendChild(script);
  });

  return spotifySdkPromise;
}

function isFresh(entry) {
  return entry?.loadedAt && Date.now() - entry.loadedAt < CACHE_TTL;
}

export function SpotifyProvider({ children }) {
  const [token, setToken] = useState(getStoredAccessToken);
  const [profile, setProfile] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffleState] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [devices, setDevices] = useState([]);
  const [activeDevice, setActiveDevice] = useState(null);
  const [browserDeviceId, setBrowserDeviceId] = useState("");
  const [volume, setVolumeState] = useState(0.5);
  const [queue, setQueue] = useState({ currently_playing: null, queue: [] });
  const [queueStatus, setQueueStatus] = useState("idle");
  const [queueError, setQueueError] = useState("");
  const [queueOpen, setQueueOpen] = useState(false);
  const [library, setLibrary] = useState({
    liked: null,
    playlists: null,
    albums: null,
    artists: null,
    recent: null,
  });

  const progressAnchor = useRef({ at: Date.now(), value: 0, playing: false });
  const playerRef = useRef(null);
  const playerListenersRef = useRef([]);
  const browserDeviceIdRef = useRef("");
  const libraryRef = useRef(library);
  libraryRef.current = library;

  const notifyPlaybackError = useCallback((error, action) => {
    toast.warning(playbackErrorMessage(error, action));
  }, []);

  const refreshPlayback = useCallback(async (silent = false) => {
    if (!sessionStorage.getItem("Spotifytoken")) return;
    try {
      const [stateRes, deviceRes] = await Promise.all([
        getPlaybackState(),
        getDevices(),
      ]);
      const state = stateRes.data;
      const deviceList = deviceRes.data?.devices || [];
      const browserDevice = browserDeviceIdRef.current
        ? {
            id: browserDeviceIdRef.current,
            name: "Sparkl Browser Player",
            type: "Computer",
            is_active: activeDevice?.id === browserDeviceIdRef.current,
          }
        : null;
      const devicesWithBrowser = [
        ...deviceList.filter((device) => device.id !== browserDeviceIdRef.current),
        ...(browserDevice ? [browserDevice] : []),
      ];
      setDevices(devicesWithBrowser);
      const active = devicesWithBrowser.find((device) => device.is_active) || null;
      setActiveDevice(active);

      if (!state || stateRes.status === 204) {
        setIsPlaying(false);
        setCurrentTrack(null);
        return;
      }

      setIsPlaying(Boolean(state.is_playing));
      setShuffleState(Boolean(state.shuffle_state));
      setRepeatMode(state.repeat_state || "off");
      setCurrentTrack(state.item || null);
      setProgressMs(state.progress_ms || 0);
      setDurationMs(state.item?.duration_ms || 0);
      progressAnchor.current = {
        at: Date.now(),
        value: state.progress_ms || 0,
        playing: Boolean(state.is_playing),
      };
    } catch (error) {
      if (!silent) {
        console.error("Failed to refresh playback", error);
      }
    }
  }, [activeDevice?.id]);

  const refreshQueue = useCallback(async () => {
    setQueueStatus("loading");
    setQueueError("");
    try {
      const response = await getQueue();
      setQueue({
        currently_playing: response.data?.currently_playing || null,
        queue: response.data?.queue || [],
      });
      setQueueStatus("success");
    } catch (error) {
      const message = playbackErrorMessage(error, "load the queue");
      setQueueError(message);
      setQueueStatus("error");
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
      return true;
    } catch (error) {
      console.error("Token is invalid or expired", error);
      return false;
    }
  }, []);

  useEffect(() => {
    const exchangeToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        console.error("Spotify authorization failed:", error);
        toast.error("Spotify authorization was cancelled or failed.");
        return;
      }
      if (!code) return;
      if (sessionStorage.getItem("Spotifytoken")) {
        setToken(sessionStorage.getItem("Spotifytoken"));
        window.history.replaceState({}, document.title, "/home");
        return;
      }
      if (sessionStorage.getItem("spotify_exchanging")) return;

      sessionStorage.setItem("spotify_exchanging", "1");
      try {
        const accessToken = await exchangeAuthorizationCode(code);
        setToken(accessToken);
        window.history.replaceState({}, document.title, "/home");
      } catch (exchangeError) {
        sessionStorage.removeItem("spotify_exchanging");
        console.error(
          "Spotify token exchange failed:",
          exchangeError.response?.data || exchangeError.message
        );
        toast.error("Could not connect Spotify. Try logging in again.");
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
    if (!token) return undefined;

    let cancelled = false;
    const initializePlayer = async () => {
      try {
        const Spotify = await loadSpotifySdk();
        if (cancelled || playerRef.current) return;

        const player = new Spotify.Player({
          name: "Sparkl Browser Player",
          volume,
          getOAuthToken: async (callback) => {
            try {
              callback(await getValidSpotifyToken());
            } catch (error) {
              console.error("Could not refresh Spotify player token", error);
              callback("");
            }
          },
        });
        const listeners = [
          ["ready", ({ device_id }) => {
            browserDeviceIdRef.current = device_id;
            setBrowserDeviceId(device_id);
            setDevices((current) => [
              ...current.filter((device) => device.id !== device_id),
              {
                id: device_id,
                name: "Sparkl Browser Player",
                type: "Computer",
                is_active: false,
              },
            ]);
          }],
          ["not_ready", ({ device_id }) => {
            if (device_id === browserDeviceIdRef.current) {
              browserDeviceIdRef.current = "";
              setBrowserDeviceId("");
            }
          }],
          ["player_state_changed", (state) => {
            if (!state) return;
            const track = state.track_window.current_track;
            setCurrentTrack(track);
            setIsPlaying(!state.paused);
            setProgressMs(state.position);
            setDurationMs(track?.duration_ms || 0);
            setVolumeState(state.volume ?? volume);
            progressAnchor.current = {
              at: Date.now(),
              value: state.position,
              playing: !state.paused,
            };
          }],
          ["initialization_error", ({ message }) => toast.error(message)],
          ["authentication_error", ({ message }) => toast.error(message)],
          ["account_error", ({ message }) => toast.error(message)],
          ["playback_error", ({ message }) => toast.error(message)],
        ];

        listeners.forEach(([event, handler]) => player.addListener(event, handler));
        playerListenersRef.current = listeners;
        playerRef.current = player;
        if (!(await player.connect())) {
          throw new Error("Spotify browser player could not connect");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to initialize Spotify browser player", error);
          toast.error("Browser playback is unavailable. You can still use Spotify devices.");
        }
      }
    };

    initializePlayer();
    return () => {
      cancelled = true;
      if (playerRef.current) {
        playerListenersRef.current.forEach(([event, handler]) => {
          playerRef.current.removeListener(event, handler);
        });
        playerRef.current.disconnect();
        playerRef.current = null;
        playerListenersRef.current = [];
      }
      browserDeviceIdRef.current = "";
      setBrowserDeviceId("");
    };
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;
    loadProfile();
    refreshPlayback(true);
    const intervalId = window.setInterval(() => refreshPlayback(true), 8000);
    return () => window.clearInterval(intervalId);
  }, [token, loadProfile, refreshPlayback]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      const { at, value, playing } = progressAnchor.current;
      if (!playing) return;
      const next = value + (Date.now() - at);
      setProgressMs(Math.min(next, durationMs || next));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [durationMs]);

  const logoutSpotify = useCallback(() => {
    setToken("");
    setProfile(null);
    setCurrentTrack(null);
    setQueue({ currently_playing: null, queue: [] });
    setBrowserDeviceId("");
    setActiveDevice(null);
    clearSpotifySession();
  }, []);

  const playUri = useCallback(
    async (uri, type = "track") => {
      try {
        const body =
          type === "track" || !type
            ? { uris: [uri] }
            : { context_uri: uri };
        await play(body, activeDevice?.id);
        setIsPlaying(true);
        setTimeout(() => refreshPlayback(true), 400);
      } catch (error) {
        notifyPlaybackError(error, "play this item");
      }
    },
    [activeDevice, notifyPlaybackError, refreshPlayback]
  );

  const playContext = useCallback(
    async (contextUri, offsetUri) => {
      try {
        const body = offsetUri
          ? { context_uri: contextUri, offset: { uri: offsetUri } }
          : { context_uri: contextUri };
        await play(body, activeDevice?.id);
        setIsPlaying(true);
        setTimeout(() => refreshPlayback(true), 400);
      } catch (error) {
        notifyPlaybackError(error, "start playback");
      }
    },
    [activeDevice, notifyPlaybackError, refreshPlayback]
  );

  const togglePlayback = useCallback(async () => {
    try {
      if (activeDevice?.id === browserDeviceId && playerRef.current) {
        await playerRef.current.togglePlay();
        return;
      }
      if (isPlaying) {
        await pause(activeDevice?.id);
        setIsPlaying(false);
        progressAnchor.current = {
          at: Date.now(),
          value: progressMs,
          playing: false,
        };
      } else {
        await play({}, activeDevice?.id);
        setIsPlaying(true);
        progressAnchor.current = {
          at: Date.now(),
          value: progressMs,
          playing: true,
        };
      }
    } catch (error) {
      notifyPlaybackError(error, isPlaying ? "pause" : "play");
    }
  }, [activeDevice, browserDeviceId, isPlaying, notifyPlaybackError, progressMs]);

  const nextTrack = useCallback(async () => {
    try {
      if (activeDevice?.id === browserDeviceId && playerRef.current) {
        await playerRef.current.nextTrack();
        return;
      }
      await skipNext();
      setTimeout(() => refreshPlayback(true), 400);
    } catch (error) {
      notifyPlaybackError(error, "skip to the next track");
    }
  }, [activeDevice, browserDeviceId, notifyPlaybackError, refreshPlayback]);

  const previousTrack = useCallback(async () => {
    try {
      if (activeDevice?.id === browserDeviceId && playerRef.current) {
        await playerRef.current.previousTrack();
        return;
      }
      await skipPrevious();
      setTimeout(() => refreshPlayback(true), 400);
    } catch (error) {
      notifyPlaybackError(error, "go to the previous track");
    }
  }, [activeDevice, browserDeviceId, notifyPlaybackError, refreshPlayback]);

  const toggleShuffle = useCallback(async () => {
    try {
      const next = !shuffle;
      await setShuffle(next);
      setShuffleState(next);
    } catch (error) {
      notifyPlaybackError(error, "change shuffle");
    }
  }, [notifyPlaybackError, shuffle]);

  const cycleRepeat = useCallback(async () => {
    const order = ["off", "context", "track"];
    const next = order[(order.indexOf(repeatMode) + 1) % order.length];
    try {
      await setRepeat(next);
      setRepeatMode(next);
    } catch (error) {
      notifyPlaybackError(error, "change repeat");
    }
  }, [notifyPlaybackError, repeatMode]);

  const seek = useCallback(
    async (position) => {
      try {
        if (activeDevice?.id === browserDeviceId && playerRef.current) {
          await playerRef.current.seek(position);
          return;
        }
        await seekTo(position);
        setProgressMs(position);
        progressAnchor.current = {
          at: Date.now(),
          value: position,
          playing: isPlaying,
        };
      } catch (error) {
        notifyPlaybackError(error, "seek");
      }
    },
    [activeDevice, browserDeviceId, isPlaying, notifyPlaybackError]
  );

  const setVolume = useCallback(
    async (nextVolume) => {
      const normalized = Math.min(1, Math.max(0, nextVolume));
      try {
        if (activeDevice?.id === browserDeviceId && playerRef.current) {
          await playerRef.current.setVolume(normalized);
        } else {
          throw new Error("Volume control is available for the browser player only");
        }
        setVolumeState(normalized);
      } catch (error) {
        notifyPlaybackError(error, "change volume");
      }
    },
    [activeDevice, browserDeviceId, notifyPlaybackError]
  );

  const queueTrack = useCallback(
    async (uri, options = {}) => {
      try {
        await addToQueue(uri);
        if (!options.silent) toast.success("Added to Spotify queue");
        if (queueOpen) refreshQueue();
        return true;
      } catch (error) {
        notifyPlaybackError(error, "add to the queue");
        return false;
      }
    },
    [notifyPlaybackError, queueOpen, refreshQueue]
  );

  const queueMany = useCallback(
    async (uris) => {
      let added = 0;
      for (const uri of uris) {
        const ok = await queueTrack(uri, { silent: true });
        if (!ok) break;
        added += 1;
      }
      if (added) toast.success(`Added ${added} track${added === 1 ? "" : "s"} to queue`);
    },
    [queueTrack]
  );

  const chooseDevice = useCallback(
    async (deviceId) => {
      try {
        await transferPlayback(deviceId, true);
        setActiveDevice(
          deviceId === browserDeviceId
            ? {
                id: deviceId,
                name: "Sparkl Browser Player",
                type: "Computer",
                is_active: true,
              }
            : devices.find((device) => device.id === deviceId) || null
        );
        toast.success("Playback transferred");
        setTimeout(() => refreshPlayback(true), 400);
      } catch (error) {
        notifyPlaybackError(error, "transfer playback");
      }
    },
    [browserDeviceId, devices, notifyPlaybackError, refreshPlayback]
  );

  const loadLiked = useCallback(async ({ append = false, force = false } = {}) => {
    const current = libraryRef.current.liked;
    if (!force && !append && isFresh(current)) {
      return current;
    }
    const offset = append ? current?.items.length || 0 : 0;
    const response = await getLikedTracks({ limit: 50, offset });
    const pageItems = response.data.items || [];
    const items = append ? [...(current?.items || []), ...pageItems] : pageItems;
    const next = {
      items,
      total: response.data.total || items.length,
      hasMore: Boolean(response.data.next),
      loadedAt: Date.now(),
    };
    setLibrary((prev) => ({ ...prev, liked: next }));
    return next;
  }, []);

  const loadPlaylists = useCallback(async ({ force = false } = {}) => {
    const current = libraryRef.current.playlists;
    if (!force && isFresh(current)) return current;
    const items = [];
    let offset = 0;
    let hasMore = true;
    while (hasMore && offset < 150) {
      const response = await getPlaylists({ limit: 50, offset });
      items.push(...(response.data.items || []));
      offset += 50;
      hasMore = Boolean(response.data.next);
    }
    const next = { items, total: items.length, loadedAt: Date.now() };
    setLibrary((prev) => ({ ...prev, playlists: next }));
    return next;
  }, []);

  const loadAlbums = useCallback(async ({ force = false } = {}) => {
    const current = libraryRef.current.albums;
    if (!force && isFresh(current)) return current;
    const response = await getSavedAlbums({ limit: 50, offset: 0 });
    const next = {
      items: response.data.items || [],
      total: response.data.total || 0,
      hasMore: Boolean(response.data.next),
      loadedAt: Date.now(),
    };
    setLibrary((prev) => ({ ...prev, albums: next }));
    return next;
  }, []);

  const loadArtists = useCallback(async ({ force = false } = {}) => {
    const current = libraryRef.current.artists;
    if (!force && isFresh(current)) return current;
    const response = await getFollowedArtists({ limit: 50 });
    const artists = response.data?.artists?.items || [];
    const next = {
      items: artists,
      total: response.data?.artists?.total || artists.length,
      loadedAt: Date.now(),
    };
    setLibrary((prev) => ({ ...prev, artists: next }));
    return next;
  }, []);

  const loadRecent = useCallback(async ({ force = false } = {}) => {
    const current = libraryRef.current.recent;
    if (!force && isFresh(current)) return current;
    const response = await getRecentlyPlayed({ limit: 20 });
    const next = {
      items: response.data.items || [],
      loadedAt: Date.now(),
    };
    setLibrary((prev) => ({ ...prev, recent: next }));
    return next;
  }, []);

  const savePlaylist = useCallback(
    async (name, description, uris) => {
      const created = await createPlaylist(name, description);
      if (uris?.length) {
        const chunks = [];
        for (let i = 0; i < uris.length; i += 100) {
          chunks.push(uris.slice(i, i + 100));
        }
        for (const chunk of chunks) {
          await addItemsToPlaylist(created.data.id, chunk);
        }
      }
      setLibrary((prev) => ({ ...prev, playlists: null }));
      toast.success("Playlist created on Spotify");
      return created.data;
    },
    []
  );

  const value = useMemo(
    () => ({
      token,
      profile,
      login: startSpotifyLogin,
      logoutSpotify,
      currentTrack,
      isPlaying,
      shuffle,
      repeatMode,
      progressMs,
      durationMs,
      devices,
      activeDevice,
      queue,
      queueStatus,
      queueError,
      queueOpen,
      setQueueOpen,
      refreshPlayback,
      refreshQueue,
      playUri,
      playContext,
      togglePlayback,
      nextTrack,
      previousTrack,
      toggleShuffle,
      cycleRepeat,
      seek,
      volume,
      setVolume,
      queueTrack,
      queueMany,
      chooseDevice,
      library,
      loadLiked,
      loadPlaylists,
      loadAlbums,
      loadArtists,
      loadRecent,
      savePlaylist,
    }),
    [
      token,
      profile,
      logoutSpotify,
      currentTrack,
      isPlaying,
      shuffle,
      repeatMode,
      progressMs,
      durationMs,
      devices,
      activeDevice,
      queue,
      queueStatus,
      queueError,
      queueOpen,
      refreshPlayback,
      refreshQueue,
      playUri,
      playContext,
      togglePlayback,
      nextTrack,
      previousTrack,
      toggleShuffle,
      cycleRepeat,
      seek,
      volume,
      setVolume,
      queueTrack,
      queueMany,
      chooseDevice,
      library,
      loadLiked,
      loadPlaylists,
      loadAlbums,
      loadArtists,
      loadRecent,
      savePlaylist,
    ]
  );

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error("useSpotify must be used inside SpotifyProvider");
  }
  return context;
}
