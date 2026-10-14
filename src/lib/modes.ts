export const EVENT_MODES = [
  {
    id: "familie-oppgjor",
    label: "Familie oppgjør",
    blurb: "Koselig konkurranse rundt bordet",
  },
  {
    id: "girls-night",
    label: "Girls night",
    blurb: "Kvelden hvor alle vil vinne",
  },
  {
    id: "jobb-oppgjor",
    label: "Jobb oppgjør",
    blurb: "Lagbygging med litt ekstra gnist",
  },
  {
    id: "lonningspils",
    label: "Lønningspils",
    blurb: "Etter jobb, før neste runde",
  },
] as const;

export type EventModeId = (typeof EVENT_MODES)[number]["id"];

export function isEventModeId(value: string): value is EventModeId {
  return EVENT_MODES.some((mode) => mode.id === value);
}

export function getEventMode(id: string) {
  return EVENT_MODES.find((mode) => mode.id === id);
}
