import type { Song } from "@/app/types/dashboard";

const SEARCH_API_URL =
  process.env.NEXT_PUBLIC_MUSIC_API_URL || "http://localhost:8082";

export type BackendSearchResponse = {
  artistSearches?: unknown[];
  albumSearches?: unknown[];
  songSearches?: unknown[];
};

export type FrontSearchResponse = {
  artists: string[];
  albums: string[];
  songs: Song[];
};

function getValue(item: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return fallback;
}

function normalizeImage(value: unknown) {
  if (!value) return null;

  if (typeof value !== "string") return null;

  const cleanValue = value.trim();

  if (!cleanValue) return null;

  if (cleanValue.startsWith("http")) return cleanValue;

  if (cleanValue.startsWith("data:image")) return cleanValue;

  const looksLikeBase64Image =
    cleanValue.startsWith("/9j/") ||
    cleanValue.startsWith("iVBOR") ||
    cleanValue.startsWith("R0lGOD") ||
    cleanValue.length > 500;

  if (looksLikeBase64Image) {
    return `data:image/jpeg;base64,${cleanValue}`;
  }

  if (cleanValue.startsWith("/")) {
    return `${SEARCH_API_URL}${cleanValue}`;
  }

  return `data:image/jpeg;base64,${cleanValue}`;
}


function getRawValue(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }

  return null;
}

function getNumber(item: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }

  return fallback;
}

function mapSong(rawSong: unknown): Song {
  const item = rawSong as Record<string, unknown>;

  const rawCover = getRawValue(item, [
    "cover",
    "coverImage",
    "albumCover",
    "image",
    "imageUrl",
    "urlImage",
    "coverUrl",
    "photo",
    "picture",
    "albumImage",
    "albumPhoto",
  ]);

  console.log("Cover recibido:", rawCover);
  console.log("Cover normalizado:", normalizeImage(rawCover));

  return {
    id: getValue(
      item,
      ["id", "songId", "musicId", "albumDetailId", "albumDetailNewId"],
      `song-${Date.now()}-${Math.random()}`,
    ),
    title: getValue(item, ["title", "songTitle", "name"], "Canción"),
    artist: getValue(
      item,
      ["artist", "artistName", "userName", "author"],
      "Artista",
    ),
    album: getValue(item, ["album", "albumName", "albumTitle"], "Álbum"),
    duration: getNumber(item, ["duration", "durationSeconds", "seconds"], 0),
    cover: normalizeImage(rawCover),
    added: getValue(item, ["added", "createdAt"], "Ahora"),
  };
}



function mapName(rawItem: unknown, fallback: string) {
  const item = rawItem as Record<string, unknown>;

  return getValue(
    item,
    ["name", "artistName", "title", "albumName", "albumTitle", "userName"],
    fallback,
  );
}

export async function searchRequest(
  keyword: string,
): Promise<FrontSearchResponse> {
  const cleanKeyword = keyword.trim();

  if (!cleanKeyword) {
    return {
      artists: [],
      albums: [],
      songs: [],
    };
  }

  const response = await fetch(
    `${SEARCH_API_URL}/search?keyword=${encodeURIComponent(cleanKeyword)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Error buscando: ${response.status}`);
  }

  const data = (await response.json()) as BackendSearchResponse;

  console.log("Respuesta completa search:", data);
  console.log("Canciones recibidas:", data.songSearches);

  return {
    artists: (data.artistSearches ?? [])
      .map((artist) => mapName(artist, "Artista"))
      .filter(Boolean),

    albums: (data.albumSearches ?? [])
      .map((album) => mapName(album, "Álbum"))
      .filter(Boolean),

    songs: (data.songSearches ?? []).map(mapSong),
  };
}