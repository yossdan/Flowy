"use client";

import { fmtTime } from "@/app/lib/helpers";
import type { Song } from "@/app/types/dashboard";

type LikedTableProps = {
  songs: Song[];
  playingId: string | null;
  onRowPlay: (id: string) => void;
};

export default function LikedTable({
  songs,
  playingId,
  onRowPlay,
}: LikedTableProps) {
  return (
    <div className="animate-fadeUp">
      <div className="grid grid-cols-[44px_1fr_70px] md:grid-cols-[50px_1.6fr_1fr_170px_70px] items-center gap-3 border-b border-white/10 pb-3 text-xs text-white/60">
        <div className="text-center">#</div>
        <div>Título</div>
        <div className="hidden md:block">Álbum</div>
        <div className="hidden md:flex items-center gap-2">
          <span>Fecha en que se a...</span>
          <i className="fa-solid fa-caret-down text-white/40" />
        </div>
        <div className="text-right">
          <i className="fa-regular fa-clock" />
        </div>
      </div>

      <div className="mt-2">
        {songs.map((s, idx) => {
          const active = playingId === s.id;

          return (
            <button
              key={s.id}
              onClick={() => onRowPlay(s.id)}
              className={[
                "w-full text-left",
                "grid grid-cols-[44px_1fr_70px] md:grid-cols-[50px_1.6fr_1fr_170px_70px] items-center gap-3 rounded-lg px-2 py-2",
                "hover:bg-white/10 transition cursor-pointer",
                active ? "bg-white/10" : "bg-transparent",
              ].join(" ")}
            >
              <div className="text-center text-white/70">
                {active ? (
                  <i className="fa-solid fa-volume-high text-[#7a0f2b]" />
                ) : (
                  idx + 1
                )}
              </div>

              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded bg-gradient-to-br from-[#7a0f2b]/45 to-black ring-1 ring-white/10 sm:block">
                  {s.cover ? (
                    <img
                      src={s.cover}
                      alt={s.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <i className="fa-solid fa-music text-xs text-white/60" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div
                    className={[
                      "truncate font-semibold",
                      active ? "text-white" : "text-white/90",
                    ].join(" ")}
                  >
                    {s.title}
                  </div>

                  <div className="truncate text-xs text-white/60">
                    {s.artist}
                  </div>
                </div>
              </div>

              <div className="hidden md:block truncate text-sm text-white/70">
                {s.album}
              </div>
              <div className="hidden md:block truncate text-sm text-white/60">
                {s.added}
              </div>

              <div className="flex items-center justify-end gap-3">
                {active && (
                  <i className="fa-solid fa-circle-check text-[#7a0f2b] hidden md:inline" />
                )}
                <span className="text-sm text-white/60">
                  {fmtTime(s.duration)}
                </span>
                <i className="fa-solid fa-ellipsis text-white/50 hidden md:inline" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
