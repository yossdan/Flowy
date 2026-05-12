export type PerfilTab = "playlists" | "favoritos" | "actividad";

export type ProfilePlaylist = {
  id: string;
  title: string;
  subtitle: string;
  songs: number;
};

export type FavoriteArtist = {
  id: string;
  name: string;
};

export type RecentActivity = {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
};

export type ProfileStats = {
  favoriteSongs: string;
  publicPlaylists: string;
  listenedMinutes: string;
  followers: string;
};

export type ProfileData = {
  name: string;
  initial: string;
  playlistsCount: string;
  stats: ProfileStats;
  publicPlaylists: ProfilePlaylist[];
  favoriteArtists: FavoriteArtist[];
  recentActivity: RecentActivity[];
};