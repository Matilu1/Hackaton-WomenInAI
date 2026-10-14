import type { TournamentFormatId } from "./formats";
import type { SportId } from "./sports";

/**
 * Front-page cases from the product table.
 * Extend this list to add new categories later.
 */
export const CATEGORIES = [
  {
    id: "internoppjor",
    label: "Internoppgjør",
    subtitle: "Endelig svar på hvem som er best på jobben",
    typicalSportIds: ["bordtennis", "gaming"] as const satisfies readonly SportId[],
    recommendedFormatIds: [
      "round-robin",
      "king-of-the-hill",
      "americano",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "familieoppjor",
    label: "Familieoppgjør",
    subtitle: "Arven avgjøres her",
    typicalSportIds: ["golf"] as const satisfies readonly SportId[],
    recommendedFormatIds: [
      "round-robin-handicap",
      "elimination-consolation",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "jentetur-guttatur",
    label: "Jentetur / Guttatur",
    subtitle: "Det som skjer på turen blir på tabellen",
    typicalSportIds: ["gaming", "bordtennis"] as const satisfies readonly SportId[],
    recommendedFormatIds: [
      "king-of-the-hill",
      "americano",
      "points-hunt",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "hytteoppjor",
    label: "Hytteoppgjør",
    subtitle: "Påskeferiens VM",
    typicalSportIds: ["golf", "gaming"] as const satisfies readonly SportId[],
    recommendedFormatIds: [
      "total-competition",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "vennegjengen",
    label: "Vennegjengen",
    subtitle: "Gammelt nag, ny tabell",
    typicalSportIds: ["gaming", "sjakk"] as const satisfies readonly SportId[],
    recommendedFormatIds: [
      "ladder",
      "swiss",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "klubb",
    label: "Klubb / skikkelig turnering",
    subtitle: "For dere som tar det seriøst",
    typicalSportIds: ["fotball", "sjakk"] as const satisfies readonly SportId[],
    recommendedFormatIds: [
      "group-playoffs",
      "elimination",
      "swiss",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "wwauqmd",
    label: "WWAUQMD",
    subtitle: "What would an underqualified man do?",
    typicalSportIds: ["gaming", "golf"] as const satisfies readonly SportId[],
    recommendedFormatIds: [
      "swiss",
      "elimination",
      "round-robin",
    ] as const satisfies readonly TournamentFormatId[],
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}

export function getCategory(id: string) {
  return CATEGORIES.find((category) => category.id === id);
}
