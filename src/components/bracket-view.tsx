"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getCategory } from "@/lib/categories";
import { getTournamentFormat } from "@/lib/formats";
import { getSport } from "@/lib/sports";
import { getTournament, saveTournament } from "@/lib/storage";
import { setMatchWinner } from "@/lib/tournament-engine";
import type { Match, Tournament } from "@/lib/types";

function playerName(tournament: Tournament, playerId: string | null) {
  if (!playerId) return "Bye";
  return (
    tournament.players.find((player) => player.id === playerId)?.name ?? "—"
  );
}

function MatchCard({
  match,
  tournament,
  onPickWinner,
}: {
  match: Match;
  tournament: Tournament;
  onPickWinner: (matchId: string, winnerId: string) => void;
}) {
  const ready = Boolean(match.playerAId && match.playerBId);
  const done = Boolean(match.winnerId);

  return (
    <div className="min-w-[200px] border border-line bg-white/70 p-3">
      <p className="mb-2 text-xs tracking-wide text-muted">
        R{match.round} · Kamp {(match.index ?? 0) + 1}
      </p>
      {(["A", "B"] as const).map((slot) => {
        const playerId = slot === "A" ? match.playerAId : match.playerBId;
        const label = playerName(tournament, playerId);
        const isWinner = match.winnerId === playerId && playerId !== null;
        const canPick = ready && !done && playerId !== null;

        return (
          <button
            key={slot}
            type="button"
            disabled={!canPick}
            onClick={() => {
              if (playerId) onPickWinner(match.id, playerId);
            }}
            className={`mb-1 flex w-full items-center justify-between border px-3 py-2 text-left text-sm transition-colors last:mb-0 ${
              isWinner
                ? "border-accent bg-accent text-stone"
                : "border-line bg-stone/40 text-ink"
            } ${canPick ? "hover:border-accent" : "disabled:opacity-70"}`}
          >
            <span className="font-medium">{label}</span>
            {isWinner ? <span className="text-xs">Vinner</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export function BracketView({ tournamentId }: { tournamentId: string }) {
  const [tournament, setTournament] = useState<Tournament | null>(() =>
    getTournament(tournamentId),
  );

  const rounds = useMemo(() => {
    if (!tournament) return [];
    const maxRound = Math.max(...tournament.matches.map((match) => match.round));
    return Array.from({ length: maxRound }, (_, index) => {
      const round = index + 1;
      return {
        round,
        matches: tournament.matches
          .filter((match) => match.round === round)
          .sort((a, b) => (a.index ?? 0) - (b.index ?? 0)),
      };
    });
  }, [tournament]);

  if (!tournament) {
    return (
      <div className="mt-6">
        <p className="text-muted">Fant ikke turneringen.</p>
        <Link
          href="/tournaments/new"
          className="mt-4 inline-block text-accent underline underline-offset-4"
        >
          Opprett ny
        </Link>
      </div>
    );
  }

  const category = getCategory(tournament.categoryId);
  const sport = getSport(tournament.sportId);
  const format = getTournamentFormat(tournament.format);
  const isBracket = rounds.length > 1 || tournament.matches.some((m) => m.nextMatchId);

  function handlePickWinner(matchId: string, winnerId: string) {
    if (!tournament) return;
    const updated = setMatchWinner(tournament, matchId, winnerId);
    saveTournament(updated);
    setTournament(updated);
  }

  return (
    <div className="mt-6 space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {tournament.name}
        </h1>
        <p className="text-sm text-muted">
          {category?.label ?? tournament.categoryId} ·{" "}
          {sport?.label ?? tournament.sportId} ·{" "}
          {format?.label ?? tournament.format}
          {tournament.status === "completed" ? " · Ferdig" : ""}
        </p>
      </header>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink">
          {isBracket ? "Bracket" : "Kamper"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Trykk på en spiller for å kåre vinner og flytte dem videre.
        </p>

        <div className="mt-6 flex gap-6 overflow-x-auto pb-4">
          {rounds.map((round) => (
            <div key={round.round} className="flex min-w-[220px] flex-col gap-4">
              <p className="font-display text-sm font-semibold text-muted">
                {round.round === rounds.length && rounds.length > 1
                  ? "Finale"
                  : `Runde ${round.round}`}
              </p>
              <div
                className="flex flex-col gap-4"
                style={{
                  marginTop:
                    round.round > 1
                      ? `${(2 ** (round.round - 1) - 1) * 28}px`
                      : 0,
                  gap: `${16 + (round.round - 1) * 36}px`,
                }}
              >
                {round.matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    tournament={tournament}
                    onPickWinner={handlePickWinner}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
