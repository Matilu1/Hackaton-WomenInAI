import { describe, expect, it } from "vitest";
import { EVENT_MODES, getEventMode, isEventModeId } from "./modes";

describe("EVENT_MODES", () => {
  it("includes the four front-page modes", () => {
    expect(EVENT_MODES.map((mode) => mode.label)).toEqual([
      "Familie oppgjør",
      "Girls night",
      "Jobb oppgjør",
      "Lønningspils",
    ]);
  });

  it("validates mode ids", () => {
    expect(isEventModeId("girls-night")).toBe(true);
    expect(isEventModeId("unknown")).toBe(false);
    expect(getEventMode("lonningspils")?.label).toBe("Lønningspils");
  });
});
