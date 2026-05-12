export type ApiSong = {
  id?: string | number;
  title?: string;
  titulo?: string;
  name?: string;
  nombre?: string;

  artist?: string;
  artista?: string;
  artistName?: string;
  nombreArtista?: string;

  album?: string;
  albumName?: string;
  nombreAlbum?: string;

  duration?: number;
  duracion?: number;
  durationSeconds?: number;

  cover?: string | null;
  image?: string | null;
  imagen?: string | null;
  imageUrl?: string | null;
  imagenUrl?: string | null;
  coverUrl?: string | null;
  portadaUrl?: string | null;

  added?: string;
  fechaAgregado?: string;
  createdAt?: string;
};

export type ApiMixItem = {
  id?: string | number;
  title?: string;
  titulo?: string;
  subtitle?: string;
  subtitulo?: string;
  descripcion?: string;
  strip?: string;
  color?: string;
};

export type ApiPlaylist = {
  id?: string | number;
  title?: string;
  titulo?: string;
  name?: string;
  nombre?: string;
  subtitle?: string;
  subtitulo?: string;
  descripcion?: string;
  icon?: string;
  icono?: string;
  coverImage?: string | null;
  cover?: string | null;
  imageUrl?: string | null;
  imagenUrl?: string | null;
  portadaUrl?: string | null;
  songs?: ApiSong[];
  canciones?: ApiSong[];
};

export type ApiDashboardResponse = {
  userName?: string;
  username?: string;
  nombreUsuario?: string;
  name?: string;
  nombre?: string;

  createdFor?: ApiMixItem[];
  creadoPara?: ApiMixItem[];
  mostPlayed?: ApiMixItem[];
  masEscuchados?: ApiMixItem[];
  likedSongs?: ApiSong[];
  cancionesFavoritas?: ApiSong[];
  playlists?: ApiPlaylist[];
};

export type ApiProfileResponse = {
  id?: string | number;
  name?: string;
  nombre?: string;
  username?: string;
  email?: string;
  initial?: string;
  inicial?: string;
  avatarUrl?: string | null;
  fotoPerfil?: string | null;

  playlistsCount?: number;
  totalPlaylists?: number;

  stats?: {
    favoriteSongs?: string | number;
    cancionesFavoritas?: string | number;
    publicPlaylists?: string | number;
    playlistsPublicas?: string | number;
    listenedMinutes?: string | number;
    minutosEscuchados?: string | number;
    followers?: string | number;
    seguidores?: string | number;
  };

  publicPlaylists?: {
    id?: string | number;
    title?: string;
    titulo?: string;
    subtitle?: string;
    subtitulo?: string;
    songs?: number;
    canciones?: number;
  }[];

  playlistsPublicas?: {
    id?: string | number;
    title?: string;
    titulo?: string;
    subtitle?: string;
    subtitulo?: string;
    songs?: number;
    canciones?: number;
  }[];

  favoriteArtists?: {
    id?: string | number;
    name?: string;
    nombre?: string;
  }[];

  artistasFavoritos?: {
    id?: string | number;
    name?: string;
    nombre?: string;
  }[];

  recentActivity?: {
    id?: string | number;
    title?: string;
    titulo?: string;
    desc?: string;
    descripcion?: string;
    time?: string;
    tiempo?: string;
    icon?: string;
    icono?: string;
  }[];

  actividadReciente?: {
    id?: string | number;
    title?: string;
    titulo?: string;
    desc?: string;
    descripcion?: string;
    time?: string;
    tiempo?: string;
    icon?: string;
    icono?: string;
  }[];
};