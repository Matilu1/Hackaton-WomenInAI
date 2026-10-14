import type { TournamentFormatId } from "./formats";

/**
 * Selectable sports. Add a new object here to extend the list later —
 * no UI changes required beyond this catalog.
 *
 * `suggestedFormatIds` are derived from the front-page case table
 * (which activities map to which recommended formats).
 */
export const SPORTS = [
  {
    id: "fotball",
    label: "Fotball",
    // Klubb / skikkelig turnering
    suggestedFormatIds: [
      "group-playoffs",
      "elimination",
      "swiss",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "golf",
    label: "Golf",
    // Familieoppgjør (minigolf)
    suggestedFormatIds: [
      "round-robin-handicap",
      "elimination-consolation",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "gaming",
    label: "Gaming",
    // Internoppgjør (Mario Kart) + Vennegjengen (FIFA)
    suggestedFormatIds: [
      "round-robin",
      "king-of-the-hill",
      "americano",
      "ladder",
      "swiss",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "sjakk",
    label: "Sjakk",
    // Vennegjengen + Klubb
    suggestedFormatIds: [
      "ladder",
      "swiss",
      "group-playoffs",
      "elimination",
    ] as const satisfies readonly TournamentFormatId[],
  },
  {
    id: "bordtennis",
    label: "Bordtennis",
    // Internoppgjør
    suggestedFormatIds: [
      "round-robin",
      "king-of-the-hill",
      "americano",
    ] as const satisfies readonly TournamentFormatId[],
  },
] as const;

export type SportId = (typeof SPORTS)[number]["id"];

export function isSportId(value: string): value is SportId {
  return SPORTS.some((sport) => sport.id === value);
}

export function getSport(id: string) {
  return SPORTS.find((sport) => sport.id === id);
}
