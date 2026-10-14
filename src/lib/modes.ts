export const EVENT_MODES = [
  {
    id: "familie-oppgjor",
    label: "Familieoppgjør",
    blurb: "Koselig konkurranse rundt bordet",
  },
  {
    id: "girls-night",
    label: "Girls night",
    blurb: "Kvelden hvor alle vil vinne",
  },
  {
    id: "jobb-oppgjor",
    label: "Jobboppgjør",
    blurb: "Lagbygging med litt ekstra gnist",
  },
  {
    id: "lonningspils",
    label: "Lønningspils",
    blurb: "Etter jobb, før neste runde",
  },
  {
    id: "wwauqmd",
    label: "WWAUQMD",
    blurb: "What would an underqualified man do?",
    activities: [
      {
        id: "fifa",
        label: "FIFA",
        formats: [
          {
            id: "swiss",
            description: "Swiss stage (ingen skjønner tabellen, alle er eksperter)",
          },
          {
            id: "single-elimination",
            description: "Utslag (men alle mener de egentlig vant)",
          },
          {
            id: "round-robin",
            description: "Alle mot alle (unnskyldningene roterer også)",
          },
        ],
      },
      {
        id: "golf",
        label: "Golf",
        formats: [
          {
            id: "single-elimination",
            description: "Utslag (handicap er bare et tall)",
          },
          {
            id: "round-robin",
            description: "Alle mot alle (ingen har lest reglene)",
          },
        ],
      },
    ],
  },
] as const;

export type EventModeId = (typeof EVENT_MODES)[number]["id"];

export function isEventModeId(value: string): value is EventModeId {
  return EVENT_MODES.some((mode) => mode.id === value);
}

export function getEventMode(id: string) {
  return EVENT_MODES.find((mode) => mode.id === id);
}

/** Activities for a mode; empty for modes without an activity step. */
export function getModeActivities(id: string) {
  const mode = getEventMode(id);
  return mode && "activities" in mode ? mode.activities : [];
}

export function getModeActivity(modeId: string, activityId: string) {
  return getModeActivities(modeId).find(
    (activity) => activity.id === activityId,
  );
}
