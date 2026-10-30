import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addItemsToPlaylist } from "../../../spotify/api";
import { useSpotify } from "../../../spotify/SpotifyProvider";

export function AddToPlaylistModal({ track, onClose }) {
  const { loadPlaylists, savePlaylist, library } = useSpotify();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadPlaylists().catch(() => {});
  }, [loadPlaylists]);

  if (!track) return null;

  const playlists = library.playlists?.items || [];

  const addToExisting = async (playlist) => {
    setBusy(true);
    try {
      await addItemsToPlaylist(playlist.id, [track.uri]);
      toast.success(`Added to ${playlist.name}`);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Could not add to playlist");
    } finally {
      setBusy(false);
    }
  };

  const createAndAdd = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await savePlaylist(name.trim(), "", [track.uri]);
      onClose();
    } catch (error) {
      toast.error("Could not create playlist");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="spk-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="playlist-modal-title">
      <div className="spk-modal">
        <header>
          <h2 id="playlist-modal-title">Add to playlist</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <p>
          {track.name} — choose a playlist you own, or create one. Spotify only
          allows adding tracks to playlists you can edit.
        </p>
        <form onSubmit={createAndAdd} className="spk-inline-form">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New playlist name"
            aria-label="New playlist name"
          />
          <button type="submit" className="spk-btn" disabled={busy}>
            Create
          </button>
        </form>
        <div className="spk-modal-list">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              type="button"
              disabled={busy}
              onClick={() => addToExisting(playlist)}
            >
              {playlist.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
