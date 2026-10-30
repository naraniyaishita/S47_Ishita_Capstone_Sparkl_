import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import {
  MOODS,
  explainTrackForMood,
  generateCandidateTracks,
  suggestFromPrompt,
} from "../../../spotify/discovery";
import { TrackRow } from "../ui/TrackRow";
import { EmptyState, ErrorState, LoadingSkeleton } from "../ui/StatusBlocks";

export default function DiscoverPage() {
  const { playUri, queueTrack, savePlaylist } = useSpotify();
  const [mood, setMood] = useState("chill");
  const [theme, setTheme] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tracks, setTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("Sparkl mix");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [assistantNote, setAssistantNote] = useState("");

  const generate = async (event) => {
    event?.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const results = await generateCandidateTracks({
        mood,
        theme,
        artist,
        genre,
      });
      setTracks(results);
      setStatus("success");
    } catch (generateError) {
      setError(generateError.response?.data?.error?.message || "Could not build a mix.");
      setStatus("error");
    }
  };

  const applyPrompt = () => {
    const suggestion = suggestFromPrompt(prompt);
    setMood(suggestion.mood);
    setTheme(suggestion.theme);
    setAssistantNote(
      `Local assistant mapped that prompt to ${suggestion.mood}. No external AI service is required.`
    );
  };

  const removeTrack = (id) => {
    setTracks((current) => current.filter((track) => track.id !== id));
  };

  const save = async () => {
    try {
      await savePlaylist(
        playlistName || "Sparkl mix",
        `Generated in Sparkl from ${mood}${theme ? ` / ${theme}` : ""}`,
        tracks.map((track) => track.uri)
      );
    } catch {
      toast.error("Could not save playlist");
    }
  };

  return (
    <div className="spk-page-block">
      <header className="spk-page-head">
        <h2>Discover</h2>
        <p>
          Spotify retired public recommendation and audio-feature endpoints for
          most apps. Sparkl builds mixes from catalog search plus your top tracks.
        </p>
      </header>

      <form className="spk-discover" onSubmit={generate}>
        <div className="spk-moods">
          {MOODS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mood === item.id ? "is-active" : ""}
              onClick={() => setMood(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label>
          Theme
          <input value={theme} onChange={(event) => setTheme(event.target.value)} placeholder="rainy night drive" />
        </label>
        <label>
          Favorite artist
          <input value={artist} onChange={(event) => setArtist(event.target.value)} placeholder="Artist name" />
        </label>
        <label>
          Genre
          <input value={genre} onChange={(event) => setGenre(event.target.value)} placeholder="indie, jazz, afrobeats" />
        </label>
        <button type="submit" className="spk-btn">
          Preview mix
        </button>
      </form>

      <section className="spk-assistant">
        <h3>Optional prompt helper</h3>
        <p>This stays on-device. It only maps words to a mood and theme.</p>
        <div className="spk-inline-form">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="music for a late study session"
            aria-label="Music prompt"
          />
          <button type="button" className="spk-btn secondary" onClick={applyPrompt}>
            Map prompt
          </button>
        </div>
        {assistantNote && <p className="spk-meta">{assistantNote}</p>}
      </section>

      {status === "idle" && (
        <EmptyState title="Build a mix" body="Pick a mood or add a theme, then preview tracks before saving." />
      )}
      {status === "loading" && <LoadingSkeleton label="Gathering tracks…" />}
      {status === "error" && <ErrorState body={error} onRetry={generate} />}
      {status === "success" && (
        <>
          <div className="spk-toolbar">
            <input
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
              aria-label="Playlist name"
            />
            <button type="button" className="spk-btn" onClick={save} disabled={!tracks.length}>
              Save playlist
            </button>
          </div>
          <div className="spk-track-list">
            {tracks.map((track) => (
              <div key={track.id} className="spk-discover-row">
                <TrackRow
                  track={track}
                  onPlay={() => playUri(track.uri)}
                  onQueue={() => queueTrack(track.uri)}
                />
                <p className="spk-why">{explainTrackForMood(track, mood)}</p>
                <button
                  type="button"
                  className="spk-btn secondary spk-remove-btn"
                  onClick={() => removeTrack(track.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
