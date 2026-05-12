import { apiFormRequest, apiRequest } from "@/app/services/http.service";
import type { Song } from "@/app/types/dashboard";
import type { PlayerPlaylist } from "@/app/context/PlayerContext";

export type CreatePlaylistPayload = {
  title: string;
  subtitle?: string;
  icon?: string;
};

export type UpdatePlaylistPayload = {
  title?: string;
  subtitle?: string;
};

export async function getPlaylistsRequest() {
  return apiRequest<PlayerPlaylist[]>("/playlists");
}

export async function createPlaylistRequest(
  payload: CreatePlaylistPayload,
  coverImage?: File | null,
) {
  if (coverImage) {
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("subtitle", payload.subtitle ?? "");
    formData.append("icon", payload.icon ?? "fa-music");
    formData.append("coverImage", coverImage);

    return apiFormRequest<PlayerPlaylist>("/playlists", formData, {
      method: "POST",
    });
  }

  return apiRequest<PlayerPlaylist>("/playlists", {
    method: "POST",
    body: payload,
  });
}

export async function updatePlaylistRequest(
  playlistId: string,
  payload: UpdatePlaylistPayload,
  coverImage?: File | null,
) {
  if (coverImage) {
    const formData = new FormData();

    if (payload.title !== undefined) {
      formData.append("title", payload.title);
    }

    if (payload.subtitle !== undefined) {
      formData.append("subtitle", payload.subtitle);
    }

    formData.append("coverImage", coverImage);

    return apiFormRequest<PlayerPlaylist>(`/playlists/${playlistId}`, formData, {
      method: "PUT",
    });
  }

  return apiRequest<PlayerPlaylist>(`/playlists/${playlistId}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deletePlaylistRequest(playlistId: string) {
  return apiRequest<void>(`/playlists/${playlistId}`, {
    method: "DELETE",
  });
}

export async function addSongToPlaylistRequest(
  playlistId: string,
  songId: string,
) {
  return apiRequest<PlayerPlaylist>(`/playlists/${playlistId}/songs`, {
    method: "POST",
    body: { songId },
  });
}

export async function removeSongFromPlaylistRequest(
  playlistId: string,
  songId: string,
) {
  return apiRequest<void>(`/playlists/${playlistId}/songs/${songId}`, {
    method: "DELETE",
  });
}

export async function likeSongRequest(songId: string) {
  return apiRequest<Song>(`/songs/${songId}/like`, {
    method: "POST",
  });
}

export async function unlikeSongRequest(songId: string) {
  return apiRequest<void>(`/songs/${songId}/like`, {
    method: "DELETE",
  });
}

export async function saveSongToLibraryRequest(songId: string) {
  return apiRequest<Song>(`/library/songs`, {
    method: "POST",
    body: { songId },
  });
}

export async function removeSongFromLibraryRequest(songId: string) {
  return apiRequest<void>(`/library/songs/${songId}`, {
    method: "DELETE",
  });
}