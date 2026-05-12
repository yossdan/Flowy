"use client";

type LikedHeaderProps = {
  userName: string;
  songsCount: number;
  onBack: () => void;
  onPlay: () => void;
};

export default function LikedHeader({
  userName,
  songsCount,
  onBack,
  onPlay,
}: LikedHeaderProps) {
  return (
    <div className="pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer"
          aria-label="Volver"
        >
          <i className="fa-solid fa-chevron-left text-white/80" />
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6">
        <div className="h-[140px] w-[140px] sm:h-[190px] sm:w-[190px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#7a0f2b] via-[#2b0a14] to-black ring-1 ring-white/10">
          <div className="grid h-full w-full place-items-center">
            <i className="fa-solid fa-heart text-white text-5xl sm:text-6xl" />
          </div>
        </div>

        <div className="pb-1 sm:pb-2 min-w-0">
          <div className="text-xs font-semibold text-white/70">Playlist</div>
          <div className="mt-2 text-4xl sm:text-6xl md:text-[64px] leading-[0.95] font-extrabold tracking-tight">
            Tus me gusta
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-white/10 ring-1 ring-white/10">
              <span className="text-[11px] font-bold">
                {userName.slice(0, 1).toUpperCase()}
              </span>
            </div>

            <span className="font-semibold text-white/80">{userName}</span>
            <span>•</span>
            <span>{songsCount} canciones</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
        <button
          onClick={onPlay}
          className="grid h-14 w-14 place-items-center rounded-full bg-[#7a0f2b] text-white shadow-lg shadow-black/30 hover:brightness-110 active:scale-95 transition cursor-pointer"
          aria-label="Reproducir"
        >
          <i className="fa-solid fa-play" />
        </button>

        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer">
          <i className="fa-solid fa-shuffle text-white/80" />
        </button>

        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/15 cursor-pointer">
          <i className="fa-solid fa-arrow-down text-white/80" />
        </button>

        <div className="ml-0 sm:ml-auto flex items-center gap-4 text-white/70">
          <button
            className="hover:text-white cursor-pointer"
            aria-label="Buscar"
          >
            <i className="fa-solid fa-magnifying-glass" />
          </button>

          <button className="hover:text-white cursor-pointer text-sm">
            Fecha en que se agregó
          </button>

          <button
            className="hover:text-white cursor-pointer"
            aria-label="Vista"
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </div>
    </div>
  );
}
