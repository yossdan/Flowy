import { apiFormRequest, apiRequest } from "@/app/services/http.service";
import type { PublishedAlbum } from "@/app/types/dashboard";

export async function becomeArtistRequest() {
  return apiRequest<{ role: "artist" }>("/users/me/become-artist", {
    method: "POST",
  });
}

export async function becomeListenerRequest() {
  return apiRequest<{ role: "listener" }>("/users/me/become-listener", {
    method: "POST",
  });
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