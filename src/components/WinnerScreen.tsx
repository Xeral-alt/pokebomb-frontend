import { Badge } from "./Badge";

type Props = {
  winnerName: string | null;

  countdown: number | null;

  canJoinGame: boolean;

  onJoinGame: () => void;
};

export function WinnerScreen({
  winnerName,
  countdown,
  canJoinGame,
  onJoinGame,
}: Props) {
  const hasCountdown = countdown !== null;

  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
      <Badge>Fin de partida</Badge>

      <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-zinc-600">
        Ganador
      </p>

      <h2 className="mt-2 max-w-full break-words text-5xl font-black tracking-tight text-zinc-100 md:text-6xl">
        {winnerName ?? "Sin ganador"}
      </h2>

      <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
          Nueva partida
        </p>

        <p className="mt-2 font-mono text-3xl font-black text-cyan-300">
          {hasCountdown ? `${countdown}s` : "--"}
        </p>
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
