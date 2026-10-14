import Image from "next/image";
import Link from "next/link";
import { EVENT_MODES } from "@/lib/modes";

export default function Home() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="absolute inset-0">
        <div className="animate-drift absolute inset-0">
          <Image
            src="/ny-bakgrunn.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />
      </div>

      <main className="relative z-10 flex min-h-svh items-center px-6 py-14 sm:px-10 lg:px-16">
        <section className="w-full max-w-xl">
          <p
            className="animate-rise font-display text-5xl font-bold tracking-tight text-rose sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "40ms" }}
          >
            Nome Games
          </p>

          <h1
            className="animate-rise mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-rose sm:text-4xl"
            style={{ animationDelay: "120ms" }}
          >
            Velg kveldens oppgjør
          </h1>

          <p
            className="animate-rise mt-4 max-w-md text-base leading-relaxed text-rose-soft sm:text-lg"
            style={{ animationDelay: "200ms" }}
          >
            Opprett turnering og følg fremdriften — med single elim, round robin
            og Swiss.
          </p>

          <nav
            aria-label="Velg stemning"
            className="mt-9 flex flex-col gap-1 border-t border-spruce/20 pt-2"
          >
            {EVENT_MODES.map((mode, index) => (
              <Link
                key={mode.id}
                href={`/tournaments/new?mode=${mode.id}`}
                className="animate-mode group flex items-baseline justify-between gap-4 border-b border-spruce/15 py-3.5 transition-colors hover:border-apricot focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apricot"
                style={{ animationDelay: `${280 + index * 70}ms` }}
              >
                <span className="font-display text-xl font-semibold text-rose transition-transform duration-200 group-hover:translate-x-1 sm:text-2xl">
                  {mode.label}
                </span>
                <span className="hidden text-sm text-rose-soft sm:inline">
                  {mode.blurb}
                </span>
              </Link>
            ))}
          </nav>
        </section>
      </main>
    </div>
  );
}
