import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type AppLocale } from "./config";

const STORAGE_KEY = "locale";

export function isSupportedLocale(value: string): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(value?: string): AppLocale {
  if (value && isSupportedLocale(value)) {
    return value;
  }

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isSupportedLocale(stored)) {
      return stored;
    }

    const browserLocales = window.navigator.languages ?? [
      window.navigator.language,
    ];
    for (const candidate of browserLocales) {
      const base = candidate.toLowerCase().split("-")[0];
      if (isSupportedLocale(base)) {
        return base;
      }
    }
  }

  return DEFAULT_LOCALE;
}

export function persistLocale(locale: AppLocale) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }
}
