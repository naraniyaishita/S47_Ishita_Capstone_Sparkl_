import { searchCatalog, getTopItems } from "./api";

export const MOODS = [
  {
    id: "happy",
    label: "Happy",
    query: "happy upbeat feel good pop",
    why: "Bright, major-key pop and feel-good hits tend to match an upbeat mood.",
  },
  {
    id: "chill",
    label: "Chill",
    query: "chill lo-fi acoustic relaxing",
    why: "Slower acoustic and lo-fi tracks usually sit well in a low-energy evening.",
  },
  {
    id: "energetic",
    label: "Energetic",
    query: "workout dance energy electronic",
    why: "High-tempo dance and workout tracks are a practical stand-in for energy.",
  },
  {
    id: "focus",
    label: "Focus",
    query: "focus instrumental study concentration",
    why: "Instrumental and study playlists reduce lyrics that compete for attention.",
  },
  {
    id: "sad",
    label: "Sad",
    query: "sad melancholy ballad emotional",
    why: "Ballads and melancholy vocals are a supported search proxy for a down mood.",
  },
  {
    id: "romantic",
    label: "Romantic",
    query: "romantic love songs r&b",
    why: "Love songs and soft R&B are a catalog search stand-in for romance.",
  },
];

function uniqueTracks(tracks) {
  const seen = new Set();
  return tracks.filter((track) => {
    if (!track?.id || seen.has(track.id) || !track.uri) return false;
    seen.add(track.id);
    return true;
  });
}

async function searchTracks(query, limit = 10) {
  const response = await searchCatalog({
    q: query,
    type: "track",
    limit,
  });
  return response.data?.tracks?.items || [];
}

export async function generateCandidateTracks({
  mood,
  theme,
  artist,
  genre,
  seedTracks = [],
}) {
  const queries = [];
  const moodMeta = MOODS.find((item) => item.id === mood);

  if (moodMeta) queries.push(moodMeta.query);
  if (theme?.trim()) queries.push(theme.trim());
  if (artist?.trim()) queries.push(`artist:"${artist.trim()}"`);
  if (genre?.trim()) queries.push(`genre:${genre.trim()} ${genre.trim()}`);

  const seedNames = seedTracks
    .map((track) => track.artists?.[0]?.name)
    .filter(Boolean)
    .slice(0, 2);
  seedNames.forEach((name) => queries.push(`artist:"${name}"`));

  if (!queries.length) {
    queries.push("discover weekly indie pop");
  }

  const searchResults = await Promise.all(
    queries.slice(0, 5).map((query) => searchTracks(query, 10))
  );

  let personal = [];
  try {
    const top = await getTopItems("tracks", "medium_term", 10);
    personal = top.data?.items || [];
  } catch {
    personal = [];
  }

  return uniqueTracks([
    ...seedTracks,
    ...searchResults.flat(),
    ...personal,
  ]).slice(0, 30);
}

export function explainTrackForMood(track, moodId) {
  const mood = MOODS.find((item) => item.id === moodId);
  const artist = track.artists?.[0]?.name || "This artist";
  if (!mood) {
    return `${track.name} by ${artist} matched your search and personal listening mix.`;
  }
  return `${track.name} by ${artist}: ${mood.why}`;
}

export function suggestFromPrompt(prompt) {
  const text = (prompt || "").toLowerCase();
  if (text.includes("run") || text.includes("gym") || text.includes("energy")) {
    return { mood: "energetic", theme: prompt };
  }
  if (text.includes("study") || text.includes("work") || text.includes("focus")) {
    return { mood: "focus", theme: prompt };
  }
  if (text.includes("sleep") || text.includes("calm") || text.includes("chill")) {
    return { mood: "chill", theme: prompt };
  }
  if (text.includes("heart") || text.includes("love") || text.includes("date")) {
    return { mood: "romantic", theme: prompt };
  }
  if (text.includes("sad") || text.includes("rain") || text.includes("break")) {
    return { mood: "sad", theme: prompt };
  }
  return { mood: "happy", theme: prompt };
}
