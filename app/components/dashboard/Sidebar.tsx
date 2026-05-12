"use client";

type SidebarView = "home" | "liked" | "library" | "playlist" | "artist";

type SidebarProps = {
  view?: SidebarView;
  userInitial?: string;

  goHome: () => void;
  openLiked: () => void;
  openLibrary: () => void;

  goBack?: () => void;
  goForward?: () => void;
  openCreatePlaylist?: () => void;
  togglePlayer?: () => void;
  openProfile?: () => void;
  openArtistStudio?: () => void;
  isArtist?: boolean;
};

export default function Sidebar({
  view = "home",
  userInitial = "D",
  goHome,
  openLiked,
  openLibrary,
  goBack,
  goForward,
  openCreatePlaylist,
  togglePlayer,
  openProfile,
  openArtistStudio,
  isArtist = false,
}: SidebarProps) {
  return (
    <aside className="shrink-0 bg-[#0b0b0c] px-2 py-3 sm:px-3 sm:py-4 w-16 sm:w-20 md:w-[88px]">
      <div className="flex h-full flex-col items-center gap-3">
        <div className="flex w-full items-center justify-center gap-2">
          <MiniButton icon="fa-chevron-left" label="Atrás" onClick={goBack} />

          <MiniButton
            icon="fa-chevron-right"
            label="Adelante"
            onClick={goForward}
          />
        </div>

        <div className="mt-1 flex w-full flex-col items-center gap-3">
          <RailButton
            icon="fa-house"
            label="Inicio"
            active={view === "home"}
            onClick={goHome}
          />

          <RailButton
            icon="fa-plus"
            label="Crear playlist"
            onClick={openCreatePlaylist}
          />

          <RailButton
            icon="fa-heart"
            label="Tus me gusta"
            tone="wine"
            active={view === "liked"}
            onClick={openLiked}
          />

          <RailButton
            icon="fa-bookmark"
            label="Biblioteca"
            active={view === "library" || view === "playlist"}
            onClick={openLibrary}
          />

          <RailButton
            icon="fa-circle-play"
            label="Reproducir / Pausar"
            onClick={togglePlayer}
          />

          <RailButton
            icon={isArtist ? "fa-microphone-lines" : "fa-wand-magic-sparkles"}
            label={isArtist ? "Estudio de artista" : "Convertirme en artista"}
            tone="wine"
            active={view === "artist"}
            onClick={openArtistStudio}
          />
        </div>

        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          <div className="h-px w-10 bg-white/10" />

          <button
            onClick={openProfile}
            title="Perfil"
            aria-label="Ir al perfil"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#7a0f2b] to-black ring-1 ring-white/10 hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <span className="text-xs font-extrabold">{userInitial}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function MiniButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  const disabled = !onClick;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={[
        "grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl ring-1 transition",
        disabled
          ? "cursor-not-allowed bg-white/5 text-white/25 ring-white/10"
          : "cursor-pointer bg-white/5 text-white/70 ring-white/10 hover:bg-white/10 active:scale-95",
      ].join(" ")}
    >
      <i className={`fa-solid ${icon}`} />
    </button>
  );
}

function RailButton({
  icon,
  label,
  active,
  tone = "white",
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  tone?: "white" | "wine";
  onClick?: () => void;
}) {
  const disabled = !onClick;

  const activeCls =
    tone === "wine"
      ? "bg-[#7a0f2b]/25 ring-[#7a0f2b]/40 text-white"
      : "bg-white/15 ring-white/25 text-white";

  const idleCls = "bg-white/5 ring-white/10 text-white/75 hover:bg-white/10";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={[
        "relative grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl ring-1 transition",
        disabled
          ? "cursor-not-allowed opacity-45"
          : "cursor-pointer active:scale-95",
        active ? activeCls : idleCls,
      ].join(" ")}
    >
      <i className={`fa-solid ${icon}`} />

      {active && (
        <span className="absolute -right-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-[#7a0f2b]" />
      )}
    </button>
  );
}
