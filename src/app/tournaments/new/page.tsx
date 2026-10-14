import { Suspense } from "react";
import Link from "next/link";
import { CreateTournamentFlow } from "@/components/create-tournament-flow";
import { isCategoryId } from "@/lib/categories";
import TournamentPlayerSetup from "./tournament-player-setup";

type NewTournamentPageProps = {
  searchParams: Promise<{ category?: string; mode?: string }>;
};

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
      <CreateTournamentFlow categoryId={categoryId} />
      <TournamentPlayerSetup />
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
