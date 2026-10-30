import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../User/UserContext";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import { artistNames } from "../../../spotify/format";
import { MediaCard } from "../ui/MediaCard";
import { TrackRow } from "../ui/TrackRow";
import { AddToPlaylistModal } from "../ui/AddToPlaylistModal";
import { EmptyState, ErrorState, LoadingSkeleton } from "../ui/StatusBlocks";

export default function SpotifyHome() {
  const { username } = useContext(UserContext);
  const {
    profile,
    currentTrack,
    loadRecent,
    loadArtists,
    loadLiked,
    loadPlaylists,
    library,
    playUri,
    queueTrack,
    browserPlayerStatus,
  } = useSpotify();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [playlistTrack, setPlaylistTrack] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      try {
        await Promise.all([
          loadRecent(),
          loadArtists(),
          loadLiked(),
          loadPlaylists(),
        ]);
        if (!cancelled) setStatus("success");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.response?.data?.error?.message || "Could not load your home mix.");
          setStatus("error");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [loadRecent, loadArtists, loadLiked, loadPlaylists]);

  const recent = library.recent?.items || [];
  const artists = library.artists?.items || [];
  const liked = library.liked?.items || [];
  const playlists = library.playlists?.items || [];

  return (
    <div className="spk-home">
      <section className="spk-welcome">
        <p className="spk-kicker">Sparkl music</p>
        <h2>Hello, {username || profile?.display_name || "there"}</h2>
        <p>
          {currentTrack
            ? `Now playing ${currentTrack.name}`
            : browserPlayerStatus === "ready"
              ? "Sparkl Browser Player is ready. Choose a song to start playback."
              : "Sparkl is preparing its browser player. You can browse your library while it connects."}
        </p>
      </section>

      {status === "loading" && <LoadingSkeleton label="Loading your music…" />}
      {status === "error" && <ErrorState body={error} />}

      {status === "success" && (
        <>
          <section className="spk-section">
            <header>
              <h3>Recently played</h3>
              <Link to="/spotify/taste">See taste</Link>
            </header>
            {recent.length === 0 ? (
              <EmptyState title="No recent tracks" body="Play something in Spotify to fill this row." />
            ) : (
              <div className="spk-card-row">
                {recent.slice(0, 8).map((item, index) => (
                  <MediaCard
                    key={`${item.track?.id}-${index}`}
                    title={item.track?.name}
                    subtitle={artistNames(item.track?.artists)}
                    images={item.track?.album?.images}
                    onPlay={() => playUri(item.track.uri)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="spk-section">
            <header>
              <h3>Followed artists</h3>
              <Link to="/spotify/library">Library</Link>
            </header>
            {artists.length === 0 ? (
              <EmptyState title="No followed artists yet" />
            ) : (
              <div className="spk-card-row">
                {artists.slice(0, 8).map((artist) => (
                  <MediaCard
                    key={artist.id}
                    to={`/spotify/artists/${artist.id}`}
                    title={artist.name}
                    images={artist.images}
                    round
                  />
                ))}
              </div>
            )}
          </section>

          <section className="spk-section">
            <header>
              <h3>Liked songs</h3>
              <Link to="/spotify/library">Open library</Link>
            </header>
            {liked.length === 0 ? (
              <EmptyState title="No liked songs yet" />
            ) : (
              <div className="spk-track-list">
                {liked.slice(0, 8).map((song) => (
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
          </section>

          <section className="spk-section">
            <header>
              <h3>Your playlists</h3>
              <Link to="/spotify/library">Browse all</Link>
            </header>
            {playlists.length === 0 ? (
              <EmptyState title="No playlists yet" />
            ) : (
              <div className="spk-card-row">
                {playlists.slice(0, 8).map((playlist) => (
                  <MediaCard
                    key={playlist.id}
                    to={`/spotify/playlists/${playlist.id}`}
                    title={playlist.name}
                    subtitle={playlist.description}
                    images={playlist.images}
                    meta={`${playlist.items?.total ?? playlist.tracks?.total ?? ""} tracks`}
                    onPlay={() => playUri(playlist.uri, "playlist")}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
      {playlistTrack && (
        <AddToPlaylistModal track={playlistTrack} onClose={() => setPlaylistTrack(null)} />
      )}
    </div>
  );
}
