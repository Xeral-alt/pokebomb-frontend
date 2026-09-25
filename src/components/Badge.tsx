import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "cyan" | "pink" | "amber" | "gray";
};

export function Badge({
  children,
  variant = "cyan",
}: Props) {
  const styles = {
    cyan:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    pink:
      "border-rose-400/20 bg-rose-400/10 text-rose-300",
    amber:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
    gray:
      "border-zinc-700 bg-zinc-800/70 text-zinc-400",
  };

  return (
    <span
      className={`
        inline-flex rounded-md border px-2 py-1
        text-[10px] font-bold uppercase tracking-[0.14em]
        ${styles[variant]}
      `}
    >
      {children}
    </span>
  );
}