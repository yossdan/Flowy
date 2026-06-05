import type { PublishedAlbum, Song } from "@/app/types/dashboard";

const ARTIST_API_URL = "http://localhost:8082";

export async function checkArtistStatusRequest(userId: string) {
  const response = await fetch(`${ARTIST_API_URL}/artists/exists/${userId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error validando artista: ${response.status}`);
  }

  return response.json() as Promise<{
    isArtist: boolean;
    role?: "artist" | "listener";
  }>;
}

export async function becomeArtistRequest(userId: string, artistName: string) {
  const response = await fetch(`${ARTIST_API_URL}/artists/create`, {
    method: "POST",
    body: JSON.stringify({
      userId,
      artistName,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let message = `Error en el servidor: ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody.message ?? errorBody.error ?? message;
    } catch {
      // El backend puede responder sin JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<{
    role?: "artist";
    isArtist?: boolean;
  }>;
}

export async function becomeListenerRequest(userId: string) {
  const response = await fetch(
    `${ARTIST_API_URL}/artists/delete-by-user/${userId}`,
    {
      method: "DELETE",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Error al dejar de ser artista: ${response.status}`);
  }

  return {
    role: "listener" as const,
  };
}

export type UploadAlbumTrack = {
  title: string;
  audioFile: File;
  collaboratorIds: string[];
  genreIds?: string[];
};

export type UploadAlbumPayload = {
  userId: string;
  albumName: string;
  coverFile: File;
  tracks: UploadAlbumTrack[];
};

export async function uploadAlbumRequest(payload: UploadAlbumPayload) {
  const formData = new FormData();

  const albumDto = {
    userId: payload.userId,
    title: payload.albumName,
    songs: payload.tracks.map((track) => ({
      title: track.title,
      artistIds: track.collaboratorIds.map((artistId) => ({
        artistId,
      })),
      genreIds: (track.genreIds ?? []).map((genreId) => ({
        genreId,
      })),
    })),
  };

  formData.append(
    "album",
    new Blob([JSON.stringify(albumDto)], {
      type: "application/json",
    }),
  );

  formData.append("coverFile", payload.coverFile);

  payload.tracks.forEach((track) => {
    formData.append("songFiles", track.audioFile);
  });

  const response = await fetch(`${ARTIST_API_URL}/album/create`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Error backend /album/create:", {
      status: response.status,
      body: errorText,
    });

    throw new Error(errorText || `Error al publicar álbum: ${response.status}`);
  }

  return response.json() as Promise<PublishedAlbum>;
}

export async function getMyPublishedAlbumsRequest(userId: string) {
  const response = await fetch(`${ARTIST_API_URL}/album/my-albums/${userId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error cargando álbumes publicados: ${response.status}`);
  }

  return response.json() as Promise<PublishedAlbum[]>;
}

export type ArtistSearchItem = {
  id: string;
  name: string;
  type?: string;
};

export async function searchArtistsRequest(
  keyword: string,
): Promise<ArtistSearchItem[]> {
  const cleanKeyword = keyword.trim();

  if (!cleanKeyword) {
    return [];
  }

  const response = await fetch(
    `${ARTIST_API_URL}/artists/searchByName?keyword=${encodeURIComponent(
      cleanKeyword,
    )}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Error buscando artistas: ${response.status}`);
  }

  const artists = (await response.json()) as unknown[];

  const mappedArtists: ArtistSearchItem[] = [];

  artists.forEach((artist) => {
    const item = artist as Record<string, unknown>;

    const id = readValue(
      item,
      ["id", "artistId", "userId", "artist_id", "artistNewId"],
      "",
    );

    const name = readValue(
      item,
      ["name", "artistName", "userName", "title", "artist_name"],
      "",
    );

    if (!id || !name) return;

    mappedArtists.push({
      id,
      name,
      type: readValue(item, ["type", "role"], "Artista"),
    });
  });

  return mappedArtists;
}

