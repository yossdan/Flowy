import { apiFormRequest, apiRequest } from "@/app/services/http.service";
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
    throw new Error(`Error en el servidor: ${response.status}`);
  }

  return response.json() as Promise<{
    role?: "artist";
    isArtist?: boolean;
  }>;
}

export async function becomeListenerRequest(userId: string) {
  const response = await fetch(`${ARTIST_API_URL}/artists/delete-by-user/${userId}`, {
    method: "DELETE",
    cache: "no-store",
  });

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
};

export type UploadAlbumPayload = {
  albumName: string;
  coverFile: File;
  tracks: UploadAlbumTrack[];
};

export async function uploadAlbumRequest(payload: UploadAlbumPayload) {
  const formData = new FormData();

  formData.append("albumName", payload.albumName);
  formData.append("coverFile", payload.coverFile);

  payload.tracks.forEach((track, index) => {
    formData.append(`tracks[${index}].title`, track.title);
    formData.append(`tracks[${index}].audioFile`, track.audioFile);

    track.collaboratorIds.forEach((collaboratorId) => {
      formData.append(`tracks[${index}].collaboratorIds`, collaboratorId);
    });
  });

  return apiFormRequest<PublishedAlbum>("/albums", formData, {
    method: "POST",
  });
}

export async function getMyPublishedAlbumsRequest() {
  return apiRequest<PublishedAlbum[]>("/artists/me/albums");
}