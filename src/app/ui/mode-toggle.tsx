"use client";

import { useEffect, useSyncExternalStore } from "react";

type Flag = "dark" | "dramatic";

const FLAG_EVENT = "nome-flag-change";

function storageKey(flag: Flag) {
  return `nome-${flag}`;
}

function readStoredFlag(flag: Flag) {
  try {
    return localStorage.getItem(storageKey(flag)) === "on";
  } catch {
    return false;
  }
}

function applyFlag(flag: Flag, on: boolean) {
  document.documentElement.dataset[flag] = on ? "on" : "off";
  window.dispatchEvent(new Event(FLAG_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(FLAG_EVENT, onChange);
  return () => window.removeEventListener(FLAG_EVENT, onChange);
}

/** Av/på-bryter som setter data-<flag>="on" på <html> og husker valget. */
function FlagToggle({
  flag,
  onLabel,
  offLabel,
}: {
  flag: Flag;
  onLabel: string;
  offLabel: string;
}) {
  const on = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[flag] === "on",
    () => false,
  );

  useEffect(() => {
    applyFlag(flag, readStoredFlag(flag));
  }, [flag]);

  function toggle() {
    applyFlag(flag, !on);
    try {
      localStorage.setItem(storageKey(flag), on ? "off" : "on");
    } catch {
      // Valget huskes bare ikke når lagring er blokkert.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className="mode-toggle-surface rounded-full border border-rose/30 bg-white/40 px-4 py-2 text-sm font-medium text-rose backdrop-blur transition-colors hover:border-apricot focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apricot"
    >
      {on ? onLabel : offLabel}
    </button>
  );
}

export function ModeToggle() {
  return (
    <FlagToggle flag="dark" onLabel="☀️ Normal mode" offLabel="🌙 Dark mode" />
  );
}

export function DramaticToggle() {
  return (
    <FlagToggle
      flag="dramatic"
      onLabel="😌 Calm mode"
      offLabel="🎭 Dramatic mode"
    />
  );
}
