import axios from "axios";
import { getValidSpotifyToken } from "./auth";
import { playlistItemTrack } from "./format";

export const SPOTIFY_API = "https://api.spotify.com/v1";

export async function spotifyApiRequest(method, url, data, config = {}) {
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

function isMissingEndpoint(error) {
  const status = error.response?.status;
  return status === 404 || status === 405;
}

async function tryEndpoints(attempts) {
  let lastError;
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (error) {
      lastError = error;
      if (!isMissingEndpoint(error) && error.response?.status !== 400) {
        throw error;
      }
    }
  }
  throw lastError;
}

export function getProfile() {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me`);
}

export function getPlaybackState() {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me/player`);
}

export function getDevices() {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me/player/devices`);
}

export function getQueue() {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me/player/queue`);
}

export function play(body = {}, deviceId) {
  const params = deviceId ? { device_id: deviceId } : undefined;
  return spotifyApiRequest("put", `${SPOTIFY_API}/me/player/play`, body, {
    params,
  });
}

export function pause(deviceId) {
  const params = deviceId ? { device_id: deviceId } : undefined;
  return spotifyApiRequest("put", `${SPOTIFY_API}/me/player/pause`, {}, { params });
}

export function skipNext() {
  return spotifyApiRequest("post", `${SPOTIFY_API}/me/player/next`, {});
}

export function skipPrevious() {
  return spotifyApiRequest("post", `${SPOTIFY_API}/me/player/previous`, {});
}

export function setShuffle(state) {
  return spotifyApiRequest(
    "put",
    `${SPOTIFY_API}/me/player/shuffle`,
    {},
    { params: { state } }
  );
}

export function setRepeat(state) {
  return spotifyApiRequest(
    "put",
    `${SPOTIFY_API}/me/player/repeat`,
    {},
    { params: { state } }
  );
}

export function seekTo(positionMs) {
  return spotifyApiRequest(
    "put",
    `${SPOTIFY_API}/me/player/seek`,
    {},
    { params: { position_ms: Math.max(0, Math.floor(positionMs)) } }
  );
}

export function addToQueue(uri) {
  return spotifyApiRequest(
    "post",
    `${SPOTIFY_API}/me/player/queue`,
    {},
    { params: { uri } }
  );
}

export function transferPlayback(deviceId, playState = true) {
  return spotifyApiRequest("put", `${SPOTIFY_API}/me/player`, {
    device_ids: [deviceId],
    play: playState,
  });
}

export function searchCatalog({ q, type, limit = 10, offset = 0, signal }) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/search`, undefined, {
    params: { q, type, limit: Math.min(limit, 10), offset },
    signal,
  });
}

export function getTopItems(type, timeRange = "medium_term", limit = 20) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me/top/${type}`, undefined, {
    params: { time_range: timeRange, limit },
  });
}

export function getLikedTracks({ limit = 50, offset = 0 } = {}) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me/tracks`, undefined, {
    params: { limit, offset },
  });
}

export function getPlaylists({ limit = 50, offset = 0 } = {}) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me/playlists`, undefined, {
    params: { limit, offset },
  });
}

export function getSavedAlbums({ limit = 50, offset = 0 } = {}) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me/albums`, undefined, {
    params: { limit, offset },
  });
}

export function getFollowedArtists({ limit = 50, after } = {}) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/me/following`, undefined, {
    params: { type: "artist", limit, after },
  });
}

export function getRecentlyPlayed({ limit = 20 } = {}) {
  return spotifyApiRequest(
    "get",
    `${SPOTIFY_API}/me/player/recently-played`,
    undefined,
    { params: { limit } }
  );
}

export function getAlbum(id) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/albums/${id}`);
}

export function getAlbumTracks(id, { limit = 50, offset = 0 } = {}) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/albums/${id}/tracks`, undefined, {
    params: { limit, offset },
  });
}

export function getArtist(id) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/artists/${id}`);
}

export function getArtistAlbums(id, { limit = 20, offset = 0 } = {}) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/artists/${id}/albums`, undefined, {
    params: { include_groups: "album,single", limit, offset },
  });
}

export async function getArtistHighlightTracks(artist) {
  try {
    const response = await spotifyApiRequest(
      "get",
      `${SPOTIFY_API}/artists/${artist.id}/top-tracks`,
      undefined,
      { params: { market: "from_token" } }
    );
    if (response.data?.tracks?.length) {
      return { tracks: response.data.tracks, source: "top-tracks" };
    }
  } catch {
    // Development-mode apps no longer expose artist top-tracks.
  }

  const query = artist.name ? `artist:"${artist.name}"` : artist.id;
  const response = await searchCatalog({
    q: query,
    type: "track",
    limit: 10,
  });
  return {
    tracks: response.data?.tracks?.items || [],
    source: "search",
  };
}

export function getPlaylist(id) {
  return spotifyApiRequest("get", `${SPOTIFY_API}/playlists/${id}`);
}

