"use client";

import { useState } from "react";

const INITIAL_PLAYERS = [
  { id: "malin", name: "Malin", rating: "8.0" },
  { id: "matilde", name: "Matilde", rating: "6.5" },
  { id: "lona", name: "Lona", rating: "7.0" },
  { id: "stella", name: "Stella", rating: "6.0" },
  { id: "tuva", name: "Tuva", rating: "7.5" },
];

const PLAYER_SETUP_OPTIONS = [
  {
    id: "lucky-loser",
    label: "Lucky loser",
    description:
      "Spilleren med høyest rating (Spiller 1) går direkte videre.",
  },
  {
    id: "qualifier",
    label: "Innledende kamp",
    description:
      "De to lavest rangerte spillerne spiller om en plass i neste runde. De øvrige spillerne går direkte videre.",
  },
] as const;

export default function TournamentPlayerSetup() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [nextPlayerNumber, setNextPlayerNumber] = useState(
    INITIAL_PLAYERS.length + 1,
  );

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
        Spillere og rating
      </legend>
      <div className="space-y-2">
        {seededPlayers.map((player, index) => (
          <div
            key={player.id}
            className="grid grid-cols-[6rem_minmax(0,1fr)_6rem_auto] items-center gap-3 border-b border-spruce/15 py-3"
          >
            <span className="text-sm font-medium text-spruce">
              Spiller {index + 1}
            </span>
            <input
              type="text"
              name={`name-${player.id}`}
              required
              value={player.name}
              onChange={(event) => {
                const name = event.target.value;
                setPlayers((currentPlayers) =>
                  currentPlayers.map((currentPlayer) =>
                    currentPlayer.id === player.id
                      ? { ...currentPlayer, name }
                      : currentPlayer,
                  ),
                );
              }}
              aria-label={`${player.name} sitt navn`}
              className="w-full min-w-0 border border-spruce/25 bg-white/60 px-3 py-2 text-ink outline-none focus:border-apricot"
            />
            <input
              id={`rating-${player.id}`}
              name={`rating-${player.id}`}
              type="number"
              min="1"
              max="8"
              step="0.1"
              required
              value={player.rating}
              onChange={(event) => {
                const rating = event.target.value;
                setPlayers((currentPlayers) =>
                  currentPlayers.map((currentPlayer) =>
                    currentPlayer.id === player.id
                      ? { ...currentPlayer, rating }
                      : currentPlayer,
                  ),
                );
              }}
              aria-label={`${player.name} sin rating`}
              placeholder="Rating"
              className="w-full border border-spruce/25 bg-white/60 px-3 py-2 text-right text-ink outline-none focus:border-apricot"
            />
            <button
              type="button"
              onClick={() =>
                setPlayers((currentPlayers) =>
                  currentPlayers.filter(
                    (currentPlayer) => currentPlayer.id !== player.id,
                  ),
                )
              }
              aria-label={`Slett ${player.name}`}
              title={`Slett ${player.name}`}
              className="px-2 py-2 text-sm text-ink-soft transition-colors hover:text-apricot focus-visible:outline focus-visible:outline-2 focus-visible:outline-apricot"
            >
              Slett
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          const id = `player-${nextPlayerNumber}`;
          setPlayers((currentPlayers) => [
            ...currentPlayers,
            { id, name: `Spiller ${nextPlayerNumber}`, rating: "1.0" },
          ]);
          setNextPlayerNumber((currentNumber) => currentNumber + 1);
        }}
        className="mt-4 border border-spruce/30 px-4 py-2 text-sm font-medium text-spruce transition-colors hover:border-apricot"
      >
        + Legg til spiller
      </button>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-ink">
          Oppsett for {players.length} spillere
        </legend>
        {players.length % 2 === 1 && (
          <div className="space-y-2">
            {PLAYER_SETUP_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 border-b border-spruce/15 py-3 has-[:checked]:text-spruce"
              >
                <input
                  type="radio"
                  name="player-setup"
                  value={option.id}
                  required
                  className="mt-1 accent-apricot"
                />
                <span>
                  <span className="block font-medium">{option.label}</span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>
    </fieldset>
  );
}
