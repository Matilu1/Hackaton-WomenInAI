import { describe, expect, it } from "vitest";
import {
  EVENT_MODES,
  getEventMode,
  getModeActivities,
  getModeActivity,
  isEventModeId,
} from "./modes";

describe("EVENT_MODES", () => {
  it("includes the front-page modes", () => {
    expect(EVENT_MODES.map((mode) => mode.label)).toEqual([
      "Familie oppgjør",
      "Girls night",
      "Jobb oppgjør",
      "Lønningspils",
      "WWAUQMD",
    ]);
  });

  it("validates mode ids", () => {
    expect(isEventModeId("girls-night")).toBe(true);
    expect(isEventModeId("unknown")).toBe(false);
    expect(getEventMode("lonningspils")?.label).toBe("Lønningspils");
  });

  it("exposes activities only for modes that have them", () => {
    expect(getModeActivities("wwauqmd").map((a) => a.label)).toEqual([
      "FIFA",
      "Golf",
    ]);
    expect(getModeActivities("girls-night")).toEqual([]);
    expect(getModeActivity("wwauqmd", "fifa")?.formats[0].id).toBe("swiss");
    expect(getModeActivity("wwauqmd", "padel")).toBeUndefined();
  });
});
