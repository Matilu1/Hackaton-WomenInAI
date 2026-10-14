/**
 * Tournament formats. Add new entries here to offer them across the app.
 */
export const TOURNAMENT_FORMATS = [
  {
    id: "round-robin",
    label: "Alle-mot-alle",
    description: "Alle møter alle",
  },
  {
    id: "round-robin-handicap",
    label: "Alle-mot-alle med handicap",
    description: "Jevnere oppgjør med handicap",
  },
  {
    id: "king-of-the-hill",
    label: "King of the Hill",
    description: "Vinneren blir sittende",
  },
  {
    id: "americano",
    label: "Americano",
    description: "Roterende parturnering",
  },
  {
    id: "elimination",
    label: "Utslag",
    description: "Single elimination",
  },
  {
    id: "elimination-consolation",
    label: "Utslag med trøstefinale",
    description: "Utslagsturnering med bronsefinale",
  },
  {
    id: "swiss",
    label: "Sveitsisk",
    description: "Swiss-system pairing",
  },
  {
    id: "ladder",
    label: "Stige",
    description: "Stige over tid",
  },
  {
    id: "group-playoffs",
    label: "Gruppespill + sluttspill",
    description: "Grupper og deretter utslag",
  },
  {
    id: "points-hunt",
    label: "Poengjakt",
    description: "Poeng over hele perioden",
  },
  {
    id: "total-competition",
    label: "Totalkonkurranse",
    description: "Poeng på tvers av øvelser",
  },
] as const;

export type TournamentFormatId = (typeof TOURNAMENT_FORMATS)[number]["id"];

export function isTournamentFormatId(
  value: string,
): value is TournamentFormatId {
  return TOURNAMENT_FORMATS.some((format) => format.id === value);
}

export function getTournamentFormat(id: string) {
  return TOURNAMENT_FORMATS.find((format) => format.id === id);
}

export function getTournamentFormats(ids: readonly TournamentFormatId[]) {
  return ids
    .map((id) => getTournamentFormat(id))
    .filter((format): format is NonNullable<typeof format> => Boolean(format));
}
