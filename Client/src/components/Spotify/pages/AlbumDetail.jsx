import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import {
  getAlbum,
  getAlbumTracks,
  libraryContains,
  removeLibraryUris,
  saveLibraryUris,
} from "../../../spotify/api";
import { imageUrl } from "../../../spotify/format";
import { TrackRow } from "../ui/TrackRow";
import { AddToPlaylistModal } from "../ui/AddToPlaylistModal";
import { ErrorState, LoadingSkeleton } from "../ui/StatusBlocks";

export default function AlbumDetail() {
  const { id } = useParams();
  const { playUri, playContext, queueTrack, queueMany } = useSpotify();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [playlistTrack, setPlaylistTrack] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      try {
        const [detail, trackPage] = await Promise.all([
          getAlbum(id),
          getAlbumTracks(id, { limit: 50 }),
        ]);
        if (cancelled) return;
        setAlbum(detail.data);
        setTracks(trackPage.data.items || []);
        try {
          const contains = await libraryContains([detail.data.uri]);
          if (!cancelled) setSaved(Boolean(contains.data?.[0]));
        } catch {
          if (!cancelled) setSaved(false);
        }
        setStatus("success");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.response?.data?.error?.message || "Album unavailable.");
          setStatus("error");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") return <LoadingSkeleton label="Loading album…" />;
  if (status === "error") return <ErrorState body={error} />;
  if (!album) return null;

  const toggleSave = async () => {
    try {
      if (saved) {
        await removeLibraryUris([album.uri]);
        setSaved(false);
        toast.success("Removed from library");
      } else {
        await saveLibraryUris([album.uri]);
        setSaved(true);
        toast.success("Saved album");
      }
    } catch {
      toast.error("Could not update library");
    }
  };

  const queueAlbum = async () => {
    await queueMany(tracks.slice(0, 20).map((track) => track.uri).filter(Boolean));
  };

  return (
    <div className="spk-detail">
      <div className="spk-detail-hero">
        {imageUrl(album.images) && <img src={imageUrl(album.images, "large")} alt="" />}
        <div>
          <p className="spk-kicker">Album</p>
          <h2>{album.name}</h2>
          <p>
            {album.artists?.map((artist) => (
              <Link key={artist.id} to={`/spotify/artists/${artist.id}`}>
                {artist.name}
              </Link>
            ))}
          </p>
          <p className="spk-meta">{album.release_date}</p>
          <div className="spk-actions">
            <button type="button" className="spk-btn" onClick={() => playUri(album.uri, "album")}>
              Play album
            </button>
            <button type="button" className="spk-btn secondary" onClick={queueAlbum}>
              Add tracks to queue
            </button>
            <button type="button" className="spk-btn secondary" onClick={toggleSave}>
              {saved ? "Remove from library" : "Save album"}
            </button>
          </div>
        </div>
      </div>
      <div className="spk-track-list">
        {tracks.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            album={album}
            showAlbum={false}
            onPlay={() => playContext(album.uri, track.uri)}
            onQueue={() => queueTrack(track.uri)}
            onAddToPlaylist={() => setPlaylistTrack({ ...track, album })}
          />
        ))}
      </div>
      {playlistTrack && (
        <AddToPlaylistModal track={playlistTrack} onClose={() => setPlaylistTrack(null)} />
      )}
    </div>
  );
}
