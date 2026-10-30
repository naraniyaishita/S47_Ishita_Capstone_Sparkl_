import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import {
  getPlaylist,
  getPlaylistItems,
  normalizePlaylistItems,
} from "../../../spotify/api";
import { imageUrl, playlistTrackCount } from "../../../spotify/format";
import { TrackRow } from "../ui/TrackRow";
import { AddToPlaylistModal } from "../ui/AddToPlaylistModal";
import { EmptyState, ErrorState, LoadingSkeleton } from "../ui/StatusBlocks";

export default function PlaylistDetail() {
  const { id } = useParams();
  const { playUri, playContext, queueTrack } = useSpotify();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [restricted, setRestricted] = useState(false);
  const [playlistTrack, setPlaylistTrack] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      try {
        const detail = await getPlaylist(id);
        if (cancelled) return;
        setPlaylist(detail.data);
        try {
          const items = await getPlaylistItems(id, { limit: 50, offset: 0 });
          if (cancelled) return;
          setTracks(normalizePlaylistItems(items.data));
          setRestricted(false);
        } catch {
          if (cancelled) return;
          setTracks([]);
          setRestricted(true);
        }
        setStatus("success");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.response?.data?.error?.message || "Playlist unavailable.");
          setStatus("error");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") return <LoadingSkeleton label="Loading playlist…" />;
  if (status === "error") return <ErrorState body={error} />;
  if (!playlist) return <EmptyState title="Playlist not found" />;

  return (
    <div className="spk-detail">
      <div className="spk-detail-hero">
        {imageUrl(playlist.images, "large") && (
          <img src={imageUrl(playlist.images, "large")} alt="" />
        )}
        <div>
          <p className="spk-kicker">Playlist</p>
          <h2>{playlist.name}</h2>
          <p>{playlist.description}</p>
          <p className="spk-meta">{playlistTrackCount(playlist)} tracks</p>
          <button type="button" className="spk-btn" onClick={() => playUri(playlist.uri, "playlist")}>
            Play playlist
          </button>
        </div>
      </div>
      {restricted && (
        <EmptyState
          title="Track list is limited"
          body="Spotify only returns playlist contents for playlists you own or collaborate on."
        />
      )}
      <div className="spk-track-list">
        {tracks.map((entry) => (
          <TrackRow
            key={entry.track.id}
            track={entry.track}
            addedAt={entry.added_at}
            onPlay={() => playContext(playlist.uri, entry.track.uri)}
            onQueue={() => queueTrack(entry.track.uri)}
            onAddToPlaylist={() => setPlaylistTrack(entry.track)}
          />
        ))}
      </div>
      {playlistTrack && (
        <AddToPlaylistModal track={playlistTrack} onClose={() => setPlaylistTrack(null)} />
      )}
    </div>
  );
}
