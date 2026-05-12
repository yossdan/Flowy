"use client";

import RadioGenero from "./RadioGenero";
import type { Genero } from "../../registro/types";

interface StepPerfilProps {
  step: number;
  nombre: string;
  setNombre: (value: string) => void;
  dia: string;
  setDia: (value: string) => void;
  mes: string;
  setMes: (value: string) => void;
  anio: string;
  setAnio: (value: string) => void;
  genero: Genero;
  setGenero: (value: Genero) => void;
  canContinue: boolean;
  next: () => void;
}

export default function StepPerfil({
  step,
  nombre,
  setNombre,
  dia,
  setDia,
  mes,
  setMes,
  anio,
  setAnio,
  genero,
  setGenero,
  canContinue,
  next,
}: StepPerfilProps) {
  return (
    <section
      className={[
        "absolute inset-0 transition-all duration-300",
        step === 2
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-2",
      ].join(" ")}
    >
      <h3 className="mt-2 text-3xl font-extrabold">Cuéntanos de ti</h3>

      <p className="mt-4 text-white/70">
        Esto nos ayuda a personalizar tu experiencia.
      </p>

      <div className="mt-10">
        <label className="mb-2 block text-sm font-semibold">Nombre</label>

        <p className="mt-2 text-white/60">
          Puedes usar tu nombre real o un apodo, lo que prefieras. Esto se
          mostrará en tu perfil y en las playlists que crees.
        </p>

        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          type="text"
          placeholder="Tu nombre"
          className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-base outline-none placeholder:text-white/30 focus:border-white/50"
        />
      </div>

      <div className="mt-8">
        <label className="mb-2 block text-sm font-semibold">
          Fecha de nacimiento
        </label>

        <div className="grid grid-cols-3 gap-3">
          <input
            value={dia}
            onChange={(e) =>
              setDia(e.target.value.replace(/\D/g, "").slice(0, 2))
            }
            inputMode="numeric"
            placeholder="Día"
            className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-base outline-none placeholder:text-white/30 focus:border-white/50"
          />

          <input
            value={mes}
            onChange={(e) =>
              setMes(e.target.value.replace(/\D/g, "").slice(0, 2))
            }
            inputMode="numeric"
            placeholder="Mes"
            className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-base outline-none placeholder:text-white/30 focus:border-white/50"
          />

          <input
            value={anio}
            onChange={(e) =>
              setAnio(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            inputMode="numeric"
            placeholder="Año"
            className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-base outline-none placeholder:text-white/30 focus:border-white/50"
          />
        </div>

        <p className="mt-3 text-xs text-white/50">
          * Debes tener al menos 13 años para registrarte.
        </p>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-extrabold">Género</h4>

        <div className="mt-2 space-y-4">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <RadioGenero
              name="genero"
              value="hombre"
              label="Hombre"
              checked={genero === "hombre"}
              onChange={() => setGenero("hombre")}
            />

            <RadioGenero
              name="genero"
              value="mujer"
              label="Mujer"
              checked={genero === "mujer"}
              onChange={() => setGenero("mujer")}
            />

            <RadioGenero
              name="genero"
              value="prefiero_no_decir"
              label="Prefiero no decirlo"
              checked={genero === "prefiero_no_decir"}
              onChange={() => setGenero("prefiero_no_decir")}
            />
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <RadioGenero
              name="genero"
              value="otro"
              label="Otra opción"
              checked={genero === "otro"}
              onChange={() => setGenero("otro")}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={next}
        disabled={!canContinue}
        className={[
          "mt-12 h-14 w-full rounded-full text-lg font-semibold transition active:scale-[0.99]",
          canContinue
            ? "bg-white text-black hover:bg-white/90"
            : "bg-white/20 text-white/40 cursor-not-allowed",
        ].join(" ")}
      >
        Siguiente
      </button>
    </section>
  );
}
