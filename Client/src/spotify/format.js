export function imageUrl(images, size = "medium") {
  if (!images?.length) return "";
  if (size === "small") return images[images.length - 1]?.url || images[0].url;
  if (size === "large") return images[0]?.url || "";
  return images[1]?.url || images[0]?.url || "";
}

export function artistNames(artists) {
  return (artists || []).map((artist) => artist.name).filter(Boolean).join(", ");
}

export function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function playlistTrackCount(playlist) {
  return playlist?.items?.total ?? playlist?.tracks?.total ?? 0;
}

export function playlistItemTrack(entry) {
  return entry?.item || entry?.track || null;
}

export function trackFromPlayerItem(item) {
  if (!item || item.type === "episode") return item;
  return item;
}
