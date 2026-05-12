"use client";

import Link from "next/link";

type MobileNavProps = {
  view?: "home" | "liked" | "library" | "playlist" | "artist";
  goHome?: () => void;
  openLibrary?: () => void;
  openArtistStudio?: () => void;
  isArtist?: boolean;
};

export default function MobileNav({
  view = "home",
  goHome,
  openLibrary,
  openArtistStudio,
  isArtist = false,
}: MobileNavProps) {
  return (
    <nav className="fixed bottom-[92px] left-3 right-3 z-40 rounded-3xl border border-white/10 bg-[#0b0b0c]/95 px-3 py-2 text-white shadow-2xl shadow-black/50 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5 gap-1">
        <MobileNavButton
          icon="fa-house"
          label="Inicio"
          active={view === "home"}
          onClick={goHome}
        />

        <MobileNavButton
          icon="fa-magnifying-glass"
          label="Buscar"
          active={false}
          onClick={goHome}
        />

        <MobileNavButton
          icon="fa-bookmark"
          label="Biblioteca"
          active={view === "library" || view === "playlist"}
          onClick={openLibrary}
        />

        <MobileNavButton
          icon={isArtist ? "fa-microphone-lines" : "fa-wand-magic-sparkles"}
          label={isArtist ? "Artista" : "Crear"}
          active={view === "artist"}
          onClick={openArtistStudio}
        />

        <Link
          href="/perfil"
          className="group flex flex-col items-center justify-center rounded-2xl px-2 py-2 transition hover:bg-white/10"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 ring-1 ring-white/10">
            <i className="fa-solid fa-user text-xs text-white/80" />
          </span>

          <span className="mt-1 text-[11px] font-bold text-white/65">
            Perfil
          </span>
        </Link>
      </div>
    </nav>
  );
}

function MobileNavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group flex flex-col items-center justify-center rounded-2xl px-2 py-2 transition cursor-pointer",
        active ? "bg-white/10" : "hover:bg-white/10",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-7 w-7 place-items-center rounded-full ring-1 transition",
          active
            ? "bg-[#7a0f2b]/30 text-white ring-[#7a0f2b]/40"
            : "bg-white/5 text-white/65 ring-white/10",
        ].join(" ")}
      >
        <i className={`fa-solid ${icon} text-xs`} />
      </span>

      <span
        className={[
          "mt-1 text-[11px] font-bold",
          active ? "text-white" : "text-white/60",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}
