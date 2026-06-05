import type { Song } from "@/app/types/dashboard";

const SEARCH_API_URL =
  process.env.NEXT_PUBLIC_MUSIC_API_URL || "http://flowymusic.tech:8082";

export type BackendSearchResponse = {
  artistSearches?: unknown[];
  albumSearches?: unknown[];
  songSearches?: unknown[];
};

export type ArtistSearchItem = {
  id: string;
  name: string;
  photo?: string | null;
  type?: string;
};

export type AlbumSearchItem = {
  id: string;
  title: string;
  artist: string;
  cover?: string | null;
  type?: string;
};

export type FrontSearchResponse = {
  artists: ArtistSearchItem[];
  albums: AlbumSearchItem[];
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

    if (Array.isArray(value) && value.length > 0) {
      const names = value
        .map((entry) => {
          if (typeof entry === "string") return entry;

          if (typeof entry === "object" && entry !== null) {
            const obj = entry as Record<string, unknown>;

            return (
              obj.name ??
              obj.artistName ??
              obj.userName ??
              obj.title ??
              obj.albumName ??
              obj.albumTitle ??
              ""
            );
          }

          return "";
        })
        .filter((name) => typeof name === "string" && name.trim())
        .join(", ");

      if (names.trim()) return names;
    }

    if (typeof value === "object" && value !== null) {
      const obj = value as Record<string, unknown>;

      const nestedValue =
        obj.name ??
        obj.artistName ??
        obj.userName ??
        obj.title ??
        obj.albumName ??
        obj.albumTitle ??
        obj.album ??
        obj.artist;

      if (typeof nestedValue === "string" && nestedValue.trim()) {
        return nestedValue;
      }

      if (typeof nestedValue === "number") {
        return String(nestedValue);
      }
    }
  }

  return fallback;
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
      return normalizeDuration(value);
    }

    if (typeof value === "string" && !Number.isNaN(Number(value))) {
      return normalizeDuration(Number(value));
    }
  }

  return fallback;
}

function normalizeDuration(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 0;

  if (value > 10000) {
    return Math.round(value / 1000);
  }

  return Math.round(value);
}

function getAudioMetadataDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(0);
      return;
    }

    const audio = new Audio();

    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audio.src = audioUrl;

    const cleanup = () => {
      audio.onloadedmetadata = null;
      audio.onerror = null;
      audio.removeAttribute("src");
      audio.load();
    };

    audio.onloadedmetadata = () => {
      const duration = audio.duration;

      cleanup();

      if (Number.isFinite(duration) && duration > 0) {
        resolve(Math.round(duration));
        return;
      }

      resolve(0);
    };

    audio.onerror = () => {
      cleanup();
      resolve(0);
    };
  });
}

function bytesToBase64(bytes: number[]) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return window.btoa(binary);
}

function normalizeImage(value: unknown) {
  if (!value) return null;

  if (Array.isArray(value)) {
    return `data:image/jpeg;base64,${bytesToBase64(value as number[])}`;
  }

  if (typeof value !== "string") return null;

  const cleanValue = value.trim();

  if (!cleanValue) return null;
  if (cleanValue.startsWith("http")) return cleanValue;
  if (cleanValue.startsWith("data:image")) return cleanValue;

  const looksLikeBase64Image =
    cleanValue.startsWith("/9j/") ||
    cleanValue.startsWith("iVBOR") ||
    cleanValue.startsWith("R0lGOD") ||
    cleanValue.startsWith("UklGR") ||
    cleanValue.length > 500;

  if (looksLikeBase64Image) {
    return `data:image/jpeg;base64,${cleanValue}`;
  }

  if (cleanValue.startsWith("/")) {
    return `${SEARCH_API_URL}${cleanValue}`;
  }

  return `data:image/jpeg;base64,${cleanValue}`;
}

function getSongId(item: Record<string, unknown>) {
  return getValue(
    item,
    [
      "id",
      "songId",
      "musicId",
      "albumDetailId",
      "albumDetailNewId",
      "album_detail_id",
      "song_id",
      "music_id",
    ],
    `song-${Date.now()}-${Math.random()}`,
  );
}

