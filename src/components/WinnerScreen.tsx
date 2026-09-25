import { Badge } from "./Badge";

type Props = {
  winnerName: string | null;

  countdown: number | null;

  countdownSeconds: number;

  canJoinGame: boolean;

  onJoinGame: () => void;
};

export function WinnerScreen({
  winnerName,
  countdown,
  countdownSeconds,
  canJoinGame,
  onJoinGame,
}: Props) {
  const hasCountdown = countdown !== null;

  const percentage = hasCountdown
    ? Math.min(100, Math.max(0, (countdown / countdownSeconds) * 100))
    : 0;

  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
      <Badge>Fin de partida</Badge>

      <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
        Ganador
      </p>

      <h2 className="mt-2 max-w-full break-words text-5xl font-black tracking-tight text-zinc-100 md:text-6xl">
        {winnerName ?? "Sin ganador"}
      </h2>

      <div className="relative mx-auto mt-8 flex h-52 w-52 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[3px] border-cyan-400/15" />

        <div
          className="
            absolute inset-0
            rounded-full
            border-[3px]
            border-cyan-400/70
            shadow-[0_0_35px_rgba(34,211,238,0.16)]
          "
          style={{
            clipPath: `inset(0 ${100 - percentage}% 0 0)`,
          }}
        />

        <div className="absolute inset-4 rounded-full border border-cyan-400/20 bg-cyan-400/[0.025]" />

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            Nueva partida
          </p>

          <p className="mt-1 font-mono text-5xl font-black text-cyan-300">
            {hasCountdown ? countdown : "--"}
          </p>

          <p className="mt-2 font-mono text-sm text-zinc-500">segundos</p>
        </div>
      </div>

      {canJoinGame && (
        <button
          onClick={onJoinGame}
          className="
            mt-8
            rounded-xl
            border border-cyan-400/30
            bg-cyan-400/10
            px-6 py-3
            text-sm font-black
            text-cyan-200
            transition
            hover:bg-cyan-400/15
          "
        >
          Unirse a la siguiente
        </button>
      )}
    </div>
  );
}
