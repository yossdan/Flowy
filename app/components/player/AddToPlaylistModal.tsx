"use client";

import { useState } from "react";
import type { Song } from "@/app/types/dashboard";
import type { PlayerPlaylist } from "@/app/context/PlayerContext";

type AddToPlaylistModalProps = {
  open: boolean;
  song: Song | null;
  playlists: PlayerPlaylist[];
  onClose: () => void;
  onSelectPlaylist: (playlistId: string) => void;
  onCreatePlaylist: (title: string) => void;
};

export default function AddToPlaylistModal({
  open,
  song,
  playlists,
  onClose,
  onSelectPlaylist,
  onCreatePlaylist,
}: AddToPlaylistModalProps) {
  const [creating, setCreating] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  if (!open) return null;

  const cleanName = playlistName.trim();
  const canCreate = cleanName.length > 0;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 px-4 text-white backdrop-blur-sm">
      <div className="w-full max-w-[520px] overflow-hidden rounded-3xl bg-[#121214] shadow-2xl shadow-black/70 ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-xl font-black">Agregar a playlist</h2>

            <p className="mt-1 max-w-[360px] truncate text-xs text-white/50">
              {song
                ? `Selecciona dónde guardar “${song.title}”.`
                : "Selecciona una canción primero."}
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

        <div className="max-h-[55vh] overflow-y-auto p-5">
          {!creating && (
            <>
              <button
                onClick={() => setCreating(true)}
                className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left text-black transition hover:bg-white/90 cursor-pointer"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-black/10">
                  <i className="fa-solid fa-plus" />
                </div>

                <div>
                  <div className="text-sm font-black">Crear nueva playlist</div>
                  <div className="text-xs text-black/60">
                    Crea una playlist y agrega esta canción.
                  </div>
                </div>
              </button>

              <div className="space-y-2">
                {playlists.length > 0 ? (
                  playlists.map((playlist) => {
                    const alreadyHasSong = song
                      ? playlist.songs.some((item) => item.id === song.id)
                      : false;

                    return (
                      <button
                        key={playlist.id}
                        onClick={() => {
                          if (alreadyHasSong) return;
                          onSelectPlaylist(playlist.id);
                        }}
                        disabled={alreadyHasSong}
                        className={[
                          "flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-1 transition",
                          alreadyHasSong
                            ? "cursor-not-allowed bg-white/5 opacity-55 ring-white/10"
                            : "cursor-pointer bg-white/5 ring-white/10 hover:bg-white/10",
                        ].join(" ")}
                      >
                        <PlaylistMiniCover
                          title={playlist.title}
                          icon={playlist.icon}
                          songs={playlist.songs}
                          coverImage={playlist.coverImage ?? null}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-bold">
                            {playlist.title}
                          </div>

                          <div className="truncate text-xs text-white/50">
                            {playlist.songs.length} canciones
                          </div>
                        </div>

                        {alreadyHasSong ? (
                          <span className="rounded-full bg-[#7a0f2b]/25 px-3 py-1 text-xs font-bold text-white ring-1 ring-[#7a0f2b]/40">
                            Ya está
                          </span>
                        ) : (
                          <i className="fa-solid fa-plus text-white/40" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-2xl bg-white/5 p-4 text-center text-sm text-white/50">
                    Aún no tienes playlists. Crea una nueva para guardar esta
                    canción.
                  </div>
                )}
              </div>
            </>
          )}

          {creating && (
            <div>
              <button
                onClick={() => setCreating(false)}
                className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left text-xs" />
                Volver a playlists
              </button>

              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-[#7a0f2b] to-black ring-1 ring-white/10">
                  <i className="fa-solid fa-music text-3xl text-white/80" />
                </div>

                <label className="mt-5 block text-sm font-bold">
                  Nombre de la playlist
                </label>

                <input
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Ejemplo: Canciones para entrenar"
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none placeholder:text-white/35 focus:border-white/30"
                />

                <button
                  disabled={!canCreate}
                  onClick={() => {
                    if (!canCreate) return;

                    onCreatePlaylist(cleanName);
                    setPlaylistName("");
                    setCreating(false);
                  }}
                  className={[
                    "mt-5 w-full rounded-full px-5 py-3 text-sm font-bold transition",
                    canCreate
                      ? "bg-white text-black hover:bg-white/90 cursor-pointer"
                      : "cursor-not-allowed bg-white/30 text-black/40",
                  ].join(" ")}
                >
                  Crear y agregar canción
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-xs leading-relaxed text-white/45">
            Elige una playlist para guardar esta canción en tu biblioteca.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlaylistMiniCover({
  title,
  icon,
  songs,
  coverImage,
}: {
  title: string;
  icon: string;
  songs: {
    id: string;
    title: string;
    cover?: string | null;
  }[];
  coverImage?: string | null;
}) {
  const collageSongs = songs.slice(0, 4);

  if (coverImage) {
    return (
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (collageSongs.length > 0) {
    return (
      <div className="grid h-12 w-12 shrink-0 grid-cols-2 grid-rows-2 overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
        {collageSongs.map((song) => (
          <div
            key={song.id}
            className="relative grid place-items-center border border-black/20 bg-gradient-to-br from-[#7a0f2b]/35 via-white/10 to-black"
          >
            {song.cover ? (
              <img
                src={song.cover}
                alt={song.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <i className="fa-solid fa-music text-[10px] text-white/60" />
            )}
          </div>
        ))}

        {Array.from({ length: Math.max(0, 4 - collageSongs.length) }).map(
          (_, index) => (
            <div
              key={`empty-${index}`}
              className="grid place-items-center border border-black/20 bg-gradient-to-br from-white/10 to-black"
            >
              <i className="fa-solid fa-music text-[10px] text-white/30" />
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#7a0f2b]/45 to-black ring-1 ring-white/10">
      <i className={`fa-solid ${icon} text-white/75`} />
    </div>
  );
}
