import { getCategory, type CategoryId } from "./categories";
import {
  getTournamentFormats,
  type TournamentFormatId,
} from "./formats";
import { getSport, SPORTS, type SportId } from "./sports";

/**
 * Suggest bracket formats for a sport, optionally ranked for a category.
 * Sport drives the list (table mapping); category formats that overlap
 * are listed first as strongest fits.
 */
export function suggestFormats(
  sportId: SportId,
  categoryId?: CategoryId | null,
) {
  const sport = getSport(sportId);
  if (!sport) return [];

  const sportFormats = [...sport.suggestedFormatIds] as TournamentFormatId[];
  const category = categoryId ? getCategory(categoryId) : undefined;
  const categorySet = new Set<TournamentFormatId>(
    category?.recommendedFormatIds ?? [],
  );

  const descriptions: Partial<Record<TournamentFormatId, string>> =
    category && "formatDescriptions" in category
      ? category.formatDescriptions
      : {};

  const prioritized = [
    ...sportFormats.filter((id) => categorySet.has(id)),
    ...sportFormats.filter((id) => !categorySet.has(id)),
  ];

  return getTournamentFormats(prioritized).map((format) => ({
    ...format,
    description: descriptions[format.id] ?? format.description,
    highlighted: categorySet.has(format.id),
  }));
}

/** Typical sports for the category first, then the rest — all still selectable. */
export function sportsForCategory(categoryId: CategoryId) {
  const category = getCategory(categoryId);
  if (!category) return [...SPORTS];

  const typical = new Set<string>(category.typicalSportIds);

  return [...SPORTS].sort((a, b) => {
    const aTypical = typical.has(a.id) ? 0 : 1;
    const bTypical = typical.has(b.id) ? 0 : 1;
    return aTypical - bTypical;
  });
}
