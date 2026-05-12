import type { DashboardData, MixItem, Song } from "@/app/types/dashboard";
import type {
  ApiDashboardResponse,
  ApiMixItem,
  ApiPlaylist,
  ApiSong,
} from "@/app/types/api";

function toStringValue(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function toNumberValue(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isNaN(number) ? fallback : number;
}

export function mapSongResponse(song: ApiSong): Song {
  return {
    id: toStringValue(song.id, `song-${Date.now()}`),
    title: toStringValue(song.title ?? song.titulo ?? song.name ?? song.nombre, "Canción"),
    artist: toStringValue(
      song.artist ?? song.artista ?? song.artistName ?? song.nombreArtista,
      "Artista",
    ),
    album: toStringValue(
      song.album ?? song.albumName ?? song.nombreAlbum,
      "Álbum",
    ),
    duration: toNumberValue(
      song.duration ?? song.duracion ?? song.durationSeconds,
      0,
    ),
    cover:
      song.cover ??
      song.image ??
      song.imagen ??
      song.imageUrl ??
      song.imagenUrl ??
      song.coverUrl ??
      song.portadaUrl ??
      null,
    added: toStringValue(
      song.added ?? song.fechaAgregado ?? song.createdAt,
      "Reciente",
    ),
  };
}

export function mapMixItemResponse(item: ApiMixItem): MixItem {
  return {
    id: toStringValue(item.id, `mix-${Date.now()}`),
    title: toStringValue(item.title ?? item.titulo, "Mix"),
    subtitle: toStringValue(
      item.subtitle ?? item.subtitulo ?? item.descripcion,
      "Recomendado para ti",
    ),
    strip: toStringValue(item.strip ?? item.color, "wine"),
  };
}

export function mapPlaylistResponse(playlist: ApiPlaylist) {
  const songs = playlist.songs ?? playlist.canciones ?? [];

  return {
    id: toStringValue(playlist.id, `playlist-${Date.now()}`),
    title: toStringValue(
      playlist.title ?? playlist.titulo ?? playlist.name ?? playlist.nombre,
      "Playlist",
    ),
    subtitle: toStringValue(
      playlist.subtitle ?? playlist.subtitulo ?? playlist.descripcion,
      "Playlist creada por ti",
    ),
    icon: toStringValue(playlist.icon ?? playlist.icono, "fa-music"),
    coverImage:
      playlist.coverImage ??
      playlist.cover ??
      playlist.imageUrl ??
      playlist.imagenUrl ??
      playlist.portadaUrl ??
      null,
    songs: songs.map(mapSongResponse),
  };
}

export function mapDashboardResponse(response: unknown): DashboardData {
  const data = response as ApiDashboardResponse;

  const createdFor = data.createdFor ?? data.creadoPara ?? [];
  const mostPlayed = data.mostPlayed ?? data.masEscuchados ?? [];
  const likedSongs = data.likedSongs ?? data.cancionesFavoritas ?? [];
  const playlists = data.playlists ?? [];

  return {
    userName: toStringValue(
      data.userName ?? data.username ?? data.nombreUsuario ?? data.name ?? data.nombre,
      "Usuario",
    ),
    createdFor: createdFor.map(mapMixItemResponse),
    mostPlayed: mostPlayed.map(mapMixItemResponse),
    likedSongs: likedSongs.map(mapSongResponse),
    playlists: playlists.map(mapPlaylistResponse),
  };
}