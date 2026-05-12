export const clamp = (n: number, a: number, b: number) =>
  Math.max(a, Math.min(b, n));

export const fmtTime = (sec: number) => {
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export function stripColor(strip: string) {
  switch (strip) {
    case "cyan":
      return "bg-cyan-300";
    case "amber":
      return "bg-amber-300";
    case "red":
      return "bg-red-400";
    case "pink":
      return "bg-pink-300";
    case "lime":
      return "bg-lime-300";
    case "purple":
      return "bg-violet-300";
    default:
      return "bg-[#7a0f2b]";
  }
}