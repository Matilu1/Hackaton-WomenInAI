import type { EventModeId } from "./modes";

/** Supported tournament bracket / pairing formats. */
export type TournamentFormat =
  | "single-elimination"
  | "round-robin"
  | "swiss";

export type TournamentStatus = "draft" | "active" | "completed";

export type Player = {
  id: string;
  name: string;
};

export type Match = {
  id: string;
  round: number;
  playerAId: string | null;
  playerBId: string | null;
  winnerId: string | null;
  scoreA: number | null;
  scoreB: number | null;
};

export type Tournament = {
  id: string;
  name: string;
  mode: EventModeId;
  format: TournamentFormat;
  status: TournamentStatus;
  players: Player[];
  matches: Match[];
  createdAt: string;
};
