import React, { useEffect } from "react";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import { EmptyState } from "../ui/StatusBlocks";

export default function QueuePage() {
  const { setQueueOpen, queue, queueStatus } = useSpotify();

  useEffect(() => {
    setQueueOpen(true);
  }, [setQueueOpen]);

  return (
    <div className="spk-page-block">
      <header className="spk-page-head">
        <h2>Queue</h2>
        <p>The live queue opens in the side panel so it stays available on every page.</p>
      </header>
      <EmptyState
        title={queue.currently_playing?.name || "Open the queue panel"}
        body={
          queueStatus === "success"
            ? `${queue.queue?.length || 0} upcoming items from Spotify.`
            : "Use Add to queue on any track. Spotify does not allow deleting a single queued item from third-party apps."
        }
        action={
          <button type="button" className="spk-btn" onClick={() => setQueueOpen(true)}>
            Open queue
          </button>
        }
      />
    </div>
  );
}
