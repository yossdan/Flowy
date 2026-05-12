import type { ProfileData } from "@/app/types/profile";
import type { ApiProfileResponse } from "@/app/types/api";

function toStringValue(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function toNumberString(value: unknown, fallback = "0") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

export function mapProfileResponse(response: unknown): ProfileData {
  const data = response as ApiProfileResponse;

  const name = toStringValue(
    data.name ?? data.nombre ?? data.username,
    "Usuario",
  );

  const stats = data.stats ?? {};

  const publicPlaylists = data.publicPlaylists ?? data.playlistsPublicas ?? [];
  const favoriteArtists = data.favoriteArtists ?? data.artistasFavoritos ?? [];
  const recentActivity = data.recentActivity ?? data.actividadReciente ?? [];

  return {
    name,
    initial: toStringValue(
      data.initial ?? data.inicial ?? name.slice(0, 1).toUpperCase(),
      "U",
    ),
    playlistsCount: toNumberString(
      data.playlistsCount ?? data.totalPlaylists ?? publicPlaylists.length,
    ),
    stats: {
      favoriteSongs: toNumberString(
        stats.favoriteSongs ?? stats.cancionesFavoritas,
      ),
      publicPlaylists: toNumberString(
        stats.publicPlaylists ?? stats.playlistsPublicas ?? publicPlaylists.length,
      ),
      listenedMinutes: toNumberString(
        stats.listenedMinutes ?? stats.minutosEscuchados,
      ),
      followers: toNumberString(stats.followers ?? stats.seguidores),
    },
    publicPlaylists: publicPlaylists.map((playlist, index) => ({
      id: toStringValue(playlist.id, `playlist-${index}`),
      title: toStringValue(playlist.title ?? playlist.titulo, "Playlist"),
      subtitle: toStringValue(
        playlist.subtitle ?? playlist.subtitulo,
        "Playlist pública",
      ),
      songs: Number(playlist.songs ?? playlist.canciones ?? 0),
    })),
    favoriteArtists: favoriteArtists.map((artist, index) => ({
      id: toStringValue(artist.id, `artist-${index}`),
      name: toStringValue(artist.name ?? artist.nombre, "Artista"),
    })),
    recentActivity: recentActivity.map((activity, index) => ({
      id: toStringValue(activity.id, `activity-${index}`),
      title: toStringValue(activity.title ?? activity.titulo, "Actividad"),
      desc: toStringValue(
        activity.desc ?? activity.descripcion,
        "Actividad reciente",
      ),
      time: toStringValue(activity.time ?? activity.tiempo, "Reciente"),
      icon: toStringValue(activity.icon ?? activity.icono, "fa-music"),
    })),
  };
}