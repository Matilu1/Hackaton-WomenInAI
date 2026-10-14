import type { Match, Player } from "../types";

function nextPowerOfTwo(n: number) {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

function createId(prefix: string, round: number, index: number) {
  return `${prefix}-r${round}-m${index}`;
}

/** Build a single-elimination bracket. Byes fill empty slots. */
export function createSingleElimination(
  players: Player[],
  idPrefix = "m",
): Match[] {
  if (players.length < 2) {
    throw new Error("Trenger minst 2 spillere for utslagsturnering");
  }

  const bracketSize = nextPowerOfTwo(players.length);
  const roundCount = Math.log2(bracketSize);
  const slots: Array<string | null> = [
    ...players.map((player) => player.id),
    ...Array.from({ length: bracketSize - players.length }, () => null),
  ];

  const matches: Match[] = [];

  for (let round = 1; round <= roundCount; round += 1) {
    const matchCount = bracketSize / 2 ** round;
    for (let index = 0; index < matchCount; index += 1) {
      matches.push({
        id: createId(idPrefix, round, index),
        round,
        index,
        playerAId: null,
        playerBId: null,
        winnerId: null,
        scoreA: null,
        scoreB: null,
        nextMatchId: null,
        nextSlot: null,
      });
    }
  }

  for (const match of matches) {
    if (match.round >= roundCount) continue;
    const matchIndex = match.index ?? 0;
    const next = matches.find(
      (candidate) =>
        candidate.round === match.round + 1 &&
        (candidate.index ?? 0) === Math.floor(matchIndex / 2),
    );
    if (!next) continue;
    match.nextMatchId = next.id;
    match.nextSlot = matchIndex % 2 === 0 ? "A" : "B";
  }

  const roundOne = matches.filter((match) => match.round === 1);
  for (let i = 0; i < roundOne.length; i += 1) {
    roundOne[i].playerAId = slots[i * 2] ?? null;
    roundOne[i].playerBId = slots[i * 2 + 1] ?? null;

    // Auto-advance byes
    if (roundOne[i].playerAId && !roundOne[i].playerBId) {
      roundOne[i].winnerId = roundOne[i].playerAId;
    } else if (!roundOne[i].playerAId && roundOne[i].playerBId) {
      roundOne[i].winnerId = roundOne[i].playerBId;
    }
  }

  // Propagate bye winners into round 2
  for (const match of roundOne) {
    if (!match.winnerId || !match.nextMatchId || !match.nextSlot) continue;
    const next = matches.find((candidate) => candidate.id === match.nextMatchId);
    if (!next) continue;
    if (match.nextSlot === "A") next.playerAId = match.winnerId;
    else next.playerBId = match.winnerId;
  }

  return matches;
}
