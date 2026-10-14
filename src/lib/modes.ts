/**
 * Compatibility helpers. Prefer `categories.ts`, `sports.ts`, and `formats.ts`.
 */
export {
  CATEGORIES as EVENT_MODES,
  getCategory as getEventMode,
  isCategoryId as isEventModeId,
  type CategoryId as EventModeId,
} from "./categories";

import { getCategory } from "./categories";
import { getSport } from "./sports";
import { suggestFormats } from "./suggestions";

/** @deprecated Prefer sportsForCategory + SPORTS */
export function getModeActivities(id: string) {
  const category = getCategory(id);
  if (!category) return [];

  return category.typicalSportIds.map((sportId) => {
    const sport = getSport(sportId);
    const formats = suggestFormats(sportId, category.id).map((format) => ({
      id: format.id,
      description: format.description,
    }));
    return {
      id: sportId,
      label: sport?.label ?? sportId,
      formats,
    };
  });
}

/** @deprecated Prefer getSport + suggestFormats */
export function getModeActivity(modeId: string, activityId: string) {
  return getModeActivities(modeId).find(
    (activity) => activity.id === activityId,
  );
}
