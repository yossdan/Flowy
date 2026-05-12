"use client";

interface RegistroHeaderProps {
  step: number;
  progress: number;
  onBack: () => void;
}

export default function RegistroHeader({
  step,
  progress,
  onBack,
}: RegistroHeaderProps) {
  return (
    <div
      className={[
        "transition-all duration-300",
        step === 0
          ? "pointer-events-none -translate-y-2 opacity-0"
          : "translate-y-0 opacity-100",
      ].join(" ")}
    >
      <div className="mb-6 h-[3px] w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className="mb-2 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
          aria-label="Volver"
        >
          <span className="text-2xl leading-none">‹</span>
        </button>

        <div className="text-lg font-semibold text-white/70">
          Paso {step} de 3
        </div>
      </div>
    </div>
  );
}