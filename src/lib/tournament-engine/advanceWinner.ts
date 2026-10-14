import type { Match } from "../types";

/**
 * Puts the winner of a knockout match into the next round:
 * slot s feeds slot floor(s / 2), as player A when s is even and player B when odd.
 */
export function advanceWinner(matches: Match[], match: Match): Match[] {
  if (match.stage !== "knockout" || match.slot === undefined || !match.winnerId) {
    return matches;
  }

  const nextSlot = Math.floor(match.slot / 2);
  const side = match.slot % 2 === 0 ? "playerAId" : "playerBId";

  return matches.map((candidate) =>
    candidate.stage === "knockout" &&
    candidate.round === match.round + 1 &&
    candidate.slot === nextSlot
      ? { ...candidate, [side]: match.winnerId }
      : candidate,
  );
}
