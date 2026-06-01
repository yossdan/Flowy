"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { PlayerPlaylist } from "@/app/context/PlayerContext";
import { stripColor } from "@/app/lib/helpers";
import Sidebar from "@/app/components/dashboard/Sidebar";
import RightPanel from "@/app/components/dashboard/RightPanel";
import LikedHeader from "@/app/components/dashboard/LikedHeader";
import LikedTable from "@/app/components/dashboard/LikedTable";
import PlayerBar from "@/app/components/dashboard/PlayerBar";
import MobileNav from "@/app/components/dashboard/MobileNav";
import { usePlayer } from "@/app/context/PlayerContext";
import ArtistStudio from "@/app/components/artist/ArtistStudio";
import AuthGuard from "@/app/components/auth/AuthGuard";
import { useAuth } from "@/app/context/AuthContext";
import WelcomeIntro from "@/app/components/dashboard/WelcomeIntro";
import { getStoredAuthUser } from "@/app/services/auth.service";
import {
  searchRequest,
  type FrontSearchResponse,
} from "@/app/services/search.service";

import type {
  MixItem,
  Song,
  Tab,
  View,
  UserRole,
  PublishedAlbum,
} from "@/app/types/dashboard";

import {
  becomeArtistRequest,
  becomeListenerRequest,
  checkArtistStatusRequest,
} from "@/app/services/artist.service";

import { saveAuthUser } from "@/app/services/auth.service";

type LibraryFilter = "todo" | "playlists" | "artistas" | "albumes";

type DashboardScreenProps = {
  userName: string;
  createdFor: MixItem[];
  mostPlayed: MixItem[];
  tab: Tab;
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
};

