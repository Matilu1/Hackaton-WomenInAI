import type { CategoryId } from "./categories";
import type { TournamentFormatId } from "./formats";
import type { SportId } from "./sports";

export type TournamentFormat = TournamentFormatId;

export type TournamentStatus = "draft" | "active" | "completed";

export type Player = {
  id: string;
  name: string;
};

export type MatchSlot = "A" | "B";

export type Match = {
  id: string;
  round: number;
  index: number;
  playerAId: string | null;
  playerBId: string | null;
  winnerId: string | null;
  scoreA: number | null;
  scoreB: number | null;
  nextMatchId: string | null;
  nextSlot: MatchSlot | null;
};

export type Tournament = {
  id: string;
  name: string;
  categoryId: CategoryId;
  sportId: SportId;
  format: TournamentFormat;
  status: TournamentStatus;
  players: Player[];
  matches: Match[];
  createdAt: string;
};
