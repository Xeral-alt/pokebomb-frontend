import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { socket } from "./lib/socket";

import {
  playCorrectSound,
  playGameOverSound,
  playTimeoutSound,
  playWrongSound,
  playYourTurnSound,
  unlockAudio,
} from "./lib/sounds";

import type {
  GameEndedData,
  GameSettings,
  RoomState,
  SubmissionResultData,
} from "./types/game";

import { Badge } from "./components/Badge";
import { Game } from "./components/Game";
import { Leaderboard } from "./components/Leaderboard";
import { Lobby } from "./components/Lobby";
import { Page } from "./components/Page";
import { Panel } from "./components/Panel";
import { Settings } from "./components/Settings";
import { Stat } from "./components/Stat";
import { UserList } from "./components/UserList";
import { WinnerScreen } from "./components/WinnerScreen";

function getRoomIdFromUrl() {
  const parts = window.location.pathname.split("/").filter(Boolean);

  if (parts[0] === "room" && parts[1]) {
    return parts[1];
  }

  return null;
}

function createRoomId() {
  return crypto.randomUUID().slice(0, 8);
}

type JoinResponse = {
  ok: boolean;
  message?: string;
};

type TurnResult = {
  success: boolean;
  playerId: string;
  reason?: string;
};

export default function App() {
  const initialRoomId = useMemo(() => getRoomIdFromUrl(), []);

  const [roomId, setRoomId] = useState<string | null>(initialRoomId);

  const [username, setUsername] = useState("");

  const [joined, setJoined] = useState(false);

  const [joining, setJoining] = useState(false);

  const [joinError, setJoinError] = useState<string | null>(null);

  const [connected, setConnected] = useState(socket.connected);

  const [room, setRoom] = useState<RoomState | null>(null);

  const [pokemon, setPokemon] = useState("");

  const [submission, setSubmission] = useState<SubmissionResultData | null>(
    null,
  );

  const [gameEnded, setGameEnded] = useState<GameEndedData | null>(null);

  const [now, setNow] = useState(() => Date.now());

  const previousPlayerId = useRef<string | null>(null);

  const previousStatus = useRef<RoomState["status"] | null>(null);

  const notifyYourTurn = useCallback(() => {
    if (
      !("Notification" in window) ||
      Notification.permission !== "granted" ||
      (!document.hidden && document.hasFocus())
    ) {
      return;
    }

    const notification = new Notification("Es tu turno en PokémonBomb", {
      body: "Escribe un Pokémon antes de que termine el tiempo.",
      tag: roomId ? `pokebomb-${roomId}-turn` : "pokebomb-turn",
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }, [roomId]);

  /*
   * Actualiza timers visuales.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /*
   * Socket listeners globales.
   */
  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onRoomState(value: RoomState) {
      setRoom(value);
    }

    function onSubmission(value: SubmissionResultData) {
      setSubmission(value);

      if (value.success) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }

    function onGameStarted() {
      setSubmission(null);
      setGameEnded(null);
    }

    function onTurnResult(value: TurnResult) {
      if (value.reason !== "timeout") {
        return;
      }

      /*
       * Si el turno termina por tiempo,
       * solo limpiamos el input. El último
       * intento queda visible hasta que
       * alguien envíe otro.
       */
      setPokemon("");

      if (value.playerId === socket.id) {
        playTimeoutSound();
      }
    }

    function onGameEnded(value: GameEndedData) {
      /*
       * Reset completo del estado
       * visual de la partida.
       */
      setPokemon("");
      setSubmission(null);
      setGameEnded(value);

      previousPlayerId.current = null;

      previousStatus.current = "lobby";

      playGameOverSound();
    }

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("room-state", onRoomState);

    socket.on("submission-result", onSubmission);

    socket.on("game-started", onGameStarted);

    socket.on("turn-result", onTurnResult);

    socket.on("game-ended", onGameEnded);

    return () => {
      socket.off("connect", onConnect);

      socket.off("disconnect", onDisconnect);

      socket.off("room-state", onRoomState);

      socket.off("submission-result", onSubmission);

      socket.off("game-started", onGameStarted);

      socket.off("turn-result", onTurnResult);

      socket.off("game-ended", onGameEnded);

      socket.disconnect();
    };
  }, []);

  /*
   * Detectar cambio de turno.
   *
   * Cuando cambia currentPlayerId:
   * - limpia input
   * - conserva el último intento visible
   * - reproduce sonido si ahora es nuestro turno
   */
  useEffect(() => {
    if (!room) {
      return;
    }

    const currentId = room.currentPlayerId;

    const previousId = previousPlayerId.current;

    if (previousId !== null && currentId !== previousId) {
      setPokemon("");
    }

    if (currentId && currentId !== previousId && currentId === socket.id) {
      playYourTurnSound();
      notifyYourTurn();
    }

    previousPlayerId.current = currentId;
  }, [room, notifyYourTurn]);

  /*
   * Protección adicional:
   * si pasamos de playing -> lobby,
   * limpiamos todo aunque por algún
   * motivo no haya llegado game-ended.
   */
  useEffect(() => {
    if (!room) {
      return;
    }

    if (room.status === "lobby" && previousStatus.current === "playing") {
      setPokemon("");
      setSubmission(null);

      previousPlayerId.current = null;
    }

    previousStatus.current = room.status;
  }, [room]);

  async function requestTurnNotificationPermission() {
    if (!("Notification" in window) || Notification.permission !== "default") {
      return;
    }

    try {
      await Notification.requestPermission();
    } catch {
      // Las notificaciones son opcionales.
    }
  }

  function createRoom() {
    const id = createRoomId();

    window.history.pushState({}, "", `/room/${id}`);

    setRoomId(id);

    /*
     * Por seguridad, si veníamos
     * de otra sala en esta sesión.
     */
    setJoined(false);
    setJoining(false);
    setRoom(null);
    setPokemon("");
    setSubmission(null);
    setGameEnded(null);
    setJoinError(null);
  }

  async function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanUsername = username.trim().replace(/\s+/g, " ");

    if (!cleanUsername || !roomId || joining) {
      return;
    }

    setJoinError(null);
    setJoining(true);

    /*
     * Los navegadores bloquean Web Audio
     * hasta que existe interacción del usuario.
     * El click/submit de "Entrar" es un buen
     * momento para desbloquearlo.
     */
    try {
      await unlockAudio();
      await requestTurnNotificationPermission();
    } catch {
      // El juego puede seguir funcionando
      // aunque audio o notificaciones fallen.
    }

    const emitJoin = () => {
      socket.emit(
        "join-room",
        {
          roomId,
          username: cleanUsername,
        },
        (response: JoinResponse) => {
          setJoining(false);

          if (!response?.ok) {
            setJoinError(response?.message ?? "No se pudo entrar a la sala.");

            return;
          }

          /*
           * No ponemos room manualmente.
           * Esperamos el room-state
           * del backend.
           */
          setRoom(null);
          setGameEnded(null);
          setJoined(true);
        },
      );
    };

    if (socket.connected) {
      emitJoin();
      return;
    }

    socket.connect();

    socket.once("connect", emitJoin);
  }

  function submitPokemon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = pokemon.trim();

    if (!value || !isMyTurn) {
      return;
    }

    /*
     * Reset inmediato.
     *
     * No esperamos a que el servidor
     * responda para limpiar el input.
     */
    setPokemon("");
    setSubmission(null);

    socket.emit("submit-pokemon", {
      pokemon: value,
    });
  }

  function updateSetting<K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K],
  ) {
    socket.emit("update-settings", {
      [key]: value,
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      console.error("No se pudo copiar el enlace.");
    }
  }

  /*
   * Datos derivados de room.
   */

  const roomUsers = room ? [...room.players, ...room.spectators] : [];

  const me = roomUsers.find((user) => user.id === socket.id);

  const isHost = room?.hostId === socket.id;

  const currentPlayer = room?.players.find(
    (player) => player.id === room.currentPlayerId,
  );

  const isMyTurn = room?.currentPlayerId === socket.id;

  const countdown = room?.countdownEndsAt
    ? Math.max(0, Math.ceil((room.countdownEndsAt - now) / 1000))
    : (room?.countdownRemaining ?? null);

  const turnTime = room?.turnEndsAt
    ? Math.max(0, (room.turnEndsAt - now) / 1000)
    : 0;

  /*
   * HOME
   */

  if (!roomId) {
    return (
      <Page>
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-5">
          <Panel accent className="w-full p-8">
            <Badge>Multijugador</Badge>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-zinc-100">
              Pokémon
              <span className="text-cyan-400">Bomb.</span>
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
              Piensa rápido. Encuentra un Pokémon que contenga el fragmento
              antes de que se acabe el tiempo.
            </p>

            <button
              onClick={createRoom}
              className="
                mt-8 w-full
                rounded-xl
                border border-cyan-400/30
                bg-cyan-400/10
                px-5 py-3
                text-sm font-bold
                text-cyan-200
                transition
                hover:bg-cyan-400/15
              "
            >
              Crear sala
            </button>
          </Panel>
        </div>
      </Page>
    );
  }

  /*
   * JOIN SCREEN
   */

  if (!joined) {
    return (
      <Page>
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-5">
          <Panel accent className="w-full p-8">
            <Badge>Sala {roomId}</Badge>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-zinc-100">
              Entrar a la sala
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Elige un nombre de jugador.
            </p>

            <form onSubmit={joinRoom} className="mt-7">
              <input
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);

                  if (joinError) {
                    setJoinError(null);
                  }
                }}
                maxLength={20}
                autoFocus
                disabled={joining}
                placeholder="Nombre"
                className="
                  w-full rounded-xl
                  border border-white/[0.08]
                  bg-[#0c1014]
                  px-4 py-3
                  text-sm text-zinc-200
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-cyan-400/40
                  focus:ring-4
                  focus:ring-cyan-400/5
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              />

              {joinError && (
                <div className="mt-3 rounded-lg border border-rose-400/20 bg-rose-400/[0.05] px-3 py-2 text-xs text-rose-300">
                  {joinError}
                </div>
              )}

              <button
                type="submit"
                disabled={!username.trim() || joining}
                className="
                  mt-3 w-full
                  rounded-xl
                  bg-cyan-400
                  px-5 py-3
                  text-sm font-black
                  text-[#071013]
                  transition
                  hover:bg-cyan-300
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                {joining ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </Panel>
        </div>
      </Page>
    );
  }

  /*
   * LOADING ROOM
   *
   * joined puede ser true antes
   * de recibir el primer room-state.
   */

  if (!room) {
    return (
      <Page>
        <div className="flex min-h-screen items-center justify-center px-5">
          <Panel accent className="w-full max-w-sm p-8 text-center">
            <Badge>Sala {roomId}</Badge>

            <div className="mx-auto mt-7 h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

            <p className="mt-5 text-sm font-semibold text-zinc-400">
              Conectando a la sala...
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Estableciendo conexión en tiempo real.
            </p>
          </Panel>
        </div>
      </Page>
    );
  }

  /*
   * ROOM
   */

  return (
    <Page>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-7">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge>Sala {roomId}</Badge>

              <Badge variant={connected ? "cyan" : "pink"}>
                {connected ? "Conectado" : "Desconectado"}
              </Badge>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight">
              Pokémon
              <span className="text-cyan-400">Bomb.</span>
            </h1>
          </div>

          <button
            onClick={copyLink}
            className="
              rounded-lg
              border border-white/[0.08]
              bg-white/[0.03]
              px-4 py-2
              text-xs font-bold
              text-zinc-400
              transition
              hover:bg-white/[0.06]
              hover:text-zinc-200
            "
          >
            Copiar invitación
          </button>
        </header>

        <div className="grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)_290px]">
          {/* LEFT */}

          <div className="space-y-5">
            <UserList
              title="Jugadores"
              badge="En partida"
              users={room.players}
              currentPlayerId={room.currentPlayerId}
              hostId={room.hostId}
            />

            <UserList
              title="Espectadores"
              badge="Esperando"
              users={room.spectators}
              hostId={room.hostId}
              spectator
            />

            {room.status === "lobby" && (
              <Panel className="p-4">
                {me?.role === "player" ? (
                  <button
                    onClick={() => {
                      setPokemon("");

                      setSubmission(null);

                      socket.emit("leave-game");
                    }}
                    className="
                      w-full
                      rounded-lg
                      border border-rose-400/20
                      bg-rose-400/5
                      py-2.5
                      text-xs font-bold
                      text-rose-300
                      transition
                      hover:bg-rose-400/10
                    "
                  >
                    Salir de jugadores
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setPokemon("");

                      setSubmission(null);

                      socket.emit("join-game");
                    }}
                    className="
                      w-full
                      rounded-lg
                      border border-cyan-400/20
                      bg-cyan-400/10
                      py-2.5
                      text-xs font-bold
                      text-cyan-200
                      transition
                      hover:bg-cyan-400/15
                    "
                  >
                    Unirse a la partida
                  </button>
                )}
              </Panel>
            )}
          </div>

          {/* CENTER */}

          <Panel accent className="min-h-[580px] p-5 md:p-8">
            {room.status === "playing" ? (
              <Game
                room={room}
                currentPlayer={currentPlayer}
                isMyTurn={isMyTurn}
                turnTime={turnTime}
                pokemon={pokemon}
                setPokemon={setPokemon}
                submitPokemon={submitPokemon}
                submission={submission}
              />
            ) : gameEnded ? (
              <WinnerScreen
                winnerName={gameEnded.winnerUsername}
                countdown={countdown}
                countdownSeconds={room.settings.countdownSeconds}
                canJoinGame={me?.role !== "player"}
                onJoinGame={() => {
                  setPokemon("");

                  setSubmission(null);

                  socket.emit("join-game");
                }}
              />
            ) : (
              <Lobby room={room} countdown={countdown} isHost={isHost} />
            )}
          </Panel>

          {/* RIGHT */}

          <div className="space-y-5">
            {isHost && room.status === "lobby" && (
              <Settings room={room} updateSetting={updateSetting} />
            )}

            <Leaderboard
              users={roomUsers}
              currentPlayerId={room.currentPlayerId}
            />

            <Panel className="p-5">
              <Badge variant="gray">Partida</Badge>

              <div className="mt-5 space-y-4">
                <Stat label="Pokémon usados" value={room.usedPokemonCount} />

                <Stat label="Jugadores" value={room.players.length} />

                <Stat
                  label="Coincidencias mínimas"
                  value={room.settings.minMatches}
                />
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </Page>
  );
}
