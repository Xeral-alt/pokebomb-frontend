import type { Player, SubmissionResultData } from "../types/game";

import { Badge } from "./Badge";

type Props = {
  submission: SubmissionResultData;

  players: Player[];
};

function formatPokemon(name = "") {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SubmissionResult({ submission, players }: Props) {
  const player = players.find((current) => current.id === submission.playerId);

  const playerName = player?.username ?? "Jugador";

  if (submission.success) {
    return (
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-3">
        <Badge>Aceptado</Badge>

        <div className="mt-2 text-sm text-zinc-400">
          <span className="font-bold text-zinc-200">{playerName}</span>

          <span> escribió </span>

          <span className="font-bold text-emerald-200">
            {formatPokemon(submission.pokemon)}
          </span>
        </div>
      </div>
    );
  }

  const messages: Record<string, string> = {
    "not-pokemon": "Ese Pokémon no existe.",

    "already-used": "Ese Pokémon ya fue usado.",

    "wrong-syllable": "El nombre no contiene el fragmento requerido.",
  };

  return (
    <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.05] px-4 py-3">
      <Badge variant="pink">Rechazado</Badge>

      <div className="mt-2 text-sm text-zinc-400">
        <span className="font-bold text-zinc-200">{playerName}</span>

        <span> escribió </span>

        <span className="font-bold text-rose-200">
          {formatPokemon(submission.pokemon)}
        </span>

        <span className="block pt-1 text-xs text-zinc-500">
          {messages[submission.reason ?? ""] ?? "Respuesta inválida."}
        </span>
      </div>
    </div>
  );
}
