import { describe, expect, it } from "vitest";
import { CATEGORIES, getCategory, isCategoryId } from "./categories";
import { SPORTS } from "./sports";
import { suggestFormats } from "./suggestions";

describe("CATEGORIES", () => {
  it("includes the front-page cases", () => {
    expect(CATEGORIES.map((category) => category.label)).toEqual([
      "Internoppgjør",
      "Familieoppgjør",
      "Jentetur / Guttatur",
      "Hytteoppgjør",
      "Vennegjengen",
      "Klubb / skikkelig turnering",
      "WWAUQMD",
    ]);
  });

  it("validates category ids", () => {
    expect(isCategoryId("klubb")).toBe(true);
    expect(isCategoryId("unknown")).toBe(false);
    expect(getCategory("familieoppjor")?.subtitle).toBe("Arven avgjøres her");
  });
});

describe("SPORTS", () => {
  it("includes the selectable sports", () => {
    expect(SPORTS.map((sport) => sport.id)).toEqual([
      "fotball",
      "golf",
      "gaming",
      "fifa",
      "sjakk",
      "bordtennis",
    ]);
  });
});

describe("suggestFormats", () => {
  it("suggests Swiss for chess", () => {
    const ids = suggestFormats("sjakk").map((format) => format.id);
    expect(ids).toContain("swiss");
    expect(ids).toContain("ladder");
  });

  it("prioritizes category overlap for football in club", () => {
    const suggested = suggestFormats("fotball", "klubb");
    expect(suggested[0]?.id).toBe("group-playoffs");
    expect(suggested.every((format) => format.highlighted)).toBe(true);
  });

  it("suggests intern formats for table tennis", () => {
    expect(suggestFormats("bordtennis").map((format) => format.id)).toEqual([
      "round-robin",
      "king-of-the-hill",
      "americano",
    ]);
  });

  it("uses WWAUQMD's own descriptions for FIFA, starting with Swiss", () => {
    const suggested = suggestFormats("fifa", "wwauqmd");
    expect(suggested[0]?.id).toBe("swiss");
    expect(suggested[1]?.description).toBe(
      "Utslag (men alle mener de egentlig vant)",
    );
  });

  it("keeps default descriptions outside WWAUQMD", () => {
    expect(suggestFormats("fifa")[1]?.description).toBe("Single elimination");
  });
});
