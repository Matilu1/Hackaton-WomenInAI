import type { Match, Player } from "../types";

/** Simple round-robin: every player plays every other once. */
export function createRoundRobin(players: Player[], idPrefix = "rr"): Match[] {
  if (players.length < 2) {
    throw new Error("Trenger minst 2 spillere");
  }

  const matches: Match[] = [];
  let index = 0;
  for (let i = 0; i < players.length; i += 1) {
    for (let j = i + 1; j < players.length; j += 1) {
      matches.push({
        id: `${idPrefix}-${index}`,
        round: 1,
        index,
        playerAId: players[i].id,
        playerBId: players[j].id,
        winnerId: null,
        scoreA: null,
        scoreB: null,
        nextMatchId: null,
        nextSlot: null,
      });
      index += 1;
    }
  }
  return matches;
}
