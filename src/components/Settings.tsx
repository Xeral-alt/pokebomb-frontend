import type { GameSettings, RoomState } from "../types/game";

import { Badge } from "./Badge";
import { NumberSetting } from "./NumberSetting";
import { Panel } from "./Panel";

type Props = {
  room: RoomState;

  updateSetting: <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K],
  ) => void;
};

export function Settings({ room, updateSetting }: Props) {
  const settings = room.settings;

  return (
    <Panel className="p-5">
      <div>
        <Badge variant="amber">Host</Badge>

        <h3 className="mt-3 text-sm font-black uppercase tracking-[0.13em]">
          Configuración
        </h3>
      </div>

      <div className="mt-6 space-y-5">
        <NumberSetting
          label="Cuenta para iniciar"
          value={settings.countdownSeconds}
          suffix="seg"
          min={1}
          max={120}
          onChange={(value) => updateSetting("countdownSeconds", value)}
        />

        <NumberSetting
          label="Duración del turno"
          value={settings.turnSeconds}
          suffix="seg"
          min={2}
          max={120}
          onChange={(value) => updateSetting("turnSeconds", value)}
        />

        <NumberSetting
          label="Coincidencias mínimas"
          value={settings.minMatches}
          min={1}
          onChange={(value) => updateSetting("minMatches", value)}
        />

        <NumberSetting
          label="Vidas iniciales"
          value={settings.initialLives}
          min={1}
          max={settings.maxLives}
          onChange={(value) => updateSetting("initialLives", value)}
        />

        <NumberSetting
          label="Vidas máximas"
          value={settings.maxLives}
          min={1}
          max={20}
          onChange={(value) => updateSetting("maxLives", value)}
        />

        <label
          className="
            flex cursor-pointer
            items-center
            justify-between
            rounded-xl
            border
            border-white/[0.05]
            bg-black/10
            p-3
          "
        >
          <div className="pr-4">
            <p className="text-xs font-bold text-zinc-300">Curar al acertar</p>

            <p className="mt-1 text-[10px] leading-4 text-zinc-600">
              Recupera una vida al ingresar un Pokémon válido.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.healOnCorrect}
            onChange={(event) =>
              updateSetting("healOnCorrect", event.target.checked)
            }
            className="h-4 w-4 shrink-0 accent-cyan-400"
          />
        </label>
      </div>
    </Panel>
  );
}
