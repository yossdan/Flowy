"use client";

import Link from "next/link";

interface StepEmailProps {
  step: number;
  email: string;
  setEmail: (value: string) => void;
  canContinue: boolean;
  next: () => void;
}

export default function StepEmail({
  step,
  email,
  setEmail,
  canContinue,
  next,
}: StepEmailProps) {
  return (
    <section
      className={[
        "absolute inset-0 transition-all duration-300",
        step === 0
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-2",
      ].join(" ")}
    >
      <div className="mt-2 flex flex-col items-center">
        <div className="mb-8 grid h-12 w-12 place-items-center rounded-full bg-white">
          <div className="h-5 w-5 rounded-full bg-black/90" />
        </div>

        <h1 className="mb-10 text-center text-[44px] font-extrabold leading-[1.05] tracking-tight">
          Regístrate
          <br />
          para empezar
          <br />
          a escuchar
          <br />
          contenido
        </h1>
      </div>

      <div className="w-full">
        <label className="mb-2 block text-sm font-semibold">
          Dirección de email
        </label>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="nombre@correo.com"
          className="h-12 w-full rounded-md border border-white/20 bg-transparent px-4 text-base outline-none placeholder:text-white/30 focus:border-white/50"
        />

        <button
          type="button"
          onClick={next}
          disabled={!canContinue}
          className={[
            "mt-8 h-12 w-full rounded-full text-sm font-semibold transition active:scale-[0.99]",
            canContinue
              ? "bg-white text-black hover:bg-white/90"
              : "cursor-not-allowed bg-white/30 text-black/40",
          ].join(" ")}
        >
          Siguiente
        </button>

        <div className="mt-10 text-center text-sm text-white/70">
          ¿Ya tienes una cuenta?{" "}
          <Link
            className="text-white underline underline-offset-4"
            href="/login"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </section>
  );
}