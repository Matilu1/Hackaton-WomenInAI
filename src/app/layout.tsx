import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { DramaticToggle, ModeToggle } from "./ui/mode-toggle";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
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
      className={`${bricolage.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2 sm:right-10 sm:top-6 lg:right-16">
          <ModeToggle />
          <DramaticToggle />
        </div>
      </body>
    </html>
  );
}
