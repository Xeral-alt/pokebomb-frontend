import type { SubmissionResultData } from "../types/game";

import { Badge } from "./Badge";

type Props = {
  submission: SubmissionResultData;
};

function formatPokemon(name = "") {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SubmissionResult({ submission }: Props) {
  if (submission.success) {
    return (
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-4 py-3">
        <Badge>Aceptado</Badge>

        <span className="ml-3 text-sm font-bold text-zinc-200">
          {formatPokemon(submission.pokemon)}
        </span>
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

      <span className="ml-3 text-sm text-zinc-400">
        {messages[submission.reason ?? ""] ?? "Respuesta inválida."}
      </span>
    </div>
  );
}
