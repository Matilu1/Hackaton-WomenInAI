import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { DramaticModeProvider } from "@/components/dramatic-mode";
import "./globals.css";

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
        <DramaticModeProvider>{children}</DramaticModeProvider>
      </body>
    </html>
  );
}
