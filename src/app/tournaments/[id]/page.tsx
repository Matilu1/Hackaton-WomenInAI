import { Suspense } from "react";
import Link from "next/link";
import { BracketView } from "@/components/bracket-view";

type TournamentPageProps = {
  params: Promise<{ id: string }>;
};

async function TournamentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BracketView tournamentId={id} />;
}

export default function TournamentPage({ params }: TournamentPageProps) {
  return (
    <div className="page-shell relative">
      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          ← Forside
        </Link>
        <Suspense fallback={<p className="mt-8 text-muted">Laster bracket…</p>}>
          <TournamentDetail params={params} />
        </Suspense>
      </main>
    </div>
  );
}
