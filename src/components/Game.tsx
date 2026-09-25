import {
  useEffect,
  useRef,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

import type { Player, RoomState, SubmissionResultData } from "../types/game";

import { Badge } from "./Badge";
import { SubmissionResult } from "./SubmissionResult";

type Props = {
  room: RoomState;

  currentPlayer: Player | undefined;

  isMyTurn: boolean;

  turnTime: number;

  pokemon: string;

  setPokemon: Dispatch<SetStateAction<string>>;

  submitPokemon: (event: FormEvent<HTMLFormElement>) => void;

  submission: SubmissionResultData | null;
};

export function Game({
  room,
  currentPlayer,
  isMyTurn,
  turnTime,
  pokemon,
  setPokemon,
  submitPokemon,
  submission,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const percentage = Math.min(
    100,
    Math.max(0, (turnTime / room.settings.turnSeconds) * 100),
  );

  /*
   * Cuando comienza nuestro turno,
   * enfocamos automáticamente el input.
   */
  useEffect(() => {
    if (!isMyTurn) {
      return;
    }

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
  }, [isMyTurn, room.currentPlayerId]);

  return (
    <div className="flex min-h-[520px] flex-col">
      <div className="text-center">
        <Badge>Turno activo</Badge>

        <p className="mt-5 text-sm text-zinc-500">
          {isMyTurn
            ? "Tu turno"
            : `${currentPlayer?.username ?? "Jugador"} está pensando`}
        </p>

        <div className="relative mx-auto mt-7 flex h-52 w-52 items-center justify-center">
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
              Fragmento
            </p>

            <p className="mt-1 text-7xl font-black uppercase tracking-[-0.06em] text-cyan-300">
              {room.syllable ?? "--"}
            </p>

            <p className="mt-2 font-mono text-sm text-zinc-500">
              {turnTime.toFixed(1)}s
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {submission && (
          <SubmissionResult
            submission={submission}
            players={[...room.players, ...room.spectators]}
          />
        )}

        <form onSubmit={submitPokemon} className="mt-4">
          <div
            className={`
              flex rounded-xl
              border
              bg-[#0b0f12]
              p-1.5

              ${
                isMyTurn
                  ? `
                    border-cyan-400/30
                    shadow-[0_0_25px_rgba(34,211,238,0.05)]
                  `
                  : "border-white/[0.06]"
              }
            `}
          >
            <input
              ref={inputRef}
              value={pokemon}
              onChange={(event) => setPokemon(event.target.value)}
              disabled={!isMyTurn}
              autoComplete="off"
              spellCheck={false}
              placeholder={
                isMyTurn
                  ? `Pokémon que contenga "${room.syllable}"...`
                  : "Esperando tu turno..."
              }
              className="
                min-w-0 flex-1
                bg-transparent
                px-3 py-2
                text-sm
                font-semibold
                text-zinc-200
                outline-none
                placeholder:text-zinc-700
                disabled:cursor-not-allowed
              "
            />

            <button
              type="submit"
              disabled={!isMyTurn || !pokemon.trim()}
              className="
                rounded-lg
                bg-cyan-400
                px-5 py-2
                text-xs
                font-black
                text-[#061014]
                transition
                hover:bg-cyan-300
                disabled:bg-zinc-800
                disabled:text-zinc-600
              "
            >
              ENVIAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
