import { describe, expect, it } from "vitest";
import { createDefaultPlayers, createSingleElimination, setMatchWinner } from "./index";
import type { Tournament } from "../types";

describe("createSingleElimination", () => {
  it("builds an 8-player bracket with 7 matches", () => {
    const players = createDefaultPlayers(8);
    const matches = createSingleElimination(players);
    expect(matches).toHaveLength(7);
    expect(matches.filter((match) => match.round === 1)).toHaveLength(4);
    expect(matches.filter((match) => match.round === 3)).toHaveLength(1);
  });

  it("advances a winner into the next round", () => {
    const players = createDefaultPlayers(4);
    const matches = createSingleElimination(players);
    const tournament: Tournament = {
      id: "t1",
      name: "Test",
      categoryId: "klubb",
      sportId: "fotball",
      format: "elimination",
      status: "active",
      players,
      matches,
      createdAt: new Date().toISOString(),
    };

    const first = matches.find((match) => match.round === 1 && match.index === 0);
    expect(first?.playerAId).toBeTruthy();
    const updated = setMatchWinner(tournament, first!.id, first!.playerAId!);
    const next = updated.matches.find((match) => match.id === first!.nextMatchId);
    expect(next?.playerAId).toBe(first!.playerAId);
  });
});
