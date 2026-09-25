import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Page({ children }: Props) {
  return (
    <main
      className="
        min-h-screen
        bg-[#090c0f]
        text-zinc-200
        bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
        bg-[size:32px_32px]
      "
    >
      <div className="min-h-screen bg-[radial-gradient(circle_at_50%_25%,rgba(20,184,166,0.06),transparent_30%)]">
        {children}
      </div>
    </main>
  );
}