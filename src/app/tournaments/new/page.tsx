import { Suspense } from "react";
import Link from "next/link";
import {
  getEventMode,
  getModeActivities,
  getModeActivity,
  isEventModeId,
} from "@/lib/modes";

type NewTournamentPageProps = {
  searchParams: Promise<{ mode?: string; activity?: string }>;
};

const FORMAT_OPTIONS = [
  { id: "single-elimination", label: "Single elimination" },
  { id: "round-robin", label: "Round robin" },
  { id: "swiss", label: "Swiss" },
] as const;

async function NewTournamentForm({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; activity?: string }>;
}) {
  const params = await searchParams;
  const modeId = params.mode && isEventModeId(params.mode) ? params.mode : null;
  const mode = modeId ? getEventMode(modeId) : null;
  const activities = modeId ? getModeActivities(modeId) : [];
  const activity =
    modeId && params.activity
      ? getModeActivity(modeId, params.activity)
      : undefined;
  const formatOptions = activity
    ? activity.formats.map((format) => ({
        id: format.id,
        label:
          FORMAT_OPTIONS.find((option) => option.id === format.id)?.label ??
          format.id,
        description: format.description,
      }))
    : FORMAT_OPTIONS;

  if (modeId && activities.length > 0 && !activity) {
    return (
      <>
        <p className="mt-3 text-ink-soft">
          Stemning: <span className="font-medium text-ink">{mode?.label}</span>
        </p>
        <nav
          aria-label="Velg aktivitet"
          className="mt-8 flex flex-col gap-1 border-t border-spruce/20 pt-2"
        >
          {activities.map((option) => (
            <Link
              key={option.id}
              href={`/tournaments/new?mode=${modeId}&activity=${option.id}`}
              className="border-b border-spruce/15 py-3.5 font-display text-xl font-semibold text-ink transition-colors hover:border-apricot"
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </>
    );
  }

  return (
    <>
      {mode ? (
        <p className="mt-3 text-ink-soft">
          Stemning: <span className="font-medium text-ink">{mode.label}</span>
          {activity && (
            <>
              {" · "}Aktivitet:{" "}
              <span className="font-medium text-ink">{activity.label}</span>
            </>
          )}
        </p>
      ) : (
        <p className="mt-3 text-ink-soft">
          Ingen stemning valgt.{" "}
          <Link href="/" className="underline underline-offset-4">
            Velg på forsiden
          </Link>
          .
        </p>
      )}

      <form className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">
            Turneringens navn
          </span>
          <input
            name="name"
            type="text"
            placeholder={mode ? `${mode.label} hos oss` : "Kveldens turnering"}
            className="w-full border border-spruce/25 bg-white/60 px-4 py-3 text-ink outline-none focus:border-apricot"
          />
        </label>

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
    <div className="min-h-svh bg-mist">
      <main className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium text-spruce underline-offset-4 hover:underline"
        >
          ← Tilbake
        </Link>

        <p className="mt-8 font-display text-2xl font-bold text-spruce">
          Nome Games
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          Ny turnering
        </h1>

        <Suspense fallback={<p className="mt-3 text-ink-soft">Laster…</p>}>
          <NewTournamentForm searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