function mapSong(rawSong: unknown): Song {
  const item = rawSong as Record<string, unknown>;
  const id = getSongId(item);

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
    "albumCoverImage",
    "coverFile",
  ]);

  return {
    id,

    title: getValue(
      item,
      ["title", "songTitle", "name", "songName", "musicName", "trackName"],
      "Canción",
    ),

    artist: getValue(
      item,
      [
        "nameArtist",
        "artist",
        "artistName",
        "artists",
        "artistNames",
        "artistList",
        "songArtists",
        "userName",
        "author",
        "singer",
        "artist_name",
        "artistFullName",
        "artistResponseDto",
        "artistResponse",
        "artistDto",
      ],
      "Artista",
    ),

    album: getValue(
      item,
      [
        "album",
        "albumName",
        "albumTitle",
        "titleAlbum",
        "album_name",
        "albumNewName",
        "albumNewTitle",
        "albumResponseDto",
        "albumResponse",
        "albumDto",
      ],
      "Sin álbum",
    ),

    duration: getNumber(
      item,
      [
        "duration",
        "durationSeconds",
        "seconds",
        "durationInSeconds",
        "time",
        "songDuration",
        "songDurationSeconds",
      ],
      0,
    ),

    cover: normalizeImage(rawCover),

    added: getValue(
      item,
      ["added", "createdAt", "created_at", "date", "uploadDate"],
      "Ahora",
    ),

    audioUrl: `${SEARCH_API_URL}/album-detail/song/file/${id}`,
  };
}

function mapArtist(rawArtist: unknown): ArtistSearchItem | null {
  const item = rawArtist as Record<string, unknown>;

  const id = getValue(
    item,
    ["id", "artistId", "userId", "artist_id", "artistNewId"],
    "",
  );

  const name = getValue(
    item,
    ["name", "artistName", "userName", "title", "artist_name"],
    "Artista",
  );

  const rawPhoto = getRawValue(item, [
    "profilePhoto",
    "photo",
    "artistPhoto",
    "avatar",
    "picture",
    "image",
    "imageUrl",
    "urlImage",
  ]);

  if (!id || !name) return null;

  return {
    id,
    name,
    photo: normalizeImage(rawPhoto),
    type: getValue(item, ["type", "role"], "Artista"),
  };
}

function mapAlbum(rawAlbum: unknown): AlbumSearchItem | null {
  const item = rawAlbum as Record<string, unknown>;

  const id = getValue(
    item,
    ["id", "albumId", "albumNewId", "album_id"],
    "",
  );

  const title = getValue(
    item,
    [
      "title",
      "albumName",
      "albumTitle",
      "name",
      "album_name",
      "albumNewName",
      "albumNewTitle",
    ],
    "Álbum",
  );

  if (!id || !title) return null;

  const rawCover = getRawValue(item, [
    "cover",
    "coverImage",
    "coverPhoto",
    "albumCover",
    "image",
    "imageUrl",
    "urlImage",
    "coverUrl",
    "photo",
    "picture",
    "albumImage",
    "albumPhoto",
    "albumCoverImage",
    "coverFile",
  ]);

  return {
    id,
    title,
    artist: getValue(
      item,
      [
        "nameArtist",
        "artist",
        "artistName",
        "artists",
        "artistNames",
        "userName",
        "author",
        "artist_name",
      ],
      "Artista",
    ),
    cover: normalizeImage(rawCover),
    type: getValue(item, ["type"], "ALBUM"),
  };
}

export async function getAlbumSongsRequest(
  album: AlbumSearchItem,
): Promise<Song[]> {
  const response = await fetch(
    `${SEARCH_API_URL}/album-detail/songs/${album.id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Error cargando canciones del álbum: ${response.status}`);
  }

  const data = (await response.json()) as unknown[];

  const songs = data.map((rawSong) => {
    const item = rawSong as Record<string, unknown>;
    const id = getSongId(item);

    const mappedSong = mapSong({
      ...item,
      id,
      albumName: album.title,
      nameArtist: album.artist,
      coverImage: album.cover,
    });

    return {
      ...mappedSong,
      id,
      title: getValue(
        item,
        ["title", "songTitle", "name", "songName", "musicName", "trackName"],
        mappedSong.title || "Canción",
      ),
      album: album.title,
      artist: album.artist,
      cover: album.cover,
      duration: mappedSong.duration || 0,
      audioUrl: `${SEARCH_API_URL}/album-detail/song/file/${id}`,
    };
  });

  const songsWithDurations = await Promise.all(
    songs.map(async (song) => {
      if (song.duration && song.duration > 0) {
        return song;
      }

      const duration = await getAudioMetadataDuration(song.audioUrl);

      return {
        ...song,
        duration,
      };
    }),
  );

  return songsWithDurations;
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

  return {
    artists: (data.artistSearches ?? [])
      .map(mapArtist)
      .filter((artist): artist is ArtistSearchItem => Boolean(artist)),

    albums: (data.albumSearches ?? [])
      .map(mapAlbum)
      .filter((album): album is AlbumSearchItem => Boolean(album)),

    songs: (data.songSearches ?? []).map(mapSong),
  };
}
