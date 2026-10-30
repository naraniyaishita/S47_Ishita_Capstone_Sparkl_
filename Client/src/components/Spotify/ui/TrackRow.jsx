import React from "react";
import {
  TbPlayerPlayFilled,
  TbPlaylistAdd,
  TbHeart,
  TbDots,
} from "react-icons/tb";
import { artistNames, formatDate, formatDuration, imageUrl } from "../../../spotify/format";

export function TrackRow({
  track,
  album,
  addedAt,
  onPlay,
  onQueue,
  onSave,
  onAddToPlaylist,
  showAlbum = true,
}) {
  if (!track) return null;
  const cover = imageUrl(track.album?.images || album?.images, "small");

  return (
    <article className="spk-track">
      <button
        type="button"
        className="PlayButton"
        style={{ backgroundImage: cover ? `url(${cover})` : "none" }}
        onClick={onPlay}
        aria-label={`Play ${track.name}`}
      >
        <TbPlayerPlayFilled />
      </button>
      <div className="spk-track-copy">
        <p>{track.name}</p>
        <small>{artistNames(track.artists)}</small>
      </div>
      {showAlbum && (
        <span className="spk-track-album">
          {track.album?.name || album?.name || ""}
        </span>
      )}
      {addedAt && <span className="spk-track-date">{formatDate(addedAt)}</span>}
      <span className="spk-track-time">{formatDuration(track.duration_ms)}</span>
      <div className="spk-track-actions">
        {onQueue && (
          <button type="button" onClick={onQueue} title="Add to queue" aria-label="Add to queue">
            <TbPlaylistAdd />
          </button>
        )}
        {onSave && (
          <button type="button" onClick={onSave} title="Save track" aria-label="Save track">
            <TbHeart />
          </button>
        )}
        {onAddToPlaylist && (
          <button
            type="button"
            onClick={onAddToPlaylist}
            title="Add to playlist"
            aria-label="Add to playlist"
          >
            <TbDots />
          </button>
        )}
      </div>
    </article>
  );
}
