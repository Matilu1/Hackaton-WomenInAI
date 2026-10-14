"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "nome-dramatic-mode";

type DramaticModeContextValue = {
  dramatic: boolean;
  setDramatic: (value: boolean) => void;
};

const DramaticModeContext = createContext<DramaticModeContextValue | null>(
  null,
);

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function getServerSnapshot() {
  return false;
}

function applyDramaticAttribute(enabled: boolean) {
  document.documentElement.dataset.dramatic = enabled ? "on" : "off";
}

export function DramaticModeProvider({ children }: { children: ReactNode }) {
  const dramatic = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    applyDramaticAttribute(dramatic);
  }, [dramatic]);

  const setDramatic = useCallback((value: boolean) => {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    applyDramaticAttribute(value);
    emit();
  }, []);

  return (
    <DramaticModeContext.Provider value={{ dramatic, setDramatic }}>
      {children}
    </DramaticModeContext.Provider>
  );
}

export function useDramaticMode() {
  const ctx = useContext(DramaticModeContext);
  if (!ctx) {
    throw new Error("useDramaticMode must be used within DramaticModeProvider");
  }
  return ctx;
}
