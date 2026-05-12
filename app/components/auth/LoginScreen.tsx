"use client";

import Link from "next/link";
import { useLoginForm } from "@/app/hooks/useLoginForm";

export default function LoginScreen() {
  const {
    step,
    value,
    password,
    showUserError,
    showPassError,
    canContinue,
    canLogin,
    loading,
    serverError,
    handleSubmit,
    handleUserChange,
    handlePasswordChange,
    handleUserBlur,
    handlePasswordBlur,
    goBack,
  } = useLoginForm();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center px-6 py-10">
        <div className="mb-8 mt-6 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10" />
        </div>

        <h1 className="mb-8 text-center text-[40px] font-extrabold leading-[1.05]">
          Iniciar Sesión
        </h1>

        <form className="w-full" onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-semibold">
            Email o nombre de usuario
          </label>

          <input
            value={value}
            onChange={(e) => handleUserChange(e.target.value)}
            onBlur={handleUserBlur}
            className={[
              "h-12 w-full rounded-md border bg-transparent px-4 text-base outline-none",
              "placeholder:text-white/30",
              showUserError
                ? "border-[#f15e6c] focus:border-[#f15e6c]"
                : "border-white/20 focus:border-white/50",
            ].join(" ")}
          />

          {showUserError && (
            <FieldError>
              Ingresa tu nombre de usuario de Stream o tu dirección de email.
            </FieldError>
          )}

          {step === 2 && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={handlePasswordBlur}
                className={[
                  "h-12 w-full rounded-md border bg-transparent px-4 text-base outline-none",
                  showPassError
                    ? "border-[#f15e6c] focus:border-[#f15e6c]"
                    : "border-white/20 focus:border-white/50",
                ].join(" ")}
              />

              {showPassError && <FieldError>Ingresa tu contraseña.</FieldError>}

              <button
                type="button"
                onClick={goBack}
                className="mt-4 text-sm text-white/70 underline underline-offset-4 hover:text-white"
              >
                Volver
              </button>
            </div>
          )}

          {serverError && <FieldError>{serverError}</FieldError>}
          <button
            type="submit"
            disabled={step === 1 ? !canContinue : !canLogin}
            className={[
              "mt-6 h-12 w-full rounded-full font-bold text-black transition active:scale-[0.99]",
              "hover:scale-[1.01]",
              (step === 1 ? canContinue : canLogin)
                ? "bg-[#FFFFFF]"
                : "bg-[#FFFFFF]/50 cursor-not-allowed",
            ].join(" ")}
          >
            {loading
              ? "Entrando..."
              : step === 1
                ? "Continuar"
                : "Iniciar sesión"}
          </button>

          {step === 1 && (
            <>
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/60">o</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex w-full flex-col gap-3">
                <OutlineButton
                  icon={<PhoneIcon />}
                  text="Continuar con tu número de teléfono"
                />
                <OutlineButton
                  icon={<GoogleIcon />}
                  text="Continuar con Google"
                />
              </div>

              <div className="mt-10 text-center text-sm text-white/70">
                ¿No tienes una cuenta?{" "}
                <Link
                  className="text-white underline underline-offset-4"
                  href="/registro"
                >
                  Registrarme
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex gap-2 text-[#f15e6c]">
      <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#f15e6c] text-[10px]">
        !
      </span>
      <p className="text-sm">{children}</p>
    </div>
  );
}

function OutlineButton({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-transparent px-4 text-sm font-semibold text-white transition hover:border-white/40"
    >
      <span className="grid place-items-center">{icon}</span>
      <span className="text-center">{text}</span>
    </button>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        stroke="white"
        strokeWidth="2"
      />
      <path d="M10 19h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.8 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4S6.9 20.6 12 20.6c6.1 0 8.2-4.3 8.2-6.5 0-.4-.1-.8-.1-1.1H12Z"
      />
      <path
        fill="#34A853"
        d="M3.7 7.8l3.2 2.3C7.8 8.2 9.7 6.6 12 6.6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.8 2.2 12 2.2c-3.5 0-6.5 2-8.3 5.6Z"
      />
      <path
        fill="#FBBC05"
        d="M12 20.6c2.7 0 5-0.9 6.7-2.4l-3.1-2.5c-.8.6-1.9 1.1-3.6 1.1-2.7 0-5-1.8-5.8-4.3l-3.2 2.5c1.7 3.5 5 5.6 9 5.6Z"
      />
      <path
        fill="#4285F4"
        d="M20.1 12.9c0-.4-.1-.8-.1-1.1H12v3.9h5.4c-.3 1.3-1.6 3.9-5.4 3.9v3.1c3.1 0 8.1-2 8.1-9.7Z"
      />
    </svg>
  );
}
