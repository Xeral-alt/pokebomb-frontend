export type UserRole = "player" | "spectator";

export type Player = {
  id: string;
  username: string;
  role: UserRole;
  lives: number;
};

export type GameSettings = {
  countdownSeconds: number;
  turnSeconds: number;
  minMatches: number;
  initialLives: number;
  maxLives: number;
  healOnCorrect: boolean;
};

export type RoomStatus = "lobby" | "playing";

export type RoomState = {
  id: string;

  hostId: string;

  status: RoomStatus;

  settings: GameSettings;

  countdownPaused: boolean;
  countdownEndsAt: number | null;

  countdownRemaining: number | null;

  players: Player[];

  spectators: Player[];

  playerOrder: string[];

  currentPlayerId: string | null;

  syllable: string | null;

  turnEndsAt: number | null;

  usedPokemonCount: number;
};

export type SubmissionResultData = {
  success: boolean;

  playerId?: string;

  pokemon?: string;

  reason?: "not-pokemon" | "already-used" | "wrong-syllable" | string;
};

export type GameEndedData = {
  winnerId: string | null;

  winnerUsername: string | null;
};
