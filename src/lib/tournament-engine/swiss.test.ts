
import { describe, expect, it } from "vitest";
import type { Player } from "../types";
import {
  generateSwissRound,
  getSwissStandings,
  recordSwissResult,
} from "./swiss";

const players: Player[] = Array.from({ length: 8 }, (_, i) => ({
  id: `player-${i + 1}`,
  name: `Player ${i + 1}`,
}));

describe("Swiss Stage", () => {
  it("generates four matches for eight players", () => {
    const round1 = generateSwissRound(players, []);

    expect(round1).toHaveLength(4);
    expect(round1.every((match) => match.round === 1)).toBe(true);

    const participantIds = round1.flatMap((match) => [
      match.playerAId,
      match.playerBId,
    ]);

    expect(new Set(participantIds).size).toBe(8);
  });

  it("updates standings after recording results", () => {
    const round1 = generateSwissRound(players, []);

    const completed = round1.map((match) =>
      recordSwissResult([match], match.id, 2, 1)[0],
    );

    const standings = getSwissStandings(players, completed);

    expect(standings.filter((player) => player.points === 1)).toHaveLength(4);
    expect(standings.filter((player) => player.points === 0)).toHaveLength(4);
  });

  it("does not generate the next round before the current one is finished", () => {
    const round1 = generateSwissRound(players, []);

    expect(() => generateSwissRound(players, round1)).toThrow();
  });

  it("generates round two without rematches", () => {
    const round1 = generateSwissRound(players, []);

    const completed = round1.map((match) =>
      recordSwissResult([match], match.id, 2, 1)[0],
    );

    const round2 = generateSwissRound(players, completed);

    expect(round2).toHaveLength(4);
    expect(round2.every((match) => match.round === 2)).toBe(true);

    const pairs = new Set(
      round1.map((match) =>
        [match.playerAId, match.playerBId].sort().join(":"),
      ),
    );

    for (const match of round2) {
      const pair = [match.playerAId, match.playerBId].sort().join(":");
      expect(pairs.has(pair)).toBe(false);
    }
  });
});
