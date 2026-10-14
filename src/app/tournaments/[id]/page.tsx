import { Suspense } from "react";
import Link from "next/link";

type TournamentPageProps = {
  params: Promise<{ id: string }>;
};

async function TournamentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <p className="mt-3 text-muted">
      Turneringsvisning for <span className="font-medium text-ink">{id}</span>{" "}
      kommer snart.
    </p>
  );
}

export default function TournamentPage({ params }: TournamentPageProps) {
  return (
    <div className="page-shell relative">
      <main className="relative z-10 mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          ← Forside
        </Link>
        <h1 className="mt-8 font-display text-3xl font-semibold text-ink">
          Turnering
        </h1>
        <Suspense fallback={<p className="mt-3 text-muted">Laster…</p>}>
          <TournamentDetail params={params} />
        </Suspense>
      </main>
    </div>
  );
}
