import type { Match, Player } from "../types";

/**
 * Seeded round robin (circle method). Players must be sorted by seed.
 * Round 1 pairs the best seed with the worst, second best with second worst, and so on.
 * With an odd player count one player rests each round (no match is created).
 */
export function generateRoundRobin(players: Player[]): Match[] {
  if (players.length < 2) {
    throw new Error("Round robin requires at least two players.");
  }

  const slots: (string | null)[] = players.map((player) => player.id);
  if (slots.length % 2 === 1) {
    // Rest slot in the middle so round 1 is 1 v n, 2 v n-1, … and the middle seed rests.
    slots.splice((slots.length + 1) / 2, 0, null);
  }

  const seedOf = new Map(players.map((player, index) => [player.id, index]));
  const fixed = slots[0];
  let rotating = slots.slice(1);
  const matches: Match[] = [];

  for (let round = 1; round < slots.length; round++) {
    const order = [fixed, ...rotating];
    let slot = 0;

    for (let i = 0; i < order.length / 2; i++) {
      const a = order[i];
      const b = order[order.length - 1 - i];
      if (a === null || b === null) continue;

      const [better, worse] = seedOf.get(a)! < seedOf.get(b)! ? [a, b] : [b, a];
      matches.push({
        id: `group-r${round}-m${slot + 1}`,
        round,
        playerAId: better,
        playerBId: worse,
        winnerId: null,
        scoreA: null,
        scoreB: null,
        stage: "group",
        slot,
      });
      slot++;
    }

    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, -1)];
  }

  return matches;
}

/** Players without a match in the given round (rests when the player count is odd). */
export function restingPlayers(
  players: Player[],
  matches: Match[],
  round: number,
): Player[] {
  const playing = new Set(
    matches
      .filter((match) => match.round === round)
      .flatMap((match) => [match.playerAId, match.playerBId]),
  );
  return players.filter((player) => !playing.has(player.id));
}

export type GroupStanding = {
  playerId: string;
  name: string;
  seed: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  scoreFor: number;
  scoreAgainst: number;
  points: number;
};

/**
 * Group table like a football World Cup: win 3, draw 1, loss 0.
 * Ties are broken by score difference, then score for, then seed.
 */
export function getGroupStandings(
  players: Player[],
  matches: Match[],
): GroupStanding[] {
  const table = new Map<string, GroupStanding>(
    players.map((player, index) => [
      player.id,
      {
        playerId: player.id,
        name: player.name,
        seed: index + 1,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        scoreFor: 0,
        scoreAgainst: 0,
        points: 0,
      },
    ]),
  );

  for (const match of matches) {
    if (match.scoreA === null || match.scoreB === null) continue;
    const a = match.playerAId ? table.get(match.playerAId) : undefined;
    const b = match.playerBId ? table.get(match.playerBId) : undefined;
    if (!a || !b) continue;

    a.played++;
    b.played++;
    a.scoreFor += match.scoreA;
    a.scoreAgainst += match.scoreB;
    b.scoreFor += match.scoreB;
    b.scoreAgainst += match.scoreA;

    if (match.scoreA > match.scoreB) {
      a.wins++;
      b.losses++;
      a.points += 3;
    } else if (match.scoreB > match.scoreA) {
      b.wins++;
      a.losses++;
      b.points += 3;
    } else {
      a.draws++;
      b.draws++;
      a.points++;
      b.points++;
    }
  }

  return [...table.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.scoreFor - b.scoreAgainst - (a.scoreFor - a.scoreAgainst) ||
      b.scoreFor - a.scoreFor ||
      a.seed - b.seed,
  );
}
