import type { CategoryId } from "../categories";
import type { TournamentFormatId } from "../formats";
import type { SportId } from "../sports";
import type { Match, Player, Tournament } from "../types";
import { advanceWinner } from "./advanceWinner";
import { generateRoundRobin, getGroupStandings } from "./roundRobin";
import {
  bracketSeedOrder,
  generateKnockoutPlaceholders,
  knockoutSize,
} from "./singleElimination";

/** Formats that use the World Cup model: group stage (all v all) followed by playoffs. */
export const GROUP_PLAYOFF_FORMATS = [
  "round-robin",
  "group-playoffs",
] as const satisfies readonly TournamentFormatId[];

export function isGroupPlayoffFormat(format: string) {
  return (GROUP_PLAYOFF_FORMATS as readonly string[]).includes(format);
}

/** Highest rating first; unrated players last, in the order they were entered. */
export function sortBySeed(players: Player[]): Player[] {
  return players
    .map((player, order) => ({ player, order }))
    .sort((a, b) => {
      const ra = a.player.rating ?? null;
      const rb = b.player.rating ?? null;
      if (ra === null || rb === null) {
        return ra === rb ? a.order - b.order : ra === null ? 1 : -1;
      }
      return rb - ra || a.order - b.order;
    })
    .map(({ player }) => player);
}

export function createGroupPlayoffsTournament(input: {
  id: string;
  name: string;
  categoryId: CategoryId;
  sportId: SportId;
  format: TournamentFormatId;
  players: Player[];
  createdAt: string;
}): Tournament {
  const players = sortBySeed(input.players);

  return {
    id: input.id,
    name: input.name,
    categoryId: input.categoryId,
    sportId: input.sportId,
    format: input.format,
    status: "active",
    players,
    matches: [
      ...generateRoundRobin(players),
      ...generateKnockoutPlaceholders(knockoutSize(players.length)),
    ],
    createdAt: input.createdAt,
  };
}

/** All matches in the order they are played: group rounds, then knockout rounds. */
export function orderedMatches(tournament: Tournament): Match[] {
  const stageOrder = (match: Match) => (match.stage === "knockout" ? 1 : 0);
  return [...tournament.matches].sort(
    (a, b) =>
      stageOrder(a) - stageOrder(b) ||
      a.round - b.round ||
      (a.slot ?? 0) - (b.slot ?? 0),
  );
}

function isPlayed(match: Match) {
  return match.scoreA !== null && match.scoreB !== null;
}

/** The next match waiting for a result, or undefined when the tournament is over. */
export function nextMatch(tournament: Tournament): Match | undefined {
  return orderedMatches(tournament).find(
    (match) => !isPlayed(match) && match.playerAId && match.playerBId,
  );
}

export function groupMatches(tournament: Tournament) {
  return orderedMatches(tournament).filter((match) => match.stage !== "knockout");
}

export function knockoutMatches(tournament: Tournament) {
  return orderedMatches(tournament).filter((match) => match.stage === "knockout");
}

export function isGroupComplete(tournament: Tournament) {
  return groupMatches(tournament).every(isPlayed);
}

/** The tournament winner once the final is played. */
export function champion(tournament: Tournament): Player | undefined {
  const ko = knockoutMatches(tournament);
  const final = ko[ko.length - 1];
  return tournament.players.find((player) => player.id === final?.winnerId);
}

/**
 * Recomputes everything derived from the results: group winners,
 * who qualifies for the knockout (by group placement) and who advances.
 */
function resolve(tournament: Tournament): Tournament {
  let matches = tournament.matches.map((match) => {
    if (match.stage === "knockout") {
      return { ...match, playerAId: null, playerBId: null, winnerId: null };
    }
    return {
      ...match,
      winnerId: !isPlayed(match)
        ? null
        : match.scoreA! > match.scoreB!
          ? match.playerAId
          : match.scoreB! > match.scoreA!
            ? match.playerBId
            : null,
    };
  });

  const group = matches.filter((match) => match.stage !== "knockout");
  if (group.every(isPlayed)) {
    const standings = getGroupStandings(tournament.players, group);
    const firstRound = matches.filter(
      (match) => match.stage === "knockout" && match.round === 1,
    );
    const order = bracketSeedOrder(firstRound.length * 2);
    matches = matches.map((match) =>
      match.stage === "knockout" && match.round === 1
        ? {
            ...match,
            playerAId: standings[order[match.slot! * 2] - 1].playerId,
            playerBId: standings[order[match.slot! * 2 + 1] - 1].playerId,
          }
        : match,
    );
  }

  const rounds = Math.max(
    0,
    ...matches.filter((m) => m.stage === "knockout").map((m) => m.round),
  );
  for (let round = 1; round <= rounds; round++) {
    for (const match of matches.filter(
      (m) => m.stage === "knockout" && m.round === round,
    )) {
      const current = matches.find((m) => m.id === match.id)!;
      // A result only counts while both players are known.
      if (!current.playerAId || !current.playerBId || !isPlayed(current)) {
        if (isPlayed(current) && (!current.playerAId || !current.playerBId)) {
          matches = matches.map((m) =>
            m.id === current.id ? { ...m, scoreA: null, scoreB: null } : m,
          );
        }
        continue;
      }
      const winnerId =
        current.scoreA! > current.scoreB! ? current.playerAId : current.playerBId;
      const decided = { ...current, winnerId };
      matches = matches.map((m) => (m.id === decided.id ? decided : m));
      matches = advanceWinner(matches, decided);
    }
  }

  const resolved = { ...tournament, matches };
  return { ...resolved, status: champion(resolved) ? "completed" : "active" };
}

/** Records the result of the next match. Results must be entered in order. */
export function recordResult(
  tournament: Tournament,
  matchId: string,
  scoreA: number,
  scoreB: number,
): Tournament {
  if (
    !Number.isInteger(scoreA) ||
    !Number.isInteger(scoreB) ||
    scoreA < 0 ||
    scoreB < 0
  ) {
    throw new Error("Scores must be whole numbers of zero or more.");
  }

  const next = nextMatch(tournament);
  if (!next || next.id !== matchId) {
    throw new Error("Results must be entered in order.");
  }
  if (next.stage === "knockout" && scoreA === scoreB) {
    throw new Error("A knockout match needs a winner.");
  }

  return resolve({
    ...tournament,
    matches: tournament.matches.map((match) =>
      match.id === matchId ? { ...match, scoreA, scoreB } : match,
    ),
  });
}

/** Removes the most recent result (for typos). */
export function undoLastResult(tournament: Tournament): Tournament {
  const last = orderedMatches(tournament).filter(isPlayed).at(-1);
  if (!last) return tournament;

  return resolve({
    ...tournament,
    matches: tournament.matches.map((match) =>
      match.id === last.id ? { ...match, scoreA: null, scoreB: null } : match,
    ),
  });
}
