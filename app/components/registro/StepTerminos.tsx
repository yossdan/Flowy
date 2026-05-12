"use client";

interface StepTerminosProps {
  step: number;
  aceptaTerminos: boolean;
  setAceptaTerminos: (value: boolean | ((prev: boolean) => boolean)) => void;
  empezar: () => void;
}

export default function StepTerminos({
  step,
  aceptaTerminos,
  setAceptaTerminos,
  empezar,
}: StepTerminosProps) {
  return (
    <section
      className={[
        "absolute inset-0 transition-all duration-300",
        step === 3
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-2",
      ].join(" ")}
    >
      <h3 className="mt-2 text-3xl font-extrabold">Términos y condiciones</h3>

      <p className="mt-4 text-white/70">
        Antes de continuar, necesitamos que aceptes nuestros términos de uso.
        Estos describen cómo funciona la plataforma, cómo se manejan tus datos
        y las condiciones para utilizar el servicio.
      </p>

      <p className="mt-4 text-sm text-white/50">
        Te recomendamos leerlos cuidadosamente antes de continuar.
      </p>

      <div className="mt-8 flex items-start gap-4">
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={() => setAceptaTerminos((prev) => !prev)}
          className="mt-1 h-5 w-5 rounded border-white/30 bg-transparent accent-white"
        />

        <span className="leading-relaxed text-base text-white/80">
          Confirmo que he leído y acepto los{" "}
          <a href="#" className="underline hover:text-white">
            Términos y Condiciones
          </a>{" "}
          y la{" "}
          <a href="#" className="underline hover:text-white">
            Política de Privacidad
          </a>
          . También acepto el tratamiento de mis datos personales conforme a
          dichas políticas.
        </span>
      </div>

      <button
        type="button"
        onClick={empezar}
        disabled={!aceptaTerminos}
        className={[
          "mt-12 h-14 w-full rounded-full text-lg font-semibold transition active:scale-[0.99]",
          aceptaTerminos
            ? "bg-white text-black hover:bg-white/90"
            : "cursor-not-allowed bg-white/20 text-white/40",
        ].join(" ")}
      >
        ¡Empecemos!
      </button>
    </section>
  );
}