"use client";

import type { Match, Player } from "@/lib/types";
import { bracketSeedOrder } from "@/lib/tournament-engine";
import { useLanguage } from "./language";

const BOX_W = 200;
const ROW_H = 30;
const BOX_H = ROW_H * 2;
const COL_STEP = BOX_W + 56;
const HEADER_H = 36;
const SLOT_H = 96;

type Props = {
  matches: Match[];
  players: Player[];
};

/** Sluttspill-bracket som SVG, så den kan skrives ut slik den står. */
export function KnockoutBracket({ matches, players }: Props) {
  const { t } = useLanguage();
  const nameOf = new Map(players.map((player) => [player.id, player.name]));
  const rounds = [...new Set(matches.map((match) => match.round))].sort(
    (a, b) => a - b,
  );
  if (rounds.length === 0) return null;

  const firstRoundCount = matches.filter((m) => m.round === rounds[0]).length;
  const seedOrder = bracketSeedOrder(firstRoundCount * 2);
  const bodyH = Math.max(firstRoundCount * SLOT_H, 160);
  const height = HEADER_H + bodyH;
  const width = rounds.length * COL_STEP + BOX_W;
  const final = matches.find((m) => m.round === rounds.at(-1));
  const championName = final?.winnerId ? nameOf.get(final.winnerId) : undefined;

  function roundName(count: number) {
    if (count === 1) return t("Finale", "Final");
    if (count === 2) return t("Semifinaler", "Semifinals");
    if (count === 4) return t("Kvartfinaler", "Quarterfinals");
    return t(`Runde med ${count} kamper`, `Round of ${count * 2}`);
  }

  function centerY(round: number, slot: number) {
    const count = matches.filter((m) => m.round === round).length;
    return HEADER_H + ((slot + 0.5) * bodyH) / count;
  }

  function label(match: Match, side: "A" | "B") {
    const id = side === "A" ? match.playerAId : match.playerBId;
    if (match.round === rounds[0]) {
      const place = seedOrder[(match.slot ?? 0) * 2 + (side === "A" ? 0 : 1)];
      return id
        ? `${place}. ${nameOf.get(id) ?? ""}`
        : t(`${place}. plass i gruppen`, `Group #${place}`);
    }
    return id ? (nameOf.get(id) ?? "") : t("Venter på vinner", "Awaiting winner");
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label={t("Sluttspill", "Playoffs")}
      className="max-w-full font-sans"
      style={{ minWidth: Math.min(width, 640) }}
    >
      {rounds.map((round, column) => {
        const roundMatches = matches.filter((m) => m.round === round);
        const x = column * COL_STEP;
        return (
          <g key={round}>
            <text x={x} y={20} className="fill-muted font-display text-[13px] font-semibold uppercase tracking-wider">
              {roundName(roundMatches.length)}
            </text>
            {roundMatches.map((match) => {
              const cy = centerY(round, match.slot ?? 0);
              const top = cy - BOX_H / 2;
              const nextY =
                column < rounds.length - 1
                  ? centerY(round + 1, Math.floor((match.slot ?? 0) / 2))
                  : cy;
              const midX = x + BOX_W + (COL_STEP - BOX_W) / 2;
              return (
                <g key={match.id}>
                  <path
                    d={`M ${x + BOX_W} ${cy} H ${midX} V ${nextY} H ${x + COL_STEP}`}
                    className="fill-none stroke-line"
                    strokeWidth={2}
                  />
                  <rect x={x} y={top} width={BOX_W} height={BOX_H} rx={6} className="fill-stone stroke-line" strokeWidth={1.5} />
                  {(["A", "B"] as const).map((side, row) => {
                    const id = side === "A" ? match.playerAId : match.playerBId;
                    const score = side === "A" ? match.scoreA : match.scoreB;
                    const won = Boolean(id && match.winnerId === id);
                    const y = top + row * ROW_H;
                    return (
                      <g key={side}>
                        {won ? (
                          <rect x={x + 1} y={y + 1} width={BOX_W - 2} height={ROW_H - 2} rx={5} className="fill-accent-soft/30" />
                        ) : null}
                        <text
                          x={x + 10}
                          y={y + ROW_H / 2 + 5}
                          className={`text-[13px] ${id ? "fill-ink" : "fill-muted italic"} ${won ? "font-bold" : ""}`}
                        >
                          {label(match, side)}
                        </text>
                        <text
                          x={x + BOX_W - 10}
                          y={y + ROW_H / 2 + 5}
                          textAnchor="end"
                          className={`fill-ink text-[13px] ${won ? "font-bold" : ""}`}
                        >
                          {score ?? ""}
                        </text>
                      </g>
                    );
                  })}
                  <line x1={x} x2={x + BOX_W} y1={cy} y2={cy} className="stroke-line" />
                </g>
              );
            })}
          </g>
        );
      })}
      <g>
        <text x={rounds.length * COL_STEP} y={20} className="fill-muted font-display text-[13px] font-semibold uppercase tracking-wider">
          {t("Vinner", "Champion")}
        </text>
        <rect
          x={rounds.length * COL_STEP}
          y={HEADER_H + bodyH / 2 - ROW_H / 2 - 4}
          width={BOX_W}
          height={ROW_H + 8}
          rx={6}
          className={championName ? "fill-accent stroke-accent" : "fill-stone stroke-line"}
          strokeWidth={1.5}
        />
        <text
          x={rounds.length * COL_STEP + 10}
          y={HEADER_H + bodyH / 2 + 5}
          className={`text-[14px] font-bold ${championName ? "fill-stone" : "fill-muted italic"}`}
        >
          🏆 {championName ?? "?"}
        </text>
      </g>
    </svg>
  );
}
