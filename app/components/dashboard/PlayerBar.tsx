"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clamp, fmtTime } from "@/app/lib/helpers";
import type { Song } from "@/app/types/dashboard";
import { usePlayer } from "@/app/context/PlayerContext";
import AddToPlaylistModal from "@/app/components/player/AddToPlaylistModal";

type PlayerBarProps = {
  isPlaying: boolean;
  onToggle: () => void;
  currentTime: number;
  duration: number;
  onSeek: (sec: number) => void;
  volume: number;
  onVolume: (v: number) => void;
  currentSong: Song | null;
  onNext: () => void;
  onPrev: () => void;
};

export default function PlayerBar({
  isPlaying,
  onToggle,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolume,
  currentSong,
  onNext,
  onPrev,
}: PlayerBarProps) {
  const {
    songs,
    playSong,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    playlists,
    isSongLiked,
    isSongSaved,
    toggleLikeSong,
    toggleSaveSong,
    addSongToPlaylist,
    createPlaylistAndAddSong,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [toast, setToast] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [likedPulse, setLikedPulse] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);

  const songTitle = currentSong?.title ?? "Selecciona una canción";
  const songArtist = currentSong?.artist ?? "Flowy";
  const hasSong = Boolean(currentSong);

  const liked = currentSong ? isSongLiked(currentSong.id) : false;
  const saved = currentSong ? isSongSaved(currentSong.id) : false;

  const queueSongs = useMemo(() => {
    if (!currentSong) return songs.slice(0, 6);

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);

    if (currentIndex === -1) {
      return songs.filter((song) => song.id !== currentSong.id).slice(0, 6);
    }

    const after = songs.slice(currentIndex + 1);
    const before = songs.slice(0, currentIndex);

    return [...after, ...before].slice(0, 6);
  }, [songs, currentSong]);

  function showMessage(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 1800);
  }

  function toggleLike() {
    if (!currentSong) {
      showMessage("Primero selecciona una canción.");
      return;
    }

    const wasLiked = isSongLiked(currentSong.id);

    toggleLikeSong(currentSong.id);

    setLikedPulse(false);

    window.requestAnimationFrame(() => {
      setLikedPulse(true);

      window.setTimeout(() => {
        setLikedPulse(false);
      }, 260);
    });

    showMessage(wasLiked ? "Quitado de favoritos." : "Agregado a favoritos.");
  }

  function toggleSaved() {
    if (!currentSong) {
      showMessage("Primero selecciona una canción.");
      return;
    }

    const wasSaved = isSongSaved(currentSong.id);

    toggleSaveSong(currentSong.id);

    setSavedPulse(false);

    window.requestAnimationFrame(() => {
      setSavedPulse(true);

      window.setTimeout(() => {
        setSavedPulse(false);
      }, 260);
    });

    showMessage(
      wasSaved ? "Quitado de tu biblioteca." : "Guardado en tu biblioteca.",
    );
  }

  function toggleQueue() {
    setShowQueue((prev) => !prev);
    setShowLyrics(false);
    setShowDevices(false);
  }

  function toggleLyrics() {
    setShowLyrics((prev) => !prev);
    setShowQueue(false);
    setShowDevices(false);
  }

  function toggleDevices() {
    setShowDevices((prev) => !prev);
    setShowQueue(false);
    setShowLyrics(false);
  }

  function handleShuffle() {
    toggleShuffle();
    showMessage(!shuffle ? "Aleatorio activado." : "Aleatorio desactivado.");
  }

  function handleRepeat() {
    toggleRepeat();
    showMessage(!repeat ? "Repetición activada." : "Repetición desactivada.");
  }

  return (
    <>
      <PlayerToast message={toast} />
      <AddToPlaylistModal
        open={showAddModal}
        song={currentSong}
        playlists={playlists}
        onClose={() => setShowAddModal(false)}
        onSelectPlaylist={(playlistId) => {
          if (!currentSong) return;

          addSongToPlaylist(currentSong, playlistId);
          setShowAddModal(false);
          showMessage("Canción agregada a la playlist.");
        }}
        onCreatePlaylist={(title) => {
          if (!currentSong) return;

          createPlaylistAndAddSong(currentSong, title);
          setShowAddModal(false);
          showMessage("Playlist creada y canción agregada.");
        }}
      />

      {showQueue && (
        <FloatingPanel
          title="Cola de reproducción"
          onClose={() => setShowQueue(false)}
        >
          <div className="rounded-2xl bg-white/6 p-3 ring-1 ring-white/10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Reproduciendo ahora
            </p>

            <QueueSongRow
              song={currentSong}
              active
              isPlaying={isPlaying}
              onClick={() => {
                if (currentSong) playSong(currentSong, songs);
              }}
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Siguiente
            </p>

            <div className="space-y-2">
              {queueSongs.length > 0 ? (
                queueSongs.map((song) => (
                  <QueueSongRow
                    key={song.id}
                    song={song}
                    onClick={() => playSong(song, songs)}
                  />
                ))
              ) : (
                <div className="rounded-2xl bg-white/5 p-4 text-center text-sm text-white/50">
                  No hay canciones en la cola.
                </div>
              )}
            </div>
          </div>
        </FloatingPanel>
      )}

      {showLyrics && (
        <FloatingPanel title="Letra" onClose={() => setShowLyrics(false)}>
          <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              {songTitle}
            </p>

            <div className="mt-4 space-y-3 text-lg font-black leading-relaxed text-white/85">
              <p>♪ Sigue el ritmo de la canción</p>
              <p>♪ Disfruta cada verso mientras escuchas</p>
              <p>♪ La música se siente mejor en Flowy</p>
              <p>♪ Guarda tus canciones favoritas</p>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-white/50">
              Letras disponibles próximamente para tus canciones favoritas.
            </p>
          </div>
        </FloatingPanel>
      )}

      {showDevices && (
        <FloatingPanel
          title="Dispositivos"
          onClose={() => setShowDevices(false)}
        >
          <div className="space-y-3">
            <DeviceRow
              icon="fa-laptop"
              title="Este navegador"
              subtitle="Reproduciendo en Mac"
              active
            />
            <DeviceRow
              icon="fa-mobile-screen"
              title="iPhone"
              subtitle="Disponible visualmente"
            />
            <DeviceRow icon="fa-tv" title="Smart TV" subtitle="No conectado" />
          </div>
        </FloatingPanel>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0b0b0c]/95 text-white backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="md:hidden px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#7a0f2b] to-black ring-1 ring-white/10">
              {currentSong?.cover ? (
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <i className="fa-solid fa-music text-white/60" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">{songTitle}</div>
              <div className="truncate text-xs text-white/60">{songArtist}</div>
            </div>

            <AnimatedIconButton
              onClick={toggleLike}
              disabled={!hasSong}
              active={liked}
              pulse={likedPulse}
              icon="fa-solid fa-heart"
              ariaLabel={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
              className="ml-2"
            />

            <button
              onClick={onToggle}
              className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-black hover:bg-white/90 cursor-pointer active:scale-95 transition"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              <PlayPauseIcon isPlaying={isPlaying} />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-[11px] text-white/50 w-10 text-left">
              {fmtTime(currentTime)}
            </span>

            <ScrubBar
              value={currentTime}
              max={duration}
              onChange={onSeek}
              accent="bg-[#7a0f2b]"
            />

            <span className="text-[11px] text-white/50 w-10 text-right">
              {fmtTime(duration)}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-[1] items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#7a0f2b] to-black ring-1 ring-white/10">
              {currentSong?.cover ? (
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_40%)]" />
                  <div className="absolute inset-0 grid place-items-center">
                    <i className="fa-solid fa-music text-white/60" />
                  </div>
                </>
              )}
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{songTitle}</div>
              <div className="truncate text-xs text-white/60">{songArtist}</div>
            </div>

            <AnimatedIconButton
              onClick={toggleLike}
              disabled={!hasSong}
              active={liked}
              pulse={likedPulse}
              icon="fa-solid fa-heart"
              ariaLabel="Me gusta"
              className="ml-2"
            />

            <AnimatedIconButton
              onClick={toggleSaved}
              disabled={!hasSong}
              active={saved}
              pulse={savedPulse}
              icon={`fa-solid ${saved ? "fa-check" : "fa-plus"}`}
              ariaLabel="Agregar a biblioteca"
            />
          </div>

          <div className="flex min-w-0 flex-[2] flex-col items-center">
            <div className="flex items-center gap-4">
              <PlayerIcon
                icon="fa-shuffle"
                active={shuffle}
                onClick={handleShuffle}
              />

              <PlayerIcon icon="fa-backward-step" onClick={onPrev} />

              <button
                onClick={onToggle}
                className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-black hover:bg-white/90 cursor-pointer active:scale-95 transition"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                <PlayPauseIcon isPlaying={isPlaying} />
              </button>

              <PlayerIcon icon="fa-forward-step" onClick={onNext} />

              <PlayerIcon
                icon="fa-repeat"
                active={repeat}
                onClick={handleRepeat}
              />
            </div>

            <div className="mt-2 flex w-full max-w-[560px] items-center gap-3">
              <span className="text-xs text-white/50">
                {fmtTime(currentTime)}
              </span>

              <ScrubBar
                value={currentTime}
                max={duration}
                onChange={onSeek}
                accent="bg-[#7a0f2b]"
              />

              <span className="text-xs text-white/50">{fmtTime(duration)}</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-[1] items-center justify-end gap-2">
            <PlayerIcon
              icon="fa-microphone"
              active={showLyrics}
              onClick={toggleLyrics}
            />

            <PlayerIcon
              icon="fa-list"
              active={showQueue}
              onClick={toggleQueue}
            />

            <PlayerIcon
              icon="fa-desktop"
              active={showDevices}
              onClick={toggleDevices}
            />

            <div className="ml-2 flex items-center gap-2">
              <button
                onClick={() => onVolume(volume > 0 ? 0 : 0.72)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 cursor-pointer"
                aria-label="Silenciar"
              >
                <i
                  className={[
                    "fa-solid text-white/70",
                    volume <= 0 ? "fa-volume-xmark" : "fa-volume-high",
                  ].join(" ")}
                />
              </button>

              <div className="w-28">
                <ScrubBar
                  value={volume}
                  max={1}
                  onChange={onVolume}
                  accent="bg-white/70"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-gradient-to-r from-[#7a0f2b] via-[#a01237] to-[#2b0a14]" />
      </footer>
    </>
  );
}

function PlayPauseIcon({ isPlaying }: { isPlaying: boolean }) {
  return (
    <>
      <span
        className={[
          "absolute inset-0 grid place-items-center transition-all duration-200",
          isPlaying
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75 pointer-events-none",
        ].join(" ")}
      >
        <i className="fa-solid fa-pause" />
      </span>

      <span
        className={[
          "absolute inset-0 grid place-items-center transition-all duration-200",
          !isPlaying
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75 pointer-events-none",
        ].join(" ")}
      >
        <i className="fa-solid fa-play" />
      </span>
    </>
  );
}

function PlayerToast({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-[105px] left-1/2 z-[90] -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black shadow-2xl shadow-black/50">
      {message}
    </div>
  );
}

function FloatingPanel({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-[96px] right-4 z-[60] hidden max-h-[70vh] w-[380px] overflow-y-auto rounded-3xl bg-[#121214] p-4 text-white shadow-2xl shadow-black/60 ring-1 ring-white/10 md:block">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#121214] pb-3">
        <h3 className="text-base font-extrabold">{title}</h3>

        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 cursor-pointer"
          aria-label="Cerrar panel"
        >
          <i className="fa-solid fa-xmark text-white/70" />
        </button>
      </div>

      {children}
    </div>
  );
}

function QueueSongRow({
  song,
  active,
  isPlaying,
  onClick,
}: {
  song: Song | null;
  active?: boolean;
  isPlaying?: boolean;
  onClick?: () => void;
}) {
  if (!song) {
    return (
      <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/50">
        No hay canción seleccionada.
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition cursor-pointer",
        active ? "bg-white/8" : "hover:bg-white/8",
      ].join(" ")}
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#7a0f2b]/45 to-black ring-1 ring-white/10">
        <i className="fa-solid fa-music text-white/70" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{song.title}</div>
        <div className="truncate text-xs text-white/50">{song.artist}</div>
      </div>

      {active && isPlaying ? (
        <i className="fa-solid fa-volume-high text-[#a01237]" />
      ) : (
        <span className="text-xs text-white/40">{fmtTime(song.duration)}</span>
      )}
    </button>
  );
}

function DeviceRow({
  icon,
  title,
  subtitle,
  active,
}: {
  icon: string;
  title: string;
  subtitle: string;
  active?: boolean;
}) {
  return (
    <button
      className={[
        "flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-1 transition cursor-pointer",
        active
          ? "bg-[#7a0f2b]/20 ring-[#7a0f2b]/50"
          : "bg-white/5 ring-white/10 hover:bg-white/8",
      ].join(" ")}
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
        <i className={`fa-solid ${icon} text-white/75`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{title}</div>
        <div className="truncate text-xs text-white/50">{subtitle}</div>
      </div>

      {active && <i className="fa-solid fa-check text-[#a01237]" />}
    </button>
  );
}

function PlayerIcon({
  icon,
  onClick,
  active,
}: {
  icon: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative grid h-9 w-9 place-items-center rounded-full transition-all duration-200",
        "cursor-pointer hover:bg-white/10 active:scale-90",
        active
          ? "bg-[#7a0f2b]/20 text-[#ff3b6b] shadow-[0_0_16px_rgba(160,18,55,0.28)]"
          : "text-white/70 hover:text-white",
      ].join(" ")}
    >
      <i className={`fa-solid ${icon} transition-transform duration-200`} />

      {active && (
        <>
          <span className="absolute bottom-0 h-1 w-1 rounded-full bg-[#ff3b6b]" />
          <span className="absolute inset-0 rounded-full bg-[#a01237]/10 blur-md" />
        </>
      )}
    </button>
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
        "relative grid h-9 w-9 place-items-center rounded-full ring-1 transition-all duration-200",
        "cursor-pointer active:scale-90 disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-[#7a0f2b]/30 text-[#ff3b6b] ring-[#7a0f2b]/60 shadow-[0_0_18px_rgba(160,18,55,0.35)]"
          : "bg-transparent text-white/70 ring-transparent hover:bg-white/10 hover:text-white",
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
          active ? "text-[#ff3b6b]" : "text-white/70",
          pulse ? "scale-125" : "scale-100",
        ].join(" ")}
      />

      {pulse && (
        <span className="absolute h-11 w-11 animate-ping rounded-full bg-[#a01237]/25" />
      )}
    </button>
  );
}

