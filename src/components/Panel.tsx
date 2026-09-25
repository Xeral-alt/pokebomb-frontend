import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  accent?: boolean;
};

export function Panel({
  children,
  className = "",
  accent = false,
}: Props) {
  return (
    <div
      className={`
        rounded-2xl border
        bg-[#11151a]/95
        shadow-[0_15px_60px_rgba(0,0,0,0.25)]
        ${
          accent
            ? "border-cyan-400/20 shadow-[0_0_45px_rgba(34,211,238,0.04)]"
            : "border-white/[0.06]"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}