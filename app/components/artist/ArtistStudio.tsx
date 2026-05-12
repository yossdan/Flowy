"use client";

import { useMemo, useState } from "react";
import type {
  ArtistCollaborator,
  ArtistUploadTrack,
  PublishedAlbum,
} from "@/app/types/dashboard";
import { uploadAlbumRequest } from "@/app/services/artist.service";

type ArtistStudioProps = {
  userName: string;
  isArtist: boolean;
  onBecomeArtist: () => void;
  onBecomeListener: () => void;
  onAlbumPublished?: (album: PublishedAlbum) => void;
};

const mockCollaborators: ArtistCollaborator[] = [
  { id: "artist-1", name: "The Weeknd" },
  { id: "artist-2", name: "Feid" },
  { id: "artist-3", name: "Drake" },
  { id: "artist-4", name: "Metro Boomin" },
  { id: "artist-5", name: "Travis Scott" },
  { id: "artist-6", name: "Daniel Caesar" },
];

function createEmptyTrack(): ArtistUploadTrack {
  return {
    id: `track-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: "",
    audioFile: null,
    collaborators: [],
  };
}

export default function ArtistStudio({
  userName,
  isArtist,
  onBecomeArtist,
  onBecomeListener,
  onAlbumPublished,
}: ArtistStudioProps) {
  const [albumName, setAlbumName] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tracks, setTracks] = useState<ArtistUploadTrack[]>([
    createEmptyTrack(),
  ]);
  const [collaboratorSearch, setCollaboratorSearch] = useState("");
  const [toast, setToast] = useState("");
  const [publishing, setPublishing] = useState(false);

  const cleanAlbumName = albumName.trim();

  const filteredCollaborators = useMemo(() => {
    const value = collaboratorSearch.trim().toLowerCase();

    if (!value) return mockCollaborators;

    return mockCollaborators.filter((artist) =>
      artist.name.toLowerCase().includes(value),
    );
  }, [collaboratorSearch]);

  const canSubmit =
    isArtist &&
    cleanAlbumName.length > 0 &&
    Boolean(coverFile) &&
    tracks.length > 0 &&
    tracks.every((track) => track.title.trim().length > 0 && track.audioFile) &&
    !publishing;

  function showMessage(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2200);
  }

  function resetForm() {
    setAlbumName("");
    setCoverFile(null);
    setCoverPreview(null);
    setTracks([createEmptyTrack()]);
    setCollaboratorSearch("");
  }

  function handleCoverChange(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Selecciona una imagen válida.");
      return;
    }

    setCoverFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverPreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  function updateTrackTitle(trackId: string, title: string) {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              title,
            }
          : track,
      ),
    );
  }

  function updateTrackAudio(trackId: string, file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      showMessage("Selecciona un archivo de audio válido.");
      return;
    }

    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              audioFile: file,
            }
          : track,
      ),
    );
  }

  function addTrack() {
    setTracks((prev) => [...prev, createEmptyTrack()]);
  }

  function removeTrack(trackId: string) {
    setTracks((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((track) => track.id !== trackId);
    });
  }

  function toggleCollaborator(
    trackId: string,
    collaborator: ArtistCollaborator,
  ) {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id !== trackId) return track;

        const exists = track.collaborators.some(
          (item) => item.id === collaborator.id,
        );

        return {
          ...track,
          collaborators: exists
            ? track.collaborators.filter((item) => item.id !== collaborator.id)
            : [...track.collaborators, collaborator],
        };
      }),
    );
  }

  async function handleSubmit() {
    if (!coverFile) {
      showMessage("Agrega la portada del álbum.");
      return;
    }

    if (!canSubmit) {
      showMessage("Completa el álbum y sus canciones.");
      return;
    }

    try {
      setPublishing(true);

      const publishedAlbum = await uploadAlbumRequest({
        albumName: cleanAlbumName,
        coverFile,
        tracks: tracks.map((track) => ({
          title: track.title.trim(),
          audioFile: track.audioFile as File,
          collaboratorIds: track.collaborators.map((artist) => artist.id),
        })),
      });

      onAlbumPublished?.(publishedAlbum);
      resetForm();
      showMessage("Álbum publicado correctamente.");
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "No se pudo publicar el álbum.",
      );
    } finally {
      setPublishing(false);
    }
  }

  if (!isArtist) {
    return (
      <div className="animate-fadeUp">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#7a0f2b]/45 via-white/8 to-black p-6 ring-1 ring-white/10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                Flowy para artistas
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
                Conviértete en artista
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
                Activa tu perfil de artista para subir álbumes, canciones,
                portadas y colaboradores.
              </p>

              <button
                onClick={onBecomeArtist}
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-white/90 active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-wand-magic-sparkles" />
                Convertirme en artista
              </button>
            </div>

            <div className="rounded-3xl bg-black/35 p-5 ring-1 ring-white/10">
              <div className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-[#7a0f2b] to-black ring-1 ring-white/10">
                <div className="text-center">
                  <i className="fa-solid fa-microphone-lines text-6xl text-white" />
                  <p className="mt-4 text-sm font-bold text-white/70">
                    Estudio bloqueado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon="fa-compact-disc"
            title="Crear álbumes"
            text="Crea álbumes completos con sus canciones."
          />

          <FeatureCard
            icon="fa-image"
            title="Portada"
            text="Agrega una portada para identificar tu álbum."
          />

          <FeatureCard
            icon="fa-user-plus"
            title="Colaboradores"
            text="Agrega artistas colaboradores a tus canciones."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeUp">
      {toast && (
        <div className="fixed left-1/2 top-6 z-[120] -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black shadow-2xl shadow-black/50">
          {toast}
        </div>
      )}

      <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#7a0f2b]/45 via-white/8 to-black p-6 ring-1 ring-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
              Estudio de artista
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
              Subir nuevo álbum
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
              Hola, {userName}. Crea un álbum con portada, canciones y
              colaboradores.
            </p>
          </div>

          <button
            type="button"
            onClick={onBecomeListener}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white ring-1 ring-white/10 transition hover:bg-white/15 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-user" />
            Dejar de ser artista
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[330px_1fr]">
        <div className="rounded-3xl bg-white/6 p-5 ring-1 ring-white/10">
          <h2 className="text-lg font-black">Datos del álbum</h2>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold">
              Nombre del álbum
            </label>

            <input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Ejemplo: Noches de Flowy"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none placeholder:text-white/35 focus:border-white/30"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold">
              Portada del álbum
            </label>

            <div className="overflow-hidden rounded-3xl bg-black/40 ring-1 ring-white/10">
              <div className="aspect-square w-full">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Portada del álbum"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#7a0f2b]/45 to-black">
                    <div className="text-center">
                      <i className="fa-solid fa-image text-5xl text-white/70" />
                      <p className="mt-3 text-sm font-bold text-white/55">
                        Portada obligatoria
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <label className="mt-4 block cursor-pointer rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black transition hover:bg-white/90">
              Subir portada
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverChange(e.target.files?.[0])}
              />
            </label>

            {coverPreview && (
              <button
                onClick={() => {
                  setCoverFile(null);
                  setCoverPreview(null);
                }}
                className="mt-3 w-full rounded-full bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-white/15 cursor-pointer"
              >
                Quitar portada
              </button>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white/6 p-5 ring-1 ring-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Canciones del álbum</h2>
              <p className="mt-1 text-xs text-white/45">
                Agrega una o varias canciones.
              </p>
            </div>

            <button
              onClick={addTrack}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-white/90 active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-plus text-xs" />
              Agregar canción
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="rounded-3xl bg-black/25 p-4 ring-1 ring-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                      Canción {index + 1}
                    </p>

                    <h3 className="mt-1 text-base font-black">
                      {track.title.trim() || "Nueva canción"}
                    </h3>
                  </div>

                  <button
                    onClick={() => removeTrack(track.id)}
                    disabled={tracks.length === 1}
                    className="grid h-9 w-9 place-items-center rounded-full bg-red-500/10 text-red-200 ring-1 ring-red-500/20 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
                    aria-label="Eliminar canción"
                  >
                    <i className="fa-solid fa-trash text-xs" />
                  </button>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Nombre de la canción
                    </label>

                    <input
                      value={track.title}
                      onChange={(e) =>
                        updateTrackTitle(track.id, e.target.value)
                      }
                      placeholder="Ejemplo: Intro"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm outline-none placeholder:text-white/35 focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Archivo de audio
                    </label>

                    <label className="flex h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm transition hover:bg-white/10">
                      <span className="min-w-0 truncate text-white/60">
                        {track.audioFile
                          ? track.audioFile.name
                          : "Seleccionar audio"}
                      </span>

                      <i className="fa-solid fa-upload text-white/50" />

                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) =>
                          updateTrackAudio(track.id, e.target.files?.[0])
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-bold">
                    Colaboradores
                  </label>

                  <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                    <div className="flex h-11 items-center gap-3 rounded-xl bg-black/25 px-3 ring-1 ring-white/10">
                      <i className="fa-solid fa-magnifying-glass text-white/45" />

                      <input
                        value={collaboratorSearch}
                        onChange={(e) => setCollaboratorSearch(e.target.value)}
                        placeholder="Buscar colaborador"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                      />
                    </div>

                    {track.collaborators.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {track.collaborators.map((artist) => (
                          <button
                            key={artist.id}
                            onClick={() => toggleCollaborator(track.id, artist)}
                            className="inline-flex items-center gap-2 rounded-full bg-[#7a0f2b]/25 px-3 py-2 text-xs font-bold text-white ring-1 ring-[#7a0f2b]/40 cursor-pointer"
                          >
                            {artist.name}
                            <i className="fa-solid fa-xmark text-white/60" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {filteredCollaborators.map((artist) => {
                        const active = track.collaborators.some(
                          (item) => item.id === artist.id,
                        );

                        return (
                          <button
                            key={artist.id}
                            type="button"
                            onClick={() => toggleCollaborator(track.id, artist)}
                            className={[
                              "flex items-center gap-3 rounded-2xl p-3 text-left ring-1 transition cursor-pointer",
                              active
                                ? "bg-[#7a0f2b]/25 ring-[#7a0f2b]/50"
                                : "bg-white/5 ring-white/10 hover:bg-white/10",
                            ].join(" ")}
                          >
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/10">
                              <i className="fa-solid fa-user text-xs text-white/65" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-bold">
                                {artist.name}
                              </div>
                              <div className="text-xs text-white/45">
                                Artista
                              </div>
                            </div>

                            {active && (
                              <i className="fa-solid fa-check text-[#ff8aa8]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={[
                "rounded-full px-6 py-3 text-sm font-black transition",
                canSubmit
                  ? "bg-white text-black hover:bg-white/90 active:scale-95 cursor-pointer"
                  : "cursor-not-allowed bg-white/30 text-black/40",
              ].join(" ")}
            >
              {publishing ? "Publicando..." : "Publicar álbum"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white/6 p-5 ring-1 ring-white/10">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7a0f2b]/30 ring-1 ring-[#7a0f2b]/40">
        <i className={`fa-solid ${icon} text-white`} />
      </div>

      <h3 className="mt-4 text-base font-black">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
    </div>
  );
}
