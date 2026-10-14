/**
 * @deprecated Prefer `categories.ts`. Kept as a thin alias during migration.
 */
export {
  CATEGORIES as EVENT_MODES,
  getCategory as getEventMode,
  isCategoryId as isEventModeId,
  type CategoryId as EventModeId,
} from "./categories";
