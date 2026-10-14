import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { DramaticModeProvider } from "@/components/dramatic-mode";
import "./globals.css";
import { LanguageInit } from "@/components/language";
import { DramaticToggle, LanguageToggle, ModeToggle } from "./ui/mode-toggle";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nome Games — Turneringer",
  description:
    "Opprett turneringer med ulike oppsett, inkludert Swiss, og oppdater fremdriften underveis.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nb"
      className={`${syne.variable} ${manrope.variable} h-full antialiased`}
      data-dramatic="off"
    >
      <body className="min-h-full flex flex-col">
        <LanguageInit />
        <DramaticModeProvider>
          {children}
          <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2 print:hidden sm:right-10 sm:top-6 lg:right-16">
            <ModeToggle />
            <DramaticToggle />
            <LanguageToggle />
          </div>
        </DramaticModeProvider>
      </body>
    </html>
  );
}
