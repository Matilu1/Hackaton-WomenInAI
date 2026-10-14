import type { CategoryId } from "./categories";
import type { TournamentFormatId } from "./formats";
import type { SportId } from "./sports";

/**
 * Engelske tekster for katalogene. Records gjør at TypeScript klager
 * hvis en ny kategori, sport eller et nytt format mangler oversettelse.
 */
export const CATEGORY_EN: Record<CategoryId, { label: string; subtitle: string }> = {
  internoppjor: {
    label: "Office showdown",
    subtitle: "Finally settling who's best at work",
  },
  familieoppjor: {
    label: "Family showdown",
    subtitle: "The inheritance is decided here",
  },
  "jentetur-guttatur": {
    label: "Girls' trip / Boys' trip",
    subtitle: "What happens on the trip stays on the table",
  },
  hytteoppjor: {
    label: "Cabin showdown",
    subtitle: "The Easter holiday World Cup",
  },
  vennegjengen: {
    label: "The friend group",
    subtitle: "Old grudges, new table",
  },
  klubb: {
    label: "Club / proper tournament",
    subtitle: "For those who take it seriously",
  },
  wwauqmd: {
    label: "WWAUQMD",
    subtitle: "What would an underqualified man do?",
  },
};

export const SPORT_EN: Record<SportId, string> = {
  fotball: "Football",
  golf: "Golf",
  gaming: "Gaming",
  fifa: "FIFA",
  sjakk: "Chess",
  bordtennis: "Table tennis",
};

export const FORMAT_EN: Record<
  TournamentFormatId,
  { label: string; description: string }
> = {
  "round-robin": {
    label: "Round robin",
    description: "Everyone plays everyone",
  },
  "round-robin-handicap": {
    label: "Round robin with handicap",
    description: "Closer matches with handicap",
  },
  "king-of-the-hill": {
    label: "King of the Hill",
    description: "The winner stays on",
  },
  americano: {
    label: "Americano",
    description: "Rotating doubles tournament",
  },
  elimination: {
    label: "Knockout",
    description: "Single elimination",
  },
  "elimination-consolation": {
    label: "Knockout with consolation final",
    description: "Knockout with a bronze final",
  },
  swiss: {
    label: "Swiss",
    description: "Swiss-system pairing",
  },
  ladder: {
    label: "Ladder",
    description: "A ladder over time",
  },
  "group-playoffs": {
    label: "Groups + playoffs",
    description: "Groups, then knockout",
  },
  "points-hunt": {
    label: "Points hunt",
    description: "Points across the whole period",
  },
  "total-competition": {
    label: "Overall competition",
    description: "Points across events",
  },
};

/** Engelsk motstykke til `formatDescriptions` på en kategori. */
export const CATEGORY_FORMAT_DESCRIPTIONS_EN: Partial<
  Record<CategoryId, Partial<Record<TournamentFormatId, string>>>
> = {
  wwauqmd: {
    swiss: "Swiss stage (nobody understands the table, everyone's an expert)",
    elimination: "Knockout (but everyone thinks they actually won)",
    "round-robin": "Everyone vs everyone (the excuses rotate too)",
    "round-robin-handicap":
      "Round robin with handicap (handicap is just a number)",
    "elimination-consolation":
      "Knockout with consolation final (everyone needs consolation)",
  },
};
