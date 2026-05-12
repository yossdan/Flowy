"use client";

interface RadioGeneroProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function RadioGenero({
  name,
  value,
  label,
  checked,
  onChange,
}: RadioGeneroProps) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-4">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <span
        className={[
          "grid h-6 w-6 place-items-center rounded-full border transition",
          checked ? "border-white" : "border-white/40",
        ].join(" ")}
      >
        <span
          className={[
            "h-3.5 w-3.5 rounded-full transition",
            checked ? "bg-white" : "bg-transparent",
          ].join(" ")}
        />
      </span>

      <span className="text-xl font-semibold text-white/90">{label}</span>
    </label>
  );
}