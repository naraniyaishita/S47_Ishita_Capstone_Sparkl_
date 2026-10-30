import React, { useEffect, useRef, useState } from "react";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import { searchCatalog, saveLibraryUris } from "../../../spotify/api";
import { artistNames } from "../../../spotify/format";
import { TrackRow } from "../ui/TrackRow";
import { MediaCard } from "../ui/MediaCard";
import { AddToPlaylistModal } from "../ui/AddToPlaylistModal";
import { EmptyState, ErrorState, LoadingSkeleton } from "../ui/StatusBlocks";
import { toast } from "react-toastify";

const TYPES = ["track", "album", "artist", "playlist"];

export default function SearchPage() {
  const { playUri, queueTrack } = useSpotify();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("track");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [playlistTrack, setPlaylistTrack] = useState(null);
  const abortRef = useRef();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setStatus("idle");
      return undefined;
    }

    const handle = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("loading");
      setError("");
      try {
        const response = await searchCatalog({
          q: query.trim(),
          type,
          limit: 10,
          signal: controller.signal,
        });
        const key = `${type}s`;
        setResults(response.data?.[key]?.items?.filter(Boolean) || []);
        setStatus("success");
      } catch (searchError) {
        if (searchError.code === "ERR_CANCELED") return;
        setError(searchError.response?.data?.error?.message || "Search failed.");
        setStatus("error");
      }
    }, 400);

    return () => window.clearTimeout(handle);
  }, [query, type]);

  const saveTrack = async (track) => {
    try {
      await saveLibraryUris([track.uri]);
      toast.success("Saved to liked songs");
    } catch {
      toast.error("Could not save this track");
    }
  };

  return (
    <div className="spk-page-block">
      <header className="spk-page-head">
        <h2>Search</h2>
        <p>Tracks, albums, artists, and playlists. Requests wait until you pause typing.</p>
      </header>
      <div className="SpotifySearchBar spk-search-bar">
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Search type">
          {TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={query}
          placeholder="Search Spotify…"
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search Spotify"
        />
      </div>

      {status === "idle" && (
        <EmptyState title="Start typing" body="Find a track, album, artist, or playlist." />
      )}
      {status === "loading" && <LoadingSkeleton label="Searching…" />}
      {status === "error" && <ErrorState body={error} />}
      {status === "success" && results.length === 0 && (
        <EmptyState title="No results" body="Try a different spelling or search type." />
      )}
      {status === "success" && type === "track" && (
        <div className="spk-track-list">
          {results.map((track) => (
            <TrackRow
              key={track.id}
              track={track}
              onPlay={() => playUri(track.uri)}
              onQueue={() => queueTrack(track.uri)}
              onSave={() => saveTrack(track)}
              onAddToPlaylist={() => setPlaylistTrack(track)}
            />
          ))}
        </div>
      )}
      {status === "success" && type !== "track" && (
        <div className="spk-card-grid">
          {results.map((item) => (
            <MediaCard
              key={item.id}
              to={
                type === "album"
                  ? `/spotify/albums/${item.id}`
                  : type === "artist"
                    ? `/spotify/artists/${item.id}`
                    : `/spotify/playlists/${item.id}`
              }
              title={item.name}
              subtitle={type === "playlist" ? item.owner?.display_name : artistNames(item.artists)}
              images={item.images}
              round={type === "artist"}
              onPlay={
                type === "artist"
                  ? undefined
                  : () => playUri(item.uri, type)
              }
            />
          ))}
        </div>
      )}
      {playlistTrack && (
        <AddToPlaylistModal track={playlistTrack} onClose={() => setPlaylistTrack(null)} />
      )}
    </div>
  );
}
