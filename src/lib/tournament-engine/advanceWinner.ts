import type { Match, Tournament } from "../types";

function placeWinner(match: Match, slot: "A" | "B", playerId: string): Match {
  if (slot === "A") return { ...match, playerAId: playerId };
  return { ...match, playerBId: playerId };
}

function clearDownstream(matches: Match[], fromMatchId: string): Match[] {
  const byId = new Map(matches.map((match) => [match.id, match]));
  const start = byId.get(fromMatchId);
  if (!start?.nextMatchId || !start.nextSlot) return matches;

  const queue: Array<{ matchId: string; slot: "A" | "B" }> = [
    { matchId: start.nextMatchId, slot: start.nextSlot },
  ];
  const updated = new Map(byId);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    const match = updated.get(current.matchId);
    if (!match) continue;

    const cleared: Match = {
      ...match,
      playerAId: current.slot === "A" ? null : match.playerAId,
      playerBId: current.slot === "B" ? null : match.playerBId,
      winnerId: null,
      scoreA: null,
      scoreB: null,
    };
    updated.set(match.id, cleared);

    if (match.nextMatchId && match.nextSlot) {
      queue.push({ matchId: match.nextMatchId, slot: match.nextSlot });
    }
  }

  return [...updated.values()];
}

/** Set the winner of a match and advance them in the bracket. */
export function setMatchWinner(
  tournament: Tournament,
  matchId: string,
  winnerId: string,
): Tournament {
  const match = tournament.matches.find((item) => item.id === matchId);
  if (!match) throw new Error("Fant ikke kampen");
  if (winnerId !== match.playerAId && winnerId !== match.playerBId) {
    throw new Error("Vinneren må være en av spillerne i kampen");
  }
  if (!match.playerAId || !match.playerBId) {
    throw new Error("Kampen er ikke klar ennå");
  }

  let matches = clearDownstream(tournament.matches, matchId).map((item) =>
    item.id === matchId ? { ...item, winnerId } : item,
  );

  const updated = matches.find((item) => item.id === matchId);
  if (updated?.nextMatchId && updated.nextSlot) {
    matches = matches.map((item) =>
      item.id === updated.nextMatchId
        ? placeWinner(item, updated.nextSlot!, winnerId)
        : item,
    );
  }

  const final = matches.find((item) => item.nextMatchId === null);
  const completed = Boolean(final?.winnerId);

  return {
    ...tournament,
    matches,
    status: completed ? "completed" : "active",
  };
}
