"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useDramaticMode } from "@/components/dramatic-mode";

const STORAGE_KEY = "nome-dark";
const DARK_EVENT = "nome-dark-change";

const BUTTON_CLASS =
  "mode-toggle-surface rounded-full border border-line bg-white/40 px-4 py-2 text-sm font-medium text-ink backdrop-blur transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function readStoredDark() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function applyDark(on: boolean) {
  document.documentElement.dataset.dark = on ? "on" : "off";
  window.dispatchEvent(new Event(DARK_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(DARK_EVENT, onChange);
  return () => window.removeEventListener(DARK_EVENT, onChange);
}

/** Setter data-dark="on" på <html> og husker valget. */
export function ModeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.dark === "on",
    () => false,
  );

  useEffect(() => {
    applyDark(readStoredDark());
  }, []);

  function toggle() {
    applyDark(!dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "off" : "on");
    } catch {
      // Valget huskes bare ikke når lagring er blokkert.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className={BUTTON_CLASS}
    >
      {dark ? "☀️ Normal mode" : "🌙 Dark mode"}
    </button>
  );
}

/** Snarvei til dramatic mode fra admin-siden. */
export function DramaticToggle() {
  const { dramatic, setDramatic } = useDramaticMode();

  return (
    <button
      type="button"
      onClick={() => setDramatic(!dramatic)}
      aria-pressed={dramatic}
      className={BUTTON_CLASS}
    >
      {dramatic ? "😌 Calm mode" : "🎭 Dramatic mode"}
    </button>
  );
}
