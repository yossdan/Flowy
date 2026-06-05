"use client";

import { useEffect, useMemo, useState } from "react";
import { fmtTime } from "@/app/lib/helpers";
import type { Song } from "@/app/types/dashboard";
import {
  getArtistDetailsRequest,
  type ArtistAlbum,
  type ArtistDetail,
} from "@/app/services/artist.service";

type ArtistProfileProps = {
  artistId: string;
  artistName: string;
  onBack: () => void;
  playSong: (song: Song, queue?: Song[]) => void;
};

function getAudioMetadataDuration(audioUrl?: string | null): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !audioUrl) {
      resolve(0);
      return;
    }

    const audio = new Audio();

    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audio.src = audioUrl;

    const cleanup = () => {
      audio.onloadedmetadata = null;
      audio.onerror = null;
      audio.removeAttribute("src");
      audio.load();
    };

    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      cleanup();

      resolve(
        Number.isFinite(duration) && duration > 0 ? Math.round(duration) : 0,
      );
    };

    audio.onerror = () => {
      cleanup();
      resolve(0);
    };
  });
}

function enrichSongDurations(songs: Song[]) {
  return Promise.all(
    songs.map(async (song) => {
      if (song.duration && song.duration > 0) return song;

      const duration = await getAudioMetadataDuration(song.audioUrl);

      return {
        ...song,
        duration,
      };
    }),
  );
}

function mergeSongsById(songs: Song[]) {
  return songs.filter(
    (song, index, array) =>
      array.findIndex((item) => item.id === song.id) === index,
  );
}

