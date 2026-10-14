import { describe, expect, it } from "vitest";
import type { Player, Tournament } from "../types";
import {
  champion,
  createGroupPlayoffsTournament,
  groupMatches,
  knockoutMatches,
  nextMatch,
  recordResult,
  undoLastResult,
} from "./groupPlayoffs";
import { generateRoundRobin, getGroupStandings, restingPlayers } from "./roundRobin";
import { bracketSeedOrder } from "./singleElimination";

// Entered in a different order than their rating on purpose.
const players: Player[] = [
  { id: "malin", name: "Malin", rating: 1200 },
  { id: "matilde", name: "Matilde", rating: 1500 },
  { id: "lona", name: "Lona", rating: 900 },
  { id: "stella", name: "Stella", rating: 1350 },
  { id: "tuva", name: "Tuva", rating: 1100 },
];

function create(): Tournament {
  return createGroupPlayoffsTournament({
    id: "t1",
    name: "Bordtennis",
    categoryId: "internoppjor",
    sportId: "bordtennis",
    format: "round-robin",
    players,
    createdAt: "2026-10-14T12:00:00.000Z",
  });
}

/** Plays every pending match in order; the better seed (player A) wins 3–1. */
function playAll(tournament: Tournament): Tournament {
  let current = tournament;
  for (let match = nextMatch(current); match; match = nextMatch(current)) {
    current = recordResult(current, match.id, 3, 1);
  }
  return current;
}

describe("generateRoundRobin", () => {
  it("lets everyone meet everyone exactly once", () => {
    const matches = generateRoundRobin(create().players);
    expect(matches).toHaveLength(10);
    const pairs = matches.map((m) => [m.playerAId, m.playerBId].sort().join("-"));
    expect(new Set(pairs).size).toBe(10);
  });

  it("starts with best v worst and rests one player per round", () => {
    const seeded = create().players;
    expect(seeded.map((p) => p.id)).toEqual([
      "matilde",
      "stella",
      "malin",
      "tuva",
      "lona",
    ]);

    const matches = generateRoundRobin(seeded);
    const round1 = matches.filter((m) => m.round === 1);
    expect(round1.map((m) => [m.playerAId, m.playerBId])).toEqual([
      ["matilde", "lona"],
      ["stella", "tuva"],
    ]);
    expect(restingPlayers(seeded, matches, 1).map((p) => p.id)).toEqual(["malin"]);
    for (let round = 1; round <= 5; round++) {
      expect(restingPlayers(seeded, matches, round)).toHaveLength(1);
    }
  });
});

describe("bracketSeedOrder", () => {
  it("pairs best with worst", () => {
    expect(bracketSeedOrder(4)).toEqual([1, 4, 2, 3]);
    expect(bracketSeedOrder(8)).toEqual([1, 8, 4, 5, 2, 7, 3, 6]);
  });
});

describe("group + playoffs", () => {
  it("keeps the knockout empty until the group is finished", () => {
    const tournament = create();
    expect(knockoutMatches(tournament)).toHaveLength(3);
    expect(knockoutMatches(tournament).every((m) => m.playerAId === null)).toBe(true);
    expect(nextMatch(tournament)?.id).toBe(groupMatches(tournament)[0].id);
  });

  it("sends the top four to semifinals 1 v 4 and 2 v 3, and winners on to the final", () => {
    let tournament = create();
    for (const match of groupMatches(tournament)) {
      tournament = recordResult(tournament, match.id, 3, 1);
    }

    const standings = getGroupStandings(tournament.players, groupMatches(tournament));
    expect(standings.map((s) => s.playerId)).toEqual([
      "matilde",
      "stella",
      "malin",
      "tuva",
      "lona",
    ]);

    const [semi1, semi2, final] = knockoutMatches(tournament);
    expect([semi1.playerAId, semi1.playerBId]).toEqual(["matilde", "tuva"]);
    expect([semi2.playerAId, semi2.playerBId]).toEqual(["stella", "malin"]);
    expect(final.playerAId).toBeNull();

    tournament = recordResult(tournament, semi1.id, 1, 3);
    expect(knockoutMatches(tournament)[2].playerAId).toBe("tuva");

    tournament = playAll(tournament);
    expect(champion(tournament)?.id).toBe("tuva");
    expect(tournament.status).toBe("completed");
  });

  it("only accepts the next match in order", () => {
    const tournament = create();
    const second = groupMatches(tournament)[1];
    expect(() => recordResult(tournament, second.id, 3, 0)).toThrow(/order/);
  });

  it("does not allow a draw in the knockout", () => {
    let tournament = create();
    for (const match of groupMatches(tournament)) {
      tournament = recordResult(tournament, match.id, 3, 1);
    }
    const semi = knockoutMatches(tournament)[0];
    expect(() => recordResult(tournament, semi.id, 2, 2)).toThrow(/winner/);
  });

  it("undoes the last result, including who advanced", () => {
    let tournament = create();
    for (const match of groupMatches(tournament)) {
      tournament = recordResult(tournament, match.id, 3, 1);
    }
    expect(knockoutMatches(tournament)[0].playerAId).toBe("matilde");

    tournament = undoLastResult(tournament);
    expect(knockoutMatches(tournament)[0].playerAId).toBeNull();
    expect(nextMatch(tournament)?.id).toBe(groupMatches(tournament).at(-1)?.id);
  });
});
