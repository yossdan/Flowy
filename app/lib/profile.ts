import type { ProfileData } from "@/app/types/profile";

export const profileMock: ProfileData = {
  name: "Daniel Iuit",
  initial: "D",
  playlistsCount: "12 playlists",

  stats: {
    favoriteSongs: "148",
    publicPlaylists: "12",
    listenedMinutes: "18.2k",
    followers: "248",
  },

  publicPlaylists: [
    {
      id: "p1",
      title: "Noches oscuras",
      subtitle: "Rock industrial, metal y energía pesada",
      songs: 32,
    },
    {
      id: "p2",
      title: "Gym mode",
      subtitle: "Para entrenar fuerte y mantener el ritmo",
      songs: 24,
    },
    {
      id: "p3",
      title: "Coding late",
      subtitle: "Vibes para programar de noche",
      songs: 18,
    },
    {
      id: "p4",
      title: "Flowy mix",
      subtitle: "Selección personalizada de tu perfil",
      songs: 27,
    },
  ],

  favoriteArtists: [
    { id: "a1", name: "Rammstein" },
    { id: "a2", name: "The Weeknd" },
    { id: "a3", name: "Feid" },
    { id: "a4", name: "Kanye West" },
    { id: "a5", name: "Drake" },
    { id: "a6", name: "Metro Boomin" },
  ],

  recentActivity: [
    {
      id: "act1",
      title: "Te gustó una canción",
      desc: "Agregaste “Starboy” a tus favoritos",
      time: "Hace 2 horas",
      icon: "fa-heart",
    },
    {
      id: "act2",
      title: "Nueva playlist",
      desc: "Creaste la playlist “Gym mode”",
      time: "Hace 1 día",
      icon: "fa-plus",
    },
    {
      id: "act3",
      title: "Escuchaste un álbum",
      desc: "Reproduciste “After Hours” completo",
      time: "Hace 2 días",
      icon: "fa-compact-disc",
    },
  ],
};