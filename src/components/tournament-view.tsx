"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { getCategory } from "@/lib/categories";
import { getTournamentFormat } from "@/lib/formats";
import { getSport } from "@/lib/sports";
import {
  parseTournament,
  readTournamentsSnapshot,
  saveTournament,
  subscribeTournaments,
} from "@/lib/storage";
import {
  champion,
  getGroupStandings,
  groupMatches,
  isGroupComplete,
  knockoutMatches,
  nextMatch,
  recordResult,
  restingPlayers,
  undoLastResult,
} from "@/lib/tournament-engine";
import { CATEGORY_EN, FORMAT_EN, SPORT_EN } from "@/lib/translations";
import type { Match, Tournament } from "@/lib/types";
import { KnockoutBracket } from "./knockout-bracket";
import { useLanguage } from "./language";

export function TournamentView({ id }: { id: string }) {
  const { t } = useLanguage();
  const snapshot = useSyncExternalStore(
    subscribeTournaments,
    readTournamentsSnapshot,
    () => null,
  );
  const tournament = useMemo(
    () => (snapshot === null ? null : parseTournament(snapshot, id)),
    [snapshot, id],
  );

  if (snapshot === null) {
    return <p className="mt-3 text-muted">{t("Laster…", "Loading…")}</p>;
  }

  if (!tournament) {
    return (
      <div className="mt-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {t("Fant ikke turneringen", "Tournament not found")}
        </h1>
        <p className="mt-3 text-muted">
          {t(
            "Turneringer lagres i nettleseren de ble laget i.",
            "Tournaments are stored in the browser they were created in.",
          )}{" "}
          <Link href="/" className="text-ink underline underline-offset-4">
            {t("Lag en ny", "Create a new one")}
          </Link>
        </p>
      </div>
    );
  }

  return <TournamentDetails tournament={tournament} />;
}

