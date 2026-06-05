"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Song } from "@/app/types/dashboard";
import { getApiUrl } from "@/app/services/http.service";
import {
  addSongToPlaylistRequest,
  createPlaylistRequest,
  deletePlaylistRequest,
  getPlaylistsRequest,
  likeSongRequest,
  removeSongFromLibraryRequest as removeSongFromLibraryApiRequest,
  unlikeSongRequest,
  updatePlaylistRequest,
} from "@/app/services/playlist.service";

export type PlayerPlaylist = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  coverImage?: string | null;
  songs: Song[];
};

type CreatePlaylistValues = {
  title: string;
  subtitle?: string;
  icon?: string;
  coverImage?: string | null;
};

type TopArtist = {
  name: string;
  plays: number;
};

type TopAlbum = {
  name: string;
  artist: string;
  plays: number;
};

type UpdatePlaylistValues = {
  title?: string;
  coverImage?: string | null;
};

type PlayerContextValue = {
  songs: Song[];
  queue: Song[];

  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  bufferedTime: number;
  isBuffering: boolean;
  playbackError: string | null;
  volume: number;

  shuffle: boolean;
  repeat: boolean;

  likedIds: string[];
  savedIds: string[];
  likedSongs: Song[];
  savedSongs: Song[];
  playlists: PlayerPlaylist[];

  recentlyPlayed: Song[];
  mostPlayedSongs: Song[];
  recommendedSongs: Song[];
  topArtists: TopArtist[];
  topAlbums: TopAlbum[];

  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;

  playSong: (song: Song, queue?: Song[]) => void;
  togglePlayer: () => void;
  playNextSong: () => void;
  playPrevSong: () => void;
  retryCurrentSong: () => void;

  toggleShuffle: () => void;
  toggleRepeat: () => void;

  isSongLiked: (songId: string) => boolean;
  isSongSaved: (songId: string) => boolean;

  toggleLikeSong: (songId: string) => void;
  toggleSaveSong: (songId: string) => void;

  createPlaylist: (values: CreatePlaylistValues) => PlayerPlaylist;
  updatePlaylistCover: (playlistId: string, coverImage: string | null) => void;
  updatePlaylistInfo: (
    playlistId: string,
    values: UpdatePlaylistValues,
  ) => void;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (song: Song, playlistId: string) => void;
  createPlaylistAndAddSong: (song: Song, title: string) => void;
  removeSongFromLibrary: (songId: string) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

function hasBackend() {
  return Boolean(getApiUrl());
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function normalizePlaylists(playlists: unknown): PlayerPlaylist[] {
  if (!Array.isArray(playlists)) return [];

  return playlists.map((playlist: any) => ({
    id: String(playlist.id ?? `playlist-${Date.now()}`),
    title: String(playlist.title ?? "Playlist"),
    subtitle: String(playlist.subtitle ?? "Playlist creada por ti"),
    icon: String(playlist.icon ?? "fa-music"),
    coverImage: playlist.coverImage ?? null,
    songs: Array.isArray(playlist.songs) ? playlist.songs : [],
  }));
}

function mergeSongs(baseSongs: Song[], playlists: PlayerPlaylist[]) {
  const map = new Map<string, Song>();

  baseSongs.forEach((song) => {
    map.set(song.id, song);
  });

  playlists.forEach((playlist) => {
    playlist.songs.forEach((song) => {
      map.set(song.id, song);
    });
  });

  return Array.from(map.values());
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const initialSongs = useMemo<Song[]>(() => [], []);
  const initialPlaylists = useMemo<PlayerPlaylist[]>(() => [], []);

  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [queue, setQueue] = useState<Song[]>(initialSongs);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTimeState] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.72);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const [likedIds, setLikedIds] = useState<string[]>([]);

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [playlists, setPlaylists] =
    useState<PlayerPlaylist[]>(initialPlaylists);

  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
  const [artistCounts, setArtistCounts] = useState<Record<string, number>>({});
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>({});
  const duration =
    audioDuration && audioDuration > 0
      ? audioDuration
      : currentSong?.duration && currentSong.duration > 0
        ? currentSong.duration
        : 0;

  const likedSongs = useMemo(() => {
    return songs.filter((song) => likedIds.includes(song.id));
  }, [songs, likedIds]);

  const savedSongs = useMemo(() => {
    return songs.filter((song) => savedIds.includes(song.id));
  }, [songs, savedIds]);

  const mostPlayedSongs = useMemo(() => {
    return [...songs]
      .filter((song) => (playCounts[song.id] ?? 0) > 0)
      .sort((a, b) => (playCounts[b.id] ?? 0) - (playCounts[a.id] ?? 0))
      .slice(0, 8);
  }, [songs, playCounts]);

  const topArtists = useMemo<TopArtist[]>(() => {
    return Object.entries(artistCounts)
      .map(([name, plays]) => ({
        name,
        plays,
      }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 6);
  }, [artistCounts]);

  const topAlbums = useMemo<TopAlbum[]>(() => {
    return Object.entries(albumCounts)
      .map(([key, plays]) => {
        const [artist, name] = key.split("|||");

        return {
          name: name || "Álbum",
          artist: artist || "Artista",
          plays,
        };
      })
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 6);
  }, [albumCounts]);

  const recommendedSongs = useMemo(() => {
    const favoriteArtists = new Set(
      topArtists.slice(0, 3).map((artist) => artist.name),
    );
    const favoriteAlbums = new Set(
      topAlbums.slice(0, 3).map((album) => album.name),
    );
    const recentIds = new Set(recentlyPlayed.map((song) => song.id));

    const basedOnTaste = songs.filter((song) => {
      if (recentIds.has(song.id)) return false;

      return favoriteArtists.has(song.artist) || favoriteAlbums.has(song.album);
    });

    const likedBased = likedSongs.filter((song) => !recentIds.has(song.id));

    const mixed = [...basedOnTaste, ...likedBased, ...songs];

    return mixed
      .filter(
        (song, index, array) =>
          array.findIndex((item) => item.id === song.id) === index,
      )
      .slice(0, 8);
  }, [songs, likedSongs, topArtists, topAlbums, recentlyPlayed]);

  useEffect(() => {
    async function loadPlayerData() {
      if (hasBackend()) {
        try {
          const backendPlaylists = await getPlaylistsRequest();
          const normalized = normalizePlaylists(backendPlaylists);

          setPlaylists(normalized);

          const merged = mergeSongs(initialSongs, normalized);

          setSongs(merged);
          setQueue(merged);

          setSavedIds(
            normalized.flatMap((playlist) =>
              playlist.songs.map((song) => song.id),
            ),
          );

          return;
        } catch (error) {
          console.warn("No se pudieron cargar playlists del backend:", error);
        }
      }

      const storedLiked = safeParse<string[]>(
        localStorage.getItem("flowy_liked_ids"),
        likedIds,
      );

      const storedSaved = safeParse<string[]>(
        localStorage.getItem("flowy_saved_ids"),
        savedIds,
      );

      const storedPlaylistsRaw = safeParse<unknown>(
        localStorage.getItem("flowy_playlists"),
        playlists,
      );

      const storedPlaylists = normalizePlaylists(storedPlaylistsRaw);

      const storedShuffle = localStorage.getItem("flowy_shuffle");
      const storedRepeat = localStorage.getItem("flowy_repeat");
      const storedVolume = localStorage.getItem("flowy_volume");

      setLikedIds(storedLiked);
      setSavedIds(storedSaved);
      setPlaylists(storedPlaylists);

      if (storedShuffle) setShuffle(storedShuffle === "true");
      if (storedRepeat) setRepeat(storedRepeat === "true");

      if (storedVolume) {
        const parsedVolume = Number(storedVolume);

        if (!Number.isNaN(parsedVolume)) {
          setVolume(parsedVolume);
        }
      }

      const merged = mergeSongs(initialSongs, storedPlaylists);

      setSongs(merged);
      setQueue(merged);
    }

    loadPlayerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasBackend()) return;
    localStorage.setItem("flowy_liked_ids", JSON.stringify(likedIds));
  }, [likedIds]);

  useEffect(() => {
    if (hasBackend()) return;
    localStorage.setItem("flowy_saved_ids", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    if (hasBackend()) return;

    const lightweightPlaylists = playlists.map((playlist) => ({
      ...playlist,
      coverImage: playlist.coverImage?.startsWith("data:image/")
        ? null
        : playlist.coverImage,
    }));

    localStorage.setItem(
      "flowy_playlists",
      JSON.stringify(lightweightPlaylists),
    );
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("flowy_shuffle", String(shuffle));
  }, [shuffle]);

  useEffect(() => {
    localStorage.setItem("flowy_repeat", String(repeat));
  }, [repeat]);

  useEffect(() => {
    localStorage.setItem("flowy_volume", String(volume));
  }, [volume]);

  function ensureSongExists(song: Song) {
    setSongs((prev) => {
      if (prev.some((item) => item.id === song.id)) return prev;
      return [song, ...prev];
    });
  }

  const playSong = (song: Song, queueToUse?: Song[]) => {
    ensureSongExists(song);

    if (queueToUse && queueToUse.length > 0) {
      setQueue(queueToUse);
    }

    setRecentlyPlayed((prev) => {
      const withoutCurrent = prev.filter((item) => item.id !== song.id);
      return [song, ...withoutCurrent].slice(0, 12);
    });

    setPlayCounts((prev) => ({
      ...prev,
      [song.id]: (prev[song.id] ?? 0) + 1,
    }));

    setArtistCounts((prev) => ({
      ...prev,
      [song.artist]: (prev[song.artist] ?? 0) + 1,
    }));

    setAlbumCounts((prev) => {
      const key = `${song.artist}|||${song.album}`;

      return {
        ...prev,
        [key]: (prev[key] ?? 0) + 1,
      };
    });

    setCurrentSong(song);
    setCurrentTimeState(0);
    setIsPlaying(true);
  };

  const togglePlayer = () => {
    if (!currentSong) {
      const firstSong = queue[0] ?? songs[0];

      if (!firstSong) return;

      playSong(firstSong, queue);
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  const getActiveQueue = () => {
    return queue.length > 0 ? queue : songs;
  };

  const getCurrentIndex = (activeQueue: Song[]) => {
    if (!currentSong) return -1;

    return activeQueue.findIndex((song) => song.id === currentSong.id);
  };

  const getRandomSong = (activeQueue: Song[]) => {
    if (activeQueue.length === 0) return null;
    if (activeQueue.length === 1) return activeQueue[0];

    const availableSongs = currentSong
      ? activeQueue.filter((song) => song.id !== currentSong.id)
      : activeQueue;

    const randomIndex = Math.floor(Math.random() * availableSongs.length);

    return availableSongs[randomIndex] ?? activeQueue[0];
  };

  const playNextSong = () => {
    const activeQueue = getActiveQueue();

    if (activeQueue.length === 0) return;

    if (!currentSong) {
      playSong(activeQueue[0], activeQueue);
      return;
    }

    if (shuffle) {
      const randomSong = getRandomSong(activeQueue);
      if (!randomSong) return;

      playSong(randomSong, activeQueue);
      return;
    }

    const currentIndex = getCurrentIndex(activeQueue);
    const nextSong = activeQueue[currentIndex + 1] ?? activeQueue[0];

    playSong(nextSong, activeQueue);
  };

  const playPrevSong = () => {
    const activeQueue = getActiveQueue();

    if (activeQueue.length === 0) return;

    if (!currentSong) {
      playSong(activeQueue[0], activeQueue);
      return;
    }

    if (currentTime > 3) {
      setCurrentTimeState(0);
      return;
    }

    if (shuffle) {
      const randomSong = getRandomSong(activeQueue);
      if (!randomSong) return;

      playSong(randomSong, activeQueue);
      return;
    }

    const currentIndex = getCurrentIndex(activeQueue);

    const prevSong =
      activeQueue[currentIndex - 1] ?? activeQueue[activeQueue.length - 1];

    playSong(prevSong, activeQueue);
  };

  const toggleShuffle = () => {
    setShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeat((prev) => !prev);
  };

  const isSongLiked = (songId: string) => {
    return likedIds.includes(songId);
  };

  const isSongSaved = (songId: string) => {
    return savedIds.includes(songId);
  };

  const toggleLikeSong = (songId: string) => {
    setLikedIds((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId);
      }

      return [...prev, songId];
    });
  };

  const toggleSaveSong = (songId: string) => {
    setSavedIds((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId);
      }

      return [...prev, songId];
    });
  };

  const createPlaylist = (values: CreatePlaylistValues) => {
    const cleanTitle = values.title.trim();

    const tempPlaylist: PlayerPlaylist = {
      id: `playlist-${Date.now()}`,
      title: cleanTitle || "Nueva playlist",
      subtitle: values.subtitle?.trim() || "Playlist creada por ti",
      icon: values.icon || "fa-music",
      coverImage: values.coverImage ?? null,
      songs: [],
    };

    setPlaylists((prev) => [tempPlaylist, ...prev]);

    if (hasBackend()) {
      createPlaylistRequest({
        title: tempPlaylist.title,
        subtitle: tempPlaylist.subtitle,
        icon: tempPlaylist.icon,
      })
        .then((createdPlaylist) => {
          setPlaylists((prev) =>
            prev.map((playlist) =>
              playlist.id === tempPlaylist.id ? createdPlaylist : playlist,
            ),
          );
        })
        .catch((error) => {
          console.warn("No se pudo crear la playlist en backend:", error);

          setPlaylists((prev) =>
            prev.filter((playlist) => playlist.id !== tempPlaylist.id),
          );
        });
    }

    return tempPlaylist;
  };

  const updatePlaylistCover = (
    playlistId: string,
    coverImage: string | null,
  ) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;

        return {
          ...playlist,
          coverImage,
        };
      }),
    );
  };

  const updatePlaylistInfo = (
    playlistId: string,
    values: UpdatePlaylistValues,
  ) => {
    const previousPlaylist = playlists.find(
      (playlist) => playlist.id === playlistId,
    );

    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;

        return {
          ...playlist,
          title: values.title?.trim() || playlist.title,
          coverImage:
            values.coverImage === undefined
              ? playlist.coverImage
              : values.coverImage,
        };
      }),
    );

    if (hasBackend()) {
      updatePlaylistRequest(playlistId, {
        title: values.title,
      }).catch((error) => {
        console.warn("No se pudo actualizar la playlist en backend:", error);

        if (!previousPlaylist) return;

        setPlaylists((prev) =>
          prev.map((playlist) =>
            playlist.id === playlistId ? previousPlaylist : playlist,
          ),
        );
      });
    }
  };

  const deletePlaylist = (playlistId: string) => {
    const previousPlaylists = playlists;

    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId),
    );

    if (hasBackend()) {
      deletePlaylistRequest(playlistId).catch((error) => {
        console.warn("No se pudo eliminar la playlist en backend:", error);
        setPlaylists(previousPlaylists);
      });
    }
  };

  const addSongToPlaylist = (song: Song, playlistId: string) => {
    ensureSongExists(song);

    const previousPlaylists = playlists;

    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;

        if (playlist.songs.some((item) => item.id === song.id)) {
          return playlist;
        }

        return {
          ...playlist,
          songs: [...playlist.songs, song],
        };
      }),
    );

    setSavedIds((prev) => {
      if (prev.includes(song.id)) return prev;
      return [...prev, song.id];
    });

    if (hasBackend()) {
      addSongToPlaylistRequest(playlistId, song.id).catch((error) => {
        console.warn("No se pudo agregar la canción a la playlist:", error);
        setPlaylists(previousPlaylists);

        setSavedIds((prev) => {
          const stillSaved = previousPlaylists.some((playlist) =>
            playlist.songs.some((item) => item.id === song.id),
          );

          if (stillSaved) return prev;

          return prev.filter((id) => id !== song.id);
        });
      });
    }
  };

  const createPlaylistAndAddSong = (song: Song, title: string) => {
    const cleanTitle = title.trim();

    if (!cleanTitle) return;

    ensureSongExists(song);

    const tempPlaylist: PlayerPlaylist = {
      id: `playlist-${Date.now()}`,
      title: cleanTitle,
      subtitle: "Playlist creada por ti",
      icon: "fa-music",
      coverImage: null,
      songs: [song],
    };

    setPlaylists((prev) => [tempPlaylist, ...prev]);

    setSavedIds((prev) => {
      if (prev.includes(song.id)) return prev;
      return [...prev, song.id];
    });

    if (hasBackend()) {
      createPlaylistRequest({
        title: tempPlaylist.title,
        subtitle: tempPlaylist.subtitle,
        icon: tempPlaylist.icon,
      })
        .then(async (createdPlaylist) => {
          await addSongToPlaylistRequest(createdPlaylist.id, song.id);

          setPlaylists((prev) =>
            prev.map((playlist) =>
              playlist.id === tempPlaylist.id
                ? {
                    ...createdPlaylist,
                    songs: [song],
                  }
                : playlist,
            ),
          );
        })
        .catch((error) => {
          console.warn("No se pudo crear la playlist en backend:", error);

          setPlaylists((prev) =>
            prev.filter((playlist) => playlist.id !== tempPlaylist.id),
          );
        });
    }
  };

  const removeSongFromLibrary = (songId: string) => {
    const previousPlaylists = playlists;
    const previousSavedIds = savedIds;

    setSavedIds((prev) => prev.filter((id) => id !== songId));

    setPlaylists((prev) =>
      prev.map((playlist) => ({
        ...playlist,
        songs: playlist.songs.filter((song) => song.id !== songId),
      })),
    );

    if (hasBackend()) {
      removeSongFromLibraryApiRequest(songId).catch((error) => {
        console.warn("No se pudo quitar la canción de biblioteca:", error);

        setPlaylists(previousPlaylists);
        setSavedIds(previousSavedIds);
      });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    setAudioDuration(0);
    setBufferedTime(0);
    setCurrentTimeState(0);
    setPlaybackError(null);
    setIsBuffering(Boolean(currentSong?.audioUrl));

    if (!currentSong?.audioUrl) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setIsPlaying(false);
      setIsBuffering(false);
      return;
    }

    audio.src = currentSong.audioUrl;
    audio.currentTime = 0;
    audio.load();

    if (isPlaying) {
      audio.play().catch((error) => {
        console.warn("No se pudo reproducir la canción:", error);
        setPlaybackError("No se pudo reproducir esta canción.");
        setIsBuffering(false);
        setIsPlaying(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id, currentSong?.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (!currentSong?.audioUrl) {
      if (isPlaying) {
        setCurrentTimeState((time) => {
          const fallbackDuration = currentSong?.duration ?? 0;

          if (fallbackDuration > 0 && time >= fallbackDuration) {
            return fallbackDuration;
          }

          return time + 1;
        });
      }

      return;
    }

    if (isPlaying) {
      setPlaybackError(null);

      audio.play().catch((error) => {
        console.warn("No se pudo reproducir la canción:", error);
        setPlaybackError("No se pudo reproducir esta canción.");
        setIsBuffering(false);
        setIsPlaying(false);
      });

      return;
    }

    audio.pause();
  }, [isPlaying, currentSong?.audioUrl, currentSong?.duration]);

  useEffect(() => {
    if (!isPlaying) return;
    if (!currentSong) return;
    if (currentSong.audioUrl) return;

    const timer = window.setInterval(() => {
      setCurrentTimeState((time) => {
        const fallbackDuration = currentSong.duration ?? 0;

        if (fallbackDuration > 0 && time >= fallbackDuration) {
          return fallbackDuration;
        }

        return time + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTimeState(audio.currentTime || 0);
    };

    const updateMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };

    const updateBuffered = () => {
      try {
        if (!audio.buffered || audio.buffered.length === 0) {
          setBufferedTime(0);
          return;
        }

        let bufferedEnd = 0;

        for (let index = 0; index < audio.buffered.length; index += 1) {
          const start = audio.buffered.start(index);
          const end = audio.buffered.end(index);

          if (audio.currentTime >= start && audio.currentTime <= end) {
            bufferedEnd = end;
            break;
          }

          bufferedEnd = Math.max(bufferedEnd, end);
        }

        setBufferedTime(Number.isFinite(bufferedEnd) ? bufferedEnd : 0);
      } catch {
        setBufferedTime(0);
      }
    };

    const handleLoadStart = () => {
      if (currentSong?.audioUrl) {
        setIsBuffering(true);
      }
    };

    const handleWaiting = () => {
      if (currentSong?.audioUrl) {
        setIsBuffering(true);
      }
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
      setPlaybackError(null);
      updateMetadata();
      updateBuffered();
    };

    const handlePlaying = () => {
      setIsBuffering(false);
      setPlaybackError(null);
      updateMetadata();
      updateBuffered();
    };

    const handleError = () => {
      setIsBuffering(false);
      setPlaybackError("No se pudo cargar o reproducir esta canción.");
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsBuffering(false);
      setCurrentTimeState(0);

      if (repeat) {
        audio.currentTime = 0;

        audio.play().catch((error) => {
          console.warn("No se pudo repetir la canción:", error);
          setPlaybackError("No se pudo repetir esta canción.");
          setIsPlaying(false);
        });

        return;
      }

      playNextSong();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateMetadata);
    audio.addEventListener("durationchange", updateMetadata);
    audio.addEventListener("progress", updateBuffered);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("stalled", handleWaiting);
    audio.addEventListener("seeking", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("seeked", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateMetadata);
      audio.removeEventListener("durationchange", updateMetadata);
      audio.removeEventListener("progress", updateBuffered);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("stalled", handleWaiting);
      audio.removeEventListener("seeking", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("seeked", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeat, currentSong, queue, songs, shuffle]);

  useEffect(() => {
    if (!currentSong) return;
    if (!isPlaying) return;
    if (currentSong.audioUrl) return;
    if (duration <= 0) return;
    if (currentTime < duration) return;

    if (repeat) {
      setCurrentTimeState(0);
      return;
    }

    playNextSong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, duration, currentSong, isPlaying, repeat]);

  const seekTo: React.Dispatch<React.SetStateAction<number>> = (value) => {
    const nextValue =
      typeof value === "function"
        ? value(audioRef.current?.currentTime ?? currentTime)
        : value;

    if (audioRef.current && currentSong?.audioUrl) {
      audioRef.current.currentTime = nextValue;
    }

    setCurrentTimeState(nextValue);
  };

  const retryCurrentSong = () => {
    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) return;

    setPlaybackError(null);
    setIsBuffering(true);
    setCurrentTimeState(0);
    setBufferedTime(0);

    audio.pause();
    audio.currentTime = 0;
    audio.load();

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsBuffering(false);
      })
      .catch((error) => {
        console.warn("No se pudo reintentar la canción:", error);
        setPlaybackError("No se pudo reproducir esta canción.");
        setIsBuffering(false);
        setIsPlaying(false);
      });
  };

  const value = useMemo<PlayerContextValue>(
    () => ({
      songs,
      queue,

      currentSong,
      isPlaying,
      currentTime,
      duration,
      bufferedTime,
      isBuffering,
      playbackError,
      volume,

      shuffle,
      repeat,

      likedIds,
      savedIds,
      likedSongs,
      savedSongs,
      playlists,

      setCurrentTime: seekTo,
      setVolume,

      playSong,
      togglePlayer,
      playNextSong,
      playPrevSong,
      retryCurrentSong,

      toggleShuffle,
      toggleRepeat,

      isSongLiked,
      isSongSaved,

      toggleLikeSong,
      toggleSaveSong,

      createPlaylist,
      updatePlaylistCover,
      addSongToPlaylist,
      createPlaylistAndAddSong,
      removeSongFromLibrary,
      deletePlaylist,
      updatePlaylistInfo,
      recentlyPlayed,
      mostPlayedSongs,
      recommendedSongs,
      topArtists,
      topAlbums,
    }),
    [
      songs,
      queue,
      currentSong,
      isPlaying,
      currentTime,
      duration,
      bufferedTime,
      isBuffering,
      playbackError,
      volume,
      shuffle,
      repeat,
      likedIds,
      savedIds,
      likedSongs,
      savedSongs,
      playlists,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="auto" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer debe usarse dentro de PlayerProvider");
  }

  return context;
}
