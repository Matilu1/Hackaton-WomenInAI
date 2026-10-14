"use client";

import { useLanguage } from "@/components/language";

export type PlayerRatingInput = { id: string; name: string; rating: string };

export const INITIAL_PLAYERS: PlayerRatingInput[] = [
  { id: "malin", name: "Malin", rating: "" },
  { id: "matilde", name: "Matilde", rating: "" },
  { id: "lona", name: "Lona", rating: "" },
  { id: "stella", name: "Stella", rating: "" },
  { id: "tuva", name: "Tuva", rating: "" },
];

export default function SeededPlayerRatings({
  players,
  onChange,
}: {
  players: PlayerRatingInput[];
  onChange: (players: PlayerRatingInput[]) => void;
}) {
  const { t } = useLanguage();

  const seededPlayers = players
    .map((player, initialOrder) => ({
      ...player,
      initialOrder,
      numericRating:
        player.rating.trim() === "" ? null : Number(player.rating),
    }))
    .sort((a, b) => {
      if (a.numericRating === null) {
        return b.numericRating === null ? a.initialOrder - b.initialOrder : 1;
      }
      if (b.numericRating === null) return -1;
      return b.numericRating - a.numericRating || a.initialOrder - b.initialOrder;
    });

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-ink">
        {t("Spillere og rating", "Players and ratings")}
      </legend>
      <p className="mb-3 text-sm text-ink-soft">
        {t(
          "Legg inn spillernes eksisterende rating. Seedingen sorteres fra høyest til lavest.",
          "Enter each player’s existing rating. Seeding is sorted from highest to lowest.",
        )}
      </p>
      <div className="space-y-2">
        {seededPlayers.map((player, index) => (
          <label
            key={player.id}
            htmlFor={`rating-${player.id}`}
            className="grid grid-cols-[5rem_1fr_8rem] items-center gap-3 border-b border-spruce/15 py-3"
          >
            <span className="text-sm font-medium text-spruce">
              {player.numericRating === null
                ? t("Ikke seedet", "Unseeded")
                : `Seed ${index + 1}`}
            </span>
            <span className="text-ink">{player.name}</span>
            <input
              id={`rating-${player.id}`}
              name={`rating-${player.id}`}
              type="number"
              min="0"
              step="any"
              required
              value={player.rating}
              onChange={(event) => {
                const rating = event.target.value;
                onChange(
                  players.map((currentPlayer) =>
                    currentPlayer.id === player.id
                      ? { ...currentPlayer, rating }
                      : currentPlayer,
                  ),
                );
              }}
              aria-label={t(`${player.name} sin rating`, `${player.name}’s rating`)}
              placeholder="Rating"
              className="w-full border border-spruce/25 bg-white/60 px-3 py-2 text-right text-ink outline-none focus:border-apricot"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
