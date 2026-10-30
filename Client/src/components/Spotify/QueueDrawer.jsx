import React, { useEffect } from "react";
import { TbPlayerPlayFilled, TbRefresh, TbX } from "react-icons/tb";
import { useSpotify } from "../../spotify/SpotifyProvider";
import { artistNames, imageUrl } from "../../spotify/format";
import { EmptyState, ErrorState, LoadingSkeleton } from "./ui/StatusBlocks";

export default function QueueDrawer() {
  const {
    queueOpen,
    setQueueOpen,
    queue,
    queueStatus,
    queueError,
    refreshQueue,
    playUri,
    token,
  } = useSpotify();

  useEffect(() => {
    if (queueOpen && token) {
      refreshQueue();
    }
  }, [queueOpen, token, refreshQueue]);

  if (!queueOpen) return null;

  const current = queue.currently_playing;
  const upcoming = (queue.queue || []).filter((item) => item?.type !== "episode");

  return (
    <div className="spk-drawer-backdrop" onClick={() => setQueueOpen(false)}>
      <aside
        className="spk-drawer"
        role="dialog"
        aria-label="Playback queue"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <h2>Queue</h2>
          <div>
            <button type="button" onClick={refreshQueue} aria-label="Refresh queue">
              <TbRefresh />
            </button>
            <button type="button" onClick={() => setQueueOpen(false)} aria-label="Close queue">
              <TbX />
            </button>
          </div>
        </header>
        <p className="spk-drawer-note">
          Spotify lets Sparkl add tracks and read the current queue. Individual
          queue items cannot be removed through the Web API.
        </p>

        {queueStatus === "loading" && <LoadingSkeleton label="Loading queue…" />}
        {queueStatus === "error" && (
          <ErrorState body={queueError} onRetry={refreshQueue} />
        )}
        {queueStatus === "success" && (
          <>
            <h3>Now playing</h3>
            {current ? (
              <QueueRow item={current} current />
            ) : (
              <EmptyState title="Nothing playing" body="Start a song in Spotify first." />
            )}
            <h3>Next up</h3>
            {upcoming.length === 0 ? (
              <EmptyState
                title="Queue is empty"
                body="Use Add to queue on search, library, or album pages."
              />
            ) : (
              upcoming.map((item, index) => (
                <QueueRow
                  key={`${item.id}-${index}`}
                  item={item}
                  onPlay={() => playUri(item.uri, "track")}
                />
              ))
            )}
          </>
        )}
      </aside>
    </div>
  );
}

function QueueRow({ item, current, onPlay }) {
  const cover = imageUrl(item.album?.images, "small");
  return (
    <div className={`spk-queue-row ${current ? "is-current" : ""}`}>
      {cover ? <img src={cover} alt="" /> : <span />}
      <div>
        <strong>{item.name}</strong>
        <span>{artistNames(item.artists)}</span>
      </div>
      {onPlay && (
        <button type="button" onClick={onPlay} aria-label={`Play ${item.name}`}>
          <TbPlayerPlayFilled />
        </button>
      )}
    </div>
  );
}
