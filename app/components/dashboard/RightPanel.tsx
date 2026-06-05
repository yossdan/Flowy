"use client";

import { useEffect, useMemo, useState } from "react";
import { fmtTime } from "@/app/lib/helpers";
import type { Song } from "@/app/types/dashboard";
import { usePlayer } from "@/app/context/PlayerContext";
import AddToPlaylistModal from "@/app/components/player/AddToPlaylistModal";

type RightPanelProps = {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
};

export default function RightPanel({
  currentSong,
  isPlaying,
  duration,
}: RightPanelProps) {
  const {
    songs,
    playSong,
    playlists,
    isSongLiked,
    isSongSaved,
    toggleLikeSong,
    toggleSaveSong,
    addSongToPlaylist,
    createPlaylistAndAddSong,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [showRadio, setShowRadio] = useState(false);
  const [toast, setToast] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [dominantColor, setDominantColor] = useState("122 15 43");
  const [likedPulse, setLikedPulse] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);

  const isLiked = currentSong ? isSongLiked(currentSong.id) : false;
  const isSaved = currentSong ? isSongSaved(currentSong.id) : false;

  const queueSongs = useMemo(() => {
    if (!currentSong) return songs.slice(0, 5);
    return songs.filter((song) => song.id !== currentSong.id).slice(0, 5);
  }, [songs, currentSong]);

  const radioSongs = useMemo(() => {
    if (!currentSong) return songs.slice(0, 6);

    const sameArtist = songs.filter(
      (song) =>
        song.artist.toLowerCase() === currentSong.artist.toLowerCase() &&
        song.id !== currentSong.id,
    );

    const sameAlbum = songs.filter(
      (song) =>
        song.album.toLowerCase() === currentSong.album.toLowerCase() &&
        song.id !== currentSong.id,
    );

    const mixed = [...sameArtist, ...sameAlbum, ...songs].filter(
      (song, index, array) =>
        song.id !== currentSong.id &&
        array.findIndex((item) => item.id === song.id) === index,
    );

    return mixed.slice(0, 6);
  }, [songs, currentSong]);

  useEffect(() => {
    if (!currentSong?.cover) {
      setDominantColor("122 15 43");
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = currentSong.cover;

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          setDominantColor("122 15 43");
          return;
        }

        canvas.width = 32;
        canvas.height = 32;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const { data } = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          const alpha = data[i + 3];

          if (alpha < 180) continue;

          const brightness = red + green + blue;

          if (brightness < 45) continue;
          if (brightness > 720) continue;

          r += red;
          g += green;
          b += blue;
          count++;
        }

        if (count === 0) {
          setDominantColor("122 15 43");
          return;
        }

        setDominantColor(
          `${Math.round(r / count)} ${Math.round(g / count)} ${Math.round(
            b / count,
          )}`,
        );
      } catch {
        setDominantColor("122 15 43");
      }
    };

    image.onerror = () => {
      setDominantColor("122 15 43");
    };
  }, [currentSong?.id, currentSong?.cover]);
  function showMessage(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2200);
  }

  function toggleLike() {
    if (!currentSong) {
      showMessage("Primero selecciona una canción.");
      return;
    }

    const wasLiked = isSongLiked(currentSong.id);

    setLikedPulse(false);

    window.requestAnimationFrame(() => {
      setLikedPulse(true);

      window.setTimeout(() => {
        setLikedPulse(false);
      }, 320);
    });

    toggleLikeSong(currentSong.id);

    showMessage(
      wasLiked ? "Quitado de tus favoritos." : "Agregado a tus favoritos.",
    );
  }

  function toggleSaved() {
    if (!currentSong) {
      showMessage("Primero selecciona una canción.");
      return;
    }

    const wasSaved = isSongSaved(currentSong.id);

    toggleSaveSong(currentSong.id);

    showMessage(
      wasSaved ? "Quitado de tu biblioteca." : "Guardado en tu biblioteca.",
    );
  }

  async function shareSong() {
    if (!currentSong) {
      showMessage("Primero selecciona una canción.");
      return;
    }

    const text = `Estoy escuchando "${currentSong.title}" de ${currentSong.artist} en Flowy.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: currentSong.title,
          text,
        });

        showMessage("Canción compartida.");
        return;
      }

      await navigator.clipboard.writeText(text);
      showMessage("Texto copiado al portapapeles.");
    } catch {
      showMessage("No se pudo compartir.");
    }
  }

  function openQueue() {
    setShowQueue((prev) => !prev);
    setShowRadio(false);
  }

  function openRadio() {
    setShowRadio((prev) => !prev);
    setShowQueue(false);
  }

  if (!currentSong) {
    return (
      <aside className="relative hidden w-[380px] shrink-0 rounded-3xl bg-[#0b0b0c] p-4 ring-1 ring-white/10 lg:block">
        <PanelToast message={toast} />

        <div className="flex items-center justify-between">
          <div className="text-sm font-bold">Reproduciendo ahora</div>

          <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 cursor-pointer">
            <i className="fa-solid fa-ellipsis text-white/70" />
          </button>
        </div>

        <div className="mt-8 rounded-3xl bg-white/5 p-6 text-center ring-1 ring-white/10">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#7a0f2b]/25 ring-1 ring-[#7a0f2b]/40">
            <i className="fa-solid fa-music text-3xl text-white/70" />
          </div>

          <h3 className="mt-5 text-xl font-extrabold">Nada reproduciéndose</h3>

          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Selecciona una canción para ver aquí los detalles, el álbum y más
            opciones de reproducción.
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-sm font-extrabold">Sugerencia</div>

          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Abre “Tus me gusta” o una playlist desde la biblioteca para empezar.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <>
      <AddToPlaylistModal
        open={showAddModal}
        song={currentSong}
        playlists={playlists}
        onClose={() => setShowAddModal(false)}
        onSelectPlaylist={(playlistId) => {
          if (!currentSong) return;

          addSongToPlaylist(currentSong, playlistId);
          setShowAddModal(false);

          setSavedPulse(false);

          window.requestAnimationFrame(() => {
            setSavedPulse(true);

            window.setTimeout(() => {
              setSavedPulse(false);
            }, 320);
          });

          showMessage("Canción agregada a la playlist.");
        }}
        onCreatePlaylist={(title) => {
          if (!currentSong) return;

          createPlaylistAndAddSong(currentSong, title);
          setShowAddModal(false);

          setSavedPulse(false);

          window.requestAnimationFrame(() => {
            setSavedPulse(true);

            window.setTimeout(() => {
              setSavedPulse(false);
            }, 320);
          });

          showMessage("Playlist creada y canción agregada.");
        }}
      />

      <aside
        className="relative hidden w-[380px] shrink-0 rounded-3xl p-4 ring-1 ring-white/10 lg:block transition-colors duration-700"
        style={{
          background: `linear-gradient(180deg, rgb(${dominantColor} / 0.22), #0b0b0c 42%, #0b0b0c 100%)`,
        }}
      >
        <PanelToast message={toast} />

        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">
              Reproduciendo ahora
            </div>
            <div className="mt-1 text-xs text-white/45">
              {isPlaying ? "En reproducción" : "Pausado"}
            </div>
          </div>

          <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 cursor-pointer">
            <i className="fa-solid fa-ellipsis text-white/70" />
          </button>
        </div>

        <div
          className="mt-4 overflow-hidden rounded-3xl ring-1 ring-white/10 transition-all duration-700"
          style={{
            background: `linear-gradient(135deg, rgb(${dominantColor} / 0.38), rgb(0 0 0 / 0.88))`,
          }}
        >
          <div className="relative aspect-square w-full overflow-hidden">
            <div
              className="absolute -inset-16 blur-3xl transition-colors duration-700"
              style={{
                backgroundColor: `rgb(${dominantColor} / 0.72)`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-black/5 to-black/55" />

            {currentSong.cover ? (
              <div className="absolute inset-0 grid place-items-center p-8">
                <div
                  className="absolute inset-0 opacity-45 blur-2xl transition-colors duration-700"
                  style={{
                    backgroundColor: `rgb(${dominantColor} / 0.65)`,
                  }}
                />

                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="relative h-full w-full rounded-3xl object-cover shadow-2xl shadow-black/60 ring-1 ring-white/15 transition-all duration-700"
                />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%)]" />

                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-28 w-28 place-items-center rounded-full bg-black/25 ring-1 ring-white/10 backdrop-blur">
                    <i className="fa-solid fa-music text-5xl text-white/80" />
                  </div>
                </div>
              </>
            )}

            {isPlaying && (
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-bold text-white ring-1 ring-white/10 backdrop-blur">
                <span
                  className="h-2 w-2 rounded-full transition-colors duration-700"
                  style={{
                    backgroundColor: `rgb(${dominantColor})`,
                  }}
                />
                Sonando
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-3xl font-extrabold leading-tight">
                {currentSong.title}
              </h2>

              <p className="mt-1 truncate text-sm text-white/60">
                {currentSong.artist}
              </p>
            </div>

            <AnimatedIconButton
              onClick={toggleLike}
              active={isLiked}
              pulse={likedPulse}
              icon="fa-solid fa-heart"
              ariaLabel="Me gusta"
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <InfoCard
              icon="fa-compact-disc"
              label="Álbum"
              value={currentSong.album}
            />

            <InfoCard
              icon="fa-clock"
              label="Duración"
              value={fmtTime(duration || currentSong.duration)}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">Acciones rápidas</div>

            <button
              onClick={() => showMessage("Opciones rápidas disponibles.")}
              className="text-xs font-bold text-white/45 hover:text-white cursor-pointer"
            >
              Ver más
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <QuickAction
              icon={isSaved ? "fa-check" : "fa-plus"}
              title={isSaved ? "Agregado" : "Agregar"}
              active={isSaved}
              onClick={toggleSaved}
            />

            <QuickAction
              icon="fa-share-nodes"
              title="Compartir"
              onClick={shareSong}
            />

            <QuickAction
              icon="fa-list"
              title="Cola"
              active={showQueue}
              onClick={openQueue}
            />

            <QuickAction
              icon="fa-radio"
              title="Radio"
              active={showRadio}
              onClick={openRadio}
            />
          </div>
        </div>

        {showQueue && (
          <DynamicList
            title="Cola de reproducción"
            subtitle="Siguientes canciones"
            songs={queueSongs}
            emptyText="No hay más canciones en cola."
            onSongClick={(song) => playSong(song, songs)}
          />
        )}

        {showRadio && (
          <DynamicList
            title="Radio de la canción"
            subtitle={`Basado en ${currentSong.artist}`}
            songs={radioSongs}
            emptyText="No encontramos canciones relacionadas."
            onSongClick={(song) => playSong(song, radioSongs)}
          />
        )}

        {!showQueue && !showRadio && (
          <div className="mt-8">
            <div className="text-sm font-extrabold">Contenido relacionado</div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {[currentSong.artist, currentSong.album].map((item) => (
                <button
                  key={item}
                  onClick={openRadio}
                  className="rounded-2xl bg-white/5 p-3 text-left ring-1 ring-white/10 hover:bg-white/8 cursor-pointer"
                >
                  <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-white/10 to-white/0 ring-1 ring-white/10" />

                  <div className="mt-3 truncate text-sm font-bold">{item}</div>

                  <div className="text-xs text-white/60">
                    Recomendado para ti
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function PanelToast({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="absolute left-4 right-4 top-4 z-20 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black shadow-xl shadow-black/40">
      {message}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-xs text-white/45">
        <i className={`fa-solid ${icon}`} />
        <span>{label}</span>
      </div>

      <div className="mt-2 truncate text-sm font-bold text-white/85">
        {value}
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  active,
  pulse,
  onClick,
}: {
  icon: string;
  title: string;
  active?: boolean;
  pulse?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative overflow-hidden rounded-2xl p-3 text-left ring-1 transition-all duration-200 cursor-pointer active:scale-95",
        active
          ? "bg-[#7a0f2b]/20 text-white ring-[#7a0f2b]/50 shadow-[0_0_18px_rgba(160,18,55,0.22)]"
          : "bg-white/5 text-white ring-white/10 hover:bg-white/10",
        pulse ? "scale-[1.04]" : "scale-100",
      ].join(" ")}
    >
      {active && <span className="absolute inset-0 bg-[#a01237]/10 blur-xl" />}

      {pulse && (
        <span className="absolute left-5 top-5 h-10 w-10 animate-ping rounded-full bg-[#a01237]/25" />
      )}

      <div
        className={[
          "relative z-10 grid h-10 w-10 place-items-center rounded-xl ring-1 transition-all duration-200",
          active
            ? "bg-[#7a0f2b]/45 text-[#ff3b6b] ring-[#7a0f2b]/70"
            : "bg-[#7a0f2b]/25 text-white/80 ring-[#7a0f2b]/40",
          pulse ? "scale-125 rotate-[-8deg]" : "scale-100 rotate-0",
        ].join(" ")}
      >
        <i className={`fa-solid ${icon} transition-transform duration-200`} />
      </div>

      <div className="relative z-10 mt-3 text-sm font-bold">{title}</div>
    </button>
  );
}

function DynamicList({
  title,
  subtitle,
  songs,
  emptyText,
  onSongClick,
}: {
  title: string;
  subtitle: string;
  songs: Song[];
  emptyText: string;
  onSongClick: (song: Song) => void;
}) {
  return (
    <div className="mt-8 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold">{title}</div>
          <div className="mt-1 text-xs text-white/45">{subtitle}</div>
        </div>

        <i className="fa-solid fa-music text-white/35" />
      </div>

      <div className="mt-4 space-y-2">
        {songs.length > 0 ? (
          songs.map((song) => (
            <button
              key={song.id}
              onClick={() => onSongClick(song)}
              className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-white/10 cursor-pointer"
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#7a0f2b]/35 to-black ring-1 ring-white/10">
                {song.cover ? (
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <i className="fa-solid fa-music text-xs text-white/70" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{song.title}</div>
                <div className="truncate text-xs text-white/50">
                  {song.artist}
                </div>
              </div>

              <span className="text-xs text-white/40">
                {fmtTime(song.duration)}
              </span>
            </button>
          ))
        ) : (
          <div className="rounded-2xl bg-white/5 p-4 text-center text-sm text-white/50">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}

function AnimatedIconButton({
  icon,
  active,
  pulse,
  disabled,
  onClick,
  ariaLabel,
  className = "",
}: {
  icon: string;
  active?: boolean;
  pulse?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={[
        "relative grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 transition-all duration-200",
        "cursor-pointer active:scale-90 disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-[#7a0f2b]/25 text-[#ff3b6b] ring-[#7a0f2b]/50 shadow-[0_0_18px_rgba(160,18,55,0.35)]"
          : "bg-white/10 text-white/75 ring-white/10 hover:bg-white/15 hover:text-white",
        pulse ? "scale-125 rotate-[-8deg]" : "scale-100 rotate-0",
        className,
      ].join(" ")}
    >
      {active && (
        <span className="absolute inset-0 rounded-full bg-[#a01237]/20 blur-md" />
      )}

      <i
        className={[
          icon,
          "relative z-10 transition-all duration-200",
          pulse ? "scale-125" : "scale-100",
        ].join(" ")}
      />

      {pulse && (
        <span className="absolute h-12 w-12 animate-ping rounded-full bg-[#a01237]/25" />
      )}
    </button>
  );
}
