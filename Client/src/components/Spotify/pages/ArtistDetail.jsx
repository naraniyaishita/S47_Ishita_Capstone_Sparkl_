import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import {
  getArtist,
  getArtistAlbums,
  getArtistHighlightTracks,
  libraryContains,
  removeLibraryUris,
  saveLibraryUris,
} from "../../../spotify/api";
import { imageUrl } from "../../../spotify/format";
import { TrackRow } from "../ui/TrackRow";
import { MediaCard } from "../ui/MediaCard";
import { AddToPlaylistModal } from "../ui/AddToPlaylistModal";
import { ErrorState, LoadingSkeleton } from "../ui/StatusBlocks";

export default function ArtistDetail() {
  const { id } = useParams();
  const { playUri, queueTrack } = useSpotify();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [trackSource, setTrackSource] = useState("");
  const [albums, setAlbums] = useState([]);
  const [following, setFollowing] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [playlistTrack, setPlaylistTrack] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      try {
        const detail = await getArtist(id);
        if (cancelled) return;
        setArtist(detail.data);
        const [highlights, albumPage] = await Promise.all([
          getArtistHighlightTracks(detail.data),
          getArtistAlbums(id),
        ]);
        if (cancelled) return;
        setTracks(highlights.tracks);
        setTrackSource(highlights.source);
        setAlbums(albumPage.data.items || []);
        try {
          const contains = await libraryContains([detail.data.uri]);
          if (!cancelled) setFollowing(Boolean(contains.data?.[0]));
        } catch {
          if (!cancelled) setFollowing(false);
        }
        setStatus("success");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.response?.data?.error?.message || "Artist unavailable.");
          setStatus("error");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") return <LoadingSkeleton label="Loading artist…" />;
  if (status === "error") return <ErrorState body={error} />;
  if (!artist) return null;

  const toggleFollow = async () => {
    try {
      if (following) {
        await removeLibraryUris([artist.uri]);
        setFollowing(false);
      } else {
        await saveLibraryUris([artist.uri]);
        setFollowing(true);
      }
    } catch {
      toast.error("Could not update follow state");
    }
  };

  const playHighlights = () => {
    const first = tracks.find((track) => track.uri);
    if (first) playUri(first.uri);
  };

  return (
    <div className="spk-detail">
      <div className="spk-detail-hero">
        {imageUrl(artist.images) && <img src={imageUrl(artist.images, "large")} alt="" className="is-round" />}
        <div>
          <p className="spk-kicker">Artist</p>
          <h2>{artist.name}</h2>
          <p>{(artist.genres || []).slice(0, 4).join(" · ")}</p>
          <div className="spk-actions">
            <button type="button" className="spk-btn" onClick={playHighlights}>
              Play highlights
            </button>
            <button type="button" className="spk-btn secondary" onClick={toggleFollow}>
              {following ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>
      <section className="spk-section">
        <header>
          <h3>{trackSource === "top-tracks" ? "Top tracks" : "Tracks from search"}</h3>
        </header>
        {trackSource === "search" && (
          <p className="spk-meta">
            Spotify no longer provides artist top-tracks for many apps. These
            results come from a catalog search for this artist.
          </p>
        )}
        <div className="spk-track-list">
          {tracks.map((track) => (
            <TrackRow
              key={track.id}
              track={track}
              onPlay={() => playUri(track.uri)}
              onQueue={() => queueTrack(track.uri)}
              onAddToPlaylist={() => setPlaylistTrack(track)}
            />
          ))}
        </div>
      </section>
      <section className="spk-section">
        <header>
          <h3>Albums</h3>
        </header>
        <div className="spk-card-grid">
          {albums.map((album) => (
            <MediaCard
              key={album.id}
              to={`/spotify/albums/${album.id}`}
              title={album.name}
              images={album.images}
              meta={album.release_date}
              onPlay={() => playUri(album.uri, "album")}
            />
          ))}
        </div>
      </section>
      {playlistTrack && (
        <AddToPlaylistModal track={playlistTrack} onClose={() => setPlaylistTrack(null)} />
      )}
    </div>
  );
}
