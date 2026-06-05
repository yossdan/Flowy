export type View = "home" | "liked" | "library" | "playlist" | "album" | "artist" | "artistProfile";
export type Tab = "todo" | "musica";
export type UserRole = "listener" | "artist";

export type ArtistCollaborator = {
  id: string;
  name: string;
  avatar?: string | null;
};

export type ArtistUploadTrack = {
  id: string;
  title: string;
  audioFile: File | null;
  collaborators: ArtistCollaborator[];
};

export type PublishedTrack = {
  id: string;
  title: string;
  audioFileName: string;
  collaborators: ArtistCollaborator[];
};

export type PublishedAlbum = {
  id: string;
  title: string;
  cover: string;
  createdAt: string;
  tracks: PublishedTrack[];
};

export type ArtistAlbumDraft = {
  albumName: string;
  coverFile: File | null;
  coverPreview: string | null;
  tracks: ArtistUploadTrack[];
};
export type MixItem = {
  id: string;
  title: string;
  subtitle: string;
  strip: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover?: string | null;
  added: string;
  audioUrl?: string | null;
};

export type Playlist = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  songs: Song[];
  coverImage?: string | null;
};

export type DashboardData = {
  userName: string;
  createdFor: MixItem[];
  mostPlayed: MixItem[];
  likedSongs: Song[];
  playlists: Playlist[];
};