function TournamentDetails({ tournament }: { tournament: Tournament }) {
  const { t } = useLanguage();
  const nameOf = (playerId: string | null) =>
    tournament.players.find((player) => player.id === playerId)?.name ?? "?";

  const category = getCategory(tournament.categoryId);
  const sport = getSport(tournament.sportId);
  const format = getTournamentFormat(tournament.format);
  const subtitle = [
    t(category?.label ?? "", CATEGORY_EN[tournament.categoryId]?.label ?? ""),
    t(sport?.label ?? "", SPORT_EN[tournament.sportId] ?? ""),
    t(format?.label ?? "", FORMAT_EN[tournament.format]?.label ?? ""),
  ].join(" · ");

  const group = groupMatches(tournament);
  const knockout = knockoutMatches(tournament);
  const standings = getGroupStandings(tournament.players, group);
  const groupRounds = [...new Set(group.map((match) => match.round))];
  const winner = champion(tournament);
  const hasResults = tournament.matches.some((match) => match.scoreA !== null);
  const qualifiers = knockout.filter((match) => match.round === 1).length * 2;

  return (
    <div className="mt-8 space-y-12">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {tournament.name}
        </h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent"
          >
            🖨️ {t("Skriv ut oppsettet", "Print the bracket")}
          </button>
          {hasResults ? (
            <button
              type="button"
              onClick={() => saveTournament(undoLastResult(tournament))}
              className="border border-line px-4 py-2 text-sm font-medium text-muted hover:border-accent"
            >
              ↩︎ {t("Angre siste resultat", "Undo last result")}
            </button>
          ) : null}
        </div>
      </header>

      {winner ? (
        <p className="border border-accent bg-accent/10 px-5 py-4 font-display text-2xl font-semibold text-ink">
          🏆 {t(`${winner.name} vant turneringen!`, `${winner.name} won the tournament!`)}
        </p>
      ) : (
        <NextMatchForm tournament={tournament} nameOf={nameOf} />
      )}

      <section>
        <h2 className="font-display text-xl font-semibold text-ink">
          {t("Gruppespill", "Group stage")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {t(
            `Seier gir 3 poeng, uavgjort 1. De ${qualifiers} beste går videre til sluttspillet.`,
            `A win is worth 3 points, a draw 1. The top ${qualifiers} go through to the playoffs.`,
          )}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-t border-line text-left text-sm">
            <thead className="text-muted">
              <tr className="border-b border-line">
                <th className="py-2 pr-2 font-medium">#</th>
                <th className="py-2 pr-2 font-medium">{t("Spiller", "Player")}</th>
                <th className="py-2 pr-2 text-right font-medium">{t("K", "P")}</th>
                <th className="py-2 pr-2 text-right font-medium">{t("V", "W")}</th>
                <th className="py-2 pr-2 text-right font-medium">{t("U", "D")}</th>
                <th className="py-2 pr-2 text-right font-medium">{t("T", "L")}</th>
                <th className="py-2 pr-2 text-right font-medium">+/−</th>
                <th className="py-2 text-right font-medium">{t("Poeng", "Pts")}</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, index) => (
                <tr
                  key={row.playerId}
                  className={`border-b border-line text-ink ${index < qualifiers ? "" : "text-muted"}`}
                >
                  <td className="py-2 pr-2">{index + 1}</td>
                  <td className="py-2 pr-2 font-medium">
                    {row.name}{" "}
                    <span className="text-xs text-muted">
                      ({t("seed", "seed")} {row.seed})
                    </span>
                  </td>
                  <td className="py-2 pr-2 text-right">{row.played}</td>
                  <td className="py-2 pr-2 text-right">{row.wins}</td>
                  <td className="py-2 pr-2 text-right">{row.draws}</td>
                  <td className="py-2 pr-2 text-right">{row.losses}</td>
                  <td className="py-2 pr-2 text-right">
                    {row.scoreFor - row.scoreAgainst}
                  </td>
                  <td className="py-2 text-right font-semibold">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 font-display text-lg font-semibold text-ink">
          {t("Hvem spiller mot hvem", "Who plays whom")}
        </h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {groupRounds.map((round) => {
            const resting = restingPlayers(tournament.players, group, round);
            return (
              <div key={round} className="border border-line bg-white/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {t(`Runde ${round}`, `Round ${round}`)}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {group
                    .filter((match) => match.round === round)
                    .map((match) => (
                      <MatchLine key={match.id} match={match} nameOf={nameOf} />
                    ))}
                </ul>
                {resting.length > 0 ? (
                  <p className="mt-2 text-xs text-muted">
                    {t(
                      `${resting.map((p) => p.name).join(", ")} står over`,
                      `${resting.map((p) => p.name).join(", ")} sits out`,
                    )}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="break-inside-avoid">
        <h2 className="font-display text-xl font-semibold text-ink">
          {t("Sluttspill", "Playoffs")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isGroupComplete(tournament)
            ? t(
                "Best plassert møter dårligst plassert. Vinneren går videre.",
                "Best placed meets worst placed. The winner goes through.",
              )
            : t(
                "Fylles ut når gruppespillet er ferdig.",
                "Filled in when the group stage is finished.",
              )}
        </p>
        <div className="mt-4 overflow-x-auto">
          <KnockoutBracket matches={knockout} players={tournament.players} />
        </div>
      </section>
    </div>
  );
}

function MatchLine({
  match,
  nameOf,
}: {
  match: Match;
  nameOf: (id: string | null) => string;
}) {
  const played = match.scoreA !== null && match.scoreB !== null;
  const style = (id: string | null) =>
    played && match.winnerId === id ? "font-semibold text-ink" : "text-ink";
  return (
    <li className="flex items-baseline justify-between gap-3 text-sm">
      <span>
        <span className={style(match.playerAId)}>{nameOf(match.playerAId)}</span>
        <span className="text-muted"> – </span>
        <span className={style(match.playerBId)}>{nameOf(match.playerBId)}</span>
      </span>
      <span className="tabular-nums text-ink">
        {played ? `${match.scoreA}–${match.scoreB}` : "—"}
      </span>
    </li>
  );
}

function NextMatchForm({
  tournament,
  nameOf,
}: {
  tournament: Tournament;
  nameOf: (id: string | null) => string;
}) {
  const { t } = useLanguage();
  const match = nextMatch(tournament);
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!match) return null;

  const knockoutCount = knockoutMatches(tournament).filter(
    (m) => m.round === match.round,
  ).length;
  const stageLabel =
    match.stage === "knockout"
      ? knockoutCount === 1
        ? t("Finale", "Final")
        : knockoutCount === 2
          ? t(`Semifinale ${(match.slot ?? 0) + 1}`, `Semifinal ${(match.slot ?? 0) + 1}`)
          : t(`Kvartfinale ${(match.slot ?? 0) + 1}`, `Quarterfinal ${(match.slot ?? 0) + 1}`)
      : t(`Gruppespill, runde ${match.round}`, `Group stage, round ${match.round}`);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const a = Number(scoreA);
    const b = Number(scoreB);
    if (scoreA === "" || scoreB === "" || !Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
      setError(t("Skriv inn hele tall for begge.", "Enter whole numbers for both."));
      return;
    }
    if (match!.stage === "knockout" && a === b) {
      setError(t("Sluttspillkamper må ha en vinner.", "Playoff matches need a winner."));
      return;
    }
    saveTournament(recordResult(tournament, match!.id, a, b));
    setScoreA("");
    setScoreB("");
    setError(null);
  }

  const input =
    "w-16 border border-line bg-white/60 px-2 py-2 text-center text-lg font-semibold text-ink outline-none focus:border-accent";

  return (
    <form
      onSubmit={submit}
      className="border border-accent/40 bg-white/40 p-5 print:hidden"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {t("Neste kamp", "Next match")} · {stageLabel}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-3">
          <span className="font-display text-xl font-semibold text-ink">
            {nameOf(match.playerAId)}
          </span>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={scoreA}
            onChange={(event) => setScoreA(event.target.value)}
            aria-label={t(`Resultat for ${nameOf(match.playerAId)}`, `Score for ${nameOf(match.playerAId)}`)}
            className={input}
          />
        </label>
        <span className="text-muted">–</span>
        <label className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={scoreB}
            onChange={(event) => setScoreB(event.target.value)}
            aria-label={t(`Resultat for ${nameOf(match.playerBId)}`, `Score for ${nameOf(match.playerBId)}`)}
            className={input}
          />
          <span className="font-display text-xl font-semibold text-ink">
            {nameOf(match.playerBId)}
          </span>
        </label>
        <button
          type="submit"
          className="ml-auto bg-ink px-5 py-2.5 font-display font-semibold text-stone"
        >
          {t("Registrer resultat", "Save result")}
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
    </form>
  );
}
