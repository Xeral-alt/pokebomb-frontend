import type { RoomState } from "../types/game";

import { socket } from "../lib/socket";
import { Badge } from "./Badge";

type Props = {
  room: RoomState | null;

  countdown: number | null;

  isHost: boolean;
};

export function Lobby({ room, countdown, isHost }: Props) {
  if (!room) {
    return null;
  }

  const enoughPlayers = room.players.length >= 2;

  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
      <Badge>Sala de espera</Badge>

      <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-zinc-100">
        Prepárate para <span className="text-cyan-400">la partida.</span>
      </h2>

      <div
        className="
          relative mt-10
          flex h-44 w-44
          items-center
          justify-center
          rounded-full
          border
          border-emerald-400/30
          bg-[#0c1316]
          shadow-[0_0_50px_rgba(52,211,153,0.13)]
        "
      >
        <div className="absolute inset-3 rounded-full border-[3px] border-emerald-400/70" />

        <div className="absolute inset-7 rounded-full border border-cyan-400/20" />

        <div>
          {enoughPlayers ? (
            <>
              <div className="text-5xl font-black tabular-nums text-zinc-100">
                {countdown ?? "--"}
              </div>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                {room.countdownPaused ? "Pausado" : "Iniciando"}
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl font-black text-zinc-700">2+</div>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                Jugadores
              </p>
            </>
          )}
        </div>
      </div>

      <p className="mt-7 max-w-md text-sm leading-6 text-zinc-500">
        {enoughPlayers
          ? "La partida comenzará automáticamente cuando la cuenta llegue a cero."
          : "Se necesitan al menos dos jugadores para comenzar la cuenta regresiva."}
      </p>

      {isHost && enoughPlayers && (
        <button
          onClick={() =>
            socket.emit(
              room.countdownPaused ? "resume-countdown" : "pause-countdown",
            )
          }
          className="
              mt-6
              rounded-lg
              border border-white/[0.08]
              bg-white/[0.03]
              px-5 py-2.5
              text-xs font-bold
              text-zinc-300
              transition
              hover:bg-white/[0.06]
            "
        >
          {room.countdownPaused ? "Reanudar cuenta" : "Pausar cuenta"}
        </button>
      )}
    </div>
  );
}
