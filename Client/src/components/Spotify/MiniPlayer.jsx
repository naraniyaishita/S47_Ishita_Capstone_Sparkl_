import React from "react";
import {
  TbArrowsShuffle,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
  TbRepeat,
  TbRepeatOnce,
  TbList,
  TbMusic,
} from "react-icons/tb";
import { useSpotify } from "../../spotify/SpotifyProvider";
import { artistNames, formatDuration, imageUrl } from "../../spotify/format";

export default function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    shuffle,
    repeatMode,
    progressMs,
    durationMs,
    togglePlayback,
    nextTrack,
    previousTrack,
    toggleShuffle,
    cycleRepeat,
    seek,
    volume,
    setVolume,
    setQueueOpen,
    token,
  } = useSpotify();

  if (!token) return null;

  const cover = imageUrl(currentTrack?.album?.images, "small");
  const progress = durationMs ? Math.min(100, (progressMs / durationMs) * 100) : 0;
  const RepeatIcon = repeatMode === "track" ? TbRepeatOnce : TbRepeat;

  const onSeek = (event) => {
    if (!durationMs) return;
    const value = Number(event.target.value);
    seek((value / 100) * durationMs);
  };

  return (
    <div className="spk-mini" role="region" aria-label="Playback">
      <div className="spk-mini-track">
        {cover ? (
          <img src={cover} alt="" />
        ) : (
          <TbMusic className="spk-mini-fallback" />
        )}
        <div>
          <strong>{currentTrack?.name || "Nothing playing"}</strong>
          <span>{currentTrack ? artistNames(currentTrack.artists) : "Open Spotify on a device to start"}</span>
        </div>
      </div>

      <div className="spk-mini-controls">
        <div className="spk-mini-buttons">
          <button
            type="button"
            onClick={toggleShuffle}
            className={shuffle ? "isActive" : ""}
            aria-pressed={shuffle}
            aria-label={`Shuffle ${shuffle ? "on" : "off"}`}
            title={`Shuffle ${shuffle ? "on" : "off"}`}
          >
            <TbArrowsShuffle />
          </button>
          <button type="button" onClick={previousTrack} aria-label="Previous">
            <TbPlayerTrackPrevFilled />
          </button>
          <button
            type="button"
            className="spk-mini-play"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <TbPlayerPauseFilled /> : <TbPlayerPlayFilled />}
          </button>
          <button type="button" onClick={nextTrack} aria-label="Next">
            <TbPlayerTrackNextFilled />
          </button>
          <button
            type="button"
            onClick={cycleRepeat}
            className={repeatMode !== "off" ? "isActive" : ""}
            aria-label={`Repeat ${repeatMode}`}
            title={`Repeat ${repeatMode}`}
          >
            <RepeatIcon />
          </button>
        </div>
        <div className="spk-mini-progress">
          <span>{formatDuration(progressMs)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={onSeek}
            aria-label="Seek"
          />
          <span>{formatDuration(durationMs)}</span>
        </div>
      </div>

      <button
        type="button"
        className="spk-mini-queue"
        onClick={() => setQueueOpen(true)}
        aria-label="Open queue"
      >
        <TbList />
        Queue
      </button>
      <label className="spk-volume" title="Volume">
        <span aria-hidden="true">Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Volume"
        />
      </label>
    </div>
  );
}
