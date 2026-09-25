import type { Player } from "../types/game";

import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Lives } from "./Lives";
import { Panel } from "./Panel";

type Props = {
  title: string;
  badge: string;

  users: Player[];

  currentPlayerId?: string | null;

  hostId: string;

  spectator?: boolean;
};

export function UserList({
  title,
  badge,
  users,
  currentPlayerId,
  hostId,
  spectator = false,
}: Props) {
  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-300">
            {title}
          </p>

          <p className="mt-1 text-[11px] text-zinc-600">
            {users.length === 1 ? "1 usuario" : `${users.length} usuarios`}
          </p>
        </div>

        <Badge variant={spectator ? "gray" : "cyan"}>{badge}</Badge>
      </div>

      <div className="scroll-panel max-h-[340px] space-y-2 overflow-y-auto pr-1">
        {users.map((user) => {
          const active = user.id === currentPlayerId;

          return (
            <div
              key={user.id}
              className={`
                  flex items-center
                  gap-3
                  rounded-xl
                  border
                  p-3

                  ${
                    active
                      ? `
                        border-emerald-400/20
                        bg-emerald-400/[0.04]
                      `
                      : `
                        border-white/[0.04]
                        bg-black/10
                      `
                  }
                `}
            >
              <Avatar
                name={user.username}
                active={active}
                spectator={spectator}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-zinc-200">
                    {user.username}
                  </p>

                  {user.id === hostId && (
                    <span className="text-[9px] font-bold uppercase text-amber-400">
                      Host
                    </span>
                  )}
                </div>

                {!spectator && (
                  <div className="mt-1">
                    <Lives count={user.lives} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/[0.06] px-3 py-6 text-center text-xs text-zinc-600">
            No hay nadie aquí todavía.
          </div>
        )}
      </div>
    </Panel>
  );
}
