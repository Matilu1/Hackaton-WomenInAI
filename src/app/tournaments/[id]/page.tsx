import { Suspense } from "react";
import Link from "next/link";
import { T } from "@/components/language";
import { TournamentView } from "@/components/tournament-view";

type TournamentPageProps = {
  params: Promise<{ id: string }>;
};

async function TournamentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TournamentView id={id} />;
}

export default function TournamentPage({ params }: TournamentPageProps) {
  return (
    <div className="page-shell relative">
      <main className="relative z-10 mx-auto w-full max-w-4xl px-6 py-12 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium text-accent underline-offset-4 hover:underline print:hidden"
        >
          ← <T no="Forside" en="Home" />
        </Link>
        <Suspense
          fallback={
            <p className="mt-3 text-muted">
              <T no="Laster…" en="Loading…" />
            </p>
          }
        >
          <TournamentDetail params={params} />
        </Suspense>
      </main>
    </div>
  );
}