function ScrubBar({
  value,
  max,
  onChange,
  accent,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const pct = max === 0 ? 0 : clamp(value / max, 0, 1);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const p = clamp((clientX - r.left) / r.width, 0, 1);

    onChange(p * max);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      setFromClientX(e.clientX);
    };

    const onUp = () => setDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;

      const t = e.touches?.[0];
      if (!t) return;

      setFromClientX(t.clientX);
    };

    const onTouchEnd = () => setDragging(false);

    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging]);

  return (
    <div
      ref={ref}
      onMouseDown={(e) => {
        setDragging(true);
        setFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        const t = e.touches?.[0];
        if (!t) return;

        setDragging(true);
        setFromClientX(t.clientX);
      }}
      className={[
        "group relative h-1 flex-1 overflow-hidden rounded-full bg-white/15",
        "cursor-pointer select-none",
        dragging ? "ring-2 ring-white/20" : "",
      ].join(" ")}
      title="Arrastra para cambiar"
    >
      <div
        className={[
          "h-full rounded-full transition-[width] duration-150",
          accent,
        ].join(" ")}
        style={{ width: `${pct * 100}%` }}
      />

      <div
        className={[
          "absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow",
          "opacity-0 transition",
          dragging ? "opacity-100" : "group-hover:opacity-100",
        ].join(" ")}
        style={{ left: `calc(${pct * 100}% - 6px)` }}
      />
    </div>
  );
}
