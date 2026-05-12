"use client";

import { useEffect, useState } from "react";

type WelcomeIntroProps = {
  userName: string;
  onFinish: () => void;
};

export default function WelcomeIntro({
  userName,
  onFinish,
}: WelcomeIntroProps) {
  const [phase, setPhase] = useState<"welcome" | "brand" | "features" | "hide">(
    "welcome",
  );

  useEffect(() => {
    const welcomeTimer = window.setTimeout(() => {
      setPhase("brand");
    }, 1700);

    const featuresTimer = window.setTimeout(() => {
      setPhase("features");
    }, 3400);

    const hideTimer = window.setTimeout(() => {
      setPhase("hide");
    }, 5700);

    const finishTimer = window.setTimeout(() => {
      onFinish();
    }, 6500);

    return () => {
      window.clearTimeout(welcomeTimer);
      window.clearTimeout(featuresTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={[
        "fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black text-white transition-all duration-700",
        phase === "hide" ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(122,15,43,0.35),transparent_42%)]" />
      <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#7a0f2b]/25 blur-3xl" />
      <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-[#7a0f2b]/20 to-transparent" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <div
          className={[
            "transition-all duration-700",
            phase === "welcome"
              ? "translate-y-0 opacity-100 blur-0"
              : "-translate-y-4 opacity-0 blur-sm",
          ].join(" ")}
        >
          <p className="text-sm font-black uppercase tracking-[0.35em] text-white/45">
            Hola, {userName}
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Bienvenido a
          </h1>
        </div>

        <div
          className={[
            "absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
            phase === "brand" || phase === "features"
              ? "scale-100 opacity-100 blur-0"
              : "scale-95 opacity-0 blur-sm",
          ].join(" ")}
        >
          <div className="relative mx-auto w-fit">
            <svg
              className="flowy-signature"
              viewBox="0 0 520 170"
              aria-label="Flowy"
            >
              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="flowy-signature-text"
              >
                Flowy
              </text>
            </svg>

            <span className="flowy-pencil">
              <i className="fa-solid fa-pencil" />
            </span>
          </div>

          <p
            className={[
              "mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 transition-all delay-700 duration-700",
              phase === "features"
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0",
            ].join(" ")}
          >
            Tu música, tus playlists y tus gustos reunidos en una experiencia
            suave, rápida y personalizada.
          </p>

          <div
            className={[
              "mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 transition-all delay-1000 duration-700 sm:grid-cols-4",
              phase === "features"
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0",
            ].join(" ")}
          >
            <IntroFeature icon="fa-heart" label="Favoritos" delay="0ms" />
            <IntroFeature icon="fa-list" label="Playlists" delay="120ms" />
            <IntroFeature icon="fa-headphones" label="Escuchar" delay="240ms" />
            <IntroFeature
              icon="fa-microphone-lines"
              label="Artista"
              delay="360ms"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .flowy-signature {
          width: min(82vw, 520px);
          height: auto;
          overflow: visible;
          filter: drop-shadow(0 0 22px rgba(255, 59, 107, 0.18));
        }

        .flowy-signature-text {
          font-family:
            "Brush Script MT", "Snell Roundhand", "Apple Chancery",
            "Segoe Script", cursive;
          font-size: 105px;
          font-weight: 400;
          letter-spacing: 2px;
          fill: rgba(255, 255, 255, 0);
          stroke: rgba(255, 255, 255, 0.96);
          stroke-width: 1.8px;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation:
            drawSignature 2.2s ease-in-out 1.55s forwards,
            fillSignature 0.9s ease 3.25s forwards;
        }

        .flowy-pencil {
          position: absolute;
          left: 0;
          top: 48%;
          color: #ff3b6b;
          font-size: 24px;
          opacity: 0;
          transform: translateX(10px) translateY(-50%) rotate(-22deg);
          animation:
            pencilSignatureMove 2.2s ease-in-out 1.55s forwards,
            pencilFade 0.45s ease 3.7s forwards;
          filter: drop-shadow(0 0 18px rgba(255, 59, 107, 0.55));
        }

        @keyframes drawSignature {
          from {
            stroke-dashoffset: 900;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fillSignature {
          from {
            fill: rgba(255, 255, 255, 0);
          }

          to {
            fill: rgba(255, 255, 255, 0.96);
          }
        }

        @keyframes pencilSignatureMove {
          0% {
            opacity: 0;
            transform: translateX(20px) translateY(-50%) rotate(-22deg);
          }

          8% {
            opacity: 1;
          }

          35% {
            transform: translateX(170px) translateY(-80%) rotate(-18deg);
          }

          65% {
            transform: translateX(330px) translateY(-42%) rotate(-20deg);
          }

          100% {
            opacity: 1;
            transform: translateX(500px) translateY(-86%) rotate(-18deg);
          }
        }

        @keyframes pencilFade {
          to {
            opacity: 0;
            transform: translateX(520px) translateY(-96%) rotate(-18deg);
          }
        }
      `}</style>
    </div>
  );
}

function IntroFeature({
  icon,
  label,
  delay,
}: {
  icon: string;
  label: string;
  delay: string;
}) {
  return (
    <div
      className="animate-introFeature rounded-3xl bg-white/7 p-4 ring-1 ring-white/10 backdrop-blur"
      style={{ animationDelay: delay }}
    >
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[#7a0f2b]/30 text-[#ff3b6b] ring-1 ring-[#7a0f2b]/45">
        <i className={`fa-solid ${icon}`} />
      </div>

      <p className="mt-3 text-xs font-black text-white/75">{label}</p>
    </div>
  );
}