export async function getAllArtistsRequest(): Promise<ArtistSearchItem[]> {
  const response = await fetch(`${ARTIST_API_URL}/artists/searchAll`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error cargando artistas: ${response.status}`);
  }

  const artists = (await response.json()) as unknown[];

  const mappedArtists: ArtistSearchItem[] = [];

  artists.forEach((artist) => {
    const item = artist as Record<string, unknown>;

    const id = readValue(
      item,
      ["id", "artistId", "userId", "artist_id", "artistNewId"],
      "",
    );

    const name = readValue(
      item,
      ["name", "artistName", "userName", "title", "artist_name"],
      "",
    );

    if (!id || !name) return;

    mappedArtists.push({
      id,
      name,
      type: readValue(item, ["type", "role"], "Artista"),
    });
  });

  return mappedArtists;
}

export type ArtistAlbum = {
  id: string;
  title: string;
  cover?: string | null;
  songs: Song[];
};

export type ArtistDetail = {
  id: string;
  name: string;
  photo?: string | null;
  albums: ArtistAlbum[];
  songs: Song[];
};

function readValue(
  item: Record<string, unknown>,
  keys: string[],
  fallback = "",
) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const objectValue = value as Record<string, unknown>;
      const nestedValue =
        objectValue.name ??
        objectValue.artistName ??
        objectValue.userName ??
        objectValue.title ??
        objectValue.albumName ??
        objectValue.albumTitle ??
        objectValue.songTitle;

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

function readNumber(
  item: Record<string, unknown>,
  keys: string[],
  fallback = 0,
) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return normalizeDuration(value);
    }

    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
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

function readArray(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (Array.isArray(value)) return value;
  }

  return [];
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



function imageToUrl(value: unknown) {
  if (!value) return null;

  if (Array.isArray(value)) {
    return `data:image/jpeg;base64,${bytesToBase64(value as number[])}`;
  }

  if (typeof value !== "string") return null;

  const cleanValue = value.trim();

  if (!cleanValue) return null;

  if (cleanValue.startsWith("http")) {
    return cleanValue;
  }

  if (cleanValue.startsWith("data:image")) {
    return cleanValue;
  }

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
    return `${ARTIST_API_URL}${cleanValue}`;
  }

  return `data:image/jpeg;base64,${cleanValue}`;
}

function getImageFromObject(item: Record<string, unknown>) {
  return imageToUrl(
    item.cover ??
      item.coverImage ??
      item.coverPhoto ??
      item.albumCover ??
      item.albumCoverImage ??
      item.albumPhoto ??
      item.albumImage ??
      item.image ??
      item.imageUrl ??
      item.urlImage ??
      item.photo ??
      item.profilePhoto ??
      item.artistPhoto ??
      item.avatar ??
      item.picture,
  );
}

function getAlbumId(album: Record<string, unknown>) {
  return readValue(
    album,
    ["id", "albumId", "albumNewId", "album_id", "albumNew_id"],
    `album-${Date.now()}-${Math.random()}`,
  );
}

function getSongId(song: Record<string, unknown>) {
  return readValue(
    song,
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

function mapArtistSong(
  rawSong: unknown,
  albumName = "Álbum",
  artistName = "Artista",
  albumCover: string | null = null,
): Song {
  const item = rawSong as Record<string, unknown>;
  const id = getSongId(item);
  const songCover = getImageFromObject(item) ?? albumCover;

  return {
    id,
    title: readValue(
      item,
      ["title", "songTitle", "name", "songName", "musicName", "trackName"],
      "Canción",
    ),
    artist: readValue(
      item,
      [
        "artist",
        "artistName",
        "nameArtist",
        "userName",
        "author",
        "singer",
        "artist_name",
      ],
      artistName,
    ),
    album: readValue(
      item,
      ["album", "albumName", "albumTitle", "titleAlbum", "album_name"],
      albumName,
    ),
    duration: readNumber(
      item,
      [
        "duration",
        "durationSeconds",
        "seconds",
        "durationInSeconds",
        "songDuration",
        "songDurationSeconds",
      ],
      0,
    ),
    cover: songCover,
    added: readValue(item, ["added", "createdAt", "created_at"], "Ahora"),
    audioUrl: `${ARTIST_API_URL}/album-detail/song/file/${id}`,
  };
}

function getAlbumSongs(album: Record<string, unknown>) {
  return readArray(album, [
    "songs",
    "canciones",
    "songSearches",
    "details",
    "albumDetails",
    "bestSongsByAlbum",
    "tracks",
    "music",
    "musics",
  ]);
}

export async function getArtistDetailsRequest(
  artistId: string,
): Promise<ArtistDetail> {
  const response = await fetch(`${ARTIST_API_URL}/artists/details/${artistId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error cargando perfil del artista: ${response.status}`);
  }

  const data = (await response.json()) as Record<string, unknown>;

  console.log("Detalle crudo del artista:", data);

  const artistName = readValue(
    data,
    ["name", "artistName", "userName", "artist_name"],
    "Artista",
  );

  const rawAlbums = readArray(data, [
    "albums",
    "albumes",
    "albumSearches",
    "artistAlbums",
    "publishedAlbums",
    "albumResponseDto",
    "albumResponses",
    "albumList",
  ]);

  const rawSongs = readArray(data, [
    "songs",
    "canciones",
    "songSearches",
    "artistSongs",
    "popularSongs",
    "bestSongs",
    "bestSongsByAlbum",
    "songResponseDto",
    "songResponses",
    "songList",
  ]);

  const albums: ArtistAlbum[] = rawAlbums.map((rawAlbum) => {
    const album = rawAlbum as Record<string, unknown>;

    const albumId = getAlbumId(album);

    const albumTitle = readValue(
      album,
      ["title", "albumName", "albumTitle", "name", "album_name"],
      "Álbum",
    );

    const albumCover = getImageFromObject(album);

    const albumSongs = getAlbumSongs(album).map((song) =>
      mapArtistSong(song, albumTitle, artistName, albumCover),
    );

    return {
      id: albumId,
      title: albumTitle,
      cover: albumCover,
      songs: albumSongs,
    };
  });

  const songsFromAlbums = albums.flatMap((album) => album.songs);

  const fallbackCover =
    albums.find((album) => album.cover)?.cover ??
    songsFromAlbums.find((song) => song.cover)?.cover ??
    null;

  const directSongs = rawSongs.map((song) =>
    mapArtistSong(song, "Álbum", artistName, fallbackCover),
  );

  const songs = [...songsFromAlbums, ...directSongs].filter(
    (song, index, array) =>
      array.findIndex((item) => item.id === song.id) === index,
  );

  const artistPhoto = getImageFromObject(data) ?? fallbackCover;

  return {
    id: readValue(data, ["id", "artistId", "artist_id"], artistId),
    name: artistName,
    photo: artistPhoto,
    albums,
    songs,
  };
}
