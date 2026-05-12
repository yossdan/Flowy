"use client";

interface StepPasswordProps {
  step: number;
  pass: string;
  setPass: (value: string) => void;
  showPass: boolean;
  setShowPass: (value: boolean | ((prev: boolean) => boolean)) => void;
  canContinue: boolean;
  next: () => void;
}

export default function StepPassword({
  step,
  pass,
  setPass,
  showPass,
  setShowPass,
  canContinue,
  next,
}: StepPasswordProps) {
  return (
    <section
      className={[
        "absolute inset-0 transition-all duration-300",
        step === 1
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-2",
      ].join(" ")}
    >
      <h2 className="mt-1 text-3xl font-extrabold">Crea una contraseña</h2>

      <div className="mt-10">
        <label className="mb-2 block text-sm font-semibold">Contraseña</label>

        <div className="relative">
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type={showPass ? "text" : "password"}
            className="h-14 w-full rounded-md border border-white/30 bg-transparent px-4 pr-14 text-base outline-none focus:border-white/60"
          />

          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-white/10"
            aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <i className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
          </button>
        </div>

        <p className="mt-8 text-xl font-extrabold">
          La contraseña debe tener al menos
        </p>

        <ul className="mt-6 space-y-4 text-base text-white/80">
          <li className="flex items-center gap-3">
            <span className="inline-block h-4 w-4 rounded-full border border-white/40" />
            1 letra
          </li>
          <li className="flex items-center gap-3">
            <span className="inline-block h-4 w-4 rounded-full border border-white/40" />
            1 número o carácter especial (ejemplo: #, ?, ! o &)
          </li>
          <li className="flex items-center gap-3">
            <span className="inline-block h-4 w-4 rounded-full border border-white/40" />
            8 caracteres
          </li>
        </ul>

        <button
          type="button"
          onClick={next}
          disabled={!canContinue}
          className={[
            "mt-16 h-14 w-full rounded-full text-lg font-semibold transition active:scale-[0.99]",
            canContinue
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/20 text-white/40 cursor-not-allowed",
          ].join(" ")}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}