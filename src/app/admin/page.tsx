"use client";

import Link from "next/link";
import { useDramaticMode } from "@/components/dramatic-mode";

export default function AdminPage() {
  const { dramatic, setDramatic } = useDramaticMode();

  return (
    <div className="page-shell relative">
      <main className="relative z-10 mx-auto w-full max-w-xl px-6 py-12 sm:px-10">
        <Link
          href="/"
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          ← Forside
        </Link>

        <p className="mt-8 font-display text-2xl font-bold text-ink">
          Nome Games
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
          Admin
        </h1>
        <p className="mt-3 text-muted">
          Innstillinger som påvirker hele opplevelsen.
        </p>

        <section className="mt-10 border-t border-line pt-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Dramatic mode
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Når dette er på, vises all tekst i CAPSLOCK over hele appen.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={dramatic}
              onClick={() => setDramatic(!dramatic)}
              className={`shrink-0 border px-4 py-2 font-display text-sm font-semibold transition-colors ${
                dramatic
                  ? "border-ink bg-ink text-stone"
                  : "border-line bg-transparent text-ink"
              }`}
            >
              {dramatic ? "På" : "Av"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
