import axios from "axios";

export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-follow-modify",
  "user-follow-read",
  "user-read-recently-played",
].join(" ");

const tokenAxios = axios.create({
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

let spotifyRefreshPromise;

export function getClientId() {
  return import.meta.env.VITE_CLIENT_ID;
}

export function getRedirectUri() {
  return import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/home`;
}

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

export function getStoredAccessToken() {
  return sessionStorage.getItem("Spotifytoken") || "";
}

export function clearSpotifySession() {
  sessionStorage.removeItem("Spotifytoken");
  sessionStorage.removeItem("SpotifyrefreshToken");
  sessionStorage.removeItem("SpotifytokenExpiry");
  sessionStorage.removeItem("code_verifier");
  sessionStorage.removeItem("spotify_exchanging");
}

export async function startSpotifyLogin() {
  const clientId = getClientId();
  const redirectUri = getRedirectUri();
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem("code_verifier", codeVerifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    scope: SPOTIFY_SCOPES,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function refreshSpotifyToken() {
  const refreshToken = sessionStorage.getItem("SpotifyrefreshToken");

  if (!refreshToken) {
    throw new Error("Spotify refresh token not found");
  }

  try {
    const response = await tokenAxios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        client_id: getClientId(),
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      })
    );
    const { access_token, expires_in, refresh_token } = response.data;

    sessionStorage.setItem("Spotifytoken", access_token);
    sessionStorage.setItem(
      "SpotifytokenExpiry",
      String(Date.now() + expires_in * 1000)
    );
    if (refresh_token) {
      sessionStorage.setItem("SpotifyrefreshToken", refresh_token);
    }

    return access_token;
  } catch (error) {
    if (error.response?.data?.error === "invalid_grant") {
      clearSpotifySession();
    }
    throw error;
  }
}

export async function getValidSpotifyToken() {
  const accessToken = sessionStorage.getItem("Spotifytoken");
  const expiry = sessionStorage.getItem("SpotifytokenExpiry");

  if (!accessToken) {
    throw new Error("Spotify access token not found");
  }

  const isExpired = !expiry || Date.now() >= Number(expiry) - 5 * 60 * 1000;

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

export async function exchangeAuthorizationCode(code) {
  const codeVerifier = sessionStorage.getItem("code_verifier");
  if (!codeVerifier) {
    throw new Error("Spotify code verifier is missing");
  }

  const response = await tokenAxios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      client_id: getClientId(),
      grant_type: "authorization_code",
      code,
      redirect_uri: getRedirectUri(),
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
    String(Date.now() + expires_in * 1000)
  );
  sessionStorage.removeItem("code_verifier");
  sessionStorage.removeItem("spotify_exchanging");

  return access_token;
}
