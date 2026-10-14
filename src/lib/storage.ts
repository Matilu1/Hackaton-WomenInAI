import type { Tournament } from "./types";

const STORAGE_KEY = "nome-tournaments";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function listTournaments(): Tournament[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Tournament[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getTournament(id: string): Tournament | null {
  return listTournaments().find((tournament) => tournament.id === id) ?? null;
}

export function saveTournament(tournament: Tournament): void {
  if (!canUseStorage()) return;
  const others = listTournaments().filter((item) => item.id !== tournament.id);
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([tournament, ...others]),
  );
}
