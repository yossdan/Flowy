"use client";

import { useEffect, useState } from "react";

type WelcomeIntroProps = {
  userName: string;
  onFinish: () => void;
};

type IntroPhase = "enter" | "welcome" | "signature" | "ready" | "exit";

export default function WelcomeIntro({
  userName,
  onFinish,
}: WelcomeIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>("enter");

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase("welcome"), 180),
      window.setTimeout(() => setPhase("signature"), 2150),
      window.setTimeout(() => setPhase("ready"), 4700),
      window.setTimeout(() => setPhase("exit"), 7300),
      window.setTimeout(() => onFinish(), 8250),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onFinish]);

  const showWelcome = phase === "enter" || phase === "welcome";
  const showSignature = phase === "signature" || phase === "ready";
  const showReady = phase === "ready";

  return (
    <div
      className={[
        "fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#050507] text-white",
        "transition-[opacity,filter,transform] duration-[1150ms] ease-[cubic-bezier(.16,1,.3,1)]",
        phase === "exit"
          ? "pointer-events-none scale-[1.01] opacity-0 blur-lg"
          : "scale-100 opacity-100 blur-0",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(122,15,43,0.21),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_30%,rgba(122,15,43,0.075))]" />

      <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a0f2b]/10 blur-[100px]" />

      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/75 to-transparent" />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center">
        <div
          className={[
            "absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2",
            "transition-[opacity,filter,transform] duration-[1250ms] ease-[cubic-bezier(.16,1,.3,1)]",
            showWelcome
              ? "translate-y-[-50%] scale-100 opacity-100 blur-0"
              : "translate-y-[-52%] scale-[0.992] opacity-0 blur-md",
          ].join(" ")}
        >
          <div className="welcome-icon mx-auto mb-8 grid h-20 w-20 place-items-center rounded-[1.7rem] bg-white/[0.055] ring-1 ring-white/10 backdrop-blur-2xl">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7a0f2b]/55 shadow-[0_0_45px_rgba(122,15,43,0.32)] ring-1 ring-white/10">
              <i className="fa-solid fa-music text-lg text-white/95" />
            </div>
          </div>

          <p className="welcome-kicker text-xs font-black uppercase tracking-[0.42em] text-white/35">
            Bienvenido de nuevo
          </p>

          <h1 className="welcome-title mx-auto mt-5 max-w-3xl text-balance text-4xl font-black tracking-[-0.055em] text-white sm:text-6xl md:text-7xl">
            Hola,{" "}
            <span className="welcome-name bg-gradient-to-r from-white via-white to-white/55 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>

          <p className="welcome-subtitle mx-auto mt-5 max-w-xl text-sm leading-7 text-white/42 sm:text-base">
            Estamos preparando una experiencia musical más limpia, rápida y
            personal.
          </p>
        </div>

        <div
          className={[
            "absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2",
            "transition-[opacity,filter,transform] duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)]",
            showSignature
              ? "translate-y-[-50%] scale-100 opacity-100 blur-0"
              : "translate-y-[-47%] scale-[0.982] opacity-0 blur-md",
          ].join(" ")}
        >
          <div className="relative mx-auto w-fit">
            <div className="absolute left-1/2 top-1/2 h-44 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a0f2b]/12 blur-[58px]" />

            <svg
              className="flowy-signature relative z-10"
              viewBox="0 0 660 210"
              aria-label="Flowy"
            >
              <defs>
                <linearGradient
                  id="flowyStroke"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
                  <stop offset="58%" stopColor="rgba(255,255,255,0.98)" />
                  <stop offset="100%" stopColor="#ff7a9d" />
                </linearGradient>

                <linearGradient
                  id="flowyFill"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#dedede" />
                </linearGradient>
              </defs>

              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="flowy-shadow"
              >
                Flowy
              </text>

              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="flowy-text"
              >
                Flowy
              </text>
            </svg>

            <span className="signature-pen" aria-hidden="true">
              <span className="signature-pen-glow" />
              <i className="fa-solid fa-pen-nib" />
            </span>
          </div>

          <p
            className={[
              "mx-auto mt-3 max-w-xl text-balance text-sm leading-7 text-white/45",
              "transition-[opacity,filter,transform] delay-700 duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)]",
              showReady
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-3 opacity-0 blur-sm",
            ].join(" ")}
          >
            Tu música, tus artistas y tus gustos en un espacio diseñado para
            sentirse simple, elegante y fluido.
          </p>

          <div
            className={[
              "mx-auto mt-9 flex w-full max-w-xl items-center justify-center gap-2",
              "transition-[opacity,filter,transform] delay-1000 duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)]",
              showReady
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-4 opacity-0 blur-sm",
            ].join(" ")}
          >
            <IntroPill icon="fa-heart" label="Favoritos" />
            <IntroPill icon="fa-record-vinyl" label="Álbumes" />
            <IntroPill icon="fa-headphones" label="Escuchar" />
          </div>

          <div
            className={[
              "mx-auto mt-8 h-[3px] w-52 overflow-hidden rounded-full bg-white/8",
              "transition-opacity delay-[1400ms] duration-700",
              showReady ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            <div className="intro-progress h-full rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome-icon {
          opacity: 0;
          transform: translateY(14px) scale(0.96);
          animation: softWelcomeIn 1.15s cubic-bezier(0.16, 1, 0.3, 1) 0.2s
            forwards;
        }

        .welcome-kicker {
          opacity: 0;
          transform: translateY(10px);
          filter: blur(8px);
          animation: softWelcomeIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.38s
            forwards;
        }

        .welcome-title {
          opacity: 0;
          transform: translateY(18px) scale(0.985);
          filter: blur(10px);
          animation: titleFloatIn 1.35s cubic-bezier(0.16, 1, 0.3, 1) 0.55s
            forwards;
        }

        .welcome-name {
          background-size: 200% 100%;
          animation: nameSheen 2.8s ease 1.1s infinite alternate;
        }

        .welcome-subtitle {
          opacity: 0;
          transform: translateY(14px);
          filter: blur(8px);
          animation: softWelcomeIn 1.25s cubic-bezier(0.16, 1, 0.3, 1) 0.82s
            forwards;
        }

        .flowy-signature {
          width: min(84vw, 640px);
          height: auto;
          overflow: visible;
          filter: drop-shadow(0 24px 70px rgba(0, 0, 0, 0.42));
        }

        .flowy-shadow {
          font-family:
            "Snell Roundhand", "Apple Chancery", "Brush Script MT",
            "Segoe Script", cursive;
          font-size: 126px;
          font-weight: 400;
          letter-spacing: 0.5px;
          fill: transparent;
          stroke: rgba(255, 59, 107, 0.18);
          stroke-width: 7px;
          filter: blur(12px);
          opacity: 0;
          animation: shadowIn 1.4s ease 2.18s forwards;
        }

        .flowy-text {
          font-family:
            "Snell Roundhand", "Apple Chancery", "Brush Script MT",
            "Segoe Script", cursive;
          font-size: 126px;
          font-weight: 400;
          letter-spacing: 0.5px;
          fill: transparent;
          stroke: url(#flowyStroke);
          stroke-width: 1.55px;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1180;
          stroke-dashoffset: 1180;
          animation:
            drawFlowy 2.55s cubic-bezier(0.5, 0, 0.16, 1) 2.08s forwards,
            fillFlowy 1s ease 4.08s forwards,
            settleSignature 1.2s cubic-bezier(0.16, 1, 0.3, 1) 4.28s forwards;
        }

        .signature-pen {
          position: absolute;
          left: 3%;
          top: 54%;
          z-index: 30;
          display: grid;
          height: 44px;
          width: 44px;
          place-items: center;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.075);
          color: rgba(255, 255, 255, 0.92);
          font-size: 19px;
          opacity: 0;
          box-shadow:
            0 0 40px rgba(255, 122, 157, 0.22),
            inset 0 0 0 1px rgba(255, 255, 255, 0.11);
          backdrop-filter: blur(18px);
          transform: translateY(-50%) rotate(-24deg) scale(0.88);
          animation:
            penWriteFlowy 2.55s cubic-bezier(0.5, 0, 0.16, 1) 2.08s forwards,
            penFloatOut 0.85s cubic-bezier(0.16, 1, 0.3, 1) 4.42s forwards;
        }

        .signature-pen i {
          position: relative;
          z-index: 2;
          transform: rotate(-12deg);
          filter: drop-shadow(0 0 12px rgba(255, 122, 157, 0.34));
        }

        .signature-pen-glow {
          position: absolute;
          right: 7px;
          bottom: 6px;
          height: 12px;
          width: 12px;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 122, 157, 0.58) 40%,
            transparent 72%
          );
          filter: blur(2px);
          opacity: 0.9;
          animation: penTipPulse 0.75s ease-in-out 2.08s infinite alternate;
        }

        .intro-progress {
          width: 0%;
          animation: progressIn 1.25s cubic-bezier(0.16, 1, 0.3, 1) 5.65s
            forwards;
        }

        @keyframes softWelcomeIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes titleFloatIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.985);
            filter: blur(12px);
          }

          62% {
            opacity: 1;
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes nameSheen {
          from {
            background-position: 0% 50%;
          }

          to {
            background-position: 100% 50%;
          }
        }

        @keyframes drawFlowy {
          0% {
            stroke-dashoffset: 1180;
          }

          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fillFlowy {
          from {
            fill: transparent;
          }

          to {
            fill: url(#flowyFill);
          }
        }

        @keyframes settleSignature {
          0% {
            transform: translateY(0) scale(1);
          }

          45% {
            transform: translateY(-2px) scale(1.006);
          }

          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shadowIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes penWriteFlowy {
          0% {
            opacity: 0;
            transform: translateX(5px) translateY(-50%) rotate(-28deg)
              scale(0.86);
          }

          4% {
            opacity: 1;
          }

          11% {
            transform: translateX(58px) translateY(-100%) rotate(-13deg)
              scale(0.94);
          }

          20% {
            transform: translateX(105px) translateY(-34%) rotate(-30deg)
              scale(0.98);
          }

          30% {
            transform: translateX(165px) translateY(-82%) rotate(-15deg)
              scale(1);
          }

          39% {
            transform: translateX(230px) translateY(-48%) rotate(-24deg)
              scale(0.98);
          }

          49% {
            transform: translateX(306px) translateY(-68%) rotate(-8deg) scale(1);
          }

          59% {
            transform: translateX(370px) translateY(-42%) rotate(-28deg)
              scale(0.98);
          }

          70% {
            transform: translateX(438px) translateY(-78%) rotate(-12deg)
              scale(1);
          }

          82% {
            transform: translateX(515px) translateY(-50%) rotate(-26deg)
              scale(0.97);
          }

          94% {
            opacity: 1;
            transform: translateX(585px) translateY(-76%) rotate(-10deg)
              scale(0.96);
          }

          100% {
            opacity: 1;
            transform: translateX(615px) translateY(-62%) rotate(-18deg)
              scale(0.92);
          }
        }

        @keyframes penFloatOut {
          0% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateX(635px) translateY(-78%) rotate(-8deg)
              scale(0.86);
            filter: blur(4px);
          }
        }

        @keyframes penTipPulse {
          from {
            opacity: 0.5;
            transform: scale(0.78);
          }

          to {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @keyframes progressIn {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

function IntroPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="intro-pill flex items-center gap-2 rounded-full bg-white/[0.055] px-4 py-2.5 text-xs font-bold text-white/62 ring-1 ring-white/10 backdrop-blur-2xl">
      <i className={`fa-solid ${icon} text-[11px] text-[#ff6f95]/80`} />
      <span>{label}</span>

      <style jsx>{`
        .intro-pill {
          transition:
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.45s ease,
            color 0.45s ease;
        }

        .intro-pill:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.075);
          color: rgba(255, 255, 255, 0.82);
        }
      `}</style>
    </div>
  );
}