export default function ArtistProfile({
  artistId,
  artistName,
  onBack,
  playSong,
}: ArtistProfileProps) {
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDurations, setLoadingDurations] = useState(false);
  const [error, setError] = useState("");
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<"popular" | "albums" | "about">(
    "popular",
  );

  useEffect(() => {
    let cancelled = false;

    async function loadArtist() {
      try {
        setLoading(true);
        setError("");

        const response = await getArtistDetailsRequest(artistId);

        if (cancelled) return;

        const allSongs = mergeSongsById([
          ...response.songs,
          ...response.albums.flatMap((album) => album.songs),
        ]);

        const nextArtist: ArtistDetail = {
          ...response,
          name: response.name || artistName,
          songs: allSongs,
        };

        setArtist(nextArtist);

        const songsNeedDuration = allSongs.some(
          (song) => !song.duration || song.duration <= 0,
        );

        if (!songsNeedDuration) return;

        setLoadingDurations(true);

        const songsWithDuration = await enrichSongDurations(allSongs);

        if (cancelled) return;

        const durationMap = new Map(
          songsWithDuration.map((song) => [song.id, song.duration]),
        );

        setArtist({
          ...nextArtist,
          songs: songsWithDuration,
          albums: nextArtist.albums.map((album) => ({
            ...album,
            songs: album.songs.map((song) => ({
              ...song,
              duration: durationMap.get(song.id) ?? song.duration,
            })),
          })),
        });
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el perfil del artista.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingDurations(false);
        }
      }
    }

    loadArtist();

    return () => {
      cancelled = true;
    };
  }, [artistId, artistName]);

  const songs = artist?.songs ?? [];
  const albums = artist?.albums ?? [];

  const totalDuration = useMemo(() => {
    return songs.reduce((total, song) => total + (song.duration || 0), 0);
  }, [songs]);

  const popularSongs = useMemo(() => {
    return songs.slice(0, 8);
  }, [songs]);

  const heroCover = useMemo(() => {
    return (
      artist?.photo ??
      albums.find((album) => album.cover)?.cover ??
      songs.find((song) => song.cover)?.cover ??
      null
    );
  }, [artist?.photo, songs, albums]);

  const initials = useMemo(() => {
    const name = artist?.name || artistName || "A";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [artist?.name, artistName]);

  const playAll = () => {
    const firstSong = songs[0];
    if (!firstSong) return;
    playSong(firstSong, songs);
  };

  if (loading) {
    return <ArtistProfileSkeleton onBack={onBack} artistName={artistName} />;
  }

  if (error) {
    return (
      <div className="animate-fadeUp">
        <button
          type="button"
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/15 cursor-pointer"
          aria-label="Volver"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        <div className="mt-5 rounded-3xl bg-red-500/10 p-8 text-center ring-1 ring-red-500/20">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/15 text-red-200 ring-1 ring-red-500/25">
            <i className="fa-solid fa-triangle-exclamation text-2xl" />
          </div>
          <h2 className="mt-4 text-2xl font-black">
            No se pudo cargar el artista
          </h2>
          <p className="mt-2 text-sm text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!artist) return null;

  return (
    <div className="animate-fadeUp space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#121214] ring-1 ring-white/10">
        <div className="absolute inset-0">
          {heroCover ? (
            <img
              src={heroCover}
              alt={artist.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(122,15,43,0.55),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_38%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-[#121214]/70 to-[#121214]" />
        </div>

        <div className="relative p-5 sm:p-7">
          <button
            type="button"
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white ring-1 ring-white/10 backdrop-blur hover:bg-white/10 cursor-pointer"
            aria-label="Volver"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end">
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#7a0f2b] via-[#211015] to-black shadow-2xl shadow-black/50 ring-1 ring-white/15 sm:h-52 sm:w-52">
              {heroCover ? (
                <img
                  src={heroCover}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-5xl font-black text-white/85">
                  {initials || "A"}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pb-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/60 ring-1 ring-white/10">
                <i className="fa-solid fa-circle-check text-[#ff3b6b]" />
                Artista
              </div>

              <h1 className="mt-4 truncate text-5xl font-black tracking-tight sm:text-7xl">
                {artist.name}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
                Perfil musical dentro de Flowy. Explora canciones populares,
                álbumes publicados y reproduce su catálogo completo.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/65">
                <span className="font-bold text-white">
                  {songs.length} canciones
                </span>
                <span>•</span>
                <span>{albums.length} álbumes</span>
                <span>•</span>
                <span>
                  {totalDuration > 0
                    ? fmtTime(totalDuration)
                    : "Duración calculándose"}
                </span>
                {loadingDurations && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-2 text-white/45">
                      <i className="fa-solid fa-spinner animate-spin" />{" "}
                      Cargando duraciones
                    </span>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={songs.length === 0}
                  onClick={playAll}
                  className={[
                    "inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-black transition active:scale-95",
                    songs.length > 0
                      ? "bg-[#7a0f2b] text-white shadow-lg shadow-[#7a0f2b]/25 hover:brightness-110 cursor-pointer"
                      : "cursor-not-allowed bg-white/20 text-white/35",
                  ].join(" ")}
                >
                  <i className="fa-solid fa-play text-xs" />
                  Reproducir
                </button>

                <button
                  type="button"
                  onClick={() => setFollowed((prev) => !prev)}
                  className={[
                    "inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-black ring-1 transition active:scale-95 cursor-pointer",
                    followed
                      ? "bg-white text-black ring-white"
                      : "bg-white/10 text-white ring-white/10 hover:bg-white/15",
                  ].join(" ")}
                >
                  <i
                    className={`fa-solid ${followed ? "fa-check" : "fa-plus"} text-xs`}
                  />
                  {followed ? "Siguiendo" : "Seguir"}
                </button>

                <button
                  type="button"
                  className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15 cursor-pointer active:scale-95"
                  aria-label="Más opciones"
                >
                  <i className="fa-solid fa-ellipsis" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <ArtistStatCard
          icon="fa-music"
          label="Canciones"
          value={String(songs.length)}
        />
        <ArtistStatCard
          icon="fa-compact-disc"
          label="Álbumes"
          value={String(albums.length)}
        />
        <ArtistStatCard
          icon="fa-clock"
          label="Duración total"
          value={totalDuration > 0 ? fmtTime(totalDuration) : "--:--"}
        />
      </section>

      <div className="flex flex-wrap gap-2">
        <ArtistTabButton
          active={activeTab === "popular"}
          onClick={() => setActiveTab("popular")}
        >
          Populares
        </ArtistTabButton>
        <ArtistTabButton
          active={activeTab === "albums"}
          onClick={() => setActiveTab("albums")}
        >
          Álbumes
        </ArtistTabButton>
        <ArtistTabButton
          active={activeTab === "about"}
          onClick={() => setActiveTab("about")}
        >
          Información
        </ArtistTabButton>
      </div>

      {activeTab === "popular" && (
        <section className="rounded-[2rem] bg-white/5 p-4 ring-1 ring-white/10 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Canciones populares</h2>
              <p className="mt-1 text-sm text-white/45">
                Lo más destacado del catálogo de {artist.name}.
              </p>
            </div>

            <button
              type="button"
              disabled={popularSongs.length === 0}
              onClick={playAll}
              className="hidden rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
            >
              Reproducir todo
            </button>
          </div>

          {popularSongs.length > 0 ? (
            <div className="overflow-hidden rounded-3xl ring-1 ring-white/10">
              <div className="grid grid-cols-[48px_1fr_0.8fr_90px] gap-3 border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white/35 max-lg:grid-cols-[42px_1fr_80px]">
                <div>#</div>
                <div>Título</div>
                <div className="max-lg:hidden">Álbum</div>
                <div className="text-right">Duración</div>
              </div>

              {popularSongs.map((song, index) => (
                <ArtistSongRow
                  key={song.id}
                  index={index + 1}
                  song={song}
                  onClick={() => playSong(song, songs)}
                />
              ))}
            </div>
          ) : (
            <ArtistEmptyState
              icon="fa-music"
              title="No hay canciones todavía"
              text="Cuando este artista publique canciones, aparecerán aquí."
            />
          )}
        </section>
      )}

      {activeTab === "albums" && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Álbumes</h2>
              <p className="mt-1 text-sm text-white/45">
                Discografía publicada por {artist.name}.
              </p>
            </div>
          </div>

          {albums.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {albums.map((album) => (
                <ArtistAlbumCard
                  key={album.id}
                  album={album}
                  artistName={artist.name}
                  onPlay={() => {
                    const firstSong = album.songs[0];
                    if (!firstSong) return;
                    playSong(firstSong, album.songs);
                  }}
                />
              ))}
            </div>
          ) : (
            <ArtistEmptyState
              icon="fa-compact-disc"
              title="No hay álbumes publicados"
              text="La discografía del artista aparecerá en esta sección."
            />
          )}
        </section>
      )}

      {activeTab === "about" && (
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="text-xl font-black">Acerca de {artist.name}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {artist.name} forma parte de Flowy con {songs.length} canciones y{" "}
              {albums.length} álbumes publicados. Esta sección puede crecer con
              biografía, redes sociales, país, géneros y métricas reales del
              artista.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <MiniAboutCard
                label="Catálogo"
                value={`${songs.length} canciones`}
              />
              <MiniAboutCard
                label="Discografía"
                value={`${albums.length} álbumes`}
              />
              <MiniAboutCard
                label="Duración"
                value={totalDuration > 0 ? fmtTime(totalDuration) : "--:--"}
              />
              <MiniAboutCard label="Estado" value="Activo en Flowy" />
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-[#7a0f2b]/30 via-white/5 to-black p-6 ring-1 ring-white/10">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <i className="fa-solid fa-chart-simple text-xl text-white" />
            </div>
            <h3 className="mt-5 text-lg font-black">Próximas estadísticas</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Más adelante puedes conectar reproducciones, seguidores, favoritos
              y guardados desde el backend para mostrar estadísticas reales.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function ArtistProfileSkeleton({
  onBack,
  artistName,
}: {
  onBack: () => void;
  artistName: string;
}) {
  return (
    <div className="animate-fadeUp space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-white/5 p-6 ring-1 ring-white/10">
        <button
          type="button"
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/15 cursor-pointer"
          aria-label="Volver"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end">
          <div className="h-44 w-44 animate-pulse rounded-full bg-white/10" />
          <div className="flex-1 space-y-4 pb-3">
            <div className="h-5 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="h-14 max-w-xl animate-pulse rounded-2xl bg-white/10" />
            <div className="h-4 max-w-lg animate-pulse rounded-full bg-white/10" />
            <div className="h-12 w-44 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      <div className="rounded-3xl bg-white/5 p-6 text-sm text-white/50 ring-1 ring-white/10">
        Cargando perfil de {artistName}...
      </div>
    </div>
  );
}

function ArtistStatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#7a0f2b]/20 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7a0f2b]/25 ring-1 ring-[#7a0f2b]/40">
          <i className={`fa-solid ${icon} text-white`} />
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
            {label}
          </div>
          <div className="mt-1 text-2xl font-black">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ArtistTabButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-xs font-black transition cursor-pointer",
        active
          ? "bg-white text-black"
          : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ArtistSongRow({
  index,
  song,
  onClick,
}: {
  index: number;
  song: Song;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group grid w-full grid-cols-[48px_1fr_0.8fr_90px] items-center gap-3 px-4 py-3 text-left transition hover:bg-white/8 cursor-pointer max-lg:grid-cols-[42px_1fr_80px]"
    >
      <div className="text-sm font-bold text-white/45 group-hover:text-white">
        <span className="group-hover:hidden">{index}</span>
        <i className="fa-solid fa-play hidden text-xs group-hover:inline" />
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#7a0f2b]/40 to-black ring-1 ring-white/10">
          {song.cover ? (
            <img
              src={song.cover}
              alt={song.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <i className="fa-solid fa-music text-white/60" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-white">
            {song.title}
          </div>
          <div className="truncate text-xs text-white/50">{song.artist}</div>
        </div>
      </div>

      <div className="truncate text-sm text-white/45 max-lg:hidden">
        {song.album}
      </div>
      <div className="text-right text-sm text-white/45">
        {song.duration > 0 ? fmtTime(song.duration) : "--:--"}
      </div>
    </button>
  );
}

function ArtistAlbumCard({
  album,
  artistName,
  onPlay,
}: {
  album: ArtistAlbum;
  artistName: string;
  onPlay: () => void;
}) {
  const totalDuration = album.songs.reduce(
    (total, song) => total + (song.duration || 0),
    0,
  );

  return (
    <div className="group overflow-hidden rounded-3xl bg-white/5 p-3 ring-1 ring-white/10 transition hover:bg-white/10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7a0f2b]/35 via-white/10 to-black ring-1 ring-white/10">
        <div className="aspect-square w-full">
          {album.cover ? (
            <img
              src={album.cover}
              alt={album.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <i className="fa-solid fa-compact-disc text-5xl text-white/55" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onPlay}
          disabled={album.songs.length === 0}
          className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-[#7a0f2b] text-white opacity-0 shadow-lg shadow-black/35 transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer active:scale-95"
          aria-label="Reproducir álbum"
        >
          <i className="fa-solid fa-play text-sm" />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="truncate text-sm font-black">{album.title}</h3>
        <p className="mt-1 truncate text-xs text-white/55">{artistName}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/40">
          <span>{album.songs.length} canciones</span>
          {totalDuration > 0 && (
            <>
              <span>•</span>
              <span>{fmtTime(totalDuration)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ArtistEmptyState({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] bg-white/5 p-8 text-center ring-1 ring-white/10">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10 ring-1 ring-white/10">
        <i className={`fa-solid ${icon} text-xl text-white/55`} />
      </div>
      <h3 className="mt-4 text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm text-white/50">{text}</p>
    </div>
  );
}

function MiniAboutCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
      <div className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </div>
      <div className="mt-2 text-sm font-bold text-white/80">{value}</div>
    </div>
  );
}
