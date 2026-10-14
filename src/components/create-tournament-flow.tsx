"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CategoryId } from "@/lib/categories";
import { getCategory } from "@/lib/categories";
import type { SportId } from "@/lib/sports";
import { sportsForCategory, suggestFormats } from "@/lib/suggestions";

type CreateTournamentFlowProps = {
  categoryId: CategoryId | null;
};

export function CreateTournamentFlow({
  categoryId,
}: CreateTournamentFlowProps) {
  const category = categoryId ? getCategory(categoryId) : null;
  const sports = useMemo(
    () => (categoryId ? sportsForCategory(categoryId) : []),
    [categoryId],
  );
  const [sportId, setSportId] = useState<SportId | null>(null);
  const [formatId, setFormatId] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (!sportId) return [];
    return suggestFormats(sportId, categoryId);
  }, [sportId, categoryId]);

  if (!category || !categoryId) {
    return (
      <p className="mt-4 text-muted">
        Ingen kategori valgt.{" "}
        <Link href="/" className="text-ink underline underline-offset-4">
          Velg på forsiden
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      <p className="text-muted">
        Kategori: <span className="font-medium text-ink">{category.label}</span>
      </p>

      <section>
        <h2 className="font-display text-lg font-semibold text-ink">
          Velg sport
        </h2>
        <p className="mt-1 text-sm text-muted">
          Typiske for kategorien først — alle er tilgjengelige.
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
                  {sport.label}
                </span>
                {typical ? (
                  <span className="text-xs tracking-wide text-muted">
                    Typisk
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
            Foreslåtte brackets
          </h2>
          <p className="mt-1 text-sm text-muted">
            Basert på sporten og casetabellen
            {suggestions.some((s) => s.highlighted)
              ? " — treff med kategorien øverst"
              : ""}
            .
          </p>
          <fieldset className="mt-4 space-y-1 border-t border-line">
            <legend className="sr-only">Turneringsoppsett</legend>
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
                    {format.label}
                    {format.highlighted ? (
                      <span className="ml-2 text-xs font-normal text-accent">
                        Sterkt treff
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {format.description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        </section>
      ) : null}

      <form className="space-y-6 border-t border-line pt-8">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">
            Turneringens navn
          </span>
          <input
            name="name"
            type="text"
            placeholder={`${category.label} — ${sportId ?? "sport"}`}
            className="w-full border border-line bg-white/50 px-4 py-3 text-ink outline-none focus:border-accent"
          />
        </label>

        <button
          type="button"
          disabled={!sportId || !formatId}
          className="w-full bg-ink px-5 py-3.5 font-display font-semibold text-stone disabled:opacity-40"
          title="Lagring kommer snart"
        >
          Opprett turnering (kommer snart)
        </button>
      </form>
    </div>
  );
}
