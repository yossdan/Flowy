import type { PublishedAlbum } from "@/app/types/dashboard";

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

  throw new Error(
    errorText || `Error al publicar álbum: ${response.status}`,
  );
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

  return artists
    .map((artist) => {
      const item = artist as Record<string, unknown>;

      const id =
        item.id ??
        item.artistId ??
        item.userId ??
        item.artist_id ??
        "";

      const name =
        item.name ??
        item.artistName ??
        item.userName ??
        item.title ??
        "Artista";

      return {
        id: String(id),
        name: String(name),
        type: item.type ? String(item.type) : undefined,
      };
    })
    .filter((artist) => artist.id && artist.name);
}

export async function getAllArtistsRequest() {
  const response = await fetch(`${ARTIST_API_URL}/artists/searchAll`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error cargando artistas: ${response.status}`);
  }

  return response.json() as Promise<
    {
      id: string;
      name: string;
      type?: string;
    }[]
  >;
}