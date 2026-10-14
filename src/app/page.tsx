import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  return (
    <div className="page-shell relative overflow-hidden">
      <main className="relative z-10 mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center px-6 py-16 sm:px-10">
        <p
          className="animate-rise font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl"
          style={{ animationDelay: "40ms" }}
        >
          Nome Games
        </p>

        <h1
          className="animate-rise mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl"
          style={{ animationDelay: "120ms" }}
        >
          Velg kveldens oppgjør
        </h1>

        <p
          className="animate-rise mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
          style={{ animationDelay: "200ms" }}
        >
          Velg kategori, sport og bracket — med sveitsisk og flere oppsett.
        </p>

        <nav
          aria-label="Velg kategori"
          className="mt-10 border-t border-line"
        >
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.id}
              href={`/tournaments/new?category=${category.id}`}
              className="animate-mode group flex flex-col gap-1 border-b border-line py-4 transition-colors hover:border-accent sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              style={{ animationDelay: `${280 + index * 60}ms` }}
            >
              <span className="font-display text-xl font-semibold text-ink transition-transform duration-200 group-hover:translate-x-1 sm:text-2xl">
                {category.label}
              </span>
              <span className="text-sm text-muted sm:text-right">
                {category.subtitle}
              </span>
            </Link>
          ))}
        </nav>

        <p
          className="animate-rise mt-12 text-sm text-muted"
          style={{ animationDelay: "700ms" }}
        >
          <Link href="/admin" className="underline-offset-4 hover:underline">
            Admin
          </Link>
        </p>
      </main>
    </div>
  );
}
