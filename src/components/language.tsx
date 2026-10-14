"use client";

import { useEffect, useSyncExternalStore } from "react";

export type Language = "no" | "en";

const STORAGE_KEY = "nome-lang";
const LANG_EVENT = "nome-lang-change";

function readStoredLanguage(): Language {
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "no";
  } catch {
    return "no";
  }
}

function applyLanguage(lang: Language) {
  document.documentElement.lang = lang === "en" ? "en" : "nb";
  document.documentElement.dataset.lang = lang;
  window.dispatchEvent(new Event(LANG_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(LANG_EVENT, onChange);
  return () => window.removeEventListener(LANG_EVENT, onChange);
}

function getSnapshot(): Language {
  return document.documentElement.dataset.lang === "en" ? "en" : "no";
}

/** Gjeldende språk; norsk til nettleseren har lest det lagrede valget. */
export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, () => "no" as const);

  function setLanguage(next: Language) {
    applyLanguage(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Valget huskes bare ikke når lagring er blokkert.
    }
  }

  return {
    lang,
    setLanguage,
    t: (no: string, en: string) => (lang === "en" ? en : no),
  };
}

/** Henter lagret språk ved oppstart. Rendres én gang, i layouten. */
export function LanguageInit() {
  useEffect(() => {
    applyLanguage(readStoredLanguage());
  }, []);
  return null;
}

/** Tekst på norsk eller engelsk; kan brukes fra både server- og klientkomponenter. */
export function T({ no, en }: { no: string; en: string }) {
  const { t } = useLanguage();
  return t(no, en);
}
