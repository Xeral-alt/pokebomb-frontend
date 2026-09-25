type Props = {
  name: string;
  active?: boolean;
  spectator?: boolean;
};

export function Avatar({
  name,
  active = false,
  spectator = false,
}: Props) {
  return (
    <div
      className={`
        relative flex h-11 w-11 shrink-0
        items-center justify-center
        rounded-full border-2
        font-black uppercase

        ${
          active
            ? `
              border-emerald-400
              bg-cyan-500/20
              text-cyan-100
              shadow-[0_0_20px_rgba(52,211,153,0.35)]
            `
            : spectator
              ? "border-zinc-700 bg-zinc-800 text-zinc-400"
              : "border-cyan-500/60 bg-cyan-500/15 text-cyan-100"
        }
      `}
    >
      {name?.slice(0, 2) || "?"}

      {active && (
        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#11151a] bg-emerald-400" />
      )}
    </div>
  );
}