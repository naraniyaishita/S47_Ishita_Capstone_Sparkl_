import React, { useEffect, useMemo, useState } from "react";
import { TbPlayerPlayFilled } from "react-icons/tb";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import { TrackRow } from "../ui/TrackRow";
import { MediaCard } from "../ui/MediaCard";
import { AddToPlaylistModal } from "../ui/AddToPlaylistModal";
import { EmptyState, ErrorState, LoadingSkeleton } from "../ui/StatusBlocks";
import { playlistTrackCount } from "../../../spotify/format";

const TABS = [
  { id: "liked", label: "Liked Songs" },
  { id: "playlists", label: "Playlists" },
  { id: "albums", label: "Saved Albums" },
  { id: "artists", label: "Followed Artists" },
];

export default function LibraryPage() {
  const {
    library,
    profile,
    loadLiked,
    loadPlaylists,
    loadAlbums,
    loadArtists,
    playUri,
    queueTrack,
  } = useSpotify();
  const [tab, setTab] = useState("liked");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [playlistTrack, setPlaylistTrack] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      setError("");
      try {
        if (tab === "liked") await loadLiked();
        if (tab === "playlists") await loadPlaylists();
        if (tab === "albums") await loadAlbums();
        if (tab === "artists") await loadArtists();
        if (!cancelled) setStatus("success");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.response?.data?.error?.message || "Could not load this library.");
          setStatus("error");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [tab, loadLiked, loadPlaylists, loadAlbums, loadArtists]);

  const likedItems = useMemo(() => {
    const items = library.liked?.items || [];
    const filtered = items.filter((item) => {
      const haystack = `${item.track?.name} ${item.track?.artists?.[0]?.name} ${item.track?.album?.name}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
    return [...filtered].sort((a, b) => {
      if (sort === "name") return (a.track?.name || "").localeCompare(b.track?.name || "");
      if (sort === "artist") {
        return (a.track?.artists?.[0]?.name || "").localeCompare(b.track?.artists?.[0]?.name || "");
      }
      return new Date(b.added_at || 0) - new Date(a.added_at || 0);
    });
  }, [library.liked, query, sort]);

  return (
    <div className="spk-page-block">
      <header className="spk-page-head">
        <h2>Library</h2>
        <p>Liked songs, playlists, albums, and artists stay cached while you move between pages.</p>
      </header>
      <div className="spk-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? "is-active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {status === "loading" && <LoadingSkeleton />}
      {status === "error" && <ErrorState body={error} />}

      {status === "success" && tab === "liked" && (
        <>
          <div className="spk-toolbar">
            <button
              type="button"
              className="spk-btn"
              disabled={!profile?.id || !library.liked?.items?.length}
              onClick={() => playUri(`spotify:user:${profile.id}:collection`, "playlist")}
            >
              <TbPlayerPlayFilled aria-hidden="true" /> Play all liked songs
            </button>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search liked songs"
              aria-label="Search liked songs"
            />
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort liked songs">
              <option value="recent">Recently added</option>
              <option value="name">Track name</option>
              <option value="artist">Artist</option>
            </select>
            {library.liked?.hasMore && (
              <button type="button" className="spk-btn" onClick={() => loadLiked({ append: true, force: true })}>
                Load more
              </button>
            )}
          </div>
          <p className="spk-meta">{library.liked?.total || likedItems.length} liked tracks</p>
          {likedItems.length === 0 ? (
            <EmptyState title="No matching liked songs" />
          ) : (
            <div className="spk-track-list">
              {likedItems.map((song) => (
                <TrackRow
                  key={song.track.id}
                  track={song.track}
                  addedAt={song.added_at}
                  onPlay={() => playUri(song.track.uri)}
                  onQueue={() => queueTrack(song.track.uri)}
                  onAddToPlaylist={() => setPlaylistTrack(song.track)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {status === "success" && tab === "playlists" && (
        <div className="spk-card-grid">
          {(library.playlists?.items || []).map((playlist) => (
            <MediaCard
              key={playlist.id}
              to={`/spotify/playlists/${playlist.id}`}
              title={playlist.name}
              subtitle={playlist.description}
              images={playlist.images}
              meta={`${playlistTrackCount(playlist)} tracks`}
              onPlay={() => playUri(playlist.uri, "playlist")}
            />
          ))}
          {(library.playlists?.items || []).length === 0 && (
            <EmptyState title="No playlists yet" />
          )}
        </div>
      )}

      {status === "success" && tab === "albums" && (
        <div className="spk-card-grid">
          {(library.albums?.items || []).map((entry) => (
            <MediaCard
              key={entry.album.id}
              to={`/spotify/albums/${entry.album.id}`}
              title={entry.album.name}
              subtitle={entry.album.artists?.[0]?.name}
              images={entry.album.images}
              meta={entry.album.release_date}
              onPlay={() => playUri(entry.album.uri, "album")}
            />
          ))}
          {(library.albums?.items || []).length === 0 && (
            <EmptyState title="No saved albums" />
          )}
        </div>
      )}

      {status === "success" && tab === "artists" && (
        <div className="spk-card-grid">
          {(library.artists?.items || []).map((artist) => (
            <MediaCard
              key={artist.id}
              to={`/spotify/artists/${artist.id}`}
              title={artist.name}
              images={artist.images}
              round
            />
          ))}
          {(library.artists?.items || []).length === 0 && (
            <EmptyState title="No followed artists" />
          )}
        </div>
      )}

      {playlistTrack && (
        <AddToPlaylistModal track={playlistTrack} onClose={() => setPlaylistTrack(null)} />
      )}
    </div>
  );
}
