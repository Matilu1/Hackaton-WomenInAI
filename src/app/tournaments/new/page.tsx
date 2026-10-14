import { Suspense } from "react";
import Link from "next/link";
import { getEventMode, isEventModeId } from "@/lib/modes";

type NewTournamentPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

const FORMAT_OPTIONS = [
  { id: "single-elimination", label: "Single elimination" },
  { id: "round-robin", label: "Round robin" },
  { id: "swiss", label: "Swiss" },
] as const;

async function NewTournamentForm({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const modeId = params.mode && isEventModeId(params.mode) ? params.mode : null;
  const mode = modeId ? getEventMode(modeId) : null;

  return (
    <>
      {mode ? (
        <p className="mt-3 text-ink-soft">
          Stemning: <span className="font-medium text-ink">{mode.label}</span>
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
            {FORMAT_OPTIONS.map((format) => (
              <label
                key={format.id}
                className="flex cursor-pointer items-center gap-3 border-b border-spruce/15 py-3 has-[:checked]:text-spruce"
              >
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  defaultChecked={format.id === "swiss"}
                  className="accent-apricot"
                />
                <span>{format.label}</span>
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
