import type { Tournament } from "./types";

/** Turneringer lagres i nettleseren (localStorage) til appen får en database. */
const STORAGE_KEY = "nome-tournaments";
const CHANGE_EVENT = "nome-tournaments-change";

function readAll(): Record<string, Tournament> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Rå lagret tekst; stabil verdi for useSyncExternalStore. */
export function readTournamentsSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

export function parseTournament(snapshot: string, id: string): Tournament | null {
  try {
    return (JSON.parse(snapshot) as Record<string, Tournament>)[id] ?? null;
  } catch {
    return null;
  }
}

export function saveTournament(tournament: Tournament) {
  const all = readAll();
  all[tournament.id] = tournament;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeTournaments(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
