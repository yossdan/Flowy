"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import RightPanel from "@/app/components/dashboard/RightPanel";
import PlayerBar from "@/app/components/dashboard/PlayerBar";
import { usePlayer } from "@/app/context/PlayerContext";
import type { PerfilTab, ProfileData } from "@/app/types/profile";
import MobileNav from "@/app/components/dashboard/MobileNav";
import AuthGuard from "@/app/components/auth/AuthGuard";
import { useAuth } from "@/app/context/AuthContext";

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
  const { user, logoutUser } = useAuth();

  const displayName = user?.name || data.name;
  const displayInitial = displayName.slice(0, 1).toUpperCase();

  const [showEditModal, setShowEditModal] = useState(false);
  const [profileName, setProfileName] = useState(displayName);
  const [profileInitial, setProfileInitial] = useState(displayInitial);
  useEffect(() => {
    setProfileName(displayName);
    setProfileInitial(displayInitial);
  }, [displayName, displayInitial]);

  const [profileImage, setProfileImage] = useState<string | null>(null);
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
  } = usePlayer();

  const goHome = () => router.push("/dashboard");
  const openLiked = () => router.push("/dashboard");
  const openLibrary = () => router.push("/dashboard");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="min-h-screen pb-44 md:pb-24">
        <div className="flex min-h-screen">
          <div className="hidden md:block">
            <Sidebar
              goHome={goHome}
              openLiked={openLiked}
              openLibrary={openLibrary}
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
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Foto de perfil"
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
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Foto de perfil"
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
                          {data.playlistsCount}
                        </span>
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
                      value={data.stats.favoriteSongs}
                    />

                    <StatCard
                      icon="fa-list"
                      label="Playlists públicas"
                      value={data.stats.publicPlaylists}
                    />

                    <StatCard
                      icon="fa-clock-rotate-left"
                      label="Minutos escuchados"
                      value={data.stats.listenedMinutes}
                    />

                    <StatCard
                      icon="fa-user-group"
                      label="Seguidores"
                      value={data.stats.followers}
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
                        title="Playlists públicas"
                        action="Mostrar todo"
                      />

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {data.publicPlaylists.map((playlist) => (
                          <PlaylistCard
                            key={playlist.id}
                            title={playlist.title}
                            subtitle={playlist.subtitle}
                            songs={playlist.songs}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "favoritos" && (
                    <div className="mt-6 space-y-8">
                      <div>
                        <SectionHeader
                          title="Artistas favoritos"
                          action="Actualizar"
                        />

                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                          {data.favoriteArtists.map((artist) => (
                            <ArtistCard key={artist.id} name={artist.name} />
                          ))}
                        </div>
                      </div>

                      <div>
                        <SectionHeader
                          title="Colección destacada"
                          action="Ver más"
                        />

                        <div className="mt-4 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
                          <div className="flex flex-col gap-5 md:flex-row md:items-center">
                            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 ring-1 ring-white/10">
                              <i className="fa-solid fa-heart text-3xl text-white" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-white/60">
                                Playlist especial
                              </p>

                              <h3 className="mt-1 text-2xl font-black">
                                Tus me gusta
                              </h3>

                              <p className="mt-2 text-sm text-white/70">
                                Una colección con las canciones que más te
                                representan, ideal para mantener la estética del
                                perfil y conectar con el diseño general del
                                dashboard.
                              </p>
                            </div>

                            <button
                              onClick={goHome}
                              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black hover:bg-white/90 cursor-pointer"
                            >
                              Abrir colección
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "actividad" && (
                    <div className="mt-6">
                      <SectionHeader
                        title="Actividad reciente"
                        action="Ver historial"
                      />

                      <div className="mt-4 space-y-4">
                        {data.recentActivity.map((item) => (
                          <ActivityCard
                            key={item.id}
                            title={item.title}
                            desc={item.desc}
                            time={item.time}
                            icon={item.icon}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </main>

            <RightPanel currentSong={currentSong} isPlaying={isPlaying} />
          </div>
        </div>

        <EditProfileModal
          open={showEditModal}
          name={profileName}
          initial={profileInitial}
          image={profileImage}
          onClose={() => setShowEditModal(false)}
          onSave={(values) => {
            setProfileName(values.name);
            setProfileInitial(values.initial);
            setProfileImage(values.image);
            setShowEditModal(false);
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

      <button className="text-sm font-semibold text-white/60 hover:text-white/90 cursor-pointer">
        {action}
      </button>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
          <i className={`fa-solid ${icon} text-white/80`} />
        </div>

        <div>
          <p className="text-xs text-white/60">{label}</p>
          <p className="text-lg font-extrabold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PlaylistCard({
  title,
  subtitle,
  songs,
}: {
  title: string;
  subtitle: string;
  songs: number;
}) {
  return (
    <button className="group rounded-2xl bg-white/6 p-3 text-left ring-1 ring-white/10 hover:bg-white/10 cursor-pointer transition">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/10">
        <div className="aspect-square w-full" />

        <div className="absolute bottom-0 left-0 h-2 w-full bg-[#7a0f2b]" />

        <div className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-[#7a0f2b] text-white opacity-0 shadow-lg shadow-black/30 transition group-hover:opacity-100 group-active:scale-95">
          <i className="fa-solid fa-play text-sm" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm font-bold">{title}</div>

        <div className="mt-1 text-xs text-white/60">{subtitle}</div>

        <div className="mt-2 text-xs font-semibold text-white/45">
          {songs} canciones
        </div>
      </div>
    </button>
  );
}

function ArtistCard({ name }: { name: string }) {
  return (
    <button className="group rounded-2xl bg-white/6 p-3 text-center ring-1 ring-white/10 hover:bg-white/10 cursor-pointer transition">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/10">
        <i className="fa-solid fa-microphone-lines text-2xl text-white/70" />
      </div>

      <div className="mt-3 text-sm font-bold">{name}</div>
      <div className="text-xs text-white/60">Artista favorito</div>
    </button>
  );
}

function ActivityCard({
  title,
  desc,
  time,
  icon,
}: {
  title: string;
  desc: string;
  time: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
          <i className={`fa-solid ${icon} text-white/80`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold">{title}</div>

          <div className="mt-1 text-sm text-white/65">{desc}</div>

          <div className="mt-2 text-xs font-semibold text-white/45">{time}</div>
        </div>
      </div>
    </div>
  );
}

function EditProfileModal({
  open,
  name,
  initial,
  image,
  onClose,
  onSave,
}: {
  open: boolean;
  name: string;
  initial: string;
  image: string | null;
  onClose: () => void;
  onSave: (values: {
    name: string;
    initial: string;
    image: string | null;
  }) => void;
}) {
  const [draftName, setDraftName] = useState(name);
  const [draftInitial, setDraftInitial] = useState(initial);
  const [draftImage, setDraftImage] = useState<string | null>(image);

  if (!open) return null;

  const cleanInitial = draftInitial.trim().slice(0, 1).toUpperCase() || "U";
  const cleanName = draftName.trim() || "Usuario";

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraftImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 text-white backdrop-blur-sm">
      <div className="w-full max-w-[560px] overflow-hidden rounded-3xl bg-[#121214] shadow-2xl shadow-black/70 ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-xl font-black">Editar perfil</h2>
            <p className="mt-1 text-xs text-white/50">
              Personaliza tu foto, nombre e inicial dentro de Flowy.
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

        <div className="grid gap-5 p-5 md:grid-cols-[170px_1fr]">
          <div className="flex flex-col items-center">
            <div className="grid h-36 w-36 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#7a0f2b] via-[#2b0a14] to-black ring-1 ring-white/10 shadow-xl shadow-black/40">
              {draftImage ? (
                <img
                  src={draftImage}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-5xl font-black">{cleanInitial}</span>
              )}
            </div>

            <label className="mt-4 w-full cursor-pointer rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-black transition hover:bg-white/90">
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
                onClick={() => setDraftImage(null)}
                className="mt-3 w-full rounded-full bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/15 cursor-pointer"
              >
                Quitar foto
              </button>
            )}

            <p className="mt-3 text-center text-xs leading-relaxed text-white/50">
              Si no subes foto, se mostrará tu inicial.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold">Nombre</label>
              <input
                value={draftName}
                onChange={(e) => {
                  const value = e.target.value;
                  setDraftName(value);

                  if (value.trim().length > 0) {
                    setDraftInitial(value.trim().slice(0, 1).toUpperCase());
                  }
                }}
                placeholder="Tu nombre"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/35 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Inicial</label>
              <input
                value={draftInitial}
                onChange={(e) =>
                  setDraftInitial(e.target.value.slice(0, 1).toUpperCase())
                }
                maxLength={1}
                placeholder="D"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm uppercase outline-none transition placeholder:text-white/35 focus:border-white/30"
              />
            </div>

            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#7a0f2b]/25 ring-1 ring-[#7a0f2b]/40">
                  <i className="fa-solid fa-circle-info text-white/75" />
                </div>

                <p className="text-sm leading-relaxed text-white/60">
                  Puedes subir una foto de perfil. Si la eliminas o no eliges
                  ninguna, Flowy usará automáticamente la inicial de tu nombre.
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
            onClick={() =>
              onSave({
                name: cleanName,
                initial: cleanInitial,
                image: draftImage,
              })
            }
            className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black hover:bg-white/90 cursor-pointer"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
