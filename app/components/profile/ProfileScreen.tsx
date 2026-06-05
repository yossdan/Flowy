"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/dashboard/Sidebar";
import RightPanel from "@/app/components/dashboard/RightPanel";
import PlayerBar from "@/app/components/dashboard/PlayerBar";
import MobileNav from "@/app/components/dashboard/MobileNav";
import { usePlayer } from "@/app/context/PlayerContext";
import { fmtTime } from "@/app/lib/helpers";
import type { PerfilTab, ProfileData } from "@/app/types/profile";
import type { Song } from "@/app/types/dashboard";
import type { PlayerPlaylist } from "@/app/context/PlayerContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  getStoredAuthUser,
  updateProfileRequest,
} from "@/app/services/auth.service";

type ProfileScreenProps = {
  data: ProfileData;
  activeTab: PerfilTab;
  setActiveTab: React.Dispatch<React.SetStateAction<PerfilTab>>;
};

export default function ProfileScreen({
  data,
  activeTab,
  setActiveTab,
}: ProfileScreenProps) {
  const router = useRouter();
  const { user, logoutUser, setUser } = useAuth();
  const storedUser = getStoredAuthUser();
  const authUser = user ?? storedUser;

  const displayName = authUser?.name || data.name || "Usuario";
  const displayInitial = displayName.slice(0, 1).toUpperCase();

  const [profilePhotoBroken, setProfilePhotoBroken] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileName, setProfileName] = useState(displayName);
  const [profileInitial, setProfileInitial] = useState(displayInitial);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const player = usePlayer();

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    setCurrentTime,
    setVolume,
    togglePlayer,
    playNextSong,
    playPrevSong,
    playSong,
  } = player;

  const likedSongs: Song[] = player.likedSongs ?? [];
  const playlists: PlayerPlaylist[] = player.playlists ?? [];
  const recentlyPlayed: Song[] = player.recentlyPlayed ?? [];
  const mostPlayedSongs: Song[] = player.mostPlayedSongs ?? [];

  const safeProfilePhoto = useMemo(() => {
    const photo = authUser?.profilePhoto;

    if (profilePhotoBroken || !photo) return null;
    if (photo.startsWith("data:image")) return photo;
    if (photo.startsWith("http")) return photo;

    return null;
  }, [authUser?.profilePhoto, profilePhotoBroken]);

  const visibleProfileImage = profileImage || safeProfilePhoto;

  useEffect(() => {
    setProfileName(displayName);
    setProfileInitial(displayInitial);
  }, [displayName, displayInitial]);

  const uniqueRecentlyPlayed = useMemo(() => {
    return recentlyPlayed.filter(
      (song, index, array) =>
        array.findIndex((item) => item.id === song.id) === index,
    );
  }, [recentlyPlayed]);

  const listenedSeconds = useMemo(() => {
    const source = recentlyPlayed.length > 0 ? recentlyPlayed : mostPlayedSongs;

    return source.reduce((total, song) => total + (song.duration || 0), 0);
  }, [recentlyPlayed, mostPlayedSongs]);

  const listenedMinutes = Math.floor(listenedSeconds / 60);

  const publicPlaylists = useMemo(() => {
    return playlists.filter((playlist) => playlist.songs.length > 0);
  }, [playlists]);

  const goHome = () => router.push("/dashboard");
  const openLiked = () => router.push("/dashboard");
  const openLibrary = () => router.push("/dashboard");

  function playLikedSong(song: Song) {
    playSong(song, likedSongs);
  }

  function playRecentSong(song: Song) {
    playSong(song, recentlyPlayed);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="min-h-screen pb-44 md:pb-24">
        <div className="flex min-h-screen">
          <div className="hidden md:block">
            <Sidebar
              goHome={goHome}
              openLiked={openLiked}
              openLibrary={openLibrary}
              userInitial={profileInitial}
              openProfile={() => router.push("/perfil")}
            />
          </div>

          <div className="flex min-w-0 flex-1 gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4">
            <main className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={goHome}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer"
                  aria-label="Volver al dashboard"
                >
                  <i className="fa-solid fa-chevron-left text-white/85" />
                </button>

                <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full bg-white/10 px-4 ring-1 ring-white/10 focus-within:ring-white/25">
                  <i className="fa-solid fa-magnifying-glass text-white/60" />
                  <input
                    placeholder="Buscar en tu perfil"
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-white/50"
                  />
                </div>

                <button className="hidden h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer md:grid">
                  <i className="fa-regular fa-bell text-white/80" />
                </button>

                <button className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-white/15 cursor-pointer">
                  {visibleProfileImage ? (
                    <img
                      src={visibleProfileImage}
                      alt="Foto de perfil"
                      onError={() => setProfilePhotoBroken(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-extrabold">
                      {profileInitial}
                    </span>
                  )}
                </button>
              </div>

              <section className="mt-4 overflow-hidden rounded-3xl bg-[#0d0d10] ring-1 ring-white/10">
                <div className="bg-gradient-to-b from-[#3a0d1b] via-[#1b0d14] to-[#0d0d10] px-4 pb-6 pt-6 sm:px-6">
                  <div className="flex flex-col gap-6 md:flex-row md:items-end">
                    <div className="grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 shadow-2xl shadow-black/40">
                      {visibleProfileImage ? (
                        <img
                          src={visibleProfileImage}
                          alt="Foto de perfil"
                          onError={() => setProfilePhotoBroken(true)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl font-extrabold text-white">
                          {profileInitial}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/70">
                        <i className="fa-solid fa-user text-white/70" />
                        Perfil
                      </div>

                      <h1 className="truncate text-4xl font-black tracking-tight sm:text-6xl">
                        {profileName}
                      </h1>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
                        <span className="font-bold text-white">
                          {likedSongs.length} canciones favoritas
                        </span>
                        <span>•</span>
                        <span>{playlists.length} playlists</span>
                        <span>•</span>
                        <span>{listenedMinutes} min escuchados</span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:bg-white/90 cursor-pointer"
                        >
                          Editar perfil
                        </button>

                        <button className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/15 cursor-pointer">
                          Compartir perfil
                        </button>

                        <button
                          onClick={logoutUser}
                          className="rounded-full bg-red-500/15 px-5 py-2 text-sm font-bold text-red-100 ring-1 ring-red-500/20 hover:bg-red-500/25 cursor-pointer"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <StatCard
                      icon="fa-music"
                      label="Canciones favoritas"
                      value={String(likedSongs.length)}
                    />

                    <StatCard
                      icon="fa-list"
                      label="Playlists creadas"
                      value={String(playlists.length)}
                    />

                    <StatCard
                      icon="fa-clock-rotate-left"
                      label="Minutos escuchados"
                      value={String(listenedMinutes)}
                    />

                    <StatCard
                      icon="fa-user-group"
                      label="Seguidores"
                      value="0"
                      hint="Próximamente"
                    />
                  </div>
                </div>

                <div className="px-4 pb-6 pt-4 sm:px-6">
                  <div className="flex flex-wrap gap-2">
                    <TabBtn
                      active={activeTab === "playlists"}
                      onClick={() => setActiveTab("playlists")}
                    >
                      Playlists
                    </TabBtn>

                    <TabBtn
                      active={activeTab === "favoritos"}
                      onClick={() => setActiveTab("favoritos")}
                    >
                      Favoritos
                    </TabBtn>

                    <TabBtn
                      active={activeTab === "actividad"}
                      onClick={() => setActiveTab("actividad")}
                    >
                      Actividad
                    </TabBtn>
                  </div>

                  {activeTab === "playlists" && (
                    <div className="mt-6">
                      <SectionHeader
                        title="Playlists"
                        action={`${publicPlaylists.length} con canciones`}
                      />

                      {playlists.length > 0 ? (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          {playlists.map((playlist) => (
                            <PlaylistCard
                              key={playlist.id}
                              playlist={playlist}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyProfileState
                          icon="fa-list"
                          title="Todavía no tienes playlists"
                          text="Esta sección queda limpia por ahora. Cuando crees playlists desde la biblioteca, aparecerán aquí."
                          action="Ir a biblioteca"
                          onAction={goHome}
                        />
                      )}
                    </div>
                  )}

                  {activeTab === "favoritos" && (
                    <div className="mt-6">
                      <SectionHeader
                        title="Canciones favoritas"
                        action={`${likedSongs.length} guardadas`}
                      />

                      {likedSongs.length > 0 ? (
                        <div className="mt-4 overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
                          {likedSongs.map((song, index) => (
                            <SongRow
                              key={song.id}
                              song={song}
                              index={index + 1}
                              onClick={() => playLikedSong(song)}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyProfileState
                          icon="fa-heart"
                          title="Aún no tienes favoritos"
                          text="Por ahora esta parte es temporal. Cuando le des corazón a una canción, aparecerá aquí."
                          action="Volver al inicio"
                          onAction={goHome}
                        />
                      )}
                    </div>
                  )}

                  {activeTab === "actividad" && (
                    <div className="mt-6">
                      <SectionHeader
                        title="Actividad reciente"
                        action={`${uniqueRecentlyPlayed.length} canciones`}
                      />

                      {uniqueRecentlyPlayed.length > 0 ? (
                        <div className="mt-4 space-y-3">
                          {uniqueRecentlyPlayed.slice(0, 8).map((song) => (
                            <ActivitySongCard
                              key={song.id}
                              song={song}
                              onClick={() => playRecentSong(song)}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyProfileState
                          icon="fa-clock-rotate-left"
                          title="Sin actividad reciente"
                          text="Cuando empieces a reproducir canciones, aquí se mostrará tu actividad real en lugar de datos estáticos."
                          action="Ir al dashboard"
                          onAction={goHome}
                        />
                      )}
                    </div>
                  )}
                </div>
              </section>
            </main>

            <RightPanel
              currentSong={currentSong}
              isPlaying={isPlaying}
              duration={duration}
            />
          </div>
        </div>

        <EditProfileModal
          open={showEditModal}
          name={profileName}
          initial={profileInitial}
          image={visibleProfileImage}
          saving={savingProfile}
          onClose={() => setShowEditModal(false)}
          onSave={async (values) => {
            const currentUser = authUser ?? getStoredAuthUser();

            if (!currentUser) {
              alert("No se encontró una sesión activa.");
              return;
            }

            try {
              setSavingProfile(true);

              const updatedUser = await updateProfileRequest({
                userId: currentUser.id,
                userName: values.name,
                profilePhoto: values.imageFile,
              });

              setUser(updatedUser);
              setProfileName(updatedUser.name);
              setProfileInitial(updatedUser.name.slice(0, 1).toUpperCase());
              setProfileImage(updatedUser.profilePhoto ?? values.image);
              setProfilePhotoBroken(false);
              setShowEditModal(false);
            } catch (error) {
              console.error("Error actualizando perfil:", error);
              alert("No se pudo actualizar el perfil.");
            } finally {
              setSavingProfile(false);
            }
          }}
        />

        <MobileNav view="home" goHome={goHome} openLibrary={openLibrary} />

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
  );
}

function TabBtn({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
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

function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-xl font-extrabold">{title}</h2>
      <span className="text-sm font-semibold text-white/50">{action}</span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
          <i className={`fa-solid ${icon} text-white/80`} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs text-white/60">{label}</p>
          <div className="flex items-end gap-2">
            <p className="text-lg font-extrabold">{value}</p>
            {hint && <p className="pb-0.5 text-[10px] text-white/35">{hint}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaylistCard({ playlist }: { playlist: PlayerPlaylist }) {
  const firstCover =
    playlist.coverImage || playlist.songs.find((s) => s.cover)?.cover;

  return (
    <button className="group rounded-2xl bg-white/6 p-3 text-left ring-1 ring-white/10 hover:bg-white/10 cursor-pointer transition">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/10">
        <div className="aspect-square w-full">
          {firstCover ? (
            <img
              src={firstCover}
              alt={playlist.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#7a0f2b]/45 to-black">
              <i
                className={`fa-solid ${playlist.icon || "fa-music"} text-4xl text-white/80`}
              />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
      </div>

      <h3 className="mt-3 truncate font-extrabold">{playlist.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-white/55">
        {playlist.subtitle || "Playlist creada en Flowy"}
      </p>
      <p className="mt-2 text-xs font-bold text-white/40">
        {playlist.songs.length} canciones
      </p>
    </button>
  );
}

function SongRow({
  song,
  index,
  onClick,
}: {
  song: Song;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="grid w-full grid-cols-[36px_1fr_72px] items-center gap-3 px-3 py-3 text-left transition hover:bg-white/10 sm:grid-cols-[44px_1fr_1fr_80px]"
    >
      <div className="text-center text-sm text-white/45">{index}</div>

      <div className="flex min-w-0 items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#7a0f2b]/45 to-black ring-1 ring-white/10">
          {song.cover ? (
            <img
              src={song.cover}
              alt={song.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <i className="fa-solid fa-music text-xs text-white/60" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-white/90">
            {song.title}
          </div>
          <div className="truncate text-xs text-white/50">{song.artist}</div>
        </div>
      </div>

      <div className="hidden truncate text-sm text-white/50 sm:block">
        {song.album}
      </div>

      <div className="text-right text-sm text-white/45">
        {fmtTime(song.duration || 0)}
      </div>
    </button>
  );
}

function ActivitySongCard({
  song,
  onClick,
}: {
  song: Song;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl bg-white/6 p-4 text-left ring-1 ring-white/10 transition hover:bg-white/10 cursor-pointer"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#7a0f2b]/25 ring-1 ring-[#7a0f2b]/30">
        {song.cover ? (
          <img
            src={song.cover}
            alt={song.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <i className="fa-solid fa-play text-white/80" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-extrabold">{song.title}</h3>
        <p className="mt-1 truncate text-xs text-white/55">
          Reproduciste {song.artist} • {song.album}
        </p>
      </div>

      <span className="hidden text-xs font-bold text-white/40 sm:block">
        {fmtTime(song.duration || 0)}
      </span>
    </button>
  );
}

function EmptyProfileState({
  icon,
  title,
  text,
  action,
  onAction,
}: {
  icon: string;
  title: string;
  text: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="mt-4 rounded-3xl bg-white/5 p-8 text-center ring-1 ring-white/10">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
        <i className={`fa-solid ${icon} text-2xl text-white/75`} />
      </div>

      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-white/55">
        {text}
      </p>

      <button
        onClick={onAction}
        className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-white/90 active:scale-95 cursor-pointer"
      >
        {action}
      </button>
    </div>
  );
}

function EditProfileModal({
  open,
  name,
  initial,
  image,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  name: string;
  initial: string;
  image: string | null;
  saving: boolean;
  onClose: () => void;
  onSave: (values: {
    name: string;
    image: string | null;
    imageFile: File | null;
  }) => void | Promise<void>;
}) {
  const [draftName, setDraftName] = useState(name);
  const [draftImage, setDraftImage] = useState<string | null>(image);
  const [draftImageFile, setDraftImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraftName(name);
    setDraftImage(image);
    setDraftImageFile(null);
  }, [open, name, image]);

  if (!open) return null;

  const cleanName = draftName.trim();
  const canSave = cleanName.length >= 2 && !saving;

  function handleImageChange(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida.");
      return;
    }

    setDraftImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraftImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-[130] grid place-items-center bg-black/70 px-4 text-white backdrop-blur-sm">
      <div className="w-full max-w-[520px] overflow-hidden rounded-3xl bg-[#121214] shadow-2xl shadow-black/70 ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-xl font-black">Editar perfil</h2>
            <p className="mt-1 text-xs text-white/50">
              Cambia tu nombre y foto de perfil.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 cursor-pointer disabled:opacity-40"
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-xmark text-white/70" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10">
              {draftImage ? (
                <img
                  src={draftImage}
                  alt="Nueva foto de perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-black">{initial}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-white/90">
                <i className="fa-solid fa-image" />
                Cambiar foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0])}
                />
              </label>

              {draftImage && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftImage(null);
                    setDraftImageFile(null);
                  }}
                  className="mt-3 block text-sm font-bold text-white/55 hover:text-white cursor-pointer"
                >
                  Quitar vista previa
                </button>
              )}
            </div>
          </div>

          <label className="mt-6 block text-sm font-bold">Nombre</label>
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Tu nombre"
            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none placeholder:text-white/35 focus:border-white/30"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-white/15 disabled:opacity-40 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={!canSave}
              onClick={() =>
                onSave({
                  name: cleanName,
                  image: draftImage,
                  imageFile: draftImageFile,
                })
              }
              className={[
                "rounded-full px-5 py-3 text-sm font-black transition active:scale-95",
                canSave
                  ? "bg-white text-black hover:bg-white/90 cursor-pointer"
                  : "cursor-not-allowed bg-white/30 text-black/40",
              ].join(" ")}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
