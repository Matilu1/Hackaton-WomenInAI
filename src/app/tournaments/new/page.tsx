import { Suspense } from "react";
import Link from "next/link";
import { CreateTournamentFlow } from "@/components/create-tournament-flow";
import { isCategoryId } from "@/lib/categories";
import { getEventMode, isEventModeId, getModeActivities, getModeActivity } from "@/lib/modes";
import SeededPlayerRatings from "./seeded-player-ratings";

type NewTournamentPageProps = {
  searchParams: Promise<{ category?: string; mode?: string }>;
};

async function NewTournamentContent({
const FORMAT_OPTIONS = [
  { id: "single-elimination", label: "Single elimination" },
  { id: "round-robin", label: "Round robin" },
  { id: "swiss", label: "Swiss" },
] as const;

const FIVE_PLAYER_OPTIONS = [
  {
    id: "lucky-loser",
    label: "Lucky loser",
    description:
      "Spilleren med høyest rating (seed 1) går direkte til semifinalen.",
  },
  {
    id: "qualifier",
    label: "Innledende kamp",
    description:
      "De to lavest seedede spiller om den siste semifinalplassen. De tre høyest seedede går direkte videre.",
  },
] as const;

async function NewTournamentForm({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const raw = params.category ?? params.mode;
  const categoryId = raw && isCategoryId(raw) ? raw : null;

  return <CreateTournamentFlow categoryId={categoryId} />;
        <SeededPlayerRatings />

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">
            Oppsett for 5 spillere
          </legend>
          <div className="space-y-2">
            {FIVE_PLAYER_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 border-b border-spruce/15 py-3 has-[:checked]:text-spruce"
              >
                <input
                  type="radio"
                  name="five-player-format"
                  value={option.id}
                  required
                  className="mt-1 accent-apricot"
                />
                <span>
                  <span className="block font-medium">{option.label}</span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">
            Turneringsoppsett
          </legend>
          <div className="space-y-2">
            {formatOptions.map((format, index) => (
              <label
                key={format.id}
                className="flex cursor-pointer items-center gap-3 border-b border-spruce/15 py-3 has-[:checked]:text-spruce"
              >
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  defaultChecked={activity ? index === 0 : format.id === "swiss"}
                  className="accent-apricot"
                />
                <span>{format.label}</span>
                {"description" in format && (
                  <span className="text-sm text-ink-soft">
                    {format.description}
                  </span>
                )}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          disabled
          className="w-full bg-spruce px-5 py-3 font-display font-semibold text-mist opacity-70"
          title="Lagring kommer snart"
        >
          Opprett turnering (kommer snart)
        </button>
      </form>
    </>
  );
}

export default function NewTournamentPage({
  searchParams,
}: NewTournamentPageProps) {
  return (
    <div className="page-shell relative">
      <main className="relative z-10 mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          ← Tilbake
        </Link>

        <p className="mt-8 font-display text-2xl font-bold text-ink">
          Nome Games
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          Ny turnering
        </h1>

        <Suspense fallback={<p className="mt-4 text-muted">Laster…</p>}>
          <NewTournamentContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
