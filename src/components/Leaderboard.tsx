import type { Player } from "../types/game";

import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Panel } from "./Panel";

type Props = {
  users: Player[];

  currentPlayerId?: string | null;
};

export function Leaderboard({ users, currentPlayerId }: Props) {
  const ranking = [...users].sort((first, second) => {
    const wins = second.gamesWon - first.gamesWon;

    if (wins !== 0) {
      return wins;
    }

    return first.username.localeCompare(second.username, "es");
  });

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
            Leaderboard
          </p>

          <p className="mt-1 text-[11px] text-zinc-600">Partidas ganadas</p>
        </div>

        <Badge variant="cyan">Victorias</Badge>
      </div>

      <div className="scroll-panel mt-5 max-h-[320px] space-y-2 overflow-y-auto pr-1">
        {ranking.map((user, index) => {
          const active = user.id === currentPlayerId;

          return (
            <div
              key={user.id}
              className={`
                flex items-center gap-3
                rounded-xl border p-3

                ${
                  index === 0 && user.gamesWon > 0
                    ? "border-amber-400/25 bg-amber-400/[0.06]"
                    : "border-white/[0.04] bg-black/10"
                }
              `}
            >
              <div className="w-6 shrink-0 text-center font-mono text-xs font-black text-zinc-500">
                #{index + 1}
              </div>

              <Avatar
                name={user.username}
                active={active}
                spectator={user.role === "spectator"}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-zinc-200">
                  {user.username}
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  {user.gamesWon === 1
                    ? "1 partida ganada"
                    : `${user.gamesWon} partidas ganadas`}
                </p>
              </div>

              <div className="font-mono text-xl font-black text-cyan-300">
                {user.gamesWon}
              </div>
            </div>
          );
        })}

        {ranking.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/[0.06] px-3 py-6 text-center text-xs text-zinc-600">
            Todavía no hay jugadores.
          </div>
        )}
      </div>
    </Panel>
  );
}
