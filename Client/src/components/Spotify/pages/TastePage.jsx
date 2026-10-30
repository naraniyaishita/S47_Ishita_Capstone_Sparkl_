import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTopItems } from "../../../spotify/api";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import { artistNames, imageUrl } from "../../../spotify/format";
import { MediaCard } from "../ui/MediaCard";
import { TrackRow } from "../ui/TrackRow";
import { AddToPlaylistModal } from "../ui/AddToPlaylistModal";
import { EmptyState, ErrorState, LoadingSkeleton } from "../ui/StatusBlocks";

const RANGES = [
  { id: "short_term", label: "4 weeks" },
  { id: "medium_term", label: "6 months" },
  { id: "long_term", label: "All time*" },
];

export default function TastePage() {
  const { playUri, queueTrack, loadRecent, library } = useSpotify();
  const [range, setRange] = useState("medium_term");
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [playlistTrack, setPlaylistTrack] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      try {
        const [artistRes, trackRes] = await Promise.all([
          getTopItems("artists", range, 10),
          getTopItems("tracks", range, 10),
          loadRecent(),
        ]);
        if (cancelled) return;
        setArtists(artistRes.data.items || []);
        setTracks(trackRes.data.items || []);
        setStatus("success");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.response?.data?.error?.message || "Could not load taste data.");
          setStatus("error");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [range, loadRecent]);

  const recent = library.recent?.items || [];

  return (
    <div className="spk-page-block">
      <header className="spk-page-head">
        <h2>Your Taste</h2>
        <p>
          Built from Spotify top artists, top tracks, and recently played items.
          Play counts and listening minutes are not available from the Web API.
        </p>
      </header>
      <div className="spk-tabs">
        {RANGES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={range === item.id ? "is-active" : ""}
            onClick={() => setRange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="spk-meta">* All time is Spotify&apos;s long-term window, not a lifetime history.</p>

      {status === "loading" && <LoadingSkeleton />}
      {status === "error" && <ErrorState body={error} />}

      {status === "success" && (
        <>
          <section className="spk-overview">
            <article>
              <span>Favorite artist</span>
              <strong>{artists[0]?.name || "—"}</strong>
            </article>
            <article>
              <span>Favorite track</span>
              <strong>{tracks[0]?.name || "—"}</strong>
            </article>
            <article>
              <span>Recently played</span>
              <strong>{recent[0]?.track?.name || "—"}</strong>
            </article>
            <article>
              <span>Top lists</span>
              <strong>
                {artists.length} artists · {tracks.length} tracks
              </strong>
            </article>
          </section>

          <section className="spk-section">
            <header>
              <h3>Top artists</h3>
            </header>
            {artists.length === 0 ? (
              <EmptyState title="No top artists yet" body="Listen on Spotify for a while, then refresh." />
            ) : (
              <div className="spk-rank-list">
                {artists.map((artist, index) => (
                  <Link key={artist.id} to={`/spotify/artists/${artist.id}`} className="spk-rank">
                    <b>{index + 1}</b>
                    <div className="spk-rank-bar" style={{ width: `${100 - index * 7}%` }} />
                    {imageUrl(artist.images, "small") && <img src={imageUrl(artist.images, "small")} alt="" />}
                    <span>{artist.name}</span>
                  </Link>
                ))}
              </div>
            )}
            <div className="spk-card-row">
              {artists.map((artist) => (
                <MediaCard
                  key={`card-${artist.id}`}
                  to={`/spotify/artists/${artist.id}`}
                  title={artist.name}
                  images={artist.images}
                  round
                />
              ))}
            </div>
          </section>

          <section className="spk-section">
            <header>
              <h3>Top tracks</h3>
            </header>
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
              <h3>Recently played</h3>
            </header>
            <p className="spk-meta">
              Spotify returns about the last 50 unique plays, not a full listening archive.
            </p>
            <div className="spk-card-row">
              {recent.slice(0, 10).map((item, index) => (
                <MediaCard
                  key={`${item.played_at}-${index}`}
                  title={item.track?.name}
                  subtitle={artistNames(item.track?.artists)}
                  images={item.track?.album?.images}
                  onPlay={() => playUri(item.track.uri)}
                />
              ))}
            </div>
          </section>
        </>
      )}
      {playlistTrack && (
        <AddToPlaylistModal track={playlistTrack} onClose={() => setPlaylistTrack(null)} />
      )}
    </div>
  );
}