export async function getPlaylistItems(id, { limit = 50, offset = 0 } = {}) {
  return tryEndpoints([
    () =>
      spotifyApiRequest("get", `${SPOTIFY_API}/playlists/${id}/items`, undefined, {
        params: { limit, offset },
      }),
    () =>
      spotifyApiRequest("get", `${SPOTIFY_API}/playlists/${id}/tracks`, undefined, {
        params: { limit, offset },
      }),
  ]);
}

export async function createPlaylist(name, description = "", isPublic = false) {
  const body = { name, description, public: isPublic };
  return tryEndpoints([
    () => spotifyApiRequest("post", `${SPOTIFY_API}/me/playlists`, body),
    async () => {
      const me = await getProfile();
      return spotifyApiRequest(
        "post",
        `${SPOTIFY_API}/users/${me.data.id}/playlists`,
        body
      );
    },
  ]);
}

export async function addItemsToPlaylist(playlistId, uris) {
  const body = { uris };
  return tryEndpoints([
    () =>
      spotifyApiRequest(
        "post",
        `${SPOTIFY_API}/playlists/${playlistId}/items`,
        body
      ),
    () =>
      spotifyApiRequest(
        "post",
        `${SPOTIFY_API}/playlists/${playlistId}/tracks`,
        body
      ),
  ]);
}

export async function saveLibraryUris(uris) {
  return tryEndpoints([
    () => spotifyApiRequest("put", `${SPOTIFY_API}/me/library`, { uris }),
    async () => {
      const tracks = uris.filter((uri) => uri.includes(":track:")).map(idFromUri);
      const albums = uris.filter((uri) => uri.includes(":album:")).map(idFromUri);
      const artists = uris.filter((uri) => uri.includes(":artist:")).map(idFromUri);
      if (tracks.length) {
        await spotifyApiRequest("put", `${SPOTIFY_API}/me/tracks`, { ids: tracks });
      }
      if (albums.length) {
        await spotifyApiRequest("put", `${SPOTIFY_API}/me/albums`, { ids: albums });
      }
      if (artists.length) {
        await spotifyApiRequest("put", `${SPOTIFY_API}/me/following`, { ids: artists }, {
          params: { type: "artist" },
        });
      }
      return { data: { ok: true } };
    },
  ]);
}

export async function removeLibraryUris(uris) {
  return tryEndpoints([
    () => spotifyApiRequest("delete", `${SPOTIFY_API}/me/library`, { uris }),
    async () => {
      const tracks = uris.filter((uri) => uri.includes(":track:")).map(idFromUri);
      const albums = uris.filter((uri) => uri.includes(":album:")).map(idFromUri);
      const artists = uris.filter((uri) => uri.includes(":artist:")).map(idFromUri);
      if (tracks.length) {
        await spotifyApiRequest("delete", `${SPOTIFY_API}/me/tracks`, { ids: tracks });
      }
      if (albums.length) {
        await spotifyApiRequest("delete", `${SPOTIFY_API}/me/albums`, { ids: albums });
      }
      if (artists.length) {
        await spotifyApiRequest(
          "delete",
          `${SPOTIFY_API}/me/following`,
          { ids: artists },
          { params: { type: "artist" } }
        );
      }
      return { data: { ok: true } };
    },
  ]);
}

export async function libraryContains(uris) {
  return tryEndpoints([
    () =>
      spotifyApiRequest("get", `${SPOTIFY_API}/me/library/contains`, undefined, {
        params: { uris: uris.join(",") },
      }),
    async () => {
      const uri = uris[0];
      if (uri?.includes(":track:")) {
        return spotifyApiRequest("get", `${SPOTIFY_API}/me/tracks/contains`, undefined, {
          params: { ids: uris.map(idFromUri).join(",") },
        });
      }
      if (uri?.includes(":album:")) {
        return spotifyApiRequest("get", `${SPOTIFY_API}/me/albums/contains`, undefined, {
          params: { ids: uris.map(idFromUri).join(",") },
        });
      }
      if (uri?.includes(":artist:")) {
        return spotifyApiRequest(
          "get",
          `${SPOTIFY_API}/me/following/contains`,
          undefined,
          { params: { type: "artist", ids: uris.map(idFromUri).join(",") } }
        );
      }
      return { data: uris.map(() => false) };
    },
  ]);
}

export function normalizePlaylistItems(page) {
  return (page?.items || [])
    .map((entry) => ({
      added_at: entry.added_at,
      track: playlistItemTrack(entry),
    }))
    .filter((entry) => entry.track && entry.track.id);
}

function idFromUri(uri) {
  return uri.split(":").pop();
}

export function playbackErrorMessage(error, action = "control playback") {
  const reason = error.response?.data?.error?.reason;
  const status = error.response?.status;
  const message = error.response?.data?.error?.message;

  if (status === 404 || reason === "NO_ACTIVE_DEVICE") {
    return "No active Spotify player. Open Spotify on a device and start playback first.";
  }
  if (reason === "PREMIUM_REQUIRED" || status === 403) {
    return `Spotify Premium is required to ${action}.`;
  }
  return `Couldn't ${action}. ${message || "Please try again."}`;
}
