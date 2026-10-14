"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SeededPlayerRatings, {
  INITIAL_PLAYERS,
} from "@/app/tournaments/new/seeded-player-ratings";
import type { CategoryId } from "@/lib/categories";
import { getCategory } from "@/lib/categories";
import type { SportId } from "@/lib/sports";
import { saveTournament } from "@/lib/storage";
import {
  createGroupPlayoffsTournament,
  isGroupPlayoffFormat,
} from "@/lib/tournament-engine";
import type { TournamentFormatId } from "@/lib/formats";
import { sportsForCategory, suggestFormats } from "@/lib/suggestions";
import {
  CATEGORY_EN,
  CATEGORY_FORMAT_DESCRIPTIONS_EN,
  FORMAT_EN,
  SPORT_EN,
} from "@/lib/translations";
import { useLanguage } from "./language";

type CreateTournamentFlowProps = {
  categoryId: CategoryId | null;
  /** Valg som bare gjelder utslagsformater (f.eks. oppsett for 5 spillere). */
  knockoutOptions?: ReactNode;
};

const KNOCKOUT_FORMATS = ["elimination", "elimination-consolation"];

export function CreateTournamentFlow({
  categoryId,
  knockoutOptions,
}: CreateTournamentFlowProps) {
  const category = categoryId ? getCategory(categoryId) : null;
  const sports = useMemo(
    () => (categoryId ? sportsForCategory(categoryId) : []),
    [categoryId],
  );
  const [sportId, setSportId] = useState<SportId | null>(null);
  const [formatId, setFormatId] = useState<TournamentFormatId | null>(null);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [name, setName] = useState("");
  const { t } = useLanguage();
  const router = useRouter();

  const suggestions = useMemo(() => {
    if (!sportId) return [];
    return suggestFormats(sportId, categoryId);
  }, [sportId, categoryId]);

  if (!category || !categoryId) {
    return (
      <p className="mt-4 text-muted">
        {t("Ingen kategori valgt.", "No category selected.")}{" "}
        <Link href="/" className="text-ink underline underline-offset-4">
          {t("Velg på forsiden", "Pick one on the front page")}
        </Link>
        .
      </p>
    );
  }

  const categoryLabel = t(category.label, CATEGORY_EN[categoryId].label);
  const sportLabel = (id: SportId, label: string) => t(label, SPORT_EN[id]);
  const selectedSport = sports.find((sport) => sport.id === sportId);
  const defaultName = `${categoryLabel} — ${
    selectedSport ? sportLabel(selectedSport.id, selectedSport.label) : "sport"
  }`;
  const canCreate = Boolean(sportId && formatId && isGroupPlayoffFormat(formatId));

  function createTournament() {
    if (!sportId || !formatId || !categoryId) return;
    const tournament = createGroupPlayoffsTournament({
      id: crypto.randomUUID(),
      name: name.trim() || defaultName,
      categoryId,
      sportId,
      format: formatId,
      players: players.map((player) => ({
        id: player.id,
        name: player.name,
        rating: player.rating.trim() === "" ? null : Number(player.rating),
      })),
      createdAt: new Date().toISOString(),
    });
    saveTournament(tournament);
    router.push(`/tournaments/${tournament.id}`);
  }

  return (
    <div className="mt-8 space-y-10">
      <p className="text-muted">
        {t("Kategori:", "Category:")}{" "}
        <span className="font-medium text-ink">{categoryLabel}</span>
      </p>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink">
          {t("Velg sport", "Choose sport")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {t(
            "Typiske for kategorien først — alle er tilgjengelige.",
            "Typical for the category first — all are available.",
          )}
        </p>
        <div className="mt-4 flex flex-col border-t border-line">
          {sports.map((sport) => {
            const typical = (category.typicalSportIds as readonly string[]).includes(
              sport.id,
            );
            const selected = sportId === sport.id;
            return (
              <button
                key={sport.id}
                type="button"
                onClick={() => {
                  setSportId(sport.id);
                  setFormatId(null);
                }}
                className={`flex items-baseline justify-between gap-4 border-b border-line py-3.5 text-left transition-colors ${
                  selected
                    ? "border-accent text-ink"
                    : "hover:border-accent/50"
                }`}
              >
                <span className="font-display text-xl font-semibold">
                  {sportLabel(sport.id, sport.label)}
                </span>
                {typical ? (
                  <span className="text-xs tracking-wide text-muted">
                    {t("Typisk", "Typical")}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      {sportId ? (
        <section className="animate-rise">
          <h2 className="font-display text-lg font-semibold text-ink">
            {t("Foreslåtte brackets", "Suggested brackets")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {t(
              "Basert på sporten og casetabellen",
              "Based on the sport and the case table",
            )}
            {suggestions.some((s) => s.highlighted)
              ? t(" — treff med kategorien øverst", " — category matches first")
              : ""}
            .
          </p>
          <fieldset className="mt-4 space-y-1 border-t border-line">
            <legend className="sr-only">
              {t("Turneringsoppsett", "Tournament setup")}
            </legend>
            {suggestions.map((format) => (
              <label
                key={format.id}
                className="flex cursor-pointer items-start gap-3 border-b border-line py-3.5"
              >
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={formatId === format.id}
                  onChange={() => setFormatId(format.id)}
                  className="mt-1 accent-[var(--accent)]"
                />
                <span>
                  <span className="font-display block font-semibold text-ink">
                    {t(format.label, FORMAT_EN[format.id].label)}
                    {format.highlighted ? (
                      <span className="ml-2 text-xs font-normal text-accent">
                        {t("Sterkt treff", "Strong match")}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {t(
                      format.description,
                      CATEGORY_FORMAT_DESCRIPTIONS_EN[categoryId]?.[format.id] ??
                        FORMAT_EN[format.id].description,
                    )}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        </section>
      ) : null}

      <SeededPlayerRatings players={players} onChange={setPlayers} />

      {formatId && KNOCKOUT_FORMATS.includes(formatId) ? knockoutOptions : null}

      <form
        className="space-y-6 border-t border-line pt-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (canCreate) createTournament();
        }}
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">
            {t("Turneringens navn", "Tournament name")}
          </span>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={defaultName}
            className="w-full border border-line bg-white/50 px-4 py-3 text-ink outline-none focus:border-accent"
          />
        </label>

        <button
          type="submit"
          disabled={!canCreate}
          className="w-full bg-ink px-5 py-3.5 font-display font-semibold text-stone disabled:opacity-40"
        >
          {formatId && !isGroupPlayoffFormat(formatId)
            ? t(
                "Opprett turnering (kommer snart for dette formatet)",
                "Create tournament (coming soon for this format)",
              )
            : t("Opprett turnering", "Create tournament")}
        </button>
        {formatId && isGroupPlayoffFormat(formatId) ? (
          <p className="text-sm text-muted">
            {t(
              "Gruppespill alle mot alle, deretter går de fire beste til semifinale og finale.",
              "Group stage where everyone plays everyone, then the top four go to the semifinals and final.",
            )}
          </p>
        ) : null}
      </form>
    </div>
  );
}
