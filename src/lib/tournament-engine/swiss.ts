
import type { Match, Player } from "../types";

export type SwissStanding = {
  playerId: string;
  name: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  played: number;
};

/**
 * Calculates standings from completed matches.
 * Win = 1 point, draw = 0.5, loss = 0.
 */
export function getSwissStandings(
  players: Player[],
  matches: Match[],
): SwissStanding[] {
  const standings = new Map<string, SwissStanding>();

  for (const player of players) {
    standings.set(player.id, {
      playerId: player.id,
      name: player.name,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      played: 0,
    });
  }

  for (const match of matches) {
    // A bye gives the player one point.
    if (match.playerAId && match.playerBId === null && match.winnerId === match.playerAId) {
    const player = standings.get(match.playerAId);
    if (player) {
        player.points += 1;
        player.wins += 1;
    }
    continue;
    }
    if (
      match.playerAId === null ||
      match.playerBId === null ||
      match.scoreA === null ||
      match.scoreB === null
    ) {
      continue;
    }

    const a = standings.get(match.playerAId);
    const b = standings.get(match.playerBId);
    if (!a || !b) continue;

    a.played++;
    b.played++;

    if (match.scoreA > match.scoreB) {
      a.wins++;
      b.losses++;
      a.points++;
    } else if (match.scoreB > match.scoreA) {
      b.wins++;
      a.losses++;
      b.points++;
    } else {
      a.draws++;
      b.draws++;
      a.points += 0.5;
      b.points += 0.5;
    }
  }

  return [...standings.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.wins - a.wins ||
      a.name.localeCompare(b.name),
  );
}

/**
 * Generates a Swiss round.
 * Players with similar points are paired.
 * Rematches are avoided whenever possible.
 */
export function generateSwissRound(
  players: Player[],
  matches: Match[],
): Match[] {
  if (players.length < 2) {
    throw new Error("Swiss requires at least two players.");
  }

  const lastRound = Math.max(0, ...matches.map((m) => m.round));

  if (
    matches.some(
      (m) =>
        m.round === lastRound &&
        (m.scoreA === null || m.scoreB === null)
    )
  ) {
    throw new Error("Finish the current round first.");
  }

  const standings = getSwissStandings(players, matches);
  const opponents = new Set<string>();

  for (const match of matches) {
    if (match.playerAId && match.playerBId) {
      opponents.add(
        [match.playerAId, match.playerBId].sort().join(":"),
      );
    }
  }

  const remaining = [...standings];
  const newMatches: Match[] = [];
  const round = lastRound + 1;

  while (remaining.length >= 2) {
    const first = remaining.shift()!;

    let opponentIndex = remaining.findIndex(
      (candidate) =>
        !opponents.has(
          [first.playerId, candidate.playerId].sort().join(":"),
        ),
    );

    if (opponentIndex === -1) opponentIndex = 0;

    const opponent = remaining.splice(opponentIndex, 1)[0];

    newMatches.push({
      id: crypto.randomUUID(),
      round,
      playerAId: first.playerId,
      playerBId: opponent.playerId,
      winnerId: null,
      scoreA: null,
      scoreB: null,
    });
  }

  // Odd player count: one player gets a bye.
  // Represented as a completed match without an opponent.
  if (remaining.length === 1) {
    const player = remaining[0];

    newMatches.push({
      id: crypto.randomUUID(),
      round,
      playerAId: player.playerId,
      playerBId: null,
      winnerId: player.playerId,
      scoreA: 1,
      scoreB: 0,
    });
  }

  return newMatches;
}

/** Records the result of a Swiss match. */
export function recordSwissResult(
  matches: Match[],
  matchId: string,
  scoreA: number,
  scoreB: number,
): Match[] {
  if (
    !Number.isFinite(scoreA) ||
    !Number.isFinite(scoreB) ||
    scoreA < 0 ||
    scoreB < 0
  ) {
    throw new Error("Scores must be non-negative numbers.");
  }

  return matches.map((match) => {
    if (match.id !== matchId) return match;

    if (!match.playerAId || !match.playerBId) {
      throw new Error("Cannot record a result for a bye.");
    }

    return {
      ...match,
      scoreA,
      scoreB,
      winnerId:
        scoreA === scoreB
          ? null
          : scoreA > scoreB
            ? match.playerAId
            : match.playerBId,
    };
  });
}