export default function DashboardScreen({
  userName,
  createdFor,
  mostPlayed,
  tab,
  setTab,
  view,
  setView,
}: DashboardScreenProps) {
  const router = useRouter();
  const contentKey = `${view}-${tab}`;
  const { user, logoutUser, setUser } = useAuth();
  const storedUser = getStoredAuthUser();
  const authUser = user ?? storedUser;

  const displayUserName = authUser?.name || userName;
  const displayUserRole = authUser?.role ?? "listener";

  const [selectedPlaylist, setSelectedPlaylist] =
    useState<PlayerPlaylist | null>(null);
  const [search, setSearch] = useState("");
  const [backendSearch, setBackendSearch] = useState<FrontSearchResponse>({
    artists: [],
    albums: [],
    songs: [],
  });

  const [searching, setSearching] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("todo");
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    setCurrentTime,
    setVolume,
    playSong,
    togglePlayer,
    playNextSong,
    playPrevSong,
    likedSongs,
    playlists,
    recentlyPlayed,
    mostPlayedSongs,
    recommendedSongs,
    topArtists,
    topAlbums,
    createPlaylist,
    updatePlaylistInfo,
    deletePlaylist,
  } = usePlayer();

  const [userRole, setUserRole] = useState<UserRole>(displayUserRole);
  useEffect(() => {
    setUserRole(displayUserRole);
  }, [displayUserRole]);
  useEffect(() => {
    if (!authUser?.id) return;

    const safeUser = {
      ...authUser,
      id: authUser.id,
      role: authUser.role ?? "listener",
    };

    const userId = safeUser.id;

    let cancelled = false;

    async function validateArtistStatus() {
      try {
        const response = await checkArtistStatusRequest(userId);

        if (cancelled) return;

        const nextRole: UserRole = response.isArtist ? "artist" : "listener";

        setUserRole(nextRole);

        if (safeUser.role !== nextRole) {
          const updatedUser = {
            ...safeUser,
            role: nextRole,
          };

          setUser(updatedUser);
          saveAuthUser(updatedUser);
        }
      } catch (error) {
        console.warn("No se pudo validar el estado de artista:", error);
      }
    }

    validateArtistStatus();

    return () => {
      cancelled = true;
    };
  }, [authUser?.id, authUser?.role, setUser]);
  const [publishedAlbums, setPublishedAlbums] = useState<PublishedAlbum[]>([]);

  const [showWelcomeIntro, setShowWelcomeIntro] = useState(() => {
    if (typeof window === "undefined") return false;

    return sessionStorage.getItem("flowy_welcome_seen") !== "true";
  });

  const isArtist = userRole === "artist";

  useEffect(() => {
    if (!selectedPlaylist) return;

    const updatedPlaylist = playlists.find(
      (playlist) => playlist.id === selectedPlaylist.id,
    );

    if (!updatedPlaylist) {
      setSelectedPlaylist(null);
      setView("library");
      return;
    }

    setSelectedPlaylist(updatedPlaylist);
  }, [playlists, selectedPlaylist?.id, setView]);

  const searchValue = search.trim().toLowerCase();
  useEffect(() => {
    const cleanSearch = search.trim();

    if (cleanSearch.length < 2) {
      setBackendSearch({
        artists: [],
        albums: [],
        songs: [],
      });
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        setSearching(true);

        const response = await searchRequest(cleanSearch);

        setBackendSearch(response);
      } catch (error) {
        console.warn("No se pudo buscar en backend:", error);

        setBackendSearch({
          artists: [],
          albums: [],
          songs: [],
        });
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const filteredLikedSongs = likedSongs.filter((song) => {
    if (!searchValue) return true;

    return (
      song.title.toLowerCase().includes(searchValue) ||
      song.artist.toLowerCase().includes(searchValue) ||
      song.album.toLowerCase().includes(searchValue)
    );
  });

  const filteredPlaylistSongs =
    selectedPlaylist?.songs.filter((song) => {
      if (!searchValue) return true;

      return (
        song.title.toLowerCase().includes(searchValue) ||
        song.artist.toLowerCase().includes(searchValue) ||
        song.album.toLowerCase().includes(searchValue)
      );
    }) ?? [];

  const filteredCreatedFor = createdFor.filter((mix) => {
    if (!searchValue) return true;

    return (
      mix.title.toLowerCase().includes(searchValue) ||
      mix.subtitle.toLowerCase().includes(searchValue)
    );
  });

  const filteredMostPlayed = mostPlayed.filter((mix) => {
    if (!searchValue) return true;

    return (
      mix.title.toLowerCase().includes(searchValue) ||
      mix.subtitle.toLowerCase().includes(searchValue)
    );
  });

  const filteredLibraryPlaylists = playlists.filter((playlist) => {
    if (!searchValue) return true;

    return (
      playlist.title.toLowerCase().includes(searchValue) ||
      playlist.subtitle.toLowerCase().includes(searchValue)
    );
  });

  const allPlaylistSongs = playlists.flatMap((playlist) =>
    playlist.songs.map((song) => ({
      ...song,
      playlistTitle: playlist.title,
    })),
  );

  const localSearchSongs = [...likedSongs, ...allPlaylistSongs].filter(
    (song) => {
      if (!searchValue) return false;

      return (
        song.title.toLowerCase().includes(searchValue) ||
        song.artist.toLowerCase().includes(searchValue) ||
        song.album.toLowerCase().includes(searchValue)
      );
    },
  );

  const searchPlaylists = playlists.filter((playlist) => {
    if (!searchValue) return false;

    return (
      playlist.title.toLowerCase().includes(searchValue) ||
      playlist.subtitle.toLowerCase().includes(searchValue)
    );
  });

  const searchSongs = [...backendSearch.songs, ...localSearchSongs].filter(
    (song, index, array) =>
      array.findIndex((item) => item.id === song.id) === index,
  );

  const searchArtists = backendSearch.artists.filter(
    (artist, index, array) => array.indexOf(artist) === index,
  );

  const searchAlbums = backendSearch.albums.filter(
    (album, index, array) => array.indexOf(album) === index,
  );

  const hasSearchResults =
    searchSongs.length > 0 ||
    searchPlaylists.length > 0 ||
    searchArtists.length > 0 ||
    searchAlbums.length > 0;

  const showSearchResults = searchValue.length > 0 && view === "home";

  const goHome = () => setView("home");
  const openLiked = () => setView("liked");
  const openLibrary = () => setView("library");

  const openArtistStudio = () => setView("artist");

  const becomeArtist = async () => {
    const currentUser = user ?? getStoredAuthUser();

    if (!currentUser?.id) {
      alert("Error: No se encontró una sesión de usuario activa.");
      return;
    }

    try {
      await becomeArtistRequest(currentUser.id, currentUser.name);

      const updatedUser = {
        ...currentUser,
        role: "artist" as const,
      };

      setUser(updatedUser);
      saveAuthUser(updatedUser);
      setUserRole("artist");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo convertir la cuenta en artista.",
      );
    }
  };

  const becomeListener = async () => {
    const confirmed = window.confirm(
      "¿Seguro que quieres volver a una cuenta normal?",
    );

    if (!confirmed) return;

    const currentUser = user ?? getStoredAuthUser();

    if (!currentUser?.id) {
      alert("Error: No se encontró una sesión de usuario activa.");
      return;
    }

    try {
      await becomeListenerRequest(currentUser.id);

      const updatedUser = {
        ...currentUser,
        role: "listener" as const,
      };

      setUser(updatedUser);
      saveAuthUser(updatedUser);
      setUserRole("listener");
      setView("home");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar a cuenta normal.",
      );
    }
  };

  function handleAlbumPublished(album: PublishedAlbum) {
    setPublishedAlbums((prev) => [album, ...prev]);
  }

  const openPlaylist = (playlist: PlayerPlaylist) => {
    setSelectedPlaylist(playlist);
    setView("playlist");
    setSearch("");
  };

  return (
    <>
      {showWelcomeIntro && (
        <WelcomeIntro
          userName={displayUserName}
          onFinish={() => {
            sessionStorage.setItem("flowy_welcome_seen", "true");
            setShowWelcomeIntro(false);
          }}
        />
      )}

      <div className="min-h-screen bg-black text-white">
        <div className="min-h-screen pb-44 md:pb-24">
          <div className="flex min-h-screen">
            <div className="hidden md:block">
              <Sidebar
                view={view}
                userInitial={displayUserName.slice(0, 1).toUpperCase()}
                goHome={goHome}
                openLiked={openLiked}
                openLibrary={openLibrary}
                goBack={() => {
                  if (view === "playlist") {
                    openLibrary();
                    return;
                  }

                  if (view !== "home") {
                    goHome();
                    return;
                  }

                  window.history.back();
                }}
                goForward={() => window.history.forward()}
                openCreatePlaylist={() => {
                  setView("library");
                  setShowCreatePlaylistModal(true);
                }}
                togglePlayer={togglePlayer}
                openProfile={() => router.push("/perfil")}
                openArtistStudio={openArtistStudio}
                isArtist={userRole === "artist"}
              />
            </div>

            <div className="flex min-w-0 flex-1 gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4">
              <main className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={goHome}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer"
                    aria-label="Inicio"
                  >
                    <i className="fa-solid fa-house text-white/85" />
                  </button>

                  <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full bg-white/10 px-4 ring-1 ring-white/10 focus-within:ring-white/25">
                    <i className="fa-solid fa-magnifying-glass text-white/60" />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="¿Qué quieres reproducir?"
                      className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-white/50"
                    />

                    {searchValue && (
                      <button
                        onClick={() => setSearch("")}
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10 cursor-pointer"
                        aria-label="Limpiar búsqueda"
                      >
                        <i className="fa-solid fa-xmark text-white/60" />
                      </button>
                    )}

                    <div className="h-5 w-px bg-white/15" />

                    <button
                      onClick={openLibrary}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 cursor-pointer"
                      aria-label="Abrir biblioteca"
                    >
                      <i className="fa-regular fa-folder-open text-white/60" />
                    </button>
                  </div>

                  <div className="hidden items-center gap-3 md:flex">
                    <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer">
                      <i className="fa-regular fa-bell text-white/80" />
                    </button>

                    <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer">
                      <i className="fa-solid fa-user-group text-white/80" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={logoutUser}
                        className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-white/15 cursor-pointer"
                        aria-label="Cerrar sesión"
                        title="Cerrar sesión"
                      >
                        <i className="fa-solid fa-right-from-bracket text-white/80" />
                      </button>

                      <Link
                        href="/perfil"
                        className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-white/15 cursor-pointer"
                        aria-label="Ir al perfil"
                      >
                        {user?.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt="Foto de perfil"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-extrabold">
                            {displayUserName.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>

                <section className="mt-4 overflow-hidden rounded-3xl bg-[#0d0d10] ring-1 ring-white/10">
                  <div key={contentKey} className="animate-fadeUp">
                    <div className="bg-gradient-to-b from-[#2b0a14] via-[#1a0d14] to-[#0d0d10] px-4 pt-5 sm:px-6">
                      <div className="flex flex-wrap gap-2">
                        <ChipBtn
                          active={tab === "todo"}
                          onClick={() => setTab("todo")}
                        >
                          Todo
                        </ChipBtn>

                        <ChipBtn
                          active={tab === "musica"}
                          onClick={() => setTab("musica")}
                        >
                          Música
                        </ChipBtn>
                      </div>

                      {view === "liked" && (
                        <LikedHeader
                          userName={displayUserName}
                          songsCount={likedSongs.length}
                          onBack={goHome}
                          onPlay={() => {
                            const firstSong = likedSongs[0];

                            if (!firstSong) return;

                            playSong(firstSong, likedSongs);
                          }}
                        />
                      )}

                      {view === "library" && (
                        <LibraryHeader
                          playlistCount={playlists.length}
                          onBack={goHome}
                          onNewPlaylist={() => setShowCreatePlaylistModal(true)}
                        />
                      )}

                      {view === "artist" && authUser && (
                        <ArtistStudio
                          userId={authUser.id}
                          userName={displayUserName}
                          isArtist={isArtist}
                          onBecomeArtist={becomeArtist}
                          onBecomeListener={becomeListener}
                          onAlbumPublished={handleAlbumPublished}
                        />
                      )}
                      {view === "playlist" && selectedPlaylist && (
                        <PlaylistHeader
                          playlist={selectedPlaylist}
                          onBack={openLibrary}
                          onPlay={() => {
                            const firstSong = selectedPlaylist.songs[0];
                            if (!firstSong) return;

                            playSong(firstSong, selectedPlaylist.songs);
                          }}
                          onEdit={() => setShowEditPlaylistModal(true)}
                          onDelete={() => {
                            const confirmed = window.confirm(
                              `¿Seguro que quieres eliminar la playlist "${selectedPlaylist.title}"?`,
                            );

                            if (!confirmed) return;

                            deletePlaylist(selectedPlaylist.id);
                            setSelectedPlaylist(null);
                            setView("library");
                          }}
                        />
                      )}
                    </div>

                    <div className="px-4 pb-6 pt-4 sm:px-6">
                      {view === "home" && (
                        <HomeContent
                          userName={displayUserName}
                          showSearchResults={showSearchResults}
                          search={search}
                          hasSearchResults={hasSearchResults}
                          searchSongs={searchSongs}
                          searchPlaylists={searchPlaylists}
                          searchArtists={searchArtists}
                          searchAlbums={searchAlbums}
                          likedSongs={likedSongs}
                          playlists={playlists}
                          recentlyPlayed={recentlyPlayed}
                          mostPlayedSongs={mostPlayedSongs}
                          recommendedSongs={recommendedSongs}
                          topArtists={topArtists}
                          topAlbums={topAlbums}
                          playSong={playSong}
                          openLiked={openLiked}
                          openLibrary={openLibrary}
                          openPlaylist={openPlaylist}
                        />
                      )}

                      {view === "liked" && (
                        <LikedTable
                          songs={filteredLikedSongs}
                          playingId={
                            isPlaying ? (currentSong?.id ?? null) : null
                          }
                          onRowPlay={(id) => {
                            const song = likedSongs.find((s) => s.id === id);
                            if (!song) return;

                            playSong(song, likedSongs);
                          }}
                        />
                      )}

                      {view === "library" && (
                        <LibraryContent
                          libraryFilter={libraryFilter}
                          setLibraryFilter={setLibraryFilter}
                          likedSongsCount={likedSongs.length}
                          visiblePlaylistsCount={playlists.length}
                          filteredLibraryPlaylists={filteredLibraryPlaylists}
                          openLiked={openLiked}
                          openPlaylist={openPlaylist}
                        />
                      )}

                      {view === "playlist" && selectedPlaylist && (
                        <LikedTable
                          songs={filteredPlaylistSongs}
                          playingId={
                            isPlaying ? (currentSong?.id ?? null) : null
                          }
                          onRowPlay={(id) => {
                            const song = selectedPlaylist.songs.find(
                              (s) => s.id === id,
                            );
                            if (!song) return;

                            playSong(song, selectedPlaylist.songs);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </section>
              </main>

              <RightPanel currentSong={currentSong} isPlaying={isPlaying} />
            </div>
          </div>
          <CreatePlaylistModal
            open={showCreatePlaylistModal}
            onClose={() => setShowCreatePlaylistModal(false)}
            onCreate={(values) => {
              createPlaylist(values);
              setLibraryFilter("playlists");
              setView("library");
              setShowCreatePlaylistModal(false);
            }}
          />

          {selectedPlaylist && (
            <EditPlaylistModal
              open={showEditPlaylistModal}
              playlist={selectedPlaylist}
              onClose={() => setShowEditPlaylistModal(false)}
              onSave={(values) => {
                updatePlaylistInfo(selectedPlaylist.id, values);

                setSelectedPlaylist((prev) => {
                  if (!prev) return prev;

                  return {
                    ...prev,
                    title: values.title.trim() || prev.title,
                    coverImage: values.coverImage,
                  };
                });

                setShowEditPlaylistModal(false);
              }}
            />
          )}

          <MobileNav
            view={view}
            goHome={goHome}
            openLibrary={openLibrary}
            openArtistStudio={openArtistStudio}
            isArtist={userRole === "artist"}
          />

          <PlayerBar
            isPlaying={isPlaying}
            onToggle={togglePlayer}
            currentTime={currentTime}
            duration={duration}
            onSeek={(sec) => setCurrentTime(sec)}
            volume={volume}
            onVolume={(value) => setVolume(value)}
            currentSong={currentSong}
            onNext={playNextSong}
            onPrev={playPrevSong}
          />
        </div>
      </div>
    </>

    // aqui termina la proteccion de rutas, si no esta logueado no puede acceder al dashboard
  );
}

function ChipBtn({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer",
        active
          ? "bg-white text-black"
          : "bg-white/10 text-white/80 hover:bg-white/15",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function LibraryHeader({
  playlistCount,
  onBack,
  onNewPlaylist,
}: {
  playlistCount: number;
  onBack: () => void;
  onNewPlaylist: () => void;
}) {
  return (
    <div className="pb-6">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer"
          aria-label="Volver"
        >
          <i className="fa-solid fa-chevron-left text-white/80" />
        </button>

        <button
          onClick={onNewPlaylist}
          className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-white/90 active:scale-95 sm:flex"
        >
          <i className="fa-solid fa-plus text-xs" />
          Nueva playlist
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
            Tu colección
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
            Biblioteca
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
            Accede a tus playlists, artistas favoritos, álbumes guardados y
            canciones que más escuchas dentro de Flowy.
          </p>
        </div>

        <div className="rounded-3xl bg-white/8 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#7a0f2b]/30 ring-1 ring-[#7a0f2b]/40">
              <i className="fa-solid fa-bookmark text-xl text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/50">
                Guardado en tu biblioteca
              </p>
              <p className="mt-1 text-2xl font-black">
                {playlistCount} playlists
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaylistHeader({
  playlist,
  onBack,
  onPlay,
  onEdit,
  onDelete,
}: {
  playlist: PlayerPlaylist;
  onBack: () => void;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer"
          aria-label="Volver a biblioteca"
        >
          <i className="fa-solid fa-chevron-left text-white/80" />
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end">
        <div className="group relative h-[150px] w-[150px] shrink-0 sm:h-[190px] sm:w-[190px]">
          <PlaylistArtwork
            title={playlist.title}
            icon={playlist.icon}
            songs={playlist.songs}
            coverImage={playlist.coverImage ?? null}
          />
        </div>

        <div className="min-w-0 pb-2">
          <p className="text-xs font-semibold text-white/70">Playlist</p>

          <h1 className="mt-2 truncate text-4xl font-black tracking-tight sm:text-6xl">
            {playlist.title}
          </h1>

          <p className="mt-3 max-w-xl text-sm text-white/65">
            {playlist.subtitle}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span className="font-semibold text-white">Flowy</span>
            <span>•</span>
            <span>{playlist.songs.length} canciones</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/10 transition hover:bg-white/15"
            >
              <i className="fa-solid fa-pen text-white/70" />
              Editar playlist
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={onPlay}
          className="grid h-14 w-14 place-items-center rounded-full bg-[#7a0f2b] text-white shadow-lg shadow-black/30 hover:brightness-110 active:scale-95 transition cursor-pointer"
          aria-label="Reproducir playlist"
        >
          <i className="fa-solid fa-play" />
        </button>

        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer">
          <i className="fa-solid fa-shuffle text-white/80" />
        </button>

        <button
          onClick={onDelete}
          className="grid h-10 w-10 place-items-center rounded-full bg-red-500/15 text-red-200 ring-1 ring-red-500/20 hover:bg-red-500/25 cursor-pointer"
          aria-label="Eliminar playlist"
          title="Eliminar playlist"
        >
          <i className="fa-solid fa-trash" />
        </button>
      </div>
    </div>
  );
}

function HomeContent({
  userName,
  showSearchResults,
  search,
  hasSearchResults,
  searchSongs,
  searchPlaylists,
  searchArtists,
  searchAlbums,
  likedSongs = [],
  playlists = [],
  recentlyPlayed = [],
  mostPlayedSongs = [],
  recommendedSongs = [],
  topArtists = [],
  topAlbums = [],
  playSong,
  openLiked,
  openLibrary,
  openPlaylist,
}: {
  userName: string;
  showSearchResults: boolean;
  search: string;
  hasSearchResults: boolean;
  searchSongs: Song[];
  searchPlaylists: PlayerPlaylist[];
  searchArtists: string[];
  searchAlbums: string[];
  likedSongs: Song[];
  playlists: PlayerPlaylist[];
  recentlyPlayed: Song[];
  mostPlayedSongs: Song[];
  recommendedSongs: Song[];
  topArtists: {
    name: string;
    plays: number;
  }[];
  topAlbums: {
    name: string;
    artist: string;
    plays: number;
  }[];
  playSong: (song: Song, queue?: Song[]) => void;
  openLiked: () => void;
  openLibrary: () => void;
  openPlaylist: (playlist: PlayerPlaylist) => void;
}) {
  if (showSearchResults) {
    return (
      <div className="animate-fadeUp">
        <div className="mb-6">
          <p className="text-sm font-semibold text-white/50">Resultados para</p>

          <h2 className="mt-1 text-3xl font-black tracking-tight">
            “{search.trim()}”
          </h2>
        </div>

        {hasSearchResults ? (
          <div className="space-y-8">
            {searchSongs.length > 0 && (
              <SearchSection
                title="Canciones"
                right={`${searchSongs.length} resultados`}
              >
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {searchSongs.slice(0, 6).map((song) => (
                    <SearchSongCard
                      key={`${song.id}-${song.title}`}
                      title={song.title}
                      artist={song.artist}
                      album={song.album}
                      cover={song.cover}
                      onClick={() => playSong(song, searchSongs)}
                    />
                  ))}
                </div>
              </SearchSection>
            )}

            {searchPlaylists.length > 0 && (
              <SearchSection
                title="Playlists"
                right={`${searchPlaylists.length} resultados`}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {searchPlaylists.map((playlist) => (
                    <PremiumLibraryPlaylist
                      key={playlist.id}
                      title={playlist.title}
                      subtitle={playlist.subtitle}
                      icon={playlist.icon}
                      songsCount={playlist.songs.length}
                      songs={playlist.songs}
                      coverImage={playlist.coverImage ?? null}
                      onClick={() => openPlaylist(playlist)}
                    />
                  ))}
                </div>
              </SearchSection>
            )}

            {searchArtists.length > 0 && (
              <SearchSection
                title="Artistas"
                right={`${searchArtists.length} resultados`}
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                  {searchArtists.map((artist) => (
                    <SearchCircleCard
                      key={artist}
                      icon="fa-microphone-lines"
                      title={artist}
                      subtitle="Artista"
                    />
                  ))}
                </div>
              </SearchSection>
            )}

            {searchAlbums.length > 0 && (
              <SearchSection
                title="Álbumes"
                right={`${searchAlbums.length} resultados`}
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                  {searchAlbums.map((album) => (
                    <SearchAlbumCard key={album} title={album} />
                  ))}
                </div>
              </SearchSection>
            )}
          </div>
        ) : (
          <EmptyLibraryState
            title="No encontramos resultados"
            text="Intenta buscar una canción, artista, playlist o álbum diferente."
          />
        )}
      </div>
    );
  }

  const firstRecentSong = recentlyPlayed[0];
  const firstLikedSong = likedSongs[0];
  const continueQueue = recentlyPlayed.length > 0 ? recentlyPlayed : likedSongs;
  const continueSong = firstRecentSong ?? firstLikedSong;

  const visibleRecent = recentlyPlayed.slice(0, 6);
  const visibleMostPlayed = mostPlayedSongs.slice(0, 6);
  const visibleRecommended = recommendedSongs.slice(0, 6);
  const visiblePlaylists = playlists.slice(0, 4);

  const mainArtist = topArtists[0]?.name;
  const mainAlbum = topAlbums[0]?.name;

  return (
    <div className="animate-fadeUp space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#7a0f2b]/50 via-white/8 to-black p-6 ring-1 ring-white/10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
              Inicio personalizado
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
              Bienvenido, {userName}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
              Tu inicio se adapta según las canciones, artistas y álbumes que
              vas escuchando dentro de Flowy.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!continueSong}
                onClick={() => {
                  if (!continueSong) return;
                  playSong(continueSong, continueQueue);
                }}
                className={[
                  "inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-black transition active:scale-95",
                  continueSong
                    ? "bg-white text-black hover:bg-white/90 cursor-pointer"
                    : "bg-white/30 text-black/40 cursor-not-allowed",
                ].join(" ")}
              >
                <i className="fa-solid fa-play text-xs" />
                Seguir escuchando
              </button>

              <button
                type="button"
                onClick={openLibrary}
                className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-white/10 px-6 py-3 text-sm font-black text-white ring-1 ring-white/10 transition hover:bg-white/15 active:scale-95"
              >
                <i className="fa-solid fa-bookmark text-xs" />
                Abrir biblioteca
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-black/30 p-4 ring-1 ring-white/10">
            <div className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-[#7a0f2b]/60 via-black to-black p-6 ring-1 ring-white/10">
              <div className="text-center">
                <i className="fa-solid fa-headphones-simple text-6xl text-white" />

                <p className="mt-4 text-sm font-black text-white">
                  {mainArtist
                    ? `Más de ${mainArtist}`
                    : "Escucha para personalizar"}
                </p>

                <p className="mt-2 text-xs leading-relaxed text-white/45">
                  {mainAlbum
                    ? `También estás escuchando mucho ${mainAlbum}.`
                    : "Cuando reproduzcas música, aquí aparecerán tus gustos."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <RowHeader title="Accesos rápidos" right="Tu actividad" />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <LibraryActionCard
            icon="fa-heart"
            title="Tus me gusta"
            subtitle={`${likedSongs.length} canciones guardadas`}
            badge="Favoritos"
            onClick={openLiked}
          />

          <LibraryActionCard
            icon="fa-list"
            title="Tus playlists"
            subtitle={`${playlists.length} playlists creadas`}
            badge="Biblioteca"
            onClick={openLibrary}
          />

          <LibraryActionCard
            icon="fa-clock-rotate-left"
            title="Recientes"
            subtitle={
              firstRecentSong
                ? `${firstRecentSong.title} • ${firstRecentSong.artist}`
                : "Aún no has reproducido canciones"
            }
            badge="Continuar"
            onClick={() => {
              if (!firstRecentSong) return;
              playSong(firstRecentSong, recentlyPlayed);
            }}
          />

          <LibraryActionCard
            icon="fa-fire"
            title="Más escuchado"
            subtitle={
              mostPlayedSongs[0]
                ? `${mostPlayedSongs[0].title} • ${mostPlayedSongs[0].artist}`
                : "Se llenará según escuches música"
            }
            badge="Top"
            onClick={() => {
              if (!mostPlayedSongs[0]) return;
              playSong(mostPlayedSongs[0], mostPlayedSongs);
            }}
          />
        </div>
      </section>

      {visibleRecent.length > 0 && (
        <section>
          <RowHeader
            title="Seguir escuchando"
            right={`${visibleRecent.length} recientes`}
          />

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
            {visibleRecent.map((song) => (
              <SearchSongCard
                key={song.id}
                title={song.title}
                artist={song.artist}
                album={song.album}
                cover={song.cover}
                onClick={() => playSong(song, recentlyPlayed)}
              />
            ))}
          </div>
        </section>
      )}

      {visibleMostPlayed.length > 0 && (
        <section>
          <RowHeader
            title="Tus canciones más repetidas"
            right="Según tu actividad"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
            {visibleMostPlayed.map((song) => (
              <SearchSongCard
                key={song.id}
                title={song.title}
                artist={song.artist}
                album={song.album}
                cover={song.cover}
                onClick={() => playSong(song, mostPlayedSongs)}
              />
            ))}
          </div>
        </section>
      )}

      {visibleRecommended.length > 0 && (
        <section>
          <RowHeader
            title={
              mainArtist
                ? `Porque escuchaste a ${mainArtist}`
                : "Recomendado para ti"
            }
            right="Basado en tus gustos"
          />

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
            {visibleRecommended.map((song) => (
              <SearchSongCard
                key={song.id}
                title={song.title}
                artist={song.artist}
                album={song.album}
                cover={song.cover}
                onClick={() => playSong(song, recommendedSongs)}
              />
            ))}
          </div>
        </section>
      )}

      {visiblePlaylists.length > 0 && (
        <section>
          <RowHeader
            title="Tus playlists recientes"
            right={`${playlists.length} playlists`}
          />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visiblePlaylists.map((playlist) => (
              <PremiumLibraryPlaylist
                key={playlist.id}
                title={playlist.title}
                subtitle={playlist.subtitle}
                icon={playlist.icon}
                songsCount={playlist.songs.length}
                songs={playlist.songs}
                coverImage={playlist.coverImage ?? null}
                onClick={() => openPlaylist(playlist)}
              />
            ))}
          </div>
        </section>
      )}

      {visibleRecent.length === 0 && visibleMostPlayed.length === 0 && (
        <EmptyLibraryState
          title="Tu inicio se adaptará cuando escuches música"
          text="Reproduce canciones, marca favoritos o crea playlists para que Flowy ordene tu inicio según tus gustos."
        />
      )}
    </div>
  );
}

function LibraryContent({
  libraryFilter,
  setLibraryFilter,
  likedSongsCount,
  visiblePlaylistsCount,
  filteredLibraryPlaylists,
  openLiked,
  openPlaylist,
}: {
  libraryFilter: LibraryFilter;
  setLibraryFilter: React.Dispatch<React.SetStateAction<LibraryFilter>>;
  likedSongsCount: number;
  visiblePlaylistsCount: number;
  filteredLibraryPlaylists: PlayerPlaylist[];
  openLiked: () => void;
  openPlaylist: (playlist: PlayerPlaylist) => void;
}) {
  return (
    <div className="animate-fadeUp">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <LibraryFilterBtn
          active={libraryFilter === "todo"}
          onClick={() => setLibraryFilter("todo")}
        >
          Todo
        </LibraryFilterBtn>

        <LibraryFilterBtn
          active={libraryFilter === "playlists"}
          onClick={() => setLibraryFilter("playlists")}
        >
          Playlists
        </LibraryFilterBtn>

        <LibraryFilterBtn
          active={libraryFilter === "artistas"}
          onClick={() => setLibraryFilter("artistas")}
        >
          Artistas
        </LibraryFilterBtn>

        <LibraryFilterBtn
          active={libraryFilter === "albumes"}
          onClick={() => setLibraryFilter("albumes")}
        >
          Álbumes
        </LibraryFilterBtn>
      </div>

      {libraryFilter === "todo" && (
        <>
          <RowHeader title="Accesos rápidos" right="Ordenar" />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <LibraryActionCard
              icon="fa-heart"
              title="Tus me gusta"
              subtitle={`${likedSongsCount} canciones guardadas`}
              badge="Favoritos"
              onClick={openLiked}
            />

            <LibraryActionCard
              icon="fa-list"
              title="Playlists"
              subtitle={`${visiblePlaylistsCount} playlists creadas`}
              badge="Colección"
              onClick={() => setLibraryFilter("playlists")}
            />

            <LibraryActionCard
              icon="fa-microphone-lines"
              title="Artistas"
              subtitle="Tus artistas favoritos"
              badge="Música"
              onClick={() => setLibraryFilter("artistas")}
            />

            <LibraryActionCard
              icon="fa-compact-disc"
              title="Álbumes"
              subtitle="Álbumes guardados"
              badge="Guardados"
              onClick={() => setLibraryFilter("albumes")}
            />
          </div>

          <div className="mt-8">
            <RowHeader title="Playlists recientes" right="Mostrar todo" />

            {filteredLibraryPlaylists.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {filteredLibraryPlaylists.map((playlist) => (
                  <PremiumLibraryPlaylist
                    key={playlist.id}
                    title={playlist.title}
                    subtitle={playlist.subtitle}
                    icon={playlist.icon}
                    songsCount={playlist.songs.length}
                    songs={playlist.songs}
                    coverImage={playlist.coverImage ?? null}
                    onClick={() => openPlaylist(playlist)}
                  />
                ))}
              </div>
            ) : (
              <EmptyLibraryState
                title="No encontramos playlists"
                text="Intenta buscar con otro nombre o limpia el buscador."
              />
            )}
          </div>
        </>
      )}

      {libraryFilter === "playlists" && (
        <div>
          <RowHeader
            title="Tus playlists"
            right={`${visiblePlaylistsCount} en total`}
          />

          {filteredLibraryPlaylists.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredLibraryPlaylists.map((playlist) => (
                <PremiumLibraryPlaylist
                  key={playlist.id}
                  title={playlist.title}
                  subtitle={playlist.subtitle}
                  icon={playlist.icon}
                  songsCount={playlist.songs.length}
                  songs={playlist.songs}
                  coverImage={playlist.coverImage ?? null}
                  onClick={() => openPlaylist(playlist)}
                />
              ))}
            </div>
          ) : (
            <EmptyLibraryState
              title="No hay playlists con ese nombre"
              text="Prueba buscando otra palabra."
            />
          )}
        </div>
      )}

      {libraryFilter === "artistas" && <ArtistGrid />}

      {libraryFilter === "albumes" && <AlbumGrid />}
    </div>
  );
}

function ArtistGrid() {
  const artists: string[] = [];

  return (
    <div>
      <RowHeader title="Artistas favoritos" right="Ver todos" />

      {artists.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {artists.map((artist) => (
            <button
              key={artist}
              className="group rounded-2xl bg-white/6 p-4 text-center ring-1 ring-white/10 transition hover:bg-white/10 cursor-pointer"
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#7a0f2b]/40 to-white/5 ring-1 ring-white/10">
                <i className="fa-solid fa-microphone-lines text-2xl text-white/75" />
              </div>

              <div className="mt-3 truncate text-sm font-bold">{artist}</div>
              <div className="text-xs text-white/50">Artista</div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyLibraryState
          title="Aún no hay artistas"
          text="Cuando guardes o busques artistas, aparecerán aquí."
        />
      )}
    </div>
  );
}

function AlbumGrid() {
  const albums: string[] = [];

  return (
    <div>
      <RowHeader title="Álbumes guardados" right="Ver todos" />

      {albums.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {albums.map((album) => (
            <SearchAlbumCard key={album} title={album} />
          ))}
        </div>
      ) : (
        <EmptyLibraryState
          title="Aún no hay álbumes"
          text="Cuando guardes álbumes, aparecerán aquí."
        />
      )}
    </div>
  );
}
function RowHeader({ title, right }: { title: string; right: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-xl font-extrabold">{title}</div>
      <button className="text-sm font-semibold text-white/60 hover:text-white/90 cursor-pointer">
        {right}
      </button>
    </div>
  );
}

function MixTile({
  title,
  subtitle,
  strip,
}: {
  title: string;
  subtitle: string;
  strip: string;
}) {
  return (
    <button className="w-[160px] shrink-0 cursor-pointer sm:w-[180px]">
      <div className="group rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/8 transition">
        <div className="relative overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
          <div className="aspect-square w-full bg-gradient-to-br from-white/10 to-white/0" />

          <div
            className={[
              "absolute bottom-0 left-0 h-2 w-full",
              stripColor(strip),
            ].join(" ")}
          />

          <div className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-[#7a0f2b] text-white opacity-0 shadow-lg shadow-black/30 transition group-hover:opacity-100 group-active:scale-95">
            <i className="fa-solid fa-play text-sm" />
          </div>
        </div>

        <div className="mt-3 text-left">
          <div className="text-sm font-bold">{title}</div>
          <div className="mt-1 text-xs text-white/60">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}

function AlbumCard() {
  return (
    <button className="rounded-2xl bg-white/6 p-3 text-left ring-1 ring-white/10 hover:bg-white/10 cursor-pointer transition">
      <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/10" />
      <div className="mt-3 text-sm font-bold">Álbum</div>
      <div className="text-xs text-white/60">Sugerido para ti</div>
    </button>
  );
}

function LibraryFilterBtn({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer",
        active
          ? "bg-white text-black"
          : "bg-white/10 text-white/75 hover:bg-white/15 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function LibraryActionCard({
  icon,
  title,
  subtitle,
  badge,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl bg-white/6 p-4 text-left ring-1 ring-white/10 transition hover:bg-white/10 cursor-pointer"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#7a0f2b]/20 blur-2xl transition group-hover:bg-[#7a0f2b]/35" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#7a0f2b]/30 ring-1 ring-[#7a0f2b]/40">
            <i className={`fa-solid ${icon} text-xl text-white`} />
          </div>

          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/60 ring-1 ring-white/10">
            {badge}
          </span>
        </div>

        <div className="mt-5 text-base font-extrabold">{title}</div>
        <div className="mt-1 text-sm text-white/60">{subtitle}</div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/40">Abrir</span>

          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#7a0f2b] opacity-0 transition group-hover:opacity-100">
            <i className="fa-solid fa-arrow-right text-xs" />
          </span>
        </div>
      </div>
    </button>
  );
}

function PremiumLibraryPlaylist({
  title,
  subtitle,
  icon,
  songsCount,
  songs,
  coverImage,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: string;
  songsCount: number;
  songs: Song[];
  coverImage?: string | null;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-3xl bg-white/6 p-3 text-left ring-1 ring-white/10 transition hover:bg-white/10 cursor-pointer"
    >
      <PlaylistArtwork
        title={title}
        icon={icon}
        songs={songs}
        coverImage={coverImage}
      />

      <div className="mt-4">
        <div className="truncate text-sm font-extrabold">{title}</div>

        <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/60">
          {subtitle}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/45">
          <i className="fa-solid fa-music text-[10px]" />
          <span>{songsCount} canciones</span>
        </div>
      </div>
    </button>
  );
}

function EmptyLibraryState({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-4 rounded-3xl bg-white/5 p-8 text-center ring-1 ring-white/10">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10 ring-1 ring-white/10">
        <i className="fa-solid fa-magnifying-glass text-xl text-white/60" />
      </div>

      <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
      <p className="mt-2 text-sm text-white/55">{text}</p>
    </div>
  );
}

function SearchSection({
  title,
  right,
  children,
}: {
  title: string;
  right: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-xl font-extrabold">{title}</h3>
        <span className="text-sm font-semibold text-white/45">{right}</span>
      </div>

      {children}
    </section>
  );
}

function SearchSongCard({
  title,
  artist,
  album,
  cover,
  onClick,
}: {
  title: string;
  artist: string;
  album: string;
  cover?: string | null;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl bg-white/6 p-3 text-left ring-1 ring-white/10 transition hover:bg-white/10 cursor-pointer"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#7a0f2b]/40 to-black ring-1 ring-white/10">
        {cover ? (
          <img src={cover} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <i className="fa-solid fa-music text-white/70" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-extrabold text-white">
          {title}
        </div>

        <div className="mt-1 truncate text-xs text-white/55">
          {artist} • {album}
        </div>
      </div>

      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#7a0f2b] text-white opacity-0 transition group-hover:opacity-100 group-active:scale-95">
        <i className="fa-solid fa-play text-xs" />
      </div>
    </button>
  );
}

function SearchCircleCard({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <button className="group rounded-2xl bg-white/6 p-4 text-center ring-1 ring-white/10 transition hover:bg-white/10 cursor-pointer">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#7a0f2b]/40 to-white/5 ring-1 ring-white/10">
        <i className={`fa-solid ${icon} text-2xl text-white/75`} />
      </div>

      <div className="mt-3 truncate text-sm font-bold">{title}</div>
      <div className="text-xs text-white/50">{subtitle}</div>
    </button>
  );
}

function SearchAlbumCard({ title }: { title: string }) {
  return (
    <button className="group rounded-2xl bg-white/6 p-3 text-left ring-1 ring-white/10 transition hover:bg-white/10 cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#7a0f2b]/35 via-white/10 to-black ring-1 ring-white/10">
        <div className="aspect-square w-full" />

        <div className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-[#7a0f2b] text-white opacity-0 shadow-lg shadow-black/30 transition group-hover:opacity-100 group-active:scale-95">
          <i className="fa-solid fa-play text-xs" />
        </div>
      </div>

      <div className="mt-3 truncate text-sm font-bold">{title}</div>
      <div className="text-xs text-white/50">Álbum</div>
    </button>
  );
}

function PlaylistArtwork({
  title,
  icon,
  songs,
  coverImage,
}: {
  title: string;
  icon: string;
  songs: Song[];
  coverImage?: string | null;
}) {
  const collageSongs = songs.slice(0, 4);

  if (coverImage) {
    return (
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
        <div className="aspect-square w-full">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-[#7a0f2b] text-white opacity-0 shadow-lg shadow-black/30 transition group-hover:opacity-100 group-active:scale-95">
          <i className="fa-solid fa-play text-sm" />
        </div>
      </div>
    );
  }

  if (collageSongs.length > 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
        <div className="grid aspect-square w-full grid-cols-2 grid-rows-2 overflow-hidden bg-black">
          {collageSongs.map((song) => (
            <div
              key={song.id}
              className="relative border border-black/20 bg-gradient-to-br from-[#7a0f2b]/30 via-white/10 to-black"
            >
              {song.cover ? (
                <img
                  src={song.cover}
                  alt={song.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <div className="px-2 text-center">
                    <i className="fa-solid fa-music text-sm text-white/70" />
                    <p className="mt-1 line-clamp-2 text-[10px] font-bold text-white/80">
                      {song.title}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {Array.from({ length: Math.max(0, 4 - collageSongs.length) }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="grid place-items-center border border-black/20 bg-gradient-to-br from-white/10 to-black"
              >
                <i className="fa-solid fa-music text-white/35" />
              </div>
            ),
          )}
        </div>

        <div className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-[#7a0f2b] text-white opacity-0 shadow-lg shadow-black/30 transition group-hover:opacity-100 group-active:scale-95">
          <i className="fa-solid fa-play text-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#7a0f2b]/35 via-white/10 to-black ring-1 ring-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_35%)]" />

      <i className={`fa-solid ${icon} relative text-5xl text-white/75`} />

      <div className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-[#7a0f2b] text-white opacity-0 shadow-lg shadow-black/30 transition group-hover:opacity-100 group-active:scale-95">
        <i className="fa-solid fa-play text-sm" />
      </div>
    </div>
  );
}

function CreatePlaylistModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (values: {
    title: string;
    subtitle: string;
    icon: string;
    coverImage: string | null;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("fa-music");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  if (!open) return null;

  const icons = [
    "fa-music",
    "fa-headphones",
    "fa-fire",
    "fa-moon",
    "fa-dumbbell",
    "fa-code",
    "fa-heart",
    "fa-star",
  ];

  const cleanTitle = title.trim();
  const cleanSubtitle = subtitle.trim() || "Nueva playlist de Flowy";
  const canCreate = cleanTitle.length > 0;

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 text-white backdrop-blur-sm">
      <div className="w-full max-w-[640px] overflow-hidden rounded-3xl bg-[#121214] shadow-2xl shadow-black/70 ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-xl font-black">Nueva playlist</h2>
            <p className="mt-1 text-xs text-white/50">
              Agrega nombre, portada y revisa la previsualización.
            </p>
          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-xmark text-white/70" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[220px_1fr]">
          <div>
            <p className="mb-3 text-sm font-bold">Previsualización</p>

            <div className="rounded-3xl bg-white/5 p-3 ring-1 ring-white/10">
              <PlaylistArtwork
                title={cleanTitle || "Nueva playlist"}
                icon={selectedIcon}
                songs={[]}
                coverImage={coverImage}
              />

              <div className="mt-4">
                <div className="truncate text-sm font-extrabold">
                  {cleanTitle || "Nueva playlist"}
                </div>

                <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/60">
                  {cleanSubtitle}
                </div>

                <div className="mt-3 text-xs font-semibold text-white/45">
                  Personaliza tu playlist con una imagen que combine con su
                  estilo.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Nombre de la playlist
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ejemplo: Música para programar"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/35 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Descripción
              </label>

              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ejemplo: Vibes oscuras y concentración"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/35 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Portada</label>

              <div className="flex flex-wrap gap-3">
                <label className="cursor-pointer rounded-full bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-white/90">
                  Subir portada
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                </label>

                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="rounded-full bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/15 cursor-pointer"
                  >
                    Quitar portada
                  </button>
                )}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-white/50">
                Puedes agregar una imagen para que tu playlist se vea más
                personalizada.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Icono base</label>

              <div className="grid grid-cols-4 gap-3">
                {icons.map((icon) => {
                  const active = selectedIcon === icon;

                  return (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={[
                        "grid h-12 place-items-center rounded-2xl ring-1 transition cursor-pointer",
                        active
                          ? "bg-[#7a0f2b]/35 ring-[#7a0f2b]/60 text-white"
                          : "bg-white/5 ring-white/10 text-white/60 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <i className={`fa-solid ${icon}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/15 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            disabled={!canCreate}
            onClick={() =>
              onCreate({
                title: cleanTitle,
                subtitle: cleanSubtitle,
                icon: selectedIcon,
                coverImage,
              })
            }
            className={[
              "rounded-full px-5 py-3 text-sm font-bold transition",
              canCreate
                ? "bg-white text-black hover:bg-white/90 cursor-pointer"
                : "cursor-not-allowed bg-white/30 text-black/40",
            ].join(" ")}
          >
            Crear playlist
          </button>
        </div>
      </div>
    </div>
  );
}

function EditPlaylistModal({
  open,
  playlist,
  onClose,
  onSave,
}: {
  open: boolean;
  playlist: PlayerPlaylist;
  onClose: () => void;
  onSave: (values: { title: string; coverImage: string | null }) => void;
}) {
  const [title, setTitle] = useState(playlist.title);
  const [coverImage, setCoverImage] = useState<string | null>(
    playlist.coverImage ?? null,
  );

  useEffect(() => {
    if (!open) return;

    setTitle(playlist.title);
    setCoverImage(playlist.coverImage ?? null);
  }, [open, playlist]);

  if (!open) return null;

  const cleanTitle = title.trim();
  const canSave = cleanTitle.length > 0;

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 text-white backdrop-blur-sm">
      <div className="w-full max-w-[620px] overflow-hidden rounded-3xl bg-[#121214] shadow-2xl shadow-black/70 ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-xl font-black">Editar playlist</h2>
            <p className="mt-1 text-xs text-white/50">
              Cambia el nombre y la portada de tu playlist.
            </p>
          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-xmark text-white/70" />
          </button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[210px_1fr]">
          <div>
            <p className="mb-3 text-sm font-bold">Portada</p>

            <div className="rounded-3xl bg-white/5 p-3 ring-1 ring-white/10">
              <PlaylistArtwork
                title={cleanTitle || playlist.title}
                icon={playlist.icon}
                songs={playlist.songs}
                coverImage={coverImage}
              />

              <div className="mt-4 flex flex-col gap-3">
                <label className="cursor-pointer rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-black transition hover:bg-white/90">
                  Subir portada
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files?.[0])}
                  />
                </label>

                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="rounded-full bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/15 cursor-pointer"
                  >
                    Quitar portada
                  </button>
                )}
              </div>

              <p className="mt-3 text-xs leading-relaxed text-white/45">
                Puedes cambiar o quitar la portada cuando quieras.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Nombre de la playlist
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nombre de la playlist"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/35 focus:border-white/30"
              />

              {!canSave && (
                <p className="mt-2 text-xs font-semibold text-red-300">
                  El nombre no puede estar vacío.
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#7a0f2b]/25 ring-1 ring-[#7a0f2b]/40">
                  <i className="fa-solid fa-circle-info text-white/75" />
                </div>

                <p className="text-sm leading-relaxed text-white/60">
                  Personaliza tu playlist con un nombre y una portada que
                  representen mejor su estilo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/15 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;

              onSave({
                title: cleanTitle,
                coverImage,
              });
            }}
            className={[
              "rounded-full px-5 py-3 text-sm font-bold transition",
              canSave
                ? "bg-white text-black hover:bg-white/90 cursor-pointer"
                : "cursor-not-allowed bg-white/30 text-black/40",
            ].join(" ")}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
