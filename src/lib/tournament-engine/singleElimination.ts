import type { Match } from "../types";

/** Largest power of two that fits the player count, capped at eight (quarterfinals). */
export function knockoutSize(playerCount: number): number {
  let size = 2;
  while (size * 2 <= Math.min(playerCount, 8)) size *= 2;
  return size;
}

/**
 * Classic bracket order so the best meets the worst: [1, 4, 2, 3] for four,
 * [1, 8, 4, 5, 2, 7, 3, 6] for eight. Pairs are read two at a time.
 */
export function bracketSeedOrder(size: number): number[] {
  let order = [1];
  while (order.length < size) {
    const next = order.length * 2;
    order = order.flatMap((seed) => [seed, next + 1 - seed]);
  }
  return order;
}

/** Empty knockout matches for every round; players are filled in later. */
export function generateKnockoutPlaceholders(size: number): Match[] {
  const matches: Match[] = [];
  let round = 1;

  for (let count = size / 2; count >= 1; count /= 2) {
    for (let slot = 0; slot < count; slot++) {
      matches.push({
        id: `ko-r${round}-m${slot + 1}`,
        round,
        playerAId: null,
        playerBId: null,
        winnerId: null,
        scoreA: null,
        scoreB: null,
        stage: "knockout",
        slot,
      });
    }
    round++;
  }

  return matches;
}
