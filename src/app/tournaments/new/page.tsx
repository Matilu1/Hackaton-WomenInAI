import { Suspense } from "react";
import Link from "next/link";
import { CreateTournamentFlow } from "@/components/create-tournament-flow";
import { T } from "@/components/language";
import { isCategoryId } from "@/lib/categories";

type NewTournamentPageProps = {
  searchParams: Promise<{ category?: string; mode?: string }>;
};

const FIVE_PLAYER_OPTIONS = [
  {
    id: "lucky-loser",
    label: "Lucky loser",
    labelEn: "Lucky loser",
    description:
      "Spilleren med høyest rating (seed 1) går direkte til semifinalen.",
    descriptionEn:
      "The highest-rated player (seed 1) goes straight to the semifinal.",
  },
  {
    id: "qualifier",
    label: "Innledende kamp",
    labelEn: "Qualifier",
    description:
      "De to lavest seedede spiller om den siste semifinalplassen. De tre høyest seedede går direkte videre.",
    descriptionEn:
      "The two lowest seeds play for the last semifinal spot. The top three seeds advance directly.",
  },
] as const;

async function NewTournamentContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const raw = params.category ?? params.mode;
  const categoryId = raw && isCategoryId(raw) ? raw : null;

  return (
    <div className="mt-8 space-y-8">
      <CreateTournamentFlow
        categoryId={categoryId}
        knockoutOptions={
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">
              <T no="Oppsett for 5 spillere" en="Setup for 5 players" />
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
                    <span className="block font-medium"><T no={option.label} en={option.labelEn} /></span>
                    <span className="mt-1 block text-sm text-ink-soft">
                      <T no={option.description} en={option.descriptionEn} />
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        }
      />
    </div>
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
          ← <T no="Tilbake" en="Back" />
        </Link>

        <p className="mt-8 font-display text-2xl font-bold text-ink">
          Nome Games
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          <T no="Ny turnering" en="New tournament" />
        </h1>

        <Suspense fallback={<p className="mt-4 text-muted"><T no="Laster…" en="Loading…" /></p>}>
          <NewTournamentContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
