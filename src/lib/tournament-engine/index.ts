import type { CategoryId } from "../categories";
import type { TournamentFormatId } from "../formats";
import type { SportId } from "../sports";
import type { Player, Tournament } from "../types";
import { createRoundRobin } from "./roundRobin";
import { createSingleElimination } from "./singleElimination";

export { createSingleElimination } from "./singleElimination";
export { createRoundRobin } from "./roundRobin";
export { setMatchWinner } from "./advanceWinner";

const DEFAULT_NAMES = [
  "Alex",
  "Blake",
  "Casey",
  "Drew",
  "Eden",
  "Finn",
  "Gray",
  "Harper",
];

export function createDefaultPlayers(count = 8): Player[] {
  return DEFAULT_NAMES.slice(0, count).map((name, index) => ({
    id: `p${index + 1}`,
    name,
  }));
}

function isBracketFormat(format: TournamentFormatId) {
  return (
    format === "elimination" ||
    format === "elimination-consolation" ||
    format === "group-playoffs" ||
    format === "swiss"
  );
}

export function createTournament(input: {
  name: string;
  categoryId: CategoryId;
  sportId: SportId;
  format: TournamentFormatId;
  players?: Player[];
}): Tournament {
  const players = input.players ?? createDefaultPlayers(8);
  const matches = isBracketFormat(input.format)
    ? createSingleElimination(players)
    : createRoundRobin(players);

  return {
    id: crypto.randomUUID(),
    name: input.name,
    categoryId: input.categoryId,
    sportId: input.sportId,
    format: input.format,
    status: "active",
    players,
    matches,
    createdAt: new Date().toISOString(),
  };
}
